import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async (token) => {
        try {
            const response = await fetch("http://localhost:5001/api/profile", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const profileData = await response.json();
                setUser({ token, ...profileData });
            } else {
                console.error("Failed to fetch profile");
                logout();
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchUserProfile(token);
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (token) => {
        localStorage.setItem("token", token);
        await fetchUserProfile(token);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const updateProfile = async (updatedData) => {
        if (!user?.token) return;

        try {
            const response = await fetch("http://localhost:5001/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                const updatedProfile = await response.json();
                setUser(prev => ({ ...prev, ...updatedProfile }));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error updating profile:", error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            updateProfile,
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
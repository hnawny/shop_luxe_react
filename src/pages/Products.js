import React, { useEffect, useState } from "react";
import { Search, Package, ShoppingBag, X } from "lucide-react";
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [addingToCart, setAddingToCart] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5001/api/products", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError("ไม่สามารถโหลดข้อมูลสินค้าได้");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product, e) => {
    if (product.Stock === 0) return;
    e.stopPropagation();
    setAddingToCart(product.ProductID);
    
    try {
      const userID = localStorage.getItem('userID');
      
      const response = await fetch('http://localhost:5001/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ProductID: product.ProductID,
          Quantity: 1,
          UserID: userID
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to add product to cart');
      }
  
      const result = await response.json();
      setIsOpen(false);
      console.log('Product added to cart:', result);
      
      window.dispatchEvent(new Event('cartUpdated'));
      
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setTimeout(() => {
        setAddingToCart(null);
      }, 1000);
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const filteredProducts = products.filter(product =>
    product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-[40vh] mb-16">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 bg-[url('https://cdn.media.amplience.net/i/pandora/Q125_A_Ecomm_BuildABracelet_STEPS_Header_D-US?&fmt=auto&qlt=80')] bg-cover bg-center" />
        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="text-center px-6">
            <h2 className="text-4xl md:text-6xl text-white mb-4">
              คอลเลคชั่นพิเศษ
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              ค้นพบความพิเศษที่ถูกรังสรรค์มาเพื่อคุณ
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 bg-zinc-900 border border-zinc-800 text-white 
                     placeholder-gray-500 focus:outline-none focus:ring-2 
                     focus:ring-white/20 transition duration-300"
          />
          <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 
                           text-gray-500 w-5 h-5" />
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="w-16 h-16 border-t-2 border-white border-opacity-20 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-zinc-900 border border-zinc-800 p-8 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 p-16 text-center">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">ไม่พบสินค้า</h3>
            <p className="text-gray-400">
              {searchTerm ? "ไม่พบสินค้าที่คุณค้นหา" : "ขออภัย ยังไม่มีสินค้าในขณะนี้"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.ProductID}
                onClick={() => openModal(product)}
                className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 
                         transition duration-500 cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  <div className="aspect-[4/5] bg-zinc-800">
                    <img
                      src={product.ImageURL}
                      alt={product.ProductName}
                      className={`w-full h-full object-cover ${product.Stock === 0 ? 'opacity-50' : ''}`}
                    />
                  </div>
                  {product.Stock === 0 && (
                    <div className="absolute top-4 right-4 bg-black/80 px-4 py-2 rounded">
                      <span className="text-white font-medium">สินค้าหมด</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 
                               transition duration-500 flex items-center justify-center">
                    <button className="px-8 py-3 bg-white text-black opacity-0 group-hover:opacity-100 
                                   transform translate-y-4 group-hover:translate-y-0 
                                   transition duration-500">
                      ดูรายละเอียด
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl text-white mb-2">{product.ProductName}</h3>
                  <p className="text-2xl text-white mb-4">฿{product.Price.toLocaleString()}</p>
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={addingToCart === product.ProductID || product.Stock === 0}
                    className={`w-full px-6 py-3 transition duration-300 flex items-center justify-center gap-2 
                             disabled:cursor-not-allowed
                             ${product.Stock === 0 
                               ? 'bg-zinc-800 text-zinc-500 disabled:opacity-100' 
                               : 'bg-white text-black hover:bg-gray-100 disabled:opacity-50'}`}
                  >
                    {addingToCart === product.ProductID ? (
                      <div className="w-5 h-5 border-t-2 border-black border-opacity-20 rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        {product.Stock === 0 ? 'สินค้าหมด' : 'เพิ่มลงตะกร้า'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-12"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-12"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden bg-zinc-900 
                                      text-white p-6 text-left align-middle shadow-xl transition-all">
                  {selectedProduct && (
                    <>
                      <div className="absolute right-6 top-6">
                        <button
                          onClick={closeModal}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="relative aspect-square bg-zinc-800 rounded-lg overflow-hidden">
                          <img
                            src={selectedProduct.ImageURL}
                            alt={selectedProduct.ProductName}
                            className={`w-full h-full object-cover ${selectedProduct.Stock === 0 ? 'opacity-50' : ''}`}
                          />
                          {selectedProduct.Stock === 0 && (
                            <div className="absolute top-4 right-4 bg-black/80 px-4 py-2 rounded">
                              <span className="text-white font-medium">สินค้าหมด</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <Dialog.Title
                            as="h3"
                            className="text-2xl mb-4"
                          >
                            {selectedProduct.ProductName}
                          </Dialog.Title>
                          
                          <p className="text-3xl mb-6">
                            ฿{selectedProduct.Price.toLocaleString()}
                          </p>
                          
                          <div className="mb-6">
                            <h4 className="text-lg mb-2">รายละเอียดสินค้า</h4>
                            <p className="text-gray-400">
                              {selectedProduct.Description}
                            </p>
                          </div>
                          
                          <div className="mb-6">
                            <h4 className="text-lg mb-2">สถานะสินค้า</h4>
                            <p className={`${selectedProduct.Stock === 0 ? 'text-red-400' : 'text-gray-400'}`}>
                              {selectedProduct.Stock === 0 
                                ? 'สินค้าหมด' 
                                : `มีสินค้าในคลัง: ${selectedProduct.Stock} ชิ้น`}
                            </p>
                          </div>

                          <button
                            onClick={(e) => handleAddToCart(selectedProduct, e)}
                            disabled={addingToCart === selectedProduct.ProductID || selectedProduct.Stock === 0}
                            className={`w-full px-6 py-4 transition duration-300 flex items-center justify-center gap-2 
                                     disabled:cursor-not-allowed
                                     ${selectedProduct.Stock === 0 
                                       ? 'bg-zinc-800 text-zinc-500 disabled:opacity-100' 
                                       : 'bg-white text-black hover:bg-gray-100 disabled:opacity-50'}`}
                          >
                            {addingToCart === selectedProduct.ProductID ? (
                              <div className="w-5 h-5 border-t-2 border-black border-opacity-20 rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <ShoppingBag className="w-5 h-5" />
                                {selectedProduct.Stock === 0 ? 'สินค้าหมด' : 'เพิ่มลงตะกร้า'}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>


      {/* Newsletter Section */}
      <div className="bg-zinc-900 py-32 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="text-3xl font-serif text-white mb-6">ติดตามข่าวสารจากเรา</h3>
          <p className="text-gray-400 mb-10">
            รับข้อมูลคอลเลคชั่นใหม่และสิทธิพิเศษก่อนใคร
          </p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="กรอกอีเมลของคุณ" 
              className="flex-1 px-6 py-4 bg-black border border-zinc-800 text-white 
                       focus:ring-2 focus:ring-white/20 focus:outline-none"
            />
            <button className="px-8 py-4 bg-white text-black hover:bg-gray-100 
                           transition duration-300">
              ลงทะเบียน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
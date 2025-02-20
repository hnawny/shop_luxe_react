import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-black">
      
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0 bg-[url('https://cdn.media.amplience.net/i/pandora/Q125_eStore_Valentines_ExplodingBox_02_Extended?fmt=auto&qlt=80&crop={19.49%},{25.75%},{69.12%},{41.9%}')] bg-cover bg-center" />
        
        {/* Hero Content */}
        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="text-center px-6">
            <h2 className="text-5xl md:text-7xl text-white mb-8">
              ความหรูหราที่เป็นคุณ
            </h2>
            <p className="text-xl text-gray-100 max-w-2xl mx-auto mb-12">
              สัมผัสประสบการณ์แห่งความหรูหรา ที่ได้รับการออกแบบมาเพื่อคุณโดยเฉพาะ
            </p>
            <button className="px-12 py-4 text-lg bg-white text-black hover:bg-gray-100 transition duration-300">
              ค้นพบเพิ่มเติม
            </button>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="py-32 px-6 bg-black text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl mb-8">ยินดีต้อนรับสู่โลกแห่งความหรูหรา</h3>
          <p className="text-gray-300 leading-relaxed mb-12">
            ที่ซึ่งทุกรายละเอียดได้รับการใส่ใจ และทุกช่วงเวลาคือโอกาสที่จะได้สัมผัสประสบการณ์พิเศษ ความมุ่งมั่นของเราสะท้อนผ่านทุกสิ่งที่เราทำ
          </p>
          <div className="flex justify-center">
            <button className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-black transition duration-300">
              อ่านเพิ่มเติม
            </button>
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="relative h-[80vh]">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 bg-[url('https://cdn.media.amplience.net/i/pandora/Q125_eStore_A_Valentines_Giftset_04?fmt=auto&qlt=80&crop={0%},{31.03%},{99.59%},{53.41%}')] bg-cover bg-center" />
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-xl">
              <h3 className="text-4xl md:text-5xl text-white mb-8">
                สัมผัสความพิเศษ
              </h3>
              <p className="text-lg text-gray-100 mb-12">
                ดื่มด่ำกับโลกที่ความหรูหราผสานกับนวัตกรรม ที่ซึ่งทุกการมาเยือนกลายเป็นการเดินทางที่น่าจดจำ
              </p>
              <button className="px-8 py-3 bg-white text-black hover:bg-gray-100 transition duration-300">
                จองคิวเพื่อเข้าชม
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="py-32 px-6 bg-zinc-900">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="text-3xl font-serif text-white mb-6">ร่วมเป็นส่วนหนึ่งกับเรา</h3>
          <p className="text-gray-300 mb-10">
            ลงทะเบียนเพื่อรับข่าวสารพิเศษและเชิญชวนเข้าร่วมงานอีเวนต์สุดพิเศษของเรา
          </p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="กรอกอีเมลของคุณ" 
              className="flex-1 px-6 py-4 bg-black border border-gray-800 text-white focus:ring-2 focus:ring-gray-700 focus:outline-none"
            />
            <button className="px-8 py-4 bg-white text-black hover:bg-gray-100 transition duration-300">
              ลงทะเบียน
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-20 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h4 className="text-2xl font-serif mb-8">LUXE</h4>
          <div className="flex justify-center space-x-8 mb-8">
            <a href="#" className="text-gray-400 hover:text-white transition">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Facebook</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Line</a>
          </div>
          <p className="text-gray-400">© 2025 LUXE. สงวนลิขสิทธิ์</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
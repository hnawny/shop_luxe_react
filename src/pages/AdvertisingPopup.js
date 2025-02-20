import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AdvertisingPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // เช็คว่าเคยแสดง popup วันนี้หรือยัง
    const lastShown = localStorage.getItem('adLastShown');
    const today = new Date().toDateString();

    if (lastShown !== today) {
      // ถ้ายังไม่เคยแสดงวันนี้ ให้แสดงหลังจาก 2 วินาที
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('adLastShown', today);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* ปุ่มปิด */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* หัวข้อ */}
                <Dialog.Title
                  as="h3"
                  className="text-xl font-medium leading-6 text-gray-900 mb-4"
                >
                  โปรโมชั่นพิเศษ! 🎉
                </Dialog.Title>

                {/* รูปภาพโฆษณา */}
                <div className="relative aspect-video mb-4 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src="https://www.pandora.co.th/media/wysiwyg/Q125-COLLABS-DISNEY-MMV-SOME-META-PRODUCT-IMAGE-03-LOGO-SQUARE.jpg"
                    alt="Advertisement"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* เนื้อหา */}
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Love is in the air
                    Get carried away this Valentine's Day with
                    the ultimate icons of love, Disney's
                    Mickey and Minnie Mouse.
                  </p>
                </div>

                {/* ปุ่มกดไปยังหน้าโปรโมชั่น */}
                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md bg-black px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                    onClick={() => {
                      setIsOpen(false);
                      // เพิ่ม navigation ไปยังหน้าโปรโมชั่น
                      // navigate('/promotion');
                    }}
                  >
                    ดูโปรโมชั่นทั้งหมด
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AdvertisingPopup;
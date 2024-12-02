import React, { useState } from "react";

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);

  // بيانات الإشعارات (تجريبية - يمكنك استبدالها بـ API لاحقًا)
  const notifications = [
    { id: 1, service: "Winch Service", type: "Mechanic" },
    { id: 2, service: "Repair Service", type: "Driver" },
    { id: 3, service: "Car Towing", type: "Mechanic" },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* أيقونة الإشعارات */}
      <button
        className="fixed bottom-4 right-4 bg-[#4840A3] text-white p-4 rounded-full shadow-lg hover:bg-[#EAB95C]"
        onClick={toggleSidebar}
      >
        Notifications
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 ${
          isOpen ? "right-0" : "-right-full"
        } h-full w-full md:w-1/3 bg-white shadow-lg transition-all duration-300 z-50`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold text-[#4840A3]">Notifications</h2>

          {/* قائمة الإشعارات */}
          <div className="mt-4 flex flex-col gap-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="border border-gray-300 p-4 rounded-lg shadow-sm"
              >
                <h3 className="text-lg font-bold text-[#4840A3]">
                  {notification.service}
                </h3>
                <p className="text-gray-600">Type: {notification.type}</p>

                <div className="flex justify-between mt-4">
                  <button className="bg-[#EAB95C] text-white px-4 py-2 rounded hover:bg-[#c59b4b]">
                    Locate
                  </button>
                  <button className="bg-[#4840A3] text-white px-4 py-2 rounded hover:bg-[#3c368c]">
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* زر الإغلاق */}
        <button
          className="absolute top-4 right-4 text-[#4840A3] font-bold"
          onClick={toggleSidebar}
        >
          Close
        </button>
      </div>
    </>
  );
}

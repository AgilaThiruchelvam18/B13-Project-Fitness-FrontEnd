import { useEffect } from 'react';

export default function Modal({ isCustomerOpen, onClose, children }) {
  useEffect(() => {
    if (isCustomerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => (document.body.style.overflow = 'unset');
  }, [isCustomerOpen]);

  if (!isCustomerOpen) return isCustomerOpen;

  return (
    <div className="w-full fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg relative">
        <button className="absolute top-2 right-2" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
}


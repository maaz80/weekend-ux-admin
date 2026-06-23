import { createContext, useContext, useState, useCallback } from "react";
import { HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineInformationCircle, HiX } from "react-icons/hi";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
     const [toasts, setToasts] = useState([]);

     const showToast = useCallback((message, type = "success", duration = 4000) => {
          const id = Date.now() + Math.random().toString(36).substr(2, 9);
          setToasts((prev) => [...prev, { id, message, type }]);

          setTimeout(() => {
               setToasts((prev) => prev.filter((t) => t.id !== id));
          }, duration);
     }, []);

     const removeToast = useCallback((id) => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
     }, []);

     return (
          <ToastContext.Provider value={{ showToast }}>
               {children}
               {/* Toast Container Stack */}
               <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
                    {toasts.map((toast) => {
                         let bg = "bg-white border-green-200 text-gray-800 shadow-md shadow-gray-100";
                         let icon = <HiOutlineCheckCircle className="w-5 h-5 text-green-500 shrink-0" />;
                         
                         if (toast.type === "error" || toast.type === "danger") {
                              bg = "bg-white border-red-200 text-gray-800 shadow-md shadow-gray-100";
                              icon = <HiOutlineExclamationCircle className="w-5 h-5 text-red-500 shrink-0" />;
                         } else if (toast.type === "info") {
                              bg = "bg-white border-blue-200 text-gray-800 shadow-md shadow-gray-100";
                              icon = <HiOutlineInformationCircle className="w-5 h-5 text-blue-500 shrink-0" />;
                         }

                         return (
                              <div
                                   key={toast.id}
                                   className={`flex items-start justify-between gap-3 border rounded-xl p-4 pointer-events-auto transition-all duration-300 transform translate-y-0 opacity-100 animate-slide-in ${bg}`}
                              >
                                   <div className="flex items-start gap-3">
                                        {icon}
                                        <p className="text-xs font-semibold text-gray-700 mt-0.5 leading-snug">{toast.message}</p>
                                   </div>
                                   <button
                                        type="button"
                                        onClick={() => removeToast(toast.id)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 cursor-pointer"
                                   >
                                        <HiX className="w-4 h-4" />
                                   </button>
                              </div>
                         );
                    })}
               </div>
          </ToastContext.Provider>
     );
}

export function useToast() {
     const context = useContext(ToastContext);
     if (!context) {
          throw new Error("useToast must be used within a ToastProvider");
     }
     return context;
}

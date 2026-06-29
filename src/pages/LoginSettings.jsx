import { useEffect, useState } from "react";
import { HiOutlineSave, HiOutlineUpload, HiOutlinePhotograph } from "react-icons/hi";
import Breadcrumb from "../components/BreadCrumb";
import { getAdminToken } from "../utils/auth";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export default function LoginSettings() {
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [currentImageUrl, setCurrentImageUrl] = useState("");
     const [imageFile, setImageFile] = useState(null);
     const [toast, setToast] = useState({ show: false, message: "" });

     const displayToast = (message) => {
          setToast({ show: true, message });
          setTimeout(() => setToast({ show: false, message: "" }), 3000);
     };

     const fetchLoginSettings = async () => {
          try {
               setLoading(true);
               const res = await fetch(`${API_URL}/navbar`);
               if (res.ok) {
                    const data = await res.json();
                    if (data) {
                         setCurrentImageUrl(data.authDecorativeImage || "");
                    }
               }
          } catch (err) {
               console.error("Error fetching login settings:", err);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchLoginSettings();
     }, []);

     const handleSave = async (e) => {
          if (e) e.preventDefault();
          if (!imageFile && !currentImageUrl) {
               displayToast("Please choose an image to upload first.");
               return;
          }

          try {
               setSaving(true);
               const formData = new FormData();
               
               if (imageFile) {
                    formData.append("authDecorativeImage", imageFile);
               } else {
                    formData.append("authDecorativeImage", currentImageUrl);
               }

               const res = await fetch(`${API_URL}/navbar`, {
                    method: "PUT",
                    headers: {
                         "Authorization": `Bearer ${getAdminToken()}`
                    },
                    body: formData
               });

               if (res.ok) {
                    displayToast("Login Modal Decorative Image Saved Successfully!");
                    setImageFile(null);
                    fetchLoginSettings();
               } else {
                    const data = await res.json().catch(() => ({}));
                    displayToast(data.error || "Failed to save login settings.");
               }
          } catch (err) {
               console.error("Error saving login settings:", err);
               displayToast("Server error occurred.");
          } finally {
               setSaving(false);
          }
     };

     const labelClass = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5";

     return (
          <div className="bg-gray-50/50 min-h-screen pb-12 font-sans">
               <Breadcrumb />

               <div className="max-w-4xl mx-auto px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
                         <div>
                              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User Login Modal Settings</h1>
                              <p className="text-sm text-gray-500 mt-1">
                                   Customize the decorative illustration image shown on the left panel of the login/signup modal.
                              </p>
                         </div>

                         <button
                              onClick={handleSave}
                              disabled={saving || loading}
                              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer disabled:cursor-not-allowed shrink-0"
                         >
                              <HiOutlineSave className="w-4 h-4" />
                              <span>{saving ? "Saving..." : "Save Settings"}</span>
                         </button>
                    </div>

                    {loading ? (
                         <div className="h-64 rounded-2xl border border-gray-200 bg-white flex flex-col items-center justify-center text-gray-400 shadow-sm">
                              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                              <span className="text-sm font-medium">Loading Settings...</span>
                         </div>
                    ) : (
                         <div className="space-y-6">
                              {/* Decorative Image Settings Card */}
                              <div className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200/50 space-y-5">
                                   <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Modal Illustration</h2>
                                   
                                   <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                             <label className={labelClass}>Left Panel Decorative Image</label>
                                             <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Recommended: 800 x 1200 px (2:3)</span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                             {/* Left Side: Upload zone */}
                                             <div className="space-y-4">
                                                  <div className="border border-dashed border-gray-300 hover:border-orange-500 rounded-2xl px-6 py-10 bg-gray-50/50 hover:bg-orange-50/5 transition flex flex-col items-center justify-center gap-3 cursor-pointer text-center relative group min-h-60">
                                                       <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => setImageFile(e.target.files[0])}
                                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                                       />
                                                       <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition duration-300">
                                                            <HiOutlineUpload className="w-6 h-6" />
                                                       </div>
                                                       <div className="space-y-1">
                                                            <p className="text-sm font-bold text-gray-700 font-sans">
                                                                 {imageFile ? imageFile.name : "Drag & drop or browse"}
                                                            </p>
                                                            <p className="text-xs text-gray-400 leading-normal font-sans px-4">
                                                                 Supports PNG, JPG, JPEG, and WEBP. Recommended size: 800 x 1200 px (Portrait 2:3 aspect ratio).
                                                            </p>
                                                       </div>
                                                  </div>
                                                  
                                                  {imageFile && (
                                                       <div className="flex items-center justify-between bg-orange-50/50 border border-orange-100 px-4 py-2.5 rounded-xl">
                                                            <span className="text-xs text-orange-700 font-semibold truncate max-w-[200px]">{imageFile.name}</span>
                                                            <button 
                                                                 type="button" 
                                                                 onClick={() => setImageFile(null)}
                                                                 className="text-xs text-red-600 hover:text-red-750 font-bold cursor-pointer"
                                                            >
                                                                 Clear Choice
                                                            </button>
                                                       </div>
                                                  )}
                                             </div>

                                             {/* Right Side: Preview */}
                                             <div className="space-y-3">
                                                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Live Preview</span>
                                                  <div className="h-72 w-full md:w-56 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center p-3 overflow-hidden shadow-inner relative group mx-auto md:mx-0">
                                                       {imageFile ? (
                                                            <img
                                                                 src={URL.createObjectURL(imageFile)}
                                                                 className="max-h-full max-w-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                                                                 alt="New upload preview"
                                                            />
                                                       ) : currentImageUrl ? (
                                                            <img
                                                                 src={currentImageUrl}
                                                                 className="max-h-full max-w-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                                                                 alt="Current modal illustration"
                                                            />
                                                       ) : (
                                                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                                                 <HiOutlinePhotograph className="w-8 h-8" />
                                                                 <span className="text-xs font-medium font-sans">Using default image</span>
                                                            </div>
                                                       )}
                                                  </div>
                                                  <p className="text-[10px] text-gray-400 leading-relaxed font-sans max-w-xs text-center md:text-left">
                                                       This preview shows how the image will fit on the left panel of the modal. By default, the system uses a fallback design image.
                                                  </p>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    )}

                    {/* Toast Notification */}
                    <div className={`fixed bottom-6 right-6 flex items-center gap-2.5 bg-gray-900 border border-gray-800 text-white px-5 py-3.5 rounded-xl shadow-2xl transform transition-all duration-300 z-50 ${toast.show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}>
                         <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                         <span className="font-semibold text-xs">{toast.message}</span>
                    </div>
               </div>
          </div>
     );
}

import { useEffect, useState } from "react";
import { HiOutlineSave, HiOutlineUpload, HiOutlinePhotograph } from "react-icons/hi";
import Breadcrumb from "../components/BreadCrumb";
import { getAdminToken } from "../utils/auth";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export default function NavbarManager() {
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [toast, setToast] = useState({ show: false, message: "" });

     // State fields matching Kreeya's Navbar schema
     const [logoUrl, setLogoUrl] = useState("");
     const [logoAlt, setLogoAlt] = useState("");
     const [logoFile, setLogoFile] = useState(null);
     const [moreTitle, setMoreTitle] = useState("More");
     const [moreItems, setMoreItems] = useState([]);
     const [searchPlaceholder, setSearchPlaceholder] = useState("Search courses...");
     const [dropdownName, setDropdownName] = useState("Courses");
     const [loginButtonName, setLoginButtonName] = useState("Sign In");

     const displayToast = (message) => {
          setToast({ show: true, message });
          setTimeout(() => setToast({ show: false, message: "" }), 3000);
     };

     const fetchNavbarData = async () => {
          try {
               setLoading(true);
               const res = await fetch(`${API_URL}/navbar`);
               if (res.ok) {
                    const data = await res.json();
                    if (data) {
                         setLogoUrl(data.logo?.image || "");
                         setLogoAlt(data.logo?.alt || "Kreeya Logo");
                         const moreData = data.moreItems || {};
                         setMoreTitle(moreData.title || "More");
                         setMoreItems(moreData.items || []);
                         setSearchPlaceholder(data.searchPlaceholder || "Search courses...");
                         setDropdownName(data.dropdownName || "Courses");
                         setLoginButtonName(data.loginButtonName || "Sign In");
                    }
               }
          } catch (err) {
               console.error("Error fetching navbar data:", err);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchNavbarData();
     }, []);

     const handleAddMoreItem = () => {
          setMoreItems([...moreItems, { title: "", link: "" }]);
     };

     const handleRemoveMoreItem = (index) => {
          setMoreItems(moreItems.filter((_, i) => i !== index));
     };

     const handleUpdateMoreItem = (index, field, value) => {
          const updated = [...moreItems];
          updated[index][field] = value;
          setMoreItems(updated);
     };

     const handleSave = async (e) => {
          if (e) e.preventDefault();
          try {
               setSaving(true);
               
               const formData = new FormData();
               formData.append("moreItems", JSON.stringify({ title: moreTitle, items: moreItems }));
               formData.append("searchPlaceholder", searchPlaceholder);
               formData.append("dropdownName", dropdownName);
               formData.append("loginButtonName", loginButtonName);
               formData.append("logoAlt", logoAlt);

               if (logoFile) {
                    formData.append("logoImage", logoFile);
               }

               const res = await fetch(`${API_URL}/navbar`, {
                    method: "PUT",
                    headers: {
                         "Authorization": `Bearer ${getAdminToken()}`
                    },
                    body: formData
               });

               if (res.ok) {
                    displayToast("Navbar Settings Saved Successfully!");
                    setLogoFile(null);
                    fetchNavbarData();
               } else {
                    const data = await res.json().catch(() => ({}));
                    displayToast(data.error || "Failed to save Navbar settings.");
               }
          } catch (err) {
               console.error("Error saving navbar data:", err);
               displayToast("Server error occurred.");
          } finally {
               setSaving(false);
          }
     };

     const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all duration-200";
     const labelClass = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5";

     return (
          <div className="bg-gray-50/50 min-h-screen pb-12 font-sans">
               <Breadcrumb />

               <div className="max-w-4xl mx-auto px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
                         <div>
                              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Navbar Settings</h1>
                              <p className="text-sm text-gray-500 mt-1">
                                   Configure site navigation header logo branding, search placeholder, and action buttons.
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
                              <span className="text-sm font-medium">Loading Navbar Data...</span>
                         </div>
                    ) : (
                         <div className="space-y-6">
                              {/* Branding Card */}
                              <div className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200/50 space-y-5">
                                   <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Header Branding</h2>
                                   
                                   <div className="space-y-1.5">
                                        <label className={labelClass}>Logo Image</label>
                                        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                                             {/* Logo Preview */}
                                             <div className="h-16 w-36 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center p-2 overflow-hidden shrink-0">
                                                  {logoFile ? (
                                                       <img
                                                            src={URL.createObjectURL(logoFile)}
                                                            className="max-h-full max-w-full object-contain"
                                                            alt="Logo preview"
                                                       />
                                                  ) : logoUrl ? (
                                                       <img
                                                            src={logoUrl}
                                                            className="max-h-full max-w-full object-contain"
                                                            alt="Current Logo"
                                                       />
                                                  ) : (
                                                       <div className="flex flex-col items-center gap-1 text-gray-400">
                                                            <HiOutlinePhotograph className="w-5 h-5" />
                                                            <span className="text-[10px] font-medium font-sans">No Logo Image</span>
                                                       </div>
                                                  )}
                                             </div>
                                             
                                             <div className="flex-1 w-full relative">
                                                  <div className="border border-dashed border-gray-300 hover:border-orange-500 rounded-xl px-4 py-3 bg-gray-50/50 hover:bg-orange-50/10 transition flex items-center justify-center gap-2 cursor-pointer text-center relative group min-h-16">
                                                       <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => setLogoFile(e.target.files[0])}
                                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                                       />
                                                       <div className="flex items-center gap-2 text-gray-500 group-hover:text-orange-500 transition">
                                                            <HiOutlineUpload className="w-4 h-4" />
                                                            <span className="text-xs font-semibold font-sans">
                                                                 {logoFile ? logoFile.name : "Choose logo image..."}
                                                            </span>
                                                       </div>
                                                  </div>
                                                  <p className="text-[10px] text-gray-400 mt-1 leading-normal font-sans">
                                                       Upload your brand's header logo. Supports PNG, JPG, JPEG, and WEBP. Leave empty to keep using the current logo.
                                                  </p>
                                             </div>
                                        </div>
                                   </div>

                                   <div className="space-y-1.5">
                                        <label className={labelClass}>Logo Alt Text</label>
                                        <input
                                             type="text"
                                             value={logoAlt}
                                             onChange={(e) => setLogoAlt(e.target.value)}
                                             className={inputClass}
                                             placeholder="e.g. Kreeya Logo"
                                             required
                                        />
                                   </div>
                              </div>

                              {/* Navigation Controls Card */}
                              <div className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200/50 space-y-4">
                                   <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Navigation Controls</h2>
                                   
                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Search Box Placeholder</label>
                                             <input
                                                  type="text"
                                                  value={searchPlaceholder}
                                                  onChange={(e) => setSearchPlaceholder(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. Search courses..."
                                                  required
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Dropdown Name</label>
                                             <input
                                                  type="text"
                                                  value={dropdownName}
                                                  onChange={(e) => setDropdownName(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. Courses"
                                                  required
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Sign In Button Text</label>
                                             <input
                                                  type="text"
                                                  value={loginButtonName}
                                                  onChange={(e) => setLoginButtonName(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. Sign In"
                                                  required
                                             />
                                        </div>
                                   </div>
                              </div>

                              {/* More Menu Dropdown Items Card */}
                              <div className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200/50 space-y-4">
                                   <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                        <div>
                                             <h2 className="text-base font-bold text-gray-900">More Dropdown Links</h2>
                                             <p className="text-xs text-gray-400 mt-0.5">Customize links and dropdown trigger name in the header navbar.</p>
                                        </div>
                                        <button
                                             type="button"
                                             onClick={handleAddMoreItem}
                                             className="inline-flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-orange-200 transition-all duration-200 cursor-pointer shrink-0"
                                        >
                                             + Add Link
                                        </button>
                                   </div>
                                   
                                   {/* Dropdown Label Input */}
                                   <div className="space-y-1.5 max-w-xs">
                                        <label className={labelClass}>Dropdown Name / Title</label>
                                        <input
                                             type="text"
                                             value={moreTitle}
                                             onChange={(e) => setMoreTitle(e.target.value)}
                                             className={inputClass}
                                             placeholder="e.g. More"
                                             required
                                        />
                                   </div>

                                   <div className="border-t border-gray-100 pt-3">
                                        <label className={labelClass}>Dropdown Items</label>
                                   </div>
                                   
                                   {moreItems.length === 0 ? (
                                        <p className="text-sm text-gray-400 text-center py-4">No custom links added yet. Click "+ Add Link" to create one.</p>
                                   ) : (
                                        <div className="space-y-3">
                                             {moreItems.map((item, index) => (
                                                  <div key={index} className="flex flex-col sm:flex-row gap-3 items-end sm:items-center bg-gray-50/50 p-4 rounded-xl border border-gray-250/50">
                                                       <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            <div className="space-y-1">
                                                                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Link Title</label>
                                                                 <input
                                                                      type="text"
                                                                      value={item.title}
                                                                      onChange={(e) => handleUpdateMoreItem(index, "title", e.target.value)}
                                                                      className={inputClass}
                                                                      placeholder="e.g. AI Tools"
                                                                      required
                                                                 />
                                                            </div>
                                                            <div className="space-y-1">
                                                                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Link URL</label>
                                                                 <input
                                                                      type="text"
                                                                      value={item.link}
                                                                      onChange={(e) => handleUpdateMoreItem(index, "link", e.target.value)}
                                                                      className={inputClass}
                                                                      placeholder="e.g. /ai-tools or https://..."
                                                                      required
                                                                 />
                                                            </div>
                                                       </div>
                                                       <button
                                                            type="button"
                                                            onClick={() => handleRemoveMoreItem(index)}
                                                            className="px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-100 transition duration-200 text-xs font-semibold shrink-0 cursor-pointer sm:mt-5"
                                                       >
                                                            Remove
                                                       </button>
                                                  </div>
                                             ))}
                                        </div>
                                   )}
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

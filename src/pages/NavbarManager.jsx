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
     const [moreDropdownItems, setMoreDropdownItems] = useState([]);
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
                         setMoreDropdownItems(moreData.dropdown_items || []);
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

     const handleAddCategory = () => {
          setMoreDropdownItems([...moreDropdownItems, { title: "", items: [] }]);
     };

     const handleRemoveCategory = (catIndex) => {
          setMoreDropdownItems(moreDropdownItems.filter((_, i) => i !== catIndex));
     };

     const handleUpdateCategoryTitle = (catIndex, value) => {
          const updated = [...moreDropdownItems];
          updated[catIndex].title = value;
          setMoreDropdownItems(updated);
     };

     const handleAddSubItem = (catIndex) => {
          const updated = [...moreDropdownItems];
          updated[catIndex].items = [...(updated[catIndex].items || []), { name: "", link: "" }];
          setMoreDropdownItems(updated);
     };

     const handleRemoveSubItem = (catIndex, itemIndex) => {
          const updated = [...moreDropdownItems];
          updated[catIndex].items = updated[catIndex].items.filter((_, i) => i !== itemIndex);
          setMoreDropdownItems(updated);
     };

     const handleUpdateSubItem = (catIndex, itemIndex, field, value) => {
          const updated = [...moreDropdownItems];
          updated[catIndex].items[itemIndex][field] = value;
          setMoreDropdownItems(updated);
     };

     const handleSave = async (e) => {
          if (e) e.preventDefault();
          try {
               setSaving(true);
               
               const formData = new FormData();
               formData.append("moreItems", JSON.stringify({ title: moreTitle, dropdown_items: moreDropdownItems }));
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
                                        <div className="flex items-center justify-between">
                                             <label className={labelClass}>Logo Image</label>
                                             <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Recommended: 300 x 100 px</span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                                             {/* Logo Preview */}
                                             <div className="h-16 w-36 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center p-2 overflow-hidden shrink-0">
                                                  {logoFile ? (
                                                       <img
                                                            src={URL.createObjectURL(logoFile)}
                                                            className="max-h-full max-w-full object-contain"
                                                            alt="Logo preview"
                                                            onLoad={(e) => URL.revokeObjectURL(e.target.src)}
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
                                                       Upload your brand's header logo. Recommended size: 300 x 100 px (aspect ratio 3:1, PNG with transparent background is preferred).
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
                              <div className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200/50 space-y-6">
                                   <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-3">
                                        <div>
                                             <h2 className="text-base font-bold text-gray-900">More Dropdown Mega-Menu</h2>
                                             <p className="text-xs text-gray-400 mt-0.5">Configure up to 4 columns for the dropdown grid. Each column has a title and sub-links.</p>
                                        </div>
                                        <button
                                             type="button"
                                             onClick={handleAddCategory}
                                             disabled={moreDropdownItems.length >= 4}
                                             className="inline-flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 disabled:bg-gray-100 disabled:text-gray-400 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-orange-200 disabled:border-gray-200 transition-all duration-200 cursor-pointer shrink-0 disabled:cursor-not-allowed"
                                        >
                                             + Add Column/Category
                                        </button>
                                   </div>
                                   
                                   {/* Dropdown Label Input */}
                                   <div className="space-y-1.5 max-w-xs">
                                        <label className={labelClass}>Dropdown Menu Label</label>
                                        <input
                                             type="text"
                                             value={moreTitle}
                                             onChange={(e) => setMoreTitle(e.target.value)}
                                             className={inputClass}
                                             placeholder="e.g. More"
                                             required
                                        />
                                   </div>

                                   <div className="space-y-6">
                                        {moreDropdownItems.length === 0 ? (
                                             <p className="text-sm text-gray-400 text-center py-6 border border-dashed border-gray-200 rounded-xl">No columns added yet. Click "+ Add Column/Category" to start creating columns.</p>
                                        ) : (
                                             moreDropdownItems.map((cat, catIdx) => (
                                                  <div key={catIdx} className="bg-gray-50/50 p-5 rounded-2xl border border-gray-200 space-y-4">
                                                       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200/60 pb-3">
                                                            <div className="flex-1 w-full max-w-md">
                                                                 <label className="text-[10px] font-bold text-orange-650 uppercase tracking-wider block mb-1">Column {catIdx + 1} Title</label>
                                                                 <input
                                                                      type="text"
                                                                      value={cat.title}
                                                                      onChange={(e) => handleUpdateCategoryTitle(catIdx, e.target.value)}
                                                                      className={inputClass}
                                                                      placeholder="e.g. AI Tools, Learning Paths..."
                                                                      required
                                                                 />
                                                            </div>
                                                            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-4">
                                                                 <button
                                                                      type="button"
                                                                      onClick={() => handleAddSubItem(catIdx)}
                                                                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 bg-white hover:bg-orange-50/30 text-orange-600 text-xs font-semibold px-3 py-2 rounded-lg border border-orange-200 transition cursor-pointer"
                                                                 >
                                                                      + Add Link
                                                                 </button>
                                                                 <button
                                                                      type="button"
                                                                      onClick={() => handleRemoveCategory(catIdx)}
                                                                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg border border-red-100 transition cursor-pointer"
                                                                 >
                                                                      Delete Column
                                                                 </button>
                                                            </div>
                                                       </div>

                                                       <div className="space-y-2.5">
                                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sub-Links</label>
                                                            {(!cat.items || cat.items.length === 0) ? (
                                                                 <p className="text-xs text-gray-400 italic py-2">No links added to this column yet. Click "+ Add Link" to create one.</p>
                                                            ) : (
                                                                 <div className="grid grid-cols-1 gap-3">
                                                                      {cat.items.map((item, itemIdx) => (
                                                                           <div key={itemIdx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                                                                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                                     <div>
                                                                                          <input
                                                                                               type="text"
                                                                                               value={item.name}
                                                                                               onChange={(e) => handleUpdateSubItem(catIdx, itemIdx, "name", e.target.value)}
                                                                                               className={inputClass}
                                                                                               placeholder="Link Name (e.g. ChatGPT)"
                                                                                               required
                                                                                          />
                                                                                     </div>
                                                                                     <div>
                                                                                          <input
                                                                                               type="text"
                                                                                               value={item.link}
                                                                                               onChange={(e) => handleUpdateSubItem(catIdx, itemIdx, "link", e.target.value)}
                                                                                               className={inputClass}
                                                                                               placeholder="Link URL (e.g. /chatgpt)"
                                                                                               required
                                                                                          />
                                                                                     </div>
                                                                                </div>
                                                                                <button
                                                                                     type="button"
                                                                                     onClick={() => handleRemoveSubItem(catIdx, itemIdx)}
                                                                                     className="p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition border border-gray-200 hover:border-red-100 cursor-pointer"
                                                                                     title="Remove Link"
                                                                                >
                                                                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                                     </svg>
                                                                                </button>
                                                                           </div>
                                                                      ))}
                                                                 </div>
                                                            )}
                                                       </div>
                                                  </div>
                                             ))
                                        )}
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

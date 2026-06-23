import { useEffect, useState } from "react";
import { HiOutlineSave, HiOutlinePlus, HiOutlineTrash, HiOutlineUpload, HiOutlinePhotograph } from "react-icons/hi";
import Breadcrumb from "../components/BreadCrumb";
import { getAdminToken } from "../utils/auth.js";
import { useToast } from "../context/ToastContext";

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export default function ContactData() {
     const { showToast } = useToast();
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [activeTab, setActiveTab] = useState("general");

     // General Settings
     const [pageTitle, setPageTitle] = useState("");

     // Inquiries State
     const [inqTitle, setInqTitle] = useState("");
     const [inqEmail, setInqEmail] = useState("");
     const [inqPhone, setInqPhone] = useState("");

     // Location State
     const [locTitle, setLocTitle] = useState("");
     const [locAddress, setLocAddress] = useState("");

     // Left Section Image State
     const [leftImage, setLeftImage] = useState("");
     const [leftImageFile, setLeftImageFile] = useState(null);

     // Map Image State
     const [mapImage, setMapImage] = useState("");
     const [mapImageFile, setMapImageFile] = useState(null);

     // Social State
     const [socialsTitle, setSocialsTitle] = useState("");
     const [socials, setSocials] = useState([]);

     // Related Blogs State
     const [blogsTitle, setBlogsTitle] = useState("");
     const [blogsStart, setBlogsStart] = useState("");
     const [blogsMid, setBlogsMid] = useState("");
     const [blogsEnd, setBlogsEnd] = useState("");
     const [blogsDesc, setBlogsDesc] = useState("");

     const fetchContactData = async () => {
          try {
               setLoading(true);
               const res = await fetch(`${API_URL}/contact`);
               if (res.ok) {
                    const data = await res.json();
                    
                    setPageTitle(data.title || "");
                    
                    const left = data.leftsection || {};
                    setLeftImage(left.image || "");
                    
                    const inq = left.inquiries || {};
                    setInqTitle(inq.title || "");
                    setInqEmail(inq.email || "");
                    setInqPhone(inq.phone || "");

                    const loc = left.location || {};
                    setLocTitle(loc.title || "");
                    setLocAddress(loc.address || "");

                    const soc = left.social || {};
                    setSocialsTitle(soc.title || "");
                    setSocials(Array.isArray(soc.platform) ? soc.platform : []);

                    setMapImage(data.mapimage || "");

                    const rb = data.relatedBlogs || {};
                    setBlogsTitle(rb.title || "");
                    setBlogsStart(rb.startheading || "");
                    setBlogsMid(rb.midheading || "");
                    setBlogsEnd(rb.endheading || "");
                    setBlogsDesc(rb.description || "");
               }
          } catch (err) {
               console.error("Error fetching contact data:", err);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchContactData();
     }, []);

     const handleSaveAll = async () => {
          try {
               setSaving(true);
               const payload = {
                    title: pageTitle,
                    leftsection: {
                         image: leftImage,
                         inquiries: {
                              title: inqTitle,
                              email: inqEmail,
                              phone: inqPhone
                         },
                         location: {
                              title: locTitle,
                              address: locAddress
                         },
                         social: {
                              title: socialsTitle,
                              platform: socials.filter(s => s.label && s.url)
                         }
                    },
                    mapimage: mapImage,
                    relatedBlogs: {
                         title: blogsTitle,
                         startheading: blogsStart,
                         midheading: blogsMid,
                         endheading: blogsEnd,
                         description: blogsDesc
                    }
               };

               const formData = new FormData();
               formData.append("data", JSON.stringify(payload));

               if (leftImageFile) {
                    formData.append("leftSectionImage", leftImageFile);
               }
               if (mapImageFile) {
                    formData.append("mapImage", mapImageFile);
               }

               const res = await fetch(`${API_URL}/contact`, {
                    method: "PUT",
                    headers: {
                         "Authorization": `Bearer ${getAdminToken()}`
                    },
                    body: formData
               });

               if (res.ok) {
                    showToast("Contact Settings saved successfully!", "success");
                    setLeftImageFile(null);
                    setMapImageFile(null);
                    fetchContactData();
               } else {
                    showToast("Failed to save Contact Settings.", "error");
               }
          } catch (err) {
               console.error("Error saving contact data:", err);
               showToast("An error occurred while saving.", "error");
          } finally {
               setSaving(false);
          }
     };

     // Social rows helpers
     const addSocialRow = () => {
          setSocials([...socials, { label: "", url: "" }]);
     };

     const updateSocialField = (index, field, value) => {
          const updated = [...socials];
          updated[index] = { ...updated[index], [field]: value };
          setSocials(updated);
     };

     const removeSocialRow = (index) => {
          setSocials(socials.filter((_, i) => i !== index));
     };

     const inputClass = "w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50/50";
     const labelClass = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider";
     const tabBtnClass = (tab) => `px-5 py-3 font-semibold text-sm rounded-lg transition-all ${activeTab === tab ? "bg-orange-500 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`;

     if (loading) {
          return (
               <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <p className="text-gray-500 font-medium">Loading Contact Data...</p>
               </div>
          );
     }

     return (
          <div className="bg-gray-50/50 min-h-screen pb-12 font-sans">
               <Breadcrumb />
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 px-6 lg:px-10 max-w-7xl mx-auto">
                    <div>
                         <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Contact Page Content</h1>
                         <p className="text-sm text-gray-500 mt-1">Manage branding, office contact, and social links</p>
                    </div>
                    <button
                         onClick={handleSaveAll}
                         disabled={saving}
                         className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed shrink-0"
                    >
                         <HiOutlineSave className="text-lg" />
                         {saving ? "Saving Changes..." : "Save All Data"}
                    </button>
               </div>

               {/* Tab Navigation */}
               <div className="flex flex-wrap gap-2 px-6 lg:px-10 max-w-7xl mx-auto mb-8">
                    <button onClick={() => setActiveTab("general")} className={tabBtnClass("general")}>General Details</button>
                    <button onClick={() => setActiveTab("inquiries")} className={tabBtnClass("inquiries")}>Inquiries</button>
                    <button onClick={() => setActiveTab("socials")} className={tabBtnClass("socials")}>Social Links ({socials.length})</button>
                    <button onClick={() => setActiveTab("images")} className={tabBtnClass("images")}>Images</button>
                    <button onClick={() => setActiveTab("blogs")} className={tabBtnClass("blogs")}>Related Blogs</button>
               </div>

               <div className="px-6 lg:px-10 max-w-7xl mx-auto">
                    {activeTab === "general" && (
                         <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-4 max-w-4xl">
                              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">General Information</h2>
                              <div>
                                   <label className={labelClass}>Page Header Title</label>
                                   <input
                                        type="text"
                                        value={pageTitle}
                                        onChange={(e) => setPageTitle(e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. Contact Us"
                                   />
                              </div>
                         </div>
                    )}

                    {activeTab === "inquiries" && (
                         <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-6 max-w-4xl">
                              <div>
                                   <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Inquiries Configuration</h2>
                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                        <div>
                                             <label className={labelClass}>Section Title</label>
                                             <input type="text" value={inqTitle} onChange={(e) => setInqTitle(e.target.value)} className={inputClass} placeholder="e.g. Inquiries" />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Inquiry Email</label>
                                             <input type="email" value={inqEmail} onChange={(e) => setInqEmail(e.target.value)} className={inputClass} placeholder="e.g. info@kreeya.com" />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Inquiry Phone</label>
                                             <input type="text" value={inqPhone} onChange={(e) => setInqPhone(e.target.value)} className={inputClass} placeholder="e.g. +91 99999 99999" />
                                        </div>
                                   </div>
                              </div>

                              <div className="pt-4 border-t border-gray-100">
                                   <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Office Location Details</h2>
                                   <div className="grid grid-cols-1 gap-4 mt-4">
                                        <div>
                                             <label className={labelClass}>Section Label/Title</label>
                                             <input type="text" value={locTitle} onChange={(e) => setLocTitle(e.target.value)} className={inputClass} placeholder="e.g. Our Office" />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Physical Address</label>
                                             <textarea value={locAddress} onChange={(e) => setLocAddress(e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="Enter office physical address..." />
                                        </div>
                                   </div>
                              </div>
                         </div>
                    )}

                    {activeTab === "socials" && (
                         <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-6 max-w-4xl">
                              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                   <div>
                                        <h2 className="text-lg font-bold text-gray-800">Social Media Platforms</h2>
                                        <p className="text-xs text-gray-400 mt-1">Configure profile links and labels displayed on the Contact Us page.</p>
                                   </div>
                                   <button
                                        type="button"
                                        onClick={addSocialRow}
                                        className="text-xs font-semibold text-orange-500 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 px-3.5 py-1.5 rounded-lg border border-orange-100 transition-colors cursor-pointer shrink-0"
                                   >
                                        + Add Platform
                                   </button>
                              </div>

                              <div className="space-y-4">
                                   <div className="space-y-1.5 max-w-md">
                                        <label className={labelClass}>Social Menu Header</label>
                                        <input type="text" value={socialsTitle} onChange={(e) => setSocialsTitle(e.target.value)} className={inputClass} placeholder="e.g. Follow Us" />
                                   </div>

                                   <div className="space-y-3 pt-3 border-t border-gray-100">
                                        {socials.length === 0 ? (
                                             <p className="text-xs text-gray-400 text-center py-6">No social platforms configured. Click "+ Add Platform" to add one.</p>
                                        ) : (
                                             socials.map((platform, idx) => (
                                                  <div key={idx} className="flex gap-2 items-center bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                                                       <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            <input
                                                                 type="text"
                                                                 placeholder="Platform Label (e.g. LinkedIn)"
                                                                 value={platform.label}
                                                                 onChange={(e) => updateSocialField(idx, "label", e.target.value)}
                                                                 className="px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                                                 required
                                                            />
                                                            <input
                                                                 type="text"
                                                                 placeholder="Profile URL (e.g. https://linkedin.com/company/...)"
                                                                 value={platform.url}
                                                                 onChange={(e) => updateSocialField(idx, "url", e.target.value)}
                                                                 className="px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                                                 required
                                                            />
                                                       </div>
                                                       <button
                                                            type="button"
                                                            onClick={() => removeSocialRow(idx)}
                                                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors border border-transparent hover:border-red-100 cursor-pointer shrink-0"
                                                       >
                                                            ✕
                                                       </button>
                                                  </div>
                                             ))
                                        )}
                                   </div>
                              </div>
                         </div>
                    )}

                    {activeTab === "images" && (
                         <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-6 max-w-4xl">
                              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Upload Page Visuals</h2>
                              
                              {/* Left Section Image */}
                              <div className="space-y-1.5 pb-4 border-b border-gray-100">
                                   <label className={labelClass}>Left Section Banner Image</label>
                                   <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                                        <div className="h-20 w-32 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center p-2 overflow-hidden shrink-0">
                                             {leftImageFile ? (
                                                  <img src={URL.createObjectURL(leftImageFile)} className="max-h-full max-w-full object-cover rounded-lg" alt="Preview" />
                                             ) : leftImage ? (
                                                  <img src={leftImage} className="max-h-full max-w-full object-cover rounded-lg" alt="Current Banner" />
                                             ) : (
                                                  <HiOutlinePhotograph className="w-6 h-6 text-gray-400" />
                                             )}
                                        </div>
                                        <div className="flex-1 w-full relative">
                                             <div className="border border-dashed border-gray-300 hover:border-orange-500 rounded-xl px-4 py-4 bg-gray-50/50 hover:bg-orange-50/10 transition flex items-center justify-center gap-2 cursor-pointer text-center relative group min-h-12">
                                                  <input type="file" accept="image/*" onChange={(e) => setLeftImageFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
                                                  <div className="flex items-center gap-2 text-gray-500 group-hover:text-orange-500 transition">
                                                       <HiOutlineUpload className="w-4 h-4" />
                                                       <span className="text-xs font-semibold">{leftImageFile ? leftImageFile.name : "Upload Left Section Image..."}</span>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </div>

                              {/* Map Image */}
                              <div className="space-y-1.5">
                                   <label className={labelClass}>Google Map Display Image</label>
                                   <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                                        <div className="h-20 w-32 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center p-2 overflow-hidden shrink-0">
                                             {mapImageFile ? (
                                                  <img src={URL.createObjectURL(mapImageFile)} className="max-h-full max-w-full object-cover rounded-lg" alt="Preview" />
                                             ) : mapImage ? (
                                                  <img src={mapImage} className="max-h-full max-w-full object-cover rounded-lg" alt="Current Map" />
                                             ) : (
                                                  <HiOutlinePhotograph className="w-6 h-6 text-gray-400" />
                                             )}
                                        </div>
                                        <div className="flex-1 w-full relative">
                                             <div className="border border-dashed border-gray-300 hover:border-orange-500 rounded-xl px-4 py-4 bg-gray-50/50 hover:bg-orange-50/10 transition flex items-center justify-center gap-2 cursor-pointer text-center relative group min-h-12">
                                                  <input type="file" accept="image/*" onChange={(e) => setMapImageFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
                                                  <div className="flex items-center gap-2 text-gray-500 group-hover:text-orange-500 transition">
                                                       <HiOutlineUpload className="w-4 h-4" />
                                                       <span className="text-xs font-semibold">{mapImageFile ? mapImageFile.name : "Upload Map Image..."}</span>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    )}

                    {activeTab === "blogs" && (
                         <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-4 max-w-4xl">
                              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Related Blogs Section</h2>
                              <div className="space-y-4">
                                   <div className="space-y-1.5">
                                        <label className={labelClass}>Section Title</label>
                                        <input type="text" value={blogsTitle} onChange={(e) => setBlogsTitle(e.target.value)} className={inputClass} placeholder="e.g. Related Blogs" />
                                   </div>
                                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Start Title</label>
                                             <input type="text" value={blogsStart} onChange={(e) => setBlogsStart(e.target.value)} className={inputClass} placeholder="e.g. Our" />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Mid Title (Highlighted)</label>
                                             <input type="text" value={blogsMid} onChange={(e) => setBlogsMid(e.target.value)} className={inputClass} placeholder="e.g. Latest" />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>End Title</label>
                                             <input type="text" value={blogsEnd} onChange={(e) => setBlogsEnd(e.target.value)} className={inputClass} placeholder="e.g. Articles" />
                                        </div>
                                   </div>
                                   <div className="space-y-1.5">
                                        <label className={labelClass}>Section Description</label>
                                        <textarea value={blogsDesc} onChange={(e) => setBlogsDesc(e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="Section description..." />
                                   </div>
                              </div>
                         </div>
                    )}
               </div>
          </div>
     );
}

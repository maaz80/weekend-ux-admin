import { useEffect, useState } from "react";
import { HiOutlineSave, HiOutlinePlus, HiOutlineTrash, HiOutlinePencil, HiOutlineUpload, HiOutlinePhotograph } from "react-icons/hi";
import Breadcrumb from "../components/BreadCrumb";
import { getAdminToken } from "../utils/auth.js";
import { useToast } from "../context/ToastContext";

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export default function AboutData() {
     const { showToast } = useToast();
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [activeTab, setActiveTab] = useState("hero");

     // Hero State
     const [heroTitle, setHeroTitle] = useState("");
     const [heroHeading, setHeroHeading] = useState("");
     const [heroBtnName, setHeroBtnName] = useState("");
     const [heroImage, setHeroImage] = useState("");
     const [heroImageFile, setHeroImageFile] = useState(null);

     // Features State
     const [featuresDesc, setFeaturesDesc] = useState("");
     const [features, setFeatures] = useState([]);
     const [featIcon, setFeatIcon] = useState("");
     const [featText, setFeatText] = useState("");
     const [editingFeatIndex, setEditingFeatIndex] = useState(null);

     // Quote State
     const [quote, setQuote] = useState("");

     // Why Us (proven track record stats) State
     const [whyTitle, setWhyTitle] = useState("");
     const [whyStart, setWhyStart] = useState("");
     const [whyMid, setWhyMid] = useState("");
     const [whyEnd, setWhyEnd] = useState("");
     const [whyCards, setWhyCards] = useState([]);
     const [whyVal, setWhyVal] = useState("");
     const [whyName, setWhyName] = useState("");
     const [whyDesc, setWhyDesc] = useState("");
     const [editingWhyIndex, setEditingWhyIndex] = useState(null);

     // Team State
     const [teamTitle, setTeamTitle] = useState("");
     const [teamStart, setTeamStart] = useState("");
     const [teamMid, setTeamMid] = useState("");
     const [teamEnd, setTeamEnd] = useState("");
     const [teamDesc, setTeamDesc] = useState("");
     const [teamMembers, setTeamMembers] = useState([]);
     const [teamFiles, setTeamFiles] = useState({}); // mapped by index for team member image files
     const [memberName, setMemberName] = useState("");
     const [memberRole, setMemberRole] = useState("");
     const [memberImgUrl, setMemberImgUrl] = useState("");
     const [memberFile, setMemberFile] = useState(null);
     const [editingMemberIndex, setEditingMemberIndex] = useState(null);

     // Related Blogs State
     const [blogsTitle, setBlogsTitle] = useState("");
     const [blogsStart, setBlogsStart] = useState("");
     const [blogsMid, setBlogsMid] = useState("");
     const [blogsEnd, setBlogsEnd] = useState("");
     const [blogsDesc, setBlogsDesc] = useState("");

     const fetchAboutData = async () => {
          try {
               setLoading(true);
               const res = await fetch(`${API_URL}/about`);
               if (res.ok) {
                    const data = await res.json();
                    if (data) {
                         const hero = data.hero && data.hero[0] ? data.hero[0] : {};
                         setHeroTitle(hero.title || "");
                         setHeroHeading(hero.heading || "");
                         setHeroBtnName(hero.buttonName || "");
                         setHeroImage(hero.bgImage || "");

                         const feat = data.features || {};
                         setFeaturesDesc(feat.description || "");
                         setFeatures(Array.isArray(feat.points) ? feat.points : []);

                         setQuote(data.quote || "");

                         const why = data.why || {};
                         setWhyTitle(why.title || "");
                         setWhyStart(why.startheading || "");
                         setWhyMid(why.midheading || "");
                         setWhyEnd(why.endheading || "");
                         setWhyCards(Array.isArray(why.card) ? why.card : []);

                         const teamObj = data.team || {};
                         setTeamTitle(teamObj.title || "");
                         setTeamStart(teamObj.startheading || "");
                         setTeamMid(teamObj.midheading || "");
                         setTeamEnd(teamObj.endheading || "");
                         setTeamDesc(teamObj.description || "");
                         setTeamMembers(Array.isArray(teamObj.imageCard) ? teamObj.imageCard : []);
                         setTeamFiles({});

                         const rb = data.relatedBlogs || {};
                         setBlogsTitle(rb.title || "");
                         setBlogsStart(rb.startheading || "");
                         setBlogsMid(rb.midheading || "");
                         setBlogsEnd(rb.endheading || "");
                         setBlogsDesc(rb.description || "");
                    }
               }
          } catch (err) {
               console.error("Error fetching about data:", err);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchAboutData();
     }, []);

     const handleSaveAll = async () => {
          try {
               setSaving(true);

               const payload = {
                    hero: [{
                         title: heroTitle,
                         heading: heroHeading,
                         buttonName: heroBtnName,
                         bgImage: heroImage
                    }],
                    features: {
                         description: featuresDesc,
                         points: features.map(item => ({ icon: item.icon, text: item.text }))
                    },
                    quote: quote,
                    why: {
                         title: whyTitle,
                         startheading: whyStart,
                         midheading: whyMid,
                         endheading: whyEnd,
                         card: whyCards.map(item => ({ value: item.value, valueName: item.valueName, description: item.description }))
                    },
                    team: {
                         title: teamTitle,
                         startheading: teamStart,
                         midheading: teamMid,
                         endheading: teamEnd,
                         description: teamDesc,
                         imageCard: teamMembers.map(item => ({ image: item.image, name: item.name, role: item.role }))
                    },
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

               if (heroImageFile) {
                    formData.append("bgImage", heroImageFile);
               }

               // Append team files
               Object.keys(teamFiles).forEach((index) => {
                    formData.append(`teamImage_${index}`, teamFiles[index]);
               });

               const res = await fetch(`${API_URL}/about`, {
                    method: "PUT",
                    headers: {
                         "Authorization": `Bearer ${getAdminToken()}`
                    },
                    body: formData
               });

               if (res.ok) {
                    showToast("About settings saved successfully!", "success");
                    setHeroImageFile(null);
                    setTeamFiles({});
                    fetchAboutData();
               } else {
                    showToast("Failed to save About Settings.", "error");
               }
          } catch (err) {
               console.error("Error saving about data:", err);
               showToast("An error occurred while saving.", "error");
          } finally {
               setSaving(false);
          }
     };

     // Features helpers
     const handleAddOrEditFeat = (e) => {
          e.preventDefault();
          if (!featIcon || !featText) return;

          if (editingFeatIndex !== null) {
               const updated = [...features];
               updated[editingFeatIndex] = { icon: featIcon, text: featText };
               setFeatures(updated);
               setEditingFeatIndex(null);
          } else {
               setFeatures([...features, { icon: featIcon, text: featText }]);
          }
          setFeatIcon("");
          setFeatText("");
     };

     const handleEditFeat = (index) => {
          const item = features[index];
          setFeatIcon(item.icon);
          setFeatText(item.text);
          setEditingFeatIndex(index);
     };

     const handleDeleteFeat = (index) => {
          setFeatures(features.filter((_, i) => i !== index));
          if (editingFeatIndex === index) {
               setEditingFeatIndex(null);
               setFeatIcon("");
               setFeatText("");
          }
     };

     // Why statistics cards helpers
     const handleAddOrEditWhy = (e) => {
          e.preventDefault();
          if (!whyVal || !whyName) return;

          if (editingWhyIndex !== null) {
               const updated = [...whyCards];
               updated[editingWhyIndex] = { value: whyVal, valueName: whyName, description: whyDesc };
               setWhyCards(updated);
               setEditingWhyIndex(null);
          } else {
               setWhyCards([...whyCards, { value: whyVal, valueName: whyName, description: whyDesc }]);
          }
          setWhyVal("");
          setWhyName("");
          setWhyDesc("");
     };

     const handleEditWhy = (index) => {
          const item = whyCards[index];
          setWhyVal(item.value);
          setWhyName(item.valueName);
          setWhyDesc(item.description || "");
          setEditingWhyIndex(index);
     };

     const handleDeleteWhy = (index) => {
          setWhyCards(whyCards.filter((_, i) => i !== index));
          if (editingWhyIndex === index) {
               setEditingWhyIndex(null);
               setWhyVal("");
               setWhyName("");
               setWhyDesc("");
          }
     };

     // Team helpers
     const handleAddOrEditMember = (e) => {
          e.preventDefault();
          if (!memberName || !memberRole) return;

          let finalImg = memberImgUrl;

          if (editingMemberIndex !== null) {
               const updated = [...teamMembers];
               updated[editingMemberIndex] = { name: memberName, role: memberRole, image: finalImg };
               setTeamMembers(updated);
               
               if (memberFile) {
                    setTeamFiles({ ...teamFiles, [editingMemberIndex]: memberFile });
               }
               setEditingMemberIndex(null);
          } else {
               const newIndex = teamMembers.length;
               setTeamMembers([...teamMembers, { name: memberName, role: memberRole, image: finalImg }]);
               
               if (memberFile) {
                    setTeamFiles({ ...teamFiles, [newIndex]: memberFile });
               }
          }
          setMemberName("");
          setMemberRole("");
          setMemberImgUrl("");
          setMemberFile(null);
     };

     const handleEditMember = (index) => {
          const item = teamMembers[index];
          setMemberName(item.name);
          setMemberRole(item.role);
          setMemberImgUrl(item.image || "");
          setMemberFile(null);
          setEditingMemberIndex(index);
     };

     const handleDeleteMember = (index) => {
          setTeamMembers(teamMembers.filter((_, i) => i !== index));
          
          // Re-map files index
          const newFiles = {};
          Object.keys(teamFiles).forEach((key) => {
               const idx = parseInt(key, 10);
               if (idx < index) {
                    newFiles[idx] = teamFiles[idx];
               } else if (idx > index) {
                    newFiles[idx - 1] = teamFiles[idx];
               }
          });
          setTeamFiles(newFiles);

          if (editingMemberIndex === index) {
               setEditingMemberIndex(null);
               setMemberName("");
               setMemberRole("");
               setMemberImgUrl("");
               setMemberFile(null);
          }
     };

     const inputClass = "w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50/50";
     const labelClass = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider";
     const tabBtnClass = (tab) => `px-5 py-3 font-semibold text-sm rounded-lg transition-all ${activeTab === tab ? "bg-orange-500 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`;

     if (loading) {
          return (
               <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <p className="text-gray-500 font-medium">Loading About Data...</p>
               </div>
          );
     }

     return (
          <div className="bg-gray-50/50 min-h-screen pb-12 font-sans">
               <Breadcrumb />
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 px-6 lg:px-10 max-w-7xl mx-auto">
                    <div>
                         <h1 className="text-2xl font-bold text-gray-900 tracking-tight">About Page Content</h1>
                         <p className="text-sm text-gray-500 mt-1">Manage content on the About page</p>
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
                    <button onClick={() => setActiveTab("hero")} className={tabBtnClass("hero")}>Hero Section</button>
                    <button onClick={() => setActiveTab("features")} className={tabBtnClass("features")}>Features ({features.length})</button>
                    <button onClick={() => setActiveTab("quote")} className={tabBtnClass("quote")}>Quote</button>
                    <button onClick={() => setActiveTab("why")} className={tabBtnClass("why")}>Why Choose Us ({whyCards.length})</button>
                    <button onClick={() => setActiveTab("team")} className={tabBtnClass("team")}>Team ({teamMembers.length})</button>
                    <button onClick={() => setActiveTab("blogs")} className={tabBtnClass("blogs")}>Related Blogs</button>
               </div>

               <div className="px-6 lg:px-10 max-w-7xl mx-auto">
                    {activeTab === "hero" && (
                         <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-4 max-w-4xl">
                              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Hero Section</h2>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <div>
                                        <label className={labelClass}>Hero Title</label>
                                        <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className={inputClass} placeholder="e.g. We are Kreeya" />
                                   </div>
                                   <div>
                                        <label className={labelClass}>Hero Heading</label>
                                        <input type="text" value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} className={inputClass} placeholder="e.g. Designing a Better World Together" />
                                   </div>
                                   <div>
                                        <label className={labelClass}>Hero Button Label</label>
                                        <input type="text" value={heroBtnName} onChange={(e) => setHeroBtnName(e.target.value)} className={inputClass} placeholder="e.g. Learn More" />
                                   </div>
                              </div>
                              <div>
                                   <label className={labelClass}>Hero Background Image</label>
                                   <div className="flex items-center gap-4 mt-2">
                                        <div className="h-16 w-32 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center p-2 overflow-hidden shrink-0">
                                             {heroImageFile ? (
                                                  <img src={URL.createObjectURL(heroImageFile)} alt="Hero Preview" className="h-full w-full object-cover rounded-lg" />
                                             ) : heroImage ? (
                                                  <img src={heroImage} alt="Hero Current" className="h-full w-full object-cover rounded-lg" />
                                             ) : (
                                                  <HiOutlinePhotograph className="w-5 h-5 text-gray-400" />
                                             )}
                                        </div>
                                        <input
                                             type="file"
                                             accept="image/*"
                                             onChange={(e) => {
                                                  const file = e.target.files[0];
                                                  if (file) setHeroImageFile(file);
                                             }}
                                             className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                                        />
                                   </div>
                              </div>
                         </div>
                    )}

                    {activeTab === "features" && (
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 h-fit">
                                   <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">
                                        {editingFeatIndex !== null ? "Edit Feature" : "Add Feature"}
                                   </h2>
                                   <form onSubmit={handleAddOrEditFeat} className="space-y-4">
                                        <div>
                                             <label className={labelClass}>Feature Icon (React Icon name)</label>
                                             <input type="text" value={featIcon} onChange={(e) => setFeatIcon(e.target.value)} className={inputClass} placeholder="e.g. FaGlobe" required />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Feature Point Text</label>
                                             <textarea value={featText} onChange={(e) => setFeatText(e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="Enter feature text..." required />
                                        </div>
                                        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-sm">
                                             <HiOutlinePlus />
                                             {editingFeatIndex !== null ? "Update Feature" : "Add Feature"}
                                        </button>
                                        {editingFeatIndex !== null && (
                                             <button type="button" onClick={() => { setEditingFeatIndex(null); setFeatIcon(""); setFeatText(""); }} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 rounded-lg transition-colors text-sm">Cancel</button>
                                        )}
                                   </form>
                              </div>

                              <div className="lg:col-span-2 space-y-6">
                                   <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-4">
                                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Features Global Description</h2>
                                        <div>
                                             <label className={labelClass}>Features Section Sub-description</label>
                                             <textarea value={featuresDesc} onChange={(e) => setFeaturesDesc(e.target.value)} rows={2} className={`${inputClass} resize-none`} placeholder="e.g. Our core principles drive everything we build." />
                                        </div>
                                   </div>

                                   <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-4">
                                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Features Points List</h2>
                                        {features.length === 0 ? (
                                             <p className="text-sm text-gray-400 italic">No features added yet. Use the form to add one.</p>
                                        ) : (
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  {features.map((item, idx) => (
                                                       <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col justify-between">
                                                            <div>
                                                                 <div className="flex items-center gap-2 border-b border-gray-200 pb-2 mb-2">
                                                                      <span className="text-[10px] bg-orange-100 text-orange-600 font-mono font-semibold px-2 py-0.5 rounded">Icon: {item.icon}</span>
                                                                 </div>
                                                                 <p className="text-xs text-gray-600 leading-normal">{item.text}</p>
                                                            </div>
                                                            <div className="flex justify-end gap-2 pt-4 mt-2 border-t border-gray-100">
                                                                 <button onClick={() => handleEditFeat(idx)} className="p-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors cursor-pointer"><HiOutlinePencil className="w-4 h-4" /></button>
                                                                 <button onClick={() => handleDeleteFeat(idx)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors cursor-pointer"><HiOutlineTrash className="w-4 h-4" /></button>
                                                            </div>
                                                       </div>
                                                  ))}
                                             </div>
                                        )}
                                   </div>
                              </div>
                         </div>
                    )}

                    {activeTab === "quote" && (
                         <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-4 max-w-4xl">
                              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Inspirational Quote</h2>
                              <div>
                                   <label className={labelClass}>Quote Content</label>
                                   <textarea value={quote} onChange={(e) => setQuote(e.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="e.g. Good design is making something intelligible and memorable." />
                              </div>
                         </div>
                    )}

                    {activeTab === "why" && (
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 h-fit">
                                   <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">
                                        {editingWhyIndex !== null ? "Edit Stat Card" : "Add Stat Card"}
                                   </h2>
                                   <form onSubmit={handleAddOrEditWhy} className="space-y-4">
                                        <div>
                                             <label className={labelClass}>Stat Value</label>
                                             <input type="text" value={whyVal} onChange={(e) => setWhyVal(e.target.value)} className={inputClass} placeholder="e.g. 100+" required />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Stat Name</label>
                                             <input type="text" value={whyName} onChange={(e) => setWhyName(e.target.value)} className={inputClass} placeholder="e.g. Projects Completed" required />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Short Description</label>
                                             <textarea value={whyDesc} onChange={(e) => setWhyDesc(e.target.value)} rows={2} className={`${inputClass} resize-none`} placeholder="Description details..." />
                                        </div>
                                        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-sm">
                                             <HiOutlinePlus />
                                             {editingWhyIndex !== null ? "Update Stat" : "Add Stat"}
                                        </button>
                                        {editingWhyIndex !== null && (
                                             <button type="button" onClick={() => { setEditingWhyIndex(null); setWhyVal(""); setWhyName(""); setWhyDesc(""); }} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 rounded-lg transition-colors text-sm">Cancel</button>
                                        )}
                                   </form>
                              </div>

                              <div className="lg:col-span-2 space-y-6">
                                   <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-4">
                                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Why Us section headings</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             <div>
                                                  <label className={labelClass}>Section Title</label>
                                                  <input type="text" value={whyTitle} onChange={(e) => setWhyTitle(e.target.value)} className={inputClass} placeholder="e.g. Why Us" />
                                             </div>
                                             <div className="grid grid-cols-3 gap-2">
                                                  <div>
                                                       <label className={labelClass}>Start Title</label>
                                                       <input type="text" value={whyStart} onChange={(e) => setWhyStart(e.target.value)} className={inputClass} placeholder="e.g. Our" />
                                                  </div>
                                                  <div>
                                                       <label className={labelClass}>Mid Title (Highlighted)</label>
                                                       <input type="text" value={whyMid} onChange={(e) => setWhyMid(e.target.value)} className={inputClass} placeholder="e.g. Proven" />
                                                  </div>
                                                  <div>
                                                       <label className={labelClass}>End Title</label>
                                                       <input type="text" value={whyEnd} onChange={(e) => setWhyEnd(e.target.value)} className={inputClass} placeholder="e.g. Track Record" />
                                                  </div>
                                             </div>
                                        </div>
                                   </div>

                                   <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-4">
                                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Stats Cards List</h2>
                                        {whyCards.length === 0 ? (
                                             <p className="text-sm text-gray-400 italic">No statistic cards added yet.</p>
                                        ) : (
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  {whyCards.map((item, idx) => (
                                                       <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col justify-between">
                                                            <div>
                                                                 <div className="flex items-baseline gap-2 mb-1">
                                                                      <span className="text-xl font-extrabold text-orange-600">{item.value}</span>
                                                                      <span className="text-xs font-bold text-gray-800">{item.valueName}</span>
                                                                 </div>
                                                                 <p className="text-xs text-gray-400 leading-normal">{item.description}</p>
                                                            </div>
                                                            <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-gray-100">
                                                                 <button onClick={() => handleEditWhy(idx)} className="p-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors cursor-pointer"><HiOutlinePencil className="w-4 h-4" /></button>
                                                                 <button onClick={() => handleDeleteWhy(idx)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors cursor-pointer"><HiOutlineTrash className="w-4 h-4" /></button>
                                                            </div>
                                                       </div>
                                                  ))}
                                             </div>
                                        )}
                                   </div>
                              </div>
                         </div>
                    )}

                    {activeTab === "team" && (
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 h-fit">
                                   <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">
                                        {editingMemberIndex !== null ? "Edit Member" : "Add Member"}
                                   </h2>
                                   <form onSubmit={handleAddOrEditMember} className="space-y-4">
                                        <div>
                                             <label className={labelClass}>Member Name</label>
                                             <input type="text" value={memberName} onChange={(e) => setMemberName(e.target.value)} className={inputClass} placeholder="e.g. Jane Doe" required />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Role / Title</label>
                                             <input type="text" value={memberRole} onChange={(e) => setMemberRole(e.target.value)} className={inputClass} placeholder="e.g. Lead Designer" required />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Profile Image</label>
                                             <div className="flex items-center gap-3">
                                                  <div className="h-12 w-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                                       {memberFile ? (
                                                            <img src={URL.createObjectURL(memberFile)} className="h-full w-full object-cover" alt="Preview" />
                                                       ) : memberImgUrl ? (
                                                            <img src={memberImgUrl} className="h-full w-full object-cover" alt="Current" />
                                                       ) : (
                                                            <HiOutlinePhotograph className="w-5 h-5 text-gray-400" />
                                                       )}
                                                  </div>
                                                  <input
                                                       type="file"
                                                       accept="image/*"
                                                       onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                 setMemberFile(file);
                                                                 setMemberImgUrl(URL.createObjectURL(file));
                                                            }
                                                       }}
                                                       className="text-xs file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                                                  />
                                             </div>
                                        </div>
                                        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-sm">
                                             <HiOutlinePlus />
                                             {editingMemberIndex !== null ? "Update Member" : "Add Member"}
                                        </button>
                                        {editingMemberIndex !== null && (
                                             <button type="button" onClick={() => { setEditingMemberIndex(null); setMemberName(""); setMemberRole(""); setMemberImgUrl(""); setMemberFile(null); }} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 rounded-lg transition-colors text-sm">Cancel</button>
                                        )}
                                   </form>
                              </div>

                              <div className="lg:col-span-2 space-y-6">
                                   <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-4">
                                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Team Headings</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             <div>
                                                  <label className={labelClass}>Section Title</label>
                                                  <input type="text" value={teamTitle} onChange={(e) => setTeamTitle(e.target.value)} className={inputClass} placeholder="e.g. Meet the Team" />
                                             </div>
                                             <div className="grid grid-cols-3 gap-2">
                                                  <div>
                                                       <label className={labelClass}>Start Title</label>
                                                       <input type="text" value={teamStart} onChange={(e) => setTeamStart(e.target.value)} className={inputClass} placeholder="e.g. Our" />
                                                  </div>
                                                  <div>
                                                       <label className={labelClass}>Mid Title</label>
                                                       <input type="text" value={teamMid} onChange={(e) => setTeamMid(e.target.value)} className={inputClass} placeholder="e.g. Creative" />
                                                  </div>
                                                  <div>
                                                       <label className={labelClass}>End Title</label>
                                                       <input type="text" value={teamEnd} onChange={(e) => setTeamEnd(e.target.value)} className={inputClass} placeholder="e.g. Minds" />
                                                  </div>
                                             </div>
                                        </div>
                                        <div className="mt-2">
                                             <label className={labelClass}>Section Description</label>
                                             <textarea value={teamDesc} onChange={(e) => setTeamDesc(e.target.value)} rows={2} className={`${inputClass} resize-none`} placeholder="Team details..." />
                                        </div>
                                   </div>

                                   <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-4">
                                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Team Members List</h2>
                                        {teamMembers.length === 0 ? (
                                             <p className="text-sm text-gray-400 italic">No team members added yet.</p>
                                        ) : (
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  {teamMembers.map((item, idx) => (
                                                       <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-3 items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                 <img src={teamFiles[idx] ? URL.createObjectURL(teamFiles[idx]) : item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                                                                 <div className="min-w-0">
                                                                      <h4 className="text-sm font-bold text-gray-900 truncate">{item.name}</h4>
                                                                      <p className="text-xs text-gray-400 truncate">{item.role}</p>
                                                                 </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                 <button onClick={() => handleEditMember(idx)} className="p-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors cursor-pointer"><HiOutlinePencil className="w-4 h-4" /></button>
                                                                 <button onClick={() => handleDeleteMember(idx)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors cursor-pointer"><HiOutlineTrash className="w-4 h-4" /></button>
                                                            </div>
                                                       </div>
                                                  ))}
                                             </div>
                                        )}
                                   </div>
                              </div>
                         </div>
                    )}

                    {activeTab === "blogs" && (
                         <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-4 max-w-4xl">
                              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Related Blogs Heading Config</h2>
                              <div className="space-y-4">
                                   <div className="space-y-1.5">
                                        <label className={labelClass}>Section Title</label>
                                        <input type="text" value={blogsTitle} onChange={(e) => setBlogsTitle(e.target.value)} className={inputClass} placeholder="e.g. Related Blogs" />
                                   </div>
                                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Start Title</label>
                                             <input type="text" value={blogsStart} onChange={(e) => setBlogsStart(e.target.value)} className={inputClass} placeholder="e.g. From" />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Mid Title (Highlighted)</label>
                                             <input type="text" value={blogsMid} onChange={(e) => setBlogsMid(e.target.value)} className={inputClass} placeholder="e.g. Our" />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>End Title</label>
                                             <input type="text" value={blogsEnd} onChange={(e) => setBlogsEnd(e.target.value)} className={inputClass} placeholder="e.g. Journal" />
                                        </div>
                                   </div>
                                   <div className="space-y-1.5">
                                        <label className={labelClass}>Section Description</label>
                                        <textarea value={blogsDesc} onChange={(e) => setBlogsDesc(e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="Section description details..." />
                                   </div>
                              </div>
                         </div>
                    )}
               </div>
          </div>
     );
}

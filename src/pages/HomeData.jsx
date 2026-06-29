import { useEffect, useState } from "react";
import { HiOutlineSave, HiOutlinePlus, HiOutlineTrash, HiOutlinePencil, HiOutlineUpload, HiOutlinePhotograph } from "react-icons/hi";
import Breadcrumb from "../components/BreadCrumb";
import { getAdminToken } from "../utils/auth.js";
import ImageUploader from "../components/ImageUploader";
import { useToast } from "../context/ToastContext";

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export default function HomeData() {
     const { showToast } = useToast();
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [activeTab, setActiveTab] = useState("hero");

      // Hero States
      const [heroes, setHeroes] = useState([]);
      const [editingHeroIndex, setEditingHeroIndex] = useState(null);
      const [heroTitle, setHeroTitle] = useState("");
      const [heroStart, setHeroStart] = useState("");
      const [heroMid, setHeroMid] = useState("");
      const [heroEnd, setHeroEnd] = useState("");
      const [heroDesc, setHeroDesc] = useState("");
      const [heroBtn, setHeroBtn] = useState("");
      const [heroImage, setHeroImage] = useState("");
      const [heroImageFile, setHeroImageFile] = useState(null);

      // Features State
      const [featDesc, setFeatDesc] = useState("");
      const [featPoints, setFeatPoints] = useState([]);
      const [featIcon, setFeatIcon] = useState("");
      const [featText, setFeatText] = useState("");
      const [editingFeatIndex, setEditingFeatIndex] = useState(null);

      // Course Promotion State
      const [courseTitle, setCourseTitle] = useState("");
      const [courseStart, setCourseStart] = useState("");
      const [courseMid, setCourseMid] = useState("");
      const [courseEnd, setCourseEnd] = useState("");
      const [courseDesc, setCourseDesc] = useState("");

      // Why Choose Us State
      const [whyTitle, setWhyTitle] = useState("");
      const [whyStart, setWhyStart] = useState("");
      const [whyMid, setWhyMid] = useState("");
      const [whyEnd, setWhyEnd] = useState("");
      const [whyCards, setWhyCards] = useState([]);
      const [whyVal, setWhyVal] = useState("");
      const [whyName, setWhyName] = useState("");
      const [whyCardDesc, setWhyCardDesc] = useState("");
      const [editingWhyIndex, setEditingWhyIndex] = useState(null);

      // Philosophy State
      const [philTitle, setPhilTitle] = useState("");
      const [philDesc, setPhilDesc] = useState("");

      // Testimonials Titles State
      const [testStart, setTestStart] = useState("");
      const [testMid, setTestMid] = useState("");
      const [testEnd, setTestEnd] = useState("");
      const [testDesc, setTestDesc] = useState("");

      // Related Blogs State
      const [blogsTitle, setBlogsTitle] = useState("");
      const [blogsStart, setBlogsStart] = useState("");
      const [blogsMid, setBlogsMid] = useState("");
      const [blogsEnd, setBlogsEnd] = useState("");
      const [blogsDesc, setBlogsDesc] = useState("");

      const fetchHomeData = async () => {
           try {
                setLoading(true);
                const res = await fetch(`${API_URL}/home`);
                if (res.ok) {
                     const data = await res.json();
                     if (data) {
                          // Hero Carousel slides
                          setHeroes(Array.isArray(data.hero) ? data.hero : []);

                          // Features
                          const feat = data.features || {};
                          setFeatDesc(feat.description || "");
                          setFeatPoints(Array.isArray(feat.points) ? feat.points : []);

                          // Course Promotion
                          const crs = data.course || {};
                          setCourseTitle(crs.title || "");
                          setCourseStart(crs.startheading || "");
                          setCourseMid(crs.midheading || "");
                          setCourseEnd(crs.endheading || "");
                          setCourseDesc(crs.description || "");

                          // Why Choose Us
                          const why = data.why || {};
                          setWhyTitle(why.title || "");
                          setWhyStart(why.startheading || "");
                          setWhyMid(why.midheading || "");
                          setWhyEnd(why.endheading || "");
                          setWhyCards(Array.isArray(why.card) ? why.card : []);

                          // Philosophy
                          const phil = data.philosophy || {};
                          setPhilTitle(phil.title || "");
                          setPhilDesc(phil.description || "");

                          // Testimonials Titles
                          const test = data.testimonials || {};
                          setTestStart(test.startheading || "");
                          setTestMid(test.midheading || "");
                          setTestEnd(test.endheading || "");
                          setTestDesc(test.description || "");

                          // Related Blogs
                          const rb = data.relatedBlogs || {};
                          setBlogsTitle(rb.title || "");
                          setBlogsStart(rb.startheading || "");
                          setBlogsMid(rb.midheading || "");
                          setBlogsEnd(rb.endheading || "");
                          setBlogsDesc(rb.description || "");
                     }
                }
           } catch (err) {
                console.error("Error fetching home data:", err);
           } finally {
                setLoading(false);
           }
      };

      useEffect(() => {
           fetchHomeData();
      }, []);

      const handleSaveAll = async () => {
           try {
                setSaving(true);
                const payload = {
                     hero: heroes.map(h => ({
                          title: h.title,
                          startheading: h.startheading,
                          midheading: h.midheading,
                          endheading: h.endheading,
                          description: h.description,
                          buttonName: h.buttonName,
                          bgImage: h.bgImage
                     })),
                     features: {
                          description: featDesc,
                          points: featPoints.map(item => ({ icon: item.icon, text: item.text }))
                     },
                     course: {
                          title: courseTitle,
                          startheading: courseStart,
                          midheading: courseMid,
                          endheading: courseEnd,
                          description: courseDesc
                     },
                     why: {
                          title: whyTitle,
                          startheading: whyStart,
                          midheading: whyMid,
                          endheading: whyEnd,
                          card: whyCards.map(item => ({ value: item.value, valueName: item.valueName, description: item.description }))
                     },
                     philosophy: {
                          title: philTitle,
                          description: philDesc
                     },
                     testimonials: {
                          startheading: testStart,
                          midheading: testMid,
                          endheading: testEnd,
                          description: testDesc
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

                // Append each slide file if configured
                heroes.forEach((h, idx) => {
                     if (h.file) {
                          formData.append(`heroImage_${idx}`, h.file);
                     }
                });

                const res = await fetch(`${API_URL}/home`, {
                     method: "PUT",
                     headers: {
                          "Authorization": `Bearer ${getAdminToken()}`
                     },
                     body: formData
                });

                if (res.ok) {
                     showToast("Home configuration saved successfully!", "success");
                     setHeroes(prev => prev.map(h => ({ ...h, file: null })));
                     fetchHomeData();
                } else {
                     showToast("Failed to save Home data.", "error");
                }
           } catch (err) {
                console.error("Error saving home data:", err);
                showToast("An error occurred while saving.", "error");
           } finally {
                setSaving(false);
           }
      };

      // Hero Carousel helper functions
      const handleAddOrEditHero = (e) => {
           e.preventDefault();
           if (!heroStart && !heroTitle) return;

           const slideData = {
                title: heroTitle,
                startheading: heroStart,
                midheading: heroMid,
                endheading: heroEnd,
                description: heroDesc,
                buttonName: heroBtn,
                bgImage: heroImage,
                file: heroImageFile
           };

           if (editingHeroIndex !== null) {
                const updated = [...heroes];
                updated[editingHeroIndex] = slideData;
                setHeroes(updated);
                setEditingHeroIndex(null);
           } else {
                setHeroes([...heroes, slideData]);
           }

           // Reset slide form fields
           setHeroTitle("");
           setHeroStart("");
           setHeroMid("");
           setHeroEnd("");
           setHeroDesc("");
           setHeroBtn("");
           setHeroImage("");
           setHeroImageFile(null);
      };

      const handleEditHero = (index) => {
           const item = heroes[index];
           setHeroTitle(item.title || "");
           setHeroStart(item.startheading || "");
           setHeroMid(item.midheading || "");
           setHeroEnd(item.endheading || "");
           setHeroDesc(item.description || "");
           setHeroBtn(item.buttonName || "");
           setHeroImage(item.bgImage || "");
           setHeroImageFile(item.file || null);
           setEditingHeroIndex(index);
      };

      const handleDeleteHero = (index) => {
           setHeroes(heroes.filter((_, i) => i !== index));
           if (editingHeroIndex === index) {
                setEditingHeroIndex(null);
                setHeroTitle("");
                setHeroStart("");
                setHeroMid("");
                setHeroEnd("");
                setHeroDesc("");
                setHeroBtn("");
                setHeroImage("");
                setHeroImageFile(null);
           }
      };

     // Features helpers
     const handleAddOrEditFeat = (e) => {
          e.preventDefault();
          if (!featIcon || !featText) return;

          if (editingFeatIndex !== null) {
               const updated = [...featPoints];
               updated[editingFeatIndex] = { icon: featIcon, text: featText };
               setFeatPoints(updated);
               setEditingFeatIndex(null);
          } else {
               setFeatPoints([...featPoints, { icon: featIcon, text: featText }]);
          }
          setFeatIcon("");
          setFeatText("");
     };

     const handleEditFeat = (index) => {
          const item = featPoints[index];
          setFeatIcon(item.icon);
          setFeatText(item.text);
          setEditingFeatIndex(index);
     };

     const handleDeleteFeat = (index) => {
          setFeatPoints(featPoints.filter((_, i) => i !== index));
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
               updated[editingWhyIndex] = { value: whyVal, valueName: whyName, description: whyCardDesc };
               setWhyCards(updated);
               setEditingWhyIndex(null);
          } else {
               setWhyCards([...whyCards, { value: whyVal, valueName: whyName, description: whyCardDesc }]);
          }
          setWhyVal("");
          setWhyName("");
          setWhyCardDesc("");
     };

     const handleEditWhy = (index) => {
          const item = whyCards[index];
          setWhyVal(item.value);
          setWhyName(item.valueName);
          setWhyCardDesc(item.description || "");
          setEditingWhyIndex(index);
     };

     const handleDeleteWhy = (index) => {
          setWhyCards(whyCards.filter((_, i) => i !== index));
          if (editingWhyIndex === index) {
               setEditingWhyIndex(null);
               setWhyVal("");
               setWhyName("");
               setWhyCardDesc("");
          }
     };

     const inputClass = "w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50/50";
     const labelClass = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider";
     const tabBtnClass = (tab) => `px-5 py-3 font-semibold text-sm rounded-lg transition-all ${activeTab === tab ? "bg-orange-500 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`;

     if (loading) {
          return (
               <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <p className="text-gray-500 font-medium">Loading Home Data...</p>
               </div>
          );
     }

     return (
          <div className="bg-gray-50/50 min-h-screen pb-12 font-sans">
               <Breadcrumb />
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 px-6 lg:px-10 max-w-7xl mx-auto">
                    <div>
                         <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Home Page Content</h1>
                         <p className="text-sm text-gray-500 mt-1">Manage content sections of the Home page</p>
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
               <div className="flex flex-wrap gap-2 px-6 lg:px-10 max-w-7xl mx-auto mb-8 font-sans">
                    <button onClick={() => setActiveTab("hero")} className={tabBtnClass("hero")}>Hero Section</button>
                    <button onClick={() => setActiveTab("features")} className={tabBtnClass("features")}>Features ({featPoints.length})</button>
                    <button onClick={() => setActiveTab("course")} className={tabBtnClass("course")}>Course Promo</button>
                    <button onClick={() => setActiveTab("why")} className={tabBtnClass("why")}>Why Choose Us ({whyCards.length})</button>
                    <button onClick={() => setActiveTab("philosophy")} className={tabBtnClass("philosophy")}>Philosophy</button>
                    <button onClick={() => setActiveTab("testimonials")} className={tabBtnClass("testimonials")}>Testimonials</button>
                    <button onClick={() => setActiveTab("blogs")} className={tabBtnClass("blogs")}>Related Blogs</button>
               </div>

               <div className="px-6 lg:px-10 max-w-7xl mx-auto">
                    {activeTab === "hero" && (
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              {/* Hero Slide Form */}
                              <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 h-fit">
                                   <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">
                                        {editingHeroIndex !== null ? "Edit Hero Slide" : "Add Hero Slide"}
                                   </h2>
                                   <form onSubmit={handleAddOrEditHero} className="space-y-4">
                                        <div>
                                             <label className={labelClass}>Hero Subtitle</label>
                                             <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className={inputClass} placeholder="e.g. UI/UX Design Agency" />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Start Title</label>
                                             <input type="text" value={heroStart} onChange={(e) => setHeroStart(e.target.value)} className={inputClass} placeholder="e.g. Crafting" required />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Mid Title (Highlighted)</label>
                                             <input type="text" value={heroMid} onChange={(e) => setHeroMid(e.target.value)} className={inputClass} placeholder="e.g. Intelligent" />
                                        </div>
                                        <div>
                                             <label className={labelClass}>End Title</label>
                                             <input type="text" value={heroEnd} onChange={(e) => setHeroEnd(e.target.value)} className={inputClass} placeholder="e.g. Experiences" />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Button Name</label>
                                             <input type="text" value={heroBtn} onChange={(e) => setHeroBtn(e.target.value)} className={inputClass} placeholder="e.g. Book a Call" />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Description</label>
                                             <textarea value={heroDesc} onChange={(e) => setHeroDesc(e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="Slide description..." />
                                        </div>
                                        <div className="space-y-1.5">
                                             <div className="flex items-center justify-between">
                                                  <label className={labelClass}>Slide Background Image</label>
                                                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Recommended: 1600 x 900 px (16:9)</span>
                                             </div>
                                             <ImageUploader setImage={setHeroImageFile} initialImage={heroImage} />
                                             <p className="text-[11px] text-gray-400 mt-1">Suggested size: 1600 x 900 px (keep the main subject/focus in the center so it renders correctly on both mobile and PC).</p>
                                        </div>
                                        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-sm">
                                             <HiOutlinePlus />
                                             {editingHeroIndex !== null ? "Update Slide" : "Add Slide"}
                                        </button>
                                        {editingHeroIndex !== null && (
                                             <button type="button" onClick={() => {
                                                  setEditingHeroIndex(null);
                                                  setHeroTitle("");
                                                  setHeroStart("");
                                                  setHeroMid("");
                                                  setHeroEnd("");
                                                  setHeroDesc("");
                                                  setHeroBtn("");
                                                  setHeroImage("");
                                                  setHeroImageFile(null);
                                             }} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 rounded-lg transition-colors text-sm">Cancel</button>
                                        )}
                                   </form>
                              </div>

                              {/* Hero Slides List */}
                              <div className="lg:col-span-2 space-y-4">
                                   <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-4">
                                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Hero Carousel Slides ({heroes.length})</h2>
                                        {heroes.length === 0 ? (
                                             <p className="text-sm text-gray-400 italic">No slides added yet. Use the form to configure one.</p>
                                        ) : (
                                             <div className="space-y-4">
                                                  {heroes.map((slide, idx) => (
                                                       <div key={idx} className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200 justify-between">
                                                            <div className="flex gap-3 items-center min-w-0">
                                                                 <div className="h-16 w-24 rounded bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                                                      {slide.file ? (
                                                                           <img src={URL.createObjectURL(slide.file)} alt="Local slide preview" className="h-full w-full object-cover" />
                                                                      ) : slide.bgImage ? (
                                                                           <img src={slide.bgImage} alt="Slide cover" className="h-full w-full object-cover" />
                                                                      ) : (
                                                                           <HiOutlinePhotograph className="w-6 h-6 text-gray-400" />
                                                                      )}
                                                                 </div>
                                                                 <div className="min-w-0">
                                                                      <p className="text-sm font-bold text-gray-800 truncate">{slide.startheading} {slide.midheading} {slide.endheading}</p>
                                                                      {slide.title && <p className="text-[10px] text-orange-500 font-medium">{slide.title}</p>}
                                                                      <p className="text-xs text-gray-400 truncate max-w-xs">{slide.description}</p>
                                                                 </div>
                                                            </div>
                                                            <div className="flex gap-2 shrink-0">
                                                                 <button type="button" onClick={() => handleEditHero(idx)} className="p-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors cursor-pointer"><HiOutlinePencil className="w-4 h-4" /></button>
                                                                 <button type="button" onClick={() => handleDeleteHero(idx)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors cursor-pointer"><HiOutlineTrash className="w-4 h-4" /></button>
                                                            </div>
                                                       </div>
                                                  ))}
                                             </div>
                                        )}
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
                                             <input type="text" value={featIcon} onChange={(e) => setFeatIcon(e.target.value)} className={inputClass} placeholder="e.g. FaBolt" required />
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
                                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Features Description</h2>
                                        <div>
                                             <label className={labelClass}>Features Section Sub-description</label>
                                             <textarea value={featDesc} onChange={(e) => setFeatDesc(e.target.value)} rows={2} className={`${inputClass} resize-none`} placeholder="e.g. Our features describe what we do best." />
                                        </div>
                                   </div>

                                   <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-4">
                                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Features Points List</h2>
                                        {featPoints.length === 0 ? (
                                             <p className="text-sm text-gray-400 italic">No features added yet. Use the form to add one.</p>
                                        ) : (
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  {featPoints.map((item, idx) => (
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

                    {activeTab === "course" && (
                         <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-4 max-w-4xl">
                              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">AI UI/UX Course Promotion</h2>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <div>
                                        <label className={labelClass}>Course Section Title</label>
                                        <input type="text" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} className={inputClass} placeholder="e.g. AI UI/UX Course" />
                                   </div>
                                   <div className="grid grid-cols-3 gap-2">
                                        <div>
                                             <label className={labelClass}>Start Title</label>
                                             <input type="text" value={courseStart} onChange={(e) => setCourseStart(e.target.value)} className={inputClass} placeholder="e.g. Transform" />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Mid Title</label>
                                             <input type="text" value={courseMid} onChange={(e) => setCourseMid(e.target.value)} className={inputClass} placeholder="e.g. Your" />
                                        </div>
                                        <div>
                                             <label className={labelClass}>End Title</label>
                                             <input type="text" value={courseEnd} onChange={(e) => setCourseEnd(e.target.value)} className={inputClass} placeholder="e.g. Career" />
                                        </div>
                                   </div>
                              </div>
                              <div>
                                   <label className={labelClass}>Course Section Description</label>
                                   <textarea value={courseDesc} onChange={(e) => setCourseDesc(e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="Course promotion details description..." />
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
                                             <input type="text" value={whyVal} onChange={(e) => setWhyVal(e.target.value)} className={inputClass} placeholder="e.g. 50k" required />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Stat Name</label>
                                             <input type="text" value={whyName} onChange={(e) => setWhyName(e.target.value)} className={inputClass} placeholder="e.g. Active Alumni" required />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Short Description</label>
                                             <textarea value={whyCardDesc} onChange={(e) => setWhyCardDesc(e.target.value)} rows={2} className={`${inputClass} resize-none`} placeholder="Stat card details..." />
                                        </div>
                                        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-sm">
                                             <HiOutlinePlus />
                                             {editingWhyIndex !== null ? "Update Stat" : "Add Stat"}
                                        </button>
                                        {editingWhyIndex !== null && (
                                             <button type="button" onClick={() => { setEditingWhyIndex(null); setWhyVal(""); setWhyName(""); setWhyCardDesc(""); }} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 rounded-lg transition-colors text-sm">Cancel</button>
                                        )}
                                   </form>
                              </div>

                              <div className="lg:col-span-2 space-y-6">
                                   <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-4">
                                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Why Us section headings</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             <div>
                                                  <label className={labelClass}>Section Title</label>
                                                  <input type="text" value={whyTitle} onChange={(e) => setWhyTitle(e.target.value)} className={inputClass} placeholder="e.g. Why Choose Us" />
                                             </div>
                                             <div className="grid grid-cols-3 gap-2">
                                                  <div>
                                                       <label className={labelClass}>Start Title</label>
                                                       <input type="text" value={whyStart} onChange={(e) => setWhyStart(e.target.value)} className={inputClass} placeholder="e.g. Our" />
                                                  </div>
                                                  <div>
                                                       <label className={labelClass}>Mid Title</label>
                                                       <input type="text" value={whyMid} onChange={(e) => setWhyMid(e.target.value)} className={inputClass} placeholder="e.g. Impact" />
                                                  </div>
                                                  <div>
                                                       <label className={labelClass}>End Title</label>
                                                       <input type="text" value={whyEnd} onChange={(e) => setWhyEnd(e.target.value)} className={inputClass} placeholder="e.g. In Numbers" />
                                                  </div>
                                             </div>
                                        </div>
                                   </div>

                                   <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-4">
                                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Stats Cards List</h2>
                                        {whyCards.length === 0 ? (
                                             <p className="text-sm text-gray-400 italic">No stats cards added yet.</p>
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

                    {activeTab === "philosophy" && (
                         <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-4 max-w-4xl">
                              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Company Philosophy</h2>
                              <div>
                                   <label className={labelClass}>Philosophy Title</label>
                                   <input type="text" value={philTitle} onChange={(e) => setPhilTitle(e.target.value)} className={inputClass} placeholder="e.g. Our Philosophy" />
                              </div>
                              <div>
                                   <label className={labelClass}>Philosophy Description</label>
                                   <textarea value={philDesc} onChange={(e) => setPhilDesc(e.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="Philosophy explanation details..." />
                              </div>
                         </div>
                    )}

                    {activeTab === "testimonials" && (
                         <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-4 max-w-4xl">
                              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Testimonials Layout Titles</h2>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                   <div>
                                        <label className={labelClass}>Start Title</label>
                                        <input type="text" value={testStart} onChange={(e) => setTestStart(e.target.value)} className={inputClass} placeholder="e.g. What" />
                                   </div>
                                   <div>
                                        <label className={labelClass}>Mid Title (Highlighted)</label>
                                        <input type="text" value={testMid} onChange={(e) => setTestMid(e.target.value)} className={inputClass} placeholder="e.g. Our Clients" />
                                   </div>
                                   <div>
                                        <label className={labelClass}>End Title</label>
                                        <input type="text" value={testEnd} onChange={(e) => setTestEnd(e.target.value)} className={inputClass} placeholder="e.g. Say" />
                                   </div>
                              </div>
                              <div>
                                   <label className={labelClass}>Section Description</label>
                                   <textarea value={testDesc} onChange={(e) => setTestDesc(e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="Testimonials description..." />
                              </div>
                         </div>
                    )}

                    {activeTab === "blogs" && (
                         <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-4 max-w-4xl">
                              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Related Blogs Configuration</h2>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                   <div className="sm:col-span-3">
                                        <label className={labelClass}>Section General Title</label>
                                        <input type="text" value={blogsTitle} onChange={(e) => setBlogsTitle(e.target.value)} className={inputClass} placeholder="e.g. Related Blogs" />
                                   </div>
                                   <div>
                                        <label className={labelClass}>Start Title</label>
                                        <input type="text" value={blogsStart} onChange={(e) => setBlogsStart(e.target.value)} className={inputClass} placeholder="e.g. Our" />
                                   </div>
                                   <div>
                                        <label className={labelClass}>Mid Title (Highlighted)</label>
                                        <input type="text" value={blogsMid} onChange={(e) => setBlogsMid(e.target.value)} className={inputClass} placeholder="e.g. Latest" />
                                   </div>
                                   <div>
                                        <label className={labelClass}>End Title</label>
                                        <input type="text" value={blogsEnd} onChange={(e) => setBlogsEnd(e.target.value)} className={inputClass} placeholder="e.g. Articles" />
                                   </div>
                              </div>
                              <div>
                                   <label className={labelClass}>Section Description</label>
                                   <textarea value={blogsDesc} onChange={(e) => setBlogsDesc(e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="Section description details..." />
                              </div>
                         </div>
                    )}
               </div>
          </div>
     );
}

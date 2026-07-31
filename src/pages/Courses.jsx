import { useEffect, useState } from "react";
import { getAdminToken } from "../utils/auth.js";
import Breadcrumb from "../components/BreadCrumb.jsx";
import ImageUploader from "../components/ImageUploader.jsx";
import Editor from "../components/Editor.jsx";
import { useToast } from "../context/ToastContext";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export default function Courses() {
     const { showToast } = useToast();
     const [courses, setCourses] = useState([]);
     const [activeTab, setActiveTab] = useState("list");

     // Global configs states
     const [hero, setHero] = useState([{ startheading: "", endheading: "" }]);
     const [card, setCard] = useState({ title: "", description: "", buttonname: "" });
     const [relatedBlogs, setRelatedBlogs] = useState({
          title: "",
          startheading: "",
          midheading: "",
          endheading: "",
          description: ""
     });

     const [savingPageTitle, setSavingPageTitle] = useState(false);
     const [showModal, setShowModal] = useState(false);
     const [editIndex, setEditIndex] = useState(null); // stores index in 'courses' array
     const [editItem, setEditItem] = useState(null);
      const [uploading, setUploading] = useState(false);
 
      // Course Form States
      const [title, setTitle] = useState("");
      const [alt, setAlt] = useState("");
      const [startDate, setStartDate] = useState("");
      const [category, setCategory] = useState("");
      const [overview, setOverview] = useState("");
      const [slug, setSlug] = useState("");
      const [seoTitle, setSeoTitle] = useState("");
      const [seoDescription, setSeoDescription] = useState("");
      const [image, setImage] = useState(null);
      const [schemas, setSchemas] = useState([]);

      // New Promo & Brochure Custom Fields
      const [promoTitle, setPromoTitle] = useState("");
      const [promoDescription, setPromoDescription] = useState("");
      const [promoBenefits, setPromoBenefits] = useState("");
      const [promoSocialBottomContent, setPromoSocialBottomContent] = useState("");
      const [brochureTitle, setBrochureTitle] = useState("");
      const [brochureSubtext, setBrochureSubtext] = useState("");
      const [brochurePhones, setBrochurePhones] = useState("");
      const [brochureLink, setBrochureLink] = useState("");
 
      // Chapter States
      const [chapters, setChapters] = useState([]);
      const [faqTitle, setFaqTitle] = useState("");
      const [faqStartheading, setFaqStartheading] = useState("");
      const [faqMidheading, setFaqMidheading] = useState("");
      const [faqEndheading, setFaqEndheading] = useState("");
      const [faqDescription, setFaqDescription] = useState("");
      const [faqItems, setFaqItems] = useState([]);

      // Short-Term Courses Section States
      const [shortTermTitle, setShortTermTitle] = useState("");
      const [shortTermDescription, setShortTermDescription] = useState("");
      const [shortTermItems, setShortTermItems] = useState([]);

      // Student Case Studies Section States
      const [caseStudiesTitle, setCaseStudiesTitle] = useState("");
      const [caseStudiesDescription, setCaseStudiesDescription] = useState("");
      const [caseStudiesButtonText, setCaseStudiesButtonText] = useState("");
      const [caseStudiesItems, setCaseStudiesItems] = useState([]);

      // Career Domains Section States
      const [careerDomainsTitle, setCareerDomainsTitle] = useState("");
      const [careerDomainsDescription, setCareerDomainsDescription] = useState("");
      const [careerDomainsItems, setCareerDomainsItems] = useState([]);
 
      const fetchCourses = async () => {
           try {
                const res = await fetch(`${API_URL}/courses`);
                if (res.ok) {
                     const data = await res.json();
                     setCourses(data.course || []);
                     if (data.hero) setHero(data.hero);
                     if (data.card) setCard(data.card);
                     if (data.relatedBlogs) setRelatedBlogs(data.relatedBlogs);
                }
           } catch (err) {
                console.error("Error fetching courses data:", err);
           }
      };
 
      useEffect(() => {
           fetchCourses();
      }, []);
 
      const saveGlobalConfig = async () => {
           try {
                setSavingPageTitle(true);
                const res = await fetch(`${API_URL}/courses`, {
                     method: "PUT",
                     headers: {
                          "Content-Type": "application/json",
                          "Authorization": `Bearer ${getAdminToken()}`
                     },
                     body: JSON.stringify({
                          hero,
                          card,
                          relatedBlogs,
                          course: courses
                     })
                });
                if (res.ok) {
                     showToast("Global configuration saved successfully!", "success");
                     fetchCourses();
                } else {
                     showToast("Failed to save global configuration.", "error");
                }
           } catch (err) {
                console.error("Error saving global config:", err);
                showToast("Server error occurred.", "error");
           } finally {
                setSavingPageTitle(false);
           }
      };
 
      const resetForm = () => {
           setTitle("");
           setAlt("");
           setStartDate("");
           setCategory("");
           setOverview("");
           setSlug("");
           setSeoTitle("");
           setSeoDescription("");
           setImage(null);
           setPromoTitle("");
           setPromoDescription("");
           setPromoBenefits("");
           setPromoSocialBottomContent("");
           setBrochureTitle("");
           setBrochureSubtext("");
           setBrochurePhones("");
           setBrochureLink("");
           setShortTermTitle("");
           setShortTermDescription("");
           setShortTermItems([]);
           setCaseStudiesTitle("");
           setCaseStudiesDescription("");
           setCaseStudiesButtonText("");
           setCaseStudiesItems([]);
           setCareerDomainsTitle("");
           setCareerDomainsDescription("");
           setCareerDomainsItems([]);
           setChapters([]);
           setFaqTitle("");
           setFaqStartheading("");
           setFaqMidheading("");
           setFaqEndheading("");
           setFaqDescription("");
           setFaqItems([]);
           setSchemas([]);
           setEditIndex(null);
           setEditItem(null);
      };
 
      const openUpload = () => {
           resetForm();
           setShowModal(true);
      };
 
      const openEdit = (course, index) => {
           resetForm();
           setEditIndex(index);
           setEditItem(course);
 
           setTitle(course.title || "");
           setAlt(course.alt || "");
           setStartDate(course.startdate || "");
           setCategory(course.category || "");
           setOverview(course.overview || "");
           setSlug(course.slug || "");
           setSeoTitle(course.seotitle || "");
           setSeoDescription(course.seodescription || "");
           setPromoTitle(course.promoTitle || "");
           setPromoDescription(course.promoDescription || "");
           setPromoBenefits(course.promoBenefits || "");
           setPromoSocialBottomContent(course.promoSocialBottomContent || "");
           setBrochureTitle(course.brochureTitle || "");
           setBrochureSubtext(course.brochureSubtext || "");
           setBrochurePhones(course.brochurePhones || "");
           setBrochureLink(course.brochureLink || "");
           setShortTermTitle(course.shortTerm?.title || "");
           setShortTermDescription(course.shortTerm?.description || "");
           setShortTermItems(course.shortTerm?.items || []);
           setCaseStudiesTitle(course.caseStudies?.title || "");
           setCaseStudiesDescription(course.caseStudies?.description || "");
           setCaseStudiesButtonText(course.caseStudies?.buttonText || "");
           setCaseStudiesItems(course.caseStudies?.items || []);
           setCareerDomainsTitle(course.careerDomains?.title || "");
           setCareerDomainsDescription(course.careerDomains?.description || "");
           setCareerDomainsItems(course.careerDomains?.items || []);
           setSchemas(course.schemas || []);
 
           if (course.chapter) {
                if (Array.isArray(course.chapter)) {
                     setChapters(course.chapter.map(ch => ({
                          chaptername: ch.chaptername || "",
                          lessons: Array.isArray(ch.lessons)
                               ? ch.lessons.map(l => ({ lessonname: typeof l === "object" ? (l.lessonname || "") : l }))
                               : []
                     })));
                } else {
                     setChapters([{
                          chaptername: course.chapter.chaptername || "",
                          lessons: Array.isArray(course.chapter.lessons)
                               ? course.chapter.lessons.map(l => ({ lessonname: typeof l === "object" ? (l.lessonname || "") : l }))
                               : []
                     }]);
                }
           } else {
                setChapters([]);
           }
 
           const courseFaq = course.faq || {};
           if (Array.isArray(courseFaq)) {
                setFaqItems(courseFaq);
                setFaqTitle("");
                setFaqStartheading("");
                setFaqMidheading("");
                setFaqEndheading("");
                setFaqDescription("");
           } else {
                setFaqTitle(courseFaq.title || "");
                setFaqStartheading(courseFaq.startheading || "");
                setFaqMidheading(courseFaq.midheading || "");
                setFaqEndheading(courseFaq.endheading || "");
                setFaqDescription(courseFaq.description || "");
                setFaqItems(courseFaq.items || []);
           }
 
           setShowModal(true);
      };
 
      const addChapter = () => {
           setChapters([...chapters, { chaptername: "", lessons: [] }]);
      };
 
      const removeChapter = (chapterIdx) => {
           setChapters(chapters.filter((_, idx) => idx !== chapterIdx));
      };
 
      const updateChapterField = (chapterIdx, key, value) => {
           setChapters(prev => prev.map((ch, idx) => idx === chapterIdx ? { ...ch, [key]: value } : ch));
      };
 
      const addLesson = (chapterIdx) => {
           setChapters(prev => prev.map((ch, idx) => {
                if (idx === chapterIdx) {
                     return {
                          ...ch,
                          lessons: [...(ch.lessons || []), { lessonname: "" }]
                     };
                }
                return ch;
           }));
      };
 
      const removeLesson = (chapterIdx, lessonIdx) => {
           setChapters(prev => prev.map((ch, idx) => {
                if (idx === chapterIdx) {
                     return {
                          ...ch,
                          lessons: (ch.lessons || []).filter((_, lIdx) => lIdx !== lessonIdx)
                     };
                }
                return ch;
           }));
      };
 
      const updateLessonField = (chapterIdx, lessonIdx, key, value) => {
           setChapters(prev => prev.map((ch, idx) => {
                if (idx === chapterIdx) {
                     const updatedLessons = [...(ch.lessons || [])];
                     if (typeof key === "object" && key !== null) {
                          updatedLessons[lessonIdx] = { ...updatedLessons[lessonIdx], ...key };
                     } else {
                          updatedLessons[lessonIdx] = { ...updatedLessons[lessonIdx], [key]: value };
                     }
                     return { ...ch, lessons: updatedLessons };
                }
                return ch;
           }));
      };

       const addShortTermItem = () => {
            setShortTermItems([...shortTermItems, { title: "", description: "", duration: "", iconText: "" }]);
       };

       const removeShortTermItem = (itemIdx) => {
            setShortTermItems(shortTermItems.filter((_, idx) => idx !== itemIdx));
       };

       const updateShortTermItemField = (itemIdx, key, value) => {
            setShortTermItems(prev => prev.map((item, idx) => idx === itemIdx ? { ...item, [key]: value } : item));
       };

       const addCaseStudyItem = () => {
            setCaseStudiesItems([...caseStudiesItems, { image: "", alt: "", link: "" }]);
       };

       const removeCaseStudyItem = (itemIdx) => {
            setCaseStudiesItems(caseStudiesItems.filter((_, idx) => idx !== itemIdx));
       };

       const updateCaseStudyItemField = (itemIdx, key, value) => {
            setCaseStudiesItems(prev => prev.map((item, idx) => idx === itemIdx ? { ...item, [key]: value } : item));
       };

        const addCareerDomainItem = () => {
             setCareerDomainsItems([...careerDomainsItems, { name: "", link: "", iconName: "", color: "" }]);
        };

        const removeCareerDomainItem = (itemIdx) => {
             setCareerDomainsItems(careerDomainsItems.filter((_, idx) => idx !== itemIdx));
        };

        const updateCareerDomainItemField = (itemIdx, key, value) => {
             setCareerDomainsItems(prev => prev.map((item, idx) => idx === itemIdx ? { ...item, [key]: value } : item));
        };

      const saveCourse = async () => {
           setUploading(true);
           try {
                const updatedCourse = {
                     title,
                     alt: alt || title,
                     startdate: startDate,
                     category,
                     overview,
                     slug,
                     seotitle: seoTitle || title,
                     seodescription: seoDescription || overview,
                     image: editItem ? editItem.image : "",
                     promoTitle,
                     promoDescription,
                     promoBenefits,
                     promoSocialBottomContent,
                     brochureTitle,
                     brochureSubtext,
                     brochurePhones,
                     brochureLink,
                     faq: {
                          title: faqTitle,
                          startheading: faqStartheading,
                          midheading: faqMidheading,
                          endheading: faqEndheading,
                          description: faqDescription,
                          items: faqItems
                     },
                     chapter: chapters.map(ch => ({
                          chaptername: ch.chaptername,
                          lessons: (ch.lessons || []).map(l => ({
                               lessonname: l.lessonname
                          }))
                     })),
                     shortTerm: {
                          title: shortTermTitle,
                          description: shortTermDescription,
                          items: shortTermItems.map(item => ({
                               title: item.title || "",
                               description: item.description || "",
                               duration: item.duration || "",
                               iconText: item.iconText || ""
                          }))
                     },
                     caseStudies: {
                          title: caseStudiesTitle,
                          description: caseStudiesDescription,
                          buttonText: caseStudiesButtonText,
                          items: caseStudiesItems.map(item => ({
                               image: (item.image && item.image instanceof File) ? "" : (item.image || ""),
                               alt: item.alt || "",
                               link: item.link || ""
                          }))
                     },
                     careerDomains: {
                          title: careerDomainsTitle,
                          description: careerDomainsDescription,
                          items: careerDomainsItems.map(item => ({
                               name: item.name || "",
                               link: item.link || "",
                               iconName: item.iconName || "",
                               color: item.color || ""
                          }))
                     },
                     schemas: schemas
                };
 
                let nextCourses = [...courses];
                if (editIndex !== null) {
                     nextCourses[editIndex] = updatedCourse;
                } else {
                     nextCourses.push(updatedCourse);
                }
 
                const formData = new FormData();
                formData.append("data", JSON.stringify({
                     hero,
                     card,
                     relatedBlogs,
                     course: nextCourses
                }));
 
                if (image) {
                     formData.append(`courseImage_${editIndex !== null ? editIndex : courses.length}`, image);
                }

                caseStudiesItems.forEach((item, itemIdx) => {
                     if (item.image && item.image instanceof File) {
                          formData.append(`course_${editIndex !== null ? editIndex : courses.length}_caseStudy_${itemIdx}`, item.image);
                     }
                });
 
                const res = await fetch(`${API_URL}/courses`, {
                     method: "PUT",
                     headers: {
                          "Authorization": `Bearer ${getAdminToken()}`
                     },
                     body: formData
                });
 
                if (res.ok) {
                     setShowModal(false);
                     fetchCourses();
                } else {
                     const errData = await res.json();
                     showToast(errData.error || "Failed to save course.", "error");
                }
           } catch (err) {
                console.error("Error saving course:", err);
                showToast("Server error occurred.", "error");
           } finally {
                setUploading(false);
           }
      };

     const deleteCourse = async (index) => {
          if (!window.confirm(`Are you sure you want to delete "${courses[index].title}"?`)) return;
          try {
               const nextCourses = courses.filter((_, idx) => idx !== index);
               const res = await fetch(`${API_URL}/courses`, {
                    method: "PUT",
                    headers: {
                         "Content-Type": "application/json",
                         "Authorization": `Bearer ${getAdminToken()}`
                    },
                    body: JSON.stringify({
                         hero,
                         card,
                         relatedBlogs,
                         course: nextCourses
                    })
               });
               if (res.ok) {
                    showToast("Course deleted successfully.", "success");
                    fetchCourses();
               } else {
                    showToast("Failed to delete course.", "error");
               }
          } catch (err) {
               console.error("Error deleting course:", err);
               showToast("Server error occurred.", "error");
          }
     };

     const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all duration-200";
     const labelClass = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5";

     return (
          <div className="min-h-screen bg-gray-50/50 pb-12 font-sans">
               <Breadcrumb />

               {/* Top Navigation / Tabs */}
               <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                         <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Course Manager</h1>
                         <p className="text-sm text-gray-500 mt-1">Manage single-document courses and layout metadata.</p>
                    </div>

                    <button
                         onClick={openUpload}
                         className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shrink-0"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                         </svg>
                         Add Course
                    </button>
               </div>

               <div className="flex border-b border-gray-200 mb-8 max-w-7xl mx-auto px-6 lg:px-10">
                    <button
                         onClick={() => setActiveTab("list")}
                         className={`pb-4 px-4 text-sm font-semibold transition-all cursor-pointer ${activeTab === "list"
                                   ? "border-b-2 border-orange-500 text-orange-600"
                                   : "text-gray-400 hover:text-gray-600"
                              }`}
                    >
                         Courses List
                    </button>
                    <button
                         onClick={() => setActiveTab("config")}
                         className={`pb-4 px-4 text-sm font-semibold transition-all cursor-pointer ${activeTab === "config"
                                   ? "border-b-2 border-orange-500 text-orange-600"
                                   : "text-gray-400 hover:text-gray-600"
                              }`}
                    >
                         Page & CTA Config
                    </button>
               </div>

               {/* TAB CONTENTS */}
               <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    {activeTab === "list" ? (
                         /* COURSE LIST TAB */
                         courses.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-32 bg-white border border-gray-200 rounded-2xl text-center shadow-sm">
                                   <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                   </svg>
                                   <p className="text-lg font-semibold text-gray-800">No courses yet</p>
                                   <p className="text-sm text-gray-450 mt-1">Click "Add Course" above to write your first program</p>
                              </div>
                         ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                   {courses.map((course, index) => (
                                        <div key={course._id || index} className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
                                             <div className="relative overflow-hidden aspect-16/10">
                                                  <img
                                                       src={course.image || "/images/hero-bg.webp"}
                                                       className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-350"
                                                       alt={course.title}
                                                  />
                                                  {course.category && (
                                                       <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-orange-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-orange-100 uppercase tracking-wider shadow-sm">
                                                            {course.category}
                                                       </span>
                                                  )}
                                             </div>

                                             <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                                  <div className="space-y-2">
                                                       <h2 className="font-bold text-gray-900 text-base leading-snug line-clamp-2" title={course.title}>
                                                            {course.title}
                                                       </h2>
                                                       <p className="text-xs text-gray-400 line-clamp-3 leading-normal">
                                                            {course.overview}
                                                       </p>
                                                  </div>

                                                  <div className="flex gap-2.5 pt-2">
                                                       <button
                                                            onClick={() => openEdit(course, index)}
                                                            className="flex-1 flex items-center justify-center gap-1.5 bg-orange-550/10 hover:bg-orange-500/20 text-orange-600 text-xs font-bold py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                                                       >
                                                            Edit
                                                       </button>
                                                       <button
                                                            onClick={() => deleteCourse(index)}
                                                            className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                                                       >
                                                            Delete
                                                       </button>
                                                  </div>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         )
                    ) : (
                         /* CONFIG CONFIGURATION TAB */
                         <div className="space-y-8">
                              {/* Hero Heading Config */}
                              <div className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200/50">
                                   <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5 font-sans">1. Course Hero Title</h2>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Start Heading</label>
                                             <input
                                                  value={hero[0]?.startheading || ""}
                                                  onChange={(e) => {
                                                       const nextHero = [...hero];
                                                       if (!nextHero[0]) nextHero[0] = { startheading: "", endheading: "" };
                                                       nextHero[0].startheading = e.target.value;
                                                       setHero(nextHero);
                                                  }}
                                                  placeholder="e.g. Explore Our"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>End Heading</label>
                                             <input
                                                  value={hero[0]?.endheading || ""}
                                                  onChange={(e) => {
                                                       const nextHero = [...hero];
                                                       if (!nextHero[0]) nextHero[0] = { startheading: "", endheading: "" };
                                                       nextHero[0].endheading = e.target.value;
                                                       setHero(nextHero);
                                                  }}
                                                  placeholder="e.g. Courses"
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>
                              </div>

                              {/* CTA Card Config */}
                              <div className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200/50">
                                   <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5 font-sans">2. CTA Banner Card Config</h2>
                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>CTA Card Title</label>
                                             <input
                                                  value={card?.title || ""}
                                                  onChange={(e) => setCard({ ...card, title: e.target.value })}
                                                  placeholder="e.g. Join Our Learning Platform"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>CTA Button Name</label>
                                             <input
                                                  value={card?.buttonname || ""}
                                                  onChange={(e) => setCard({ ...card, buttonname: e.target.value })}
                                                  placeholder="e.g. Get Started"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5 md:col-span-3">
                                             <label className={labelClass}>CTA Description</label>
                                             <textarea
                                                  value={card?.description || ""}
                                                  onChange={(e) => setCard({ ...card, description: e.target.value })}
                                                  placeholder="Provide short details for learning signups..."
                                                  rows={2}
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>
                              </div>

                              {/* Related Blogs Config */}
                              <div className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200/50">
                                   <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5 font-sans">3. Related Blogs Headings</h2>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Section Title (Subheader)</label>
                                             <input
                                                  value={relatedBlogs?.title || ""}
                                                  onChange={(e) => setRelatedBlogs({ ...relatedBlogs, title: e.target.value })}
                                                  placeholder="e.g. BLOGS"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Start Heading</label>
                                             <input
                                                  value={relatedBlogs?.startheading || ""}
                                                  onChange={(e) => setRelatedBlogs({ ...relatedBlogs, startheading: e.target.value })}
                                                  placeholder="e.g. Our"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Mid Heading</label>
                                             <input
                                                  value={relatedBlogs?.midheading || ""}
                                                  onChange={(e) => setRelatedBlogs({ ...relatedBlogs, midheading: e.target.value })}
                                                  placeholder="e.g. Latest"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>End Heading</label>
                                             <input
                                                  value={relatedBlogs?.endheading || ""}
                                                  onChange={(e) => setRelatedBlogs({ ...relatedBlogs, endheading: e.target.value })}
                                                  placeholder="e.g. Articles"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5 md:col-span-2">
                                             <label className={labelClass}>Section Description</label>
                                             <textarea
                                                  value={relatedBlogs?.description || ""}
                                                  onChange={(e) => setRelatedBlogs({ ...relatedBlogs, description: e.target.value })}
                                                  placeholder="Provide short section description..."
                                                  rows={2}
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>
                              </div>

                              {/* Save Actions */}
                              <div className="flex justify-end pt-4">
                                   <button
                                        onClick={saveGlobalConfig}
                                        disabled={savingPageTitle}
                                        className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                                   >
                                        {savingPageTitle ? "Saving Configurations..." : "Save Global Settings"}
                                   </button>
                              </div>
                         </div>
                    )}
               </div>

               {/* ADD / EDIT MODAL */}
               {showModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                         <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col justify-between">
                              {/* Modal Header */}
                              <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
                                   <div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                             {editItem ? "Edit Course" : "Upload New Course"}
                                        </h2>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                             Fill in basic properties, seo tags, cover image, and curriculum.
                                        </p>
                                   </div>
                                   <button
                                        onClick={() => setShowModal(false)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
                                   >
                                        ✕
                                   </button>
                              </div>

                              {/* Modal Content */}
                              <div className="px-7 py-6 space-y-6">
                                   {/* Basic Info */}
                                   <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Basic Info</p>

                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Course Title</label>
                                             <input
                                                  value={title}
                                                  onChange={(e) => setTitle(e.target.value)}
                                                  placeholder="e.g. Figma UI/UX Masterclass"
                                                  className={inputClass}
                                                  required
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Category</label>
                                             <input
                                                  value={category}
                                                  onChange={(e) => setCategory(e.target.value)}
                                                  placeholder="e.g. Design"
                                                  className={inputClass}
                                                  required
                                             />
                                        </div>
                                   </div>

                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Course Start Date</label>
                                             <input
                                                  value={startDate}
                                                  onChange={(e) => setStartDate(e.target.value)}
                                                  placeholder="e.g. July 1, 2026"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>URL Slug</label>
                                             <input
                                                  value={slug}
                                                  onChange={(e) => setSlug(e.target.value)}
                                                  placeholder="e.g. figma-ui-ux-masterclass"
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>

                                   <div className="space-y-1.5">
                                        <label className={labelClass}>Course Overview / Summary</label>
                                        <textarea
                                             value={overview}
                                             onChange={(e) => setOverview(e.target.value)}
                                             placeholder="Detailed description of the program..."
                                             rows={3}
                                             className={inputClass}
                                        />
                                   </div>

                                   {/* Cover Image */}
                                   <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                             <label className={labelClass}>Course Thumbnail Image</label>
                                             <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Recommended: 800 x 450 px (16:9)</span>
                                        </div>
                                        <ImageUploader setImage={setImage} initialImage={editItem?.image} />
                                        <p className="text-[11px] text-gray-400 mt-1">Suggested size: 800 x 450 px (ideal for standard wide card layout on desktop and mobile).</p>
                                        <div className="mt-2">
                                             <label className={labelClass}>Image Alt Text</label>
                                             <input
                                                  value={alt}
                                                  onChange={(e) => setAlt(e.target.value)}
                                                  placeholder="e.g. Design mockup preview"
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>

                                   {/* Promo & Brochure Custom Fields */}
                                   <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 pt-2">Promo & Brochure Fields</p>

                                   <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Promo Section Heading</label>
                                             <input
                                                  value={promoTitle}
                                                  onChange={(e) => setPromoTitle(e.target.value)}
                                                  placeholder="e.g. UI UX Design Courses in Delhi at Affordable Fees"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Promo Section Description</label>
                                             <textarea
                                                  value={promoDescription}
                                                  onChange={(e) => setPromoDescription(e.target.value)}
                                                  placeholder="The demand for skilled UI/UX designers has increased..."
                                                  rows={3}
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Promo Benefits List (comma-separated)</label>
                                             <textarea
                                                  value={promoBenefits}
                                                  onChange={(e) => setPromoBenefits(e.target.value)}
                                                  placeholder="Training Since 2006, Small Batches, Experienced Faculty..."
                                                  rows={2}
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Left Column Content (Below Social Media Icons - Rich Text Editor)</label>
                                             <Editor
                                                  value={promoSocialBottomContent}
                                                  onChange={(html) => setPromoSocialBottomContent(html)}
                                             />
                                        </div>
                                   </div>

                                   <div className="grid grid-cols-1 gap-4 mt-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Brochure Banner Title</label>
                                             <input
                                                  value={brochureTitle}
                                                  onChange={(e) => setBrochureTitle(e.target.value)}
                                                  placeholder="e.g. Comprehensive Syllabus for UI UX Design Training"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Brochure Banner Subtext</label>
                                             <textarea
                                                  value={brochureSubtext}
                                                  onChange={(e) => setBrochureSubtext(e.target.value)}
                                                  placeholder="Chart your path to a thriving career..."
                                                  rows={2}
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Brochure Banner Contact Phones</label>
                                             <input
                                                  value={brochurePhones}
                                                  onChange={(e) => setBrochurePhones(e.target.value)}
                                                  placeholder="e.g. +91 9911782350 or +91 9811818122"
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>

                                   {/* SEO Configurations */}
                                   <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 pt-2">SEO Configurations</p>

                                   <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>SEO Meta Title</label>
                                             <input
                                                  value={seoTitle}
                                                  onChange={(e) => setSeoTitle(e.target.value)}
                                                  placeholder="Optimized Search Heading"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>SEO Meta Description</label>
                                             <textarea
                                                  value={seoDescription}
                                                  onChange={(e) => setSeoDescription(e.target.value)}
                                                  placeholder="Search results descriptive snippet..."
                                                  rows={2}
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>

                                   {/* Schemas Section */}
                                   <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-150">
                                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200/60 pb-1.5">JSON-LD Schema Scripts</p>
                                        <div className="space-y-3">
                                             {schemas.map((schema, index) => (
                                                  <div key={index} className="flex gap-2 items-start">
                                                       <textarea
                                                            value={schema}
                                                            onChange={e => {
                                                                 const newSchemas = [...schemas];
                                                                 newSchemas[index] = e.target.value;
                                                                 setSchemas(newSchemas);
                                                            }}
                                                            placeholder='e.g. {"@context": "https://schema.org", "@type": "Course", ...}'
                                                            rows={2}
                                                            className={inputClass}
                                                       />
                                                       <button
                                                            type="button"
                                                            onClick={() => {
                                                                 const newSchemas = schemas.filter((_, idx) => idx !== index);
                                                                 setSchemas(newSchemas);
                                                            }}
                                                            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-xs transition-colors cursor-pointer mt-1"
                                                       >
                                                            ✕
                                                       </button>
                                                  </div>
                                             ))}
                                             <button
                                                  type="button"
                                                  onClick={() => setSchemas([...schemas, ''])}
                                                  className="text-orange-500 hover:text-orange-600 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                             >
                                                  + Add Schema Script
                                             </button>
                                        </div>
                                   </div>

                                   {/* Short-Term Courses Section */}
                                   <div className="border-t border-gray-100 pt-4 space-y-4">
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                             <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Short-Term Courses (Slider Section)</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>Short-Term Section Title</label>
                                                  <input
                                                       value={shortTermTitle}
                                                       onChange={(e) => setShortTermTitle(e.target.value)}
                                                       placeholder="e.g. Short-term UX Design Courses"
                                                       className={inputClass}
                                                  />
                                             </div>
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>Short-Term Section Description</label>
                                                  <textarea
                                                       value={shortTermDescription}
                                                       onChange={(e) => setShortTermDescription(e.target.value)}
                                                       placeholder="e.g. Check out the short duration courses for building a strong foundation..."
                                                       rows={2}
                                                       className={inputClass}
                                                  />
                                             </div>
                                        </div>

                                        {/* Short-Term Cards List */}
                                        <div className="space-y-3 pt-2">
                                             <div className="flex items-center justify-between border-b border-gray-50 pb-1.5">
                                                  <p className="text-xs font-bold text-gray-500">Short-Term Cards ({shortTermItems.length})</p>
                                                  <button
                                                       type="button"
                                                       onClick={addShortTermItem}
                                                       className="inline-flex items-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-600 text-[11px] font-bold px-2.5 py-1.5 rounded transition-colors cursor-pointer"
                                                  >
                                                       + Add Short-Term Card
                                                  </button>
                                             </div>

                                             {shortTermItems.map((item, itemIdx) => (
                                                  <div key={itemIdx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 relative group text-left">
                                                       <button
                                                            type="button"
                                                            onClick={() => removeShortTermItem(itemIdx)}
                                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xs transition-colors duration-150 cursor-pointer"
                                                       >
                                                            Remove
                                                       </button>
                                                       
                                                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            <div className="space-y-1">
                                                                 <label className="text-[11px] font-bold text-gray-500">Card Title</label>
                                                                 <input
                                                                      value={item.title || ""}
                                                                      onChange={(e) => updateShortTermItemField(itemIdx, "title", e.target.value)}
                                                                      placeholder="e.g. Adobe XD Course"
                                                                      className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                                 />
                                                            </div>
                                                            <div className="space-y-1">
                                                                 <label className="text-[11px] font-bold text-gray-500">Duration Text</label>
                                                                 <input
                                                                      value={item.duration || ""}
                                                                      onChange={(e) => updateShortTermItemField(itemIdx, "duration", e.target.value)}
                                                                      placeholder="e.g. DURATION: 01 MONTH"
                                                                      className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                                 />
                                                            </div>
                                                       </div>

                                                       <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                                            <div className="sm:col-span-1 space-y-1">
                                                                 <label className="text-[11px] font-bold text-gray-500">Icon / Logo Text</label>
                                                                 <input
                                                                      value={item.iconText || ""}
                                                                      onChange={(e) => updateShortTermItemField(itemIdx, "iconText", e.target.value)}
                                                                      placeholder="e.g. Xd"
                                                                      className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                                 />
                                                            </div>
                                                            <div className="sm:col-span-3 space-y-1">
                                                                 <label className="text-[11px] font-bold text-gray-500">Description</label>
                                                                 <textarea
                                                                      value={item.description || ""}
                                                                      onChange={(e) => updateShortTermItemField(itemIdx, "description", e.target.value)}
                                                                      placeholder="Adobe XD is a superb tool for UI and UX designers..."
                                                                      rows={2}
                                                                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                                 />
                                                            </div>
                                                       </div>
                                                  </div>
                                             ))}

                                             {shortTermItems.length === 0 && (
                                                  <p className="text-xs text-gray-400 text-center py-2 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">No short-term cards added yet. Click "+ Add Short-Term Card" above to build your slider.</p>
                                             )}
                                        </div>

                                   </div>

                                   {/* Student Case Studies Section */}
                                   <div className="border-t border-gray-100 pt-4 space-y-4">
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                             <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Student Case Studies Section</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                  <div className="space-y-1.5">
                                                       <label className={labelClass}>Case Studies Title</label>
                                                       <input
                                                            value={caseStudiesTitle}
                                                            onChange={(e) => setCaseStudiesTitle(e.target.value)}
                                                            placeholder="e.g. UX Case Studies by Our Students"
                                                            className={inputClass}
                                                       />
                                                  </div>
                                                  <div className="space-y-1.5">
                                                       <label className={labelClass}>View All Button Text</label>
                                                       <input
                                                            value={caseStudiesButtonText}
                                                            onChange={(e) => setCaseStudiesButtonText(e.target.value)}
                                                            placeholder="e.g. View All Works"
                                                            className={inputClass}
                                                       />
                                                  </div>
                                             </div>
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>Case Studies Section Description</label>
                                                  <textarea
                                                       value={caseStudiesDescription}
                                                       onChange={(e) => setCaseStudiesDescription(e.target.value)}
                                                       placeholder="e.g. Click and explore our students UX projects done in the institute..."
                                                       rows={2}
                                                       className={inputClass}
                                                  />
                                             </div>
                                        </div>

                                        {/* Case Studies Cards List */}
                                        <div className="space-y-3 pt-2">
                                             <div className="flex items-center justify-between border-b border-gray-50 pb-1.5">
                                                  <p className="text-xs font-bold text-gray-500">Case Study Cards ({caseStudiesItems.length})</p>
                                                  <button
                                                       type="button"
                                                       onClick={addCaseStudyItem}
                                                       className="inline-flex items-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-600 text-[11px] font-bold px-2.5 py-1.5 rounded transition-colors cursor-pointer"
                                                  >
                                                       + Add Case Study Card
                                                  </button>
                                             </div>

                                             {caseStudiesItems.map((item, itemIdx) => (
                                                  <div key={itemIdx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 relative group text-left">
                                                       <button
                                                            type="button"
                                                            onClick={() => removeCaseStudyItem(itemIdx)}
                                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xs transition-colors duration-155 cursor-pointer"
                                                       >
                                                            Remove
                                                       </button>
                                                       
                                                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            <div className="space-y-1">
                                                                 <label className="text-[11px] font-bold text-gray-500">Card Image Alt Text</label>
                                                                 <input
                                                                      value={item.alt || ""}
                                                                      onChange={(e) => updateCaseStudyItemField(itemIdx, "alt", e.target.value)}
                                                                      placeholder="e.g. Case Study 1 mockup"
                                                                      className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                                 />
                                                            </div>
                                                            <div className="space-y-1">
                                                                 <label className="text-[11px] font-bold text-gray-500">Link URL</label>
                                                                 <input
                                                                      value={item.link || ""}
                                                                      onChange={(e) => updateCaseStudyItemField(itemIdx, "link", e.target.value)}
                                                                      placeholder="e.g. # or URL"
                                                                      className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                                 />
                                                            </div>
                                                       </div>

                                                       <div className="space-y-1.5">
                                                            <label className="text-[11px] font-bold text-gray-500">Card Image Upload</label>
                                                            <ImageUploader 
                                                                 setImage={(imgFile) => updateCaseStudyItemField(itemIdx, "image", imgFile)}
                                                                 initialImage={typeof item.image === "string" ? item.image : null}
                                                            />
                                                       </div>
                                                  </div>
                                             ))}

                                             {caseStudiesItems.length === 0 && (
                                                  <p className="text-xs text-gray-400 text-center py-2 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">No case studies added yet. Click "+ Add Case Study Card" above to build your slider.</p>
                                             )}
                                        </div>

                                   </div>

                                   {/* Career Domains Section */}
                                   <div className="border-t border-gray-100 pt-4 space-y-4">
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                             <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Career Domains Section</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>Career Domains Section Title</label>
                                                  <input
                                                       value={careerDomainsTitle}
                                                       onChange={(e) => setCareerDomainsTitle(e.target.value)}
                                                       placeholder="e.g. Explore More Career Domains"
                                                       className={inputClass}
                                                  />
                                             </div>
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>Career Domains Section Description</label>
                                                  <textarea
                                                       value={careerDomainsDescription}
                                                       onChange={(e) => setCareerDomainsDescription(e.target.value)}
                                                       placeholder="e.g. Discover ADMEC's diverse courses to continuously enhance your skills..."
                                                       rows={2}
                                                       className={inputClass}
                                                  />
                                             </div>
                                        </div>

                                        {/* Career Domains Items List */}
                                        <div className="space-y-3 pt-2">
                                             <div className="flex items-center justify-between border-b border-gray-50 pb-1.5">
                                                  <p className="text-xs font-bold text-gray-500">Domain Cards ({careerDomainsItems.length})</p>
                                                  <button
                                                       type="button"
                                                       onClick={addCareerDomainItem}
                                                       className="inline-flex items-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-600 text-[11px] font-bold px-2.5 py-1.5 rounded transition-colors cursor-pointer"
                                                  >
                                                       + Add Domain Card
                                                  </button>
                                             </div>

                                             {careerDomainsItems.map((item, itemIdx) => (
                                                  <div key={itemIdx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 relative group text-left">
                                                       <button
                                                            type="button"
                                                            onClick={() => removeCareerDomainItem(itemIdx)}
                                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xs transition-colors duration-155 cursor-pointer"
                                                       >
                                                            Remove
                                                       </button>
                                                       
                                                       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                                            <div className="space-y-1">
                                                                 <label className="text-[11px] font-bold text-gray-500">Domain Name</label>
                                                                 <input
                                                                      value={item.name || ""}
                                                                      onChange={(e) => updateCareerDomainItemField(itemIdx, "name", e.target.value)}
                                                                      placeholder="e.g. Graphic Design"
                                                                      className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                                 />
                                                            </div>
                                                            <div className="space-y-1">
                                                                 <label className="text-[11px] font-bold text-gray-500">Link URL</label>
                                                                 <input
                                                                      value={item.link || ""}
                                                                      onChange={(e) => updateCareerDomainItemField(itemIdx, "link", e.target.value)}
                                                                      placeholder="e.g. # or URL"
                                                                      className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                                 />
                                                            </div>
                                                            <div className="space-y-1">
                                                                 <label className="text-[11px] font-bold text-gray-500">Select Icon Style</label>
                                                                 <select
                                                                      value={item.iconName || ""}
                                                                      onChange={(e) => updateCareerDomainItemField(itemIdx, "iconName", e.target.value)}
                                                                      className="w-full h-9 px-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs bg-white font-urbanist"
                                                                 >
                                                                      <option value="">-- Choose Icon --</option>
                                                                      <option value="graphic">Graphic Design (Brush)</option>
                                                                      <option value="web">Web Design (Globe)</option>
                                                                      <option value="post">Post Production (Sliders)</option>
                                                                      <option value="analytics">Data Analytics (Line Chart)</option>
                                                                      <option value="cad">CAD & Architecture (Temple/Building)</option>
                                                                      <option value="animation">3D Animation (Cube)</option>
                                                                      <option value="code">Web Development (Code Brackets)</option>
                                                                      <option value="textile">CAD Textile Design (Geometric Pattern)</option>
                                                                      <option value="software">Software Development (Gears)</option>
                                                                      <option value="marketing">Digital Marketing (Megaphone)</option>
                                                                      <option value="ai">Machine Learning & AI (Android Robot)</option>
                                                                      <option value="video">Video Editing (YouTube Play)</option>
                                                                 </select>
                                                            </div>
                                                            <div className="space-y-1">
                                                                 <label className="text-[11px] font-bold text-gray-500">Card Color / Theme</label>
                                                                 <div className="flex gap-1.5 items-center">
                                                                      <input
                                                                           type="color"
                                                                           value={item.color || "#10B981"}
                                                                           onChange={(e) => updateCareerDomainItemField(itemIdx, "color", e.target.value)}
                                                                           className="w-8 h-8 rounded border border-gray-300 p-0 cursor-pointer overflow-hidden"
                                                                      />
                                                                      <input
                                                                           type="text"
                                                                           value={item.color || ""}
                                                                           onChange={(e) => updateCareerDomainItemField(itemIdx, "color", e.target.value)}
                                                                           placeholder="Hex color code"
                                                                           className="flex-1 h-9 px-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                                      />
                                                                 </div>
                                                            </div>
                                                       </div>
                                                  </div>
                                             ))}

                                             {careerDomainsItems.length === 0 && (
                                                  <p className="text-xs text-gray-400 text-center py-2 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">No career domains added yet. Click "+ Add Domain Card" above to build your domain links.</p>
                                             )}
                                        </div>
                                   </div>

                                   {/* Curriculum (Multiple Chapters) */}
                                    <div className="border-t border-gray-100 pt-4 space-y-4">
                                         <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Curriculum Details (Chapters Config)</p>
                                              <button
                                                   type="button"
                                                   onClick={addChapter}
                                                   className="inline-flex items-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                              >
                                                   + Add Chapter
                                              </button>
                                         </div>

                                         {chapters.map((chapter, chIdx) => (
                                              <div key={chIdx} className="bg-gray-50 rounded-2xl p-5 border border-gray-200/60 space-y-5 relative">
                                                   {/* Remove Chapter Button */}
                                                   <button
                                                        type="button"
                                                        onClick={() => removeChapter(chIdx)}
                                                        className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-500 transition-colors cursor-pointer"
                                                   >
                                                        <HiOutlineTrash className="text-sm" />
                                                   </button>

                                                   <div className="text-sm font-bold text-gray-700">Chapter #{chIdx + 1}</div>
                                                   <div className="space-y-1.5">
                                                        <label className={labelClass}>Chapter Name</label>
                                                        <input
                                                             value={chapter.chaptername || ""}
                                                             onChange={(e) => updateChapterField(chIdx, "chaptername", e.target.value)}
                                                             placeholder="e.g. Introduction to Figma"
                                                             className={inputClass}
                                                        />
                                                   </div>

                                                   {/* Lessons list for this chapter */}
                                                   <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                             <p className="text-xs font-bold text-gray-500">Lessons Inside Chapter #{chIdx + 1}</p>
                                                             <button
                                                                  type="button"
                                                                  onClick={() => addLesson(chIdx)}
                                                                  className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                                             >
                                                                  + Add Lesson
                                                             </button>
                                                        </div>

                                                        <div className="space-y-4">
                                                             {chapter.lessons && chapter.lessons.map((lesson, lIdx) => (
                                                                  <div key={lIdx} className="border border-gray-200 rounded-xl p-4 bg-white space-y-4">
                                                                       <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                                                            <span className="text-xs font-semibold text-gray-400 uppercase">Lesson #{lIdx + 1}</span>
                                                                            <button
                                                                                 type="button"
                                                                                 onClick={() => removeLesson(chIdx, lIdx)}
                                                                                 className="text-xs text-red-500 hover:text-red-600 font-bold cursor-pointer"
                                                                            >
                                                                                 Remove
                                                                            </button>
                                                                       </div>

                                                                       <div className="space-y-1.5">
                                                                            <label className={labelClass}>Lesson Title</label>
                                                                            <input
                                                                                 value={lesson.lessonname || ""}
                                                                                 onChange={(e) => updateLessonField(chIdx, lIdx, "lessonname", e.target.value)}
                                                                                 placeholder="e.g. Figma Interface Tour"
                                                                                 className={inputClass}
                                                                            />
                                                                       </div>
                                                                  </div>
                                                             ))}
                                                             {(!chapter.lessons || chapter.lessons.length === 0) && (
                                                                  <div className="text-center py-6 text-gray-305 border border-dashed border-gray-200 rounded-xl bg-white">
                                                                       <p className="text-xs text-gray-400">No lessons added to this chapter. Add one above.</p>
                                                                  </div>
                                                             )}
                                                        </div>
                                                   </div>
                                              </div>
                                         ))}

                                         {chapters.length === 0 && (
                                              <div className="text-center py-8 text-gray-300 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                                                   <p className="text-xs text-gray-400">No chapters added to curriculum. Add one above.</p>
                                              </div>
                                         )}
                                    </div>
                                   {/* FAQ Section */}
                                   <div className="space-y-4 border-t border-gray-100 pt-4">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Frequently Asked Questions (FAQs)</p>

                                        {/* FAQ Headings Inputs */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>FAQ Section Title</label>
                                                  <input
                                                       value={faqTitle}
                                                       onChange={(e) => setFaqTitle(e.target.value)}
                                                       placeholder="e.g. FAQ"
                                                       className={inputClass}
                                                  />
                                             </div>
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>FAQ Start Heading</label>
                                                  <input
                                                       value={faqStartheading}
                                                       onChange={(e) => setFaqStartheading(e.target.value)}
                                                       placeholder="e.g. All You"
                                                       className={inputClass}
                                                  />
                                             </div>
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>FAQ Mid Heading</label>
                                                  <input
                                                       value={faqMidheading}
                                                       onChange={(e) => setFaqMidheading(e.target.value)}
                                                       placeholder="e.g. Need"
                                                       className={inputClass}
                                                  />
                                             </div>
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>FAQ End Heading</label>
                                                  <input
                                                       value={faqEndheading}
                                                       onChange={(e) => setFaqEndheading(e.target.value)}
                                                       placeholder="e.g. To Know"
                                                       className={inputClass}
                                                  />
                                             </div>
                                             <div className="space-y-1.5 sm:col-span-2">
                                                  <label className={labelClass}>FAQ Section Description</label>
                                                  <textarea
                                                       value={faqDescription}
                                                       onChange={(e) => setFaqDescription(e.target.value)}
                                                       placeholder="FAQ section description..."
                                                       rows={2}
                                                       className={inputClass}
                                                  />
                                             </div>
                                        </div>

                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1 mt-4">FAQ Q&A Items</p>
                                        <div className="space-y-4">
                                             {faqItems.map((item, index) => (
                                                  <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative space-y-3">
                                                       <button
                                                            type="button"
                                                            onClick={() => {
                                                                 setFaqItems(prev => prev.filter((_, i) => i !== index));
                                                            }}
                                                            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-500 transition-colors cursor-pointer"
                                                       >
                                                            <HiOutlineTrash className="text-sm" />
                                                       </button>
                                                       <div className="space-y-1.5 pr-8">
                                                            <label className={labelClass}>Question {index + 1}</label>
                                                            <input
                                                                 value={item.ques}
                                                                 onChange={(e) => {
                                                                      const val = e.target.value;
                                                                      setFaqItems(prev => prev.map((f, i) => i === index ? { ...f, ques: val } : f));
                                                                 }}
                                                                 placeholder="e.g. What is the duration?"
                                                                 className={inputClass}
                                                                 required
                                                            />
                                                       </div>
                                                       <div className="space-y-1.5 pr-8">
                                                            <label className={labelClass}>Answer {index + 1}</label>
                                                            <textarea
                                                                 value={item.ans}
                                                                 onChange={(e) => {
                                                                      const val = e.target.value;
                                                                      setFaqItems(prev => prev.map((f, i) => i === index ? { ...f, ans: val } : f));
                                                                 }}
                                                                 placeholder="Answer content..."
                                                                 rows={2}
                                                                 className={inputClass}
                                                                 required
                                                            />
                                                       </div>
                                                  </div>
                                             ))}

                                             <button
                                                  type="button"
                                                  onClick={() => {
                                                       setFaqItems(prev => [...prev, { ques: "", ans: "" }]);
                                                  }}
                                                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-orange-500 hover:border-orange-500 transition-all font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer bg-white"
                                             >
                                                  <HiOutlinePlus className="text-sm" />
                                                  Add FAQ Item
                                             </button>
                                        </div>
                                   </div>
                              </div>

                              {/* Modal Footer */}
                              <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-gray-100 bg-white sticky bottom-0 rounded-b-2xl">
                                   <button
                                        onClick={() => setShowModal(false)}
                                        className="px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                                   >
                                        Cancel
                                   </button>
                                   <button
                                        onClick={saveCourse}
                                        disabled={uploading || !title}
                                        className={`px-6 py-2.5 text-sm font-semibold text-white rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 ${uploading || !title
                                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                                                  : "bg-orange-500 hover:bg-orange-600 shadow-orange-200"
                                             }`}
                                   >
                                        {uploading ? (
                                             <>
                                                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                  <span>Saving Course...</span>
                                             </>
                                        ) : (
                                             <span>{editItem ? "Save Changes" : "Publish Course"}</span>
                                        )}
                                   </button>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
}
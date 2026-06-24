import { useEffect, useState } from "react";
import { getAdminToken } from "../utils/auth.js";
import Breadcrumb from "../components/BreadCrumb.jsx";
import ImageUploader from "../components/ImageUploader.jsx";
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
     const [author, setAuthor] = useState("");
     const [courseLength, setCourseLength] = useState("");
     const [students, setStudents] = useState("");
     const [level, setLevel] = useState("");
     const [totalLessons, setTotalLessons] = useState("");
     const [startDate, setStartDate] = useState("");
     const [duration, setDuration] = useState("");
     const [category, setCategory] = useState("");
     const [overview, setOverview] = useState("");
     const [slug, setSlug] = useState("");
     const [seoTitle, setSeoTitle] = useState("");
     const [seoDescription, setSeoDescription] = useState("");
     const [image, setImage] = useState(null);

     // Chapter States
     const [chaptername, setChaptername] = useState("");
     const [chapterTotalLessons, setChapterTotalLessons] = useState("");
     const [lessons, setLessons] = useState([]);
     const [faqTitle, setFaqTitle] = useState("");
     const [faqStartheading, setFaqStartheading] = useState("");
     const [faqMidheading, setFaqMidheading] = useState("");
     const [faqEndheading, setFaqEndheading] = useState("");
     const [faqDescription, setFaqDescription] = useState("");
     const [faqItems, setFaqItems] = useState([]);

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
          setAuthor("");
          setCourseLength("");
          setStudents("");
          setLevel("");
          setTotalLessons("");
          setStartDate("");
          setDuration("");
          setCategory("");
          setOverview("");
          setSlug("");
          setSeoTitle("");
          setSeoDescription("");
          setImage(null);
          setChaptername("");
          setChapterTotalLessons("");
          setLessons([]);
          setFaqTitle("");
          setFaqStartheading("");
          setFaqMidheading("");
          setFaqEndheading("");
          setFaqDescription("");
          setFaqItems([]);
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
          setAuthor(course.author || "");
          setCourseLength(course.courselength || "");
          setStudents(course.totalstudents || "");
          setLevel(course.levels || "");
          setTotalLessons(course.totallessons || "");
          setStartDate(course.startdate || "");
          setDuration(course.duration || "");
          setCategory(course.category || "");
          setOverview(course.overview || "");
          setSlug(course.slug || "");
          setSeoTitle(course.seotitle || "");
          setSeoDescription(course.seodescription || "");

          if (course.chapter) {
               setChaptername(course.chapter.chaptername || "");
               setChapterTotalLessons(course.chapter.totallessons || "");
               setLessons(course.chapter.lessons || []);
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

     const addLesson = () => {
          setLessons([...lessons, { lessonname: "", duration: "", video: { videourl: "", duration: "" }, file: null, videoName: "" }]);
     };

     const updateLessonField = (index, key, value) => {
          setLessons(prev => {
               const updated = [...prev];
               if (typeof key === "function") {
                    updated[index] = key(updated[index]);
               } else if (typeof key === "object" && key !== null) {
                    updated[index] = { ...updated[index], ...key };
               } else {
                    updated[index] = { ...updated[index], [key]: value };
               }
               return updated;
          });
     };

     const uploadVideoDirect = async (file, index) => {
          try {
               updateLessonField(index, { uploading: true, uploadProgress: 0, uploadError: null, videoName: file.name });

               // Create a clean SEO friendly public ID for Cloudinary
               const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
               const seoName = baseName
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "") || "video";

               // Fetch upload signature from backend
               const signatureRes = await fetch(`${API_URL}/cloudinary-signature?folder=courses/videos&public_id=${seoName}`);
               if (!signatureRes.ok) {
                    throw new Error("Failed to generate upload signature from server.");
               }
               const { signature, timestamp, apiKey, cloudName, folder } = await signatureRes.json();

               // Prepare FormData for Cloudinary
               const formData = new FormData();
               formData.append("file", file);
               formData.append("signature", signature);
               formData.append("timestamp", timestamp);
               formData.append("api_key", apiKey);
               formData.append("folder", folder);
               formData.append("public_id", seoName);

               const xhr = new XMLHttpRequest();

               const uploadPromise = new Promise((resolve, reject) => {
                    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);

                    xhr.upload.onprogress = (event) => {
                         if (event.lengthComputable) {
                              const percent = Math.round((event.loaded / event.total) * 100);
                              updateLessonField(index, { uploadProgress: percent });
                         }
                    };

                    xhr.onload = () => {
                         if (xhr.status === 200) {
                              const data = JSON.parse(xhr.responseText);
                              resolve(data.secure_url);
                         } else {
                              reject(new Error(`Cloudinary responded with status ${xhr.status}`));
                         }
                    };

                    xhr.onerror = () => {
                         reject(new Error("Network error during direct upload."));
                    };

                    xhr.send(formData);
               });

               const secureUrl = await uploadPromise;

               // Update state with Cloudinary secure URL and clear file pointer
               updateLessonField(index, (prevLesson) => ({
                    ...prevLesson,
                    video: {
                         ...(prevLesson.video || {}),
                         videourl: secureUrl
                    },
                    file: null,
                    videoName: file.name,
                    uploading: false,
                    uploadProgress: 100
               }));

               showToast("Video uploaded successfully to Cloudinary!", "success");
          } catch (err) {
               console.error("Direct upload error:", err);
               updateLessonField(index, { uploading: false, uploadError: err.message });
               showToast(`Video upload failed: ${err.message}`, "error");
          }
     };

     const removeLesson = (index) => {
          setLessons(lessons.filter((_, idx) => idx !== index));
     };

     const saveCourse = async () => {
          setUploading(true);
          try {
               const updatedCourse = {
                    title,
                    alt: alt || title,
                    author,
                    courselength: courseLength,
                    totalstudents: students,
                    levels: level,
                    totallessons: totalLessons,
                    startdate: startDate,
                    duration,
                    category,
                    overview,
                    slug,
                    seotitle: seoTitle || title,
                    seodescription: seoDescription || overview,
                    image: editItem ? editItem.image : "",
                    faq: {
                         title: faqTitle,
                         startheading: faqStartheading,
                         midheading: faqMidheading,
                         endheading: faqEndheading,
                         description: faqDescription,
                         items: faqItems
                    },
                    chapter: {
                         chaptername,
                         totallessons: chapterTotalLessons,
                         lessons: lessons.map(l => ({
                              lessonname: l.lessonname,
                              video: {
                                   videourl: l.video?.videourl || "",
                                   duration: l.video?.duration || l.duration
                              }
                         }))
                    }
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

               const res = await fetch(`${API_URL}/courses`, {
                    method: "PUT",
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

     const isAnyVideoUploading = lessons.some(l => l.uploading);

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

                                                  <div className="flex items-center gap-3 text-[11px] text-gray-400 border-y border-gray-100 py-3 font-medium">
                                                       <span className="flex items-center gap-1">
                                                            📅 {course.courselength}
                                                       </span>
                                                       <span className="flex items-center gap-1">
                                                            👥 {course.totalstudents}
                                                       </span>
                                                       <span className="ml-auto bg-gray-550/10 text-orange-600 font-semibold px-2 py-0.5 rounded-md">
                                                            {course.levels}
                                                       </span>
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
                                             <label className={labelClass}>Author Name</label>
                                             <input
                                                  value={author}
                                                  onChange={(e) => setAuthor(e.target.value)}
                                                  placeholder="e.g. Jane Doe"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Course Duration (Total Hours)</label>
                                             <input
                                                  value={duration}
                                                  onChange={(e) => setDuration(e.target.value)}
                                                  placeholder="e.g. 30h 45m"
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>

                                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Course Length (Weeks/Months)</label>
                                             <input
                                                  value={courseLength}
                                                  onChange={(e) => setCourseLength(e.target.value)}
                                                  placeholder="e.g. 12 Weeks"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Total Students Enrolled</label>
                                             <input
                                                  value={students}
                                                  onChange={(e) => setStudents(e.target.value)}
                                                  placeholder="e.g. 1,200"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Target Level</label>
                                             <input
                                                  value={level}
                                                  onChange={(e) => setLevel(e.target.value)}
                                                  placeholder="e.g. All Levels"
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>

                                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Total Lessons</label>
                                             <input
                                                  value={totalLessons}
                                                  onChange={(e) => setTotalLessons(e.target.value)}
                                                  placeholder="e.g. 45"
                                                  className={inputClass}
                                             />
                                        </div>
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
                                        <label className={labelClass}>Course Thumbnail Image</label>
                                        <ImageUploader setImage={setImage} initialImage={editItem?.image} />
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

                                   {/* Curriculum (Single Chapter) */}
                                   <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 pt-2">Curriculum Details (Chapter Config)</p>

                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-2xl shadow-sm shadow-gray-150/40 p-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Chapter Name</label>
                                             <input
                                                  value={chaptername}
                                                  onChange={(e) => setChaptername(e.target.value)}
                                                  placeholder="e.g. Introduction to Figma"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Chapter Total Lessons Count</label>
                                             <input
                                                  value={chapterTotalLessons}
                                                  onChange={(e) => setChapterTotalLessons(e.target.value)}
                                                  placeholder="e.g. 5"
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>

                                   {/* Chapter Lessons List */}
                                   <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                             <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Lessons Inside Chapter</p>
                                             <button
                                                  onClick={addLesson}
                                                  className="inline-flex items-center gap-1 bg-emerald-555/10 hover:bg-emerald-500/20 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                             >
                                                  + Add Lesson
                                             </button>
                                        </div>

                                        <div className="space-y-4">
                                             {lessons.map((lesson, idx) => (
                                                  <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-white space-y-4">
                                                       <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                                            <span className="text-xs font-semibold text-gray-400 uppercase">Lesson #{idx + 1}</span>
                                                            <button
                                                                 onClick={() => removeLesson(idx)}
                                                                 className="text-xs text-red-500 hover:text-red-600 font-bold cursor-pointer"
                                                            >
                                                                 Remove
                                                            </button>
                                                       </div>

                                                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div className="space-y-1.5">
                                                                 <label className={labelClass}>Lesson Title</label>
                                                                 <input
                                                                      value={lesson.lessonname || ""}
                                                                      onChange={(e) => updateLessonField(idx, "lessonname", e.target.value)}
                                                                      placeholder="e.g. Figma Interface Tour"
                                                                      className={inputClass}
                                                                 />
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                 <label className={labelClass}>Lesson Duration</label>
                                                                 <input
                                                                      value={lesson.video?.duration || lesson.duration || ""}
                                                                      onChange={(e) => updateLessonField(idx, "duration", e.target.value)}
                                                                      placeholder="e.g. 10:15"
                                                                      className={inputClass}
                                                                 />
                                                            </div>
                                                       </div>

                                                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                                            <div className="space-y-1.5">
                                                                 <label className={labelClass}>Lesson Video File (.mp4, .webm)</label>
                                                                 <input
                                                                      type="file"
                                                                      accept="video/*"
                                                                      disabled={lesson.uploading}
                                                                      onChange={(e) => {
                                                                           const file = e.target.files?.[0];
                                                                           if (file) {
                                                                                uploadVideoDirect(file, idx);
                                                                           }
                                                                      }}
                                                                      className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                 />
                                                            </div>

                                                            <div className="flex flex-col justify-end text-xs text-gray-500 pb-1">
                                                                 {lesson.uploading ? (
                                                                      <div className="w-full space-y-1.5">
                                                                           <div className="flex justify-between text-xs font-semibold text-orange-600">
                                                                                <span>Uploading to Cloudinary...</span>
                                                                                <span>{lesson.uploadProgress || 0}%</span>
                                                                           </div>
                                                                           <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                                                                <div
                                                                                     className="bg-orange-500 h-full transition-all duration-200"
                                                                                     style={{ width: `${lesson.uploadProgress || 0}%` }}
                                                                                />
                                                                           </div>
                                                                      </div>
                                                                 ) : lesson.uploadError ? (
                                                                      <span className="text-red-500 font-medium">Error: {lesson.uploadError}</span>
                                                                 ) : lesson.video?.videourl ? (
                                                                      <span className="text-green-600 truncate font-medium" title={lesson.video.videourl}>
                                                                           Uploaded URL: {lesson.video.videourl}
                                                                      </span>
                                                                 ) : (
                                                                      <span className="text-gray-400">No video selected or uploaded yet.</span>
                                                                 )}
                                                            </div>
                                                       </div>
                                                  </div>
                                             ))}
                                             {lessons.length === 0 && (
                                                  <div className="text-center py-6 text-gray-305 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                                       <p className="text-xs text-gray-400">No lessons added to curriculum. Add one above.</p>
                                                  </div>
                                             )}
                                        </div>
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
                                        disabled={uploading || !title || isAnyVideoUploading}
                                        className={`px-6 py-2.5 text-sm font-semibold text-white rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 ${uploading || !title || isAnyVideoUploading
                                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                                                  : "bg-orange-500 hover:bg-orange-600 shadow-orange-200"
                                             }`}
                                   >
                                        {uploading ? (
                                             <>
                                                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                  <span>Saving Course...</span>
                                             </>
                                        ) : isAnyVideoUploading ? (
                                             <>
                                                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                  <span>Uploading Videos...</span>
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
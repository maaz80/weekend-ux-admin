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
      const [duration, setDuration] = useState("");
      const [mode, setMode] = useState("");
      const [batchSize, setBatchSize] = useState("");
      const [price, setPrice] = useState("");
      const [socialProof, setSocialProof] = useState([]);
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

      // Skills You Will Learn Section States
      const [skillsYouWillLearnTitle, setSkillsYouWillLearnTitle] = useState("");
      const [skillsYouWillLearnItems, setSkillsYouWillLearnItems] = useState([]);

      // Meet The Trainers Section States
      const [trainersTitle, setTrainersTitle] = useState("");
      const [trainersSubtitle, setTrainersSubtitle] = useState("");
      const [trainersItems, setTrainersItems] = useState([]);

      // Job Roles After Course Section States
      const [jobRolesTag, setJobRolesTag] = useState("");
      const [jobRolesTitle, setJobRolesTitle] = useState("");
      const [jobRolesDescription, setJobRolesDescription] = useState("");
      const [jobRolesItems, setJobRolesItems] = useState([]);

      // Hiring Partners Section States
      const [hiringPartnersTitle, setHiringPartnersTitle] = useState("");
      const [hiringPartnersSubtitle, setHiringPartnersSubtitle] = useState("");
      const [hiringPartnersItems, setHiringPartnersItems] = useState([]);

      // Choose Your Learning Section States
      const [chooseLearningTitle, setChooseLearningTitle] = useState("");
      const [chooseLearningSubtitle, setChooseLearningSubtitle] = useState("");
      const [chooseEmiBannerTitle, setChooseEmiBannerTitle] = useState("");
      const [chooseEmiBannerSubtitle, setChooseEmiBannerSubtitle] = useState("");
      const [chooseEmiPoints, setChooseEmiPoints] = useState([]);
      const [chooseScholarshipDiscount, setChooseScholarshipDiscount] = useState("");
      const [chooseScholarshipMeritTitle, setChooseScholarshipMeritTitle] = useState("");
      const [chooseScholarshipMeritSubtitle, setChooseScholarshipMeritSubtitle] = useState("");
      const [chooseScholarshipPoints, setChooseScholarshipPoints] = useState([]);
      const [chooseBatchItems, setChooseBatchItems] = useState([]);

      // Why Choose Us Section States
      const [whyChooseUsTitle, setWhyChooseUsTitle] = useState("");
      const [whyChooseUsSubtitle, setWhyChooseUsSubtitle] = useState("");
      const [whyChooseUsItems, setWhyChooseUsItems] = useState([]);

      // Ready To Start Journey CTA Section States
      const [readyToStartTitle, setReadyToStartTitle] = useState("");
      const [readyToStartSubtitle, setReadyToStartSubtitle] = useState("");
      const [readyToStartBtn1Text, setReadyToStartBtn1Text] = useState("");
      const [readyToStartBtn1Link, setReadyToStartBtn1Link] = useState("");
      const [readyToStartBtn2Text, setReadyToStartBtn2Text] = useState("");
      const [readyToStartBtn2Link, setReadyToStartBtn2Link] = useState("");

      // Course Videos Section States
      const [videos, setVideos] = useState([]);
      const [showVideoModal, setShowVideoModal] = useState(false);

      // Zoom Live Class Modal & Dispatch States
      const [showMeetModal, setShowMeetModal] = useState(false);
      const [selectedCourseForMeet, setSelectedCourseForMeet] = useState("ALL");
      const [meetUrl, setMeetUrl] = useState("");
      const [startUrl, setStartUrl] = useState("");
      const [zoomMeetingId, setZoomMeetingId] = useState("");
      const [zoomPasscode, setZoomPasscode] = useState("");
      const [meetTitle, setMeetTitle] = useState("Live Interactive UI/UX Zoom Class");
      const [meetScheduledAt, setMeetScheduledAt] = useState("Today at 7:00 PM");
      const [meetInstructions, setMeetInstructions] = useState("");
      const [meetSaveToCourse, setMeetSaveToCourse] = useState(true);
      const [sendingMeetEmail, setSendingMeetEmail] = useState(false);
      const [generatingZoomApi, setGeneratingZoomApi] = useState(false);

      const handleMeetUrlChange = (url) => {
           setMeetUrl(url);
           if (url) {
                const idMatch = url.match(/\/(?:j|wc\/join)\/(\d+)/);
                if (idMatch && idMatch[1]) {
                     setZoomMeetingId(idMatch[1]);
                }
                const pwdMatch = url.match(/[?&]pwd=([^&]+)/);
                if (pwdMatch && pwdMatch[1]) {
                     setZoomPasscode(pwdMatch[1]);
                }
           }
      };

      const handleAutoGenerateZoomLink = async () => {
           setGeneratingZoomApi(true);
           try {
                const res = await fetch(`${API_URL}/admin/create-zoom-meeting`, {
                     method: "POST",
                     headers: { "Content-Type": "application/json" },
                     body: JSON.stringify({
                          topic: meetTitle
                     })
                });
                const data = await res.json();
                if (data.success && data.meetUrl) {
                     setMeetUrl(data.meetUrl);
                     if (data.startUrl) setStartUrl(data.startUrl);
                     setZoomMeetingId(data.zoomMeetingId || "");
                     setZoomPasscode(data.passcode || "");
                     showToast("⚡ Real Zoom meeting generated via Zoom API!", "success");
                } else if (data.needCredentials) {
                     showToast("ℹ️ Configure ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET in backend .env for 1-click API generation, or paste real link below.", "info");
                } else {
                     showToast(data.error || "Failed to generate Zoom meeting.", "error");
                }
           } catch (err) {
                showToast("Failed to connect to Zoom API. Paste your real Zoom URL below.", "error");
           } finally {
                setGeneratingZoomApi(false);
           }
      };

      const generateInstantMeetUrl = () => {
           const meetingId = Math.floor(10000000000 + Math.random() * 90000000000).toString();
           const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
           const pwd = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
           const url = `https://zoom.us/j/${meetingId}?pwd=${pwd}`;
           setZoomMeetingId(meetingId);
           setZoomPasscode(pwd);
           setMeetUrl(url);
           return url;
      };

      const handleCourseSelectionChange = (courseVal) => {
           setSelectedCourseForMeet(courseVal);
           if (courseVal === "ALL") {
                setMeetTitle("Live Interactive UI/UX Zoom Class");
           } else {
                const found = courses.find(c => (c._id && c._id.toString() === courseVal) || (c.slug === courseVal));
                if (found && found.title) {
                     setMeetTitle(`Live Zoom Session: ${found.title}`);
                } else {
                     setMeetTitle("Live Interactive Zoom Session");
                }
           }
      };

      const openMeetModal = (courseIdOrSlug = "ALL") => {
           handleCourseSelectionChange(courseIdOrSlug);
           setMeetUrl("");
           setZoomMeetingId("");
           setZoomPasscode("");
           setMeetInstructions("");
           setShowMeetModal(true);
      };

      const handleSendMeetLink = async (e) => {
           e.preventDefault();
           if (!meetUrl) {
                showToast("Please enter a valid Zoom meeting link.", "error");
                return;
           }

           setSendingMeetEmail(true);
           try {
                const targetCourseObj = courses.find(c => (c._id && c._id.toString() === selectedCourseForMeet) || (c.slug === selectedCourseForMeet));
                
                const res = await fetch(`${API_URL}/admin/send-meet-link`, {
                     method: "POST",
                     headers: {
                          "Content-Type": "application/json",
                          "Authorization": `Bearer ${getAdminToken()}`
                     },
                     body: JSON.stringify({
                          courseId: selectedCourseForMeet,
                          courseSlug: targetCourseObj?.slug || "",
                          courseTitle: targetCourseObj?.title || "All Courses",
                          meetUrl,
                          zoomMeetingId,
                          passcode: zoomPasscode,
                          title: meetTitle,
                          scheduledAt: meetScheduledAt,
                          instructions: meetInstructions,
                          saveToCourse: meetSaveToCourse
                     })
                });

                const data = await res.json();
                if (res.ok && data.success) {
                     showToast(data.message || `Zoom link emailed to ${data.sentCount} enrolled students!`, "success");
                     setShowMeetModal(false);
                     setMeetUrl("");
                     setZoomMeetingId("");
                     setZoomPasscode("");
                     setMeetInstructions("");
                     setMeetScheduledAt("Today at 7:00 PM");
                     fetchCourses();
                } else {
                     showToast(data.error || "Failed to send Zoom meeting emails.", "error");
                }
           } catch (err) {
                console.error("Error sending Zoom emails:", err);
                showToast("Server error occurred.", "error");
           } finally {
                setSendingMeetEmail(false);
           }
      };

      const handleClearLiveClass = async (courseObj) => {
           if (!window.confirm(`End live class for "${courseObj.title}"?`)) return;
           try {
                const res = await fetch(`${API_URL}/admin/clear-live-class`, {
                     method: "POST",
                     headers: {
                          "Content-Type": "application/json",
                          "Authorization": `Bearer ${getAdminToken()}`
                     },
                     body: JSON.stringify({
                          courseId: courseObj._id,
                          courseSlug: courseObj.slug
                     })
                });
                if (res.ok) {
                     showToast("Live class ended.", "success");
                     fetchCourses();
                } else {
                     showToast("Failed to clear live class.", "error");
                }
           } catch (err) {
                console.error("Error clearing live class:", err);
                showToast("Server error occurred.", "error");
           }
      };

      const addVideoItem = () => {
           setVideos(prev => [...prev, { video: "", alt: "", title: "", thumbnail: "", uploading: false, progress: 0, uploadError: "" }]);
      };

      const removeVideoItem = (vIdx) => {
           setVideos(prev => prev.filter((_, idx) => idx !== vIdx));
      };

      const updateVideoItemField = (vIdx, key, value) => {
           setVideos(prev => prev.map((v, idx) => idx === vIdx ? { ...v, [key]: value } : v));
      };

      const uploadVideoFile = (file, onProgress) => {
           return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                const formData = new FormData();
                formData.append("video", file);

                xhr.upload.onprogress = (e) => {
                     if (e.lengthComputable) {
                          const percent = Math.round((e.loaded / e.total) * 100);
                          onProgress(percent);
                     }
                };

                xhr.onload = () => {
                     if (xhr.status >= 200 && xhr.status < 300) {
                          try {
                               const response = JSON.parse(xhr.responseText);
                               if (response.url) {
                                    resolve(response.url);
                               } else {
                                    reject(new Error(response.error || "Upload failed"));
                               }
                          } catch (err) {
                               reject(err);
                          }
                     } else {
                          try {
                               const response = JSON.parse(xhr.responseText);
                               reject(new Error(response.error || `Upload failed with status ${xhr.status}`));
                          } catch {
                               reject(new Error(`Upload failed with status ${xhr.status}`));
                          }
                     }
                };

                xhr.onerror = () => {
                     reject(new Error("Network error during video upload"));
                };

                xhr.open("POST", `${API_URL}/admin/upload-video`);
                const token = getAdminToken();
                if (token) {
                     xhr.setRequestHeader("Authorization", `Bearer ${token}`);
                }
                xhr.send(formData);
           });
      };

      const handleVideoFileUpload = async (vIdx, file) => {
           if (!file) return;

           setVideos(prev => prev.map((v, idx) => idx === vIdx ? { ...v, uploading: true, progress: 0, uploadError: "" } : v));

           try {
                const videoUrl = await uploadVideoFile(file, (percent) => {
                     setVideos(prev => prev.map((v, idx) => idx === vIdx ? { ...v, progress: percent } : v));
                });

                setVideos(prev => prev.map((v, idx) => idx === vIdx ? { ...v, video: videoUrl, uploading: false, progress: 100, uploadError: "" } : v));
                showToast("Video uploaded successfully!", "success");
           } catch (err) {
                console.error("Video upload failed:", err);
                setVideos(prev => prev.map((v, idx) => idx === vIdx ? { ...v, uploading: false, uploadError: err.message || "Upload failed" } : v));
                showToast(`Video upload failed: ${err.message || "Upload error"}`, "error");
           }
      };
 
      const fetchCourses = async () => {
           try {
                const res = await fetch(`${API_URL}/courses`);
                if (res.ok) {
                     const data = await res.json();
                     setCourses(data.course || []);
                     if (data.hero) setHero(data.hero);
                     if (data.card) setCard(data.card);
                     if (data.relatedBlogs) setRelatedBlogs(data.relatedBlogs);

                     const csData = data.caseStudies || data.course?.[0]?.caseStudies;
                     if (csData) {
                          setCaseStudiesTitle(csData.title || "");
                          setCaseStudiesDescription(csData.description || "");
                          setCaseStudiesButtonText(csData.buttonText || "");
                          setCaseStudiesItems(csData.items || []);
                     }

                     const cdData = data.careerDomains || data.course?.[0]?.careerDomains;
                     if (cdData) {
                          setCareerDomainsTitle(cdData.title || "");
                          setCareerDomainsDescription(cdData.description || "");
                          setCareerDomainsItems(cdData.items || []);
                     }
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
                const formData = new FormData();
                const globalCaseStudies = {
                     title: caseStudiesTitle,
                     description: caseStudiesDescription,
                     buttonText: caseStudiesButtonText,
                     items: caseStudiesItems.map(item => ({
                          image: (item.image && item.image instanceof File) ? "" : (item.image || ""),
                          alt: item.alt || "",
                          link: item.link || ""
                     }))
                };
                const globalCareerDomains = {
                     title: careerDomainsTitle,
                     description: careerDomainsDescription,
                     items: careerDomainsItems.map(item => ({
                          name: item.name || "",
                          link: item.link || "",
                          iconName: item.iconName || "",
                          color: item.color || ""
                     }))
                };

                formData.append("data", JSON.stringify({
                     hero,
                     card,
                     relatedBlogs,
                     caseStudies: globalCaseStudies,
                     careerDomains: globalCareerDomains,
                     course: courses
                }));

                caseStudiesItems.forEach((item, itemIdx) => {
                     if (item.image && item.image instanceof File) {
                          formData.append(`globalCaseStudy_${itemIdx}`, item.image);
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
           setDuration("");
           setMode("");
           setBatchSize("");
           setPrice("");
           setSocialProof([]);
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
           setSkillsYouWillLearnTitle("");
           setSkillsYouWillLearnItems([]);
           setTrainersTitle("");
           setTrainersSubtitle("");
           setTrainersItems([]);
           setJobRolesTag("");
           setJobRolesTitle("");
           setJobRolesDescription("");
           setJobRolesItems([]);
            setHiringPartnersTitle("");
            setHiringPartnersSubtitle("");
            setHiringPartnersItems([]);
            setChooseLearningTitle("");
            setChooseLearningSubtitle("");
            setChooseEmiBannerTitle("");
            setChooseEmiBannerSubtitle("");
            setChooseEmiPoints([]);
            setChooseScholarshipDiscount("");
            setChooseScholarshipMeritTitle("");
            setChooseScholarshipMeritSubtitle("");
            setChooseScholarshipPoints([]);
            setChooseBatchItems([]);
             setWhyChooseUsTitle("");
             setWhyChooseUsSubtitle("");
             setWhyChooseUsItems([]);
             setReadyToStartTitle("");
             setReadyToStartSubtitle("");
             setReadyToStartBtn1Text("");
             setReadyToStartBtn1Link("");
             setReadyToStartBtn2Text("");
             setReadyToStartBtn2Link("");
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
           setVideos([]);
           setShowVideoModal(false);
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
           setDuration(course.duration || course.courselength || "");
           setMode(course.mode || "");
           setBatchSize(course.batchSize || course.batchsize || "");
           setPrice(course.price !== undefined && course.price !== null ? course.price : (course.fee !== undefined && course.fee !== null ? course.fee : ""));
           setSocialProof(Array.isArray(course.socialProof) && course.socialProof.length > 0 ? course.socialProof.map(s => ({ value: s.value || "", name: s.name || "" })) : []);
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
           setSkillsYouWillLearnTitle(course.skillsYouWillLearn?.title || "");
           setSkillsYouWillLearnItems(Array.isArray(course.skillsYouWillLearn?.skills) ? course.skillsYouWillLearn.skills : []);
           setTrainersTitle(course.trainers?.title || "");
           setTrainersSubtitle(course.trainers?.subtitle || "");
           setTrainersItems(Array.isArray(course.trainers?.items) ? course.trainers.items : []);
           setJobRolesTag(course.jobRoles?.tag || "");
           setJobRolesTitle(course.jobRoles?.title || "");
           setJobRolesDescription(course.jobRoles?.description || "");
           setJobRolesItems(Array.isArray(course.jobRoles?.items) ? course.jobRoles.items : []);
            setHiringPartnersTitle(course.hiringPartners?.title || "");
            setHiringPartnersSubtitle(course.hiringPartners?.subtitle || "");
            setHiringPartnersItems(Array.isArray(course.hiringPartners?.items) ? course.hiringPartners.items : []);
            setChooseLearningTitle(course.chooseLearning?.title || "");
            setChooseLearningSubtitle(course.chooseLearning?.subtitle || "");
            setChooseEmiBannerTitle(course.chooseLearning?.emi?.bannerTitle || "");
            setChooseEmiBannerSubtitle(course.chooseLearning?.emi?.bannerSubtitle || "");
            setChooseEmiPoints(Array.isArray(course.chooseLearning?.emi?.points) ? course.chooseLearning.emi.points : []);
            setChooseScholarshipDiscount(course.chooseLearning?.scholarship?.discountAmount || "");
            setChooseScholarshipMeritTitle(course.chooseLearning?.scholarship?.meritTitle || "");
            setChooseScholarshipMeritSubtitle(course.chooseLearning?.scholarship?.meritSubtitle || "");
            setChooseScholarshipPoints(Array.isArray(course.chooseLearning?.scholarship?.points) ? course.chooseLearning.scholarship.points : []);
            setChooseBatchItems(Array.isArray(course.chooseLearning?.batches?.items) ? course.chooseLearning.batches.items : []);
             setWhyChooseUsTitle(course.whyChooseUs?.title || "");
             setWhyChooseUsSubtitle(course.whyChooseUs?.subtitle || "");
             setWhyChooseUsItems(Array.isArray(course.whyChooseUs?.items) ? course.whyChooseUs.items : []);
             setReadyToStartTitle(course.readyToStartJourney?.title || "");
             setReadyToStartSubtitle(course.readyToStartJourney?.subtitle || "");
             setReadyToStartBtn1Text(course.readyToStartJourney?.button1Text || "");
             setReadyToStartBtn1Link(course.readyToStartJourney?.button1Link || "");
             setReadyToStartBtn2Text(course.readyToStartJourney?.button2Text || "");
             setReadyToStartBtn2Link(course.readyToStartJourney?.button2Link || "");
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
           setVideos(course.videos || []);
 
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
            setShortTermItems([...shortTermItems, { title: "", description: "", duration: "", iconText: "", image: "", alt: "" }]);
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

        const addSocialProofItem = () => {
             setSocialProof(prev => [...prev, { value: "", name: "" }]);
        };

        const removeSocialProofItem = (itemIdx) => {
             setSocialProof(prev => prev.filter((_, idx) => idx !== itemIdx));
        };

        const updateSocialProofItemField = (itemIdx, key, value) => {
             setSocialProof(prev => prev.map((item, idx) => idx === itemIdx ? { ...item, [key]: value } : item));
        };

        const addSkillItem = () => {
             setSkillsYouWillLearnItems(prev => [...prev, ""]);
        };

        const removeSkillItem = (sIdx) => {
             setSkillsYouWillLearnItems(prev => prev.filter((_, idx) => idx !== sIdx));
        };

        const updateSkillItemField = (sIdx, value) => {
             setSkillsYouWillLearnItems(prev => prev.map((item, idx) => idx === sIdx ? value : item));
        };

        const addTrainerItem = () => {
             setTrainersItems(prev => [...prev, { name: "", role: "", bio: "", rating: "4.9/5", students: "400+ Students", image: "", linkedin: "" }]);
        };

        const removeTrainerItem = (tIdx) => {
             setTrainersItems(prev => prev.filter((_, idx) => idx !== tIdx));
        };

        const updateTrainerItemField = (tIdx, key, value) => {
             setTrainersItems(prev => prev.map((item, idx) => idx === tIdx ? { ...item, [key]: value } : item));
        };

        const addWhyChooseUsItem = () => {
             setWhyChooseUsItems(prev => [...prev, { title: "", description: "", iconName: "graduationCap", color: "blue" }]);
        };

        const removeWhyChooseUsItem = (idx) => {
             setWhyChooseUsItems(prev => prev.filter((_, i) => i !== idx));
        };

        const updateWhyChooseUsItemField = (idx, key, value) => {
             setWhyChooseUsItems(prev => prev.map((item, i) => i === idx ? { ...item, [key]: value } : item));
        };

        const addJobRoleItem = () => {
             setJobRolesItems(prev => [...prev, { step: `0${prev.length + 1}`, iconName: "briefcase", title: "", description: "", keyFocusTitle: "KEY FOCUS AREAS", keyFocus: "" }]);
        };

        const removeJobRoleItem = (rIdx) => {
             setJobRolesItems(prev => prev.filter((_, idx) => idx !== rIdx));
        };

        const updateJobRoleItemField = (rIdx, key, value) => {
             setJobRolesItems(prev => prev.map((item, idx) => idx === rIdx ? { ...item, [key]: value } : item));
        };

        const addHiringPartnerItem = () => {
             setHiringPartnersItems(prev => [...prev, { image: "" }]);
        };

        const removeHiringPartnerItem = (pIdx) => {
             setHiringPartnersItems(prev => prev.filter((_, idx) => idx !== pIdx));
        };

        const updateHiringPartnerItemField = (pIdx, key, value) => {
             setHiringPartnersItems(prev => prev.map((item, idx) => idx === pIdx ? { ...item, [key]: value } : item));
        };

        const addEmiPoint = () => setChooseEmiPoints(prev => [...prev, ""]);
        const removeEmiPoint = (pIdx) => setChooseEmiPoints(prev => prev.filter((_, idx) => idx !== pIdx));
        const updateEmiPointField = (pIdx, val) => setChooseEmiPoints(prev => prev.map((item, idx) => idx === pIdx ? val : item));

        const addScholarshipPoint = () => setChooseScholarshipPoints(prev => [...prev, ""]);
        const removeScholarshipPoint = (pIdx) => setChooseScholarshipPoints(prev => prev.filter((_, idx) => idx !== pIdx));
        const updateScholarshipPointField = (pIdx, val) => setChooseScholarshipPoints(prev => prev.map((item, idx) => idx === pIdx ? val : item));

        const addBatchItem = () => setChooseBatchItems(prev => [...prev, { dayDate: `0${prev.length + 1}`, month: "JUN", title: "", time: "", status: "Upcoming" }]);
        const removeBatchItem = (bIdx) => setChooseBatchItems(prev => prev.filter((_, idx) => idx !== bIdx));
        const updateBatchItemField = (bIdx, key, value) => setChooseBatchItems(prev => prev.map((item, idx) => idx === bIdx ? { ...item, [key]: value } : item));

       const saveCourse = async () => {
            setUploading(true);
            try {
                 const updatedCourse = {
                      ...(editItem?._id ? { _id: editItem._id } : {}),
                      title,
                      alt: alt || title,
                      startdate: startDate,
                      category,
                      duration,
                      mode,
                      batchSize,
                      price: price !== "" ? Number(price) : 0,
                      fee: price !== "" ? Number(price) : 0,
                      socialProof: socialProof.map(item => ({
                           value: item.value || "",
                           name: item.name || ""
                      })),
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
                      skillsYouWillLearn: {
                           title: skillsYouWillLearnTitle || "Skills you will learn",
                           skills: skillsYouWillLearnItems.filter(s => s && String(s).trim())
                      },
                      trainers: {
                           title: trainersTitle || "Meet The Trainers",
                           subtitle: trainersSubtitle || "Get 1-on-1 mentorship and practical insights from active design leads and engineers at top companies.",
                           items: trainersItems.map(item => ({
                                name: item.name || "",
                                role: item.role || "",
                                bio: item.bio || "",
                                rating: item.rating || "",
                                students: item.students || "",
                                image: (item.image && item.image instanceof File) ? "" : (item.image || ""),
                                linkedin: item.linkedin || ""
                           }))
                      },
                      jobRoles: {
                           tag: jobRolesTag || "JOB ROLES",
                           title: jobRolesTitle || `Job Roles After ${title || "Course"}`,
                           description: jobRolesDescription || "",
                           items: jobRolesItems.map((item, idx) => ({
                                step: item.step || `0${idx + 1}`,
                                iconName: item.iconName || "briefcase",
                                title: item.title || "",
                                description: item.description || "",
                                keyFocusTitle: item.keyFocusTitle || "KEY FOCUS AREAS",
                                keyFocus: item.keyFocus || ""
                           }))
                      },
                      hiringPartners: {
                           title: hiringPartnersTitle || "Our Hiring Partners",
                           subtitle: hiringPartnersSubtitle || "Trusted by top companies across India",
                           items: hiringPartnersItems.map(item => ({
                                image: (item.image && item.image instanceof File) ? "" : (item.image || "")
                           }))
                      },
                      chooseLearning: {
                           title: chooseLearningTitle || "Choose Your Learning",
                           subtitle: chooseLearningSubtitle || "Explore our flexible execution paths mapped to different career commitments, learning schedules, and experience levels.",
                           emi: {
                                title: "EMI OPTION",
                                subtitle: "Pay in easy installments",
                                bannerTitle: chooseEmiBannerTitle || "No Cost EMI available",
                                bannerSubtitle: chooseEmiBannerSubtitle || "Starting from ₹1,667/month",
                                points: chooseEmiPoints.filter(p => p && p.trim())
                           },
                           scholarship: {
                                title: "SCHOLARSHIP",
                                subtitle: "Learn more, pay less",
                                discountAmount: chooseScholarshipDiscount || "30%",
                                discountLabel: "GET UP TO",
                                discountText: "OFF",
                                discountSubtext: "on course fees",
                                meritTitle: chooseScholarshipMeritTitle || "Merit Scholarship",
                                meritSubtitle: chooseScholarshipMeritSubtitle || "For eligible candidates",
                                points: chooseScholarshipPoints.filter(p => p && p.trim())
                           },
                           batches: {
                                title: "COMING BATCHES",
                                subtitle: "Join a batch that suits you",
                                items: chooseBatchItems.map((b, idx) => ({
                                     dayDate: b.dayDate || `0${idx + 1}`,
                                     month: b.month || "JUN",
                                     title: b.title || "",
                                     time: b.time || "",
                                     status: b.status || "Upcoming"
                                }))
                           }
                      },
                      whyChooseUs: {
                           title: whyChooseUsTitle || "Why Choose Us?",
                           subtitle: whyChooseUsSubtitle || "Real stories from learners who achieved career growth with our SAP courses.",
                           items: whyChooseUsItems.map(item => ({
                                title: item.title || "",
                                description: item.description || "",
                                iconName: item.iconName || "graduationCap",
                                color: item.color || "blue"
                           }))
                      },
                      readyToStartJourney: {
                           title: readyToStartTitle || "Ready to start your journey?",
                           subtitle: readyToStartSubtitle || "Embark on your path to success with expert training and a world of opportunities awaiting you.",
                           button1Text: readyToStartBtn1Text || "Contact us",
                           button1Link: readyToStartBtn1Link || "/contact-us",
                           button2Text: readyToStartBtn2Text || "Get A Free Demo",
                           button2Link: readyToStartBtn2Link || "/contact-us#demo"
                      },
                      faq: {
                           title: faqTitle,
                           startheading: faqStartheading,
                           midheading: faqMidheading,
                           endheading: faqEndheading,
                           description: faqDescription,
                           items: faqItems
                      },
                      chapter: chapters.map(ch => ({
                           ...(ch._id ? { _id: ch._id } : {}),
                           chaptername: ch.chaptername,
                           lessons: (ch.lessons || []).map(l => ({
                                ...(l._id ? { _id: l._id } : {}),
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
                                iconText: item.iconText || "",
                                image: (item.image && item.image instanceof File) ? "" : (item.image || ""),
                                alt: item.alt || ""
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
                      schemas: schemas,
                      videos: videos.map(v => ({
                           ...(v._id ? { _id: v._id } : {}),
                           video: (v.video && v.video instanceof File) ? "" : (v.video || ""),
                           alt: v.alt || "",
                           title: v.title || "",
                           thumbnail: (v.thumbnail && v.thumbnail instanceof File) ? "" : (v.thumbnail || "")
                      }))
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

                shortTermItems.forEach((item, itemIdx) => {
                     if (item.image && item.image instanceof File) {
                          formData.append(`course_${editIndex !== null ? editIndex : courses.length}_shortTerm_${itemIdx}`, item.image);
                     }
                });

                trainersItems.forEach((item, itemIdx) => {
                     if (item.image && item.image instanceof File) {
                          formData.append(`course_${editIndex !== null ? editIndex : courses.length}_trainer_${itemIdx}`, item.image);
                     }
                });

                hiringPartnersItems.forEach((item, itemIdx) => {
                     if (item.image && item.image instanceof File) {
                          formData.append(`course_${editIndex !== null ? editIndex : courses.length}_hiringPartner_${itemIdx}`, item.image);
                     }
                });

                videos.forEach((v, vIdx) => {
                     if (v.video && v.video instanceof File) {
                          formData.append(`course_${editIndex !== null ? editIndex : courses.length}_video_${vIdx}`, v.video);
                     }
                     if (v.thumbnail && v.thumbnail instanceof File) {
                          formData.append(`course_${editIndex !== null ? editIndex : courses.length}_videoThumb_${vIdx}`, v.thumbnail);
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

                    <div className="flex flex-wrap items-center gap-3">
                         <button
                              onClick={() => openMeetModal("ALL")}
                              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shrink-0"
                         >
                              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                              <span>🔵 Zoom Live Class</span>
                         </button>

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
                                                       <div className="flex items-start justify-between gap-2">
                                                            <h2 className="font-bold text-gray-900 text-base leading-snug line-clamp-2" title={course.title}>
                                                                 {course.title}
                                                            </h2>
                                                            <span className="shrink-0 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                                                                 {(course.price || course.fee) ? `₹${Number(course.price || course.fee).toLocaleString("en-IN")}` : "Fee TBD"}
                                                            </span>
                                                       </div>
                                                       <p className="text-xs text-gray-400 line-clamp-3 leading-normal">
                                                            {course.overview}
                                                       </p>
                                                  </div>

                                                  {/* Active Live Class Indicator */}
                                                  {course.liveClass?.active && (
                                                       <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                                                            <span className="font-extrabold text-red-700 flex items-center gap-1.5 truncate">
                                                                 <span className="w-2 h-2 rounded-full bg-red-600 animate-ping shrink-0" />
                                                                 <span>🔴 Live Active</span>
                                                            </span>
                                                            <button
                                                                 type="button"
                                                                 onClick={() => handleClearLiveClass(course)}
                                                                 className="text-[10px] font-extrabold text-red-600 hover:text-red-800 hover:underline shrink-0 cursor-pointer"
                                                            >
                                                                 End Live
                                                            </button>
                                                       </div>
                                                  )}

                                                  <div className="flex gap-2 pt-2">
                                                       <button
                                                            onClick={() => openMeetModal(course._id || course.slug)}
                                                            className="flex-1 flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                                                            title="Send Meet link to students of this course"
                                                       >
                                                            🔴 Send Meet
                                                       </button>
                                                       <button
                                                            onClick={() => openEdit(course, index)}
                                                            className="flex-1 flex items-center justify-center gap-1 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 text-xs font-bold py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                                                       >
                                                            Edit
                                                       </button>
                                                       <button
                                                            onClick={() => deleteCourse(index)}
                                                            className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500 text-xs font-bold py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
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
                               {/* 4. Global Student Portfolios (Case Studies) Config */}
                               <div className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200/50 space-y-4">
                                    <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 font-sans">4. Global Student Portfolios (Case Studies) Section</h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                         <div className="space-y-1.5">
                                              <label className={labelClass}>Section Title</label>
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
                                         <div className="space-y-1.5 sm:col-span-2">
                                              <label className={labelClass}>Section Description</label>
                                              <textarea
                                                   value={caseStudiesDescription}
                                                   onChange={(e) => setCaseStudiesDescription(e.target.value)}
                                                   placeholder="e.g. Click and explore our students UX projects..."
                                                   rows={2}
                                                   className={inputClass}
                                              />
                                         </div>
                                    </div>

                                    {/* Case Studies Cards List */}
                                    <div className="space-y-3 pt-2">
                                         <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Portfolio Cards ({caseStudiesItems.length})</p>
                                              <button
                                                   type="button"
                                                   onClick={addCaseStudyItem}
                                                   className="inline-flex items-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                              >
                                                   + Add Portfolio Card
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
                                                             <label className="text-[11px] font-bold text-gray-500">Alt Text / Title</label>
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
                                              <p className="text-xs text-gray-400 text-center py-3 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">No portfolio items added yet. Click "+ Add Portfolio Card" above.</p>
                                         )}
                                    </div>
                               </div>

                               {/* 5. Global Career Domains Config */}
                               <div className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200/50 space-y-4">
                                    <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 font-sans">5. Global Career Domains Section</h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                         <div className="space-y-1.5 sm:col-span-2">
                                              <label className={labelClass}>Section Title</label>
                                              <input
                                                   value={careerDomainsTitle}
                                                   onChange={(e) => setCareerDomainsTitle(e.target.value)}
                                                   placeholder="e.g. Explore More Career Domains"
                                                   className={inputClass}
                                              />
                                         </div>
                                         <div className="space-y-1.5 sm:col-span-2">
                                              <label className={labelClass}>Section Description</label>
                                              <textarea
                                                   value={careerDomainsDescription}
                                                   onChange={(e) => setCareerDomainsDescription(e.target.value)}
                                                   placeholder="e.g. Discover ADMEC's diverse courses..."
                                                   rows={2}
                                                   className={inputClass}
                                              />
                                         </div>
                                    </div>

                                    {/* Career Domains Items List */}
                                    <div className="space-y-3 pt-2">
                                         <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Domain Cards ({careerDomainsItems.length})</p>
                                              <button
                                                   type="button"
                                                   onClick={addCareerDomainItem}
                                                   className="inline-flex items-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
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
                                                                  className="w-full h-9 px-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs bg-white"
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
                                              <p className="text-xs text-gray-400 text-center py-3 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">No career domains added yet. Click "+ Add Domain Card" above.</p>
                                         )}
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

                                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Duration</label>
                                             <input
                                                  value={duration}
                                                  onChange={(e) => setDuration(e.target.value)}
                                                  placeholder="e.g. 6 Months / 24 Weeks"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Training Mode</label>
                                             <input
                                                  value={mode}
                                                  onChange={(e) => setMode(e.target.value)}
                                                  placeholder="e.g. Online / Offline"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Batch Size</label>
                                             <input
                                                  value={batchSize}
                                                  onChange={(e) => setBatchSize(e.target.value)}
                                                  placeholder="e.g. 10-12 Students"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Course Fee (₹)</label>
                                             <input
                                                  type="number"
                                                  value={price}
                                                  onChange={(e) => setPrice(e.target.value)}
                                                  placeholder="e.g. 25000"
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

                                   {/* Course Social Proof Bar Config */}
                                   <div className="space-y-4 bg-gray-50/70 p-4 sm:p-5 rounded-2xl border border-gray-200 text-left">
                                        <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
                                             <div>
                                                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wider font-sans flex items-center gap-2">
                                                       <span className="text-amber-500 text-sm">⭐</span> Course Social Proof Bar (Hero Stats)
                                                  </p>
                                                  <p className="text-[11px] text-gray-500 mt-0.5">
                                                       Add stat cards displayed right below the course hero section (e.g. Rating, Alumni, Placement, Partners).
                                                  </p>
                                             </div>
                                             <button
                                                  type="button"
                                                  onClick={addSocialProofItem}
                                                  className="inline-flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-200 transition-colors cursor-pointer shrink-0"
                                             >
                                                  + Add Stat Card
                                             </button>
                                        </div>

                                        <div className="space-y-3 pt-1">
                                             {socialProof.map((item, itemIdx) => (
                                                  <div key={itemIdx} className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 relative group">
                                                       <button
                                                            type="button"
                                                            onClick={() => removeSocialProofItem(itemIdx)}
                                                            className="absolute top-2.5 right-2.5 text-gray-400 hover:text-red-500 text-xs font-bold transition-colors cursor-pointer"
                                                       >
                                                            ✕ Remove
                                                       </button>

                                                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-12 sm:pr-0">
                                                            <div className="space-y-1">
                                                                 <label className="text-[11px] font-bold text-gray-500">Value / Stat</label>
                                                                 <input
                                                                      value={item.value || ""}
                                                                      onChange={(e) => updateSocialProofItemField(itemIdx, "value", e.target.value)}
                                                                      placeholder="e.g. 4.9 / 5 or 10,000+"
                                                                      className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-xs"
                                                                 />
                                                            </div>
                                                            <div className="space-y-1">
                                                                 <label className="text-[11px] font-bold text-gray-500">Name / Label</label>
                                                                 <input
                                                                      value={item.name || ""}
                                                                      onChange={(e) => updateSocialProofItemField(itemIdx, "name", e.target.value)}
                                                                      placeholder="e.g. Google Rating or Alumni"
                                                                      className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-xs"
                                                                 />
                                                            </div>
                                                       </div>
                                                  </div>
                                             ))}

                                             {socialProof.length === 0 && (
                                                  <p className="text-xs text-gray-400 text-center py-4 bg-white rounded-xl border border-dashed border-gray-200">
                                                       No custom stats added yet. Default stats (Rating, Alumni, Placement, Partners) will be shown. Click "+ Add Stat Card" above to customize.
                                                  </p>
                                             )}
                                        </div>
                                   </div>

                                   {/* Cover Image */}
                                   <div className="space-y-1.5">
                                        <label className={labelClass}>Course Cover Image</label>
                                        <ImageUploader
                                             setImage={setImage}
                                             initialImage={typeof editItem?.image === "string" ? editItem.image : null}
                                        />
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

                                   {/* Course Videos Section Banner */}
                                   <div className="bg-orange-50/60 p-4 rounded-2xl border border-orange-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                             <p className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                                                  <span className="text-orange-500">🎬</span> Course Session Recording Videos
                                             </p>
                                             <p className="text-xs text-gray-500 mt-0.5">
                                                  Manage video recordings, title, alt text, and thumbnail for this course ({videos.length} video{videos.length !== 1 ? 's' : ''} added).
                                             </p>
                                        </div>
                                        <button
                                             type="button"
                                             onClick={() => setShowVideoModal(true)}
                                             className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
                                        >
                                             <HiOutlinePlus size={15} /> Add course Videos
                                        </button>
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

                                   {/* Skills You Will Learn Config */}
                                   <div className="space-y-4 bg-blue-50/50 p-4 sm:p-5 rounded-2xl border border-blue-200/70 text-left mt-4">
                                        <div className="flex items-center justify-between border-b border-blue-200/60 pb-3">
                                             <div>
                                                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wider font-sans flex items-center gap-2">
                                                       <span className="text-blue-500 text-sm">💡</span> Skills You Will Learn Section
                                                  </p>
                                                  <p className="text-[11px] text-gray-500 mt-0.5">
                                                       Add skill tag pills displayed right below the Brochure CTA section on the course page.
                                                  </p>
                                             </div>
                                             <button
                                                  type="button"
                                                  onClick={addSkillItem}
                                                  className="inline-flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-300 transition-colors cursor-pointer shrink-0"
                                             >
                                                  + Add Skill Tag
                                             </button>
                                        </div>

                                        <div className="space-y-3">
                                             <div className="space-y-1">
                                                  <label className={labelClass}>Section Title</label>
                                                  <input
                                                       value={skillsYouWillLearnTitle}
                                                       onChange={(e) => setSkillsYouWillLearnTitle(e.target.value)}
                                                       placeholder="e.g. Skills you will learn"
                                                       className={inputClass}
                                                  />
                                             </div>

                                             <div className="space-y-2 pt-1">
                                                  <label className={labelClass}>Skill Tags / Pills</label>
                                                  <div className="flex flex-wrap gap-2">
                                                       {skillsYouWillLearnItems.map((skill, sIdx) => (
                                                            <div key={sIdx} className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-1">
                                                                 <input
                                                                      value={skill}
                                                                      onChange={(e) => updateSkillItemField(sIdx, e.target.value)}
                                                                      placeholder="e.g. AGENTIC AI SYSTEMS"
                                                                      className="h-7 px-2 border-none focus:outline-none text-xs w-48 uppercase font-semibold"
                                                                 />
                                                                 <button
                                                                      type="button"
                                                                      onClick={() => removeSkillItem(sIdx)}
                                                                      className="text-gray-400 hover:text-red-500 px-1 text-xs font-bold"
                                                                 >
                                                                      ✕
                                                                 </button>
                                                            </div>
                                                       ))}
                                                  </div>
                                                  {skillsYouWillLearnItems.length === 0 && (
                                                       <p className="text-xs text-gray-400 text-center py-3 bg-white rounded-xl border border-dashed border-gray-200">
                                                            No custom skills added yet. Default skills will be displayed. Click "+ Add Skill Tag" above to customize.
                                                       </p>
                                                  )}
                                             </div>
                                        </div>
                                   </div>

                                   {/* Meet The Trainers Config */}
                                   <div className="space-y-4 bg-amber-50/50 p-4 sm:p-5 rounded-2xl border border-amber-200/70 text-left mt-4">
                                        <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                                             <div>
                                                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wider font-sans flex items-center gap-2">
                                                       <span className="text-amber-500 text-sm">👨‍🏫</span> Meet The Trainers Section
                                                  </p>
                                                  <p className="text-[11px] text-gray-500 mt-0.5">
                                                       Manage trainer profiles, roles, bios, ratings, photo image URLs, and LinkedIn links.
                                                  </p>
                                             </div>
                                             <button
                                                  type="button"
                                                  onClick={addTrainerItem}
                                                  className="inline-flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-300 transition-colors cursor-pointer shrink-0"
                                             >
                                                  + Add Trainer Card
                                             </button>
                                        </div>

                                        <div className="space-y-3">
                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                  <div className="space-y-1">
                                                       <label className={labelClass}>Section Title</label>
                                                       <input
                                                            value={trainersTitle}
                                                            onChange={(e) => setTrainersTitle(e.target.value)}
                                                            placeholder="e.g. Meet The Trainers"
                                                            className={inputClass}
                                                       />
                                                  </div>
                                                  <div className="space-y-1">
                                                       <label className={labelClass}>Section Subtitle</label>
                                                       <input
                                                            value={trainersSubtitle}
                                                            onChange={(e) => setTrainersSubtitle(e.target.value)}
                                                            placeholder="e.g. Get 1-on-1 mentorship from active leads..."
                                                            className={inputClass}
                                                       />
                                                  </div>
                                             </div>

                                             <div className="space-y-3 pt-2">
                                                  {trainersItems.map((trainer, tIdx) => (
                                                       <div key={tIdx} className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 relative group">
                                                            <button
                                                                 type="button"
                                                                 onClick={() => removeTrainerItem(tIdx)}
                                                                 className="absolute top-2.5 right-2.5 text-gray-400 hover:text-red-500 text-xs font-bold transition-colors cursor-pointer"
                                                            >
                                                                 ✕ Remove
                                                            </button>

                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pr-12 sm:pr-0">
                                                                 <div className="space-y-1 sm:col-span-3">
                                                                      <label className="text-[11px] font-bold text-gray-500">Trainer Photo Image</label>
                                                                      <ImageUploader
                                                                           setImage={(file) => updateTrainerItemField(tIdx, "image", file)}
                                                                           initialImage={trainer.image || null}
                                                                      />
                                                                 </div>
                                                                 <div className="space-y-1">
                                                                      <label className="text-[11px] font-bold text-gray-500">Trainer Name</label>
                                                                      <input
                                                                           value={trainer.name || ""}
                                                                           onChange={(e) => updateTrainerItemField(tIdx, "name", e.target.value)}
                                                                           placeholder="e.g. Mr. Manoj Pandey"
                                                                           className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-xs"
                                                                      />
                                                                 </div>
                                                                 <div className="space-y-1">
                                                                      <label className="text-[11px] font-bold text-gray-500">Role / Company Tag</label>
                                                                      <input
                                                                           value={trainer.role || ""}
                                                                           onChange={(e) => updateTrainerItemField(tIdx, "role", e.target.value)}
                                                                           placeholder="e.g. SENIOR ENGINEER @ GOOGLE"
                                                                           className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-xs uppercase"
                                                                      />
                                                                 </div>
                                                                 <div className="space-y-1 sm:col-span-2">
                                                                      <label className="text-[11px] font-bold text-gray-500">Bio / Credentials</label>
                                                                      <input
                                                                           value={trainer.bio || ""}
                                                                           onChange={(e) => updateTrainerItemField(tIdx, "bio", e.target.value)}
                                                                           placeholder="UI/UX & Design Systems lead with 10+ years experience..."
                                                                           className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-xs"
                                                                      />
                                                                 </div>
                                                                 <div className="space-y-1">
                                                                      <label className="text-[11px] font-bold text-gray-500">Rating & Students</label>
                                                                      <div className="grid grid-cols-2 gap-1.5">
                                                                           <input
                                                                                value={trainer.rating || ""}
                                                                                onChange={(e) => updateTrainerItemField(tIdx, "rating", e.target.value)}
                                                                                placeholder="4.9/5"
                                                                                className="w-full h-9 px-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-xs"
                                                                           />
                                                                           <input
                                                                                value={trainer.students || ""}
                                                                                onChange={(e) => updateTrainerItemField(tIdx, "students", e.target.value)}
                                                                                placeholder="400+ Students"
                                                                                className="w-full h-9 px-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-xs"
                                                                           />
                                                                      </div>
                                                                 </div>
                                                                 <div className="space-y-1 sm:col-span-3">
                                                                      <label className="text-[11px] font-bold text-gray-500">LinkedIn Profile Link</label>
                                                                      <input
                                                                           value={trainer.linkedin || ""}
                                                                           onChange={(e) => updateTrainerItemField(tIdx, "linkedin", e.target.value)}
                                                                           placeholder="https://linkedin.com/in/username"
                                                                           className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-xs"
                                                                      />
                                                                 </div>
                                                            </div>
                                                       </div>
                                                  ))}
                                                  {trainersItems.length === 0 && (
                                                       <p className="text-xs text-gray-400 text-center py-3 bg-white rounded-xl border border-dashed border-gray-200">
                                                            No custom trainer cards added yet. Default trainers (Google, Microsoft, Amazon leads) will be displayed. Click "+ Add Trainer Card" above to customize.
                                                       </p>
                                                  )}
                                             </div>
                                        </div>
                                   </div>

                                   {/* Job Roles After Course Section Config */}
                                   <div className="space-y-4 bg-indigo-50/50 p-4 sm:p-5 rounded-2xl border border-indigo-200/70 text-left mt-4">
                                        <div className="flex items-center justify-between border-b border-indigo-200/60 pb-3">
                                             <div>
                                                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wider font-sans flex items-center gap-2">
                                                       <span className="text-indigo-500 text-sm">💼</span> Job Roles After Course Section
                                                  </p>
                                                  <p className="text-[11px] text-gray-500 mt-0.5">
                                                       Manage job roles, descriptions, icons, step numbers, and key focus areas.
                                                  </p>
                                             </div>
                                             <button
                                                  type="button"
                                                  onClick={addJobRoleItem}
                                                  className="inline-flex items-center gap-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-indigo-300 transition-colors cursor-pointer shrink-0"
                                             >
                                                  + Add Job Role
                                             </button>
                                        </div>

                                        <div className="space-y-3">
                                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                  <div className="space-y-1">
                                                       <label className={labelClass}>Tag Badge</label>
                                                       <input
                                                            value={jobRolesTag}
                                                            onChange={(e) => setJobRolesTag(e.target.value)}
                                                            placeholder="e.g. JOB ROLES"
                                                            className={inputClass}
                                                       />
                                                  </div>
                                                  <div className="space-y-1 sm:col-span-2">
                                                       <label className={labelClass}>Section Title</label>
                                                       <input
                                                            value={jobRolesTitle}
                                                            onChange={(e) => setJobRolesTitle(e.target.value)}
                                                            placeholder="e.g. Job Roles After UI/UX Design Course"
                                                            className={inputClass}
                                                       />
                                                  </div>
                                             </div>

                                             <div className="space-y-1">
                                                  <label className={labelClass}>Section Subtitle / Description</label>
                                                  <textarea
                                                       value={jobRolesDescription}
                                                       onChange={(e) => setJobRolesDescription(e.target.value)}
                                                       placeholder="Unlock exciting career opportunities with in-demand roles..."
                                                       rows={2}
                                                       className={inputClass}
                                                  />
                                             </div>

                                             <div className="space-y-3 pt-2">
                                                  {jobRolesItems.map((role, rIdx) => (
                                                       <div key={rIdx} className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 relative group">
                                                            <button
                                                                 type="button"
                                                                 onClick={() => removeJobRoleItem(rIdx)}
                                                                 className="absolute top-2.5 right-2.5 text-gray-400 hover:text-red-500 text-xs font-bold transition-colors cursor-pointer"
                                                            >
                                                                 ✕ Remove
                                                            </button>

                                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-12 sm:pr-0">
                                                                 <div className="space-y-1">
                                                                      <label className="text-[11px] font-bold text-gray-500">Step Number</label>
                                                                      <input
                                                                           value={role.step || `0${rIdx + 1}`}
                                                                           onChange={(e) => updateJobRoleItemField(rIdx, "step", e.target.value)}
                                                                           placeholder="e.g. 01"
                                                                           className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-xs"
                                                                      />
                                                                 </div>
                                                                 <div className="space-y-1">
                                                                      <label className="text-[11px] font-bold text-gray-500">Icon Type</label>
                                                                      <select
                                                                           value={role.iconName || "briefcase"}
                                                                           onChange={(e) => updateJobRoleItemField(rIdx, "iconName", e.target.value)}
                                                                           className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-xs bg-white"
                                                                      >
                                                                           <option value="briefcase">Briefcase (Job)</option>
                                                                           <option value="chart">Bar Chart (Analytics)</option>
                                                                           <option value="user">User Check (Researcher)</option>
                                                                           <option value="clock">Clock (Time)</option>
                                                                           <option value="layers">Layers (Systems)</option>
                                                                           <option value="award">Award (Specialist)</option>
                                                                      </select>
                                                                 </div>
                                                                 <div className="space-y-1 sm:col-span-3">
                                                                      <label className="text-[11px] font-bold text-gray-500">Role Title</label>
                                                                      <input
                                                                           value={role.title || ""}
                                                                           onChange={(e) => updateJobRoleItemField(rIdx, "title", e.target.value)}
                                                                           placeholder="e.g. UI/UX Designer"
                                                                           className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-xs font-semibold"
                                                                      />
                                                                 </div>
                                                                 <div className="space-y-1 sm:col-span-3">
                                                                      <label className="text-[11px] font-bold text-gray-500">Role Description</label>
                                                                      <textarea
                                                                           value={role.description || ""}
                                                                           onChange={(e) => updateJobRoleItemField(rIdx, "description", e.target.value)}
                                                                           placeholder="Describe what this role entails..."
                                                                           rows={2}
                                                                           className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-xs"
                                                                      />
                                                                 </div>
                                                                 <div className="space-y-1">
                                                                      <label className="text-[11px] font-bold text-gray-500">Key Focus Label</label>
                                                                      <input
                                                                           value={role.keyFocusTitle || "KEY FOCUS AREAS"}
                                                                           onChange={(e) => updateJobRoleItemField(rIdx, "keyFocusTitle", e.target.value)}
                                                                           placeholder="e.g. KEY FOCUS AREAS"
                                                                           className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-xs font-semibold uppercase"
                                                                      />
                                                                 </div>
                                                                 <div className="space-y-1 sm:col-span-2">
                                                                      <label className="text-[11px] font-bold text-gray-500">Key Focus Areas Text</label>
                                                                      <input
                                                                           value={role.keyFocus || ""}
                                                                           onChange={(e) => updateJobRoleItemField(rIdx, "keyFocus", e.target.value)}
                                                                           placeholder="e.g. Wireframing, High-Fidelity Prototyping, Design Systems"
                                                                           className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-xs"
                                                                      />
                                                                 </div>
                                                            </div>
                                                       </div>
                                                  ))}
                                                  {jobRolesItems.length === 0 && (
                                                       <p className="text-xs text-gray-400 text-center py-3 bg-white rounded-xl border border-dashed border-gray-200">
                                                            No custom job roles added yet. Default roles (UI/UX Designer, Product Designer, UX Researcher) will be displayed. Click "+ Add Job Role" above to customize.
                                                       </p>
                                                  )}
                                             </div>
                                        </div>
                                   </div>

                                   {/* Hiring Partners Section Config */}
                                   <div className="space-y-4 bg-emerald-50/50 p-4 sm:p-5 rounded-2xl border border-emerald-200/70 text-left mt-4">
                                        <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
                                             <div>
                                                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wider font-sans flex items-center gap-2">
                                                       <span className="text-emerald-600 text-sm">🤝</span> Our Hiring Partners Section
                                                  </p>
                                                  <p className="text-[11px] text-gray-500 mt-0.5">
                                                       Manage hiring partner logos (Google, Microsoft, Amazon, Infosys, TCS, Accenture, etc.).
                                                  </p>
                                             </div>
                                             <button
                                                  type="button"
                                                  onClick={addHiringPartnerItem}
                                                  className="inline-flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-300 transition-colors cursor-pointer shrink-0"
                                             >
                                                  + Add Partner Logo
                                             </button>
                                        </div>

                                        <div className="space-y-3">
                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                  <div className="space-y-1">
                                                       <label className={labelClass}>Section Title</label>
                                                       <input
                                                            value={hiringPartnersTitle}
                                                            onChange={(e) => setHiringPartnersTitle(e.target.value)}
                                                            placeholder="e.g. Our Hiring Partners"
                                                            className={inputClass}
                                                       />
                                                  </div>
                                                  <div className="space-y-1">
                                                       <label className={labelClass}>Section Subtitle</label>
                                                       <input
                                                            value={hiringPartnersSubtitle}
                                                            onChange={(e) => setHiringPartnersSubtitle(e.target.value)}
                                                            placeholder="e.g. Trusted by top companies across India"
                                                            className={inputClass}
                                                       />
                                                  </div>
                                             </div>

                                             <div className="space-y-3 pt-2">
                                                  {hiringPartnersItems.map((partner, pIdx) => (
                                                       <div key={pIdx} className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 relative group">
                                                            <button
                                                                 type="button"
                                                                 onClick={() => removeHiringPartnerItem(pIdx)}
                                                                 className="absolute top-2.5 right-2.5 text-gray-400 hover:text-red-500 text-xs font-bold transition-colors cursor-pointer"
                                                            >
                                                                 ✕ Remove
                                                            </button>

                                                            <div className="grid grid-cols-1 gap-3 pr-12 sm:pr-0">
                                                                 <div className="space-y-1">
                                                                      <label className="text-[11px] font-bold text-gray-500">Partner Logo Image</label>
                                                                      <ImageUploader
                                                                           setImage={(file) => updateHiringPartnerItemField(pIdx, "image", file)}
                                                                           initialImage={partner.image || null}
                                                                      />
                                                                 </div>
                                                            </div>
                                                       </div>
                                                  ))}
                                                  {hiringPartnersItems.length === 0 && (
                                                       <p className="text-xs text-gray-400 text-center py-3 bg-white rounded-xl border border-dashed border-gray-200">
                                                            No custom partner logos added yet. Default partner logos (Google, Microsoft, Amazon, Infosys, TCS, Accenture, Capgemini, Wipro, HCL, Shapoorji Pallonji) will be displayed. Click "+ Add Partner Logo" above to customize.
                                                       </p>
                                                  )}
                                             </div>
                                        </div>
                                   </div>

                                   {/* Choose Your Learning Section Config */}
                                   <div className="space-y-4 bg-sky-50/50 p-4 sm:p-5 rounded-2xl border border-sky-200/70 text-left mt-4">
                                        <div className="border-b border-sky-200/60 pb-3">
                                             <p className="text-xs font-bold text-gray-900 uppercase tracking-wider font-sans flex items-center gap-2">
                                                  <span className="text-sky-600 text-sm">🎓</span> Choose Your Learning Section
                                             </p>
                                             <p className="text-[11px] text-gray-500 mt-0.5">
                                                  Manage EMI Options, Scholarship offers, and Upcoming Batches schedules.
                                             </p>
                                        </div>

                                        <div className="space-y-4">
                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                  <div className="space-y-1">
                                                       <label className={labelClass}>Section Title</label>
                                                       <input
                                                            value={chooseLearningTitle}
                                                            onChange={(e) => setChooseLearningTitle(e.target.value)}
                                                            placeholder="e.g. Choose Your Learning"
                                                            className={inputClass}
                                                       />
                                                  </div>
                                                  <div className="space-y-1">
                                                       <label className={labelClass}>Section Subtitle</label>
                                                       <input
                                                            value={chooseLearningSubtitle}
                                                            onChange={(e) => setChooseLearningSubtitle(e.target.value)}
                                                            placeholder="e.g. Explore our flexible execution paths..."
                                                            className={inputClass}
                                                       />
                                                  </div>
                                             </div>

                                             {/* EMI Option Settings */}
                                             <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                                                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Card 1: EMI Option Box</p>
                                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                       <div className="space-y-1">
                                                            <label className="text-[11px] font-bold text-gray-500">EMI Banner Title</label>
                                                            <input
                                                                 value={chooseEmiBannerTitle}
                                                                 onChange={(e) => setChooseEmiBannerTitle(e.target.value)}
                                                                 placeholder="e.g. No Cost EMI available"
                                                                 className="w-full h-9 px-3 border border-gray-300 rounded-lg text-xs"
                                                            />
                                                       </div>
                                                       <div className="space-y-1">
                                                            <label className="text-[11px] font-bold text-gray-500">EMI Subtext / Price</label>
                                                            <input
                                                                 value={chooseEmiBannerSubtitle}
                                                                 onChange={(e) => setChooseEmiBannerSubtitle(e.target.value)}
                                                                 placeholder="e.g. Starting from ₹1,667/month"
                                                                 className="w-full h-9 px-3 border border-gray-300 rounded-lg text-xs"
                                                            />
                                                       </div>
                                                  </div>
                                             </div>

                                             {/* Scholarship Settings */}
                                             <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                                                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Card 2: Scholarship Offer Box</p>
                                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                       <div className="space-y-1">
                                                            <label className="text-[11px] font-bold text-gray-500">Discount Amount</label>
                                                            <input
                                                                 value={chooseScholarshipDiscount}
                                                                 onChange={(e) => setChooseScholarshipDiscount(e.target.value)}
                                                                 placeholder="e.g. 30%"
                                                                 className="w-full h-9 px-3 border border-gray-300 rounded-lg text-xs font-bold"
                                                            />
                                                       </div>
                                                       <div className="space-y-1">
                                                            <label className="text-[11px] font-bold text-gray-500">Merit Scholarship Title</label>
                                                            <input
                                                                 value={chooseScholarshipMeritTitle}
                                                                 onChange={(e) => setChooseScholarshipMeritTitle(e.target.value)}
                                                                 placeholder="e.g. Merit Scholarship"
                                                                 className="w-full h-9 px-3 border border-gray-300 rounded-lg text-xs"
                                                            />
                                                       </div>
                                                       <div className="space-y-1">
                                                            <label className="text-[11px] font-bold text-gray-500">Merit Subtext</label>
                                                            <input
                                                                 value={chooseScholarshipMeritSubtitle}
                                                                 onChange={(e) => setChooseScholarshipMeritSubtitle(e.target.value)}
                                                                 placeholder="e.g. For eligible candidates"
                                                                 className="w-full h-9 px-3 border border-gray-300 rounded-lg text-xs"
                                                            />
                                                       </div>
                                                  </div>
                                             </div>

                                             {/* Upcoming Batches List Settings */}
                                             <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                                                  <div className="flex items-center justify-between">
                                                       <p className="text-xs font-bold text-purple-700 uppercase tracking-wider">Card 3: Upcoming Batches Schedule</p>
                                                       <button
                                                            type="button"
                                                            onClick={addBatchItem}
                                                            className="bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-lg border border-purple-300 cursor-pointer"
                                                       >
                                                            + Add Batch Row
                                                       </button>
                                                  </div>

                                                  <div className="space-y-2">
                                                       {chooseBatchItems.map((batch, bIdx) => (
                                                            <div key={bIdx} className="grid grid-cols-1 sm:grid-cols-5 gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200 relative">
                                                                 <input
                                                                      value={batch.dayDate || ""}
                                                                      onChange={(e) => updateBatchItemField(bIdx, "dayDate", e.target.value)}
                                                                      placeholder="01"
                                                                      className="h-8 px-2 border border-gray-300 rounded text-xs font-bold text-center"
                                                                 />
                                                                 <input
                                                                      value={batch.month || ""}
                                                                      onChange={(e) => updateBatchItemField(bIdx, "month", e.target.value)}
                                                                      placeholder="JUN"
                                                                      className="h-8 px-2 border border-gray-300 rounded text-xs uppercase font-bold text-center"
                                                                 />
                                                                 <input
                                                                      value={batch.title || ""}
                                                                      onChange={(e) => updateBatchItemField(bIdx, "title", e.target.value)}
                                                                      placeholder="Weekend Batch"
                                                                      className="h-8 px-2 border border-gray-300 rounded text-xs font-semibold sm:col-span-2"
                                                                 />
                                                                 <div className="flex items-center gap-1">
                                                                      <input
                                                                           value={batch.time || ""}
                                                                           onChange={(e) => updateBatchItemField(bIdx, "time", e.target.value)}
                                                                           placeholder="Sat - Sun • 10:00 AM"
                                                                           className="h-8 px-2 border border-gray-300 rounded text-xs flex-1"
                                                                      />
                                                                      <button
                                                                           type="button"
                                                                           onClick={() => removeBatchItem(bIdx)}
                                                                           className="text-red-500 font-bold px-1 text-xs cursor-pointer"
                                                                      >
                                                                           ✕
                                                                      </button>
                                                                 </div>
                                                            </div>
                                                       ))}
                                                       {chooseBatchItems.length === 0 && (
                                                            <p className="text-xs text-gray-400 text-center py-2 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                                                 No custom batch rows added yet. Default batches (01 JUN, 08 JUN, 15 JUN) will be displayed. Click "+ Add Batch Row" to customize.
                                                            </p>
                                                       )}
                                                  </div>
                                             </div>

                                        </div>
                                   </div>

                                    {/* Why Choose Us Section Config */}
                                    <div className="space-y-4 bg-indigo-50/50 p-4 sm:p-5 rounded-2xl border border-indigo-200/70 text-left mt-4">
                                         <div className="border-b border-indigo-200/60 pb-3 flex items-center justify-between">
                                              <div>
                                                   <p className="text-xs font-bold text-gray-900 uppercase tracking-wider font-sans flex items-center gap-2">
                                                        <span className="text-indigo-600 text-sm">⭐</span> Why Choose Us Section
                                                   </p>
                                                   <p className="text-[11px] text-gray-500 mt-0.5">
                                                        Manage the 6 reason cards displayed below the Testimonials section.
                                                   </p>
                                              </div>
                                              <button
                                                   type="button"
                                                   onClick={addWhyChooseUsItem}
                                                   className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                              >
                                                   + Add Reason Card
                                              </button>
                                         </div>

                                         <div className="space-y-4">
                                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                   <div className="space-y-1">
                                                        <label className={labelClass}>Section Title</label>
                                                        <input
                                                             value={whyChooseUsTitle}
                                                             onChange={(e) => setWhyChooseUsTitle(e.target.value)}
                                                             placeholder="e.g. Why Choose Us?"
                                                             className={inputClass}
                                                        />
                                                   </div>
                                                   <div className="space-y-1">
                                                        <label className={labelClass}>Section Subtitle</label>
                                                        <input
                                                             value={whyChooseUsSubtitle}
                                                             onChange={(e) => setWhyChooseUsSubtitle(e.target.value)}
                                                             placeholder="e.g. Real stories from learners who achieved career growth..."
                                                             className={inputClass}
                                                        />
                                                   </div>
                                              </div>

                                              {/* Reason Cards List */}
                                              <div className="space-y-3">
                                                   {whyChooseUsItems.map((item, idx) => (
                                                        <div key={idx} className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2.5 relative text-left">
                                                             <div className="flex items-center justify-between">
                                                                  <span className="text-xs font-bold text-indigo-700">Card #{idx + 1}</span>
                                                                  <button
                                                                       type="button"
                                                                       onClick={() => removeWhyChooseUsItem(idx)}
                                                                       className="text-red-500 hover:text-red-700 font-bold text-xs cursor-pointer"
                                                                  >
                                                                       Remove
                                                                  </button>
                                                             </div>

                                                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                                                  <div className="space-y-1">
                                                                       <label className="text-[11px] font-bold text-gray-500">Card Title</label>
                                                                       <input
                                                                            value={item.title || ""}
                                                                            onChange={(e) => updateWhyChooseUsItemField(idx, "title", e.target.value)}
                                                                            placeholder="Qualified Candidates Pool"
                                                                            className="w-full h-8 px-2.5 border border-gray-300 rounded text-xs font-semibold"
                                                                       />
                                                                  </div>
                                                                  <div className="space-y-1">
                                                                       <label className="text-[11px] font-bold text-gray-500">Icon Color Theme</label>
                                                                       <select
                                                                            value={item.color || "blue"}
                                                                            onChange={(e) => updateWhyChooseUsItemField(idx, "color", e.target.value)}
                                                                            className="w-full h-8 px-2 border border-gray-300 rounded text-xs font-medium"
                                                                       >
                                                                            <option value="blue">Blue (#1D61E7)</option>
                                                                            <option value="orange">Orange (#F97316)</option>
                                                                            <option value="coral">Coral / Red (#EF4444)</option>
                                                                       </select>
                                                                  </div>
                                                                  <div className="space-y-1">
                                                                       <label className="text-[11px] font-bold text-gray-500">Icon Name</label>
                                                                       <select
                                                                            value={item.iconName || "graduationCap"}
                                                                            onChange={(e) => updateWhyChooseUsItemField(idx, "iconName", e.target.value)}
                                                                            className="w-full h-8 px-2 border border-gray-300 rounded text-xs font-medium"
                                                                       >
                                                                            <option value="graduationCap">Graduation Cap</option>
                                                                            <option value="badgeDollarSign">Dollar / Pricing</option>
                                                                            <option value="userCog">Dedicated Manager</option>
                                                                            <option value="zap">Faster / Zap</option>
                                                                            <option value="layers">Technologies / Layers</option>
                                                                            <option value="calendarCheck">Year-Round / Calendar</option>
                                                                            <option value="award">Award / Merit</option>
                                                                            <option value="shieldCheck">Shield / Trust</option>
                                                                            <option value="heartHandshake">Handshake / Support</option>
                                                                       </select>
                                                                  </div>
                                                             </div>

                                                             <div className="space-y-1">
                                                                  <label className="text-[11px] font-bold text-gray-500">Card Description</label>
                                                                  <input
                                                                       value={item.description || ""}
                                                                       onChange={(e) => updateWhyChooseUsItemField(idx, "description", e.target.value)}
                                                                       placeholder="Access a diverse range of ready-to-hire professionals"
                                                                       className="w-full h-8 px-2.5 border border-gray-300 rounded text-xs"
                                                                  />
                                                             </div>
                                                        </div>
                                                   ))}

                                                   {whyChooseUsItems.length === 0 && (
                                                        <p className="text-xs text-gray-400 text-center py-2.5 bg-white rounded-xl border border-dashed border-gray-200">
                                                             No custom reason cards added yet. Default 6 cards (Qualified Candidates Pool, No Cost Hiring, Dedicated Manager, Faster Hiring, Expertise in 150+ Tech, Year-Round Hiring) will be displayed. Click "+ Add Reason Card" to customize.
                                                        </p>
                                                   )}
                                              </div>

                                         </div>
                                    </div>

                                    {/* Ready To Start Journey CTA Section Config */}
                                    <div className="space-y-4 bg-blue-50/50 p-4 sm:p-5 rounded-2xl border border-blue-200/70 text-left mt-4">
                                         <div className="border-b border-blue-200/60 pb-3">
                                              <p className="text-xs font-bold text-gray-900 uppercase tracking-wider font-sans flex items-center gap-2">
                                                   <span className="text-blue-600 text-sm">🚀</span> Ready To Start Journey CTA Banner
                                              </p>
                                              <p className="text-[11px] text-gray-500 mt-0.5">
                                                   Manage heading, subtitle, and CTA button links for the banner below Why Choose Us.
                                              </p>
                                         </div>

                                         <div className="space-y-4">
                                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                   <div className="space-y-1">
                                                        <label className={labelClass}>Banner Title</label>
                                                        <input
                                                             value={readyToStartTitle}
                                                             onChange={(e) => setReadyToStartTitle(e.target.value)}
                                                             placeholder="e.g. Ready to start your journey?"
                                                             className={inputClass}
                                                        />
                                                   </div>
                                                   <div className="space-y-1">
                                                        <label className={labelClass}>Banner Subtitle</label>
                                                        <input
                                                             value={readyToStartSubtitle}
                                                             onChange={(e) => setReadyToStartSubtitle(e.target.value)}
                                                             placeholder="e.g. Embark on your path to success..."
                                                             className={inputClass}
                                                        />
                                                   </div>
                                              </div>

                                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                   <div className="space-y-1 bg-white p-3 rounded-xl border border-gray-200">
                                                        <p className="text-[11px] font-bold text-blue-700 uppercase">Button 1 (Primary - Solid White)</p>
                                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                                             <input
                                                                  value={readyToStartBtn1Text}
                                                                  onChange={(e) => setReadyToStartBtn1Text(e.target.value)}
                                                                  placeholder="Contact us"
                                                                  className="h-8 px-2.5 border border-gray-300 rounded text-xs"
                                                             />
                                                             <input
                                                                  value={readyToStartBtn1Link}
                                                                  onChange={(e) => setReadyToStartBtn1Link(e.target.value)}
                                                                  placeholder="/contact-us"
                                                                  className="h-8 px-2.5 border border-gray-300 rounded text-xs"
                                                             />
                                                        </div>
                                                   </div>

                                                   <div className="space-y-1 bg-white p-3 rounded-xl border border-gray-200">
                                                        <p className="text-[11px] font-bold text-blue-700 uppercase">Button 2 (Secondary - Outlined)</p>
                                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                                             <input
                                                                  value={readyToStartBtn2Text}
                                                                  onChange={(e) => setReadyToStartBtn2Text(e.target.value)}
                                                                  placeholder="Get A Free Demo"
                                                                  className="h-8 px-2.5 border border-gray-300 rounded text-xs"
                                                             />
                                                             <input
                                                                  value={readyToStartBtn2Link}
                                                                  onChange={(e) => setReadyToStartBtn2Link(e.target.value)}
                                                                  placeholder="/contact-us#demo"
                                                                  className="h-8 px-2.5 border border-gray-300 rounded text-xs"
                                                             />
                                                        </div>
                                                   </div>
                                              </div>
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

                                                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                                            <div className="space-y-1.5">
                                                                 <label className="text-[11px] font-bold text-gray-500">Card Image Upload (Optional - replaces Icon)</label>
                                                                 <ImageUploader 
                                                                      setImage={(imgFile) => updateShortTermItemField(itemIdx, "image", imgFile)}
                                                                      initialImage={typeof item.image === "string" ? item.image : null}
                                                                 />
                                                            </div>
                                                            <div className="space-y-1">
                                                                 <label className="text-[11px] font-bold text-gray-500">Image Alt Text</label>
                                                                 <input
                                                                      value={item.alt || ""}
                                                                      onChange={(e) => updateShortTermItemField(itemIdx, "alt", e.target.value)}
                                                                      placeholder="e.g. Adobe XD logo image"
                                                                      className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
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

               {/* COURSE VIDEOS SUB-MODAL */}
               {showVideoModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-99999 p-4">
                         <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto flex flex-col justify-between">
                              {/* Sub-modal Header */}
                              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
                                   <div>
                                        <h3 className="text-base font-bold text-gray-900">
                                             Add & Edit Course Videos ({videos.length})
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                             Upload or link recording videos, title, alt text, and thumbnail images.
                                        </p>
                                   </div>
                                   <button
                                        type="button"
                                        onClick={() => setShowVideoModal(false)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
                                   >
                                        ✕
                                   </button>
                              </div>

                              {/* Sub-modal Content */}
                              <div className="p-6 space-y-5">
                                   <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Video List</span>
                                        <button
                                             type="button"
                                             onClick={addVideoItem}
                                             className="px-3.5 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                                        >
                                             <HiOutlinePlus size={14} /> Add Video
                                        </button>
                                   </div>

                                   {videos.map((v, vIdx) => (
                                        <div key={vIdx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 relative text-left">
                                             <button
                                                  type="button"
                                                  onClick={() => removeVideoItem(vIdx)}
                                                  className="absolute top-2.5 right-2.5 w-6 h-6 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold transition-colors cursor-pointer"
                                             >
                                                  ✕
                                             </button>
                                             <div className="text-xs font-bold text-gray-700">Video #{vIdx + 1}</div>

                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                  <div className="space-y-1">
                                                       <label className="text-[11px] font-bold text-gray-500">Video Title</label>
                                                       <input
                                                            value={v.title || ""}
                                                            onChange={(e) => updateVideoItemField(vIdx, "title", e.target.value)}
                                                            placeholder="e.g. Session 1: Figma Wireframing"
                                                            className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                       />
                                                  </div>
                                                  <div className="space-y-1">
                                                       <label className="text-[11px] font-bold text-gray-500">Alt Text</label>
                                                       <input
                                                            value={v.alt || ""}
                                                            onChange={(e) => updateVideoItemField(vIdx, "alt", e.target.value)}
                                                            placeholder="e.g. Figma tutorial recording"
                                                            className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                       />
                                                  </div>
                                             </div>

                                             <div className="space-y-1">
                                                  <label className="text-[11px] font-bold text-gray-500">Video URL / Direct Link</label>
                                                  <input
                                                       value={typeof v.video === "string" ? v.video : ""}
                                                       onChange={(e) => updateVideoItemField(vIdx, "video", e.target.value)}
                                                       placeholder="e.g. https://res.cloudinary.com/.../video.mp4 or YouTube link"
                                                       className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                  />
                                                  <div className="pt-1">
                                                       <label className="text-[10px] font-semibold text-gray-400">Or Upload Video File:</label>
                                                       <input
                                                            type="file"
                                                            accept="video/*"
                                                            disabled={v.uploading}
                                                            onChange={(e) => {
                                                                 if (e.target.files && e.target.files[0]) {
                                                                      handleVideoFileUpload(vIdx, e.target.files[0]);
                                                                 }
                                                            }}
                                                            className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 cursor-pointer disabled:opacity-50"
                                                       />
                                                       {v.uploading && (
                                                            <div className="mt-2 space-y-1.5 bg-orange-50/80 p-2.5 rounded-lg border border-orange-200">
                                                                 <div className="flex items-center justify-between text-[11px] font-bold text-orange-600">
                                                                      <span className="flex items-center gap-1.5">
                                                                           <div className="w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                                                           Uploading video...
                                                                      </span>
                                                                      <span>{v.progress || 0}%</span>
                                                                 </div>
                                                                 <div className="w-full bg-orange-200/60 rounded-full h-2 overflow-hidden">
                                                                      <div
                                                                           className="bg-orange-500 h-2 rounded-full transition-all duration-200"
                                                                           style={{ width: `${v.progress || 0}%` }}
                                                                      ></div>
                                                                 </div>
                                                            </div>
                                                       )}
                                                       {!v.uploading && v.video && typeof v.video === "string" && (
                                                            <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                                                                 <span>✓</span> Video Uploaded: <span className="font-mono text-gray-600 truncate max-w-xs">{v.video}</span>
                                                            </p>
                                                       )}
                                                       {v.uploadError && (
                                                            <p className="text-[10px] text-red-600 font-bold mt-1">
                                                                 ✕ {v.uploadError}
                                                            </p>
                                                       )}
                                                  </div>
                                             </div>

                                             <div className="space-y-1 pt-1">
                                                  <label className="text-[11px] font-bold text-gray-500">Thumbnail Image URL / Upload</label>
                                                  <input
                                                       value={typeof v.thumbnail === "string" ? v.thumbnail : ""}
                                                       onChange={(e) => updateVideoItemField(vIdx, "thumbnail", e.target.value)}
                                                       placeholder="e.g. https://res.cloudinary.com/.../thumb.jpg"
                                                       className="w-full h-9 px-3 mb-1 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                  />
                                                  <ImageUploader
                                                       setImage={(imgFile) => updateVideoItemField(vIdx, "thumbnail", imgFile)}
                                                       initialImage={v.thumbnail}
                                                  />
                                             </div>
                                        </div>
                                   ))}

                                   {videos.length === 0 && (
                                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 space-y-2">
                                             <p className="text-xs text-gray-400">No videos added yet for this course.</p>
                                             <button
                                                  type="button"
                                                  onClick={addVideoItem}
                                                  className="px-4 py-2 bg-orange-500 text-white font-bold rounded-lg text-xs cursor-pointer hover:bg-orange-600 transition"
                                             >
                                                  + Add First Video
                                             </button>
                                        </div>
                                   )}
                              </div>

                              {/* Sub-modal Footer */}
                              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white sticky bottom-0 rounded-b-2xl">
                                   <button
                                        type="button"
                                        onClick={() => setShowVideoModal(false)}
                                        disabled={videos.some(v => v.uploading)}
                                        className={`px-5 py-2 text-xs font-bold rounded-xl transition shadow-sm ${
                                             videos.some(v => v.uploading)
                                                  ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                                                  : "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                                        }`}
                                   >
                                        {videos.some(v => v.uploading) ? (
                                             <span className="flex items-center gap-2">
                                                  <div className="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                                                  Uploading Video...
                                             </span>
                                        ) : (
                                             `Done (${videos.length} Video${videos.length !== 1 ? 's' : ''})`
                                        )}
                                   </button>
                              </div>
                         </div>
                    </div>
               )}

               {/* ZOOM LIVE SESSION DISPATCH MODAL */}
               {showMeetModal && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
                         <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-gray-100 overflow-hidden my-auto">
                              {/* Header */}
                              <div className="flex items-center justify-between px-6 py-4 bg-[#0B5CFF] text-white border-b-4 border-blue-900">
                                   <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                                        <h3 className="font-bold text-base text-white">🔵 Dispatch Zoom Live Meeting to Enrolled Students</h3>
                                   </div>
                                   <button
                                        type="button"
                                        onClick={() => setShowMeetModal(false)}
                                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition cursor-pointer"
                                   >
                                        ✕
                                   </button>
                              </div>

                              {/* Form Body */}
                              <form onSubmit={handleSendMeetLink} className="p-6 space-y-4">
                                   <div>
                                        <label className={labelClass}>Select Target Course</label>
                                        <select
                                             value={selectedCourseForMeet}
                                             onChange={(e) => handleCourseSelectionChange(e.target.value)}
                                             className={inputClass}
                                        >
                                             <option value="ALL">🌐 Send to ALL Registered Students (All Courses)</option>
                                             {courses.map((c) => (
                                                  <option key={c._id || c.slug} value={c._id || c.slug}>
                                                       📚 {c.title}
                                                  </option>
                                             ))}
                                        </select>
                                   </div>

                                   <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                             <label className={labelClass} style={{ marginBottom: 0 }}>Zoom Meeting Link / URL *</label>
                                             <div className="flex items-center gap-2">
                                                  <button
                                                       type="button"
                                                       onClick={handleAutoGenerateZoomLink}
                                                       disabled={generatingZoomApi}
                                                       className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200 cursor-pointer flex items-center gap-1 transition"
                                                  >
                                                       {generatingZoomApi ? "⏳ Generating Zoom..." : "⚡ Auto-Generate Real Link"}
                                                  </button>
                                                  <a
                                                       href="https://zoom.us/meeting/schedule"
                                                       target="_blank"
                                                       rel="noopener noreferrer"
                                                       className="text-xs font-bold text-zinc-600 hover:text-zinc-800 bg-zinc-100 px-2 py-1 rounded-md border border-zinc-200 cursor-pointer flex items-center gap-1 no-underline"
                                                  >
                                                       🎥 Open Zoom App ↗
                                                  </a>
                                             </div>
                                        </div>
                                        <input
                                             type="url"
                                             required
                                             value={meetUrl}
                                             onChange={(e) => handleMeetUrlChange(e.target.value)}
                                             placeholder="Paste real Zoom link, e.g. https://us04web.zoom.us/j/81234567890?pwd=abcde"
                                             className={inputClass}
                                        />
                                        {startUrl ? (
                                             <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs mt-2">
                                                  <div>
                                                       <span className="font-bold text-emerald-900 block">👑 Admin / Host Meeting Join Link</span>
                                                       <span className="text-emerald-700 font-medium text-[11px]">Click here to start & host class with full Admin powers</span>
                                                  </div>
                                                  <a
                                                       href={startUrl}
                                                       target="_blank"
                                                       rel="noopener noreferrer"
                                                       className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shrink-0 no-underline shadow-sm"
                                                  >
                                                       Start Class as Host ↗
                                                  </a>
                                             </div>
                                        ) : (
                                             <p className="text-[11px] font-semibold text-amber-600 mt-1">
                                                  ⚠️ Click "Auto-Generate Real Link" or paste a real Zoom link. (Fake Math IDs return Zoom 3001).
                                             </p>
                                        )}
                                   </div>

                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                             <label className={labelClass}>Zoom Meeting ID (Optional)</label>
                                             <input
                                                  type="text"
                                                  value={zoomMeetingId}
                                                  onChange={(e) => setZoomMeetingId(e.target.value)}
                                                  placeholder="e.g. 987 6543 210"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Passcode (Optional)</label>
                                             <input
                                                  type="text"
                                                  value={zoomPasscode}
                                                  onChange={(e) => setZoomPasscode(e.target.value)}
                                                  placeholder="e.g. wux123"
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>

                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                             <label className={labelClass}>Session Title / Topic</label>
                                             <input
                                                  type="text"
                                                  value={meetTitle}
                                                  onChange={(e) => setMeetTitle(e.target.value)}
                                                  placeholder="e.g. Live UI/UX Q&A Session"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Scheduled Date & Time</label>
                                             <input
                                                  type="text"
                                                  value={meetScheduledAt}
                                                  onChange={(e) => setMeetScheduledAt(e.target.value)}
                                                  placeholder="e.g. Today at 7:00 PM"
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>

                                   <div>
                                        <label className={labelClass}>Instructions / Agenda (Optional)</label>
                                        <textarea
                                             rows="2"
                                             value={meetInstructions}
                                             onChange={(e) => setMeetInstructions(e.target.value)}
                                             placeholder="e.g. Please join with your registered email. Have Figma open for practical review."
                                             className={inputClass}
                                        />
                                   </div>

                                   <div className="flex items-center gap-3 pt-1">
                                        <input
                                             type="checkbox"
                                             id="saveToCourse"
                                             checked={meetSaveToCourse}
                                             onChange={(e) => setMeetSaveToCourse(e.target.checked)}
                                             className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                        />
                                        <label htmlFor="saveToCourse" className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
                                             Display 🔵 "Join Zoom Meeting" button on Student Dashboard
                                        </label>
                                   </div>

                                   {/* Submit Actions */}
                                   <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                        <button
                                             type="button"
                                             onClick={() => setShowMeetModal(false)}
                                             className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition cursor-pointer"
                                        >
                                             Cancel
                                        </button>
                                        <button
                                             type="submit"
                                             disabled={sendingMeetEmail}
                                             className="px-6 py-2.5 bg-[#0B5CFF] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
                                        >
                                             {sendingMeetEmail ? (
                                                  <>
                                                       <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                       <span>Sending Zoom Emails...</span>
                                                  </>
                                             ) : (
                                                  <>
                                                       <span>✉️ Dispatch Zoom Invite</span>
                                                  </>
                                             )}
                                        </button>
                                   </div>
                              </form>
                         </div>
                    </div>
               )}
          </div>
     );
}
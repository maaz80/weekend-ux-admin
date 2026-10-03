import { useState, useEffect } from "react";
import { 
     HiOutlineVideoCamera, 
     HiOutlineClock, 
     HiOutlineExternalLink, 
     HiOutlineTrash, 
     HiOutlineRefresh,
     HiOutlinePlus,
     HiOutlineClipboardCopy,
     HiOutlineSwitchHorizontal,
     HiOutlineX,
     HiOutlineShieldCheck,
     HiOutlineLightningBolt,
     HiOutlineMail,
     HiOutlineAcademicCap,
     HiOutlineXCircle,
     HiOutlineCloudDownload
} from "react-icons/hi";
import { useToast } from "../context/ToastContext";
import EmailTagInput from "../components/EmailTagInput";
import { getAdminToken } from "../utils/auth.js";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export default function LiveMeetings() {
     const { showToast } = useToast();
     const [courses, setCourses] = useState([]);
     const [loading, setLoading] = useState(true);
     const [syncingRecordings, setSyncingRecordings] = useState(false);

     // Active Admin Host In-App Modal state
     const [activeAdminHostModalCourse, setActiveAdminHostModalCourse] = useState(null);

     // Dispatch modal state
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
     const [trainerEmails, setTrainerEmails] = useState([]);
     const [counselorEmails, setCounselorEmails] = useState([]);
     const [extraStudentEmails, setExtraStudentEmails] = useState([]);
     const [sendingMeetEmail, setSendingMeetEmail] = useState(false);
     const [generatingZoomApi, setGeneratingZoomApi] = useState(false);

     const fetchCourses = async () => {
          setLoading(true);
          try {
               const res = await fetch(`${API_URL}/courses`);
               if (res.ok) {
                    const data = await res.json();
                    setCourses(data?.course || []);
               }
          } catch (err) {
               showToast("Failed to load courses.", "error");
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchCourses();
     }, []);

     // Filter courses that have active live classes
     const activeLiveClasses = courses.filter(c => c?.liveClass?.active && c?.liveClass?.meetUrl);

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
                    showToast("Real Zoom meeting generated via Zoom API!", "success");
               } else if (data.needCredentials) {
                    showToast("Configure ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET in .env or paste real URL.", "info");
               } else {
                    showToast(data.error || "Failed to generate Zoom meeting.", "error");
               }
          } catch (err) {
               showToast("Failed to connect to Zoom API. Paste your real Zoom URL below.", "error");
          } finally {
               setGeneratingZoomApi(false);
          }
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
          setStartUrl("");
          setZoomMeetingId("");
          setZoomPasscode("");
          setMeetInstructions("");
          setTrainerEmails([]);
          setCounselorEmails([]);
          setExtraStudentEmails([]);
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

               const adminToken = getAdminToken();
               const headers = { "Content-Type": "application/json" };
               if (adminToken) headers["Authorization"] = `Bearer ${adminToken}`;

               const res = await fetch(`${API_URL}/admin/send-meet-link`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                         courseId: selectedCourseForMeet,
                         courseSlug: targetCourseObj?.slug || "",
                         courseTitle: selectedCourseForMeet === "ALL" ? "All Courses" : (targetCourseObj?.title || "UI/UX Program"),
                         meetUrl,
                         startUrl,
                         zoomMeetingId,
                         passcode: zoomPasscode,
                         title: meetTitle,
                         scheduledAt: meetScheduledAt,
                         instructions: meetInstructions,
                         saveToCourse: meetSaveToCourse,
                         trainerEmails,
                         counselorEmails,
                         extraStudentEmails
                    })
               });

               const data = await res.json();
               if (res.ok && data.success) {
                    showToast(data.message || "Zoom link successfully sent!", "success");
                    setShowMeetModal(false);
                    setTrainerEmails([]);
                    setCounselorEmails([]);
                    setExtraStudentEmails([]);
                    fetchCourses();
               } else {
                    showToast(data.error || "Failed to send Zoom meeting link.", "error");
               }
          } catch (err) {
               showToast("Error connecting to server.", "error");
          } finally {
               setSendingMeetEmail(false);
          }
     };

     const handleEndLiveSession = async (courseId, courseSlug) => {
          if (!window.confirm("Are you sure you want to end this Zoom live session? Students will no longer see the join banner.")) {
               return;
          }

          try {
               const res = await fetch(`${API_URL}/admin/clear-live-class`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ courseId, courseSlug })
               });
               if (res.ok) {
                    showToast("Live Zoom session ended.", "success");
                    if (activeAdminHostModalCourse) setActiveAdminHostModalCourse(null);
                    fetchCourses();
               } else {
                    showToast("Failed to end live session.", "error");
               }
          } catch (err) {
               showToast("Server error.", "error");
          }
     };

     const handleSyncRecordings = async () => {
          setSyncingRecordings(true);
          try {
               const res = await fetch(`${API_URL}/admin/sync-zoom-recordings`, {
                    method: "POST"
               });
               const data = await res.json();
               if (res.ok && data.success) {
                    showToast(data.message || "Cloud recordings synced successfully!", "success");
                    fetchCourses();
               } else {
                    showToast(data.message || data.error || "Failed to sync recordings.", "error");
               }
          } catch (err) {
               showToast("Error connecting to Zoom recordings API.", "error");
          } finally {
               setSyncingRecordings(false);
          }
     };

     const copyToClipboard = (text, label) => {
          if (!text) return;
          navigator.clipboard.writeText(text);
          showToast(`${label} copied to clipboard!`, "success");
     };

     const labelClass = "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5";
     const inputClass = "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-official focus:bg-white transition";

     return (
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-urbanist">
               
               {/* PAGE HEADER */}
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-950 p-6 rounded-3xl text-white shadow-xl border border-zinc-800">
                    <div className="space-y-1">
                         <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-official animate-ping" />
                              <span className="text-xs font-extrabold uppercase tracking-wider text-official">
                                   Zoom Live Management Center
                              </span>
                         </div>
                         <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                              Live Classes & Scheduled Sessions
                         </h1>
                         <p className="text-xs sm:text-sm text-zinc-300">
                              Manage active Zoom sessions and launch meetings in-app as Admin Host.
                         </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                         <button
                              onClick={fetchCourses}
                              className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition cursor-pointer"
                              title="Refresh Meetings"
                         >
                              <HiOutlineRefresh className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                         </button>

                         <button
                              onClick={handleSyncRecordings}
                              disabled={syncingRecordings}
                              className="px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-official border border-official/30 font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                              title="Sync Cloud Recordings from Zoom Account"
                         >
                              <HiOutlineCloudDownload className={`w-5 h-5 ${syncingRecordings ? "animate-bounce" : ""}`} />
                              <span>{syncingRecordings ? "Syncing..." : "Sync Recordings"}</span>
                         </button>

                         <button
                              onClick={() => openMeetModal("ALL")}
                              className="w-full sm:w-auto px-5 py-3 bg-official hover:bg-official/90 text-zinc-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                         >
                              <HiOutlinePlus className="w-5 h-5" />
                              <span>Schedule New Live Session</span>
                         </button>
                    </div>
               </div>

               {/* ACTIVE SESSIONS LIST SECTION */}
               <div className="space-y-4">
                    <div className="flex items-center justify-between">
                         <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                              <HiOutlineVideoCamera className="text-official w-5 h-5" />
                              Active Live Sessions ({activeLiveClasses.length})
                         </h2>
                         {activeLiveClasses.length > 0 && (
                              <button
                                   onClick={() => handleEndLiveSession("ALL")}
                                   className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 cursor-pointer flex items-center gap-1"
                              >
                                   <HiOutlineTrash className="w-4 h-4" /> End ALL Live Sessions
                              </button>
                         )}
                    </div>

                    {loading ? (
                         <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 space-y-2">
                              <div className="w-8 h-8 border-3 border-official border-t-transparent rounded-full animate-spin mx-auto" />
                              <p className="text-xs font-semibold">Loading live sessions...</p>
                         </div>
                    ) : activeLiveClasses.length > 0 ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              {activeLiveClasses.map((course) => {
                                   const lc = course.liveClass || {};
                                   return (
                                        <div 
                                             key={course._id || course.slug}
                                             className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition space-y-4 relative overflow-hidden"
                                        >
                                             {/* Top Course Badge & End Button */}
                                             <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
                                                  <div className="space-y-1">
                                                       <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-900 bg-official/20 px-2.5 py-0.5 rounded-md border border-official/30 flex items-center gap-1 w-fit">
                                                            <HiOutlineAcademicCap className="w-3.5 h-3.5 text-zinc-900" />
                                                            <span>{course.title}</span>
                                                       </span>
                                                       <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                                            {lc.title || "Live Zoom Session"}
                                                       </h3>
                                                  </div>
                                                  <button
                                                       onClick={() => handleEndLiveSession(course._id, course.slug)}
                                                       className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl border border-red-200 cursor-pointer shrink-0"
                                                  >
                                                       End Class
                                                  </button>
                                             </div>

                                             {/* Scheduled Info & Credentials */}
                                             <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-3.5 space-y-2 text-xs">
                                                  <div className="flex items-center justify-between text-gray-700">
                                                       <span className="font-semibold flex items-center gap-1 text-gray-500">
                                                            <HiOutlineClock className="w-4 h-4 text-zinc-900" /> Scheduled:
                                                       </span>
                                                       <span className="font-bold text-zinc-900">{lc.scheduledAt || "Live Now"}</span>
                                                  </div>

                                                  {lc.zoomMeetingId && (
                                                       <div className="flex items-center justify-between pt-1.5 border-t border-gray-200/60">
                                                            <span className="text-gray-500 font-medium">Meeting ID:</span>
                                                            <div className="flex items-center gap-1">
                                                                 <span className="font-mono font-bold text-gray-900">{lc.zoomMeetingId}</span>
                                                                 <button
                                                                      onClick={() => copyToClipboard(lc.zoomMeetingId, "Meeting ID")}
                                                                      className="text-zinc-900 hover:text-black p-1 cursor-pointer"
                                                                 >
                                                                      <HiOutlineClipboardCopy className="w-4 h-4" />
                                                                 </button>
                                                            </div>
                                                       </div>
                                                  )}

                                                  {lc.passcode && (
                                                       <div className="flex items-center justify-between">
                                                            <span className="text-gray-500 font-medium">Passcode:</span>
                                                            <div className="flex items-center gap-1">
                                                                 <span className="font-mono font-bold text-gray-900">{lc.passcode}</span>
                                                                 <button
                                                                      onClick={() => copyToClipboard(lc.passcode, "Passcode")}
                                                                      className="text-zinc-900 hover:text-black p-1 cursor-pointer"
                                                                 >
                                                                      <HiOutlineClipboardCopy className="w-4 h-4" />
                                                                 </button>
                                                            </div>
                                                       </div>
                                                  )}
                                             </div>

                                             {/* ADMIN HOST IN-APP LAUNCH BUTTONS */}
                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                                                  <button
                                                       onClick={() => setActiveAdminHostModalCourse(course)}
                                                       className="w-full py-3 px-4 bg-official hover:bg-official/90 text-zinc-950 font-extrabold rounded-2xl text-xs transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                                                  >
                                                       <HiOutlineShieldCheck className="w-4 h-4" />
                                                       <span>Open In-App Host Console</span>
                                                  </button>

                                                  <a
                                                       href={lc.startUrl || lc.meetUrl}
                                                       target="_blank"
                                                       rel="noopener noreferrer"
                                                       className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold rounded-2xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer no-underline border border-zinc-800"
                                                       title="Launch Zoom as Verified Host using Host Start Link"
                                                  >
                                                       <HiOutlineExternalLink className="w-3.5 h-3.5" />
                                                       <span>Start as Host (Zoom App)</span>
                                                  </a>
                                             </div>
                                        </div>
                                   );
                              })}
                         </div>
                    ) : (
                         <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-10 text-center space-y-3">
                              <div className="w-12 h-12 bg-official/10 text-official rounded-2xl flex items-center justify-center mx-auto border border-official/30">
                                   <HiOutlineVideoCamera className="w-6 h-6" />
                              </div>
                              <h3 className="text-base font-bold text-gray-900">No Active Live Sessions</h3>
                              <p className="text-xs text-gray-500 max-w-md mx-auto">
                                   There are currently no active Zoom live classes scheduled. Click the button below to schedule a new live class for any course.
                              </p>
                              <button
                                   onClick={() => openMeetModal("ALL")}
                                   className="px-5 py-2.5 bg-official hover:bg-official/90 text-zinc-950 font-extrabold text-xs rounded-xl shadow-sm transition inline-flex items-center gap-1.5 cursor-pointer"
                              >
                                   <HiOutlinePlus className="w-4 h-4" />
                                   <span>Schedule Live Class</span>
                              </button>
                         </div>
                    )}
               </div>

               {/* ADMIN IN-APP HOST CLASSROOM MODAL */}
               {activeAdminHostModalCourse && (
                    <AdminHostClassroomModal 
                         course={activeAdminHostModalCourse}
                         onClose={() => setActiveAdminHostModalCourse(null)}
                         onRefresh={() => {
                              fetchCourses();
                         }}
                         showToast={showToast}
                         onEndSession={(cId, cSlug) => handleEndLiveSession(cId, cSlug)}
                    />
               )}

               {/* DISPATCH MODAL */}
               {showMeetModal && (
                    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-urbanist">
                         <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 border border-gray-100 my-auto">
                              
                              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                   <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-official/20 text-official flex items-center justify-center font-bold text-base border border-official/30">
                                             <HiOutlineVideoCamera className="w-4 h-4 text-zinc-950" />
                                        </div>
                                        <div>
                                             <h3 className="text-lg font-bold text-gray-900">Dispatch Zoom Live Class</h3>
                                             <p className="text-xs text-gray-500">Configure participant permissions & send emails</p>
                                        </div>
                                   </div>
                                   <button
                                        onClick={() => setShowMeetModal(false)}
                                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center font-bold transition cursor-pointer"
                                   >
                                        <HiOutlineX className="w-4 h-4" />
                                   </button>
                              </div>

                              <form onSubmit={handleSendMeetLink} className="space-y-4">
                                   <div>
                                        <label className={labelClass}>Target Course</label>
                                        <select
                                             value={selectedCourseForMeet}
                                             onChange={(e) => handleCourseSelectionChange(e.target.value)}
                                             className={inputClass}
                                        >
                                             <option value="ALL">Send to ALL Registered Students (All Courses)</option>
                                             {courses.map((c) => (
                                                  <option key={c._id || c.slug} value={c._id || c.slug}>
                                                       {c.title}
                                                  </option>
                                             ))}
                                        </select>
                                   </div>

                                   <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                             <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                  Zoom Meeting Join URL <span className="text-red-500">*</span>
                                             </label>
                                             <button
                                                  type="button"
                                                  onClick={handleAutoGenerateZoomLink}
                                                  disabled={generatingZoomApi}
                                                  className="text-xs font-bold text-zinc-950 hover:text-black bg-official/20 px-2.5 py-1 rounded-lg border border-official/30 transition flex items-center gap-1 cursor-pointer"
                                             >
                                                  {generatingZoomApi ? (
                                                       <>
                                                            <div className="w-3 h-3 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                                                            <span>Connecting Zoom API...</span>
                                                       </>
                                                  ) : (
                                                       <>
                                                            <HiOutlineLightningBolt className="w-3.5 h-3.5 text-zinc-950" />
                                                            <span>Auto-Generate Real Link</span>
                                                       </>
                                                  )}
                                             </button>
                                        </div>
                                        <input
                                             type="url"
                                             value={meetUrl}
                                             onChange={(e) => handleMeetUrlChange(e.target.value)}
                                             placeholder="https://zoom.us/j/123456789?pwd=xxxx"
                                             className={inputClass}
                                             required
                                        />
                                   </div>

                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                             <label className={labelClass}>Meeting ID (Optional)</label>
                                             <input
                                                  type="text"
                                                  value={zoomMeetingId}
                                                  onChange={(e) => setZoomMeetingId(e.target.value)}
                                                  placeholder="e.g. 123 456 789"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Passcode (Optional)</label>
                                             <input
                                                  type="text"
                                                  value={zoomPasscode}
                                                  onChange={(e) => setZoomPasscode(e.target.value)}
                                                  placeholder="e.g. 123456"
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>

                                   <div>
                                        <label className={labelClass}>Class Topic / Title</label>
                                        <input
                                             type="text"
                                             value={meetTitle}
                                             onChange={(e) => setMeetTitle(e.target.value)}
                                             className={inputClass}
                                             required
                                        />
                                   </div>

                                   <div>
                                        <label className={labelClass}>Scheduled Time Display</label>
                                        <input
                                             type="text"
                                             value={meetScheduledAt}
                                             onChange={(e) => setMeetScheduledAt(e.target.value)}
                                             placeholder="e.g. Today at 7:00 PM IST"
                                             className={inputClass}
                                        />
                                   </div>

                                   <div>
                                        <label className={labelClass}>Special Instructions (Optional)</label>
                                        <textarea
                                             rows="2"
                                             value={meetInstructions}
                                             onChange={(e) => setMeetInstructions(e.target.value)}
                                             placeholder="e.g. Please join 5 mins prior and keep Figma desktop open."
                                             className={inputClass}
                                        />
                                   </div>

                                   {/* Additional Participants & Email Invites Section */}
                                   <div className="space-y-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                             <HiOutlineMail className="w-4 h-4 text-official" />
                                             <div>
                                                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                                                       Additional Meeting Recipients
                                                  </h4>
                                                  <p className="text-[11px] text-gray-500">
                                                       Link will be emailed to all enrolled students of the selected course, plus any emails added below.
                                                  </p>
                                             </div>
                                        </div>

                                        {/* 1. Trainer Emails */}
                                        <EmailTagInput
                                             label="1. Trainer Email(s)"
                                             emails={trainerEmails}
                                             onChange={setTrainerEmails}
                                             placeholder="e.g. trainer1@weekendux.in, mentor@weekendux.in"
                                             color="purple"
                                             badgeRole="Trainer"
                                             helperText="Trainers receive full Zoom meeting join details."
                                        />

                                        {/* 2. Counselor Emails */}
                                        <EmailTagInput
                                             label="2. Counselor Email(s)"
                                             emails={counselorEmails}
                                             onChange={setCounselorEmails}
                                             placeholder="e.g. counselor1@weekendux.in, admissions@weekendux.in"
                                             color="teal"
                                             badgeRole="Counselor"
                                             helperText="Counselors receive the session link to monitor or coordinate."
                                        />

                                        {/* 3. Extra Students Emails */}
                                        <EmailTagInput
                                             label="3. Extra Student Email(s)"
                                             emails={extraStudentEmails}
                                             onChange={setExtraStudentEmails}
                                             placeholder="e.g. guest.student@gmail.com, candidate2@gmail.com"
                                             color="blue"
                                             badgeRole="Student"
                                             helperText="Any additional students or demo attendees who should receive the invite."
                                        />
                                   </div>

                                   <div className="pt-2 flex items-center justify-end gap-3">
                                        <button
                                             type="button"
                                             onClick={() => setShowMeetModal(false)}
                                             className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 rounded-xl transition cursor-pointer"
                                        >
                                             Cancel
                                        </button>

                                        <button
                                             type="submit"
                                             disabled={sendingMeetEmail}
                                             className="px-6 py-3 bg-official hover:bg-official/90 text-zinc-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                        >
                                             {sendingMeetEmail ? (
                                                  <>
                                                       <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                                                       <span>Sending Invites...</span>
                                                  </>
                                             ) : (
                                                  <>
                                                       <HiOutlineMail className="w-4 h-4" />
                                                       <span>Save & Email Invites</span>
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

// ADMIN HOST IN-APP CLASSROOM MODAL
function AdminHostClassroomModal({ course, onClose, onRefresh, showToast, onEndSession }) {
     const lc = course.liveClass || {};
     const [isExpandedFull, setIsExpandedFull] = useState(false);
     const [isLandscape, setIsLandscape] = useState(false);
     const [iframeKey, setIframeKey] = useState(Date.now());

     let effectiveId = lc.zoomMeetingId || "";
     let effectivePasscode = lc.passcode || "";
     if (lc.meetUrl) {
          if (!effectiveId) {
               const idMatch = lc.meetUrl.match(/\/(?:j|wc\/join)\/(\d+)/);
               if (idMatch && idMatch[1]) effectiveId = idMatch[1];
          }
          if (!effectivePasscode) {
               const pwdMatch = lc.meetUrl.match(/[?&]pwd=([^&]+)/);
               if (pwdMatch && pwdMatch[1]) effectivePasscode = pwdMatch[1];
          }
     }

     const cleanId = (effectiveId || "").replace(/\s+/g, "");
     const sessionToken = iframeKey.toString().slice(-4);
     const baseEmbedUrl = cleanId 
          ? `https://zoom.us/wc/join/${cleanId}?pwd=${effectivePasscode}&dn=${encodeURIComponent('AdminHost_' + sessionToken)}`
          : lc.meetUrl;
     const embedUrl = `${baseEmbedUrl}${baseEmbedUrl.includes('?') ? '&' : '?'}t=${iframeKey}`;

     const handleRefreshStream = () => {
          setIframeKey(Date.now());
          showToast("Re-initializing Admin Host stream...", "info");
     };

     return (
          <div className="fixed inset-0 z-[999999] bg-black/65 backdrop-blur-md sm:backdrop-blur-xl flex items-center justify-center p-2 sm:p-3 overflow-hidden font-urbanist">
               
               <div className={`bg-zinc-950 text-white border border-zinc-800 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
                    isExpandedFull 
                         ? "w-screen h-screen max-w-none max-h-none rounded-none border-0" 
                         : isLandscape 
                              ? "w-[99vw] h-[96vh] rounded-2xl sm:rounded-3xl" 
                              : "w-full max-w-6xl h-[92vh] sm:h-[95vh] rounded-2xl sm:rounded-3xl"
               }`}>

                    {/* TOP HOST HEADER */}
                    <div className="p-3 sm:p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between gap-2 sm:gap-4 shrink-0 z-20 h-16 sm:h-18">
                         <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-2">
                                   <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-official/20 text-official border border-official/30 uppercase tracking-wider shrink-0">
                                        <HiOutlineShieldCheck className="w-3.5 h-3.5 text-official" />
                                        <span>Admin Host Control Room</span>
                                   </span>
                                   <span className="text-xs font-semibold text-zinc-400 truncate hidden sm:inline">
                                        • {course.title}
                                   </span>
                              </div>
                              <h2 className="text-sm sm:text-base md:text-lg font-bold text-white leading-tight truncate">
                                   {lc.title || "Live Class Session"}
                              </h2>
                         </div>

                         {/* ACTION CONTROLS & CLOSE */}
                         <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                              {/* REFRESH STREAM BUTTON */}
                              <button
                                   onClick={handleRefreshStream}
                                   className="px-2.5 py-1.5 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                                   title="Fix Stuck Joining - Re-initialize Stream"
                              >
                                   <HiOutlineRefresh className="w-4 h-4" />
                                   <span className="hidden md:inline">Reload</span>
                              </button>

                              {/* FULLSCREEN EXPAND TOGGLE */}
                              <button
                                   onClick={() => setIsExpandedFull(!isExpandedFull)}
                                   className="px-2.5 py-1.5 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                                   title={isExpandedFull ? "Exit Fullscreen" : "Fullscreen Host Room"}
                              >
                                   {isExpandedFull ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9L4 4m0 0l5 0m-5 0l0 5m11 0l5-5m0 0l-5 0m5 0l0 5m-5 11l5 5m0 0l-5 0m5 0l0-5m-11 0l-5 5m0 0l5 0m-5 0l0-5"/></svg>
                                   ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
                                   )}
                                   <span className="hidden md:inline">{isExpandedFull ? "Restore" : "Fullscreen"}</span>
                               </button>

                              {/* ROTATE SCREEN BUTTON */}
                              <button
                                   onClick={() => setIsLandscape(!isLandscape)}
                                   className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                        isLandscape ? "bg-official text-zinc-950 border-official font-extrabold" : "bg-zinc-900 text-zinc-300 border-zinc-700 hover:text-white"
                                   }`}
                              >
                                   <HiOutlineSwitchHorizontal className="w-4 h-4" />
                                   <span className="hidden sm:inline">{isLandscape ? "Portrait" : "Rotate"}</span>
                              </button>

                              <button
                                   onClick={onClose}
                                   className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0 border border-zinc-700"
                              >
                                   <HiOutlineX className="w-4 h-4" />
                              </button>
                         </div>
                    </div>

                    {/* MAIN IN-APP EMBEDDED PLAYER FOR ADMIN */}
                    <div className="flex-1 flex flex-col overflow-hidden bg-black relative w-full h-full min-h-0">
                         <iframe
                              key={iframeKey}
                              src={embedUrl}
                              allow="microphone *; camera *; display-capture *; autoplay *; clipboard-write *; fullscreen *"
                              className="w-full flex-1 border-0 grow h-full min-h-0 bg-black"
                              title="Admin Host Zoom Player"
                         />

                         {/* LIVE ADMIN HOST CONTROL TOOLBAR AT BOTTOM */}
                         <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 shrink-0 px-4 sm:px-6 z-10 min-h-16">
                              <div className="flex items-center gap-2 text-xs text-official font-bold">
                                   <span className="w-2.5 h-2.5 rounded-full bg-official animate-ping" />
                                   <span className="hidden sm:inline">Live Admin Control Active</span>
                              </div>

                              <button
                                   onClick={() => onEndSession(course._id, course.slug)}
                                   className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
                              >
                                   <HiOutlineXCircle className="w-4 h-4" />
                                   <span>End Class for All</span>
                              </button>
                         </div>
                    </div>

               </div>
          </div>
     );
}

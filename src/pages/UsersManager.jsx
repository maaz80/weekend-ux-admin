import { useState, useEffect } from "react";
import { getAdminToken } from "../utils/auth";
import { HiOutlineUserGroup, HiOutlineSearch, HiOutlineLockOpen, HiOutlineLockClosed, HiOutlineX } from "react-icons/hi";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export default function UsersManager() {
     const [users, setUsers] = useState([]);
     const [availableCourses, setAvailableCourses] = useState([]);
     const [searchQuery, setSearchQuery] = useState("");
     const [loading, setLoading] = useState(true);
     const [actionLoading, setActionLoading] = useState(false);
     const [message, setMessage] = useState({ type: "", text: "" });

     const [selectedUser, setSelectedUser] = useState(null);
     const [selectedCourseId, setSelectedCourseId] = useState("");
     const [showAssignModal, setShowAssignModal] = useState(false);

     const fetchUsersAndCourses = async () => {
          setLoading(true);
          try {
               const token = getAdminToken();
               const headers = { Authorization: `Bearer ${token}` };

               const [usersRes, coursesRes] = await Promise.all([
                    fetch(`${API_URL}/admin/users`, { headers }),
                    fetch(`${API_URL}/courses`)
               ]);

               if (usersRes.ok) {
                    const uData = await usersRes.json();
                    setUsers(uData.users || []);
               }

               if (coursesRes.ok) {
                    const cData = await coursesRes.json();
                    setAvailableCourses(cData.course || []);
               }
          } catch (err) {
               console.error("Failed to fetch users or courses:", err);
               setMessage({ type: "error", text: "Failed to load users and courses data" });
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchUsersAndCourses();
     }, []);

     const handleOpenAssignModal = (user) => {
          setSelectedUser(user);
          setSelectedCourseId("");
          setShowAssignModal(true);
          setMessage({ type: "", text: "" });
     };

     const handleAssignCourse = async () => {
          if (!selectedUser || !selectedCourseId) {
               setMessage({ type: "error", text: "Please select a course to unlock" });
               return;
          }

          setActionLoading(true);
          setMessage({ type: "", text: "" });

          try {
               const token = getAdminToken();
               const res = await fetch(`${API_URL}/admin/users/assign-course`, {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                         Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                         userId: selectedUser._id,
                         courseId: selectedCourseId
                    })
               });

               const data = await res.json();

               if (res.ok && data.success) {
                    setMessage({ type: "success", text: `Course unlocked for ${selectedUser.name} successfully!` });
                    setShowAssignModal(false);
                    fetchUsersAndCourses();
               } else {
                    setMessage({ type: "error", text: data.error || "Failed to unlock course" });
               }
          } catch (err) {
               console.error("Assign course error:", err);
               setMessage({ type: "error", text: "An error occurred while unlocking course" });
          } finally {
               setActionLoading(false);
          }
     };

     const handleRevokeCourse = async (user, courseId) => {
          if (!window.confirm(`Are you sure you want to lock/revoke this course for ${user.name}?`)) {
               return;
          }

          setActionLoading(true);
          try {
          const cleanCourseId = typeof courseId === 'object' ? (courseId?._id || courseId?.slug || "") : (courseId || "");
          const token = getAdminToken();
          const res = await fetch(`${API_URL}/admin/users/revoke-course`, {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
               },
               body: JSON.stringify({
                    userId: user._id,
                    courseId: cleanCourseId
               })
          });

               const data = await res.json();

               if (res.ok && data.success) {
                    setMessage({ type: "success", text: `Course locked for ${user.name} successfully!` });
                    fetchUsersAndCourses();
               } else {
                    setMessage({ type: "error", text: data.error || "Failed to revoke course" });
               }
          } catch (err) {
               console.error("Revoke course error:", err);
               setMessage({ type: "error", text: "An error occurred while revoking course" });
          } finally {
               setActionLoading(false);
          }
     };

     const filteredUsers = users.filter((u) => {
          const query = searchQuery.toLowerCase();
          return (
               (u.name && u.name.toLowerCase().includes(query)) ||
               (u.email && u.email.toLowerCase().includes(query)) ||
               (u.phone && u.phone.includes(query))
          );
     });

     return (
          <div className="p-6 max-w-7xl mx-auto space-y-6">
               {/* Header */}
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
                    <div>
                         <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
                              <HiOutlineUserGroup className="text-amber-500" /> User Course Access (Simplilearn Flow)
                         </h1>
                         <p className="text-sm text-zinc-500 mt-1">
                              Unlock specific courses for registered users after offline payment / enquiry.
                         </p>
                    </div>
                    <button
                         onClick={fetchUsersAndCourses}
                         className="px-4 py-2 bg-zinc-900 text-white text-sm font-semibold rounded-lg hover:bg-zinc-800 transition"
                    >
                         Refresh Users
                    </button>
               </div>

               {/* Toast Message */}
               {message.text && (
                    <div
                         className={`p-4 rounded-lg text-sm font-medium flex items-center justify-between ${
                              message.type === "success"
                                   ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                   : "bg-rose-50 text-rose-800 border border-rose-200"
                         }`}
                    >
                         <span>{message.text}</span>
                         <button onClick={() => setMessage({ type: "", text: "" })} className="text-zinc-500 hover:text-zinc-700">
                              <HiOutlineX size={18} />
                         </button>
                    </div>
               )}

               {/* Search Bar */}
               <div className="relative">
                    <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                    <input
                         type="text"
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         placeholder="Search users by name, email, or phone number..."
                         className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
               </div>

               {/* Users Table */}
               {loading ? (
                    <div className="py-12 text-center text-zinc-500 font-medium">Loading registered users...</div>
               ) : filteredUsers.length === 0 ? (
                    <div className="py-12 text-center text-zinc-500 bg-white border border-zinc-200 rounded-xl">
                         No registered users found.
                    </div>
               ) : (
                    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                         <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse text-sm">
                                   <thead>
                                        <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-semibold uppercase text-xs">
                                             <th className="p-4">User</th>
                                             <th className="p-4">Email</th>
                                             <th className="p-4">Unlocked Courses</th>
                                             <th className="p-4 text-right">Actions</th>
                                        </tr>
                                   </thead>
                                   <tbody className="divide-y divide-zinc-200">
                                        {filteredUsers.map((u) => {
                                             const unlockedCount = u.enrolledCourses?.length || 0;
                                             return (
                                                  <tr key={u._id} className="hover:bg-zinc-50/80 transition">
                                                       <td className="p-4 font-medium text-zinc-900">
                                                            <div>{u.name || "N/A"}</div>
                                                            <div className="text-xs text-zinc-400">{u.phone ? `Phone: ${u.phone}` : "No phone"}</div>
                                                       </td>
                                                       <td className="p-4 text-zinc-600 font-mono text-xs">{u.email}</td>
                                                       <td className="p-4">
                                                            {unlockedCount === 0 ? (
                                                                 <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-400 bg-zinc-100 px-2.5 py-1 rounded-full">
                                                                      <HiOutlineLockClosed size={14} /> All Courses Locked
                                                                 </span>
                                                            ) : (
                                                                 <div className="flex flex-wrap gap-2">
                                                                       {u.enrolledCourses.map((ec, idx) => {
                                                                             const cObj = ec.courseId || {};
                                                                             const formattedSlug = ec.courseSlug ? ec.courseSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : null;
                                                                             const courseTitle = (typeof cObj === 'object' ? cObj.title || cObj.name : null) || formattedSlug || ec.courseSlug || "Course";
                                                                             const rawId = (typeof cObj === 'object' ? (cObj._id || cObj.slug) : cObj) || ec.courseSlug || ec.courseId;
                                                                             const cId = typeof rawId === 'object' ? (rawId?._id || rawId?.slug || "") : (rawId || "");
                                                                            return (
                                                                                 <span
                                                                                      key={cId?.toString() || idx}
                                                                                      className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full"
                                                                                 >
                                                                                      <HiOutlineLockOpen size={14} /> {courseTitle}
                                                                                      <button
                                                                                           onClick={() => handleRevokeCourse(u, cId)}
                                                                                           title="Lock/Revoke Course"
                                                                                           className="text-emerald-600 hover:text-rose-600 ml-1 p-0.5 rounded hover:bg-emerald-100"
                                                                                      >
                                                                                           <HiOutlineX size={12} />
                                                                                      </button>
                                                                                 </span>
                                                                            );
                                                                       })}
                                                                 </div>
                                                            )}
                                                       </td>
                                                       <td className="p-4 text-right">
                                                            <button
                                                                 onClick={() => handleOpenAssignModal(u)}
                                                                 className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white font-semibold text-xs rounded-lg hover:bg-amber-600 transition shadow-sm"
                                                            >
                                                                 <HiOutlineLockOpen size={14} /> Unlock Course
                                                            </button>
                                                       </td>
                                                  </tr>
                                             );
                                        })}
                                   </tbody>
                              </table>
                         </div>
                    </div>
               )}

               {/* Modal: Unlock Course */}
               {showAssignModal && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                         <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-zinc-200 space-y-4">
                              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                                   <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                                        <HiOutlineLockOpen className="text-amber-500" /> Unlock Course for {selectedUser.name}
                                   </h3>
                                   <button onClick={() => setShowAssignModal(false)} className="text-zinc-400 hover:text-zinc-600">
                                        <HiOutlineX size={20} />
                                   </button>
                              </div>

                              <p className="text-xs text-zinc-500">
                                   Select a course below to grant <strong>{selectedUser.email}</strong> full unlocked access to view lessons.
                              </p>

                              <div className="space-y-2">
                                   <label className="text-xs font-semibold text-zinc-700">Available Courses</label>
                                   <select
                                        value={selectedCourseId}
                                        onChange={(e) => setSelectedCourseId(e.target.value)}
                                        className="w-full p-2.5 bg-white border border-zinc-200 rounded-lg text-sm outline-none focus:border-amber-500"
                                   >
                                        <option value="">-- Select Course --</option>
                                        {availableCourses.map((c) => (
                                             <option key={c._id} value={c._id}>
                                                  {c.title}
                                             </option>
                                        ))}
                                   </select>
                              </div>

                              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-100">
                                   <button
                                        onClick={() => setShowAssignModal(false)}
                                        className="px-4 py-2 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
                                   >
                                        Cancel
                                   </button>
                                   <button
                                        onClick={handleAssignCourse}
                                        disabled={actionLoading || !selectedCourseId}
                                        className={`px-4 py-2 bg-amber-500 text-white rounded-lg text-xs font-semibold hover:bg-amber-600 transition ${
                                             actionLoading || !selectedCourseId ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                   >
                                        {actionLoading ? "Unlocking..." : "Unlock Course Now"}
                                   </button>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
}

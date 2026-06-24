import { useEffect, useState } from "react";
import Breadcrumb from "../components/BreadCrumb";
import { HiOutlineUpload, HiOutlineTrash, HiOutlinePlus, HiOutlinePhotograph, HiOutlineSave, HiOutlinePencil } from "react-icons/hi";
import { getAdminToken } from "../utils/auth";
import { useToast } from "../context/ToastContext";

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export default function Testimonials() {
     const { showToast } = useToast();
     const [testimonials, setTestimonials] = useState([]);
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [showModal, setShowModal] = useState(false);

     // Modal states
     const [name, setName] = useState("");
     const [role, setRole] = useState("");
     const [quote, setQuote] = useState("");
     const [avatarFile, setAvatarFile] = useState(null);
     const [avatarPreviewUrl, setAvatarPreviewUrl] = useState("");
     const [editingId, setEditingId] = useState(null);

     const fetchTestimonials = async () => {
          try {
               setLoading(true);
               const res = await fetch(`${API}/testimonials`);
               if (res.ok) {
                    const data = await res.json();
                    setTestimonials(Array.isArray(data) ? data : []);
               }
          } catch (err) {
               console.error("Error fetching testimonials data:", err);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchTestimonials();
     }, []);

     const openAddModal = () => {
          setEditingId(null);
          setName("");
          setRole("");
          setQuote("");
          setAvatarFile(null);
          setAvatarPreviewUrl("");
          setShowModal(true);
     };

     const openEditModal = (t) => {
          setEditingId(t._id);
          setName(t.name || "");
          setRole(t.role || "");
          setQuote(t.quote || "");
          setAvatarFile(null);
          setAvatarPreviewUrl(t.avatar || "");
          setShowModal(true);
     };

     const handleSave = async (e) => {
          e.preventDefault();
          if (!name || !role || !quote) {
               showToast("Please fill in name, role, and quote.", "error");
               return;
          }

          setSaving(true);
          try {
               const formData = new FormData();
               formData.append("name", name);
               formData.append("role", role);
               formData.append("quote", quote);

               if (avatarFile) {
                    formData.append("avatar", avatarFile);
               } else if (!editingId) {
                    showToast("Please select an avatar image.", "error");
                    setSaving(false);
                    return;
               }

               let url = `${API}/testimonials`;
               let method = "POST";

               if (editingId) {
                    url = `${API}/testimonials/${editingId}`;
                    method = "PUT";
               }

               const res = await fetch(url, {
                    method,
                    headers: {
                         "Authorization": `Bearer ${getAdminToken()}`
                    },
                    body: formData
               });

               if (res.ok) {
                    showToast("Testimonial saved successfully!", "success");
                    setShowModal(false);
                    fetchTestimonials();
               } else {
                    const err = await res.json().catch(() => ({}));
                    showToast(err.error || "Failed to save testimonial.", "error");
               }
          } catch (err) {
               console.error("Save testimonial error:", err);
               showToast("An error occurred while saving.", "error");
          } finally {
               setSaving(false);
          }
     };

     const handleDelete = async (id) => {
          if (!window.confirm("Are you sure you want to delete this testimonial?")) return;

          try {
               const res = await fetch(`${API}/testimonials/${id}`, {
                    method: "DELETE",
                    headers: {
                         "Authorization": `Bearer ${getAdminToken()}`
                    }
               });

               if (res.ok) {
                    fetchTestimonials();
               } else {
                    showToast("Failed to delete testimonial.", "error");
               }
          } catch (err) {
               console.error("Delete testimonial error:", err);
               showToast("An error occurred while deleting.", "error");
          }
     };

     const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all duration-200";
     const labelClass = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5";

     return (
          <div className="bg-gray-50/50 min-h-screen pb-12 font-sans">
               <Breadcrumb />

               <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                         <div>
                              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Testimonials Manager</h1>
                              <p className="text-sm text-gray-500 mt-1">Manage client and student feedback displayed on the website.</p>
                         </div>
                         <button
                              onClick={openAddModal}
                              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shrink-0"
                         >
                              <HiOutlinePlus className="w-4 h-4" />
                              Add Testimonial
                         </button>
                    </div>

                    {loading ? (
                         <div className="h-64 rounded-2xl border border-gray-200 bg-white flex flex-col items-center justify-center text-gray-400 shadow-sm">
                              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                              <span className="text-sm font-medium">Loading Testimonials...</span>
                         </div>
                    ) : testimonials.length === 0 ? (
                         <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl p-6 shadow-md shadow-gray-200/40 text-center">
                              <div className="w-14 h-14 bg-gray-50 rounded-2xl shadow-sm shadow-gray-150/40 flex items-center justify-center text-gray-400 mb-4">
                                   <HiOutlinePhotograph className="w-6 h-6" />
                              </div>
                              <p className="text-gray-900 text-base font-semibold">No testimonials found</p>
                              <p className="text-gray-400 text-xs mt-1">Click "Add Testimonial" to create your first review.</p>
                         </div>
                    ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {testimonials.map((t) => (
                                   <div key={t._id} className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                                        <div className="space-y-4">
                                             <p className="text-gray-600 text-sm italic leading-relaxed">
                                                  "{t.quote}"
                                             </p>
                                             <div className="flex items-center gap-3 pt-2">
                                                  <img
                                                       src={t.avatar}
                                                       alt={t.name}
                                                       className="w-11 h-11 rounded-full object-cover border border-gray-200 shrink-0"
                                                  />
                                                  <div className="min-w-0">
                                                       <h3 className="font-bold text-gray-900 text-sm truncate">{t.name}</h3>
                                                       <p className="text-gray-400 text-xs truncate">{t.role}</p>
                                                  </div>
                                             </div>
                                        </div>

                                        <div className="flex gap-2.5 pt-6 border-t border-gray-100 mt-6">
                                             <button
                                                  onClick={() => openEditModal(t)}
                                                  className="flex-1 flex items-center justify-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                                             >
                                                  <HiOutlinePencil className="w-4.5 h-4.5" />
                                                  Edit
                                             </button>
                                             <button
                                                  onClick={() => handleDelete(t._id)}
                                                  className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                                             >
                                                  <HiOutlineTrash className="w-4.5 h-4.5" />
                                                  Delete
                                             </button>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    )}
               </div>

               {/* Modal Form */}
               {showModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                         <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-between">
                              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                                   <h2 className="text-lg font-bold text-gray-900">
                                        {editingId ? "Edit Testimonial" : "Add Testimonial"}
                                   </h2>
                                   <button
                                        onClick={() => setShowModal(false)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
                                   >
                                        ✕
                                   </button>
                              </div>

                              <form onSubmit={handleSave} className="p-6 space-y-4">
                                   <div className="space-y-1.5">
                                        <label className={labelClass}>Customer Avatar</label>
                                        <div className="flex gap-4 items-center">
                                             <div className="h-16 w-16 rounded-full bg-gray-150 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                                  {avatarPreviewUrl ? (
                                                       <img src={avatarPreviewUrl} alt="Avatar preview" className="h-full w-full object-cover" />
                                                  ) : (
                                                       <HiOutlinePhotograph className="w-6 h-6 text-gray-400" />
                                                  )}
                                             </div>
                                             <div className="flex-1">
                                                  <div className="border border-dashed border-gray-300 hover:border-orange-500 rounded-xl px-4 py-2.5 bg-gray-50/50 hover:bg-orange-50/10 transition flex items-center justify-center gap-2 cursor-pointer text-center relative group min-h-12">
                                                       <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                 const file = e.target.files[0];
                                                                 if (file) {
                                                                      setAvatarFile(file);
                                                                      setAvatarPreviewUrl(URL.createObjectURL(file));
                                                                 }
                                                            }}
                                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                                       />
                                                       <div className="flex items-center gap-2 text-gray-500 group-hover:text-orange-500 transition">
                                                            <HiOutlineUpload className="w-4 h-4" />
                                                            <span className="text-xs font-semibold">
                                                                 {avatarFile ? avatarFile.name : "Choose avatar..."}
                                                            </span>
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>

                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Full Name</label>
                                             <input
                                                  value={name}
                                                  onChange={(e) => setName(e.target.value)}
                                                  placeholder="e.g. Sarah Connor"
                                                  className={inputClass}
                                                  required
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Job Title / Role</label>
                                             <input
                                                  value={role}
                                                  onChange={(e) => setRole(e.target.value)}
                                                  placeholder="e.g. Lead Designer"
                                                  className={inputClass}
                                                  required
                                             />
                                        </div>
                                    </div>

                                   <div className="space-y-1.5">
                                        <label className={labelClass}>Feedback Quote</label>
                                        <textarea
                                             value={quote}
                                             onChange={(e) => setQuote(e.target.value)}
                                             placeholder="Enter feedback testimonial content..."
                                             rows={4}
                                             className={`${inputClass} resize-none`}
                                             required
                                        />
                                   </div>

                                   <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                        <button
                                             type="button"
                                             onClick={() => setShowModal(false)}
                                             className="px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                                        >
                                             Cancel
                                        </button>
                                        <button
                                             type="submit"
                                             disabled={saving}
                                             className={`px-6 py-2.5 text-sm font-semibold text-white rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 ${
                                                  saving ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none" : "bg-orange-50 hover:bg-orange-600 shadow-orange-200"
                                             }`}
                                        >
                                             {saving ? "Saving..." : "Save Testimonial"}
                                        </button>
                                   </div>
                              </form>
                         </div>
                    </div>
               )}
          </div>
     );
}

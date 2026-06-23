import { useEffect, useState } from "react";
import { HiOutlineSave } from "react-icons/hi";
import Breadcrumb from "../components/BreadCrumb";
import Editor from "../components/Editor";
import { getAdminToken } from "../utils/auth.js";
import { useToast } from "../context/ToastContext";

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export default function PolicyData() {
     const { showToast } = useToast();
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [activeTab, setActiveTab] = useState("privacy");

     // Privacy Policy State
     const [privacyTitle, setPrivacyTitle] = useState("");
     const [privacyContent, setPrivacyContent] = useState("");
     const [privacyRelatedBlogs, setPrivacyRelatedBlogs] = useState(null);

     // Disclaimer State
     const [disclaimerTitle, setDisclaimerTitle] = useState("");
     const [disclaimerContent, setDisclaimerContent] = useState("");
     const [disclaimerRelatedBlogs, setDisclaimerRelatedBlogs] = useState(null);

     const fetchPolicyData = async () => {
          try {
               setLoading(true);
               const [resPolicy, resDisclaimer] = await Promise.all([
                    fetch(`${API_URL}/policy`),
                    fetch(`${API_URL}/disclaimer`)
               ]);

               if (resPolicy.ok) {
                    const data = await resPolicy.json();
                    setPrivacyTitle(data.title || "Privacy Policy");
                    setPrivacyContent(data.content || "");
                    setPrivacyRelatedBlogs(data.relatedBlogs || null);
               }

               if (resDisclaimer.ok) {
                    const data = await resDisclaimer.json();
                    setDisclaimerTitle(data.title || "Disclaimer");
                    setDisclaimerContent(data.content || "");
                    setDisclaimerRelatedBlogs(data.relatedBlogs || null);
               }
          } catch (err) {
               console.error("Error fetching policy data:", err);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchPolicyData();
     }, []);

     const handleSaveAll = async () => {
          try {
               setSaving(true);
               
               const policyPayload = {
                    title: privacyTitle,
                    content: privacyContent
               };
               if (privacyRelatedBlogs) {
                    policyPayload.relatedBlogs = privacyRelatedBlogs;
               }

               const disclaimerPayload = {
                    title: disclaimerTitle,
                    content: disclaimerContent
               };
               if (disclaimerRelatedBlogs) {
                    disclaimerPayload.relatedBlogs = disclaimerRelatedBlogs;
               }

               const [resPolicy, resDisclaimer] = await Promise.all([
                    fetch(`${API_URL}/policy`, {
                         method: "PUT",
                         headers: {
                              "Content-Type": "application/json",
                              "Authorization": `Bearer ${getAdminToken()}`
                         },
                         body: JSON.stringify(policyPayload)
                    }),
                    fetch(`${API_URL}/disclaimer`, {
                         method: "PUT",
                         headers: {
                              "Content-Type": "application/json",
                              "Authorization": `Bearer ${getAdminToken()}`
                         },
                         body: JSON.stringify(disclaimerPayload)
                    })
               ]);

               if (resPolicy.ok && resDisclaimer.ok) {
                    showToast("Disclaimer & Privacy Policy saved successfully!", "success");
                    fetchPolicyData();
               } else {
                    showToast("Failed to save data.", "error");
               }
          } catch (err) {
               console.error("Error saving policy data:", err);
               showToast("An error occurred while saving.", "error");
          } finally {
               setSaving(false);
          }
     };

     const inputClass = "w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all";
     const labelClass = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider";
     const tabBtnClass = (tab) => `px-5 py-3 font-semibold text-sm rounded-lg transition-all ${activeTab === tab ? "bg-orange-500 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`;

     if (loading) {
          return (
               <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <p className="text-gray-500 font-medium">Loading Policy Data...</p>
               </div>
          );
     }

     return (
          <div className="bg-gray-50/50 min-h-screen pb-12 font-sans">
               <Breadcrumb />
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 px-6 lg:px-10 max-w-7xl mx-auto">
                    <div>
                         <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Disclaimer & Privacy Policy</h1>
                         <p className="text-sm text-gray-500 mt-1">Manage content of site policies</p>
                    </div>
                    <button
                         onClick={handleSaveAll}
                         disabled={saving}
                         className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed shrink-0"
                    >
                         <HiOutlineSave className="text-lg" />
                         {saving ? "Saving Changes..." : "Save Changes"}
                    </button>
               </div>

               {/* Tab Navigation */}
               <div className="flex flex-wrap gap-2 px-6 lg:px-10 max-w-7xl mx-auto mb-8">
                    <button onClick={() => setActiveTab("privacy")} className={tabBtnClass("privacy")}>Privacy Policy</button>
                    <button onClick={() => setActiveTab("disclaimer")} className={tabBtnClass("disclaimer")}>Disclaimer</button>
               </div>

               <div className="px-6 lg:px-10 max-w-7xl mx-auto">
                    {activeTab === "privacy" && (
                         <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-6">
                              <div>
                                   <label className={labelClass}>Privacy Policy Page Title</label>
                                   <input
                                        type="text"
                                        value={privacyTitle}
                                        onChange={(e) => setPrivacyTitle(e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. Privacy Policy"
                                   />
                              </div>
                              <div>
                                   <label className={labelClass}>Privacy Policy Content</label>
                                   <div className="rounded-xl overflow-hidden shadow-sm shadow-gray-250/20 mt-1">
                                        <Editor value={privacyContent} onChange={setPrivacyContent} />
                                   </div>
                              </div>
                         </div>
                    )}

                    {activeTab === "disclaimer" && (
                         <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-6">
                              <div>
                                   <label className={labelClass}>Disclaimer Page Title</label>
                                   <input
                                        type="text"
                                        value={disclaimerTitle}
                                        onChange={(e) => setDisclaimerTitle(e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. Disclaimer"
                                   />
                              </div>
                              <div>
                                   <label className={labelClass}>Disclaimer Content</label>
                                   <div className="rounded-xl overflow-hidden shadow-sm shadow-gray-250/20 mt-1">
                                        <Editor value={disclaimerContent} onChange={setDisclaimerContent} />
                                   </div>
                              </div>
                         </div>
                    )}
               </div>
          </div>
     );
}

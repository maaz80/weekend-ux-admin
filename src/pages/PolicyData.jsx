import { useEffect, useState, useCallback } from "react";
import { HiOutlineSave } from "react-icons/hi";
import Breadcrumb from "../components/BreadCrumb";
import Editor from "../components/Editor";
import ImageUploader from "../components/ImageUploader";
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
     const [privacyHeroImage, setPrivacyHeroImage] = useState(null);
     const [privacyHeroAlt, setPrivacyHeroAlt] = useState("");
     const [privacyRelatedBlogs, setPrivacyRelatedBlogs] = useState(null);

     // Disclaimer State
     const [disclaimerTitle, setDisclaimerTitle] = useState("");
     const [disclaimerContent, setDisclaimerContent] = useState("");
     const [disclaimerHeroImage, setDisclaimerHeroImage] = useState(null);
     const [disclaimerHeroAlt, setDisclaimerHeroAlt] = useState("");
     const [disclaimerRelatedBlogs, setDisclaimerRelatedBlogs] = useState(null);

     // Terms & Conditions State
     const [termsTitle, setTermsTitle] = useState("");
     const [termsContent, setTermsContent] = useState("");
     const [termsHeroImage, setTermsHeroImage] = useState(null);
     const [termsHeroAlt, setTermsHeroAlt] = useState("");
     const [termsRelatedBlogs, setTermsRelatedBlogs] = useState(null);

     const fetchPolicyData = useCallback(async () => {
          try {
               const [resPolicy, resDisclaimer, resTerms] = await Promise.all([
                    fetch(`${API_URL}/policy`),
                    fetch(`${API_URL}/disclaimer`),
                    fetch(`${API_URL}/terms`)
               ]);

               if (resPolicy.ok) {
                    const data = await resPolicy.json();
                    setPrivacyTitle(data.title || "Privacy Policy");
                    setPrivacyContent(data.content || "");
                    const hero = data.hero || {};
                    setPrivacyHeroImage(hero.image || hero.heroImage || null);
                    setPrivacyHeroAlt(hero.alt || "");
                    setPrivacyRelatedBlogs(data.relatedBlogs || null);
               }

               if (resDisclaimer.ok) {
                    const data = await resDisclaimer.json();
                    setDisclaimerTitle(data.title || "Disclaimer");
                    setDisclaimerContent(data.content || "");
                    const hero = data.hero || {};
                    setDisclaimerHeroImage(hero.image || hero.heroImage || null);
                    setDisclaimerHeroAlt(hero.alt || "");
                    setDisclaimerRelatedBlogs(data.relatedBlogs || null);
               }

               if (resTerms.ok) {
                    const data = await resTerms.json();
                    setTermsTitle(data.title || "Terms & Conditions");
                    setTermsContent(data.content || "");
                    const hero = data.hero || {};
                    setTermsHeroImage(hero.image || hero.heroImage || null);
                    setTermsHeroAlt(hero.alt || "");
                    setTermsRelatedBlogs(data.relatedBlogs || null);
               }
          } catch (err) {
               console.error("Error fetching policy data:", err);
          } finally {
               setLoading(false);
          }
     }, []);

     useEffect(() => {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          fetchPolicyData();
     }, [fetchPolicyData]);

     const handleSaveAll = async () => {
          try {
               setSaving(true);
               const token = getAdminToken();

               // 1. Privacy Policy FormData
               const privacyFormData = new FormData();
               const privacyHeroPayload = {
                    image: (privacyHeroImage && privacyHeroImage instanceof File)
                         ? ""
                         : (typeof privacyHeroImage === "string" ? privacyHeroImage : ""),
                    heroImage: (privacyHeroImage && privacyHeroImage instanceof File)
                         ? ""
                         : (typeof privacyHeroImage === "string" ? privacyHeroImage : ""),
                    alt: privacyHeroAlt || ""
               };
               const policyPayload = {
                    title: privacyTitle,
                    content: privacyContent,
                    hero: privacyHeroPayload
               };
               if (privacyRelatedBlogs) policyPayload.relatedBlogs = privacyRelatedBlogs;
               privacyFormData.append("data", JSON.stringify(policyPayload));
               if (privacyHeroImage && privacyHeroImage instanceof File) {
                    privacyFormData.append("pageHeroImage", privacyHeroImage);
               }

               // 2. Disclaimer FormData
               const disclaimerFormData = new FormData();
               const disclaimerHeroPayload = {
                    image: (disclaimerHeroImage && disclaimerHeroImage instanceof File)
                         ? ""
                         : (typeof disclaimerHeroImage === "string" ? disclaimerHeroImage : ""),
                    heroImage: (disclaimerHeroImage && disclaimerHeroImage instanceof File)
                         ? ""
                         : (typeof disclaimerHeroImage === "string" ? disclaimerHeroImage : ""),
                    alt: disclaimerHeroAlt || ""
               };
               const disclaimerPayload = {
                    title: disclaimerTitle,
                    content: disclaimerContent,
                    hero: disclaimerHeroPayload
               };
               if (disclaimerRelatedBlogs) disclaimerPayload.relatedBlogs = disclaimerRelatedBlogs;
               disclaimerFormData.append("data", JSON.stringify(disclaimerPayload));
               if (disclaimerHeroImage && disclaimerHeroImage instanceof File) {
                    disclaimerFormData.append("pageHeroImage", disclaimerHeroImage);
               }

               // 3. Terms & Conditions FormData
               const termsFormData = new FormData();
               const termsHeroPayload = {
                    image: (termsHeroImage && termsHeroImage instanceof File)
                         ? ""
                         : (typeof termsHeroImage === "string" ? termsHeroImage : ""),
                    heroImage: (termsHeroImage && termsHeroImage instanceof File)
                         ? ""
                         : (typeof termsHeroImage === "string" ? termsHeroImage : ""),
                    alt: termsHeroAlt || ""
               };
               const termsPayload = {
                    title: termsTitle,
                    content: termsContent,
                    hero: termsHeroPayload
               };
               if (termsRelatedBlogs) termsPayload.relatedBlogs = termsRelatedBlogs;
               termsFormData.append("data", JSON.stringify(termsPayload));
               if (termsHeroImage && termsHeroImage instanceof File) {
                    termsFormData.append("pageHeroImage", termsHeroImage);
               }

               const [resPolicy, resDisclaimer, resTerms] = await Promise.all([
                    fetch(`${API_URL}/policy`, {
                         method: "PUT",
                         headers: {
                              "Authorization": `Bearer ${token}`
                         },
                         body: privacyFormData
                    }),
                    fetch(`${API_URL}/disclaimer`, {
                         method: "PUT",
                         headers: {
                              "Authorization": `Bearer ${token}`
                         },
                         body: disclaimerFormData
                    }),
                    fetch(`${API_URL}/terms`, {
                         method: "PUT",
                         headers: {
                              "Authorization": `Bearer ${token}`
                         },
                         body: termsFormData
                    })
               ]);

               if (resPolicy.ok && resDisclaimer.ok && resTerms.ok) {
                    showToast("All legal pages and hero graphics saved successfully!", "success");
                    fetchPolicyData();
               } else {
                    showToast("Failed to save some data. Please check connection.", "error");
               }
          } catch (err) {
               console.error("Error saving policy data:", err);
               showToast("An error occurred while saving.", "error");
          } finally {
               setSaving(false);
          }
     };

     const inputClass = "w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50/50";
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
                         <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Legal Pages</h1>
                         <p className="text-sm text-gray-500 mt-1">Manage content, policies, and hero right-side illustrations</p>
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
                    <button onClick={() => setActiveTab("terms")} className={tabBtnClass("terms")}>Terms & Conditions</button>
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

                              {/* Hero Right Graphic */}
                              <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/80 space-y-3">
                                   <div className="flex items-center justify-between">
                                        <div>
                                             <label className={labelClass}>Hero Right Graphic (Illustration / Banner Graphic)</label>
                                             <p className="text-xs text-gray-400">Right-side graphic illustration for the Privacy Policy hero banner.</p>
                                        </div>
                                        {privacyHeroImage && (
                                             <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                                  Graphic Set
                                             </span>
                                        )}
                                   </div>

                                   <ImageUploader
                                        setImage={setPrivacyHeroImage}
                                        initialImage={typeof privacyHeroImage === "string" ? privacyHeroImage : null}
                                   />
                                   <p className="text-[11px] text-gray-400">
                                        Upload right-side graphic illustration for the Privacy Policy page hero (PNG/SVG with transparent background recommended).
                                   </p>

                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                             <label className="block text-[11px] font-medium text-gray-500 mb-1">Graphic URL / Path</label>
                                             <input
                                                  type="text"
                                                  value={typeof privacyHeroImage === "string" ? privacyHeroImage : ""}
                                                  onChange={(e) => setPrivacyHeroImage(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. /images/policy-hero-graphic.svg or https://res.cloudinary.com/..."
                                             />
                                        </div>
                                        <div>
                                             <label className="block text-[11px] font-medium text-gray-500 mb-1">Alt Text</label>
                                             <input
                                                  type="text"
                                                  value={privacyHeroAlt}
                                                  onChange={(e) => setPrivacyHeroAlt(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. Privacy Policy Graphic"
                                             />
                                        </div>
                                   </div>
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

                              {/* Hero Right Graphic */}
                              <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/80 space-y-3">
                                   <div className="flex items-center justify-between">
                                        <div>
                                             <label className={labelClass}>Hero Right Graphic (Illustration / Banner Graphic)</label>
                                             <p className="text-xs text-gray-400">Right-side graphic illustration for the Disclaimer hero banner.</p>
                                        </div>
                                        {disclaimerHeroImage && (
                                             <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                                  Graphic Set
                                             </span>
                                        )}
                                   </div>

                                   <ImageUploader
                                        setImage={setDisclaimerHeroImage}
                                        initialImage={typeof disclaimerHeroImage === "string" ? disclaimerHeroImage : null}
                                   />
                                   <p className="text-[11px] text-gray-400">
                                        Upload right-side graphic illustration for the Disclaimer page hero (PNG/SVG with transparent background recommended).
                                   </p>

                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                             <label className="block text-[11px] font-medium text-gray-500 mb-1">Graphic URL / Path</label>
                                             <input
                                                  type="text"
                                                  value={typeof disclaimerHeroImage === "string" ? disclaimerHeroImage : ""}
                                                  onChange={(e) => setDisclaimerHeroImage(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. /images/disclaimer-hero-graphic.svg or https://res.cloudinary.com/..."
                                             />
                                        </div>
                                        <div>
                                             <label className="block text-[11px] font-medium text-gray-500 mb-1">Alt Text</label>
                                             <input
                                                  type="text"
                                                  value={disclaimerHeroAlt}
                                                  onChange={(e) => setDisclaimerHeroAlt(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. Disclaimer Graphic"
                                             />
                                        </div>
                                   </div>
                              </div>

                              <div>
                                   <label className={labelClass}>Disclaimer Content</label>
                                   <div className="rounded-xl overflow-hidden shadow-sm shadow-gray-250/20 mt-1">
                                        <Editor value={disclaimerContent} onChange={setDisclaimerContent} />
                                   </div>
                              </div>
                         </div>
                    )}

                    {activeTab === "terms" && (
                         <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 space-y-6">
                              <div>
                                   <label className={labelClass}>Terms & Conditions Page Title</label>
                                   <input
                                        type="text"
                                        value={termsTitle}
                                        onChange={(e) => setTermsTitle(e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. Terms & Conditions"
                                   />
                              </div>

                              {/* Hero Right Graphic */}
                              <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/80 space-y-3">
                                   <div className="flex items-center justify-between">
                                        <div>
                                             <label className={labelClass}>Hero Right Graphic (Illustration / Banner Graphic)</label>
                                             <p className="text-xs text-gray-400">Right-side graphic illustration for the Terms & Conditions hero banner.</p>
                                        </div>
                                        {termsHeroImage && (
                                             <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                                  Graphic Set
                                             </span>
                                        )}
                                   </div>

                                   <ImageUploader
                                        setImage={setTermsHeroImage}
                                        initialImage={typeof termsHeroImage === "string" ? termsHeroImage : null}
                                   />
                                   <p className="text-[11px] text-gray-400">
                                        Upload right-side graphic illustration for the Terms & Conditions page hero (PNG/SVG with transparent background recommended).
                                   </p>

                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                             <label className="block text-[11px] font-medium text-gray-500 mb-1">Graphic URL / Path</label>
                                             <input
                                                  type="text"
                                                  value={typeof termsHeroImage === "string" ? termsHeroImage : ""}
                                                  onChange={(e) => setTermsHeroImage(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. /images/terms-hero-graphic.svg or https://res.cloudinary.com/..."
                                             />
                                        </div>
                                        <div>
                                             <label className="block text-[11px] font-medium text-gray-500 mb-1">Alt Text</label>
                                             <input
                                                  type="text"
                                                  value={termsHeroAlt}
                                                  onChange={(e) => setTermsHeroAlt(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. Terms & Conditions Graphic"
                                             />
                                        </div>
                                   </div>
                              </div>

                              <div>
                                   <label className={labelClass}>Terms & Conditions Content</label>
                                   <div className="rounded-xl overflow-hidden shadow-sm shadow-gray-250/20 mt-1">
                                        <Editor value={termsContent} onChange={setTermsContent} />
                                   </div>
                              </div>
                         </div>
                    )}
               </div>
          </div>
     );
}

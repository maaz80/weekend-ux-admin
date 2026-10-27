import { useEffect, useState } from "react";
import { HiOutlinePlus, HiOutlineSave, HiOutlineTrash } from "react-icons/hi";
import Breadcrumb from "../components/BreadCrumb";
import { useToast } from "../context/ToastContext";
import { getAdminToken } from "../utils/auth.js";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

const defaultContent = {
     hero: {
          eyebrow: "Hire From Us",
          heading: "Hire Job Ready Curated Candidates at Zero Cost",
          buttonText: "Start Your Journey",
          intro: "Weekend UX is a hands-on design school, in-person classes and structured recordings built for people who learn by doing, not watching.",
          benefits: ["Experience World Class Candidates", "Reduce your hiring time by 80%"]
     },
     candidateSearch: {
          eyebrow: "Search the Candidates",
          headingStart: "Find The",
          headingHighlight: "Designer",
          headingEnd: "You Have Been Looking For.",
          roles: ["UI Designer", "UX Designer", "Industrial Designer", "Graphic Designer", "UI UX Designer", "Web Designer"],
          resultMessage: 'Candidate search for "{query}" is coming soon.'
     },
     recruiterBenefits: {
          headingStart: "Why Our Students Are Favored By",
          headingHighlight: "Recruiters",
          description: "Our students have gone on to build successful careers with leading organizations across diverse industries, showcasing the skills, knowledge, and confidence they gained through our programs.",
          benefits: [
               { title: "Lateral hiring at Zero Cost", description: "Build your ideal tech team with skilled professionals at no cost." },
               { title: "Lateral hiring at Zero Cost", description: "Build your ideal tech team with skilled professionals at no cost." },
               { title: "Lateral hiring at Zero Cost", description: "Build your ideal tech team with skilled professionals at no cost." },
          ],
     },
     hiringStats: {
          eyebrow: "Hiring Stats",
          headingStart: "Guaranteed Candidates For Multiple",
          headingHighlight: "Hiring",
          headingEnd: "Needs.",
          chartTitle: "Work Experience",
          experience: [
               { label: "Freshers", value: 18 },
               { label: "0-2 years", value: 22 },
               { label: "2-5 Years", value: 28 },
               { label: "5+ years", value: 32 },
          ],
     },
     candidatePools: {
          eyebrow: "Explore Candidate Pools",
          headingStart: "Explore",
          headingHighlight: "Candidates",
          headingEnd: "Across Skill Pools",
          actionLabel: "Explore Candidates",
          actionHref: "#candidate-search",
          pools: [
               { value: "340+", valueName: "Beginner Designers", description: "Across beginner, intermediate & advanced courses since 2019" },
               { value: "100+", valueName: "Intermediate Designers", description: "Across beginner, intermediate & advanced courses since 2019" },
               { value: "10+", valueName: "Senior Designers", description: "We've been offered bigger. We've always said no. Small is big." },
               { value: "5+", valueName: "Expert Designers", description: "Rated by students post-batch. No anonymous reviews, no inflation." },
          ],
     }
};

function TextField({ label, value, onChange, multiline = false }) {
     const className = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20";
     return (
          <label className="block space-y-1.5">
               <span className="block text-xs font-bold uppercase tracking-wider text-gray-500">{label}</span>
               {multiline ? (
                    <textarea rows={3} value={value || ""} onChange={(event) => onChange(event.target.value)} className={`${className} resize-y`} />
               ) : (
                    <input value={value || ""} onChange={(event) => onChange(event.target.value)} className={className} />
               )}
          </label>
     );
}

export default function HireFromUsData() {
     const { showToast } = useToast();
     const [content, setContent] = useState(defaultContent);
     const [activeTab, setActiveTab] = useState("hero");
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);

     useEffect(() => {
          const fetchContent = async () => {
               try {
                    const response = await fetch(`${API_URL}/hire-from-us`);
                    const data = await response.json();
                    if (!response.ok) throw new Error(data?.error || "Could not load Hire From Us content.");
                    setContent({
                         hero: {
                              ...defaultContent.hero,
                              ...data.hero,
                              benefits: Array.isArray(data.hero?.benefits) ? data.hero.benefits : defaultContent.hero.benefits,
                         },
                         candidateSearch: {
                              ...defaultContent.candidateSearch,
                              ...data.candidateSearch,
                              roles: Array.isArray(data.candidateSearch?.roles) ? data.candidateSearch.roles : defaultContent.candidateSearch.roles,
                         },
                         recruiterBenefits: {
                              ...defaultContent.recruiterBenefits,
                              ...data.recruiterBenefits,
                              benefits: Array.isArray(data.recruiterBenefits?.benefits) ? data.recruiterBenefits.benefits : defaultContent.recruiterBenefits.benefits,
                         },
                         hiringStats: {
                              ...defaultContent.hiringStats,
                              ...data.hiringStats,
                              experience: Array.isArray(data.hiringStats?.experience) ? data.hiringStats.experience : defaultContent.hiringStats.experience,
                         },
                         candidatePools: {
                              ...defaultContent.candidatePools,
                              ...data.candidatePools,
                              pools: Array.isArray(data.candidatePools?.pools) ? data.candidatePools.pools : defaultContent.candidatePools.pools,
                         },
                    });
               } catch (error) {
                    console.error("Error fetching Hire From Us content:", error);
                    showToast(error.message || "Could not load Hire From Us content.", "error");
               } finally {
                    setLoading(false);
               }
          };
          fetchContent();
     }, [showToast]);

     const updateSection = (section, field, value) => {
          setContent((previous) => ({
               ...previous,
               [section]: { ...previous[section], [field]: value },
          }));
     };

     const updateArrayValue = (section, field, index, value) => {
          setContent((previous) => ({
               ...previous,
               [section]: {
                    ...previous[section],
                    [field]: previous[section][field].map((item, itemIndex) => itemIndex === index ? value : item),
               },
          }));
     };

     const addArrayValue = (section, field) => {
          setContent((previous) => ({
               ...previous,
               [section]: {
                    ...previous[section],
                    [field]: [...previous[section][field], ""],
               },
          }));
     };

     const removeArrayValue = (section, field, index) => {
          setContent((previous) => ({
               ...previous,
               [section]: {
                    ...previous[section],
                    [field]: previous[section][field].filter((_, itemIndex) => itemIndex !== index),
               },
          }));
     };

     const updateRecruiterBenefit = (index, field, value) => {
          setContent((previous) => ({
               ...previous,
               recruiterBenefits: {
                    ...previous.recruiterBenefits,
                    benefits: previous.recruiterBenefits.benefits.map((benefit, benefitIndex) =>
                         benefitIndex === index ? { ...benefit, [field]: value } : benefit
                    ),
               },
          }));
     };

     const addRecruiterBenefit = () => {
          setContent((previous) => ({
               ...previous,
               recruiterBenefits: {
                    ...previous.recruiterBenefits,
                    benefits: [...previous.recruiterBenefits.benefits, { title: "", description: "" }],
               },
          }));
     };

     const removeRecruiterBenefit = (index) => {
          setContent((previous) => ({
               ...previous,
               recruiterBenefits: {
                    ...previous.recruiterBenefits,
                    benefits: previous.recruiterBenefits.benefits.filter((_, benefitIndex) => benefitIndex !== index),
               },
          }));
     };

     const updateExperience = (index, field, value) => {
          setContent((previous) => ({
               ...previous,
               hiringStats: {
                    ...previous.hiringStats,
                    experience: previous.hiringStats.experience.map((item, itemIndex) =>
                         itemIndex === index ? { ...item, [field]: value } : item
                    ),
               },
          }));
     };

     const addExperience = () => {
          setContent((previous) => ({
               ...previous,
               hiringStats: {
                    ...previous.hiringStats,
                    experience: [...previous.hiringStats.experience, { label: "", value: 0 }],
               },
          }));
     };

     const removeExperience = (index) => {
          setContent((previous) => ({
               ...previous,
               hiringStats: {
                    ...previous.hiringStats,
                    experience: previous.hiringStats.experience.filter((_, itemIndex) => itemIndex !== index),
               },
          }));
     };

     const updateCandidatePool = (index, field, value) => {
          setContent((previous) => ({
               ...previous,
               candidatePools: {
                    ...previous.candidatePools,
                    pools: previous.candidatePools.pools.map((pool, poolIndex) =>
                         poolIndex === index ? { ...pool, [field]: value } : pool
                    ),
               },
          }));
     };

     const addCandidatePool = () => {
          setContent((previous) => ({
               ...previous,
               candidatePools: {
                    ...previous.candidatePools,
                    pools: [...previous.candidatePools.pools, { value: "", valueName: "", description: "" }],
               },
          }));
     };

     const removeCandidatePool = (index) => {
          setContent((previous) => ({
               ...previous,
               candidatePools: {
                    ...previous.candidatePools,
                    pools: previous.candidatePools.pools.filter((_, poolIndex) => poolIndex !== index),
               },
          }));
     };

     const saveContent = async () => {
          try {
               setSaving(true);
               const experienceTotal = content.hiringStats.experience.reduce((total, item) => total + Number(item.value), 0);
               if (content.hiringStats.experience.some((item) => !Number.isFinite(Number(item.value)) || Number(item.value) < 0 || Number(item.value) > 100) ||
                    experienceTotal > 100) {
                    throw new Error("Hiring Stats percentages must be between 0 and 100 and total no more than 100%.");
               }
               const response = await fetch(`${API_URL}/hire-from-us`, {
                    method: "PUT",
                    headers: {
                         "Content-Type": "application/json",
                         Authorization: `Bearer ${getAdminToken()}`,
                    },
                    body: JSON.stringify(content),
               });
               const data = await response.json();
               if (!response.ok) throw new Error(data?.error || "Could not save Hire From Us content.");
               showToast("Hire From Us content saved successfully!", "success");
          } catch (error) {
               console.error("Error saving Hire From Us content:", error);
               showToast(error.message || "Could not save Hire From Us content.", "error");
          } finally {
               setSaving(false);
          }
     };

     return (
          <div className="min-h-screen bg-gray-50/50 pb-12">
               <Breadcrumb />
               <main className="mx-auto max-w-5xl px-5 lg:px-8">
                    <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                         <div>
                              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Hire From Us Content</h1>
                              <p className="mt-1 text-sm text-gray-500">Manage the Hire From Us hero and page sections.</p>
                         </div>
                         <button type="button" onClick={saveContent} disabled={loading || saving} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60">
                              <HiOutlineSave className="h-4 w-4" />
                              {saving ? "Saving..." : "Save Changes"}
                         </button>
                    </header>

                    {loading ? (
                         <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">Loading Hire From Us content...</div>
                    ) : (
                         <div className="space-y-6">
                              <nav className="flex gap-2 overflow-x-auto pb-2" aria-label="Hire From Us content sections">
                                   {[
                                        ["hero", "Hero"],
                                        ["candidateSearch", "Candidate Search"],
                                        ["recruiterBenefits", "Recruiter Benefits"],
                                        ["hiringStats", "Hiring Stats"],
                                        ["candidatePools", "Candidate Pools"],
                                   ].map(([tab, label]) => (
                                        <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`shrink-0 rounded-lg px-5 py-3 text-sm font-semibold transition-all ${activeTab === tab ? "bg-orange-500 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                                             {label}
                                        </button>
                                   ))}
                              </nav>

                              {activeTab === "hero" && (
                                   <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                                        <div>
                                             <h2 className="text-lg font-bold text-gray-900">Hire From Us Hero</h2>
                                             <p className="mt-1 text-sm text-gray-500">Edit hero and intro copy. The enquiry form remains unchanged.</p>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                             <TextField label="Eyebrow" value={content.hero.eyebrow} onChange={(value) => updateSection("hero", "eyebrow", value)} />
                                             <TextField label="Hero button text" value={content.hero.buttonText} onChange={(value) => updateSection("hero", "buttonText", value)} />
                                             <div className="md:col-span-2">
                                                  <TextField label="Hero heading" value={content.hero.heading} onChange={(value) => updateSection("hero", "heading", value)} multiline />
                                             </div>
                                        </div>

                                        <div className="space-y-4">
                                             <TextField label="Intro paragraph below hero" value={content.hero.intro} onChange={(value) => updateSection("hero", "intro", value)} multiline />
                                             <div className="flex items-center justify-between gap-3">
                                                  <h3 className="font-semibold text-gray-800">Intro Highlights</h3>
                                                  <button type="button" onClick={() => addArrayValue("hero", "benefits")} className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50">
                                                       <HiOutlinePlus className="h-4 w-4" /> Add Highlight
                                                  </button>
                                             </div>
                                             {content.hero.benefits.map((benefit, index) => (
                                                  <div key={index} className="flex items-start gap-3">
                                                       <div className="flex-1">
                                                            <TextField label={`Highlight ${index + 1}`} value={benefit} onChange={(value) => updateArrayValue("hero", "benefits", index, value)} />
                                                       </div>
                                                       <button type="button" aria-label={`Remove highlight ${index + 1}`} onClick={() => removeArrayValue("hero", "benefits", index)} className="mt-6 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:bg-red-50">
                                                            <HiOutlineTrash className="h-5 w-5" />
                                                       </button>
                                                  </div>
                                             ))}
                                        </div>
                                   </section>
                              )}

                              {activeTab === "candidateSearch" && (
                                   <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                                        <div>
                                             <h2 className="text-lg font-bold text-gray-900">Candidate Search Section</h2>
                                             <p className="mt-1 text-sm text-gray-500">Edit the section copy and suggested roles. Background and search input remain unchanged.</p>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                             <TextField label="Eyebrow" value={content.candidateSearch.eyebrow} onChange={(value) => updateSection("candidateSearch", "eyebrow", value)} />
                                             <TextField label="Heading start" value={content.candidateSearch.headingStart} onChange={(value) => updateSection("candidateSearch", "headingStart", value)} />
                                             <TextField label="Highlighted heading" value={content.candidateSearch.headingHighlight} onChange={(value) => updateSection("candidateSearch", "headingHighlight", value)} />
                                             <div className="md:col-span-2">
                                                  <TextField label="Heading end" value={content.candidateSearch.headingEnd} onChange={(value) => updateSection("candidateSearch", "headingEnd", value)} />
                                             </div>
                                             <div className="md:col-span-2">
                                                  <TextField label='Search result message (use {query} where search term should appear)' value={content.candidateSearch.resultMessage} onChange={(value) => updateSection("candidateSearch", "resultMessage", value)} />
                                             </div>
                                        </div>
                                        <div className="space-y-4">
                                             <div className="flex items-center justify-between gap-3">
                                                  <h3 className="font-semibold text-gray-800">Suggested Roles</h3>
                                                  <button type="button" onClick={() => addArrayValue("candidateSearch", "roles")} className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50">
                                                       <HiOutlinePlus className="h-4 w-4" /> Add Role
                                                  </button>
                                             </div>
                                             {content.candidateSearch.roles.map((role, index) => (
                                                  <div key={index} className="flex items-start gap-3">
                                                       <div className="flex-1">
                                                            <TextField label={`Role ${index + 1}`} value={role} onChange={(value) => updateArrayValue("candidateSearch", "roles", index, value)} />
                                                       </div>
                                                       <button type="button" aria-label={`Remove role ${index + 1}`} onClick={() => removeArrayValue("candidateSearch", "roles", index)} className="mt-6 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:bg-red-50">
                                                            <HiOutlineTrash className="h-5 w-5" />
                                                       </button>
                                                  </div>
                                             ))}
                                        </div>
                                   </section>
                              )}

                              {activeTab === "recruiterBenefits" && (
                                   <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                                        <div>
                                             <h2 className="text-lg font-bold text-gray-900">Recruiter Benefits Section</h2>
                                             <p className="mt-1 text-sm text-gray-500">Edit the heading, description, and benefit cards. Background and icons remain unchanged.</p>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                             <TextField label="Heading" value={content.recruiterBenefits.headingStart} onChange={(value) => updateSection("recruiterBenefits", "headingStart", value)} />
                                             <TextField label="Highlighted heading" value={content.recruiterBenefits.headingHighlight} onChange={(value) => updateSection("recruiterBenefits", "headingHighlight", value)} />
                                             <div className="md:col-span-2">
                                                  <TextField label="Description" value={content.recruiterBenefits.description} onChange={(value) => updateSection("recruiterBenefits", "description", value)} multiline />
                                             </div>
                                        </div>
                                        <div className="space-y-4">
                                             <div className="flex items-center justify-between gap-3">
                                                  <h3 className="font-semibold text-gray-800">Benefit Cards</h3>
                                                  <button type="button" onClick={addRecruiterBenefit} className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50">
                                                       <HiOutlinePlus className="h-4 w-4" /> Add Benefit
                                                  </button>
                                             </div>
                                             {content.recruiterBenefits.benefits.map((benefit, index) => (
                                                  <div key={index} className="grid gap-3 rounded-xl border border-gray-200 bg-gray-50/60 p-4 md:grid-cols-[1fr_1fr_auto]">
                                                       <TextField label={`Benefit ${index + 1} title`} value={benefit.title} onChange={(value) => updateRecruiterBenefit(index, "title", value)} />
                                                       <TextField label="Description" value={benefit.description} onChange={(value) => updateRecruiterBenefit(index, "description", value)} multiline />
                                                       <button type="button" aria-label={`Remove benefit ${index + 1}`} onClick={() => removeRecruiterBenefit(index)} className="mt-6 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:bg-red-50">
                                                            <HiOutlineTrash className="h-5 w-5" />
                                                       </button>
                                                  </div>
                                             ))}
                                        </div>
                                   </section>
                              )}

                              {activeTab === "hiringStats" && (
                                   <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                                        <div>
                                             <h2 className="text-lg font-bold text-gray-900">Hiring Stats Section</h2>
                                             <p className="mt-1 text-sm text-gray-500">Edit the section heading and work experience chart. Percentages can total up to 100%; any remaining share appears in the graph.</p>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                             <TextField label="Eyebrow" value={content.hiringStats.eyebrow} onChange={(value) => updateSection("hiringStats", "eyebrow", value)} />
                                             <TextField label="Chart center label" value={content.hiringStats.chartTitle} onChange={(value) => updateSection("hiringStats", "chartTitle", value)} />
                                             <TextField label="Heading" value={content.hiringStats.headingStart} onChange={(value) => updateSection("hiringStats", "headingStart", value)} />
                                             <TextField label="Highlighted heading" value={content.hiringStats.headingHighlight} onChange={(value) => updateSection("hiringStats", "headingHighlight", value)} />
                                             <div className="md:col-span-2">
                                                  <TextField label="Heading ending" value={content.hiringStats.headingEnd} onChange={(value) => updateSection("hiringStats", "headingEnd", value)} />
                                             </div>
                                        </div>
                                        <div className="space-y-4">
                                             <div className="flex items-center justify-between gap-3">
                                                  <h3 className="font-semibold text-gray-800">Work Experience Percentages</h3>
                                                  <button type="button" onClick={addExperience} className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50">
                                                       <HiOutlinePlus className="h-4 w-4" /> Add Category
                                                  </button>
                                             </div>
                                             {content.hiringStats.experience.map((item, index) => (
                                                  <div key={index} className="grid gap-3 rounded-xl border border-gray-200 bg-gray-50/60 p-4 md:grid-cols-[1fr_180px_auto]">
                                                       <TextField label={`Category ${index + 1}`} value={item.label} onChange={(value) => updateExperience(index, "label", value)} />
                                                       <label className="block space-y-1.5">
                                                            <span className="block text-xs font-bold uppercase tracking-wider text-gray-500">Percentage</span>
                                                            <input type="number" min="0" max="100" step="0.1" value={item.value} onChange={(event) => updateExperience(index, "value", event.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
                                                       </label>
                                                       <button type="button" aria-label={`Remove category ${index + 1}`} onClick={() => removeExperience(index)} className="mt-6 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:bg-red-50">
                                                            <HiOutlineTrash className="h-5 w-5" />
                                                       </button>
                                                  </div>
                                             ))}
                                             <p className={`text-sm font-semibold ${content.hiringStats.experience.reduce((total, item) => total + Number(item.value || 0), 0) <= 100 ? "text-green-700" : "text-red-700"}`}>
                                                  Total: {content.hiringStats.experience.reduce((total, item) => total + Number(item.value || 0), 0)}%
                                                  {content.hiringStats.experience.reduce((total, item) => total + Number(item.value || 0), 0) <= 100 && ` · Remaining: ${100 - content.hiringStats.experience.reduce((total, item) => total + Number(item.value || 0), 0)}%`}
                                             </p>
                                        </div>
                                   </section>
                              )}

                              {activeTab === "candidatePools" && (
                                   <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                                        <div>
                                             <h2 className="text-lg font-bold text-gray-900">Candidate Pools Section</h2>
                                             <p className="mt-1 text-sm text-gray-500">Manage the candidate pool heading, card content, and CTA. Background and card styling stay unchanged.</p>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                             <TextField label="Section label" value={content.candidatePools.eyebrow} onChange={(value) => updateSection("candidatePools", "eyebrow", value)} />
                                             <TextField label="Heading" value={content.candidatePools.headingStart} onChange={(value) => updateSection("candidatePools", "headingStart", value)} />
                                             <TextField label="Highlighted heading" value={content.candidatePools.headingHighlight} onChange={(value) => updateSection("candidatePools", "headingHighlight", value)} />
                                             <TextField label="Heading ending" value={content.candidatePools.headingEnd} onChange={(value) => updateSection("candidatePools", "headingEnd", value)} />
                                             <TextField label="CTA button text" value={content.candidatePools.actionLabel} onChange={(value) => updateSection("candidatePools", "actionLabel", value)} />
                                             <TextField label="CTA link" value={content.candidatePools.actionHref} onChange={(value) => updateSection("candidatePools", "actionHref", value)} />
                                        </div>
                                        <div className="space-y-4">
                                             <div className="flex items-center justify-between gap-3">
                                                  <h3 className="font-semibold text-gray-800">Candidate Pool Cards</h3>
                                                  <button type="button" onClick={addCandidatePool} className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50">
                                                       <HiOutlinePlus className="h-4 w-4" /> Add Pool
                                                  </button>
                                             </div>
                                             {content.candidatePools.pools.map((pool, index) => (
                                                  <div key={index} className="grid gap-3 rounded-xl border border-gray-200 bg-gray-50/60 p-4 md:grid-cols-2">
                                                       <TextField label={`Pool ${index + 1} value`} value={pool.value} onChange={(value) => updateCandidatePool(index, "value", value)} />
                                                       <TextField label="Pool name" value={pool.valueName} onChange={(value) => updateCandidatePool(index, "valueName", value)} />
                                                       <div className="md:col-span-2">
                                                            <TextField label="Description" value={pool.description} onChange={(value) => updateCandidatePool(index, "description", value)} multiline />
                                                       </div>
                                                       <button type="button" aria-label={`Remove pool ${index + 1}`} onClick={() => removeCandidatePool(index)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:bg-red-50">
                                                            <HiOutlineTrash className="h-5 w-5" />
                                                       </button>
                                                  </div>
                                             ))}
                                        </div>
                                   </section>
                              )}
                         </div>
                    )}
               </main>
          </div>
     );
}

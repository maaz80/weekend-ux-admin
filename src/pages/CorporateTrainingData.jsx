import { useEffect, useState } from "react";
import { HiOutlinePlus, HiOutlineSave, HiOutlineTrash } from "react-icons/hi";
import Breadcrumb from "../components/BreadCrumb";
import ImageUploader from "../components/ImageUploader";
import { useToast } from "../context/ToastContext";
import { getAdminToken } from "../utils/auth.js";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

const defaultContent = {
     hero: {
          eyebrow: "Corporate Training",
          heading: "Upskill Your Workforce,\nAccelerate AI & Digital Readiness",
          buttonText: "Start Your Journey",
          buttonLink: "/contact-us",
          backgroundImage: "/images/weekend-ux-corporate-training-hero-bg.webp"
     },
     trustedBy: {
          startheading: "Trusted",
          midheading: "By",
          endheading: "Leading Organizations Worldwide",
          description: "Our corporate training programs help organizations build the skills their teams need to grow.",
          backgroundImage: "/images/weekend-ux-why-our-students-hiring-bg.webp",
          partners: [
               { name: "Weekend UX", image: "/images/weekend-ux-logo.webp", alt: "Weekend UX" },
               { name: "Partner", image: "", alt: "Partner" },
               { name: "Partner", image: "", alt: "Partner" },
               { name: "Partner", image: "", alt: "Partner" },
               { name: "Partner", image: "", alt: "Partner" }
          ]
     },
     whyUs: {
          eyebrow: "Why Us",
          headingStart: "Why",
          headingHighlight: "Top Companies",
          headingEnd: "Prefer WeekendUX",
          description: "Simplilearn for Business helps organizations convert learning investments into measurable goals. Unlimited hands-on learning that fuels career growth, fills in-demand roles, and builds complementary skills with real business impact.",
          backgroundImage: "/images/weekend-ux-why-us-bg.webp",
          cardImageOne: "/images/weekend-ux-why-us-card-1.png",
          cardImageTwo: "/images/weekend-ux-why-us-card-2.png",
          points: [
               "Customized curriculum built with industry leaders, for industry leaders",
               "Extensive GenAI curriculum from foundation to advanced across domains. Learning journeys covering 40+ AI and digital roles.",
               "Assignments and project work review and feedback from industry SMEs",
               "Comprehensive learning across digital literacy and technology, with soft skills programs for real workplace impact",
               "Assignments and project work review and feedback from industry SMEs",
               "Assignments and project work review and feedback from industry SMEs"
          ]
     },
     trainingOptions: {
          eyebrow: "Training Options",
          headingStart: "Learning Model That",
          headingHighlight: "Moves",
          headingEnd: "The Business Forward",
          backgroundImage: "/images/weekend-ux-why-our-students-hiring-bg.webp",
          showcaseBackgroundImage: "/images/weekend-ux-training-options-card-bg.webp",
          options: [
               { id: "ui", title: "User Interface Design", image: "/images/weekend-ux-training-options-card-center-image.webp", topics: ["Design Systems", "Figma Advanced Mastery", "Responsive Layouts", "Micro-Interactions", "Component Architecture"] },
               { id: "ai", title: "Artificial Intelligence", image: "/images/weekend-ux-training-options-card-center-image.webp", topics: ["Gen AI", "AI Design Tools", "AI Prompting", "AI In Research", "AI In Wireframing"] },
               { id: "ux", title: "User Experience Design", image: "/images/weekend-ux-training-options-card-center-image.webp", topics: ["User Research & Testing", "Information Architecture", "Wireframing & Prototyping", "Usability Audits", "Heuristic Evaluation"] },
               { id: "graphic", title: "Graphic Design", image: "/images/weekend-ux-training-options-card-center-image.webp", topics: ["Brand Identity & Systems", "Typography & Layout", "Visual Storytelling", "Vector Illustration", "Marketing Collaterals"] },
               { id: "video", title: "Video Design & Editing", image: "/images/weekend-ux-training-options-card-center-image.webp", topics: ["Premiere Pro & DaVinci", "Color Grading & LUTs", "Audio & Sound Design", "Storyboarding & Pace", "Narrative Video Editing"] },
               { id: "motion", title: "Motion & Animation", image: "/images/weekend-ux-training-options-card-center-image.webp", topics: ["After Effects 2D Motion", "UI Motion Guidelines", "3D Motion Graphics", "Kinetic Typography", "Lottie Micro-Animations"] }
          ]
     },
     outcomes: {
          headingStart: "What Learning",
          headingHighlight: "Delivers",
          headingEnd: "For Your Organization",
          cards: [
               { icon: "award", value: "95%", label: "Certification Pass Rate" },
               { icon: "star", value: "85%", label: "Average Completion Rate" },
               { icon: "dollar-sign", value: "40%", label: "Savings on Training Costs" }
          ]
     },
     talkToExpert: {
          title: "Talk To Expert",
          startheading: "Explore The Right",
          midheading: "Learning Solutions",
          endheading: "For Your Training Needs.",
          formTitle: "Request Callback",
          buttonLabel: "Get in Touch"
     }
};

function TextField({ label, value, onChange, placeholder, multiline = false }) {
     const sharedClassName = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20";
     return (
          <label className="block space-y-1.5">
               <span className="block text-xs font-bold uppercase tracking-wider text-gray-500">{label}</span>
               {multiline ? (
                    <textarea
                         rows={3}
                         value={value || ""}
                         onChange={(event) => onChange(event.target.value)}
                         placeholder={placeholder}
                         className={`${sharedClassName} resize-y`}
                    />
               ) : (
                    <input
                         value={value || ""}
                         onChange={(event) => onChange(event.target.value)}
                         placeholder={placeholder}
                         className={sharedClassName}
                    />
               )}
          </label>
     );
}

export default function CorporateTrainingData() {
     const { showToast } = useToast();
     const [content, setContent] = useState(defaultContent);
     const [partnerFiles, setPartnerFiles] = useState({});
     const [whyUsFiles, setWhyUsFiles] = useState({});
     const [trainingOptionFiles, setTrainingOptionFiles] = useState({});
     const [trainingOptionsFiles, setTrainingOptionsFiles] = useState({});
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [activeTab, setActiveTab] = useState("hero");

     useEffect(() => {
          const fetchContent = async () => {
               try {
                    const response = await fetch(`${API_URL}/corporate-training`);
                    const data = await response.json();
                    if (!response.ok) throw new Error(data?.error || "Could not load Corporate Training content.");
                    setContent({
                         hero: { ...defaultContent.hero, ...data.hero },
                         trustedBy: { ...defaultContent.trustedBy, ...data.trustedBy },
                         whyUs: { ...defaultContent.whyUs, ...data.whyUs },
                         trainingOptions: {
                              ...defaultContent.trainingOptions,
                              ...data.trainingOptions,
                              options: Array.isArray(data.trainingOptions?.options)
                                   ? data.trainingOptions.options
                                   : defaultContent.trainingOptions.options,
                         },
                         outcomes: {
                              ...defaultContent.outcomes,
                              ...data.outcomes,
                              cards: Array.isArray(data.outcomes?.cards)
                                   ? data.outcomes.cards
                                   : defaultContent.outcomes.cards,
                         },
                         talkToExpert: { ...defaultContent.talkToExpert, ...data.talkToExpert },
                    });
               } catch (error) {
                    console.error("Error fetching Corporate Training content:", error);
                    showToast(error.message || "Could not load Corporate Training content.", "error");
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

     const updatePartner = (index, field, value) => {
          setContent((previous) => ({
               ...previous,
               trustedBy: {
                    ...previous.trustedBy,
                    partners: previous.trustedBy.partners.map((partner, partnerIndex) =>
                         partnerIndex === index ? { ...partner, [field]: value } : partner
                    ),
               },
          }));
     };

     const updateWhyUsPoint = (index, value) => {
          setContent((previous) => ({
               ...previous,
               whyUs: {
                    ...previous.whyUs,
                    points: previous.whyUs.points.map((point, pointIndex) =>
                         pointIndex === index ? value : point
                    ),
               },
          }));
     };

     const updateTrainingOption = (index, field, value) => {
          setContent((previous) => ({
               ...previous,
               trainingOptions: {
                    ...previous.trainingOptions,
                    options: previous.trainingOptions.options.map((option, optionIndex) =>
                         optionIndex === index ? { ...option, [field]: value } : option
                    ),
               },
          }));
     };

     const updateOutcomeCard = (index, field, value) => {
          setContent((previous) => ({
               ...previous,
               outcomes: {
                    ...previous.outcomes,
                    cards: previous.outcomes.cards.map((card, cardIndex) =>
                         cardIndex === index ? { ...card, [field]: value } : card
                    ),
               },
          }));
     };

     const updateTrainingOptionImage = (index, file) => {
          setTrainingOptionFiles((previous) => {
               const nextFiles = { ...previous };
               if (file) nextFiles[index] = file;
               else delete nextFiles[index];
               return nextFiles;
          });
          if (!file) updateTrainingOption(index, "image", "");
     };

     const removeTrainingOption = (index) => {
          setContent((previous) => ({
               ...previous,
               trainingOptions: {
                    ...previous.trainingOptions,
                    options: previous.trainingOptions.options.filter((_, optionIndex) => optionIndex !== index),
               },
          }));
          setTrainingOptionFiles((previous) => {
               const nextFiles = {};
               Object.entries(previous).forEach(([fileIndex, file]) => {
                    const numericIndex = Number(fileIndex);
                    if (numericIndex < index) nextFiles[numericIndex] = file;
                    if (numericIndex > index) nextFiles[numericIndex - 1] = file;
               });
               return nextFiles;
          });
     };

     const updateTrainingOptionsImage = (field, file) => {
          setTrainingOptionsFiles((previous) => {
               const nextFiles = { ...previous };
               if (file) nextFiles[field] = file;
               else delete nextFiles[field];
               return nextFiles;
          });
          if (!file) updateSection("trainingOptions", field, "");
     };

     const updateWhyUsImage = (field, file) => {
          setWhyUsFiles((previous) => {
               const nextFiles = { ...previous };
               if (file) nextFiles[field] = file;
               else delete nextFiles[field];
               return nextFiles;
          });
          if (!file) updateSection("whyUs", field, "");
     };

     const updatePartnerImage = (index, file) => {
          setPartnerFiles((previous) => {
               const nextFiles = { ...previous };
               if (file) {
                    nextFiles[index] = file;
               } else {
                    delete nextFiles[index];
               }
               return nextFiles;
          });
          if (!file) updatePartner(index, "image", "");
     };

     const removePartner = (index) => {
          setContent((previous) => ({
               ...previous,
               trustedBy: {
                    ...previous.trustedBy,
                    partners: previous.trustedBy.partners.filter((_, partnerIndex) => partnerIndex !== index),
               },
          }));
          setPartnerFiles((previous) => {
               const nextFiles = {};
               Object.entries(previous).forEach(([fileIndex, file]) => {
                    const numericIndex = Number(fileIndex);
                    if (numericIndex < index) nextFiles[numericIndex] = file;
                    if (numericIndex > index) nextFiles[numericIndex - 1] = file;
               });
               return nextFiles;
          });
     };

     const saveContent = async () => {
          try {
               setSaving(true);
               const token = getAdminToken();
               const formData = new FormData();
               formData.append("data", JSON.stringify(content));
               Object.entries(partnerFiles).forEach(([index, file]) => {
                    formData.append(`partnerImage_${index}`, file);
               });
               Object.entries(whyUsFiles).forEach(([field, file]) => {
                    formData.append(`whyUs_${field}`, file);
               });
               Object.entries(trainingOptionFiles).forEach(([index, file]) => {
                    formData.append(`trainingOptionImage_${index}`, file);
               });
               Object.entries(trainingOptionsFiles).forEach(([field, file]) => {
                    formData.append(`trainingOptions_${field}`, file);
               });
               const response = await fetch(`${API_URL}/corporate-training`, {
                    method: "PUT",
                    headers: {
                         Authorization: `Bearer ${token}`,
                    },
                    body: formData,
               });
               const data = await response.json();
               if (!response.ok) throw new Error(data?.error || "Could not save Corporate Training content.");
               setContent({
                    hero: { ...defaultContent.hero, ...data.hero },
                    trustedBy: { ...defaultContent.trustedBy, ...data.trustedBy },
                    whyUs: { ...defaultContent.whyUs, ...data.whyUs },
                    trainingOptions: {
                         ...defaultContent.trainingOptions,
                         ...data.trainingOptions,
                         options: Array.isArray(data.trainingOptions?.options)
                              ? data.trainingOptions.options
                              : defaultContent.trainingOptions.options,
                    },
                    outcomes: {
                         ...defaultContent.outcomes,
                         ...data.outcomes,
                         cards: Array.isArray(data.outcomes?.cards)
                              ? data.outcomes.cards
                              : defaultContent.outcomes.cards,
                    },
                    talkToExpert: { ...defaultContent.talkToExpert, ...data.talkToExpert },
               });
               setPartnerFiles({});
               setWhyUsFiles({});
               setTrainingOptionFiles({});
               setTrainingOptionsFiles({});
               showToast("Corporate Training content saved successfully!", "success");
          } catch (error) {
               console.error("Error saving Corporate Training content:", error);
               showToast(error.message || "Could not save Corporate Training content.", "error");
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
                              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Corporate Training Content</h1>
                              <p className="mt-1 text-sm text-gray-500">Edit each Corporate Training page section.</p>
                         </div>
                         <button
                              type="button"
                              onClick={saveContent}
                              disabled={loading || saving}
                              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                         >
                              <HiOutlineSave className="h-4 w-4" />
                              {saving ? "Saving..." : "Save Changes"}
                         </button>
                    </header>

                    {loading ? (
                         <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">Loading Corporate Training content...</div>
                    ) : (
                         <div className="space-y-6">
                              <nav className="flex gap-2 overflow-x-auto pb-2" aria-label="Corporate Training content sections">
                                   {[
                                        ["hero", "Hero"],
                                        ["trustedBy", "Trusted By"],
                                        ["whyUs", "Why Us"],
                                        ["trainingOptions", "Training Options"],
                                        ["outcomes", "Outcomes"],
                                        ["talkToExpert", "Talk To Expert"],
                                        // ["talkToExpert", "Talk To Expert"],
                                   ].map(([tab, label]) => (
                                        <button
                                             key={tab}
                                             type="button"
                                             onClick={() => setActiveTab(tab)}
                                             className={`shrink-0 rounded-lg px-5 py-3 text-sm font-semibold transition-all ${
                                                  activeTab === tab
                                                       ? "bg-orange-500 text-white shadow-sm"
                                                       : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                             }`}
                                        >
                                             {label}
                                        </button>
                                   ))}
                              </nav>

                              {activeTab === "hero" && (
                              <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                                   <div>
                                        <h2 className="text-lg font-bold text-gray-900">Hero Section</h2>
                                        <p className="mt-1 text-sm text-gray-500">Manage the hero copy, call-to-action and background image URL.</p>
                                   </div>
                                   <div className="grid gap-4 md:grid-cols-2">
                                        <TextField label="Eyebrow" value={content.hero.eyebrow} onChange={(value) => updateSection("hero", "eyebrow", value)} />
                                        <TextField label="Button text" value={content.hero.buttonText} onChange={(value) => updateSection("hero", "buttonText", value)} />
                                        <div className="md:col-span-2">
                                             <TextField label="Heading" value={content.hero.heading} onChange={(value) => updateSection("hero", "heading", value)} multiline />
                                        </div>
                                        <TextField label="Button link" value={content.hero.buttonLink} onChange={(value) => updateSection("hero", "buttonLink", value)} placeholder="/contact-us" />
                                        <TextField label="Background image URL" value={content.hero.backgroundImage} onChange={(value) => updateSection("hero", "backgroundImage", value)} />
                                   </div>
                              </section>
                              )}

                              {activeTab === "whyUs" && (
                              <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                                   <div>
                                        <h2 className="text-lg font-bold text-gray-900">Why Us Section</h2>
                                        <p className="mt-1 text-sm text-gray-500">Manage the section copy, feature cards and background imagery.</p>
                                   </div>
                                   <div className="grid gap-4 md:grid-cols-2">
                                        <TextField label="Eyebrow" value={content.whyUs.eyebrow} onChange={(value) => updateSection("whyUs", "eyebrow", value)} />
                                        <TextField label="Heading start" value={content.whyUs.headingStart} onChange={(value) => updateSection("whyUs", "headingStart", value)} />
                                        <TextField label="Highlighted heading" value={content.whyUs.headingHighlight} onChange={(value) => updateSection("whyUs", "headingHighlight", value)} />
                                        <TextField label="Heading end" value={content.whyUs.headingEnd} onChange={(value) => updateSection("whyUs", "headingEnd", value)} />
                                        <div className="md:col-span-2">
                                             <TextField label="Description" value={content.whyUs.description} onChange={(value) => updateSection("whyUs", "description", value)} multiline />
                                        </div>
                                   </div>

                                   <div className="grid gap-5 md:grid-cols-3">
                                        {[
                                             ["backgroundImage", "Section background"],
                                             ["cardImageOne", "First feature image"],
                                             ["cardImageTwo", "Second feature image"],
                                        ].map(([field, label]) => (
                                             <div key={field}>
                                                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">{label}</span>
                                                  <ImageUploader
                                                       initialImage={content.whyUs[field]}
                                                       setImage={(file) => updateWhyUsImage(field, file)}
                                                  />
                                             </div>
                                        ))}
                                   </div>

                                   <div className="space-y-4">
                                        <div className="flex items-center justify-between gap-3">
                                             <h3 className="font-semibold text-gray-800">Why Us Features</h3>
                                             <button
                                                  type="button"
                                                  onClick={() => setContent((previous) => ({
                                                       ...previous,
                                                       whyUs: { ...previous.whyUs, points: [...previous.whyUs.points, ""] },
                                                  }))}
                                                  className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
                                             >
                                                  <HiOutlinePlus className="h-4 w-4" /> Add Feature
                                             </button>
                                        </div>
                                        {content.whyUs.points.map((point, index) => (
                                             <div key={index} className="flex items-start gap-3">
                                                  <div className="flex-1">
                                                       <TextField
                                                            label={`Feature ${index + 1}`}
                                                            value={point}
                                                            onChange={(value) => updateWhyUsPoint(index, value)}
                                                            multiline
                                                       />
                                                  </div>
                                                  <button
                                                       type="button"
                                                       aria-label={`Remove feature ${index + 1}`}
                                                       onClick={() => setContent((previous) => ({
                                                            ...previous,
                                                            whyUs: {
                                                                 ...previous.whyUs,
                                                                 points: previous.whyUs.points.filter((_, pointIndex) => pointIndex !== index),
                                                            },
                                                       }))}
                                                       className="mt-6 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:bg-red-50"
                                                  >
                                                       <HiOutlineTrash className="h-5 w-5" />
                                                  </button>
                                             </div>
                                        ))}
                                   </div>
                              </section>
                              )}

                              {activeTab === "trainingOptions" && (
                              <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                                   <div>
                                        <h2 className="text-lg font-bold text-gray-900">Training Options Section</h2>
                                        <p className="mt-1 text-sm text-gray-500">Edit the heading, section backgrounds, tabs, preview images and topics.</p>
                                   </div>
                                   <div className="grid gap-4 md:grid-cols-2">
                                        <TextField label="Eyebrow" value={content.trainingOptions.eyebrow} onChange={(value) => updateSection("trainingOptions", "eyebrow", value)} />
                                        <TextField label="Heading start" value={content.trainingOptions.headingStart} onChange={(value) => updateSection("trainingOptions", "headingStart", value)} />
                                        <TextField label="Highlighted heading" value={content.trainingOptions.headingHighlight} onChange={(value) => updateSection("trainingOptions", "headingHighlight", value)} />
                                        <TextField label="Heading end" value={content.trainingOptions.headingEnd} onChange={(value) => updateSection("trainingOptions", "headingEnd", value)} />
                                   </div>

                                   <div className="grid gap-5 md:grid-cols-2">
                                        {[
                                             ["backgroundImage", "Section background"],
                                             ["showcaseBackgroundImage", "Showcase card background"],
                                        ].map(([field, label]) => (
                                             <div key={field}>
                                                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">{label}</span>
                                                  <ImageUploader
                                                       initialImage={content.trainingOptions[field]}
                                                       setImage={(file) => updateTrainingOptionsImage(field, file)}
                                                  />
                                             </div>
                                        ))}
                                   </div>

                                   <div className="space-y-4">
                                        <div className="flex items-center justify-between gap-3">
                                             <h3 className="font-semibold text-gray-800">Training Tabs</h3>
                                             <button
                                                  type="button"
                                                  onClick={() => setContent((previous) => ({
                                                       ...previous,
                                                       trainingOptions: {
                                                            ...previous.trainingOptions,
                                                            options: [
                                                                 ...previous.trainingOptions.options,
                                                                 { id: `training-${Date.now()}`, title: "", image: "", topics: [] },
                                                            ],
                                                       },
                                                  }))}
                                                  className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
                                             >
                                                  <HiOutlinePlus className="h-4 w-4" /> Add Training Option
                                             </button>
                                        </div>
                                        {content.trainingOptions.options.map((option, index) => (
                                             <div key={`${option.id}-${index}`} className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
                                                  <div className="flex items-start gap-3">
                                                       <div className="grid flex-1 gap-3 md:grid-cols-2">
                                                            <TextField label="Tab title" value={option.title} onChange={(value) => updateTrainingOption(index, "title", value)} />
                                                            <TextField label="Tab ID" value={option.id} onChange={(value) => updateTrainingOption(index, "id", value)} />
                                                       </div>
                                                       <button
                                                            type="button"
                                                            aria-label={`Remove training option ${index + 1}`}
                                                            onClick={() => removeTrainingOption(index)}
                                                            className="mt-6 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:bg-red-50"
                                                       >
                                                            <HiOutlineTrash className="h-5 w-5" />
                                                       </button>
                                                  </div>
                                                  <div>
                                                       <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Preview image</span>
                                                       <ImageUploader
                                                            initialImage={option.image}
                                                            setImage={(file) => updateTrainingOptionImage(index, file)}
                                                       />
                                                  </div>
                                                  <label className="block space-y-1.5">
                                                       <span className="block text-xs font-bold uppercase tracking-wider text-gray-500">Topics (one per line)</span>
                                                       <textarea
                                                            rows={5}
                                                            value={(option.topics || []).join("\n")}
                                                            onChange={(event) => updateTrainingOption(index, "topics", event.target.value.split("\n"))}
                                                            className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                                                       />
                                                  </label>
                                             </div>
                                        ))}
                                   </div>
                              </section>
                              )}

                              {activeTab === "trustedBy" && (
                              <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                                   <div>
                                        <h2 className="text-lg font-bold text-gray-900">Trusted By Section</h2>
                                        <p className="mt-1 text-sm text-gray-500">Edit the section heading, description, background and partner cards.</p>
                                   </div>
                                   <div className="grid gap-4 md:grid-cols-3">
                                        <TextField label="Heading start" value={content.trustedBy.startheading} onChange={(value) => updateSection("trustedBy", "startheading", value)} />
                                        <TextField label="Highlighted heading" value={content.trustedBy.midheading} onChange={(value) => updateSection("trustedBy", "midheading", value)} />
                                        <TextField label="Heading end" value={content.trustedBy.endheading} onChange={(value) => updateSection("trustedBy", "endheading", value)} />
                                        <div className="md:col-span-3">
                                             <TextField label="Description" value={content.trustedBy.description} onChange={(value) => updateSection("trustedBy", "description", value)} multiline />
                                        </div>
                                        <div className="md:col-span-3">
                                             <TextField label="Background image URL" value={content.trustedBy.backgroundImage} onChange={(value) => updateSection("trustedBy", "backgroundImage", value)} />
                                        </div>
                                   </div>

                                   <div className="space-y-4">
                                        <div className="flex items-center justify-between gap-3">
                                             <h3 className="font-semibold text-gray-800">Partner Cards</h3>
                                             <button
                                                  type="button"
                                                  onClick={() => setContent((previous) => ({
                                                       ...previous,
                                                       trustedBy: {
                                                            ...previous.trustedBy,
                                                            partners: [...previous.trustedBy.partners, { name: "", image: "", alt: "" }],
                                                       },
                                                  }))}
                                                  className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
                                             >
                                                  <HiOutlinePlus className="h-4 w-4" /> Add Partner
                                             </button>
                                        </div>
                                        {content.trustedBy.partners.map((partner, index) => (
                                             <div key={index} className="grid gap-3 rounded-xl border border-gray-200 bg-gray-50/60 p-4 md:grid-cols-[1fr_1.5fr_1fr_auto] md:items-end">
                                                  <TextField label="Name" value={partner.name} onChange={(value) => updatePartner(index, "name", value)} placeholder="Organization name" />
                                                  <div className="md:col-span-2">
                                                       <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Partner logo</span>
                                                       <ImageUploader
                                                            initialImage={partner.image}
                                                            setImage={(file) => updatePartnerImage(index, file)}
                                                       />
                                                  </div>
                                                  <TextField label="Image alt text" value={partner.alt} onChange={(value) => updatePartner(index, "alt", value)} />
                                                  <button
                                                       type="button"
                                                       aria-label={`Remove partner ${index + 1}`}
                                                       onClick={() => removePartner(index)}
                                                       className="mb-0.5 flex h-11 w-11 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:bg-red-50"
                                                  >
                                                       <HiOutlineTrash className="h-5 w-5" />
                                                  </button>
                                             </div>
                                        ))}
                                   </div>
                              </section>
                              )}

                              {activeTab === "outcomes" && (
                                   <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                                        <div>
                                             <h2 className="text-lg font-bold text-gray-900">Corporate Outcomes Section</h2>
                                             <p className="mt-1 text-sm text-gray-500">Edit the heading and outcome cards. The section background remains unchanged.</p>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-3">
                                             <TextField label="Heading start" value={content.outcomes.headingStart} onChange={(value) => updateSection("outcomes", "headingStart", value)} />
                                             <TextField label="Highlighted heading" value={content.outcomes.headingHighlight} onChange={(value) => updateSection("outcomes", "headingHighlight", value)} />
                                             <TextField label="Heading end" value={content.outcomes.headingEnd} onChange={(value) => updateSection("outcomes", "headingEnd", value)} />
                                        </div>
                                        <div className="space-y-4">
                                             <div className="flex items-center justify-between gap-3">
                                                  <h3 className="font-semibold text-gray-800">Outcome Cards</h3>
                                                  <button
                                                       type="button"
                                                       onClick={() => setContent((previous) => ({
                                                            ...previous,
                                                            outcomes: {
                                                                 ...previous.outcomes,
                                                                 cards: [...previous.outcomes.cards, { icon: "award", value: "", label: "" }],
                                                            },
                                                       }))}
                                                       className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
                                                  >
                                                       <HiOutlinePlus className="h-4 w-4" /> Add Outcome
                                                  </button>
                                             </div>
                                             {content.outcomes.cards.map((card, index) => (
                                                  <div key={index} className="grid gap-3 rounded-xl border border-gray-200 bg-gray-50/60 p-4 md:grid-cols-[1fr_1fr_2fr_auto] md:items-end">
                                                       <label className="block space-y-1.5">
                                                            <span className="block text-xs font-bold uppercase tracking-wider text-gray-500">Icon</span>
                                                            <select
                                                                 value={card.icon || "award"}
                                                                 onChange={(event) => updateOutcomeCard(index, "icon", event.target.value)}
                                                                 className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                                                            >
                                                                 <option value="award">Award</option>
                                                                 <option value="star">Star</option>
                                                                 <option value="dollar-sign">Dollar</option>
                                                            </select>
                                                       </label>
                                                       <TextField label="Value" value={card.value} onChange={(value) => updateOutcomeCard(index, "value", value)} placeholder="95%" />
                                                       <TextField label="Label" value={card.label} onChange={(value) => updateOutcomeCard(index, "label", value)} placeholder="Certification Pass Rate" />
                                                       <button
                                                            type="button"
                                                            aria-label={`Remove outcome ${index + 1}`}
                                                            onClick={() => setContent((previous) => ({
                                                                 ...previous,
                                                                 outcomes: {
                                                                      ...previous.outcomes,
                                                                      cards: previous.outcomes.cards.filter((_, cardIndex) => cardIndex !== index),
                                                                 },
                                                            }))}
                                                            className="mb-0.5 flex h-11 w-11 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:bg-red-50"
                                                       >
                                                            <HiOutlineTrash className="h-5 w-5" />
                                                       </button>
                                                  </div>
                                             ))}
                                        </div>
                                   </section>
                              )}

                               {activeTab === "talkToExpert" && (
                                    <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                                         <div>
                                              <h2 className="text-lg font-bold text-gray-900">Talk To Expert Section</h2>
                                              <p className="mt-1 text-sm text-gray-500">Edit the section heading and form card labels. The existing background and form behavior remain unchanged.</p>
                                         </div>
                                         <div className="grid gap-4 md:grid-cols-2">
                                              <TextField label="Section title" value={content.talkToExpert.title} onChange={(value) => updateSection("talkToExpert", "title", value)} />
                                              <TextField label="Heading start" value={content.talkToExpert.startheading} onChange={(value) => updateSection("talkToExpert", "startheading", value)} />
                                              <TextField label="Highlighted heading" value={content.talkToExpert.midheading} onChange={(value) => updateSection("talkToExpert", "midheading", value)} />
                                              <TextField label="Heading end" value={content.talkToExpert.endheading} onChange={(value) => updateSection("talkToExpert", "endheading", value)} />
                                              <TextField label="Form card heading" value={content.talkToExpert.formTitle} onChange={(value) => updateSection("talkToExpert", "formTitle", value)} />
                                              <TextField label="Submit button label" value={content.talkToExpert.buttonLabel} onChange={(value) => updateSection("talkToExpert", "buttonLabel", value)} />
                                         </div>
                                    </section>
                               )}
                         </div>
                    )}
               </main>
          </div>
     );
}

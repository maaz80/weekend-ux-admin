import { useEffect, useState } from "react";
import { HiOutlineSave } from "react-icons/hi";
import Breadcrumb from "../components/BreadCrumb";
import ImageUploader from "../components/ImageUploader";
import { useToast } from "../context/ToastContext";
import { getAdminToken } from "../utils/auth.js";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

const defaultContent = {
     hero: {
          subheading: "Free Resources",
          heading: "Explore Free UI/UX Design Resources",
          buttonText: "Explore Resources",
     },
     featuredResources: {
          eyebrow: "Featured",
          headingStart: "Featured",
          headingHighlight: "Resources",
          description: "Explore insights, tips, and courses created to help you build practical design skills.",
          courseSlugs: [],
          promoTitle: "Take the next step in your design journey",
          promoDescription: "Learn how to make design that sells.",
          promoButtonText: "Book a Call",
          promoButtonLink: "/contact-us",
     },
     popularTutorials: {
          headingStart: "Popular",
          headingHighlight: "Tutorials",
          tutorials: [
               { title: "Why should a learner prefer to study on campus", image: "/images/hero-bg.webp", link: "/blog" },
               { title: "Why should a learner prefer to study on campus", image: "/images/hero-bg.webp", link: "/blog" },
               { title: "Why should a learner prefer to study on campus rather than other options", image: "/images/weekend-ux-contact-decorative-image.webp", link: "/blog" },
          ],
     },
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

export default function FreeResourcesData() {
     const { showToast } = useToast();
     const [content, setContent] = useState(defaultContent);
     const [courses, setCourses] = useState([]);
     const [tutorialImages, setTutorialImages] = useState([]);
     const [activeTab, setActiveTab] = useState("hero");
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);

     useEffect(() => {
          const fetchContent = async () => {
               try {
                    const [contentResponse, coursesResponse] = await Promise.all([
                         fetch(`${API_URL}/free-resources`),
                         fetch(`${API_URL}/courses`),
                    ]);
                    const [data, courseData] = await Promise.all([
                         contentResponse.json(),
                         coursesResponse.json(),
                    ]);
                    if (!contentResponse.ok) throw new Error(data?.error || "Could not load Free Resources content.");
                    if (!coursesResponse.ok) throw new Error(courseData?.error || "Could not load available courses.");

                    setContent({
                         hero: { ...defaultContent.hero, ...data.hero },
                         featuredResources: {
                              ...defaultContent.featuredResources,
                              ...data.featuredResources,
                              courseSlugs: Array.isArray(data.featuredResources?.courseSlugs)
                                   ? data.featuredResources.courseSlugs
                                   : defaultContent.featuredResources.courseSlugs,
                         },
                         popularTutorials: {
                              ...defaultContent.popularTutorials,
                              ...data.popularTutorials,
                              tutorials: Array.isArray(data.popularTutorials?.tutorials)
                                   ? data.popularTutorials.tutorials
                                   : defaultContent.popularTutorials.tutorials,
                         },
                    });
                    setCourses(Array.isArray(courseData.course) ? courseData.course : []);
               } catch (error) {
                    console.error("Error fetching Free Resources content:", error);
                    showToast(error.message || "Could not load Free Resources content.", "error");
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

     const toggleCourse = (courseKey) => {
          setContent((previous) => {
               const selected = previous.featuredResources.courseSlugs;
               return {
                    ...previous,
                    featuredResources: {
                         ...previous.featuredResources,
                         courseSlugs: selected.includes(courseKey)
                              ? selected.filter((slug) => slug !== courseKey)
                              : [...selected, courseKey],
                    },
               };
          });
     };

     const updateTutorial = (index, field, value) => {
          setContent((previous) => ({
               ...previous,
               popularTutorials: {
                    ...previous.popularTutorials,
                    tutorials: previous.popularTutorials.tutorials.map((tutorial, tutorialIndex) =>
                         tutorialIndex === index ? { ...tutorial, [field]: value } : tutorial
                    ),
               },
          }));
     };

     const updateTutorialImage = (index, image) => {
          setTutorialImages((previous) => {
               const next = [...previous];
               next[index] = image;
               return next;
          });
          if (!image) updateTutorial(index, "image", "");
     };

     const addTutorial = () => {
          setContent((previous) => ({
               ...previous,
               popularTutorials: {
                    ...previous.popularTutorials,
                    tutorials: [...previous.popularTutorials.tutorials, { title: "", image: "", link: "/blog" }],
               },
          }));
     };

     const removeTutorial = (index) => {
          setContent((previous) => ({
               ...previous,
               popularTutorials: {
                    ...previous.popularTutorials,
                    tutorials: previous.popularTutorials.tutorials.filter((_, tutorialIndex) => tutorialIndex !== index),
               },
          }));
          setTutorialImages((previous) => previous.filter((_, tutorialIndex) => tutorialIndex !== index));
     };

     const saveContent = async () => {
          try {
               setSaving(true);
               const formData = new FormData();
               formData.append("data", JSON.stringify(content));
               tutorialImages.forEach((image, index) => {
                    if (image instanceof File) formData.append(`tutorialImage_${index}`, image);
               });
               const response = await fetch(`${API_URL}/free-resources`, {
                    method: "PUT",
                    headers: {
                         Authorization: `Bearer ${getAdminToken()}`,
                    },
                    body: formData,
               });
               const data = await response.json();
               if (!response.ok) throw new Error(data?.error || "Could not save Free Resources content.");
               showToast("Free Resources content saved successfully!", "success");
          } catch (error) {
               console.error("Error saving Free Resources content:", error);
               showToast(error.message || "Could not save Free Resources content.", "error");
          } finally {
               setSaving(false);
          }
     };

     const courseKey = (course) => course.slug || course._id;

     return (
          <div className="min-h-screen bg-gray-50/50 pb-12">
               <Breadcrumb />
               <main className="mx-auto max-w-5xl space-y-6 px-5 lg:px-8">
                    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                         <div>
                              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Free Resources Content</h1>
                              <p className="mt-1 text-sm text-gray-500">Manage the page hero and featured course cards.</p>
                         </div>
                         <button type="button" onClick={saveContent} disabled={loading || saving} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60">
                              <HiOutlineSave className="h-4 w-4" />
                              {saving ? "Saving..." : "Save Changes"}
                         </button>
                    </header>

                    {loading ? (
                         <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">Loading Free Resources content...</div>
                    ) : (
                         <>
                              <nav className="flex gap-2 overflow-x-auto pb-2" aria-label="Free Resources content sections">
                                   {[
                                        ["hero", "Hero"],
                                        ["featuredResources", "Featured Courses"],
                                        ["callout", "Callout Card"],
                                        ["popularTutorials", "Popular Tutorials"],
                                   ].map(([tab, label]) => (
                                        <button
                                             key={tab}
                                             type="button"
                                             onClick={() => setActiveTab(tab)}
                                             className={`shrink-0 rounded-lg px-5 py-3 text-sm font-semibold transition-all ${activeTab === tab ? "bg-orange-500 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                        >
                                             {label}
                                        </button>
                                   ))}
                              </nav>

                              {activeTab === "hero" && (
                              <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                                   <div>
                                        <h2 className="text-lg font-bold text-gray-900">Free Resources Hero</h2>
                                        <p className="mt-1 text-sm text-gray-500">Edit the subheading, heading, and button label. The hero design and background remain fixed.</p>
                                   </div>
                                   <div className="grid gap-4 md:grid-cols-2">
                                        <TextField label="Subheading" value={content.hero.subheading} onChange={(value) => updateSection("hero", "subheading", value)} />
                                        <TextField label="Button name" value={content.hero.buttonText} onChange={(value) => updateSection("hero", "buttonText", value)} />
                                        <div className="md:col-span-2">
                                             <TextField label="Heading" value={content.hero.heading} onChange={(value) => updateSection("hero", "heading", value)} multiline />
                                        </div>
                                   </div>
                              </section>
                              )}

                              {activeTab === "featuredResources" && (
                              <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                                   <div>
                                        <h2 className="text-lg font-bold text-gray-900">Featured Courses Section</h2>
                                        <p className="mt-1 text-sm text-gray-500">Choose courses from the Courses manager. Their title, image, start date, and duration will appear in the cards.</p>
                                   </div>
                                   <div className="grid gap-4 md:grid-cols-2">
                                        <TextField label="Eyebrow" value={content.featuredResources.eyebrow} onChange={(value) => updateSection("featuredResources", "eyebrow", value)} />
                                        <TextField label="Heading" value={content.featuredResources.headingStart} onChange={(value) => updateSection("featuredResources", "headingStart", value)} />
                                        <TextField label="Highlighted heading" value={content.featuredResources.headingHighlight} onChange={(value) => updateSection("featuredResources", "headingHighlight", value)} />
                                        <div className="md:col-span-2">
                                             <TextField label="Description" value={content.featuredResources.description} onChange={(value) => updateSection("featuredResources", "description", value)} multiline />
                                        </div>
                                   </div>
                                   <div className="space-y-3">
                                        <h3 className="font-semibold text-gray-800">Courses to Feature</h3>
                                        {courses.length > 0 ? (
                                             <div className="grid gap-2 sm:grid-cols-2">
                                                  {courses.map((course, index) => {
                                                       const key = courseKey(course);
                                                       if (!key) return null;
                                                       const selected = content.featuredResources.courseSlugs.includes(key);
                                                       return (
                                                            <label key={key} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${selected ? "border-orange-300 bg-orange-50" : "border-gray-200 bg-white hover:bg-gray-50"}`}>
                                                                 <input type="checkbox" checked={selected} onChange={() => toggleCourse(key)} className="h-4 w-4 accent-orange-500" />
                                                                 <img src={course.image || "/images/weekend-ux-program-image-template.webp"} alt="" className="h-12 w-16 rounded-lg object-cover" />
                                                                 <span className="text-sm font-medium text-gray-800">{course.title || `Course ${index + 1}`}</span>
                                                            </label>
                                                       );
                                                  })}
                                             </div>
                                        ) : (
                                             <p className="rounded-xl border border-dashed border-gray-300 p-5 text-sm text-gray-500">No courses are available. Add courses in the Courses manager first.</p>
                                        )}
                                   </div>
                              </section>
                              )}

                              {activeTab === "callout" && (
                              <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                                   <div>
                                        <h2 className="text-lg font-bold text-gray-900">Featured Courses Callout Card</h2>
                                        <p className="mt-1 text-sm text-gray-500">Edit the callout card copy and destination link.</p>
                                   </div>
                                   <div className="grid gap-4 md:grid-cols-2">
                                        <TextField label="Callout heading" value={content.featuredResources.promoTitle} onChange={(value) => updateSection("featuredResources", "promoTitle", value)} />
                                        <TextField label="Callout button text" value={content.featuredResources.promoButtonText} onChange={(value) => updateSection("featuredResources", "promoButtonText", value)} />
                                        <div className="md:col-span-2">
                                             <TextField label="Callout description" value={content.featuredResources.promoDescription} onChange={(value) => updateSection("featuredResources", "promoDescription", value)} multiline />
                                        </div>
                                        <TextField label="Callout link" value={content.featuredResources.promoButtonLink} onChange={(value) => updateSection("featuredResources", "promoButtonLink", value)} />
                                   </div>
                              </section>
                              )}

                              {activeTab === "popularTutorials" && (
                              <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                                   <div>
                                        <h2 className="text-lg font-bold text-gray-900">Popular Tutorials Section</h2>
                                        <p className="mt-1 text-sm text-gray-500">Manage tutorial section headings and cards. Background and visual design remain unchanged.</p>
                                   </div>
                                   <div className="grid gap-4 md:grid-cols-2">
                                        <TextField label="Heading" value={content.popularTutorials.headingStart} onChange={(value) => updateSection("popularTutorials", "headingStart", value)} />
                                        <TextField label="Highlighted heading" value={content.popularTutorials.headingHighlight} onChange={(value) => updateSection("popularTutorials", "headingHighlight", value)} />
                                   </div>
                                   <div className="flex items-center justify-between gap-3">
                                        <h3 className="font-semibold text-gray-800">Tutorial Cards</h3>
                                        <button type="button" onClick={addTutorial} className="rounded-lg border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50">
                                             Add Tutorial
                                        </button>
                                   </div>
                                   {content.popularTutorials.tutorials.map((tutorial, index) => (
                                        <div key={index} className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
                                             <div className="grid gap-3 md:grid-cols-2">
                                                  <TextField label="Tutorial title" value={tutorial.title} onChange={(value) => updateTutorial(index, "title", value)} />
                                                  <TextField label="Tutorial link" value={tutorial.link} onChange={(value) => updateTutorial(index, "link", value)} />
                                             </div>
                                             <div>
                                                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">Tutorial image</span>
                                                  <ImageUploader
                                                       initialImage={tutorialImages[index] || tutorial.image}
                                                       setImage={(image) => updateTutorialImage(index, image)}
                                                  />
                                             </div>
                                             <button type="button" onClick={() => removeTutorial(index)} className="rounded-lg border border-red-100 px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50">
                                                  Remove Tutorial
                                             </button>
                                        </div>
                                   ))}
                              </section>
                              )}
                         </>
                    )}
               </main>
          </div>
     );
}

import { useEffect, useState } from "react";
import Editor from "../components/Editor";
import ImageUploader from "../components/ImageUploader";
import Breadcrumb from "../components/BreadCrumb";
import { getAdminToken } from "../utils/auth.js";
import { useToast } from "../context/ToastContext";
import { HiOutlineTrash, HiOutlinePlus } from "react-icons/hi";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

const getErrorMessage = async (res, fallback) => {
     const data = await res.json().catch(() => ({}));
     return data.error || fallback;
};

export default function Locations() {
     const { showToast } = useToast();
     const [locations, setLocations] = useState([]);
     const [locationModal, setLocationModal] = useState(null);
     const [locationForm, setLocationForm] = useState({ title: "" });
     
     // Item Modal & Form state
     const [itemModal, setItemModal] = useState(null);
     const [selectedLocation, setSelectedLocation] = useState("");
     const [activeTab, setActiveTab] = useState("hero");

     // Original Schema Form Fields
     const [itemTitle, setItemTitle] = useState("");
     const [itemSeoTitle, setItemSeoTitle] = useState("");
     const [itemSeoDescription, setItemSeoDescription] = useState("");
     const [itemSlug, setItemSlug] = useState("");
     const [itemHeading, setItemHeading] = useState("");
     const [itemButtonName, setItemButtonName] = useState("");
     const [itemContent, setItemContent] = useState("");
     const [itemImageurl, setItemImageurl] = useState("");
     const [itemImageFile, setItemImageFile] = useState(null);
     const [itemImageAlt, setItemImageAlt] = useState("");
     const [itemRelatedTitle, setItemRelatedTitle] = useState("");
     const [itemRelatedStart, setItemRelatedStart] = useState("");
     const [itemRelatedMid, setItemRelatedMid] = useState("");
     const [itemRelatedEnd, setItemRelatedEnd] = useState("");
     const [itemRelatedDesc, setItemRelatedDesc] = useState("");
     const [faqTitle, setFaqTitle] = useState("");
     const [faqStartheading, setFaqStartheading] = useState("");
     const [faqMidheading, setFaqMidheading] = useState("");
     const [faqEndheading, setFaqEndheading] = useState("");
     const [faqDescription, setFaqDescription] = useState("");
     const [faqItems, setFaqItems] = useState([]);

     const [loadingAction, setLoadingAction] = useState(null);

     const fetchLocations = async () => {
          try {
               const res = await fetch(`${API}/locations`, {
                    headers: {
                         "Authorization": `Bearer ${getAdminToken()}`
                    }
               });
               if (res.ok) {
                    const data = await res.json();
                    setLocations(Array.isArray(data) ? data : []);
               }
          } catch (err) {
               console.error("Failed to fetch locations:", err);
          }
     };

     useEffect(() => {
          fetchLocations();
     }, []);

     const saveLocation = async () => {
          if (loadingAction) return;
          setLoadingAction("location");
          const formData = new FormData();
          formData.append("data", JSON.stringify(locationForm));

          const url = locationModal?.location
               ? `${API}/locations/${locationModal.location._id}`
               : `${API}/locations`;

          try {
               const res = await fetch(url, {
                    method: locationModal?.location ? "PUT" : "POST",
                    headers: {
                         "Authorization": `Bearer ${getAdminToken()}`
                    },
                    body: formData
               });

               if (!res.ok) {
                    showToast(await getErrorMessage(res, "Location group save failed."), "error");
                    return;
               }

               setLocationModal(null);
               await fetchLocations();
               showToast("Location group saved successfully!", "success");
          } catch (error) {
               showToast("Error saving location group", "error");
          } finally {
               setLoadingAction(null);
          }
     };

     const deleteLocation = async (locationId) => {
          if (!window.confirm("Are you sure you want to delete this Location Group and all its items?")) return;
          try {
               const res = await fetch(`${API}/locations/${locationId}`, {
                    method: "DELETE",
                    headers: {
                         "Authorization": `Bearer ${getAdminToken()}`
                    }
               });
               if (res.ok) {
                    await fetchLocations();
                    showToast("Location group deleted successfully!", "success");
               } else {
                    showToast("Failed to delete location group", "error");
               }
          } catch (error) {
               showToast("Error deleting location group", "error");
          }
     };

     const openLocationModal = (location = null) => {
          setLocationModal({ location });
          setLocationForm({
               title: location?.title || ""
          });
     };

     const openItemModal = (location, item = null) => {
          setItemModal({ location, item });
          setSelectedLocation(location._id);
          setActiveTab("hero");

          setItemTitle(item?.hero?.[0]?.title || item?.title || "");
          setItemSeoTitle(item?.hero?.[0]?.seotitle || "");
          setItemSeoDescription(item?.hero?.[0]?.seodescription || "");
          setItemSlug(item?.hero?.[0]?.slug || "");
          setItemHeading(item?.hero?.[0]?.heading || "");
          setItemButtonName(item?.hero?.[0]?.buttonName || "");
          setItemContent(item?.content || "");
          setItemImageurl(item?.image?.imageurl || "");
          setItemImageFile(null);
          setItemImageAlt(item?.image?.alt || "");
          setItemRelatedTitle(item?.relatedBlogs?.title || "");
          setItemRelatedStart(item?.relatedBlogs?.startheading || "");
          setItemRelatedMid(item?.relatedBlogs?.midheading || "");
          setItemRelatedEnd(item?.relatedBlogs?.endheading || "");
          setItemRelatedDesc(item?.relatedBlogs?.description || "");

          const itemFaq = item?.faq || {};
          if (Array.isArray(itemFaq)) {
               setFaqItems(itemFaq);
               setFaqTitle("");
               setFaqStartheading("");
               setFaqMidheading("");
               setFaqEndheading("");
               setFaqDescription("");
          } else {
               setFaqTitle(itemFaq.title || "");
               setFaqStartheading(itemFaq.startheading || "");
               setFaqMidheading(itemFaq.midheading || "");
               setFaqEndheading(itemFaq.endheading || "");
               setFaqDescription(itemFaq.description || "");
               setFaqItems(itemFaq.items || []);
          }
     };

     const saveItem = async () => {
          if (loadingAction) return;
          if (!selectedLocation) {
               showToast("Please select a location group.", "error");
               return;
          }
          if (!itemTitle.trim()) {
               showToast("Item title is required.", "error");
               return;
          }
          setLoadingAction("item");

          const existing = itemModal.item || {};
          const payload = {
               _id: existing._id,
               title: itemTitle,
               seoTitle: itemSeoTitle,
               seoDescription: itemSeoDescription,
               slug: itemSlug,
               heroHeading: itemHeading,
               heroButton: itemButtonName,
               content: itemContent,
               image: {
                    imageurl: itemImageurl,
                    alt: itemImageAlt
               },
               relatedBlogs: {
                    title: itemRelatedTitle,
                    startheading: itemRelatedStart,
                    midheading: itemRelatedMid,
                    endheading: itemRelatedEnd,
                    description: itemRelatedDesc
               },
               faq: {
                    title: faqTitle,
                    startheading: faqStartheading,
                    midheading: faqMidheading,
                    endheading: faqEndheading,
                    description: faqDescription,
                    items: faqItems
               }
          };

          const formData = new FormData();
          formData.append("data", JSON.stringify(payload));
          if (itemImageFile) {
               formData.append("image", itemImageFile);
          }

          try {
               if (existing._id && selectedLocation !== itemModal.location._id) {
                    // Move item to new location group: delete from old, add to new
                    await fetch(`${API}/locations/${itemModal.location._id}/items/${existing._id}`, {
                         method: "DELETE",
                         headers: {
                              "Authorization": `Bearer ${getAdminToken()}`
                         }
                    });
                    const addRes = await fetch(`${API}/locations/${selectedLocation}/items`, {
                         method: "POST",
                         headers: {
                              "Authorization": `Bearer ${getAdminToken()}`
                         },
                         body: formData
                    });
                    if (!addRes.ok) {
                         showToast(await getErrorMessage(addRes, "Item move failed."), "error");
                         return;
                    }
               } else {
                    const url = existing._id
                         ? `${API}/locations/${selectedLocation}/items/${existing._id}`
                         : `${API}/locations/${selectedLocation}/items`;
                    const res = await fetch(url, {
                         method: existing._id ? "PUT" : "POST",
                         headers: {
                              "Authorization": `Bearer ${getAdminToken()}`
                         },
                         body: formData
                    });
                    if (!res.ok) {
                         showToast(await getErrorMessage(res, "Item save failed."), "error");
                         return;
                    }
               }

               setItemModal(null);
               await fetchLocations();
               showToast("Item saved successfully!", "success");
          } catch (error) {
               showToast("Error saving item", "error");
          } finally {
               setLoadingAction(null);
          }
     };

     const deleteItem = async (locationId, itemId) => {
          if (!window.confirm("Are you sure you want to delete this Location Item?")) return;
          try {
               const res = await fetch(`${API}/locations/${locationId}/items/${itemId}`, {
                    method: "DELETE",
                    headers: {
                         "Authorization": `Bearer ${getAdminToken()}`
                    }
               });
               if (res.ok) {
                    await fetchLocations();
                    showToast("Item deleted successfully!", "success");
               } else {
                    showToast("Failed to delete item", "error");
               }
          } catch (error) {
               showToast("Error deleting item", "error");
          }
     };

     return (
          <div className="space-y-8 bg-slate-50 min-h-screen text-slate-800 poppins-regular">
               <Breadcrumb />
               <div className="px-10 pb-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                         <div>
                              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Location Manager</h1>
                              <p className="text-slate-500 mt-2">Manage location groups and their individual page configurations.</p>
                         </div>

                         <button
                              onClick={() => openLocationModal()}
                              className="px-5 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-orange-600 transition-all cursor-pointer"
                         >
                              Add Location Group
                         </button>
                    </div>

                    <div className="space-y-6 mt-6">
                         {locations.map((location) => (
                              <div key={location._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                   <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
                                        <div>
                                             <h2 className="text-2xl font-bold text-slate-900">{location.title || "Untitled Group"}</h2>
                                             <p className="text-xs text-slate-400 mt-1">ID: {location._id}</p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                             <button onClick={() => openItemModal(location)} className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-bold hover:bg-emerald-100 cursor-pointer">
                                                  + Add Location Page
                                             </button>
                                             <button onClick={() => openLocationModal(location)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 cursor-pointer">
                                                  Edit Group Title
                                             </button>
                                             <button onClick={() => deleteLocation(location._id)} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-100 cursor-pointer">
                                                  Delete Group
                                             </button>
                                        </div>
                                   </div>

                                   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {(location.items || []).map((item) => (
                                             <div key={item._id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 hover:shadow-md transition-all">
                                                  <div className="flex items-start justify-between gap-3">
                                                       <div>
                                                            <h3 className="font-bold text-slate-800">{item.hero?.[0]?.title || item.title || "Untitled Item"}</h3>
                                                            <p className="text-xs text-slate-500 mt-1 font-mono">
                                                                 Slug: {item.hero?.[0]?.slug || "No Slug"}
                                                            </p>
                                                            {item.image?.imageurl && (
                                                                 <img src={item.image.imageurl} alt={item.image.alt || ""} className="h-20 w-full object-cover rounded-lg mt-2" />
                                                            )}
                                                       </div>
                                                  </div>

                                                  <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-200">
                                                       <button onClick={() => openItemModal(location, item)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 cursor-pointer">
                                                            Edit Page Config
                                                       </button>
                                                       <button onClick={() => deleteItem(location._id, item._id)} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-100 cursor-pointer">
                                                            Delete
                                                       </button>
                                                  </div>
                                             </div>
                                        ))}

                                        {(!location.items || location.items.length === 0) && (
                                             <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-400 bg-slate-50 col-span-full">
                                                  No pages added to this group yet.
                                             </div>
                                        )}
                                   </div>
                              </div>
                         ))}
                    </div>

                    {locationModal && (
                         <Modal title={locationModal.location ? "Edit Location Group" : "Add Location Group"} onClose={() => setLocationModal(null)}>
                              <input value={locationForm.title} onChange={(e) => setLocationForm({ ...locationForm, title: e.target.value })} placeholder="Location Group Title (e.g. Delhi NCR)" className={inputClass} />
                              <ModalActions onCancel={() => setLocationModal(null)} onSave={saveLocation} loading={loadingAction === "location"} />
                         </Modal>
                    )}

                    {itemModal && (
                         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-start z-50 p-4 overflow-y-auto">
                              <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl my-6">
                                   <div className="sticky top-0 z-10 bg-white border-b border-slate-200 rounded-t-2xl px-6 py-4 flex justify-between items-center">
                                        <div>
                                             <h3 className="text-xl font-bold text-slate-800">
                                                  {itemModal.item ? "Edit Location Page" : "Add Location Page"}
                                             </h3>
                                             <p className="text-xs text-slate-400 mt-0.5">Group: {itemModal.location.title}</p>
                                        </div>
                                        <div className="flex gap-3">
                                             <button onClick={() => setItemModal(null)} className="px-5 py-2.5 text-slate-600 bg-slate-100 font-semibold rounded-lg hover:bg-slate-200 cursor-pointer">Cancel</button>
                                             <button disabled={loadingAction === "item"} onClick={saveItem} className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center gap-2">
                                                  {loadingAction === "item" && <Spinner />}
                                                  {loadingAction === "item" ? "Saving..." : "Save Page"}
                                             </button>
                                        </div>
                                   </div>

                                   {/* Tabs headers */}
                                   <div className="flex border-b border-slate-200 px-6 bg-slate-50">
                                        {[
                                             { id: "hero", label: "Hero & SEO" },
                                             { id: "content", label: "Page Content" },
                                             { id: "image", label: "Hero/Featured Image" },
                                             { id: "blogs", label: "Related Blogs" },
                                             { id: "faq", label: "FAQ" }
                                        ].map(tab => (
                                             <button
                                                  key={tab.id}
                                                  onClick={() => setActiveTab(tab.id)}
                                                  className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                                                       activeTab === tab.id
                                                            ? "border-blue-600 text-blue-600"
                                                            : "border-transparent text-slate-500 hover:text-slate-800"
                                                  }`}
                                             >
                                                  {tab.label}
                                             </button>
                                        ))}
                                   </div>

                                   {/* Tab Body */}
                                   <div className="p-6 md:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                                        {activeTab === "hero" && (
                                             <div className="space-y-4">
                                                  <div>
                                                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Group Parent</label>
                                                       <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className={`${inputClass} cursor-pointer`}>
                                                            {locations.map(loc => <option className="cursor-pointer" key={loc._id} value={loc._id}>{loc.title}</option>)}
                                                       </select>
                                                  </div>
                                                  <div>
                                                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Page / Location Title</label>
                                                       <input value={itemTitle} onChange={(e) => setItemTitle(e.target.value)} placeholder="e.g. Delhi Studio" className={inputClass} />
                                                  </div>
                                                  <div>
                                                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Dynamic URL path (Slug)</label>
                                                       <input value={itemSlug} onChange={(e) => setItemSlug(e.target.value)} placeholder="e.g. delhi-studio" className={inputClass} />
                                                  </div>
                                                  <div>
                                                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">SEO Title</label>
                                                       <input value={itemSeoTitle} onChange={(e) => setItemSeoTitle(e.target.value)} placeholder="SEO Meta Title" className={inputClass} />
                                                  </div>
                                                  <div>
                                                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">SEO Description</label>
                                                       <textarea value={itemSeoDescription} onChange={(e) => setItemSeoDescription(e.target.value)} placeholder="SEO Meta Description" rows={2} className={textareaClass} />
                                                  </div>
                                                  <div>
                                                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Hero Heading</label>
                                                       <input value={itemHeading} onChange={(e) => setItemHeading(e.target.value)} placeholder="e.g. Where Design Meets Excellence" className={inputClass} />
                                                  </div>
                                                  <div>
                                                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Hero Button Name</label>
                                                       <input value={itemButtonName} onChange={(e) => setItemButtonName(e.target.value)} placeholder="e.g. Contact Us" className={inputClass} />
                                                  </div>
                                             </div>
                                        )}

                                        {activeTab === "content" && (
                                             <div className="space-y-4 text-black">
                                                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Page Rich HTML Content</label>
                                                  <Editor value={itemContent} onChange={(val) => setItemContent(val)} />
                                             </div>
                                        )}

                                        {activeTab === "image" && (
                                             <div className="space-y-4">
                                                   <div>
                                                        <div className="flex items-center justify-between mb-2">
                                                             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Featured Image</label>
                                                             <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Recommended: 900 x 600 px (3:2)</span>
                                                        </div>
                                                        <ImageUploader initialImage={itemImageurl} setImage={(file) => setItemImageFile(file)} />
                                                        <p className="text-[11px] text-gray-400 mt-1">Suggested size: 900 x 600 px or 800 x 600 px (looks best on both mobile and PC layouts).</p>
                                                   </div>
                                                  <div>
                                                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Image Alt Text</label>
                                                       <input value={itemImageAlt} onChange={(e) => setItemImageAlt(e.target.value)} placeholder="Alt text for accessibility" className={inputClass} />
                                                  </div>
                                             </div>
                                        )}

                                        {activeTab === "blogs" && (
                                             <div className="space-y-4">
                                                  <div>
                                                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Blogs Section Title</label>
                                                       <input value={itemRelatedTitle} onChange={(e) => setItemRelatedTitle(e.target.value)} placeholder="e.g. Related Blogs" className={inputClass} />
                                                  </div>
                                                  <div className="grid grid-cols-3 gap-4">
                                                       <div>
                                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Start Heading Word</label>
                                                            <input value={itemRelatedStart} onChange={(e) => setItemRelatedStart(e.target.value)} placeholder="e.g. Our" className={inputClass} />
                                                       </div>
                                                       <div>
                                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Mid Heading Word</label>
                                                            <input value={itemRelatedMid} onChange={(e) => setItemRelatedMid(e.target.value)} placeholder="e.g. Latest" className={inputClass} />
                                                       </div>
                                                       <div>
                                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">End Heading Word</label>
                                                            <input value={itemRelatedEnd} onChange={(e) => setItemRelatedEnd(e.target.value)} placeholder="e.g. Stories" className={inputClass} />
                                                       </div>
                                                  </div>
                                                  <div>
                                                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Blogs Description</label>
                                                       <textarea value={itemRelatedDesc} onChange={(e) => setItemRelatedDesc(e.target.value)} placeholder="Section introduction..." rows={3} className={textareaClass} />
                                                  </div>
                                             </div>
                                        )}

                                        {activeTab === "faq" && (
                                             <div className="space-y-4 text-left">
                                                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Frequently Asked Questions (FAQs)</p>
                                                  
                                                  {/* FAQ Headings Inputs */}
                                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                       <div>
                                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">FAQ Section Title</label>
                                                            <input
                                                                 value={faqTitle}
                                                                 onChange={(e) => setFaqTitle(e.target.value)}
                                                                 placeholder="e.g. FAQ"
                                                                 className={inputClass}
                                                            />
                                                       </div>
                                                       <div>
                                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">FAQ Start Heading</label>
                                                            <input
                                                                 value={faqStartheading}
                                                                 onChange={(e) => setFaqStartheading(e.target.value)}
                                                                 placeholder="e.g. All You"
                                                                 className={inputClass}
                                                            />
                                                       </div>
                                                       <div>
                                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">FAQ Mid Heading</label>
                                                            <input
                                                                 value={faqMidheading}
                                                                 onChange={(e) => setFaqMidheading(e.target.value)}
                                                                 placeholder="e.g. Need"
                                                                 className={inputClass}
                                                            />
                                                       </div>
                                                       <div>
                                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">FAQ End Heading</label>
                                                            <input
                                                                 value={faqEndheading}
                                                                 onChange={(e) => setFaqEndheading(e.target.value)}
                                                                 placeholder="e.g. To Know"
                                                                 className={inputClass}
                                                            />
                                                       </div>
                                                       <div className="sm:col-span-2">
                                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">FAQ Section Description</label>
                                                            <textarea
                                                                 value={faqDescription}
                                                                 onChange={(e) => setFaqDescription(e.target.value)}
                                                                 placeholder="FAQ section description..."
                                                                 rows={2}
                                                                 className={inputClass}
                                                            />
                                                       </div>
                                                  </div>

                                                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 mt-4">FAQ Q&A Items</p>
                                                  <div className="space-y-4">
                                                       {faqItems.map((item, index) => (
                                                            <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative space-y-3">
                                                                 <button
                                                                      type="button"
                                                                      onClick={() => {
                                                                           setFaqItems(prev => prev.filter((_, i) => i !== index));
                                                                      }}
                                                                      className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-500 transition-colors border border-red-100 cursor-pointer"
                                                                 >
                                                                      <HiOutlineTrash className="text-sm" />
                                                                 </button>
                                                                 <div className="space-y-1.5 pr-8">
                                                                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Question {index + 1}</label>
                                                                      <input
                                                                           value={item.ques}
                                                                           onChange={(e) => {
                                                                                const val = e.target.value;
                                                                                setFaqItems(prev => prev.map((f, i) => i === index ? { ...f, ques: val } : f));
                                                                           }}
                                                                           placeholder="e.g. What is the address?"
                                                                           className={inputClass}
                                                                           required
                                                                      />
                                                                 </div>
                                                                 <div className="space-y-1.5 pr-8">
                                                                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Answer {index + 1}</label>
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
                                                            className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-500 transition-all font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer bg-white"
                                                       >
                                                            <HiOutlinePlus className="text-sm" />
                                                            Add FAQ Item
                                                       </button>
                                                  </div>
                                             </div>
                                        )}
                                   </div>
                              </div>
                         </div>
                    )}
               </div>
          </div>
     );
}

const inputClass = "w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-700 placeholder-slate-400 shadow-sm";
const textareaClass = `${inputClass} resize-none`;

const Modal = ({ title, onClose, children }) => (
     <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
               <div className="flex justify-between items-center mb-6 border-b pb-3">
                    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-900 cursor-pointer">Close</button>
               </div>
               <div className="space-y-4">{children}</div>
          </div>
     </div>
);

const ModalActions = ({ onCancel, onSave, saveLabel = "Save", loading = false }) => (
     <div className="flex justify-end gap-3 pt-4">
          <button disabled={loading} onClick={onCancel} className="px-5 py-2.5 text-slate-600 bg-slate-100 font-semibold rounded-lg hover:bg-slate-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">Cancel</button>
          <button disabled={loading} onClick={onSave} className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center gap-2">
               {loading && <Spinner />}
               {loading ? "Saving..." : saveLabel}
          </button>
     </div>
);

const Spinner = () => (
     <span className="h-4 w-4 rounded-full border-2 border-white/50 border-t-white animate-spin" />
);

import { useEffect, useState } from "react";
import Breadcrumb from "../components/BreadCrumb.jsx";
import { useToast } from "../context/ToastContext";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";
const DEFAULT_FLOATING_WIDGETS = {
     whatsapp: {
          enabled: true,
          phoneNumber: "919311500424",
          defaultMessage: "Hi, I came from the website and want to enquire about Weekend UX courses.",
          iconImage: ""
     },
     backToTop: { enabled: true, iconName: "BsChevronUp" }
};
const DEFAULT_QUICK_ACCESS_BAR = {
     enabled: true,
     showCall: true,
     showLiveChat: true,
     phoneNumber: "919599272764",
     callDesktopLabel: "Call us at +91 95992 72764",
     callMobileLabel: "Call Now",
     liveChatLabel: "Live Chat"
};

export default function FooterManager() {
     const { showToast } = useToast();
     const [columns, setColumns] = useState([]);
     const [showModal, setShowModal] = useState(false);
     const [editItem, setEditItem] = useState(null);
     const [title, setTitle] = useState("");
     const [order, setOrder] = useState(0);
     const [links, setLinks] = useState([]);
     const [saving, setSaving] = useState(false);

     // New states for Global Settings
     const [activeTab, setActiveTab] = useState("columns");
     const [buttonname, setButtonname] = useState("");
     const [buttontitle, setButtontitle] = useState("");
     const [copyright, setCopyright] = useState("");
     const [socials, setSocials] = useState([]);
     const [navigation, setNavigation] = useState([]);
     const [navigationTitle, setNavigationTitle] = useState("Explore");
     const [floatingWidgets, setFloatingWidgets] = useState(DEFAULT_FLOATING_WIDGETS);
     const [quickAccessBar, setQuickAccessBar] = useState(DEFAULT_QUICK_ACCESS_BAR);
     const [whatsappIconFile, setWhatsappIconFile] = useState(null);
     const [whatsappIconPreview, setWhatsappIconPreview] = useState("");
     const [cardTitle, setCardTitle] = useState("");
     const [cardButtonName, setCardButtonName] = useState("");
     const [locationContact, setLocationContact] = useState({
          title: "",
          addresses: [],
          phone: "",
          email: ""
     });
     const [loadingSettings, setLoadingSettings] = useState(false);

     const fetchColumns = async () => {
          try {
               const res = await fetch(`${API_URL}/footer-columns`);
               const data = await res.json();
               setColumns(data);
          } catch (err) {
               console.error("Failed to fetch footer columns", err);
          }
     };

     const fetchSettings = async () => {
          setLoadingSettings(true);
          try {
               const res = await fetch(`${API_URL}/footer-columns/global`);
               if (res.ok) {
                    const data = await res.json();
                    setButtonname(data.buttonname || "");
                    setButtontitle(data.buttontitle || "");
                    setCopyright(data.copyright || "");
                    setSocials(data.socials || []);
                    setNavigation(data.navigation || []);
                    setNavigationTitle(data.navigationTitle || "Explore");
                    setFloatingWidgets({
                         whatsapp: { ...DEFAULT_FLOATING_WIDGETS.whatsapp, ...(data.floatingWidgets?.whatsapp || {}) },
                         backToTop: { ...DEFAULT_FLOATING_WIDGETS.backToTop, ...(data.floatingWidgets?.backToTop || {}) }
                    });
                    setQuickAccessBar({ ...DEFAULT_QUICK_ACCESS_BAR, ...(data.quickAccessBar || {}) });
                    setWhatsappIconFile(null);
                    setWhatsappIconPreview("");
                    setCardTitle(data.card?.title || "");
                    setCardButtonName(data.card?.buttonName || "");
                    const savedAddresses = Array.isArray(data.locationContact?.addresses)
                         ? data.locationContact.addresses.filter((address) => typeof address === "string")
                         : [];
                    const addresses = savedAddresses.length > 0
                         ? savedAddresses
                         : (data.locationContact?.address?.trim() ? [data.locationContact.address] : []);
                    setLocationContact({
                         title: data.locationContact?.title || "",
                         addresses,
                         phone: data.locationContact?.phone || "",
                         email: data.locationContact?.email || ""
                    });
               }
          } catch (err) {
               console.error("Failed to fetch global footer settings", err);
          } finally {
               setLoadingSettings(false);
          }
     };

     useEffect(() => {
          fetchColumns();
          fetchSettings();
     }, []);

     useEffect(() => {
          if (!whatsappIconPreview) return undefined;
          return () => URL.revokeObjectURL(whatsappIconPreview);
     }, [whatsappIconPreview]);

     const addSocialRow = () => {
          setSocials([...socials, { icon: "", path: "" }]);
     };

     const updateSocialField = (index, key, value) => {
          const updated = [...socials];
          updated[index][key] = value;
          setSocials(updated);
     };

     const removeSocialRow = (index) => {
          setSocials(socials.filter((_, i) => i !== index));
     };

     const addNavigationRow = () => {
          setNavigation([...navigation, { itemname: "", itempath: "" }]);
     };

     const updateNavigationField = (index, key, value) => {
          const updated = [...navigation];
          updated[index][key] = value;
          setNavigation(updated);
     };

     const removeNavigationRow = (index) => {
          setNavigation(navigation.filter((_, i) => i !== index));
     };

     const updateFloatingWidget = (widget, key, value) => {
          setFloatingWidgets((prev) => ({
               ...prev,
               [widget]: { ...prev[widget], [key]: value }
          }));
     };

     const updateQuickAccessBar = (key, value) => {
          setQuickAccessBar((prev) => ({ ...prev, [key]: value }));
     };

     const addLocationAddress = () => {
          setLocationContact((prev) => ({ ...prev, addresses: [...prev.addresses, ""] }));
     };

     const updateLocationAddress = (index, value) => {
          setLocationContact((prev) => ({
               ...prev,
               addresses: prev.addresses.map((address, i) => i === index ? value : address)
          }));
     };

     const removeLocationAddress = (index) => {
          setLocationContact((prev) => ({
               ...prev,
               addresses: prev.addresses.filter((_, i) => i !== index)
          }));
     };

     const saveSettings = async (e) => {
          e.preventDefault();
          setSaving(true);
          try {
               const payload = {
                    buttonname,
                    buttontitle,
                    copyright,
                    socials: socials.filter(s => s.icon && s.path),
                    navigation: navigation.filter(n => n.itemname && n.itempath),
                    navigationTitle,
                    floatingWidgets,
                    quickAccessBar,
                    card: {
                         title: cardTitle,
                         buttonName: cardButtonName
                    },
                    locationContact: {
                         ...locationContact,
                         addresses: locationContact.addresses.map((address) => address.trim()).filter(Boolean),
                         // Keep the first address in the legacy field for older frontend deployments.
                         address: locationContact.addresses.find((address) => address.trim())?.trim() || ""
                    }
               };
               const formData = new FormData();
               formData.append("settings", JSON.stringify(payload));
               if (whatsappIconFile) formData.append("whatsappIcon", whatsappIconFile);

               const res = await fetch(`${API_URL}/footer-columns/global`, {
                    method: "PUT",
                    body: formData
               });
               if (res.ok) {
                    showToast("Global footer settings saved successfully!", "success");
                    fetchSettings();
               } else {
                    const err = await res.json();
                    showToast(err.error || "Failed to save global settings", "error");
               }
          } catch (err) {
               console.error("Save settings error", err);
               showToast("An error occurred while saving global settings.", "error");
          } finally {
               setSaving(false);
          }
     };

     const resetForm = () => {
          setTitle("");
          setOrder(0);
          setLinks([]);
          setEditItem(null);
     };

     const openAddModal = () => {
          resetForm();
          setShowModal(true);
     };

     const openEditModal = (col) => {
          setEditItem(col);
          setTitle(col.title);
          setOrder(col.order || 0);
          setLinks(col.links || []);
          setShowModal(true);
     };

     const addLinkRow = () => {
          setLinks([...links, { label: "", path: "" }]);
     };

     const updateLinkField = (index, key, value) => {
          const updated = [...links];
          updated[index][key] = value;
          setLinks(updated);
     };

     const removeLinkRow = (index) => {
          setLinks(links.filter((_, i) => i !== index));
     };

     const saveColumn = async (e) => {
          e.preventDefault();
          if (!title) {
               showToast("Title is required.", "error");
               return;
          }

          setSaving(true);
          try {
               const payload = {
                    title,
                    order: Number(order),
                    links: links.filter(l => l.label && l.path)
               };

               let url = `${API_URL}/footer-columns`;
               let method = "POST";

               if (editItem) {
                    url = `${API_URL}/footer-columns/${editItem._id}`;
                    method = "PUT";
               }

               const res = await fetch(url, {
                    method,
                    headers: {
                         "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
               });

               if (res.ok) {
                    setShowModal(false);
                    resetForm();
                    fetchColumns();
               } else {
                    const err = await res.json();
                    showToast(err.error || "Failed to save footer column", "error");
               }
          } catch (err) {
               console.error("Save error", err);
               showToast("An error occurred while saving.", "error");
          } finally {
               setSaving(false);
          }
     };

     const deleteColumn = async (id) => {
          if (!window.confirm("Are you sure you want to delete this footer column?")) return;

          try {
               const res = await fetch(`${API_URL}/footer-columns/${id}`, {
                    method: "DELETE"
               });

               if (res.ok) {
                    fetchColumns();
               } else {
                    showToast("Failed to delete column.", "error");
               }
          } catch (err) {
               console.error(err);
               showToast("An error occurred while deleting.", "error");
          }
     };

     const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition-all duration-200";

     return (
          <div className="min-h-screen bg-gray-50/50 pb-12 font-sans">
               <Breadcrumb />

               {/* Header */}
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 px-6 lg:px-10 max-w-7xl mx-auto">
                    <div>
                         <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Footer Links Manager</h1>
                         <p className="text-sm text-gray-500 mt-1">Manage dynamic footer sections & column links</p>
                    </div>

                    {activeTab === "columns" && (
                         <button
                              onClick={openAddModal}
                              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shrink-0"
                         >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                              </svg>
                              Add Column
                         </button>
                    )}
               </div>

               {/* Tabs */}
               <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-8 flex gap-6 border-b border-gray-200">
                    <button
                         onClick={() => setActiveTab("columns")}
                         className={`pb-3 text-sm font-bold border-b-2 transition-all duration-200 cursor-pointer ${
                              activeTab === "columns"
                                   ? "border-orange-500 text-orange-600"
                                   : "border-transparent text-gray-500 hover:text-gray-700"
                         }`}
                    >
                         Footer Columns
                    </button>
                    <button
                         onClick={() => setActiveTab("settings")}
                         className={`pb-3 text-sm font-bold border-b-2 transition-all duration-200 cursor-pointer ${
                              activeTab === "settings"
                                   ? "border-orange-500 text-orange-600"
                                   : "border-transparent text-gray-500 hover:text-gray-700"
                         }`}
                    >
                         Global Footer Settings
                    </button>
               </div>

               {/* Columns List / Settings Forms */}
               {activeTab === "columns" ? (
                    columns.length === 0 ? (
                         <div className="flex flex-col items-center justify-center py-32 text-gray-300 px-6 lg:px-10 max-w-7xl mx-auto">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                              </svg>
                              <p className="text-lg font-medium text-gray-700">No footer columns configured yet</p>
                              <p className="text-sm mt-1 text-gray-400">Click "Add Column" to build your dynamic footer</p>
                         </div>
                    ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-6 lg:px-10 max-w-7xl mx-auto">
                              {columns.map(col => (
                                   <div key={col._id} className="bg-white rounded-2xl p-5 shadow-md shadow-gray-200/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                                        <div>
                                             <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                                                  <h2 className="font-bold text-gray-900 text-base">{col.title}</h2>
                                                  <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-2 py-0.5 rounded-md">
                                                       Order: {col.order}
                                                  </span>
                                             </div>

                                             <div className="space-y-2.5">
                                                  {(!col.links || col.links.length === 0) ? (
                                                       <p className="text-xs text-gray-400 italic">No links added</p>
                                                  ) : (
                                                       col.links.map((link, idx) => (
                                                            <div key={idx} className="flex flex-col border-l-2 border-orange-200 pl-2 text-xs">
                                                                 <span className="font-semibold text-gray-800">{link.label}</span>
                                                                 <span className="text-gray-400 font-mono overflow-x-auto">{link.path}</span>
                                                            </div>
                                                       ))
                                                  )}
                                             </div>
                                        </div>

                                        <div className="flex gap-2 pt-4 border-t border-gray-100 mt-5">
                                             <button
                                                  onClick={() => openEditModal(col)}
                                                  className="flex-1 flex items-center justify-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-semibold py-2 rounded-xl transition-colors duration-200 cursor-pointer"
                                             >
                                                  Edit
                                             </button>
                                             <button
                                                  onClick={() => deleteColumn(col._id)}
                                                  className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold py-2 rounded-xl transition-colors duration-200 cursor-pointer"
                                             >
                                                  Delete
                                             </button>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    )
               ) : (
                    // Global Footer Settings Tab
                    <div className="px-6 lg:px-10 max-w-7xl mx-auto">
                         <form onSubmit={saveSettings} className="bg-white rounded-2xl shadow-md shadow-gray-200/50 p-6 lg:p-8 space-y-8">
                              {/* General Information Card */}
                              <div className="space-y-4">
                                   <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">General Button & Title Settings</h2>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Social Section Heading / Button Title</label>
                                             <input
                                                  type="text"
                                                  placeholder="e.g., Follow us!"
                                                  value={buttontitle}
                                                  onChange={(e) => setButtontitle(e.target.value)}
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div>
                                             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Button Text (Name)</label>
                                             <input
                                                  type="text"
                                                  placeholder="e.g., Refer & Earn"
                                                  value={buttonname}
                                                  onChange={(e) => setButtonname(e.target.value)}
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                        <div>
                                             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">CTA Card Title</label>
                                             <input
                                                  type="text"
                                                  placeholder="e.g., Let's build something great together"
                                                  value={cardTitle}
                                                  onChange={(e) => setCardTitle(e.target.value)}
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div>
                                             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">CTA Card Button Name</label>
                                             <input
                                                  type="text"
                                                  placeholder="e.g., Get in touch"
                                                  value={cardButtonName}
                                                  onChange={(e) => setCardButtonName(e.target.value)}
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>
                                   <div className="mt-4">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Footer Copyright Text</label>
                                        <input
                                             type="text"
                                             placeholder="e.g., © 2026 - Weekend UX All Rights Reserved."
                                             value={copyright}
                                             onChange={(e) => setCopyright(e.target.value)}
                                             className={inputClass}
                                        />
                                   </div>
                              </div>

                              {/* General Site Settings */}
                              <div className="space-y-5 rounded-2xl border border-gray-100 bg-gray-50/70 p-5 lg:p-6">
                                   <div className="border-b border-gray-200 pb-3">
                                        <h2 className="text-lg font-bold text-gray-900">General</h2>
                                        <p className="mt-1 text-xs text-gray-500">Manage floating WhatsApp and scroll-to-top buttons shown on the website.</p>
                                   </div>

                                   <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                                        <section className="space-y-4 rounded-xl border border-gray-100 bg-white p-4">
                                             <div className="flex items-center justify-between gap-3">
                                                  <h3 className="font-semibold text-gray-900">WhatsApp Floating Button</h3>
                                                  <label className="inline-flex items-center gap-2 text-xs font-medium text-gray-600">
                                                       <input
                                                            type="checkbox"
                                                            checked={floatingWidgets.whatsapp.enabled}
                                                            onChange={(e) => updateFloatingWidget("whatsapp", "enabled", e.target.checked)}
                                                            className="accent-orange-500"
                                                       />
                                                       Enabled
                                                  </label>
                                             </div>
                                             <div className="space-y-1.5">
                                                  <label className="block text-xs font-semibold text-gray-500">WhatsApp Number</label>
                                                  <input
                                                       type="tel"
                                                       value={floatingWidgets.whatsapp.phoneNumber}
                                                       onChange={(e) => updateFloatingWidget("whatsapp", "phoneNumber", e.target.value)}
                                                       className={inputClass}
                                                       placeholder="e.g. 919311500424"
                                                  />
                                             </div>
                                             <div className="space-y-1.5">
                                                  <label className="block text-xs font-semibold text-gray-500">Prefilled Message</label>
                                                  <textarea
                                                       rows={3}
                                                       value={floatingWidgets.whatsapp.defaultMessage}
                                                       onChange={(e) => updateFloatingWidget("whatsapp", "defaultMessage", e.target.value)}
                                                       className={inputClass}
                                                       placeholder="Message shown when someone opens WhatsApp"
                                                  />
                                             </div>
                                             <div className="space-y-2">
                                                  <label className="block text-xs font-semibold text-gray-500">WhatsApp Icon Image</label>
                                                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                                       <img
                                                            src={whatsappIconPreview || floatingWidgets.whatsapp.iconImage || "/images/whatsapp-icon.webp"}
                                                            alt="WhatsApp icon preview"
                                                            className="h-14 w-14 rounded-full border border-gray-200 bg-white object-contain p-1"
                                                       />
                                                       <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                 const file = e.target.files?.[0] || null;
                                                                 setWhatsappIconFile(file);
                                                                 setWhatsappIconPreview(file ? URL.createObjectURL(file) : "");
                                                            }}
                                                            className="block w-full text-xs text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-orange-50 file:px-3 file:py-2 file:font-semibold file:text-orange-600 hover:file:bg-orange-100"
                                                       />
                                                  </div>
                                                  <label className="inline-flex items-center gap-2 text-xs text-gray-500">
                                                       <input
                                                            type="checkbox"
                                                            checked={!floatingWidgets.whatsapp.iconImage && !whatsappIconFile}
                                                            onChange={(e) => {
                                                                 if (e.target.checked) {
                                                                      setWhatsappIconFile(null);
                                                                      setWhatsappIconPreview("");
                                                                      updateFloatingWidget("whatsapp", "iconImage", "");
                                                                 }
                                                            }}
                                                            className="accent-orange-500"
                                                       />
                                                       Use the default WhatsApp icon
                                                  </label>
                                             </div>
                                        </section>

                                        <section className="space-y-4 rounded-xl border border-gray-100 bg-white p-4">
                                             <div className="flex items-center justify-between gap-3">
                                                  <h3 className="font-semibold text-gray-900">Scroll to Top Button</h3>
                                                  <label className="inline-flex items-center gap-2 text-xs font-medium text-gray-600">
                                                       <input
                                                            type="checkbox"
                                                            checked={floatingWidgets.backToTop.enabled}
                                                            onChange={(e) => updateFloatingWidget("backToTop", "enabled", e.target.checked)}
                                                            className="accent-orange-500"
                                                       />
                                                       Enabled
                                                  </label>
                                             </div>
                                             <div className="space-y-1.5">
                                                  <label className="block text-xs font-semibold text-gray-500">React Icons Component Name</label>
                                                  <input
                                                       type="text"
                                                       value={floatingWidgets.backToTop.iconName}
                                                       onChange={(e) => updateFloatingWidget("backToTop", "iconName", e.target.value)}
                                                       className={inputClass}
                                                       placeholder="e.g. BsChevronUp"
                                                  />
                                                  <p className="text-[11px] text-gray-400">Paste an exact component name from react-icons.github.io/react-icons.</p>
                                             </div>
                                        </section>
                                   </div>

                                   <section className="space-y-4 rounded-xl border border-gray-100 bg-white p-4">
                                        <div className="flex flex-col gap-3 border-b border-gray-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
                                             <div>
                                                  <h3 className="font-semibold text-gray-900">Bottom Quick Access Bar</h3>
                                                  <p className="mt-1 text-xs text-gray-400">Change the fixed Call and Live Chat bar at the bottom of the website.</p>
                                             </div>
                                             <label className="inline-flex items-center gap-2 text-xs font-medium text-gray-600">
                                                  <input
                                                       type="checkbox"
                                                       checked={quickAccessBar.enabled}
                                                       onChange={(e) => updateQuickAccessBar("enabled", e.target.checked)}
                                                       className="accent-orange-500"
                                                  />
                                                  Show Bar
                                             </label>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                             <label className="inline-flex items-center gap-2 text-xs text-gray-600">
                                                  <input
                                                       type="checkbox"
                                                       checked={quickAccessBar.showCall}
                                                       onChange={(e) => updateQuickAccessBar("showCall", e.target.checked)}
                                                       className="accent-orange-500"
                                                  />
                                                  Show Call Button
                                             </label>
                                             <label className="inline-flex items-center gap-2 text-xs text-gray-600">
                                                  <input
                                                       type="checkbox"
                                                       checked={quickAccessBar.showLiveChat}
                                                       onChange={(e) => updateQuickAccessBar("showLiveChat", e.target.checked)}
                                                       className="accent-orange-500"
                                                  />
                                                  Show Live Chat Button
                                             </label>
                                             <div className="space-y-1.5">
                                                  <label className="block text-xs font-semibold text-gray-500">Call Number</label>
                                                  <input
                                                       type="tel"
                                                       value={quickAccessBar.phoneNumber}
                                                       onChange={(e) => updateQuickAccessBar("phoneNumber", e.target.value)}
                                                       className={inputClass}
                                                       placeholder="e.g. 919599272764"
                                                  />
                                             </div>
                                             <div className="space-y-1.5">
                                                  <label className="block text-xs font-semibold text-gray-500">Call Label (Desktop)</label>
                                                  <input
                                                       type="text"
                                                       value={quickAccessBar.callDesktopLabel}
                                                       onChange={(e) => updateQuickAccessBar("callDesktopLabel", e.target.value)}
                                                       className={inputClass}
                                                       placeholder="e.g. Call us at +91..."
                                                  />
                                             </div>
                                             <div className="space-y-1.5">
                                                  <label className="block text-xs font-semibold text-gray-500">Call Label (Mobile)</label>
                                                  <input
                                                       type="text"
                                                       value={quickAccessBar.callMobileLabel}
                                                       onChange={(e) => updateQuickAccessBar("callMobileLabel", e.target.value)}
                                                       className={inputClass}
                                                       placeholder="e.g. Call Now"
                                                  />
                                             </div>
                                             <div className="space-y-1.5">
                                                  <label className="block text-xs font-semibold text-gray-500">Live Chat Label</label>
                                                  <input
                                                       type="text"
                                                       value={quickAccessBar.liveChatLabel}
                                                       onChange={(e) => updateQuickAccessBar("liveChatLabel", e.target.value)}
                                                       className={inputClass}
                                                       placeholder="e.g. Live Chat"
                                                  />
                                             </div>
                                        </div>
                                   </section>
                              </div>

                              {/* Footer Location Contact */}
                              <div className="space-y-4">
                                   <div className="border-b border-gray-100 pb-3">
                                        <h2 className="text-lg font-bold text-gray-900">Footer Location Contact Details</h2>
                                        <p className="text-xs text-gray-400 mt-1">Shown beside the location links in the footer. Leave fields blank to hide this block.</p>
                                   </div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Title</label>
                                             <input
                                                  type="text"
                                                  placeholder="e.g., Visit Us"
                                                  value={locationContact.title}
                                                  onChange={(e) => setLocationContact((prev) => ({ ...prev, title: e.target.value }))}
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="md:col-span-2 space-y-3">
                                             <div className="flex items-center justify-between gap-3">
                                                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest">Addresses</label>
                                                  <button
                                                       type="button"
                                                       onClick={addLocationAddress}
                                                       className="text-xs font-semibold text-orange-500 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                                                  >
                                                       + Add Address
                                                  </button>
                                             </div>
                                             {locationContact.addresses.length === 0 ? (
                                                  <p className="text-xs text-gray-400">No addresses configured. Click “+ Add Address” to add one.</p>
                                             ) : (
                                                  locationContact.addresses.map((address, idx) => (
                                                       <div key={idx} className="flex items-start gap-2">
                                                            <textarea
                                                                 rows={3}
                                                                 placeholder="Enter your full address"
                                                                 value={address}
                                                                 onChange={(e) => updateLocationAddress(idx, e.target.value)}
                                                                 className={inputClass}
                                                            />
                                                            <button
                                                                 type="button"
                                                                 onClick={() => removeLocationAddress(idx)}
                                                                 aria-label={`Remove address ${idx + 1}`}
                                                                 className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors cursor-pointer shrink-0"
                                                            >
                                                                 ×
                                                            </button>
                                                       </div>
                                                  ))
                                             )}
                                        </div>
                                        <div>
                                             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Phone Number</label>
                                             <input
                                                  type="text"
                                                  placeholder="e.g., +91 9599272764"
                                                  value={locationContact.phone}
                                                  onChange={(e) => setLocationContact((prev) => ({ ...prev, phone: e.target.value }))}
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div>
                                             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Email</label>
                                             <input
                                                  type="email"
                                                  placeholder="e.g., info@weekendux.in"
                                                  value={locationContact.email}
                                                  onChange={(e) => setLocationContact((prev) => ({ ...prev, email: e.target.value }))}
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>
                              </div>

                              {/* Social Links Card */}
                              <div className="space-y-4">
                                   <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                        <div>
                                             <h2 className="text-lg font-bold text-gray-900">Social Media Icons & Links</h2>
                                             <p className="text-xs text-gray-400 mt-1">Enter React Icons name (e.g. <code>SiFacebook</code>, <code>FaInstagram</code>, <code>FaLinkedinIn</code>, <code>SiYoutube</code>, <code>FaXTwitter</code>) and profile URLs.</p>
                                        </div>
                                        <button
                                             type="button"
                                             onClick={addSocialRow}
                                             className="text-xs font-semibold text-orange-500 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                                        >
                                             + Add Social
                                        </button>
                                   </div>

                                   <div className="space-y-3">
                                        {socials.length === 0 ? (
                                             <p className="text-xs text-gray-400 text-center py-6">No social links configured. Click "+ Add Social" to add one.</p>
                                        ) : (
                                             socials.map((social, idx) => (
                                                  <div key={idx} className="flex gap-2 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                       <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            <input
                                                                 type="text"
                                                                 placeholder="Icon Class (e.g., FaInstagram)"
                                                                 value={social.icon}
                                                                 onChange={(e) => updateSocialField(idx, "icon", e.target.value)}
                                                                 className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                                 required
                                                            />
                                                            <input
                                                                 type="text"
                                                                 placeholder="Profile Path (e.g., https://instagram.com/yourhandle)"
                                                                 value={social.path}
                                                                 onChange={(e) => updateSocialField(idx, "path", e.target.value)}
                                                                 className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                                 required
                                                            />
                                                       </div>
                                                       <button
                                                            type="button"
                                                            onClick={() => removeSocialRow(idx)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors cursor-pointer shrink-0"
                                                       >
                                                            ✕
                                                       </button>
                                                  </div>
                                             ))
                                        )}
                                   </div>
                              </div>

                              {/* Bottom Navigation Links */}
                              <div className="space-y-4">
                                   <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                        <div>
                                             <h2 className="text-lg font-bold text-gray-900">Bottom Footer Navigation</h2>
                                             <p className="text-xs text-gray-400 mt-1">Configure bottom bar navigation items (e.g. Home, Terms, Privacy Policy)</p>
                                        </div>
                                        <button
                                             type="button"
                                             onClick={addNavigationRow}
                                             className="text-xs font-semibold text-orange-500 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                                        >
                                             + Add Item
                                        </button>
                                   </div>
                                   
                                   <div className="space-y-1.5 rounded-xl border border-gray-100 bg-gray-50 p-4">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest">Bottom Bar Heading</label>
                                        <input
                                             type="text"
                                             value={navigationTitle}
                                             onChange={(e) => setNavigationTitle(e.target.value)}
                                             className={inputClass}
                                             placeholder="e.g. Explore"
                                        />
                                   </div>

                                   <div className="space-y-3">
                                        {navigation.length === 0 ? (
                                             <p className="text-xs text-gray-400 text-center py-6">No bottom navigation links configured. Click "+ Add Item" to add one.</p>
                                        ) : (
                                             navigation.map((nav, idx) => (
                                                  <div key={idx} className="flex gap-2 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                       <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            <input
                                                                 type="text"
                                                                 placeholder="Item Name (e.g., Home)"
                                                                 value={nav.itemname}
                                                                 onChange={(e) => updateNavigationField(idx, "itemname", e.target.value)}
                                                                 className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                                 required
                                                            />
                                                            <input
                                                                 type="text"
                                                                 placeholder="Item Path (e.g., /)"
                                                                 value={nav.itempath}
                                                                 onChange={(e) => updateNavigationField(idx, "itempath", e.target.value)}
                                                                 className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                                 required
                                                            />
                                                       </div>
                                                       <button
                                                            type="button"
                                                            onClick={() => removeNavigationRow(idx)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors cursor-pointer shrink-0"
                                                       >
                                                            ✕
                                                       </button>
                                                  </div>
                                             ))
                                        )}
                                   </div>
                              </div>

                              {/* Save Button */}
                              <div className="flex justify-end pt-4 border-t border-gray-100">
                                   <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-8 py-3 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 disabled:bg-orange-300 disabled:cursor-not-allowed cursor-pointer"
                                   >
                                        {saving ? "Saving Settings..." : "Save Global Settings"}
                                   </button>
                              </div>
                         </form>
                    </div>
               )}

               {/* Modal Dialog */}
               {showModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                         <form onSubmit={saveColumn} className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col justify-between">
                              
                              <div>
                                   {/* Modal Header */}
                                   <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
                                        <div>
                                             <h2 className="text-lg font-bold text-gray-900">
                                                  {editItem ? "Edit Footer Column" : "Add Footer Column"}
                                             </h2>
                                             <p className="text-xs text-gray-400 mt-0.5">
                                                  Configure a section heading and its redirect URLs
                                             </p>
                                        </div>
                                        <button
                                             type="button"
                                             onClick={() => setShowModal(false)}
                                             className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
                                        >
                                             ✕
                                        </button>
                                   </div>

                                   <div className="px-7 py-6 space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                             <div className="sm:col-span-2">
                                                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Column Heading</label>
                                                  <input
                                                       type="text"
                                                       placeholder="e.g., Company, Popular Courses"
                                                       value={title}
                                                       onChange={(e) => setTitle(e.target.value)}
                                                       className={inputClass}
                                                       required
                                                  />
                                             </div>
                                             <div>
                                                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Ordering Weight</label>
                                                  <input
                                                       type="number"
                                                       value={order}
                                                       onChange={(e) => setOrder(e.target.value)}
                                                       className={inputClass}
                                                       required
                                                  />
                                             </div>
                                        </div>

                                        <div className="border-t border-gray-100 pt-4">
                                             <div className="flex items-center justify-between mb-3">
                                                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Navigation Links</label>
                                                  <button
                                                       type="button"
                                                       onClick={addLinkRow}
                                                       className="text-xs font-semibold text-orange-500 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                                  >
                                                       + Add Link
                                                  </button>
                                             </div>

                                             <div className="space-y-3">
                                                  {links.length === 0 ? (
                                                       <p className="text-xs text-gray-400 text-center py-6">No links configured. Click "+ Add Link" to add one.</p>
                                                  ) : (
                                                       links.map((link, idx) => (
                                                            <div key={idx} className="flex gap-2 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                                 <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                                      <input
                                                                           type="text"
                                                                           placeholder="Link Label (e.g., About Us)"
                                                                           value={link.label}
                                                                           onChange={(e) => updateLinkField(idx, "label", e.target.value)}
                                                                           className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                                           required
                                                                      />
                                                                      <input
                                                                           type="text"
                                                                           placeholder="Redirect Path (e.g., /about-us)"
                                                                           value={link.path}
                                                                           onChange={(e) => updateLinkField(idx, "path", e.target.value)}
                                                                           className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                                           required
                                                                      />
                                                                 </div>
                                                                 <button
                                                                      type="button"
                                                                      onClick={() => removeLinkRow(idx)}
                                                                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors cursor-pointer shrink-0"
                                                                 >
                                                                      ✕
                                                                 </button>
                                                            </div>
                                                       ))
                                                  )}
                                             </div>
                                        </div>
                                   </div>
                              </div>

                              {/* Modal Footer */}
                              <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-2xl">
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
                                        className="px-6 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 disabled:bg-orange-300 disabled:cursor-not-allowed cursor-pointer"
                                   >
                                        {saving ? "Saving..." : "Save Column"}
                                   </button>
                              </div>

                         </form>
                    </div>
               )}
          </div>
     );
}

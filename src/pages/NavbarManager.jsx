import { useEffect, useState } from "react";
import { HiOutlineSave, HiOutlineUpload, HiOutlinePhotograph } from "react-icons/hi";
import Breadcrumb from "../components/BreadCrumb";
import { getAdminToken } from "../utils/auth";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";
const DEFAULT_TOP_BAR = {
     enabled: true,
     phone: "+91 9599272764",
     email: "info@weekendux.in",
     socials: [
          { icon: "SiFacebook", path: "https://www.facebook.com/weekendux/" },
          { icon: "FaInstagram", path: "https://www.instagram.com/weekendux1/" },
          { icon: "FaLinkedinIn", path: "https://www.linkedin.com/in/weekend-ux-7b03212a8/" },
          { icon: "SiYoutube", path: "https://www.youtube.com/" },
          { icon: "FaXTwitter", path: "https://x.com/" }
     ]
};
const LEGACY_SOCIAL_ICON_NAMES = {
     facebook: "SiFacebook",
     instagram: "FaInstagram",
     linkedin: "FaLinkedinIn",
     youtube: "SiYoutube",
     x: "FaXTwitter",
     tiktok: "FaTiktok",
     whatsapp: "FaWhatsapp",
     pinterest: "FaPinterest",
     telegram: "FaTelegram",
     threads: "FaThreads"
};

const getSocialIconPreviewUrl = (iconStr) => {
     if (!iconStr || !iconStr.trim()) return null;
     const raw = iconStr.trim();
     if (/^(https?:|\/)/i.test(raw)) return raw;
     const clean = raw.toLowerCase().replace(/[^a-z0-9:-]/g, "");
     const PRESET_MAP = {
          sifacebook: "simple-icons:facebook",
          fafacebook: "fa6-brands:facebook",
          facebook: "simple-icons:facebook",
          fainstagram: "fa6-brands:instagram",
          instagram: "fa6-brands:instagram",
          falinkedin: "fa6-brands:linkedin",
          falinkedinin: "fa6-brands:linkedin-in",
          linkedin: "fa6-brands:linkedin-in",
          siyoutube: "simple-icons:youtube",
          fayoutube: "fa6-brands:youtube",
          youtube: "simple-icons:youtube",
          faxtwitter: "fa6-brands:x-twitter",
          fatwitter: "fa6-brands:x-twitter",
          ritwitterxline: "ri:twitter-x-line",
          x: "fa6-brands:x-twitter",
          twitter: "fa6-brands:x-twitter",
          fawhatsapp: "fa6-brands:whatsapp",
          whatsapp: "fa6-brands:whatsapp",
          fathreads: "simple-icons:threads",
          threads: "simple-icons:threads"
     };
     const target = PRESET_MAP[clean] || (raw.includes(":") ? raw : (raw.includes("/") ? raw.replace("/", ":") : `fa6-brands:${raw.toLowerCase()}`));
     return `https://api.iconify.design/${encodeURIComponent(target)}.svg?color=%23f97316`;
};

const DEFAULT_MAIN_LINKS = [
     { label: "Home", href: "/" },
     { label: "About Us", href: "/about-us" },
     { label: "Blogs", href: "/blog" },
     { label: "Contact Us", href: "/contact-us" }
];

export default function NavbarManager() {
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [toast, setToast] = useState({ show: false, message: "" });

     // State fields matching Weekend UX's Navbar schema
     const [logoUrl, setLogoUrl] = useState("");
     const [logoAlt, setLogoAlt] = useState("");
     const [logoFile, setLogoFile] = useState(null);
     const [moreTitle, setMoreTitle] = useState("More");
     const [moreDropdownItems, setMoreDropdownItems] = useState([]);
     const [searchPlaceholder, setSearchPlaceholder] = useState("Search courses...");
     const [dropdownName, setDropdownName] = useState("Courses");
     const [loginButtonName, setLoginButtonName] = useState("Sign In");
     const [topBar, setTopBar] = useState(DEFAULT_TOP_BAR);
     const [mainLinks, setMainLinks] = useState(DEFAULT_MAIN_LINKS);

     const displayToast = (message) => {
          setToast({ show: true, message });
          setTimeout(() => setToast({ show: false, message: "" }), 3000);
     };

     const fetchNavbarData = async () => {
          try {
               setLoading(true);
               const res = await fetch(`${API_URL}/navbar`);
               if (res.ok) {
                    const data = await res.json();
                    if (data) {
                         setLogoUrl(data.logo?.image || "");
                         setLogoAlt(data.logo?.alt || "Weekend UX Logo");
                         const moreData = data.moreItems || {};
                         setMoreTitle(moreData.title || "More");
                         setMoreDropdownItems(moreData.dropdown_items || []);
                         setSearchPlaceholder(data.searchPlaceholder || "Search courses...");
                         setDropdownName(data.dropdownName || "Courses");
                         setLoginButtonName(data.loginButtonName || "Sign In");
                         setMainLinks(Array.isArray(data.mainLinks)
                              ? data.mainLinks.filter((link) => link && typeof link === "object").map((link) => ({
                                   label: typeof link.label === "string" ? link.label : "",
                                   href: typeof link.href === "string" ? link.href : ""
                              }))
                              : DEFAULT_MAIN_LINKS);
                         const savedTopBarSocials = Array.isArray(data.topBar?.socials)
                              ? data.topBar.socials.filter((social) => social && typeof social === "object").map((social) => ({
                                   icon: typeof social.icon === "string" && social.icon.trim()
                                        ? social.icon.trim()
                                        : LEGACY_SOCIAL_ICON_NAMES[social.platform] || social.platform || "",
                                   path: typeof social.path === "string" ? social.path : ""
                              }))
                              : DEFAULT_TOP_BAR.socials;
                         setTopBar({
                              ...DEFAULT_TOP_BAR,
                              ...(data.topBar || {}),
                              socials: savedTopBarSocials
                         });
                    }
               }
          } catch (err) {
               console.error("Error fetching navbar data:", err);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchNavbarData();
     }, []);

     const handleAddCategory = () => {
          setMoreDropdownItems([...moreDropdownItems, { title: "", items: [] }]);
     };

     const handleRemoveCategory = (catIndex) => {
          setMoreDropdownItems(moreDropdownItems.filter((_, i) => i !== catIndex));
     };

     const handleUpdateCategoryTitle = (catIndex, value) => {
          const updated = [...moreDropdownItems];
          updated[catIndex].title = value;
          setMoreDropdownItems(updated);
     };

     const handleAddSubItem = (catIndex) => {
          const updated = [...moreDropdownItems];
          updated[catIndex].items = [...(updated[catIndex].items || []), { name: "", link: "" }];
          setMoreDropdownItems(updated);
     };

     const handleRemoveSubItem = (catIndex, itemIndex) => {
          const updated = [...moreDropdownItems];
          updated[catIndex].items = updated[catIndex].items.filter((_, i) => i !== itemIndex);
          setMoreDropdownItems(updated);
     };

     const handleUpdateSubItem = (catIndex, itemIndex, field, value) => {
          const updated = [...moreDropdownItems];
          updated[catIndex].items[itemIndex][field] = value;
          setMoreDropdownItems(updated);
     };

     const handleAddTopBarSocial = () => {
          setTopBar((prev) => ({ ...prev, socials: [...prev.socials, { icon: "FaInstagram", path: "" }] }));
     };

     const handleUpdateTopBarSocial = (index, field, value) => {
          setTopBar((prev) => ({
               ...prev,
               socials: prev.socials.map((social, i) => i === index ? { ...social, [field]: value } : social)
          }));
     };

     const handleRemoveTopBarSocial = (index) => {
          setTopBar((prev) => ({ ...prev, socials: prev.socials.filter((_, i) => i !== index) }));
     };

     const handleAddMainLink = () => {
          setMainLinks((prev) => [...prev, { label: "", href: "" }]);
     };

     const handleUpdateMainLink = (index, field, value) => {
          setMainLinks((prev) => prev.map((link, i) => i === index ? { ...link, [field]: value } : link));
     };

     const handleRemoveMainLink = (index) => {
          setMainLinks((prev) => prev.filter((_, i) => i !== index));
     };

     const handleSave = async (e) => {
          if (e) e.preventDefault();
          try {
               setSaving(true);
               
               const formData = new FormData();
               formData.append("moreItems", JSON.stringify({ title: moreTitle, dropdown_items: moreDropdownItems }));
               formData.append("searchPlaceholder", searchPlaceholder);
               formData.append("dropdownName", dropdownName);
               formData.append("loginButtonName", loginButtonName);
               formData.append("logoAlt", logoAlt);
               formData.append("mainLinks", JSON.stringify(mainLinks.filter((link) => link.label.trim() && link.href.trim())));
               formData.append("topBar", JSON.stringify({
                    ...topBar,
                    socials: topBar.socials.filter((social) => social.icon.trim() && social.path.trim())
               }));

               if (logoFile) {
                    formData.append("logoImage", logoFile);
               }

               const res = await fetch(`${API_URL}/navbar`, {
                    method: "PUT",
                    headers: {
                         "Authorization": `Bearer ${getAdminToken()}`
                    },
                    body: formData
               });

               if (res.ok) {
                    displayToast("Navbar Settings Saved Successfully!");
                    setLogoFile(null);
                    fetchNavbarData();
               } else {
                    const data = await res.json().catch(() => ({}));
                    displayToast(data.error || "Failed to save Navbar settings.");
               }
          } catch (err) {
               console.error("Error saving navbar data:", err);
               displayToast("Server error occurred.");
          } finally {
               setSaving(false);
          }
     };

     const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all duration-200";
     const labelClass = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5";

     return (
          <div className="bg-gray-50/50 min-h-screen pb-12 font-sans">
               <Breadcrumb />

               <div className="max-w-4xl mx-auto px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
                         <div>
                              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Navbar Settings</h1>
                              <p className="text-sm text-gray-500 mt-1">
                                   Configure site navigation header logo branding, search placeholder, and action buttons.
                              </p>
                         </div>

                         <button
                              onClick={handleSave}
                              disabled={saving || loading}
                              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer disabled:cursor-not-allowed shrink-0"
                         >
                              <HiOutlineSave className="w-4 h-4" />
                              <span>{saving ? "Saving..." : "Save Settings"}</span>
                         </button>
                    </div>

                    {loading ? (
                         <div className="h-64 rounded-2xl border border-gray-200 bg-white flex flex-col items-center justify-center text-gray-400 shadow-sm">
                              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                              <span className="text-sm font-medium">Loading Navbar Data...</span>
                         </div>
                    ) : (
                         <div className="space-y-6">
                              {/* Branding Card */}
                              <div className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200/50 space-y-5">
                                   <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Header Branding</h2>
                                   
                                   <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                             <label className={labelClass}>Logo Image</label>
                                             <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Recommended: 300 x 100 px</span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                                             {/* Logo Preview */}
                                             <div className="h-16 w-36 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center p-2 overflow-hidden shrink-0">
                                                  {logoFile ? (
                                                       <img
                                                            src={URL.createObjectURL(logoFile)}
                                                            className="max-h-full max-w-full object-contain"
                                                            alt="Logo preview"
                                                            onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                                                       />
                                                  ) : logoUrl ? (
                                                       <img
                                                            src={logoUrl}
                                                            className="max-h-full max-w-full object-contain"
                                                            alt="Current Logo"
                                                       />
                                                  ) : (
                                                       <div className="flex flex-col items-center gap-1 text-gray-400">
                                                            <HiOutlinePhotograph className="w-5 h-5" />
                                                            <span className="text-[10px] font-medium font-sans">No Logo Image</span>
                                                       </div>
                                                  )}
                                             </div>
                                             
                                             <div className="flex-1 w-full relative">
                                                  <div className="border border-dashed border-gray-300 hover:border-orange-500 rounded-xl px-4 py-3 bg-gray-50/50 hover:bg-orange-50/10 transition flex items-center justify-center gap-2 cursor-pointer text-center relative group min-h-16">
                                                       <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => setLogoFile(e.target.files[0])}
                                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                                       />
                                                       <div className="flex items-center gap-2 text-gray-500 group-hover:text-orange-500 transition">
                                                            <HiOutlineUpload className="w-4 h-4" />
                                                            <span className="text-xs font-semibold font-sans">
                                                                 {logoFile ? logoFile.name : "Choose logo image..."}
                                                            </span>
                                                       </div>
                                                  </div>
                                                  <p className="text-[10px] text-gray-400 mt-1 leading-normal font-sans">
                                                       Upload your brand's header logo. Recommended size: 300 x 100 px (aspect ratio 3:1, PNG with transparent background is preferred).
                                                  </p>
                                             </div>
                                        </div>
                                   </div>

                                   <div className="space-y-1.5">
                                        <label className={labelClass}>Logo Alt Text</label>
                                        <input
                                             type="text"
                                             value={logoAlt}
                                             onChange={(e) => setLogoAlt(e.target.value)}
                                             className={inputClass}
                                             placeholder="e.g. Weekend UX Logo"
                                             required
                                        />
                                   </div>
                              </div>

                              {/* Top Bar Settings Card */}
                              <div className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200/50 space-y-5">
                                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                                        <div>
                                             <h2 className="text-base font-bold text-gray-900">Top Bar</h2>
                                             <p className="text-xs text-gray-400 mt-0.5">Configure the contact details and social links above the main navigation.</p>
                                        </div>
                                        <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer shrink-0">
                                             <input
                                                  type="checkbox"
                                                  checked={topBar.enabled}
                                                  onChange={(e) => setTopBar((prev) => ({ ...prev, enabled: e.target.checked }))}
                                                  className="accent-orange-500 w-4 h-4"
                                             />
                                             Show Top Bar
                                        </label>
                                   </div>

                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Phone Number</label>
                                             <input
                                                  type="tel"
                                                  value={topBar.phone}
                                                  onChange={(e) => setTopBar((prev) => ({ ...prev, phone: e.target.value }))}
                                                  className={inputClass}
                                                  placeholder="e.g. +91 9599272764"
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Email Address</label>
                                             <input
                                                  type="email"
                                                  value={topBar.email}
                                                  onChange={(e) => setTopBar((prev) => ({ ...prev, email: e.target.value }))}
                                                  className={inputClass}
                                                  placeholder="e.g. info@example.com"
                                             />
                                        </div>
                                   </div>

                                   <div className="space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                             <div>
                                                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Social Links</h3>
                                                  <p className="text-xs text-gray-400 mt-0.5">Top bar me display hone wale social icons aur links.</p>
                                             </div>
                                             <button
                                                  type="button"
                                                  onClick={handleAddTopBarSocial}
                                                  className="inline-flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-orange-200 transition-all cursor-pointer shrink-0"
                                             >
                                                  + Add Social Link
                                             </button>
                                        </div>

                                        {/* Helpful Admin Icon Guide */}
                                        <div className="bg-orange-50/70 border border-orange-200/80 rounded-xl p-3.5 text-xs text-gray-700 space-y-2">
                                             <div className="font-bold flex items-center gap-1.5 text-orange-950">
                                                  <span>💡 Icon Kaha Se Le Aur Kaise Dale (Icon Guide for Admin):</span>
                                             </div>
                                             <div className="space-y-1.5 text-gray-600 leading-relaxed">
                                                  <p>
                                                       <span className="font-semibold text-gray-900">1. Koi bhi icon name (200,000+ icons):</span>{" "}
                                                       Aap{" "}
                                                       <a
                                                            href="https://icon-sets.iconify.design"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-orange-600 underline font-semibold hover:text-orange-700"
                                                       >
                                                            https://icon-sets.iconify.design
                                                       </a>{" "}
                                                       par jaayein, koi bhi icon search karein (jaise WhatsApp, Instagram, Threads, Telegram, etc.) aur uska name copy karke paste karein (e.g. <code className="bg-orange-100/80 text-orange-800 px-1 py-0.5 rounded font-mono text-[11px]">mdi:whatsapp</code>, <code className="bg-orange-100/80 text-orange-800 px-1 py-0.5 rounded font-mono text-[11px]">fa6-brands:instagram</code>, <code className="bg-orange-100/80 text-orange-800 px-1 py-0.5 rounded font-mono text-[11px]">simple-icons:threads</code>).
                                                  </p>
                                                  <p>
                                                       <span className="font-semibold text-gray-900">2. Custom Image / SVG URL:</span>{" "}
                                                       Agar aapke paas koi custom SVG ya Cloudinary image URL hai, to direct link (<code className="bg-orange-100/80 text-orange-800 px-1 py-0.5 rounded font-mono text-[11px]">https://...</code>) bhi daal sakte hain.
                                                  </p>
                                                  <p className="text-[11px] text-gray-500">
                                                       Common names bhi supported hain: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">instagram</code>, <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">facebook</code>, <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">whatsapp</code>, <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">youtube</code>, <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">linkedin</code>, <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">x</code>, <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">threads</code>.
                                                  </p>
                                             </div>
                                        </div>

                                        {topBar.socials.length === 0 ? (
                                             <p className="text-sm text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-xl">No top bar social links configured.</p>
                                        ) : (
                                             <div className="space-y-2">
                                                  {topBar.socials.map((social, index) => (
                                                       <div key={index} className="flex flex-col sm:flex-row gap-2 sm:items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                            {/* Live Icon Preview */}
                                                            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 p-1.5 overflow-hidden shadow-xs" title="Live Icon Preview">
                                                                 {getSocialIconPreviewUrl(social.icon) ? (
                                                                      <img
                                                                           src={getSocialIconPreviewUrl(social.icon)}
                                                                           alt="Icon preview"
                                                                           className="w-5 h-5 object-contain"
                                                                           onError={(e) => { e.currentTarget.style.display = "none"; }}
                                                                      />
                                                                 ) : (
                                                                      <span className="text-[10px] text-gray-400 font-medium">Icon</span>
                                                                 )}
                                                            </div>
                                                            <input
                                                                 type="text"
                                                                 value={social.icon}
                                                                 onChange={(e) => handleUpdateTopBarSocial(index, "icon", e.target.value)}
                                                                 className={`${inputClass} min-w-0 sm:max-w-64 sm:flex-none`}
                                                                 placeholder="Icon name (e.g. mdi:whatsapp)"
                                                                 aria-label={`Social icon name ${index + 1}`}
                                                            />
                                                            <input
                                                                 type="url"
                                                                 value={social.path}
                                                                 onChange={(e) => handleUpdateTopBarSocial(index, "path", e.target.value)}
                                                                 className={`${inputClass} min-w-0 flex-1`}
                                                                 placeholder="https://..."
                                                                 aria-label={`${social.icon || `Social link ${index + 1}`} URL`}
                                                            />
                                                            <button
                                                                 type="button"
                                                                 onClick={() => handleRemoveTopBarSocial(index)}
                                                                 aria-label={`Remove social link ${index + 1}`}
                                                                 className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors cursor-pointer shrink-0 font-bold text-lg"
                                                            >
                                                                 ×
                                                            </button>
                                                       </div>
                                                  ))}
                                             </div>
                                        )}
                                   </div>
                              </div>

                              {/* Navigation Controls Card */}
                              <div className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200/50 space-y-4">
                                   <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Navigation Controls</h2>
                                   
                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Search Box Placeholder</label>
                                             <input
                                                  type="text"
                                                  value={searchPlaceholder}
                                                  onChange={(e) => setSearchPlaceholder(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. Search courses..."
                                                  required
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Dropdown Name</label>
                                             <input
                                                  type="text"
                                                  value={dropdownName}
                                                  onChange={(e) => setDropdownName(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. Courses"
                                                  required
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Sign In Button Text</label>
                                             <input
                                                  type="text"
                                                  value={loginButtonName}
                                                  onChange={(e) => setLoginButtonName(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. Sign In"
                                                  required
                                             />
                                        </div>
                                   </div>
                              </div>

                              {/* Main Navigation Links Card */}
                              <div className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200/50 space-y-4">
                                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                                        <div>
                                             <h2 className="text-base font-bold text-gray-900">Main Navigation Links</h2>
                                             <p className="text-xs text-gray-400 mt-0.5">Manage links such as Home, About Us, Blogs, and Contact Us.</p>
                                        </div>
                                        <button
                                             type="button"
                                             onClick={handleAddMainLink}
                                             className="inline-flex items-center justify-center bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-orange-200 transition-all cursor-pointer shrink-0"
                                        >
                                             + Add Link
                                        </button>
                                   </div>
                                   {mainLinks.length === 0 ? (
                                        <p className="text-sm text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-xl">No main navigation links configured.</p>
                                   ) : (
                                        <div className="space-y-2">
                                             {mainLinks.map((link, index) => (
                                                  <div key={index} className="flex flex-col sm:flex-row gap-2 sm:items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                       <input
                                                            type="text"
                                                            value={link.label}
                                                            onChange={(e) => handleUpdateMainLink(index, "label", e.target.value)}
                                                            className={`${inputClass} min-w-0 sm:max-w-56 sm:flex-none`}
                                                            placeholder="Link label (e.g. About Us)"
                                                            aria-label={`Navigation link ${index + 1} label`}
                                                       />
                                                       <input
                                                            type="text"
                                                            value={link.href}
                                                            onChange={(e) => handleUpdateMainLink(index, "href", e.target.value)}
                                                            className={`${inputClass} min-w-0 flex-1`}
                                                            placeholder="Path (e.g. /about-us)"
                                                            aria-label={`${link.label || `Navigation link ${index + 1}`} path`}
                                                       />
                                                       <button
                                                            type="button"
                                                            onClick={() => handleRemoveMainLink(index)}
                                                            aria-label={`Remove ${link.label || `navigation link ${index + 1}`}`}
                                                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors cursor-pointer shrink-0"
                                                       >
                                                            ×
                                                       </button>
                                                  </div>
                                             ))}
                                        </div>
                                   )}
                              </div>

                              {/* More Menu Dropdown Items Card */}
                              <div className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200/50 space-y-6">
                                   <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-3">
                                        <div>
                                             <h2 className="text-base font-bold text-gray-900">More Dropdown Mega-Menu</h2>
                                             <p className="text-xs text-gray-400 mt-0.5">Configure up to 4 columns. Use a site path for internal pages or a full URL to open an external page in a new tab.</p>
                                        </div>
                                        <button
                                             type="button"
                                             onClick={handleAddCategory}
                                             disabled={moreDropdownItems.length >= 4}
                                             className="inline-flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 disabled:bg-gray-100 disabled:text-gray-400 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-orange-200 disabled:border-gray-200 transition-all duration-200 cursor-pointer shrink-0 disabled:cursor-not-allowed"
                                        >
                                             + Add Column/Category
                                        </button>
                                   </div>
                                   
                                   {/* Dropdown Label Input */}
                                   <div className="space-y-1.5 max-w-xs">
                                        <label className={labelClass}>Dropdown Menu Label</label>
                                        <input
                                             type="text"
                                             value={moreTitle}
                                             onChange={(e) => setMoreTitle(e.target.value)}
                                             className={inputClass}
                                             placeholder="e.g. More"
                                             required
                                        />
                                   </div>

                                   <div className="space-y-6">
                                        {moreDropdownItems.length === 0 ? (
                                             <p className="text-sm text-gray-400 text-center py-6 border border-dashed border-gray-200 rounded-xl">No columns added yet. Click "+ Add Column/Category" to start creating columns.</p>
                                        ) : (
                                             moreDropdownItems.map((cat, catIdx) => (
                                                  <div key={catIdx} className="bg-gray-50/50 p-5 rounded-2xl border border-gray-200 space-y-4">
                                                       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200/60 pb-3">
                                                            <div className="flex-1 w-full max-w-md">
                                                                 <label className="text-[10px] font-bold text-orange-650 uppercase tracking-wider block mb-1">Column {catIdx + 1} Title</label>
                                                                 <input
                                                                      type="text"
                                                                      value={cat.title}
                                                                      onChange={(e) => handleUpdateCategoryTitle(catIdx, e.target.value)}
                                                                      className={inputClass}
                                                                      placeholder="e.g. AI Tools, Learning Paths..."
                                                                      required
                                                                 />
                                                            </div>
                                                            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-4">
                                                                 <button
                                                                      type="button"
                                                                      onClick={() => handleAddSubItem(catIdx)}
                                                                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 bg-white hover:bg-orange-50/30 text-orange-600 text-xs font-semibold px-3 py-2 rounded-lg border border-orange-200 transition cursor-pointer"
                                                                 >
                                                                      + Add Link
                                                                 </button>
                                                                 <button
                                                                      type="button"
                                                                      onClick={() => handleRemoveCategory(catIdx)}
                                                                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg border border-red-100 transition cursor-pointer"
                                                                 >
                                                                      Delete Column
                                                                 </button>
                                                            </div>
                                                       </div>

                                                       <div className="space-y-2.5">
                                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sub-Links</label>
                                                            {(!cat.items || cat.items.length === 0) ? (
                                                                 <p className="text-xs text-gray-400 italic py-2">No links added to this column yet. Click "+ Add Link" to create one.</p>
                                                            ) : (
                                                                 <div className="grid grid-cols-1 gap-3">
                                                                      {cat.items.map((item, itemIdx) => (
                                                                           <div key={itemIdx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                                                                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                                     <div>
                                                                                          <input
                                                                                               type="text"
                                                                                               value={item.name}
                                                                                               onChange={(e) => handleUpdateSubItem(catIdx, itemIdx, "name", e.target.value)}
                                                                                               className={inputClass}
                                                                                               placeholder="Link Name (e.g. ChatGPT)"
                                                                                               required
                                                                                          />
                                                                                     </div>
                                                                                     <div>
                                                                                          <input
                                                                                               type="text"
                                                                                               value={item.link}
                                                                                               onChange={(e) => handleUpdateSubItem(catIdx, itemIdx, "link", e.target.value)}
                                                                                               className={inputClass}
                                                                                               placeholder="Path (/coming-soon) or full URL (https://...)"
                                                                                               required
                                                                                          />
                                                                                     </div>
                                                                                </div>
                                                                                <button
                                                                                     type="button"
                                                                                     onClick={() => handleRemoveSubItem(catIdx, itemIdx)}
                                                                                     className="p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition border border-gray-200 hover:border-red-100 cursor-pointer"
                                                                                     title="Remove Link"
                                                                                >
                                                                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                                     </svg>
                                                                                </button>
                                                                           </div>
                                                                      ))}
                                                                 </div>
                                                            )}
                                                       </div>
                                                  </div>
                                             ))
                                        )}
                                   </div>
                              </div>
                         </div>
                    )}

                    {/* Toast Notification */}
                    <div className={`fixed bottom-6 right-6 flex items-center gap-2.5 bg-gray-900 border border-gray-800 text-white px-5 py-3.5 rounded-xl shadow-2xl transform transition-all duration-300 z-50 ${toast.show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}>
                         <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                         <span className="font-semibold text-xs">{toast.message}</span>
                    </div>
               </div>
          </div>
     );
}

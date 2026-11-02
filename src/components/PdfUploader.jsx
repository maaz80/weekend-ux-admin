import { useState, useEffect, useRef } from "react";
import {
     HiOutlineDocumentText,
     HiOutlineCloudUpload,
     HiOutlineTrash,
     HiOutlineRefresh,
     HiOutlineExternalLink,
     HiOutlineDownload,
     HiOutlineClipboardCopy,
     HiOutlineCheckCircle,
     HiOutlineExclamationCircle
} from "react-icons/hi";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

const formatBytes = (bytes) => {
     if (!bytes || bytes === 0) return "0 B";
     const k = 1024;
     const sizes = ["B", "KB", "MB", "GB"];
     const i = Math.floor(Math.log(bytes) / Math.log(k));
     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (dateStr) => {
     if (!dateStr) return "Just now";
     try {
          return new Date(dateStr).toLocaleDateString("en-US", {
               month: "short",
               day: "numeric",
               year: "numeric",
               hour: "2-digit",
               minute: "2-digit"
          });
     } catch {
          return dateStr;
     }
};

const getFullPdfUrl = (url) => {
     if (!url) return "";
     if (url.startsWith("http://") || url.startsWith("https://")) return url;
     const base = API_URL.replace(/\/api$/, "");
     return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function PdfUploader({ onUpdate }) {
     const [brochure, setBrochure] = useState(null);
     const [loading, setLoading] = useState(true);
     const [uploading, setUploading] = useState(false);
     const [deleting, setDeleting] = useState(false);
     const [isDragActive, setIsDragActive] = useState(false);
     const [statusMsg, setStatusMsg] = useState(null);
     const [copied, setCopied] = useState(false);
     const fileInputRef = useRef(null);

     const showNotification = (text, type = "success") => {
          setStatusMsg({ text, type });
          setTimeout(() => setStatusMsg(null), 4000);
     };

     const fetchBrochure = async () => {
          try {
               setLoading(true);
               const res = await fetch(`${API_URL}/brochure`);
               const data = await res.json();
               if (data && data.success && data.brochure) {
                    setBrochure(data.brochure);
               } else {
                    setBrochure(null);
               }
          } catch (err) {
               console.error("Failed to load brochure:", err);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchBrochure();
     }, []);

     const handleFileUpload = async (file) => {
          if (!file) return;

          const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
          if (!isPdf) {
               showNotification("Please select a valid PDF file.", "error");
               return;
          }

          if (file.size > 50 * 1024 * 1024) {
               showNotification("File size exceeds 50MB limit.", "error");
               return;
          }

          setUploading(true);
          try {
               const formData = new FormData();
               formData.append("pdf", file);
               formData.append("fileName", file.name);
               formData.append("fileSize", file.size);

               const res = await fetch(`${API_URL}/admin/brochure`, {
                    method: "POST",
                    body: formData
               });

               const data = await res.json();
               if (res.ok && data.success) {
                    setBrochure(data.brochure);
                    showNotification("Brochure PDF uploaded successfully!", "success");
                    if (onUpdate) onUpdate(data.brochure);
               } else {
                    throw new Error(data.error || "Failed to upload PDF");
               }
          } catch (err) {
               console.error("Upload error:", err);
               showNotification(err.message || "Upload failed. Please check connection.", "error");
          } finally {
               setUploading(false);
               if (fileInputRef.current) fileInputRef.current.value = "";
          }
     };

     const handleDelete = async () => {
          if (!window.confirm("Are you sure you want to remove the current brochure PDF? User form submissions will not auto-download a brochure until a new one is uploaded.")) {
               return;
          }

          setDeleting(true);
          try {
               const res = await fetch(`${API_URL}/admin/brochure`, {
                    method: "DELETE"
               });
               const data = await res.json();
               if (res.ok && data.success) {
                    setBrochure(null);
                    showNotification("Brochure PDF removed successfully.", "success");
                    if (onUpdate) onUpdate(null);
               } else {
                    throw new Error(data.error || "Failed to delete brochure");
               }
          } catch (err) {
               console.error("Delete error:", err);
               showNotification(err.message || "Failed to delete brochure.", "error");
          } finally {
               setDeleting(false);
          }
     };

     const handleCopyUrl = () => {
          if (!brochure?.pdfUrl) return;
          navigator.clipboard.writeText(brochure.pdfUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
     };

     const handleDragOver = (e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragActive(true);
     };

     const handleDragLeave = (e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragActive(false);
     };

     const handleDrop = (e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragActive(false);

          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
               handleFileUpload(e.dataTransfer.files[0]);
          }
     };

     return (
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
               {/* Hidden file input */}
               <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf,.pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files?.[0])}
               />

               {/* Header Section */}
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <div className="flex items-start gap-3.5">
                         <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
                              <HiOutlineDocumentText className="w-6 h-6" />
                         </div>
                         <div>
                              <div className="flex items-center gap-2">
                                   <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                                        Lead Brochure & Curriculum PDF
                                   </h2>
                                   <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-600 border border-orange-200/60">
                                        Auto-Download Trigger
                                   </span>
                              </div>
                              <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                                   This PDF automatically downloads &amp; opens in a new tab when a user submits any website form (10s popup, course details, contact page).
                              </p>
                         </div>
                    </div>

                    {/* Live delivery indicator */}
                    {brochure && (
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-xs font-semibold shrink-0">
                              <span className="relative flex h-2.5 w-2.5">
                                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                   <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                              </span>
                              <span>Auto-Download Active</span>
                         </div>
                    )}
               </div>

               {/* Toast Banner */}
               {statusMsg && (
                    <div
                         className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                              statusMsg.type === "error"
                                   ? "bg-red-50 text-red-700 border border-red-200"
                                   : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                         }`}
                    >
                         {statusMsg.type === "error" ? (
                              <HiOutlineExclamationCircle className="w-4 h-4 shrink-0 text-red-500" />
                         ) : (
                              <HiOutlineCheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                         )}
                         <span>{statusMsg.text}</span>
                    </div>
               )}

               {/* Main Content Area */}
               {loading ? (
                    <div className="h-40 rounded-2xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 animate-pulse text-gray-400 text-xs">
                         <div className="w-8 h-8 rounded-full border-2 border-orange-400 border-t-transparent animate-spin"></div>
                         <span>Loading brochure status...</span>
                    </div>
               ) : brochure ? (
                    /* Active Brochure Display Card */
                    <div className="bg-gradient-to-br from-neutral-50 to-orange-50/20 border border-gray-200/80 rounded-2xl p-5 sm:p-6 transition-all hover:border-orange-200">
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                              {/* Left Info */}
                              <div className="flex items-center gap-4 min-w-0">
                                   <div className="w-14 h-16 bg-white border border-red-100 rounded-xl shadow-sm flex flex-col items-center justify-center shrink-0">
                                        <div className="w-7 h-7 text-red-500 font-black text-xs flex items-center justify-center border-b border-red-100 pb-1">
                                             PDF
                                        </div>
                                        <HiOutlineDocumentText className="w-5 h-5 text-red-400 mt-0.5" />
                                   </div>

                                   <div className="min-w-0 space-y-1">
                                        <div className="flex items-center gap-2">
                                             <h3 className="text-sm font-bold text-gray-900 truncate max-w-xs sm:max-w-md">
                                                  {brochure.fileName || "Weekend-UX-Brochure.pdf"}
                                             </h3>
                                             <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600">
                                                  {formatBytes(brochure.fileSize)}
                                             </span>
                                        </div>

                                        <p className="text-gray-400 text-xs">
                                             Last updated: {formatDate(brochure.updatedAt || brochure.createdAt)}
                                        </p>

                                        <div className="text-[11px] text-gray-500 font-mono truncate max-w-sm sm:max-w-lg mt-1">
                                             {brochure.pdfUrl}
                                        </div>
                                   </div>
                              </div>

                              {/* Right Actions */}
                              <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                                   {/* View / Open PDF in new tab */}
                                   <a
                                        href={getFullPdfUrl(brochure.pdfUrl)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-orange-600 hover:border-orange-200 transition-all shadow-2xs"
                                        title="Open PDF in new tab"
                                   >
                                        <HiOutlineExternalLink className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
                                        <span>Preview</span>
                                   </a>

                                   {/* Direct Download Test */}
                                   <a
                                        href={getFullPdfUrl(brochure.pdfUrl)}
                                        download={brochure.fileName || "Weekend-UX-Brochure.pdf"}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-orange-600 hover:border-orange-200 transition-all shadow-2xs"
                                        title="Download PDF to computer"
                                   >
                                        <HiOutlineDownload className="w-4 h-4 text-gray-400" />
                                        <span>Download</span>
                                   </a>

                                   {/* Copy URL */}
                                   <button
                                        type="button"
                                        onClick={handleCopyUrl}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-orange-600 transition-all shadow-2xs cursor-pointer"
                                        title="Copy PDF URL to clipboard"
                                   >
                                        <HiOutlineClipboardCopy className="w-4 h-4 text-gray-400" />
                                        <span>{copied ? "Copied!" : "Copy URL"}</span>
                                   </button>

                                   {/* Replace PDF Button */}
                                   <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100/80 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                                        title="Upload a new PDF to replace this one"
                                   >
                                        <HiOutlineRefresh className={`w-4 h-4 ${uploading ? "animate-spin" : ""}`} />
                                        <span>{uploading ? "Uploading..." : "Replace PDF"}</span>
                                   </button>

                                   {/* Delete PDF Button */}
                                   <button
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100/80 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                                        title="Delete this brochure"
                                   >
                                        <HiOutlineTrash className="w-4 h-4" />
                                        <span>{deleting ? "Removing..." : "Remove"}</span>
                                   </button>
                              </div>
                         </div>
                    </div>
               ) : (
                    /* Dropzone / Upload Area (When no PDF uploaded) */
                    <div
                         onDragOver={handleDragOver}
                         onDragLeave={handleDragLeave}
                         onDrop={handleDrop}
                         onClick={() => !uploading && fileInputRef.current?.click()}
                         className={`relative group rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3.5 ${
                              isDragActive
                                   ? "border-orange-500 bg-orange-50/50 scale-[1.01]"
                                   : "border-gray-200 bg-gray-50/50 hover:bg-orange-50/20 hover:border-orange-300"
                         }`}
                    >
                         <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                              {uploading ? (
                                   <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent animate-spin rounded-full"></div>
                              ) : (
                                   <HiOutlineCloudUpload className="w-7 h-7 text-orange-500" />
                              )}
                         </div>

                         <div className="space-y-1">
                              <p className="text-sm font-bold text-gray-800">
                                   {uploading ? (
                                        "Uploading brochure PDF to secure cloud storage..."
                                   ) : (
                                        <span>
                                             <span className="text-orange-600 underline">Click to upload</span> or drag and drop brochure PDF here
                                        </span>
                                   )}
                              </p>
                              <p className="text-xs text-gray-400">
                                   Standard PDF files up to 50MB. Max 1 active brochure for all lead forms.
                              </p>
                         </div>
                    </div>
               )}
          </div>
     );
}

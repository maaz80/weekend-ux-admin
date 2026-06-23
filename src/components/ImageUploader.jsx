import { useRef, useState, useEffect } from "react";
import { HiOutlineCloudUpload, HiOutlineTrash, HiOutlinePhotograph, HiOutlineRefresh } from "react-icons/hi";

export default function ImageUploader({ setImage, initialImage }) {
     const inputRef = useRef();
     const [preview, setPreview] = useState(null);
     const [isDragActive, setIsDragActive] = useState(false);

     useEffect(() => {
          if (initialImage) {
               setPreview(initialImage);
          } else {
               setPreview(null);
          }
     }, [initialImage]);

     const handleFile = (selectedFile) => {
          if (!selectedFile) return;
          setPreview(URL.createObjectURL(selectedFile));
          setImage(selectedFile);
     };

     const handleDrag = (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.type === "dragenter" || e.type === "dragover") {
               setIsDragActive(true);
          } else if (e.type === "dragleave") {
               setIsDragActive(false);
          }
     };

     const handleDrop = (e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragActive(false);

          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
               handleFile(e.dataTransfer.files[0]);
          }
     };

     const handleRemove = (e) => {
          e.stopPropagation(); // Prevent triggering file input click
          setPreview(null);
          setImage(null);
          if (inputRef.current) {
               inputRef.current.value = "";
          }
     };

     const triggerBrowse = (e) => {
          e.stopPropagation();
          inputRef.current.click();
     };

     return (
          <div className="w-full">
               <input
                    ref={inputRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleFile(e.target.files[0])}
               />

               {preview ? (
                    <div className="relative group overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm aspect-video max-h-64 flex items-center justify-center transition-all duration-300 hover:shadow-md">
                         <img
                              src={preview}
                              className="max-h-full max-w-full object-contain rounded-xl"
                              alt="Upload preview"
                         />

                         {/* Premium Glassmorphic Hover Overlay */}
                         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                              <button
                                   type="button"
                                   onClick={triggerBrowse}
                                   className="flex items-center gap-2 bg-white/90 hover:bg-white text-gray-900 font-semibold px-4 py-2 rounded-xl shadow-sm text-xs transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                              >
                                   <HiOutlineRefresh className="w-4 h-4 text-orange-500" />
                                   <span>Replace</span>
                              </button>
                              <button
                                   type="button"
                                   onClick={handleRemove}
                                   className="flex items-center gap-2 bg-red-500/90 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-xl shadow-sm text-xs transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                              >
                                   <HiOutlineTrash className="w-4 h-4" />
                                   <span>Remove</span>
                              </button>
                         </div>

                         {/* Badges */}
                         <div className="absolute top-3 left-3 bg-black/65 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5 select-none border border-white/10">
                              <HiOutlinePhotograph className="w-3.5 h-3.5 text-orange-400" />
                              <span>Preview</span>
                         </div>
                    </div>
               ) : (
                    <div
                         onDragEnter={handleDrag}
                         onDragOver={handleDrag}
                         onDragLeave={handleDrag}
                         onDrop={handleDrop}
                         onClick={triggerBrowse}
                         className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 select-none
                              \${isDragActive
                                   ? "border-orange-500 bg-orange-50/50 scale-[0.99] shadow-inner"
                                   : "border-gray-200 bg-gray-50/30 hover:border-orange-400 hover:bg-white hover:shadow-sm"
                              }`}
                    >
                         {/* Circle Container for Upload Icon */}
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 mb-4
                              \${isDragActive
                                   ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-100"
                                   : "bg-white border-gray-200 text-gray-400 hover:text-orange-500"
                              }`}
                         >
                              <HiOutlineCloudUpload className="w-7 h-7" />
                         </div>

                         <div className="space-y-1.5">
                              <p className="text-sm text-gray-750 font-semibold">
                                   Drag & drop image here, or{" "}
                                   <span className="text-orange-500 hover:text-orange-600 font-bold underline transition-colors">
                                        browse
                                   </span>
                              </p>
                              <p className="text-[11px] text-gray-400 font-medium">
                                   Supports PNG, JPG, JPEG, WEBP or GIF
                              </p>
                         </div>
                    </div>
               )}
          </div>
     );
}
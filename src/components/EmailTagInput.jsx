import { useState } from "react";
import { HiOutlineX, HiOutlinePlus } from "react-icons/hi";

const COLOR_MAP = {
     purple: {
          badge: "bg-purple-100/80 text-purple-800 border-purple-200",
          dot: "bg-purple-500",
          count: "bg-purple-100 text-purple-700"
     },
     teal: {
          badge: "bg-teal-100/80 text-teal-800 border-teal-200",
          dot: "bg-teal-500",
          count: "bg-teal-100 text-teal-700"
     },
     blue: {
          badge: "bg-blue-100/80 text-blue-800 border-blue-200",
          dot: "bg-blue-500",
          count: "bg-blue-100 text-blue-700"
     },
     amber: {
          badge: "bg-amber-100/80 text-amber-800 border-amber-200",
          dot: "bg-amber-500",
          count: "bg-amber-100 text-amber-700"
     }
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailTagInput({
     label,
     emails = [],
     onChange,
     placeholder = "Enter email and press Enter...",
     color = "blue",
     badgeRole = "Email",
     helperText = "Press Enter, comma, or paste a list of emails"
}) {
     const [inputVal, setInputVal] = useState("");
     const theme = COLOR_MAP[color] || COLOR_MAP.blue;

     const addEmails = (rawText) => {
          if (!rawText || !rawText.trim()) return;

          const candidates = rawText
               .split(/[\s,;]+/)
               .map(e => e.trim().toLowerCase())
               .filter(Boolean);

          const validEmails = candidates.filter(e => EMAIL_REGEX.test(e));
          if (validEmails.length > 0) {
               const combined = Array.from(new Set([...emails, ...validEmails]));
               onChange(combined);
          }
          setInputVal("");
     };

     const handleKeyDown = (e) => {
          if (e.key === "Enter" || e.key === ",") {
               e.preventDefault();
               addEmails(inputVal);
          } else if (e.key === "Backspace" && !inputVal && emails.length > 0) {
               onChange(emails.slice(0, -1));
          }
     };

     const handlePaste = (e) => {
          e.preventDefault();
          const pasteText = e.clipboardData.getData("text");
          addEmails(pasteText);
     };

     const handleBlur = () => {
          if (inputVal.trim()) {
               addEmails(inputVal);
          }
     };

     const removeEmail = (emailToRemove) => {
          onChange(emails.filter(e => e !== emailToRemove));
     };

     return (
          <div className="space-y-1.5">
               <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                         {label}
                    </label>
                    {emails.length > 0 && (
                         <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${theme.count}`}>
                              {emails.length} {emails.length === 1 ? badgeRole : `${badgeRole}s`} added
                         </span>
                    )}
               </div>

               <div
                    onClick={(e) => {
                         const input = e.currentTarget.querySelector("input");
                         if (input) input.focus();
                    }}
                    className="min-h-11 w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus-within:border-official focus-within:bg-white focus-within:ring-2 focus-within:ring-official/20 transition flex flex-wrap items-center gap-1.5 cursor-text"
               >
                    {emails.map((email) => (
                         <span
                              key={email}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${theme.badge} transition shadow-xs`}
                         >
                              <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
                              <span>{email}</span>
                              <button
                                   type="button"
                                   onClick={(ev) => {
                                        ev.stopPropagation();
                                        removeEmail(email);
                                   }}
                                   title="Remove email"
                                   className="hover:opacity-70 text-sm font-bold ml-0.5 cursor-pointer leading-none"
                              >
                                   ×
                              </button>
                         </span>
                    ))}

                    <input
                         type="text"
                         value={inputVal}
                         onChange={(e) => setInputVal(e.target.value)}
                         onKeyDown={handleKeyDown}
                         onPaste={handlePaste}
                         onBlur={handleBlur}
                         placeholder={emails.length === 0 ? placeholder : "Add another..."}
                         className="flex-1 min-w-[160px] bg-transparent outline-none border-none text-sm text-gray-900 placeholder:text-gray-400 py-1 px-1"
                    />
               </div>

               {helperText && (
                    <p className="text-[11px] text-gray-400">
                         {helperText}
                    </p>
               )}
          </div>
     );
}

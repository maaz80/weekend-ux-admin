import { useCallback, useEffect, useMemo, useState } from "react";
import { HiOutlineSearch, HiOutlineUserGroup, HiOutlineCheckCircle, HiOutlineRefresh } from "react-icons/hi";
import { getAdminToken } from "../utils/auth";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

const profileFields = [
     ["Gender", "gender"],
     ["Date of birth", "dateOfBirth"],
     ["Mobile number", "mobileNumber"],
     ["Country / region", "country"],
     ["Street address", "streetAddress"],
     ["City", "city"],
     ["Postal code", "postalCode"],
     ["Citizenship", "citizenship"],
     ["Work experience", "workExperience"],
     ["LinkedIn profile", "linkedinProfile"],
     ["Highest degree", "highestDegree"],
     ["Degree institution", "degreeInstitution"],
     ["Graduation month / year", "graduationMonthYear"],
];

const formatDate = (date) => {
     if (!date) return "—";
     const parsedDate = new Date(date);
     return Number.isNaN(parsedDate.getTime()) ? "—" : parsedDate.toLocaleDateString();
};

export default function UserInformation() {
     const [profiles, setProfiles] = useState([]);
     const [newCount, setNewCount] = useState(0);
     const [search, setSearch] = useState("");
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState("");
     const [actionUserId, setActionUserId] = useState("");

     const fetchProfiles = useCallback(async () => {
          setLoading(true);
          setError("");
          try {
               const response = await fetch(`${API_URL}/admin/user-information`, {
                    headers: { Authorization: `Bearer ${getAdminToken()}` },
               });
               const data = await response.json();
               if (!response.ok) {
                    throw new Error(data.error || "Failed to load user information");
               }
               setProfiles(data.profiles || []);
               setNewCount(data.newCount || 0);
               window.dispatchEvent(new Event("refresh-user-profile-count"));
          } catch (fetchError) {
               console.error("Failed to load user information:", fetchError);
               setError(fetchError.message || "Failed to load user information");
          } finally {
               setLoading(false);
          }
     }, []);

     useEffect(() => {
          fetchProfiles();
     }, [fetchProfiles]);

     const filteredProfiles = useMemo(() => {
          const query = search.trim().toLowerCase();
          if (!query) return profiles;
          return profiles.filter((profile) => [
               profile.name,
               profile.email,
               profile.phone,
               profile.profileDetails?.firstName,
               profile.profileDetails?.lastName,
               profile.profileDetails?.country,
          ].some((value) => value?.toLowerCase().includes(query)));
     }, [profiles, search]);

     const markReviewed = async (profile) => {
          setActionUserId(profile._id);
          setError("");
          try {
               const response = await fetch(`${API_URL}/admin/user-information/${profile._id}/review`, {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${getAdminToken()}` },
               });
               const data = await response.json();
               if (!response.ok) {
                    throw new Error(data.error || "Failed to mark this application as reviewed");
               }

               setProfiles((current) => current.map((item) => item._id === profile._id
                    ? { ...item, profileReviewedAt: new Date().toISOString() }
                    : item));
               setNewCount((current) => Math.max(0, current - (profile.profileReviewedAt ? 0 : 1)));
               window.dispatchEvent(new Event("refresh-user-profile-count"));
          } catch (reviewError) {
               console.error("Failed to update user information review status:", reviewError);
               setError(reviewError.message || "Failed to update review status");
          } finally {
               setActionUserId("");
          }
     };

     return (
          <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
               <header className="flex flex-col justify-between gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center">
                    <div>
                         <h1 className="flex items-center gap-2 text-2xl font-bold text-zinc-900">
                              <HiOutlineUserGroup className="text-orange-500" /> User Information
                         </h1>
                         <p className="mt-1 text-sm text-zinc-500">Applications submitted by new Weekend UX users.</p>
                    </div>
                    <div className="flex items-center gap-3">
                         <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-sm font-bold text-red-700 ring-1 ring-red-200">
                              <span className="h-2 w-2 rounded-full bg-red-600" /> {newCount} new
                         </span>
                         <button
                              type="button"
                              onClick={fetchProfiles}
                              disabled={loading}
                              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
                         >
                              <HiOutlineRefresh className={loading ? "animate-spin" : ""} /> Refresh
                         </button>
                    </div>
               </header>

               {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}

               <div className="relative">
                    <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={19} />
                    <input
                         type="search"
                         value={search}
                         onChange={(event) => setSearch(event.target.value)}
                         placeholder="Search by name, email, phone, or country..."
                         className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
               </div>

               {loading ? (
                    <div className="rounded-xl border border-zinc-200 bg-white py-16 text-center text-sm font-medium text-zinc-500">Loading submitted applications…</div>
               ) : filteredProfiles.length === 0 ? (
                    <div className="rounded-xl border border-zinc-200 bg-white py-16 text-center text-sm font-medium text-zinc-500">
                         {profiles.length ? "No applications match your search." : "No completed user applications yet."}
                    </div>
               ) : (
                    <div className="space-y-4">
                         {filteredProfiles.map((profile) => {
                              const details = profile.profileDetails || {};
                              const displayName = [details.title, details.firstName, details.lastName].filter(Boolean).join(" ") || profile.name || "User";
                              const isNew = !profile.profileReviewedAt;
                              return (
                                   <article key={profile._id} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                                        <div className="flex flex-col justify-between gap-4 border-b border-zinc-100 p-5 sm:flex-row sm:items-center">
                                             <div className="min-w-0">
                                                  <div className="flex flex-wrap items-center gap-2">
                                                       <h2 className="text-lg font-bold text-zinc-900">{displayName}</h2>
                                                       {isNew && <span className="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-red-700">New</span>}
                                                  </div>
                                                  <div className="mt-1 flex flex-col gap-1 text-sm text-zinc-600 sm:flex-row sm:gap-4">
                                                       <span className="break-all">{profile.email}</span>
                                                       <span>{details.mobileNumber || profile.phone || "No phone"}</span>
                                                  </div>
                                             </div>
                                             <div className="flex items-center gap-3">
                                                  <span className="text-xs text-zinc-500">Submitted {formatDate(profile.profileSubmittedAt)}</span>
                                                  {isNew ? (
                                                       <button
                                                            type="button"
                                                            onClick={() => markReviewed(profile)}
                                                            disabled={actionUserId === profile._id}
                                                            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-orange-600 disabled:cursor-wait disabled:opacity-60"
                                                       >
                                                            <HiOutlineCheckCircle size={16} />
                                                            {actionUserId === profile._id ? "Saving…" : "Mark reviewed"}
                                                       </button>
                                                  ) : (
                                                       <span className="text-xs font-semibold text-emerald-700">Reviewed {formatDate(profile.profileReviewedAt)}</span>
                                                  )}
                                             </div>
                                        </div>
                                        <div className="grid gap-x-8 gap-y-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
                                             {profileFields.map(([label, key]) => (
                                                  <div key={key} className="min-w-0">
                                                       <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">{label}</p>
                                                       {key === "linkedinProfile" && details[key] ? (
                                                            <a className="mt-1 block break-all text-sm font-medium text-blue-700 underline" href={details[key]} target="_blank" rel="noreferrer">{details[key]}</a>
                                                       ) : (
                                                            <p className="mt-1 break-words text-sm font-medium text-zinc-800">{details[key] || "—"}</p>
                                                       )}
                                                  </div>
                                             ))}
                                        </div>
                                   </article>
                              );
                         })}
                    </div>
               )}
          </div>
     );
}

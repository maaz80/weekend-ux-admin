import { useState, useEffect } from 'react';
import Breadcrumb from '../components/BreadCrumb';

const API_URL = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:5000/api';

const PAGES = [
     { id: 'home', title: 'Home', slug: '/' },
     { id: 'contact-us', title: 'Contact Us', slug: '/contact-us' },
     { id: 'privacy-policy', title: 'Privacy Policy', slug: '/privacy-policy' },
     { id: 'disclaimer', title: 'Disclaimer', slug: '/disclaimer' },
     { id: 'category-blogs', title: 'Blogs', slug: '/category/blogs' },
     { id: 'courses', title: 'Courses', slug: '/courses' },
     { id: 'about-us', title: 'About Us', slug: '/about-us' },
     // { id: 'location', title: 'Location', slug: '/location' },
     { id: 'not-found', title: '404 Page', slug: '*' },
];

function PageRow({ page, seoData, onChange, onSave, saving, saved, loading }) {
     const titleLength = seoData?.title?.length || 0;
     const descriptionLength = seoData?.description?.length || 0;
     const schemas = seoData?.schemas || [];

     return (
          <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_2fr_1.5fr_auto] gap-6 items-start p-5 border-b border-gray-100 hover:bg-gray-50/50 transition-colors last:border-none">
               {/* Page Name */}
               <div className="flex flex-col gap-0.5 min-w-0 mt-2">
                    <span className="font-bold text-gray-900 text-sm truncate">{page.title}</span>
                    <span className="text-xs text-gray-400 font-mono truncate">{page.slug}</span>
               </div>

               {loading ? (
                    <div className="lg:col-span-3 h-16 bg-gray-150/60 animate-pulse rounded-xl w-full"></div>
               ) : (
                    <>
                         {/* Meta Title */}
                         <div className="relative mt-2">
                              <input
                                   type="text"
                                   value={seoData?.title || ''}
                                   maxLength={60}
                                   onChange={e => onChange('title', e.target.value)}
                                   placeholder="Meta title..."
                                   className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl bg-white text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                              />
                              <span className={`absolute right-3.5 -bottom-4.5 text-[9px] font-semibold ${titleLength > 55 ? 'text-red-500' : 'text-gray-400'}`}>
                                   {titleLength}/60
                              </span>
                         </div>

                         {/* Meta Description */}
                         <div className="relative mt-2">
                              <textarea
                                   value={seoData?.description || ''}
                                   maxLength={200}
                                   onChange={e => onChange('description', e.target.value)}
                                   placeholder="Meta description..."
                                   rows={2}
                                   className="w-full px-4 py-2 text-xs border border-gray-200 rounded-xl bg-white text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 resize-none"
                              />
                              <span className={`absolute right-3.5 -bottom-2 text-[9px] font-semibold ${descriptionLength > 190 ? 'text-red-500' : 'text-gray-400'}`}>
                                   {descriptionLength}/200
                              </span>
                         </div>

                         {/* JSON-LD Schemas List */}
                         <div className="space-y-2">
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">JSON-LD Schemas</label>
                              {schemas.map((schema, index) => (
                                   <div key={index} className="flex gap-1.5 items-start">
                                        <textarea
                                             value={schema}
                                             onChange={e => {
                                                  const newSchemas = [...schemas];
                                                  newSchemas[index] = e.target.value;
                                                  onChange('schemas', newSchemas);
                                             }}
                                             placeholder='{"@context": "https://schema.org", ...}'
                                             rows={2}
                                             className="w-full px-3 py-1.5 text-[10px] border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-mono placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        />
                                        <button
                                             type="button"
                                             onClick={() => {
                                                  const newSchemas = schemas.filter((_, idx) => idx !== index);
                                                  onChange('schemas', newSchemas);
                                             }}
                                             className="text-red-400 hover:text-red-600 text-xs py-1 px-1.5 cursor-pointer mt-1"
                                        >
                                             ✕
                                        </button>
                                   </div>
                              ))}
                              <button
                                   type="button"
                                   onClick={() => onChange('schemas', [...schemas, ''])}
                                   className="text-orange-500 hover:text-orange-600 text-[10px] font-bold cursor-pointer block mt-1"
                              >
                                   + Add Schema Script
                              </button>
                         </div>
                    </>
               )}

               {/* Save Button */}
               <div className="flex justify-end pt-3 lg:pt-2">
                    <button
                         onClick={onSave}
                         disabled={loading || saving}
                         className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 min-w-20 flex items-center justify-center cursor-pointer shadow-sm ${
                              saved
                                   ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-100'
                                   : loading || saving
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                        : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-100'
                         }`}
                    >
                         {saving ? (
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                         ) : saved ? (
                              '✓ Saved'
                         ) : (
                              'Save'
                         )}
                    </button>
               </div>
          </div>
     );
}

export default function PageSEOManager() {
     // Per-page SEO state: { [pageId]: { title, description, schemas: [] } }
     const [seoMap, setSeoMap] = useState(() =>
          Object.fromEntries(PAGES.map(p => [p.id, { title: '', description: '', schemas: [] }]))
     );
     const [loadingMap, setLoadingMap] = useState({});
     const [savingMap, setSavingMap] = useState({});
     const [savedMap, setSavedMap] = useState({});

     // Fetch SEO data for all pages immediately on mount
     useEffect(() => {
          PAGES.forEach(page => {
               fetchPageSEO(page.id);
          });
     }, []);

     const fetchPageSEO = async (pageId) => {
          setLoadingMap(prev => ({ ...prev, [pageId]: true }));
          try {
               const res = await fetch(`${API_URL}/pages/${pageId}/seo`);
               const data = await res.json();
               setSeoMap(prev => ({
                    ...prev,
                    [pageId]: {
                         title: data.title || '',
                         description: data.description || '',
                         schemas: data.schemas || [],
                    },
               }));
          } catch (err) {
               console.error("Failed to fetch page SEO:", err);
          } finally {
               setLoadingMap(prev => ({ ...prev, [pageId]: false }));
          }
     };

     const handleChange = (pageId, field, value) => {
          setSeoMap(prev => ({
               ...prev,
               [pageId]: { ...prev[pageId], [field]: value },
          }));
          setSavedMap(prev => ({ ...prev, [pageId]: false }));
     };

     const handleSave = async (pageId) => {
          const data = seoMap[pageId];
          setSavingMap(prev => ({ ...prev, [pageId]: true }));
          try {
               const res = await fetch(`${API_URL}/pages/${pageId}/seo`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
               });
               if (!res.ok) throw new Error('Save failed');
               setSavedMap(prev => ({ ...prev, [pageId]: true }));
               setTimeout(() => setSavedMap(prev => ({ ...prev, [pageId]: false })), 2500);
          } catch (err) {
               console.error(err);
          } finally {
               setSavingMap(prev => ({ ...prev, [pageId]: false }));
          }
     };

     return (
          <div className="min-h-screen bg-gray-50/50 pb-12 font-sans">
               <Breadcrumb />
               <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="mb-8">
                         <h1 className="text-2xl font-bold text-gray-900 tracking-tight">SEO Settings</h1>
                         <p className="text-sm text-gray-500 mt-1">
                              Manage meta titles and descriptions for search engine optimization across all website pages.
                         </p>
                    </div>

                    {/* Direct Row Layout Container */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                         {/* Column Headers */}
                         <div className="hidden lg:grid grid-cols-[180px_1fr_2fr_1.5fr_auto] gap-6 px-5 py-3.5 bg-gray-50 border-b border-gray-200">
                              {['Page Name', 'Meta Title', 'Meta Description', 'JSON-LD Schemas', 'Action'].map((label, i) => (
                                   <span
                                        key={i}
                                        className={`text-[10px] font-bold text-gray-400 uppercase tracking-wider ${
                                             i === 4 ? 'text-right pr-12' : ''
                                        }`}
                                   >
                                        {label}
                                   </span>
                              ))}
                         </div>

                         {/* Page Rows */}
                         <div className="divide-y divide-gray-100">
                              {PAGES.map((page) => (
                                   <PageRow
                                        key={page.id}
                                        page={page}
                                        seoData={seoMap[page.id]}
                                        onChange={(field, value) => handleChange(page.id, field, value)}
                                        onSave={() => handleSave(page.id)}
                                        saving={!!savingMap[page.id]}
                                        saved={!!savedMap[page.id]}
                                        loading={!!loadingMap[page.id]}
                                   />
                              ))}
                         </div>

                         {/* Footer Tip */}
                         <div className="px-5 py-3.5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                              <span className="text-[11px] text-gray-400">
                                   💡 Changes must be saved per page individually by clicking the Save button next to each row.
                              </span>
                         </div>
                    </div>
               </div>
          </div>
     );
}

import { useState, useEffect } from "react";
import { getAdminToken } from "../utils/auth";
import { 
  HiOutlineChatAlt2, 
  HiOutlineSearch, 
  HiOutlineX, 
  HiOutlinePaperAirplane, 
  HiOutlineRefresh
} from "react-icons/hi";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export default function WhatsAppLeads() {
  const [leads, setLeads] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [selectedLead, setSelectedLead] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const [replyText, setReplyText] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const token = getAdminToken();
      const headers = { Authorization: `Bearer ${token}` };
      const statusQuery = statusFilter ? `&status=${statusFilter}` : "";

      const res = await fetch(`${API_URL}/whatsapp/leads?page=1&limit=100${statusQuery}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.data || []);
        setTotalLeads(data.total || 0);
      } else {
        setMessage({ type: "error", text: "Failed to fetch WhatsApp leads" });
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      setMessage({ type: "error", text: "Error loading WhatsApp leads" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const handleOpenChatModal = async (lead) => {
    setSelectedLead(lead);
    setShowChatModal(true);
    setReplyText("");
    setChatMessages([]);
    try {
      const token = getAdminToken();
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(`${API_URL}/whatsapp/leads/${lead._id}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setSelectedLead(data.lead || lead);
        setChatMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Failed to fetch conversation:", err);
    }
  };

  const handleUpdateStatus = async (leadId, newStatus) => {
    setActionLoading(true);
    try {
      const token = getAdminToken();
      const res = await fetch(`${API_URL}/whatsapp/leads/${leadId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Lead status updated successfully" });
        if (selectedLead && selectedLead._id === leadId) {
          setSelectedLead(data.lead);
        }
        fetchLeads();
      }
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedLead) return;
    setActionLoading(true);
    try {
      const token = getAdminToken();
      const res = await fetch(`${API_URL}/whatsapp/leads/${selectedLead._id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: replyText })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReplyText("");
        // Reload chat conversation
        handleOpenChatModal(selectedLead);
      } else {
        alert(data.error || "Failed to send message.");
      }
    } catch (err) {
      console.error("Reply error:", err);
      alert("Failed to send message.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredLeads = leads.filter((l) => {
    const query = searchQuery.toLowerCase();
    return (
      (l.name && l.name.toLowerCase().includes(query)) ||
      (l.whatsapp_number && l.whatsapp_number.includes(query)) ||
      (l.service_interest && l.service_interest.toLowerCase().includes(query))
    );
  });

  const getStatusBadge = (status) => {
    const statusMap = {
      new: "bg-blue-50 text-blue-700 border-blue-200",
      in_progress: "bg-amber-50 text-amber-700 border-amber-200",
      qualified: "bg-emerald-50 text-emerald-700 border-emerald-200",
      human_handover: "bg-purple-50 text-purple-700 border-purple-200 font-bold",
      converted: "bg-green-100 text-green-800 border-green-300 font-bold",
      closed: "bg-zinc-100 text-zinc-600 border-zinc-200"
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusMap[status] || statusMap.new}`}>
        {status ? status.replace("_", " ").toUpperCase() : "NEW"}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <HiOutlineChatAlt2 className="text-emerald-600" /> Meta WhatsApp Leads & Automation
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage WhatsApp Cloud API leads, view real-time chat state machine logs, and send manual replies.
          </p>
        </div>
        <button
          onClick={fetchLeads}
          className="px-4 py-2 bg-zinc-900 text-white text-sm font-semibold rounded-lg hover:bg-zinc-800 transition flex items-center gap-2 cursor-pointer"
        >
          <HiOutlineRefresh size={16} /> Refresh Leads
        </button>
      </div>

      {/* Toast Message */}
      {message.text && (
        <div
          className={`p-4 rounded-lg text-sm font-medium flex items-center justify-between ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: "", text: "" })} className="text-zinc-500 hover:text-zinc-700">
            <HiOutlineX size={18} />
          </button>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, phone or course..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-zinc-600 shrink-0">Filter Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 bg-white border border-zinc-200 rounded-lg text-sm outline-none focus:border-emerald-500"
          >
            <option value="">All Statuses ({totalLeads})</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="qualified">Qualified</option>
            <option value="human_handover">Human Handover</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div className="py-12 text-center text-zinc-500 font-medium">Loading WhatsApp leads...</div>
      ) : filteredLeads.length === 0 ? (
        <div className="py-12 text-center text-zinc-500 bg-white border border-zinc-200 rounded-xl">
          No WhatsApp leads found.
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-semibold uppercase text-xs">
                  <th className="p-4">Lead / Phone</th>
                  <th className="p-4">Interested Course</th>
                  <th className="p-4">Background</th>
                  <th className="p-4">Preferred Batch</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredLeads.map((l) => (
                  <tr key={l._id} className="hover:bg-zinc-50/80 transition">
                    <td className="p-4 font-medium text-zinc-900">
                      <div className="font-bold text-zinc-900">{l.name || "WhatsApp Visitor"}</div>
                      <div className="text-xs text-emerald-600 font-mono">+{l.whatsapp_number}</div>
                    </td>
                    <td className="p-4 text-zinc-700 font-medium">{l.service_interest}</td>
                    <td className="p-4 text-zinc-600 text-xs">{l.experience_or_budget}</td>
                    <td className="p-4 text-zinc-600 text-xs">{l.preferred_contact_time}</td>
                    <td className="p-4">{getStatusBadge(l.status)}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenChatModal(l)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white font-semibold text-xs rounded-lg hover:bg-emerald-700 transition shadow-sm cursor-pointer"
                      >
                        <HiOutlineChatAlt2 size={15} /> Chat History & Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Chat History & Reply Modal */}
      {showChatModal && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-zinc-200 flex flex-col h-[620px] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
              <div>
                <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  {selectedLead.name} (+{selectedLead.whatsapp_number})
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Course: {selectedLead.service_interest} • Step: {selectedLead.current_step}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleUpdateStatus(selectedLead._id, e.target.value)}
                  className="px-2.5 py-1 bg-white border border-zinc-200 rounded-md text-xs font-semibold outline-none"
                >
                  <option value="new">NEW</option>
                  <option value="in_progress">IN PROGRESS</option>
                  <option value="qualified">QUALIFIED</option>
                  <option value="human_handover">HUMAN HANDOVER</option>
                  <option value="converted">CONVERTED</option>
                  <option value="closed">CLOSED</option>
                </select>

                <button onClick={() => setShowChatModal(false)} className="text-zinc-400 hover:text-zinc-600 p-1">
                  <HiOutlineX size={20} />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 bg-zinc-50/50 space-y-3">
              {chatMessages.length === 0 ? (
                <div className="py-8 text-center text-zinc-400 text-xs">No chat history recorded for this lead yet.</div>
              ) : (
                chatMessages.map((m) => {
                  const isInbound = m.direction === "INBOUND";
                  return (
                    <div key={m._id} className={`flex flex-col ${isInbound ? "items-start" : "items-end"}`}>
                      <div
                        className={`p-3 rounded-xl text-xs max-w-[80%] leading-relaxed ${
                          isInbound
                            ? "bg-white text-zinc-800 border border-zinc-200 shadow-xs"
                            : "bg-emerald-600 text-white font-medium shadow-xs"
                        }`}
                      >
                        <p>{m.message_text}</p>
                        <p className={`text-[10px] mt-1 text-right ${isInbound ? "text-zinc-400" : "text-emerald-100"}`}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Reply Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendReply();
              }}
              className="p-3 bg-white border-t border-zinc-200 flex gap-2 items-center"
            >
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type manual WhatsApp reply..."
                className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={actionLoading || !replyText.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <HiOutlinePaperAirplane size={14} className="rotate-90" /> Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

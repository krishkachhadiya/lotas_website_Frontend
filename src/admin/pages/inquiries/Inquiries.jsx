import { apiFetch } from "../../../lib/api";
import { useEffect, useState } from "react";
import TableHeader from "../../../components/TableHeader";
import { sortData } from "../../../lib/sortdata";

export default function InquiriesPage() {
  // ======================
  // STATES
  // ======================
  const [inquiries, setInquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // active filters: 'read', 'unread'
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Selected single inquiry modal viewer state
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // ======================
  // PAGINATION
  // ======================
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // ======================
  // FETCH INQUIRIES
  // ======================
  async function fetchInquiries() {
    try {
      const response = await apiFetch("/inquiries");
      const data = await response.json();
      setInquiries(data);
    } catch (error) {
      console.error("Error pulling inquiries data:", error);
    } finally {
      setLoading(false);
    }
  }

  // ======================
  // FETCH CONFIG LIMITS
  // ======================
  async function fetchPaginationSettings() {
    try {
      const response = await apiFetch("/settings");
      const result = await response.json();
      setLimit(result.data.pagination || 10);
    } catch (error) {
      console.log(error);
    }
  }

  // ======================
  // LOAD DEPENDENCIES
  // ======================
  useEffect(() => {
    fetchInquiries();
    fetchPaginationSettings();

    const storedAdmin = sessionStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  // ======================
  // TOGGLE READ STATUS
  // ======================
  async function handleViewInquiry(inquiry) {
    setSelectedInquiry(inquiry);

    // If it's already read, don't ping the server
    if (inquiry.status === "read") return;

    try {
      const response = await apiFetch(`/inquiries/${inquiry._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "read" }),
      });
      const data = await response.json();
      if (data.success) {
        // Soft refresh without resetting pagination position
        fetchInquiries();
      }
    } catch (error) {
      console.error("Failed status alteration operation:", error);
    }
  }

  // ======================
  // DELETE INQUIRY
  // ======================
  async function handleDelete(id) {
    const confirmDelete = confirm("Are you sure you want to permanently delete this inquiry?");
    if (!confirmDelete) return;

    try {
      const response = await apiFetch(`/inquiries/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        if (selectedInquiry?._id === id) setSelectedInquiry(null);
        fetchInquiries();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Sorting controller
  const handleSort = (field) => {
    setPage(1);
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // ======================
  // FILTER COMPUTATIONS (Fixed Search Logic)
  // ======================
  const filteredInquiries = inquiries.filter((item) => {
    const cleanSearch = search.trim().toLowerCase();
    
    // Fixed matching condition to check name, email, subject line, AND the message description text body properly
    const searchMatch =
      !cleanSearch ||
      item.name?.toLowerCase().includes(cleanSearch) ||
      item.email?.toLowerCase().includes(cleanSearch) ||
      item.subject?.toLowerCase().includes(cleanSearch) ||
      item.message?.toLowerCase().includes(cleanSearch);

    const statusMatch = !statusFilter || item.status === statusFilter;

    return searchMatch && statusMatch;
  });

  const sortedInquiries = sortData(filteredInquiries, sortField, sortOrder);

  // Pagination bounds windows slice computations
  const start = (page - 1) * limit;
  const end = page * limit;
  const paginatedInquiries = sortedInquiries.slice(start, end);
  const totalPages = Math.ceil(sortedInquiries.length / limit);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-2xl font-semibold text-black">
        Loading Inquiries...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      {/* Header section */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Inquiries</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Review user messages and inquiries</p>
        </div>
      </div>

      {/* Filter Options Controls - Made fully responsive stacking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
          <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-4">
            Search Sender or Topic
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, email, or content text..."
            className="w-full border border-gray-300 p-3 sm:p-4 rounded-xl text-black outline-none focus:ring-2 focus:ring-black bg-white"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
          <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-4">
            Filter Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full border border-gray-300 bg-white text-black p-3 sm:p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">All Message Items</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {/* Main Table Interface Data Box - Added overflow-x-auto for responsive horizontal swipe on mobile */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[800px] table-auto">
            <thead className="bg-black text-white">
              <tr>
                <TableHeader label="Sender Name" field="name" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
                <TableHeader label="Email Address" field="email" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
                <TableHeader label="Subject Line" field="subject" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
                <TableHeader label="Status" field="status" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
                <TableHeader label="Received Date" field="createdAt" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
                <th className="text-left p-4 text-sm font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedInquiries.length > 0 ? (
                paginatedInquiries.map((inquiry, idx) => (
                  <tr 
                    key={`${inquiry._id || inquiry.id}-${idx}`} 
                    className={`border-b hover:bg-gray-50 transition text-sm ${inquiry.status === 'unread' ? "bg-blue-50/40 font-semibold text-black" : "text-gray-700"}`}
                  >
                    <td className="p-4 whitespace-nowrap">{inquiry.name}</td>
                    <td className="p-4 whitespace-nowrap">{inquiry.email}</td>
                    <td className="p-4 truncate max-w-xs">{inquiry.subject || "No Subject Context"}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${inquiry.status === "unread" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                      {new Date(inquiry.createdAt).toLocaleString("en-IN")}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex gap-2.5">
                        <button
                          onClick={() => handleViewInquiry(inquiry)}
                          className="bg-black hover:bg-gray-800 text-white px-3.5 py-2 rounded-lg text-xs font-medium transition"
                        >
                          View
                        </button>
                        {(admin?.role === "admin" || admin?.permissions?.inquiries?.delete) && (
                          <button
                            onClick={() => handleDelete(inquiry._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3.5 py-2 rounded-lg text-xs font-medium transition"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-500 text-sm">
                    No Inquiries Available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SMART PAGINATION SLIDER CONTAINER */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 text-black select-none flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-3 py-2 rounded-lg border font-medium text-sm transition-all duration-200 ${
              page === 1 ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-white border-gray-300 hover:bg-gray-50"
            }`}
          >
            Prev
          </button>

          {(() => {
            const pageNumbers = [];
            const maxVisiblePages = 5;

            if (totalPages <= maxVisiblePages) {
              for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
            } else {
              pageNumbers.push(1);
              let startRange = Math.max(2, page - 1);
              let endRange = Math.min(totalPages - 1, page + 1);

              if (page <= 2) endRange = 4;
              else if (page >= totalPages - 1) startRange = totalPages - 3;

              if (startRange > 2) pageNumbers.push("ellipsis-left");
              for (let i = startRange; i <= endRange; i++) pageNumbers.push(i);
              if (endRange < totalPages - 1) pageNumbers.push("ellipsis-right");
              pageNumbers.push(totalPages);
            }

            return pageNumbers.map((item, index) => {
              if (item === "ellipsis-left" || item === "ellipsis-right") {
                return <span key={`ellipse-${index}`} className="px-1 text-gray-400">...</span>;
              }
              return (
                <button
                  key={`page-${item}`}
                  onClick={() => setPage(item)}
                  className={`w-9 h-9 rounded-lg border text-sm font-semibold transition-all duration-200 ${
                    page === item ? "bg-black text-white border-black shadow-md" : "bg-white text-black border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {item}
                </button>
              );
            });
          })()}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-3 py-2 rounded-lg border font-medium text-sm transition-all duration-200 ${
              page === totalPages ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-white border-gray-300 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* DETAIL DRAWER / POPUP OVERLAY MODAL */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-black text-white p-5 sm:p-6 flex justify-between items-start">
              <div className="max-w-[85%]">
                <h2 className="text-lg sm:text-xl font-bold break-words">{selectedInquiry.subject || "Inquiry Message Details"}</h2>
                <p className="text-xs text-gray-400 mt-1">Received: {new Date(selectedInquiry.createdAt).toLocaleString("en-IN")}</p>
              </div>
              <button 
                onClick={() => setSelectedInquiry(null)}
                className="text-white text-3xl leading-none hover:text-gray-300 transition p-1"
              >
                &times;
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-black text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-4 border-gray-100">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-0.5">Sender Name</label>
                  <p className="text-base font-semibold text-gray-800 break-words">{selectedInquiry.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-0.5">Email Address</label>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-base font-semibold text-blue-600 hover:underline block break-all">
                    {selectedInquiry.email}
                  </a>
                </div>
              </div>

              {selectedInquiry.phone && (
                <div className="border-b pb-4 border-gray-100">
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-0.5">Phone Number</label>
                  <p className="text-gray-800 font-medium text-base">{selectedInquiry.phone}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Message Content</label>
                <div className="bg-gray-50 p-4 border border-gray-200 rounded-xl whitespace-pre-line text-gray-700 leading-relaxed text-sm sm:text-base break-words max-h-[250px] overflow-y-auto">
                  {selectedInquiry.message}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 border-t flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 text-sm font-medium transition"
              >
                Close View
              </button>
              <a
                href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject || 'Inquiry Response'}`}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-black text-white hover:bg-gray-800 text-sm font-medium transition text-center"
              >
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
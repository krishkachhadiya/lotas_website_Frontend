
import { apiFetch } from "../../../lib/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TableHeader from "../../../components/TableHeader";
import { sortData } from "../../../lib/sortdata";

export default function CMSPage() {
const navigate = useNavigate();

  // ======================
  // STATES
  // ======================
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);

  // ======================
  // PAGINATION
  // ======================
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // ======================
  // FETCH CMS
  // ======================
  async function fetchPages() {
    try {
      const response = await apiFetch("/cms");
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // ======================
  // FETCH PAGINATION
  // ======================
  async function fetchPagination() {
    try {
      const response = await apiFetch("/settings");
      const result = await response.json();
      setLimit(result.data.pagination || 10);
    } catch (error) {
      console.log(error);
    }
  }

  // sorting logic 
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
  // LOAD DATA
  // ======================
  useEffect(() => {
    fetchPages();
    fetchPagination();

    const storedAdmin = sessionStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  // ======================
  // DELETE PAGE (FIXED)
  // ======================
  async function handleDelete(id) {
    const confirmDelete = confirm("Delete this page?");
    if (!confirmDelete) return;

    try {
      const response = await apiFetch(`/cms/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPages((prev) =>
          prev.filter((p) => String(p._id || p.id) !== String(id))
        );
        fetchPages();
      } else {
        alert("Failed to delete CMS page. Server returned an error status.");
      }
    } catch (error) {
      console.log("Delete request failed:", error);
    }
  }

  // ======================
  // TOGGLE STATUS (FIXED)
  // ======================
  async function toggleStatus(pageData) {
    const targetId = pageData._id || pageData.id;
    const nextStatus = pageData.status === "active" ? "inactive" : "active";

    try {
      const response = await apiFetch(`/cms/${targetId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...pageData,
          status: nextStatus,
        }),
      });

      if (response.ok) {
        setPages((prev) =>
          prev.map((p) =>
            String(p._id || p.id) === String(targetId) ? { ...p, status: nextStatus } : p
          )
        );
        fetchPages();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // sorting 
  const sortedPages = sortData(pages, sortField, sortOrder);

  // ======================
  // PAGINATION LOGIC
  // ======================
  const start = (page - 1) * limit;
  const end = page * limit;
  const paginatedPages = sortedPages.slice(start, end);
  const totalPages = Math.ceil(sortedPages.length / limit);

  // ======================
  // LOADING
  // ======================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  // ======================
  // UI
  // ======================
  return (
    // Fluid layouts scaling down from p-8 padding on mobile viewports
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 w-full">

      {/* Header Container wraps on mobile viewports safely */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black">CMS Pages</h1>
          <p className="text-gray-500 mt-1 md:mt-2 text-sm md:text-base">Manage website pages</p>
        </div>

        {/* Add Page Button - goes full width on mobile if needed */}
        {(admin?.role === "admin" || admin?.permissions?.cms?.create) && (
          <button
            onClick={() => navigate("/admin/cms/add")}
            className="w-full sm:w-auto text-center bg-black hover:bg-gray-800 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-semibold text-sm md:text-base transition"
          >
            Add Page
          </button>
        )}
      </div>

      {/* Table Section with full horizontal mobile view swipe scroll handling */}
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg overflow-hidden w-full overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
          {/* Head */}
          <thead className="bg-black text-white">
            <tr>
              <TableHeader label="Title" field="title" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
              <TableHeader label="Slug" field="slug" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
              <TableHeader label="Status" field="status" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
              <TableHeader label="Created" field="createdAt" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
              <TableHeader label="Updated" field="updatedAt" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
              <th className="text-center p-4 md:p-5 text-sm md:text-base">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {paginatedPages.length > 0 ? (
              paginatedPages.map((pageData, index) => {
                const currentId = pageData._id || pageData.id;
                return (
                  <tr key={currentId || index} className="border-b hover:bg-gray-50 transition">

                    {/* Title */}
                    <td className="p-4 md:p-5">
                      <h2 className="font-bold text-base md:text-lg text-black line-clamp-1">{pageData.title}</h2>
                    </td>

                    {/* Slug */}
                    <td className="p-4 md:p-5 text-gray-600 text-sm md:text-base">/{pageData.slug}</td>

                    {/* Status Button Action Trigger */}
                    <td className="p-4 md:p-5 text-center">
                      {(admin?.role === "admin" || admin?.permissions?.cms?.edit) ? (
                        <button
                          onClick={() => toggleStatus(pageData)}
                          className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition opacity-90 hover:opacity-100 whitespace-nowrap ${
                            pageData.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {pageData.status}
                        </button>
                      ) : (
                        <span
                          className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap ${
                            pageData.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {pageData.status}
                        </span>
                      )}
                    </td>

                    {/* Created Dates formatting */}
                    <td className="p-4 text-gray-600 text-xs md:text-sm whitespace-nowrap">
                      {pageData.createdAt ? new Date(pageData.createdAt).toLocaleString("en-IN") : "-"}
                    </td>

                    {/* Updated Dates formatting */}
                    <td className="p-4 text-gray-600 text-xs md:text-sm whitespace-nowrap">
                      {pageData.updatedAt ? new Date(pageData.updatedAt).toLocaleString("en-IN") : "-"}
                    </td>

                    {/* Actions Links */}
                    <td className="p-4 md:p-5">
                      <div className="flex justify-center gap-2 md:gap-3">
                        {/* Edit Button Link */}
                        {(admin?.role === "admin" || admin?.permissions?.cms?.edit) && (
                          <button
                            onClick={() => navigate(`/admin/cms/edit/${currentId}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-5 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium whitespace-nowrap"
                          >
                            Edit
                          </button>
                        )}

                        {/* Delete Action Trigger */}
                        {(admin?.role === "admin" || admin?.permissions?.cms?.delete) && (
                          <button
                            onClick={() => handleDelete(currentId)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 md:px-5 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium whitespace-nowrap"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-10 text-gray-500 text-sm md:text-base">
                  No CMS Pages Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Wrapper buttons wrap gracefully on screens */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 md:mt-8 text-black select-none flex-wrap">

          {/* Prev Button */}
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg border font-medium text-xs md:text-sm transition-all duration-200 ${
              page === 1
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-black border-gray-300 hover:bg-gray-50 active:scale-95"
            }`}
          >
            Prev
          </button>

          {/* Dynamic Window Logic */}
          {(() => {
            const pageNumbers = [];
            const maxVisiblePages = 5;

            if (totalPages <= maxVisiblePages) {
              for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
            } else {
              pageNumbers.push(1);

              let startRange = Math.max(2, page - 1);
              let endRange = Math.min(totalPages - 1, page + 1);

              if (page <= 2) {
                endRange = 4;
              } else if (page >= totalPages - 1) {
                startRange = totalPages - 3;
              }

              if (startRange > 2) {
                pageNumbers.push("ellipsis-left");
              }

              for (let i = startRange; i <= endRange; i++) {
                pageNumbers.push(i);
              }

              if (endRange < totalPages - 1) {
                pageNumbers.push("ellipsis-right");
              }

              pageNumbers.push(totalPages);
            }

            return pageNumbers.map((item, index) => {
              if (item === "ellipsis-left" || item === "ellipsis-right") {
                return (
                  <span key={`ellipse-${index}`} className="px-1 md:px-2 text-gray-400 font-medium text-xs md:text-sm">
                    ...
                  </span>
                );
              }

              const isActive = page === item;
              return (
                <button
                  key={`page-${item}`}
                  onClick={() => setPage(item)}
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-lg border text-xs md:text-sm font-semibold transition-all duration-200 active:scale-95 ${
                    isActive
                      ? "bg-black text-white border-black shadow-md"
                      : "bg-white text-black border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {item}
                </button>
              );
            });
          })()}

          {/* Next Button */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg border font-medium text-xs md:text-sm transition-all duration-200 ${
              page === totalPages
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-black border-gray-300 hover:bg-gray-50 active:scale-95"
            }`}
          >
            Next
          </button>

        </div>
      )}
    </div>
  );
}
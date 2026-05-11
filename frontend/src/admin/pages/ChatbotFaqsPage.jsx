import React, { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { chatbotApi } from "../../api/chatbot.api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Plus, Pencil, Trash2, Save, MessageSquare, Tag, ToggleLeft, ToggleRight } from "lucide-react";

const CATEGORIES = ["General", "Products", "Orders", "Shipping", "Returns", "Payment", "Account", "Other"];

const emptyForm = { question: "", keywords: "", answer: "", category: "General", order: 0, active: 1 };

const ChatbotFaqsPage = () => {
  const user = JSON.parse(localStorage.getItem("adminUser") || "{}");
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [filterCat, setFilterCat] = useState("All");

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await chatbotApi.getAll();
      setFaqs(res.data?.data || []);
    } catch {
      toast.error("Failed to load chatbot FAQs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditing(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const handleEdit = (faq) => {
    setEditing(faq);
    setFormData({
      question: faq.question,
      keywords: faq.keywords,
      answer: faq.answer,
      category: faq.category || "General",
      order: faq.order || 0,
      active: faq.active ?? 1,
    });
    setShowModal(true);
  };

  const handleToggleActive = async (faq) => {
    try {
      await chatbotApi.update(faq.id, { active: faq.active ? 0 : 1 });
      setFaqs((prev) => prev.map((f) => f.id === faq.id ? { ...f, active: f.active ? 0 : 1 } : f));
      toast.success(faq.active ? "FAQ deactivated" : "FAQ activated");
    } catch {
      toast.error("Failed to toggle status");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete FAQ?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    });
    if (!result.isConfirmed) return;
    try {
      await chatbotApi.delete(id);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      toast.success("FAQ deleted");
    } catch {
      toast.error("Failed to delete FAQ");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await chatbotApi.update(editing.id, formData);
        toast.success("FAQ updated");
      } else {
        await chatbotApi.create(formData);
        toast.success("FAQ created");
      }
      fetchFaqs();
      setShowModal(false);
    } catch {
      toast.error("Failed to save FAQ");
    }
  };

  const displayed = filterCat === "All" ? faqs : faqs.filter((f) => f.category === filterCat);

  return (
    <AdminLayout role={user.role} title="Chatbot FAQ Manager">
      {/* Header stats */}
      <div className="row g-3 mb-4">
        {[
          { label: "Total FAQs", value: faqs.length, color: "primary" },
          { label: "Active", value: faqs.filter((f) => f.active).length, color: "success" },
          { label: "Inactive", value: faqs.filter((f) => !f.active).length, color: "secondary" },
          { label: "Categories", value: [...new Set(faqs.map((f) => f.category))].length, color: "info" },
        ].map((s) => (
          <div key={s.label} className="col-6 col-md-3">
            <div className={`card border-0 shadow-sm rounded-4 bg-${s.color} bg-opacity-10`}>
              <div className="card-body py-3 px-4">
                <div className={`text-${s.color} fw-bold fs-4`}>{s.value}</div>
                <div className="text-muted small">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white border-bottom py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <h5 className="mb-1 fw-bold d-flex align-items-center gap-2">
              <MessageSquare size={20} className="text-primary" /> Chatbot FAQ Manager
            </h5>
            <p className="text-muted small mb-0">Add questions &amp; answers that the Custom Bot will use to respond to users.</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <select
              className="form-select form-select-sm rounded-pill"
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <button
              className="btn btn-primary rounded-pill btn-sm px-3 d-flex align-items-center gap-2"
              onClick={handleCreate}
            >
              <Plus size={16} /> Add FAQ
            </button>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3 border-0" style={{ width: 40 }}>#</th>
                  <th className="py-3 border-0">Question</th>
                  <th className="py-3 border-0">Keywords</th>
                  <th className="py-3 border-0 d-none d-md-table-cell">Category</th>
                  <th className="py-3 border-0 text-center">Active</th>
                  <th className="py-3 border-0 text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-5"><div className="spinner-border spinner-border-sm text-primary" /></td></tr>
                ) : displayed.length > 0 ? (
                  displayed.map((faq, idx) => (
                    <tr key={faq.id}>
                      <td className="px-4 text-muted">{idx + 1}</td>
                      <td>
                        <div className="fw-semibold">{faq.question}</div>
                        <div className="text-muted small" style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {faq.answer}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {(faq.keywords || "").split(",").slice(0, 4).map((k) => k.trim()).filter(Boolean).map((k, i) => (
                            <span key={i} className="badge bg-primary bg-opacity-10 text-primary rounded-pill" style={{ fontSize: 11 }}>
                              <Tag size={9} className="me-1" />{k}
                            </span>
                          ))}
                          {(faq.keywords || "").split(",").length > 4 && (
                            <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill" style={{ fontSize: 11 }}>+more</span>
                          )}
                        </div>
                      </td>
                      <td className="d-none d-md-table-cell">
                        <span className="badge bg-info bg-opacity-10 text-info rounded-pill">{faq.category}</span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-link p-0"
                          title={faq.active ? "Deactivate" : "Activate"}
                          onClick={() => handleToggleActive(faq)}
                        >
                          {faq.active
                            ? <ToggleRight size={22} className="text-success" />
                            : <ToggleLeft size={22} className="text-secondary" />}
                        </button>
                      </td>
                      <td className="text-end px-4">
                        <button className="btn btn-light btn-sm rounded-circle me-2" onClick={() => handleEdit(faq)}>
                          <Pencil size={14} className="text-secondary" />
                        </button>
                        <button className="btn btn-light btn-sm rounded-circle" onClick={() => handleDelete(faq.id)}>
                          <Trash2 size={14} className="text-danger" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <MessageSquare size={40} className="mb-2 opacity-25" />
                      <div>No FAQs found. Click "Add FAQ" to create the first one.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <MessageSquare size={18} className="text-primary" />
                  {editing ? "Edit FAQ" : "Add FAQ"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Question <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="e.g. What is your return policy?"
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      required
                    />
                    <div className="form-text">This appears in the sidebar suggestions for users.</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Keywords <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="e.g. return, refund, exchange, policy"
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      required
                    />
                    <div className="form-text">Comma-separated words used to match user messages. More keywords = better matching.</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Answer <span className="text-danger">*</span></label>
                    <textarea
                      className="form-control rounded-3"
                      rows={5}
                      placeholder="Write the bot's response here..."
                      value={formData.answer}
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Category</label>
                      <select
                        className="form-select rounded-3"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Sort Order</label>
                      <input
                        type="number"
                        className="form-control rounded-3"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="col-md-4 d-flex align-items-center pt-4">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="faqActive"
                          checked={!!formData.active}
                          onChange={(e) => setFormData({ ...formData, active: e.target.checked ? 1 : 0 })}
                        />
                        <label className="form-check-label fw-semibold" htmlFor="faqActive">Active</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light rounded-pill" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2">
                    <Save size={16} /> {editing ? "Update FAQ" : "Save FAQ"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ChatbotFaqsPage;

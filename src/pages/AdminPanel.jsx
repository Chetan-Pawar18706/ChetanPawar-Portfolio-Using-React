import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { CheckCircle2, LogOut, Mail, MessageCircle, Phone, Plus, Save, Trash2 } from "lucide-react";
import { apiFetch, clearToken, getToken } from "../lib/api";
import { buildAssetUrl } from "../config/api";
import "./Admin.css";

const blankProject = {
  title: "",
  desc: "",
  image: "",
  tech: "",
  live: "#",
  code: "#",
  published: true,
};

const blankPageItem = {
  category: "",
  title: "",
  text: "",
  image: "",
  url: "",
  items: "",
  order: 0,
  published: true,
};

const pages = [
  { slug: "home", label: "Home", categories: "section, hero, profession, info, links-title", hiddenCategories: ["link"] },
  { slug: "gallery", label: "Gallery", categories: "section, personal, achievements", hiddenCategories: ["projects"] },
  { slug: "projects", label: "Projects", special: "projects" },
  { slug: "blog", label: "Blog", categories: "section, post, article" },
  { slug: "skills", label: "Skills", categories: "section, skill, group" },
  { slug: "certificates", label: "Certificates", categories: "section, tech, other" },
  { slug: "resume", label: "Resume", categories: "section, profile, summary, education, experience, skill, pdf", hiddenCategories: ["link", "project"] },
  { slug: "about", label: "About Me", categories: "section, paragraph, education-title, education" },
  { slug: "contact", label: "Contact", categories: "content, link" },
  { slug: "messages", label: "Messages", special: "messages" },
];

function toProjectForm(project) {
  return {
    ...project,
    tech: Array.isArray(project.tech) ? project.tech.join(", ") : project.tech || "",
  };
}

function toPageForm(item) {
  return {
    ...item,
    items: Array.isArray(item.items) ? item.items.join(", ") : item.items || "",
  };
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const token = getToken();
  const [activeSlug, setActiveSlug] = useState("home");
  const activePage = pages.find((page) => page.slug === activeSlug) || pages[0];
  const managingProjects = activePage.special === "projects";
  const managingMessages = activePage.special === "messages";

  const [projects, setProjects] = useState([]);
  const [pageItems, setPageItems] = useState([]);
  const [messages, setMessages] = useState([]);
  const [projectForm, setProjectForm] = useState(blankProject);
  const [pageForm, setPageForm] = useState(blankPageItem);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  useEffect(() => {
    if (!token) return;
    resetForms();
    if (managingProjects) {
      loadProjects();
    } else if (managingMessages) {
      loadMessages();
    } else {
      loadPageItems();
    }
  }, [token, activeSlug]);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  async function loadProjects() {
    try {
      setProjects(await apiFetch("/projects?all=true"));
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function loadPageItems() {
    try {
      setPageItems(await apiFetch(`/pages/${activeSlug}?all=true`));
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function loadMessages() {
    try {
      setMessages(await apiFetch("/messages"));
    } catch (error) {
      setStatus(error.message);
    }
  }

  function resetForms() {
    setEditingId(null);
    setProjectForm(blankProject);
    setPageForm(blankPageItem);
    setStatus("");
  }

  function logout() {
    clearToken();
    navigate("/admin/login");
  }

  async function saveProject(event) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    const payload = {
      ...projectForm,
      tech: projectForm.tech.split(",").map((item) => item.trim()).filter(Boolean),
    };

    try {
      if (isEditing) {
        await apiFetch(`/projects/${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
        setStatus("Project updated.");
      } else {
        await apiFetch("/projects", { method: "POST", body: JSON.stringify(payload) });
        setStatus("Project added.");
      }
      resetForms();
      await loadProjects();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function savePageItem(event) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    const payload = {
      ...pageForm,
      order: Number(pageForm.order) || 0,
      items: pageForm.items.split(",").map((item) => item.trim()).filter(Boolean),
    };

    try {
      const path = isEditing ? `/pages/${activeSlug}/${editingId}` : `/pages/${activeSlug}`;
      await apiFetch(path, { method: isEditing ? "PUT" : "POST", body: JSON.stringify(payload) });
      setStatus(isEditing ? "Content updated." : "Content added.");
      resetForms();
      await loadPageItems();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function uploadAsset(file) {
    const formData = new FormData();
    formData.append("file", file);
    const data = await apiFetch("/upload", { method: "POST", body: formData });
    return data.url;
  }

  async function uploadProjectImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus("");

    try {
      const url = await uploadAsset(file);
      setProjectForm((current) => ({ ...current, image: url }));
      setStatus("Project image uploaded.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  }

  async function uploadPageImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus("");

    try {
      const url = await uploadAsset(file);
      setPageForm((current) => ({ ...current, image: url }));
      setStatus("Image uploaded.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  }

  async function uploadPageUrlFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus("");

    try {
      const url = await uploadAsset(file);
      setPageForm((current) => ({ ...current, url }));
      setStatus("File URL uploaded.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  }

  async function deleteProject(id) {
    if (!window.confirm("Delete this project?")) return;
    try {
      await apiFetch(`/projects/${id}`, { method: "DELETE" });
      await loadProjects();
      setStatus("Project deleted.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function deletePageItem(id) {
    if (!window.confirm("Delete this content item?")) return;
    try {
      await apiFetch(`/pages/${activeSlug}/${id}`, { method: "DELETE" });
      await loadPageItems();
      setStatus("Content deleted.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function updateMessage(id, updates) {
    try {
      await apiFetch(`/messages/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
      await loadMessages();
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function deleteMessage(id) {
    if (!window.confirm("Delete this message?")) return;
    try {
      await apiFetch(`/messages/${id}`, { method: "DELETE" });
      await loadMessages();
      setStatus("Message deleted.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <section className="admin-shell">
      <div className="admin-header">
        <div>
          <h2>Admin Panel</h2>
          <p>Add, update, publish, hide, and delete portfolio page content.</p>
        </div>
        <button className="admin-secondary" type="button" onClick={logout}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="admin-tabs">
        {pages.map((page) => (
          <button key={page.slug} className={activeSlug === page.slug ? "active" : ""} type="button" onClick={() => setActiveSlug(page.slug)}>
            {page.label}
          </button>
        ))}
      </div>

      {managingProjects ? (
        <ProjectManager
          form={projectForm}
          setForm={setProjectForm}
          projects={projects}
          isEditing={isEditing}
          loading={loading}
          status={status}
          onSubmit={saveProject}
          onEdit={(project) => {
            setEditingId(project._id);
            setProjectForm(toProjectForm(project));
          }}
          onDelete={deleteProject}
          onCancel={resetForms}
          onUploadImage={uploadProjectImage}
        />
      ) : managingMessages ? (
        <MessageManager
          messages={messages}
          status={status}
          onUpdate={updateMessage}
          onDelete={deleteMessage}
        />
      ) : (
        <PageManager
          activePage={activePage}
          form={pageForm}
          setForm={setPageForm}
          items={pageItems.filter((item) => !(activePage.hiddenCategories || []).includes(item.category))}
          isEditing={isEditing}
          loading={loading}
          status={status}
          onSubmit={savePageItem}
          onEdit={(item) => {
            setEditingId(item._id);
            setPageForm(toPageForm(item));
          }}
          onDelete={deletePageItem}
          onCancel={resetForms}
          onUploadImage={uploadPageImage}
          onUploadFile={uploadPageUrlFile}
        />
      )}
    </section>
  );
}

const defaultPageFormConfig = {
  showUrl: true,
  showUploadFile: true,
  showImage: true,
  showItems: true,
  categoryPlaceholder: "",
  titlePlaceholder: "Heading, skill name, link label...",
  textPlaceholder: "Paragraph, caption, description...",
  imagePlaceholder: "https://... or /image.png",
  itemsPlaceholder: "Comma separated list, gallery images, skills, lines...",
  itemsLabel: "Items",
};

const pageFormConfig = {
  default: defaultPageFormConfig,
  home: {
    ...defaultPageFormConfig,
    titlePlaceholder: "Section title or hero heading",
    textPlaceholder: "Section text, hero subtitle, or description...",
    itemsPlaceholder: "Comma separated link labels, bullets, or content items",
  },
  gallery: {
    ...defaultPageFormConfig,
    showUrl: false,
    showUploadFile: false,
    categoryPlaceholder: "section, personal, achievements",
    titlePlaceholder: "Gallery title or caption",
    textPlaceholder: "Caption or description...",
    imagePlaceholder: "Single cover image or leave blank when using gallery items",
    itemsPlaceholder: "Comma separated image URLs for gallery photos",
    itemsLabel: "Gallery Items",
  },
  blog: {
    ...defaultPageFormConfig,
    categoryPlaceholder: "section, post, article",
    showItems: false,
    titlePlaceholder: "Blog post or article title",
    textPlaceholder: "Blog post summary, article content, or excerpt...",
    imagePlaceholder: "Feature image URL",
    itemsPlaceholder: "",
  },
  skills: {
    ...defaultPageFormConfig,
    showUrl: false,
    showUploadFile: false,
    showImage: true,
    titlePlaceholder: "Skill or group heading",
    textPlaceholder: "Optional description for this skill group...",
    imagePlaceholder: "https://... or /image.png",
    itemsPlaceholder: "Comma separated skills",
  },
  certificates: {
    ...defaultPageFormConfig,
    showUploadFile: false,
    showItems: false,
    titlePlaceholder: "Certificate title",
    textPlaceholder: "Issuer, year, and description...",
    imagePlaceholder: "Certificate image URL",
    itemsPlaceholder: "",
  },
  resume: {
    ...defaultPageFormConfig,
    titlePlaceholder: "Section or role title",
    textPlaceholder: "Profile, summary, education, or experience details...",
    imagePlaceholder: "Optional image or logo URL",
    itemsPlaceholder: "Comma separated list items or details",
    itemsLabel: "Details",
  },
  about: {
    ...defaultPageFormConfig,
    showUrl: false,
    showUploadFile: false,
    titlePlaceholder: "Section title",
    textPlaceholder: "Paragraph, caption, or description...",
    imagePlaceholder: "Optional image URL",
    itemsPlaceholder: "Comma separated list items or education entries",
  },
  contact: {
    ...defaultPageFormConfig,
    showUploadFile: false,
    showImage: false,
    showItems: false,
    titlePlaceholder: "Contact title or link label",
    textPlaceholder: "Contact text, address, or caption...",
    imagePlaceholder: "",
    itemsPlaceholder: "",
  },
};

function ProjectManager({ form, setForm, projects, isEditing, loading, status, onSubmit, onEdit, onDelete, onCancel, onUploadImage }) {
  const update = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  return (
    <div className="admin-grid">
      <form className="admin-card admin-form" onSubmit={onSubmit}>
        <h3>{isEditing ? "Edit Project" : "Add Project"}</h3>
        <label>Title<input value={form.title} onChange={(event) => update("title", event.target.value)} required /></label>
        <label>Description<textarea value={form.desc} onChange={(event) => update("desc", event.target.value)} rows="5" required /></label>
        <label>Image URL<input value={form.image} onChange={(event) => update("image", event.target.value)} placeholder="https://... or /image.png" required /></label>
        <label className="admin-file">Upload image<input type="file" accept="image/*" onChange={onUploadImage} /></label>
        <label>Technologies<input value={form.tech} onChange={(event) => update("tech", event.target.value)} placeholder="React, MongoDB, Express" /></label>
        <div className="admin-row">
          <label>Live URL<input value={form.live} onChange={(event) => update("live", event.target.value)} /></label>
          <label>Code URL<input value={form.code} onChange={(event) => update("code", event.target.value)} /></label>
        </div>
        <label className="admin-check"><input type="checkbox" checked={form.published} onChange={(event) => update("published", event.target.checked)} /> Published</label>
        <FormActions isEditing={isEditing} loading={loading} onCancel={onCancel} />
        {status && <div className="admin-status">{status}</div>}
      </form>

      <div className="admin-card admin-list">
        <h3>Projects</h3>
        {projects.map((project) => (
          <div className="admin-project" key={project._id}>
            <img src={buildAssetUrl(project.image)} alt={project.title} />
            <div><h4>{project.title}</h4><p>{project.published ? "Published" : "Hidden"}</p></div>
            <button className="admin-secondary" type="button" onClick={() => onEdit(project)}>Edit</button>
            <button className="admin-danger" type="button" onClick={() => onDelete(project._id)}><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageManager({ activePage, form, setForm, items, isEditing, loading, status, onSubmit, onEdit, onDelete, onCancel, onUploadImage, onUploadFile }) {
  const update = (name, value) => setForm((current) => ({ ...current, [name]: value }));
  const config = pageFormConfig[activePage.slug] || pageFormConfig.default;
  const showUrlField = config.showUrl;
  const showUploadFile = config.showUploadFile;
  const showImageField = config.showImage;
  const showItemsField = config.showItems;
  const categoryPlaceholder = config.categoryPlaceholder;
  const titlePlaceholder = config.titlePlaceholder;
  const textPlaceholder = config.textPlaceholder;
  const imagePlaceholder = config.imagePlaceholder;
  const itemsPlaceholder = config.itemsPlaceholder;
  const itemsLabel = config.itemsLabel || "Items";
  const categoryOptions = Array.from(
    new Set([
      "general",
      ...String(activePage.categories || "")
        .split(",")
        .map((category) => category.trim())
        .filter(Boolean),
      form.category,
    ])
  );

  return (
    <div className="admin-grid">
      <form className="admin-card admin-form" onSubmit={onSubmit}>
        <h3>{isEditing ? `Edit ${activePage.label}` : `Add ${activePage.label} Content`}</h3>
        <p className="admin-muted">Suggested categories: {activePage.categories}</p>
        <div className="admin-row">
          <label>
            Category
            {categoryOptions.length > 0 ? (
              <select value={form.category} onChange={(event) => update("category", event.target.value)} required>
                <option value="" disabled>{categoryPlaceholder || "Select a category"}</option>
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input value={form.category} onChange={(event) => update("category", event.target.value)} placeholder={categoryPlaceholder} required />
            )}
          </label>
          <label>Sort Order<input type="number" value={form.order} onChange={(event) => update("order", event.target.value)} /></label>
        </div>
        <label>Title<input value={form.title} onChange={(event) => update("title", event.target.value)} placeholder={titlePlaceholder} /></label>
        <label>Text<textarea value={form.text} onChange={(event) => update("text", event.target.value)} rows="5" placeholder={textPlaceholder} /></label>
        {showImageField && (
          <>
            <label>Image URL<input value={form.image} onChange={(event) => update("image", event.target.value)} placeholder={imagePlaceholder} /></label>
            <label className="admin-file">Upload image<input type="file" accept="image/*" onChange={onUploadImage} /></label>
          </>
        )}
        {showUrlField && (
          <>
            <label>Link URL<input value={form.url} onChange={(event) => update("url", event.target.value)} placeholder="https://..., mailto:..., /resume.pdf" /></label>
            <label className="admin-file">Upload PDF (optional)
              <input type="file" accept="application/pdf" onChange={onUploadFile} />
            </label>
          </>
        )}
        {showItemsField && (
          <label>{itemsLabel}<input value={form.items} onChange={(event) => update("items", event.target.value)} placeholder={itemsPlaceholder} /></label>
        )}
        <label className="admin-check"><input type="checkbox" checked={form.published} onChange={(event) => update("published", event.target.checked)} /> Published</label>
        <FormActions isEditing={isEditing} loading={loading} onCancel={onCancel} />
        {status && <div className="admin-status">{status}</div>}
      </form>

      <div className="admin-card admin-list">
        <h3>{activePage.label} Content</h3>
        {items.length === 0 ? (
          <p className="admin-muted">No content saved for this page yet.</p>
        ) : (
          items.map((item) => (
            <div className="admin-content-item" key={item._id}>
              {item.image && <img src={buildAssetUrl(item.image)} alt={item.title || item.category} />}
              <div>
                <span>{item.category} {item.published ? "" : "(hidden)"}</span>
                <h4>{item.title || "Untitled"}</h4>
                <p>{item.text || item.url || item.items.join(", ")}</p>
                {activePage.slug === "blog" && (["post", "article"].includes(item.category) || typeof item.agree === "number" || typeof item.disagree === "number") && (
                  <p className="admin-vote-summary">👍 {item.agree || 0} · 👎 {item.disagree || 0}</p>
                )}
              </div>
              <button className="admin-secondary" type="button" onClick={() => onEdit(item)}>Edit</button>
              <button className="admin-danger" type="button" onClick={() => onDelete(item._id)}><Trash2 size={16} /></button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function MessageManager({ messages, status, onUpdate, onDelete }) {
  const unreadCount = messages.filter((message) => !message.read).length;

  return (
    <div className="admin-card admin-list admin-messages">
      <div className="admin-section-title">
        <div>
          <h3>Contact Messages</h3>
          <p className="admin-muted">{unreadCount} unread message{unreadCount === 1 ? "" : "s"}</p>
        </div>
      </div>

      {status && <div className="admin-status">{status}</div>}

      {messages.length === 0 ? (
        <p className="admin-muted">No user messages yet.</p>
      ) : (
        messages.map((message) => (
          <div className={`admin-message ${message.read ? "" : "unread"}`} key={message._id}>
            <div className="admin-message-head">
              <div>
                <span>{message.read ? "Read" : "Unread"} {message.replied ? "· Replied" : ""}</span>
                <h4>{message.subject}</h4>
                <p>{message.name} · {message.contact}</p>
              </div>
              <small>{new Date(message.createdAt).toLocaleString()}</small>
            </div>

            <p className="admin-message-body">{message.message}</p>

            <div className="admin-actions">
              {isEmail(message.contact) ? (
                <a className="admin-secondary" href={emailReplyLink(message)}>
                  <Mail size={16} /> Email Reply
                </a>
              ) : (
                <>
                  <a className="admin-secondary" href={`tel:${digitsOnly(message.contact)}`}>
                    <Phone size={16} /> Call
                  </a>
                  <a className="admin-secondary" href={whatsappReplyLink(message)} target="_blank" rel="noreferrer">
                    <MessageCircle size={16} /> WhatsApp
                  </a>
                </>
              )}
              {!message.read && (
                <button className="admin-secondary" type="button" onClick={() => onUpdate(message._id, { read: true })}>
                  <CheckCircle2 size={16} /> Mark Read
                </button>
              )}
              {!message.replied && (
                <button className="admin-primary" type="button" onClick={() => onUpdate(message._id, { read: true, replied: true })}>
                  <CheckCircle2 size={16} /> Mark Replied
                </button>
              )}
              <button className="admin-danger" type="button" onClick={() => onDelete(message._id)}>
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function FormActions({ isEditing, loading, onCancel }) {
  return (
    <div className="admin-actions">
      <button className="admin-primary" type="submit" disabled={loading}>
        {isEditing ? <Save size={16} /> : <Plus size={16} />}
        {loading ? "Saving..." : isEditing ? "Update" : "Add"}
      </button>
      {isEditing && <button className="admin-secondary" type="button" onClick={onCancel}>Cancel</button>}
    </div>
  );
}

function isEmail(contact) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact);
}

function digitsOnly(contact) {
  return String(contact || "").replace(/\D/g, "");
}

function emailReplyLink(message) {
  const subject = encodeURIComponent(`Re: ${message.subject}`);
  const body = encodeURIComponent(`Hi ${message.name},\n\n\n\nOriginal message:\n${message.message}`);
  return `mailto:${message.contact}?subject=${subject}&body=${body}`;
}

function whatsappReplyLink(message) {
  const phone = normalizeWhatsappPhone(message.contact);
  const text = encodeURIComponent(`Hi ${message.name}, replying to your message about "${message.subject}".`);
  return `https://wa.me/${phone}?text=${text}`;
}

function normalizeWhatsappPhone(contact) {
  const digits = digitsOnly(contact);
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

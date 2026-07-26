import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
const getStats = (templates) => {
  return {
    total: templates?.data?.length || 0,
    types: [...new Set(templates?.data?.map((t) => t.type))].length
  };
};
const onTemplateFilterChange = (newFilters, filterOptions, setActiveFilters, setSearchTerm) => {
  setActiveFilters(newFilters);
  const params = new URLSearchParams(window.location.search);
  const isReset = Object.keys(newFilters).length === 0;
  if (isReset) {
    setSearchTerm("");
    params.delete("search");
  }
  Object.keys(filterOptions).forEach((key) => {
    params.delete(key);
  });
  Object.entries(newFilters).forEach(([key, values]) => {
    if (values && Array.isArray(values) && values.length > 0) {
      params.set(key, values.join(","));
    }
  });
  params.delete("page");
  router.visit(`${window.location.pathname}?${params.toString()}`, {
    preserveState: true,
    preserveScroll: true,
    replace: true,
    only: ["templates", "search", "filters"]
  });
};
const onTemplateSearch = (searchValue, setSearchTerm) => {
  setSearchTerm(searchValue);
  const params = new URLSearchParams(window.location.search);
  if (searchValue && searchValue.trim()) {
    params.set("search", searchValue);
  } else {
    params.delete("search");
  }
  params.delete("page");
  router.visit(`${window.location.pathname}?${params.toString()}`, {
    preserveState: true,
    replace: true,
    preserveScroll: true,
    only: ["templates", "search", "filters"]
  });
};
const getBreadcrumbItems = () => {
  return [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Notification Templates", href: null }
  ];
};
const getGlobalTemplateBreadcrumbItems = () => {
  return [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Gloabl Template", href: null }
  ];
};
const getFilterOptions = () => {
  return {
    type: [
      { value: "both", label: "Both" },
      { value: "outgoing", label: "Outgoing" },
      { value: "incoming", label: "Incoming" }
    ]
  };
};
const insertKeyAtCursor = (editorRef, key) => {
  if (editorRef.current) {
    const editor = editorRef.current.getEditor();
    if (editor) {
      const selection = editor.getSelection();
      const index = selection ? selection.index : 0;
      editor.insertText(index, `{{${key}}}`, {
        background: "#dbeafe",
        color: "#1e40af"
      });
      editor.setSelection(index + `{{${key}}}`.length);
      editor.focus();
    }
  }
  toast.success(`Template key {{${key}}} inserted at cursor position`);
};
const getSampleValue = (key) => {
  const samples = {
    otp_code: "123456",
    time: "2024-01-15 10:30 AM",
    operating_system: "Windows 11",
    ip: "192.168.1.100"
  };
  return samples[key] || `[${key}]`;
};
const generatePreview = (text, templateKeys) => {
  if (!text) return "";
  let preview = text;
  Object.entries(templateKeys).forEach(([key, description]) => {
    const placeholder = `{{${key}}}`;
    const sampleValue = getSampleValue(key);
    preview = preview.replaceAll(placeholder, `<span class="bg-blue-100 text-blue-800 px-1 rounded font-medium">${sampleValue}</span>`);
  });
  return preview;
};
const onTemplateUpdate = async (data, template, submit) => {
  data.id = template.id;
  try {
    await submit({
      method: "POST",
      url: route("admin.notification-templates.update", template?.id) + "?_method=PATCH",
      data
    });
  } catch (error) {
  }
};
export {
  getGlobalTemplateBreadcrumbItems as a,
  getStats as b,
  getBreadcrumbItems as c,
  getFilterOptions as d,
  onTemplateSearch as e,
  onTemplateFilterChange as f,
  generatePreview as g,
  insertKeyAtCursor as i,
  onTemplateUpdate as o
};

import { router } from "@inertiajs/react";
import React__default from "react";
const getPageStats = (pages) => {
  const data = pages || [];
  return {
    total: data.length,
    active: data.filter((page) => page.status === "active").length,
    inactive: data.filter((page) => page.pages === "inactive").length
  };
};
const pageFilterOptions = () => {
  return {
    status: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" }
    ]
  };
};
const onPageSearch = (searchValue, setSearchTerm) => {
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
    preserveScroll: true,
    replace: true,
    only: ["pages", "search", "filters"]
  });
};
const onPageFilterChange = (newFilters, filterOptions, setActiveFilters, setSearchTerm) => {
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
    only: ["pages", "search", "filters"]
  });
};
const getPagesBreadcrumbItems = () => {
  return [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Pages", href: null }
  ];
};
const handleSavePage = async (data, submit, page, form, editorRef, fileInputs) => {
  try {
    await submit({
      method: "POST",
      url: page && page?.id ? route("admin.pages.update", page.id) + "?_method=PATCH" : route("admin.pages.store"),
      data
    });
    form.reset({
      title: "",
      description: ""
    });
    if (editorRef.current) {
      const editor = editorRef.current.getEditor();
      if (editor) {
        editor.setText("");
      }
    }
    fileInputs.forEach((input) => {
      input.value = "";
    });
    form.clearErrors();
  } catch (error) {
  }
};
const onPageDelete = async (id, submit, handleClose) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.pages.destroy", id) + "?_method=DELETE"
    });
    handleClose();
  } catch (error) {
  }
};
const onPageStatusUpdate = async (page, newStatus, submit) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.pages.update.status"),
      data: { id: page.id, value: newStatus }
    });
  } catch (error) {
  }
};
const onPageBulkAction = async (selectedIds, action, submit) => {
  if (selectedIds.length === 0) {
    toast.error("Please select at least one page");
    return;
  }
  try {
    await submit({
      method: "POST",
      url: route("admin.pages.bulk.action"),
      data: { ids: selectedIds, action }
    });
  } catch (error) {
  }
};
const getPageDeleteDialogConfig = (Page) => {
  return {
    title: `Delete Page`,
    description: `Are you sure you want to delete this Page? This action cannot be undone and may affect marketplace organization.`,
    itemName: Page?.title,
    itemType: "Page",
    warningMessage: `Deleting this tag Page permanently remove it and may affect product organization in your marketplace.`,
    showWarningAlert: true,
    showItemDetails: true,
    itemDisplayFields: [
      {
        label: `Page Title`,
        key: "title",
        className: "font-semibold text-gray-900 dark:text-gray-100"
      },
      {
        label: "Slug",
        key: "slug",
        render: (slug) => React__default.createElement(
          "code",
          {
            className: "px-2 py-1 text-xs bg-gray-100 rounded dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          },
          slug
        )
      },
      {
        label: "Status",
        key: "status",
        render: (status) => React__default.createElement(
          "span",
          {
            className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"}`
          },
          status
        )
      },
      {
        label: "Created",
        key: "created_at",
        className: "text-gray-600 dark:text-gray-400"
      }
    ],
    specialWarnings: [
      {
        condition: (Page2) => Page2?.status === "active",
        title: `Active Page`,
        message: `This Page is currently active and visible to users. Consider deactivating it first before deletion.`,
        alertClass: "border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800",
        iconClass: "text-blue-600 dark:text-blue-400",
        textClass: "text-blue-800 dark:text-blue-200"
      }
    ]
  };
};
const getPageSaveBreadcrumbItems = (isEditing) => {
  const items = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Pages", href: "/admin/pages" }
  ];
  items.push({ label: isEditing ? "Edit Page" : "Create Page" });
  return items;
};
export {
  getPageDeleteDialogConfig as a,
  getPagesBreadcrumbItems as b,
  onPageDelete as c,
  onPageSearch as d,
  onPageFilterChange as e,
  onPageBulkAction as f,
  getPageStats as g,
  handleSavePage as h,
  getPageSaveBreadcrumbItems as i,
  onPageStatusUpdate as o,
  pageFilterOptions as p
};

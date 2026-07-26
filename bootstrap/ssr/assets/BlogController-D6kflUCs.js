import { router } from "@inertiajs/react";
import React__default from "react";
const getTagStats = (tags) => {
  const data = tags || [];
  return {
    total: data.length,
    active: data.filter((tag) => tag.status === "active").length,
    inactive: data.filter((tag) => tag.status === "inactive").length,
    blogs_count: data.reduce((sum, tag) => sum + tag.blogs_count, 0)
  };
};
const tagFilterOption = () => {
  return {
    status: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" }
    ]
  };
};
const onTagSearch = (searchValue, setSearchTerm) => {
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
    only: ["tags", "search", "filters"]
  });
};
const onTagFilterChange = (newFilters, filterOptions, setActiveFilters, setSearchTerm) => {
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
    only: ["tags", "search", "filters"]
  });
};
const getTagsBreadcrumbItems = () => {
  return [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Tags", href: null }
  ];
};
const handleSaveTag = async (data, submit, handleClose, tag) => {
  try {
    await submit({
      method: "POST",
      url: tag && tag?.id ? route("admin.blogs-tags.update", tag.id) + "?_method=PATCH" : route("admin.blogs-tags.store"),
      data
    });
    handleClose();
  } catch (error) {
  }
};
const onTagDelete = async (tagId, submit, handleClose) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.blogs-tags.destroy", tagId) + "?_method=DELETE"
    });
    handleClose();
  } catch (error) {
  }
};
const onTagStatusUpdate = async (tag, newStatus, submit) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.blogs-tags.update.status"),
      data: { id: tag.id, value: newStatus }
    });
  } catch (error) {
  }
};
const onTagBulkAction = async (selectedIds, action, submit) => {
  if (selectedIds.length === 0) {
    toast.error("Please select at least one tag");
    return;
  }
  try {
    await submit({
      method: "POST",
      url: route("admin.blogs-tags.bulk.action"),
      data: { ids: selectedIds, action }
    });
  } catch (error) {
  }
};
const getDeleteDialogConfig = (tag) => {
  return {
    title: `Delete tag`,
    description: `Are you sure you want to delete this tag? This action cannot be undone and may affect marketplace organization.`,
    itemName: tag?.name,
    itemType: "Tag",
    warningMessage: `Deleting this tag will permanently remove it and may affect product organization in your marketplace.`,
    showWarningAlert: true,
    showItemDetails: true,
    itemDisplayFields: [
      {
        label: `Tag Name`,
        key: "name",
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
        condition: (tag2) => tag2?.status === "active",
        title: `Active Tag`,
        message: `This tag is currently active and visible to users. Consider deactivating it first before deletion.`,
        alertClass: "border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800",
        iconClass: "text-blue-600 dark:text-blue-400",
        textClass: "text-blue-800 dark:text-blue-200"
      }
    ]
  };
};
const getBlogStats = (blogs) => {
  const data = blogs || [];
  return {
    total: data.length,
    active: data.filter((blog) => blog.status === "active").length,
    inactive: data.filter((blog) => blog.status === "inactive").length
  };
};
const blogFilterOptions = (categories) => {
  return {
    status: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" }
    ],
    categories: categories?.map((cate) => ({
      label: cate?.name,
      value: cate?.id.toString()
    })) || []
  };
};
const onBlogSearch = (searchValue, setSearchTerm) => {
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
    only: ["blogs", "search", "filters", "categories"]
  });
};
const onBlogFilterChange = (newFilters, filterOptions, setActiveFilters, setSearchTerm) => {
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
    only: ["blogs", "search", "filters", "categories"]
  });
};
const getBlogsBreadcrumbItems = () => {
  return [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Blogs", href: null }
  ];
};
const handleSaveBlog = async (data, submit, blog, form, editorRef, fileInputs, clearImagePreview) => {
  try {
    await submit({
      method: "POST",
      url: blog && blog?.id ? route("admin.blogs.update", blog.id) + "?_method=PATCH" : route("admin.blogs.store"),
      data
    });
    form.reset({
      title: "",
      description: "",
      image: null,
      categories: [],
      tags: []
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
    clearImagePreview(null);
  } catch (error) {
    console.log(error);
  }
};
const onBlogDelete = async (id, submit, handleClose) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.blogs.destroy", id) + "?_method=DELETE"
    });
    handleClose();
  } catch (error) {
  }
};
const onBlogStatusUpdate = async (blog, newStatus, submit) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.blogs.update.status"),
      data: { id: blog.id, value: newStatus }
    });
  } catch (error) {
  }
};
const onBlogBulkAction = async (selectedIds, action, submit) => {
  if (selectedIds.length === 0) {
    toast.error("Please select at least one item");
    return;
  }
  try {
    await submit({
      method: "POST",
      url: route("admin.blogs.bulk.action"),
      data: { ids: selectedIds, action }
    });
  } catch (error) {
  }
};
const getBlogDeleteDialogConfig = (blog) => {
  return {
    title: `Delete blog`,
    description: `Are you sure you want to delete this blog? This action cannot be undone and may affect marketplace organization.`,
    itemName: blog?.title,
    itemType: "Blog",
    warningMessage: `Deleting this tag blog permanently remove it and may affect product organization in your marketplace.`,
    showWarningAlert: true,
    showItemDetails: true,
    itemDisplayFields: [
      {
        label: `Blog Title`,
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
        condition: (blog2) => blog2?.status === "active",
        title: `Active Blog`,
        message: `This blog is currently active and visible to users. Consider deactivating it first before deletion.`,
        alertClass: "border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800",
        iconClass: "text-blue-600 dark:text-blue-400",
        textClass: "text-blue-800 dark:text-blue-200"
      }
    ]
  };
};
const getBlogSaveBreadcrumbItems = (isEditing) => {
  const items = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Blogs", href: "/admin/blogs" }
  ];
  items.push({ label: isEditing ? "Edit Blog" : "Create Blog" });
  return items;
};
export {
  getBlogDeleteDialogConfig as a,
  blogFilterOptions as b,
  getBlogsBreadcrumbItems as c,
  onBlogDelete as d,
  onBlogSearch as e,
  onBlogFilterChange as f,
  getBlogStats as g,
  onBlogBulkAction as h,
  handleSaveBlog as i,
  getBlogSaveBreadcrumbItems as j,
  handleSaveTag as k,
  onTagStatusUpdate as l,
  getTagStats as m,
  getDeleteDialogConfig as n,
  onBlogStatusUpdate as o,
  getTagsBreadcrumbItems as p,
  onTagDelete as q,
  onTagSearch as r,
  onTagFilterChange as s,
  tagFilterOption as t,
  onTagBulkAction as u
};

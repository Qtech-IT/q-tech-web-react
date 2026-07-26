import { router } from "@inertiajs/react";
import React__default from "react";
const getAdminStats = (admins) => {
  const data = admins || [];
  const uniqueRoles = [...new Set(data.map((admin) => admin.role_id).filter(Boolean))];
  return {
    total: data.length,
    active: data.filter((admin) => admin.status === "active").length,
    inactive: data.filter((admin) => admin.status === "inactive").length,
    totalRoles: uniqueRoles.length
  };
};
const adminFilterOptions = (roles) => {
  const roleOptions = roles?.map((role) => ({
    value: role.id.toString(),
    label: role.name
  })) || [];
  return {
    status: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" }
    ],
    role: roleOptions
  };
};
const onAdminSearch = (searchValue, setSearchTerm) => {
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
    only: ["admins", "search", "filters"]
  });
};
const onAdminFilterChange = (newFilters, filterOptions, setActiveFilters, setSearchTerm) => {
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
    only: ["admins", "search", "filters"]
  });
};
const getAdminsBreadcrumbItems = () => {
  return [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Admin Users", href: null }
  ];
};
const handleSaveAdmin = async (formData, submit, admin, form) => {
  try {
    const isEditing = admin && admin?.id;
    await submit({
      method: "POST",
      url: isEditing ? route("admin.admin-users.update", admin.id) + "?_method=PUT" : route("admin.admin-users.store"),
      data: formData
    });
    if (!isEditing) {
      form.reset({
        name: "",
        email: "",
        phone: "",
        address: "",
        role_id: "",
        password: "",
        image: null
      });
      form.clearErrors();
    }
  } catch (error) {
    console.error("Admin save error:", error);
  }
};
const onAdminDelete = async (id, submit, handleClose) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.admin-users.destroy", id) + "?_method=DELETE"
    });
    handleClose();
  } catch (error) {
    console.error("Admin delete error:", error);
  }
};
const onAdminStatusUpdate = async (admin, newStatus, submit) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.admin-users.update.status"),
      data: { id: admin.id, value: newStatus }
    });
  } catch (error) {
    console.error("Admin status update error:", error);
  }
};
const onAdminBulkAction = async (selectedIds, action, submit) => {
  if (selectedIds.length === 0) {
    return;
  }
  try {
    await submit({
      method: "POST",
      url: route("admin.admin-users.bulk.action"),
      data: { ids: selectedIds, action }
    });
  } catch (error) {
    console.error("Bulk action error:", error);
  }
};
const getAdminDeleteDialogConfig = (admin) => {
  return {
    title: `Delete Admin User`,
    description: `Are you sure you want to delete this admin user? This action cannot be undone.`,
    itemName: admin?.name,
    itemType: "Admin User",
    warningMessage: `Deleting this admin will permanently remove their account from the system.`,
    showWarningAlert: true,
    showItemDetails: true,
    itemDisplayFields: [
      {
        label: `Admin Name`,
        key: "name",
        className: "font-semibold text-gray-900 dark:text-gray-100"
      },
      {
        label: "Email",
        key: "email",
        className: "text-gray-600 dark:text-gray-400"
      },
      {
        label: "Phone",
        key: "phone",
        render: (phone) => phone || "N/A",
        className: "text-gray-600 dark:text-gray-400"
      },
      {
        label: "Role ID",
        key: "role_id",
        className: "text-gray-600 dark:text-gray-400"
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
    ]
  };
};
const getAdminSaveBreadcrumbItems = (isEditing) => {
  const items = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Admin Users", href: "/admin/admin-users" }
  ];
  items.push({ label: isEditing ? "Edit Admin" : "Create Admin" });
  return items;
};
export {
  adminFilterOptions as a,
  getAdminDeleteDialogConfig as b,
  getAdminsBreadcrumbItems as c,
  onAdminDelete as d,
  onAdminSearch as e,
  onAdminFilterChange as f,
  getAdminStats as g,
  onAdminBulkAction as h,
  handleSaveAdmin as i,
  getAdminSaveBreadcrumbItems as j,
  onAdminStatusUpdate as o
};

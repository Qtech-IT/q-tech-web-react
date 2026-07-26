import { router } from "@inertiajs/react";
import React__default from "react";
const getRoleStats = (roles) => {
  const data = roles || [];
  const totalUsers = data.reduce((sum, role) => sum + (role.admins_count || 0), 0);
  return {
    total: data.length,
    active: data.filter((role) => role.status === "active").length,
    inactive: data.filter((role) => role.status === "inactive").length,
    totalUsers
  };
};
const roleFilterOptions = () => {
  return {
    status: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" }
    ]
  };
};
const onRoleSearch = (searchValue, setSearchTerm) => {
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
    only: ["roles", "search", "filters"]
  });
};
const onRoleFilterChange = (newFilters, filterOptions, setActiveFilters, setSearchTerm) => {
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
    only: ["roles", "search", "filters"]
  });
};
const getRolesBreadcrumbItems = () => {
  return [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Roles & Permissions", href: null }
  ];
};
const handleSaveRole = async (data, submit, role, form) => {
  try {
    const isEditing = role && role?.id;
    await submit({
      method: "POST",
      url: isEditing ? route("admin.roles.update", role.id) + "?_method=PUT" : route("admin.roles.store"),
      data
    });
    if (!isEditing) {
      form.reset({
        name: "",
        permissions: {}
      });
      form.clearErrors();
    }
  } catch (error) {
  }
};
const onRoleDelete = async (id, submit, handleClose) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.roles.destroy", id) + "?_method=DELETE"
    });
    handleClose();
  } catch (error) {
  }
};
const onRoleStatusUpdate = async (role, newStatus, submit) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.roles.update.status"),
      data: { id: role.id, value: newStatus }
    });
  } catch (error) {
  }
};
const onRoleBulkAction = async (selectedIds, action, submit) => {
  if (selectedIds.length === 0) {
    return;
  }
  try {
    await submit({
      method: "POST",
      url: route("admin.roles.bulk.action"),
      data: { ids: selectedIds, action }
    });
  } catch (error) {
  }
};
const getRoleDeleteDialogConfig = (role) => {
  return {
    title: `Delete Role`,
    description: `Are you sure you want to delete this role? This action cannot be undone.`,
    itemName: role?.name,
    itemType: "Role",
    warningMessage: `Deleting this role will permanently remove it from the system.`,
    showWarningAlert: true,
    showItemDetails: true,
    itemDisplayFields: [
      {
        label: `Role Name`,
        key: "name",
        className: "font-semibold text-gray-900 dark:text-gray-100"
      },
      {
        label: "Permissions",
        render: (_, item) => {
          const permissionCount = item?.permissions ? Object.values(item.permissions).flat().length : 0;
          return React__default.createElement(
            "span",
            {
              className: "text-gray-600 dark:text-gray-400"
            },
            `${permissionCount} permissions`
          );
        }
      },
      {
        label: "Assigned Users",
        key: "admins_count",
        render: (count) => React__default.createElement(
          "span",
          {
            className: `font-medium ${count > 0 ? "text-orange-600 dark:text-orange-400" : "text-gray-600 dark:text-gray-400"}`
          },
          `${count || 0} users`
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
        condition: (role2) => role2?.admins_count > 0,
        title: `Users Assigned`,
        message: `This role has ${role?.admins_count || 0} user(s) assigned. You cannot delete a role with assigned users.`,
        alertClass: "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800",
        iconClass: "text-red-600 dark:text-red-400",
        textClass: "text-red-800 dark:text-red-200"
      }
    ]
  };
};
const getRoleSaveBreadcrumbItems = (isEditing) => {
  const items = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Roles & Permissions", href: "/admin/roles" }
  ];
  items.push({ label: isEditing ? "Edit Role" : "Create Role" });
  return items;
};
export {
  getRoleDeleteDialogConfig as a,
  getRolesBreadcrumbItems as b,
  onRoleDelete as c,
  onRoleSearch as d,
  onRoleFilterChange as e,
  onRoleBulkAction as f,
  getRoleStats as g,
  handleSaveRole as h,
  getRoleSaveBreadcrumbItems as i,
  onRoleStatusUpdate as o,
  roleFilterOptions as r
};

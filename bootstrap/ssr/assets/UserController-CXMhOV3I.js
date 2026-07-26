import { router } from "@inertiajs/react";
import React__default from "react";
const getUserStats = (users) => {
  const data = users || [];
  return {
    total: data.length,
    active: data.filter((user) => user.status === "active").length,
    inactive: data.filter((user) => user.status === "inactive").length,
    total_balance: data.reduce((sum, user) => sum + (user.wallet?.balance || 0), 0)
  };
};
const userFilterOptions = () => {
  return {
    status: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" }
    ]
  };
};
const onUserSearch = (searchValue, setSearchTerm) => {
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
    only: ["users", "search", "filters"]
  });
};
const onUserFilterChange = (newFilters, filterOptions, setActiveFilters, setSearchTerm) => {
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
    if (key === "date_range" && values) {
      params.set("date_range", values);
    } else if (values && Array.isArray(values) && values.length > 0) {
      params.set(key, values.join(","));
    }
  });
  params.delete("page");
  router.visit(`${window.location.pathname}?${params.toString()}`, {
    preserveState: true,
    preserveScroll: true,
    replace: true,
    only: ["users", "search", "filters"]
  });
};
const getUsersBreadcrumbItems = () => {
  return [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Users", href: null }
  ];
};
const handleSaveUser = async (data, submit, user, form, fileInputs, clearImagePreview) => {
  try {
    await submit({
      method: "POST",
      url: user && user?.id ? route("admin.users.update", user.id) + "?_method=PATCH" : route("admin.users.store"),
      data
    });
    if (!user) {
      form.reset({
        name: "",
        email: "",
        phone: "",
        password: "",
        address: "",
        image: null
      });
      fileInputs.forEach((input) => {
        input.value = "";
      });
      form.clearErrors();
      clearImagePreview(null);
    }
  } catch (error) {
    console.log(error);
  }
};
const onUserDelete = async (id, submit, handleClose) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.users.destroy", id) + "?_method=DELETE"
    });
    handleClose();
  } catch (error) {
  }
};
const onUserStatusUpdate = async (user, newStatus, submit) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.users.update.status"),
      data: { id: user.id, value: newStatus }
    });
  } catch (error) {
  }
};
const onUserBulkAction = async (selectedIds, action, submit) => {
  if (selectedIds.length === 0) {
    toast.error("Please select at least one user");
    return;
  }
  try {
    await submit({
      method: "POST",
      url: route("admin.users.bulk.action"),
      data: { ids: selectedIds, action }
    });
  } catch (error) {
  }
};
const getUserDeleteDialogConfig = (user) => {
  return {
    title: `Delete user`,
    description: `Are you sure you want to delete this user? This action cannot be undone.`,
    itemName: user?.name,
    itemType: "User",
    warningMessage: `Deleting this user will permanently remove their account and all associated data.`,
    showWarningAlert: true,
    showItemDetails: true,
    itemDisplayFields: [
      {
        label: `User Name`,
        key: "name",
        className: "font-semibold text-gray-900 dark:text-gray-100"
      },
      {
        label: "Email",
        key: "email",
        render: (email) => React__default.createElement(
          "code",
          {
            className: "px-2 py-1 text-xs bg-gray-100 rounded dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          },
          email
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
        condition: (user2) => user2?.wallet?.balance > 0,
        title: `Active Balance`,
        message: `This user has an active balance of ${user?.wallet?.balance}. Consider clearing the balance before deletion.`,
        alertClass: "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800",
        iconClass: "text-red-600 dark:text-red-400",
        textClass: "text-red-800 dark:text-red-200"
      }
    ]
  };
};
const getUserSaveBreadcrumbItems = (isEditing) => {
  const items = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Users", href: "/admin/users" }
  ];
  items.push({ label: isEditing ? "Edit User" : "Create User" });
  return items;
};
const handleWalletAdjustment = async (data, submit, handleClose) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.users.wallet.adjust"),
      data
    });
    handleClose();
  } catch (error) {
    console.log(error);
  }
};
const getTransactionStats = (transactions) => {
  const data = transactions || [];
  return {
    total: data.length,
    completed: data.filter((t) => t.status === "completed").length,
    pending: data.filter((t) => t.status === "pending").length,
    total_amount: data.reduce((sum, t) => sum + (t.net_amount || 0), 0)
  };
};
const transactionFilterOptions = () => {
  return {
    trx_type: [
      { value: "plus", label: "Add" },
      { value: "minus", label: "Subtract" }
    ],
    status: [
      { value: "success", label: "Success" },
      { value: "pending", label: "Pending" },
      { value: "failed", label: "Failed" },
      { value: "rejected", label: "Rejected" }
    ]
  };
};
const onTransactionSearch = (searchValue, setSearchTerm) => {
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
    only: ["transactions", "search", "filters"]
  });
};
const onTransactionFilterChange = (newFilters, filterOptions, setActiveFilters, setSearchTerm) => {
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
    if (key === "date_range" && values) {
      params.set("date_range", values);
    } else if (values && Array.isArray(values) && values.length > 0) {
      params.set(key, values.join(","));
    }
  });
  params.delete("page");
  router.visit(`${window.location.pathname}?${params.toString()}`, {
    preserveState: true,
    preserveScroll: true,
    replace: true,
    only: ["transactions", "search", "filters"]
  });
};
const getTransactionsBreadcrumbItems = () => {
  return [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Transactions", href: null }
  ];
};
export {
  getTransactionsBreadcrumbItems as a,
  onTransactionFilterChange as b,
  onUserStatusUpdate as c,
  getUserStats as d,
  getUserDeleteDialogConfig as e,
  getUsersBreadcrumbItems as f,
  getTransactionStats as g,
  handleWalletAdjustment as h,
  onUserDelete as i,
  onUserSearch as j,
  onUserFilterChange as k,
  onUserBulkAction as l,
  handleSaveUser as m,
  getUserSaveBreadcrumbItems as n,
  onTransactionSearch as o,
  transactionFilterOptions as t,
  userFilterOptions as u
};

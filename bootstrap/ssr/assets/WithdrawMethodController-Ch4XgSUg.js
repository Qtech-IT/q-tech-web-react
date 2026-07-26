import { router } from "@inertiajs/react";
import React__default from "react";
const getWithdrawMethodStats = (methods) => {
  const data = methods || [];
  return {
    total: data.length,
    active: data.filter((method) => method.status === "active").length,
    inactive: data.filter((method) => method.status === "inactive").length
  };
};
const withdrawMethodFilterOptions = () => {
  return {
    status: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" }
    ]
  };
};
const onWithdrawMethodSearch = (searchValue, setSearchTerm) => {
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
    only: ["methods", "search", "filters"]
  });
};
const onWithdrawMethodFilterChange = (newFilters, filterOptions, setActiveFilters, setSearchTerm) => {
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
    only: ["methods", "search", "filters"]
  });
};
const getWithdrawMethodsBreadcrumbItems = () => {
  return [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Withdraw Methods", href: null }
  ];
};
const handleSaveWithdrawMethod = async (data, submit, method, form) => {
  console.log("error");
  try {
    await submit({
      method: "POST",
      url: method && method?.id ? route("admin.withdraw-methods.update", method.id) + "?_method=PATCH" : route("admin.withdraw-methods.store"),
      data
    });
    form.reset({
      name: "",
      currency_code: "",
      currency_symbol: "",
      min_limit: "0",
      max_limit: "0",
      fixed_charge: "0",
      percent_charge: "0",
      config: []
    });
    form.clearErrors();
  } catch (error) {
  }
};
const onWithdrawMethodDelete = async (id, submit, handleClose) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.withdraw-methods.destroy", id) + "?_method=DELETE"
    });
    handleClose();
  } catch (error) {
  }
};
const onWithdrawMethodStatusUpdate = async (method, newStatus, submit) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.withdraw-methods.update.status"),
      data: { id: method.id, value: newStatus }
    });
  } catch (error) {
  }
};
const onWithdrawMethodBulkAction = async (selectedIds, action, submit) => {
  if (selectedIds.length === 0) {
    return;
  }
  try {
    await submit({
      method: "POST",
      url: route("admin.withdraw-methods.bulk.action"),
      data: { ids: selectedIds, action }
    });
  } catch (error) {
  }
};
const getWithdrawMethodDeleteDialogConfig = (method) => {
  return {
    title: `Delete Withdraw Method`,
    description: `Are you sure you want to delete this withdraw method? This action cannot be undone and may affect user withdrawals.`,
    itemName: method?.name,
    itemType: "Withdraw Method",
    warningMessage: `Deleting this withdraw method will permanently remove it and users will no longer be able to use it for withdrawals.`,
    showWarningAlert: true,
    showItemDetails: true,
    itemDisplayFields: [
      {
        label: `Method Name`,
        key: "name",
        className: "font-semibold text-gray-900 dark:text-gray-100"
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
        condition: (method2) => method2?.status === "active",
        title: `Active Method`,
        message: `This withdraw method is currently active and available to users. Consider deactivating it first before deletion.`,
        alertClass: "border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800",
        iconClass: "text-blue-600 dark:text-blue-400",
        textClass: "text-blue-800 dark:text-blue-200"
      }
    ]
  };
};
const getWithdrawMethodSaveBreadcrumbItems = (isEditing) => {
  const items = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Withdraw Methods", href: "/admin/withdraw-methods" }
  ];
  items.push({ label: isEditing ? "Edit Method" : "Create Method" });
  return items;
};
export {
  getWithdrawMethodDeleteDialogConfig as a,
  getWithdrawMethodsBreadcrumbItems as b,
  onWithdrawMethodDelete as c,
  onWithdrawMethodSearch as d,
  onWithdrawMethodFilterChange as e,
  onWithdrawMethodBulkAction as f,
  getWithdrawMethodStats as g,
  handleSaveWithdrawMethod as h,
  getWithdrawMethodSaveBreadcrumbItems as i,
  onWithdrawMethodStatusUpdate as o,
  withdrawMethodFilterOptions as w
};

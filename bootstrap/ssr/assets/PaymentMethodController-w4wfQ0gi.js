import { router } from "@inertiajs/react";
import React__default from "react";
const getPaymentMethodStats = (methods) => {
  const data = methods || [];
  return {
    total: data.length,
    active: data.filter((method) => method.status === "active").length,
    inactive: data.filter((method) => method.status === "inactive").length,
    automatic: data.filter((method) => !method.is_manual).length,
    manual: data.filter((method) => method.is_manual).length
  };
};
const paymentMethodFilterOptions = () => {
  return {
    status: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" }
    ],
    type: [
      { value: "automatic", label: "Automatic" },
      { value: "manual", label: "Manual" }
    ]
  };
};
const onPaymentMethodSearch = (searchValue, setSearchTerm) => {
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
const onPaymentMethodFilterChange = (newFilters, filterOptions, setActiveFilters, setSearchTerm) => {
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
const getPaymentMethodsBreadcrumbItems = () => {
  return [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Payment Methods", href: null }
  ];
};
const handleSavePaymentMethod = async (data, submit, method, form) => {
  try {
    const isEditing = method && method?.id;
    await submit({
      method: "POST",
      url: isEditing ? route("admin.payment-methods.update", method.id) + "?_method=PUT" : route("admin.payment-methods.store"),
      data
    });
    if (!isEditing) {
      form.reset({
        name: "",
        gateway_code: "",
        currency_code: "",
        currency_symbol: "",
        min_limit: "0",
        max_limit: "0",
        exchange_rate: "1",
        percent_fee: "0",
        fixed_fee: "0",
        is_manual: false,
        config: []
      });
      form.clearErrors();
    }
  } catch (error) {
  }
};
const onPaymentMethodDelete = async (id, submit, handleClose) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.payment-methods.destroy", id) + "?_method=DELETE"
    });
    handleClose();
  } catch (error) {
  }
};
const onPaymentMethodStatusUpdate = async (method, newStatus, submit) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.payment-methods.update.status"),
      data: { id: method.id, value: newStatus }
    });
  } catch (error) {
  }
};
const onPaymentMethodBulkAction = async (selectedIds, action, submit) => {
  if (selectedIds.length === 0) {
    return;
  }
  try {
    await submit({
      method: "POST",
      url: route("admin.payment-methods.bulk.action"),
      data: { ids: selectedIds, action }
    });
  } catch (error) {
  }
};
const getPaymentMethodDeleteDialogConfig = (method) => {
  return {
    title: `Delete Payment Method`,
    description: `Are you sure you want to delete this payment method? This action cannot be undone and may affect user transactions.`,
    itemName: method?.name,
    itemType: "Payment Method",
    warningMessage: `Deleting this payment method will permanently remove it and users will no longer be able to use it for payments.`,
    showWarningAlert: true,
    showItemDetails: true,
    itemDisplayFields: [
      {
        label: `Method Name`,
        key: "name",
        className: "font-semibold text-gray-900 dark:text-gray-100"
      },
      {
        label: "Gateway Code",
        key: "gateway_code",
        render: (code) => React__default.createElement(
          "code",
          {
            className: "px-2 py-1 text-xs bg-gray-100 rounded dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          },
          code
        )
      },
      {
        label: "Type",
        key: "is_manual",
        render: (isManual) => React__default.createElement(
          "span",
          {
            className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isManual ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"}`
          },
          isManual ? "Manual" : "Automatic"
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
        condition: (method2) => method2?.status === "active",
        title: `Active Method`,
        message: `This payment method is currently active and available to users. Consider deactivating it first before deletion.`,
        alertClass: "border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800",
        iconClass: "text-blue-600 dark:text-blue-400",
        textClass: "text-blue-800 dark:text-blue-200"
      }
    ]
  };
};
const getPaymentMethodSaveBreadcrumbItems = (isEditing) => {
  const items = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Payment Methods", href: "/admin/payment-methods" }
  ];
  items.push({ label: isEditing ? "Edit Method" : "Create Method" });
  return items;
};
export {
  getPaymentMethodDeleteDialogConfig as a,
  getPaymentMethodsBreadcrumbItems as b,
  onPaymentMethodDelete as c,
  onPaymentMethodSearch as d,
  onPaymentMethodFilterChange as e,
  onPaymentMethodBulkAction as f,
  getPaymentMethodStats as g,
  handleSavePaymentMethod as h,
  getPaymentMethodSaveBreadcrumbItems as i,
  onPaymentMethodStatusUpdate as o,
  paymentMethodFilterOptions as p
};

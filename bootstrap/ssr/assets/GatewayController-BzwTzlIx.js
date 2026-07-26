import React__default from "react";
const setMailGatewayFilterData = (gateways, searchTerm, activeFilters, setFilteredGateways) => {
  let filtered = gateways?.data || [];
  if (searchTerm.trim()) {
    filtered = filtered.filter(
      (gateway) => gateway.credential.name.toLowerCase().includes(searchTerm.toLowerCase()) || gateway.key.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  Object.entries(activeFilters).forEach(([filterType, values]) => {
    if (values.length > 0) {
      filtered = filtered.filter((gateway) => {
        switch (filterType) {
          case "status":
            return values.includes(gateway.status);
          case "type":
            return values.includes(gateway.credential.name);
          case "is_default":
            return values.includes(gateway.is_default ? "default" : "not_default");
          default:
            return true;
        }
      });
    }
  });
  setFilteredGateways(filtered);
};
const handleEmailGatewayUpdate = async (data, submitFn) => {
  try {
    await submitFn({
      method: "POST",
      url: route("admin.email-gateways.update", data?.id) + "?_method=PATCH",
      data,
      preserveScroll: true
    });
  } catch (error) {
  }
};
const handleTestEmailGateway = async (gateway, data, submitFn, form) => {
  data.id = gateway?.id;
  try {
    await submitFn({
      method: "POST",
      url: route("admin.email-gateways.test"),
      data
    });
    form.reset({
      email: ""
    });
  } catch (error) {
  }
};
const handleSetDefaultlGateway = async (gateway, submitFn) => {
  try {
    await submitFn({
      method: "POST",
      url: route("admin.email-gateways.make.default"),
      data: {
        id: gateway?.id
      }
    });
  } catch (error) {
  }
};
const setFirebaseGatewayFilterData = (gateways, searchTerm, activeFilters, setFilteredGateways) => {
  let filtered = gateways?.data || [];
  if (searchTerm.trim()) {
    filtered = filtered.filter(
      (gateway) => gateway.key.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  Object.entries(activeFilters).forEach(([filterType, values]) => {
    if (values.length > 0) {
      filtered = filtered.filter((gateway) => {
        switch (filterType) {
          case "status":
            return values.includes(gateway.status);
          case "type":
            return values.includes(gateway.credential.name);
          case "is_default":
            return values.includes(gateway.is_default ? "default" : "not_default");
          default:
            return true;
        }
      });
    }
  });
  setFilteredGateways(filtered);
};
const getDeleteDialogConfig = (gateways, selectedGateway) => {
  return {
    title: "Delete Firebase Gateway",
    description: "Are you sure you want to delete this Firebase gateway? This action cannot be undone and will affect push notification delivery.",
    itemName: selectedGateway?.key || "Gateway",
    itemType: "Firebase Gateway",
    warningMessage: "Deleting this gateway will permanently remove all its configuration data and may disrupt push notification services.",
    showWarningAlert: true,
    showItemDetails: true,
    itemDisplayFields: [
      {
        label: "Gateway Key",
        key: "key",
        className: " text-sm"
      },
      {
        label: "Status",
        key: "status",
        render: (status) => React__default.createElement(
          "span",
          {
            className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}`
          },
          status
        )
      },
      {
        label: "Credential",
        key: "credential",
        render: (credential) => credential || "Not specified"
      },
      {
        label: "Default Gateway",
        key: "is_default",
        render: (isDefault) => React__default.createElement(
          "span",
          {
            className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isDefault ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"}`
          },
          isDefault ? "Yes" : "No"
        )
      },
      {
        label: "Created",
        key: "created_at",
        render: (createdAt) => {
          if (!createdAt) return "Unknown";
          return new Date(createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });
        }
      }
    ],
    specialWarnings: [
      {
        condition: (gateway) => gateway?.is_default === true,
        title: "Default Gateway Warning",
        message: "This is your default Firebase gateway. Deleting it may cause push notifications to fail until you set another gateway as default.",
        alertClass: "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800",
        iconClass: "text-red-600 dark:text-red-400",
        textClass: "text-red-800 dark:text-red-200"
      },
      {
        condition: (gateway) => gateway?.status === "active",
        title: "Active Gateway",
        message: "This gateway is currently active and may be handling live push notifications. Consider disabling it first before deletion.",
        alertClass: "border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800",
        iconClass: "text-orange-600 dark:text-orange-400",
        textClass: "text-orange-800 dark:text-orange-200"
      },
      {
        condition: (gateway) => {
          const totalGateways = gateways?.data?.length || 0;
          return totalGateways === 1;
        },
        title: "Last Gateway Warning",
        message: "This is your only Firebase gateway. Deleting it will completely disable push notification functionality.",
        alertClass: "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800",
        iconClass: "text-red-600 dark:text-red-400",
        textClass: "text-red-800 dark:text-red-200"
      }
    ]
  };
};
const handleSaveFirebaseGateway = async (data, submitFn, isEditing, gateway, handleClose) => {
  try {
    if (isEditing) data.id = gateway?.id;
    await submitFn({
      method: "POST",
      url: isEditing ? route("admin.firebase-gateways.update", gateway.id) + "?_method=PATCH" : route("admin.firebase-gateways.store"),
      data
    });
    handleClose();
  } catch (error) {
  }
};
const handleSetDefaultlFirebaseGateway = async (gateway, submitFn) => {
  try {
    await submitFn({
      method: "POST",
      url: route("admin.firebase-gateways.make.default"),
      data: {
        id: gateway?.id
      }
    });
  } catch (error) {
  }
};
const handleDeleteFirebaseGateway = async (gateway, submitFn, handleClose) => {
  try {
    await submitFn({
      method: "POST",
      url: route("admin.firebase-gateways.destroy", gateway.id) + "?_method=DELETE"
    });
    handleClose();
  } catch (error) {
  }
};
export {
  handleSaveFirebaseGateway as a,
  handleDeleteFirebaseGateway as b,
  handleEmailGatewayUpdate as c,
  handleTestEmailGateway as d,
  handleSetDefaultlGateway as e,
  setMailGatewayFilterData as f,
  getDeleteDialogConfig as g,
  handleSetDefaultlFirebaseGateway as h,
  setFirebaseGatewayFilterData as s
};


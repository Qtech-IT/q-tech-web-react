import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { m as Dialog, n as DialogContent, o as DialogHeader, p as DialogTitle, q as DialogDescription } from "./Sheet-B-_2BaZp.js";
import { B as Button } from "./Button-CFMlPXiE.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./MarketGrid-DlkazA02.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { A as Alert, a as AlertDescription } from "./Alert-3s5DZB4H.js";
import { CheckCircle, XCircle, AlertTriangle, Circle } from "lucide-react";
import { C as Card, a as CardContent } from "./Card-CQ2ij0--.js";
import { B as Badge } from "./Badge-B6jlhcU-.js";
function BulkActionDialog({
  open,
  onOpenChange,
  selectedItems = [],
  config = {},
  onApply,
  loading = false
}) {
  const defaultConfig = {
    title: "Bulk Actions",
    description: "Apply an action to selected items.",
    actions: [
      { value: "active", label: "Activate", icon: CheckCircle },
      { value: "inactive", label: "Deactivate", icon: XCircle },
      { value: "delete", label: "Delete", icon: AlertTriangle }
    ],
    warningMessage: "This action will affect multiple items. Proceed with caution.",
    showWarningAlert: true,
    confirmationRequired: false
  };
  const finalConfig = { ...defaultConfig, ...config };
  const [selectedAction, setSelectedAction] = useState("");
  const handleClose = () => {
    onOpenChange(false);
    setSelectedAction("");
  };
  const handleApply = () => {
    if (selectedAction && selectedItems.length > 0) {
      onApply(selectedItems, selectedAction);
      handleClose();
    }
  };
  const selectedActionConfig = finalConfig.actions.find(
    (action) => action.value === selectedAction
  );
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxs(DialogContent, { className: "w-full max-w-[95vw] sm:max-w-[500px]", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2 pr-8", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "w-5 h-5 text-orange-500" }),
        finalConfig.title
      ] }),
      /* @__PURE__ */ jsx(DialogDescription, { children: finalConfig.description })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      finalConfig.showWarningAlert && /* @__PURE__ */ jsxs(Alert, { className: "border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 text-orange-600 dark:text-orange-400" }),
        /* @__PURE__ */ jsx(AlertDescription, { className: "text-orange-800 dark:text-orange-200", children: finalConfig.warningMessage })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 text-blue-600" }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium", children: [
            selectedItems.length,
            " item",
            selectedItems.length !== 1 ? "s" : "",
            " selected"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300", children: "Select Action" }),
          /* @__PURE__ */ jsxs(Select, { value: selectedAction, onValueChange: setSelectedAction, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Choose an action to apply" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: finalConfig.actions.map((action) => {
              const IconComponent = action.icon;
              return /* @__PURE__ */ jsx(SelectItem, { value: action.value, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(IconComponent, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { children: action.label })
              ] }) }, action.value);
            }) })
          ] })
        ] }),
        selectedActionConfig?.description && /* @__PURE__ */ jsx(Alert, { className: "border-blue-200 bg-blue-50 dark:bg-blue-900/20", children: /* @__PURE__ */ jsxs(AlertDescription, { className: "text-sm text-blue-800 dark:text-blue-200", children: [
          /* @__PURE__ */ jsx("strong", { children: "Action details:" }),
          " ",
          selectedActionConfig.description
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col-reverse gap-3 sm:flex-row sm:justify-end", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: handleClose,
          disabled: loading,
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: selectedAction === "delete" ? "destructive" : "default",
          onClick: handleApply,
          disabled: !selectedAction || selectedItems.length === 0 || loading,
          children: /* @__PURE__ */ jsx(
            ButtonLoader,
            {
              isSubmitting: loading,
              btnText: `Apply ${selectedActionConfig?.label || "Action"}`,
              loaderText: "Applying..."
            }
          )
        }
      )
    ] })
  ] }) });
}
const BulkActionsCard = ({ selectedItems, onOpenBulkDialog, onClearSelection }) => {
  if (selectedItems.length === 0) return null;
  return /* @__PURE__ */ jsx(Card, { className: "mb-4 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" }),
      /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-sm font-medium", children: [
        selectedItems.length,
        " items selected"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: onOpenBulkDialog,
          variant: "outline",
          className: "min-w-[140px]",
          children: [
            /* @__PURE__ */ jsx(Circle, { className: "w-4 h-4 mr-2" }),
            "Bulk Actions"
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          onClick: onClearSelection,
          children: "Cancel Selection"
        }
      )
    ] })
  ] }) }) });
};
export {
  BulkActionsCard as B,
  BulkActionDialog as a
};

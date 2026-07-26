import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { m as Dialog, n as DialogContent, o as DialogHeader, p as DialogTitle, q as DialogDescription } from "./Sheet-B-_2BaZp.js";
import { B as Button } from "./Button-CFMlPXiE.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { Trash2, AlertTriangle } from "lucide-react";
import { A as Alert, a as AlertDescription } from "./Alert-3s5DZB4H.js";
function DeleteDialog({
  open,
  onOpenChange,
  item = null,
  config = {},
  onDelete
}) {
  const { loading: isSubmitting, submit } = useForm();
  const defaultConfig = {
    title: "Delete Item",
    description: "Are you sure you want to delete this item? This action cannot be undone.",
    itemName: "Item",
    itemType: "item",
    warningMessage: "Deleting this item will permanently remove all its data.",
    showWarningAlert: true,
    showItemDetails: true,
    deleteEndpoint: null,
    itemDisplayFields: [],
    specialWarnings: []
  };
  const finalConfig = { ...defaultConfig, ...config };
  const handleClose = () => {
    onOpenChange(false);
  };
  if (!item) return null;
  const specialWarnings = finalConfig.specialWarnings.filter(
    (warning) => warning.condition(item)
  );
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxs(DialogContent, { className: "w-full max-w-[95vw] sm:max-w-[500px] max-h-[90vh] flex flex-col", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { className: "flex-shrink-0", children: [
      /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2 pr-8 text-red-600 dark:text-red-400", children: [
        /* @__PURE__ */ jsx(Trash2, { className: "w-5 h-5" }),
        finalConfig.title
      ] }),
      /* @__PURE__ */ jsx(DialogDescription, { children: finalConfig.description })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "px-1 space-y-4", children: [
      finalConfig.showWarningAlert && /* @__PURE__ */ jsxs(Alert, { className: "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 text-red-600 dark:text-red-400" }),
        /* @__PURE__ */ jsxs(AlertDescription, { className: "text-red-800 dark:text-red-200", children: [
          /* @__PURE__ */ jsx("strong", { children: "Warning:" }),
          " ",
          finalConfig.warningMessage
        ] })
      ] }),
      finalConfig.showItemDetails && finalConfig.itemDisplayFields.length > 0 && /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-lg bg-gray-50 dark:bg-gray-900", children: [
        /* @__PURE__ */ jsx("h4", { className: "mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100", children: "Item Details" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: finalConfig.itemDisplayFields.map((field, index) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex-shrink-0 min-w-0 text-sm font-medium text-gray-700 dark:text-gray-300", children: [
            field.label,
            ":"
          ] }),
          /* @__PURE__ */ jsx("span", { className: `text-sm break-words ${field.className || "text-gray-600 dark:text-gray-400"}`, children: field.render ? field.render(item[field.key]) : item[field.key] })
        ] }, index)) })
      ] }),
      specialWarnings.map((warning, index) => /* @__PURE__ */ jsxs(
        Alert,
        {
          className: `${warning.alertClass || "border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800"}`,
          children: [
            /* @__PURE__ */ jsx(AlertTriangle, { className: `w-4 h-4 flex-shrink-0 ${warning.iconClass || "text-orange-600 dark:text-orange-400"}` }),
            /* @__PURE__ */ jsxs(AlertDescription, { className: `${warning.textClass || "text-orange-800 dark:text-orange-200"}`, children: [
              /* @__PURE__ */ jsxs("strong", { children: [
                warning.title || "Note",
                ":"
              ] }),
              " ",
              warning.message
            ] })
          ]
        },
        index
      ))
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-end flex-shrink-0 gap-3 pt-4 bg-white border-t sm:flex-row dark:bg-gray-950", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: handleClose,
          disabled: isSubmitting,
          className: "order-2 w-full sm:w-auto sm:order-1",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "destructive",
          onClick: () => onDelete(item?.id, submit, handleClose),
          disabled: isSubmitting,
          className: "order-1 w-full sm:w-auto sm:order-2",
          children: /* @__PURE__ */ jsx(
            ButtonLoader,
            {
              isSubmitting,
              btnText: `Delete`,
              loaderText: "Deleting...",
              icon: isSubmitting ? null : /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4 " })
            }
          )
        }
      )
    ] })
  ] }) });
}
export {
  DeleteDialog as D
};

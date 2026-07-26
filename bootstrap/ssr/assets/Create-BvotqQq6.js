import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { router, Head } from "@inertiajs/react";
import { B as BaseLayout, A as AuthenticatedLayout, M as Main } from "./Main-BjCbeyG1.js";
import { B as Button, k as keyToValue } from "./Button-CFMlPXiE.js";
import { C as CommonLayoutHeader } from "./CommonLayoutHeader-CyKOpByu.js";
import * as LucideIcons from "lucide-react";
import { Info, Save, ArrowLeft, Plus, Settings, Trash2, Upload, X, CheckCircle, Eye, Layout } from "lucide-react";
import { useForm as useForm$1, useFieldArray } from "react-hook-form";
import * as RadixIcons from "@radix-ui/react-icons";
import { F as Form, a as FormField, b as FormItem, c as FormLabel, e as FormDescription, d as FormControl, f as FormMessage } from "./Form-dg4L2iRR.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import { T as Textarea } from "./constants-4k_q_jeE.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./Card-CQ2ij0--.js";
import { A as Alert, a as AlertDescription } from "./Alert-3s5DZB4H.js";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./MarketGrid-DlkazA02.js";
import { h as handleSave } from "./AppearanceController-DmPoT0M9.js";
import "./Sheet-B-_2BaZp.js";
import "@radix-ui/react-direction";
import "class-variance-authority";
import "@radix-ui/react-avatar";
import "@radix-ui/react-separator";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "@radix-ui/react-dialog";
import "@radix-ui/react-scroll-area";
import "react-icons/fa";
import "@radix-ui/react-slot";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-alert-dialog";
import "./AuthController-DaCguZ7K.js";
import "./TradeDialog-Dt4WEyMP.js";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-tabs";
import "framer-motion";
import "./SlideUp-CpffxXZf.js";
import "./Label-BxDBN09D.js";
import "@radix-ui/react-label";
import "react-hot-toast";
import "@radix-ui/react-radio-group";
import "clsx";
import "tailwind-merge";
import "./Breadcrumb-D0MBns-9.js";
import "./BlogSection-DiGfvTON.js";
import "./EmptyData-DjqqIMwS.js";
import "./BlogCard-Jrl9AHYg.js";
import "@radix-ui/react-switch";
import "@radix-ui/react-accordion";
import "motion/react";
import "./PaginationWrapper-B-KWAp7V.js";
import "./Table-Dz-EvWd_.js";
import "./demo-data-C5EGh9Nk.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
import "@radix-ui/react-select";
import "./Progress-DT6CA82_.js";
import "@radix-ui/react-progress";
import "react-icons/bs";
function DynamicIcon({ iconName, iconLibrary = "lucide", className = "w-4 h-4" }) {
  if (!iconName) return null;
  try {
    if (iconLibrary === "lucide") {
      const Icon = LucideIcons[iconName];
      return Icon ? /* @__PURE__ */ jsx(Icon, { className }) : null;
    } else if (iconLibrary === "radix") {
      const Icon = RadixIcons[iconName];
      return Icon ? /* @__PURE__ */ jsx(Icon, { className }) : null;
    }
  } catch (error) {
    console.warn(`Icon ${iconName} not found in ${iconLibrary}`);
    return null;
  }
}
function TextField({ field, fieldConfig, form }) {
  return /* @__PURE__ */ jsx(
    FormField,
    {
      control: form.control,
      name: field,
      render: ({ field: formField }) => /* @__PURE__ */ jsxs(FormItem, { children: [
        /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
          fieldConfig.label,
          fieldConfig.required && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
        ] }),
        /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
          Input,
          {
            type: fieldConfig.type,
            placeholder: fieldConfig.placeholder || "",
            ...formField
          }
        ) }),
        fieldConfig.description && /* @__PURE__ */ jsx(FormDescription, { children: fieldConfig.description }),
        /* @__PURE__ */ jsx(FormMessage, {})
      ] })
    }
  );
}
function TextareaField({ field, fieldConfig, form }) {
  return /* @__PURE__ */ jsx(
    FormField,
    {
      control: form.control,
      name: field,
      render: ({ field: formField }) => /* @__PURE__ */ jsxs(FormItem, { children: [
        /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
          fieldConfig.label,
          fieldConfig.required && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
        ] }),
        /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
          Textarea,
          {
            placeholder: fieldConfig.placeholder || "",
            rows: fieldConfig.rows || 4,
            className: "min-h-[100px]",
            ...formField
          }
        ) }),
        fieldConfig.description && /* @__PURE__ */ jsx(FormDescription, { children: fieldConfig.description }),
        /* @__PURE__ */ jsx(FormMessage, {})
      ] })
    }
  );
}
function ImageField({ field, fieldConfig, form, imagePreviews, setImagePreviews }) {
  const watchImage = form.watch(field);
  const handleImageChange = (e, onChange) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews((prev) => ({ ...prev, [field]: previewUrl }));
      onChange(file);
    }
  };
  const clearImagePreview = (onChange) => {
    setImagePreviews((prev) => ({ ...prev, [field]: null }));
    onChange(null);
    const fileInput = document.querySelector(`input[name="${field}"]`);
    if (fileInput) fileInput.value = "";
  };
  return /* @__PURE__ */ jsx(
    FormField,
    {
      control: form.control,
      name: field,
      render: ({ field: { onChange, ...rest } }) => /* @__PURE__ */ jsxs(FormItem, { children: [
        /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4" }),
          fieldConfig.label,
          fieldConfig.required ? /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" }) : /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Optional" })
        ] }),
        /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                name: field,
                accept: fieldConfig.accept || "image/*",
                onChange: (e) => handleImageChange(e, onChange),
                className: "flex w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              }
            ) }),
            imagePreviews[field] && /* @__PURE__ */ jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                onClick: () => clearImagePreview(onChange),
                className: "text-red-600 hover:text-red-700",
                children: [
                  /* @__PURE__ */ jsx(X, { className: "w-3 h-3 mr-1" }),
                  "Clear"
                ]
              }
            )
          ] }),
          imagePreviews[field] ? /* @__PURE__ */ jsx("div", { className: "relative inline-block w-full", children: /* @__PURE__ */ jsx("div", { className: "p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-900", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: imagePreviews[field],
                alt: "Preview",
                className: "object-cover w-full h-48 border rounded-lg"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-green-600", children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "w-3 h-3" }),
                watchImage ? "Image ready for upload" : "Current image"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-500", children: [
                /* @__PURE__ */ jsx(Eye, { className: "w-3 h-3" }),
                "Preview"
              ] })
            ] })
          ] }) }) }) : /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600", children: [
            /* @__PURE__ */ jsx(Upload, { className: "w-8 h-8 mb-2 text-gray-400" }),
            /* @__PURE__ */ jsx("p", { className: "mb-1 text-sm text-gray-500", children: "No image selected" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: "Click to upload" })
          ] }) })
        ] }) }),
        fieldConfig.description && /* @__PURE__ */ jsx(FormDescription, { children: fieldConfig.description }),
        /* @__PURE__ */ jsx(FormMessage, {})
      ] })
    }
  );
}
function SelectField({ field, fieldConfig, form }) {
  return /* @__PURE__ */ jsx(
    FormField,
    {
      control: form.control,
      name: field,
      render: ({ field: formField }) => /* @__PURE__ */ jsxs(FormItem, { children: [
        /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
          fieldConfig.label,
          fieldConfig.required && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
        ] }),
        /* @__PURE__ */ jsxs(
          Select,
          {
            onValueChange: formField.onChange,
            defaultValue: formField.value,
            children: [
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: `Select ${fieldConfig.label}` }) }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: fieldConfig.options?.map((option) => /* @__PURE__ */ jsx(SelectItem, { value: option.value, children: option.label }, option.value)) })
            ]
          }
        ),
        fieldConfig.description && /* @__PURE__ */ jsx(FormDescription, { children: fieldConfig.description }),
        /* @__PURE__ */ jsx(FormMessage, {})
      ] })
    }
  );
}
function ColorField({ field, fieldConfig, form }) {
  return /* @__PURE__ */ jsx(
    FormField,
    {
      control: form.control,
      name: field,
      render: ({ field: formField }) => /* @__PURE__ */ jsxs(FormItem, { children: [
        /* @__PURE__ */ jsx(FormLabel, { children: fieldConfig.label }),
        /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "color",
              className: "w-20 h-10",
              ...formField
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "text",
              placeholder: fieldConfig.placeholder || "#000000",
              ...formField
            }
          )
        ] }) }),
        fieldConfig.description && /* @__PURE__ */ jsx(FormDescription, { children: fieldConfig.description }),
        /* @__PURE__ */ jsx(FormMessage, {})
      ] })
    }
  );
}
function CheckboxField({ field, fieldConfig, form }) {
  return /* @__PURE__ */ jsx(
    FormField,
    {
      control: form.control,
      name: field,
      render: ({ field: formField }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex items-center justify-between p-4 border rounded-lg", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(FormLabel, { className: "text-base", children: fieldConfig.label }),
          fieldConfig.description && /* @__PURE__ */ jsx(FormDescription, { children: fieldConfig.description })
        ] }),
        /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            className: "w-10 h-5",
            checked: formField.value,
            onChange: formField.onChange
          }
        ) }),
        /* @__PURE__ */ jsx(FormMessage, {})
      ] })
    }
  );
}
function RepeaterField({ field, fieldConfig, form, imagePreviews, setImagePreviews, setUnlinkImages }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: field
  });
  const getDefaultValues = () => {
    const defaults = {};
    Object.entries(fieldConfig.fields).forEach(([key, config]) => {
      defaults[key] = config.default || "";
    });
    return defaults;
  };
  const getImageByIndex = (imagePreviews2, index) => {
    Object.keys(imagePreviews2).find((k) => k.endsWith(`.${index}.image`));
    return index;
  };
  return /* @__PURE__ */ jsxs(Card, { className: "border-purple-200 bg-purple-50/30 dark:bg-purple-950/30", children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(DynamicIcon, { iconName: "List", className: "w-5 h-5 text-purple-500" }),
        fieldConfig.label
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: () => append(getDefaultValues()),
          disabled: fields.length >= (fieldConfig.max || 100),
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-2" }),
            "Add Item"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
      fields.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-8 text-center text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Settings, { className: "w-12 h-12 mx-auto mb-2 opacity-50" }),
        /* @__PURE__ */ jsx("p", { children: "No items added yet" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs", children: 'Click "Add Item" to create one' })
      ] }) : /* @__PURE__ */ jsx("div", { className: "max-h-[600px] overflow-y-auto pr-2 space-y-4", children: fields.map((item, index) => /* @__PURE__ */ jsx(Card, { className: "p-4 border-2", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pb-2 mb-2 border-b", children: [
          /* @__PURE__ */ jsxs("h4", { className: "flex items-center gap-2 font-semibold", children: [
            /* @__PURE__ */ jsxs(Badge, { variant: "outline", children: [
              "#",
              index + 1
            ] }),
            "Item ",
            index + 1
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: () => {
                let imagePreviewsArr = getImageByIndex(imagePreviews, index);
                const formattedImages = Array.isArray(imagePreviewsArr) ? imagePreviewsArr : [imagePreviewsArr];
                setUnlinkImages((prev) => [...prev, ...formattedImages]);
                remove(index);
              },
              className: "text-red-500 hover:text-red-700 hover:bg-red-50",
              children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4", children: Object.entries(fieldConfig.fields).map(([subField, subConfig]) => /* @__PURE__ */ jsx(
          DynamicField,
          {
            field: `${field}.${index}.${subField}`,
            fieldConfig: subConfig,
            form,
            imagePreviews,
            setImagePreviews
          },
          subField
        )) })
      ] }) }, item.id)) }),
      fields.length > 0 && /* @__PURE__ */ jsx("div", { className: "pt-4 border-t", children: /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          className: "w-full",
          onClick: () => append(getDefaultValues()),
          disabled: fields.length >= (fieldConfig.max || 100),
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-2" }),
            "Add Another Item"
          ]
        }
      ) })
    ] })
  ] });
}
function DynamicField({ field, fieldConfig, form, imagePreviews, setImagePreviews, setUnlinkImages }) {
  switch (fieldConfig.type) {
    case "text":
    case "url":
    case "email":
    case "number":
      return /* @__PURE__ */ jsx(TextField, { field, fieldConfig, form });
    case "textarea":
      return /* @__PURE__ */ jsx(TextareaField, { field, fieldConfig, form });
    case "image":
    case "file":
      return /* @__PURE__ */ jsx(
        ImageField,
        {
          field,
          fieldConfig,
          form,
          imagePreviews,
          setImagePreviews
        }
      );
    case "select":
      return /* @__PURE__ */ jsx(SelectField, { field, fieldConfig, form });
    case "color":
      return /* @__PURE__ */ jsx(ColorField, { field, fieldConfig, form });
    case "checkbox":
      return /* @__PURE__ */ jsx(CheckboxField, { field, fieldConfig, form });
    case "repeater":
      return /* @__PURE__ */ jsx(
        RepeaterField,
        {
          field,
          fieldConfig,
          form,
          imagePreviews,
          setImagePreviews,
          setUnlinkImages
        }
      );
    default:
      return null;
  }
}
function DynamicSectionForm({ section = {}, config, sectionType }) {
  const [imagePreviews, setImagePreviews] = useState({});
  const { loading: isSubmitting, submit } = useForm();
  const [unlinkImages, setUnlinkImages] = useState([]);
  const getDefaultValues = (fields, data = {}) => {
    const defaults = {};
    Object.entries(fields).forEach(([key, fieldConfig]) => {
      if (fieldConfig.type === "repeater") {
        defaults[key] = data[key] || [];
      } else if (fieldConfig.type === "image" || fieldConfig.type === "file") {
        defaults[key] = null;
      } else {
        defaults[key] = data[key] || fieldConfig.default || "";
      }
    });
    return defaults;
  };
  const form = useForm$1({
    defaultValues: getDefaultValues(config.fields, section?.value || {})
  });
  useEffect(() => {
    const data = section?.value || {};
    const previews = {};
    Object.entries(config.fields).forEach(([key, fieldConfig]) => {
      if (fieldConfig.type === "repeater") {
        if (data[key] && Array.isArray(data[key])) {
          data[key].forEach((item, index) => {
            Object.entries(fieldConfig.fields).forEach(([subKey, subConfig]) => {
              if ((subConfig.type === "image" || subConfig.type === "file") && item[subKey]) {
                previews[`${key}.${index}.${subKey}`] = item[subKey];
              }
            });
          });
        }
      } else if (fieldConfig.type === "image" || fieldConfig.type === "file") {
        if (data[key]) {
          previews[key] = data[key];
        }
      }
    });
    if (Object.keys(previews).length > 0) {
      setImagePreviews(previews);
    }
  }, [section?.value, config.fields]);
  return /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit((e) => handleSave(e, submit, sectionType, unlinkImages)), className: "space-y-6", children: [
    /* @__PURE__ */ jsxs(Alert, { className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
      /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
      /* @__PURE__ */ jsx(AlertDescription, { children: config.description })
    ] }),
    Object.entries(config.fields).map(([fieldName, fieldConfig]) => {
      if (fieldConfig.type === "repeater") {
        return /* @__PURE__ */ jsx(
          DynamicField,
          {
            field: fieldName,
            fieldConfig,
            form,
            imagePreviews,
            setImagePreviews,
            setUnlinkImages
          },
          fieldName
        );
      }
      return null;
    }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(DynamicIcon, { iconName: "FileText", className: "w-5 h-5 text-blue-500" }),
        /* @__PURE__ */ jsx(CardTitle, { children: "Basic Information" })
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "space-y-6", children: Object.entries(config.fields).filter(
        ([_, fieldConfig]) => ["text", "textarea", "url", "email", "number", "select", "color", "checkbox"].includes(fieldConfig.type)
      ).map(([fieldName, fieldConfig]) => /* @__PURE__ */ jsx(
        DynamicField,
        {
          field: fieldName,
          fieldConfig,
          form,
          imagePreviews,
          setImagePreviews
        },
        fieldName
      )) })
    ] }),
    Object.entries(config.fields).some(([_, fieldConfig]) => ["image", "file"].includes(fieldConfig.type)) && /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(DynamicIcon, { iconName: "Image", className: "w-5 h-5 text-purple-500" }),
        /* @__PURE__ */ jsx(CardTitle, { children: "Media & Assets" })
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "space-y-6 max-h-[600px] overflow-y-auto pr-2", children: Object.entries(config.fields).filter(([_, fieldConfig]) => ["image", "file"].includes(fieldConfig.type)).map(([fieldName, fieldConfig]) => /* @__PURE__ */ jsx(
        DynamicField,
        {
          field: fieldName,
          fieldConfig,
          form,
          imagePreviews,
          setImagePreviews
        },
        fieldName
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsx(Button, { disabled: isSubmitting, type: "submit", className: "w-full sm:w-auto", children: /* @__PURE__ */ jsx(
        ButtonLoader,
        {
          isSubmitting,
          btnText: "Save",
          loaderText: "Saving...",
          icon: /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" })
        }
      ) }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: () => router.visit(route("admin.appearance.index")),
          disabled: isSubmitting,
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
            "Cancel"
          ]
        }
      )
    ] })
  ] }) }) });
}
function Index({
  title,
  sectionType,
  config = {},
  section
}) {
  section = section?.data || {};
  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Appearance Settings", href: route("admin.appearance.index") },
    { label: `${keyToValue(sectionType)} Section` }
  ];
  return /* @__PURE__ */ jsx(BaseLayout, { children: /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(Main, { className: "space-y-8", children: [
      /* @__PURE__ */ jsx(
        CommonLayoutHeader,
        {
          variant: "index",
          breadcrumbItems,
          title: "Appearance Settings",
          description: "Configure content sections for your website",
          icon: Layout,
          primaryAction: {
            label: "Back to Settings",
            icon: ArrowLeft,
            onClick: () => router.visit(route("admin.appearance.index")),
            variant: "outline"
          }
        }
      ),
      /* @__PURE__ */ jsx(
        DynamicSectionForm,
        {
          section,
          config,
          sectionType
        }
      )
    ] })
  ] }) });
}
export {
  Index as default
};

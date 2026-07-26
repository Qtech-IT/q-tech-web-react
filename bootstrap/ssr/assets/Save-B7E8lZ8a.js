import { jsx, jsxs } from "react/jsx-runtime";
import React__default from "react";
import { usePage, router, Head } from "@inertiajs/react";
import { Wallet, ArrowRightLeft, Info, DollarSign, Settings, Plus, Trash2, Save as Save$1, ArrowLeft, Edit } from "lucide-react";
import { B as BaseLayout, A as AuthenticatedLayout, M as Main } from "./Main-BjCbeyG1.js";
import { A as Alert, a as AlertDescription } from "./Alert-3s5DZB4H.js";
import { C as CommonLayoutHeader } from "./CommonLayoutHeader-CyKOpByu.js";
import { h as handleSaveWithdrawMethod, i as getWithdrawMethodSaveBreadcrumbItems } from "./WithdrawMethodController-Ch4XgSUg.js";
import { z } from "zod";
import { useForm as useForm$1, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { B as Button } from "./Button-CFMlPXiE.js";
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, e as FormDescription, f as FormMessage } from "./Form-dg4L2iRR.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./MarketGrid-DlkazA02.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./Card-CQ2ij0--.js";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import "./Sheet-B-_2BaZp.js";
import "@radix-ui/react-direction";
import "class-variance-authority";
import "@radix-ui/react-icons";
import "@radix-ui/react-avatar";
import "@radix-ui/react-separator";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "@radix-ui/react-dialog";
import "@radix-ui/react-scroll-area";
import "./constants-4k_q_jeE.js";
import "./BlogSection-DiGfvTON.js";
import "./EmptyData-DjqqIMwS.js";
import "clsx";
import "react-hot-toast";
import "framer-motion";
import "./BlogCard-Jrl9AHYg.js";
import "./Label-BxDBN09D.js";
import "@radix-ui/react-label";
import "@radix-ui/react-switch";
import "@radix-ui/react-accordion";
import "./TradeDialog-Dt4WEyMP.js";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-tabs";
import "./SlideUp-CpffxXZf.js";
import "motion/react";
import "./PaginationWrapper-B-KWAp7V.js";
import "./Table-Dz-EvWd_.js";
import "./demo-data-C5EGh9Nk.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
import "react-icons/fa";
import "@radix-ui/react-slot";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-alert-dialog";
import "./AuthController-DaCguZ7K.js";
import "@radix-ui/react-radio-group";
import "./Breadcrumb-D0MBns-9.js";
import "tailwind-merge";
import "@radix-ui/react-select";
import "./Progress-DT6CA82_.js";
import "@radix-ui/react-progress";
import "react-icons/bs";
const withdrawMethodSchema = z.object({
  name: z.string().min(1, "Method name is required").max(200),
  currency_code: z.string().min(1, "Currency code is required").max(10),
  currency_symbol: z.string().optional().or(z.literal("")),
  min_limit: z.string().min(1, "Minimum limit is required"),
  max_limit: z.string().min(1, "Maximum limit is required"),
  fixed_charge: z.string().min(1, "Fixed charge is required"),
  percent_charge: z.string().min(1, "Percent charge is required"),
  exchange_rate: z.string().min(1, "Exchange rate is required"),
  config: z.any().optional()
});
function WithdrawMethodSaveForm({ props, method, isEditing }) {
  const { loading: isSubmitting, errors: serverErrors, submit } = useForm();
  const { site_theme_settings } = usePage().props;
  method = method?.data || method;
  const defaultCurrency = site_theme_settings?.default_currency || "USD";
  const currencySymbol = site_theme_settings?.currency_symbol || "$";
  const defaultValues = {
    name: method?.name || "",
    currency_code: method?.currency_code || "",
    currency_symbol: method?.currency_symbol || "",
    min_limit: method?.min_limit?.toString() || "0",
    max_limit: method?.max_limit?.toString() || "0",
    fixed_charge: method?.fixed_charge?.toString() || "0",
    percent_charge: method?.percent_charge?.toString() || "0",
    exchange_rate: method?.exchange_rate?.toString() || "1",
    config: Array.isArray(method?.config) ? method.config : []
  };
  const form = useForm$1({
    resolver: zodResolver(withdrawMethodSchema),
    defaultValues
  });
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "config"
  });
  React__default.useEffect(() => {
    if (method && isEditing) {
      const configData = Array.isArray(method.config) ? method.config : [];
      form.reset({
        name: method.name || "",
        currency_code: method.currency_code || "",
        currency_symbol: method.currency_symbol || "",
        min_limit: method.min_limit?.toString() || "0",
        max_limit: method.max_limit?.toString() || "0",
        fixed_charge: method.fixed_charge?.toString() || "0",
        percent_charge: method.percent_charge?.toString() || "0",
        exchange_rate: method.exchange_rate?.toString() || "1",
        config: configData
      });
      replace(configData);
    }
  }, [method, isEditing]);
  const watchCurrencyCode = form.watch("currency_code");
  const watchExchangeRate = form.watch("exchange_rate");
  const addConfigField = () => {
    append({
      type: "text",
      label: "",
      name: "",
      placeholder: "",
      required: false,
      validation: "",
      options: []
    });
  };
  const handleFormSubmit = (data) => {
    const cleanedData = {
      ...data,
      config: Array.isArray(data.config) ? data.config.map((field) => ({
        type: field.type || "text",
        label: field.label || "",
        name: field.name || "",
        placeholder: field.placeholder || "",
        required: field.required || false,
        validation: field.validation || "",
        options: Array.isArray(field.options) ? field.options : []
      })) : []
    };
    console.log("Cleaned Form Data:", cleanedData);
    handleSaveWithdrawMethod(cleanedData, submit, method, form);
  };
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(handleFormSubmit), className: "space-y-6", children: [
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Wallet, { className: "w-5 h-5 text-blue-500" }),
        /* @__PURE__ */ jsx(CardTitle, { children: "Basic Information" })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "name",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                "Method Name",
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
              ] }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "e.g., Bank Transfer, PayPal", ...field }) }),
              /* @__PURE__ */ jsx(FormDescription, { children: "The display name for this withdrawal method" }),
              /* @__PURE__ */ jsx(FormMessage, {}),
              serverErrors?.name && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.name })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "currency_code",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                  "Currency Code",
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                ] }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "USD", ...field }) }),
                /* @__PURE__ */ jsx(FormDescription, { children: "ISO currency code" }),
                /* @__PURE__ */ jsx(FormMessage, {}),
                serverErrors?.currency_code && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.currency_code })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "currency_symbol",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                  "Currency Symbol",
                  /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Optional" })
                ] }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "$", ...field }) }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Display symbol" }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(ArrowRightLeft, { className: "w-5 h-5 text-purple-500" }),
        /* @__PURE__ */ jsx(CardTitle, { children: "Exchange Rate Configuration" })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs(Alert, { className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
          /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsx(AlertDescription, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium", children: [
              "Default Currency: ",
              defaultCurrency,
              " (",
              currencySymbol,
              ")"
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Set the exchange rate from ",
              watchCurrencyCode || "this currency",
              " to ",
              defaultCurrency
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "exchange_rate",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                "Exchange Rate",
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
              ] }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  step: "0.000000000001",
                  placeholder: "1.00000000",
                  min: "0",
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsxs(FormDescription, { children: [
                "1 ",
                watchCurrencyCode || "XXX",
                " = ",
                watchExchangeRate || "1",
                " ",
                defaultCurrency
              ] }),
              /* @__PURE__ */ jsx(FormMessage, {}),
              serverErrors?.exchange_rate && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.exchange_rate })
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(DollarSign, { className: "w-5 h-5 text-green-500" }),
        /* @__PURE__ */ jsx(CardTitle, { children: "Limits & Charges" })
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "min_limit",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                "Minimum Limit",
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
              ] }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { min: "0", type: "number", step: "0.01", placeholder: "0.00", ...field }) }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Minimum withdrawal amount" }),
              /* @__PURE__ */ jsx(FormMessage, {}),
              serverErrors?.min_limit && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.min_limit })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "max_limit",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                "Maximum Limit",
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
              ] }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { min: "0", type: "number", step: "0.01", placeholder: "0.00", ...field }) }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Maximum withdrawal amount" }),
              /* @__PURE__ */ jsx(FormMessage, {}),
              serverErrors?.max_limit && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.max_limit })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "fixed_charge",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                "Fixed Charge",
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
              ] }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { min: "0", type: "number", step: "0.01", placeholder: "0.00", ...field }) }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Fixed fee per transaction" }),
              /* @__PURE__ */ jsx(FormMessage, {}),
              serverErrors?.fixed_charge && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.fixed_charge })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "percent_charge",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                "Percent Charge",
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
              ] }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { min: "0", type: "number", step: "0.01", placeholder: "0.00", ...field }) }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Percentage fee (0-100)" }),
              /* @__PURE__ */ jsx(FormMessage, {}),
              serverErrors?.percent_charge && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.percent_charge })
            ] })
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Settings, { className: "w-5 h-5 text-purple-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Required Fields Configuration" })
        ] }),
        /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: addConfigField, children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-2" }),
          "Add Field"
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: fields.length > 0 ? fields.map((field, index) => /* @__PURE__ */ jsx(Card, { className: "border-2", children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs(Badge, { variant: "outline", children: [
            "Field #",
            index + 1
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: () => remove(index),
              className: "text-red-600 hover:text-red-700",
              children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: `field-type-${index}`, className: "text-sm font-medium", children: "Field Type" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: form.watch(`config.${index}.type`) || "text",
                onValueChange: (value) => form.setValue(`config.${index}.type`, value),
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { id: `field-type-${index}`, children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select type" }) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "text", children: "Text" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "email", children: "Email" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "number", children: "Number" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "select", children: "Select" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "textarea", children: "Textarea" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "file", children: "File" })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: `field-label-${index}`, className: "text-sm font-medium", children: "Label" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: `field-label-${index}`,
                placeholder: "Field label",
                value: form.watch(`config.${index}.label`) || "",
                onChange: (e) => form.setValue(`config.${index}.label`, e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: `field-name-${index}`, className: "text-sm font-medium", children: "Name" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: `field-name-${index}`,
                placeholder: "field_name",
                value: form.watch(`config.${index}.name`) || "",
                onChange: (e) => form.setValue(`config.${index}.name`, e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: `field-placeholder-${index}`, className: "text-sm font-medium", children: "Placeholder" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: `field-placeholder-${index}`,
                placeholder: "Placeholder text",
                value: form.watch(`config.${index}.placeholder`) || "",
                onChange: (e) => form.setValue(`config.${index}.placeholder`, e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                id: `field-required-${index}`,
                type: "checkbox",
                checked: form.watch(`config.${index}.required`) || false,
                onChange: (e) => form.setValue(`config.${index}.required`, e.target.checked),
                className: "w-4 h-4"
              }
            ),
            /* @__PURE__ */ jsx("label", { htmlFor: `field-required-${index}`, className: "text-sm font-medium", children: "Required Field" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: `field-validation-${index}`, className: "text-sm font-medium", children: "Validation Rules" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: `field-validation-${index}`,
                placeholder: "e.g., min:3|max:50",
                value: form.watch(`config.${index}.validation`) || "",
                onChange: (e) => form.setValue(`config.${index}.validation`, e.target.value)
              }
            )
          ] })
        ] }),
        form.watch(`config.${index}.type`) === "select" && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: `field-options-${index}`, className: "text-sm font-medium", children: "Options (comma-separated)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: `field-options-${index}`,
              placeholder: "Option 1, Option 2, Option 3",
              value: Array.isArray(form.watch(`config.${index}.options`)) ? form.watch(`config.${index}.options`).join(", ") : "",
              onChange: (e) => {
                const options = e.target.value.split(",").map((s) => s.trim()).filter((s) => s);
                form.setValue(`config.${index}.options`, options);
              }
            }
          )
        ] })
      ] }) }) }, field.id)) : /* @__PURE__ */ jsxs("div", { className: "py-8 text-center text-gray-500", children: [
        /* @__PURE__ */ jsx(Settings, { className: "w-12 h-12 mx-auto mb-2 text-gray-400" }),
        /* @__PURE__ */ jsx("p", { children: "No required fields configured" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: 'Click "Add Field" to configure user input fields' })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isSubmitting, className: "w-full sm:w-auto", children: /* @__PURE__ */ jsx(
        ButtonLoader,
        {
          isSubmitting,
          btnText: isEditing ? "Update Method" : "Create Method",
          loaderText: isEditing ? "Updating..." : "Creating...",
          icon: /* @__PURE__ */ jsx(Save$1, { className: "w-4 h-4" })
        }
      ) }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: () => router.visit("/admin/withdraw-methods"),
          disabled: isSubmitting,
          className: "w-full sm:w-auto",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
            "Cancel"
          ]
        }
      )
    ] })
  ] }) });
}
function Save({ title, method = null }) {
  const { props } = usePage();
  method = method?.data;
  const isEditing = method != null;
  return /* @__PURE__ */ jsx(BaseLayout, { children: /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(Main, { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(
        CommonLayoutHeader,
        {
          variant: "inner",
          breadcrumbItems: getWithdrawMethodSaveBreadcrumbItems(isEditing),
          title: isEditing ? "Edit Withdraw Method" : "Create Withdraw Method",
          description: isEditing ? "Update withdrawal method configuration and settings" : "Configure a new withdrawal payment method",
          icon: isEditing ? Edit : Plus,
          primaryAction: {
            label: "Back to Methods",
            icon: ArrowLeft,
            onClick: () => router.visit("/admin/withdraw-methods"),
            variant: "outline"
          },
          badges: isEditing ? [
            { label: `ID: ${method?.id}`, variant: "secondary" },
            { label: "Editing Mode", variant: "outline" }
          ] : []
        }
      ),
      /* @__PURE__ */ jsxs(Alert, { className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
        /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx(AlertDescription, { children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Withdraw Method Configuration" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm", children: "Configure withdrawal limits, charges, and required fields for this payment method." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        WithdrawMethodSaveForm,
        {
          props,
          method,
          isEditing
        }
      ) })
    ] })
  ] }) });
}
export {
  Save as default
};

import { zodResolver } from "@hookform/resolvers/zod";
import { Head, router, usePage } from "@inertiajs/react";
import "@radix-ui/react-accordion";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-avatar";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-dialog";
import "@radix-ui/react-direction";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "@radix-ui/react-label";
import "@radix-ui/react-progress";
import "@radix-ui/react-radio-group";
import "@radix-ui/react-scroll-area";
import "@radix-ui/react-select";
import "@radix-ui/react-separator";
import "@radix-ui/react-slot";
import "@radix-ui/react-switch";
import "@radix-ui/react-tabs";
import "@radix-ui/react-tooltip";
import "class-variance-authority";
import "clsx";
import "cmdk";
import "framer-motion";
import { ArrowLeft, ArrowRightLeft, Check, Copy, CreditCard, DollarSign, Edit, FileText, Info, Key, Link, Plus, Save as Save$1, Settings, Trash2, Zap } from "lucide-react";
import "motion/react";
import React__default, { useState } from "react";
import { useForm as useForm$1 } from "react-hook-form";
import "react-hot-toast";
import "react-icons/bs";
import "react-icons/fa";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import "tailwind-merge";
import { z } from "zod";
import { A as Alert, a as AlertDescription } from "./Alert-3s5DZB4H.js";
import "./AuthController-DaCguZ7K.js";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import "./BlogCard-Jrl9AHYg.js";
import "./BlogSection-DiGfvTON.js";
import "./Breadcrumb-D0MBns-9.js";
import { B as Button } from "./Button-CFMlPXiE.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./Card-CQ2ij0--.js";
import { C as CommonLayoutHeader } from "./CommonLayoutHeader-CyKOpByu.js";
import { S as Switch } from "./constants-4k_q_jeE.js";
import "./demo-data-C5EGh9Nk.js";
import "./EmptyData-DjqqIMwS.js";
import { F as Form, d as FormControl, e as FormDescription, a as FormField, b as FormItem, c as FormLabel, f as FormMessage } from "./Form-dg4L2iRR.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import "./Label-BxDBN09D.js";
import { A as AuthenticatedLayout, B as BaseLayout, M as Main } from "./Main-BjCbeyG1.js";
import { S as Select, c as SelectContent, d as SelectItem, a as SelectTrigger, b as SelectValue } from "./MarketGrid-DlkazA02.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
import "./PaginationWrapper-B-KWAp7V.js";
import { i as getPaymentMethodSaveBreadcrumbItems, h as handleSavePaymentMethod } from "./PaymentMethodController-w4wfQ0gi.js";
import "./Progress-DT6CA82_.js";
import "./Sheet-B-_2BaZp.js";
import "./SlideUp-CpffxXZf.js";
import "./Table-Dz-EvWd_.js";
import "./TradeDialog-Dt4WEyMP.js";
const paymentMethodSchema = z.object({
  name: z.string().min(1, "Method name is required").max(255),
  gateway_code: z.string().min(1, "Gateway code is required"),
  currency_code: z.string().min(1, "Currency code is required").max(10),
  currency_symbol: z.string().optional().or(z.literal("")),
  min_limit: z.string().min(1, "Minimum limit is required"),
  max_limit: z.string().min(1, "Maximum limit is required"),
  exchange_rate: z.string().min(1, "Exchange rate is required"),
  percent_fee: z.string().min(1, "Percent fee is required"),
  fixed_fee: z.string().min(1, "Fixed fee is required"),
  is_manual: z.boolean(),
  config: z.any().optional()
});
function PaymentMethodSaveForm({ props, method, isEditing }) {
  const { loading: isSubmitting, errors: serverErrors, submit } = useForm();
  const { site_theme_settings } = usePage().props;
  const [copiedField, setCopiedField] = useState(null);
  method = method?.data || method;
  const getCallbackUrl = (gatewayCode) => {
    if (!gatewayCode) return "";
    return `${window.location.origin}/payment/callback/${gatewayCode}`;
  };
  const defaultValues = {
    name: method?.name || "",
    gateway_code: method?.gateway_code || "",
    currency_code: method?.currency_code || "",
    currency_symbol: method?.currency_symbol || "",
    min_limit: method?.min_limit?.toString() || "0",
    max_limit: method?.max_limit?.toString() || "0",
    exchange_rate: method?.exchange_rate?.toString() || "1",
    percent_fee: method?.percent_fee?.toString() || "0",
    fixed_fee: method?.fixed_fee?.toString() || "0",
    is_manual: isEditing ? method?.is_manual || false : true,
    config: Array.isArray(method?.config) ? method.config : []
  };
  const form = useForm$1({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues
  });
  React__default.useEffect(() => {
    if (method && isEditing) {
      const configData = Array.isArray(method.config) ? method.config : [];
      form.reset({
        name: method.name || "",
        gateway_code: method.gateway_code || "",
        currency_code: method.currency_code || "",
        currency_symbol: method.currency_symbol || "",
        min_limit: method.min_limit?.toString() || "0",
        max_limit: method.max_limit?.toString() || "0",
        exchange_rate: method.exchange_rate?.toString() || "1",
        percent_fee: method.percent_fee?.toString() || "0",
        fixed_fee: method.fixed_fee?.toString() || "0",
        is_manual: method.is_manual || false,
        config: configData
      });
    }
  }, [method, isEditing]);
  const watchCurrencyCode = form.watch("currency_code");
  const watchExchangeRate = form.watch("exchange_rate");
  const watchIsManual = form.watch("is_manual");
  const watchConfig = form.watch("config");
  const watchGatewayCode = form.watch("gateway_code");
  const defaultCurrency = site_theme_settings?.default_currency || "USD";
  const currencySymbol = site_theme_settings?.currency_symbol || "$";
  const callbackUrl = getCallbackUrl(watchGatewayCode);
  const addConfigField = () => {
    const currentConfig = form.getValues("config") || [];
    form.setValue("config", [
      ...currentConfig,
      {
        type: "text",
        label: "",
        name: "",
        placeholder: "",
        required: false,
        validation: "",
        options: []
      }
    ]);
  };
  const removeConfigField = (index) => {
    const currentConfig = form.getValues("config") || [];
    form.setValue("config", currentConfig.filter((_, i) => i !== index));
  };
  const handleFormSubmit = (data) => {
    const cleanedData = {
      ...data,
      config: Array.isArray(data.config) ? data.config.map((field) => {
        if (data.is_manual) {
          return {
            type: field.type || "text",
            label: field.label || "",
            name: field.name || "",
            placeholder: field.placeholder || "",
            required: field.required || false,
            validation: field.validation || "",
            options: Array.isArray(field.options) ? field.options : []
          };
        } else {
          return {
            name: field.name || "",
            value: field.value || ""
          };
        }
      }) : []
    };
    console.log("Cleaned Form Data:", cleanedData);
    handleSavePaymentMethod(cleanedData, submit, method, form);
  };
  const formatFieldName = (name) => {
    return name.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };
  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2e3);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  return /* @__PURE__ */ jsx(Form, {
    ...form, children: /* @__PURE__ */ jsxs("form", {
      onSubmit: form.handleSubmit(handleFormSubmit), className: "space-y-6", children: [
    /* @__PURE__ */ jsxs(Card, {
        children: [
      /* @__PURE__ */ jsx(CardHeader, {
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(CreditCard, { className: "w-5 h-5 text-blue-500" }),
        /* @__PURE__ */ jsx(CardTitle, { children: "Basic Information" })
            ]
          })
        }),
      /* @__PURE__ */ jsxs(CardContent, {
          className: "space-y-6", children: [
        /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "name",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                children: [
              /* @__PURE__ */ jsxs(FormLabel, {
                  className: "flex items-center gap-2", children: [
                    "Method Name",
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                  ]
                }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "e.g., Bank Transfer, Cash Payment", ...field }) }),
              /* @__PURE__ */ jsx(FormDescription, { children: "The display name for this payment method" }),
              /* @__PURE__ */ jsx(FormMessage, {}),
                  serverErrors?.name && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.name })
                ]
              })
            }
          ),
        /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "gateway_code",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                children: [
              /* @__PURE__ */ jsxs(FormLabel, {
                  className: "flex items-center gap-2", children: [
                    "Gateway Code",
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                  ]
                }),
              /* @__PURE__ */ jsx(FormControl, {
                  children: /* @__PURE__ */ jsx(
                    Input,
                    {
                      placeholder: "e.g., bank_transfer, cash_payment",
                      ...field,
                      disabled: isEditing
                    }
                  )
                }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Unique identifier for the payment method (lowercase, no spaces)" }),
              /* @__PURE__ */ jsx(FormMessage, {}),
                  serverErrors?.gateway_code && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.gateway_code })
                ]
              })
            }
          ),
            isEditing && /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "is_manual",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  className: "flex flex-row items-center justify-between p-4 border rounded-lg", children: [
              /* @__PURE__ */ jsxs("div", {
                    className: "space-y-0.5", children: [
                /* @__PURE__ */ jsx(FormLabel, {
                      className: "flex items-center gap-2", children: watchIsManual ? /* @__PURE__ */ jsxs(Fragment, {
                        children: [
                  /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 text-orange-500" }),
                          "Manual Payment Method"
                        ]
                      }) : /* @__PURE__ */ jsxs(Fragment, {
                        children: [
                  /* @__PURE__ */ jsx(Zap, { className: "w-4 h-4 text-purple-500" }),
                          "Automatic Payment Method"
                        ]
                      })
                    }),
                /* @__PURE__ */ jsx(FormDescription, { children: watchIsManual ? "Manual methods require admin approval for each transaction" : "Automatic methods process payments instantly through gateway" })
                    ]
                  }),
              /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Switch,
                      {
                        checked: field.value,
                        onCheckedChange: field.onChange,
                        disabled: true
                      }
                    )
                  })
                  ]
                })
              }
            ),
            !isEditing && /* @__PURE__ */ jsxs(Alert, {
              className: "border-orange-200 bg-orange-50 dark:bg-orange-950", children: [
          /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsxs(AlertDescription, {
                children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "Manual Payment Method" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Creating a manual payment method that requires admin approval for each transaction." })
                ]
              })
              ]
            }),
        /* @__PURE__ */ jsxs("div", {
              className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
          /* @__PURE__ */ jsx(
                FormField,
                {
                  control: form.control,
                  name: "currency_code",
                  render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                    children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                      className: "flex items-center gap-2", children: [
                        "Currency Code",
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                      ]
                    }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "USD", ...field }) }),
                /* @__PURE__ */ jsx(FormDescription, { children: "ISO currency code" }),
                /* @__PURE__ */ jsx(FormMessage, {}),
                      serverErrors?.currency_code && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.currency_code })
                    ]
                  })
                }
              ),
          /* @__PURE__ */ jsx(
                FormField,
                {
                  control: form.control,
                  name: "currency_symbol",
                  render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                    children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                      className: "flex items-center gap-2", children: [
                        "Currency Symbol",
                  /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Optional" })
                      ]
                    }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "$", ...field }) }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Display symbol" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                    ]
                  })
                }
              )
              ]
            })
          ]
        })
        ]
      }),
    /* @__PURE__ */ jsxs(Card, {
        children: [
      /* @__PURE__ */ jsx(CardHeader, {
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(ArrowRightLeft, { className: "w-5 h-5 text-purple-500" }),
        /* @__PURE__ */ jsx(CardTitle, { children: "Exchange Rate Configuration" })
            ]
          })
        }),
      /* @__PURE__ */ jsxs(CardContent, {
          className: "space-y-6", children: [
        /* @__PURE__ */ jsxs(Alert, {
            className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
          /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsx(AlertDescription, {
              children: /* @__PURE__ */ jsxs("div", {
                className: "space-y-1", children: [
            /* @__PURE__ */ jsxs("p", {
                  className: "text-sm font-medium", children: [
                    "Default Currency: ",
                    defaultCurrency,
                    " (",
                    currencySymbol,
                    ")"
                  ]
                }),
            /* @__PURE__ */ jsxs("p", {
                  className: "text-xs text-muted-foreground", children: [
                    "Set the exchange rate from ",
                    watchCurrencyCode || "this currency",
                    " to ",
                    defaultCurrency
                  ]
                })
                ]
              })
            })
            ]
          }),
        /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "exchange_rate",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                children: [
              /* @__PURE__ */ jsxs(FormLabel, {
                  className: "flex items-center gap-2", children: [
                    "Exchange Rate",
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                  ]
                }),
              /* @__PURE__ */ jsx(FormControl, {
                  children: /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "number",
                      step: "0.000000000001",
                      placeholder: "1.00000000",
                      min: "0",
                      ...field
                    }
                  )
                }),
              /* @__PURE__ */ jsxs(FormDescription, {
                  children: [
                    "1 ",
                    watchCurrencyCode || "XXX",
                    " = ",
                    watchExchangeRate || "1",
                    " ",
                    defaultCurrency
                  ]
                }),
              /* @__PURE__ */ jsx(FormMessage, {}),
                  serverErrors?.exchange_rate && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.exchange_rate })
                ]
              })
            }
          )
          ]
        })
        ]
      }),
    /* @__PURE__ */ jsxs(Card, {
        children: [
      /* @__PURE__ */ jsx(CardHeader, {
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(DollarSign, { className: "w-5 h-5 text-green-500" }),
        /* @__PURE__ */ jsx(CardTitle, { children: "Limits & Fees" })
            ]
          })
        }),
      /* @__PURE__ */ jsx(CardContent, {
          className: "space-y-6", children: /* @__PURE__ */ jsxs("div", {
            className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "min_limit",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
              /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                      "Minimum Limit",
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                    ]
                  }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { min: "0", type: "number", step: "0.01", placeholder: "0.00", ...field }) }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Minimum payment amount" }),
              /* @__PURE__ */ jsx(FormMessage, {}),
                    serverErrors?.min_limit && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.min_limit })
                  ]
                })
              }
            ),
        /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "max_limit",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
              /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                      "Maximum Limit",
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                    ]
                  }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { min: "0", type: "number", step: "0.01", placeholder: "0.00", ...field }) }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Maximum payment amount" }),
              /* @__PURE__ */ jsx(FormMessage, {}),
                    serverErrors?.max_limit && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.max_limit })
                  ]
                })
              }
            ),
        /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "fixed_fee",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
              /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                      "Fixed Fee",
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                    ]
                  }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { min: "0", type: "number", step: "0.00000001", placeholder: "0.00", ...field }) }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Fixed fee per transaction" }),
              /* @__PURE__ */ jsx(FormMessage, {}),
                    serverErrors?.fixed_fee && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.fixed_fee })
                  ]
                })
              }
            ),
        /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "percent_fee",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
              /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                      "Percent Fee",
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                    ]
                  }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { min: "0", type: "number", step: "0.0001", placeholder: "0.00", ...field }) }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Percentage fee (0-100)" }),
              /* @__PURE__ */ jsx(FormMessage, {}),
                    serverErrors?.percent_fee && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.percent_fee })
                  ]
                })
              }
            )
            ]
          })
        })
        ]
      }),
        isEditing && !watchIsManual && watchGatewayCode && /* @__PURE__ */ jsxs(Card, {
          children: [
      /* @__PURE__ */ jsx(CardHeader, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Link, { className: "w-5 h-5 text-indigo-500" }),
        /* @__PURE__ */ jsx(CardTitle, { children: "Callback URL" })
              ]
            })
          }),
      /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsxs(Alert, {
              className: "border-indigo-200 bg-indigo-50 dark:bg-indigo-950", children: [
        /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsxs(AlertDescription, {
                children: [
          /* @__PURE__ */ jsx("p", { className: "mb-2 text-sm font-medium", children: "Use this URL in your payment gateway webhook settings" }),
          /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2 p-3 mt-2  text-sm bg-white border rounded-md dark:bg-gray-900", children: [
            /* @__PURE__ */ jsx("code", { className: "flex-1 overflow-x-auto", children: callbackUrl }),
            /* @__PURE__ */ jsx(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "sm",
                      onClick: () => copyToClipboard(callbackUrl, "callback"),
                      className: "flex-shrink-0",
                      children: copiedField === "callback" ? /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-green-600" }) : /* @__PURE__ */ jsx(Copy, { className: "w-4 h-4" })
                    }
                  )
                  ]
                })
                ]
              })
              ]
            })
          })
          ]
        }),
    /* @__PURE__ */ jsxs(Card, {
          children: [
      /* @__PURE__ */ jsx(CardHeader, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("div", {
                className: "flex items-center gap-2", children: watchIsManual ? /* @__PURE__ */ jsxs(Fragment, {
                  children: [
          /* @__PURE__ */ jsx(Settings, { className: "w-5 h-5 text-orange-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "User Input Fields Configuration" })
                  ]
                }) : /* @__PURE__ */ jsxs(Fragment, {
                  children: [
          /* @__PURE__ */ jsx(Key, { className: "w-5 h-5 text-purple-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Gateway Credentials" })
                  ]
                })
              }),
                watchIsManual && /* @__PURE__ */ jsxs(Button, {
                  type: "button", variant: "outline", size: "sm", onClick: addConfigField, children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-2" }),
                    "Add Field"
                  ]
                })
              ]
            })
          }),
      /* @__PURE__ */ jsx(CardContent, {
            className: "space-y-4", children: !watchIsManual ? /* @__PURE__ */ jsx(Fragment, {
              children: watchConfig && watchConfig.length > 0 ? /* @__PURE__ */ jsx("div", {
                className: "space-y-4", children: watchConfig.map((field, index) => /* @__PURE__ */ jsx("div", {
                  className: "p-4 border rounded-lg", children: /* @__PURE__ */ jsxs("div", {
                    className: "space-y-3", children: [
        /* @__PURE__ */ jsx("div", {
                      className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", {
                        className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Key, { className: "w-4 h-4 text-purple-500" }),
          /* @__PURE__ */ jsx("label", { htmlFor: `config-${index}-value`, className: "text-sm font-medium", children: formatFieldName(field.name) })
                        ]
                      })
                    }),
        /* @__PURE__ */ jsx(
                      Input,
                      {
                        id: `config-${index}-value`,
                        placeholder: `Enter ${formatFieldName(field.name)}`,
                        value: form.watch(`config.${index}.value`) || "",
                        onChange: (e) => form.setValue(`config.${index}.value`, e.target.value)
                      }
                    ),
        /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "hidden",
                        value: field.name,
                        ...form.register(`config.${index}.name`)
                      }
                    )
                    ]
                  })
                }, index))
              }) : /* @__PURE__ */ jsxs("div", {
                className: "py-8 text-center text-gray-500", children: [
        /* @__PURE__ */ jsx(Key, { className: "w-12 h-12 mx-auto mb-2 text-gray-400" }),
        /* @__PURE__ */ jsx("p", { children: "No configuration fields" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: "This gateway doesn't require credentials" })
                ]
              })
            }) : /* @__PURE__ */ jsx(Fragment, {
              children: watchConfig && watchConfig.length > 0 ? watchConfig.map((field, index) => /* @__PURE__ */ jsx(Card, {
                className: "border-2", children: /* @__PURE__ */ jsx(CardContent, {
                  className: "pt-6", children: /* @__PURE__ */ jsxs("div", {
                    className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs(Badge, {
                        variant: "outline", children: [
                          "Field #",
                          index + 1
                        ]
                      }),
          /* @__PURE__ */ jsx(
                        Button,
                        {
                          type: "button",
                          variant: "ghost",
                          size: "sm",
                          onClick: () => removeConfigField(index),
                          className: "text-red-600 hover:text-red-700",
                          children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
                        }
                      )
                      ]
                    }),
        /* @__PURE__ */ jsxs("div", {
                      className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", {
                        className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: `field-type-${index}`, className: "text-sm font-medium", children: "Field Type" }),
            /* @__PURE__ */ jsxs(
                          Select,
                          {
                            value: form.watch(`config.${index}.type`) || "text",
                            onValueChange: (value) => form.setValue(`config.${index}.type`, value),
                            children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { id: `field-type-${index}`, children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select type" }) }),
                  /* @__PURE__ */ jsxs(SelectContent, {
                              children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "text", children: "Text" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "email", children: "Email" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "number", children: "Number" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "select", children: "Select" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "textarea", children: "Textarea" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "file", children: "File" })
                              ]
                            })
                            ]
                          }
                        )
                        ]
                      }),
          /* @__PURE__ */ jsxs("div", {
                        className: "space-y-2", children: [
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
                        ]
                      }),
          /* @__PURE__ */ jsxs("div", {
                        className: "space-y-2", children: [
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
                        ]
                      }),
          /* @__PURE__ */ jsxs("div", {
                        className: "space-y-2", children: [
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
                        ]
                      }),
          /* @__PURE__ */ jsxs("div", {
                        className: "flex items-center gap-2", children: [
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
                        ]
                      }),
          /* @__PURE__ */ jsxs("div", {
                        className: "space-y-2", children: [
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
                        ]
                      })
                      ]
                    }),
                      form.watch(`config.${index}.type`) === "select" && /* @__PURE__ */ jsxs("div", {
                        className: "space-y-2", children: [
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
                        ]
                      })
                    ]
                  })
                })
              }, index)) : /* @__PURE__ */ jsxs("div", {
                className: "py-8 text-center text-gray-500", children: [
        /* @__PURE__ */ jsx(Settings, { className: "w-12 h-12 mx-auto mb-2 text-gray-400" }),
        /* @__PURE__ */ jsx("p", { children: "No input fields configured" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: 'Click "Add Field" to configure user input fields' })
                ]
              })
            })
          })
          ]
        }),
    /* @__PURE__ */ jsxs("div", {
          className: "flex gap-3", children: [
      /* @__PURE__ */ jsx(Button, {
            type: "submit", disabled: isSubmitting, className: "w-full sm:w-auto", children: /* @__PURE__ */ jsx(
              ButtonLoader,
              {
                isSubmitting,
                btnText: isEditing ? "Update Method" : "Create Method",
                loaderText: isEditing ? "Updating..." : "Creating...",
                icon: /* @__PURE__ */ jsx(Save$1, { className: "w-4 h-4" })
              }
            )
          }),
      /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => router.visit("/admin/payment-methods"),
              disabled: isSubmitting,
              className: "w-full sm:w-auto",
              children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
                "Cancel"
              ]
            }
          )
          ]
        })
      ]
    })
  });
}
function Save({ title, method = null }) {
  const { props } = usePage();
  method = method?.data;
  const isEditing = method != null;
  return /* @__PURE__ */ jsx(BaseLayout, {
    children: /* @__PURE__ */ jsxs(AuthenticatedLayout, {
      children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(Main, {
        className: "space-y-6", children: [
      /* @__PURE__ */ jsx(
          CommonLayoutHeader,
          {
            variant: "inner",
            breadcrumbItems: getPaymentMethodSaveBreadcrumbItems(isEditing),
            title: isEditing ? "Edit Payment Method" : "Create Payment Method",
            description: isEditing ? "Update payment gateway configuration and settings" : "Configure a new payment gateway method",
            icon: isEditing ? Edit : Plus,
            primaryAction: {
              label: "Back to Methods",
              icon: ArrowLeft,
              onClick: () => router.visit("/admin/payment-methods"),
              variant: "outline"
            },
            badges: isEditing ? [
              { label: `ID: ${method?.id}`, variant: "secondary" },
              { label: "Editing Mode", variant: "outline" }
            ] : []
          }
        ),
      /* @__PURE__ */ jsxs(Alert, {
          className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
        /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx(AlertDescription, {
            children: /* @__PURE__ */ jsxs("div", {
              children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Payment Method Configuration" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm", children: "Configure payment gateway credentials, fees, and required fields for this payment method." })
              ]
            })
          })
          ]
        }),
      /* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsx(
            PaymentMethodSaveForm,
            {
              props,
              method,
              isEditing
            }
          )
        })
        ]
      })
      ]
    })
  });
}
export {
  Save as default
};


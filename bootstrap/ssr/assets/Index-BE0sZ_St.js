import { zodResolver } from "@hookform/resolvers/zod";
import { Head, usePage } from "@inertiajs/react";
import "@radix-ui/react-accordion";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-avatar";
import "@radix-ui/react-checkbox";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-dialog";
import "@radix-ui/react-direction";
import "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import "@radix-ui/react-label";
import "@radix-ui/react-progress";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
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
import { AlertTriangle, Calendar, Check, CheckCircle, CircleIcon, Clock, Code, Copy, Copyright, CreditCard, Database, DollarSign, Edit3, ExternalLink, Eye, EyeOff, FileText, Globe, Hash, Image, Info, Key, Lock, Mail, MapPin, Palette, Phone, Plus, Search, Server, Settings, Shield, Tag, Target, Ticket, Trash2, TrendingUp, Upload, UserCircle, UserPlus, Users, X } from "lucide-react";
import "motion/react";
import { useState } from "react";
import { useFieldArray, useForm as useForm$1 } from "react-hook-form";
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
import { B as Button, b as buttonVariants, a as cn, q as getSettings, o as handleImageChange } from "./Button-CFMlPXiE.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./Card-CQ2ij0--.js";
import { C as Checkbox } from "./Checkbox-CsK9i2JK.js";
import { c as currencies, f as fonts, s as settingsNavItems, S as Switch, T as Textarea } from "./constants-4k_q_jeE.js";
import { C as ContentSection, S as SidebarNav } from "./ContentSection-DFKIhAed.js";
import "./demo-data-C5EGh9Nk.js";
import "./EmptyData-DjqqIMwS.js";
import { F as Form, d as FormControl, e as FormDescription, a as FormField, b as FormItem, c as FormLabel, f as FormMessage } from "./Form-dg4L2iRR.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import "./Label-BxDBN09D.js";
import { A as AuthenticatedLayout, B as BaseLayout, M as Main, p as onLogoUpdate, o as onSettingsUpdate, t as toggleDebugMode } from "./Main-BjCbeyG1.js";
import { S as Select, c as SelectContent, d as SelectItem, a as SelectTrigger, b as SelectValue } from "./MarketGrid-DlkazA02.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
import "./PaginationWrapper-B-KWAp7V.js";
import "./Progress-DT6CA82_.js";
import { G as Separator } from "./Sheet-B-_2BaZp.js";
import "./SlideUp-CpffxXZf.js";
import "./Table-Dz-EvWd_.js";
import "./TradeDialog-Dt4WEyMP.js";
const generalSettingsSchema = z.object({
  site_settings: z.object({
    site_name: z.string().min(1, "Site name is required").max(100, "Site name must be less than 100 characters"),
    user_site_name: z.string().min(1, "User site name is required").max(100, "User site name must be less than 100 characters"),
    user_site_name_short: z.string().min(1, "User site short name is required").max(20, "Short name must be less than 20 characters"),
    site_phone: z.string().min(1, "Phone is required").regex(/^[\+]?[0-9\s\-\(\)]+$/, "Enter a valid phone number"),
    site_email: z.string().min(1, "Email is required").email("Enter valid email"),
    address: z.string().min(1, "Address is required").max(500, "Address must be less than 500 characters"),
    copy_right_text: z.string().min(1, "Copyright text is required").max(300, "Copyright text must be less than 300 characters"),
    privacy_policy_url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
    terms_conditions_url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
    time_zone: z.string().min(1, "Time zone is required"),
    date_format: z.string().min(1, "Date format is required"),
    time_format: z.string().min(1, "Time format is required"),
    country: z.string().min(1, "Country is required"),
    pagination_number: z.number().min(1, "Data per page must be at least 1").max(1e3, "Data per page cannot exceed 1000")
  })
});
function GeneralSettingsForm({ props }) {
  let {
    countries,
    date_formats: dateFormats,
    time_formats: timeFormats,
    time_zones: timeZones,
    settings
  } = props;
  settings = settings?.data || [];
  countries = countries?.map((country) => ({
    value: country?.name,
    label: country?.name
  }));
  dateFormats = dateFormats?.map((dateFormat) => ({
    value: dateFormat,
    label: dateFormat
  }));
  timeFormats = timeFormats?.map((timeFormat) => ({
    value: timeFormat,
    label: timeFormat
  }));
  timeZones = timeZones?.map((timeZone) => ({
    value: timeZone,
    label: timeZone
  }));
  const { loading: isSubmitting, submit } = useForm();
  const form = useForm$1({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      site_settings: {
        site_name: getSettings(settings, "site_name") || "",
        user_site_name: getSettings(settings, "user_site_name") || "",
        user_site_name_short: getSettings(settings, "user_site_name_short") || "",
        site_phone: getSettings(settings, "site_phone") || "",
        site_email: getSettings(settings, "site_email") || "",
        address: getSettings(settings, "address") || "DEMO",
        copy_right_text: getSettings(settings, "copy_right_text") || `© ${(/* @__PURE__ */ new Date()).getFullYear()} All rights reserved.`,
        privacy_policy_url: getSettings(settings, "privacy_policy_url") || "",
        terms_conditions_url: getSettings(settings, "terms_conditions_url") || "",
        time_zone: getSettings(settings, "time_zone") || "UTC",
        date_format: getSettings(settings, "date_format", "d M, Y") || "d M, Y",
        time_format: getSettings(settings, "time_format", "h:i A") || "h:i A",
        country: getSettings(settings, "country", "Cyprus") || "Cyprus",
        pagination_number: Number(getSettings(settings, "pagination_number", 10) || 10)
      }
    }
  });
  const watchSiteName = form.watch("site_settings.site_name");
  const watchUserSiteName = form.watch("site_settings.user_site_name");
  const watchSiteEmail = form.watch("site_settings.site_email");
  const watchCountry = form.watch("site_settings.country");
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", {
      className: "flex items-center gap-2 mb-6", children: [
      /* @__PURE__ */ jsx(Settings, { className: "w-6 h-6 text-primary" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "General Settings" }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 ml-auto", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "System Configuration" }) })
      ]
    }),
    /* @__PURE__ */ jsx(Form, {
      ...form, children: /* @__PURE__ */ jsxs("form", {
        onSubmit: form.handleSubmit((e) => onSettingsUpdate(e, submit)), className: "space-y-6", children: [
      /* @__PURE__ */ jsxs(Alert, {
          className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
        /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx(AlertDescription, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "space-y-2", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Site Configuration" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Configure basic site information, contact details, and system preferences that will be used throughout your application." })
              ]
            })
          })
          ]
        }),
      /* @__PURE__ */ jsxs(Card, {
          children: [
        /* @__PURE__ */ jsx(CardHeader, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Globe, { className: "w-5 h-5 text-blue-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Basic Information" })
              ]
            })
          }),
        /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-4", children: [
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.site_name",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4" }),
                      "Site Name",
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "Enter site name", ...field, className: "font-medium" }) }),
                /* @__PURE__ */ jsx(FormDescription, { children: "The name of your website or application that will appear in titles and headers" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.copy_right_text",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Copyright, { className: "w-4 h-4" }),
                      "Copyright Text",
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "© 2024 Your Company Name. All rights reserved.", ...field }) }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Copyright notice that will appear in the footer and legal pages" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.privacy_policy_url",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4" }),
                      "Privacy Policy URL",
                  /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Optional" })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "https://example.com/privacy-policy", ...field }) }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Link to your privacy policy page" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.terms_conditions_url",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4" }),
                      "Terms & Conditions URL",
                  /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Optional" })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "https://example.com/terms-conditions", ...field }) }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Link to your terms and conditions page" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.address",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4" }),
                      "Address",
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "Enter complete address", ...field }) }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Your organization's physical address for contact and legal purposes" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.country",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4" }),
                      "Country",
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                    ]
                  }),
                /* @__PURE__ */ jsxs(Select, {
                    onValueChange: field.onChange, value: field.value, children: [
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select country" }) }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: countries.map((country) => /* @__PURE__ */ jsx(SelectItem, { value: country.value, children: country.label }, country.value)) })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Select your primary operating country for localization and legal compliance" }),
                /* @__PURE__ */ jsx(FormMessage, {})
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
          /* @__PURE__ */ jsx(UserCircle, { className: "w-5 h-5 text-indigo-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "User Portal Branding" })
              ]
            })
          }),
        /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-4", children: [
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.user_site_name",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(UserCircle, { className: "w-4 h-4" }),
                      "User Site Name",
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "e.g., MyApp Portal, Customer Dashboard", ...field, className: "font-medium" }) }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Brand name displayed to users in the user-facing portal and dashboards" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.user_site_name_short",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Hash, { className: "w-4 h-4" }),
                      "User Site Short Name",
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" }),
                  /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Max 20 chars" })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Input,
                      {
                        placeholder: "e.g., MyApp, Portal",
                        ...field,
                        maxLength: 20,
                        className: "max-w-xs font-semibold tracking-wide"
                      }
                    )
                  }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Abbreviated name for mobile views, notifications, and compact displays" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            ),
              (watchUserSiteName || form.watch("site_settings.user_site_name_short")) && /* @__PURE__ */ jsxs(Alert, {
                className: "border-indigo-200 bg-indigo-50 dark:bg-indigo-950", children: [
            /* @__PURE__ */ jsx(UserCircle, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx(AlertDescription, {
                  children: /* @__PURE__ */ jsxs("div", {
                    className: "space-y-2", children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-indigo-800 dark:text-indigo-200", children: "Portal Name Preview" }),
              /* @__PURE__ */ jsxs("div", {
                      className: "flex flex-wrap gap-3 text-sm", children: [
                        watchUserSiteName && /* @__PURE__ */ jsxs("div", {
                          className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-indigo-600 dark:text-indigo-400", children: "Full:" }),
                  /* @__PURE__ */ jsx("code", { className: "px-2 py-1 font-medium bg-white rounded dark:bg-indigo-900", children: watchUserSiteName })
                          ]
                        }),
                        form.watch("site_settings.user_site_name_short") && /* @__PURE__ */ jsxs("div", {
                          className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-indigo-600 dark:text-indigo-400", children: "Short:" }),
                  /* @__PURE__ */ jsx("code", { className: "px-2 py-1 font-semibold bg-white rounded dark:bg-indigo-900", children: form.watch("site_settings.user_site_name_short") })
                          ]
                        })
                      ]
                    })
                    ]
                  })
                })
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
          /* @__PURE__ */ jsx(Phone, { className: "w-5 h-5 text-green-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Contact Information" })
              ]
            })
          }),
        /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-4", children: [
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.site_phone",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4" }),
                      "Phone Number",
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "tel", placeholder: "Enter phone number", ...field, className: "" }) }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Primary contact phone number for customer support and inquiries" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.site_email",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4" }),
                      "Email Address",
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "email", placeholder: "admin@example.com", ...field, className: "" }) }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Primary contact email address for system notifications and support" }),
                /* @__PURE__ */ jsx(FormMessage, {})
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
          /* @__PURE__ */ jsx(Clock, { className: "w-5 h-5 text-purple-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Localization & Time" })
              ]
            })
          }),
        /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-4", children: [
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.time_zone",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4" }),
                      "Time Zone",
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                    ]
                  }),
                /* @__PURE__ */ jsxs(Select, {
                    onValueChange: field.onChange, value: field.value, children: [
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select time zone" }) }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: timeZones.map((timezone) => /* @__PURE__ */ jsx(SelectItem, { value: timezone.value, children: timezone.label }, timezone.value)) })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Default timezone for displaying dates and times throughout the application" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.date_format",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" }),
                      "Date Format",
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                    ]
                  }),
                /* @__PURE__ */ jsxs(Select, {
                    onValueChange: field.onChange, value: field.value, children: [
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select date format" }) }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: dateFormats.map((format) => /* @__PURE__ */ jsx(SelectItem, { value: format.value, children: format.label }, format.value)) })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormDescription, { children: "How dates will be displayed across the application interface" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.time_format",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4" }),
                      "Time Format",
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                    ]
                  }),
                /* @__PURE__ */ jsxs(Select, {
                    onValueChange: field.onChange, value: field.value, children: [
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select time format" }) }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: timeFormats.map((format) => /* @__PURE__ */ jsx(SelectItem, { value: format.value, children: format.label }, format.value)) })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormDescription, { children: "How times will be displayed across the application interface" }),
                /* @__PURE__ */ jsx(FormMessage, {})
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
          /* @__PURE__ */ jsx(Database, { className: "w-5 h-5 text-orange-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "System Preferences" })
              ]
            })
          }),
        /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.pagination_number",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
              /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Users, { className: "w-4 h-4" }),
                      "Data Per Page",
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                    ]
                  }),
              /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "number",
                        placeholder: "10",
                        ...field,
                        onChange: (e) => field.onChange(parseInt(e.target.value) || 0),
                        className: "max-w-xs"
                      }
                    )
                  }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Default number of items to display per page in data tables and lists (1-1000)" }),
              /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            )
          })
          ]
        }),
      /* @__PURE__ */ jsx(Card, {
          className: "border-green-200 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950", children: /* @__PURE__ */ jsx(CardContent, {
            className: "p-6", children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", {
                children: [
          /* @__PURE__ */ jsxs("h3", {
                  className: "flex items-center gap-2 text-lg font-semibold", children: [
                    "Configuration Summary",
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Ready to Save" })
                  ]
                }),
          /* @__PURE__ */ jsxs("p", {
                  className: "mt-1 text-sm text-muted-foreground", children: [
                    watchSiteName && `Site: ${watchSiteName}`,
                    watchUserSiteName && ` • User Portal: ${watchUserSiteName}`,
                    watchSiteEmail && ` • Contact: ${watchSiteEmail}`,
                    watchCountry && ` • Located in ${watchCountry}`
                  ]
                })
                ]
              }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-10 h-10 text-green-600 bg-green-100 rounded-full dark:bg-green-900", children: /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5" }) }) })
              ]
            })
          })
        }),
      /* @__PURE__ */ jsx(Button, { disabled: isSubmitting, type: "submit", children: /* @__PURE__ */ jsx(ButtonLoader, { isSubmitting }) })
        ]
      })
    })
    ]
  });
}
function RadioGroup({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Root,
    {
      "data-slot": "radio-group",
      className: cn("grid gap-3", className),
      ...props
    }
  );
}
function RadioGroupItem({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Item,
    {
      "data-slot": "radio-group-item",
      className: cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        RadioGroupPrimitive.Indicator,
        {
          "data-slot": "radio-group-indicator",
          className: "relative flex items-center justify-center",
          children: /* @__PURE__ */ jsx(CircleIcon, { className: "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" })
        }
      )
    }
  );
}
const appearanceFormSchema = z.object({
  site_settings: z.object({
    theme_mode: z.enum(["light", "dark"]),
    font: z.enum(fonts)
  })
});
function AppearanceForm({ props }) {
  const {
    site_theme_settings
  } = props;
  const themeMode = site_theme_settings?.theme_mode;
  const defaultValues = {
    theme_mode: themeMode == "system" ? "light" : themeMode,
    font: site_theme_settings?.font
  };
  const form = useForm$1({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      site_settings: defaultValues
    }
  });
  const { loading: isSubmitting, submit } = useForm();
  return /* @__PURE__ */ jsx(Form, {
    ...form, children: /* @__PURE__ */ jsxs("form", {
      onSubmit: form.handleSubmit((e) => onSettingsUpdate(e, submit)), className: "space-y-8", children: [
    /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "site_settings.font",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
            children: [
          /* @__PURE__ */ jsx(FormLabel, { children: "Font" }),
          /* @__PURE__ */ jsxs("div", {
              className: "relative w-max", children: [
            /* @__PURE__ */ jsx(FormControl, {
                children: /* @__PURE__ */ jsx(
                  "select",
                  {
                    className: cn(
                      buttonVariants({ variant: "outline" }),
                      "w-[200px] appearance-none font-normal capitalize",
                      "dark:bg-background dark:hover:bg-background"
                    ),
                    ...field,
                    children: fonts.map((font) => /* @__PURE__ */ jsx("option", { value: font, children: font }, font))
                  }
                )
              }),
            /* @__PURE__ */ jsx(ChevronDownIcon, { className: "absolute end-3 top-2.5 h-4 w-4 opacity-50" })
              ]
            }),
          /* @__PURE__ */ jsx(FormDescription, { className: "font-manrope", children: "Set the font you want to use in the dashboard." }),
          /* @__PURE__ */ jsx(FormMessage, {})
            ]
          })
        }
      ),
    /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "site_settings.theme_mode",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
            children: [
          /* @__PURE__ */ jsx(FormLabel, { children: "Theme" }),
          /* @__PURE__ */ jsx(FormDescription, { children: "Select the theme for the dashboard." }),
          /* @__PURE__ */ jsx(FormMessage, {}),
          /* @__PURE__ */ jsxs(
              RadioGroup,
              {
                onValueChange: field.onChange,
                defaultValue: field.value,
                className: "grid max-w-md grid-cols-2 gap-8 pt-2",
                children: [
                /* @__PURE__ */ jsx(FormItem, {
                  children: /* @__PURE__ */ jsxs(FormLabel, {
                    className: "[&:has([data-state=checked])>div]:border-primary", children: [
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(RadioGroupItem, { value: "light", className: "sr-only" }) }),
                  /* @__PURE__ */ jsx("div", {
                      className: "items-center p-1 border-2 rounded-md border-muted hover:border-accent", children: /* @__PURE__ */ jsxs("div", {
                        className: "space-y-2 rounded-sm bg-[#ecedef] p-2", children: [
                    /* @__PURE__ */ jsxs("div", {
                          className: "p-2 space-y-2 bg-white rounded-md shadow-xs", children: [
                      /* @__PURE__ */ jsx("div", { className: "h-2 w-[80px] rounded-lg bg-[#ecedef]" }),
                      /* @__PURE__ */ jsx("div", { className: "h-2 w-[100px] rounded-lg bg-[#ecedef]" })
                          ]
                        }),
                    /* @__PURE__ */ jsxs("div", {
                          className: "flex items-center p-2 space-x-2 bg-white rounded-md shadow-xs", children: [
                      /* @__PURE__ */ jsx("div", { className: "h-4 w-4 rounded-full bg-[#ecedef]" }),
                      /* @__PURE__ */ jsx("div", { className: "h-2 w-[100px] rounded-lg bg-[#ecedef]" })
                          ]
                        }),
                    /* @__PURE__ */ jsxs("div", {
                          className: "flex items-center p-2 space-x-2 bg-white rounded-md shadow-xs", children: [
                      /* @__PURE__ */ jsx("div", { className: "h-4 w-4 rounded-full bg-[#ecedef]" }),
                      /* @__PURE__ */ jsx("div", { className: "h-2 w-[100px] rounded-lg bg-[#ecedef]" })
                          ]
                        })
                        ]
                      })
                    }),
                  /* @__PURE__ */ jsx("span", { className: "block w-full p-2 font-normal text-center", children: "Light" })
                    ]
                  })
                }),
                /* @__PURE__ */ jsx(FormItem, {
                  children: /* @__PURE__ */ jsxs(FormLabel, {
                    className: "[&:has([data-state=checked])>div]:border-primary", children: [
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(RadioGroupItem, { value: "dark", className: "sr-only" }) }),
                  /* @__PURE__ */ jsx("div", {
                      className: "items-center p-1 border-2 rounded-md border-muted bg-popover hover:bg-accent hover:text-accent-foreground", children: /* @__PURE__ */ jsxs("div", {
                        className: "p-2 space-y-2 rounded-sm bg-slate-950", children: [
                    /* @__PURE__ */ jsxs("div", {
                          className: "p-2 space-y-2 rounded-md shadow-xs bg-slate-800", children: [
                      /* @__PURE__ */ jsx("div", { className: "h-2 w-[80px] rounded-lg bg-slate-400" }),
                      /* @__PURE__ */ jsx("div", { className: "h-2 w-[100px] rounded-lg bg-slate-400" })
                          ]
                        }),
                    /* @__PURE__ */ jsxs("div", {
                          className: "flex items-center p-2 space-x-2 rounded-md shadow-xs bg-slate-800", children: [
                      /* @__PURE__ */ jsx("div", { className: "w-4 h-4 rounded-full bg-slate-400" }),
                      /* @__PURE__ */ jsx("div", { className: "h-2 w-[100px] rounded-lg bg-slate-400" })
                          ]
                        }),
                    /* @__PURE__ */ jsxs("div", {
                          className: "flex items-center p-2 space-x-2 rounded-md shadow-xs bg-slate-800", children: [
                      /* @__PURE__ */ jsx("div", { className: "w-4 h-4 rounded-full bg-slate-400" }),
                      /* @__PURE__ */ jsx("div", { className: "h-2 w-[100px] rounded-lg bg-slate-400" })
                          ]
                        })
                        ]
                      })
                    }),
                  /* @__PURE__ */ jsx("span", { className: "block w-full p-2 font-normal text-center", children: "Dark" })
                    ]
                  })
                })
                ]
              }
            )
            ]
          })
        }
      ),
    /* @__PURE__ */ jsx(Button, { type: "submit", children: /* @__PURE__ */ jsx(ButtonLoader, { isSubmitting }) })
      ]
    })
  });
}
const logoSettingsSchema = z.object({
  site_settings: z.object({
    site_logo: z.any().refine((file) => !file || file instanceof File, "Must be a file").optional(),
    favicon: z.any().refine((file) => !file || file instanceof File, "Must be a file").optional(),
    payment_image: z.any().refine((file) => !file || file instanceof File, "Must be a file").optional()
  })
});
function LogoForm({ props }) {
  const logos = props?.logos;
  const [logoPreview, setLogoPreview] = useState(logos?.site_logo || null);
  const [faviconPreview, setFaviconPreview] = useState(logos?.favicon || null);
  const [paymentImagePreview, setPaymentImagePreview] = useState(logos?.payment_image || null);
  const { loading: isSubmitting, submit } = useForm();
  const form = useForm$1({
    resolver: zodResolver(logoSettingsSchema),
    defaultValues: {
      site_settings: {
        site_logo: null,
        favicon: null,
        payment_image: null
      }
    }
  });
  const clearPreview = (type) => {
    if (type === "logo") {
      setLogoPreview(null);
      form.setValue("site_settings.site_logo", null);
    } else if (type === "favicon") {
      setFaviconPreview(null);
      form.setValue("site_settings.favicon", null);
    } else if (type === "payment_image") {
      setPaymentImagePreview(null);
      form.setValue("site_settings.payment_image", null);
    }
  };
  const hasChanges = form.watch("site_settings.site_logo") || form.watch("site_settings.favicon") || form.watch("site_settings.payment_image");
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", {
      className: "flex items-center gap-2 mb-6", children: [
      /* @__PURE__ */ jsx(Image, { className: "w-6 h-6 text-primary" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Logo & Branding" }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 ml-auto", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Visual Identity" }) })
      ]
    }),
    /* @__PURE__ */ jsx(Form, {
      ...form, children: /* @__PURE__ */ jsxs("form", {
        onSubmit: form.handleSubmit((e) => onLogoUpdate(e, submit)), className: "space-y-6", children: [
      /* @__PURE__ */ jsxs(Alert, {
          className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
        /* @__PURE__ */ jsx(Palette, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx(AlertDescription, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "space-y-2", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Brand Identity Management" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Upload your site logo, favicon, user site logo, and payment image to establish your brand identity across all touchpoints." })
              ]
            })
          })
          ]
        }),
      /* @__PURE__ */ jsxs(Card, {
          children: [
        /* @__PURE__ */ jsx(CardHeader, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Image, { className: "w-5 h-5 text-blue-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Site Logo" }),
                logoPreview && /* @__PURE__ */ jsx(Badge, { variant: "default", className: "text-xs", children: "Current" })
              ]
            })
          }),
        /* @__PURE__ */ jsx(CardContent, {
            className: "space-y-4", children: /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.site_logo",
                render: ({ field: { onChange, ...rest } }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
              /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4" }),
                      "Upload Logo"
                    ]
                  }),
              /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsxs("div", {
                      className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", {
                        className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsx(
                          Input,
                          {
                            type: "file",
                            accept: "image/*",
                            onChange: (e) => handleImageChange(e, onChange, setLogoPreview),
                            className: "max-w-md"
                          }
                        ),
                          logoPreview && /* @__PURE__ */ jsxs(
                            Button,
                            {
                              type: "button",
                              variant: "outline",
                              size: "sm",
                              onClick: () => clearPreview("logo"),
                              className: "text-red-600 hover:text-red-700",
                              children: [
                        /* @__PURE__ */ jsx(X, { className: "w-3 h-3 mr-1" }),
                                "Clear"
                              ]
                            }
                          )
                        ]
                      }),
                        logoPreview && /* @__PURE__ */ jsx("div", {
                          className: "relative inline-block", children: /* @__PURE__ */ jsxs("div", {
                            className: "p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-900", children: [
                  /* @__PURE__ */ jsx(
                              "img",
                              {
                                src: logoPreview,
                                alt: "Site Logo Preview",
                                className: "object-contain w-48 h-24 rounded-lg"
                              }
                            ),
                  /* @__PURE__ */ jsxs("div", {
                              className: "flex items-center gap-2 mt-3 text-xs text-green-600", children: [
                    /* @__PURE__ */ jsx(CheckCircle, { className: "w-3 h-3" }),
                                "Logo ready for upload"
                              ]
                            })
                            ]
                          })
                        }),
                        !logoPreview && /* @__PURE__ */ jsxs("div", {
                          className: "p-8 text-center border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-600", children: [
                  /* @__PURE__ */ jsx(Image, { className: "w-12 h-12 mx-auto mb-3 text-gray-400" }),
                  /* @__PURE__ */ jsx("p", { className: "mb-1 text-sm text-gray-500", children: "No logo uploaded" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: "PNG, JPG, GIF up to 2MB" })
                          ]
                        })
                      ]
                    })
                  }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Your main site logo that appears in headers and navigation. Recommended size: 200x80 pixels or similar aspect ratio." }),
              /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            )
          })
          ]
        }),
      /* @__PURE__ */ jsxs(Card, {
          children: [
        /* @__PURE__ */ jsx(CardHeader, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(CreditCard, { className: "w-5 h-5 text-orange-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Payment Image" }),
                paymentImagePreview && /* @__PURE__ */ jsx(Badge, { variant: "default", className: "text-xs", children: "Current" })
              ]
            })
          }),
        /* @__PURE__ */ jsx(CardContent, {
            className: "space-y-4", children: /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.payment_image",
                render: ({ field: { onChange, ...rest } }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
              /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4" }),
                      "Upload Payment Image"
                    ]
                  }),
              /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsxs("div", {
                      className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", {
                        className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsx(
                          Input,
                          {
                            type: "file",
                            accept: "image/*",
                            onChange: (e) => handleImageChange(e, onChange, setPaymentImagePreview),
                            className: "max-w-md"
                          }
                        ),
                          paymentImagePreview && /* @__PURE__ */ jsxs(
                            Button,
                            {
                              type: "button",
                              variant: "outline",
                              size: "sm",
                              onClick: () => clearPreview("payment_image"),
                              className: "text-red-600 hover:text-red-700",
                              children: [
                        /* @__PURE__ */ jsx(X, { className: "w-3 h-3 mr-1" }),
                                "Clear"
                              ]
                            }
                          )
                        ]
                      }),
                        paymentImagePreview && /* @__PURE__ */ jsx("div", {
                          className: "relative inline-block", children: /* @__PURE__ */ jsxs("div", {
                            className: "p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-900", children: [
                  /* @__PURE__ */ jsx(
                              "img",
                              {
                                src: paymentImagePreview,
                                alt: "Payment Image Preview",
                                className: "object-contain w-64 h-32 rounded-lg"
                              }
                            ),
                  /* @__PURE__ */ jsxs("div", {
                              className: "flex items-center gap-2 mt-3 text-xs text-green-600", children: [
                    /* @__PURE__ */ jsx(CheckCircle, { className: "w-3 h-3" }),
                                "Payment image ready for upload"
                              ]
                            })
                            ]
                          })
                        }),
                        !paymentImagePreview && /* @__PURE__ */ jsxs("div", {
                          className: "p-8 text-center border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-600", children: [
                  /* @__PURE__ */ jsx(CreditCard, { className: "w-12 h-12 mx-auto mb-3 text-gray-400" }),
                  /* @__PURE__ */ jsx("p", { className: "mb-1 text-sm text-gray-500", children: "No payment image uploaded" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: "PNG, JPG up to 2MB" })
                          ]
                        })
                      ]
                    })
                  }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Image displayed on payment pages and checkout. Can include payment method logos or trust badges. Recommended size: 400x200 pixels." }),
              /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            )
          })
          ]
        }),
      /* @__PURE__ */ jsxs(Card, {
          children: [
        /* @__PURE__ */ jsx(CardHeader, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Eye, { className: "w-5 h-5 text-green-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Favicon" }),
                faviconPreview && /* @__PURE__ */ jsx(Badge, { variant: "default", className: "text-xs", children: "Current" })
              ]
            })
          }),
        /* @__PURE__ */ jsx(CardContent, {
            className: "space-y-4", children: /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.favicon",
                render: ({ field: { onChange, ...rest } }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
              /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4" }),
                      "Upload Favicon"
                    ]
                  }),
              /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsxs("div", {
                      className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", {
                        className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsx(
                          Input,
                          {
                            type: "file",
                            accept: "image/*,.ico",
                            onChange: (e) => handleImageChange(e, onChange, setFaviconPreview),
                            className: "max-w-md"
                          }
                        ),
                          faviconPreview && /* @__PURE__ */ jsxs(
                            Button,
                            {
                              type: "button",
                              variant: "outline",
                              size: "sm",
                              onClick: () => clearPreview("favicon"),
                              className: "text-red-600 hover:text-red-700",
                              children: [
                        /* @__PURE__ */ jsx(X, { className: "w-3 h-3 mr-1" }),
                                "Clear"
                              ]
                            }
                          )
                        ]
                      }),
                        faviconPreview && /* @__PURE__ */ jsx("div", {
                          className: "relative inline-block", children: /* @__PURE__ */ jsxs("div", {
                            className: "p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-900", children: [
                  /* @__PURE__ */ jsxs("div", {
                              className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsx(
                                "img",
                                {
                                  src: faviconPreview,
                                  alt: "Favicon Preview",
                                  className: "object-cover w-8 h-8 border rounded"
                                }
                              ),
                    /* @__PURE__ */ jsx(
                                "img",
                                {
                                  src: faviconPreview,
                                  alt: "Favicon Preview Large",
                                  className: "object-cover w-16 h-16 border rounded-lg"
                                }
                              ),
                    /* @__PURE__ */ jsxs("div", {
                                className: "text-xs text-gray-500", children: [
                      /* @__PURE__ */ jsx("div", { className: "mb-1 font-medium", children: "Preview sizes" }),
                      /* @__PURE__ */ jsx("div", { children: "Small: Browser tab" }),
                      /* @__PURE__ */ jsx("div", { children: "Large: Bookmarks" })
                                ]
                              })
                              ]
                            }),
                  /* @__PURE__ */ jsxs("div", {
                              className: "flex items-center gap-2 mt-3 text-xs text-green-600", children: [
                    /* @__PURE__ */ jsx(CheckCircle, { className: "w-3 h-3" }),
                                "Favicon ready for upload"
                              ]
                            })
                            ]
                          })
                        }),
                        !faviconPreview && /* @__PURE__ */ jsxs("div", {
                          className: "p-8 text-center border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-600", children: [
                  /* @__PURE__ */ jsx(Eye, { className: "w-12 h-12 mx-auto mb-3 text-gray-400" }),
                  /* @__PURE__ */ jsx("p", { className: "mb-1 text-sm text-gray-500", children: "No favicon uploaded" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: "ICO, PNG files up to 1MB" })
                          ]
                        })
                      ]
                    })
                  }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Small icon that appears in browser tabs and bookmarks. Recommended size: 32x32 pixels. ICO format preferred for best compatibility." }),
              /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            )
          })
          ]
        }),
      /* @__PURE__ */ jsxs(Card, {
          className: "border-purple-200 bg-purple-50 dark:bg-purple-950", children: [
        /* @__PURE__ */ jsx(CardHeader, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Info, { className: "w-5 h-5 text-purple-500" }),
          /* @__PURE__ */ jsx(CardTitle, { className: "text-purple-800 dark:text-purple-200", children: "Brand Guidelines" })
              ]
            })
          }),
        /* @__PURE__ */ jsx(CardContent, {
            className: "space-y-3", children: /* @__PURE__ */ jsxs("div", {
              className: "grid gap-4 text-sm md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", {
                children: [
            /* @__PURE__ */ jsx("h4", { className: "mb-2 font-medium text-purple-800 dark:text-purple-200", children: "Logo Requirements" }),
            /* @__PURE__ */ jsxs("ul", {
                  className: "space-y-1 text-purple-700 dark:text-purple-300", children: [
              /* @__PURE__ */ jsx("li", { children: "• Transparent background preferred" }),
              /* @__PURE__ */ jsx("li", { children: "• High resolution (minimum 200px wide)" }),
              /* @__PURE__ */ jsx("li", { children: "• Clear, readable at small sizes" }),
              /* @__PURE__ */ jsx("li", { children: "• PNG format recommended" })
                  ]
                })
                ]
              }),
          /* @__PURE__ */ jsxs("div", {
                children: [
            /* @__PURE__ */ jsx("h4", { className: "mb-2 font-medium text-purple-800 dark:text-purple-200", children: "Favicon Best Practices" }),
            /* @__PURE__ */ jsxs("ul", {
                  className: "space-y-1 text-purple-700 dark:text-purple-300", children: [
              /* @__PURE__ */ jsx("li", { children: "• 32x32 pixels is standard" }),
              /* @__PURE__ */ jsx("li", { children: "• Simple, recognizable design" }),
              /* @__PURE__ */ jsx("li", { children: "• Good contrast for visibility" }),
              /* @__PURE__ */ jsx("li", { children: "• ICO format for best support" })
                  ]
                })
                ]
              }),
          /* @__PURE__ */ jsxs("div", {
                children: [
            /* @__PURE__ */ jsx("h4", { className: "mb-2 font-medium text-purple-800 dark:text-purple-200", children: "Payment Image Guidelines" }),
            /* @__PURE__ */ jsxs("ul", {
                  className: "space-y-1 text-purple-700 dark:text-purple-300", children: [
              /* @__PURE__ */ jsx("li", { children: "• Include payment method logos" }),
              /* @__PURE__ */ jsx("li", { children: "• Trust badges and security icons" }),
              /* @__PURE__ */ jsx("li", { children: "• Clear, professional appearance" }),
              /* @__PURE__ */ jsx("li", { children: "• 400x200px recommended size" })
                  ]
                })
                ]
              })
              ]
            })
          })
          ]
        }),
          hasChanges && /* @__PURE__ */ jsx(Card, {
            className: "border-green-200 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950", children: /* @__PURE__ */ jsx(CardContent, {
              className: "p-6", children: /* @__PURE__ */ jsxs("div", {
                className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", {
                  children: [
          /* @__PURE__ */ jsxs("h3", {
                    className: "flex items-center gap-2 text-lg font-semibold", children: [
                      "Ready to Update",
            /* @__PURE__ */ jsxs(Badge, {
                        variant: "outline", className: "text-xs", children: [
                          [logoPreview, faviconPreview, paymentImagePreview].filter(Boolean).length,
                          " file(s) ready"
                        ]
                      })
                    ]
                  }),
          /* @__PURE__ */ jsxs("p", {
                    className: "mt-1 text-sm text-muted-foreground", children: [
                      form.watch("site_settings.site_logo") && "New logo selected",
                      form.watch("site_settings.site_logo") && (form.watch("site_settings.favicon") || form.watch("site_settings.payment_image")) && " • ",
                      (form.watch("site_settings.favicon") || form.watch("site_settings.payment_image")) && " • ",
                      form.watch("site_settings.payment_image") && "New payment image selected",
                      form.watch("site_settings.payment_image") && form.watch("site_settings.favicon") && " • ",
                      form.watch("site_settings.favicon") && "New favicon selected"
                    ]
                  })
                  ]
                }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-10 h-10 text-green-600 bg-green-100 rounded-full dark:bg-green-900", children: /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5" }) }) })
                ]
              })
            })
          }),
      /* @__PURE__ */ jsx(Button, { disabled: isSubmitting, type: "submit", children: /* @__PURE__ */ jsx(ButtonLoader, { isSubmitting }) })
        ]
      })
    })
    ]
  });
}
const storageSettingsSchema = z.object({
  site_settings: z.object({
    storage: z.enum(["local", "s3", "ftp"], {
      required_error: "Please select a storage type"
    }),
    // FTP Configuration
    ftp_configuration: z.object({
      host: z.string().optional(),
      port: z.string().optional(),
      user_name: z.string().optional(),
      password: z.string().optional(),
      root: z.string().optional()
    }).optional(),
    // S3 Configuration
    s3_configuration: z.object({
      s3_key: z.string().optional(),
      s3_secret: z.string().optional(),
      s3_region: z.string().optional(),
      s3_bucket: z.string().optional()
    }).optional(),
    // File Settings
    mime_types: z.array(z.string()).min(1, "Please select at least one file type"),
    max_file_size: z.string().min(1, "Max file size is required"),
    max_file_upload: z.string().min(1, "Max file count is required")
  })
}).refine((data) => {
  const { storage, ftp_configuration } = data.site_settings;
  if (storage == "ftp") {
    return ftp_configuration?.host && ftp_configuration?.port && ftp_configuration?.user_name && ftp_configuration?.password;
  }
  return true;
}, {
  message: "FTP settings are required when FTP is selected",
  path: ["site_settings", "ftp_configuration", "host"]
}).refine((data) => {
  const { storage, s3_configuration } = data.site_settings;
  if (storage === "s3") {
    return s3_configuration?.s3_key && s3_configuration?.s3_secret && s3_configuration?.s3_region && s3_configuration?.s3_bucket;
  }
  return true;
}, {
  message: "S3 settings are required when S3 is selected",
  path: ["site_settings", "s3_configuration", "s3_key"]
});
const fileTypes = [
  { id: "jpg", label: "JPG" },
  { id: "jpeg", label: "JPEG" },
  { id: "png", label: "PNG" },
  { id: "gif", label: "GIF" },
  { id: "webp", label: "WebP" },
  { id: "svg", label: "SVG" },
  { id: "pdf", label: "PDF" },
  { id: "doc", label: "DOC" },
  { id: "docx", label: "DOCX" },
  { id: "txt", label: "TXT" },
  { id: "csv", label: "CSV" },
  { id: "xlsx", label: "XLSX" },
  { id: "zip", label: "ZIP" },
  { id: "mp4", label: "MP4" },
  { id: "mp3", label: "MP3" }
];
function StorageSettingsForm({ props }) {
  let {
    storage,
    aws_config: awsConfig,
    ftp_config: ftpConfig,
    max_file_size: maxFileSize,
    mime_types: mimeTypes,
    max_file_upload: maxFileUpload
  } = props;
  const [selectedFileTypes, setSelectedFileTypes] = useState(mimeTypes || []);
  const { loading: isSubmitting, submit } = useForm();
  const form = useForm$1({
    resolver: zodResolver(storageSettingsSchema),
    defaultValues: {
      site_settings: {
        storage: storage || "local",
        // FTP defaults
        ftp_configuration: {
          host: ftpConfig?.host || "",
          port: ftpConfig?.port || "21",
          username: ftpConfig?.user_name || "",
          password: ftpConfig?.password || "",
          root: ftpConfig?.root || "/"
        },
        // S3 defaults
        s3_configuration: {
          s3_key: awsConfig?.s3_key || "",
          s3_secret: awsConfig?.s3_secret || "",
          s3_region: awsConfig?.s3_region || "us-east-1",
          s3_bucket: awsConfig?.s3_bucket || ""
        },
        // File defaults
        mime_types: mimeTypes || ["jpg", "png", "pdf"],
        max_file_size: maxFileSize || "10",
        max_file_upload: maxFileUpload || "5"
      }
    }
  });
  const watchStorageType = form.watch("site_settings.storage");
  const handleFileTypeChange = (fileType, checked) => {
    let newFileTypes;
    if (checked) {
      newFileTypes = [...selectedFileTypes, fileType];
    } else {
      newFileTypes = selectedFileTypes.filter((type) => type !== fileType);
    }
    setSelectedFileTypes(newFileTypes);
    form.setValue("site_settings.mime_types", newFileTypes);
  };
  return /* @__PURE__ */ jsx(Form, {
    ...form, children: /* @__PURE__ */ jsxs("form", {
      onSubmit: form.handleSubmit((e) => onSettingsUpdate(e, submit)), className: "space-y-6", children: [
    /* @__PURE__ */ jsxs(Card, {
        children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Storage Configuration" }) }),
      /* @__PURE__ */ jsxs(CardContent, {
          className: "space-y-6", children: [
        /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "site_settings.storage",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Storage Type" }),
              /* @__PURE__ */ jsxs(Select, {
                  onValueChange: field.onChange, defaultValue: field.value, children: [
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select storage type" }) }) }),
                /* @__PURE__ */ jsxs(SelectContent, {
                    children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "local", children: "Local Storage" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "s3", children: "Amazon S3" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "ftp", children: "FTP Server" })
                    ]
                  })
                  ]
                }),
              /* @__PURE__ */ jsx(FormMessage, {})
                ]
              })
            }
          ),
            watchStorageType === "ftp" && /* @__PURE__ */ jsxs(Card, {
              className: "border-blue-200", children: [
          /* @__PURE__ */ jsxs(CardHeader, {
                children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "FTP Configuration" }),
            /* @__PURE__ */ jsxs(Alert, {
                  children: [
              /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx(AlertDescription, { children: "Make sure your FTP server supports passive mode and has proper firewall configuration for file transfers." })
                  ]
                })
                ]
              }),
          /* @__PURE__ */ jsxs(CardContent, {
                className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", {
                  className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsx(
                    FormField,
                    {
                      control: form.control,
                      name: "site_settings.ftp_configuration.host",
                      render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                        children: [
                    /* @__PURE__ */ jsx(FormLabel, { children: "Host" }),
                    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "ftp.example.com", ...field }) }),
                    /* @__PURE__ */ jsx(FormMessage, {})
                        ]
                      })
                    }
                  ),
              /* @__PURE__ */ jsx(
                    FormField,
                    {
                      control: form.control,
                      name: "site_settings.ftp_configuration.port",
                      render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                        children: [
                    /* @__PURE__ */ jsx(FormLabel, { children: "Port" }),
                    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "number", placeholder: "21", ...field }) }),
                    /* @__PURE__ */ jsx(FormMessage, {})
                        ]
                      })
                    }
                  )
                  ]
                }),
            /* @__PURE__ */ jsxs("div", {
                  className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsx(
                    FormField,
                    {
                      control: form.control,
                      name: "site_settings.ftp_configuration.user_name",
                      render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                        children: [
                    /* @__PURE__ */ jsx(FormLabel, { children: "Username" }),
                    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "your-username", ...field }) }),
                    /* @__PURE__ */ jsx(FormMessage, {})
                        ]
                      })
                    }
                  ),
              /* @__PURE__ */ jsx(
                    FormField,
                    {
                      control: form.control,
                      name: "site_settings.ftp_configuration.password",
                      render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                        children: [
                    /* @__PURE__ */ jsx(FormLabel, { children: "Password" }),
                    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "text", placeholder: "your-password", ...field }) }),
                    /* @__PURE__ */ jsx(FormMessage, {})
                        ]
                      })
                    }
                  )
                  ]
                }),
            /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "site_settings.ftp_configuration.root",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                      children: [
                  /* @__PURE__ */ jsx(FormLabel, { children: "Root Directory" }),
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "/", ...field }) }),
                  /* @__PURE__ */ jsx(FormDescription, { children: "The root directory path on the FTP server" }),
                  /* @__PURE__ */ jsx(FormMessage, {})
                      ]
                    })
                  }
                )
                ]
              })
              ]
            }),
            watchStorageType === "s3" && /* @__PURE__ */ jsxs(Card, {
              className: "border-green-200", children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Amazon S3 Configuration" }) }),
          /* @__PURE__ */ jsxs(CardContent, {
                className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", {
                  className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsx(
                    FormField,
                    {
                      control: form.control,
                      name: "site_settings.s3_configuration.s3_key",
                      render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                        children: [
                    /* @__PURE__ */ jsx(FormLabel, { children: "Access Key ID" }),
                    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "AKIAIOSFODNN7EXAMPLE", ...field }) }),
                    /* @__PURE__ */ jsx(FormMessage, {})
                        ]
                      })
                    }
                  ),
              /* @__PURE__ */ jsx(
                    FormField,
                    {
                      control: form.control,
                      name: "site_settings.s3_configuration.s3_secret",
                      render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                        children: [
                    /* @__PURE__ */ jsx(FormLabel, { children: "Secret Access Key" }),
                    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "text", placeholder: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY", ...field }) }),
                    /* @__PURE__ */ jsx(FormMessage, {})
                        ]
                      })
                    }
                  )
                  ]
                }),
            /* @__PURE__ */ jsxs("div", {
                  className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsx(
                    FormField,
                    {
                      control: form.control,
                      name: "site_settings.s3_configuration.s3_region",
                      render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                        children: [
                    /* @__PURE__ */ jsx(FormLabel, { children: "Region" }),
                    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "us-east-1", ...field }) }),
                    /* @__PURE__ */ jsx(FormMessage, {})
                        ]
                      })
                    }
                  ),
              /* @__PURE__ */ jsx(
                    FormField,
                    {
                      control: form.control,
                      name: "site_settings.s3_configuration.s3_bucket",
                      render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                        children: [
                    /* @__PURE__ */ jsx(FormLabel, { children: "Bucket Name" }),
                    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "my-app-bucket", ...field }) }),
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
            })
          ]
        })
        ]
      }),
    /* @__PURE__ */ jsxs(Card, {
        children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "File Upload Settings" }) }),
      /* @__PURE__ */ jsxs(CardContent, {
          className: "space-y-6", children: [
        /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "site_settings.mime_types",
              render: () => /* @__PURE__ */ jsxs(FormItem, {
                children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Supported File Types" }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Select the file types that users can upload" }),
              /* @__PURE__ */ jsx("div", {
                  className: "grid grid-cols-3 gap-4 mt-2", children: fileTypes.map((fileType) => /* @__PURE__ */ jsxs(
                    FormItem,
                    {
                      className: "flex flex-row items-start space-x-3 space-y-0",
                      children: [
                    /* @__PURE__ */ jsx(FormControl, {
                        children: /* @__PURE__ */ jsx(
                          Checkbox,
                          {
                            checked: selectedFileTypes.includes(fileType.id),
                            onCheckedChange: (checked) => handleFileTypeChange(fileType.id, checked)
                          }
                        )
                      }),
                    /* @__PURE__ */ jsx(FormLabel, { className: "text-sm font-normal", children: fileType.label })
                      ]
                    },
                    fileType.id
                  ))
                }),
              /* @__PURE__ */ jsx(FormMessage, {})
                ]
              })
            }
          ),
        /* @__PURE__ */ jsxs("div", {
            className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.max_file_size",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Max File Upload Size (KB)" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { min: "1", type: "number", placeholder: "10", ...field }) }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Maximum size per file in megabytes" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.max_file_upload",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Max File Upload Count" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { min: "1", type: "number", placeholder: "5", ...field }) }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Maximum number of files per upload" }),
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
    /* @__PURE__ */ jsx(Button, { disabled: isSubmitting, type: "submit", children: /* @__PURE__ */ jsx(ButtonLoader, { isSubmitting }) })
      ]
    })
  });
}
const securitySettingsSchema = z.object({
  site_settings: z.object({
    // Authentication Settings
    session_timeout: z.string().min(1, "Session timeout is required").refine((val) => parseInt(val) >= 5, {
      message: "Session timeout must be at least 5 minutes"
    }).refine((val) => parseInt(val) <= 1440, {
      message: "Session timeout cannot exceed 24 hours (1440 minutes)"
    }),
    login_attempt_validation: z.boolean(),
    maximum_login_attempts: z.string().min(1, "Max login attempts is required").refine((val) => parseInt(val) >= 1, {
      message: "Must allow at least 1 login attempt"
    }).refine((val) => parseInt(val) <= 20, {
      message: "Maximum 20 login attempts allowed"
    }),
    // Password Security
    minimum_password_length: z.string().min(1, "Minimum password length is required").refine((val) => parseInt(val) >= 6, {
      message: "Minimum password length must be at least 6 characters"
    }).refine((val) => parseInt(val) <= 128, {
      message: "Password length cannot exceed 128 characters"
    }),
    strong_password: z.boolean(),
    // SSL Security
    force_ssl: z.boolean(),
    // Maintenance Mode
    maintenance_mode: z.boolean(),
    maintenance_title: z.string().optional(),
    maintenance_description: z.string().optional()
  })
}).refine((data) => {
  const { maintenance_mode, maintenance_title, maintenance_description } = data.site_settings;
  if (maintenance_mode) {
    return maintenance_title && maintenance_title.trim().length > 0 && maintenance_description && maintenance_description.trim().length > 0;
  }
  return true;
}, {
  message: "Title and description are required when maintenance mode is active",
  path: ["site_settings", "maintenance_title"]
});
function SecuritySettingsForm({ props }) {
  const {
    session_timeout: sessionTimeout,
    login_attempt_validation: maxLoginValidation,
    maximum_login_attempts: maxLoginAttempts,
    minimum_password_length: minPasswordLength,
    strong_password: strongPasswordEnabled,
    force_ssl: forceSsl,
    maintenance_mode: maintenanceModeActive,
    maintenance_title: maintenanceTitle,
    maintenance_description: maintenanceDescription
  } = props;
  const { loading: isSubmitting, submit } = useForm();
  const form = useForm$1({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      site_settings: {
        session_timeout: sessionTimeout?.toString() || "120",
        login_attempt_validation: maxLoginValidation === "active",
        maximum_login_attempts: maxLoginAttempts?.toString() || "5",
        minimum_password_length: minPasswordLength?.toString() || "8",
        strong_password: strongPasswordEnabled === "active",
        force_ssl: forceSsl === "active",
        maintenance_mode: maintenanceModeActive === "active",
        maintenance_title: maintenanceTitle || "System Maintenance",
        maintenance_description: maintenanceDescription || "We are currently performing scheduled maintenance. Please check back later."
      }
    }
  });
  const watchMaintenanceMode = form.watch("site_settings.maintenance_mode");
  const watchMaxLoginValidation = form.watch("site_settings.login_attempt_validation");
  const watchStrongPassword = form.watch("site_settings.strong_password");
  const watchForceSsl = form.watch("site_settings.force_ssl");
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", {
      className: "flex items-center gap-2 mb-6", children: [
      /* @__PURE__ */ jsx(Shield, { className: "w-6 h-6 text-primary" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Security Settings" })
      ]
    }),
    /* @__PURE__ */ jsx(Form, {
      ...form, children: /* @__PURE__ */ jsxs("form", {
        onSubmit: form.handleSubmit((e) => onSettingsUpdate(e, submit)), className: "space-y-6", children: [
      /* @__PURE__ */ jsxs(Card, {
          children: [
        /* @__PURE__ */ jsx(CardHeader, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Lock, { className: "w-5 h-5 text-blue-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Authentication Security" })
              ]
            })
          }),
        /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-6", children: [
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.session_timeout",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                      "Session Timeout",
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Minutes" })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "number",
                        min: "5",
                        max: "1440",
                        placeholder: "120",
                        ...field,
                        className: "max-w-xs"
                      }
                    )
                  }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Users will be automatically logged out after this period of inactivity (5-1440 minutes)" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsxs("div", {
              className: "space-y-4", children: [
            /* @__PURE__ */ jsx(
                FormField,
                {
                  control: form.control,
                  name: "site_settings.login_attempt_validation",
                  render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                    className: "flex flex-row items-center justify-between rounded-lg border p-4", children: [
                  /* @__PURE__ */ jsxs("div", {
                      className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsx(FormLabel, { className: "text-base", children: "Login Attempt Validation" }),
                    /* @__PURE__ */ jsx(FormDescription, { children: "Enable protection against brute force attacks" })
                      ]
                    }),
                  /* @__PURE__ */ jsx(FormControl, {
                      children: /* @__PURE__ */ jsx(
                        Switch,
                        {
                          checked: field.value,
                          onCheckedChange: field.onChange
                        }
                      )
                    })
                    ]
                  })
                }
              ),
                watchMaxLoginValidation && /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "security_settings.maximum_login_attempts",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                      className: "ml-4", children: [
                  /* @__PURE__ */ jsxs(FormLabel, {
                        className: "flex items-center gap-2", children: [
                          "Maximum Login Attempts",
                    /* @__PURE__ */ jsx(Badge, { variant: "destructive", className: "text-xs", children: "Critical" })
                        ]
                      }),
                  /* @__PURE__ */ jsx(FormControl, {
                        children: /* @__PURE__ */ jsx(
                          Input,
                          {
                            type: "number",
                            min: "1",
                            max: "20",
                            placeholder: "5",
                            ...field,
                            className: "max-w-xs"
                          }
                        )
                      }),
                  /* @__PURE__ */ jsx(FormDescription, { children: "Account will be temporarily locked after this many failed attempts (1-20)" }),
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
          /* @__PURE__ */ jsx(Lock, { className: "w-5 h-5 text-green-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Password Security" })
              ]
            })
          }),
        /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-6", children: [
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.minimum_password_length",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                      "Minimum Password Length",
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Characters" })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "number",
                        min: "6",
                        max: "128",
                        placeholder: "8",
                        ...field,
                        className: "max-w-xs"
                      }
                    )
                  }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Minimum number of characters required for user passwords (6-128)" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.strong_password",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  className: "flex flex-row items-center justify-between rounded-lg border p-4", children: [
                /* @__PURE__ */ jsxs("div", {
                    className: "space-y-0.5", children: [
                  /* @__PURE__ */ jsxs(FormLabel, {
                      className: "text-base flex items-center gap-2", children: [
                        "Strong Password Requirements",
                        watchStrongPassword && /* @__PURE__ */ jsx(Badge, { variant: "default", className: "text-xs", children: "Enabled" })
                      ]
                    }),
                  /* @__PURE__ */ jsx(FormDescription, { children: "Require uppercase, lowercase, numbers, and special characters" })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Switch,
                      {
                        checked: field.value,
                        onCheckedChange: field.onChange
                      }
                    )
                  })
                  ]
                })
              }
            ),
              watchStrongPassword && /* @__PURE__ */ jsxs(Alert, {
                className: "border-green-200 bg-green-50 dark:bg-green-950", children: [
            /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxs(AlertDescription, {
                  children: [
                    "Strong password policy is active. Passwords must contain:",
              /* @__PURE__ */ jsxs("ul", {
                      className: "mt-2 ml-4 list-disc text-sm", children: [
                /* @__PURE__ */ jsx("li", { children: "At least one uppercase letter (A-Z)" }),
                /* @__PURE__ */ jsx("li", { children: "At least one lowercase letter (a-z)" }),
                /* @__PURE__ */ jsx("li", { children: "At least one number (0-9)" }),
                /* @__PURE__ */ jsx("li", { children: "At least one special character (!@#$%^&*)" })
                      ]
                    })
                  ]
                })
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
          /* @__PURE__ */ jsx(Server, { className: "w-5 h-5 text-purple-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Connection Security" })
              ]
            })
          }),
        /* @__PURE__ */ jsxs(CardContent, {
            children: [
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.force_ssl",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  className: "flex flex-row items-center justify-between rounded-lg border p-4", children: [
                /* @__PURE__ */ jsxs("div", {
                    className: "space-y-0.5", children: [
                  /* @__PURE__ */ jsxs(FormLabel, {
                      className: "text-base flex items-center gap-2", children: [
                        "Force SSL/HTTPS",
                        watchForceSsl && /* @__PURE__ */ jsx(Badge, { variant: "default", className: "text-xs bg-green-500", children: "Secure" })
                      ]
                    }),
                  /* @__PURE__ */ jsx(FormDescription, { children: "Redirect all HTTP requests to HTTPS for enhanced security" })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Switch,
                      {
                        checked: field.value,
                        onCheckedChange: field.onChange
                      }
                    )
                  })
                  ]
                })
              }
            ),
              watchForceSsl && /* @__PURE__ */ jsxs(Alert, {
                className: "mt-4 border-green-200 bg-green-50 dark:bg-green-950", children: [
            /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx(AlertDescription, { children: "SSL enforcement is active. All traffic will be encrypted and secure." })
                ]
              })
            ]
          })
          ]
        }),
      /* @__PURE__ */ jsxs(Card, {
          className: watchMaintenanceMode ? "border-orange-200 bg-orange-50 dark:bg-orange-950" : "", children: [
        /* @__PURE__ */ jsx(CardHeader, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Settings, { className: "w-5 h-5 text-orange-500" }),
          /* @__PURE__ */ jsxs(CardTitle, {
                className: "flex items-center gap-2", children: [
                  "Maintenance Mode",
                  watchMaintenanceMode && /* @__PURE__ */ jsx(Badge, { variant: "destructive", className: "text-xs", children: "Active" })
                ]
              })
              ]
            })
          }),
        /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-6", children: [
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.maintenance_mode",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  className: "flex flex-row items-center justify-between rounded-lg border p-4", children: [
                /* @__PURE__ */ jsxs("div", {
                    className: "space-y-0.5", children: [
                  /* @__PURE__ */ jsx(FormLabel, { className: "text-base", children: "Enable Maintenance Mode" }),
                  /* @__PURE__ */ jsx(FormDescription, { children: "Put the website in maintenance mode to prevent user access" })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Switch,
                      {
                        checked: field.value,
                        onCheckedChange: field.onChange
                      }
                    )
                  })
                  ]
                })
              }
            ),
              watchMaintenanceMode && /* @__PURE__ */ jsxs(Alert, {
                className: "border-orange-200 bg-orange-100 dark:bg-orange-900", children: [
            /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxs(AlertDescription, {
                  children: [
              /* @__PURE__ */ jsx("strong", { children: "Warning:" }),
                    " When maintenance mode is active, regular users will not be able to access the website."
                  ]
                })
                ]
              }),
              watchMaintenanceMode && /* @__PURE__ */ jsx(
                FormField,
                {
                  control: form.control,
                  name: "site_settings.maintenance_title",
                  render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                    children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Maintenance Page Title" }),
                /* @__PURE__ */ jsx(FormControl, {
                      children: /* @__PURE__ */ jsx(
                        Input,
                        {
                          placeholder: "System Maintenance",
                          ...field
                        }
                      )
                    }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Title displayed to users during maintenance" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                    ]
                  })
                }
              ),
              watchMaintenanceMode && /* @__PURE__ */ jsx(
                FormField,
                {
                  control: form.control,
                  name: "site_settings.maintenance_description",
                  render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                    children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Maintenance Message" }),
                /* @__PURE__ */ jsx(FormControl, {
                      children: /* @__PURE__ */ jsx(
                        Textarea,
                        {
                          placeholder: "We are currently performing scheduled maintenance. Please check back later.",
                          className: "min-h-[100px]",
                          ...field
                        }
                      )
                    }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Detailed message explaining the maintenance to users" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                    ]
                  })
                }
              )
            ]
          })
          ]
        }),
      /* @__PURE__ */ jsx(Button, { disabled: isSubmitting, type: "submit", children: /* @__PURE__ */ jsx(ButtonLoader, { isSubmitting }) })
        ]
      })
    })
    ]
  });
}
const systemPreferencesSchema = z.object({
  site_settings: z.object({
    app_debug: z.boolean(),
    database_notification: z.boolean(),
    user_registration: z.boolean(),
    email_verification: z.boolean()
  })
});
const systemSettings = [
  {
    key: "app_debug",
    icon: Code,
    title: "App Debug Mode",
    description: "Enable detailed error reporting and debugging information for development",
    warningDescription: "Debug mode exposes sensitive information. Never enable in production.",
    type: "warning",
    color: "text-red-500",
    activeColor: "border-red-200 bg-red-50 dark:bg-red-950",
    badge: { active: "Debug On", inactive: "Debug Off", variant: "destructive" }
  },
  {
    key: "database_notification",
    icon: Database,
    title: "Database Notifications",
    description: "Enable real-time database query notifications and performance monitoring",
    infoDescription: "Helps monitor database performance and identify slow queries.",
    type: "info",
    color: "text-blue-500",
    activeColor: "border-blue-200 bg-blue-50 dark:bg-blue-950",
    badge: { active: "Monitoring On", inactive: "Monitoring Off", variant: "default" }
  },
  {
    key: "user_registration",
    icon: UserPlus,
    title: "User Registration",
    description: "Allow new users to register accounts on the platform",
    infoDescription: "When disabled, only administrators can create new user accounts.",
    type: "info",
    color: "text-green-500",
    activeColor: "border-green-200 bg-green-50 dark:bg-green-950",
    badge: { active: "Open", inactive: "Closed", variant: "default" }
  },
  {
    key: "email_verification",
    icon: Mail,
    title: "Email Verification",
    description: "Require users to verify their email address before account activation",
    infoDescription: "Improves security and ensures valid email addresses for communications.",
    type: "success",
    color: "text-purple-500",
    activeColor: "border-purple-200 bg-purple-50 dark:bg-purple-950",
    badge: { active: "Required", inactive: "Optional", variant: "secondary" }
  }
];
function SystemPreferencesForm({ props }) {
  const {
    app_debug: appDebug,
    database_notification: databaseNotification,
    user_registration: userRegistration,
    email_verification: emailVerification
  } = props;
  const { loading: isSubmitting, submit } = useForm();
  const { submit: submitFn } = useForm();
  const form = useForm$1({
    resolver: zodResolver(systemPreferencesSchema),
    defaultValues: {
      site_settings: {
        app_debug: appDebug ?? false,
        database_notification: databaseNotification === "active",
        user_registration: userRegistration === "active",
        email_verification: emailVerification === "active"
      }
    }
  });
  const watchedValues = form.watch("site_settings");
  const getStatusBadge = (setting, isActive) => {
    const badgeText = isActive ? setting.badge.active : setting.badge.inactive;
    const variant = isActive ? "default" : "secondary";
    return /* @__PURE__ */ jsx(Badge, { variant, className: "text-xs", children: badgeText });
  };
  const renderSettingCard = (setting) => {
    const isActive = watchedValues[setting.key];
    const IconComponent = setting.icon;
    return /* @__PURE__ */ jsx(
      Card,
      {
        className: `transition-all duration-200 ${isActive ? setting.activeColor : ""}`,
        children: /* @__PURE__ */ jsx(CardContent, {
          className: "p-6", children: /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: `site_settings.${setting.key}`,
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                className: "flex flex-row items-start justify-between space-y-0", children: [
              /* @__PURE__ */ jsxs("div", {
                  className: "flex-1 space-y-2", children: [
                /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(IconComponent, { className: `w-5 h-5 ${setting.color}` }),
                  /* @__PURE__ */ jsxs(FormLabel, {
                      className: "flex items-center gap-2 text-base font-semibold", children: [
                        setting.title,
                        getStatusBadge(setting, isActive)
                      ]
                    })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormDescription, { className: "text-sm text-muted-foreground", children: setting.description }),
                    isActive && setting.warningDescription && /* @__PURE__ */ jsxs(Alert, {
                      className: "mt-3 border-orange-200 bg-orange-50 dark:bg-orange-950", children: [
                  /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsxs(AlertDescription, {
                        className: "text-sm", children: [
                    /* @__PURE__ */ jsx("strong", { children: "Warning:" }),
                          " ",
                          setting.warningDescription
                        ]
                      })
                      ]
                    }),
                    isActive && setting.infoDescription && setting.key !== "app_debug" && /* @__PURE__ */ jsxs(Alert, {
                      className: "mt-3 border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
                  /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx(AlertDescription, { className: "text-sm", children: setting.infoDescription })
                      ]
                    }),
                    !isActive && setting.infoDescription && /* @__PURE__ */ jsx("div", { className: "p-3 mt-2 border rounded-md bg-gray-50 dark:bg-gray-800", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: setting.infoDescription }) })
                  ]
                }),
              /* @__PURE__ */ jsx("div", {
                  className: "flex items-center", children: /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Switch,
                      {
                        checked: field.value,
                        onCheckedChange: (checked) => {
                          if (setting.key == "app_debug") {
                            toggleDebugMode(submitFn);
                          }
                          field.onChange(checked);
                        },
                        className: "data-[state=checked]:bg-primary"
                      }
                    )
                  })
                })
                ]
              })
            }
          )
        })
      },
      setting.key
    );
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", {
      className: "flex items-center gap-2 mb-6", children: [
      /* @__PURE__ */ jsx(Settings, { className: "w-6 h-6 text-primary" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "System Preferences" }),
      /* @__PURE__ */ jsxs(Badge, {
        variant: "outline", className: "ml-auto", children: [
          Object.values(watchedValues).filter(Boolean).length,
          " of ",
          systemSettings.length,
          " Active"
        ]
      })
      ]
    }),
    /* @__PURE__ */ jsx(Form, {
      ...form, children: /* @__PURE__ */ jsxs("form", {
        onSubmit: form.handleSubmit((e) => onSettingsUpdate(e, submit)), className: "space-y-6", children: [
      /* @__PURE__ */ jsxs(Alert, {
          className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
        /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx(AlertDescription, { children: "These settings control core system functionality. Changes will take effect immediately after saving." })
          ]
        }),
      /* @__PURE__ */ jsxs("div", {
          className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Code, { className: "w-5 h-5 text-orange-500" }),
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "Development & Debugging" })
            ]
          }),
            renderSettingCard(systemSettings[0]),
            " "
          ]
        }),
      /* @__PURE__ */ jsxs("div", {
          className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Database, { className: "w-5 h-5 text-blue-500" }),
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "System Monitoring" })
            ]
          }),
            renderSettingCard(systemSettings[1]),
            " "
          ]
        }),
      /* @__PURE__ */ jsxs("div", {
          className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(UserPlus, { className: "w-5 h-5 text-green-500" }),
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "User Management" })
            ]
          }),
        /* @__PURE__ */ jsxs("div", {
            className: "space-y-4", children: [
              renderSettingCard(systemSettings[2]),
              " ",
              renderSettingCard(systemSettings[3]),
              " "
            ]
          })
          ]
        }),
          watchedValues.app_debug && /* @__PURE__ */ jsxs(Alert, {
            className: "border-red-200 bg-red-50 dark:bg-red-950", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsxs(AlertDescription, {
              children: [
          /* @__PURE__ */ jsx("strong", { children: "Production Warning:" }),
                " Debug mode is currently enabled. This should be disabled in production environments to prevent security vulnerabilities."
              ]
            })
            ]
          }),
      /* @__PURE__ */ jsx(Card, {
            className: "border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950", children: /* @__PURE__ */ jsx(CardContent, {
              className: "p-4", children: /* @__PURE__ */ jsxs("div", {
                className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", {
                  children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Current Configuration" }),
          /* @__PURE__ */ jsxs("p", {
                    className: "mt-1 text-xs text-muted-foreground", children: [
                      Object.entries(watchedValues).filter(([_, value]) => value).length,
                      " features enabled,",
                      Object.entries(watchedValues).filter(([_, value]) => !value).length,
                      " features disabled"
                    ]
                  })
                  ]
                }),
        /* @__PURE__ */ jsx("div", {
                  className: "flex gap-2", children: Object.entries(watchedValues).map(([key, value]) => {
                    const setting = systemSettings.find((s) => s.key === key);
                    const IconComponent = setting?.icon;
                    return /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `w-8 h-8 rounded-full flex items-center justify-center ${value ? "bg-green-100 text-green-600 dark:bg-green-900" : "bg-gray-100 text-gray-400 dark:bg-gray-800"}`,
                        title: setting?.title,
                        children: /* @__PURE__ */ jsx(IconComponent, { className: "w-4 h-4" })
                      },
                      key
                    );
                  })
                })
                ]
              })
            })
          }),
      /* @__PURE__ */ jsx(
            Button,
            {
              disabled: isSubmitting,
              type: "submit",
              children: /* @__PURE__ */ jsx(ButtonLoader, { isSubmitting })
            }
          )
        ]
      })
    })
    ]
  });
}
const recaptchaSettingsSchema = z.object({
  site_settings: z.object({
    // Basic reCAPTCHA Configuration
    recaptcha_public_key: z.string().optional(),
    recaptcha_secret_key: z.string().optional(),
    google_recaptcha: z.boolean(),
    // Feature-specific toggles
    login_require_recaptcha: z.boolean(),
    register_require_recaptcha: z.boolean()
  })
}).refine((data) => {
  const { google_recaptcha, recaptcha_public_key, recaptcha_secret_key } = data.site_settings;
  if (google_recaptcha) {
    return recaptcha_public_key && recaptcha_public_key.trim().length > 0 && recaptcha_secret_key && recaptcha_secret_key.trim().length > 0;
  }
  return true;
}, {
  message: "Site key and secret key are required when reCAPTCHA is enabled",
  path: ["site_settings", "recaptcha_public_key"]
});
function RecaptchaSettingsForm({ props }) {
  const {
    recaptcha_public_key: siteKey,
    recaptcha_secret_key: secretKey,
    google_recaptcha: recaptchaStatus,
    login_require_recaptcha: loginCaptchaActive,
    register_require_recaptcha: registrationCaptchaActive
  } = props;
  const [showSecretKey, setShowSecretKey] = useState(false);
  const { loading: isSubmitting, submit } = useForm();
  const form = useForm$1({
    resolver: zodResolver(recaptchaSettingsSchema),
    defaultValues: {
      site_settings: {
        recaptcha_public_key: siteKey || "",
        recaptcha_secret_key: secretKey || "",
        google_recaptcha: recaptchaStatus === "active",
        login_require_recaptcha: loginCaptchaActive === "active",
        register_require_recaptcha: registrationCaptchaActive === "active"
      }
    }
  });
  const watchRecaptchaStatus = form.watch("site_settings.google_recaptcha");
  const watchLoginCaptcha = form.watch("site_settings.login_require_recaptcha");
  const watchRegistrationCaptcha = form.watch("site_settings.register_require_recaptcha");
  const watchSiteKey = form.watch("site_settings.recaptcha_public_key");
  const watchSecretKey = form.watch("site_settings.recaptcha_secret_key");
  const isConfigured = watchSiteKey && watchSecretKey && watchSiteKey.trim().length > 0 && watchSecretKey.trim().length > 0;
  const hasActiveFeatures = watchLoginCaptcha || watchRegistrationCaptcha;
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", {
      className: "flex items-center gap-2 mb-6", children: [
      /* @__PURE__ */ jsx(Shield, { className: "w-6 h-6 text-primary" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Google reCAPTCHA Settings" }),
      /* @__PURE__ */ jsxs("div", {
        className: "flex gap-2 ml-auto", children: [
          watchRecaptchaStatus && /* @__PURE__ */ jsx(Badge, { variant: isConfigured ? "default" : "destructive", className: "text-xs", children: isConfigured ? "Configured" : "Incomplete" }),
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: hasActiveFeatures ? `${[watchLoginCaptcha, watchRegistrationCaptcha].filter(Boolean).length} Features Active` : "No Features Active" })
        ]
      })
      ]
    }),
    /* @__PURE__ */ jsx(Form, {
      ...form, children: /* @__PURE__ */ jsxs("form", {
        onSubmit: form.handleSubmit((e) => onSettingsUpdate(e, submit)), className: "space-y-6", children: [
      /* @__PURE__ */ jsxs(Alert, {
          className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
        /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsxs(AlertDescription, {
            className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxs("div", {
              children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Google reCAPTCHA Integration" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm", children: "Protect your application from spam and abuse with Google's reCAPTCHA service." })
              ]
            }),
          /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "ml-4",
                onClick: () => window.open("https://www.google.com/recaptcha/admin", "_blank"),
                type: "button",
                children: [
                /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 mr-1" }),
                  "Get Keys"
                ]
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
          /* @__PURE__ */ jsx(Key, { className: "w-5 h-5 text-green-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "reCAPTCHA Configuration" })
              ]
            })
          }),
        /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-6", children: [
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.google_recaptcha",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  className: "flex flex-row items-center justify-between p-4 border rounded-lg", children: [
                /* @__PURE__ */ jsxs("div", {
                    className: "space-y-0.5", children: [
                  /* @__PURE__ */ jsxs(FormLabel, {
                      className: "flex items-center gap-2 text-base", children: [
                        "Enable Google reCAPTCHA",
                        watchRecaptchaStatus && /* @__PURE__ */ jsx(Badge, { variant: "default", className: "text-xs", children: "Active" })
                      ]
                    }),
                  /* @__PURE__ */ jsx(FormDescription, { children: "Enable or disable Google reCAPTCHA service for your application" })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Switch,
                      {
                        checked: field.value,
                        onCheckedChange: field.onChange
                      }
                    )
                  })
                  ]
                })
              }
            ),
              watchRecaptchaStatus && /* @__PURE__ */ jsxs("div", {
                className: "space-y-4", children: [
            /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "site_settings.recaptcha_public_key",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                      children: [
                  /* @__PURE__ */ jsxs(FormLabel, {
                        className: "flex items-center gap-2", children: [
                          "Site Key (Public Key)",
                    /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Public" })
                        ]
                      }),
                  /* @__PURE__ */ jsx(FormControl, {
                        children: /* @__PURE__ */ jsx(
                          Input,
                          {
                            placeholder: "6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                            ...field,
                            className: " text-sm"
                          }
                        )
                      }),
                  /* @__PURE__ */ jsx(FormDescription, { children: "The site key is used in the HTML code your site uses to render the reCAPTCHA widget" }),
                  /* @__PURE__ */ jsx(FormMessage, {})
                      ]
                    })
                  }
                ),
            /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "site_settings.recaptcha_secret_key",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                      children: [
                  /* @__PURE__ */ jsxs(FormLabel, {
                        className: "flex items-center gap-2", children: [
                          "Secret Key (Private Key)",
                    /* @__PURE__ */ jsx(Badge, { variant: "destructive", className: "text-xs", children: "Private" })
                        ]
                      }),
                  /* @__PURE__ */ jsx(FormControl, {
                        children: /* @__PURE__ */ jsxs("div", {
                          className: "relative", children: [
                    /* @__PURE__ */ jsx(
                            Input,
                            {
                              type: showSecretKey ? "text" : "password",
                              placeholder: "6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                              ...field,
                              className: "pr-10  text-sm"
                            }
                          ),
                    /* @__PURE__ */ jsx(
                            Button,
                            {
                              type: "button",
                              variant: "ghost",
                              size: "icon",
                              className: "absolute top-0 right-0 h-full px-3 hover:bg-transparent",
                              onClick: () => setShowSecretKey(!showSecretKey),
                              children: showSecretKey ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4 text-gray-400" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4 text-gray-400" })
                            }
                          )
                          ]
                        })
                      }),
                  /* @__PURE__ */ jsx(FormDescription, { children: "The secret key is used for communication between your site and Google. Keep this private!" }),
                  /* @__PURE__ */ jsx(FormMessage, {})
                      ]
                    })
                  }
                ),
                  watchRecaptchaStatus && /* @__PURE__ */ jsxs(Alert, {
                    className: isConfigured ? "border-green-200 bg-green-50 dark:bg-green-950" : "border-orange-200 bg-orange-50 dark:bg-orange-950", children: [
                      isConfigured ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx(AlertDescription, {
                        children: isConfigured ? /* @__PURE__ */ jsxs("span", {
                          children: [
                /* @__PURE__ */ jsx("strong", { children: "Configuration Complete:" }),
                            " Your reCAPTCHA keys are properly configured."
                          ]
                        }) : /* @__PURE__ */ jsxs("span", {
                          children: [
                /* @__PURE__ */ jsx("strong", { children: "Configuration Required:" }),
                            " Please provide both site key and secret key to enable reCAPTCHA."
                          ]
                        })
                      })
                    ]
                  })
                ]
              })
            ]
          })
          ]
        }),
          watchRecaptchaStatus && /* @__PURE__ */ jsxs(Card, {
            children: [
        /* @__PURE__ */ jsx(CardHeader, {
              children: /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Lock, { className: "w-5 h-5 text-blue-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "reCAPTCHA Features" })
                ]
              })
            }),
        /* @__PURE__ */ jsxs(CardContent, {
              className: "space-y-6", children: [
                !isConfigured && /* @__PURE__ */ jsxs(Alert, {
                  className: "border-orange-200 bg-orange-50 dark:bg-orange-950", children: [
            /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx(AlertDescription, { children: "Complete the reCAPTCHA configuration above to enable these features." })
                  ]
                }),
          /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "site_settings.login_require_recaptcha",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                      className: `flex flex-row items-center justify-between rounded-lg border p-4 ${!isConfigured ? "opacity-50" : ""}`, children: [
                /* @__PURE__ */ jsxs("div", {
                        className: "space-y-0.5", children: [
                  /* @__PURE__ */ jsxs(FormLabel, {
                          className: "flex items-center gap-2 text-base", children: [
                            "Login reCAPTCHA",
                            watchLoginCaptcha && isConfigured && /* @__PURE__ */ jsx(Badge, { variant: "default", className: "text-xs", children: "Protected" })
                          ]
                        }),
                  /* @__PURE__ */ jsx(FormDescription, { children: "Require reCAPTCHA verification on the login form to prevent brute force attacks" })
                        ]
                      }),
                /* @__PURE__ */ jsx(FormControl, {
                        children: /* @__PURE__ */ jsx(
                          Switch,
                          {
                            checked: field.value,
                            onCheckedChange: field.onChange,
                            disabled: !isConfigured
                          }
                        )
                      })
                      ]
                    })
                  }
                ),
          /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "site_settings.register_require_recaptcha",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                      className: `flex flex-row items-center justify-between rounded-lg border p-4 ${!isConfigured ? "opacity-50" : ""}`, children: [
                /* @__PURE__ */ jsxs("div", {
                        className: "space-y-0.5", children: [
                  /* @__PURE__ */ jsxs(FormLabel, {
                          className: "flex items-center gap-2 text-base", children: [
                            "Registration reCAPTCHA",
                            watchRegistrationCaptcha && isConfigured && /* @__PURE__ */ jsx(Badge, { variant: "default", className: "text-xs", children: "Protected" })
                          ]
                        }),
                  /* @__PURE__ */ jsx(FormDescription, { children: "Require reCAPTCHA verification on the registration form to prevent spam accounts" })
                        ]
                      }),
                /* @__PURE__ */ jsx(FormControl, {
                        children: /* @__PURE__ */ jsx(
                          Switch,
                          {
                            checked: field.value,
                            onCheckedChange: field.onChange,
                            disabled: !isConfigured
                          }
                        )
                      })
                      ]
                    })
                  }
                ),
                hasActiveFeatures && isConfigured && /* @__PURE__ */ jsxs(Alert, {
                  className: "border-green-200 bg-green-50 dark:bg-green-950", children: [
            /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx(AlertDescription, {
                    children: /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", {
                        children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Active Protection" }),
                /* @__PURE__ */ jsxs("p", {
                          className: "mt-1 text-sm", children: [
                            "reCAPTCHA is protecting: ",
                            [
                              watchLoginCaptcha && "Login",
                              watchRegistrationCaptcha && "Registration"
                            ].filter(Boolean).join(", ")
                          ]
                        })
                        ]
                      }),
              /* @__PURE__ */ jsxs("div", {
                        className: "flex gap-1", children: [
                          watchLoginCaptcha && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-8 h-8 bg-green-100 rounded-full", children: /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4 text-green-600" }) }),
                          watchRegistrationCaptcha && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full", children: /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4 text-blue-600" }) })
                        ]
                      })
                      ]
                    })
                  })
                  ]
                })
              ]
            })
            ]
          }),
          !watchRecaptchaStatus && /* @__PURE__ */ jsx(Card, {
            className: "border-gray-300 border-dashed dark:border-gray-600", children: /* @__PURE__ */ jsx(CardContent, {
              className: "p-6", children: /* @__PURE__ */ jsxs("div", {
                className: "space-y-4 text-center", children: [
        /* @__PURE__ */ jsx(Shield, { className: "w-12 h-12 mx-auto text-gray-400" }),
        /* @__PURE__ */ jsxs("div", {
                  children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Get Started with reCAPTCHA" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Protect your application from spam and abuse by enabling Google reCAPTCHA" })
                  ]
                }),
        /* @__PURE__ */ jsxs("div", {
                  className: "flex flex-col justify-center gap-2 sm:flex-row", children: [
          /* @__PURE__ */ jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      onClick: () => window.open("https://www.google.com/recaptcha/admin", "_blank"),
                      type: "button",
                      children: [
                /* @__PURE__ */ jsx(ExternalLink, { className: "w-4 h-4 mr-2" }),
                        "Get reCAPTCHA Keys"
                      ]
                    }
                  ),
          /* @__PURE__ */ jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      onClick: () => window.open("https://developers.google.com/recaptcha/docs/display", "_blank"),
                      type: "button",
                      children: [
                /* @__PURE__ */ jsx(Info, { className: "w-4 h-4 mr-2" }),
                        "View Documentation"
                      ]
                    }
                  )
                  ]
                })
                ]
              })
            })
          }),
      /* @__PURE__ */ jsx(Button, { disabled: isSubmitting, type: "submit", children: /* @__PURE__ */ jsx(ButtonLoader, { isSubmitting }) })
        ]
      })
    })
    ]
  });
}
const seoSettingsSchema = z.object({
  site_settings: z.object({
    site_name: z.string().min(10, "Site title should be at least 10 characters").max(60, "Site title should not exceed 60 characters for optimal SEO"),
    site_description: z.string().min(120, "Site description should be at least 120 characters").max(160, "Site description should not exceed 160 characters for optimal SEO"),
    meta_keywords: z.string().min(1, "Meta keywords are required").refine((val) => {
      const keywords = val.split(",").map((k) => k.trim()).filter((k) => k.length > 0);
      return keywords.length >= 3;
    }, {
      message: "Please provide at least 3 keywords"
    }).refine((val) => {
      const keywords = val.split(",").map((k) => k.trim()).filter((k) => k.length > 0);
      return keywords.length <= 15;
    }, {
      message: "Please limit to maximum 15 keywords for better SEO"
    }),
    site_author: z.string().optional(),
    site_robots: z.string().optional(),
    canonical_url: z.string().url("Please enter a valid URL").optional().or(z.literal(""))
  })
});
function SeoSettingsForm({ props }) {
  const {
    site_name: siteTitle,
    site_description: siteDescription,
    meta_keywords: metaKeywords,
    site_author: siteAuthor,
    site_robots: siteRobots,
    canonical_url: canonicalUrl
  } = props;
  const { loading: isSubmitting, submit } = useForm();
  const [keywordCount, setKeywordCount] = useState(0);
  const form = useForm$1({
    resolver: zodResolver(seoSettingsSchema),
    defaultValues: {
      site_settings: {
        site_name: siteTitle || "",
        site_description: siteDescription || "",
        meta_keywords: metaKeywords || "",
        site_author: siteAuthor || "",
        site_robots: siteRobots || "index, follow",
        canonical_url: canonicalUrl || "http://localhost"
      }
    }
  });
  const watchSiteTitle = form.watch("site_settings.site_name");
  const watchSiteDescription = form.watch("site_settings.site_description");
  const watchMetaKeywords = form.watch("site_settings.meta_keywords");
  const titleLength = watchSiteTitle?.length || 0;
  const descriptionLength = watchSiteDescription?.length || 0;
  const keywords = watchMetaKeywords ? watchMetaKeywords.split(",").map((k) => k.trim()).filter((k) => k.length > 0) : [];
  const calculateSeoScore = () => {
    let score = 0;
    if (titleLength >= 10 && titleLength <= 60) score += 25;
    else if (titleLength > 0) score += 10;
    if (descriptionLength >= 120 && descriptionLength <= 160) score += 25;
    else if (descriptionLength > 0) score += 10;
    if (keywords.length >= 3 && keywords.length <= 15) score += 25;
    else if (keywords.length > 0) score += 10;
    const additionalFields = [
      form.watch("site_settings.site_author"),
      form.watch("site_settings.canonical_url")
    ].filter((field) => field && field.trim().length > 0);
    score += Math.min(additionalFields.length * 12.5, 25);
    return Math.round(score);
  };
  const seoScore = calculateSeoScore();
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100 dark:bg-green-900";
    if (score >= 60) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900";
    return "text-red-600 bg-red-100 dark:bg-red-900";
  };
  const getCharacterCountColor = (current, min, max) => {
    if (current >= min && current <= max) return "text-green-600";
    if (current > max) return "text-red-600";
    if (current > 0) return "text-yellow-600";
    return "text-gray-400";
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", {
      className: "flex items-center gap-2 mb-6", children: [
      /* @__PURE__ */ jsx(Search, { className: "w-6 h-6 text-primary" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "SEO Settings" }),
      /* @__PURE__ */ jsx("div", {
        className: "ml-auto", children: /* @__PURE__ */ jsxs(
          Badge,
          {
            variant: "outline",
            className: `${getScoreColor(seoScore)} border-current`,
            children: [
              "SEO Score: ",
              seoScore,
              "/100"
            ]
          }
        )
      })
      ]
    }),
    /* @__PURE__ */ jsx(Form, {
      ...form, children: /* @__PURE__ */ jsxs("form", {
        onSubmit: form.handleSubmit((e) => onSettingsUpdate(e, submit)), className: "space-y-6", children: [
      /* @__PURE__ */ jsxs(Alert, {
          className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
        /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx(AlertDescription, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "space-y-2", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Search Engine Optimization" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: "These settings help search engines understand your website content and improve your visibility in search results." })
              ]
            })
          })
          ]
        }),
      /* @__PURE__ */ jsxs(Card, {
          children: [
        /* @__PURE__ */ jsx(CardHeader, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Globe, { className: "w-5 h-5 text-blue-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Basic SEO Information" })
              ]
            })
          }),
        /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-6", children: [
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.site_name",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("span", {
                      className: "flex items-center gap-2", children: [
                        "Site Title",
                    /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                      ]
                    }),
                  /* @__PURE__ */ jsxs("span", {
                      className: `text-xs ${getCharacterCountColor(titleLength, 10, 60)}`, children: [
                        titleLength,
                        "/60 characters"
                      ]
                    })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Input,
                      {
                        placeholder: "Your Amazing Website - Tagline Here",
                        ...field
                      }
                    )
                  }),
                /* @__PURE__ */ jsx(FormDescription, { children: "The main title of your website that appears in search results and browser tabs. Keep it between 10-60 characters for optimal SEO." }),
                /* @__PURE__ */ jsx(FormMessage, {}),
                /* @__PURE__ */ jsxs("div", {
                    className: "p-3 mt-2 rounded-lg bg-gray-50 dark:bg-gray-800", children: [
                  /* @__PURE__ */ jsx("p", { className: "mb-1 text-xs font-medium", children: "💡 Title Tips:" }),
                  /* @__PURE__ */ jsxs("ul", {
                      className: "space-y-1 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsx("li", { children: "• Include your main keyword at the beginning" }),
                    /* @__PURE__ */ jsx("li", { children: "• Make it descriptive and compelling" }),
                    /* @__PURE__ */ jsx("li", { children: "• Avoid keyword stuffing" })
                      ]
                    })
                    ]
                  })
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.site_description",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("span", {
                      className: "flex items-center gap-2", children: [
                        "Site Description (Meta Description)",
                    /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Critical" })
                      ]
                    }),
                  /* @__PURE__ */ jsxs("span", {
                      className: `text-xs ${getCharacterCountColor(descriptionLength, 120, 160)}`, children: [
                        descriptionLength,
                        "/160 characters"
                      ]
                    })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Textarea,
                      {
                        placeholder: "Discover our amazing products and services that help you achieve your goals. We provide exceptional quality and outstanding customer support for all your needs.",
                        className: "min-h-[100px] resize-y",
                        ...field
                      }
                    )
                  }),
                /* @__PURE__ */ jsx(FormDescription, { children: "A compelling description that appears in search engine results. This is crucial for click-through rates. Aim for 120-160 characters to avoid truncation." }),
                /* @__PURE__ */ jsx(FormMessage, {}),
                /* @__PURE__ */ jsxs("div", {
                    className: "p-3 mt-2 rounded-lg bg-gray-50 dark:bg-gray-800", children: [
                  /* @__PURE__ */ jsx("p", { className: "mb-1 text-xs font-medium", children: "💡 Description Tips:" }),
                  /* @__PURE__ */ jsxs("ul", {
                      className: "space-y-1 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsx("li", { children: "• Include a call-to-action" }),
                    /* @__PURE__ */ jsx("li", { children: "• Use relevant keywords naturally" }),
                    /* @__PURE__ */ jsx("li", { children: "• Make it unique and descriptive" }),
                    /* @__PURE__ */ jsx("li", { children: "• Avoid duplicate descriptions across pages" })
                      ]
                    })
                    ]
                  })
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
          /* @__PURE__ */ jsx(Target, { className: "w-5 h-5 text-green-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Keywords & Targeting" })
              ]
            })
          }),
        /* @__PURE__ */ jsx(CardContent, {
            className: "space-y-6", children: /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.meta_keywords",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
              /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("span", {
                      className: "flex items-center gap-2", children: [
                        "Meta Keywords",
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Important" })
                      ]
                    }),
                /* @__PURE__ */ jsxs("span", {
                      className: "text-xs text-muted-foreground", children: [
                        keywords.length,
                        " keyword",
                        keywords.length !== 1 ? "s" : ""
                      ]
                    })
                    ]
                  }),
              /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Textarea,
                      {
                        placeholder: "web development, react, laravel, javascript, responsive design, modern websites, custom software, business solutions",
                        className: "min-h-[80px] resize-y",
                        ...field
                      }
                    )
                  }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Enter keywords separated by commas. These help search engines understand your content topics. Use 3-15 relevant keywords for best results." }),
              /* @__PURE__ */ jsx(FormMessage, {}),
              /* @__PURE__ */ jsxs("div", {
                    className: "mt-3 space-y-3", children: [
                /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800", children: [
                  /* @__PURE__ */ jsxs("div", {
                        className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Tag, { className: "w-4 h-4 text-blue-500" }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Keyword Analysis" })
                        ]
                      }),
                  /* @__PURE__ */ jsxs("div", {
                        className: "flex items-center gap-2", children: [
                          keywords.length >= 3 && keywords.length <= 15 ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 text-green-500" }) : /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 text-yellow-500" }),
                    /* @__PURE__ */ jsxs("span", {
                            className: "text-sm", children: [
                              keywords.length,
                              " / 15 keywords"
                            ]
                          })
                        ]
                      })
                      ]
                    }),
                      keywords.length > 0 && /* @__PURE__ */ jsxs("div", {
                        children: [
                  /* @__PURE__ */ jsx("p", { className: "mb-2 text-xs font-medium", children: "Current Keywords:" }),
                  /* @__PURE__ */ jsx("div", {
                          className: "flex flex-wrap gap-1", children: keywords.map((keyword, index) => /* @__PURE__ */ jsx(
                            Badge,
                            {
                              variant: "outline",
                              className: "text-xs",
                              children: keyword
                            },
                            index
                          ))
                        })
                        ]
                      }),
                /* @__PURE__ */ jsxs("div", {
                        className: "p-3 rounded-lg bg-blue-50 dark:bg-blue-950", children: [
                  /* @__PURE__ */ jsx("p", { className: "mb-1 text-xs font-medium", children: "🎯 Keyword Guidelines:" }),
                  /* @__PURE__ */ jsxs("ul", {
                          className: "space-y-1 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsx("li", { children: "• Use specific, relevant keywords for your business" }),
                    /* @__PURE__ */ jsx("li", { children: "• Include both broad and long-tail keywords" }),
                    /* @__PURE__ */ jsx("li", { children: "• Research what your audience searches for" }),
                    /* @__PURE__ */ jsx("li", { children: "• Avoid keyword stuffing or irrelevant terms" }),
                    /* @__PURE__ */ jsx("li", { children: "• Update keywords based on content changes" })
                          ]
                        })
                        ]
                      })
                    ]
                  })
                  ]
                })
              }
            )
          })
          ]
        }),
      /* @__PURE__ */ jsxs(Card, {
          children: [
        /* @__PURE__ */ jsx(CardHeader, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5 text-purple-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Advanced SEO Settings" })
              ]
            })
          }),
        /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", {
              className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
            /* @__PURE__ */ jsx(
                FormField,
                {
                  control: form.control,
                  name: "site_settings.site_author",
                  render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                    children: [
                  /* @__PURE__ */ jsx(FormLabel, { children: "Site Author" }),
                  /* @__PURE__ */ jsx(FormControl, {
                      children: /* @__PURE__ */ jsx(
                        Input,
                        {
                          placeholder: "Your Company Name or Personal Name",
                          ...field
                        }
                      )
                    }),
                  /* @__PURE__ */ jsx(FormDescription, { children: "The author or organization behind the website" }),
                  /* @__PURE__ */ jsx(FormMessage, {})
                    ]
                  })
                }
              ),
            /* @__PURE__ */ jsx(
                FormField,
                {
                  control: form.control,
                  name: "site_settings.site_robots",
                  render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                    children: [
                  /* @__PURE__ */ jsx(FormLabel, { children: "Robots Meta Tag" }),
                  /* @__PURE__ */ jsx(FormControl, {
                      children: /* @__PURE__ */ jsx(
                        Input,
                        {
                          placeholder: "index, follow",
                          ...field
                        }
                      )
                    }),
                  /* @__PURE__ */ jsx(FormDescription, { children: "Instructions for search engine crawlers" }),
                  /* @__PURE__ */ jsx(FormMessage, {})
                    ]
                  })
                }
              )
              ]
            }),
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.canonical_url",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Canonical URL" }),
                /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "url",
                        placeholder: "https://www.yourwebsite.com",
                        ...field
                      }
                    )
                  }),
                /* @__PURE__ */ jsx(FormDescription, { children: "The preferred URL for this page to avoid duplicate content issues" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsxs(Alert, {
              className: "border-purple-200 bg-purple-50 dark:bg-purple-950", children: [
            /* @__PURE__ */ jsx(TrendingUp, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxs(AlertDescription, {
                children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium", children: "🚀 Pro SEO Tips:" }),
              /* @__PURE__ */ jsxs("ul", {
                  className: "mt-2 space-y-1 text-sm", children: [
                /* @__PURE__ */ jsx("li", { children: "• Regularly update your content to keep it fresh" }),
                /* @__PURE__ */ jsx("li", { children: "• Use structured data markup for rich snippets" }),
                /* @__PURE__ */ jsx("li", { children: "• Optimize page loading speed and mobile responsiveness" }),
                /* @__PURE__ */ jsx("li", { children: "• Create high-quality, original content consistently" })
                  ]
                })
                ]
              })
              ]
            })
            ]
          })
          ]
        }),
      /* @__PURE__ */ jsx(Card, {
          className: `border-2 ${seoScore >= 80 ? "border-green-200 bg-green-50 dark:bg-green-950" : seoScore >= 60 ? "border-yellow-200 bg-yellow-50 dark:bg-yellow-950" : "border-red-200 bg-red-50 dark:bg-red-950"}`, children: /* @__PURE__ */ jsx(CardContent, {
            className: "p-6", children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", {
                children: [
          /* @__PURE__ */ jsxs("h3", {
                  className: "flex items-center gap-2 text-lg font-semibold", children: [
                    "SEO Health Check",
            /* @__PURE__ */ jsxs(
                      Badge,
                      {
                        variant: "outline",
                        className: `${getScoreColor(seoScore)} border-current`,
                        children: [
                          seoScore,
                          "/100"
                        ]
                      }
                    )
                  ]
                }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: seoScore >= 80 ? "Excellent! Your SEO settings are well optimized." : seoScore >= 60 ? "Good progress! A few improvements could boost your score." : "Needs improvement. Complete the missing fields to boost your SEO." })
                ]
              }),
        /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx("div", { className: `text-2xl font-bold ${seoScore >= 80 ? "text-green-600" : seoScore >= 60 ? "text-yellow-600" : "text-red-600"}`, children: seoScore >= 80 ? "🎉" : seoScore >= 60 ? "👍" : "⚠️" }) })
              ]
            })
          })
        }),
      /* @__PURE__ */ jsx(
          Button,
          {
            disabled: isSubmitting,
            type: "submit",
            children: /* @__PURE__ */ jsx(ButtonLoader, { isSubmitting })
          }
        )
        ]
      })
    })
    ]
  });
}
const socialLoginSchema = z.object({
  site_settings: z.object({
    social_login: z.boolean(),
    google_login: z.boolean(),
    google_client_id: z.string().optional(),
    google_client_secret: z.string().optional(),
    google_callback_url: z.string().url("Please enter a valid callback URL").optional().or(z.literal("")),
    facebook_login: z.boolean(),
    facebook_client_id: z.string().optional(),
    facebook_client_secret: z.string().optional(),
    facebook_callback_url: z.string().url("Please enter a valid callback URL").optional().or(z.literal(""))
  })
}).refine((data) => {
  const { social_login, google_login, google_client_id, google_client_secret, google_callback_url } = data.site_settings;
  if (social_login && google_login) {
    return google_client_id && google_client_id.trim().length > 0 && google_client_secret && google_client_secret.trim().length > 0 && google_callback_url && google_callback_url.trim().length > 0;
  }
  return true;
}, {
  message: "Google OAuth credentials are required when Google login is enabled",
  path: ["site_settings", "google_client_id"]
}).refine((data) => {
  const { social_login, facebook_login, facebook_client_id, facebook_client_secret, facebook_callback_url } = data.site_settings;
  if (social_login && facebook_login) {
    return facebook_client_id && facebook_client_id.trim().length > 0 && facebook_client_secret && facebook_client_secret.trim().length > 0 && facebook_callback_url && facebook_callback_url.trim().length > 0;
  }
  return true;
}, {
  message: "Facebook OAuth credentials are required when Facebook login is enabled",
  path: ["site_settings", "facebook_client_id"]
});
const GoogleIcon = ({ className }) => /* @__PURE__ */ jsxs("svg", {
  className, viewBox: "0 0 24 24", fill: "currentColor", children: [
  /* @__PURE__ */ jsx("path", { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z", fill: "#4285F4" }),
  /* @__PURE__ */ jsx("path", { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z", fill: "#34A853" }),
  /* @__PURE__ */ jsx("path", { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z", fill: "#FBBC05" }),
  /* @__PURE__ */ jsx("path", { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z", fill: "#EA4335" })
  ]
});
const FacebookIcon = ({ className }) => /* @__PURE__ */ jsx("svg", { className, viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z", fill: "#1877F2" }) });
function SocialLoginSettingsForm({ props }) {
  const {
    social_login: socialLoginEnabled,
    google_login: googleLoginEnabled,
    google_client_id: googleClientId,
    google_client_secret: googleClientSecret,
    facebook_login: facebookLoginEnabled,
    facebook_client_id: facebookClientId,
    facebook_client_secret: facebookClientSecret
  } = props;
  const [showGoogleSecret, setShowGoogleSecret] = useState(false);
  const [showFacebookSecret, setShowFacebookSecret] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const { loading: isSubmitting, submit } = useForm();
  const form = useForm$1({
    resolver: zodResolver(socialLoginSchema),
    defaultValues: {
      site_settings: {
        social_login: socialLoginEnabled == "active",
        google_login: googleLoginEnabled == "active",
        google_client_id: googleClientId || "",
        google_client_secret: googleClientSecret || "",
        google_callback_url: route("user.social.callback", "google"),
        facebook_login: facebookLoginEnabled == "active",
        facebook_client_id: facebookClientId || "",
        facebook_client_secret: facebookClientSecret || "",
        facebook_callback_url: route("user.social.callback", "facebook")
      }
    }
  });
  const watchSocialLoginEnabled = form.watch("site_settings.social_login");
  const watchGoogleEnabled = form.watch("site_settings.google_login");
  const watchFacebookEnabled = form.watch("site_settings.facebook_login");
  const watchGoogleClientId = form.watch("site_settings.google_client_id");
  const watchGoogleClientSecret = form.watch("site_settings.google_client_secret");
  const watchGoogleCallbackUrl = form.watch("site_settings.google_callback_url");
  const watchFacebookClientId = form.watch("site_settings.facebook_client_id");
  const watchFacebookClientSecret = form.watch("site_settings.facebook_client_secret");
  const watchFacebookCallbackUrl = form.watch("site_settings.facebook_callback_url");
  const isGoogleConfigured = watchGoogleClientId && watchGoogleClientSecret && watchGoogleCallbackUrl;
  const isFacebookConfigured = watchFacebookClientId && watchFacebookClientSecret && watchFacebookCallbackUrl;
  const activeProviders = [watchGoogleEnabled && isGoogleConfigured, watchFacebookEnabled && isFacebookConfigured].filter(Boolean).length;
  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2e3);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2e3);
    }
  };
  const renderProviderCard = (provider, config) => {
    const {
      name,
      icon: Icon,
      color,
      enabledField,
      clientIdField,
      clientSecretField,
      callbackField,
      showSecret,
      setShowSecret,
      isConfigured,
      isEnabled,
      devConsoleUrl,
      docUrl
    } = config;
    const callbackFieldName = `${provider}_callback`;
    const isCopied = copiedField === callbackFieldName;
    return /* @__PURE__ */ jsxs(Card, {
      className: `transition-all duration-200 ${isEnabled && watchSocialLoginEnabled ? `border-${color}-200 bg-${color}-50 dark:bg-${color}-950` : ""}`, children: [
      /* @__PURE__ */ jsx(CardHeader, {
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Icon, { className: `w-5 h-5 text-${color}-500` }),
          /* @__PURE__ */ jsxs(CardTitle, {
              className: "text-lg", children: [
                name,
                " Login"
              ]
            })
            ]
          }),
        /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2", children: [
              isEnabled && isConfigured && watchSocialLoginEnabled && /* @__PURE__ */ jsx(Badge, { variant: "default", className: "text-xs", children: "Active" }),
              isEnabled && !isConfigured && watchSocialLoginEnabled && /* @__PURE__ */ jsx(Badge, { variant: "destructive", className: "text-xs", children: "Incomplete" }),
          /* @__PURE__ */ jsx(
                Switch,
                {
                  checked: isEnabled,
                  onCheckedChange: (value) => form.setValue(enabledField, value),
                  disabled: !watchSocialLoginEnabled
                }
              )
            ]
          })
          ]
        })
      }),
        isEnabled && watchSocialLoginEnabled && /* @__PURE__ */ jsxs(CardContent, {
          className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", {
            className: "flex gap-2 mb-4", children: [
          /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => window.open(devConsoleUrl, "_blank"),
                type: "button",
                children: [
                /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 mr-1" }),
                  name,
                  " Console"
                ]
              }
            ),
          /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => window.open(docUrl, "_blank"),
                type: "button",
                children: [
                /* @__PURE__ */ jsx(Info, { className: "w-3 h-3 mr-1" }),
                  "Setup Guide"
                ]
              }
            )
            ]
          }),
        /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: clientIdField,
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                children: [
              /* @__PURE__ */ jsxs(FormLabel, {
                  className: "flex items-center gap-2", children: [
                    "Client ID",
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Public" })
                  ]
                }),
              /* @__PURE__ */ jsx(FormControl, {
                  children: /* @__PURE__ */ jsx(
                    Input,
                    {
                      placeholder: `${name} Client ID`,
                      ...field,
                      className: " text-sm"
                    }
                  )
                }),
              /* @__PURE__ */ jsxs(FormDescription, {
                  children: [
                    "The public client ID from your ",
                    name,
                    " OAuth application"
                  ]
                }),
              /* @__PURE__ */ jsx(FormMessage, {})
                ]
              })
            }
          ),
        /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: clientSecretField,
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                children: [
              /* @__PURE__ */ jsxs(FormLabel, {
                  className: "flex items-center gap-2", children: [
                    "Client Secret",
                /* @__PURE__ */ jsx(Badge, { variant: "destructive", className: "text-xs", children: "Private" })
                  ]
                }),
              /* @__PURE__ */ jsx(FormControl, {
                  children: /* @__PURE__ */ jsxs("div", {
                    className: "relative", children: [
                /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: showSecret ? "text" : "password",
                        placeholder: `${name} Client Secret`,
                        ...field,
                        className: "pr-10  text-sm"
                      }
                    ),
                /* @__PURE__ */ jsx(
                      Button,
                      {
                        type: "button",
                        variant: "ghost",
                        size: "icon",
                        className: "absolute top-0 right-0 h-full px-3 hover:bg-transparent",
                        onClick: () => setShowSecret(!showSecret),
                        children: showSecret ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4 text-gray-400" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4 text-gray-400" })
                      }
                    )
                    ]
                  })
                }),
              /* @__PURE__ */ jsxs(FormDescription, {
                  children: [
                    "The private client secret from your ",
                    name,
                    " OAuth application. Keep this secure!"
                  ]
                }),
              /* @__PURE__ */ jsx(FormMessage, {})
                ]
              })
            }
          ),
        /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: callbackField,
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                children: [
              /* @__PURE__ */ jsxs(FormLabel, {
                  className: "flex items-center gap-2", children: [
                    "Callback URL",
                /* @__PURE__ */ jsx(
                      Button,
                      {
                        type: "button",
                        variant: isCopied ? "default" : "outline",
                        size: "sm",
                        onClick: () => copyToClipboard(field.value, callbackFieldName),
                        className: `h-6 px-2 transition-all ${isCopied ? "bg-green-500 hover:bg-green-600 text-white" : ""}`,
                        children: isCopied ? /* @__PURE__ */ jsxs(Fragment, {
                          children: [
                      /* @__PURE__ */ jsx(Check, { className: "w-3 h-3 mr-1" }),
                            "Copied!"
                          ]
                        }) : /* @__PURE__ */ jsxs(Fragment, {
                          children: [
                      /* @__PURE__ */ jsx(Copy, { className: "w-3 h-3 mr-1" }),
                            "Copy"
                          ]
                        })
                      }
                    )
                  ]
                }),
              /* @__PURE__ */ jsx(FormControl, {
                  children: /* @__PURE__ */ jsxs("div", {
                    className: "relative", children: [
                /* @__PURE__ */ jsx(
                      Input,
                      {
                        ...field,
                        className: "pr-16  text-sm",
                        readOnly: true
                      }
                    ),
                /* @__PURE__ */ jsx("div", {
                      className: "absolute transform -translate-y-1/2 right-2 top-1/2", children: /* @__PURE__ */ jsx(
                        Button,
                        {
                          type: "button",
                          variant: "ghost",
                          size: "sm",
                          onClick: () => copyToClipboard(field.value, callbackFieldName),
                          className: `h-7 px-2 transition-all ${isCopied ? "text-green-600" : "text-gray-500 hover:text-gray-700"}`,
                          children: isCopied ? /* @__PURE__ */ jsx(Check, { className: "w-3 h-3" }) : /* @__PURE__ */ jsx(Copy, { className: "w-3 h-3" })
                        }
                      )
                    })
                    ]
                  })
                }),
              /* @__PURE__ */ jsxs(FormDescription, {
                  children: [
                    "Add this URL to your ",
                    name,
                    " OAuth application's authorized redirect URIs. Click copy to copy the URL."
                  ]
                }),
              /* @__PURE__ */ jsx(FormMessage, {})
                ]
              })
            }
          ),
        /* @__PURE__ */ jsxs(Alert, {
            className: isConfigured ? "border-green-200 bg-green-50 dark:bg-green-950" : "border-orange-200 bg-orange-50 dark:bg-orange-950", children: [
              isConfigured ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsx(AlertDescription, {
                children: isConfigured ? /* @__PURE__ */ jsxs("span", {
                  children: [
            /* @__PURE__ */ jsx("strong", { children: "Ready:" }),
                    " ",
                    name,
                    " login is properly configured and ready to use."
                  ]
                }) : /* @__PURE__ */ jsxs("span", {
                  children: [
            /* @__PURE__ */ jsx("strong", { children: "Setup Required:" }),
                    " Please complete all fields above to enable ",
                    name,
                    " login."
                  ]
                })
              })
            ]
          })
          ]
        })
      ]
    }, provider);
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", {
      className: "flex items-center gap-2 mb-6", children: [
      /* @__PURE__ */ jsx(Users, { className: "w-6 h-6 text-primary" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Social Login Settings" }),
      /* @__PURE__ */ jsx("div", {
        className: "flex gap-2 ml-auto", children: watchSocialLoginEnabled && /* @__PURE__ */ jsxs(Badge, {
          variant: "outline", className: "text-xs", children: [
            activeProviders,
            " of 2 Providers Active"
          ]
        })
      })
      ]
    }),
    /* @__PURE__ */ jsx(Form, {
      ...form, children: /* @__PURE__ */ jsxs("form", {
        onSubmit: form.handleSubmit((e) => onSettingsUpdate(e, submit)), className: "space-y-6", children: [
      /* @__PURE__ */ jsxs(Alert, {
          className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
        /* @__PURE__ */ jsx(Users, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx(AlertDescription, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "space-y-2", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Social Authentication" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Allow users to login with their social media accounts for a smoother registration and login experience." })
              ]
            })
          })
          ]
        }),
      /* @__PURE__ */ jsxs(Card, {
          children: [
        /* @__PURE__ */ jsx(CardHeader, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Key, { className: "w-5 h-5 text-purple-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Social Login Configuration" })
              ]
            })
          }),
        /* @__PURE__ */ jsxs(CardContent, {
            children: [
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.social_login",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  className: "flex flex-row items-center justify-between p-4 border rounded-lg", children: [
                /* @__PURE__ */ jsxs("div", {
                    className: "space-y-0.5", children: [
                  /* @__PURE__ */ jsxs(FormLabel, {
                      className: "flex items-center gap-2 text-base", children: [
                        "Enable Social Login",
                        watchSocialLoginEnabled && /* @__PURE__ */ jsx(Badge, { variant: "default", className: "text-xs", children: "Global" })
                      ]
                    }),
                  /* @__PURE__ */ jsx(FormDescription, { children: "Master toggle for all social login functionality" })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Switch,
                      {
                        checked: field.value,
                        onCheckedChange: field.onChange
                      }
                    )
                  })
                  ]
                })
              }
            ),
              watchSocialLoginEnabled && /* @__PURE__ */ jsxs(Alert, {
                className: "mt-4 border-green-200 bg-green-50 dark:bg-green-950", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx(AlertDescription, { children: "Social login is enabled. Configure individual providers below to activate them." })
                ]
              })
            ]
          })
          ]
        }),
          watchSocialLoginEnabled && /* @__PURE__ */ jsxs("div", {
            className: "space-y-6", children: [
        /* @__PURE__ */ jsx("div", {
              className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs("div", {
                className: "flex-1", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: "Social Providers" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Configure individual social login providers" })
                ]
              })
            }),
              renderProviderCard("google", {
                name: "Google",
                icon: GoogleIcon,
                color: "blue",
                enabledField: "site_settings.google_login",
                clientIdField: "site_settings.google_client_id",
                clientSecretField: "site_settings.google_client_secret",
                callbackField: "site_settings.google_callback_url",
                showSecret: showGoogleSecret,
                setShowSecret: setShowGoogleSecret,
                isConfigured: isGoogleConfigured,
                isEnabled: watchGoogleEnabled,
                devConsoleUrl: "https://console.developers.google.com/",
                docUrl: "https://developers.google.com/identity/protocols/oauth2"
              }),
        /* @__PURE__ */ jsx(Separator, {}),
              renderProviderCard("facebook", {
                name: "Facebook",
                icon: FacebookIcon,
                color: "blue",
                enabledField: "site_settings.facebook_login",
                clientIdField: "site_settings.facebook_client_id",
                clientSecretField: "site_settings.facebook_client_secret",
                callbackField: "site_settings.facebook_callback_url",
                showSecret: showFacebookSecret,
                setShowSecret: setShowFacebookSecret,
                isConfigured: isFacebookConfigured,
                isEnabled: watchFacebookEnabled,
                devConsoleUrl: "https://developers.facebook.com/",
                docUrl: "https://developers.facebook.com/docs/facebook-login/"
              })
            ]
          }),
          !watchSocialLoginEnabled && /* @__PURE__ */ jsx(Card, {
            className: "border-gray-300 border-dashed dark:border-gray-600", children: /* @__PURE__ */ jsx(CardContent, {
              className: "p-8", children: /* @__PURE__ */ jsxs("div", {
                className: "space-y-4 text-center", children: [
        /* @__PURE__ */ jsx(Users, { className: "w-16 h-16 mx-auto text-gray-400" }),
        /* @__PURE__ */ jsxs("div", {
                  children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold", children: "Enable Social Login" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground", children: "Make it easier for users to sign up and login with their favorite social platforms" })
                  ]
                }),
        /* @__PURE__ */ jsxs("div", {
                  className: "flex flex-col justify-center gap-3 sm:flex-row", children: [
          /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950", children: [
            /* @__PURE__ */ jsx(GoogleIcon, { className: "w-5 h-5 text-blue-500" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Google OAuth" })
                    ]
                  }),
          /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950", children: [
            /* @__PURE__ */ jsx(FacebookIcon, { className: "w-5 h-5 text-blue-600" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Facebook Login" })
                    ]
                  })
                  ]
                })
                ]
              })
            })
          }),
          watchSocialLoginEnabled && /* @__PURE__ */ jsx(Card, {
            className: "border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950", children: /* @__PURE__ */ jsx(CardContent, {
              className: "p-6", children: /* @__PURE__ */ jsxs("div", {
                className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", {
                  children: [
          /* @__PURE__ */ jsxs("h3", {
                    className: "flex items-center gap-2 text-lg font-semibold", children: [
                      "Configuration Summary",
            /* @__PURE__ */ jsxs(Badge, {
                        variant: "outline", className: "text-xs", children: [
                          activeProviders,
                          "/2 Active"
                        ]
                      })
                    ]
                  }),
          /* @__PURE__ */ jsxs("p", {
                    className: "mt-1 text-sm text-muted-foreground", children: [
                      activeProviders === 0 && "No social providers are currently active",
                      activeProviders === 1 && "1 social provider is active and ready",
                      activeProviders === 2 && "All social providers are active and ready"
                    ]
                  })
                  ]
                }),
        /* @__PURE__ */ jsxs("div", {
                  className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center ${watchGoogleEnabled && isGoogleConfigured ? "bg-green-100 text-green-600 dark:bg-green-900" : "bg-gray-100 text-gray-400 dark:bg-gray-800"}`, children: /* @__PURE__ */ jsx(GoogleIcon, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center ${watchFacebookEnabled && isFacebookConfigured ? "bg-blue-100 text-blue-600 dark:bg-blue-900" : "bg-gray-100 text-gray-400 dark:bg-gray-800"}`, children: /* @__PURE__ */ jsx(FacebookIcon, { className: "w-5 h-5" }) })
                  ]
                })
                ]
              })
            })
          }),
      /* @__PURE__ */ jsx(Button, { disabled: isSubmitting, type: "submit", children: /* @__PURE__ */ jsx(ButtonLoader, { isSubmitting }) })
        ]
      })
    })
    ]
  });
}
const ticketFieldSchema = z.object({
  label: z.string().min(1, "Label is required").max(50, "Label must be less than 50 characters"),
  type: z.enum(["text", "email", "number", "date", "file"], {
    required_error: "Field type is required"
  }),
  required: z.boolean(),
  placeholder: z.string().max(100, "Placeholder must be less than 100 characters").optional()
});
const ticketSettingsSchema = z.object({
  site_settings: z.object({
    ticket_settings: z.object({
      fields: z.array(ticketFieldSchema).min(1, "At least one field is required")
    })
  })
});
const fieldTypeOptions = [
  { value: "text", label: "Text", description: "Single line text input", icon: "📝" },
  { value: "email", label: "Email", description: "Email address validation", icon: "📧" },
  { value: "number", label: "Number", description: "Numeric input only", icon: "🔢" },
  { value: "date", label: "Date", description: "Date picker input", icon: "📅" },
  { value: "file", label: "File", description: "File upload field", icon: "📁" }
];
const defaultFields = [
  { label: "Subject", type: "text", required: true, placeholder: "Enter a brief subject" },
  { label: "Description", type: "text", required: true, placeholder: "Provide detailed description" }
];
function TicketConfigurationForm({ props }) {
  const existingFields = props?.ticket_settings || defaultFields;
  const { loading: isSubmitting, submit } = useForm();
  const form = useForm$1({
    resolver: zodResolver(ticketSettingsSchema),
    defaultValues: {
      site_settings: {
        ticket_settings: {
          fields: existingFields
        }
      }
    }
  });
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "site_settings.ticket_settings.fields"
  });
  const watchFields = form.watch("site_settings.ticket_settings.fields");
  const addNewField = () => {
    append({
      label: "",
      type: "text",
      required: false,
      placeholder: ""
    });
  };
  const getFieldTypeData = (type) => {
    return fieldTypeOptions.find((option) => option.value === type) || fieldTypeOptions[0];
  };
  const requiredCount = watchFields?.filter((field) => field.required).length || 0;
  return /* @__PURE__ */ jsxs("div", {
    className: "mx-auto space-y-6 max-w-7xl", children: [
    /* @__PURE__ */ jsxs("div", {
      className: "flex flex-col justify-between gap-4 sm:flex-row sm:items-center", children: [
      /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl dark:bg-purple-900/50", children: /* @__PURE__ */ jsx(Ticket, { className: "w-6 h-6 text-purple-600 dark:text-purple-400" }) }),
        /* @__PURE__ */ jsxs("div", {
          children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Ticket Form Settings" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Configure your support ticket submission form" })
          ]
        })
        ]
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs(Badge, {
          variant: "outline", className: "text-xs font-medium", children: [
            fields.length,
            " Field",
            fields.length !== 1 ? "s" : ""
          ]
        }),
        /* @__PURE__ */ jsxs(Badge, {
          variant: "secondary", className: "text-xs font-medium", children: [
            requiredCount,
            " Required"
          ]
        })
        ]
      })
      ]
    }),
    /* @__PURE__ */ jsx(Form, {
      ...form, children: /* @__PURE__ */ jsxs("form", {
        onSubmit: form.handleSubmit((e) => onSettingsUpdate(e, submit)), className: "space-y-6", children: [
      /* @__PURE__ */ jsxs(Alert, {
          className: "border-blue-200 bg-blue-50/50 dark:bg-blue-950/50", children: [
        /* @__PURE__ */ jsx(Info, { className: "w-4 h-4 text-blue-600" }),
        /* @__PURE__ */ jsx(AlertDescription, {
            className: "text-blue-800 dark:text-blue-200", children: /* @__PURE__ */ jsxs("div", {
              className: "space-y-2", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Form Configuration" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Configure the fields that will appear in your support ticket submission form. Users will see these when creating new tickets." })
              ]
            })
          })
          ]
        }),
      /* @__PURE__ */ jsxs(Card, {
          className: "overflow-hidden border border-gray-200 shadow-sm dark:border-gray-800", children: [
        /* @__PURE__ */ jsx(CardHeader, {
            className: "bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800", children: /* @__PURE__ */ jsx("div", {
              className: "p-6 md:p-8", children: /* @__PURE__ */ jsxs("div", {
                className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6", children: [
          /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-blue-600 shadow-sm rounded-2xl", children: /* @__PURE__ */ jsx(Edit3, { className: "w-6 h-6 text-white" }) }),
            /* @__PURE__ */ jsxs("div", {
                    className: "space-y-1", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-xl font-bold text-gray-900 dark:text-gray-100", children: "Form Fields" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Configure each field • Add or remove fields" })
                    ]
                  })
                  ]
                }),
          /* @__PURE__ */ jsxs(
                  Button,
                  {
                    type: "button",
                    onClick: addNewField,
                    variant: "outline",
                    size: "sm",
                    className: "shrink-0 gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 px-4 py-2.5 text-sm",
                    children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                      "Add Field"
                    ]
                  }
                )
                ]
              })
            })
          }),
        /* @__PURE__ */ jsxs(CardContent, {
            className: "p-6 space-y-4", children: [
              fields.map((field, index) => {
                const fieldTypeData = getFieldTypeData(watchFields[index]?.type);
                return /* @__PURE__ */ jsxs(Card, {
                  className: "transition-all duration-200 border-2 border-gray-100 hover:border-gray-200 hover:shadow-sm dark:border-gray-800 dark:hover:border-gray-700", children: [
              /* @__PURE__ */ jsx(CardHeader, {
                    className: "pb-3", children: /* @__PURE__ */ jsxs("div", {
                      className: "flex items-start justify-between", children: [
                /* @__PURE__ */ jsxs("div", {
                        className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700", children: /* @__PURE__ */ jsx("span", { className: "text-lg", children: fieldTypeData.icon }) }),
                  /* @__PURE__ */ jsxs("div", {
                          children: [
                    /* @__PURE__ */ jsxs("div", {
                            className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxs(Badge, {
                              variant: "secondary", className: "text-xs font-medium", children: [
                                "Field #",
                                index + 1
                              ]
                            }),
                              watchFields[index]?.required && /* @__PURE__ */ jsx(Badge, { variant: "destructive", className: "text-xs font-medium", children: "Required" })
                            ]
                          }),
                    /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm font-medium text-gray-700 dark:text-gray-300", children: watchFields[index]?.label || "Untitled Field" })
                          ]
                        })
                        ]
                      }),
                /* @__PURE__ */ jsx(
                        Button,
                        {
                          type: "button",
                          variant: "ghost",
                          size: "sm",
                          onClick: () => remove(index),
                          className: "text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950",
                          disabled: fields.length <= 1,
                          children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
                        }
                      )
                      ]
                    })
                  }),
              /* @__PURE__ */ jsxs(CardContent, {
                    className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", {
                      className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [
                  /* @__PURE__ */ jsx(
                        FormField,
                        {
                          control: form.control,
                          name: `site_settings.ticket_settings.fields.${index}.label`,
                          render: ({ field: field2 }) => /* @__PURE__ */ jsxs(FormItem, {
                            children: [
                        /* @__PURE__ */ jsx(FormLabel, { className: "text-sm font-medium", children: "Field Label" }),
                        /* @__PURE__ */ jsx(FormControl, {
                              children: /* @__PURE__ */ jsx(
                                Input,
                                {
                                  placeholder: "Enter field label",
                                  ...field2,
                                  className: "bg-white dark:bg-gray-900"
                                }
                              )
                            }),
                        /* @__PURE__ */ jsx(FormMessage, { className: "text-xs" })
                            ]
                          })
                        }
                      ),
                  /* @__PURE__ */ jsx(
                        FormField,
                        {
                          control: form.control,
                          name: `site_settings.ticket_settings.fields.${index}.type`,
                          render: ({ field: field2 }) => /* @__PURE__ */ jsxs(FormItem, {
                            children: [
                        /* @__PURE__ */ jsx(FormLabel, { className: "text-sm font-medium", children: "Field Type" }),
                        /* @__PURE__ */ jsxs(Select, {
                              onValueChange: field2.onChange, value: field2.value, children: [
                          /* @__PURE__ */ jsx(FormControl, {
                                children: /* @__PURE__ */ jsx(SelectTrigger, {
                                  className: "bg-white dark:bg-gray-900", children: /* @__PURE__ */ jsx(SelectValue, {
                                    children: /* @__PURE__ */ jsxs("div", {
                                      className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsx("span", { className: "text-base", children: fieldTypeData.icon }),
                            /* @__PURE__ */ jsx("span", { className: "font-medium", children: fieldTypeData.label })
                                      ]
                                    })
                                  })
                                })
                              }),
                          /* @__PURE__ */ jsx(SelectContent, {
                                children: fieldTypeOptions.map((option) => /* @__PURE__ */ jsx(SelectItem, {
                                  value: option.value, children: /* @__PURE__ */ jsxs("div", {
                                    className: "flex items-center gap-3 py-1", children: [
                            /* @__PURE__ */ jsx("span", { className: "text-base", children: option.icon }),
                            /* @__PURE__ */ jsxs("div", {
                                      className: "flex flex-col", children: [
                              /* @__PURE__ */ jsx("span", { className: "font-medium", children: option.label }),
                              /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: option.description })
                                      ]
                                    })
                                    ]
                                  })
                                }, option.value))
                              })
                              ]
                            }),
                        /* @__PURE__ */ jsx(FormMessage, { className: "text-xs" })
                            ]
                          })
                        }
                      )
                      ]
                    }),
                /* @__PURE__ */ jsxs("div", {
                      className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [
                  /* @__PURE__ */ jsx(
                        FormField,
                        {
                          control: form.control,
                          name: `site_settings.ticket_settings.fields.${index}.placeholder`,
                          render: ({ field: field2 }) => /* @__PURE__ */ jsxs(FormItem, {
                            children: [
                        /* @__PURE__ */ jsx(FormLabel, { className: "text-sm font-medium", children: "Placeholder Text" }),
                        /* @__PURE__ */ jsx(FormControl, {
                              children: /* @__PURE__ */ jsx(
                                Input,
                                {
                                  placeholder: "Enter placeholder text",
                                  ...field2,
                                  className: "bg-white dark:bg-gray-900"
                                }
                              )
                            }),
                        /* @__PURE__ */ jsx(FormDescription, { className: "text-xs", children: "Help text shown inside the input field" }),
                        /* @__PURE__ */ jsx(FormMessage, { className: "text-xs" })
                            ]
                          })
                        }
                      ),
                  /* @__PURE__ */ jsx(
                        FormField,
                        {
                          control: form.control,
                          name: `site_settings.ticket_settings.fields.${index}.required`,
                          render: ({ field: field2 }) => /* @__PURE__ */ jsx(FormItem, {
                            children: /* @__PURE__ */ jsxs("div", {
                              className: "flex items-center justify-between p-4 border rounded-lg bg-gray-50/50 dark:bg-gray-900/50", children: [
                        /* @__PURE__ */ jsxs("div", {
                                className: "space-y-0.5", children: [
                          /* @__PURE__ */ jsx(FormLabel, { className: "text-sm font-medium", children: "Required Field" }),
                          /* @__PURE__ */ jsx(FormDescription, { className: "text-xs", children: "Make this field mandatory for users" })
                                ]
                              }),
                        /* @__PURE__ */ jsx(FormControl, {
                                children: /* @__PURE__ */ jsx(
                                  Switch,
                                  {
                                    checked: field2.value,
                                    onCheckedChange: field2.onChange
                                  }
                                )
                              })
                              ]
                            })
                          })
                        }
                      )
                      ]
                    })
                    ]
                  })
                  ]
                }, field.id);
              }),
          /* @__PURE__ */ jsx(Card, {
                className: "transition-all duration-200 border-2 border-gray-200 border-dashed dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50/30 dark:hover:bg-gray-900/30", children: /* @__PURE__ */ jsxs(CardContent, {
                  className: "flex flex-col items-center justify-center px-6 py-12", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 mb-4 bg-gray-100 rounded-full dark:bg-gray-800", children: /* @__PURE__ */ jsx(Plus, { className: "w-6 h-6 text-gray-500" }) }),
            /* @__PURE__ */ jsx("h3", { className: "mb-2 font-medium text-gray-900 dark:text-white", children: "Add New Field" }),
            /* @__PURE__ */ jsx("p", { className: "max-w-xs mb-4 text-sm text-center text-gray-500", children: "Create additional fields to collect more information from users" }),
            /* @__PURE__ */ jsxs(
                    Button,
                    {
                      type: "button",
                      onClick: addNewField,
                      variant: "outline",
                      size: "sm",
                      className: "gap-2",
                      children: [
                  /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                        "Add Field"
                      ]
                    }
                  )
                  ]
                })
              })
            ]
          })
          ]
        }),
      /* @__PURE__ */ jsxs(Card, {
          className: "border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30", children: [
        /* @__PURE__ */ jsx(CardHeader, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Info, { className: "w-5 h-5 text-purple-500" }),
          /* @__PURE__ */ jsx(CardTitle, { className: "text-purple-800 dark:text-purple-200", children: "Available Field Types" })
              ]
            })
          }),
        /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsx("div", {
              className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: fieldTypeOptions.map((option) => /* @__PURE__ */ jsxs("div", {
                className: "flex flex-col items-center gap-2 p-4 border rounded-lg bg-white/50 dark:bg-gray-900/50 border-white/20 text-center min-h-[100px]", children: [
          /* @__PURE__ */ jsx("span", { className: "text-2xl", children: option.icon }),
          /* @__PURE__ */ jsxs("div", {
                  className: "space-y-1", children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-purple-800 dark:text-purple-200", children: option.label }),
            /* @__PURE__ */ jsx("div", { className: "text-xs leading-relaxed text-purple-600 dark:text-purple-400", children: option.description })
                  ]
                })
                ]
              }, option.value))
            })
          })
          ]
        }),
      /* @__PURE__ */ jsx(Card, {
          className: "border-green-200 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30", children: /* @__PURE__ */ jsx(CardContent, {
            className: "p-6", children: /* @__PURE__ */ jsxs("div", {
              className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxs("div", {
                className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("h3", {
                  className: "flex flex-wrap items-center gap-2 text-lg font-semibold text-green-800 dark:text-green-200", children: [
                    "Form Summary",
            /* @__PURE__ */ jsxs(Badge, {
                      variant: "outline", className: "text-xs bg-white/50", children: [
                        fields.length,
                        " Total Fields"
                      ]
                    })
                  ]
                }),
          /* @__PURE__ */ jsxs("div", {
                  className: "space-y-1 text-sm text-green-700 dark:text-green-300", children: [
            /* @__PURE__ */ jsxs("p", {
                    children: [
                      requiredCount,
                      " required fields, ",
                      fields.length - requiredCount,
                      " optional fields"
                    ]
                  }),
            /* @__PURE__ */ jsxs("p", {
                    children: [
                      "Field types: ",
                      [...new Set(watchFields?.map((f) => f.type) || [])].join(", ")
                    ]
                  })
                  ]
                })
                ]
              }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 text-green-600 bg-green-100 rounded-full dark:bg-green-900/50 dark:text-green-400", children: /* @__PURE__ */ jsx(CheckCircle, { className: "w-6 h-6" }) }) })
              ]
            })
          })
        }),
      /* @__PURE__ */ jsx(
          Button,
          {
            disabled: isSubmitting,
            type: "submit",
            children: /* @__PURE__ */ jsx(ButtonLoader, { isSubmitting })
          }
        )
        ]
      })
    })
    ]
  });
}
const decimalSeparators = [".", ","];
const thousandSeparators = [",", ".", " ", ""];
const currencySettingsSchema = z.object({
  site_settings: z.object({
    // Base Currency Settings
    default_currency: z.string().min(1, "Default currency is required"),
    currency_symbol: z.string().min(1, "Currency symbol is required"),
    // Display Settings
    currency_position: z.enum(["left", "right"], {
      required_error: "Please select currency symbol position"
    }),
    // Number Formatting
    decimal_separator: z.string().min(1, "Decimal separator is required"),
    exchange_rate_with_usd: z.coerce.number({
      required_error: "Exchange rate is required",
      invalid_type_error: "Exchange rate must be a valid number"
    }).positive("Exchange rate must be greater than 0").max(1e6, "Exchange rate is too high"),
    thousand_separator: z.string(),
    decimal_places: z.string().min(1, "Decimal places is required").refine((val) => parseInt(val) >= 0, {
      message: "Decimal places cannot be negative"
    }).refine((val) => parseInt(val) <= 4, {
      message: "Decimal places cannot exceed 4"
    }),
    show_currency_code: z.boolean()
  })
});
function CurrencySettingsForm({ props }) {
  const {
    default_currency: defaultCurrency,
    currency_symbol: currencySymbol,
    currency_position: currencyPosition,
    decimal_separator: decimalSeparator,
    thousand_separator: thousandSeparator,
    decimal_places: decimalPlaces,
    show_currency_code: showCurrencyCode,
    exchange_rate_with_usd: exchangeRateWithUsd
  } = props;
  const { loading: isSubmitting, submit } = useForm();
  const form = useForm$1({
    resolver: zodResolver(currencySettingsSchema),
    defaultValues: {
      site_settings: {
        default_currency: defaultCurrency || "USD",
        currency_symbol: currencySymbol || "$",
        currency_position: currencyPosition || "left",
        decimal_separator: decimalSeparator || ".",
        thousand_separator: thousandSeparator || ",",
        decimal_places: decimalPlaces?.toString() || "2",
        show_currency_code: showCurrencyCode === "active",
        exchange_rate_with_usd: exchangeRateWithUsd || 1
      }
    }
  });
  const watchCurrency = form.watch("site_settings.default_currency");
  const watchSymbol = form.watch("site_settings.currency_symbol");
  const watchPosition = form.watch("site_settings.currency_position");
  const watchDecimalSeparator = form.watch("site_settings.decimal_separator");
  const watchThousandSeparator = form.watch("site_settings.thousand_separator");
  const watchDecimalPlaces = form.watch("site_settings.decimal_places");
  const watchShowCode = form.watch("site_settings.show_currency_code");
  const handleCurrencyChange = (value) => {
    const selected = currencies?.find((c) => c.code === value);
    if (selected) {
      form.setValue("site_settings.currency_symbol", selected.symbol);
    }
  };
  const generatePreview = () => {
    const amount = 123456789e-2;
    const places = parseInt(watchDecimalPlaces) || 2;
    const formattedAmount = amount.toFixed(places);
    const [integerPart, decimalPart] = formattedAmount.split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, watchThousandSeparator || "");
    const finalAmount = decimalPart ? `${formattedInteger}${watchDecimalSeparator}${decimalPart}` : formattedInteger;
    const withSymbol = watchPosition === "left" ? `${watchSymbol}${finalAmount}` : `${finalAmount}${watchSymbol}`;
    return watchShowCode ? `${withSymbol} ${watchCurrency}` : withSymbol;
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", {
      className: "flex items-center gap-2 mb-6", children: [
      /* @__PURE__ */ jsx(DollarSign, { className: "w-6 h-6 text-primary" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Currency Settings" })
      ]
    }),
    /* @__PURE__ */ jsx(Form, {
      ...form, children: /* @__PURE__ */ jsxs("form", {
        onSubmit: form.handleSubmit((e) => onSettingsUpdate(e, submit)), className: "space-y-6", children: [
      /* @__PURE__ */ jsxs(Card, {
          className: "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800", children: [
        /* @__PURE__ */ jsx(CardHeader, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5 text-blue-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Live Preview" })
              ]
            })
          }),
        /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "space-y-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Example amount formatting:" }),
          /* @__PURE__ */ jsx("div", { className: "p-4 bg-white border-2 border-blue-300 rounded-lg dark:bg-gray-900 dark:border-blue-700", children: /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-center text-blue-600 dark:text-blue-400", children: generatePreview() }) })
              ]
            })
          })
          ]
        }),
      /* @__PURE__ */ jsxs(Card, {
          children: [
        /* @__PURE__ */ jsx(CardHeader, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Globe, { className: "w-5 h-5 text-green-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Base Currency Configuration" })
              ]
            })
          }),
        /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-6", children: [
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.default_currency",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Default Currency" }),
                /* @__PURE__ */ jsxs("div", {
                    className: "relative w-full max-w-xs", children: [
                  /* @__PURE__ */ jsx(FormControl, {
                      children: /* @__PURE__ */ jsx(
                        "select",
                        {
                          className: cn(
                            buttonVariants({ variant: "outline" }),
                            "w-full appearance-none font-normal"
                          ),
                          ...field,
                          onChange: (e) => {
                            field.onChange(e);
                            handleCurrencyChange(e.target.value);
                          },
                          children: currencies.map((currency) => /* @__PURE__ */ jsxs("option", {
                            value: currency.code, children: [
                              currency.code,
                              " - ",
                              currency.name,
                              " (",
                              currency.symbol,
                              ")"
                            ]
                          }, currency.code))
                        }
                      )
                    }),
                  /* @__PURE__ */ jsx(ChevronDownIcon, { className: "absolute end-3 top-2.5 h-4 w-4 opacity-50" })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Select the primary currency for your application" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.currency_symbol",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Currency Symbol" }),
                /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Input,
                      {
                        placeholder: "$",
                        ...field,
                        className: "max-w-xs"
                      }
                    )
                  }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Symbol used to represent the currency (e.g., $, €, £)" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.exchange_rate_with_usd",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Exchange Rate to USD" }),
                /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "number",
                        step: "any",
                        min: 0,
                        placeholder: "1.00",
                        ...field,
                        className: "max-w-xs"
                      }
                    )
                  }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Enter how much 1 USD equals in your default currency." }),
                /* @__PURE__ */ jsx(FormMessage, {})
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
          /* @__PURE__ */ jsx(Settings, { className: "w-5 h-5 text-purple-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Number Formatting" })
              ]
            })
          }),
        /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-6", children: [
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.decimal_separator",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Decimal Separator" }),
                /* @__PURE__ */ jsxs("div", {
                    className: "relative w-full max-w-xs", children: [
                  /* @__PURE__ */ jsx(FormControl, {
                      children: /* @__PURE__ */ jsx(
                        "select",
                        {
                          className: cn(
                            buttonVariants({ variant: "outline" }),
                            "w-full appearance-none font-normal"
                          ),
                          ...field,
                          children: decimalSeparators.map((separator) => /* @__PURE__ */ jsx("option", { value: separator, children: separator === "." ? "Period (.)" : "Comma (,)" }, separator))
                        }
                      )
                    }),
                  /* @__PURE__ */ jsx(ChevronDownIcon, { className: "absolute end-3 top-2.5 h-4 w-4 opacity-50" })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Character used to separate decimal places (e.g., 1.23 or 1,23)" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.thousand_separator",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Thousand Separator" }),
                /* @__PURE__ */ jsxs("div", {
                    className: "relative w-full max-w-xs", children: [
                  /* @__PURE__ */ jsx(FormControl, {
                      children: /* @__PURE__ */ jsx(
                        "select",
                        {
                          className: cn(
                            buttonVariants({ variant: "outline" }),
                            "w-full appearance-none font-normal"
                          ),
                          ...field,
                          children: thousandSeparators.map((separator) => /* @__PURE__ */ jsx("option", { value: separator, children: separator === "," ? "Comma (,)" : separator === "." ? "Period (.)" : separator === " " ? "Space ( )" : "None" }, separator))
                        }
                      )
                    }),
                  /* @__PURE__ */ jsx(ChevronDownIcon, { className: "absolute end-3 top-2.5 h-4 w-4 opacity-50" })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Character used to separate thousands (e.g., 1,000 or 1.000)" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.decimal_places",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                      "Decimal Places",
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "0-4" })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "number",
                        min: "0",
                        max: "4",
                        placeholder: "2",
                        ...field,
                        className: "max-w-xs"
                      }
                    )
                  }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Number of digits to show after decimal point (0-4)" }),
                /* @__PURE__ */ jsx(FormMessage, {})
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
          /* @__PURE__ */ jsx(DollarSign, { className: "w-5 h-5 text-orange-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Advanced Currency Options" })
              ]
            })
          }),
        /* @__PURE__ */ jsx(CardContent, {
            className: "space-y-6", children: /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "site_settings.show_currency_code",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  className: "flex flex-row items-center justify-between p-4 border rounded-lg", children: [
              /* @__PURE__ */ jsxs("div", {
                    className: "space-y-0.5", children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                      className: "flex items-center gap-2 text-base", children: [
                        "Show Currency Code",
                        watchShowCode && /* @__PURE__ */ jsx(Badge, { variant: "default", className: "text-xs", children: "Enabled" })
                      ]
                    }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Display currency code alongside symbol (e.g., $100 USD)" })
                    ]
                  }),
              /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Switch,
                      {
                        checked: field.value,
                        onCheckedChange: field.onChange
                      }
                    )
                  })
                  ]
                })
              }
            )
          })
          ]
        }),
      /* @__PURE__ */ jsx(Button, { disabled: isSubmitting, type: "submit", children: /* @__PURE__ */ jsx(ButtonLoader, { isSubmitting }) })
        ]
      })
    })
    ]
  });
}
const settingsComponentMap = {
  GeneralSettingsForm: {
    title: "General Settings",
    description: "Configure basic site information, timezone, and display preferences.",
    component: GeneralSettingsForm
  },
  StorageSettingsForm: {
    title: "Storage Settings",
    description: "Manage file storage options, cloud integrations, and upload preferences.",
    component: StorageSettingsForm
  },
  LogoForm: {
    title: "Logo & Branding",
    description: "Upload and manage your site logo, favicon, and branding assets.",
    component: LogoForm
  },
  AppearanceForm: {
    title: "Appearance Settings",
    description: "Customize the visual appearance, themes, and UI preferences of your application.",
    component: AppearanceForm
  },
  SecuritySettingsForm: {
    title: "Security Center",
    description: "Manage authentication, access controls, and security policies.",
    component: SecuritySettingsForm
  },
  SocialLoginSettingsForm: {
    title: "Social Login",
    description: "Configure OAuth providers like Google and Facebook for social authentication and streamlined user registration.",
    component: SocialLoginSettingsForm
  },
  SystemPreferencesForm: {
    title: "System Config",
    description: "Configure system-wide preferences, performance settings, and environment variables.",
    component: SystemPreferencesForm
  },
  SEOSettingsForm: {
    title: "SEO & Meta",
    description: "Configure search engine optimization, meta tags, sitemaps, and analytics integration.",
    component: SeoSettingsForm
  },
  RecaptchaSettingsForm: {
    title: "reCAPTCHA",
    description: "Configure Google reCAPTCHA settings, site keys, and spam protection options.",
    component: RecaptchaSettingsForm
  },
  TicketConfigurationForm: {
    title: "Ticket Configuration",
    description: "Configure ticket form fields, field types, and customize your support ticket submission form.",
    component: TicketConfigurationForm
  },
  CurrencySettingsForm: {
    title: "Currency Settings",
    description: "Configure default currency, exchange rates, and manage multi-currency options for your system.",
    component: CurrencySettingsForm
  }
};
function Index({ title, component }) {
  const { props, url } = usePage();
  const componentInfo = settingsComponentMap[component] || null;
  const ComponentToRender = componentInfo?.component;
  const description = componentInfo?.description;
  return /* @__PURE__ */ jsx(BaseLayout, {
    children: /* @__PURE__ */ jsxs(AuthenticatedLayout, {
      children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(Main, {
        className: "space-y-8", children: [
      /* @__PURE__ */ jsxs("div", {
          className: "space-y-0.5", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight md:text-3xl", children: "Settings" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Manage your system settings and set preferences." })
          ]
        }),
      /* @__PURE__ */ jsx(Separator, { className: "my-4 lg:my-6" }),
      /* @__PURE__ */ jsxs("div", {
          className: "flex flex-col flex-1 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12", children: [
        /* @__PURE__ */ jsx("aside", { className: "top-0 lg:sticky lg:w-1/5", children: /* @__PURE__ */ jsx(SidebarNav, { items: settingsNavItems, url, title }) }),
        /* @__PURE__ */ jsx("div", {
            className: "flex w-full p-1", children: /* @__PURE__ */ jsx("div", {
              className: "w-full max-h-[calc(100vh-8rem)] overflow-y-auto pr-2", children: ComponentToRender ? /* @__PURE__ */ jsx(
                ContentSection,
                {
                  title,
                  desc: description,
                  children: /* @__PURE__ */ jsx(ComponentToRender, { props })
                }
              ) : /* @__PURE__ */ jsx("p", { children: "Component not found" })
            })
          })
          ]
        })
        ]
      })
      ]
    })
  });
}
export {
  Index as default,
  settingsComponentMap
};


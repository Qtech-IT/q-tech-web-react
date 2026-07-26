import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { usePage, router, Head } from "@inertiajs/react";
import { z } from "zod";
import { useForm as useForm$1 } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Code, Smartphone, Bell, Settings, Eye } from "lucide-react";
import { o as onSettingsUpdate, B as BaseLayout, A as AuthenticatedLayout, M as Main } from "./Main-BjCbeyG1.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./Card-CQ2ij0--.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./TradeDialog-Dt4WEyMP.js";
import { S as SafePreview, T as TemplateKeysSidebar } from "./TemplateKeysSidebar-BORC0U1f.js";
import { a as getGlobalTemplateBreadcrumbItems, g as generatePreview } from "./NotificationTemplateController-DQGJbhT2.js";
import { i as isDarkMode, B as Button } from "./Button-CFMlPXiE.js";
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, e as FormDescription, f as FormMessage } from "./Form-dg4L2iRR.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { R as RichTextEditor } from "./RichTextEditor-cWbzZRFQ.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { T as Textarea } from "./constants-4k_q_jeE.js";
import { L as LayoutHeader } from "./LayoutHeader-DyQkXJ8M.js";
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
import "react-icons/fa";
import "@radix-ui/react-slot";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-alert-dialog";
import "./AuthController-DaCguZ7K.js";
import "./Badge-B6jlhcU-.js";
import "react-hot-toast";
import "@radix-ui/react-radio-group";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-tabs";
import "framer-motion";
import "./SlideUp-CpffxXZf.js";
import "./Input-ikOfQO4K.js";
import "./Label-BxDBN09D.js";
import "@radix-ui/react-label";
import "dompurify";
import "clsx";
import "tailwind-merge";
import "react-quill-new";
import "./BlogSection-DiGfvTON.js";
import "./EmptyData-DjqqIMwS.js";
import "./BlogCard-Jrl9AHYg.js";
import "@radix-ui/react-switch";
import "@radix-ui/react-accordion";
import "motion/react";
import "./PaginationWrapper-B-KWAp7V.js";
import "./Table-Dz-EvWd_.js";
import "./demo-data-C5EGh9Nk.js";
import "./MarketGrid-DlkazA02.js";
import "@radix-ui/react-select";
import "./Progress-DT6CA82_.js";
import "@radix-ui/react-progress";
import "react-icons/bs";
import "./MarketSectionTwo-RD2Nw8tb.js";
import "./Breadcrumb-D0MBns-9.js";
function GlobalTemplateForm({
  form,
  mailEditorRef,
  pushEditorRef
}) {
  const { loading: isSubmitting, submit } = useForm();
  const { props, url } = usePage();
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit((e) => onSettingsUpdate(e, submit)), className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-6 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs("h3", { className: "flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100", children: [
        /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5" }),
        "Global Mail Template"
      ] }) }),
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "site_settings.default_mail_template",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2 text-gray-900 dark:text-gray-100", children: [
              /* @__PURE__ */ jsx(Code, { className: "w-4 h-4" }),
              "Mail Template Content"
            ] }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
              RichTextEditor,
              {
                ref: mailEditorRef,
                value: field.value,
                onChange: field.onChange,
                placeholder: "Enter global mail template content...",
                height: "400px",
                toolbar: "full",
                darkMode: isDarkMode(props?.site_theme_settings),
                className: "border border-gray-300 rounded-md dark:border-gray-600"
              }
            ) }),
            /* @__PURE__ */ jsx(FormDescription, { className: "text-gray-600 dark:text-gray-400", children: "This template will be used as the base layout for all email notifications. Use template keys from the sidebar to create dynamic content." }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-6 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/20 dark:border-green-800/50", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs("h3", { className: "flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100", children: [
        /* @__PURE__ */ jsx(Smartphone, { className: "w-5 h-5" }),
        "Global Push Notification Template"
      ] }) }),
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "site_settings.default_push_template",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2 text-gray-900 dark:text-gray-100", children: [
              /* @__PURE__ */ jsx(Bell, { className: "w-4 h-4" }),
              "Push Template Content"
            ] }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
              Textarea,
              {
                placeholder: "Enter push notification message...",
                className: "min-h-[120px] text-base bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400",
                ...field
              }
            ) }),
            /* @__PURE__ */ jsx(FormDescription, { className: "text-gray-600 dark:text-gray-400", children: "This template will be used as the base for all push notifications. Keep it concise and engaging for mobile viewing." }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700", children: [
      /* @__PURE__ */ jsxs("h4", { className: "flex items-center gap-2 mb-3 font-medium text-gray-900 dark:text-gray-100", children: [
        /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4" }),
        "Template Usage Guidelines"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-sm text-gray-600 dark:text-gray-300", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-800 dark:text-gray-200", children: "Mail Template:" }),
          " Used as the wrapper/layout for all email notifications. Should include HTML structure, styling, and placeholders for content."
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-800 dark:text-gray-200", children: "Push Template:" }),
          " Used for push notification formatting. Should be brief and include dynamic content placeholders."
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-800 dark:text-gray-200", children: "Template Keys:" }),
          " Use the available template keys from the sidebar to create dynamic content that will be replaced with actual values."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isSubmitting, className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(
        ButtonLoader,
        {
          isSubmitting,
          btnText: "Save Global Templates",
          loaderText: "Saving Templates...",
          icon: /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4" })
        }
      ) }),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          disabled: isSubmitting,
          onClick: () => router.visit("/admin/notification-templates"),
          children: "Back to Templates"
        }
      )
    ] })
  ] }) });
}
const globalTemplateSchema = z.object({
  site_settings: z.object({
    default_mail_template: z.string().min(1, "Global mail template is required"),
    default_push_template: z.string().min(1, "Global push template is required")
  })
});
function Global({
  title,
  default_mail_template: defaultMailTemplate,
  default_push_template: defaultPushTemplate,
  default_template_codes: defaultTemplateCodes
}) {
  const [activeTab, setActiveTab] = useState("edit");
  const mailEditorRef = useRef(null);
  const pushEditorRef = useRef(null);
  const form = useForm$1({
    resolver: zodResolver(globalTemplateSchema),
    defaultValues: {
      site_settings: {
        default_mail_template: defaultMailTemplate || "",
        default_push_template: defaultPushTemplate || ""
      }
    }
  });
  const previewMailTemplate = form.watch("site_settings.default_mail_template");
  const previewPushTemplate = form.watch("site_settings.default_push_template");
  return /* @__PURE__ */ jsx(BaseLayout, { children: /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(Main, { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(
        LayoutHeader,
        {
          variant: "inner",
          breadcrumbItems: getGlobalTemplateBreadcrumbItems(),
          title: "Global Template Settings",
          description: "Configure global templates that will be used as base layouts for all notifications",
          icon: Settings,
          badges: [
            { label: "Type: Global Settings", variant: "outline" },
            { label: "System Wide", variant: "secondary" }
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsx("div", { className: "space-y-6 lg:col-span-2", children: /* @__PURE__ */ jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, children: [
          /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800", children: [
            /* @__PURE__ */ jsxs(
              TabsTrigger,
              {
                value: "edit",
                className: "flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 text-gray-700 dark:text-gray-200 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100",
                children: [
                  /* @__PURE__ */ jsx(Code, { className: "w-4 h-4" }),
                  "Edit Templates"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              TabsTrigger,
              {
                value: "preview",
                className: "flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 text-gray-700 dark:text-gray-200 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100",
                children: [
                  /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" }),
                  "Preview"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx(TabsContent, { value: "edit", className: "mt-2 space-y-6", children: /* @__PURE__ */ jsx(
            GlobalTemplateForm,
            {
              form,
              mailEditorRef,
              pushEditorRef
            }
          ) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "preview", className: "mt-2", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs(Card, { className: "bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800", children: [
              /* @__PURE__ */ jsx(CardHeader, { className: "border-b border-gray-200 dark:border-gray-800", children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-gray-900 dark:text-gray-100", children: [
                /* @__PURE__ */ jsx(Settings, { className: "w-5 h-5" }),
                "Global Mail Template Preview"
              ] }) }),
              /* @__PURE__ */ jsx(CardContent, { className: "pt-2", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-600 dark:text-gray-400", children: "Template Content" }),
                /* @__PURE__ */ jsx(
                  SafePreview,
                  {
                    html: generatePreview(previewMailTemplate, defaultTemplateCodes),
                    className: "p-4 border border-gray-200 rounded-md dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  }
                )
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs(Card, { className: "bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800", children: [
              /* @__PURE__ */ jsx(CardHeader, { className: "border-b border-gray-200 dark:border-gray-800", children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-gray-900 dark:text-gray-100", children: [
                /* @__PURE__ */ jsx(Settings, { className: "w-5 h-5" }),
                "Global Push Template Preview"
              ] }) }),
              /* @__PURE__ */ jsx(CardContent, { className: "pt-2", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-600 dark:text-gray-400", children: "Template Content" }),
                /* @__PURE__ */ jsx(
                  SafePreview,
                  {
                    html: generatePreview(previewPushTemplate, defaultTemplateCodes),
                    className: "p-4 border border-gray-200 rounded-md dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  }
                )
              ] }) })
            ] })
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsx(
          TemplateKeysSidebar,
          {
            templateKeys: defaultTemplateCodes,
            editorRef: mailEditorRef
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  Global as default
};

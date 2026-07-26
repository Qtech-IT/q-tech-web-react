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
import "dompurify";
import "framer-motion";
import { ArrowLeft, Bell, Code, Edit, Eye, Mail, Smartphone } from "lucide-react";
import "motion/react";
import { useRef, useState } from "react";
import { useForm as useForm$1 } from "react-hook-form";
import "react-hot-toast";
import "react-icons/bs";
import "react-icons/fa";
import "react-quill-new";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import "tailwind-merge";
import { z } from "zod";
import "./AuthController-DaCguZ7K.js";
import "./Badge-B6jlhcU-.js";
import "./BlogCard-Jrl9AHYg.js";
import "./BlogSection-DiGfvTON.js";
import "./Breadcrumb-D0MBns-9.js";
import { B as Button, i as isDarkMode, k as keyToValue } from "./Button-CFMlPXiE.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./Card-CQ2ij0--.js";
import { C as CommonLayoutHeader } from "./CommonLayoutHeader-CyKOpByu.js";
import { S as Switch, T as Textarea } from "./constants-4k_q_jeE.js";
import "./demo-data-C5EGh9Nk.js";
import "./EmptyData-DjqqIMwS.js";
import { F as Form, d as FormControl, e as FormDescription, a as FormField, b as FormItem, c as FormLabel, f as FormMessage } from "./Form-dg4L2iRR.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import "./Label-BxDBN09D.js";
import { A as AuthenticatedLayout, B as BaseLayout, M as Main } from "./Main-BjCbeyG1.js";
import "./MarketGrid-DlkazA02.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
import { g as generatePreview, o as onTemplateUpdate } from "./NotificationTemplateController-DQGJbhT2.js";
import "./PaginationWrapper-B-KWAp7V.js";
import "./Progress-DT6CA82_.js";
import { R as RichTextEditor } from "./RichTextEditor-cWbzZRFQ.js";
import "./Sheet-B-_2BaZp.js";
import "./SlideUp-CpffxXZf.js";
import "./Table-Dz-EvWd_.js";
import { S as SafePreview, T as TemplateKeysSidebar } from "./TemplateKeysSidebar-BORC0U1f.js";
import { T as Tabs, c as TabsContent, a as TabsList, b as TabsTrigger } from "./TradeDialog-Dt4WEyMP.js";
function TemplateSaveForm({
  template,
  form,
  editorRef
}) {
  const { loading: isSubmitting, submit } = useForm();
  const isEmailEnabled = !template.is_mail_disable;
  const isRealTimeEnabled = !template.is_real_time_disable;
  const { props, url } = usePage();
  return /* @__PURE__ */ jsx(Form, {
    ...form, children: /* @__PURE__ */ jsxs("form", {
      onSubmit: form.handleSubmit((e) => onTemplateUpdate(e, template, submit)), className: "space-y-6", children: [
        isEmailEnabled && /* @__PURE__ */ jsxs("div", {
          className: "p-4 space-y-6 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700", children: [
      /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("h3", {
              className: "flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100", children: [
          /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5 text-gray-700 dark:text-gray-300" }),
                "Email Configuration"
              ]
            }),
        /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "email_notification",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(FormLabel, { className: "text-sm font-normal text-gray-700 dark:text-gray-300", children: "Email Notifications" }),
              /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Switch,
                      {
                        checked: field.value === "active",
                        onCheckedChange: (checked) => field.onChange(checked ? "active" : "inactive")
                      }
                    )
                  })
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
              name: "subject",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                children: [
            /* @__PURE__ */ jsxs(FormLabel, {
                  required: true, className: "flex items-center gap-2 text-gray-900 dark:text-gray-100", children: [
              /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4 text-gray-700 dark:text-gray-300" }),
                    "Email Subject"
                  ]
                }),
            /* @__PURE__ */ jsx(FormControl, {
                  children: /* @__PURE__ */ jsx(
                    Input,
                    {
                      required: true,
                      placeholder: "Enter email subject...",
                      className: "text-base text-gray-900 bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400",
                      ...field
                    }
                  )
                }),
            /* @__PURE__ */ jsx(FormDescription, { className: "text-gray-600 dark:text-gray-400", children: "The subject line that recipients will see in their inbox" }),
            /* @__PURE__ */ jsx(FormMessage, {})
                ]
              })
            }
          ),
      /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "mail_body",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                children: [
            /* @__PURE__ */ jsxs(FormLabel, {
                  className: "flex items-center gap-2 text-gray-900 dark:text-gray-100", children: [
              /* @__PURE__ */ jsx(Code, { className: "w-4 h-4 text-gray-700 dark:text-gray-300" }),
                    "Email Body"
                  ]
                }),
            /* @__PURE__ */ jsx(FormControl, {
                  children: /* @__PURE__ */ jsx(
                    RichTextEditor,
                    {
                      ref: editorRef,
                      value: field.value,
                      onChange: field.onChange,
                      placeholder: "Enter email body content...",
                      height: "300px",
                      toolbar: "full",
                      className: "border border-gray-300 rounded-md dark:border-gray-600",
                      darkMode: isDarkMode(props?.site_theme_settings)
                    }
                  )
                }),
            /* @__PURE__ */ jsx(FormDescription, { className: "text-gray-600 dark:text-gray-400", children: "Use the rich text editor and template keys from the sidebar to create your email content" }),
            /* @__PURE__ */ jsx(FormMessage, {})
                ]
              })
            }
          )
          ]
        }),
        isRealTimeEnabled && /* @__PURE__ */ jsxs("div", {
          className: "p-4 space-y-6 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800", children: [
      /* @__PURE__ */ jsx("div", {
            className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("h3", {
              className: "flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100", children: [
        /* @__PURE__ */ jsx(Bell, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" }),
                "Real-time Notifications"
              ]
            })
          }),
      /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "push_notification",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2 text-sm font-normal text-gray-700 dark:text-gray-300", children: [
                /* @__PURE__ */ jsx(Smartphone, { className: "w-4 h-4 text-gray-600 dark:text-gray-400" }),
                      "Push Notifications"
                    ]
                  }),
              /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Switch,
                      {
                        checked: field.value === "active",
                        onCheckedChange: (checked) => field.onChange(checked ? "active" : "inactive")
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
                name: "site_notificaton",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2 text-sm font-normal text-gray-700 dark:text-gray-300", children: [
                /* @__PURE__ */ jsx(Bell, { className: "w-4 h-4 text-gray-600 dark:text-gray-400" }),
                      "Site Notifications"
                    ]
                  }),
              /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Switch,
                      {
                        checked: field.value === "active",
                        onCheckedChange: (checked) => field.onChange(checked ? "active" : "inactive")
                      }
                    )
                  })
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
              name: "push_notification_body",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                children: [
            /* @__PURE__ */ jsxs(FormLabel, {
                  className: "flex items-center gap-2 text-gray-900 dark:text-gray-100", children: [
              /* @__PURE__ */ jsx(Smartphone, { className: "w-4 h-4 text-gray-700 dark:text-gray-300" }),
                    "Push Notification Message"
                  ]
                }),
            /* @__PURE__ */ jsx(FormControl, {
                  children: /* @__PURE__ */ jsx(
                    Textarea,
                    {
                      placeholder: "Enter push notification message...",
                      className: "min-h-[120px] text-base bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400",
                      ...field
                    }
                  )
                }),
            /* @__PURE__ */ jsx(FormDescription, { className: "text-gray-600 dark:text-gray-400", children: "The message content for push notifications. Keep it concise and engaging." }),
            /* @__PURE__ */ jsx(FormMessage, {})
                ]
              })
            }
          )
          ]
        }),
    /* @__PURE__ */ jsxs("div", {
          className: "p-4 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700", children: [
      /* @__PURE__ */ jsx("h4", { className: "mb-2 font-medium text-gray-900 dark:text-gray-100", children: "Template Information" }),
      /* @__PURE__ */ jsxs("div", {
            className: "grid grid-cols-2 gap-4 text-sm", children: [
        /* @__PURE__ */ jsxs("div", {
              className: "text-gray-700 dark:text-gray-300", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Name:" }),
                " ",
                template.name
              ]
            }),
        /* @__PURE__ */ jsxs("div", {
              className: "text-gray-700 dark:text-gray-300", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Key:" }),
                " ",
                template.key
              ]
            }),
        /* @__PURE__ */ jsxs("div", {
              className: "text-gray-700 dark:text-gray-300", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Type:" }),
                " ",
                keyToValue(template.type)
              ]
            }),
        /* @__PURE__ */ jsxs("div", {
              className: "text-gray-700 dark:text-gray-300", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Created:" }),
                " ",
                template.created_at
              ]
            })
            ]
          }),
            template.template_key && Object.keys(template.template_key).length > 0 && /* @__PURE__ */ jsxs("div", {
              className: "mt-4", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Available Template Keys:" }),
        /* @__PURE__ */ jsx("div", {
                className: "flex flex-wrap gap-2 mt-2", children: Object.entries(template.template_key).map(([key, description]) => /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "px-2 py-1  text-xs text-blue-800 bg-blue-100 border border-blue-200 rounded dark:text-blue-300 dark:bg-blue-900/30 dark:border-blue-700",
                    title: description,
                    children: `{{${key}}}`
                  },
                  key
                ))
              })
              ]
            })
          ]
        }),
    /* @__PURE__ */ jsxs("div", {
          className: "flex gap-3", children: [
      /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isSubmitting, className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(ButtonLoader, { isSubmitting }) }),
      /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              disabled: isSubmitting,
              onClick: () => router.visit("/admin/notification-templates"),
              className: "text-gray-700 border-gray-300 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
              children: "Cancel"
            }
          )
          ]
        })
      ]
    })
  });
}
const templateEditSchemaSimple = z.object({
  subject: z.string().max(200, "Subject too long").optional(),
  mail_body: z.string().optional(),
  push_notification_body: z.string().optional(),
  email_notification: z.enum(["active", "inactive"]),
  push_notification: z.enum(["active", "inactive"]),
  site_notificaton: z.enum(["active", "inactive"])
}).refine((data, ctx) => {
  return true;
}, {
  message: "Invalid template configuration"
});
function EditNotificationTemplate({
  title,
  template = {}
}) {
  const [activeTab, setActiveTab] = useState("edit");
  const editorRef = useRef(null);
  template = template?.data || null;
  const templateKeys = template?.template_key || {};
  const form = useForm$1({
    resolver: zodResolver(templateEditSchemaSimple),
    defaultValues: {
      subject: template?.subject || "",
      mail_body: template?.mail_body || "",
      push_notification_body: template?.push_notification_body || "",
      email_notification: template?.email_notification || "inactive",
      push_notification: template?.push_notification || "inactive",
      site_notificaton: template?.site_notificaton || "inactive"
    }
  });
  const previewBody = form.watch("mail_body");
  const previewSubject = form.watch("subject");
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
            title: "Edit Notification Template",
            description: "Update template content and preview changes",
            icon: Edit,
            breadcrumbItems: [
              { label: "Dashboard", href: "/admin/dashboard" },
              { label: "Notification Templates", href: "/admin/notification-templates" },
              { label: "Edit" }
            ],
            primaryAction: {
              label: "Back to Templates",
              icon: ArrowLeft,
              onClick: () => router.visit("/admin/notification-templates"),
              variant: "outline"
            }
          }
        ),
      /* @__PURE__ */ jsxs("div", {
          className: "grid grid-cols-1 gap-6 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsx("div", {
            className: "space-y-6 lg:col-span-2", children: /* @__PURE__ */ jsxs(Tabs, {
              value: activeTab, onValueChange: setActiveTab, children: [
          /* @__PURE__ */ jsxs(TabsList, {
                className: "grid w-full grid-cols-2", children: [
            /* @__PURE__ */ jsxs(TabsTrigger, {
                  value: "edit", className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Code, { className: "w-4 h-4" }),
                    "Edit"
                  ]
                }),
            /* @__PURE__ */ jsxs(TabsTrigger, {
                  value: "preview", className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" }),
                    "Preview"
                  ]
                })
                ]
              }),
          /* @__PURE__ */ jsx(TabsContent, {
                value: "edit", className: "mt-2 space-y-6", children: /* @__PURE__ */ jsx(
                  TemplateSaveForm,
                  {
                    template,
                    form,
                    editorRef
                  }
                )
              }),
          /* @__PURE__ */ jsx(TabsContent, {
                value: "preview", className: "mt-2 space-y-6", children: /* @__PURE__ */ jsxs(Card, {
                  children: [
            /* @__PURE__ */ jsx(CardHeader, {
                    children: /* @__PURE__ */ jsxs(CardTitle, {
                      className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5" }),
                        "Email Preview"
                      ]
                    })
                  }),
            /* @__PURE__ */ jsxs(CardContent, {
                    className: "space-y-4", children: [
                      !template?.is_mail_disable && /* @__PURE__ */ jsxs(Fragment, {
                        children: [
                /* @__PURE__ */ jsxs("div", {
                          children: [
                  /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-muted-foreground", children: "Subject" }),
                  /* @__PURE__ */ jsx(SafePreview, { html: generatePreview(previewSubject, templateKeys) })
                          ]
                        }),
                /* @__PURE__ */ jsxs("div", {
                          children: [
                  /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-muted-foreground", children: "Body" }),
                  /* @__PURE__ */ jsx(SafePreview, { html: generatePreview(previewBody, templateKeys) })
                          ]
                        })
                        ]
                      }),
                      !template?.is_real_time_disable && /* @__PURE__ */ jsxs("div", {
                        children: [
                /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-muted-foreground", children: "Push Notification" }),
                /* @__PURE__ */ jsx(SafePreview, { html: generatePreview(form.watch("push_notification_body"), templateKeys) })
                        ]
                      }),
                      template?.is_mail_disable && template?.is_real_time_disable && /* @__PURE__ */ jsx("div", { className: "py-8 text-center text-muted-foreground", children: "No preview available - all notification types are disabled" })
                    ]
                  })
                  ]
                })
              })
              ]
            })
          }),
        /* @__PURE__ */ jsx(TemplateKeysSidebar, { templateKeys, editorRef })
          ]
        })
        ]
      })
      ]
    })
  });
}
export {
  EditNotificationTemplate as default
};


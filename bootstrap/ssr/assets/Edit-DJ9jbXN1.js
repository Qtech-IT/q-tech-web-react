import { zodResolver } from "@hookform/resolvers/zod";
import { Head, router } from "@inertiajs/react";
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
import { CheckCircle, Key, Mail, Server, Settings, Shield, TestTube, XCircle } from "lucide-react";
import "motion/react";
import React__default, { useState } from "react";
import { useForm as useForm$1 } from "react-hook-form";
import "react-hot-toast";
import "react-icons/bs";
import "react-icons/fa";
import { jsx, jsxs } from "react/jsx-runtime";
import "tailwind-merge";
import { z } from "zod";
import { A as Alert, a as AlertDescription } from "./Alert-3s5DZB4H.js";
import "./AuthController-DaCguZ7K.js";
import "./Badge-B6jlhcU-.js";
import "./BlogCard-Jrl9AHYg.js";
import "./BlogSection-DiGfvTON.js";
import "./Breadcrumb-D0MBns-9.js";
import { B as Button, k as keyToValue } from "./Button-CFMlPXiE.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./Card-CQ2ij0--.js";
import "./EmptyData-DjqqIMwS.js";
import { F as Form, d as FormControl, a as FormField, b as FormItem, c as FormLabel, f as FormMessage } from "./Form-dg4L2iRR.js";
import { c as handleEmailGatewayUpdate, d as handleTestEmailGateway } from "./GatewayController-BzwTzlIx.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import "./Label-BxDBN09D.js";
import { L as LayoutHeader } from "./LayoutHeader-BuHBNf3-.js";
import { A as AuthenticatedLayout, B as BaseLayout, M as Main } from "./Main-BjCbeyG1.js";
import { S as Select, c as SelectContent, d as SelectItem, a as SelectTrigger, b as SelectValue } from "./MarketGrid-DlkazA02.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
import "./PaginationWrapper-B-KWAp7V.js";
import "./Progress-DT6CA82_.js";
import { m as Dialog, n as DialogContent, q as DialogDescription, o as DialogHeader, p as DialogTitle } from "./Sheet-B-_2BaZp.js";
import "./SlideUp-CpffxXZf.js";
import "./Table-Dz-EvWd_.js";
import "./TradeDialog-Dt4WEyMP.js";
import "./constants-4k_q_jeE.js";
import "./demo-data-C5EGh9Nk.js";
const baseGatewaySchema = z.object({
  id: z.number(),
  credential: z.record(z.string().max(150, "Field too long"))
});
const smtpSchema = baseGatewaySchema.extend({
  credential: z.object({
    name: z.string().min(1, "Gateway name is required").max(150),
    driver: z.string().min(1, "Driver is required").max(150),
    host: z.string().min(1, "SMTP host is required").max(150),
    port: z.string().min(1, "Port is required").max(150),
    encryption: z.enum(["tls", "ssl", "none"]),
    username: z.string().min(1, "Username is required").max(150),
    password: z.string().min(1, "Password is required").max(150),
    from: z.object({
      address: z.string().email("Invalid email address").max(150),
      name: z.string().min(1, "From name is required").max(150)
    })
  })
});
const sendgridSchema = baseGatewaySchema.extend({
  credential: z.object({
    name: z.string().min(1, "Gateway name is required").max(150),
    app_key: z.string().min(1, "API key is required").max(150),
    from: z.object({
      address: z.string().email("Invalid email address").max(150),
      name: z.string().min(1, "From name is required").max(150)
    })
  })
});
const phpMailSchema = baseGatewaySchema.extend({
  credential: z.object({
    name: z.string().min(1, "Gateway name is required").max(150)
  })
});
function EmailGatewayForm({ gateway }) {
  const { loading: isSubmitting, submit } = useForm();
  const getSchema = () => {
    const gatewayType2 = gateway?.key;
    if (gatewayType2?.includes("SMTP")) return smtpSchema;
    if (gatewayType2?.includes("SENDGRID")) return sendgridSchema;
    if (gatewayType2?.includes("PHP")) return phpMailSchema;
    return baseGatewaySchema;
  };
  const form = useForm$1({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      id: gateway?.id || 0,
      credential: gateway?.credential || {}
    }
  });
  const gatewayType = gateway?.key;
  const isSmtp = gatewayType?.includes("SMTP");
  const isSendGrid = gatewayType?.includes("SENDGRID");
  const isPhpMail = gatewayType?.includes("PHP");
  return /* @__PURE__ */ jsx(Form, {
    ...form, children: /* @__PURE__ */ jsxs("form", {
      onSubmit: form.handleSubmit((data) => handleEmailGatewayUpdate(data, submit)), className: "space-y-6", children: [
    /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "credential.name",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
            children: [
          /* @__PURE__ */ jsxs(FormLabel, {
              required: true, className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4" }),
                "Gateway Name"
              ]
            }),
          /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "Enter gateway name", ...field }) }),
          /* @__PURE__ */ jsx(FormMessage, {})
            ]
          })
        }
      ),
        isSmtp && /* @__PURE__ */ jsx("div", {
          className: "space-y-6", children: /* @__PURE__ */ jsxs(Card, {
            children: [
      /* @__PURE__ */ jsx(CardHeader, {
              children: /* @__PURE__ */ jsxs(CardTitle, {
                className: "flex items-center gap-2 text-base", children: [
        /* @__PURE__ */ jsx(Server, { className: "w-4 h-4" }),
                  "SMTP Server Configuration"
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
                    name: "credential.driver",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                      children: [
                /* @__PURE__ */ jsx(FormLabel, { required: true, children: "Mail Driver" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "smtp", ...field }) }),
                /* @__PURE__ */ jsx(FormMessage, {})
                      ]
                    })
                  }
                ),
          /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "credential.host",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                      children: [
                /* @__PURE__ */ jsx(FormLabel, { required: true, children: "SMTP Host" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "smtp.gmail.com", ...field }) }),
                /* @__PURE__ */ jsx(FormMessage, {})
                      ]
                    })
                  }
                ),
          /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "credential.port",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                      children: [
                /* @__PURE__ */ jsx(FormLabel, { required: true, children: "Port" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "587", ...field }) }),
                /* @__PURE__ */ jsx(FormMessage, {})
                      ]
                    })
                  }
                ),
          /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "credential.encryption",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                      children: [
                /* @__PURE__ */ jsx(FormLabel, { required: true, children: "Encryption" }),
                /* @__PURE__ */ jsxs(Select, {
                        onValueChange: field.onChange, defaultValue: field.value, children: [
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select encryption" }) }) }),
                  /* @__PURE__ */ jsxs(SelectContent, {
                          children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "tls", children: "TLS" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "ssl", children: "SSL" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "none", children: "None" })
                          ]
                        })
                        ]
                      }),
                /* @__PURE__ */ jsx(FormMessage, {})
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
                    name: "credential.username",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                      children: [
                /* @__PURE__ */ jsx(FormLabel, { required: true, children: "Username" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "your-email@example.com", ...field }) }),
                /* @__PURE__ */ jsx(FormMessage, {})
                      ]
                    })
                  }
                ),
          /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "credential.password",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                      children: [
                /* @__PURE__ */ jsx(FormLabel, { required: true, children: "Password" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "password", placeholder: "Your SMTP password", ...field }) }),
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
        }),
        isSendGrid && /* @__PURE__ */ jsxs(Card, {
          children: [
      /* @__PURE__ */ jsx(CardHeader, {
            children: /* @__PURE__ */ jsxs(CardTitle, {
              className: "flex items-center gap-2 text-base", children: [
        /* @__PURE__ */ jsx(Key, { className: "w-4 h-4" }),
                "SendGrid API Configuration"
              ]
            })
          }),
      /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "credential.app_key",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
            /* @__PURE__ */ jsx(FormLabel, { required: true, children: "SendGrid API Key" }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "password", placeholder: "SG.xxxxxxxxxx", ...field }) }),
            /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            )
          })
          ]
        }),
        (isSmtp || isSendGrid) && /* @__PURE__ */ jsxs(Card, {
          children: [
      /* @__PURE__ */ jsx(CardHeader, {
            children: /* @__PURE__ */ jsxs(CardTitle, {
              className: "flex items-center gap-2 text-base", children: [
        /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4" }),
                "Sender Information"
              ]
            })
          }),
      /* @__PURE__ */ jsx(CardContent, {
            className: "space-y-4", children: /* @__PURE__ */ jsxs("div", {
              className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsx(
                FormField,
                {
                  control: form.control,
                  name: "credential.from.address",
                  render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                    children: [
              /* @__PURE__ */ jsx(FormLabel, { required: true, children: "From Email" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "email", placeholder: "noreply@yoursite.com", ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
                    ]
                  })
                }
              ),
        /* @__PURE__ */ jsx(
                FormField,
                {
                  control: form.control,
                  name: "credential.from.name",
                  render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                    children: [
              /* @__PURE__ */ jsx(FormLabel, { required: true, children: "From Name" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "Your Site Name", ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
                    ]
                  })
                }
              )
              ]
            })
          })
          ]
        }),
        isPhpMail && /* @__PURE__ */ jsx(Card, {
          children: /* @__PURE__ */ jsx(CardContent, {
            className: "pt-6", children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20", children: [
      /* @__PURE__ */ jsx(Shield, { className: "w-5 h-5 text-blue-600" }),
      /* @__PURE__ */ jsxs("div", {
                children: [
        /* @__PURE__ */ jsx("h4", { className: "font-medium text-blue-900 dark:text-blue-100", children: "PHP Mail Configuration" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-blue-700 dark:text-blue-200", children: "PHP Mail uses your server's built-in mail function. No additional configuration required." })
                ]
              })
              ]
            })
          })
        }),
    /* @__PURE__ */ jsxs("div", {
          className: "flex gap-3", children: [
      /* @__PURE__ */ jsx(Button, { disabled: isSubmitting, type: "submit", children: /* @__PURE__ */ jsx(ButtonLoader, { isSubmitting }) }),
      /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              disabled: isSubmitting,
              onClick: () => router.visit("/admin/email-gateways "),
              children: "Cancel"
            }
          )
          ]
        })
      ]
    })
  });
}
const testEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address")
});
function TestGatewayDialog({ open, onOpenChange, gateway }) {
  const { loading: isSubmitting, submit } = useForm();
  const [testResult, setTestResult] = React__default.useState(null);
  const form = useForm$1({
    resolver: zodResolver(testEmailSchema),
    defaultValues: {
      email: ""
    }
  });
  const handleClose = () => {
    form.reset();
    setTestResult(null);
    onOpenChange(false);
  };
  if (!gateway) return null;
  return /* @__PURE__ */ jsx(Dialog, {
    open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxs(DialogContent, {
      className: "sm:max-w-[600px]", children: [
    /* @__PURE__ */ jsxs(DialogHeader, {
        children: [
      /* @__PURE__ */ jsxs(DialogTitle, {
          className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(TestTube, { className: "w-5 h-5" }),
            "Test Email Gateway"
          ]
        }),
      /* @__PURE__ */ jsxs(DialogDescription, {
          children: [
            "Send a test email using ",
        /* @__PURE__ */ jsx("strong", { children: gateway.credential?.name }),
            " gateway to verify your configuration."
          ]
        })
        ]
      }),
    /* @__PURE__ */ jsxs("div", {
        className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", {
          className: "p-4 rounded-lg bg-gray-50 dark:bg-gray-900", children: [
        /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4 text-primary" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Gateway Details" })
            ]
          }),
        /* @__PURE__ */ jsxs("div", {
            className: "grid grid-cols-2 gap-4 text-sm", children: [
          /* @__PURE__ */ jsxs("div", {
              children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Provider:" }),
            /* @__PURE__ */ jsx("span", { className: "ml-2 font-medium", children: gateway.credential?.name })
              ]
            }),
          /* @__PURE__ */ jsxs("div", {
              children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Key:" }),
            /* @__PURE__ */ jsx("span", { className: "px-2 py-1 ml-2  text-xs bg-white rounded dark:bg-gray-800", children: gateway.key })
              ]
            }),
          /* @__PURE__ */ jsxs("div", {
              children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Status:" }),
            /* @__PURE__ */ jsx("span", { className: `ml-2 capitalize ${gateway.status === "active" ? "text-green-600" : "text-gray-600"}`, children: gateway.status })
              ]
            }),
          /* @__PURE__ */ jsxs("div", {
              children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Default:" }),
            /* @__PURE__ */ jsx("span", { className: "ml-2", children: gateway.is_default ? "Yes" : "No" })
              ]
            })
            ]
          })
          ]
        }),
          testResult && /* @__PURE__ */ jsx(Alert, {
            className: testResult.success ? "border-green-200 bg-green-50 dark:bg-green-900/20" : "border-red-200 bg-red-50 dark:bg-red-900/20", children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2", children: [
                testResult.success ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 text-green-600" }) : /* @__PURE__ */ jsx(XCircle, { className: "w-4 h-4 text-red-600" }),
        /* @__PURE__ */ jsx(AlertDescription, { className: testResult.success ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200", children: testResult.message })
              ]
            })
          }),
      /* @__PURE__ */ jsx(Form, {
            ...form, children: /* @__PURE__ */ jsxs("form", {
              onSubmit: form.handleSubmit((e) => handleTestEmailGateway(gateway, e, submit, form)), className: "space-y-4", children: [
        /* @__PURE__ */ jsx(
                FormField,
                {
                  control: form.control,
                  name: "email",
                  render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                    children: [
              /* @__PURE__ */ jsx(FormLabel, { required: true, children: "Test Email Address" }),
              /* @__PURE__ */ jsx(FormControl, {
                      children: /* @__PURE__ */ jsx(
                        Input,
                        {
                          type: "email",
                          placeholder: "Enter email address to receive test email",
                          ...field
                        }
                      )
                    }),
              /* @__PURE__ */ jsx(FormMessage, {})
                    ]
                  })
                }
              ),
        /* @__PURE__ */ jsxs("div", {
                className: "flex justify-end gap-3 pt-4", children: [
          /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    onClick: handleClose,
                    disabled: isSubmitting,
                    children: "Cancel"
                  }
                ),
          /* @__PURE__ */ jsxs(Button, {
                  type: "submit", disabled: isSubmitting, children: [
            /* @__PURE__ */ jsx(ButtonLoader, { isSubmitting, btnText: "Send test mail", loaderText: "Sending ..." }),
                    !isSubmitting && /* @__PURE__ */ jsx(TestTube, { className: "w-4 h-4 mr-2" })
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
  });
}
const GatewayInfo = ({
  gatewayData
}) => {
  return /* @__PURE__ */ jsxs(Card, {
    children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Gateway Information" }) }),
    /* @__PURE__ */ jsx(CardContent, {
      className: "space-y-3", children: /* @__PURE__ */ jsxs("div", {
        className: "space-y-2", children: [
      /* @__PURE__ */ jsxs("div", {
          className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Gateway ID:" }),
        /* @__PURE__ */ jsxs("span", {
            className: "", children: [
              "#",
              gatewayData.id
            ]
          })
          ]
        }),
      /* @__PURE__ */ jsxs("div", {
          className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Provider:" }),
        /* @__PURE__ */ jsx("span", { children: gatewayData.credential?.name })
          ]
        }),
      /* @__PURE__ */ jsxs("div", {
          className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Key:" }),
        /* @__PURE__ */ jsx("span", { className: "", children: gatewayData.key })
          ]
        }),
      /* @__PURE__ */ jsxs("div", {
          className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Status:" }),
        /* @__PURE__ */ jsx("span", { className: `capitalize ${gatewayData.status === "active" ? "text-green-600" : "text-gray-600"}`, children: gatewayData.status })
          ]
        }),
      /* @__PURE__ */ jsxs("div", {
          className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Default:" }),
        /* @__PURE__ */ jsx("span", { children: gatewayData.is_default ? "Yes" : "No" })
          ]
        }),
      /* @__PURE__ */ jsxs("div", {
          className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Created:" }),
        /* @__PURE__ */ jsx("span", { children: gatewayData.created_at })
          ]
        })
        ]
      })
    })
    ]
  });
};
function EditEmailGateway({
  title,
  gateway = {}
}) {
  const [showTestModal, setShowTestModal] = useState(false);
  const gatewayData = gateway?.data || null;
  return /* @__PURE__ */ jsx(BaseLayout, {
    children: /* @__PURE__ */ jsxs(AuthenticatedLayout, {
      children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(Main, {
        className: "space-y-6", children: [
      /* @__PURE__ */ jsx(
          LayoutHeader,
          {
            variant: "inner",
            title: "Edit Email Gateway",
            description: "Configure your email gateway settings and test connectivity",
            icon: Settings,
            backUrl: "/admin/email-gateways",
            badges: [
              { label: `Type: ${gatewayData?.credential?.name}`, variant: "outline" },
              { label: `Status: ${keyToValue(gatewayData?.status) || "Unknown"}`, variant: gatewayData?.status === "active" ? "default" : "secondary" },
              { label: `Key: ${gatewayData?.key}`, variant: "secondary" }
            ]
          }
        ),
      /* @__PURE__ */ jsxs("div", {
          className: "grid grid-cols-1 gap-6 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsx("div", {
            className: "lg:col-span-2", children: /* @__PURE__ */ jsxs(Card, {
              children: [
          /* @__PURE__ */ jsx(CardHeader, {
                children: /* @__PURE__ */ jsxs(CardTitle, {
                  className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5" }),
                    "Gateway Configuration"
                  ]
                })
              }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(EmailGatewayForm, { gateway: gatewayData }) })
              ]
            })
          }),
        /* @__PURE__ */ jsxs("div", {
            className: "space-y-6", children: [
          /* @__PURE__ */ jsxs(Card, {
              children: [
            /* @__PURE__ */ jsx(CardHeader, {
                children: /* @__PURE__ */ jsxs(CardTitle, {
                  className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(TestTube, { className: "w-5 h-5" }),
                    "Test Gateway"
                  ]
                })
              }),
            /* @__PURE__ */ jsxs(CardContent, {
                className: "space-y-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Send a test email to verify your gateway configuration is working correctly." }),
              /* @__PURE__ */ jsxs(
                  Button,
                  {
                    onClick: () => setShowTestModal(true),
                    variant: "outline",
                    className: "w-full",
                    children: [
                    /* @__PURE__ */ jsx(TestTube, { className: "w-4 h-4 mr-2" }),
                      "Test Email Gateway"
                    ]
                  }
                )
                ]
              })
              ]
            }),
              gatewayData && /* @__PURE__ */ jsx(GatewayInfo, { gatewayData })
            ]
          })
          ]
        }),
      /* @__PURE__ */ jsx(
          TestGatewayDialog,
          {
            open: showTestModal,
            onOpenChange: setShowTestModal,
            gateway: gatewayData
          }
        )
        ]
      })
      ]
    })
  });
}
export {
  EditEmailGateway as default
};


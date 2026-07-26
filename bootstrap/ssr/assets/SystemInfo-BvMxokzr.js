import { Head } from "@inertiajs/react";
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
import { CheckCircle, Clock, Cpu, HardDrive, Server, Shield, Zap } from "lucide-react";
import "motion/react";
import "react";
import "react-hot-toast";
import "react-icons/bs";
import "react-icons/fa";
import { jsx, jsxs } from "react/jsx-runtime";
import "tailwind-merge";
import "./AuthController-DaCguZ7K.js";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import "./BlogCard-Jrl9AHYg.js";
import "./BlogSection-DiGfvTON.js";
import "./Breadcrumb-D0MBns-9.js";
import "./Button-CFMlPXiE.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./Card-CQ2ij0--.js";
import { C as CommonLayoutHeader } from "./CommonLayoutHeader-CyKOpByu.js";
import "./constants-4k_q_jeE.js";
import "./demo-data-C5EGh9Nk.js";
import "./EmptyData-DjqqIMwS.js";
import "./HotToast-DfpkTxSC.js";
import "./Input-ikOfQO4K.js";
import "./Label-BxDBN09D.js";
import { A as AuthenticatedLayout, B as BaseLayout, M as Main } from "./Main-BjCbeyG1.js";
import "./MarketGrid-DlkazA02.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
import "./PaginationWrapper-B-KWAp7V.js";
import "./Progress-DT6CA82_.js";
import "./Sheet-B-_2BaZp.js";
import "./SlideUp-CpffxXZf.js";
import "./Table-Dz-EvWd_.js";
import "./TradeDialog-Dt4WEyMP.js";
const SystemOverview = ({
  systemInfo
}) => {
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", {
      className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: [
      /* @__PURE__ */ jsx(Card, {
        className: "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800", children: /* @__PURE__ */ jsx(CardContent, {
          className: "p-6", children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg dark:bg-blue-900", children: /* @__PURE__ */ jsx(CheckCircle, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }) }),
        /* @__PURE__ */ jsxs("div", {
              children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-blue-700 dark:text-blue-300", children: "Environment" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-blue-900 capitalize dark:text-blue-100", children: systemInfo?.environment || "Unknown" })
              ]
            })
            ]
          })
        })
      }),
      /* @__PURE__ */ jsx(Card, {
        className: "border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800", children: /* @__PURE__ */ jsx(CardContent, {
          className: "p-6", children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg dark:bg-green-900", children: /* @__PURE__ */ jsx(Zap, { className: "w-6 h-6 text-green-600 dark:text-green-400" }) }),
        /* @__PURE__ */ jsxs("div", {
              children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-green-700 dark:text-green-300", children: "Debug Mode" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-green-900 dark:text-green-100", children: systemInfo?.debug_mode ? "Enabled" : "Disabled" })
              ]
            })
            ]
          })
        })
      }),
      /* @__PURE__ */ jsx(Card, {
        className: "border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800", children: /* @__PURE__ */ jsx(CardContent, {
          className: "p-6", children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg dark:bg-purple-900", children: /* @__PURE__ */ jsx(Clock, { className: "w-6 h-6 text-purple-600 dark:text-purple-400" }) }),
        /* @__PURE__ */ jsxs("div", {
              children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-purple-700 dark:text-purple-300", children: "Timezone" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-purple-900 dark:text-purple-100", children: systemInfo?.timezone || "UTC" })
              ]
            })
            ]
          })
        })
      })
      ]
    }),
    /* @__PURE__ */ jsxs("div", {
      className: "grid grid-cols-1 gap-8 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, {
        children: [
        /* @__PURE__ */ jsx(CardHeader, {
          children: /* @__PURE__ */ jsxs(CardTitle, {
            className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Cpu, { className: "w-5 h-5 text-blue-500" }),
              "Software Information"
            ]
          })
        }),
        /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsxs("div", {
            className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "PHP Version" }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: " text-sm", children: systemInfo?.php_version || "Unknown" })
              ]
            }),
          /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Laravel Version" }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: " text-sm", children: systemInfo?.laravel_version || "Unknown" })
              ]
            }),
          /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Server Software" }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: " text-sm", children: systemInfo?.server_software || "Unknown" })
              ]
            }),
          /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between py-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Database Version" }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: " text-sm", children: systemInfo?.database_version || "Unknown" })
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
          children: /* @__PURE__ */ jsxs(CardTitle, {
            className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Server, { className: "w-5 h-5 text-green-500" }),
              "System Configuration"
            ]
          })
        }),
        /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsxs("div", {
            className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Memory Limit" }),
            /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: " text-sm", children: systemInfo?.memory_limit || "Unknown" })
              ]
            }),
          /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Max Execution Time" }),
            /* @__PURE__ */ jsxs(Badge, {
                variant: "secondary", className: " text-sm", children: [
                  systemInfo?.max_execution_time || "Unknown",
                  "s"
                ]
              })
              ]
            }),
          /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Upload Max Filesize" }),
            /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: " text-sm", children: systemInfo?.upload_max_filesize || "Unknown" })
              ]
            }),
          /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Cache Driver" }),
            /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: " text-sm capitalize", children: systemInfo?.cache_driver || "Unknown" })
              ]
            }),
          /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between py-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Session Driver" }),
            /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: " text-sm capitalize", children: systemInfo?.session_driver || "Unknown" })
              ]
            })
            ]
          })
        })
        ]
      })
      ]
    }),
      systemInfo?.additional_info && /* @__PURE__ */ jsxs(Card, {
        children: [
      /* @__PURE__ */ jsx(CardHeader, {
          children: /* @__PURE__ */ jsxs(CardTitle, {
            className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(HardDrive, { className: "w-5 h-5 text-purple-500" }),
              "Additional System Details"
            ]
          })
        }),
      /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsx("div", {
            className: "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3", children: systemInfo.additional_info.map((item, index) => /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-900", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: item.label }),
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: " text-sm", children: item.value })
              ]
            }, index))
          })
        })
        ]
      }),
      systemInfo?.health_checks && /* @__PURE__ */ jsxs(Card, {
        children: [
      /* @__PURE__ */ jsx(CardHeader, {
          children: /* @__PURE__ */ jsxs(CardTitle, {
            className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Shield, { className: "w-5 h-5 text-orange-500" }),
              "System Health"
            ]
          })
        }),
      /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsx("div", {
            className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: systemInfo.health_checks.map((check, index) => /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-900", children: [
        /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: `w-3 h-3 rounded-full ${check.status ? "bg-green-500" : "bg-red-500"}` }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: check.name })
                ]
              }),
        /* @__PURE__ */ jsx(
                Badge,
                {
                  variant: check.status ? "default" : "destructive",
                  className: "text-xs",
                  children: check.status ? "OK" : "Failed"
                }
              )
              ]
            }, index))
          })
        })
        ]
      })
    ]
  });
};
const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "System Info", href: null }
];
function Index({
  title,
  systemInfo
}) {
  return /* @__PURE__ */ jsx(BaseLayout, {
    children: /* @__PURE__ */ jsxs(AuthenticatedLayout, {
      children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(Main, {
        className: "space-y-8", children: [
      /* @__PURE__ */ jsx(
          CommonLayoutHeader,
          {
            variant: "index",
            breadcrumbItems,
            title: "System Information",
            description: "Overview of your system configuration and environment",
            icon: Server
          }
        ),
      /* @__PURE__ */ jsx(SystemOverview, { systemInfo })
        ]
      })
      ]
    })
  });
}
export {
  Index as default
};


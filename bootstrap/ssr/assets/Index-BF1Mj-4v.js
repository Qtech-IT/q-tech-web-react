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
import { Activity, AlertCircle, CheckCircle, Database, HardDrive, RefreshCw, Settings, Trash2, Zap } from "lucide-react";
import "motion/react";
import { useState } from "react";
import "react-hot-toast";
import "react-icons/bs";
import "react-icons/fa";
import { jsx, jsxs } from "react/jsx-runtime";
import "tailwind-merge";
import { A as Alert, a as AlertDescription } from "./Alert-3s5DZB4H.js";
import "./AuthController-DaCguZ7K.js";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import "./BlogCard-Jrl9AHYg.js";
import "./BlogSection-DiGfvTON.js";
import "./Breadcrumb-D0MBns-9.js";
import { B as Button, k as keyToValue } from "./Button-CFMlPXiE.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./Card-CQ2ij0--.js";
import { C as CommonLayoutHeader } from "./CommonLayoutHeader-CyKOpByu.js";
import "./constants-4k_q_jeE.js";
import "./demo-data-C5EGh9Nk.js";
import "./EmptyData-DjqqIMwS.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import "./Input-ikOfQO4K.js";
import "./Label-BxDBN09D.js";
import { A as AuthenticatedLayout, B as BaseLayout, f as handleClearAllCache, e as handleClearCache, M as Main } from "./Main-BjCbeyG1.js";
import "./MarketGrid-DlkazA02.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
import "./PaginationWrapper-B-KWAp7V.js";
import "./Progress-DT6CA82_.js";
import "./Sheet-B-_2BaZp.js";
import "./SlideUp-CpffxXZf.js";
import "./Table-Dz-EvWd_.js";
import "./TradeDialog-Dt4WEyMP.js";
const CacheOverview = ({
  cacheInfo
}) => {
  const { loading: isSubmitting, submit } = useForm();
  const [lastClearType, setLastClearType] = useState(null);
  const formatBytes = (bytes) => {
    if (bytes === 0 || !bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  const formatDuration = (seconds) => {
    if (!seconds) return "Never";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };
  const getCacheStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "unsupported":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", {
      className: "grid grid-cols-1 gap-6 md:grid-cols-4", children: [
      /* @__PURE__ */ jsx(Card, {
        className: "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800", children: /* @__PURE__ */ jsx(CardContent, {
          className: "p-6", children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg dark:bg-blue-900", children: /* @__PURE__ */ jsx(Database, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }) }),
        /* @__PURE__ */ jsxs("div", {
              children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-blue-700 dark:text-blue-300", children: "Cache Driver" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-blue-900 capitalize dark:text-blue-100", children: cacheInfo?.driver || "Unknown" })
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
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg dark:bg-green-900", children: /* @__PURE__ */ jsx(Activity, { className: "w-6 h-6 text-green-600 dark:text-green-400" }) }),
        /* @__PURE__ */ jsxs("div", {
              children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-green-700 dark:text-green-300", children: "Status" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-green-900 dark:text-green-100", children: cacheInfo?.status || "Unknown" })
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
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg dark:bg-purple-900", children: /* @__PURE__ */ jsx(HardDrive, { className: "w-6 h-6 text-purple-600 dark:text-purple-400" }) }),
        /* @__PURE__ */ jsxs("div", {
              children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-purple-700 dark:text-purple-300", children: "Total Size" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-purple-900 dark:text-purple-100", children: formatBytes(cacheInfo?.total_size) })
              ]
            })
            ]
          })
        })
      }),
      /* @__PURE__ */ jsx(Card, {
        className: "border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800", children: /* @__PURE__ */ jsx(CardContent, {
          className: "p-6", children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg dark:bg-orange-900", children: /* @__PURE__ */ jsx(CheckCircle, { className: "w-6 h-6 text-orange-600 dark:text-orange-400" }) }),
        /* @__PURE__ */ jsxs("div", {
              children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-orange-700 dark:text-orange-300", children: "Hit Rate" }),
          /* @__PURE__ */ jsxs("p", {
                className: "text-2xl font-bold text-orange-900 dark:text-orange-100", children: [
                  cacheInfo?.hit_rate || "0",
                  "%"
                ]
              })
              ]
            })
            ]
          })
        })
      })
      ]
    }),
    /* @__PURE__ */ jsxs(Card, {
      children: [
      /* @__PURE__ */ jsx(CardHeader, {
        children: /* @__PURE__ */ jsxs(CardTitle, {
          className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Settings, { className: "w-5 h-5 text-red-500" }),
            "Quick Cache Actions"
          ]
        })
      }),
      /* @__PURE__ */ jsxs(CardContent, {
        children: [
        /* @__PURE__ */ jsxs(Alert, {
          className: "mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 text-yellow-600 dark:text-yellow-400" }),
          /* @__PURE__ */ jsxs(AlertDescription, {
            className: "text-yellow-800 dark:text-yellow-200", children: [
            /* @__PURE__ */ jsx("strong", { children: "Warning:" }),
              " Clearing cache may temporarily slow down your application as it rebuilds cached data."
            ]
          })
          ]
        }),
        /* @__PURE__ */ jsxs("div", {
          className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              className: "flex flex-col items-center h-auto gap-3 p-4",
              onClick: () => handleClearCache(setLastClearType, "application", submit),
              disabled: isSubmitting,
              children: [
                /* @__PURE__ */ jsx(Database, { className: "w-8 h-8 text-blue-500" }),
                /* @__PURE__ */ jsxs("div", {
                className: "text-center", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Application Cache" }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Clear app cache" })
                ]
              }),
                /* @__PURE__ */ jsx(
                ButtonLoader,
                {
                  isSubmitting: isSubmitting && lastClearType === "application",
                  btnText: "",
                  loaderText: ""
                }
              )
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              className: "flex flex-col items-center h-auto gap-3 p-4",
              onClick: () => handleClearCache(setLastClearType, "route", submit),
              disabled: isSubmitting,
              children: [
                /* @__PURE__ */ jsx(RefreshCw, { className: "w-8 h-8 text-green-500" }),
                /* @__PURE__ */ jsxs("div", {
                className: "text-center", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Route Cache" }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Clear route cache" })
                ]
              }),
                /* @__PURE__ */ jsx(
                ButtonLoader,
                {
                  isSubmitting: isSubmitting && lastClearType === "route",
                  btnText: "",
                  loaderText: ""
                }
              )
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              className: "flex flex-col items-center h-auto gap-3 p-4",
              onClick: () => handleClearCache(setLastClearType, "config", submit),
              disabled: isSubmitting,
              children: [
                /* @__PURE__ */ jsx(Settings, { className: "w-8 h-8 text-purple-500" }),
                /* @__PURE__ */ jsxs("div", {
                className: "text-center", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Config Cache" }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Clear config cache" })
                ]
              }),
                /* @__PURE__ */ jsx(
                ButtonLoader,
                {
                  isSubmitting: isSubmitting && lastClearType === "config",
                  btnText: "",
                  loaderText: ""
                }
              )
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "destructive",
              className: "flex flex-col items-center h-auto gap-3 p-4",
              onClick: () => handleClearAllCache(setLastClearType, submit),
              disabled: isSubmitting,
              children: [
                /* @__PURE__ */ jsx(Trash2, { className: "w-8 h-8" }),
                /* @__PURE__ */ jsxs("div", {
                className: "text-center", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Clear All" }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-white/80", children: "Clear all caches" })
                ]
              }),
                /* @__PURE__ */ jsx(
                ButtonLoader,
                {
                  isSubmitting: isSubmitting && lastClearType === "all",
                  btnText: "",
                  loaderText: ""
                }
              )
              ]
            }
          )
          ]
        })
        ]
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
          /* @__PURE__ */ jsx(Activity, { className: "w-5 h-5 text-blue-500" }),
              "Cache Statistics"
            ]
          })
        }),
        /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsx("div", {
            className: "space-y-4", children: cacheInfo?.statistics?.map((stat, index) => /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: stat.label }),
          /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: " text-sm", children: stat.value })
              ]
            }, index)) || /* @__PURE__ */ jsx("div", { className: "py-8 text-center text-gray-500 dark:text-gray-400", children: "No statistics available" })
          })
        })
        ]
      }),
      /* @__PURE__ */ jsxs(Card, {
        children: [
        /* @__PURE__ */ jsx(CardHeader, {
          children: /* @__PURE__ */ jsxs(CardTitle, {
            className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Settings, { className: "w-5 h-5 text-green-500" }),
              "Cache Configuration"
            ]
          })
        }),
        /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsxs("div", {
            className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Default Driver" }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: " text-sm capitalize", children: cacheInfo?.driver || "Unknown" })
              ]
            }),
          /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Default TTL" }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: " text-sm", children: formatDuration(cacheInfo?.default_ttl) })
              ]
            }),
          /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Prefix" }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: " text-sm", children: cacheInfo?.prefix || "None" })
              ]
            }),
          /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between py-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Serializer" }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: " text-sm", children: cacheInfo?.serializer || "Default" })
              ]
            })
            ]
          })
        })
        ]
      })
      ]
    }),
      cacheInfo?.stores && cacheInfo?.stores?.length > 0 && /* @__PURE__ */ jsxs(Card, {
        children: [
      /* @__PURE__ */ jsx(CardHeader, {
          children: /* @__PURE__ */ jsxs(CardTitle, {
            className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Database, { className: "w-5 h-5 text-purple-500" }),
              "Cache Stores Status"
            ]
          })
        }),
      /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsx("div", {
            className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", children: cacheInfo.stores.map((store, index) => /* @__PURE__ */ jsxs("div", {
              className: "p-4 rounded-lg bg-gray-50 dark:bg-gray-900", children: [
        /* @__PURE__ */ jsxs("div", {
                className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-medium text-gray-900 dark:text-gray-100", children: store.name }),
          /* @__PURE__ */ jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: getCacheStatusColor(store.status),
                    children: keyToValue(store.status)
                  }
                )
                ]
              }),
        /* @__PURE__ */ jsxs("div", {
                className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxs("div", {
                  className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Driver:" }),
            /* @__PURE__ */ jsx("span", { className: "", children: store.driver })
                  ]
                }),
          /* @__PURE__ */ jsxs("div", {
                  className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Size:" }),
            /* @__PURE__ */ jsx("span", { className: "", children: formatBytes(store.size) })
                  ]
                }),
          /* @__PURE__ */ jsxs("div", {
                  className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Keys:" }),
            /* @__PURE__ */ jsx("span", { className: "", children: store.keys || 0 })
                  ]
                })
                ]
              })
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
  { label: "Cache Configuration", href: null }
];
function Index({
  title,
  cacheInfo
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
            title: "Cache Configuration",
            description: "Manage and monitor your application cache settings",
            icon: Zap
          }
        ),
      /* @__PURE__ */ jsx(CacheOverview, { cacheInfo })
        ]
      })
      ]
    })
  });
}
export {
  Index as default
};


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
import { Activity, AlertCircle, Calendar, CheckCircle, Clock, Code, Copy, ExternalLink, FileText, Play, RefreshCw, Server, Settings, Terminal } from "lucide-react";
import "motion/react";
import { useState } from "react";
import "react-hot-toast";
import "react-icons/bs";
import "react-icons/fa";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import "tailwind-merge";
import { A as Alert, a as AlertDescription } from "./Alert-3s5DZB4H.js";
import "./AuthController-DaCguZ7K.js";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import "./BlogCard-Jrl9AHYg.js";
import "./BlogSection-DiGfvTON.js";
import "./Breadcrumb-D0MBns-9.js";
import { B as Button, k as keyToValue } from "./Button-CFMlPXiE.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./Card-CQ2ij0--.js";
import { C as CommonLayoutHeader } from "./CommonLayoutHeader-CyKOpByu.js";
import "./constants-4k_q_jeE.js";
import "./demo-data-C5EGh9Nk.js";
import "./EmptyData-DjqqIMwS.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import "./Input-ikOfQO4K.js";
import "./Label-BxDBN09D.js";
import { A as AuthenticatedLayout, B as BaseLayout, c as clearAutomationCache, h as handleRunCommand, M as Main } from "./Main-BjCbeyG1.js";
import "./MarketGrid-DlkazA02.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
import "./PaginationWrapper-B-KWAp7V.js";
import "./Progress-DT6CA82_.js";
import "./Sheet-B-_2BaZp.js";
import "./SlideUp-CpffxXZf.js";
import "./Table-Dz-EvWd_.js";
import "./TradeDialog-Dt4WEyMP.js";
const AutomationOverview = ({
  automationData
}) => {
  const { loading: isSubmitting, submit } = useForm();
  const [copiedCommand, setCopiedCommand] = useState(null);
  const copyToClipboard = (text, commandType) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCommand(commandType);
      setTimeout(() => setCopiedCommand(null), 2e3);
    });
  };
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "running":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };
  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${seconds}s`;
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", {
      className: "grid grid-cols-1 gap-6 md:grid-cols-4", children: [
      /* @__PURE__ */ jsx(Card, {
        className: "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800", children: /* @__PURE__ */ jsx(CardContent, {
          className: "p-6", children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg dark:bg-blue-900", children: /* @__PURE__ */ jsx(Clock, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }) }),
        /* @__PURE__ */ jsxs("div", {
              children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-blue-700 dark:text-blue-300", children: "Cron Status" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-blue-900 dark:text-blue-100", children: automationData?.cron_status || "Unknown" })
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
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-green-700 dark:text-green-300", children: "Active Jobs" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-green-900 dark:text-green-100", children: automationData?.active_jobs || 0 })
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
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg dark:bg-purple-900", children: /* @__PURE__ */ jsx(RefreshCw, { className: "w-6 h-6 text-purple-600 dark:text-purple-400" }) }),
        /* @__PURE__ */ jsxs("div", {
              children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-purple-700 dark:text-purple-300", children: "Last Run" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-purple-900 dark:text-purple-100", children: automationData?.last_run || "Never" })
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
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-orange-700 dark:text-orange-300", children: "Success Rate" }),
          /* @__PURE__ */ jsxs("p", {
                className: "text-2xl font-bold text-orange-900 dark:text-orange-100", children: [
                  automationData?.success_rate || 0,
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
        /* @__PURE__ */ jsx(Terminal, { className: "w-5 h-5 text-blue-500" }),
            "Cron Job Setup Instructions"
          ]
        })
      }),
      /* @__PURE__ */ jsxs(CardContent, {
        children: [
        /* @__PURE__ */ jsxs(Alert, {
          className: "mb-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800", children: [
          /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4 text-blue-600 dark:text-blue-400" }),
          /* @__PURE__ */ jsxs(AlertDescription, {
            className: "text-blue-800 dark:text-blue-200", children: [
            /* @__PURE__ */ jsx("strong", { children: "Important:" }),
              " Add the following cron job to your server to enable automated task execution."
            ]
          })
          ]
        }),
        /* @__PURE__ */ jsxs("div", {
          className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", {
            className: "p-4 bg-gray-900 rounded-lg", children: [
            /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxs("h4", {
                className: "flex items-center gap-2 text-sm font-semibold text-white", children: [
                /* @__PURE__ */ jsx(Server, { className: "w-4 h-4" }),
                  "Server Cron Command"
                ]
              }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "secondary",
                  size: "sm",
                  onClick: () => copyToClipboard(automationData?.cron_command, "server"),
                  className: "text-gray-900 bg-white border-0 hover:bg-gray-100",
                  children: copiedCommand === "server" ? /* @__PURE__ */ jsxs(Fragment, {
                    children: [
                    /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 mr-1 text-green-600" }),
                      "Copied!"
                    ]
                  }) : /* @__PURE__ */ jsxs(Fragment, {
                    children: [
                    /* @__PURE__ */ jsx(Copy, { className: "w-4 h-4 mr-1" }),
                      "Copy"
                    ]
                  })
                }
              )
              ]
            }),
            /* @__PURE__ */ jsx("code", { className: "block  text-sm text-green-400 break-all", children: automationData?.cron_command || "* * * * * cd /path/to/your-project && php artisan schedule:run >> /dev/null 2>&1" })
            ]
          }),
          /* @__PURE__ */ jsxs("div", {
            className: "grid grid-cols-1 gap-4 md:grid-cols-3", children: [
            /* @__PURE__ */ jsxs("div", {
              className: "p-4 rounded-lg bg-gray-50 dark:bg-gray-900", children: [
              /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-3 mb-2", children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-6 h-6 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full", children: "1" }),
                /* @__PURE__ */ jsx("h4", { className: "font-medium", children: "Access Crontab" })
                ]
              }),
              /* @__PURE__ */ jsx("p", { className: "mb-2 text-sm text-gray-600 dark:text-gray-400", children: "SSH into your server and open crontab editor" }),
              /* @__PURE__ */ jsx("code", { className: "block p-2  text-xs text-green-400 bg-black rounded", children: "crontab -e" })
              ]
            }),
            /* @__PURE__ */ jsxs("div", {
              className: "p-4 rounded-lg bg-gray-50 dark:bg-gray-900", children: [
              /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-3 mb-2", children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-6 h-6 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full", children: "2" }),
                /* @__PURE__ */ jsx("h4", { className: "font-medium", children: "Add Cron Job" })
                ]
              }),
              /* @__PURE__ */ jsx("p", { className: "mb-2 text-sm text-gray-600 dark:text-gray-400", children: "Paste the command above into your crontab" }),
              /* @__PURE__ */ jsx("code", { className: "block p-2  text-xs text-green-400 bg-black rounded", children: "# Add the command from step 1" })
              ]
            }),
            /* @__PURE__ */ jsxs("div", {
              className: "p-4 rounded-lg bg-gray-50 dark:bg-gray-900", children: [
              /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-3 mb-2", children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-6 h-6 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full", children: "3" }),
                /* @__PURE__ */ jsx("h4", { className: "font-medium", children: "Save & Verify" })
                ]
              }),
              /* @__PURE__ */ jsx("p", { className: "mb-2 text-sm text-gray-600 dark:text-gray-400", children: "Save crontab and verify it's working" }),
              /* @__PURE__ */ jsx("code", { className: "block p-2  text-xs text-green-400 bg-black rounded", children: "crontab -l" })
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
        children: /* @__PURE__ */ jsxs(CardTitle, {
          className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Code, { className: "w-5 h-5 text-green-500" }),
            "Available Artisan Commands"
          ]
        })
      }),
      /* @__PURE__ */ jsx(CardContent, {
        children: /* @__PURE__ */ jsx("div", {
          className: "space-y-4", children: automationData?.commands?.map((command, index) => /* @__PURE__ */ jsxs("div", {
            className: "p-4 border border-gray-200 rounded-lg dark:border-gray-700", children: [
        /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-800", children: /* @__PURE__ */ jsx(Terminal, { className: "w-5 h-5 text-gray-600 dark:text-gray-400" }) }),
            /* @__PURE__ */ jsxs("div", {
                  children: [
              /* @__PURE__ */ jsx("h4", { className: "font-medium text-gray-900 dark:text-gray-100", children: command.name }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: command.description })
                  ]
                })
                ]
              }),
          /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: getStatusColor(command.status), children: keyToValue(command.status) }),
            /* @__PURE__ */ jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => handleRunCommand(command.id, submit),
                    disabled: isSubmitting,
                    children: [
                  /* @__PURE__ */ jsx(Play, { className: "w-4 h-4 mr-1" }),
                      "Run Now"
                    ]
                  }
                )
                ]
              })
              ]
            }),
        /* @__PURE__ */ jsxs("div", {
              className: "p-3 mb-3 bg-gray-900 rounded", children: [
          /* @__PURE__ */ jsxs("div", {
                className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-gray-400", children: "Command" }),
            /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "secondary",
                    size: "sm",
                    onClick: () => copyToClipboard(command.command, command.id),
                    className: "h-6 px-2 text-gray-900 bg-white border-0 hover:bg-gray-100",
                    children: copiedCommand === command.id ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-3 h-3 text-green-600" }) : /* @__PURE__ */ jsx(Copy, { className: "w-3 h-3" })
                  }
                )
                ]
              }),
          /* @__PURE__ */ jsxs("code", {
                className: " text-sm text-green-400 break-all", children: [
                  "php artisan ",
                  command.command
                ]
              })
              ]
            }),
        /* @__PURE__ */ jsxs("div", {
              className: "grid grid-cols-2 gap-4 text-sm md:grid-cols-4", children: [
          /* @__PURE__ */ jsxs("div", {
                children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Schedule:" }),
            /* @__PURE__ */ jsx("div", { className: "", children: command.schedule })
                ]
              }),
          /* @__PURE__ */ jsxs("div", {
                children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Last Run:" }),
            /* @__PURE__ */ jsx("div", { children: command.last_run || "Never" })
                ]
              }),
          /* @__PURE__ */ jsxs("div", {
                children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Duration:" }),
            /* @__PURE__ */ jsx("div", { children: formatDuration(command.duration) })
                ]
              }),
          /* @__PURE__ */ jsxs("div", {
                children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Next Run:" }),
            /* @__PURE__ */ jsx("div", { children: command.next_run || "N/A" })
                ]
              })
              ]
            })
            ]
          }, index)) || /* @__PURE__ */ jsx("div", { className: "py-8 text-center text-gray-500 dark:text-gray-400", children: "No scheduled commands configured" })
        })
      })
      ]
    }),
      automationData?.history && automationData.history.length > 0 && /* @__PURE__ */ jsxs(Card, {
        children: [
      /* @__PURE__ */ jsx(CardHeader, {
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs(CardTitle, {
              className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "w-5 h-5 text-purple-500" }),
                "Recent Execution History"
              ]
            }),
        /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                disabled: isSubmitting,
                onClick: () => clearAutomationCache(submit),
                className: "text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20",
                children: [
              /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 mr-1" }),
                  "Clear History"
                ]
              }
            )
            ]
          })
        }),
      /* @__PURE__ */ jsxs(CardContent, {
          children: [
        /* @__PURE__ */ jsx("div", {
            className: "pr-2 space-y-3 overflow-y-auto max-h-96", children: automationData.history.map((entry, index) => /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900", children: [
          /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: `w-3 h-3 rounded-full flex-shrink-0 ${entry.status === "success" ? "bg-green-500" : entry.status === "failed" ? "bg-red-500" : "bg-yellow-500"}` }),
            /* @__PURE__ */ jsxs("div", {
                  className: "min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm font-medium truncate", children: entry.command }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: entry.timestamp })
                  ]
                })
                ]
              }),
          /* @__PURE__ */ jsxs("div", {
                className: "flex items-center flex-shrink-0 gap-2", children: [
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: getStatusColor(entry.status), children: keyToValue(entry.status) }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600 dark:text-gray-400", children: formatDuration(entry.duration) })
                ]
              })
              ]
            }, index))
          }),
            automationData.history.length > 5 && /* @__PURE__ */ jsx("div", {
              className: "mt-4 text-center", children: /* @__PURE__ */ jsxs("p", {
                className: "text-xs text-gray-500 dark:text-gray-400", children: [
                  "Showing ",
                  automationData.history.length,
                  " entries. Scroll to see more."
                ]
              })
            })
          ]
        })
        ]
      }),
    /* @__PURE__ */ jsx(Card, {
        className: "border-gray-300 border-dashed dark:border-gray-600", children: /* @__PURE__ */ jsx(CardContent, {
          className: "p-6", children: /* @__PURE__ */ jsxs("div", {
            className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(FileText, { className: "w-5 h-5 text-blue-500" }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Documentation & Resources" })
              ]
            }),
      /* @__PURE__ */ jsxs("div", {
              className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", {
                className: "space-y-3", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-medium", children: "Laravel Scheduling" }),
          /* @__PURE__ */ jsxs("div", {
                  className: "flex flex-col space-y-2", children: [
            /* @__PURE__ */ jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      onClick: () => window.open("https://laravel.com/docs/scheduling", "_blank"),
                      className: "justify-start",
                      children: [
                  /* @__PURE__ */ jsx(ExternalLink, { className: "flex-shrink-0 w-4 h-4 mr-2" }),
                        "Laravel Task Scheduling"
                      ]
                    }
                  ),
            /* @__PURE__ */ jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      onClick: () => window.open("https://laravel.com/docs/artisan", "_blank"),
                      className: "justify-start",
                      children: [
                  /* @__PURE__ */ jsx(ExternalLink, { className: "flex-shrink-0 w-4 h-4 mr-2" }),
                        "Artisan Console"
                      ]
                    }
                  )
                  ]
                })
                ]
              }),
        /* @__PURE__ */ jsxs("div", {
                className: "space-y-3", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-medium", children: "Cron Job Resources" }),
          /* @__PURE__ */ jsxs("div", {
                  className: "flex flex-col space-y-2", children: [
            /* @__PURE__ */ jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      onClick: () => window.open("https://crontab.guru/", "_blank"),
                      className: "justify-start",
                      children: [
                  /* @__PURE__ */ jsx(ExternalLink, { className: "flex-shrink-0 w-4 h-4 mr-2" }),
                        "Crontab Guru"
                      ]
                    }
                  ),
            /* @__PURE__ */ jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      onClick: () => window.open("https://cron-job.org/en/", "_blank"),
                      className: "justify-start",
                      children: [
                  /* @__PURE__ */ jsx(ExternalLink, { className: "flex-shrink-0 w-4 h-4 mr-2" }),
                        "Online Cron Jobs"
                      ]
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
        })
      })
    ]
  });
};
const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Automation & Cron", href: null }
];
function Index({
  title,
  automationData
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
            title: "Automation & Cron Jobs",
            description: "Manage scheduled tasks and automated processes",
            icon: Clock
          }
        ),
      /* @__PURE__ */ jsx(AutomationOverview, { automationData })
        ]
      })
      ]
    })
  });
}
export {
  Index as default
};


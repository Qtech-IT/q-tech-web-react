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
import { AlertTriangle, ArrowLeft, BarChart3, CheckCircle, Edit, ExternalLink, Info, Key, MoreHorizontal, Plus, Search, Smartphone, Star, Trash2, X } from "lucide-react";
import "motion/react";
import React__default, { useEffect, useState } from "react";
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
import { B as Breadcrumb } from "./Breadcrumb-D0MBns-9.js";
import { B as Button } from "./Button-CFMlPXiE.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./Card-CQ2ij0--.js";
import { D as DeleteDialog } from "./DeleteDialog-DBDDlwO7.js";
import "./EmptyData-DjqqIMwS.js";
import { E as EmptyTableState } from "./EmptyTableState-C7sYsPjb.js";
import { F as Form, d as FormControl, e as FormDescription, a as FormField, b as FormItem, c as FormLabel, f as FormMessage } from "./Form-dg4L2iRR.js";
import { g as getDeleteDialogConfig, b as handleDeleteFirebaseGateway, a as handleSaveFirebaseGateway, h as handleSetDefaultlFirebaseGateway, s as setFirebaseGatewayFilterData } from "./GatewayController-BzwTzlIx.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import "./Label-BxDBN09D.js";
import { A as AuthenticatedLayout, B as BaseLayout, M as Main } from "./Main-BjCbeyG1.js";
import "./MarketGrid-DlkazA02.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
import "./PaginationWrapper-B-KWAp7V.js";
import "./Progress-DT6CA82_.js";
import { m as Dialog, n as DialogContent, q as DialogDescription, o as DialogHeader, p as DialogTitle, D as DropdownMenu, f as DropdownMenuContent, i as DropdownMenuItem, g as DropdownMenuLabel, h as DropdownMenuSeparator, e as DropdownMenuTrigger } from "./Sheet-B-_2BaZp.js";
import "./SlideUp-CpffxXZf.js";
import { T as Table, d as TableBody, e as TableCell, c as TableHead, a as TableHeader, b as TableRow } from "./Table-Dz-EvWd_.js";
import "./TradeDialog-Dt4WEyMP.js";
import { T as Textarea } from "./constants-4k_q_jeE.js";
import "./demo-data-C5EGh9Nk.js";
const LayoutHeader = ({
  breadcrumbItems: breadcrumbItems2,
  stats = null,
  variant = "index",
  title,
  description,
  icon: Icon,
  backUrl = null,
  badges = [],
  primaryAction = null,
  secondaryActions = []
}) => {
  if (variant === "inner") {
    return /* @__PURE__ */ jsx("div", {
      className: "p-8 border shadow-sm rounded-2xl bg-card", children: /* @__PURE__ */ jsxs("div", {
        className: "space-y-6", children: [
          breadcrumbItems2 && /* @__PURE__ */ jsx(Breadcrumb, { items: breadcrumbItems2 }),
      /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: [
        /* @__PURE__ */ jsxs("div", {
              className: "space-y-3", children: [
                backUrl && /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsx(
                    ArrowLeft,
                    {
                      className: "w-4 h-4 transition-colors cursor-pointer hover:text-foreground",
                      onClick: () => router.visit(backUrl)
                    }
                  ),
            /* @__PURE__ */ jsx("span", { children: "Back to Gateways" })
                  ]
                }),
          /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "p-3 shadow-sm bg-primary rounded-xl text-primary-foreground", children: /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6" }) }),
            /* @__PURE__ */ jsxs("div", {
                    children: [
              /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: title }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: description })
                    ]
                  })
                  ]
                }),
                stats && /* @__PURE__ */ jsx("div", {
                  className: "flex flex-wrap gap-6 pt-2", children: /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-green-100 dark:bg-green-900/20", children: /* @__PURE__ */ jsx(BarChart3, { className: "w-4 h-4 text-green-600 dark:text-green-400" }) }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: stats.total }),
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Total" })
                    ]
                  })
                })
              ]
            }),
        /* @__PURE__ */ jsxs("div", {
              className: "flex flex-col gap-3 lg:flex-row lg:items-center", children: [
                primaryAction && /* @__PURE__ */ jsxs(
                  Button,
                  {
                    onClick: primaryAction.onClick,
                    variant: primaryAction.variant || "default",
                    className: primaryAction.className || "",
                    children: [
                      primaryAction.icon && /* @__PURE__ */ jsx(primaryAction.icon, { className: "w-4 h-4 mr-2" }),
                      primaryAction.label
                    ]
                  }
                ),
                secondaryActions.length > 0 && /* @__PURE__ */ jsx("div", {
                  className: "flex gap-2", children: secondaryActions.map((action, index) => /* @__PURE__ */ jsxs(
                    Button,
                    {
                      onClick: action.onClick,
                      variant: action.variant || "outline",
                      size: action.size || "default",
                      className: action.className || "",
                      children: [
                        action.icon && /* @__PURE__ */ jsx(action.icon, { className: "w-4 h-4 mr-2" }),
                        action.label
                      ]
                    },
                    index
                  ))
                }),
                badges.length > 0 && /* @__PURE__ */ jsx("div", {
                  className: "flex items-center gap-2", children: badges.map((badge, index) => /* @__PURE__ */ jsx(
                    Badge,
                    {
                      variant: badge.variant || "outline",
                      className: "text-xs",
                      children: badge.label
                    },
                    index
                  ))
                })
              ]
            })
            ]
          })
        ]
      })
    });
  }
  return /* @__PURE__ */ jsx("div", {
    className: "p-8 border shadow-sm rounded-2xl bg-card", children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6", children: [
        breadcrumbItems2 && /* @__PURE__ */ jsx(Breadcrumb, { items: breadcrumbItems2 }),
    /* @__PURE__ */ jsxs("div", {
          className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: [
      /* @__PURE__ */ jsxs("div", {
            className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-3 shadow-sm bg-primary rounded-xl text-primary-foreground", children: /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsxs("div", {
                children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: title }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: description })
                ]
              })
              ]
            }),
              stats && /* @__PURE__ */ jsx("div", {
                className: "flex flex-wrap gap-6 pt-2", children: /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-green-100 dark:bg-green-900/20", children: /* @__PURE__ */ jsx(BarChart3, { className: "w-4 h-4 text-green-600 dark:text-green-400" }) }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: stats.total }),
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Total" })
                  ]
                })
              })
            ]
          }),
      /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col gap-3 lg:flex-row lg:items-center", children: [
              primaryAction && /* @__PURE__ */ jsxs(
                Button,
                {
                  onClick: primaryAction.onClick,
                  variant: primaryAction.variant || "default",
                  className: `lg:flex-shrink-0 ${primaryAction.className || ""}`,
                  children: [
                    primaryAction.icon && /* @__PURE__ */ jsx(primaryAction.icon, { className: "w-4 h-4 mr-2" }),
                    primaryAction.label
                  ]
                }
              ),
              secondaryActions.length > 0 && /* @__PURE__ */ jsx("div", {
                className: "flex gap-2", children: secondaryActions.map((action, index) => /* @__PURE__ */ jsxs(
                  Button,
                  {
                    onClick: action.onClick,
                    variant: action.variant || "outline",
                    size: action.size || "default",
                    className: `lg:flex-shrink-0 ${action.className || ""}`,
                    children: [
                      action.icon && /* @__PURE__ */ jsx(action.icon, { className: "w-4 h-4 mr-2" }),
                      action.label
                    ]
                  },
                  index
                ))
              }),
              badges.length > 0 && /* @__PURE__ */ jsx("div", {
                className: "flex items-center gap-2", children: badges.map((badge, index) => /* @__PURE__ */ jsx(
                  Badge,
                  {
                    variant: badge.variant || "outline",
                    className: "text-xs",
                    children: badge.label
                  },
                  index
                ))
              })
            ]
          })
          ]
        })
      ]
    })
  });
};
const SimpleSearchBox = ({
  searchTerm = "",
  onSearchChange,
  placeholder = "Search...",
  className = ""
}) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const handleSearchChange = (value) => {
    setLocalSearch(value);
    onSearchChange(value);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };
  const clearSearch = () => {
    handleSearchChange("");
  };
  React__default.useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);
  return /* @__PURE__ */ jsxs("div", {
    className: `w-full max-w-full p-3 space-y-3 border rounded-xl bg-background sm:p-4 ${className}`, children: [
    /* @__PURE__ */ jsxs("div", {
      className: "flex items-center min-w-0 gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 p-1.5 rounded-lg bg-primary/10 sm:p-2", children: /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-primary" }) }),
      /* @__PURE__ */ jsxs("div", {
        className: "min-w-0", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold truncate sm:text-base", children: "Search Gateways" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs truncate text-muted-foreground", children: "Find gateways instantly" })
        ]
      })
      ]
    }),
    /* @__PURE__ */ jsx("form", {
      onSubmit: handleSearchSubmit, className: "w-full", children: /* @__PURE__ */ jsxs("div", {
        className: "relative flex-1 min-w-0", children: [
      /* @__PURE__ */ jsx(Search, { className: "absolute w-3.5 h-3.5 left-2.5 top-2.5 text-muted-foreground sm:w-4 sm:h-4 sm:left-3 sm:top-3" }),
      /* @__PURE__ */ jsx(
          Input,
          {
            name: "search",
            placeholder,
            value: localSearch,
            onChange: (e) => handleSearchChange(e.target.value),
            className: "w-full pl-8 pr-8 text-sm h-9 sm:pl-9 sm:pr-10 sm:h-10"
          }
        ),
          localSearch && /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "icon",
              className: "absolute right-1 top-1 w-7 h-7 sm:right-1.5 sm:top-1.5",
              onClick: clearSearch,
              children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
            }
          )
        ]
      })
    }),
      localSearch && /* @__PURE__ */ jsx("div", {
        className: "pt-2 border-t", children: /* @__PURE__ */ jsxs("span", {
          className: "text-xs text-muted-foreground", children: [
            "Searching for: ",
      /* @__PURE__ */ jsxs("span", {
              className: "font-medium text-foreground", children: [
                '"',
                localSearch,
                '"'
              ]
            })
          ]
        })
      })
    ]
  });
};
const TableActions = ({ gateway, onEdit, onDelete }) => {
  const { submit } = useForm();
  const handleEdit = () => {
    onEdit(gateway);
  };
  const handleDelete = () => {
    onDelete(gateway);
  };
  return /* @__PURE__ */ jsxs(DropdownMenu, {
    children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, {
      asChild: true, children: /* @__PURE__ */ jsxs(Button, {
        variant: "ghost", className: "p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800", children: [
      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open menu" }),
      /* @__PURE__ */ jsx(MoreHorizontal, { className: "w-4 h-4 text-gray-600 dark:text-gray-400" })
        ]
      })
    }),
    /* @__PURE__ */ jsxs(DropdownMenuContent, {
      align: "end", className: "w-48 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-900 dark:border-gray-700", children: [
      /* @__PURE__ */ jsx(DropdownMenuLabel, { className: "text-sm font-semibold text-gray-700 dark:text-gray-300", children: "Actions" }),
      /* @__PURE__ */ jsx(DropdownMenuSeparator, { className: "dark:bg-gray-700" }),
      /* @__PURE__ */ jsxs(
        DropdownMenuItem,
        {
          onClick: handleEdit,
          className: "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100",
          children: [
            /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4 mr-2 text-blue-600 dark:text-blue-500" }),
            "Edit Gateway"
          ]
        }
      ),
        !gateway.is_default && /* @__PURE__ */ jsxs(
          DropdownMenuItem,
          {
            onClick: () => handleSetDefaultlFirebaseGateway(gateway, submit),
            className: "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100",
            children: [
            /* @__PURE__ */ jsx(Star, { className: "w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-500" }),
              "Set as Default"
            ]
          }
        ),
      /* @__PURE__ */ jsx(DropdownMenuSeparator, { className: "dark:bg-gray-700" }),
      /* @__PURE__ */ jsxs(
          DropdownMenuItem,
          {
            onClick: handleDelete,
            className: "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400",
            children: [
            /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4 mr-2" }),
              "Delete Gateway"
            ]
          }
        )
      ]
    })
    ]
  });
};
const StatusBadge = ({ status }) => {
  const variants = {
    active: {
      variant: "default",
      className: "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/20 border-green-200 dark:border-green-700"
    },
    inactive: {
      variant: "secondary",
      className: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-600"
    },
    pending: {
      variant: "outline",
      className: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700"
    }
  };
  const config = variants[status] || variants.inactive;
  return /* @__PURE__ */ jsx(Badge, { variant: config.variant, className: `text-xs ${config.className}`, children: status.charAt(0).toUpperCase() + status.slice(1) });
};
const DefaultBadge = ({ isDefault }) => {
  if (!isDefault) return null;
  return /* @__PURE__ */ jsxs(
    Badge,
    {
      variant: "outline",
      className: "text-xs text-yellow-700 border-yellow-200 dark:text-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
      children: [
        /* @__PURE__ */ jsx(Star, { className: "w-3 h-3 mr-1" }),
        "Default"
      ]
    }
  );
};
const FirebaseGatewaysTable = ({ gateways = [], onEdit, onDelete }) => {
  if (gateways.length === 0) {
    return /* @__PURE__ */ jsx(
      EmptyTableState,
      {
        icon: Smartphone,
        title: "No Firebase gateways found",
        description: "No Firebase gateway configurations found. Configure your first Firebase provider to get started."
      }
    );
  }
  return /* @__PURE__ */ jsx(Card, {
    className: "bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-900", children: /* @__PURE__ */ jsx(CardContent, {
      className: "p-0", children: /* @__PURE__ */ jsx("div", {
        className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, {
          className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [
    /* @__PURE__ */ jsx(TableHeader, {
            className: "bg-gray-50 dark:bg-gray-800", children: /* @__PURE__ */ jsxs(TableRow, {
              children: [
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "ID" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Gateway" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Status" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Created" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-300", children: "Actions" })
              ]
            })
          }),
    /* @__PURE__ */ jsx(TableBody, {
            className: "bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700", children: gateways?.map((gateway, index) => /* @__PURE__ */ jsxs(TableRow, {
              className: "transition-colors hover:bg-gray-50 dark:hover:bg-gray-800", children: [
      /* @__PURE__ */ jsxs(TableCell, {
                className: "px-6 py-4  text-gray-700 dark:text-gray-300", children: [
                  "#",
                  index + 1
                ]
              }),
      /* @__PURE__ */ jsx(TableCell, {
                className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", {
                  className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: "Firebase Gateway" }),
          /* @__PURE__ */ jsx(DefaultBadge, { isDefault: gateway.is_default })
                    ]
                  }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("span", { className: "px-2 py-1  text-xs text-gray-600 bg-gray-100 rounded dark:bg-gray-800 dark:text-gray-400", children: gateway.key }) })
                  ]
                })
              }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx(StatusBadge, { status: gateway.status }) }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4 text-sm text-gray-500 dark:text-gray-400", children: gateway.created_at }),
      /* @__PURE__ */ jsx(TableCell, {
                className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsx(
                  TableActions,
                  {
                    gateway,
                    onEdit,
                    onDelete
                  }
                )
              })
              ]
            }, gateway.id))
          })
          ]
        })
      })
    })
  });
};
const firebaseGatewaySchema = z.object({
  name: z.string().min(1, "Gateway name is required"),
  credential: z.string().min(1, "Firebase configuration is required")
});
function FirebaseGatewayDialog({
  open,
  onOpenChange,
  gateway = null,
  mode = "create"
}) {
  const { loading: isSubmitting, submit } = useForm();
  const isEditing = mode === "edit" && gateway;
  const defaultValues = {
    name: gateway?.key || "",
    credential: gateway?.raw_value || ""
  };
  const form = useForm$1({
    resolver: zodResolver(firebaseGatewaySchema),
    defaultValues
  });
  React__default.useEffect(() => {
    if (open && gateway && mode === "edit") {
      form.reset({
        name: gateway.key || "",
        credential: gateway.raw_value || ""
      });
    } else if (open && mode === "create") {
      form.reset({
        name: "",
        credential: ""
      });
    }
  }, [open, gateway, mode, form]);
  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };
  const watchKey = form.watch("firebase_settings.key");
  const watchRawValue = form.watch("firebase_settings.raw_value");
  const isConfigured = watchKey && watchRawValue && watchKey.trim().length > 0 && watchRawValue.trim().length > 0;
  return /* @__PURE__ */ jsx(Dialog, {
    open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxs(DialogContent, {
      className: "w-full max-w-[95vw] sm:max-w-[700px] max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxs(DialogHeader, {
        children: [
      /* @__PURE__ */ jsx(DialogTitle, {
          className: "flex items-center gap-2 pr-8", children: isEditing ? /* @__PURE__ */ jsxs(Fragment, {
            children: [
        /* @__PURE__ */ jsx(Edit, { className: "w-5 h-5" }),
              "Update Firebase Gateway"
            ]
          }) : /* @__PURE__ */ jsxs(Fragment, {
            children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5" }),
              "Add Firebase Gateway"
            ]
          })
        }),
      /* @__PURE__ */ jsxs(DialogDescription, {
          className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { children: isEditing ? "Update your Firebase Cloud Messaging configuration for push notifications." : "Configure Firebase Cloud Messaging (FCM) to send push notifications to mobile devices." }),
            isConfigured && /* @__PURE__ */ jsx(Badge, { variant: "default", className: "flex-shrink-0 ml-4 text-xs", children: "Configured" })
          ]
        })
        ]
      }),
    /* @__PURE__ */ jsxs("div", {
        className: "space-y-6 max-h-[60vh] overflow-y-auto px-1", children: [
      /* @__PURE__ */ jsxs(Alert, {
          className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
        /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsxs(AlertDescription, {
            className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxs("div", {
              children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Firebase Cloud Messaging Integration" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm", children: "Send push notifications to iOS and Android devices through Google's Firebase platform." })
              ]
            }),
          /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "ml-4",
                onClick: () => window.open("https://console.firebase.google.com", "_blank"),
                type: "button",
                children: [
                /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 mr-1" }),
                  "Firebase Console"
                ]
              }
            )
            ]
          })
          ]
        }),
      /* @__PURE__ */ jsx(Form, {
          ...form, children: /* @__PURE__ */ jsxs("form", {
            onSubmit: form.handleSubmit((e) => handleSaveFirebaseGateway(e, submit, isEditing, gateway, handleClose)), className: "space-y-6", children: [
        /* @__PURE__ */ jsxs(Card, {
              children: [
          /* @__PURE__ */ jsx(CardHeader, {
                children: /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Key, { className: "w-5 h-5 text-green-500" }),
            /* @__PURE__ */ jsx(CardTitle, { children: "Gateway Configuration" })
                  ]
                })
              }),
          /* @__PURE__ */ jsx(CardContent, {
                className: "space-y-6", children: /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "name",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                      children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                        className: "flex items-center gap-2", children: [
                          "Gateway Name",
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                        ]
                      }),
                /* @__PURE__ */ jsx(FormControl, {
                        children: /* @__PURE__ */ jsx(
                          Input,
                          {
                            placeholder: "e.g., FIREBASE_MAIN, FCM_PRODUCTION",
                            ...field,
                            className: " text-sm"
                          }
                        )
                      }),
                /* @__PURE__ */ jsx(FormDescription, { children: "A unique identifier for this Firebase gateway configuration." }),
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
            /* @__PURE__ */ jsx(Smartphone, { className: "w-5 h-5 text-blue-500" }),
            /* @__PURE__ */ jsx(CardTitle, { children: "Firebase Configuration" })
                  ]
                })
              }),
          /* @__PURE__ */ jsxs(CardContent, {
                className: "space-y-6", children: [
            /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "credential",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                      children: [
                  /* @__PURE__ */ jsxs(FormLabel, {
                        className: "flex items-center gap-2", children: [
                          "Service Account JSON",
                    /* @__PURE__ */ jsx(Badge, { variant: "destructive", className: "text-xs", children: "Private" })
                        ]
                      }),
                  /* @__PURE__ */ jsx(FormControl, {
                        children: /* @__PURE__ */ jsx(
                          Textarea,
                          {
                            placeholder: 'Paste your Firebase service account JSON here:\n{\n  "type": "service_account",\n  "project_id": "your-project-id",\n  "private_key_id": "...",\n  "private_key": "...",\n  "client_email": "...",\n  ...\n}',
                            className: "min-h-[120px]  text-sm",
                            ...field
                          }
                        )
                      }),
                  /* @__PURE__ */ jsx(FormDescription, { children: "Paste your complete Firebase service account JSON configuration. This will be used to authenticate with Firebase Cloud Messaging. Keep this private!" }),
                  /* @__PURE__ */ jsx(FormMessage, {})
                      ]
                    })
                  }
                ),
                  watchKey && watchRawValue && /* @__PURE__ */ jsxs(Alert, {
                    className: isConfigured ? "border-green-200 bg-green-50 dark:bg-green-950" : "border-orange-200 bg-orange-50 dark:bg-orange-950", children: [
                      isConfigured ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx(AlertDescription, {
                        children: isConfigured ? /* @__PURE__ */ jsxs("span", {
                          children: [
                /* @__PURE__ */ jsx("strong", { children: "Configuration Complete:" }),
                            " Your Firebase gateway is properly configured and ready to send push notifications."
                          ]
                        }) : /* @__PURE__ */ jsxs("span", {
                          children: [
                /* @__PURE__ */ jsx("strong", { children: "Configuration Required:" }),
                            " Please provide both gateway key and Firebase configuration to complete setup."
                          ]
                        })
                      })
                    ]
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
            /* @__PURE__ */ jsx(Info, { className: "w-5 h-5 text-blue-500" }),
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Firebase Setup Guide" })
                    ]
                  }),
          /* @__PURE__ */ jsxs("div", {
                    className: "space-y-3 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxs("div", {
                      className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-6 h-6 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full", children: "1" }),
              /* @__PURE__ */ jsxs("p", {
                        children: [
                          "Go to ",
                /* @__PURE__ */ jsx("strong", { children: "Firebase Console" }),
                          " → Select your project → Project Settings"
                        ]
                      })
                      ]
                    }),
            /* @__PURE__ */ jsxs("div", {
                      className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-6 h-6 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full", children: "2" }),
              /* @__PURE__ */ jsxs("p", {
                        children: [
                          "Navigate to ",
                /* @__PURE__ */ jsx("strong", { children: "Service Accounts" }),
                          ' tab → Click "Generate new private key"'
                        ]
                      })
                      ]
                    }),
            /* @__PURE__ */ jsxs("div", {
                      className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-6 h-6 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full", children: "3" }),
              /* @__PURE__ */ jsx("p", { children: "Download the JSON file and paste its complete contents in the configuration field above" })
                      ]
                    })
                    ]
                  }),
          /* @__PURE__ */ jsx("div", {
                    className: "flex justify-center pt-2", children: /* @__PURE__ */ jsxs(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        onClick: () => window.open("https://firebase.google.com/docs/cloud-messaging/admin/", "_blank"),
                        type: "button",
                        children: [
                /* @__PURE__ */ jsx(ExternalLink, { className: "w-4 h-4 mr-2" }),
                          "View Documentation"
                        ]
                      }
                    )
                  })
                  ]
                })
              })
            })
            ]
          })
        })
        ]
      }),
    /* @__PURE__ */ jsxs("div", {
        className: "sticky bottom-0 flex flex-col justify-end gap-3 pt-6 bg-white border-t sm:flex-row dark:bg-gray-950", children: [
      /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: handleClose,
            disabled: isSubmitting,
            className: "w-full sm:w-auto",
            children: "Cancel"
          }
        ),
      /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            disabled: isSubmitting,
            className: "w-full sm:w-auto",
            onClick: () => form.handleSubmit((e) => handleSaveFirebaseGateway(e, submit, isEditing, gateway, handleClose))(),
            children: /* @__PURE__ */ jsx(
              ButtonLoader,
              {
                isSubmitting,
                btnText: isEditing ? "Update Gateway" : "Create Gateway",
                loaderText: isEditing ? "Updating..." : "Creating..."
              }
            )
          }
        )
        ]
      })
      ]
    })
  });
}
const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Firebase Gateways", href: null }
];
function Index({
  title,
  gateways
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [filteredGateways, setFilteredGateways] = useState(gateways?.data || []);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState(null);
  useEffect(() => {
    setFirebaseGatewayFilterData(gateways, searchTerm, activeFilters, setFilteredGateways);
  }, [searchTerm, activeFilters, gateways]);
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };
  const handleAddGateway = () => {
    setSelectedGateway(null);
    setShowAddDialog(true);
  };
  const handleEditGateway = (gateway) => {
    setSelectedGateway(gateway);
    setShowEditDialog(true);
  };
  const handleDeleteGateway = (gateway) => {
    setSelectedGateway(gateway);
    setShowDeleteDialog(true);
  };
  const deleteDialogConfig = getDeleteDialogConfig(gateways, selectedGateway);
  const stats = { total: (gateways?.data || []).length };
  return /* @__PURE__ */ jsx(BaseLayout, {
    children: /* @__PURE__ */ jsxs(AuthenticatedLayout, {
      children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(Main, {
        className: "space-y-8", children: [
      /* @__PURE__ */ jsx(
          LayoutHeader,
          {
            variant: "index",
            breadcrumbItems,
            title: "Firebase Gateways",
            description: "Manage and configure your Firebase push notification gateways",
            icon: Smartphone,
            stats,
            primaryAction: { label: "Add Firebase Gateway", icon: Plus, onClick: handleAddGateway, variant: "default" }
          }
        ),
      /* @__PURE__ */ jsx(
          SimpleSearchBox,
          {
            searchTerm,
            onSearchChange: handleSearch,
            placeholder: "Search gateways by name ..."
          }
        ),
      /* @__PURE__ */ jsx("div", {
          className: "space-y-6", children: /* @__PURE__ */ jsx(
            FirebaseGatewaysTable,
            {
              gateways: filteredGateways,
              onEdit: handleEditGateway,
              onDelete: handleDeleteGateway
            }
          )
        }),
      /* @__PURE__ */ jsx(
          FirebaseGatewayDialog,
          {
            open: showAddDialog || showEditDialog,
            onOpenChange: showAddDialog ? setShowAddDialog : setShowEditDialog,
            mode: showAddDialog ? "create" : "edit",
            gateway: selectedGateway
          }
        ),
      /* @__PURE__ */ jsx(
          DeleteDialog,
          {
            open: showDeleteDialog,
            onOpenChange: setShowDeleteDialog,
            item: selectedGateway,
            config: deleteDialogConfig,
            onDelete: handleDeleteFirebaseGateway
          }
        )
        ]
      })
      ]
    })
  });
}
export {
  Index as default
};


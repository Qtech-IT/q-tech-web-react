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
import { Edit, Mail, MoreHorizontal, Search, Star, X } from "lucide-react";
import "motion/react";
import React__default, { useEffect, useState } from "react";
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
import { B as Button } from "./Button-CFMlPXiE.js";
import { C as Card, a as CardContent } from "./Card-CQ2ij0--.js";
import "./EmptyData-DjqqIMwS.js";
import { E as EmptyTableState } from "./EmptyTableState-C7sYsPjb.js";
import { e as handleSetDefaultlGateway, f as setMailGatewayFilterData } from "./GatewayController-BzwTzlIx.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import "./Label-BxDBN09D.js";
import { L as LayoutHeader } from "./LayoutHeader-BuHBNf3-.js";
import { A as AuthenticatedLayout, B as BaseLayout, M as Main } from "./Main-BjCbeyG1.js";
import "./MarketGrid-DlkazA02.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
import "./PaginationWrapper-B-KWAp7V.js";
import "./Progress-DT6CA82_.js";
import { D as DropdownMenu, f as DropdownMenuContent, i as DropdownMenuItem, g as DropdownMenuLabel, h as DropdownMenuSeparator, e as DropdownMenuTrigger } from "./Sheet-B-_2BaZp.js";
import "./SlideUp-CpffxXZf.js";
import { T as Table, d as TableBody, e as TableCell, c as TableHead, a as TableHeader, b as TableRow } from "./Table-Dz-EvWd_.js";
import "./TradeDialog-Dt4WEyMP.js";
import "./constants-4k_q_jeE.js";
import "./demo-data-C5EGh9Nk.js";
const TableActions = ({ gateway }) => {
  const { submit } = useForm();
  if (gateway.key == "104PHP" && gateway.is_default) return;
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
        gateway.key != "104PHP" && /* @__PURE__ */ jsxs(
          DropdownMenuItem,
          {
            onClick: () => router.visit(`/admin/email-gateways/${gateway.id}/edit`),
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
            onClick: () => handleSetDefaultlGateway(gateway, submit),
            className: "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100",
            children: [
            /* @__PURE__ */ jsx(Star, { className: "w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-500" }),
              "Set as Default"
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
const MailGatewaysTable = ({ gateways = [] }) => {
  if (gateways.length === 0) {
    return /* @__PURE__ */ jsx(
      EmptyTableState,
      {
        icon: Mail,
        title: "No mail gateways found",
        description: "No mail gateway configurations found. Configure your first email provider to get started."
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
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Provider" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Status" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Configuration" }),
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
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: gateway?.credential?.name }),
          /* @__PURE__ */ jsx(DefaultBadge, { isDefault: gateway.is_default })
                    ]
                  }),
                    gateway.credential.from?.address && /* @__PURE__ */ jsxs("span", {
                      className: "text-xs text-gray-500 dark:text-gray-400", children: [
                        "From: ",
                        gateway?.credential?.from?.address
                      ]
                    })
                  ]
                })
              }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx(StatusBadge, { status: gateway.status }) }),
      /* @__PURE__ */ jsx(TableCell, {
                className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", {
                  className: "space-y-1 text-xs text-gray-600 dark:text-gray-400", children: [
                    gateway.credential.host && /* @__PURE__ */ jsxs("div", {
                      children: [
                        "Host: ",
                        gateway.credential.host === "@@" ? "Not configured" : gateway.credential.host
                      ]
                    }),
                    gateway.credential.port && /* @__PURE__ */ jsxs("div", {
                      children: [
                        "Port: ",
                        gateway.credential.port === "@@" ? "Not set" : gateway.credential.port
                      ]
                    }),
                    gateway.credential.encryption && /* @__PURE__ */ jsxs("div", {
                      children: [
                        "Encryption: ",
                        gateway.credential.encryption === "@@" ? "Not set" : gateway.credential.encryption
                      ]
                    }),
                    gateway.credential.app_key && /* @__PURE__ */ jsxs("div", {
                      children: [
                        "API Key: ",
                        gateway.credential.app_key === "@@" ? "Not configured" : "Configured"
                      ]
                    })
                  ]
                })
              }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4 text-sm text-gray-500 dark:text-gray-400", children: gateway.created_at }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsx(TableActions, { gateway }) })
              ]
            }, gateway.id))
          })
          ]
        })
      })
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
const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Mail Gateways", href: null }
];
function Index({
  title,
  gateways
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [filteredGateways, setFilteredGateways] = useState(gateways?.data || []);
  useEffect(() => {
    setMailGatewayFilterData(gateways, searchTerm, activeFilters, setFilteredGateways);
  }, [searchTerm, activeFilters, gateways]);
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };
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
            title: "Mail Gateways",
            description: "Manage and configure your email gateway providers with ease",
            icon: Mail,
            stats
          }
        ),
      /* @__PURE__ */ jsx(
          SimpleSearchBox,
          {
            searchTerm,
            onSearchChange: handleSearch,
            placeholder: "Search gateways by name or key..."
          }
        ),
      /* @__PURE__ */ jsx("div", {
          className: "space-y-6", children: /* @__PURE__ */ jsx(
            MailGatewaysTable,
            {
              gateways: filteredGateways
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
  Index as default
};


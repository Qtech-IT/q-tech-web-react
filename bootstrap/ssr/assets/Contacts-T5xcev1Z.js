import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React__default, { useState, useEffect } from "react";
import { router, Head } from "@inertiajs/react";
import { B as BaseLayout, A as AuthenticatedLayout, M as Main } from "./Main-BjCbeyG1.js";
import { Mail, Clock, CheckCircle, MessageSquare, Search, Filter, X, User, Building, Phone, Trash2, MoreHorizontal, Send } from "lucide-react";
import { B as Button, k as keyToValue, l as limitText, c as convertFiltersToArrayFormat } from "./Button-CFMlPXiE.js";
import { C as CommonLayoutHeader } from "./CommonLayoutHeader-CyKOpByu.js";
import { P as Pagination } from "./Pagination-CFo-75Wy.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { C as Card, a as CardContent } from "./Card-CQ2ij0--.js";
import { D as DeleteDialog } from "./DeleteDialog-DBDDlwO7.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import { C as Command, a as CommandInput, b as CommandList, c as CommandGroup, d as CommandItem, D as DropdownMenu, e as DropdownMenuTrigger, f as DropdownMenuContent, g as DropdownMenuLabel, h as DropdownMenuSeparator, i as DropdownMenuItem, m as Dialog, n as DialogContent, o as DialogHeader, p as DialogTitle, q as DialogDescription, r as DialogFooter } from "./Sheet-B-_2BaZp.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./Popover-Ckus2dfK.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./Table-Dz-EvWd_.js";
import { C as Checkbox } from "./Checkbox-CsK9i2JK.js";
import { E as EmptyTableState } from "./EmptyTableState-C7sYsPjb.js";
import { B as BulkActionsCard, a as BulkActionDialog } from "./BulkActionsCard-D0COHX8t.js";
import { T as Textarea } from "./constants-4k_q_jeE.js";
import { L as Label } from "./Label-BxDBN09D.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { A as Alert, a as AlertDescription } from "./Alert-3s5DZB4H.js";
import "@radix-ui/react-icons";
import "react-icons/fa";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-alert-dialog";
import "./AuthController-DaCguZ7K.js";
import "./TradeDialog-Dt4WEyMP.js";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-tabs";
import "framer-motion";
import "./SlideUp-CpffxXZf.js";
import "react-hot-toast";
import "@radix-ui/react-radio-group";
import "clsx";
import "tailwind-merge";
import "./Breadcrumb-D0MBns-9.js";
import "@radix-ui/react-direction";
import "@radix-ui/react-avatar";
import "@radix-ui/react-separator";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "@radix-ui/react-dialog";
import "@radix-ui/react-scroll-area";
import "@radix-ui/react-popover";
import "@radix-ui/react-checkbox";
import "./MarketGrid-DlkazA02.js";
import "@radix-ui/react-select";
import "./Progress-DT6CA82_.js";
import "@radix-ui/react-progress";
import "react-icons/bs";
import "./EmptyData-DjqqIMwS.js";
import "./BlogSection-DiGfvTON.js";
import "./BlogCard-Jrl9AHYg.js";
import "@radix-ui/react-switch";
import "@radix-ui/react-accordion";
import "motion/react";
import "./PaginationWrapper-B-KWAp7V.js";
import "./demo-data-C5EGh9Nk.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
import "@radix-ui/react-label";
const getContactStats = (contacts) => {
  const data = contacts || [];
  const now = /* @__PURE__ */ new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    total: data.length,
    pending: data.filter((contact) => contact.status === "pending").length,
    replied: data.filter((contact) => contact.status === "replied").length,
    thisMonth: data.filter((contact) => {
      const contactDate = new Date(contact.created_at);
      return contactDate >= startOfMonth;
    }).length
  };
};
const contactFilterOptions = () => {
  return {
    status: [
      { value: "pending", label: "Pending" },
      { value: "replied", label: "Replied" }
    ]
  };
};
const onContactSearch = (searchValue, setSearchTerm) => {
  setSearchTerm(searchValue);
  const params = new URLSearchParams(window.location.search);
  if (searchValue && searchValue.trim()) {
    params.set("search", searchValue);
  } else {
    params.delete("search");
  }
  params.delete("page");
  router.visit(`${window.location.pathname}?${params.toString()}`, {
    preserveState: true,
    preserveScroll: true,
    replace: true,
    only: ["contacts", "search", "filters"]
  });
};
const onContactFilterChange = (newFilters, filterOptions, setActiveFilters, setSearchTerm) => {
  setActiveFilters(newFilters);
  const params = new URLSearchParams(window.location.search);
  const isReset = Object.keys(newFilters).length === 0;
  if (isReset) {
    setSearchTerm("");
    params.delete("search");
  }
  Object.keys(filterOptions).forEach((key) => {
    params.delete(key);
  });
  Object.entries(newFilters).forEach(([key, values]) => {
    if (values && Array.isArray(values) && values.length > 0) {
      params.set(key, values.join(","));
    }
  });
  params.delete("page");
  router.visit(`${window.location.pathname}?${params.toString()}`, {
    preserveState: true,
    preserveScroll: true,
    replace: true,
    only: ["contacts", "search", "filters"]
  });
};
const getContactsBreadcrumbItems = () => {
  return [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Communication", href: null },
    { label: "Contacts", href: null }
  ];
};
const onContactDelete = async (id, submit, handleClose) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.communication.contact.destroy", id) + "?_method=DELETE"
    });
    handleClose();
  } catch (error) {
    console.error("Contact delete error:", error);
  }
};
const onContactBulkAction = async (selectedIds, action, submit) => {
  if (selectedIds.length === 0) {
    return;
  }
  try {
    await submit({
      method: "POST",
      url: route("admin.communication.contact.bulk.action"),
      data: { ids: selectedIds, type: action }
    });
  } catch (error) {
    console.error("Bulk action error:", error);
  }
};
const getContactDeleteDialogConfig = (contact) => {
  return {
    title: `Delete Contact`,
    description: `Are you sure you want to delete this contact message? This action cannot be undone.`,
    itemName: contact?.full_name,
    itemType: "Contact",
    warningMessage: `Deleting this contact will permanently remove the message from the system.`,
    showWarningAlert: true,
    showItemDetails: true,
    itemDisplayFields: [
      {
        label: `Name`,
        key: "full_name",
        className: "font-semibold text-gray-900 dark:text-gray-100"
      },
      {
        label: "Email",
        key: "email",
        className: "text-gray-600 dark:text-gray-400"
      },
      {
        label: "Phone",
        key: "phone_number",
        render: (phone) => phone || "N/A",
        className: "text-gray-600 dark:text-gray-400"
      },
      {
        label: "Company",
        key: "company",
        render: (company) => company || "N/A",
        className: "text-gray-600 dark:text-gray-400"
      },
      {
        label: "Status",
        key: "status",
        render: (status) => React__default.createElement(
          "span",
          {
            className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${status === "replied" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}`
          },
          status
        )
      },
      {
        label: "Received",
        key: "created_at",
        className: "text-gray-600 dark:text-gray-400"
      }
    ]
  };
};
function OverviewCard({ stats }) {
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-4", children: [
    /* @__PURE__ */ jsx(Card, { className: "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800", children: /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg dark:bg-blue-900", children: /* @__PURE__ */ jsx(Mail, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-blue-700 dark:text-blue-300", children: "Total Contacts" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-blue-900 dark:text-blue-100", children: stats.total })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Card, { className: "border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800", children: /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg dark:bg-yellow-900", children: /* @__PURE__ */ jsx(Clock, { className: "w-6 h-6 text-yellow-600 dark:text-yellow-400" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-yellow-700 dark:text-yellow-300", children: "Pending" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-yellow-900 dark:text-yellow-100", children: stats.pending })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Card, { className: "border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800", children: /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg dark:bg-green-900", children: /* @__PURE__ */ jsx(CheckCircle, { className: "w-6 h-6 text-green-600 dark:text-green-400" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-green-700 dark:text-green-300", children: "Replied" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-green-900 dark:text-green-100", children: stats.replied })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Card, { className: "border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800", children: /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg dark:bg-purple-900", children: /* @__PURE__ */ jsx(MessageSquare, { className: "w-6 h-6 text-purple-600 dark:text-purple-400" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-purple-700 dark:text-purple-300", children: "This Month" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-purple-900 dark:text-purple-100", children: stats.thisMonth })
      ] })
    ] }) }) })
  ] });
}
const SearchBox = ({
  searchTerm = "",
  onSearchChange,
  filters = {},
  onFilterChange,
  placeholder = "Search...",
  filterOptions = {}
}) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const handleSearchChange = (value) => {
    setLocalSearch(value);
    onSearchChange(value);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };
  const toggleFilter = (filterType, value) => {
    const current = filters[filterType] || [];
    let updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onFilterChange({ ...filters, [filterType]: updated });
  };
  const clearFilter = (filterType, value) => {
    const updated = { ...filters };
    updated[filterType] = updated[filterType].filter((v) => v !== value);
    if (!updated[filterType].length) delete updated[filterType];
    onFilterChange(updated);
  };
  const clearAllFilters = () => {
    setLocalSearch("");
    if (onSearchChange) onSearchChange("");
    if (onFilterChange) onFilterChange({});
  };
  const activeFilterCount = Object.values(filters).reduce(
    (acc, val) => acc + val.length,
    0
  );
  React__default.useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);
  return /* @__PURE__ */ jsxs("div", { className: "w-full p-4 space-y-4 border rounded-lg bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 p-2 rounded-lg bg-primary/10", children: /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-primary" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold", children: "Search & Filter" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Find contacts quickly" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        activeFilterCount > 0 && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
          activeFilterCount,
          " filter",
          activeFilterCount !== 1 ? "s" : ""
        ] }),
        Object.keys(filterOptions).length > 0 && /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "sm:hidden",
            onClick: () => setShowMobileFilters(!showMobileFilters),
            children: [
              /* @__PURE__ */ jsx(Filter, { className: "w-4 h-4 mr-2" }),
              "Filters"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("form", { onSubmit: handleSearchSubmit, className: "w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1 max-w-md", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute w-4 h-4 text-muted-foreground left-3 top-3" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            name: "search",
            placeholder,
            value: localSearch,
            onChange: (e) => handleSearchChange(e.target.value),
            className: "w-full h-10 pl-9 pr-9"
          }
        ),
        localSearch && /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "icon",
            className: "absolute w-6 h-6 right-2 top-2",
            onClick: () => handleSearchChange(""),
            children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
          }
        )
      ] }),
      Object.keys(filterOptions).length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 sm:flex-nowrap", children: [
        Object.entries(filterOptions).map(([filterType, options]) => /* @__PURE__ */ jsxs(Popover, { children: [
          /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "h-10 px-3 text-sm justify-between min-w-[120px] max-w-[160px] hidden sm:flex",
              children: [
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 truncate", children: [
                  /* @__PURE__ */ jsx(Filter, { className: "w-3 h-3" }),
                  keyToValue(filterType)
                ] }),
                filters[filterType]?.length > 0 && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "h-4 px-1.5 ml-1 text-xs", children: filters[filterType].length })
              ]
            }
          ) }),
          /* @__PURE__ */ jsx(PopoverContent, { className: "w-64 p-0", children: /* @__PURE__ */ jsxs(Command, { children: [
            /* @__PURE__ */ jsx(CommandInput, { placeholder: `Search ${keyToValue(filterType)}...` }),
            /* @__PURE__ */ jsx(CommandList, { children: /* @__PURE__ */ jsx(CommandGroup, { children: options.map((option) => {
              const active = filters[filterType]?.includes(option.value);
              return /* @__PURE__ */ jsxs(
                CommandItem,
                {
                  onSelect: () => toggleFilter(filterType, option.value),
                  className: "flex justify-between cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "flex-1 pr-2 truncate", children: option.label }),
                    active && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-2 h-2 rounded-full bg-primary" })
                  ]
                },
                option.value
              );
            }) }) })
          ] }) })
        ] }, filterType)),
        (activeFilterCount > 0 || localSearch) && /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "sm",
            onClick: clearAllFilters,
            className: "hidden h-10 px-3 text-sm text-muted-foreground hover:text-destructive sm:flex",
            children: "Reset"
          }
        )
      ] })
    ] }) }),
    Object.keys(filterOptions).length > 0 && showMobileFilters && /* @__PURE__ */ jsxs("div", { className: "space-y-3 sm:hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-muted-foreground", children: "Filter Options" }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-2", children: Object.entries(filterOptions).map(([filterType, options]) => /* @__PURE__ */ jsxs(Popover, { children: [
        /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "justify-between w-full text-sm h-9",
            children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 truncate", children: [
                /* @__PURE__ */ jsx(Filter, { className: "w-3 h-3" }),
                keyToValue(filterType)
              ] }),
              filters[filterType]?.length > 0 && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "h-4 px-1.5 ml-1 text-xs", children: filters[filterType].length })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(PopoverContent, { className: "w-[300px] p-0 max-w-[calc(100vw-2rem)]", children: /* @__PURE__ */ jsxs(Command, { children: [
          /* @__PURE__ */ jsx(CommandInput, { placeholder: `Search ${keyToValue(filterType)}...` }),
          /* @__PURE__ */ jsx(CommandList, { children: /* @__PURE__ */ jsx(CommandGroup, { children: options.map((option) => {
            const active = filters[filterType]?.includes(option.value);
            return /* @__PURE__ */ jsxs(
              CommandItem,
              {
                onSelect: () => toggleFilter(filterType, option.value),
                className: "flex justify-between cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "flex-1 pr-2 truncate", children: option.label }),
                  active && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-2 h-2 rounded-full bg-primary" })
                ]
              },
              option.value
            );
          }) }) })
        ] }) })
      ] }, filterType)) }),
      (activeFilterCount > 0 || localSearch) && /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          onClick: clearAllFilters,
          className: "w-full text-sm h-9 text-muted-foreground hover:text-destructive",
          children: "Reset All Filters"
        }
      )
    ] }),
    activeFilterCount > 0 && /* @__PURE__ */ jsxs("div", { className: "pt-3 space-y-2 border-t", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Active filters:" }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: Object.entries(filters).flatMap(
        ([key, values]) => values.map((value) => {
          const option = filterOptions[key]?.find((opt) => opt.value === value);
          return /* @__PURE__ */ jsxs(
            Badge,
            {
              variant: "secondary",
              className: "flex items-center gap-1.5 text-xs max-w-[200px] h-6 pl-2 pr-1",
              children: [
                /* @__PURE__ */ jsxs("span", { className: "truncate", children: [
                  /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                    keyToValue(key),
                    ":"
                  ] }),
                  " ",
                  option?.label || value
                ] }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "w-4 h-4 rounded-sm hover:bg-destructive/20",
                    onClick: () => clearFilter(key, value),
                    children: /* @__PURE__ */ jsx(X, { className: "w-2.5 h-2.5" })
                  }
                )
              ]
            },
            `${key}-${value}`
          );
        })
      ) })
    ] })
  ] });
};
const TableActions = ({ item, onDelete, onSendEmail }) => {
  const [showMessage, setShowMessage] = useState(false);
  const handleDelete = () => {
    onDelete(item.id);
  };
  const handleSendEmail = () => {
    onSendEmail(item);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(DropdownMenu, { children: [
      /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", className: "p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800", children: [
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open menu" }),
        /* @__PURE__ */ jsx(MoreHorizontal, { className: "w-4 h-4 text-gray-600 dark:text-gray-400" })
      ] }) }),
      /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-48 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-900 dark:border-gray-700", children: [
        /* @__PURE__ */ jsx(DropdownMenuLabel, { className: "text-sm font-semibold text-gray-700 dark:text-gray-300", children: "Actions" }),
        /* @__PURE__ */ jsx(DropdownMenuSeparator, { className: "dark:bg-gray-700" }),
        /* @__PURE__ */ jsxs(
          DropdownMenuItem,
          {
            onClick: () => setShowMessage(true),
            className: "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100",
            children: [
              /* @__PURE__ */ jsx(MessageSquare, { className: "w-4 h-4 mr-2 text-blue-600 dark:text-blue-500" }),
              "View Message"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          DropdownMenuItem,
          {
            onClick: handleSendEmail,
            className: "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100",
            children: [
              /* @__PURE__ */ jsx(Send, { className: "w-4 h-4 mr-2 text-green-600 dark:text-green-500" }),
              "Send Reply"
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
              "Delete Contact"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: showMessage, onOpenChange: setShowMessage, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Contact Message" }),
        /* @__PURE__ */ jsxs(DialogDescription, { children: [
          "From: ",
          item.full_name,
          " (",
          item.email,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-4 mt-4 rounded-lg bg-gray-50 dark:bg-gray-800", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700 whitespace-pre-wrap dark:text-gray-300", children: limitText(item.message) }) })
    ] }) })
  ] });
};
const StatusBadge = ({ status }) => {
  const variants = {
    pending: {
      icon: Clock,
      className: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700"
    },
    replied: {
      icon: CheckCircle,
      className: "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700"
    }
  };
  const config = variants[status] || variants.pending;
  const Icon = config.icon;
  return /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: `text-xs ${config.className}`, children: [
    /* @__PURE__ */ jsx(Icon, { className: "w-3 h-3 mr-1" }),
    status.charAt(0).toUpperCase() + status.slice(1)
  ] });
};
const ContactTable = ({
  contacts = [],
  onDelete,
  onSendEmail,
  handleBulkAction,
  bulkAction,
  setBulkAction,
  bulkActionLoader = false
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(contacts.map((c) => c.id));
    } else {
      setSelectedItems([]);
    }
  };
  const handleSelectItem = (id, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((i) => i !== id));
    }
  };
  useEffect(() => {
    setSelectedItems([]);
    setBulkAction("");
  }, [contacts, setBulkAction]);
  const handleBulkActionApply = (selectedIds, action) => {
    handleBulkAction(selectedIds, action);
    clearSelection();
    setShowBulkDialog(false);
  };
  const clearSelection = () => {
    setSelectedItems([]);
  };
  const bulkActionConfig = {
    title: "Bulk Contact Actions",
    description: `Apply an action to ${selectedItems.length} selected contacts.`,
    actions: [
      {
        value: "delete",
        label: "Delete Selected",
        icon: Trash2,
        description: "Permanently remove selected contacts"
      }
    ],
    warningMessage: `This action will affect ${selectedItems.length} contacts. This action cannot be undone.`,
    showWarningAlert: true
  };
  if (contacts.length === 0) {
    return /* @__PURE__ */ jsx(
      EmptyTableState,
      {
        icon: Mail,
        title: "No contacts found",
        description: "No contact messages available."
      }
    );
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      BulkActionsCard,
      {
        selectedItems,
        isSubcategoryView: false,
        entityName: "contact",
        onOpenBulkDialog: () => setShowBulkDialog(true),
        onClearSelection: clearSelection
      }
    ),
    /* @__PURE__ */ jsx(Card, { className: "bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-900", children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [
      /* @__PURE__ */ jsx(TableHeader, { className: "bg-gray-50 dark:bg-gray-800", children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { className: "w-12 px-6 py-3", children: /* @__PURE__ */ jsx(
          Checkbox,
          {
            checked: selectedItems.length === contacts.length && contacts.length > 0,
            onCheckedChange: handleSelectAll,
            className: "border-gray-300 dark:border-gray-600"
          }
        ) }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Contact" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Details" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Message" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Status" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Date" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-300", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { className: "bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700", children: contacts?.map((item) => {
        return /* @__PURE__ */ jsxs(TableRow, { className: "transition-colors hover:bg-gray-50 dark:hover:bg-gray-800", children: [
          /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx(
            Checkbox,
            {
              checked: selectedItems.includes(item.id),
              onCheckedChange: (checked) => handleSelectItem(item.id, checked),
              className: "border-gray-300 dark:border-gray-600"
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600", children: /* @__PURE__ */ jsx(User, { className: "w-5 h-5 text-white" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: item.full_name }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400", children: [
                /* @__PURE__ */ jsx(Mail, { className: "w-3 h-3" }),
                item.email
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            item.company && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400", children: [
              /* @__PURE__ */ jsx(Building, { className: "w-3 h-3" }),
              item.company
            ] }),
            item.phone_number && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400", children: [
              /* @__PURE__ */ jsx(Phone, { className: "w-3 h-3" }),
              item.phone_number
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx("div", { className: "max-w-xs text-sm text-gray-600 truncate dark:text-gray-400", children: limitText(item.message, 15) }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx(StatusBadge, { status: item.status }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: item.created_at }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsx(TableActions, { item, onDelete, onSendEmail }) })
        ] }, item.id);
      }) })
    ] }) }) }) }),
    /* @__PURE__ */ jsx(
      BulkActionDialog,
      {
        open: showBulkDialog,
        onOpenChange: setShowBulkDialog,
        selectedItems,
        config: bulkActionConfig,
        onApply: handleBulkActionApply,
        loading: bulkActionLoader
      }
    )
  ] });
};
function SendEmailDialog({ open, onOpenChange, contact }) {
  const [message, setMessage] = useState("");
  const { loading: isSubmitting, errors: serverErrors, submit } = useForm();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      return;
    }
    try {
      await submit({
        method: "POST",
        url: route("admin.communication.send.mail"),
        data: {
          id: contact?.id,
          message
        }
      });
      setMessage("");
      onOpenChange(false);
    } catch (error) {
      console.error("Send email error:", error);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5" }),
        "Send Reply to Contact"
      ] }),
      /* @__PURE__ */ jsxs(DialogDescription, { children: [
        "Send a reply email to ",
        contact?.full_name,
        " (",
        contact?.email,
        ")"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      contact?.message && /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded-lg bg-gray-50 dark:bg-gray-800", children: [
        /* @__PURE__ */ jsx(Label, { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Original Message:" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-600 whitespace-pre-wrap dark:text-gray-400", children: contact.message })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "message", children: [
          "Your Reply ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            id: "message",
            placeholder: "Type your reply message here...",
            value: message,
            onChange: (e) => setMessage(e.target.value),
            rows: 8,
            required: true
          }
        ),
        serverErrors?.message && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.message })
      ] }),
      /* @__PURE__ */ jsx(Alert, { className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: /* @__PURE__ */ jsxs(AlertDescription, { className: "text-sm", children: [
        "This email will be sent to ",
        /* @__PURE__ */ jsx("strong", { children: contact?.email })
      ] }) }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => onOpenChange(false),
            disabled: isSubmitting,
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isSubmitting || !message.trim(), children: /* @__PURE__ */ jsx(
          ButtonLoader,
          {
            isSubmitting,
            btnText: "Send Reply",
            loaderText: "Sending...",
            icon: /* @__PURE__ */ jsx(Send, { className: "w-4 h-4" })
          }
        ) })
      ] })
    ] })
  ] }) });
}
function Contacts({
  title,
  contacts = [],
  search = "",
  filters = {}
}) {
  const { meta, links } = contacts;
  const { loading: bulkActionLoader, submit } = useForm();
  contacts = contacts?.data?.data || [];
  const [searchTerm, setSearchTerm] = useState(search);
  const [activeFilters, setActiveFilters] = useState(convertFiltersToArrayFormat(filters));
  const [selectedItems, setSelectedItems] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingContact, setDeletingContact] = useState(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const currentData = contacts;
  useEffect(() => {
    setSearchTerm(search);
    setActiveFilters(convertFiltersToArrayFormat(filters));
  }, [search, filters]);
  const filterOptions = contactFilterOptions();
  const breadcrumbItems = getContactsBreadcrumbItems();
  const stats = getContactStats(currentData);
  const handleSearch = (searchValue) => {
    onContactSearch(searchValue, setSearchTerm);
  };
  const handleFilterChange = (newFilters) => {
    onContactFilterChange(newFilters, filterOptions, setActiveFilters, setSearchTerm);
  };
  const handleDeleteContact = (id) => {
    const contactToDelete = currentData?.find((contact) => contact.id === id);
    if (contactToDelete) {
      setDeletingContact(contactToDelete);
      setShowDeleteDialog(true);
    }
  };
  const handleBulkAction = (selectedIds, action) => {
    if (action && selectedIds.length > 0) {
      onContactBulkAction(selectedIds, action, submit);
      setSelectedItems([]);
      setBulkAction("");
    }
  };
  const handleSendEmail = (contact) => {
    setSelectedContact(contact);
    setShowEmailDialog(true);
  };
  const deleteDialogConfig = getContactDeleteDialogConfig(deletingContact);
  return /* @__PURE__ */ jsx(BaseLayout, { children: /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(Main, { className: "space-y-8", children: [
      /* @__PURE__ */ jsx(
        CommonLayoutHeader,
        {
          variant: "index",
          breadcrumbItems,
          title: "Contact Messages",
          description: "Manage contact form submissions and inquiries",
          icon: Mail,
          stats
        }
      ),
      /* @__PURE__ */ jsx(OverviewCard, { stats }),
      /* @__PURE__ */ jsx(
        SearchBox,
        {
          searchTerm: searchTerm || "",
          onSearchChange: handleSearch,
          filters: activeFilters,
          onFilterChange: handleFilterChange,
          placeholder: "Search by name, email or phone...",
          filterOptions
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsx(
        ContactTable,
        {
          contacts: currentData || [],
          selectedItems,
          setSelectedItems,
          bulkAction,
          setBulkAction,
          handleBulkAction,
          onDelete: handleDeleteContact,
          onSendEmail: handleSendEmail,
          bulkActionLoader
        }
      ) }),
      (links || meta) && /* @__PURE__ */ jsx(Pagination, { links, meta }),
      deleteDialogConfig && /* @__PURE__ */ jsx(
        DeleteDialog,
        {
          open: showDeleteDialog,
          onOpenChange: setShowDeleteDialog,
          item: deletingContact,
          config: deleteDialogConfig,
          onDelete: onContactDelete
        }
      ),
      /* @__PURE__ */ jsx(
        SendEmailDialog,
        {
          open: showEmailDialog,
          onOpenChange: setShowEmailDialog,
          contact: selectedContact
        }
      )
    ] })
  ] }) });
}
export {
  Contacts as default
};

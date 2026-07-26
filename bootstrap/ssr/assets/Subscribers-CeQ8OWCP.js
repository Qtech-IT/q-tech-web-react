import { Head, router } from "@inertiajs/react";
import "@radix-ui/react-accordion";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-avatar";
import "@radix-ui/react-checkbox";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-dialog";
import "@radix-ui/react-direction";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
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
import { AlertTriangle, Filter, Globe, Mail, MoreHorizontal, Search, Send, Trash2, Users, X } from "lucide-react";
import "motion/react";
import React__default, { useEffect, useState } from "react";
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
import { a as BulkActionDialog, B as BulkActionsCard } from "./BulkActionsCard-D0COHX8t.js";
import { B as Button, c as convertFiltersToArrayFormat, k as keyToValue } from "./Button-CFMlPXiE.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { C as Card, a as CardContent } from "./Card-CQ2ij0--.js";
import { C as Checkbox } from "./Checkbox-CsK9i2JK.js";
import { C as CommonLayoutHeader } from "./CommonLayoutHeader-CyKOpByu.js";
import { T as Textarea } from "./constants-4k_q_jeE.js";
import { D as DeleteDialog } from "./DeleteDialog-DBDDlwO7.js";
import "./demo-data-C5EGh9Nk.js";
import "./EmptyData-DjqqIMwS.js";
import { E as EmptyTableState } from "./EmptyTableState-C7sYsPjb.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import { L as Label } from "./Label-BxDBN09D.js";
import { A as AuthenticatedLayout, B as BaseLayout, M as Main } from "./Main-BjCbeyG1.js";
import "./MarketGrid-DlkazA02.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
import { P as Pagination } from "./Pagination-CFo-75Wy.js";
import "./PaginationWrapper-B-KWAp7V.js";
import { P as Popover, b as PopoverContent, a as PopoverTrigger } from "./Popover-Ckus2dfK.js";
import "./Progress-DT6CA82_.js";
import { C as Command, c as CommandGroup, a as CommandInput, d as CommandItem, b as CommandList, m as Dialog, n as DialogContent, q as DialogDescription, r as DialogFooter, o as DialogHeader, p as DialogTitle, D as DropdownMenu, f as DropdownMenuContent, i as DropdownMenuItem, g as DropdownMenuLabel, h as DropdownMenuSeparator, e as DropdownMenuTrigger } from "./Sheet-B-_2BaZp.js";
import "./SlideUp-CpffxXZf.js";
import { T as Table, d as TableBody, e as TableCell, c as TableHead, a as TableHeader, b as TableRow } from "./Table-Dz-EvWd_.js";
import "./TradeDialog-Dt4WEyMP.js";
const getSubscriberStats = (subscribers) => {
  const data = subscribers || [];
  const now = /* @__PURE__ */ new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return {
    total: data.length,
    thisWeek: data.filter((sub) => {
      const subDate = new Date(sub.created_at);
      return subDate >= startOfWeek;
    }).length,
    thisMonth: data.filter((sub) => {
      const subDate = new Date(sub.created_at);
      return subDate >= startOfMonth;
    }).length,
    today: data.filter((sub) => {
      const subDate = new Date(sub.created_at);
      return subDate >= startOfToday;
    }).length
  };
};
const subscriberFilterOptions = () => {
  return {};
};
const onSubscriberSearch = (searchValue, setSearchTerm) => {
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
    only: ["subscribers", "search", "filters"]
  });
};
const onSubscriberFilterChange = (newFilters, filterOptions, setActiveFilters, setSearchTerm) => {
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
    only: ["subscribers", "search", "filters"]
  });
};
const getSubscribersBreadcrumbItems = () => {
  return [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Communication", href: null },
    { label: "Subscribers", href: null }
  ];
};
const onSubscriberDelete = async (id, submit, handleClose) => {
  try {
    await submit({
      method: "GET",
      url: route("admin.communication.subscriber.destroy", id)
    });
    handleClose();
  } catch (error) {
    console.error("Subscriber delete error:", error);
  }
};
const onSubscriberBulkAction = async (selectedIds, action, submit) => {
  if (selectedIds.length === 0) {
    return;
  }
  try {
    await submit({
      method: "POST",
      url: route("admin.communication.subscriber.bulk.action"),
      data: { ids: selectedIds, type: action }
    });
  } catch (error) {
    console.error("Bulk action error:", error);
  }
};
const getSubscriberDeleteDialogConfig = (subscriber) => {
  return {
    title: `Delete Subscriber`,
    description: `Are you sure you want to delete this newsletter subscriber? This action cannot be undone.`,
    itemName: subscriber?.email,
    itemType: "Subscriber",
    warningMessage: `Deleting this subscriber will permanently remove them from your newsletter list.`,
    showWarningAlert: true,
    showItemDetails: true,
    itemDisplayFields: [
      {
        label: `Email`,
        key: "email",
        className: "font-semibold text-gray-900 dark:text-gray-100"
      },
      {
        label: "IP Address",
        key: "ip_address",
        render: (ip) => ip || "N/A",
        className: "text-gray-600 dark:text-gray-400"
      },
      {
        label: "Subscribed",
        key: "created_at",
        className: "text-gray-600 dark:text-gray-400"
      }
    ]
  };
};
function OverviewCard({ stats }) {
  return /* @__PURE__ */ jsxs("div", {
    className: "grid grid-cols-1 gap-6 md:grid-cols-4", children: [
    /* @__PURE__ */ jsx(Card, {
      className: "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800", children: /* @__PURE__ */ jsx(CardContent, {
        className: "p-6", children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg dark:bg-blue-900", children: /* @__PURE__ */ jsx(Users, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }) }),
      /* @__PURE__ */ jsxs("div", {
            children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-blue-700 dark:text-blue-300", children: "Total Subscribers" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-blue-900 dark:text-blue-100", children: stats.total })
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
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg dark:bg-green-900", children: /* @__PURE__ */ jsx(Mail, { className: "w-6 h-6 text-green-600 dark:text-green-400" }) }),
      /* @__PURE__ */ jsxs("div", {
            children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-green-700 dark:text-green-300", children: "This Week" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-green-900 dark:text-green-100", children: stats.thisWeek })
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
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg dark:bg-purple-900", children: /* @__PURE__ */ jsx(Mail, { className: "w-6 h-6 text-purple-600 dark:text-purple-400" }) }),
      /* @__PURE__ */ jsxs("div", {
            children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-purple-700 dark:text-purple-300", children: "This Month" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-purple-900 dark:text-purple-100", children: stats.thisMonth })
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
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg dark:bg-orange-900", children: /* @__PURE__ */ jsx(Mail, { className: "w-6 h-6 text-orange-600 dark:text-orange-400" }) }),
      /* @__PURE__ */ jsxs("div", {
            children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-orange-700 dark:text-orange-300", children: "Today" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-orange-900 dark:text-orange-100", children: stats.today })
            ]
          })
          ]
        })
      })
    })
    ]
  });
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
  return /* @__PURE__ */ jsxs("div", {
    className: "w-full p-4 space-y-4 border rounded-lg bg-background", children: [
    /* @__PURE__ */ jsxs("div", {
      className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 p-2 rounded-lg bg-primary/10", children: /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-primary" }) }),
        /* @__PURE__ */ jsxs("div", {
          children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold", children: "Search & Filter" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Find subscribers quickly" })
          ]
        })
        ]
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-2", children: [
          activeFilterCount > 0 && /* @__PURE__ */ jsxs(Badge, {
            variant: "secondary", className: "text-xs", children: [
              activeFilterCount,
              " filter",
              activeFilterCount !== 1 ? "s" : ""
            ]
          }),
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
        ]
      })
      ]
    }),
    /* @__PURE__ */ jsx("form", {
      onSubmit: handleSearchSubmit, className: "w-full", children: /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col gap-3 sm:flex-row sm:items-center", children: [
      /* @__PURE__ */ jsxs("div", {
          className: "relative flex-1 max-w-md", children: [
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
          ]
        }),
          Object.keys(filterOptions).length > 0 && /* @__PURE__ */ jsxs("div", {
            className: "flex flex-wrap gap-2 sm:flex-nowrap", children: [
              Object.entries(filterOptions).map(([filterType, options]) => /* @__PURE__ */ jsxs(Popover, {
                children: [
          /* @__PURE__ */ jsx(PopoverTrigger, {
                  asChild: true, children: /* @__PURE__ */ jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      className: "h-10 px-3 text-sm justify-between min-w-[120px] max-w-[160px] hidden sm:flex",
                      children: [
                /* @__PURE__ */ jsxs("span", {
                        className: "flex items-center gap-2 truncate", children: [
                  /* @__PURE__ */ jsx(Filter, { className: "w-3 h-3" }),
                          keyToValue(filterType)
                        ]
                      }),
                        filters[filterType]?.length > 0 && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "h-4 px-1.5 ml-1 text-xs", children: filters[filterType].length })
                      ]
                    }
                  )
                }),
          /* @__PURE__ */ jsx(PopoverContent, {
                  className: "w-64 p-0", children: /* @__PURE__ */ jsxs(Command, {
                    children: [
            /* @__PURE__ */ jsx(CommandInput, { placeholder: `Search ${keyToValue(filterType)}...` }),
            /* @__PURE__ */ jsx(CommandList, {
                      children: /* @__PURE__ */ jsx(CommandGroup, {
                        children: options.map((option) => {
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
                        })
                      })
                    })
                    ]
                  })
                })
                ]
              }, filterType)),
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
            ]
          })
        ]
      })
    }),
      Object.keys(filterOptions).length > 0 && showMobileFilters && /* @__PURE__ */ jsxs("div", {
        className: "space-y-3 sm:hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-muted-foreground", children: "Filter Options" }),
      /* @__PURE__ */ jsx("div", {
          className: "grid gap-2", children: Object.entries(filterOptions).map(([filterType, options]) => /* @__PURE__ */ jsxs(Popover, {
            children: [
        /* @__PURE__ */ jsx(PopoverTrigger, {
              asChild: true, children: /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "justify-between w-full text-sm h-9",
                  children: [
              /* @__PURE__ */ jsxs("span", {
                    className: "flex items-center gap-2 truncate", children: [
                /* @__PURE__ */ jsx(Filter, { className: "w-3 h-3" }),
                      keyToValue(filterType)
                    ]
                  }),
                    filters[filterType]?.length > 0 && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "h-4 px-1.5 ml-1 text-xs", children: filters[filterType].length })
                  ]
                }
              )
            }),
        /* @__PURE__ */ jsx(PopoverContent, {
              className: "w-[300px] p-0 max-w-[calc(100vw-2rem)]", children: /* @__PURE__ */ jsxs(Command, {
                children: [
          /* @__PURE__ */ jsx(CommandInput, { placeholder: `Search ${keyToValue(filterType)}...` }),
          /* @__PURE__ */ jsx(CommandList, {
                  children: /* @__PURE__ */ jsx(CommandGroup, {
                    children: options.map((option) => {
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
                    })
                  })
                })
                ]
              })
            })
            ]
          }, filterType))
        }),
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
        ]
      }),
      activeFilterCount > 0 && /* @__PURE__ */ jsxs("div", {
        className: "pt-3 space-y-2 border-t", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Active filters:" }),
      /* @__PURE__ */ jsx("div", {
          className: "flex flex-wrap gap-1.5", children: Object.entries(filters).flatMap(
            ([key, values]) => values.map((value) => {
              const option = filterOptions[key]?.find((opt) => opt.value === value);
              return /* @__PURE__ */ jsxs(
                Badge,
                {
                  variant: "secondary",
                  className: "flex items-center gap-1.5 text-xs max-w-[200px] h-6 pl-2 pr-1",
                  children: [
                /* @__PURE__ */ jsxs("span", {
                    className: "truncate", children: [
                  /* @__PURE__ */ jsxs("span", {
                      className: "font-medium", children: [
                        keyToValue(key),
                        ":"
                      ]
                    }),
                      " ",
                      option?.label || value
                    ]
                  }),
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
          )
        })
        ]
      })
    ]
  });
};
const TableActions = ({ item, onDelete }) => {
  const handleDelete = () => {
    onDelete(item.id);
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
          onClick: handleDelete,
          className: "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400",
          children: [
            /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4 mr-2" }),
            "Delete Subscriber"
          ]
        }
      )
      ]
    })
    ]
  });
};
const SubscriberTable = ({
  subscribers = [],
  onDelete,
  handleBulkAction,
  bulkAction,
  setBulkAction,
  bulkActionLoader = false
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(subscribers.map((s) => s.id));
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
  }, [subscribers, setBulkAction]);
  const handleBulkActionApply = (selectedIds, action) => {
    handleBulkAction(selectedIds, action);
    clearSelection();
    setShowBulkDialog(false);
  };
  const clearSelection = () => {
    setSelectedItems([]);
  };
  const bulkActionConfig = {
    title: "Bulk Subscriber Actions",
    description: `Apply an action to ${selectedItems.length} selected subscribers.`,
    actions: [
      {
        value: "delete",
        label: "Delete Selected",
        icon: Trash2,
        description: "Permanently remove selected subscribers"
      }
    ],
    warningMessage: `This action will affect ${selectedItems.length} subscribers. This action cannot be undone.`,
    showWarningAlert: true
  };
  if (subscribers.length === 0) {
    return /* @__PURE__ */ jsx(
      EmptyTableState,
      {
        icon: Mail,
        title: "No subscribers found",
        description: "No newsletter subscribers available."
      }
    );
  }
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
    /* @__PURE__ */ jsx(
      BulkActionsCard,
      {
        selectedItems,
        isSubcategoryView: false,
        entityName: "subscriber",
        onOpenBulkDialog: () => setShowBulkDialog(true),
        onClearSelection: clearSelection
      }
    ),
    /* @__PURE__ */ jsx(Card, {
      className: "bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-900", children: /* @__PURE__ */ jsx(CardContent, {
        className: "p-0", children: /* @__PURE__ */ jsx("div", {
          className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, {
            className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [
      /* @__PURE__ */ jsx(TableHeader, {
              className: "bg-gray-50 dark:bg-gray-800", children: /* @__PURE__ */ jsxs(TableRow, {
                children: [
        /* @__PURE__ */ jsx(TableHead, {
                  className: "w-12 px-6 py-3", children: /* @__PURE__ */ jsx(
                    Checkbox,
                    {
                      checked: selectedItems.length === subscribers.length && subscribers.length > 0,
                      onCheckedChange: handleSelectAll,
                      className: "border-gray-300 dark:border-gray-600"
                    }
                  )
                }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "ID" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Email" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "IP Address" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Subscribed On" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-300", children: "Actions" })
                ]
              })
            }),
      /* @__PURE__ */ jsx(TableBody, {
              className: "bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700", children: subscribers?.map((item, index) => {
                return /* @__PURE__ */ jsxs(TableRow, {
                  className: "transition-colors hover:bg-gray-50 dark:hover:bg-gray-800", children: [
          /* @__PURE__ */ jsx(TableCell, {
                    className: "px-6 py-4", children: /* @__PURE__ */ jsx(
                      Checkbox,
                      {
                        checked: selectedItems.includes(item.id),
                        onCheckedChange: (checked) => handleSelectItem(item.id, checked),
                        className: "border-gray-300 dark:border-gray-600"
                      }
                    )
                  }),
          /* @__PURE__ */ jsxs(TableCell, {
                    className: "px-6 py-4  text-gray-700 dark:text-gray-300", children: [
                      "#",
                      index + 1
                    ]
                  }),
          /* @__PURE__ */ jsx(TableCell, {
                    className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600", children: /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5 text-white" }) }),
            /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: item.email }) })
                      ]
                    })
                  }),
          /* @__PURE__ */ jsx(TableCell, {
                    className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400", children: [
            /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4" }),
                        item.ip_address || "N/A"
                      ]
                    })
                  }),
          /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: item.created_at }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsx(TableActions, { item, onDelete }) })
                  ]
                }, item.id);
              })
            })
            ]
          })
        })
      })
    }),
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
    ]
  });
};
function SendEmailAllDialog({ open, onOpenChange, totalSubscribers }) {
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
        url: route("admin.communication.send.mail.all"),
        data: {
          message
        }
      });
      setMessage("");
      onOpenChange(false);
    } catch (error) {
      console.error("Send email error:", error);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, {
    open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, {
      className: "max-w-2xl", children: [
    /* @__PURE__ */ jsxs(DialogHeader, {
        children: [
      /* @__PURE__ */ jsxs(DialogTitle, {
          className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5" }),
            "Send Email to All Subscribers"
          ]
        }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "Send a bulk email to all  newsletter subscribers" })
        ]
      }),
    /* @__PURE__ */ jsxs("form", {
        onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(Alert, {
          className: "border-orange-200 bg-orange-50 dark:bg-orange-950", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx(AlertDescription, {
            children: /* @__PURE__ */ jsxs("div", {
              children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Bulk Email Warning" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm", children: "This email will be sent to all all subscribers. This action cannot be undone." })
              ]
            })
          })
          ]
        }),
      /* @__PURE__ */ jsxs("div", {
          className: "space-y-2", children: [
        /* @__PURE__ */ jsxs(Label, {
            htmlFor: "message", children: [
              "Email Message ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ]
          }),
        /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "message",
              placeholder: "Type your message here...",
              value: message,
              onChange: (e) => setMessage(e.target.value),
              rows: 10,
              required: true
            }
          ),
            serverErrors?.message && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.message })
          ]
        }),
      /* @__PURE__ */ jsx(Alert, { className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: /* @__PURE__ */ jsx(AlertDescription, { className: "text-sm", children: "The email will be sent in batches of 20 to avoid overwhelming your mail server." }) }),
      /* @__PURE__ */ jsxs(DialogFooter, {
          children: [
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
        /* @__PURE__ */ jsx(Button, {
            type: "submit", disabled: isSubmitting || !message.trim(), children: /* @__PURE__ */ jsx(
              ButtonLoader,
              {
                isSubmitting,
                btnText: `Send to ${totalSubscribers} Subscribers`,
                loaderText: "Sending...",
                icon: /* @__PURE__ */ jsx(Send, { className: "w-4 h-4" })
              }
            )
          })
          ]
        })
        ]
      })
      ]
    })
  });
}
function Subscribers({
  title,
  subscribers = [],
  search = "",
  filters = {}
}) {
  const { meta, links } = subscribers;
  const { loading: bulkActionLoader, submit } = useForm();
  subscribers = subscribers?.data?.data || [];
  const [searchTerm, setSearchTerm] = useState(search);
  const [activeFilters, setActiveFilters] = useState(convertFiltersToArrayFormat(filters));
  const [selectedItems, setSelectedItems] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingSubscriber, setDeletingSubscriber] = useState(null);
  const [showEmailAllDialog, setShowEmailAllDialog] = useState(false);
  const currentData = subscribers;
  useEffect(() => {
    setSearchTerm(search);
    setActiveFilters(convertFiltersToArrayFormat(filters));
  }, [search, filters]);
  const filterOptions = subscriberFilterOptions();
  const breadcrumbItems = getSubscribersBreadcrumbItems();
  const stats = getSubscriberStats(currentData);
  const handleSearch = (searchValue) => {
    onSubscriberSearch(searchValue, setSearchTerm);
  };
  const handleFilterChange = (newFilters) => {
    onSubscriberFilterChange(newFilters, filterOptions, setActiveFilters, setSearchTerm);
  };
  const handleDeleteSubscriber = (id) => {
    const subscriberToDelete = currentData?.find((subscriber) => subscriber.id === id);
    if (subscriberToDelete) {
      setDeletingSubscriber(subscriberToDelete);
      setShowDeleteDialog(true);
    }
  };
  const handleBulkAction = (selectedIds, action) => {
    if (action && selectedIds.length > 0) {
      onSubscriberBulkAction(selectedIds, action, submit);
      setSelectedItems([]);
      setBulkAction("");
    }
  };
  const handleSendEmailAll = () => {
    setShowEmailAllDialog(true);
  };
  const deleteDialogConfig = getSubscriberDeleteDialogConfig(deletingSubscriber);
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
            title: "Newsletter Subscribers",
            description: "Manage newsletter subscriptions and send bulk emails",
            icon: Mail,
            stats,
            primaryAction: {
              label: "Send Email to All",
              icon: Send,
              onClick: handleSendEmailAll,
              variant: "default"
            }
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
            placeholder: "Search by email or IP address...",
            filterOptions
          }
        ),
      /* @__PURE__ */ jsx("div", {
          className: "space-y-6", children: /* @__PURE__ */ jsx(
            SubscriberTable,
            {
              subscribers: currentData || [],
              selectedItems,
              setSelectedItems,
              bulkAction,
              setBulkAction,
              handleBulkAction,
              onDelete: handleDeleteSubscriber,
              bulkActionLoader
            }
          )
        }),
          (links || meta) && /* @__PURE__ */ jsx(Pagination, { links, meta }),
          deleteDialogConfig && /* @__PURE__ */ jsx(
            DeleteDialog,
            {
              open: showDeleteDialog,
              onOpenChange: setShowDeleteDialog,
              item: deletingSubscriber,
              config: deleteDialogConfig,
              onDelete: onSubscriberDelete
            }
          ),
      /* @__PURE__ */ jsx(
            SendEmailAllDialog,
            {
              open: showEmailAllDialog,
              onOpenChange: setShowEmailAllDialog,
              totalSubscribers: currentData.length
            }
          )
        ]
      })
      ]
    })
  });
}
export {
  Subscribers as default
};


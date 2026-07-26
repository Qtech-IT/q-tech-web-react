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
import { AlertTriangle, ArrowRightLeft, CheckCircle, Circle, Edit, Filter, MoreHorizontal, PlusCircle, Search, Trash2, Wallet, X, XCircle } from "lucide-react";
import "motion/react";
import React__default, { useEffect, useState } from "react";
import "react-hot-toast";
import "react-icons/bs";
import "react-icons/fa";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import "tailwind-merge";
import "./Alert-3s5DZB4H.js";
import "./AuthController-DaCguZ7K.js";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import "./BlogCard-Jrl9AHYg.js";
import "./BlogSection-DiGfvTON.js";
import "./Breadcrumb-D0MBns-9.js";
import { a as BulkActionDialog, B as BulkActionsCard } from "./BulkActionsCard-D0COHX8t.js";
import { B as Button, c as convertFiltersToArrayFormat, k as keyToValue } from "./Button-CFMlPXiE.js";
import "./ButtonLoader-BVWhRiGk.js";
import { C as Card, a as CardContent } from "./Card-CQ2ij0--.js";
import { C as Checkbox } from "./Checkbox-CsK9i2JK.js";
import { C as CommonLayoutHeader } from "./CommonLayoutHeader-CyKOpByu.js";
import "./constants-4k_q_jeE.js";
import { D as DeleteDialog } from "./DeleteDialog-DBDDlwO7.js";
import "./demo-data-C5EGh9Nk.js";
import "./EmptyData-DjqqIMwS.js";
import { E as EmptyTableState } from "./EmptyTableState-C7sYsPjb.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import "./Label-BxDBN09D.js";
import { A as AuthenticatedLayout, B as BaseLayout, M as Main } from "./Main-BjCbeyG1.js";
import "./MarketGrid-DlkazA02.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
import { P as Pagination } from "./Pagination-CFo-75Wy.js";
import "./PaginationWrapper-B-KWAp7V.js";
import { P as Popover, b as PopoverContent, a as PopoverTrigger } from "./Popover-Ckus2dfK.js";
import "./Progress-DT6CA82_.js";
import { C as Command, c as CommandGroup, a as CommandInput, d as CommandItem, b as CommandList, D as DropdownMenu, f as DropdownMenuContent, i as DropdownMenuItem, g as DropdownMenuLabel, h as DropdownMenuSeparator, j as DropdownMenuSub, l as DropdownMenuSubContent, k as DropdownMenuSubTrigger, e as DropdownMenuTrigger } from "./Sheet-B-_2BaZp.js";
import "./SlideUp-CpffxXZf.js";
import { T as Table, d as TableBody, e as TableCell, c as TableHead, a as TableHeader, b as TableRow } from "./Table-Dz-EvWd_.js";
import "./TradeDialog-Dt4WEyMP.js";
import { a as getWithdrawMethodDeleteDialogConfig, b as getWithdrawMethodsBreadcrumbItems, g as getWithdrawMethodStats, f as onWithdrawMethodBulkAction, c as onWithdrawMethodDelete, e as onWithdrawMethodFilterChange, d as onWithdrawMethodSearch, o as onWithdrawMethodStatusUpdate, w as withdrawMethodFilterOptions } from "./WithdrawMethodController-Ch4XgSUg.js";
function OverviewCard({ stats }) {
  return /* @__PURE__ */ jsxs("div", {
    className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: [
    /* @__PURE__ */ jsx(Card, {
      className: "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800", children: /* @__PURE__ */ jsx(CardContent, {
        className: "p-6", children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg dark:bg-blue-900", children: /* @__PURE__ */ jsx(Wallet, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }) }),
      /* @__PURE__ */ jsxs("div", {
            children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-blue-700 dark:text-blue-300", children: "Total Methods" }),
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
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg dark:bg-green-900", children: /* @__PURE__ */ jsx(CheckCircle, { className: "w-6 h-6 text-green-600 dark:text-green-400" }) }),
      /* @__PURE__ */ jsxs("div", {
            children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-green-700 dark:text-green-300", children: "Active" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-green-900 dark:text-green-100", children: stats.active })
            ]
          })
          ]
        })
      })
    }),
    /* @__PURE__ */ jsx(Card, {
      className: "border-gray-200 bg-gray-50 dark:bg-gray-950 dark:border-gray-800", children: /* @__PURE__ */ jsx(CardContent, {
        className: "p-6", children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg dark:bg-gray-800", children: /* @__PURE__ */ jsx(XCircle, { className: "w-6 h-6 text-gray-600 dark:text-gray-400" }) }),
      /* @__PURE__ */ jsxs("div", {
            children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Inactive" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: stats.inactive })
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
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Find items quickly" })
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
  const { submit } = useForm();
  const handleEdit = () => {
    router.visit(route("admin.withdraw-methods.edit", item.id));
  };
  const handleDelete = () => {
    onDelete(item.id);
  };
  const handleStatusUpdate = (newStatus) => {
    onWithdrawMethodStatusUpdate(item, newStatus, submit);
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
            "Edit Method"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(DropdownMenuSub, {
        children: [
        /* @__PURE__ */ jsxs(DropdownMenuSubTrigger, {
          children: [
          /* @__PURE__ */ jsx(Circle, { className: "w-4 h-4 mr-2" }),
            "Change Status"
          ]
        }),
        /* @__PURE__ */ jsxs(DropdownMenuSubContent, {
          children: [
          /* @__PURE__ */ jsxs(
            DropdownMenuItem,
            {
              onClick: () => handleStatusUpdate("active"),
              disabled: item.status === "active",
              children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 mr-2 text-green-600" }),
                "Active",
                item.status === "active" && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "ml-auto text-xs", children: "Current" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            DropdownMenuItem,
            {
              onClick: () => handleStatusUpdate("inactive"),
              disabled: item.status === "inactive",
              children: [
                /* @__PURE__ */ jsx(XCircle, { className: "w-4 h-4 mr-2 text-gray-500" }),
                "Inactive",
                item.status === "inactive" && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "ml-auto text-xs", children: "Current" })
              ]
            }
          )
          ]
        })
        ]
      }),
      /* @__PURE__ */ jsx(DropdownMenuSeparator, { className: "dark:bg-gray-700" }),
      /* @__PURE__ */ jsxs(
        DropdownMenuItem,
        {
          onClick: handleDelete,
          className: "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400",
          children: [
            /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4 mr-2" }),
            "Delete Method"
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
    }
  };
  const config = variants[status] || variants.inactive;
  return /* @__PURE__ */ jsx(Badge, { variant: config.variant, className: `text-xs ${config.className}`, children: status.charAt(0).toUpperCase() + status.slice(1) });
};
const WithdrawMethodTable = ({
  methods = [],
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
      setSelectedItems(methods.map((m) => m.id));
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
  }, [methods, setBulkAction]);
  const handleBulkActionApply = (selectedIds, action) => {
    handleBulkAction(selectedIds, action);
    clearSelection();
    setShowBulkDialog(false);
  };
  const clearSelection = () => {
    setSelectedItems([]);
  };
  const bulkActionConfig = {
    title: "Bulk Method Actions",
    description: `Apply an action to ${selectedItems.length} selected methods.`,
    actions: [
      {
        value: "active",
        label: "Activate Selected",
        icon: CheckCircle,
        description: "Make selected methods available"
      },
      {
        value: "inactive",
        label: "Deactivate Selected",
        icon: XCircle,
        description: "Disable selected methods"
      },
      {
        value: "delete",
        label: "Delete Selected",
        icon: AlertTriangle,
        description: "Permanently remove selected methods"
      }
    ],
    warningMessage: `This action will affect ${selectedItems.length} methods. This action cannot be undone.`,
    showWarningAlert: true
  };
  if (methods.length === 0) {
    return /* @__PURE__ */ jsx(
      EmptyTableState,
      {
        icon: Wallet,
        title: "No withdraw methods found",
        description: "No withdrawal methods configured. Create your first method to get started."
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
        entityName: "method",
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
                      checked: selectedItems.length === methods.length && methods.length > 0,
                      onCheckedChange: handleSelectAll,
                      className: "border-gray-300 dark:border-gray-600"
                    }
                  )
                }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "ID" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Method" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Currency" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Exchange Rate" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Limits" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Charges" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Status" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Created" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-300", children: "Actions" })
                ]
              })
            }),
      /* @__PURE__ */ jsx(TableBody, {
              className: "bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700", children: methods?.map((item, index) => /* @__PURE__ */ jsxs(TableRow, {
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
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg dark:bg-blue-900", children: /* @__PURE__ */ jsx(Wallet, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" }) }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: item.name }) })
                    ]
                  })
                }),
        /* @__PURE__ */ jsx(TableCell, {
                  className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: item.currency_code }),
                      item.currency_symbol && /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: item.currency_symbol })
                    ]
                  })
                }),
        /* @__PURE__ */ jsx(TableCell, {
                  className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-1 text-xs", children: [
          /* @__PURE__ */ jsx(ArrowRightLeft, { className: "w-3 h-3 text-purple-500" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: item.exchange_rate })
                    ]
                  })
                }),
        /* @__PURE__ */ jsx(TableCell, {
                  className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", {
                    className: "space-y-1 text-xs", children: [
          /* @__PURE__ */ jsxs("div", {
                      className: "text-gray-500", children: [
                        "Min: ",
            /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: item.min_limit })
                      ]
                    }),
          /* @__PURE__ */ jsxs("div", {
                      className: "text-gray-500", children: [
                        "Max: ",
            /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: item.max_limit })
                      ]
                    })
                    ]
                  })
                }),
        /* @__PURE__ */ jsx(TableCell, {
                  className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", {
                    className: "space-y-1 text-xs", children: [
          /* @__PURE__ */ jsxs("div", {
                      className: "text-gray-500", children: [
                        "Fixed: ",
            /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: item.fixed_charge })
                      ]
                    }),
          /* @__PURE__ */ jsxs("div", {
                      className: "text-gray-500", children: [
                        "Percent: ",
            /* @__PURE__ */ jsxs("span", {
                          className: "font-medium text-gray-900 dark:text-gray-100", children: [
                            item.percent_charge,
                            "%"
                          ]
                        })
                      ]
                    })
                    ]
                  })
                }),
        /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx(StatusBadge, { status: item.status }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4 text-sm text-gray-500 dark:text-gray-400", children: item.created_at }),
        /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsx(TableActions, { item, onDelete }) })
                ]
              }, item.id))
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
function Index({
  title,
  methods = [],
  search = "",
  filters = {}
}) {
  const { meta, links } = methods;
  const { loading: bulkActionLoader, submit } = useForm();
  methods = methods?.data?.data || [];
  const [searchTerm, setSearchTerm] = useState(search);
  const [activeFilters, setActiveFilters] = useState(convertFiltersToArrayFormat(filters));
  const [selectedItems, setSelectedItems] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingMethod, setDeletingMethod] = useState(null);
  const currentData = methods;
  useEffect(() => {
    setSearchTerm(search);
    setActiveFilters(convertFiltersToArrayFormat(filters));
  }, [search, filters]);
  const filterOptions = withdrawMethodFilterOptions();
  const breadcrumbItems = getWithdrawMethodsBreadcrumbItems();
  const stats = getWithdrawMethodStats(currentData);
  const handleSearch = (searchValue) => {
    onWithdrawMethodSearch(searchValue, setSearchTerm);
  };
  const handleFilterChange = (newFilters) => {
    onWithdrawMethodFilterChange(newFilters, filterOptions, setActiveFilters, setSearchTerm);
  };
  const handleDeleteMethod = (id) => {
    const methodToDelete = currentData?.find((method) => method.id === id);
    if (methodToDelete) {
      setDeletingMethod(methodToDelete);
      setShowDeleteDialog(true);
    }
  };
  const handleBulkAction = (selectedIds, action) => {
    if (action && selectedIds.length > 0) {
      onWithdrawMethodBulkAction(selectedIds, action, submit);
      setSelectedItems([]);
      setBulkAction("");
    }
  };
  const handleCreateMethod = () => {
    router.visit(route("admin.withdraw-methods.create"));
  };
  const deleteDialogConfig = getWithdrawMethodDeleteDialogConfig(deletingMethod);
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
            title: "Withdraw Methods",
            description: "Manage and configure withdrawal payment methods for your platform",
            icon: Wallet,
            stats,
            primaryAction: {
              label: "Add Method",
              icon: PlusCircle,
              onClick: handleCreateMethod,
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
            placeholder: "Search by method name or currency...",
            filterOptions
          }
        ),
      /* @__PURE__ */ jsx("div", {
          className: "space-y-6", children: /* @__PURE__ */ jsx(
            WithdrawMethodTable,
            {
              methods: currentData || [],
              selectedItems,
              setSelectedItems,
              bulkAction,
              setBulkAction,
              handleBulkAction,
              onDelete: handleDeleteMethod,
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
              item: deletingMethod,
              config: deleteDialogConfig,
              onDelete: onWithdrawMethodDelete
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


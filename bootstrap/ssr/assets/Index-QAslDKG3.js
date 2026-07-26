import "@hookform/resolvers/zod";
import { Head, Link, router } from "@inertiajs/react";
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
import { AlertTriangle, CheckCircle, Circle, Edit, Filter, FolderOpen, MoreHorizontal, Package, PlusCircle, Search, Star, Tag, Trash2, X, XCircle } from "lucide-react";
import "motion/react";
import React__default, { useEffect, useState } from "react";
import "react-hook-form";
import "react-hot-toast";
import "react-icons/bs";
import "react-icons/fa";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import "tailwind-merge";
import "zod";
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
import { C as CategoryDialog, a as getCategoryBreadcrumbItems, d as getCategoryFilterOptions, b as getCategoryStats, c as getDeleteDialogConfig, g as getSubcategoryBreadcrumbItems, i as onCategoryBulkAction, e as onCategoryDelete, h as onCategoryFilterChange, f as onCategorySearch, o as onCategoryStatusUpdate } from "./CategoryDialog-WJXZpB7q.js";
import { C as Checkbox } from "./Checkbox-CsK9i2JK.js";
import { C as CommonLayoutHeader } from "./CommonLayoutHeader-CyKOpByu.js";
import { D as DeleteDialog } from "./DeleteDialog-DBDDlwO7.js";
import "./EmptyData-DjqqIMwS.js";
import { E as EmptyTableState } from "./EmptyTableState-C7sYsPjb.js";
import "./Form-dg4L2iRR.js";
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
import "./constants-4k_q_jeE.js";
import "./demo-data-C5EGh9Nk.js";
function CategoryOverviewCard({ isSubcategoryView, stats }) {
  return /* @__PURE__ */ jsxs("div", {
    className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4", children: [
    /* @__PURE__ */ jsx(Card, {
      className: "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800", children: /* @__PURE__ */ jsx(CardContent, {
        className: "p-6", children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg dark:bg-blue-900", children: /* @__PURE__ */ jsx(Package, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }) }),
      /* @__PURE__ */ jsxs("div", {
            children: [
        /* @__PURE__ */ jsxs("p", {
              className: "text-sm font-medium text-blue-700 dark:text-blue-300", children: [
                "Total ",
                isSubcategoryView ? "Subcategories" : "Categories"
              ]
            }),
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
    }),
      !isSubcategoryView && /* @__PURE__ */ jsx(Card, {
        className: "border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800", children: /* @__PURE__ */ jsx(CardContent, {
          className: "p-6", children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg dark:bg-purple-900", children: /* @__PURE__ */ jsx(FolderOpen, { className: "w-6 h-6 text-purple-600 dark:text-purple-400" }) }),
      /* @__PURE__ */ jsxs("div", {
              children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-purple-700 dark:text-purple-300", children: "With Subcategories" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-purple-900 dark:text-purple-100", children: stats.withSubcategories })
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
  placeholder = "Search templates...",
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
    className: "w-full max-w-full p-3 space-y-3 border rounded-xl bg-background sm:p-4 sm:space-y-4", children: [
    /* @__PURE__ */ jsxs("div", {
      className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3", children: [
      /* @__PURE__ */ jsxs("div", {
        className: "flex items-center min-w-0 gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 p-1.5 rounded-lg bg-primary/10 sm:p-2", children: /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-primary" }) }),
        /* @__PURE__ */ jsxs("div", {
          className: "min-w-0", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold truncate sm:text-base", children: "Search & Filter" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs truncate text-muted-foreground", children: "Find items quickly" })
          ]
        })
        ]
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "flex items-center flex-shrink-0 gap-2", children: [
          activeFilterCount > 0 && /* @__PURE__ */ jsxs(Badge, {
            variant: "secondary", className: "text-xs", children: [
              "Active filters : ",
              activeFilterCount
            ]
          }),
          Object.keys(filterOptions).length > 0 && /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "text-xs sm:hidden h-7",
              onClick: () => setShowMobileFilters(!showMobileFilters),
              children: [
              /* @__PURE__ */ jsx(Filter, { className: "w-3 h-3 mr-1" }),
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
        className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3", children: [
      /* @__PURE__ */ jsxs("div", {
          className: "relative flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute w-3.5 h-3.5 left-2.5 top-2.5 text-muted-foreground sm:w-4 sm:h-4 sm:left-3 sm:top-3" }),
        /* @__PURE__ */ jsx(
            Input,
            {
              name: "search",
              placeholder: "Search by name or subject",
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
                onClick: () => handleSearchChange(""),
                children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
              }
            )
          ]
        }),
          Object.keys(filterOptions).length > 0 && /* @__PURE__ */ jsxs("div", {
            className: "hidden gap-2 sm:flex sm:flex-shrink-0", children: [
              Object.entries(filterOptions).map(([filterType, options]) => /* @__PURE__ */ jsxs(Popover, {
                children: [
          /* @__PURE__ */ jsx(PopoverTrigger, {
                  asChild: true, children: /* @__PURE__ */ jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      className: "h-10 min-w-[100px] max-w-[140px] justify-between text-xs",
                      children: [
                /* @__PURE__ */ jsxs("span", {
                        className: "flex items-center gap-1 truncate", children: [
                          filterType === "type" && /* @__PURE__ */ jsx(Filter, { className: "w-3 h-3" }),
                          keyToValue(filterType)
                        ]
                      }),
                        filters[filterType]?.length > 0 && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "h-3 px-1 ml-1 text-xs", children: filters[filterType].length })
                      ]
                    }
                  )
                }),
          /* @__PURE__ */ jsx(PopoverContent, {
                  className: "w-56 p-0", children: /* @__PURE__ */ jsxs(Command, {
                    children: [
            /* @__PURE__ */ jsx(CommandInput, { placeholder: `Search ${filterType}...` }),
            /* @__PURE__ */ jsx(CommandList, {
                      children: /* @__PURE__ */ jsx(CommandGroup, {
                        children: options.map((option) => {
                          const active = filters[filterType]?.includes(option.value);
                          return /* @__PURE__ */ jsxs(
                            CommandItem,
                            {
                              onSelect: () => toggleFilter(filterType, option.value),
                              className: "flex justify-between",
                              children: [
                    /* @__PURE__ */ jsx("span", { className: "pr-2 truncate", children: option.label }),
                                active && /* @__PURE__ */ jsx("span", { className: "flex-shrink-0 w-2 h-2 rounded-full bg-primary" })
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
                  className: "h-10 text-xs text-muted-foreground hover:text-destructive",
                  children: "Reset"
                }
              )
            ]
          })
        ]
      })
    }),
      Object.keys(filterOptions).length > 0 && showMobileFilters && /* @__PURE__ */ jsxs("div", {
        className: "space-y-2 sm:hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-muted-foreground", children: "Filters" }),
      /* @__PURE__ */ jsx("div", {
          className: "grid gap-2", children: Object.entries(filterOptions).map(([filterType, options]) => /* @__PURE__ */ jsxs(Popover, {
            children: [
        /* @__PURE__ */ jsx(PopoverTrigger, {
              asChild: true, children: /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "justify-between w-full h-8 text-xs",
                  children: [
              /* @__PURE__ */ jsxs("span", {
                    className: "flex items-center gap-1 truncate", children: [
                      filterType === "type" && /* @__PURE__ */ jsx(Filter, { className: "w-3 h-3" }),
                      keyToValue(filterType)
                    ]
                  }),
                    filters[filterType]?.length > 0 && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "h-3 px-1 ml-1 text-xs", children: filters[filterType].length })
                  ]
                }
              )
            }),
        /* @__PURE__ */ jsx(PopoverContent, {
              className: "w-[280px] p-0 max-w-[calc(100vw-2rem)]", children: /* @__PURE__ */ jsxs(Command, {
                children: [
          /* @__PURE__ */ jsx(CommandInput, { placeholder: `Search ${filterType}...` }),
          /* @__PURE__ */ jsx(CommandList, {
                  children: /* @__PURE__ */ jsx(CommandGroup, {
                    children: options.map((option) => {
                      const active = filters[filterType]?.includes(option.value);
                      return /* @__PURE__ */ jsxs(
                        CommandItem,
                        {
                          onSelect: () => toggleFilter(filterType, option.value),
                          className: "flex justify-between",
                          children: [
                  /* @__PURE__ */ jsx("span", { className: "pr-2 truncate", children: option.label }),
                            active && /* @__PURE__ */ jsx("span", { className: "flex-shrink-0 w-2 h-2 rounded-full bg-primary" })
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
              className: "w-full h-8 text-xs text-muted-foreground hover:text-destructive",
              children: "Reset All"
            }
          )
        ]
      }),
      activeFilterCount > 0 && /* @__PURE__ */ jsxs("div", {
        className: "pt-2 space-y-2 border-t", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-muted-foreground", children: "Active filters:" }),
      /* @__PURE__ */ jsx("div", {
          className: "flex flex-wrap gap-1", children: Object.entries(filters).flatMap(
            ([key, values]) => values.map((value) => {
              const option = filterOptions[key]?.find((opt) => opt.value === value);
              return /* @__PURE__ */ jsxs(
                Badge,
                {
                  variant: "secondary",
                  className: "flex items-center gap-1 text-xs max-w-[180px] h-6",
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
                      className: "w-3 h-3 hover:bg-destructive/20",
                      onClick: () => clearFilter(key, value),
                      children: /* @__PURE__ */ jsx(X, { className: "w-2 h-2" })
                    }
                  )
                  ]
                },
                key + value
              );
            })
          )
        })
        ]
      })
    ]
  });
};
const TableActions = ({ item, onEdit, onDelete, isSubcategoryView }) => {
  const { submit } = useForm();
  const handleEdit = () => {
    onEdit(item);
  };
  const handleDelete = () => {
    onDelete(item.id);
  };
  const handleStatusUpdate = (newStatus) => {
    onCategoryStatusUpdate(item, newStatus, submit);
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
            "Edit ",
            isSubcategoryView ? "Subcategory" : "Category"
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
            "Delete ",
            isSubcategoryView ? "Subcategory" : "Category"
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
const FeaturedBadge = ({ isFeatured }) => {
  if (!isFeatured) return null;
  return /* @__PURE__ */ jsxs(
    Badge,
    {
      variant: "outline",
      className: "text-xs text-yellow-700 border-yellow-200 dark:text-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
      children: [
        /* @__PURE__ */ jsx(Star, { className: "w-3 h-3 mr-1 fill-yellow-500" }),
        "Featured"
      ]
    }
  );
};
const SubcategoryBadge = ({ count }) => {
  if (count === 0) return null;
  return /* @__PURE__ */ jsxs(
    Badge,
    {
      variant: "outline",
      className: "text-xs text-purple-700 border-purple-200 dark:text-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20",
      children: [
        /* @__PURE__ */ jsx(FolderOpen, { className: "w-3 h-3 mr-1" }),
        count,
        " Subcategories"
      ]
    }
  );
};
const CategoryTable = ({
  categories = [],
  isSubcategoryView = false,
  onEdit,
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
      setSelectedItems(categories.map((c) => c.id));
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
  }, [categories, setBulkAction]);
  const handleBulkActionApply = (selectedIds, action) => {
    handleBulkAction(selectedIds, action);
    clearSelection();
    setShowBulkDialog(false);
  };
  const clearSelection = () => {
    setSelectedItems([]);
  };
  const bulkActionConfig = {
    title: `Bulk ${isSubcategoryView ? "Subcategory" : "Category"} Actions`,
    description: `Apply an action to ${selectedItems.length} selected ${isSubcategoryView ? "subcategories" : "categories"}.`,
    actions: [
      {
        value: "active",
        label: "Activate Selected",
        icon: CheckCircle,
        description: "Make selected items visible to users"
      },
      {
        value: "inactive",
        label: "Deactivate Selected",
        icon: XCircle,
        description: "Hide selected items from users"
      },
      {
        value: "delete",
        label: "Delete Selected",
        icon: AlertTriangle,
        description: "Permanently remove selected items"
      }
    ],
    warningMessage: `This action will affect ${selectedItems.length} ${isSubcategoryView ? "subcategories" : "categories"}. This action cannot be undone.`,
    showWarningAlert: true
  };
  if (categories.length === 0) {
    return /* @__PURE__ */ jsx(
      EmptyTableState,
      {
        icon: Package,
        title: `No ${isSubcategoryView ? "subcategories" : "categories"} found`,
        description: `No ${isSubcategoryView ? "subcategories" : "categories"} configured. Create your first ${isSubcategoryView ? "subcategory" : "category"} to get started.`
      }
    );
  }
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
    /* @__PURE__ */ jsx(
      BulkActionsCard,
      {
        selectedItems,
        isSubcategoryView,
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
                      checked: selectedItems.length === categories.length && categories.length > 0,
                      onCheckedChange: handleSelectAll,
                      className: "border-gray-300 dark:border-gray-600"
                    }
                  )
                }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "ID" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: isSubcategoryView ? "Subcategory" : "Category" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Status" }),
                  !isSubcategoryView && /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Subcategories" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Created" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-300", children: "Actions" })
                ]
              })
            }),
      /* @__PURE__ */ jsx(TableBody, {
              className: "bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700", children: categories?.map((item, index) => /* @__PURE__ */ jsxs(TableRow, {
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
                  className: "px-6 py-4", children: /* @__PURE__ */ jsx("div", {
                    className: "flex flex-col gap-2", children: /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20", children: /* @__PURE__ */ jsx(Package, { className: "w-4 h-4 text-blue-600 dark:text-blue-400" }) }),
          /* @__PURE__ */ jsxs("div", {
                        children: [
            /* @__PURE__ */ jsxs("div", {
                          className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: item.name }),
              /* @__PURE__ */ jsx(FeaturedBadge, { isFeatured: item.is_feature })
                          ]
                        }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400", children: item.slug })
                        ]
                      })
                      ]
                    })
                  })
                }),
        /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx(StatusBadge, { status: item.status }) }),
                  !isSubcategoryView && /* @__PURE__ */ jsx(TableCell, {
                    className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(SubcategoryBadge, { count: item.subcategories_count || 0 }),
                        item.subcategories_count > 0 ? /* @__PURE__ */ jsx(Button, {
                          variant: "ghost", size: "sm", asChild: true, children: /* @__PURE__ */ jsxs(Link, {
                            href: route("admin.market-categories.subcategories", item?.id), children: [
            /* @__PURE__ */ jsx(FolderOpen, { className: "w-3 h-3 mr-1" }),
                              "View"
                            ]
                          })
                        }) : "N/A"
                      ]
                    })
                  }),
        /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4 text-sm text-gray-500 dark:text-gray-400", children: item.created_at }),
        /* @__PURE__ */ jsx(TableCell, {
                    className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsx(
                      TableActions,
                      {
                        item,
                        onEdit,
                        onDelete,
                        isSubcategoryView
                      }
                    )
                  })
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
  categories = [],
  sub_categories = [],
  category = null,
  search = "",
  filters = {}
}) {
  const { meta, links } = category ? sub_categories : categories;
  const { loading: bulkActionLoader, submit } = useForm();
  category = category?.data;
  const [searchTerm, setSearchTerm] = useState(search);
  const [activeFilters, setActiveFilters] = useState(convertFiltersToArrayFormat(filters));
  const [selectedItems, setSelectedItems] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [dialogMode, setDialogMode] = useState("create");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const isSubcategoryView = !!category;
  const currentData = isSubcategoryView ? sub_categories?.data : categories?.data;
  useEffect(() => {
    setSearchTerm(search);
    setActiveFilters(convertFiltersToArrayFormat(filters));
  }, [search, filters]);
  const filterOptions = getCategoryFilterOptions();
  const breadcrumbItems = isSubcategoryView ? getSubcategoryBreadcrumbItems(category) : getCategoryBreadcrumbItems();
  const stats = getCategoryStats(currentData);
  const handleSearch = (searchValue) => {
    onCategorySearch(searchValue, setSearchTerm);
  };
  const handleFilterChange = (newFilters) => {
    onCategoryFilterChange(newFilters, filterOptions, setActiveFilters, setSearchTerm);
  };
  const handleCreateCategory = () => {
    setEditingCategory(null);
    setDialogMode("create");
    setShowCategoryDialog(true);
  };
  const handleEditCategory = (categoryItem) => {
    setEditingCategory(categoryItem);
    setDialogMode("edit");
    setShowCategoryDialog(true);
  };
  const handleDeleteCategory = (categoryId) => {
    const categoryToDelete = currentData?.data?.find((cat) => cat.id === categoryId);
    if (categoryToDelete) {
      setDeletingCategory(categoryToDelete);
      setShowDeleteDialog(true);
    }
  };
  const handleBulkAction = (selectedIds, action) => {
    if (action && selectedIds.length > 0) {
      onCategoryBulkAction(selectedIds, action, submit);
      setSelectedItems([]);
      setBulkAction("");
    }
  };
  const availableParentCategories = !isSubcategoryView ? categories?.data?.data || [] : [];
  const deleteDialogConfig = deletingCategory ? getDeleteDialogConfig(currentData, deletingCategory, isSubcategoryView) : null;
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
            title: isSubcategoryView ? `${category?.name} - Subcategories` : "Market Categories",
            description: isSubcategoryView ? `Manage subcategories under ${category?.name}` : "Organize and manage market categories for marketplace",
            icon: Tag,
            stats,
            primaryAction: {
              label: isSubcategoryView ? "Add Subcategory" : "Add Category",
              icon: PlusCircle,
              onClick: handleCreateCategory,
              variant: "default"
            },
            secondaryActions: isSubcategoryView ? [
              {
                label: "Back to Categories",
                icon: Package,
                onClick: () => router.visit("/admin/market-categories"),
                variant: "outline"
              }
            ] : []
          }
        ),
      /* @__PURE__ */ jsx(
          CategoryOverviewCard,
          {
            isSubcategoryView,
            stats,
            category
          }
        ),
      /* @__PURE__ */ jsx(
          SearchBox,
          {
            searchTerm: searchTerm || "",
            onSearchChange: handleSearch,
            filters: activeFilters,
            onFilterChange: handleFilterChange,
            placeholder: `Search ${isSubcategoryView ? "subcategory" : "category"} name...`,
            filterOptions
          }
        ),
      /* @__PURE__ */ jsx("div", {
          className: "space-y-6", children: /* @__PURE__ */ jsx(
            CategoryTable,
            {
              categories: currentData?.data || [],
              isSubcategoryView,
              selectedItems,
              setSelectedItems,
              bulkAction,
              setBulkAction,
              handleBulkAction,
              onEdit: handleEditCategory,
              onDelete: handleDeleteCategory,
              bulkActionLoader
            }
          )
        }),
          (links || meta) && /* @__PURE__ */ jsx(
            Pagination,
            {
              links,
              meta
            }
          ),
      /* @__PURE__ */ jsx(
            CategoryDialog,
            {
              open: showCategoryDialog,
              onOpenChange: setShowCategoryDialog,
              category: editingCategory,
              mode: dialogMode,
              parentCategories: availableParentCategories,
              currentParent: category,
              isSubcategoryView
            }
          ),
          deleteDialogConfig && /* @__PURE__ */ jsx(
            DeleteDialog,
            {
              open: showDeleteDialog,
              onOpenChange: setShowDeleteDialog,
              item: deletingCategory,
              config: deleteDialogConfig,
              onDelete: onCategoryDelete
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


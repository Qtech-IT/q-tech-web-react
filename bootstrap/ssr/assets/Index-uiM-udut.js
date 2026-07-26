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
import { ArrowDownCircle, ArrowUpCircle, CheckCircle, Clock, Eye, Filter, Search, TrendingDown, TrendingUp, User, X, XCircle } from "lucide-react";
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
import { B as Button, c as convertFiltersToArrayFormat, k as keyToValue } from "./Button-CFMlPXiE.js";
import { C as Card, a as CardContent } from "./Card-CQ2ij0--.js";
import { C as CommonLayoutHeader } from "./CommonLayoutHeader-CyKOpByu.js";
import "./EmptyData-DjqqIMwS.js";
import { E as EmptyTableState } from "./EmptyTableState-C7sYsPjb.js";
import "./HotToast-DfpkTxSC.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import "./Label-BxDBN09D.js";
import { A as AuthenticatedLayout, B as BaseLayout, M as Main } from "./Main-BjCbeyG1.js";
import "./MarketGrid-DlkazA02.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
import { P as Pagination } from "./Pagination-CFo-75Wy.js";
import "./PaginationWrapper-B-KWAp7V.js";
import { P as Popover, b as PopoverContent, a as PopoverTrigger } from "./Popover-Ckus2dfK.js";
import "./Progress-DT6CA82_.js";
import { C as Command, c as CommandGroup, a as CommandInput, d as CommandItem, b as CommandList } from "./Sheet-B-_2BaZp.js";
import "./SlideUp-CpffxXZf.js";
import { T as Table, d as TableBody, e as TableCell, c as TableHead, a as TableHeader, b as TableRow } from "./Table-Dz-EvWd_.js";
import "./TradeDialog-Dt4WEyMP.js";
import { g as getTransactionStats, a as getTransactionsBreadcrumbItems, b as onTransactionFilterChange, o as onTransactionSearch, t as transactionFilterOptions } from "./UserController-CXMhOV3I.js";
import "./constants-4k_q_jeE.js";
import "./demo-data-C5EGh9Nk.js";
function TransactionOverviewCard({ stats }) {
  return /* @__PURE__ */ jsxs("div", {
    className: "grid grid-cols-1 gap-6 md:grid-cols-4", children: [
    /* @__PURE__ */ jsx(Card, {
      className: "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800", children: /* @__PURE__ */ jsx(CardContent, {
        className: "p-6", children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg dark:bg-blue-900", children: /* @__PURE__ */ jsx(TrendingUp, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }) }),
      /* @__PURE__ */ jsxs("div", {
            children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-blue-700 dark:text-blue-300", children: "Total Transactions" }),
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
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-green-700 dark:text-green-300", children: "Completed" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-green-900 dark:text-green-100", children: stats.completed })
            ]
          })
          ]
        })
      })
    }),
    /* @__PURE__ */ jsx(Card, {
      className: "border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800", children: /* @__PURE__ */ jsx(CardContent, {
        className: "p-6", children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg dark:bg-yellow-900", children: /* @__PURE__ */ jsx(Clock, { className: "w-6 h-6 text-yellow-600 dark:text-yellow-400" }) }),
      /* @__PURE__ */ jsxs("div", {
            children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-yellow-700 dark:text-yellow-300", children: "Pending" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-yellow-900 dark:text-yellow-100", children: stats.pending })
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
  filterOptions = {},
  showDateRange = false
}) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [dateRange, setDateRange] = useState(
    filters.date_range ? JSON.parse(filters.date_range) : { from: null, to: null }
  );
  const handleSearchChange = (value) => {
    setLocalSearch(value);
    onSearchChange(value);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };
  const toggleFilter = (filterType, value) => {
    if (filterType === "date_range") return;
    const current = filters[filterType] || [];
    let updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onFilterChange({ ...filters, [filterType]: updated });
  };
  const clearFilter = (filterType, value) => {
    if (filterType === "date_range") {
      const updated2 = { ...filters };
      delete updated2.date_range;
      setDateRange({ from: null, to: null });
      onFilterChange(updated2);
      return;
    }
    const updated = { ...filters };
    updated[filterType] = updated[filterType].filter((v) => v !== value);
    if (!updated[filterType].length) delete updated[filterType];
    onFilterChange(updated);
  };
  const clearAllFilters = () => {
    setLocalSearch("");
    setDateRange({ from: null, to: null });
    if (onSearchChange) onSearchChange("");
    if (onFilterChange) onFilterChange({});
  };
  const activeFilterCount = Object.values(filters).reduce((acc, val) => {
    if (typeof val === "string" && val !== "") return acc + 1;
    return acc + (Array.isArray(val) ? val.length : 0);
  }, 0);
  React__default.useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);
  React__default.useEffect(() => {
    if (filters.date_range) {
      try {
        setDateRange(JSON.parse(filters.date_range));
      } catch (e) {
        setDateRange({ from: null, to: null });
      }
    }
  }, [filters.date_range]);
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
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Find transactions quickly" })
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
          (Object.keys(filterOptions).length > 0 || showDateRange) && /* @__PURE__ */ jsxs(
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
          (Object.keys(filterOptions).length > 0 || showDateRange) && /* @__PURE__ */ jsxs("div", {
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
      (Object.keys(filterOptions).length > 0 || showDateRange) && showMobileFilters && /* @__PURE__ */ jsxs("div", {
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
          className: "flex flex-wrap gap-1.5", children: Object.entries(filters).flatMap(([key, values]) => {
            if (key === "date_range") return [];
            return values.map((value) => {
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
            });
          })
        })
        ]
      })
    ]
  });
};
const StatusBadge = ({ status }) => {
  const variants = {
    success: {
      variant: "default",
      className: "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/20 border-green-200 dark:border-green-700",
      icon: CheckCircle
    },
    pending: {
      variant: "secondary",
      className: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700",
      icon: Clock
    },
    failed: {
      variant: "secondary",
      className: "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20 border-red-200 dark:border-red-700",
      icon: XCircle
    },
    rejected: {
      variant: "secondary",
      className: "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20 border-red-200 dark:border-red-700",
      icon: XCircle
    }
  };
  const config = variants[status] || variants.pending;
  const Icon = config.icon;
  return /* @__PURE__ */ jsxs(Badge, {
    variant: config.variant, className: `text-xs flex items-center gap-1 w-fit ${config.className}`, children: [
    /* @__PURE__ */ jsx(Icon, { className: "w-3 h-3" }),
      status.charAt(0).toUpperCase() + status.slice(1)
    ]
  });
};
const TypeBadge = ({ type }) => {
  const variants = {
    add: {
      className: "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700",
      icon: ArrowUpCircle
    },
    subtract: {
      className: "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700",
      icon: ArrowDownCircle
    },
    deposit: {
      className: "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700",
      icon: TrendingUp
    },
    withdraw: {
      className: "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700",
      icon: TrendingDown
    }
  };
  const config = variants[type] || variants.add;
  const Icon = config.icon;
  return /* @__PURE__ */ jsxs(Badge, {
    variant: "outline", className: `text-xs flex items-center gap-1 w-fit ${config.className}`, children: [
    /* @__PURE__ */ jsx(Icon, { className: "w-3 h-3" }),
      type.charAt(0).toUpperCase() + type.slice(1)
    ]
  });
};
const TransactionTable = ({ transactions = [] }) => {
  console.log(transactions);
  if (transactions.length === 0) {
    return /* @__PURE__ */ jsx(
      EmptyTableState,
      {
        icon: TrendingUp,
        title: "No transactions found",
        description: "No transactions available at the moment."
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
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Transaction ID" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "User" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Type" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Amount" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Fee" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Net Amount" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Status" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Date" })
              ]
            })
          }),
    /* @__PURE__ */ jsx(TableBody, {
            className: "bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700", children: transactions?.map((item, index) => /* @__PURE__ */ jsxs(TableRow, {
              className: "transition-colors hover:bg-gray-50 dark:hover:bg-gray-800", children: [
      /* @__PURE__ */ jsxs(TableCell, {
                className: "px-6 py-4  text-gray-700 dark:text-gray-300", children: [
                  "#",
                  index + 1
                ]
              }),
      /* @__PURE__ */ jsx(TableCell, {
                className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", {
                  className: "space-y-1", children: [
        /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Eye, { className: "w-3 h-3 text-gray-400" }),
          /* @__PURE__ */ jsx("span", { className: " text-xs font-medium text-blue-600 dark:text-blue-400", children: item.trx_id })
                    ]
                  }),
                    item.remarks && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400 line-clamp-1", children: item.remarks })
                  ]
                })
              }),
      /* @__PURE__ */ jsx(TableCell, {
                className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", {
                  className: "flex items-start gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full dark:bg-gray-700", children: /* @__PURE__ */ jsx(User, { className: "w-4 h-4 text-gray-400" }) }),
        /* @__PURE__ */ jsxs("div", {
                    className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-900 truncate dark:text-gray-100", children: item.user?.name || "N/A" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 truncate dark:text-gray-400", children: item.user?.email || "N/A" })
                    ]
                  })
                  ]
                })
              }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx(TypeBadge, { type: item.trx_type }) }),
      /* @__PURE__ */ jsxs(TableCell, {
                className: "px-6 py-4", children: [
        /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: item.currency_symbol || "$" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: item.amount })
                  ]
                }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-400", children: item.currency_code || "USD" })
                ]
              }),
      /* @__PURE__ */ jsx(TableCell, {
                className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: item.currency_symbol || "$" }),
        /* @__PURE__ */ jsx("span", { children: item.fee || "0.00" })
                  ]
                })
              }),
      /* @__PURE__ */ jsx(TableCell, {
                className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: item.currency_symbol || "$" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100", children: item.net_amount || "0.00" })
                  ]
                })
              }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx(StatusBadge, { status: item.status }) }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx("div", { className: "space-y-1", children: /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-900 dark:text-gray-100", children: item.created_at }) }) })
              ]
            }, item.id))
          })
          ]
        })
      })
    })
  });
};
function Index({
  title,
  transactions = [],
  search = "",
  filters = {}
}) {
  const { meta, links } = transactions;
  transactions = transactions?.data?.data || [];
  const [searchTerm, setSearchTerm] = useState(search);
  const [activeFilters, setActiveFilters] = useState(convertFiltersToArrayFormat(filters));
  const currentData = transactions;
  useEffect(() => {
    setSearchTerm(search);
    setActiveFilters(convertFiltersToArrayFormat(filters));
  }, [search, filters]);
  const filterOptions = transactionFilterOptions();
  const breadcrumbItems = getTransactionsBreadcrumbItems();
  const stats = getTransactionStats(currentData);
  const handleSearch = (searchValue) => {
    onTransactionSearch(searchValue, setSearchTerm);
  };
  const handleFilterChange = (newFilters) => {
    onTransactionFilterChange(newFilters, filterOptions, setActiveFilters, setSearchTerm);
  };
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
            title: "Transactions",
            description: "View and manage all transaction history",
            icon: TrendingUp,
            stats
          }
        ),
      /* @__PURE__ */ jsx(TransactionOverviewCard, { stats }),
      /* @__PURE__ */ jsx(
          SearchBox,
          {
            searchTerm: searchTerm || "",
            onSearchChange: handleSearch,
            filters: activeFilters,
            onFilterChange: handleFilterChange,
            placeholder: `Search by transaction ID, remarks...`,
            filterOptions,
            showDateRange: true
          }
        ),
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsx(TransactionTable, { transactions: currentData || [] }) }),
          (links || meta) && /* @__PURE__ */ jsx(
            Pagination,
            {
              links,
              meta
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


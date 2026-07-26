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
import { Bell, Edit, Filter, MessageSquare, MoreHorizontal, Search, X } from "lucide-react";
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
import "./EmptyData-DjqqIMwS.js";
import { E as EmptyTableState } from "./EmptyTableState-C7sYsPjb.js";
import "./HotToast-DfpkTxSC.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import "./Label-BxDBN09D.js";
import { L as LayoutHeader } from "./LayoutHeader-DyQkXJ8M.js";
import { A as AuthenticatedLayout, B as BaseLayout, M as Main } from "./Main-BjCbeyG1.js";
import "./MarketGrid-DlkazA02.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
import { c as getBreadcrumbItems, d as getFilterOptions, b as getStats, f as onTemplateFilterChange, e as onTemplateSearch } from "./NotificationTemplateController-DQGJbhT2.js";
import "./PaginationWrapper-B-KWAp7V.js";
import { P as Popover, b as PopoverContent, a as PopoverTrigger } from "./Popover-Ckus2dfK.js";
import "./Progress-DT6CA82_.js";
import { C as Command, c as CommandGroup, a as CommandInput, d as CommandItem, b as CommandList, D as DropdownMenu, f as DropdownMenuContent, i as DropdownMenuItem, g as DropdownMenuLabel, h as DropdownMenuSeparator, e as DropdownMenuTrigger } from "./Sheet-B-_2BaZp.js";
import "./SlideUp-CpffxXZf.js";
import { T as Table, d as TableBody, e as TableCell, c as TableHead, a as TableHeader, b as TableRow } from "./Table-Dz-EvWd_.js";
import "./TradeDialog-Dt4WEyMP.js";
import "./constants-4k_q_jeE.js";
import "./demo-data-C5EGh9Nk.js";
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
          /* @__PURE__ */ jsx("p", { className: "text-xs truncate text-muted-foreground", children: "Find templates quickly" })
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
const TableActions = ({ template }) => {
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
      align: "end", className: "bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-900 dark:border-gray-700 w-44", children: [
      /* @__PURE__ */ jsx(DropdownMenuLabel, { className: "text-sm font-semibold text-gray-700 dark:text-gray-300", children: "Actions" }),
      /* @__PURE__ */ jsx(DropdownMenuSeparator, { className: "dark:bg-gray-700" }),
      /* @__PURE__ */ jsxs(
        DropdownMenuItem,
        {
          onClick: () => router.visit(`/admin/notification-templates/${template.id}/edit`),
          className: "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100",
          children: [
            /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4 mr-2 text-green-600 dark:text-green-500" }),
            " Edit"
          ]
        }
      )
      ]
    })
    ]
  });
};
const NotificationTemplatesTable = ({ templates = [] }) => {
  if (templates.length === 0) {
    return /* @__PURE__ */ jsx(
      EmptyTableState,
      {
        icon: MessageSquare,
        title: "No templates found",
        description: "No notification templates found!!."
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
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Name" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Subject" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Type" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Created" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-300", children: "Actions" })
              ]
            })
          }),
    /* @__PURE__ */ jsx(TableBody, {
            className: "bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700", children: templates?.map((template, index) => /* @__PURE__ */ jsxs(TableRow, {
              className: "transition-colors hover:bg-gray-50 dark:hover:bg-gray-800", children: [
      /* @__PURE__ */ jsxs(TableCell, {
                className: "px-6 py-4  text-gray-700 dark:text-gray-300", children: [
                  "#",
                  index + 1
                ]
              }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: template.name }) }) }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4 text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px]", title: template.subject, children: template.subject }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs text-gray-700 border-gray-300 dark:border-gray-600 dark:text-gray-300", children: template?.type }) }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4 text-sm text-gray-500 dark:text-gray-400", children: template.created_at }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsx(TableActions, { template }) })
              ]
            }, template.id))
          })
          ]
        })
      })
    })
  });
};
function Index({
  title,
  templates = [],
  search = "",
  filters = {}
}) {
  const [searchTerm, setSearchTerm] = useState(search);
  const [activeFilters, setActiveFilters] = useState(convertFiltersToArrayFormat(filters));
  useEffect(() => {
    setSearchTerm(search);
    setActiveFilters(convertFiltersToArrayFormat(filters));
  }, [search, filters]);
  const filterOptions = getFilterOptions();
  const breadcrumbItems = getBreadcrumbItems();
  const handleSearch = (searchValue) => {
    onTemplateSearch(searchValue, setSearchTerm);
  };
  const handleFilterChange = (newFilters) => {
    onTemplateFilterChange(newFilters, filterOptions, setActiveFilters, setSearchTerm);
  };
  const stats = getStats(templates);
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
            title: "Notification Templates",
            description: "Manage and configure your notification templates with ease",
            icon: Bell,
            stats
          }
        ),
      /* @__PURE__ */ jsx(
          SearchBox,
          {
            searchTerm,
            onSearchChange: handleSearch,
            filters: activeFilters,
            onFilterChange: handleFilterChange,
            placeholder: "Search templates by name, subject, or type...",
            filterOptions
          }
        ),
      /* @__PURE__ */ jsx("div", {
          className: "space-y-6", children: /* @__PURE__ */ jsx(
            NotificationTemplatesTable,
            {
              templates: templates?.data || []
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


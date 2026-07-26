import { zodResolver } from "@hookform/resolvers/zod";
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
import { AlertTriangle, CheckCircle, Circle, Edit, Filter, Minus, MoreHorizontal, Plus, PlusCircle, Save, Search, Trash2, User, Users, Wallet, X, XCircle } from "lucide-react";
import "motion/react";
import React__default, { useEffect, useState } from "react";
import { useForm as useForm$1 } from "react-hook-form";
import "react-hot-toast";
import "react-icons/bs";
import "react-icons/fa";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import "tailwind-merge";
import { z } from "zod";
import "./Alert-3s5DZB4H.js";
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
import { F as Form, d as FormControl, e as FormDescription, a as FormField, b as FormItem, c as FormLabel, f as FormMessage } from "./Form-dg4L2iRR.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import "./Label-BxDBN09D.js";
import { A as AuthenticatedLayout, B as BaseLayout, M as Main } from "./Main-BjCbeyG1.js";
import { S as Select, c as SelectContent, d as SelectItem, a as SelectTrigger, b as SelectValue } from "./MarketGrid-DlkazA02.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
import { P as Pagination } from "./Pagination-CFo-75Wy.js";
import "./PaginationWrapper-B-KWAp7V.js";
import { P as Popover, b as PopoverContent, a as PopoverTrigger } from "./Popover-Ckus2dfK.js";
import "./Progress-DT6CA82_.js";
import { C as Command, c as CommandGroup, a as CommandInput, d as CommandItem, b as CommandList, m as Dialog, n as DialogContent, q as DialogDescription, o as DialogHeader, p as DialogTitle, D as DropdownMenu, f as DropdownMenuContent, i as DropdownMenuItem, g as DropdownMenuLabel, h as DropdownMenuSeparator, j as DropdownMenuSub, l as DropdownMenuSubContent, k as DropdownMenuSubTrigger, e as DropdownMenuTrigger } from "./Sheet-B-_2BaZp.js";
import "./SlideUp-CpffxXZf.js";
import { T as Table, d as TableBody, e as TableCell, c as TableHead, a as TableHeader, b as TableRow } from "./Table-Dz-EvWd_.js";
import "./TradeDialog-Dt4WEyMP.js";
import { e as getUserDeleteDialogConfig, f as getUsersBreadcrumbItems, d as getUserStats, h as handleWalletAdjustment, l as onUserBulkAction, i as onUserDelete, k as onUserFilterChange, j as onUserSearch, c as onUserStatusUpdate, u as userFilterOptions } from "./UserController-CXMhOV3I.js";
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
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-blue-700 dark:text-blue-300", children: "Total Users" }),
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
const walletSchema = z.object({
  user_id: z.number(),
  amount: z.string().min(1, "Amount is required"),
  type: z.enum(["plus", "minus"]),
  remarks: z.string().optional()
});
function WalletDialog({ open, onOpenChange, user }) {
  const { loading: isSubmitting, errors: serverErrors, submit } = useForm();
  const form = useForm$1({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      user_id: user?.id || 0,
      amount: "",
      type: "plus",
      remarks: ""
    }
  });
  React__default.useEffect(() => {
    if (user) {
      form.reset({
        user_id: user.id,
        amount: "",
        type: "plus",
        remarks: ""
      });
    }
  }, [user, form]);
  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };
  const watchType = form.watch("type");
  return /* @__PURE__ */ jsx(Dialog, {
    open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, {
      className: "sm:max-w-[500px]", children: [
    /* @__PURE__ */ jsxs(DialogHeader, {
        children: [
      /* @__PURE__ */ jsxs(DialogTitle, {
          className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Wallet, { className: "w-5 h-5 text-green-600" }),
            "Manage Wallet"
          ]
        }),
      /* @__PURE__ */ jsxs(DialogDescription, {
          children: [
            "Adjust wallet balance for ",
            user?.name,
            ". Current balance: ",
            user?.wallet?.balance || 0
          ]
        })
        ]
      }),
    /* @__PURE__ */ jsx(Form, {
        ...form, children: /* @__PURE__ */ jsxs(
          "form",
          {
            onSubmit: form.handleSubmit(
              (data) => handleWalletAdjustment(data, submit, handleClose)
            ),
            className: "space-y-4",
            children: [
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "type",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Transaction Type" }),
                /* @__PURE__ */ jsxs(Select, {
                    onValueChange: field.onChange, defaultValue: field.value, children: [
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select transaction type" }) }) }),
                  /* @__PURE__ */ jsxs(SelectContent, {
                      children: [
                    /* @__PURE__ */ jsx(SelectItem, {
                        value: "plus", children: /* @__PURE__ */ jsxs("div", {
                          className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 text-green-600" }),
                            "Add Balance"
                          ]
                        })
                      }),
                    /* @__PURE__ */ jsx(SelectItem, {
                        value: "minus", children: /* @__PURE__ */ jsxs("div", {
                          className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(Minus, { className: "w-4 h-4 text-red-600" }),
                            "Subtract Balance"
                          ]
                        })
                      })
                      ]
                    })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "amount",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Amount" }),
                /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "number",
                        step: "0.01",
                        placeholder: "Enter amount",
                        ...field
                      }
                    )
                  }),
                /* @__PURE__ */ jsxs(FormDescription, {
                    children: [
                      "Enter the amount to ",
                      watchType === "add" ? "add to" : "subtract from",
                      " the wallet"
                    ]
                  }),
                /* @__PURE__ */ jsx(FormMessage, {}),
                    serverErrors?.amount && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.amount })
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "remarks",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Remarks (Optional)" }),
                /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsx(
                      Textarea,
                      {
                        placeholder: "Enter transaction remarks...",
                        rows: 3,
                        ...field
                      }
                    )
                  }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Add a note about this transaction" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsxs("div", {
              className: "flex gap-3 pt-4", children: [
            /* @__PURE__ */ jsx(Button, {
                type: "submit", disabled: isSubmitting, className: "flex-1", children: /* @__PURE__ */ jsx(
                  ButtonLoader,
                  {
                    isSubmitting,
                    btnText: "Save",
                    loaderText: "Processing...",
                    icon: /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" })
                  }
                )
              }),
            /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: handleClose,
                  disabled: isSubmitting,
                  children: "Cancel"
                }
              )
              ]
            })
            ]
          }
        )
      })
      ]
    })
  });
}
const TableActions = ({ item, onDelete, onOpenWallet }) => {
  const { submit } = useForm();
  const handleEdit = () => {
    router.visit(route("admin.users.edit", item.id));
  };
  const handleDelete = () => {
    onDelete(item.id);
  };
  const handleStatusUpdate = (newStatus) => {
    onUserStatusUpdate(item, newStatus, submit);
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
          onClick: () => onOpenWallet(item),
          className: "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100",
          children: [
            /* @__PURE__ */ jsx(Wallet, { className: "w-4 h-4 mr-2 text-green-600 dark:text-green-500" }),
            "Manage Wallet"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        DropdownMenuItem,
        {
          onClick: handleEdit,
          className: "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100",
          children: [
            /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4 mr-2 text-blue-600 dark:text-blue-500" }),
            "Edit User"
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
            "Delete User"
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
const UserTable = ({
  users = [],
  onDelete,
  handleBulkAction,
  bulkAction,
  setBulkAction,
  bulkActionLoader = false
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(users.map((u) => u.id));
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
  }, [users, setBulkAction]);
  const handleBulkActionApply = (selectedIds, action) => {
    handleBulkAction(selectedIds, action);
    clearSelection();
    setShowBulkDialog(false);
  };
  const clearSelection = () => {
    setSelectedItems([]);
  };
  const handleOpenWallet = (user) => {
    setSelectedUser(user);
    setShowWalletDialog(true);
  };
  const bulkActionConfig = {
    title: "Bulk User Actions",
    description: `Apply an action to ${selectedItems.length} selected users.`,
    actions: [
      {
        value: "active",
        label: "Activate Selected",
        icon: CheckCircle,
        description: "Make selected users active"
      },
      {
        value: "inactive",
        label: "Deactivate Selected",
        icon: XCircle,
        description: "Make selected users inactive"
      },
      {
        value: "delete",
        label: "Delete Selected",
        icon: AlertTriangle,
        description: "Permanently remove selected users"
      }
    ],
    warningMessage: `This action will affect ${selectedItems.length} users. This action cannot be undone.`,
    showWarningAlert: true
  };
  if (users.length === 0) {
    return /* @__PURE__ */ jsx(
      EmptyTableState,
      {
        icon: Users,
        title: "No users found",
        description: "No users available. Create your first user to get started."
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
        entityName: "user",
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
                      checked: selectedItems.length === users.length && users.length > 0,
                      onCheckedChange: handleSelectAll,
                      className: "border-gray-300 dark:border-gray-600"
                    }
                  )
                }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "ID" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "User" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Contact" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Wallet Balance" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Status" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Created" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-300", children: "Actions" })
                ]
              })
            }),
      /* @__PURE__ */ jsx(TableBody, {
              className: "bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700", children: users?.map((item, index) => /* @__PURE__ */ jsxs(TableRow, {
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
                    className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", {
                      className: "flex-shrink-0", children: item.img_url ? /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: item.img_url,
                          alt: item.name,
                          className: "object-cover w-10 h-10 border rounded-full"
                        }
                      ) : /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-10 h-10 bg-gray-100 border rounded-full dark:bg-gray-700", children: /* @__PURE__ */ jsx(User, { className: "w-5 h-5 text-gray-400" }) })
                    }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-900 truncate dark:text-gray-100", children: item.name }) })
                    ]
                  })
                }),
        /* @__PURE__ */ jsx(TableCell, {
                  className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", {
                    className: "space-y-1", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-900 dark:text-gray-100", children: item.email }),
                      item.phone && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400", children: item.phone })
                    ]
                  })
                }),
        /* @__PURE__ */ jsx(TableCell, {
                  className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Wallet, { className: "w-4 h-4 text-green-600" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: item.wallet?.balance_with_currency || 0 })
                    ]
                  })
                }),
        /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx(StatusBadge, { status: item.status }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4 text-sm text-gray-500 dark:text-gray-400", children: item.created_at }),
        /* @__PURE__ */ jsx(TableCell, {
                  className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsx(
                    TableActions,
                    {
                      item,
                      onDelete,
                      onOpenWallet: handleOpenWallet
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
    ),
    /* @__PURE__ */ jsx(
      WalletDialog,
      {
        open: showWalletDialog,
        onOpenChange: setShowWalletDialog,
        user: selectedUser
      }
    )
    ]
  });
};
function Index({
  title,
  users = [],
  search = "",
  filters = {}
}) {
  const { meta, links } = users;
  const { loading: bulkActionLoader, submit } = useForm();
  users = users?.data?.data || [];
  const [searchTerm, setSearchTerm] = useState(search);
  const [activeFilters, setActiveFilters] = useState(convertFiltersToArrayFormat(filters));
  const [selectedItems, setSelectedItems] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const currentData = users;
  useEffect(() => {
    setSearchTerm(search);
    setActiveFilters(convertFiltersToArrayFormat(filters));
  }, [search, filters]);
  const filterOptions = userFilterOptions();
  const breadcrumbItems = getUsersBreadcrumbItems();
  const stats = getUserStats(currentData);
  const handleSearch = (searchValue) => {
    onUserSearch(searchValue, setSearchTerm);
  };
  const handleFilterChange = (newFilters) => {
    onUserFilterChange(newFilters, filterOptions, setActiveFilters, setSearchTerm);
  };
  const handleDeleteUser = (id) => {
    const userToDelete = currentData?.find((user) => user.id === id);
    if (userToDelete) {
      setDeletingUser(userToDelete);
      setShowDeleteDialog(true);
    }
  };
  const handleBulkAction = (selectedIds, action) => {
    if (action && selectedIds.length > 0) {
      onUserBulkAction(selectedIds, action, submit);
      setSelectedItems([]);
      setBulkAction("");
    }
  };
  const handleCreateUser = () => {
    router.visit(route("admin.users.create"));
  };
  const deleteDialogConfig = getUserDeleteDialogConfig(deletingUser);
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
            title: "Users",
            description: "Manage user accounts and permissions",
            icon: Users,
            stats,
            primaryAction: {
              label: "Add User",
              icon: PlusCircle,
              onClick: handleCreateUser,
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
            placeholder: `Search by name, email...`,
            filterOptions,
            showDateRange: true
          }
        ),
      /* @__PURE__ */ jsx("div", {
          className: "space-y-6", children: /* @__PURE__ */ jsx(
            UserTable,
            {
              users: currentData || [],
              selectedItems,
              setSelectedItems,
              bulkAction,
              setBulkAction,
              handleBulkAction,
              onDelete: handleDeleteUser,
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
          deleteDialogConfig && /* @__PURE__ */ jsx(
            DeleteDialog,
            {
              open: showDeleteDialog,
              onOpenChange: setShowDeleteDialog,
              item: deletingUser,
              config: deleteDialogConfig,
              onDelete: onUserDelete
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


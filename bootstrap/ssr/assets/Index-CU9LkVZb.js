import { zodResolver } from "@hookform/resolvers/zod";
import { Head } from "@inertiajs/react";
import "@radix-ui/react-accordion";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-avatar";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-dialog";
import "@radix-ui/react-direction";
import "@radix-ui/react-dropdown-menu";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
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
import { Check, CheckCircle, Circle, Edit, GripVertical, Info, Link2, List, Menu, MoreHorizontal, Plus, PlusCircle, Search, Settings, Star, Trash2, X, XCircle } from "lucide-react";
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
import "./Breadcrumb-D0MBns-9.js";
import { B as Button, l as limitText } from "./Button-CFMlPXiE.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./Card-CQ2ij0--.js";
import { C as CommonLayoutHeader } from "./CommonLayoutHeader-CyKOpByu.js";
import { T as Textarea } from "./constants-4k_q_jeE.js";
import { D as DeleteDialog } from "./DeleteDialog-DBDDlwO7.js";
import "./demo-data-C5EGh9Nk.js";
import "./EmptyData-DjqqIMwS.js";
import { E as EmptyTableState } from "./EmptyTableState-C7sYsPjb.js";
import { F as Form, d as FormControl, a as FormField, b as FormItem, c as FormLabel, f as FormMessage } from "./Form-dg4L2iRR.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import "./Label-BxDBN09D.js";
import { A as AuthenticatedLayout, B as BaseLayout, M as Main } from "./Main-BjCbeyG1.js";
import "./MarketGrid-DlkazA02.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
import "./PaginationWrapper-B-KWAp7V.js";
import "./Progress-DT6CA82_.js";
import { m as Dialog, n as DialogContent, q as DialogDescription, o as DialogHeader, p as DialogTitle, D as DropdownMenu, f as DropdownMenuContent, i as DropdownMenuItem, g as DropdownMenuLabel, h as DropdownMenuSeparator, j as DropdownMenuSub, l as DropdownMenuSubContent, k as DropdownMenuSubTrigger, e as DropdownMenuTrigger } from "./Sheet-B-_2BaZp.js";
import "./SlideUp-CpffxXZf.js";
import { T as Table, d as TableBody, e as TableCell, c as TableHead, a as TableHeader, b as TableRow } from "./Table-Dz-EvWd_.js";
import "./TradeDialog-Dt4WEyMP.js";
const setMenusFilterData = (menus, searchTerm, setFilteredMenus) => {
  let filtered = menus?.data || [];
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filtered = filtered.filter((menu) => {
      return menu?.title.toLowerCase().includes(searchLower);
    });
  }
  setFilteredMenus(filtered);
};
const getMenuDeleteDialogConfig = (menu) => {
  return {
    title: `Delete  Menu`,
    description: `Are you sure you want to delete this Menu? This action cannot be undone and may affect user support experience.`,
    itemName: menu?.title,
    itemType: "Menu",
    warningMessage: `Deleting this Menu will permanently remove it and may reduce the availability of helpful answers for users.`,
    showWarningAlert: true,
    showItemDetails: true,
    itemDisplayFields: [
      {
        label: `Title`,
        key: "title",
        className: "font-semibold text-gray-900 dark:text-gray-100"
      },
      {
        label: "Slug",
        key: "slug",
        className: "text-gray-600 dark:text-gray-400"
      },
      {
        label: "Status",
        key: "status",
        render: (status) => React__default.createElement(
          "span",
          {
            className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"}`
          },
          status
        )
      },
      {
        label: "Created",
        key: "created_at",
        className: "text-gray-600 dark:text-gray-400"
      }
    ],
    specialWarnings: [
      {
        condition: (menu2) => menu2?.status === "active",
        title: `Active Menu`,
        message: `This Menu is currently active and visible to users. Consider deactivating it first before deletion.`,
        alertClass: "border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800",
        iconClass: "text-blue-600 dark:text-blue-400",
        textClass: "text-blue-800 dark:text-blue-200"
      }
    ]
  };
};
const getMenuStats = (menus) => {
  const data = menus || [];
  return {
    total: data.length,
    active: data.filter((menu) => menu.status === "active").length,
    inactive: data.filter((menu) => menu.status === "inactive").length
  };
};
const getMenusBreadcrumbItems = () => {
  return [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Menus", href: null }
  ];
};
const handleSaveMenu = async (data, submit, handleClose, menu = null) => {
  try {
    await submit({
      method: "POST",
      url: menu && menu?.id ? route("admin.menu.update", menu.id) + "?_method=PATCH" : route("admin.menu.store"),
      data
    });
    handleClose();
  } catch (error) {
  }
};
const onMenuDelete = async (id, submit, handleClose) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.menu.destroy", id) + "?_method=DELETE"
    });
    handleClose();
  } catch (error) {
  }
};
const onMenuStatusUpdate = async (menu, newStatus, submit) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.menu.update.status"),
      data: { id: menu.id, value: newStatus }
    });
  } catch (error) {
  }
};
function OverviewCard({ stats }) {
  return /* @__PURE__ */ jsxs("div", {
    className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: [
    /* @__PURE__ */ jsx(Card, {
      className: "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800", children: /* @__PURE__ */ jsx(CardContent, {
        className: "p-6", children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg dark:bg-blue-900", children: /* @__PURE__ */ jsx(QuestionMarkCircledIcon, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }) }),
      /* @__PURE__ */ jsxs("div", {
            children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-blue-700 dark:text-blue-300", children: "Total Menus" }),
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
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold truncate sm:text-base", children: "Search Menu" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs truncate text-muted-foreground", children: "Find items instantly" })
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
const AVAILABLE_SECTIONS = [
  { key: "hero", label: "Hero Section", icon: "🎯", description: "Main hero banner with CTA" },
  { key: "market", label: "Market Section", icon: "📊", description: "Market overview and stats" },
  { key: "how_it_works", label: "How It Works", icon: "⚙️", description: "Step-by-step guide" },
  { key: "leaderboard", label: "Leaderboard", icon: "🏆", description: "Top performers ranking" },
  { key: "faq", label: "FAQ Section", icon: "❓", description: "Frequently asked questions" },
  { key: "blogs", label: "Blog Section", icon: "📝", description: "Latest blog posts" },
  { key: "newsletter", label: "Newsletter", icon: "📧", description: "Email subscription" },
  { key: "contact_us", label: "Contact Us", icon: "📞", description: "Contact information" }
];
const menuSchema = z.object({
  title: z.string().min(1, "Title is required").max(191, "Title must be less than 191 characters"),
  order: z.number().min(0, "Order must be a positive number").optional().or(z.literal("")),
  meta_title: z.string().optional().or(z.literal("")),
  meta_description: z.string().optional().or(z.literal("")),
  meta_keywords: z.string().optional().or(z.literal("")),
  is_default: z.boolean().optional()
});
function MenuDialog({ open, onOpenChange, menu = null, mode = "create" }) {
  const { loading: isSubmitting, submit } = useForm();
  const isEditing = mode === "edit" && menu;
  const [selectedSections, setSelectedSections] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const form = useForm$1({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      title: "",
      order: 0,
      meta_title: "",
      meta_description: "",
      meta_keywords: ""
    }
  });
  React__default.useEffect(() => {
    if (open && menu && mode === "edit") {
      form.reset({
        title: menu?.title || "",
        order: menu?.order || 1,
        meta_title: menu?.meta_data?.meta_title || "",
        meta_description: menu?.meta_data?.meta_description || "",
        meta_keywords: menu?.meta_data?.meta_keywords || ""
      });
      setSelectedSections(menu?.sections || []);
    } else if (open && mode === "create") {
      form.reset({
        title: "",
        order: 1,
        meta_title: "",
        meta_description: "",
        meta_keywords: ""
      });
      setSelectedSections([]);
    }
  }, [open, menu, mode]);
  const handleClose = () => {
    form.reset();
    setSelectedSections([]);
    onOpenChange(false);
  };
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setSelectedSections((prev) => {
      const newSections = [...prev];
      const draggedItem = newSections[draggedIndex];
      newSections.splice(draggedIndex, 1);
      newSections.splice(index, 0, draggedItem);
      return newSections;
    });
    setDraggedIndex(index);
  };
  const handleDragEnd = () => {
    setDraggedIndex(null);
  };
  const toggleSection = (sectionKey, e) => {
    e.stopPropagation();
    setSelectedSections((prev) => {
      if (prev.includes(sectionKey)) {
        return prev.filter((s) => s !== sectionKey);
      }
      return [...prev, sectionKey];
    });
  };
  const removeSection = (sectionKey, e) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedSections((prev) => prev.filter((s) => s !== sectionKey));
  };
  const onSubmit = (data) => {
    const formData = {
      ...data,
      sections: selectedSections,
      meta_data: {
        meta_title: data.meta_title || "",
        meta_description: data.meta_description || "",
        meta_keywords: data.meta_keywords || ""
      }
    };
    handleSaveMenu(formData, submit, handleClose, menu);
  };
  return /* @__PURE__ */ jsx(Dialog, {
    open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxs(DialogContent, {
      className: "w-full max-w-[95vw] sm:max-w-[900px] max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxs(DialogHeader, {
        children: [
      /* @__PURE__ */ jsx(DialogTitle, {
          className: "flex items-center gap-2 pr-8", children: isEditing ? /* @__PURE__ */ jsxs(Fragment, {
            children: [
        /* @__PURE__ */ jsx(Edit, { className: "w-5 h-5" }),
              "Update Menu"
            ]
          }) : /* @__PURE__ */ jsxs(Fragment, {
            children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5" }),
              "Create Menu"
            ]
          })
        }),
      /* @__PURE__ */ jsx(DialogDescription, { children: isEditing ? "Edit menu details and configure page sections." : "Create a new menu and configure which sections to display." })
        ]
      }),
    /* @__PURE__ */ jsxs("div", {
        className: "space-y-6 max-h-[60vh] overflow-y-auto px-1", children: [
      /* @__PURE__ */ jsxs(Alert, {
          className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
        /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsxs(AlertDescription, {
            children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Menu Management" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm", children: "Configure menu settings and drag sections to reorder them. Only one menu can be set as default." })
            ]
          })
          ]
        }),
      /* @__PURE__ */ jsx(Form, {
          ...form, children: /* @__PURE__ */ jsxs("div", {
            className: "space-y-6", children: [
        /* @__PURE__ */ jsxs(Card, {
              children: [
          /* @__PURE__ */ jsx(CardHeader, {
                children: /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(List, { className: "w-5 h-5 text-blue-500" }),
            /* @__PURE__ */ jsx(CardTitle, { children: "Basic Information" })
                  ]
                })
              }),
          /* @__PURE__ */ jsxs(CardContent, {
                className: "space-y-4", children: [
            /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "title",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                      children: [
                  /* @__PURE__ */ jsxs(FormLabel, {
                        children: [
                          "Menu Title ",
                    /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Required" })
                        ]
                      }),
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "e.g., Home, About, Services", ...field }) }),
                  /* @__PURE__ */ jsx(FormMessage, {})
                      ]
                    })
                  }
                ),
            /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "order",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                      children: [
                  /* @__PURE__ */ jsx(FormLabel, { children: "Menu Order" }),
                  /* @__PURE__ */ jsx(FormControl, {
                        children: /* @__PURE__ */ jsx(
                          Input,
                          {
                            type: "number",
                            placeholder: "e.g., 0, 1, 2",
                            ...field,
                            onChange: (e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)
                          }
                        )
                      }),
                  /* @__PURE__ */ jsx(FormMessage, {})
                      ]
                    })
                  }
                )
                ]
              })
              ]
            }),
        /* @__PURE__ */ jsxs(Card, {
              children: [
          /* @__PURE__ */ jsx(CardHeader, {
                children: /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Settings, { className: "w-5 h-5 text-purple-500" }),
            /* @__PURE__ */ jsx(CardTitle, { children: "SEO Meta Data" })
                  ]
                })
              }),
          /* @__PURE__ */ jsxs(CardContent, {
                className: "space-y-4", children: [
            /* @__PURE__ */ jsx(FormField, {
                  control: form.control, name: "meta_title", render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                    children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Meta Title" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "SEO optimized title", ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
                    ]
                  })
                }),
            /* @__PURE__ */ jsx(FormField, {
                  control: form.control, name: "meta_description", render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                    children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Meta Description" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Textarea, { placeholder: "Brief description for search engines", className: "min-h-[80px]", ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
                    ]
                  })
                }),
            /* @__PURE__ */ jsx(FormField, {
                  control: form.control, name: "meta_keywords", render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                    children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Meta Keywords" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "keyword1, keyword2, keyword3", ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
                    ]
                  })
                })
                ]
              })
              ]
            }),
        /* @__PURE__ */ jsxs(Card, {
              children: [
          /* @__PURE__ */ jsxs(CardHeader, {
                children: [
            /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(GripVertical, { className: "w-5 h-5 text-green-500" }),
                /* @__PURE__ */ jsx(CardTitle, { children: "Page Sections" })
                    ]
                  }),
              /* @__PURE__ */ jsxs(Badge, {
                    variant: "outline", children: [
                      selectedSections.length,
                      " selected"
                    ]
                  })
                  ]
                }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Select and drag sections to reorder them" })
                ]
              }),
          /* @__PURE__ */ jsxs(CardContent, {
                children: [
                  selectedSections.length > 0 && /* @__PURE__ */ jsxs("div", {
                    className: "mb-6 space-y-2", children: [
              /* @__PURE__ */ jsx("p", { className: "mb-3 text-sm font-medium", children: "Selected Sections (Drag to reorder)" }),
                      selectedSections.map((sectionKey, index) => {
                        const section = AVAILABLE_SECTIONS.find((s) => s.key === sectionKey);
                        if (!section) return null;
                        return /* @__PURE__ */ jsxs(
                          "div",
                          {
                            draggable: true,
                            onDragStart: (e) => handleDragStart(e, index),
                            onDragOver: (e) => handleDragOver(e, index),
                            onDragEnd: handleDragEnd,
                            className: `flex items-center justify-between p-3 border rounded-lg cursor-move transition-all ${draggedIndex === index ? "opacity-50 bg-blue-100 border-blue-300 dark:bg-blue-900/20" : "bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"}`,
                            children: [
                      /* @__PURE__ */ jsxs("div", {
                              className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsx(GripVertical, { className: "w-4 h-4 text-gray-400" }),
                        /* @__PURE__ */ jsx("span", { className: "text-2xl", children: section.icon }),
                        /* @__PURE__ */ jsxs("div", {
                                children: [
                          /* @__PURE__ */ jsx("p", { className: "font-medium", children: section.label }),
                          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: section.description })
                                ]
                              })
                              ]
                            }),
                      /* @__PURE__ */ jsxs("div", {
                              className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxs(Badge, {
                                variant: "secondary", children: [
                                  "#",
                                  index + 1
                                ]
                              }),
                        /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: (e) => removeSection(sectionKey, e), className: "text-red-500 hover:text-red-700 hover:bg-red-50", children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
                              ]
                            })
                            ]
                          },
                          sectionKey
                        );
                      })
                    ]
                  }),
            /* @__PURE__ */ jsxs("div", {
                    className: "space-y-2", children: [
              /* @__PURE__ */ jsx("p", { className: "mb-3 text-sm font-medium", children: "Available Sections" }),
              /* @__PURE__ */ jsx("div", {
                      className: "grid gap-2", children: AVAILABLE_SECTIONS.map((section) => {
                        const isSelected = selectedSections.includes(section.key);
                        return /* @__PURE__ */ jsxs(
                          "div",
                          {
                            onClick: (e) => toggleSection(section.key, e),
                            className: `flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${isSelected ? "bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`,
                            children: [
                      /* @__PURE__ */ jsx(
                              "button",
                              {
                                type: "button",
                                className: `w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600"}`,
                                children: isSelected && /* @__PURE__ */ jsx(Check, { className: "w-3 h-3 text-white" })
                              }
                            ),
                      /* @__PURE__ */ jsx("span", { className: "text-2xl", children: section.icon }),
                      /* @__PURE__ */ jsxs("div", {
                              className: "flex-1", children: [
                        /* @__PURE__ */ jsx("p", { className: "font-medium", children: section.label }),
                        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: section.description })
                              ]
                            }),
                              isSelected && /* @__PURE__ */ jsxs(Badge, {
                                variant: "secondary", children: [
                                  "#",
                                  selectedSections.indexOf(section.key) + 1
                                ]
                              })
                            ]
                          },
                          section.key
                        );
                      })
                    })
                    ]
                  })
                ]
              })
              ]
            })
            ]
          })
        })
        ]
      }),
    /* @__PURE__ */ jsxs("div", {
        className: "sticky bottom-0 flex flex-col justify-end gap-3 pt-6 bg-white border-t sm:flex-row dark:bg-gray-950", children: [
      /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: handleClose, disabled: isSubmitting, className: "w-full sm:w-auto", children: "Cancel" }),
      /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isSubmitting, className: "w-full sm:w-auto", onClick: form.handleSubmit(onSubmit), children: /* @__PURE__ */ jsx(ButtonLoader, { isSubmitting, btnText: isEditing ? "Update Menu" : "Create Menu", loaderText: isEditing ? "Updating..." : "Creating..." }) })
        ]
      })
      ]
    })
  });
}
const TableActions = ({ menu, onEdit, onDelete }) => {
  const { submit } = useForm();
  const handleEdit = () => {
    onEdit(menu);
  };
  const handleDelete = () => {
    onDelete(menu);
  };
  const handleStatusUpdate = (newStatus) => {
    onMenuStatusUpdate(menu, newStatus, submit);
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
            "Edit Menu"
          ]
        }
      ),
        !menu.is_default && /* @__PURE__ */ jsxs(DropdownMenuSub, {
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
                disabled: menu.status === "active",
                children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 mr-2 text-green-600" }),
                  "Active",
                  menu.status === "active" && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "ml-auto text-xs", children: "Current" })
                ]
              }
            ),
          /* @__PURE__ */ jsxs(
              DropdownMenuItem,
              {
                onClick: () => handleStatusUpdate("inactive"),
                disabled: menu.status === "inactive",
                children: [
                /* @__PURE__ */ jsx(XCircle, { className: "w-4 h-4 mr-2 text-gray-500" }),
                  "Inactive",
                  menu.status === "inactive" && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "ml-auto text-xs", children: "Current" })
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
            disabled: menu.is_default,
            children: [
            /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4 mr-2" }),
              menu.is_default ? "Cannot Delete Default" : "Delete Menu"
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
const DefaultBadge = ({ isDefault }) => {
  if (!isDefault) return null;
  return /* @__PURE__ */ jsxs(
    Badge,
    {
      variant: "outline",
      className: "text-xs text-yellow-700 border-yellow-200 dark:text-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
      children: [
        /* @__PURE__ */ jsx(Star, { className: "w-3 h-3 mr-1 fill-yellow-600" }),
        "Default"
      ]
    }
  );
};
const SectionsBadge = ({ sections = [] }) => {
  if (!sections || sections.length === 0) {
    return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "No sections" });
  }
  return /* @__PURE__ */ jsx("div", {
    className: "flex flex-wrap gap-1", children: /* @__PURE__ */ jsxs(Badge, {
      variant: "secondary", className: "text-xs", children: [
        sections.length,
        " ",
        sections.length === 1 ? "section" : "sections"
      ]
    })
  });
};
const MenuTable = ({ menus = [], onEdit, onDelete }) => {
  if (menus.length === 0) {
    return /* @__PURE__ */ jsx(
      EmptyTableState,
      {
        icon: List,
        title: "No menus found",
        description: "No menus available. Create your first menu to get started."
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
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Order" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Menu Title" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Slug" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Sections" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Status" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Created" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-300", children: "Actions" })
              ]
            })
          }),
    /* @__PURE__ */ jsx(TableBody, {
            className: "bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700", children: menus?.map((menu, index) => /* @__PURE__ */ jsxs(TableRow, {
              className: "transition-colors hover:bg-gray-50 dark:hover:bg-gray-800", children: [
      /* @__PURE__ */ jsxs(TableCell, {
                className: "px-6 py-4  text-gray-700 dark:text-gray-300", children: [
                  "#",
                  index + 1
                ]
              }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900 dark:text-gray-100", children: menu.order || index + 1 }) }),
      /* @__PURE__ */ jsx(TableCell, {
                className: "px-6 py-4", children: /* @__PURE__ */ jsx("div", {
                  className: "flex flex-col gap-2", children: /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: limitText(menu.title, 30) }),
        /* @__PURE__ */ jsx(DefaultBadge, { isDefault: menu.is_default })
                    ]
                  })
                })
              }),
      /* @__PURE__ */ jsx(TableCell, {
                className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400", children: [
        /* @__PURE__ */ jsx(Link2, { className: "w-3 h-3" }),
        /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: route("home", menu.slug),
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "max-w-xs text-sm text-blue-600 truncate hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300",
                      children: /* @__PURE__ */ jsxs("code", {
                        className: "text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded", children: [
                          "/",
                          menu.slug
                        ]
                      })
                    }
                  )
                  ]
                })
              }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx(SectionsBadge, { sections: menu.sections }) }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx(StatusBadge, { status: menu.status }) }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4 text-sm text-gray-500 dark:text-gray-400", children: menu.created_at }),
      /* @__PURE__ */ jsx(TableCell, {
                className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsx(
                  TableActions,
                  {
                    menu,
                    onEdit,
                    onDelete
                  }
                )
              })
              ]
            }, `${menu.id}-${index}`))
          })
          ]
        })
      })
    })
  });
};
function Index({
  title,
  menus = []
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMenus, setFilteredMenus] = useState(menus?.data || []);
  const stats = getMenuStats(menus?.data || []);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  useEffect(() => {
    setMenusFilterData(menus, searchTerm, setFilteredMenus);
  }, [searchTerm, menus]);
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };
  const handleAddMenu = () => {
    setSelectedMenu(null);
    setShowAddDialog(true);
  };
  const handleEditMenu = (menu) => {
    setSelectedMenu(menu);
    setShowEditDialog(true);
  };
  const handleDelete = (menu) => {
    setSelectedMenu(menu);
    setShowDeleteDialog(true);
  };
  const deleteDialogConfig = getMenuDeleteDialogConfig(selectedMenu);
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
            breadcrumbItems: getMenusBreadcrumbItems(),
            title: "Menus",
            description: "Manage website menus and configure page sections to control your site's navigation and layout",
            icon: Menu,
            stats,
            primaryAction: {
              label: "Add Menu",
              icon: PlusCircle,
              onClick: handleAddMenu,
              variant: "default"
            }
          }
        ),
      /* @__PURE__ */ jsx(
          OverviewCard,
          {
            stats
          }
        ),
      /* @__PURE__ */ jsx(
          SimpleSearchBox,
          {
            searchTerm,
            onSearchChange: handleSearch,
            placeholder: "Search by title ..."
          }
        ),
      /* @__PURE__ */ jsx("div", {
          className: "space-y-6", children: /* @__PURE__ */ jsx(
            MenuTable,
            {
              menus: filteredMenus,
              onEdit: handleEditMenu,
              onDelete: handleDelete
            }
          )
        }),
      /* @__PURE__ */ jsx(
          MenuDialog,
          {
            open: showAddDialog || showEditDialog,
            onOpenChange: showAddDialog ? setShowAddDialog : setShowEditDialog,
            mode: showAddDialog ? "create" : "edit",
            menu: selectedMenu
          }
        ),
          deleteDialogConfig && /* @__PURE__ */ jsx(
            DeleteDialog,
            {
              open: showDeleteDialog,
              onOpenChange: setShowDeleteDialog,
              item: selectedMenu,
              config: deleteDialogConfig,
              onDelete: onMenuDelete
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


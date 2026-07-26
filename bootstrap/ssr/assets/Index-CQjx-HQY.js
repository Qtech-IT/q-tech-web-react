import { zodResolver } from "@hookform/resolvers/zod";
import { Head } from "@inertiajs/react";
import "@radix-ui/react-accordion";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-avatar";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-dialog";
import "@radix-ui/react-direction";
import "@radix-ui/react-dropdown-menu";
import { QuestionMarkCircledIcon, QuestionMarkIcon } from "@radix-ui/react-icons";
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
import { CheckCircle, Circle, Edit, FileQuestionIcon, HelpCircle, Info, MoreHorizontal, Plus, PlusCircle, Search, Trash2, X, XCircle } from "lucide-react";
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
const setFaqsFilterData = (faqs, searchTerm, setFilteredFaqs) => {
  let filtered = faqs?.data || [];
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filtered = filtered.filter((faq) => {
      return faq?.value?.question.toLowerCase().includes(searchLower);
    });
  }
  setFilteredFaqs(filtered);
};
const getFaqDeleteDialogConfig = (faq) => {
  return {
    title: `Delete FAQ`,
    description: `Are you sure you want to delete this FAQ? This action cannot be undone and may affect user support experience.`,
    itemName: faq?.question,
    itemType: "FAQ",
    warningMessage: `Deleting this FAQ will permanently remove it and may reduce the availability of helpful answers for users.`,
    showWarningAlert: true,
    showItemDetails: true,
    itemDisplayFields: [
      {
        label: `Question`,
        key: "question",
        className: "font-semibold text-gray-900 dark:text-gray-100"
      },
      {
        label: "Answer",
        key: "answer",
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
        condition: (faq2) => faq2?.status === "active",
        title: `Active FAQ`,
        message: `This FAQ is currently active and visible to users. Consider deactivating it first before deletion.`,
        alertClass: "border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800",
        iconClass: "text-blue-600 dark:text-blue-400",
        textClass: "text-blue-800 dark:text-blue-200"
      }
    ]
  };
};
const getFaqStats = (faqs) => {
  const data = faqs || [];
  return {
    total: data.length,
    active: data.filter((faq) => faq.status === "active").length,
    inactive: data.filter((faq) => faq.status === "inactive").length
  };
};
const getFaqsBreadcrumbItems = () => {
  return [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Faqs", href: null }
  ];
};
const handleSaveFaq = async (data, submit, handleClose, faq = null) => {
  try {
    await submit({
      method: "POST",
      url: faq && faq?.id ? route("admin.faqs.update", faq.id) + "?_method=PATCH" : route("admin.faqs.store"),
      data
    });
    handleClose();
  } catch (error) {
  }
};
const onFaqDelete = async (faqId, submit, handleClose) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.faqs.destroy", faqId) + "?_method=DELETE"
    });
    handleClose();
  } catch (error) {
  }
};
const onFaqStatusUpdate = async (faq, newStatus, submit) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.faqs.update.status"),
      data: { id: faq.id, value: newStatus }
    });
  } catch (error) {
  }
};
const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required")
});
function FaqDialog({
  open,
  onOpenChange,
  faq = null,
  mode = "create"
}) {
  const { loading: isSubmitting, submit } = useForm();
  const isEditing = mode === "edit" && faq;
  const defaultValues = {
    question: faq?.value?.question || "",
    answer: faq?.value?.answer || ""
  };
  const form = useForm$1({
    resolver: zodResolver(faqSchema),
    defaultValues
  });
  React__default.useEffect(() => {
    if (open && faq && mode === "edit") {
      form.reset({
        question: faq?.value?.question || "",
        answer: faq?.value?.answer || ""
      });
    } else if (open && mode === "create") {
      form.reset({
        question: "",
        answer: ""
      });
    }
  }, [open, faq, mode, form]);
  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };
  return /* @__PURE__ */ jsx(Dialog, {
    open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxs(DialogContent, {
      className: "w-full max-w-[95vw] sm:max-w-[700px] max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxs(DialogHeader, {
        children: [
      /* @__PURE__ */ jsx(DialogTitle, {
          className: "flex items-center gap-2 pr-8", children: isEditing ? /* @__PURE__ */ jsxs(Fragment, {
            children: [
        /* @__PURE__ */ jsx(Edit, { className: "w-5 h-5" }),
              "Update FAQ"
            ]
          }) : /* @__PURE__ */ jsxs(Fragment, {
            children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5" }),
              "Add FAQ"
            ]
          })
        }),
      /* @__PURE__ */ jsx(DialogDescription, { children: isEditing ? "Edit this FAQ entry to update its content." : "Create a new FAQ entry to help users find answers quickly." })
        ]
      }),
    /* @__PURE__ */ jsxs("div", {
        className: "space-y-6 max-h-[60vh] overflow-y-auto px-1", children: [
      /* @__PURE__ */ jsxs(Alert, {
          className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
        /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsxs(AlertDescription, {
            children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: "FAQ Management" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm", children: "Frequently Asked Questions help users quickly find relevant answers and reduce support requests." })
            ]
          })
          ]
        }),
      /* @__PURE__ */ jsx(Form, {
          ...form, children: /* @__PURE__ */ jsxs(
            "form",
            {
              onSubmit: form.handleSubmit(
                (data) => handleSaveFaq(data, submit, handleClose, faq)
              ),
              className: "space-y-6",
              children: [
            /* @__PURE__ */ jsxs(Card, {
                children: [
              /* @__PURE__ */ jsx(CardHeader, {
                  children: /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(HelpCircle, { className: "w-5 h-5 text-purple-500" }),
                /* @__PURE__ */ jsx(CardTitle, { children: "FAQ Question" })
                    ]
                  })
                }),
              /* @__PURE__ */ jsx(CardContent, {
                  children: /* @__PURE__ */ jsx(
                    FormField,
                    {
                      control: form.control,
                      name: "question",
                      render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                        children: [
                    /* @__PURE__ */ jsxs(FormLabel, {
                          children: [
                            "Question ",
                      /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Required" })
                          ]
                        }),
                    /* @__PURE__ */ jsx(FormControl, {
                          children: /* @__PURE__ */ jsx(
                            Input,
                            {
                              placeholder: "e.g., How do I reset my password?",
                              ...field
                            }
                          )
                        }),
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
              /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "FAQ Answer" }) }),
              /* @__PURE__ */ jsx(CardContent, {
                  children: /* @__PURE__ */ jsx(
                    FormField,
                    {
                      control: form.control,
                      name: "answer",
                      render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                        children: [
                    /* @__PURE__ */ jsxs(FormLabel, {
                          children: [
                            "Answer ",
                      /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Required" })
                          ]
                        }),
                    /* @__PURE__ */ jsx(FormControl, {
                          children: /* @__PURE__ */ jsx(
                            Textarea,
                            {
                              placeholder: "Provide a clear and helpful answer to the question...",
                              className: "min-h-[120px]",
                              ...field
                            }
                          )
                        }),
                    /* @__PURE__ */ jsx(FormMessage, {})
                        ]
                      })
                    }
                  )
                })
                ]
              })
              ]
            }
          )
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
            onClick: () => form.handleSubmit(
              (e) => handleSaveFaq(e, submit, handleClose, faq)
            )(),
            children: /* @__PURE__ */ jsx(
              ButtonLoader,
              {
                isSubmitting,
                btnText: isEditing ? "Update FAQ" : "Create FAQ",
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
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-blue-700 dark:text-blue-300", children: "Total FAQ" }),
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
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold truncate sm:text-base", children: "Search FAQ" }),
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
const TableActions = ({ faq, onEdit, onDelete }) => {
  const { submit } = useForm();
  const handleEdit = () => {
    onEdit(faq);
  };
  const handleDelete = () => {
    onDelete(faq);
  };
  const handleStatusUpdate = (newStatus) => {
    onFaqStatusUpdate(faq, newStatus, submit);
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
            "Edit faq"
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
              disabled: faq.status === "active",
              children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 mr-2 text-green-600" }),
                "Active",
                faq.status === "active" && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "ml-auto text-xs", children: "Current" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            DropdownMenuItem,
            {
              onClick: () => handleStatusUpdate("inactive"),
              disabled: faq.status === "inactive",
              children: [
                /* @__PURE__ */ jsx(XCircle, { className: "w-4 h-4 mr-2 text-gray-500" }),
                "Inactive",
                faq.status === "inactive" && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "ml-auto text-xs", children: "Current" })
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
            "Delete faq"
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
const FaqTable = ({ faqs = [], onEdit, onDelete }) => {
  if (faqs.length === 0) {
    return /* @__PURE__ */ jsx(
      EmptyTableState,
      {
        icon: FileQuestionIcon,
        title: "No faqs found",
        description: "No faqs available. Create your first faq to get started."
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
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Question" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Status" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Created" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-300", children: "Actions" })
              ]
            })
          }),
    /* @__PURE__ */ jsx(TableBody, {
            className: "bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700", children: faqs?.map((faq, index) => /* @__PURE__ */ jsxs(TableRow, {
              className: "transition-colors hover:bg-gray-50 dark:hover:bg-gray-800", children: [
      /* @__PURE__ */ jsxs(TableCell, {
                className: "px-6 py-4  text-gray-700 dark:text-gray-300", children: [
                  "#",
                  index + 1
                ]
              }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: limitText(faq.value.question, 20) }) }) }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx(StatusBadge, { status: faq.status }) }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4 text-sm text-gray-500 dark:text-gray-400", children: faq.created_at }),
      /* @__PURE__ */ jsx(TableCell, {
                className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsx(
                  TableActions,
                  {
                    faq,
                    onEdit,
                    onDelete
                  }
                )
              })
              ]
            }, `${faq.id}-${index}`))
          })
          ]
        })
      })
    })
  });
};
function Index({
  title,
  faqs = []
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState(faqs?.data || []);
  const stats = getFaqStats(faqs?.data || []);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  useEffect(() => {
    setFaqsFilterData(faqs, searchTerm, setFilteredFaqs);
  }, [searchTerm, faqs]);
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };
  const handleAddFaq = () => {
    setSelectedFaq(null);
    setShowAddDialog(true);
  };
  const handleEditFaq = (faq) => {
    setSelectedFaq(faq);
    setShowEditDialog(true);
  };
  const handleDelete = (faq) => {
    setSelectedFaq(faq);
    setShowDeleteDialog(true);
  };
  const deleteDialogConfig = getFaqDeleteDialogConfig(selectedFaq);
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
            breadcrumbItems: getFaqsBreadcrumbItems(),
            title: "FAQ",
            description: "Manage frequently asked questions to help users find answers quickly and easily",
            icon: QuestionMarkIcon,
            stats,
            primaryAction: {
              label: "Add FAQ",
              icon: PlusCircle,
              onClick: handleAddFaq,
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
            placeholder: "Search by question ..."
          }
        ),
      /* @__PURE__ */ jsx("div", {
          className: "space-y-6", children: /* @__PURE__ */ jsx(
            FaqTable,
            {
              faqs: filteredFaqs,
              onEdit: handleEditFaq,
              onDelete: handleDelete
            }
          )
        }),
      /* @__PURE__ */ jsx(
          FaqDialog,
          {
            open: showAddDialog || showEditDialog,
            onOpenChange: showAddDialog ? setShowAddDialog : setShowEditDialog,
            mode: showAddDialog ? "create" : "edit",
            faq: selectedFaq
          }
        ),
          deleteDialogConfig && /* @__PURE__ */ jsx(
            DeleteDialog,
            {
              open: showDeleteDialog,
              onOpenChange: setShowDeleteDialog,
              item: selectedFaq,
              config: deleteDialogConfig,
              onDelete: onFaqDelete
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


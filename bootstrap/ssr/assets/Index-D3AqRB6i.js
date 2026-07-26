import { zodResolver } from "@hookform/resolvers/zod";
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
import { ArrowLeftRight, CheckCircle, Circle, Edit, Globe, Info, Languages, MoreHorizontal, Plus, Star, Trash2, XCircle } from "lucide-react";
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
import { B as Button } from "./Button-CFMlPXiE.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./Card-CQ2ij0--.js";
import { D as DeleteDialog } from "./DeleteDialog-DBDDlwO7.js";
import "./EmptyData-DjqqIMwS.js";
import { E as EmptyTableState } from "./EmptyTableState-C7sYsPjb.js";
import { F as Form, d as FormControl, e as FormDescription, a as FormField, b as FormItem, c as FormLabel, f as FormMessage } from "./Form-dg4L2iRR.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import "./Label-BxDBN09D.js";
import { A as AuthenticatedLayout, B as BaseLayout, M as Main, l as getDeleteDialogConfig, m as handleDeleteLanguage, j as handleLanguageStautsUpdate, i as handleSaveLanguage, k as handleSetDefaultLanguage, s as setLanguageFilterData } from "./Main-BjCbeyG1.js";
import { S as Select, c as SelectContent, d as SelectItem, a as SelectTrigger, b as SelectValue } from "./MarketGrid-DlkazA02.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
import "./PaginationWrapper-B-KWAp7V.js";
import "./Progress-DT6CA82_.js";
import { m as Dialog, n as DialogContent, q as DialogDescription, o as DialogHeader, p as DialogTitle, D as DropdownMenu, f as DropdownMenuContent, i as DropdownMenuItem, g as DropdownMenuLabel, h as DropdownMenuSeparator, j as DropdownMenuSub, l as DropdownMenuSubContent, k as DropdownMenuSubTrigger, e as DropdownMenuTrigger } from "./Sheet-B-_2BaZp.js";
import { L as LayoutHeader, S as SimpleSearchBox } from "./SimpleSearchBox-BCkL0aj1.js";
import "./SlideUp-CpffxXZf.js";
import { T as Table, d as TableBody, e as TableCell, c as TableHead, a as TableHeader, b as TableRow } from "./Table-Dz-EvWd_.js";
import "./TradeDialog-Dt4WEyMP.js";
import "./constants-4k_q_jeE.js";
import "./demo-data-C5EGh9Nk.js";
const languageSchema = z.object({
  name: z.string().min(1, "Language name is required").max(100, "Name must be less than 100 characters"),
  lang_code: z.string().min(1, "Language code is required").max(100, "Code must be less than 100 characters"),
  direction: z.enum(["ltr", "rtl"], {
    required_error: "Text direction is required"
  })
});
const POPULAR_LANGUAGES = [
  "en",
  "es",
  "fr",
  "de",
  "it",
  "pt",
  "ru",
  "ja",
  "ko",
  "zh",
  "ar",
  "hi",
  "tr",
  "pl",
  "nl",
  "sv",
  "da",
  "no",
  "fi"
];
function LanguageDialog({
  open,
  onOpenChange,
  language = null,
  mode = "create",
  langCodes = []
}) {
  const { loading: isSubmitting, submit } = useForm();
  const [searchTerm, setSearchTerm] = React__default.useState("");
  const isEditing = mode === "edit" && language;
  const defaultValues = {
    name: language?.name || "",
    lang_code: language?.code || "",
    direction: language?.direction || "ltr"
  };
  const form = useForm$1({
    resolver: zodResolver(languageSchema),
    defaultValues
  });
  React__default.useEffect(() => {
    if (open && language && mode === "edit") {
      form.reset({
        name: language.name || "",
        lang_code: language.code || "",
        direction: language.direction || "ltr"
      });
    } else if (open && mode === "create") {
      form.reset({
        name: "",
        lang_code: "",
        direction: "ltr"
      });
    }
  }, [open, language, mode, form]);
  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };
  const watchLangCode = form.watch("lang_code");
  const watchDirection = form.watch("direction");
  const processedLangCodes = React__default.useMemo(() => {
    const uniqueLangCodes = langCodes.filter(
      (langItem, index, self) => index === self.findIndex((item) => item.lang_code === langItem.lang_code)
    );
    const popular = [];
    const others = [];
    uniqueLangCodes.forEach((langItem) => {
      if (POPULAR_LANGUAGES.includes(langItem.lang_code)) {
        popular.push(langItem);
      } else {
        others.push(langItem);
      }
    });
    popular.sort((a, b) => {
      const aIndex = POPULAR_LANGUAGES.indexOf(a.lang_code);
      const bIndex = POPULAR_LANGUAGES.indexOf(b.lang_code);
      return aIndex - bIndex;
    });
    others.sort((a, b) => a.name.localeCompare(b.name));
    return { popular, others };
  }, [langCodes]);
  const selectedLangInfo = langCodes.find((item) => item.lang_code === watchLangCode);
  const handleLanguageCodeChange = (langCode) => {
    form.setValue("lang_code", langCode);
    const rtlLanguages = ["ar", "he", "fa", "ur", "ps", "sd", "ku", "dv"];
    if (rtlLanguages.includes(langCode)) {
      form.setValue("direction", "rtl");
    } else if (form.getValues("direction") === "rtl" && !rtlLanguages.includes(langCode)) {
      form.setValue("direction", "ltr");
    }
    const selectedLang = langCodes.find((item) => item.lang_code === langCode);
    if (selectedLang && !form.getValues("name").trim()) {
      form.setValue("name", selectedLang.name);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, {
    open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxs(DialogContent, {
      className: "w-full max-w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxs(DialogHeader, {
        children: [
      /* @__PURE__ */ jsx(DialogTitle, {
          className: "flex items-center gap-2 pr-8", children: isEditing ? /* @__PURE__ */ jsxs(Fragment, {
            children: [
        /* @__PURE__ */ jsx(Edit, { className: "w-5 h-5" }),
              "Update Language"
            ]
          }) : /* @__PURE__ */ jsxs(Fragment, {
            children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5" }),
              "Add Language"
            ]
          })
        }),
      /* @__PURE__ */ jsx(DialogDescription, { children: isEditing ? "Update language settings and localization configuration." : "Add a new language to enable localization and multi-language support." })
        ]
      }),
    /* @__PURE__ */ jsxs("div", {
        className: "space-y-6 max-h-[60vh] overflow-y-auto px-1", children: [
      /* @__PURE__ */ jsxs(Alert, {
          className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
        /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx(AlertDescription, {
            children: /* @__PURE__ */ jsxs("div", {
              children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Language Configuration" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm", children: "Configure language settings for your application's localization system." })
              ]
            })
          })
          ]
        }),
      /* @__PURE__ */ jsx(Form, {
          ...form, children: /* @__PURE__ */ jsxs("form", {
            onSubmit: form.handleSubmit((e) => handleSaveLanguage(e, submit, handleClose)), className: "space-y-6", children: [
        /* @__PURE__ */ jsxs(Card, {
              children: [
          /* @__PURE__ */ jsx(CardHeader, {
                children: /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Languages, { className: "w-5 h-5 text-blue-500" }),
            /* @__PURE__ */ jsx(CardTitle, { children: "Language Details" })
                  ]
                })
              }),
          /* @__PURE__ */ jsxs(CardContent, {
                className: "space-y-6", children: [
            /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "lang_code",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                      children: [
                  /* @__PURE__ */ jsxs(FormLabel, {
                        className: "flex items-center gap-2", children: [
                          "Language",
                    /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                        ]
                      }),
                  /* @__PURE__ */ jsxs(
                        Select,
                        {
                          onValueChange: handleLanguageCodeChange,
                          value: field.value,
                          children: [
                        /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Choose a language" }) }) }),
                        /* @__PURE__ */ jsxs(SelectContent, {
                            className: "max-h-[300px]", children: [
                              processedLangCodes.popular.length > 0 && /* @__PURE__ */ jsxs(Fragment, {
                                children: [
                            /* @__PURE__ */ jsx("div", { className: "px-2 py-1 text-xs font-semibold tracking-wider text-gray-500 uppercase bg-gray-50 dark:bg-gray-800", children: "Popular Languages" }),
                                  processedLangCodes.popular.map((langItem) => /* @__PURE__ */ jsx(
                                    SelectItem,
                                    {
                                      value: langItem.lang_code,
                                      children: /* @__PURE__ */ jsx("div", {
                                        className: "flex items-center justify-between w-full", children: /* @__PURE__ */ jsxs("div", {
                                          className: "flex items-center gap-3", children: [
                                  /* @__PURE__ */ jsx("div", { className: "font-medium", children: langItem.name }),
                                  /* @__PURE__ */ jsx("code", { className: "px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded dark:bg-blue-900 dark:text-blue-300", children: langItem.lang_code })
                                          ]
                                        })
                                      })
                                    },
                                    `popular-${langItem.lang_code}`
                                  ))
                                ]
                              }),
                              processedLangCodes.others.length > 0 && /* @__PURE__ */ jsxs(Fragment, {
                                children: [
                                  processedLangCodes.popular.length > 0 && /* @__PURE__ */ jsx("div", { className: "my-1 border-t" }),
                            /* @__PURE__ */ jsx("div", { className: "px-2 py-1 text-xs font-semibold tracking-wider text-gray-500 uppercase bg-gray-50 dark:bg-gray-800", children: "All Languages" }),
                                  processedLangCodes.others.map((langItem) => /* @__PURE__ */ jsx(
                                    SelectItem,
                                    {
                                      value: langItem.lang_code,
                                      children: /* @__PURE__ */ jsx("div", {
                                        className: "flex items-center justify-between w-full", children: /* @__PURE__ */ jsxs("div", {
                                          className: "flex items-center gap-3", children: [
                                  /* @__PURE__ */ jsx("div", { className: "font-medium", children: langItem.name }),
                                  /* @__PURE__ */ jsx("code", { className: "px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded dark:bg-gray-800 dark:text-gray-400", children: langItem.lang_code })
                                          ]
                                        })
                                      })
                                    },
                                    `other-${langItem.lang_code}`
                                  ))
                                ]
                              })
                            ]
                          })
                          ]
                        }
                      ),
                  /* @__PURE__ */ jsx(FormDescription, { children: "Choose from popular languages shown first, or browse all available languages below." }),
                  /* @__PURE__ */ jsx(FormMessage, {})
                      ]
                    })
                  }
                ),
                  selectedLangInfo && /* @__PURE__ */ jsxs(Alert, {
                    className: "border-green-200 bg-green-50 dark:bg-green-950", children: [
              /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx(AlertDescription, {
                      children: /* @__PURE__ */ jsxs("div", {
                        className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", {
                          className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxs("span", {
                            children: [
                    /* @__PURE__ */ jsx("strong", { children: "Selected:" }),
                              " ",
                              selectedLangInfo.name
                            ]
                          }),
                  /* @__PURE__ */ jsx("code", { className: "px-2 py-1 text-xs bg-white rounded dark:bg-gray-800", children: selectedLangInfo.lang_code })
                          ]
                        }),
                /* @__PURE__ */ jsx(Badge, { variant: POPULAR_LANGUAGES.includes(selectedLangInfo.lang_code) ? "default" : "secondary", className: "text-xs", children: POPULAR_LANGUAGES.includes(selectedLangInfo.lang_code) ? "Popular" : "Standard" })
                        ]
                      })
                    })
                    ]
                  }),
            /* @__PURE__ */ jsx(
                    FormField,
                    {
                      control: form.control,
                      name: "name",
                      render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                        children: [
                  /* @__PURE__ */ jsxs(FormLabel, {
                          className: "flex items-center gap-2", children: [
                            "Display Name",
                    /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                          ]
                        }),
                  /* @__PURE__ */ jsx(FormControl, {
                          children: /* @__PURE__ */ jsx(
                            Input,
                            {
                              placeholder: "e.g., English, Español, العربية",
                              ...field
                            }
                          )
                        }),
                  /* @__PURE__ */ jsx(FormDescription, { children: "How this language will appear to users. Auto-filled but you can customize it." }),
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
            /* @__PURE__ */ jsx(ArrowLeftRight, { className: "w-5 h-5 text-purple-500" }),
            /* @__PURE__ */ jsx(CardTitle, { children: "Text Direction" })
                  ]
                })
              }),
          /* @__PURE__ */ jsxs(CardContent, {
                className: "space-y-6", children: [
            /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "direction",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                      children: [
                  /* @__PURE__ */ jsxs(FormLabel, {
                        className: "flex items-center gap-2", children: [
                          "Reading Direction",
                    /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Auto-detected" })
                        ]
                      }),
                  /* @__PURE__ */ jsxs(Select, {
                        onValueChange: field.onChange, value: field.value, children: [
                    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select text direction" }) }) }),
                    /* @__PURE__ */ jsxs(SelectContent, {
                          children: [
                      /* @__PURE__ */ jsx(SelectItem, {
                            value: "ltr", children: /* @__PURE__ */ jsxs("div", {
                              className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs text-blue-600", children: "LTR" }),
                        /* @__PURE__ */ jsx("span", { children: "Left to Right" }),
                        /* @__PURE__ */ jsx("span", { className: "ml-2 text-xs text-gray-500", children: "(English, Spanish, French...)" })
                              ]
                            })
                          }),
                      /* @__PURE__ */ jsx(SelectItem, {
                            value: "rtl", children: /* @__PURE__ */ jsxs("div", {
                              className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs text-purple-600", children: "RTL" }),
                        /* @__PURE__ */ jsx("span", { children: "Right to Left" }),
                        /* @__PURE__ */ jsx("span", { className: "ml-2 text-xs text-gray-500", children: "(Arabic, Hebrew, Persian...)" })
                              ]
                            })
                          })
                          ]
                        })
                        ]
                      }),
                  /* @__PURE__ */ jsx(FormDescription, { children: "Text reading direction. This is automatically detected based on your language selection." }),
                  /* @__PURE__ */ jsx(FormMessage, {})
                      ]
                    })
                  }
                ),
                  watchDirection && /* @__PURE__ */ jsxs(Alert, {
                    className: `${watchDirection === "rtl" ? "border-purple-200 bg-purple-50 dark:bg-purple-950" : "border-blue-200 bg-blue-50 dark:bg-blue-950"}`, children: [
              /* @__PURE__ */ jsx(ArrowLeftRight, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx(AlertDescription, {
                      children: /* @__PURE__ */ jsxs("div", {
                        className: `${watchDirection === "rtl" ? "text-right" : "text-left"}`, children: [
                /* @__PURE__ */ jsxs("p", {
                          children: [
                  /* @__PURE__ */ jsx("strong", { children: "Preview:" }),
                            " Text will flow ",
                            watchDirection === "rtl" ? "right to left" : "left to right"
                          ]
                        }),
                /* @__PURE__ */ jsxs("p", {
                          className: "mt-1 text-sm", children: [
                            "Sample text: ",
                            watchDirection === "rtl" ? "مرحبا بك في التطبيق" : "Welcome to the application"
                          ]
                        })
                        ]
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
            onClick: () => form.handleSubmit((e) => handleSaveLanguage(e, submit, handleClose))(),
            children: /* @__PURE__ */ jsx(
              ButtonLoader,
              {
                isSubmitting,
                btnText: isEditing ? "Update Language" : "Create Language",
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
const TableActions = ({ language, onEdit, onDelete, currentLangCode = "en" }) => {
  const { submit } = useForm();
  const handleSetDefault = () => {
    handleSetDefaultLanguage(language, submit);
  };
  const handleEdit = () => {
    onEdit(language);
  };
  const handleDelete = () => {
    onDelete(language);
  };
  const handleStatusUpdate = (newStatus) => {
    handleLanguageStautsUpdate(language, newStatus, submit);
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
            "Edit Language"
          ]
        }
      ),
        !language.is_default && currentLangCode != language?.code && /* @__PURE__ */ jsxs(DropdownMenuSub, {
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
                disabled: language.status === "active",
                children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 mr-2 text-green-600" }),
                  "Active",
                  language.status === "active" && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "ml-auto text-xs", children: "Current" })
                ]
              }
            ),
          /* @__PURE__ */ jsxs(
              DropdownMenuItem,
              {
                onClick: () => handleStatusUpdate("inactive"),
                disabled: language.status === "inactive",
                children: [
                /* @__PURE__ */ jsx(XCircle, { className: "w-4 h-4 mr-2 text-gray-500" }),
                  "Inactive",
                  language.status === "inactive" && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "ml-auto text-xs", children: "Current" })
                ]
              }
            )
            ]
          })
          ]
        }),
      /* @__PURE__ */ jsxs(
          DropdownMenuItem,
          {
            onClick: () => router.visit(`/admin/languages/translation/${language.code}`),
            className: "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100",
            children: [
            /* @__PURE__ */ jsx(Languages, { className: "w-4 h-4 mr-2 text-green-600 dark:text-green-500" }),
              "Translations"
            ]
          }
        ),
        !language.is_default && /* @__PURE__ */ jsxs(
          DropdownMenuItem,
          {
            onClick: handleSetDefault,
            className: "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100",
            children: [
            /* @__PURE__ */ jsx(Star, { className: "w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-500" }),
              "Set as Default"
            ]
          }
        ),
        !language.is_default && language.code != "en" && currentLangCode != language?.code && /* @__PURE__ */ jsxs(Fragment, {
          children: [
        /* @__PURE__ */ jsx(DropdownMenuSeparator, { className: "dark:bg-gray-700" }),
        /* @__PURE__ */ jsxs(
            DropdownMenuItem,
            {
              onClick: handleDelete,
              className: "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400",
              children: [
              /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4 mr-2" }),
                "Delete Language"
              ]
            }
          )
          ]
        })
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
        /* @__PURE__ */ jsx(Star, { className: "w-3 h-3 mr-1" }),
        "Default"
      ]
    }
  );
};
const DirectionBadge = ({ direction }) => {
  const isRTL = direction === "rtl";
  return /* @__PURE__ */ jsx(
    Badge,
    {
      variant: "outline",
      className: `text-xs ${isRTL ? "text-purple-700 border-purple-200 dark:text-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20" : "text-blue-700 border-blue-200 dark:text-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20"}`,
      children: direction.toUpperCase()
    }
  );
};
const LanguagesTable = ({ languages = [], onEdit, onDelete, currentLangCode = "en" }) => {
  if (languages.length === 0) {
    return /* @__PURE__ */ jsx(
      EmptyTableState,
      {
        icon: Globe,
        title: "No languages found",
        description: "No languages configured. Add your first language to get started with localization."
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
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Language" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Code" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Direction" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Status" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Created" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-300", children: "Actions" })
              ]
            })
          }),
    /* @__PURE__ */ jsx(TableBody, {
            className: "bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700", children: languages?.map((language, index) => /* @__PURE__ */ jsxs(TableRow, {
              className: "transition-colors hover:bg-gray-50 dark:hover:bg-gray-800", children: [
      /* @__PURE__ */ jsxs(TableCell, {
                className: "px-6 py-4  text-gray-700 dark:text-gray-300", children: [
                  "#",
                  index + 1
                ]
              }),
      /* @__PURE__ */ jsx(TableCell, {
                className: "px-6 py-4", children: /* @__PURE__ */ jsx("div", {
                  className: "flex flex-col gap-2", children: /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: language.name }),
        /* @__PURE__ */ jsx(DefaultBadge, { isDefault: language.is_default })
                    ]
                  })
                })
              }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx("code", { className: "px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded dark:bg-gray-800 dark:text-gray-400", children: language.code }) }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx(DirectionBadge, { direction: language.direction }) }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx(StatusBadge, { status: language.status }) }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4 text-sm text-gray-500 dark:text-gray-400", children: language.created_at }),
      /* @__PURE__ */ jsx(TableCell, {
                className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsx(
                  TableActions,
                  {
                    language,
                    onEdit,
                    onDelete,
                    currentLangCode
                  }
                )
              })
              ]
            }, language.id))
          })
          ]
        })
      })
    })
  });
};
const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Languages", href: null }
];
function Index({
  title,
  languages,
  lang_codes,
  language_settings: { current_language: currentLangCode }
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [filteredLanguages, setFilteredLanguages] = useState(languages?.data || []);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  useEffect(() => {
    setLanguageFilterData(languages, searchTerm, activeFilters, setFilteredLanguages);
  }, [searchTerm, activeFilters, languages]);
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };
  const handleAddLanguage = () => {
    setSelectedLanguage(null);
    setShowAddDialog(true);
  };
  const handleEditLanguage = (language) => {
    setSelectedLanguage(language);
    setShowEditDialog(true);
  };
  const handleDelete = (language) => {
    setSelectedLanguage(language);
    setShowDeleteDialog(true);
  };
  const deleteDialogConfig = getDeleteDialogConfig(languages, selectedLanguage);
  const stats = { total: (languages?.data || []).length };
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
            title: "Languages",
            description: "Manage system languages and localization settings",
            icon: Globe,
            stats,
            primaryAction: {
              label: "Add Language",
              icon: Plus,
              onClick: handleAddLanguage,
              variant: "default"
            }
          }
        ),
      /* @__PURE__ */ jsx(
          SimpleSearchBox,
          {
            searchTerm,
            onSearchChange: handleSearch,
            placeholder: "Search languages by name or code..."
          }
        ),
      /* @__PURE__ */ jsx("div", {
          className: "space-y-6", children: /* @__PURE__ */ jsx(
            LanguagesTable,
            {
              languages: filteredLanguages,
              onEdit: handleEditLanguage,
              onDelete: handleDelete,
              currentLangCode
            }
          )
        }),
      /* @__PURE__ */ jsx(
          LanguageDialog,
          {
            open: showAddDialog || showEditDialog,
            onOpenChange: showAddDialog ? setShowAddDialog : setShowEditDialog,
            mode: showAddDialog ? "create" : "edit",
            language: selectedLanguage,
            langCodes: lang_codes
          }
        ),
      /* @__PURE__ */ jsx(
          DeleteDialog,
          {
            open: showDeleteDialog,
            onOpenChange: setShowDeleteDialog,
            item: selectedLanguage,
            config: deleteDialogConfig,
            onDelete: handleDeleteLanguage
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


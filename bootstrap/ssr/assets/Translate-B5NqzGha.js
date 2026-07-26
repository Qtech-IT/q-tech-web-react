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
import { ChevronLeft, ChevronRight, FileText, Globe, Languages, Save, Star } from "lucide-react";
import "motion/react";
import { useEffect, useState } from "react";
import "react-hot-toast";
import "react-icons/bs";
import "react-icons/fa";
import { jsx, jsxs } from "react/jsx-runtime";
import "tailwind-merge";
import "./Alert-3s5DZB4H.js";
import "./AuthController-DaCguZ7K.js";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import "./BlogCard-Jrl9AHYg.js";
import "./BlogSection-DiGfvTON.js";
import "./Breadcrumb-D0MBns-9.js";
import { B as Button } from "./Button-CFMlPXiE.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./Card-CQ2ij0--.js";
import { T as Textarea } from "./constants-4k_q_jeE.js";
import "./demo-data-C5EGh9Nk.js";
import "./EmptyData-DjqqIMwS.js";
import { E as EmptyTableState } from "./EmptyTableState-C7sYsPjb.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import "./Input-ikOfQO4K.js";
import "./Label-BxDBN09D.js";
import { A as AuthenticatedLayout, B as BaseLayout, n as handleTransaltionSave, M as Main } from "./Main-BjCbeyG1.js";
import "./MarketGrid-DlkazA02.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
import "./PaginationWrapper-B-KWAp7V.js";
import "./Progress-DT6CA82_.js";
import "./Sheet-B-_2BaZp.js";
import { L as LayoutHeader, S as SimpleSearchBox } from "./SimpleSearchBox-BCkL0aj1.js";
import "./SlideUp-CpffxXZf.js";
import { T as Table, d as TableBody, e as TableCell, c as TableHead, a as TableHeader, b as TableRow } from "./Table-Dz-EvWd_.js";
import "./TradeDialog-Dt4WEyMP.js";
const CustomPagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) => {
  if (totalPages <= 1) return null;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };
  const pageNumbers = getPageNumbers();
  return /* @__PURE__ */ jsxs("div", {
    className: "p-6 bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-gray-900 dark:border-gray-700", children: [
    /* @__PURE__ */ jsxs("div", {
      className: "flex flex-col items-center justify-between gap-4 sm:flex-row", children: [
      /* @__PURE__ */ jsxs("div", {
        className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 rounded-lg bg-gray-50 dark:bg-gray-800", children: /* @__PURE__ */ jsx("div", { className: "w-4 h-4 rounded bg-gradient-to-r from-blue-500 to-purple-500" }) }),
        /* @__PURE__ */ jsxs("div", {
          className: "text-sm text-gray-600 dark:text-gray-400", children: [
            "Showing ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900 dark:text-gray-100", children: startIndex + 1 }),
            " to",
            " ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900 dark:text-gray-100", children: endIndex }),
            " of",
            " ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900 dark:text-gray-100", children: totalItems }),
            " results"
          ]
        })
        ]
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => onPageChange(1),
            disabled: currentPage === 1,
            className: "px-3 border-gray-300 h-9 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800",
            children: "First"
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => onPageChange(currentPage - 1),
            disabled: currentPage === 1,
            className: "px-3 border-gray-300 h-9 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800",
            children: [
              /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4 mr-1" }),
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Previous" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", {
          className: "flex items-center space-x-1", children: pageNumbers.map((pageNum) => /* @__PURE__ */ jsx(
            Button,
            {
              variant: pageNum === currentPage ? "default" : "outline",
              size: "sm",
              onClick: () => onPageChange(pageNum),
              className: `h-9 min-w-9 ${pageNum === currentPage ? "bg-gradient-to-r from-blue-600 to-blue-700 border-blue-600 text-white shadow-sm" : "border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"}`,
              children: pageNum
            },
            pageNum
          ))
        }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => onPageChange(currentPage + 1),
            disabled: currentPage === totalPages,
            className: "px-3 border-gray-300 h-9 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800",
            children: [
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Next" }),
              /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 ml-1" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => onPageChange(totalPages),
            disabled: currentPage === totalPages,
            className: "px-3 border-gray-300 h-9 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800",
            children: "Last"
          }
        )
        ]
      })
      ]
    }),
    /* @__PURE__ */ jsx("div", {
      className: "pt-4 mt-4 border-t border-gray-200 sm:hidden dark:border-gray-700", children: /* @__PURE__ */ jsxs("div", {
        className: "text-sm text-center text-gray-500 dark:text-gray-400", children: [
          "Page ",
          currentPage,
          " of ",
          totalPages
        ]
      })
    })
    ]
  });
};
const TranslationRow = ({
  translationKey,
  value,
  index,
  onChange
}) => {
  return /* @__PURE__ */ jsxs(TableRow, {
    className: "transition-colors hover:bg-gray-50 dark:hover:bg-gray-800", children: [
    /* @__PURE__ */ jsxs(TableCell, {
      className: "px-6 py-4 ", children: [
        "#",
        index + 1
      ]
    }),
    /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4  text-sm", children: translationKey }),
    /* @__PURE__ */ jsx(TableCell, {
      className: "px-6 py-4", children: /* @__PURE__ */ jsx(
        Textarea,
        {
          value,
          onChange: (e) => onChange(translationKey, e.target.value),
          className: "min-h-[80px] resize-none",
          placeholder: "Enter translation..."
        }
      )
    })
    ]
  });
};
const ITEMS_PER_PAGE = 15;
const TranslationTable = ({
  translations,
  searchTerm,
  languageCode
}) => {
  const { loading: isSubmitting, submit } = useForm();
  const [editedTranslations, setEditedTranslations] = useState(translations);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setEditedTranslations(translations);
  }, [translations]);
  const filteredTranslations = Object.entries(editedTranslations).filter(([key, value]) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return key.toLowerCase().includes(searchLower) || value.toLowerCase().includes(searchLower);
  });
  const totalItems = filteredTranslations.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTranslations = filteredTranslations.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  const handleChange = (key, value) => {
    setEditedTranslations((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  if (filteredTranslations.length === 0) {
    return /* @__PURE__ */ jsx(
      EmptyTableState,
      {
        icon: FileText,
        title: "No translations found",
        description: searchTerm ? "No translations match your search criteria." : "No translation keys available."
      }
    );
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-6", children: [
    /* @__PURE__ */ jsx(Card, {
      className: "bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-900", children: /* @__PURE__ */ jsx(CardContent, {
        className: "p-0", children: /* @__PURE__ */ jsx("div", {
          className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, {
            className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [
      /* @__PURE__ */ jsx(TableHeader, {
              className: "bg-gray-50 dark:bg-gray-800", children: /* @__PURE__ */ jsxs(TableRow, {
                children: [
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3", children: "ID" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3", children: "Translation Key" }),
        /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3", children: "Translation Value" })
                ]
              })
            }),
      /* @__PURE__ */ jsx(TableBody, {
              children: paginatedTranslations.map(([key, value], index) => /* @__PURE__ */ jsx(
                TranslationRow,
                {
                  translationKey: key,
                  value,
                  index: startIndex + index,
                  onChange: handleChange
                },
                key
              ))
            })
            ]
          })
        })
      })
    }),
      totalPages > 1 && /* @__PURE__ */ jsx(
        CustomPagination,
        {
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage: ITEMS_PER_PAGE,
          onPageChange: handlePageChange
        }
      ),
    /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(Button, { onClick: () => handleTransaltionSave(submit, editedTranslations, languageCode), disabled: isSubmitting, children: /* @__PURE__ */ jsx(ButtonLoader, { isSubmitting }) }) })
    ]
  });
};
const DefaultBadge = ({ isDefault }) => {
  if (!isDefault) return null;
  return /* @__PURE__ */ jsxs(Badge, {
    variant: "outline", className: "text-yellow-700 border-yellow-300 bg-yellow-50 dark:text-yellow-300 dark:border-yellow-600 dark:bg-yellow-900/20", children: [
    /* @__PURE__ */ jsx(Star, { className: "w-3 h-3 mr-1" }),
      "Default"
    ]
  });
};
const DirectionBadge = ({ direction }) => {
  const isRTL = direction === "rtl";
  return /* @__PURE__ */ jsx(
    Badge,
    {
      variant: "outline",
      className: `${isRTL ? "text-purple-700 border-purple-300 bg-purple-50 dark:text-purple-300 dark:border-purple-600 dark:bg-purple-900/20" : "text-blue-700 border-blue-300 bg-blue-50 dark:text-blue-300 dark:border-blue-600 dark:bg-blue-900/20"}`,
      children: direction.toUpperCase()
    }
  );
};
const LanguageInfoCard = ({ language, totalKeys }) => {
  return /* @__PURE__ */ jsxs(Card, {
    children: [
    /* @__PURE__ */ jsx(CardHeader, {
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Globe, { className: "w-5 h-5 text-blue-500" }),
      /* @__PURE__ */ jsx(CardTitle, { children: "Language Information" })
        ]
      })
    }),
    /* @__PURE__ */ jsx(CardContent, {
      children: /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-1 gap-4 md:grid-cols-4", children: [
      /* @__PURE__ */ jsxs("div", {
          children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-muted-foreground", children: "Language" }),
        /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2 mt-1", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: language.name }),
          /* @__PURE__ */ jsx(DefaultBadge, { isDefault: language.is_default })
            ]
          })
          ]
        }),
      /* @__PURE__ */ jsxs("div", {
          children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-muted-foreground", children: "Code" }),
        /* @__PURE__ */ jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsx("code", { className: "px-2 py-1 text-sm rounded bg-muted", children: language.code }) })
          ]
        }),
      /* @__PURE__ */ jsxs("div", {
          children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-muted-foreground", children: "Direction" }),
        /* @__PURE__ */ jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsx(DirectionBadge, { direction: language.direction }) })
          ]
        }),
      /* @__PURE__ */ jsxs("div", {
          children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-muted-foreground", children: "Total Keys" }),
        /* @__PURE__ */ jsxs("div", {
            className: "mt-1 font-medium", children: [
              totalKeys,
              " translations"
            ]
          })
          ]
        })
        ]
      })
    })
    ]
  });
};
function Translation({
  title,
  language,
  key_values
}) {
  const { loading: isSubmitting, submit } = useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [translations, setTranslations] = useState(key_values);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalTranslations] = useState(key_values);
  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Languages", href: "/admin/languages" },
    { label: `${language.data.name} Translation`, href: null }
  ];
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };
  const handleSaveAll = () => {
    submit("put", `/admin/languages/translation/${language.data.code}`, {
      translations
    });
  };
  const stats = {
    total: Object.keys(translations).length,
    language: language.data.name
  };
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasChanges]);
  return /* @__PURE__ */ jsx(BaseLayout, {
    children: /* @__PURE__ */ jsxs(AuthenticatedLayout, {
      children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(Main, {
        className: "space-y-8", children: [
      /* @__PURE__ */ jsx(
          LayoutHeader,
          {
            variant: "inner",
            breadcrumbItems,
            title: `${language.data.name} Translation`,
            description: "Manage translations for this language",
            icon: Languages,
            stats
          }
        ),
      /* @__PURE__ */ jsx(
          LanguageInfoCard,
          {
            language: language.data,
            totalKeys: Object.keys(translations).length
          }
        ),
      /* @__PURE__ */ jsx(
          SimpleSearchBox,
          {
            searchTerm,
            onSearchChange: handleSearch,
            placeholder: "Search translation keys or values..."
          }
        ),
      /* @__PURE__ */ jsx(
          TranslationTable,
          {
            translations,
            searchTerm,
            languageCode: language.data.code
          }
        ),
          hasChanges && /* @__PURE__ */ jsx("div", {
            className: "fixed z-50 bottom-6 right-6 md:hidden", children: /* @__PURE__ */ jsx(
              Button,
              {
                onClick: handleSaveAll,
                disabled: isSubmitting,
                className: "bg-green-600 rounded-full shadow-lg h-14 w-14 hover:bg-green-700",
                children: /* @__PURE__ */ jsx(
                  ButtonLoader,
                  {
                    isSubmitting,
                    btnText: /* @__PURE__ */ jsx(Save, { className: "w-6 h-6" }),
                    loaderText: /* @__PURE__ */ jsx(Save, { className: "w-6 h-6" })
                  }
                )
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
  Translation as default
};


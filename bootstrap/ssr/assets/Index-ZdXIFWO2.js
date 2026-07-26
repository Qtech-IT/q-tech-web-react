import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { router, Head } from "@inertiajs/react";
import { B as BaseLayout, A as AuthenticatedLayout, M as Main } from "./Main-BjCbeyG1.js";
import { Settings, Layout, FileText, Edit, ChevronRight } from "lucide-react";
import { C as CommonLayoutHeader } from "./CommonLayoutHeader-CyKOpByu.js";
import { A as Alert, a as AlertDescription } from "./Alert-3s5DZB4H.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle, d as CardDescription } from "./Card-CQ2ij0--.js";
import { e as emptySectionView, g as getSectionIcon } from "./AppearanceController-DmPoT0M9.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import { B as Button } from "./Button-CFMlPXiE.js";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import "./Sheet-B-_2BaZp.js";
import "@radix-ui/react-direction";
import "class-variance-authority";
import "@radix-ui/react-icons";
import "@radix-ui/react-avatar";
import "@radix-ui/react-separator";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "@radix-ui/react-dialog";
import "@radix-ui/react-scroll-area";
import "./constants-4k_q_jeE.js";
import "./BlogSection-DiGfvTON.js";
import "./EmptyData-DjqqIMwS.js";
import "clsx";
import "react-hot-toast";
import "framer-motion";
import "./BlogCard-Jrl9AHYg.js";
import "./Label-BxDBN09D.js";
import "@radix-ui/react-label";
import "@radix-ui/react-switch";
import "./HotToast-DfpkTxSC.js";
import "@radix-ui/react-accordion";
import "./TradeDialog-Dt4WEyMP.js";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-tabs";
import "./SlideUp-CpffxXZf.js";
import "motion/react";
import "./PaginationWrapper-B-KWAp7V.js";
import "./Table-Dz-EvWd_.js";
import "./demo-data-C5EGh9Nk.js";
import "./MarketGrid-DlkazA02.js";
import "@radix-ui/react-select";
import "./Progress-DT6CA82_.js";
import "@radix-ui/react-progress";
import "react-icons/bs";
import "./MarketSectionTwo-RD2Nw8tb.js";
import "react-icons/fa";
import "@radix-ui/react-slot";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-alert-dialog";
import "./AuthController-DaCguZ7K.js";
import "@radix-ui/react-radio-group";
import "./Breadcrumb-D0MBns-9.js";
import "tailwind-merge";
const SectionOverview = ({ availableSections = {} }) => {
  const sectionsArray = Object.entries(availableSections);
  const midPoint = Math.ceil(sectionsArray.length / 2);
  const leftColumn = sectionsArray.slice(0, midPoint);
  const rightColumn = sectionsArray.slice(midPoint);
  if (sectionsArray.length === 0) {
    return emptySectionView("No sections available ");
  }
  return /* @__PURE__ */ jsx(Card, { className: "border-gray-300 border-dashed dark:border-gray-600", children: /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Settings, { className: "w-5 h-5 text-blue-500" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Section Overview" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 text-sm md:grid-cols-2", children: [
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: leftColumn.map(([key, section]) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 text-2xl", children: getSectionIcon(section.icon) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-medium text-foreground", children: section.label }),
          /* @__PURE__ */ jsx("p", { className: "break-words text-muted-foreground", children: section.description })
        ] })
      ] }, key)) }),
      rightColumn.length > 0 && /* @__PURE__ */ jsx("div", { className: "space-y-3", children: rightColumn.map(([key, section]) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 text-2xl", children: getSectionIcon(section.icon) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-medium text-foreground", children: section.label }),
          /* @__PURE__ */ jsx("p", { className: "break-words text-muted-foreground", children: section.description })
        ] })
      ] }, key)) })
    ] })
  ] }) }) });
};
const StatisticsCard = ({ totalSections = 0, appearanceConfig }) => {
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: [
    /* @__PURE__ */ jsx(Card, { className: "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800", children: /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg dark:bg-blue-900", children: /* @__PURE__ */ jsx(Layout, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-blue-700 dark:text-blue-300", children: "Available Sections" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-blue-900 dark:text-blue-100", children: totalSections })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Card, { className: "border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800", children: /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg dark:bg-green-900", children: /* @__PURE__ */ jsx(FileText, { className: "w-6 h-6 text-green-600 dark:text-green-400" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-green-700 dark:text-green-300", children: "Configured" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-green-900 dark:text-green-100", children: Object.keys(appearanceConfig).length })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Card, { className: "border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800", children: /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg dark:bg-purple-900", children: /* @__PURE__ */ jsx(Settings, { className: "w-6 h-6 text-purple-600 dark:text-purple-400" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-purple-700 dark:text-purple-300", children: "Section Types" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-purple-900 dark:text-purple-100", children: "6" })
      ] })
    ] }) }) })
  ] });
};
const SearchBox = ({ searchTerm, setSearchTerm }) => {
  return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 sm:flex-row", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-1 w-full", children: /* @__PURE__ */ jsx(
      Input,
      {
        placeholder: "Search sections by name or description...",
        value: searchTerm,
        onChange: (e) => setSearchTerm(e.target.value),
        className: "w-full"
      }
    ) }),
    searchTerm && /* @__PURE__ */ jsx(
      Button,
      {
        variant: "ghost",
        size: "sm",
        onClick: () => setSearchTerm(""),
        children: "Clear"
      }
    )
  ] }) }) });
};
const SectionCard = ({ sectionKey, section, onEdit }) => {
  const fieldCount = Object.keys(section.fields).length;
  const hasRepeater = Object.values(section.fields).some((field) => field.type === "repeater");
  return /* @__PURE__ */ jsxs(Card, { className: "transition-all duration-200 border group hover:shadow-lg hover:border-primary/50", children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 text-3xl rounded-lg bg-gradient-to-br from-primary/10 to-primary/5", children: getSectionIcon(section.icon) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: section.label }),
        /* @__PURE__ */ jsx(CardDescription, { className: "mt-1", children: section.description })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: fieldCount }),
        " configurable fields",
        hasRepeater && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "ml-2 text-xs", children: "Dynamic Content" })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => onEdit(sectionKey),
          className: "w-full transition-colors group-hover:bg-primary group-hover:text-primary-foreground",
          children: [
            /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4 mr-2" }),
            "Configure Section",
            /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 ml-auto" })
          ]
        }
      )
    ] }) })
  ] });
};
const SectionGridList = ({ filteredSections = [] }) => {
  const handleEditSection = (sectionKey) => {
    router.visit(route("admin.appearance.create", sectionKey));
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("h2", { className: "text-lg font-semibold", children: [
      "Content Sections ",
      filteredSections.length > 0 && /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
        "(",
        filteredSections.length,
        ")"
      ] })
    ] }) }),
    filteredSections.length == 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-12 text-center", children: [
      /* @__PURE__ */ jsx(Layout, { className: "w-12 h-12 mx-auto mb-4 text-gray-400" }),
      /* @__PURE__ */ jsx("h3", { className: "mb-2 text-lg font-medium text-gray-900 dark:text-gray-100", children: "No sections found" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Try adjusting your search terms" })
    ] }) }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3", children: filteredSections.map(([key, section]) => /* @__PURE__ */ jsx(
      SectionCard,
      {
        sectionKey: key,
        section,
        onEdit: handleEditSection
      },
      key
    )) })
  ] });
};
const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Appearance Settings", href: null }
];
function Index({
  title,
  appearanceConfig = {},
  availableSections = {}
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredSections = Object.entries(availableSections).filter(([key, section]) => {
    return section.label.toLowerCase().includes(searchTerm.toLowerCase()) || section.description.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const totalSections = Object.keys(availableSections).length;
  return /* @__PURE__ */ jsx(BaseLayout, { children: /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(Main, { className: "space-y-8", children: [
      /* @__PURE__ */ jsx(
        CommonLayoutHeader,
        {
          variant: "index",
          breadcrumbItems,
          title: "Appearance Settings",
          description: "Configure content sections for your website",
          icon: Layout
        }
      ),
      /* @__PURE__ */ jsx(
        StatisticsCard,
        {
          totalSections,
          appearanceConfig
        }
      ),
      /* @__PURE__ */ jsx(SearchBox, { searchTerm, setSearchTerm }),
      /* @__PURE__ */ jsxs(Alert, { className: "border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800", children: [
        /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4 text-blue-600 dark:text-blue-400" }),
        /* @__PURE__ */ jsxs(AlertDescription, { className: "text-blue-800 dark:text-blue-200", children: [
          /* @__PURE__ */ jsx("strong", { children: "Note:" }),
          " Configure each section's content here. To control which sections appear on your website, use the menu management system."
        ] })
      ] }),
      /* @__PURE__ */ jsx(SectionGridList, { filteredSections }),
      /* @__PURE__ */ jsx(SectionOverview, { availableSections })
    ] })
  ] }) });
}
export {
  Index as default
};

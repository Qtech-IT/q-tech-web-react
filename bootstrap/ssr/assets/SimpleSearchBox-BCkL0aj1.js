import { jsx, jsxs } from "react/jsx-runtime";
import { B as Breadcrumb } from "./Breadcrumb-D0MBns-9.js";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import { B as Button } from "./Button-CFMlPXiE.js";
import { ArrowLeft, Globe, BarChart3, Search, X } from "lucide-react";
import { router } from "@inertiajs/react";
import React__default, { useState } from "react";
import { I as Input } from "./Input-ikOfQO4K.js";
const LayoutHeader = ({
  breadcrumbItems,
  stats = null,
  variant = "index",
  title,
  description,
  icon: Icon = Globe,
  backUrl = null,
  badges = [],
  primaryAction = null,
  secondaryActions = []
}) => {
  if (variant === "inner") {
    return /* @__PURE__ */ jsx("div", { className: "p-8 border shadow-sm rounded-2xl bg-card", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      breadcrumbItems && /* @__PURE__ */ jsx(Breadcrumb, { items: breadcrumbItems }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          backUrl && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsx(
              ArrowLeft,
              {
                className: "w-4 h-4 transition-colors cursor-pointer hover:text-foreground",
                onClick: () => router.visit(backUrl)
              }
            ),
            /* @__PURE__ */ jsx("span", { children: "Back to Languages" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "p-3 shadow-sm bg-primary rounded-xl text-primary-foreground", children: /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: title }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: description })
            ] })
          ] }),
          stats && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-6 pt-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-green-100 dark:bg-green-900/20", children: /* @__PURE__ */ jsx(BarChart3, { className: "w-4 h-4 text-green-600 dark:text-green-400" }) }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: stats.total }),
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Total" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 lg:flex-row lg:items-center", children: [
          primaryAction && /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: primaryAction.onClick,
              variant: primaryAction.variant || "default",
              className: primaryAction.className || "",
              children: [
                primaryAction.icon && /* @__PURE__ */ jsx(primaryAction.icon, { className: "w-4 h-4 mr-2" }),
                primaryAction.label
              ]
            }
          ),
          secondaryActions.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: secondaryActions.map((action, index) => /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: action.onClick,
              variant: action.variant || "outline",
              size: action.size || "default",
              className: action.className || "",
              children: [
                action.icon && /* @__PURE__ */ jsx(action.icon, { className: "w-4 h-4 mr-2" }),
                action.label
              ]
            },
            index
          )) }),
          badges.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: badges.map((badge, index) => /* @__PURE__ */ jsx(
            Badge,
            {
              variant: badge.variant || "outline",
              className: "text-xs",
              children: badge.label
            },
            index
          )) })
        ] })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "p-8 border shadow-sm rounded-2xl bg-card", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    breadcrumbItems && /* @__PURE__ */ jsx(Breadcrumb, { items: breadcrumbItems }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-3 shadow-sm bg-primary rounded-xl text-primary-foreground", children: /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: title }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: description })
          ] })
        ] }),
        stats && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-6 pt-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-green-100 dark:bg-green-900/20", children: /* @__PURE__ */ jsx(BarChart3, { className: "w-4 h-4 text-green-600 dark:text-green-400" }) }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: stats.total }),
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Total" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 lg:flex-row lg:items-center", children: [
        primaryAction && /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: primaryAction.onClick,
            variant: primaryAction.variant || "default",
            className: `lg:flex-shrink-0 ${primaryAction.className || ""}`,
            children: [
              primaryAction.icon && /* @__PURE__ */ jsx(primaryAction.icon, { className: "w-4 h-4 mr-2" }),
              primaryAction.label
            ]
          }
        ),
        secondaryActions.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: secondaryActions.map((action, index) => /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: action.onClick,
            variant: action.variant || "outline",
            size: action.size || "default",
            className: `lg:flex-shrink-0 ${action.className || ""}`,
            children: [
              action.icon && /* @__PURE__ */ jsx(action.icon, { className: "w-4 h-4 mr-2" }),
              action.label
            ]
          },
          index
        )) }),
        badges.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: badges.map((badge, index) => /* @__PURE__ */ jsx(
          Badge,
          {
            variant: badge.variant || "outline",
            className: "text-xs",
            children: badge.label
          },
          index
        )) })
      ] })
    ] })
  ] }) });
};
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
  return /* @__PURE__ */ jsxs("div", { className: `w-full max-w-full p-3 space-y-3 border rounded-xl bg-background sm:p-4 ${className}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center min-w-0 gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 p-1.5 rounded-lg bg-primary/10 sm:p-2", children: /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-primary" }) }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold truncate sm:text-base", children: "Search Languages" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs truncate text-muted-foreground", children: "Find languages instantly" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("form", { onSubmit: handleSearchSubmit, className: "w-full", children: /* @__PURE__ */ jsxs("div", { className: "relative flex-1 min-w-0", children: [
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
    ] }) }),
    localSearch && /* @__PURE__ */ jsx("div", { className: "pt-2 border-t", children: /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
      "Searching for: ",
      /* @__PURE__ */ jsxs("span", { className: "font-medium text-foreground", children: [
        '"',
        localSearch,
        '"'
      ] })
    ] }) })
  ] });
};
export {
  LayoutHeader as L,
  SimpleSearchBox as S
};

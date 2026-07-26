import { jsx, jsxs } from "react/jsx-runtime";
import { B as Breadcrumb } from "./Breadcrumb-D0MBns-9.js";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import { ArrowLeft, Bell, BarChart3, TrendingUp } from "lucide-react";
import { router } from "@inertiajs/react";
import "react";
const LayoutHeader = ({
  breadcrumbItems,
  stats = null,
  variant = "index",
  title,
  description,
  icon: Icon = Bell,
  backUrl = null,
  badges = []
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
            /* @__PURE__ */ jsx("span", { children: "Back to Templates" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "p-3 shadow-sm bg-primary rounded-xl text-primary-foreground", children: /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: title }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: description })
            ] })
          ] }),
          stats && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-6 pt-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-green-100 dark:bg-green-900/20", children: /* @__PURE__ */ jsx(BarChart3, { className: "w-4 h-4 text-green-600 dark:text-green-400" }) }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: stats.total }),
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Total" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/20", children: /* @__PURE__ */ jsx(TrendingUp, { className: "w-4 h-4 text-purple-600 dark:text-purple-400" }) }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: stats.types }),
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Types" })
            ] })
          ] })
        ] }),
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
        stats && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-6 pt-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-green-100 dark:bg-green-900/20", children: /* @__PURE__ */ jsx(BarChart3, { className: "w-4 h-4 text-green-600 dark:text-green-400" }) }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: stats.total }),
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Total" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/20", children: /* @__PURE__ */ jsx(TrendingUp, { className: "w-4 h-4 text-purple-600 dark:text-purple-400" }) }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: stats.types }),
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Types" })
          ] })
        ] })
      ] }),
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
  ] }) });
};
export {
  LayoutHeader as L
};

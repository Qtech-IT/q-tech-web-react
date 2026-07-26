import { jsx, jsxs } from "react/jsx-runtime";
import { B as Breadcrumb } from "./Breadcrumb-D0MBns-9.js";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import { B as Button } from "./Button-CFMlPXiE.js";
import { ArrowLeft, Globe, BarChart3 } from "lucide-react";
import { router } from "@inertiajs/react";
import "react";
const CommonLayoutHeader = ({
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
            /* @__PURE__ */ jsx("span", { children: "Back to previous page" })
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
export {
  CommonLayoutHeader as C
};

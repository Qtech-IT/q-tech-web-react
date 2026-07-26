import { jsx, jsxs } from "react/jsx-runtime";
import { S as SlideUp } from "./SlideUp-CpffxXZf.js";
import { C as Card, a as CardContent } from "./Card-CQ2ij0--.js";
import { AnimatePresence } from "framer-motion";
import { Target, History } from "lucide-react";
import { useState } from "react";
import { p as positions, h as history, b as portfolioStats } from "./demo-data-C5EGh9Nk.js";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-RBWn151p.js";
import "./Button-CFMlPXiE.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "react-hot-toast";
import "tailwind-merge";
import "./Sheet-B-_2BaZp.js";
import "@radix-ui/react-direction";
import "@inertiajs/react";
import "@radix-ui/react-icons";
import "@radix-ui/react-avatar";
import "@radix-ui/react-separator";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "@radix-ui/react-dialog";
import "@radix-ui/react-scroll-area";
import "./AppLayout-BOaFJ-XR.js";
import "./HotToast-DfpkTxSC.js";
import "react-responsive";
import "./Badge-B6jlhcU-.js";
import "./Popover-Ckus2dfK.js";
import "@radix-ui/react-popover";
import "react-icons/tfi";
const Portfolio = () => {
  const tabMenus = [
    {
      icon: Target,
      label: "Positions",
      value: "positions",
      component: /* @__PURE__ */ jsx(PositionTab, { positions })
    },
    {
      icon: History,
      label: "History",
      value: "history",
      component: /* @__PURE__ */ jsx(HistoryTab, { history })
    }
  ];
  const [activeTab, setActiveTab] = useState(tabMenus[0]?.value);
  return /* @__PURE__ */ jsx(AuthenticatedLayout, { children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4 mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Portfolio" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Track your positions and trading history" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4 xl:grid-cols-4", children: portfolioStats.map((stat) => /* @__PURE__ */ jsxs(
        Card,
        {
          className: "p-4 overflow-hidden border rounded-md shadow-none",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsx(stat.icon, { className: `w-4 h-4 ${stat.iconColor}` }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: stat.label })
            ] }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `text-2xl font-bold ${stat.valueColor ? stat.valueColor : ""}`,
                children: stat.value
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: `text-xs flex items-center gap-1 ${stat.subColor ? stat.subColor : ""}`,
                children: [
                  stat.subIcon && /* @__PURE__ */ jsx(stat.subIcon, { className: "w-3 h-3" }),
                  stat.subValue
                ]
              }
            )
          ]
        },
        stat.id
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "flex mb-6 border-b", children: tabMenus && tabMenus.map((tab) => {
        const Icon = tab?.icon;
        return /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveTab(tab?.value),
            className: `px-4 py-3 cursor-pointer font-medium text-sm border-b-2 transition-colors ${activeTab === `${tab?.value}` ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`,
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" }),
              tab?.label
            ] })
          },
          tab?.value
        );
      }) }),
      /* @__PURE__ */ jsx(Card, { className: "p-0 overflow-hidden border rounded-md shadow-none", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: tabMenus?.map(
        (tab) => activeTab === tab?.value && /* @__PURE__ */ jsx(SlideUp, { children: tab?.component }, tab?.value)
      ) }) }) })
    ] })
  ] }) });
};
export {
  Portfolio as default
};

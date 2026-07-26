import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ChartCandlestick } from "lucide-react";
import { C as Card, a as CardContent } from "./Card-CQ2ij0--.js";
import { AnimatePresence } from "framer-motion";
import { PiHandDeposit } from "react-icons/pi";
import { RiLuggageDepositLine } from "react-icons/ri";
import { S as SlideUp } from "./SlideUp-CpffxXZf.js";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-RBWn151p.js";
import { h as history } from "./demo-data-C5EGh9Nk.js";
import "./Badge-B6jlhcU-.js";
import "clsx";
import "react-hot-toast";
import "./Button-CFMlPXiE.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
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
import "./Popover-Ckus2dfK.js";
import "@radix-ui/react-popover";
import "react-icons/tfi";
const WithdrawalsTab = () => {
  const [isCollapse, setIsCollapse] = useState(false);
  return /* @__PURE__ */ jsx(Fragment, {});
};
const TradesTab = ({ history: history2 }) => {
  const [isCollapse, setIsCollapse] = useState(false);
  return /* @__PURE__ */ jsx(Fragment, {});
};
const DepositsTab = () => {
  const [isCollapse, setIsCollapse] = useState(false);
  return /* @__PURE__ */ jsx(Fragment, {});
};
const History = () => {
  const tabMenus = [
    {
      icon: ChartCandlestick,
      label: "Trades",
      value: "trades",
      component: /* @__PURE__ */ jsx(TradesTab, { history })
    },
    {
      icon: RiLuggageDepositLine,
      label: "Deposits",
      value: "deposits",
      component: /* @__PURE__ */ jsx(DepositsTab, {})
    },
    {
      icon: PiHandDeposit,
      label: "Withdrawals",
      value: "withdrawals",
      component: /* @__PURE__ */ jsx(WithdrawalsTab, {})
    }
  ];
  const [activeTab, setActiveTab] = useState(tabMenus[0]?.value);
  return /* @__PURE__ */ jsx(AuthenticatedLayout, { children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4 mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "History" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Track your positions and trading history" })
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx("div", { className: "flex border-b", children: tabMenus && tabMenus.map((tab) => {
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
    }) }) }),
    /* @__PURE__ */ jsx(Card, { className: "p-0 overflow-hidden border rounded-md shadow-none", children: /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: tabMenus?.map(
      (tab) => activeTab === tab?.value && /* @__PURE__ */ jsx(SlideUp, { children: tab?.component }, tab?.value)
    ) }) }) })
  ] }) });
};
export {
  History as default
};

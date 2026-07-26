import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import "./Sheet-B-_2BaZp.js";
import "vaul";
import "clsx";
import "react-hot-toast";
import { useState } from "react";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./Card-CQ2ij0--.js";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-RBWn151p.js";
import { WalletIcon, Lock } from "lucide-react";
import "@radix-ui/react-direction";
import "./Button-CFMlPXiE.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "tailwind-merge";
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
import "framer-motion";
import "react-responsive";
import "./Badge-B6jlhcU-.js";
import "./Popover-Ckus2dfK.js";
import "@radix-ui/react-popover";
import "react-icons/tfi";
function Deposit() {
  const [selectedPayment, setSelectedPayment] = useState("");
  const [amount, setAmount] = useState("");
  const chargeRate = 0.05;
  const charge = amount ? (Number(amount) * chargeRate).toFixed(2) : 0;
  amount ? (Number(amount) + Number(charge)).toFixed(2) : 0;
  return /* @__PURE__ */ jsx(Fragment, {});
}
function Withdrawal() {
  const [selectedPayment, setSelectedPayment] = useState("");
  const [amount, setAmount] = useState("");
  const chargeRate = 0.05;
  const charge = amount ? (Number(amount) * chargeRate).toFixed(2) : 0;
  amount ? (Number(amount) + Number(charge)).toFixed(2) : 0;
  return /* @__PURE__ */ jsx(Fragment, {});
}
const Wallet = () => {
  return /* @__PURE__ */ jsx(AuthenticatedLayout, { children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Wallets" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Add one or more wallets to your account." })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Deposit, {}),
        /* @__PURE__ */ jsx(Withdrawal, {})
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { className: "py-4 border rounded-md shadow-none", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between px-4 pb-2 space-y-0", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Available Balance" }),
          /* @__PURE__ */ jsx(WalletIcon, { className: "text-green-600 size-6" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "px-4 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: "$3,420.5" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs", children: "Ready for withdrawal" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "py-4 border rounded-md shadow-none", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between px-4 pb-2 space-y-0", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Escrow Balance" }),
          /* @__PURE__ */ jsx(Lock, { className: "text-blue-700 size-6" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "px-4 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: "$1,250" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs", children: "Funds in escrow" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-6" })
  ] }) });
};
export {
  Wallet as default
};

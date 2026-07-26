import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { a as cn, B as Button, j as calculateTrade, k as keyToValue } from "./Button-CFMlPXiE.js";
import { m as Dialog, n as DialogContent, p as DialogTitle, N as FancyButton, A as Avatar, s as AvatarImage, D as DropdownMenu, e as DropdownMenuTrigger, f as DropdownMenuContent, F as DropdownMenuGroup, i as DropdownMenuItem, h as DropdownMenuSeparator, j as DropdownMenuSub, k as DropdownMenuSubTrigger, Q as DropdownMenuPortal, l as DropdownMenuSubContent } from "./Sheet-B-_2BaZp.js";
import { useState, useEffect } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { AnimatePresence } from "framer-motion";
import { S as SlideUp } from "./SlideUp-CpffxXZf.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import { L as Label } from "./Label-BxDBN09D.js";
import { Minus, Plus, XCircle, CheckCircle2Icon, LucideCheckCircle2, AlertTriangle, TrendingUp, CreditCard, ChevronDown } from "lucide-react";
function Tabs({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Root,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
function Collapsible(props) {
  return /* @__PURE__ */ jsx(CollapsiblePrimitive.Root, { "data-slot": "collapsible", ...props });
}
function CollapsibleTrigger(props) {
  return /* @__PURE__ */ jsx(
    CollapsiblePrimitive.CollapsibleTrigger,
    {
      "data-slot": "collapsible-trigger",
      ...props
    }
  );
}
function CollapsibleContent(props) {
  return /* @__PURE__ */ jsx(
    CollapsiblePrimitive.CollapsibleContent,
    {
      "data-slot": "collapsible-content",
      ...props
    }
  );
}
const CollapseWrapper = ({
  children,
  trigger,
  open,
  onOpenChange,
  defaultOpen = false,
  className
}) => {
  return /* @__PURE__ */ jsxs(
    Collapsible,
    {
      open,
      defaultOpen,
      onOpenChange,
      className: cn("w-full", className),
      children: [
        trigger && /* @__PURE__ */ jsx(CollapsibleTrigger, { className: "w-full", children: trigger }),
        /* @__PURE__ */ jsx(CollapsibleContent, { children })
      ]
    }
  );
};
const InputCountDown = ({
  value,
  onChange,
  name = "amount",
  id = "amount",
  placeholder = "0"
}) => {
  const handleDecrease = () => {
    const num = parseFloat(value) || 0;
    if (num > 0) {
      onChange(String(num - 1));
    }
  };
  const handleIncrease = () => {
    const num = parseFloat(value) || 0;
    onChange(String(num + 1));
  };
  const handleChange = (e) => {
    onChange(e.target.value);
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 border py-1 px-1.5 rounded-sm", children: [
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "secondary",
        size: "icon",
        className: "size-7 cursor-pointer shrink-0 rounded-sm",
        onClick: handleDecrease,
        type: "button",
        children: /* @__PURE__ */ jsx(Minus, {})
      }
    ),
    /* @__PURE__ */ jsx(
      Input,
      {
        type: "number",
        value,
        onChange: handleChange,
        placeholder,
        name,
        id,
        min: "0",
        step: "any",
        className: "text-xl p-0 font-semibold grow border-0 shadow-none text-center h-6\n                   focus:outline-none focus:ring-0\n                   focus-visible:ring-0 focus-visible:ring-offset-0\n                   appearance-none\n                   [&::-webkit-outer-spin-button]:appearance-none\n                   [&::-webkit-inner-spin-button]:appearance-none\n                   [-moz-appearance:textfield]"
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "secondary",
        size: "icon",
        className: "size-7 cursor-pointer shrink-0 rounded-sm",
        onClick: handleIncrease,
        type: "button",
        children: /* @__PURE__ */ jsx(Plus, {})
      }
    )
  ] });
};
function TradeResultDialog({
  isOpen,
  onClose,
  success: success2 = true,
  message,
  tradeAmount = "",
  tradePair = "BTC/USD"
}) {
  const [showContent, setShowContent] = useState(false);
  const [autoClose, setAutoClose] = useState(5);
  useEffect(() => {
    if (isOpen) {
      setShowContent(true);
      setAutoClose(5);
      const interval = setInterval(() => {
        setAutoClose((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1e3);
      return () => clearInterval(interval);
    } else {
      setShowContent(false);
    }
  }, [isOpen, onClose]);
  const handleClose = () => {
    setShowContent(false);
    setTimeout(onClose, 150);
  };
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md overflow-hidden [&>button]:hidden", children: [
    /* @__PURE__ */ jsx(DialogTitle, { className: "sr-only", children: success2 ? "Trade Successful" : "Trade Failed" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-3", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: `absolute inset-0 ${success2 ? "bg-green-500" : "bg-red-500"}`,
        style: {
          backgroundImage: `radial-gradient(circle at 50% 50%, currentColor 1px, transparent 1px)`,
          backgroundSize: "20px 20px"
        }
      }
    ) }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `absolute top-0 left-0 h-1 transition-all duration-1000 ease-linear ${success2 ? "bg-green-500" : "bg-red-500"}`,
        style: { width: `${autoClose / 5 * 100}%` }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "py-10 text-center", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleClose,
          className: "absolute p-2 text-gray-400 transition-colors rounded-full cursor-pointer top-4 right-4 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
          children: /* @__PURE__ */ jsx(XCircle, { size: 20 })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: `relative ${success2 ? "animate-bounce" : "animate-pulse"}`, children: success2 ? /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(CheckCircle2Icon, { className: "text-green-500 size-20 drop-shadow-lg" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 animate-ping", children: /* @__PURE__ */ jsx(LucideCheckCircle2, { className: "text-green-500 opacity-75 size-20" }) })
      ] }) : /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx("div", { className: "p-4 rounded-full bg-red-50 dark:bg-red-900/20", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "text-red-500 size-12" }) }) }) }) }),
      /* @__PURE__ */ jsx("h5", { className: "mb-3 text-3xl font-medium text-foreground", children: success2 ? "Trade Successful" : "Trade Failed" }),
      success2 && /* @__PURE__ */ jsxs("div", { className: "p-4 mb-6 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/20 dark:border-green-800", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-2 text-green-700 dark:text-green-300", children: [
          /* @__PURE__ */ jsx(TrendingUp, { size: 16 }),
          /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold", children: tradeAmount })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-sm text-green-600 dark:text-green-400", children: [
          tradePair,
          " • Just now"
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mb-6 leading-relaxed text-gray-600 dark:text-gray-300", children: message || (success2 ? "Your trade has been successfully executed and confirmed on the blockchain." : "Unable to execute trade. Please check your balance and try again.") })
    ] })
  ] }) });
}
function TradeForm({ price, type, onConfirm, className, marketDetail = false, tradeType = null }) {
  const [amount, setAmount] = useState("");
  const [shareAmount, setShareAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const { shares, potentialPayout, profit } = calculateTrade(amount, price);
  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      const res = await onConfirm(amount);
      setResult(res);
    } catch (err) {
      setResult({ success });
    }
    setIsProcessing(false);
    setAmount("");
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: `space-y-3 ${className || ""}`, children: [
      marketDetail && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mt-4", children: [
        /* @__PURE__ */ jsx(FancyButton, { label: "Yes", className: "grow" }),
        /* @__PURE__ */ jsx(FancyButton, { label: "No", className: "text-red-600 grow bg-red-500/10 hover:bg-red-700 hover:text-white" })
      ] }),
      tradeType === "market" || !marketDetail ? /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "amount", className: "mb-2", children: "Amount ($)" }),
          /* @__PURE__ */ jsx(InputCountDown, { value: amount, onChange: setAmount })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-end flex-wrap gap-2.5 ", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", className: "px-2 py-1 text-xs cursor-pointer h-7 rounded-xs", children: "+$1" }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", className: "px-2 py-1 text-xs cursor-pointer h-7 rounded-xs", children: "+$20" }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", className: "px-2 py-1 text-xs cursor-pointer h-7 rounded-xs", children: "+$100" }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", className: "px-2 py-1 text-xs cursor-pointer h-7 rounded-xs", children: "Max" })
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "amount", className: "mb-2", children: "Limit Price ($)" }),
          /* @__PURE__ */ jsx(InputCountDown, { value: amount, onChange: setAmount })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "shares", className: "mb-2", children: "Shares" }),
          /* @__PURE__ */ jsx(Input, { name: "shares", id: "shares", type: "number", value: shareAmount, onChange: (e) => setShareAmount(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-end flex-wrap gap-2.5 ", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", className: "px-2 py-1 text-xs cursor-pointer h-7 rounded-xs", children: "+$1" }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", className: "px-2 py-1 text-xs cursor-pointer h-7 rounded-xs", children: "+$20" }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", className: "px-2 py-1 text-xs cursor-pointer h-7 rounded-xs", children: "+$100" }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", className: "px-2 py-1 text-xs cursor-pointer h-7 rounded-xs", children: "Max" })
        ] })
      ] }),
      amount && /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Shares" }),
          /* @__PURE__ */ jsx("span", { children: shares })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Potential payout" }),
          /* @__PURE__ */ jsxs("span", { className: "text-green-600", children: [
            "$",
            potentialPayout.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between font-semibold", children: [
          /* @__PURE__ */ jsx("span", { children: "Potential profit" }),
          /* @__PURE__ */ jsxs("span", { className: "text-green-600", children: [
            "$",
            profit.toFixed(2)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: handleConfirm,
          disabled: !amount || parseFloat(amount) <= 0 || isProcessing,
          className: `w-full cursor-pointer frost-effect ${type === "yes" ? "bg-green-700" : "bg-red-600"}`,
          children: isProcessing ? /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-b-2 border-white rounded-full animate-spin me-2" }),
            "Processing..."
          ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx(CreditCard, { className: "w-4 h-4 me-2" }),
            "Tread ",
            type === "yes" ? "Yes" : "No"
          ] })
        }
      )
    ] }),
    result && /* @__PURE__ */ jsx(
      TradeResultDialog,
      {
        isOpen: !!result,
        onClose: () => setResult(null),
        success: result.success,
        message: result.message,
        tradeAmount: amount
      }
    )
  ] });
}
const MarketTradeWidget = ({ marketData, className }) => {
  const [tradeType, setTradeType] = useState("market");
  const handleTradeTypeSelect = (type) => {
    setTradeType(type);
  };
  return /* @__PURE__ */ jsxs("div", { className: `bg-card p-4 rounded-md shadow-none border ${className || ""}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
      /* @__PURE__ */ jsx(Avatar, { className: "rounded-md shrink-0 aspect-square size-12", children: /* @__PURE__ */ jsx(AvatarImage, { src: marketData?.imageUrl }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold grow line-clamp-2", children: marketData?.title })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "buy", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs(TabsList, { children: [
          /* @__PURE__ */ jsx(TabsTrigger, { value: "buy", className: "px-6 text-xs cursor-pointer", children: "Buy" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "sell", className: "px-6 text-xs cursor-pointer", children: "Sell" })
        ] }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "flex items-center gap-3 text-xs cursor-pointer", children: [
            keyToValue(tradeType),
            " ",
            /* @__PURE__ */ jsx(ChevronDown, {})
          ] }) }),
          /* @__PURE__ */ jsxs(DropdownMenuContent, { className: "w-32", align: "start", children: [
            /* @__PURE__ */ jsxs(DropdownMenuGroup, { children: [
              /* @__PURE__ */ jsx(DropdownMenuItem, { className: "text-xs cursor-pointer", onClick: () => handleTradeTypeSelect("market"), children: "Market" }),
              /* @__PURE__ */ jsx(DropdownMenuItem, { className: "text-xs cursor-pointer", onClick: () => handleTradeTypeSelect("limit"), children: "Limit" })
            ] }),
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsx(DropdownMenuGroup, { children: /* @__PURE__ */ jsxs(DropdownMenuSub, { children: [
              /* @__PURE__ */ jsx(DropdownMenuSubTrigger, { className: "text-xs", children: "More" }),
              /* @__PURE__ */ jsx(DropdownMenuPortal, { children: /* @__PURE__ */ jsxs(DropdownMenuSubContent, { children: [
                /* @__PURE__ */ jsx(DropdownMenuItem, { className: "text-xs cursor-pointer", children: "Marge" }),
                /* @__PURE__ */ jsx(DropdownMenuItem, { className: "text-xs cursor-pointer", children: "Split" })
              ] }) })
            ] }) })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "buy", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(SlideUp, { children: /* @__PURE__ */ jsx(
        TradeForm,
        {
          price: marketData?.yesPrice,
          type: "yes",
          onConfirm: async (amount) => {
            await new Promise((res) => setTimeout(res, 1e3));
            return { success: true };
          },
          className: "mt-3",
          marketDetail: true,
          tradeType
        }
      ) }) }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "sell", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(SlideUp, { children: /* @__PURE__ */ jsx(
        TradeForm,
        {
          price: marketData?.noPrice,
          type: "no",
          onConfirm: async (amount) => {
            await new Promise((res) => setTimeout(res, 1e3));
            return { success: false };
          },
          className: "mt-3",
          marketDetail: true,
          tradeType
        }
      ) }) }) })
    ] })
  ] });
};
function TradeDialog({
  isOpen,
  onClose,
  marketData
}) {
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md overflow-hidden [&>button]:hidden p-0", children: [
    /* @__PURE__ */ jsx(DialogTitle, { className: "sr-only", children: "Trade Modal" }),
    /* @__PURE__ */ jsx(MarketTradeWidget, { marketData, className: `border-none` })
  ] }) });
}
export {
  Collapsible as C,
  MarketTradeWidget as M,
  Tabs as T,
  TabsList as a,
  TabsTrigger as b,
  TabsContent as c,
  CollapsibleTrigger as d,
  CollapsibleContent as e,
  CollapseWrapper as f,
  TradeForm as g,
  TradeDialog as h
};

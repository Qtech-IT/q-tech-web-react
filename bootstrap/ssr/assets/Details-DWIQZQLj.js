import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { N as FancyButton, A as Avatar, s as AvatarImage, G as Separator } from "./Sheet-B-_2BaZp.js";
import { B as Button } from "./Button-CFMlPXiE.js";
import { ChevronDown, RefreshCcw, Clock4, SquareArrowOutUpRight, Bookmark } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Link } from "@inertiajs/react";
import { a as markets } from "./demo-data-C5EGh9Nk.js";
import { C as Collapsible, d as CollapsibleTrigger, e as CollapsibleContent, f as CollapseWrapper, M as MarketTradeWidget, h as TradeDialog } from "./TradeDialog-Dt4WEyMP.js";
import { AnimatePresence } from "framer-motion";
import { S as SlideUp } from "./SlideUp-CpffxXZf.js";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from "recharts";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./Table-Dz-EvWd_.js";
import { TiArrowSortedDown } from "react-icons/ti";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import { A as AppLayout } from "./AppLayout-BOaFJ-XR.js";
import "@radix-ui/react-direction";
import "class-variance-authority";
import "@radix-ui/react-icons";
import "@radix-ui/react-avatar";
import "@radix-ui/react-separator";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "@radix-ui/react-dialog";
import "@radix-ui/react-scroll-area";
import "@radix-ui/react-slot";
import "clsx";
import "react-hot-toast";
import "tailwind-merge";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-tabs";
import "./Input-ikOfQO4K.js";
import "./Label-BxDBN09D.js";
import "@radix-ui/react-label";
import "./HotToast-DfpkTxSC.js";
import "./Popover-Ckus2dfK.js";
import "@radix-ui/react-popover";
import "react-icons/tfi";
const RulesResolutionCollapse = () => {
  return /* @__PURE__ */ jsxs(Collapsible, { className: "px-4 py-4", children: [
    /* @__PURE__ */ jsx(CollapsibleTrigger, { className: "w-full cursor-pointer", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between w-full gap-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold", children: "Rules & Resolution" }),
      /* @__PURE__ */ jsx(ChevronDown, { className: "text-sm text-muted-foreground" })
    ] }) }),
    /* @__PURE__ */ jsx(CollapsibleContent, { children: /* @__PURE__ */ jsx("div", { className: "mt-4 text-muted-foreground text-[15px] ps-3", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-start", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-3 text-base font-semibold", children: "Market Details:" }),
        /* @__PURE__ */ jsxs("ul", { className: "ml-4 space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsx("span", { className: "mr-2", children: "•" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Market Closes:" }),
              " This market will only be closed once a resolution is achieved"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsx("span", { className: "mr-2", children: "•" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Resolution Deadline:" }),
              " The resolution will be determined as soon as an outcome is reached"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsx("span", { className: "mr-2", children: "•" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Pump Target:" }),
              " $1.00"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsx("span", { className: "mr-2", children: "•" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Dump Target:" }),
              " $0.60"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-3 text-base font-semibold", children: "Resolution criteria:" }),
        /* @__PURE__ */ jsxs("ul", { className: "ml-4 space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsx("span", { className: "mr-2", children: "•" }),
            /* @__PURE__ */ jsx("div", { children: "The market resolves based on which condition is met first:" })
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-start ml-8", children: [
            /* @__PURE__ */ jsx("span", { className: "mr-2", children: "•" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: '"$1"' }),
              " if the ADA/USDT price on Binance reaches or exceeds the Pump Target"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-start ml-8", children: [
            /* @__PURE__ */ jsx("span", { className: "mr-2", children: "•" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: '"$0.60"' }),
              " if the ADA/USDT price on Binance drops to equal or below the Dump Target"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-3 text-base font-semibold", children: "Resolution details:" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsx("p", { children: "The market resolves based on the Binance ADA/USDT spot price, using the 1-minute chart with the following specifications:" }),
          /* @__PURE__ */ jsxs("ul", { className: "ml-4 space-y-2", children: [
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "mr-2", children: "•" }),
              /* @__PURE__ */ jsx("div", { children: '1-minute timeframe ("1m")' })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "mr-2", children: "•" }),
              /* @__PURE__ */ jsx("div", { children: '"Original" view' })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "mr-2", children: "•" }),
              /* @__PURE__ */ jsx("div", { children: '"Close" price of each candle' })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { children: "Only the price of ADA/USDT as quoted by Binance (spot market) will be considered" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-3 text-base font-semibold", children: "Cancellation (Invalidity) Conditions" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsx("p", { children: "This market will be canceled/invalid if:" }),
          /* @__PURE__ */ jsxs("ul", { className: "ml-4 space-y-2", children: [
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "mr-2", children: "•" }),
              /* @__PURE__ */ jsx("div", { children: "The ADA/USDT spot market on Binance is suspended or becomes unreliable" })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "mr-2", children: "•" }),
              /* @__PURE__ */ jsx("div", { children: "The Binance platform is unavailable or experiences significant disruptions" })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "mr-2", children: "•" }),
              /* @__PURE__ */ jsx("div", { children: "Any circumstance that prevents reliable price tracking" })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "mr-2", children: "•" }),
              /* @__PURE__ */ jsx("div", { children: "Myriad Markets undergoes a change in its contract that demands a cancellation of all active markets, or a similar significant technical change" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-4", children: "In the event of cancellation, participants may claim their stakes at the market value of their open positions at the time of cancellation. This could result in a profit or a loss, depending on the price of their outstanding shares." })
        ] })
      ] })
    ] }) }) })
  ] });
};
const chartData = [
  { date: "Jan 15", yes: 0.62, no: 0.38 },
  { date: "Jan 16", yes: 0.635, no: 0.365 },
  { date: "Jan 17", yes: 0.618, no: 0.382 },
  { date: "Jan 18", yes: 0.642, no: 0.358 },
  { date: "Jan 19", yes: 0.638, no: 0.362 },
  { date: "Jan 20", yes: 0.645, no: 0.355 },
  { date: "Jan 21", yes: 0.652, no: 0.348 },
  { date: "Jan 22", yes: 0.648, no: 0.352 },
  { date: "Today", yes: 0.65, no: 0.35 }
];
const timeframes = [
  { label: "1D", active: false },
  { label: "1W", active: true },
  { label: "1M", active: false },
  { label: "3M", active: false },
  { label: "All", active: false }
];
function MarketChart({ marketId }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "h-80", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(LineChart, { data: chartData, children: [
      /* @__PURE__ */ jsx(
        CartesianGrid,
        {
          strokeDasharray: "3 3",
          className: "opacity-50"
        }
      ),
      /* @__PURE__ */ jsx(
        XAxis,
        {
          dataKey: "date",
          axisLine: false,
          tickLine: false,
          className: "text-xs"
        }
      ),
      /* @__PURE__ */ jsx(
        YAxis,
        {
          domain: [0, 1],
          tickFormatter: (value) => `${Math.round(value * 100)}¢`,
          axisLine: false,
          tickLine: false,
          className: "text-xs"
        }
      ),
      /* @__PURE__ */ jsx(
        Tooltip,
        {
          content: ({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return /* @__PURE__ */ jsxs("div", { className: "p-3 border rounded-lg shadow-lg bg-card border-border", children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium", children: label }),
                /* @__PURE__ */ jsxs("div", { className: "mt-2 space-y-1", children: [
                  /* @__PURE__ */ jsxs("p", { className: "text-sm text-chart-1", children: [
                    "Yes:",
                    " ",
                    Math.round(
                      payload[0]?.value * 100
                    ),
                    "¢"
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "text-sm text-chart-5", children: [
                    "No:",
                    " ",
                    Math.round(
                      payload[1]?.value * 100
                    ),
                    "¢"
                  ] })
                ] })
              ] });
            }
            return null;
          }
        }
      ),
      /* @__PURE__ */ jsx(
        Line,
        {
          type: "monotone",
          dataKey: "yes",
          stroke: "var(--chart-1)",
          strokeWidth: 2,
          dot: false,
          name: "Yes"
        }
      ),
      /* @__PURE__ */ jsx(
        Line,
        {
          type: "monotone",
          dataKey: "no",
          stroke: "var(--chart-5)",
          strokeWidth: 2,
          dot: false,
          name: "No"
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mt-4", children: /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-1", children: timeframes.map((timeframe) => /* @__PURE__ */ jsx(
      Button,
      {
        variant: timeframe.active ? "secondary" : "ghost",
        size: "sm",
        className: "h-8 px-3 text-sm cursor-pointer",
        children: timeframe.label
      },
      timeframe.label
    )) }) })
  ] });
}
const OrderBook = () => {
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(Table, { children: [
    /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
      /* @__PURE__ */ jsx(TableHead, { className: "w-[300px]", children: "Trade Yes" }),
      /* @__PURE__ */ jsx(TableHead, { children: "Price" }),
      /* @__PURE__ */ jsx(TableHead, { children: "Shares" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-end", children: "Total" })
    ] }) }),
    /* @__PURE__ */ jsx(TableBody, { children: Array.from({ length: 10 }).map((_, index) => /* @__PURE__ */ jsxs(TableRow, { children: [
      /* @__PURE__ */ jsx(TableCell, { className: "font-medium bg-red-500/5" }),
      /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: "99¢" }),
      /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: "54,318" }),
      /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: "$39,907" })
    ] }, index)) })
  ] }) });
};
const PredictionCollapseBody = () => {
  const tabMenus = [
    {
      label: "Order Book",
      value: "order_book",
      component: /* @__PURE__ */ jsx(OrderBook, {})
    },
    {
      label: "Graph",
      value: "graph",
      component: /* @__PURE__ */ jsx(MarketChart, {})
    }
  ];
  const [activeTab, setActiveTab] = useState(tabMenus[0]?.value);
  return /* @__PURE__ */ jsxs("div", { className: "py-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-4 border-b", children: [
      /* @__PURE__ */ jsx("div", { className: "flex", children: tabMenus && tabMenus.map((tab) => {
        return /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveTab(tab?.value),
            className: `px-4 py-3 cursor-pointer font-medium text-sm border-b-2 transition-colors ${activeTab === `${tab?.value}` ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`,
            children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: tab?.label })
          },
          tab?.value
        );
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", className: "h-8 py-1 cursor-pointer", children: "Rewards" }),
        /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "icon", className: "cursor-pointer size-8", children: /* @__PURE__ */ jsx(RefreshCcw, {}) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "pt-4", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: tabMenus?.map(
      (tab) => activeTab === tab?.value && /* @__PURE__ */ jsx(SlideUp, { className: "!min-h-0", children: /* @__PURE__ */ jsx("div", { className: "overflow-y-scroll w-full max-h-[200px] h-full no-scrollbar", children: tab?.component }) }, tab?.value)
    ) }) })
  ] });
};
const PredictionItem = ({ prediction, actions, market }) => {
  const { modal } = actions;
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4 py-1.5 cursor-pointer w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "md:max-w-[35%] text-sm w-full text-start", children: [
      /* @__PURE__ */ jsx("h5", { className: "font-semibold", children: prediction?.name }),
      /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "$329,924 vol" })
    ] }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        prediction?.percentage,
        "%"
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-xs text-green-700", children: [
        " ",
        /* @__PURE__ */ jsx(TiArrowSortedDown, {}),
        " 12 %"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3", children: [
      /* @__PURE__ */ jsx(
        FancyButton,
        {
          onClick: (e) => {
            e.stopPropagation();
            modal?.handleOpen(market);
          },
          size: "sm",
          label: "Yes",
          className: " md:grow"
        }
      ),
      /* @__PURE__ */ jsx(
        FancyButton,
        {
          onClick: (e) => {
            e.stopPropagation();
            modal?.handleOpen(market);
          },
          size: "sm",
          label: "No",
          className: "text-red-600 md:grow bg-red-500/10 hover:bg-red-700 hover:text-white"
        }
      )
    ] })
  ] });
};
const PredictionCollapse = ({ prediction, market, actions, open, onOpenChange }) => {
  return /* @__PURE__ */ jsx(
    CollapseWrapper,
    {
      open,
      onOpenChange: (newOpen) => {
        onOpenChange(newOpen);
      },
      trigger: /* @__PURE__ */ jsx(PredictionItem, { prediction, market, actions }),
      children: /* @__PURE__ */ jsx(PredictionCollapseBody, {})
    }
  );
};
const RelatedMarkets = ({ actions }) => {
  const { modal } = actions;
  return /* @__PURE__ */ jsxs("div", { className: "p-4 mt-4", children: [
    /* @__PURE__ */ jsx("h4", { className: "text-xl font-semibold", children: "People are also buying" }),
    /* @__PURE__ */ jsx("div", { className: "mt-5", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1", children: markets.length > 0 && markets.map((market) => /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 p-3 border-b cursor-pointer lg:flex-nowrap hover:bg-accent", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center flex-grow gap-3", children: [
        /* @__PURE__ */ jsx(Avatar, { className: "rounded-md aspect-square size-12", children: /* @__PURE__ */ jsx(AvatarImage, { src: market?.imageUrl }) }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold md:text-base", children: market?.title })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between w-full gap-4 shrink-0 md:w-auto", children: [
        /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "shrink-0 py-1.5", children: [
          market?.chance,
          "%"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3 grow md:w-auto", children: [
          /* @__PURE__ */ jsx(
            FancyButton,
            {
              onClick: () => {
                modal?.handleOpen(market);
              },
              size: "sm",
              label: "Yes",
              className: " md:grow"
            }
          ),
          /* @__PURE__ */ jsx(
            FancyButton,
            {
              onClick: () => {
                modal?.handleOpen(market);
              },
              size: "sm",
              label: "No",
              className: "text-red-600 md:grow bg-red-500/10 hover:bg-red-700 hover:text-white"
            }
          )
        ] })
      ] })
    ] }, market?.id)) }) })
  ] });
};
const marketData = {
  id: "1",
  title: "Will Bitcoin reach $100,000 by end of 2024?",
  description: "This market resolves to 'Yes' if Bitcoin (BTC) reaches or exceeds $100,000 USD on any major exchange before January 1, 2025. The resolution will be based on data from major exchanges including Coinbase, Binance, and Kraken.",
  category: "Economics",
  endDate: "2024-12-31T23:59:59Z",
  yesPrice: 0.65,
  noPrice: 0.35,
  volume: 15420.5,
  imageUrl: "",
  totalShares: 15420,
  yesShares: 8500,
  noShares: 6920,
  createdAt: "2024-01-15T10:00:00Z",
  creator: "CryptoAnalyst",
  resolutionSource: "Major cryptocurrency exchanges (Coinbase, Binance, Kraken)",
  predictions: [
    { id: "1", name: "Zohran Mamdani", percentage: 19 },
    { id: "2", name: "Alex Johnson", percentage: 42 },
    { id: "3", name: "Emily Carter", percentage: 33 },
    { id: "4", name: "Ravi Patel", percentage: 27 },
    { id: "5", name: "Sophia Martinez", percentage: 55 }
  ]
};
const MarketDetailsSection = ({ market }) => {
  const [selectedMarket, setSelectedMarket] = useState(marketData);
  const [openModal, setOpenModal] = useState(false);
  const [openCollapseId, setOpenCollapseId] = useState(null);
  const deviceWidth = 991;
  const isDesktopOrLaptop = useMediaQuery({ minWidth: deviceWidth });
  const handleCloseModal = () => {
    setSelectedMarket(marketData);
    setOpenModal(false);
  };
  const handleOpenModal = (data) => {
    setSelectedMarket(data);
    setOpenModal(true);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("section", { className: "pb-16 lg:pb-24 mb:pb-20", children: /* @__PURE__ */ jsx("div", { className: "container px-4 mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8 lg:flex-row", children: [
      /* @__PURE__ */ jsxs("div", { className: "grow", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex bg-background border-b items-start md:flex-nowrap flex-wrap justify-between gap-4 md:sticky md:top-[56px] md:z-10 lg:py-6 py-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsx(Avatar, { className: "rounded-md aspect-square size-16", children: /* @__PURE__ */ jsx(AvatarImage, { src: marketData?.imageUrl }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold xl:text-2xl sm:text-xl", children: marketData?.title }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 mt-3", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "$329,924 vol" }),
                /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "h-5" }),
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
                  " ",
                  /* @__PURE__ */ jsx(Clock4, { className: "size-[1rem]" }),
                  "Ends Sep 30, 2024"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-between gap-3 shrink-0 ", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "cursor-pointer",
                  children: /* @__PURE__ */ jsx(SquareArrowOutUpRight, { className: "size-[1.2rem]" })
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "cursor-pointer",
                  children: /* @__PURE__ */ jsx(Bookmark, { className: "size-[1.2rem]" })
                }
              )
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-sky-600", children: "41% chance" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-4 pb-6", children: [
          /* @__PURE__ */ jsx(MarketChart, {}),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mt-5 lg:hidden", children: [
            /* @__PURE__ */ jsx(FancyButton, { onClick: () => handleOpenModal(selectedMarket), label: "Buy Yes", className: "grow" }),
            /* @__PURE__ */ jsx(FancyButton, { onClick: () => handleOpenModal(selectedMarket), label: "Buy No", className: "text-red-600 grow bg-red-500/10 hover:bg-red-700 hover:text-white" })
          ] }),
          /* @__PURE__ */ jsx(Separator, { className: "my-4" }),
          /* @__PURE__ */ jsx("div", { className: "px-4", children: /* @__PURE__ */ jsx("div", { className: "overflow-y-scroll w-full max-h-[500px] h-full no-scrollbar", children: marketData?.predictions.map((prediction, index) => /* @__PURE__ */ jsx(
            PredictionCollapse,
            {
              prediction,
              market: selectedMarket,
              actions: {
                modal: { handleOpen: handleOpenModal }
              },
              open: openCollapseId === prediction.id,
              onOpenChange: (isOpen) => setOpenCollapseId(isOpen ? prediction.id : null)
            },
            index
          )) }) })
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsx(RulesResolutionCollapse, {}),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(RelatedMarkets, { actions: {
          modal: { handleOpen: handleOpenModal }
        } }) })
      ] }),
      isDesktopOrLaptop && /* @__PURE__ */ jsx("aside", { className: "flex-shrink-0 2xl:w-96 lg:w-80", children: /* @__PURE__ */ jsxs("div", { className: "mt-6 sticky top-[90px]", children: [
        /* @__PURE__ */ jsx(MarketTradeWidget, { marketData: selectedMarket }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "By trading, you agree to the ",
          /* @__PURE__ */ jsx(Link, { href: "#", className: "text-blue-500 underline", children: "Terms of Use" }),
          " "
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xl font-semibold", children: "Hot Marketing" }),
          /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-1", children: markets.length > 0 && markets.map((market2) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-accent", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 overflow-hidden rounded-sm shrink-0 aspect-square", children: /* @__PURE__ */ jsx("img", { src: market2?.imageUrl, alt: "", className: "object-cover w-full h-full" }) }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: market2?.title }) })
          ] }, market2.id)) }) })
        ] })
      ] }) })
    ] }) }) }),
    openModal && /* @__PURE__ */ jsx(
      TradeDialog,
      {
        isOpen: openModal,
        onClose: handleCloseModal,
        marketData: selectedMarket
      }
    )
  ] });
};
const MarketDetails = ({ market }) => {
  return /* @__PURE__ */ jsx(AppLayout, { children: /* @__PURE__ */ jsx(MarketDetailsSection, {}) });
};
export {
  MarketDetails as default
};

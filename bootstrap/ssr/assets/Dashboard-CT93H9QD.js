import { jsx, jsxs } from "react/jsx-runtime";
import { B as Button } from "./Button-CFMlPXiE.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent, d as CardDescription } from "./Card-CQ2ij0--.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./TradeDialog-Dt4WEyMP.js";
import { B as BaseLayout, A as AuthenticatedLayout, M as Main } from "./Main-BjCbeyG1.js";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from "recharts";
import { A as Avatar, s as AvatarImage, t as AvatarFallback } from "./Sheet-B-_2BaZp.js";
import { Head } from "@inertiajs/react";
import "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "react-hot-toast";
import "tailwind-merge";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-tabs";
import "framer-motion";
import "./SlideUp-CpffxXZf.js";
import "./Input-ikOfQO4K.js";
import "./Label-BxDBN09D.js";
import "@radix-ui/react-label";
import "lucide-react";
import "./constants-4k_q_jeE.js";
import "./BlogSection-DiGfvTON.js";
import "./EmptyData-DjqqIMwS.js";
import "./BlogCard-Jrl9AHYg.js";
import "./Badge-B6jlhcU-.js";
import "@radix-ui/react-switch";
import "./HotToast-DfpkTxSC.js";
import "@radix-ui/react-accordion";
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
import "@radix-ui/react-icons";
import "react-icons/fa";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-alert-dialog";
import "./AuthController-DaCguZ7K.js";
import "@radix-ui/react-radio-group";
import "@radix-ui/react-direction";
import "@radix-ui/react-avatar";
import "@radix-ui/react-separator";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "@radix-ui/react-dialog";
import "@radix-ui/react-scroll-area";
const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5e3) + 1e3
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5e3) + 1e3
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5e3) + 1e3
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5e3) + 1e3
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5e3) + 1e3
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5e3) + 1e3
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 5e3) + 1e3
  },
  {
    name: "Aug",
    total: Math.floor(Math.random() * 5e3) + 1e3
  },
  {
    name: "Sep",
    total: Math.floor(Math.random() * 5e3) + 1e3
  },
  {
    name: "Oct",
    total: Math.floor(Math.random() * 5e3) + 1e3
  },
  {
    name: "Nov",
    total: Math.floor(Math.random() * 5e3) + 1e3
  },
  {
    name: "Dec",
    total: Math.floor(Math.random() * 5e3) + 1e3
  }
];
function Overview() {
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 350, children: /* @__PURE__ */ jsxs(BarChart, { data, children: [
    /* @__PURE__ */ jsx(
      XAxis,
      {
        dataKey: "name",
        stroke: "#888888",
        fontSize: 12,
        tickLine: false,
        axisLine: false
      }
    ),
    /* @__PURE__ */ jsx(
      YAxis,
      {
        stroke: "#888888",
        fontSize: 12,
        tickLine: false,
        axisLine: false,
        tickFormatter: (value) => `$${value}`
      }
    ),
    /* @__PURE__ */ jsx(
      Bar,
      {
        dataKey: "total",
        fill: "currentColor",
        radius: [4, 4, 0, 0],
        className: "fill-primary"
      }
    )
  ] }) });
}
function RecentSales() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxs(Avatar, { className: "h-9 w-9", children: [
        /* @__PURE__ */ jsx(AvatarImage, { src: "/avatars/01.png", alt: "Avatar" }),
        /* @__PURE__ */ jsx(AvatarFallback, { children: "OM" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-wrap items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm leading-none font-medium", children: "Olivia Martin" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "olivia.martin@email.com" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "font-medium", children: "+$1,999.00" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxs(Avatar, { className: "flex h-9 w-9 items-center justify-center space-y-0 border", children: [
        /* @__PURE__ */ jsx(AvatarImage, { src: "/avatars/02.png", alt: "Avatar" }),
        /* @__PURE__ */ jsx(AvatarFallback, { children: "JL" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-wrap items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm leading-none font-medium", children: "Jackson Lee" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "jackson.lee@email.com" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "font-medium", children: "+$39.00" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxs(Avatar, { className: "h-9 w-9", children: [
        /* @__PURE__ */ jsx(AvatarImage, { src: "/avatars/03.png", alt: "Avatar" }),
        /* @__PURE__ */ jsx(AvatarFallback, { children: "IN" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-wrap items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm leading-none font-medium", children: "Isabella Nguyen" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "isabella.nguyen@email.com" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "font-medium", children: "+$299.00" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxs(Avatar, { className: "h-9 w-9", children: [
        /* @__PURE__ */ jsx(AvatarImage, { src: "/avatars/04.png", alt: "Avatar" }),
        /* @__PURE__ */ jsx(AvatarFallback, { children: "WK" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-wrap items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm leading-none font-medium", children: "William Kim" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "will@email.com" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "font-medium", children: "+$99.00" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxs(Avatar, { className: "h-9 w-9", children: [
        /* @__PURE__ */ jsx(AvatarImage, { src: "/avatars/05.png", alt: "Avatar" }),
        /* @__PURE__ */ jsx(AvatarFallback, { children: "SD" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-wrap items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm leading-none font-medium", children: "Sofia Davis" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "sofia.davis@email.com" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "font-medium", children: "+$39.00" })
      ] })
    ] })
  ] });
}
function Dashboard() {
  return /* @__PURE__ */ jsx(BaseLayout, { children: /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Admin Dashboard" }),
    /* @__PURE__ */ jsxs(Main, { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2 space-y-2", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Dashboard" }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-2", children: /* @__PURE__ */ jsx(Button, { children: "Download" }) })
      ] }),
      /* @__PURE__ */ jsxs(
        Tabs,
        {
          orientation: "vertical",
          defaultValue: "overview",
          className: "space-y-4",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-full pb-2 overflow-x-auto", children: /* @__PURE__ */ jsxs(TabsList, { children: [
              /* @__PURE__ */ jsx(TabsTrigger, { value: "overview", children: "Overview" }),
              /* @__PURE__ */ jsx(TabsTrigger, { value: "analytics", disabled: true, children: "Analytics" }),
              /* @__PURE__ */ jsx(TabsTrigger, { value: "reports", disabled: true, children: "Reports" }),
              /* @__PURE__ */ jsx(TabsTrigger, { value: "notifications", disabled: true, children: "Notifications" })
            ] }) }),
            /* @__PURE__ */ jsxs(TabsContent, { value: "overview", className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
                /* @__PURE__ */ jsxs(Card, { children: [
                  /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2 space-y-0", children: [
                    /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Total Revenue" }),
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: "2",
                        className: "w-4 h-4 text-muted-foreground",
                        children: /* @__PURE__ */ jsx("path", { d: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs(CardContent, { children: [
                    /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: "$45,231.89" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "+20.1% from last month" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(Card, { children: [
                  /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2 space-y-0", children: [
                    /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Subscriptions" }),
                    /* @__PURE__ */ jsxs(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: "2",
                        className: "w-4 h-4 text-muted-foreground",
                        children: [
                          /* @__PURE__ */ jsx("path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }),
                          /* @__PURE__ */ jsx("circle", { cx: "9", cy: "7", r: "4" }),
                          /* @__PURE__ */ jsx("path", { d: "M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs(CardContent, { children: [
                    /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: "+2350" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "+180.1% from last month" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(Card, { children: [
                  /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2 space-y-0", children: [
                    /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Sales" }),
                    /* @__PURE__ */ jsxs(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: "2",
                        className: "w-4 h-4 text-muted-foreground",
                        children: [
                          /* @__PURE__ */ jsx("rect", { width: "20", height: "14", x: "2", y: "5", rx: "2" }),
                          /* @__PURE__ */ jsx("path", { d: "M2 10h20" })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs(CardContent, { children: [
                    /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: "+12,234" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "+19% from last month" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(Card, { children: [
                  /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2 space-y-0", children: [
                    /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Active Now" }),
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: "2",
                        className: "w-4 h-4 text-muted-foreground",
                        children: /* @__PURE__ */ jsx("path", { d: "M22 12h-4l-3 9L9 3l-3 9H2" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs(CardContent, { children: [
                    /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: "+573" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "+201 since last hour" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-7", children: [
                /* @__PURE__ */ jsxs(Card, { className: "col-span-1 lg:col-span-4", children: [
                  /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Overview" }) }),
                  /* @__PURE__ */ jsx(CardContent, { className: "ps-2", children: /* @__PURE__ */ jsx(Overview, {}) })
                ] }),
                /* @__PURE__ */ jsxs(Card, { className: "col-span-1 lg:col-span-3", children: [
                  /* @__PURE__ */ jsxs(CardHeader, { children: [
                    /* @__PURE__ */ jsx(CardTitle, { children: "Recent Sales" }),
                    /* @__PURE__ */ jsx(CardDescription, { children: "You made 265 sales this month." })
                  ] }),
                  /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(RecentSales, {}) })
                ] })
              ] })
            ] })
          ]
        }
      )
    ] })
  ] }) });
}
export {
  Dashboard as default
};

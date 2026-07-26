import { jsx, jsxs } from "react/jsx-runtime";
import { v as valueToKey, B as Button } from "./Button-CFMlPXiE.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, M as MarketFilters, e as MarketGrid } from "./MarketGrid-DlkazA02.js";
import { R as MenuScroller, G as Separator } from "./Sheet-B-_2BaZp.js";
import { usePage, Link } from "@inertiajs/react";
import { Search, ListRestart, SlidersHorizontal } from "lucide-react";
import { useState, useMemo } from "react";
import { c as categories, t as timeframes, m as marketsTwo } from "./demo-data-C5EGh9Nk.js";
import { f as CollapseWrapper } from "./TradeDialog-Dt4WEyMP.js";
import { P as PaginationWrapper } from "./PaginationWrapper-B-KWAp7V.js";
const MarketSectionTwo = ({ isMarket = false }) => {
  const { url } = usePage();
  const params = new URLSearchParams(url.split("?")[1]);
  const category = params.get("category");
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return valueToKey(categories.find((c) => c.active)?.label || "All");
  });
  const subCategories = categories.find((c) => valueToKey(c.label) === category)?.subCategories || [];
  const [selectedTimeframe, setSelectedTimeframe] = useState(() => {
    return valueToKey(timeframes.find((t) => t.active)?.label || "");
  });
  const [selectedVolume, setSelectedVolume] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Open");
  const handelCollapseOpen = () => setIsOpen((prev) => !prev);
  const handelCollapseClose = () => setIsOpen(false);
  const filteredMarkets = useMemo(() => {
    let filtered = [...marketsTwo];
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (market) => market.title?.toLowerCase().includes(query) || market.description?.toLowerCase().includes(query)
      );
    }
    if (selectedCategory !== valueToKey("All")) {
      const categoryLabel = categories.find(
        (c) => valueToKey(c.label) === selectedCategory
      )?.label;
      if (categoryLabel) {
        filtered = filtered.filter((market) => market.category === categoryLabel);
      }
    }
    if (selectedStatus !== "Open") {
      filtered = filtered.filter((market) => market.status === selectedStatus);
    }
    if (selectedVolume) {
      switch (selectedVolume) {
        case "volume":
          filtered.sort((a, b) => (b.volume || 0) - (a.volume || 0));
          break;
        case "ending_soon":
          filtered.sort((a, b) => {
            const aTime = new Date(a.endDate || 0).getTime();
            const bTime = new Date(b.endDate || 0).getTime();
            return aTime - bTime;
          });
          break;
        case "recently_added":
          filtered.sort((a, b) => {
            const aTime = new Date(a.createdDate || 0).getTime();
            const bTime = new Date(b.createdDate || 0).getTime();
            return bTime - aTime;
          });
          break;
        case "price_change":
          filtered.sort(
            (a, b) => Math.abs(b.priceChange || 0) - Math.abs(a.priceChange || 0)
          );
          break;
      }
    }
    return filtered;
  }, [searchQuery, selectedCategory, selectedTimeframe, selectedVolume, selectedStatus]);
  const clearMarketFilter = () => {
    setSearchQuery("");
    setSelectedCategory(valueToKey("All"));
    setSelectedVolume("");
    setSelectedStatus("Open");
  };
  return /* @__PURE__ */ jsx("section", { className: `${isMarket ? "pt-4 lg:pb-24 mb:pb-20 pb-16" : "lg:py-24 mb:py-20 py-16"}`, children: /* @__PURE__ */ jsxs("div", { className: "container px-4 mx-auto", children: [
    isMarket ? /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end justify-end gap-4 mb-4 md:items-center md:flex-row", children: [
        subCategories?.length > 0 && /* @__PURE__ */ jsx("div", { className: "w-full overflow-x-hidden grow", children: /* @__PURE__ */ jsx(MenuScroller, { children: /* @__PURE__ */ jsx("ul", { className: "flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap", children: subCategories.map((sub, index) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { href: "#", className: "flex items-center h-8 px-4 font-medium rounded-full border-1 hover:border-primary hover:bg-primary/10 hover:text-primary text-sm/5", children: sub.label }) }, index)) }) }) }),
        /* @__PURE__ */ jsx("div", { className: "h-6", children: /* @__PURE__ */ jsx(Separator, { orientation: "vertical" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2 md:shrink-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-full group", children: [
            /* @__PURE__ */ jsx(
              Search,
              {
                className: "absolute w-4 h-4 transition-colors transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground group-focus-within:text-primary"
              }
            ),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "search-input",
                placeholder: "Search markets...",
                className: "h-8 transition-all duration-200 shadow-none ps-10 bg-accent border-border/50 focus:border-primary/50 hover:bg-background/70",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: () => {
                clearMarketFilter();
                handelCollapseClose();
              },
              size: "icon",
              className: "text-red-500 bg-red-100 cursor-pointer size-8 hover:bg-red-600 hover:text-red-100",
              children: [
                /* @__PURE__ */ jsx(ListRestart, { className: "size-4" }),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Reset" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "secondary",
              size: "icon",
              className: "cursor-pointer size-8",
              onClick: handelCollapseOpen,
              children: [
                /* @__PURE__ */ jsx(SlidersHorizontal, { className: "size-4" }),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Filter" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx(CollapseWrapper, { open: isOpen, onOpenChange: setIsOpen, children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-3 lg:gap-5", children: [
        /* @__PURE__ */ jsx("div", { className: "w-full col-span-6 lg:col-span-2 md:col-span-4", children: /* @__PURE__ */ jsxs(
          Select,
          {
            className: "w-full",
            value: selectedTimeframe,
            onValueChange: setSelectedTimeframe,
            children: [
              /* @__PURE__ */ jsx(
                SelectTrigger,
                {
                  id: "timeframe-select",
                  className: "w-full h-8 shadow-none cursor-pointer",
                  children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "All Timeframes" })
                }
              ),
              /* @__PURE__ */ jsx(SelectContent, { children: timeframes.map((time) => /* @__PURE__ */ jsx(
                SelectItem,
                {
                  value: valueToKey(time.label),
                  children: time.label
                },
                valueToKey(time.label)
              )) })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "w-full col-span-6 lg:col-span-2 md:col-span-4", children: /* @__PURE__ */ jsxs(
          Select,
          {
            className: "w-full",
            value: selectedVolume,
            onValueChange: setSelectedVolume,
            children: [
              /* @__PURE__ */ jsx(
                SelectTrigger,
                {
                  id: "volume-select",
                  className: "w-full h-8 shadow-none cursor-pointer",
                  children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Volume" })
                }
              ),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "volume", children: "Volume" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "ending_soon", children: "Ending Soon" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "recently_added", children: "Recently Added" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "price_change", children: "Price Change" })
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "w-full col-span-6 lg:col-span-2 md:col-span-4", children: /* @__PURE__ */ jsxs(
          Select,
          {
            className: "w-full",
            value: selectedStatus,
            onValueChange: setSelectedStatus,
            children: [
              /* @__PURE__ */ jsx(
                SelectTrigger,
                {
                  id: "status-select",
                  className: "w-full h-8 shadow-none cursor-pointer",
                  children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Open" })
                }
              ),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "Open", children: "Open" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "Closed", children: "Closed" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "Resolved", children: "Resolved" })
              ] })
            ]
          }
        ) })
      ] }) }),
      /* @__PURE__ */ jsx(Separator, { className: "my-4" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "mb-6 sticky top-[56px] p-4 bg-card border z-30 rounded-md", children: /* @__PURE__ */ jsx(
      MarketFilters,
      {
        isOpen,
        setIsOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedTimeframe,
        setSelectedTimeframe,
        selectedVolume,
        setSelectedVolume,
        selectedStatus,
        setSelectedStatus,
        categories,
        timeframes,
        clearMarketFilter,
        handelCollapseOpen,
        handelCollapseClose
      }
    ) }),
    /* @__PURE__ */ jsx(MarketGrid, { filteredMarkets, themeTwo: "true" }),
    /* @__PURE__ */ jsx(PaginationWrapper, {})
  ] }) });
};
export {
  MarketSectionTwo as M
};

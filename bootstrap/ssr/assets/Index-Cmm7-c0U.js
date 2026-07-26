import { jsx, jsxs } from "react/jsx-runtime";
import { N as FancyButton } from "./Sheet-B-_2BaZp.js";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import { B as Button } from "./Button-CFMlPXiE.js";
import { P as Progress } from "./Progress-DT6CA82_.js";
import { useState } from "react";
import { BsBookmarkCheckFill, BsBookmark } from "react-icons/bs";
import { a as markets } from "./demo-data-C5EGh9Nk.js";
import { P as PaginationWrapper } from "./PaginationWrapper-B-KWAp7V.js";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-RBWn151p.js";
import "@radix-ui/react-direction";
import "@inertiajs/react";
import "class-variance-authority";
import "lucide-react";
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
import "@radix-ui/react-progress";
import "./AppLayout-BOaFJ-XR.js";
import "./HotToast-DfpkTxSC.js";
import "framer-motion";
import "react-responsive";
import "./Popover-Ckus2dfK.js";
import "@radix-ui/react-popover";
import "react-icons/tfi";
const BookmarkList = () => {
  const [bookmarkedItems, setBookmarkedItems] = useState(/* @__PURE__ */ new Set());
  const handleBookmarkToggle = (marketId) => {
    setBookmarkedItems((prev) => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(marketId)) {
        newBookmarks.delete(marketId);
      } else {
        newBookmarks.add(marketId);
      }
      return newBookmarks;
    });
  };
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1", children: markets.length > 0 && markets.map((market) => {
    const yesPercentage = Math.round(market.yesPrice * 100);
    const isBookmarked = bookmarkedItems.has(market.id);
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4 p-3 border-b cursor-pointer last:border-b-none lg:flex-nowrap hover:bg-primary/5", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex flex-grow gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-full overflow-hidden rounded-md aspect-16/6 max-w-40 shrink-0", children: /* @__PURE__ */ jsx("img", { src: market?.imageUrl, className: "object-cover w-full h-full" }) }),
        /* @__PURE__ */ jsxs("div", { className: "grow", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold md:text-base", children: market?.title }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 mt-3 max-w-[250px] w-full", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: "Yes" }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-primary animate-pulse", children: [
                yesPercentage,
                "¢"
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              Progress,
              {
                value: yesPercentage,
                className: "w-full h-2 transition-all duration-300"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                "No: ",
                Math.round(market.noPrice * 100),
                "¢"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                yesPercentage,
                "% chance"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-3 start-3", children: /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "badge-enhanced animate-float border-b-accent ", children: market.category }) })
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
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "secondary",
            size: "sm",
            onClick: () => handleBookmarkToggle(market.id),
            className: "transition-all duration-200 border cursor-pointer hover:scale-110 shrink-0 border-border",
            children: isBookmarked ? /* @__PURE__ */ jsx(BsBookmarkCheckFill, { className: "text-primary" }) : /* @__PURE__ */ jsx(BsBookmark, {})
          }
        )
      ] })
    ] }, market?.id);
  }) });
};
const Bookmark = () => {
  return /* @__PURE__ */ jsx(AuthenticatedLayout, { children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4 mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Bookmark" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Track your positions and trading history" })
    ] }) }) }),
    /* @__PURE__ */ jsx(BookmarkList, {}),
    /* @__PURE__ */ jsx(PaginationWrapper, {})
  ] }) });
};
export {
  Bookmark as default
};

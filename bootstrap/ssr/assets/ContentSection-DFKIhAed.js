import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import "react";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./MarketGrid-DlkazA02.js";
import { a as cn, p as isMenuActive, b as buttonVariants } from "./Button-CFMlPXiE.js";
import { S as ScrollArea, G as Separator } from "./Sheet-B-_2BaZp.js";
import { Link, router } from "@inertiajs/react";
function SidebarNav({ className, items, url, title, ...props }) {
  const handleSelect = (selectedHref) => {
    router.visit(selectedHref);
  };
  const groupedItems = [
    {
      label: "General",
      items: items.filter(
        (item) => [
          "General",
          "Appearance",
          "Logo",
          "Storage",
          "Currency",
          "Account"
        ].includes(item.title)
      )
    },
    {
      label: "Security",
      items: items.filter(
        (item) => [
          "Security Center",
          "reCAPTCHA",
          "Social Login",
          "Password",
          "2FA",
          "Sessions"
        ].includes(item.title)
      )
    },
    {
      label: "Advanced",
      items: items.filter(
        (item) => ["System Config", "SEO Settings", "Ticket Configuration"].includes(item.title)
      )
    }
  ].filter((group) => group.items.length > 0);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "p-1 md:hidden", children: /* @__PURE__ */ jsxs(Select, { onValueChange: handleSelect, value: url, children: [
      /* @__PURE__ */ jsx(SelectTrigger, { className: "h-12 sm:w-48", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: title }) }),
      /* @__PURE__ */ jsx(SelectContent, { children: groupedItems.map((group) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "px-2 py-1.5 text-xs font-semibold text-muted-foreground", children: group.label }),
        group.items.map((item) => /* @__PURE__ */ jsx(SelectItem, { value: item.href, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-x-3", children: [
          /* @__PURE__ */ jsx("span", { className: "scale-110", children: item.icon }),
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: item.title })
        ] }) }, item.href))
      ] }, group.label)) })
    ] }) }),
    /* @__PURE__ */ jsx(
      ScrollArea,
      {
        className: "hidden w-full h-[calc(100vh-12rem)] md:block",
        children: /* @__PURE__ */ jsx(
          "nav",
          {
            className: cn(
              "flex flex-col space-y-6 px-2 py-2",
              className
            ),
            ...props,
            children: groupedItems.map((group) => /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("div", { className: "px-3 py-1.5", children: /* @__PURE__ */ jsx("h4", { className: "text-xs font-semibold tracking-wider uppercase text-muted-foreground", children: group.label }) }),
              /* @__PURE__ */ jsx("div", { className: "space-y-1", children: group.items.map((item) => /* @__PURE__ */ jsxs(
                Link,
                {
                  href: item.href,
                  onClick: (e) => {
                    e.preventDefault();
                    router.visit(item.href, {
                      preserveScroll: true,
                      preserveState: true
                    });
                  },
                  className: cn(
                    buttonVariants({ variant: "ghost" }),
                    "justify-start w-full transition-all duration-200",
                    isMenuActive(url, item) ? "bg-primary/10 text-primary hover:bg-primary/15 font-medium border-l-2 border-primary" : "hover:bg-accent hover:text-accent-foreground border-l-2 border-transparent"
                  ),
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "flex-shrink-0 mr-3", children: item.icon }),
                    /* @__PURE__ */ jsx("span", { className: "truncate", children: item.title })
                  ]
                },
                item.href
              )) })
            ] }, group.label))
          }
        )
      }
    )
  ] });
}
function ContentSection({ title, desc, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-1", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-none", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium", children: title }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: desc })
    ] }),
    /* @__PURE__ */ jsx(Separator, { className: "flex-none my-4" }),
    /* @__PURE__ */ jsx("div", { className: "w-full h-full pb-12 overflow-y-auto faded-bottom scroll-smooth pe-4", children: /* @__PURE__ */ jsx("div", { className: "-mx-1 px-1.5 lg:max-w-xl", children }) })
  ] });
}
export {
  ContentSection as C,
  SidebarNav as S
};

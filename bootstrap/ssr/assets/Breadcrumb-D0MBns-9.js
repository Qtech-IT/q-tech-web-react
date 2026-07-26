import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { Link } from "@inertiajs/react";
import { ChevronRight, Home } from "lucide-react";
import { a as cn } from "./Button-CFMlPXiE.js";
const Breadcrumb = ({ items }) => {
  return /* @__PURE__ */ jsx("nav", { "aria-label": "breadcrumb", className: "flex items-center", children: /* @__PURE__ */ jsx("ol", { className: "flex items-center gap-1 text-sm text-muted-foreground", children: items.map((item, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
    index > 0 && /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 mx-1 text-muted-foreground" }),
    item.href ? /* @__PURE__ */ jsxs(
      Link,
      {
        href: item.href,
        className: cn(
          "flex items-center hover:text-foreground transition-colors",
          index === 0 ? "text-muted-foreground" : "text-foreground"
        ),
        children: [
          index === 0 && /* @__PURE__ */ jsx(Home, { className: "w-4 h-4 mr-1" }),
          item.label
        ]
      }
    ) : /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: item.label })
  ] }, index)) }) });
};
export {
  Breadcrumb as B
};

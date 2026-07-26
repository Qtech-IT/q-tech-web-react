import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { B as Button } from "./Button-CFMlPXiE.js";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { router } from "@inertiajs/react";
const Pagination = ({ links, meta }) => {
  if (!links || !meta) return null;
  const handlePageChange = (url) => {
    if (url) {
      router.visit(url, { preserveState: true, preserveScroll: true });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6 bg-white border border-gray-200 shadow-sm rounded-xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-between gap-4 sm:flex-row", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 rounded-lg bg-gray-50", children: /* @__PURE__ */ jsx("div", { className: "w-4 h-4 rounded bg-gradient-to-r from-blue-500 to-purple-500" }) }),
        /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600", children: [
          "Showing ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900", children: meta.from || 0 }),
          " to",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900", children: meta.to || 0 }),
          " of",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900", children: meta.total }),
          " results"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => handlePageChange(links.first),
            disabled: !links.prev,
            className: "hidden p-0 border-gray-300 sm:flex h-9 w-9 hover:bg-gray-50",
            title: "First page",
            children: /* @__PURE__ */ jsx(ChevronsLeft, { className: "w-4 h-4" })
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => handlePageChange(links.prev),
            disabled: !links.prev,
            className: "px-3 border-gray-300 h-9 hover:bg-gray-50",
            title: "Previous page",
            children: [
              /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4 mr-1" }),
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Previous" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-1", children: links.data?.map((link, index) => {
          if (link.label === "&laquo; Previous" || link.label === "Next &raquo;") {
            return null;
          }
          const isEllipsis = link.label.includes("...");
          if (isEllipsis) {
            return /* @__PURE__ */ jsx("span", { className: "px-2 py-1 text-sm text-gray-400", children: "..." }, index);
          }
          return /* @__PURE__ */ jsx(
            Button,
            {
              variant: link.active ? "default" : "outline",
              size: "sm",
              onClick: () => handlePageChange(link.url),
              disabled: !link.url,
              className: `h-9 min-w-9 ${link.active ? "bg-gradient-to-r from-blue-600 to-blue-700 border-blue-600 text-white shadow-sm" : "border-gray-300 hover:bg-gray-50"}`,
              dangerouslySetInnerHTML: { __html: link.label }
            },
            index
          );
        }) }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => handlePageChange(links.next),
            disabled: !links.next,
            className: "px-3 border-gray-300 h-9 hover:bg-gray-50",
            title: "Next page",
            children: [
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Next" }),
              /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 ml-1" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => handlePageChange(links.last),
            disabled: !links.next,
            className: "hidden p-0 border-gray-300 sm:flex h-9 w-9 hover:bg-gray-50",
            title: "Last page",
            children: /* @__PURE__ */ jsx(ChevronsRight, { className: "w-4 h-4" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "pt-4 mt-4 border-t border-gray-200 sm:hidden", children: /* @__PURE__ */ jsxs("div", { className: "text-sm text-center text-gray-500", children: [
      "Page ",
      meta.current_page,
      " of ",
      meta.last_page
    ] }) })
  ] });
};
export {
  Pagination as P
};

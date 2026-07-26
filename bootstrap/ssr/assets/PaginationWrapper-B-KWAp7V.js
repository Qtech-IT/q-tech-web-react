import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronLeftIcon, MoreHorizontalIcon, ChevronRightIcon } from "lucide-react";
import { Link } from "@inertiajs/react";
import { a as cn, b as buttonVariants } from "./Button-CFMlPXiE.js";
import { L as useTranslations } from "./Sheet-B-_2BaZp.js";
function Pagination({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "nav",
    {
      role: "navigation",
      "aria-label": "pagination",
      "data-slot": "pagination",
      className: cn("mx-auto flex w-full justify-center", className),
      ...props
    }
  );
}
function PaginationContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "ul",
    {
      "data-slot": "pagination-content",
      className: cn("flex flex-row items-center gap-1", className),
      ...props
    }
  );
}
function PaginationItem({
  ...props
}) {
  return /* @__PURE__ */ jsx("li", { "data-slot": "pagination-item", ...props });
}
function PaginationLink({
  className,
  isActive,
  size = "icon",
  href,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Link,
    {
      href,
      "aria-current": isActive ? "page" : void 0,
      "data-slot": "pagination-link",
      "data-active": isActive,
      className: cn(buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size
      }), className),
      ...props
    }
  );
}
function PaginationPrevious({
  className,
  ...props
}) {
  const { t } = useTranslations();
  return /* @__PURE__ */ jsxs(
    PaginationLink,
    {
      "aria-label": "Go to previous page",
      size: "default",
      className: cn("gap-1 px-2.5 sm:pl-2.5", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx(ChevronLeftIcon, {}),
        /* @__PURE__ */ jsx("span", { className: "hidden sm:block", children: t("previous") })
      ]
    }
  );
}
function PaginationNext({
  className,
  ...props
}) {
  const { t } = useTranslations();
  return /* @__PURE__ */ jsxs(
    PaginationLink,
    {
      "aria-label": "Go to next page",
      size: "default",
      className: cn("gap-1 px-2.5 sm:pr-2.5", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: "hidden sm:block", children: t("next") }),
        /* @__PURE__ */ jsx(ChevronRightIcon, {})
      ]
    }
  );
}
function PaginationEllipsis({
  className,
  ...props
}) {
  const { t } = useTranslations();
  return /* @__PURE__ */ jsxs(
    "span",
    {
      "aria-hidden": true,
      "data-slot": "pagination-ellipsis",
      className: cn("flex size-9 items-center justify-center", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx(MoreHorizontalIcon, { className: "size-4" }),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: t("more_pages") })
      ]
    }
  );
}
function PaginationWrapper({ meta, links }) {
  if (!meta || meta.last_page <= 1) return null;
  const { current_page, last_page } = meta;
  const pages = [];
  for (let i = 1; i <= last_page; i++) {
    if (i === 1 || i === last_page || i >= current_page - 1 && i <= current_page + 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }
  return /* @__PURE__ */ jsx(Pagination, { className: "mt-12", children: /* @__PURE__ */ jsxs(PaginationContent, { children: [
    /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(
      PaginationPrevious,
      {
        href: links.prev || "#",
        className: !links.prev ? "opacity-50 pointer-events-none" : ""
      }
    ) }),
    pages.map(
      (page, idx) => page === "..." ? /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(PaginationEllipsis, {}) }, idx) : /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(
        PaginationLink,
        {
          href: `?page=${page}`,
          isActive: page === current_page,
          children: page
        }
      ) }, idx)
    ),
    /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(
      PaginationNext,
      {
        href: links.next || "#",
        className: !links.next ? "opacity-50 pointer-events-none" : ""
      }
    ) })
  ] }) });
}
export {
  PaginationWrapper as P
};

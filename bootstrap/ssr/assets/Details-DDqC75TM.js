import { jsx, jsxs } from "react/jsx-runtime";
import { t as sanitizeHTML } from "./Button-CFMlPXiE.js";
import { Newspaper } from "lucide-react";
import { useMemo } from "react";
import { A as AppLayout } from "./AppLayout-BOaFJ-XR.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "react-hot-toast";
import "tailwind-merge";
import "@inertiajs/react";
import "./Sheet-B-_2BaZp.js";
import "@radix-ui/react-direction";
import "@radix-ui/react-icons";
import "@radix-ui/react-avatar";
import "@radix-ui/react-separator";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "@radix-ui/react-dialog";
import "@radix-ui/react-scroll-area";
import "./HotToast-DfpkTxSC.js";
import "framer-motion";
import "react-responsive";
import "./Badge-B6jlhcU-.js";
import "./Popover-Ckus2dfK.js";
import "@radix-ui/react-popover";
import "react-icons/tfi";
const PageDetails = ({ page }) => {
  const sanitizedContent = useMemo(() => {
    return sanitizeHTML(page?.description || "");
  }, [page?.description]);
  return /* @__PURE__ */ jsx("section", { className: "py-16 isolate lg:py-24 mb:py-20", children: /* @__PURE__ */ jsxs("div", { className: "container px-4 mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary", children: [
      /* @__PURE__ */ jsx(Newspaper, { className: "size-4" }),
      page?.title
    ] }) }) }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-strong:text-gray-900",
        dangerouslySetInnerHTML: { __html: sanitizedContent }
      }
    )
  ] }) });
};
const Details = ({ page }) => {
  page = page?.data;
  return /* @__PURE__ */ jsx(AppLayout, { children: /* @__PURE__ */ jsx(PageDetails, { page }) });
};
export {
  Details as default
};

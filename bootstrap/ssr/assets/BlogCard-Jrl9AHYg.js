import { jsxs, jsx } from "react/jsx-runtime";
import "./Badge-B6jlhcU-.js";
import { l as limitText } from "./Button-CFMlPXiE.js";
import { Link } from "@inertiajs/react";
const BlogCard = ({ blog }) => {
  const { id, title, created_at: date, slug, img_url: image, categories } = blog;
  return /* @__PURE__ */ jsxs("div", { className: "h-full duration-200 group", children: [
    image && /* @__PURE__ */ jsx(Link, { href: route("blogs.show", slug), className: "block mb-5 overflow-hidden rounded-lg aspect-video", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: image,
        alt: title,
        className: "object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "xl:px-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4 mb-2", children: /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: date }) }),
      /* @__PURE__ */ jsx(Link, { href: route("blogs.show", slug), children: /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold transition-all text-foreground line-clamp-2 group-hover:text-primary hover:underline", children: limitText(title, 70) }) })
    ] })
  ] });
};
export {
  BlogCard as B
};

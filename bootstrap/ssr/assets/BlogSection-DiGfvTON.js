import { jsx, jsxs } from "react/jsx-runtime";
import { E as EmptyData } from "./EmptyData-DjqqIMwS.js";
import { L as useTranslations, N as FancyButton } from "./Sheet-B-_2BaZp.js";
import { motion } from "framer-motion";
import { B as BlogCard } from "./BlogCard-Jrl9AHYg.js";
import { e as getSectionData } from "./Button-CFMlPXiE.js";
const BlogSection = ({ data, className }) => {
  let blogs = data?.blogs?.data || [];
  const sectionData = getSectionData(data);
  const { t } = useTranslations();
  return /* @__PURE__ */ jsx("section", { className: `lg:py-24 mb:py-20 py-16 bg-primary/5 ${className || " "}`, children: /* @__PURE__ */ jsxs("div", { className: "container px-4 mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between mb-8 lg:mb-12", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-6 text-3xl font-bold tracking-tight lg:text-4xl", children: sectionData?.title }),
        /* @__PURE__ */ jsx("p", { className: "leading-relaxed md:text-lg text-muted-foreground", children: sectionData?.description })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "shrink-0", children: /* @__PURE__ */ jsx(FancyButton, { href: route("blogs"), label: t("view_all"), variant: "outline" }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-12 md:gap-x-6 gap-x-4 gap-y-8", children: blogs?.length > 0 ? blogs?.map((blog, index) => /* @__PURE__ */ jsx("div", { className: "lg:col-span-4 sm:col-span-6 col-span-full", children: /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: index * 0.1 },
        viewport: { once: true },
        className: "group",
        children: /* @__PURE__ */ jsx(BlogCard, { blog })
      },
      blog.id
    ) }, blog?.id)) : /* @__PURE__ */ jsx("div", { className: "col-span-full", children: /* @__PURE__ */ jsx(
      EmptyData,
      {
        title: "No blogs found",
        description: "No blog posts available. Create your first blog post to get started."
      }
    ) }) })
  ] }) });
};
export {
  BlogSection as B
};

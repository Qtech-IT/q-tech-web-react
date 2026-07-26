import { jsxs, jsx } from "react/jsx-runtime";
import { E as EmptyData } from "./EmptyData-DjqqIMwS.js";
import { L as useTranslations, W as handleBlogSearch, R as MenuScroller, X as handleBlogCategoryFilter, G as Separator } from "./Sheet-B-_2BaZp.js";
import { P as PaginationWrapper } from "./PaginationWrapper-B-KWAp7V.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import { L as Label } from "./Label-BxDBN09D.js";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { FaBlog } from "react-icons/fa6";
import { B as BlogCard } from "./BlogCard-Jrl9AHYg.js";
import { useState, useEffect } from "react";
import { router, Head } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-BOaFJ-XR.js";
import "clsx";
import "react-hot-toast";
import "@radix-ui/react-direction";
import "./Button-CFMlPXiE.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "tailwind-merge";
import "@radix-ui/react-icons";
import "@radix-ui/react-avatar";
import "@radix-ui/react-separator";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "@radix-ui/react-dialog";
import "@radix-ui/react-scroll-area";
import "@radix-ui/react-label";
import "./Badge-B6jlhcU-.js";
import "./HotToast-DfpkTxSC.js";
import "react-responsive";
import "./Popover-Ckus2dfK.js";
import "@radix-ui/react-popover";
import "react-icons/tfi";
const Blogs = ({ props }) => {
  const { t } = useTranslations();
  let {
    blogs = [],
    categories = [],
    filters = {},
    config,
    search
  } = props;
  const { meta, links } = blogs;
  blogs = blogs?.data?.data || [];
  categories = categories?.data || [];
  const sectionData = config?.data.value;
  const [searchQuery, setSearchQuery] = useState(filters?.search || "");
  const [isClearing, setIsClearing] = useState(false);
  useEffect(() => {
    if (isClearing) {
      setIsClearing(false);
      return;
    }
    const timer = setTimeout(() => {
      if (searchQuery !== (filters?.search || "")) {
        handleBlogSearch(searchQuery, filters);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  useEffect(() => {
    if (!isClearing) {
      setSearchQuery(filters?.search || "");
    }
  }, [filters?.search]);
  const clearFilters = () => {
    setIsClearing(true);
    setSearchQuery("");
    router.get(window.location.pathname, {}, {
      preserveState: true,
      preserveScroll: true,
      only: ["blogs", "search", "filters", "categories"]
    });
  };
  return /* @__PURE__ */ jsxs("section", { className: "py-16 isolate lg:py-24 mb:py-20", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        "aria-hidden": "true",
        className: "absolute inset-x-0 overflow-hidden -top-40 -z-10 transform-gpu blur-3xl sm:-top-80",
        children: /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
            },
            className: "relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-primary opacity-10 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "container px-4 mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-12 text-center lg:mb-20", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary", children: [
          /* @__PURE__ */ jsx(FaBlog, { className: "size-4" }),
          sectionData?.title
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "mb-4 text-3xl font-bold lg:text-5xl", children: sectionData?.subtitle }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 ", children: sectionData?.description })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end justify-end gap-4 mb-4 md:items-center md:flex-row", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2.5 grow", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "search-input grow", children: t("browse_by_categories") }),
            categories?.length > 0 && /* @__PURE__ */ jsx("div", { className: "w-full overflow-x-hidden", children: /* @__PURE__ */ jsx(MenuScroller, { children: /* @__PURE__ */ jsxs("ul", { className: "flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap", children: [
              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleBlogCategoryFilter(null, filters),
                  className: `px-4 h-8 flex cursor-pointer items-center font-medium border-1 rounded-full text-sm/5 hover:border-primary hover:bg-primary/10 hover:text-primary ${!filters?.category ? "border-primary bg-primary/10 text-primary" : ""}`,
                  children: t("all")
                }
              ) }),
              categories.map((category, index) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleBlogCategoryFilter(category?.slug, filters),
                  className: `px-4 h-8 flex cursor-pointer items-center font-medium border-1 rounded-full text-sm/5 hover:border-primary hover:bg-primary/10 hover:text-primary ${filters?.category === category?.slug ? "border-primary bg-primary/10 text-primary" : ""}`,
                  children: category.name
                }
              ) }, `${category?.id}-${index}`))
            ] }) }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end gap-2 md:shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-2.5", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "search-input", children: t("search") }),
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
                  placeholder: "Search blogs...",
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  className: "w-full h-10 transition-all duration-200 shadow-none ps-10 bg-accent border-border/50 focus:border-primary/50 hover:bg-background/70"
                }
              )
            ] })
          ] }) })
        ] }),
        (filters?.category || filters?.search) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
            t("active_filters"),
            ":"
          ] }),
          filters?.category && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary", children: [
            t("category"),
            ": ",
            categories.find((c) => c.slug === filters.category)?.name
          ] }),
          filters?.search && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary", children: [
            t("Search"),
            ": ",
            filters.search
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: clearFilters,
              className: "text-xs text-muted-foreground hover:text-primary",
              children: t("clear_all")
            }
          )
        ] }),
        /* @__PURE__ */ jsx(Separator, { className: "my-6" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-12 md:gap-x-6 gap-x-4 gap-y-8", children: blogs?.length > 0 && blogs?.map((blog, index) => /* @__PURE__ */ jsx("div", { className: "lg:col-span-4 sm:col-span-6 col-span-full", children: /* @__PURE__ */ jsx(
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
        ) }, `${blog?.id}-blog-${index}`)) }),
        blogs?.length == 0 && /* @__PURE__ */ jsx(
          EmptyData,
          {
            title: "No blogs found",
            description: "No blog posts available. Create your first blog post to get started."
          }
        ),
        /* @__PURE__ */ jsx(
          PaginationWrapper,
          {
            links,
            meta
          }
        )
      ] })
    ] })
  ] });
};
const Index = (props) => {
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: props?.title }),
    /* @__PURE__ */ jsx(Blogs, { props })
  ] });
};
export {
  Index as default
};

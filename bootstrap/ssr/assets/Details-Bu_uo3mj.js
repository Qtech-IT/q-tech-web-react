import { jsxs, jsx } from "react/jsx-runtime";
import { t as sanitizeHTML, B as Button } from "./Button-CFMlPXiE.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./Card-CQ2ij0--.js";
import { S as SlideUp } from "./SlideUp-CpffxXZf.js";
import { L as useTranslations } from "./Sheet-B-_2BaZp.js";
import { router, Head } from "@inertiajs/react";
import { Calendar, Clock, Share2 } from "lucide-react";
import { useState, useMemo } from "react";
import { LuFacebook } from "react-icons/lu";
import { RiTwitterXLine } from "react-icons/ri";
import { FaLinkedin, FaWhatsapp, FaReddit } from "react-icons/fa";
import toast from "react-hot-toast";
import { B as BlogSection } from "./BlogSection-DiGfvTON.js";
import { A as AppLayout } from "./AppLayout-BOaFJ-XR.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "framer-motion";
import "@radix-ui/react-direction";
import "@radix-ui/react-icons";
import "@radix-ui/react-avatar";
import "@radix-ui/react-separator";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "@radix-ui/react-dialog";
import "@radix-ui/react-scroll-area";
import "./EmptyData-DjqqIMwS.js";
import "./BlogCard-Jrl9AHYg.js";
import "./Badge-B6jlhcU-.js";
import "./HotToast-DfpkTxSC.js";
import "react-responsive";
import "./Popover-Ckus2dfK.js";
import "@radix-ui/react-popover";
import "react-icons/tfi";
const BlogDetails = ({ blog }) => {
  const {
    id,
    title,
    created_at: date,
    slug,
    description,
    img_url: image,
    categories,
    tags,
    human_created_at
  } = blog;
  const { t } = useTranslations();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const sanitizedContent = useMemo(() => {
    return sanitizeHTML(description || "");
  }, [description]);
  const blogUrl = useMemo(() => {
    return window.location.href;
  }, []);
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };
  const shareOnTwitter = () => {
    const text = encodeURIComponent(title);
    const url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(blogUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };
  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blogUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };
  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`${title} - ${blogUrl}`);
    const url = `https://wa.me/?text=${text}`;
    window.open(url, "_blank");
  };
  const shareOnReddit = () => {
    const url = `https://reddit.com/submit?url=${encodeURIComponent(blogUrl)}&title=${encodeURIComponent(title)}`;
    window.open(url, "_blank", "width=600,height=400");
  };
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(blogUrl);
      toast.success(t("link_copied") || "Link copied to clipboard!");
    } catch (err) {
      toast.error(t("copy_failed") || "Failed to copy link");
    }
  };
  const shareViaWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: title,
          url: blogUrl
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      setShowShareOptions(!showShareOptions);
    }
  };
  return /* @__PURE__ */ jsxs("section", { className: "pt-8 pb-16 isolate lg:pb-24 mb:pb-20", children: [
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
    /* @__PURE__ */ jsx("div", { className: "container px-4 mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 lg:flex-row md:gap-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-full grow", children: [
        /* @__PURE__ */ jsx(SlideUp, { children: /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center mb-4 space-x-2 text-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1 text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: date })
            ] }) }),
            /* @__PURE__ */ jsx("h1", { className: "mb-4 text-xl font-bold sm:text-2xl md:text-3xl", children: title }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { children: human_created_at })
              ] }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: shareViaWebShare,
                  className: "gap-2",
                  children: [
                    /* @__PURE__ */ jsx(Share2, { className: "w-4 h-4" }),
                    /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: t("share") || "Share" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "block overflow-hidden aspect-16/6 lg:rounded-3xl rounded-xl", children: /* @__PURE__ */ jsx("img", { src: image, alt: title, className: "w-full" }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "md:px-6", children: /* @__PURE__ */ jsx("div", { className: "grid gap-8 text-start", children: /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: sanitizedContent } }) }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full xl:w-96 lg:w-80 shrink-0", children: /* @__PURE__ */ jsx("div", { className: "sticky top-[calc(56px+20px)]", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-8", children: [
        /* @__PURE__ */ jsxs(Card, { className: "gap-3 p-0 bg-transparent border-none shadow-none rounded-0", children: [
          /* @__PURE__ */ jsx(CardHeader, { className: "px-0", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: t("categories") }) }),
          /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: categories?.map((category) => /* @__PURE__ */ jsx(
            Button,
            {
              onClick: () => router.get(route("blogs", { category: category.slug })),
              variant: "secondary",
              className: "justify-center cursor-pointer",
              children: category?.name
            },
            category.id
          )) }) })
        ] }),
        tags?.length > 0 && /* @__PURE__ */ jsxs(Card, { className: "gap-3 p-0 bg-transparent border-none shadow-none rounded-0", children: [
          /* @__PURE__ */ jsx(CardHeader, { className: "px-0", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: t("popular_tags") }) }),
          /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: tags?.map((tag) => /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: () => router.get(route("blogs", { tag: tag.slug })),
              variant: "outline",
              className: "cursor-pointer",
              children: [
                "#",
                tag?.name
              ]
            },
            `${tag.id}-tag`
          )) }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "gap-3 p-0 bg-transparent border-none shadow-none rounded-0", children: [
          /* @__PURE__ */ jsx(CardHeader, { className: "px-0", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: t("share_this_blog") }) }),
          /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: shareOnFacebook,
                className: "flex items-center justify-center text-white transition-transform bg-blue-600 rounded-full hover:scale-110 size-10",
                "aria-label": "Share on Facebook",
                children: /* @__PURE__ */ jsx(LuFacebook, { className: "size-5" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: shareOnTwitter,
                className: "flex items-center justify-center text-white transition-transform bg-black rounded-full hover:scale-110 size-10",
                "aria-label": "Share on Twitter",
                children: /* @__PURE__ */ jsx(RiTwitterXLine, { className: "size-5" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: shareOnLinkedIn,
                className: "flex items-center justify-center text-white transition-transform bg-blue-700 rounded-full hover:scale-110 size-10",
                "aria-label": "Share on LinkedIn",
                children: /* @__PURE__ */ jsx(FaLinkedin, { className: "size-5" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: shareOnWhatsApp,
                className: "flex items-center justify-center text-white transition-transform bg-green-500 rounded-full hover:scale-110 size-10",
                "aria-label": "Share on WhatsApp",
                children: /* @__PURE__ */ jsx(FaWhatsapp, { className: "size-5" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: shareOnReddit,
                className: "flex items-center justify-center text-white transition-transform bg-orange-600 rounded-full hover:scale-110 size-10",
                "aria-label": "Share on Reddit",
                children: /* @__PURE__ */ jsx(FaReddit, { className: "size-5" })
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                onClick: copyLink,
                variant: "outline",
                size: "sm",
                className: "gap-2",
                children: [
                  /* @__PURE__ */ jsx(Share2, { className: "w-4 h-4" }),
                  t("copy_link") || "Copy Link"
                ]
              }
            )
          ] }) })
        ] })
      ] }) }) })
    ] }) })
  ] });
};
const Details = ({
  blog,
  data: relatedBlogs
}) => {
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: blog.data?.title }),
    /* @__PURE__ */ jsx(BlogDetails, { blog: blog.data }),
    /* @__PURE__ */ jsx(BlogSection, { data: relatedBlogs })
  ] });
};
export {
  Details as default
};

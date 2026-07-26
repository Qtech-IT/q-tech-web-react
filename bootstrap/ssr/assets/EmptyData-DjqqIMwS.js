import { jsx, jsxs } from "react/jsx-runtime";
import { L as useTranslations } from "./Sheet-B-_2BaZp.js";
import "clsx";
import "react-hot-toast";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import "react";
const EmptyData = ({
  className,
  icon: Icon = null,
  title = "Nothing to show here",
  description = "There’s currently no data available. Once you add or update records, they’ll appear here"
}) => {
  const { t } = useTranslations();
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.4, delay: 0.1 },
      viewport: { once: true },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: `flex flex-col items-center justify-center text-center py-12 px-4 max-w-md w-full mx-auto ${className || ""}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-accent to-accent/50", children: Icon ? /* @__PURE__ */ jsx(
              motion.div,
              {
                className: "w-12 h-12 text-accent-foreground",
                initial: { y: 0 },
                animate: { y: [0, -6, 0] },
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                children: /* @__PURE__ */ jsx(Icon, { className: "w-8 h-8 text-gray-400" })
              }
            ) : /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: { y: 0 },
                animate: { y: [0, -6, 0] },
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                children: /* @__PURE__ */ jsx(Search, { className: "w-12 h-12 text-muted-foreground" })
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "mb-2 text-2xl font-semibold text-foreground", children: t(title) }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: t(description) })
            ] })
          ]
        }
      )
    }
  );
};
export {
  EmptyData as E
};

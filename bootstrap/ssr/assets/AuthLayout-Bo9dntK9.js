import { jsx, jsxs } from "react/jsx-runtime";
import { usePage } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-BOaFJ-XR.js";
import { L as useTranslations } from "./Sheet-B-_2BaZp.js";
const AuthLayout = ({ children }) => {
  const { props } = usePage();
  let {
    site_theme_settings: siteSettings
  } = props;
  const { t } = useTranslations();
  return /* @__PURE__ */ jsx(AppLayout, { children: /* @__PURE__ */ jsxs("section", { className: "relative py-16 overflow-hidden bg-background", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 z-0 opacity-60 dark:opacity-10",
        style: {
          backgroundImage: `
                            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
                        `,
          backgroundSize: "20px 30px",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)"
        }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "absolute rounded-full top-20 left-20 w-72 h-72 bg-blue-400/10 dark:bg-blue-500/10 blur-3xl animate-pulse" }),
    /* @__PURE__ */ jsx("div", { className: "absolute delay-1000 rounded-full bottom-20 right-20 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/10 blur-3xl animate-pulse" }),
    /* @__PURE__ */ jsx("div", { className: "absolute w-64 h-64 delay-500 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-purple-400/5 blur-3xl animate-pulse" }),
    /* @__PURE__ */ jsxs("div", { className: "container relative z-10 px-4 mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 text-center animate-fade-in", children: [
        /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-primary", children: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-primary-foreground", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }) }),
        /* @__PURE__ */ jsxs("h1", { className: "mb-2 text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text", children: [
          t("welcome"),
          " ",
          siteSettings?.user_site_name
        ] })
      ] }),
      children
    ] })
  ] }) });
};
export {
  AuthLayout as A
};

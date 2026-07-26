import { jsx, jsxs } from "react/jsx-runtime";
import "./Button-CFMlPXiE.js";
import { Link } from "@inertiajs/react";
const AuthFooter = ({ message, label, href = "" }) => {
  return /* @__PURE__ */ jsx("div", { children: message && label && /* @__PURE__ */ jsxs("div", { className: "mt-4 text-sm text-center", children: [
    /* @__PURE__ */ jsxs("span", { className: "text-gray-600 dark:text-gray-400", children: [
      message,
      "? "
    ] }),
    /* @__PURE__ */ jsx(Link, { href, className: "font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline", children: label })
  ] }) });
};
export {
  AuthFooter as A
};

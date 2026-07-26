import { jsx, jsxs } from "react/jsx-runtime";
import { T as ToastProvider, H as HotToaster } from "./HotToast-DfpkTxSC.js";
function GuestLayout({ children, title = "Admin Login" }) {
  return /* @__PURE__ */ jsx(ToastProvider, { children: /* @__PURE__ */ jsx("div", { className: "container grid items-center justify-center h-svh max-w-none", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx("h1", { className: "text-xl font-medium", children: title }) }),
    children,
    /* @__PURE__ */ jsx(HotToaster, {})
  ] }) }) });
}
export {
  GuestLayout as G
};

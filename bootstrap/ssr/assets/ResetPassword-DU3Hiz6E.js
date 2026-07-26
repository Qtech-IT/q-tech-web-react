import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { usePage, Head } from "@inertiajs/react";
import { N as FancyButton } from "./Sheet-B-_2BaZp.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./Card-CQ2ij0--.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import { L as Label } from "./Label-BxDBN09D.js";
import { Mail } from "lucide-react";
import { useState } from "react";
import { A as AuthFooter } from "./AuthFooter-BXqHF0L0.js";
import { f as handleForgotPassword } from "./AppLayout-BOaFJ-XR.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { A as AuthLayout } from "./AuthLayout-Bo9dntK9.js";
import "@radix-ui/react-direction";
import "./Button-CFMlPXiE.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "react-hot-toast";
import "tailwind-merge";
import "@radix-ui/react-icons";
import "@radix-ui/react-avatar";
import "@radix-ui/react-separator";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "@radix-ui/react-dialog";
import "@radix-ui/react-scroll-area";
import "@radix-ui/react-label";
import "framer-motion";
import "react-responsive";
import "./Badge-B6jlhcU-.js";
import "./Popover-Ckus2dfK.js";
import "@radix-ui/react-popover";
import "react-icons/tfi";
const ForgotForm = () => {
  const { props } = usePage();
  const { loading, errors, submit } = useForm();
  const [formData, setFormData] = useState({
    email: ""
  });
  const onSubmit = (e) => {
    handleForgotPassword(e, formData, submit);
  };
  return /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-xl mx-auto border shadow-xl animate-slide-up", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "pb-8 space-y-1", children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl font-bold text-center text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text", children: "Forgot Password" }),
      /* @__PURE__ */ jsx(CardDescription, { className: "text-center text-gray-600 dark:text-gray-400", children: "Enter your email, and we will send you instructions to reset your password." })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { children: [
      /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "email", className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Email Address" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Mail, { className: "absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "email",
                type: "email",
                placeholder: "Enter your email",
                value: formData.email,
                onChange: (e) => setFormData((prev) => ({ ...prev, email: e.target.value })),
                required: true,
                className: "py-6 transition-all duration-200 border ps-10",
                disabled: loading
              }
            )
          ] }),
          errors.email && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors.email })
        ] }) }),
        /* @__PURE__ */ jsx(
          FancyButton,
          {
            label: "Submit",
            size: "xl",
            className: "w-full",
            type: "submit",
            disabled: loading,
            isLoading: loading
          }
        )
      ] }),
      /* @__PURE__ */ jsx(AuthFooter, { message: "Already have an account?", label: "Login", href: route("user.login") })
    ] })
  ] });
};
const ResetPassword = ({ title }) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsx(AuthLayout, { children: /* @__PURE__ */ jsx(ForgotForm, {}) })
  ] });
};
export {
  ResetPassword as default
};

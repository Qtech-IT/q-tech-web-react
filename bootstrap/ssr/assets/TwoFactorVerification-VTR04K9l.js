import { Head, usePage } from "@inertiajs/react";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dialog";
import "@radix-ui/react-direction";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
import "@radix-ui/react-scroll-area";
import "@radix-ui/react-separator";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "cmdk";
import "framer-motion";
import { Info, KeyRound, Shield } from "lucide-react";
import { useState } from "react";
import "react-hot-toast";
import "react-icons/tfi";
import "react-responsive";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import "tailwind-merge";
import { A as Alert, a as AlertDescription } from "./Alert-3s5DZB4H.js";
import { g as handleTwoFactorVerification } from "./AppLayout-BOaFJ-XR.js";
import { A as AuthLayout } from "./AuthLayout-Bo9dntK9.js";
import "./Badge-B6jlhcU-.js";
import "./Button-CFMlPXiE.js";
import { C as Card, a as CardContent, d as CardDescription, b as CardHeader, c as CardTitle } from "./Card-CQ2ij0--.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import { L as Label } from "./Label-BxDBN09D.js";
import "./Popover-Ckus2dfK.js";
import { N as FancyButton } from "./Sheet-B-_2BaZp.js";
const TwoFactorVerificationForm = () => {
  const { props } = usePage();
  const { loading, errors, submit } = useForm();
  const [formData, setFormData] = useState({
    verification_code: ""
  });
  const onSubmit = (e) => {
    handleTwoFactorVerification(e, formData, submit);
  };
  return /* @__PURE__ */ jsxs(Card, {
    className: "w-full max-w-xl mx-auto border shadow-xl animate-slide-up", children: [
    /* @__PURE__ */ jsxs(CardHeader, {
      className: "pb-8 space-y-1", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsx("div", { className: "p-4 bg-purple-100 rounded-full dark:bg-purple-900", children: /* @__PURE__ */ jsx(Shield, { className: "w-8 h-8 text-purple-600 dark:text-purple-400" }) }) }),
      /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl font-bold text-center text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text", children: "Two-Factor Authentication" }),
      /* @__PURE__ */ jsx(CardDescription, { className: "text-center text-gray-600 dark:text-gray-400", children: "Enter the 6-digit code from your authenticator app" })
      ]
    }),
    /* @__PURE__ */ jsxs(CardContent, {
      children: [
      /* @__PURE__ */ jsxs(Alert, {
        className: "mb-6 border-purple-200 bg-purple-50 dark:bg-purple-950", children: [
        /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx(AlertDescription, { className: "text-sm", children: "Open your authenticator app (Google Authenticator, Authy, etc.) to get your verification code" })
        ]
      }),
      /* @__PURE__ */ jsxs("form", {
        onSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsx("div", {
          className: "space-y-4", children: /* @__PURE__ */ jsxs("div", {
            className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "verification_code", className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Verification Code" }),
          /* @__PURE__ */ jsxs("div", {
              className: "relative", children: [
            /* @__PURE__ */ jsx(KeyRound, { className: "absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" }),
            /* @__PURE__ */ jsx(
                Input,
                {
                  id: "verification_code",
                  type: "text",
                  placeholder: "Enter 6-digit code",
                  value: formData.verification_code,
                  onChange: (e) => setFormData((prev) => ({ ...prev, verification_code: e.target.value.replace(/\D/g, "").slice(0, 6) })),
                  required: true,
                  maxLength: 6,
                  className: "py-6  text-lg tracking-widest text-center transition-all duration-200 border ps-10",
                  disabled: loading,
                  autoComplete: "off"
                }
              )
              ]
            }),
              errors.verification_code && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors.verification_code })
            ]
          })
        }),
        /* @__PURE__ */ jsx(
          FancyButton,
          {
            label: "Verify & Continue",
            size: "xl",
            className: "w-full",
            type: "submit",
            disabled: loading || formData.verification_code.length !== 6,
            isLoading: loading
          }
        )
        ]
      })
      ]
    })
    ]
  });
};
const TwoFactorVerification = ({ title }) => {
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsx(AuthLayout, { children: /* @__PURE__ */ jsx(TwoFactorVerificationForm, {}) })
    ]
  });
};
export {
  TwoFactorVerification as default
};


import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { usePage, Head } from "@inertiajs/react";
import { N as FancyButton } from "./Sheet-B-_2BaZp.js";
import { A as Alert, a as AlertDescription } from "./Alert-3s5DZB4H.js";
import { B as Button } from "./Button-CFMlPXiE.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./Card-CQ2ij0--.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import { L as Label } from "./Label-BxDBN09D.js";
import { Info, Lock, EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { A as AuthFooter } from "./AuthFooter-BXqHF0L0.js";
import { i as handleResetPassword } from "./AppLayout-BOaFJ-XR.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { A as AuthLayout } from "./AuthLayout-Bo9dntK9.js";
import "@radix-ui/react-direction";
import "class-variance-authority";
import "@radix-ui/react-icons";
import "@radix-ui/react-avatar";
import "@radix-ui/react-separator";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "@radix-ui/react-dialog";
import "@radix-ui/react-scroll-area";
import "@radix-ui/react-slot";
import "clsx";
import "react-hot-toast";
import "tailwind-merge";
import "@radix-ui/react-label";
import "framer-motion";
import "react-responsive";
import "./Badge-B6jlhcU-.js";
import "./Popover-Ckus2dfK.js";
import "@radix-ui/react-popover";
import "react-icons/tfi";
const ResetPasswordForm = () => {
  const { props } = usePage();
  const { password_requirements } = props;
  const { loading, errors, submit } = useForm();
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const onSubmit = (e) => {
    handleResetPassword(e, formData, submit, setFormData);
  };
  return /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-xl mx-auto border shadow-xl animate-slide-up", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "pb-8 space-y-1", children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl font-bold text-center text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text", children: "Reset Password" }),
      /* @__PURE__ */ jsx(CardDescription, { className: "text-center text-gray-600 dark:text-gray-400", children: "Enter your new password" })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { children: [
      password_requirements?.strong_password && /* @__PURE__ */ jsxs(Alert, { className: "mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
        /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx(AlertDescription, { children: /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Password Requirements:" }),
          /* @__PURE__ */ jsxs("ul", { className: "mt-2 space-y-1 list-disc list-inside", children: [
            /* @__PURE__ */ jsxs("li", { children: [
              "At least ",
              password_requirements?.min_length,
              " characters"
            ] }),
            /* @__PURE__ */ jsx("li", { children: "One uppercase and one lowercase letter" }),
            /* @__PURE__ */ jsx("li", { children: "At least one number" }),
            /* @__PURE__ */ jsx("li", { children: "At least one special character (@$!%*?&)" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "password", className: "text-sm font-medium", children: "New Password" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(Lock, { className: "absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "password",
                  type: showPassword ? "text" : "password",
                  placeholder: "Enter your new password",
                  value: formData.password,
                  onChange: (e) => setFormData((prev) => ({ ...prev, password: e.target.value })),
                  required: true,
                  className: "py-6 transition-all duration-200 border ps-10 pe-12",
                  disabled: loading
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  className: "absolute top-0 right-0 h-full px-3 cursor-pointer hover:bg-transparent text-muted-foreground hover:text-foreground",
                  onClick: () => setShowPassword(!showPassword),
                  disabled: loading,
                  children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
                }
              )
            ] }),
            errors.password && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors.password })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "password_confirmation", className: "text-sm font-medium", children: "Confirm Password" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(Lock, { className: "absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "password_confirmation",
                  type: showConfirmPassword ? "text" : "password",
                  placeholder: "Confirm your new password",
                  value: formData.password_confirmation,
                  onChange: (e) => setFormData((prev) => ({ ...prev, password_confirmation: e.target.value })),
                  required: true,
                  className: "py-6 transition-all duration-200 border ps-10 pe-12",
                  disabled: loading
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  className: "absolute top-0 right-0 h-full px-3 cursor-pointer hover:bg-transparent text-muted-foreground hover:text-foreground",
                  onClick: () => setShowConfirmPassword(!showConfirmPassword),
                  disabled: loading,
                  children: showConfirmPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
                }
              )
            ] }),
            errors.password_confirmation && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors.password_confirmation })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          FancyButton,
          {
            label: "Reset Password",
            size: "xl",
            className: "w-full",
            type: "submit",
            disabled: loading,
            isLoading: loading
          }
        )
      ] }),
      /* @__PURE__ */ jsx(AuthFooter, { message: "Remember your password?", label: "Login", href: route("user.login") })
    ] })
  ] });
};
const UpdatePassword = ({ title }) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsx(AuthLayout, { children: /* @__PURE__ */ jsx(ResetPasswordForm, {}) })
  ] });
};
export {
  UpdatePassword as default
};

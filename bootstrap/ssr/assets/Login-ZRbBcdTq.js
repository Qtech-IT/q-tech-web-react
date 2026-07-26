import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { usePage, Link, Head } from "@inertiajs/react";
import { N as FancyButton } from "./Sheet-B-_2BaZp.js";
import { B as Button } from "./Button-CFMlPXiE.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./Card-CQ2ij0--.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import { L as Label } from "./Label-BxDBN09D.js";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { A as AuthFooter } from "./AuthFooter-BXqHF0L0.js";
import ReCAPTCHA from "react-google-recaptcha";
import { S as SocialLoginButtons } from "./SocialLoginButtons-BfDakk2J.js";
import { b as handleUserLogin } from "./AppLayout-BOaFJ-XR.js";
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
import "react-icons/fa6";
import "react-icons/fc";
import "framer-motion";
import "react-responsive";
import "./Badge-B6jlhcU-.js";
import "./Popover-Ckus2dfK.js";
import "@radix-ui/react-popover";
import "react-icons/tfi";
function LoginForm() {
  const { props } = usePage();
  const { recaptcha, social_login, user_registration_enabled } = props;
  const { loading, errors, submit } = useForm();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
    "g-recaptcha-response": ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
    setFormData((prev) => ({ ...prev, "g-recaptcha-response": value }));
  };
  const onSubmit = (e) => {
    handleUserLogin(e, formData, submit, setRecaptchaValue);
  };
  return /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-xl mx-auto border shadow-xl animate-slide-up", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "pb-8 space-y-1", children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl font-bold text-center text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text", children: "Sign In" }),
      /* @__PURE__ */ jsx(CardDescription, { className: "text-center text-gray-600 dark:text-gray-400", children: "Enter your credentials to access your account" })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { children: [
      social_login?.enabled && (social_login?.google || social_login?.facebook) && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          SocialLoginButtons,
          {
            googleEnabled: social_login?.google,
            facebookEnabled: social_login?.facebook
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative my-6", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("span", { className: "w-full border-t" }) }),
          /* @__PURE__ */ jsx("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsx("span", { className: "px-2 bg-white dark:bg-gray-900 text-muted-foreground", children: "Or continue with email" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
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
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "password", className: "text-sm font-medium", children: "Password" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(Lock, { className: "absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "password",
                  type: showPassword ? "text" : "password",
                  placeholder: "Enter your password",
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
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxs("label", { className: "flex items-center space-x-2 cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: formData.remember,
                  onChange: (e) => setFormData((prev) => ({ ...prev, remember: e.target.checked })),
                  className: "text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Remember me" })
            ] }),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("user.password.request"),
                className: "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline",
                children: "Forgot password?"
              }
            )
          ] })
        ] }),
        recaptcha?.enabled && /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(
          ReCAPTCHA,
          {
            sitekey: recaptcha.site_key,
            onChange: handleRecaptchaChange,
            theme: "light"
          }
        ) }),
        errors["g-recaptcha-response"] && /* @__PURE__ */ jsx("p", { className: "text-sm text-center text-red-600 dark:text-red-400", children: errors["g-recaptcha-response"] }),
        /* @__PURE__ */ jsx(
          FancyButton,
          {
            label: "Sign In",
            size: "xl",
            disabled: loading || recaptcha?.enabled && !recaptchaValue,
            isLoading: loading,
            className: "w-full",
            type: "submit"
          }
        )
      ] }),
      user_registration_enabled && /* @__PURE__ */ jsx(
        AuthFooter,
        {
          message: "Don't have an account?",
          label: "Sign Up",
          href: route("user.register")
        }
      )
    ] })
  ] });
}
const Login = ({ title }) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsx(AuthLayout, { children: /* @__PURE__ */ jsx(LoginForm, {}) })
  ] });
};
export {
  Login as default
};

import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { usePage, Link, Head } from "@inertiajs/react";
import { N as FancyButton } from "./Sheet-B-_2BaZp.js";
import { A as Alert, a as AlertDescription } from "./Alert-3s5DZB4H.js";
import { B as Button } from "./Button-CFMlPXiE.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./Card-CQ2ij0--.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import { L as Label } from "./Label-BxDBN09D.js";
import { C as Checkbox } from "./Checkbox-CsK9i2JK.js";
import { Info, User, Mail, Phone, Lock, EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { A as AuthFooter } from "./AuthFooter-BXqHF0L0.js";
import ReCAPTCHA from "react-google-recaptcha";
import { S as SocialLoginButtons } from "./SocialLoginButtons-BfDakk2J.js";
import { e as handleUserRegister } from "./AppLayout-BOaFJ-XR.js";
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
import "@radix-ui/react-checkbox";
import "react-icons/fa6";
import "react-icons/fc";
import "framer-motion";
import "react-responsive";
import "./Badge-B6jlhcU-.js";
import "./Popover-Ckus2dfK.js";
import "@radix-ui/react-popover";
import "react-icons/tfi";
const SignupForm = () => {
  const { props } = usePage();
  const { recaptcha, social_login, password_requirements, terms_conditions_url, require_terms_acceptance } = props;
  const { loading, errors, submit } = useForm();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    terms_accepted: false,
    "g-recaptcha-response": ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
    setFormData((prev) => ({ ...prev, "g-recaptcha-response": value }));
  };
  const onSubmit = (e) => {
    handleUserRegister(e, formData, submit, setRecaptchaValue);
  };
  return /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-xl mx-auto border shadow-xl animate-slide-up", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "pb-8 space-y-1", children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl font-bold text-center text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text", children: "Sign Up" }),
      /* @__PURE__ */ jsx(CardDescription, { className: "text-center text-gray-600 dark:text-gray-400", children: "Create your account to get started" })
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
          /* @__PURE__ */ jsx("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsx("span", { className: "px-2 bg-white dark:bg-gray-900 text-muted-foreground", children: "Or register with email" }) })
        ] })
      ] }),
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
            /* @__PURE__ */ jsx(Label, { htmlFor: "name", className: "text-sm font-medium", children: "Name" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(User, { className: "absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "name",
                  type: "text",
                  placeholder: "Enter your name",
                  value: formData.name,
                  onChange: (e) => setFormData((prev) => ({ ...prev, name: e.target.value })),
                  required: true,
                  className: "py-6 transition-all duration-200 border ps-10",
                  disabled: loading
                }
              )
            ] }),
            errors.name && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "email", className: "text-sm font-medium", children: "Email Address" }),
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
            /* @__PURE__ */ jsx(Label, { htmlFor: "phone", className: "text-sm font-medium", children: "Phone Number (Optional)" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(Phone, { className: "absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "phone",
                  type: "tel",
                  placeholder: "Enter your phone number",
                  value: formData.phone,
                  onChange: (e) => setFormData((prev) => ({ ...prev, phone: e.target.value })),
                  className: "py-6 transition-all duration-200 border ps-10",
                  disabled: loading
                }
              )
            ] }),
            errors.phone && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors.phone })
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
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "password_confirmation", className: "text-sm font-medium", children: "Confirm Password" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(Lock, { className: "absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "password_confirmation",
                  type: showConfirmPassword ? "text" : "password",
                  placeholder: "Confirm your password",
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
          ] }),
          require_terms_acceptance && /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-2", children: [
            /* @__PURE__ */ jsx(
              Checkbox,
              {
                id: "terms",
                checked: formData.terms_accepted,
                onCheckedChange: (checked) => setFormData((prev) => ({ ...prev, terms_accepted: checked })),
                className: "mt-1"
              }
            ),
            /* @__PURE__ */ jsxs(
              "label",
              {
                htmlFor: "terms",
                className: "mt-1 text-sm leading-none cursor-pointer text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                children: [
                  "I agree to the",
                  " ",
                  terms_conditions_url && /* @__PURE__ */ jsx(
                    Link,
                    {
                      href: terms_conditions_url,
                      target: "_blank",
                      className: "text-blue-600 hover:underline dark:text-blue-400",
                      children: "Terms & Conditions"
                    }
                  )
                ]
              }
            )
          ] }),
          errors.terms_accepted && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors.terms_accepted })
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
            label: "Sign Up",
            size: "xl",
            disabled: loading || recaptcha?.enabled && !recaptchaValue || require_terms_acceptance && !formData.terms_accepted,
            isLoading: loading,
            className: "w-full",
            type: "submit"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(AuthFooter, { message: "Already have an account?", label: "Login", href: route("user.login") })
    ] })
  ] });
};
const Register = ({ title }) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsx(AuthLayout, { children: /* @__PURE__ */ jsx(SignupForm, {}) })
  ] });
};
export {
  Register as default
};

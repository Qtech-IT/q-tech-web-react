import { jsx, jsxs } from "react/jsx-runtime";
import { LogIn } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { a as cn, B as Button } from "./Button-CFMlPXiE.js";
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, f as FormMessage } from "./Form-dg4L2iRR.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import { P as PasswordInput } from "./PasswordInput-y5M6NrVa.js";
import { Link, Head } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { u as useForm$1 } from "./HotToast-DfpkTxSC.js";
import { C as Checkbox } from "./Checkbox-CsK9i2JK.js";
import { h as hanldleLogin } from "./AuthController-DaCguZ7K.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./Card-CQ2ij0--.js";
import { G as GuestLayout } from "./GuestLayout-C8E7PqMN.js";
import "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "react-hot-toast";
import "tailwind-merge";
import "./Label-BxDBN09D.js";
import "@radix-ui/react-label";
import "@radix-ui/react-checkbox";
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(1, "Please enter your password").min(6, "Password must be at least 6 characters long"),
  remember: z.boolean().optional().default(false)
});
function UserAuthForm({ className, redirectTo, ...props }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false
    }
  });
  const { loading: isSubmitting, submit } = useForm$1();
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
    "form",
    {
      className: cn("grid gap-3", className),
      ...props,
      onSubmit: form.handleSubmit((data) => hanldleLogin(data, submit)),
      children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "email",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { required: true, children: "Email" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "email", placeholder: "name@example.com", ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "password",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "relative", children: [
              /* @__PURE__ */ jsx(FormLabel, { required: true, children: "Password" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(PasswordInput, { placeholder: "********", ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {}),
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: "/admin/password/forgot",
                  className: "text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75",
                  children: "Forgot password?"
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "remember",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Checkbox,
                {
                  checked: field.value,
                  onCheckedChange: field.onChange
                }
              ) }),
              /* @__PURE__ */ jsx(FormLabel, { className: "!m-0", children: "Remember me" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(Button, { className: "mt-2", disabled: isSubmitting, children: /* @__PURE__ */ jsx(ButtonLoader, { isSubmitting, btnText: "Sign in", loaderText: "Sign in ......", icon: /* @__PURE__ */ jsx(LogIn, { className: "w-4 h-4" }) }) })
      ]
    }
  ) });
}
function Login({ title }) {
  return /* @__PURE__ */ jsxs(GuestLayout, { title, children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(Card, { className: "gap-4", children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-lg tracking-tight", children: "Sign in" }),
        /* @__PURE__ */ jsxs(CardDescription, { children: [
          "Enter your email and password below to ",
          /* @__PURE__ */ jsx("br", {}),
          "log into your account"
        ] })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(UserAuthForm, {}) })
    ] })
  ] });
}
export {
  Login as default
};

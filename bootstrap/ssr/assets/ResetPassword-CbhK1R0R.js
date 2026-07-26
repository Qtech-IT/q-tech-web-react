import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { a as cn, B as Button } from "./Button-CFMlPXiE.js";
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, f as FormMessage } from "./Form-dg4L2iRR.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import { useForm } from "react-hook-form";
import { u as useForm$1 } from "./HotToast-DfpkTxSC.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { a as handleResetPassword } from "./AuthController-DaCguZ7K.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent, e as CardFooter } from "./Card-CQ2ij0--.js";
import { G as GuestLayout } from "./GuestLayout-C8E7PqMN.js";
import { Head, Link } from "@inertiajs/react";
import "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "react-hot-toast";
import "tailwind-merge";
import "./Label-BxDBN09D.js";
import "@radix-ui/react-label";
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a your email" })
});
function EmailVerificationForm({ className, ...props }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    }
  });
  const { loading: isSubmitting, submit } = useForm$1();
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: form.handleSubmit((e) => handleResetPassword(e, submit)),
      className: cn("grid gap-2", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "email",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { required: true, children: "Email" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "name@example.com", ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(Button, { className: "mt-2", disabled: isSubmitting, children: /* @__PURE__ */ jsx(ButtonLoader, { isSubmitting, btnText: "Continue", loaderText: "Continue ......", icon: /* @__PURE__ */ jsx(ArrowRight, {}) }) })
      ]
    }
  ) });
}
function ResetPassword({ title }) {
  return /* @__PURE__ */ jsxs(GuestLayout, { title, children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(Card, { className: "gap-4", children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-lg tracking-tight", children: "Verify email" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Please enter your email and get verification code." })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(EmailVerificationForm, {}) }),
      /* @__PURE__ */ jsx(CardFooter, { children: /* @__PURE__ */ jsxs("p", { className: "px-8 mx-auto text-sm text-center text-muted-foreground text-balance", children: [
        "Want to access your account?",
        " ",
        /* @__PURE__ */ jsx(
          Link,
          {
            href: "/admin",
            className: "underline hover:text-primary underline-offset-4",
            children: "Login"
          }
        ),
        "."
      ] }) })
    ] })
  ] });
}
export {
  ResetPassword as default
};

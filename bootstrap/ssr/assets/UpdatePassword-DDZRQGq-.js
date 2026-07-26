import { jsx, jsxs } from "react/jsx-runtime";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { a as cn, B as Button } from "./Button-CFMlPXiE.js";
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, f as FormMessage } from "./Form-dg4L2iRR.js";
import { P as PasswordInput } from "./PasswordInput-y5M6NrVa.js";
import { useForm } from "react-hook-form";
import { u as useForm$1 } from "./HotToast-DfpkTxSC.js";
import { c as hanldleUpdatePassword } from "./AuthController-DaCguZ7K.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent, e as CardFooter } from "./Card-CQ2ij0--.js";
import { G as GuestLayout } from "./GuestLayout-C8E7PqMN.js";
import { usePage, Head, Link } from "@inertiajs/react";
import "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "react-hot-toast";
import "tailwind-merge";
import "./Label-BxDBN09D.js";
import "@radix-ui/react-label";
import "lucide-react";
function UpdatePasswordForm({ className, redirectTo, passwordLength = 6, ...props }) {
  const passwordFormSchema = z.object({
    password: z.string().min(1, "Please enter your password").min(passwordLength, `Password must be at least ${passwordLength} characters long`),
    password_confirmation: z.string().min(1, "Please confirm your password")
  }).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"]
  });
  const form = useForm({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password_confirmation: "",
      password: ""
    }
  });
  const { loading: isSubmitting, submit } = useForm$1();
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
    "form",
    {
      className: cn("grid gap-3", className),
      ...props,
      onSubmit: form.handleSubmit((data) => hanldleUpdatePassword(data, submit)),
      children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "password",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "relative", children: [
              /* @__PURE__ */ jsx(FormLabel, { required: true, children: "Password" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(PasswordInput, { placeholder: "********", ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "password_confirmation",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "relative", children: [
              /* @__PURE__ */ jsx(FormLabel, { required: true, children: "Confirm Password" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(PasswordInput, { placeholder: "********", ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(Button, { className: "mt-2", disabled: isSubmitting, children: /* @__PURE__ */ jsx(ButtonLoader, { isSubmitting }) })
      ]
    }
  ) });
}
function ResetPassword({ title }) {
  const { props } = usePage();
  const passwordLength = Number(props.site_theme_settings?.minimum_password_length) || 6;
  return /* @__PURE__ */ jsxs(GuestLayout, { title, children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(Card, { className: "gap-4", children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-lg tracking-tight", children: "Update password" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Please enter your new password and confirm it to update your account credentials." })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(UpdatePasswordForm, { passwordLength }) }),
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

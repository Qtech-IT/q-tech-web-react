import { jsxs, jsx } from "react/jsx-runtime";
import { O as OtpVerificationForm } from "./OtpVerificationForm-BzuLdAr7.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent, e as CardFooter } from "./Card-CQ2ij0--.js";
import { G as GuestLayout } from "./GuestLayout-C8E7PqMN.js";
import { Head, Link } from "@inertiajs/react";
import "lucide-react";
import "zod";
import "@hookform/resolvers/zod";
import "./Button-CFMlPXiE.js";
import "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "react-hot-toast";
import "tailwind-merge";
import "./Form-dg4L2iRR.js";
import "react-hook-form";
import "./Label-BxDBN09D.js";
import "@radix-ui/react-label";
import "./HotToast-DfpkTxSC.js";
import "./ButtonLoader-BVWhRiGk.js";
import "input-otp";
import "./AuthController-DaCguZ7K.js";
function OtpVerification({ title }) {
  return /* @__PURE__ */ jsxs(GuestLayout, { title, children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(Card, { className: "gap-4", children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-lg tracking-tight", children: "OTP Verification" }),
        /* @__PURE__ */ jsxs(CardDescription, { children: [
          "Please enter the authentication code. ",
          /* @__PURE__ */ jsx("br", {}),
          " We have sent the authentication code to your email."
        ] })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(OtpVerificationForm, {}) }),
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
  OtpVerification as default
};

import { jsx, jsxs } from "react/jsx-runtime";
import { MinusIcon, ArrowRight } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { a as cn, B as Button } from "./Button-CFMlPXiE.js";
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, f as FormMessage } from "./Form-dg4L2iRR.js";
import { useForm } from "react-hook-form";
import { u as useForm$1 } from "./HotToast-DfpkTxSC.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { b as handleOtpVerify } from "./AuthController-DaCguZ7K.js";
function InputOTP({ className, containerClassName, ...props }) {
  return /* @__PURE__ */ jsx(
    OTPInput,
    {
      "data-slot": "input-otp",
      containerClassName: cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      ),
      className: cn("disabled:cursor-not-allowed", className),
      ...props
    }
  );
}
function InputOTPGroup({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "input-otp-group",
      className: cn("flex items-center", className),
      ...props
    }
  );
}
function InputOTPSlot({ index, className, ...props }) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-slot": "input-otp-slot",
      "data-active": isActive,
      className: cn(
        "data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]",
        className
      ),
      ...props,
      children: [
        char,
        hasFakeCaret && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ jsx("div", { className: "w-px h-4 duration-1000 animate-caret-blink bg-foreground" }) })
      ]
    }
  );
}
function InputOTPSeparator({ ...props }) {
  return /* @__PURE__ */ jsx("div", { "data-slot": "input-otp-separator", role: "separator", ...props, children: /* @__PURE__ */ jsx(MinusIcon, {}) });
}
const formSchema = z.object({
  verification_code: z.string().min(6, "Please enter the 6-digit code.").max(6, "Please enter the 6-digit code.")
});
function OtpVerificationForm({ className, isGoogle2fa = false, ...props }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { verification_code: "" }
  });
  const otp = form.watch("verification_code");
  const { loading: isSubmitting, submit } = useForm$1();
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: form.handleSubmit((e) => handleOtpVerify(e, submit, isGoogle2fa)),
      className: cn("grid gap-2", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "verification_code",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { className: "sr-only", children: "One-Time Password" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsxs(
                InputOTP,
                {
                  maxLength: 6,
                  ...field,
                  containerClassName: 'justify-between sm:[&>[data-slot="input-otp-group"]>div]:w-12',
                  children: [
                    /* @__PURE__ */ jsxs(InputOTPGroup, { children: [
                      /* @__PURE__ */ jsx(InputOTPSlot, { index: 0 }),
                      /* @__PURE__ */ jsx(InputOTPSlot, { index: 1 })
                    ] }),
                    /* @__PURE__ */ jsx(InputOTPSeparator, {}),
                    /* @__PURE__ */ jsxs(InputOTPGroup, { children: [
                      /* @__PURE__ */ jsx(InputOTPSlot, { index: 2 }),
                      /* @__PURE__ */ jsx(InputOTPSlot, { index: 3 })
                    ] }),
                    /* @__PURE__ */ jsx(InputOTPSeparator, {}),
                    /* @__PURE__ */ jsxs(InputOTPGroup, { children: [
                      /* @__PURE__ */ jsx(InputOTPSlot, { index: 4 }),
                      /* @__PURE__ */ jsx(InputOTPSlot, { index: 5 })
                    ] })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsx(Button, { type: "submit", className: "mt-2", disabled: otp.length < 6 || isSubmitting, children: /* @__PURE__ */ jsx(ButtonLoader, { isSubmitting, btnText: "Verify", loaderText: "Verifying ......", icon: /* @__PURE__ */ jsx(ArrowRight, {}) }) })
      ]
    }
  ) });
}
export {
  OtpVerificationForm as O
};

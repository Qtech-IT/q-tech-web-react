import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { a as cn, B as Button } from "./Button-CFMlPXiE.js";
function PasswordInput({
  className,
  disabled,
  ref,
  ...props
}) {
  const [showPassword, setShowPassword] = React.useState(false);
  return /* @__PURE__ */ jsxs("div", { className: cn("relative rounded-md", className), children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        type: showPassword ? "text" : "password",
        className: "flex w-full px-3 py-1 text-sm transition-colors bg-transparent border rounded-md shadow-xs border-input placeholder:text-muted-foreground focus-visible:ring-ring h-9 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
        ref,
        disabled,
        ...props
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        type: "button",
        size: "icon",
        variant: "ghost",
        disabled,
        className: "absolute w-6 h-6 -translate-y-1/2 rounded-md text-muted-foreground end-1 top-1/2",
        onClick: () => setShowPassword((prev) => !prev),
        children: showPassword ? /* @__PURE__ */ jsx(Eye, { size: 18 }) : /* @__PURE__ */ jsx(EyeOff, { size: 18 })
      }
    )
  ] });
}
export {
  PasswordInput as P
};

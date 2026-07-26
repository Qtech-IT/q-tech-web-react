import { jsxs, jsx } from "react/jsx-runtime";
import { B as Button } from "./Button-CFMlPXiE.js";
import { Link } from "@inertiajs/react";
import { FaFacebook } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
function SocialLoginButtons({ googleEnabled, facebookEnabled }) {
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [
    googleEnabled && /* @__PURE__ */ jsx(Link, { href: route("user.social.redirect", { provider: "google" }), children: /* @__PURE__ */ jsxs(
      Button,
      {
        type: "button",
        variant: "outline",
        className: "w-full py-6 transition-all duration-200 border-2 cursor-pointer",
        children: [
          /* @__PURE__ */ jsx(FaFacebook, { className: "text-blue-600 size-6 hover:text-blue-700" }),
          "Continue with Google"
        ]
      }
    ) }),
    facebookEnabled && /* @__PURE__ */ jsx(Link, { href: route("user.social.redirect", { provider: "facebook" }), children: /* @__PURE__ */ jsxs(
      Button,
      {
        type: "button",
        variant: "outline",
        className: "w-full py-6 transition-all duration-200 border-2 cursor-pointer",
        children: [
          /* @__PURE__ */ jsx(FcGoogle, { className: "size-6 " }),
          "Continue with Facebook"
        ]
      }
    ) })
  ] });
}
export {
  SocialLoginButtons as S
};

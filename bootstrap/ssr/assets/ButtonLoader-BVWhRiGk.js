import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import * as React from "react";
import { Loader2, Save } from "lucide-react";
function ButtonLoader({
  isSubmitting = false,
  btnText = "Save Changes",
  loaderText = "Saving...",
  icon = null
}) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    isSubmitting ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }, "loader") : /* @__PURE__ */ jsx(React.Fragment, { children: icon ? icon : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }) }, "icon"),
    /* @__PURE__ */ jsx("span", { children: isSubmitting ? loaderText : btnText }, "text")
  ] });
}
export {
  ButtonLoader as B
};

import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { C as Card, a as CardContent } from "./Card-CQ2ij0--.js";
import { B as Button } from "./Button-CFMlPXiE.js";
const EmptyTableState = ({
  icon: Icon = null,
  title = "No data found",
  description = "There is no data to display at the moment.",
  buttonText = "Create new",
  onButtonClick = null
}) => {
  return /* @__PURE__ */ jsx(Card, { className: "border-2 border-gray-300 border-dashed bg-gray-50", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-center justify-center py-16", children: [
    Icon && /* @__PURE__ */ jsx("div", { className: "p-5 mb-4 bg-white rounded-full shadow-sm", children: /* @__PURE__ */ jsx(Icon, { className: "w-8 h-8 text-gray-400" }) }),
    /* @__PURE__ */ jsx("h3", { className: "mb-2 text-lg font-semibold text-gray-900", children: title }),
    /* @__PURE__ */ jsx("p", { className: "max-w-sm mb-6 text-center text-gray-500", children: description }),
    buttonText && onButtonClick && /* @__PURE__ */ jsx(Button, { onClick: onButtonClick, children: buttonText })
  ] }) });
};
export {
  EmptyTableState as E
};

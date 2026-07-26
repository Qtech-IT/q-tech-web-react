import DOMPurify from "dompurify";
import { Code, Copy, Key } from "lucide-react";
import "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { B as Button, h as handleCopyKey } from "./Button-CFMlPXiE.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./Card-CQ2ij0--.js";
import { i as insertKeyAtCursor } from "./NotificationTemplateController-DQGJbhT2.js";
const SafePreview = ({ html }) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "p-3 mt-1 border rounded-md bg-muted/30",
      dangerouslySetInnerHTML: { __html: DOMPurify.sanitize(html) }
    }
  );
};
const TemplateKeysSidebar = ({ templateKeys, editorRef }) => {
  return /* @__PURE__ */ jsx("div", {
    className: "lg:col-span-1", children: /* @__PURE__ */ jsxs(Card, {
      className: "sticky top-6", children: [
    /* @__PURE__ */ jsxs(CardHeader, {
        children: [
      /* @__PURE__ */ jsxs(CardTitle, {
          className: "flex items-center gap-2 text-base", children: [
        /* @__PURE__ */ jsx(Key, { className: "w-4 h-4" }),
            "Template Keys"
          ]
        }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Click to insert or copy template keys" })
        ]
      }),
    /* @__PURE__ */ jsxs(CardContent, {
        className: "space-y-3", children: [
          Object.entries(templateKeys).map(([key, description]) => /* @__PURE__ */ jsx(
            "div",
            {
              className: "p-3 transition-colors border rounded-lg group hover:bg-muted/50",
              children: /* @__PURE__ */ jsxs("div", {
                className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", {
                  className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("code", { className: "text-xs bg-muted px-1.5 py-0.5 rounded ", children: `{{${key}}}` }) }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: description })
                  ]
                }),
            /* @__PURE__ */ jsxs("div", {
                  className: "flex gap-1 transition-opacity opacity-0 group-hover:opacity-100", children: [
              /* @__PURE__ */ jsx(
                    Button,
                    {
                      size: "icon",
                      variant: "ghost",
                      className: "w-6 h-6",
                      onClick: () => insertKeyAtCursor(editorRef, key),
                      title: "Insert at cursor",
                      children: /* @__PURE__ */ jsx(Code, { className: "w-3 h-3" })
                    }
                  ),
              /* @__PURE__ */ jsx(
                    Button,
                    {
                      size: "icon",
                      variant: "ghost",
                      className: "w-6 h-6",
                      onClick: () => handleCopyKey(`{{${key}}}`),
                      title: "Copy to clipboard",
                      children: /* @__PURE__ */ jsx(Copy, { className: "w-3 h-3" })
                    }
                  )
                  ]
                })
                ]
              })
            },
            key
          )),
          Object.keys(templateKeys).length === 0 && /* @__PURE__ */ jsxs("div", {
            className: "py-6 text-center text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Key, { className: "w-8 h-8 mx-auto mb-2 opacity-50" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: "No template keys available" })
            ]
          })
        ]
      })
      ]
    })
  });
};
export {
  SafePreview as S,
  TemplateKeysSidebar as T
};


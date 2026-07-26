import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { x as Sheet, I as SheetTrigger, y as SheetContent } from "./Sheet-B-_2BaZp.js";
import { User, BriefcaseBusiness, Bookmark, History, Wallet, Tickets, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { A as AppLayout } from "./AppLayout-BOaFJ-XR.js";
import { motion, AnimatePresence } from "framer-motion";
import { usePage, Link } from "@inertiajs/react";
import { f as isRTL } from "./Button-CFMlPXiE.js";
const AuthenticatedSidebar = () => {
  const { url } = usePage();
  const linkClasses = (path) => `group flex w-full cursor-pointer items-center gap-4 font-medium text-sm py-3 px-4 rounded-md transition-all
     hover:bg-accent
     ${url.startsWith(path) ? "bg-accent text-foreground" : ""}`;
  const menu = [
    { label: "Profile", path: "/user/profile", icon: User },
    { label: "Portfolio", path: "/user/portfolio", icon: BriefcaseBusiness },
    { label: "Bookmark", path: "/user/bookmark", icon: Bookmark },
    { label: "History", path: "/user/history", icon: History },
    { label: "Wallet", path: "/user/wallet", icon: Wallet },
    { label: "Support Ticket", path: "/user/ticket", icon: Tickets },
    { label: "Logout", icon: LogOut, action: "" }
  ];
  return /* @__PURE__ */ jsx("aside", { className: "w-full h-full lg:w-64 shrink-0 border-e", children: /* @__PURE__ */ jsxs("div", { className: "py-5 px-4 sticky top-[64px] lg:h-auto h-full", children: [
    /* @__PURE__ */ jsx("h4", { className: "mb-3 font-semibold text-muted-foreground", children: "Dashboard" }),
    /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: menu.map(({ label, path, icon: Icon, action }) => /* @__PURE__ */ jsx("li", { children: path ? /* @__PURE__ */ jsxs(Link, { href: path, className: linkClasses(path), children: [
      /* @__PURE__ */ jsx(Icon, { className: `size-5 text-muted-foreground/80 group-hover:text-primary ${url.startsWith(path) ? "text-primary" : ""}` }),
      label
    ] }) : /* @__PURE__ */ jsxs("button", { onClick: action, className: linkClasses("/logout"), children: [
      /* @__PURE__ */ jsx(Icon, { className: "size-5 text-muted-foreground/80 group-hover:text-foreground" }),
      label
    ] }) }, label)) })
  ] }) });
};
const SlideLeft = ({ children }) => {
  const rtl = isRTL();
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: {
        x: rtl ? "-10%" : "10%",
        opacity: 0
      },
      animate: {
        x: 0,
        opacity: 1
      },
      exit: {
        x: rtl ? "10%" : "-10%",
        opacity: 0
      },
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      },
      children
    }
  );
};
const AuthenticatedLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsx(AppLayout, { children: /* @__PURE__ */ jsx("section", { className: "h-full", children: /* @__PURE__ */ jsx("div", { className: "container px-4 mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex h-full", children: [
    /* @__PURE__ */ jsx("div", { className: "hidden lg:block", children: /* @__PURE__ */ jsx(AuthenticatedSidebar, {}) }),
    /* @__PURE__ */ jsx("div", { className: "w-full py-6 overflow-x-hidden grow lg:py-8 xl:ps-8 lg:ps-6", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(SlideLeft, { children: /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "lg:hidden", children: /* @__PURE__ */ jsxs(Sheet, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
          "button",
          {
            className: "p-2 mb-3 border rounded-sm",
            onClick: () => setOpen(true),
            children: /* @__PURE__ */ jsx(Menu, { className: "w-5 h-5" })
          }
        ) }),
        /* @__PURE__ */ jsx(SheetContent, { side: "left", className: "w-full p-0 max-w-64 lg:hidden", children: /* @__PURE__ */ jsx(AuthenticatedSidebar, {}) })
      ] }) }),
      children
    ] }) }) }) })
  ] }) }) }) });
};
export {
  AuthenticatedLayout as A
};

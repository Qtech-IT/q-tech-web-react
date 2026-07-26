import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, createContext, useContext, useRef, useMemo } from "react";
import { DirectionProvider as DirectionProvider$1 } from "@radix-ui/react-direction";
import { r as removeCookie, s as setCookie, k as keyToValue, B as Button, a as cn } from "./Button-CFMlPXiE.js";
import { usePage, Link, router } from "@inertiajs/react";
import { cva } from "class-variance-authority";
import * as LucideIcons from "lucide-react";
import { ChevronLeft, ChevronRight, XIcon, ChevronRightIcon, SearchIcon } from "lucide-react";
import * as RadixIcons from "@radix-ui/react-icons";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Command as Command$1 } from "cmdk";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
const DEFAULT_DIRECTION = "ltr";
const DIRECTION_COOKIE_NAME = "dir";
const DIRECTION_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const DirectionContext = createContext(null);
function DirectionProvider({ children, dbDirection }) {
  const [dir, _setDir] = useState(dbDirection);
  useEffect(() => {
    if (dbDirection) {
      _setDir(dbDirection);
    }
  }, [dbDirection]);
  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute("dir", dir);
  }, [dir]);
  const setDir = (newDir) => {
    _setDir(newDir);
    setCookie(DIRECTION_COOKIE_NAME, newDir, DIRECTION_COOKIE_MAX_AGE);
  };
  const resetDir = () => {
    _setDir(DEFAULT_DIRECTION);
    removeCookie(DIRECTION_COOKIE_NAME);
  };
  return /* @__PURE__ */ jsx(
    DirectionContext.Provider,
    {
      value: {
        defaultDir: DEFAULT_DIRECTION,
        dir,
        setDir,
        resetDir
      },
      children: /* @__PURE__ */ jsx(DirectionProvider$1, { dir, children })
    }
  );
}
function useDirection() {
  const context = useContext(DirectionContext);
  if (!context) {
    throw new Error("useDirection must be used within a DirectionProvider");
  }
  return context;
}
const useTranslations = () => {
  const { language_settings } = usePage().props;
  let locale = language_settings?.current_language || "en";
  let translations = language_settings?.translations || {};
  const t = (key, replacements = {}) => {
    let translation = translations[key] || keyToValue(key);
    Object.keys(replacements).forEach((placeholder) => {
      const regex = new RegExp(`:${placeholder}`, "g");
      translation = translation.replace(regex, replacements[placeholder]);
    });
    return translation;
  };
  const trans = t;
  return { t, trans, locale, translations };
};
const fancyButtonVariants = cva(
  "group/button relative inline-flex overflow-hidden cursor-pointer font-semibold transition-all duration-200 ease-in-out",
  {
    variants: {
      size: {
        sm: "text-xs px-3 py-2 h-[32px]",
        default: "text-sm px-4 py-3 h-[36px]",
        md: "text-sm px-5 py-3 h-[40px]",
        lg: "text-base px-6 py-4 h-[44px]",
        xl: "text-lg px-8 py-5 h-[52px]"
      },
      width: {
        auto: "w-auto",
        full: "w-full",
        fit: "w-fit",
        fixed: "w-[200px]",
        sm: "w-[120px]",
        md: "w-[160px]",
        lg: "w-[200px]",
        xl: "w-[240px]"
      }
    },
    defaultVariants: {
      size: "default",
      width: "auto"
    }
  }
);
const FancyButton = ({
  label,
  hoverLabel,
  icon: Icon,
  className,
  size,
  width,
  href,
  isLoading = false,
  ...props
}) => {
  const getIconSize = (size2) => {
    switch (size2) {
      case "sm":
        return "w-4 h-4";
      case "default":
      case "md":
        return "w-5 h-5";
      case "lg":
        return "w-6 h-6";
      case "xl":
        return "w-7 h-7";
      default:
        return "w-5 h-5";
    }
  };
  const content = /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-center gap-2.5", children: [
    /* @__PURE__ */ jsxs("span", { className: "relative inline-block overflow-hidden", children: [
      /* @__PURE__ */ jsx("span", { className: "block transition-transform duration-300 group-hover/button:-translate-y-full", children: label }),
      /* @__PURE__ */ jsx("span", { className: "absolute inset-0 transition-transform duration-300 translate-y-full group-hover/button:translate-y-0", children: hoverLabel ? hoverLabel : label })
    ] }),
    isLoading && /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-b-2 border-white rounded-full animate-spin" }),
    Icon && /* @__PURE__ */ jsx(
      Icon,
      {
        className: `${getIconSize(
          size
        )} transition-transform duration-200 group-hover/button:rotate-45`
      }
    )
  ] });
  return /* @__PURE__ */ jsx(
    Button,
    {
      className: fancyButtonVariants({ size, width, className }),
      ...props,
      children: href ? /* @__PURE__ */ jsx(
        Link,
        {
          href,
          className: fancyButtonVariants({ size, width, className }),
          ...props,
          children: content
        }
      ) : content
    }
  );
};
const setFrontendTheme = async (theme, submitFn) => {
  try {
    await submitFn({
      method: "POST",
      url: route("theme.set"),
      data: { theme }
    });
  } catch (error) {
  } finally {
  }
};
const handleLanguageChange = async (submit, language, setOpen) => {
  try {
    await submit({
      method: "POST",
      url: route("switch.language"),
      data: {
        id: language.id
      }
    });
    setOpen(false);
  } catch (error) {
  }
};
const handleBlogSearch = (query, filters) => {
  const params = new URLSearchParams(window.location.search);
  if (query && query.trim()) {
    params.set("search", query.trim());
  } else {
    params.delete("search");
  }
  if (filters?.category) {
    params.set("category", filters.category);
  }
  params.delete("page");
  const queryString = params.toString();
  const url = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
  router.get(url, {}, {
    preserveState: true,
    preserveScroll: true,
    only: ["blogs", "search", "filters", "categories"]
  });
};
const handleBlogCategoryFilter = (categorySlug, filters) => {
  const params = new URLSearchParams(window.location.search);
  if (filters?.category === categorySlug || !categorySlug) {
    params.delete("category");
  } else {
    params.set("category", categorySlug);
  }
  if (filters?.search) {
    params.set("search", filters.search);
  }
  params.delete("page");
  const queryString = params.toString();
  const url = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
  router.get(url, {}, {
    preserveState: true,
    preserveScroll: true,
    only: ["blogs", "search", "filters", "categories"]
  });
};
const handleStoreContact = async (e, data, submit, setFormData) => {
  e.preventDefault();
  try {
    await submit({
      method: "POST",
      url: route("contact.store"),
      data
    });
    setFormData({
      first_name: "",
      last_name: "",
      company: "",
      email: "",
      phone_number: "",
      message: "",
      agreed_to_policy: false
    });
  } catch (error) {
  }
};
const handleStoreNewsletter = async (e, data, submit, setFormData) => {
  e.preventDefault();
  try {
    await submit({
      method: "POST",
      url: route("subscribe.store"),
      data
    });
    setFormData({
      email: ""
    });
  } catch (error) {
  }
};
function DynamicIcon({ iconName, iconLibrary = "lucide", className = "w-4 h-4" }) {
  if (!iconName) return null;
  try {
    if (iconLibrary === "lucide") {
      const Icon = LucideIcons[iconName];
      return Icon ? /* @__PURE__ */ jsx(Icon, { className }) : null;
    } else if (iconLibrary === "radix") {
      const Icon = RadixIcons[iconName];
      return Icon ? /* @__PURE__ */ jsx(Icon, { className }) : null;
    }
  } catch (error) {
    return null;
  }
  return null;
}
function Avatar({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    AvatarPrimitive.Root,
    {
      "data-slot": "avatar",
      className: cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      ),
      ...props
    }
  );
}
function AvatarImage({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    AvatarPrimitive.Image,
    {
      "data-slot": "avatar-image",
      className: cn("aspect-square size-full", className),
      ...props
    }
  );
}
function AvatarFallback({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    AvatarPrimitive.Fallback,
    {
      "data-slot": "avatar-fallback",
      className: cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      ),
      ...props
    }
  );
}
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
const MenuScroller = ({ children, className }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const checkForScrollPosition = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  };
  useEffect(() => {
    checkForScrollPosition();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkForScrollPosition);
    window.addEventListener("resize", checkForScrollPosition);
    return () => {
      el.removeEventListener("scroll", checkForScrollPosition);
      window.removeEventListener("resize", checkForScrollPosition);
    };
  }, []);
  const scrollBy = (distance) => {
    if (!scrollRef.current) return;
    const dir = document.documentElement.getAttribute("dir") || "ltr";
    const amount = dir === "rtl" ? -distance : distance;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };
  const onMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollStart(scrollRef.current.scrollLeft);
  };
  const onMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    const dir = document.documentElement.getAttribute("dir") || "ltr";
    const dx = e.pageX - startX;
    scrollRef.current.scrollLeft = dir === "rtl" ? scrollStart + dx : scrollStart - dx;
  };
  const onMouseUp = () => setIsDragging(false);
  const onMouseLeave = () => setIsDragging(false);
  const onTouchStart = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
    setScrollStart(scrollRef.current.scrollLeft);
  };
  const onTouchMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    const dir = document.documentElement.getAttribute("dir") || "ltr";
    const dx = e.touches[0].pageX - startX;
    scrollRef.current.scrollLeft = dir === "rtl" ? scrollStart + dx : scrollStart - dx;
  };
  const onTouchEnd = () => setIsDragging(false);
  return /* @__PURE__ */ jsxs("div", { className: `relative ${className || ""}`, children: [
    canScrollLeft && /* @__PURE__ */ jsx("div", { className: "w-[80px] h-full absolute start-0 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-background/100 to-transparent flex justify-start items-center", children: /* @__PURE__ */ jsx(
      Button,
      {
        variant: "secondary",
        size: "icon",
        onClick: () => scrollBy(-150),
        className: "size-7 rounded-full cursor-pointer text-foreground hover:text-primary transition rtl:rotate-180",
        children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" })
      }
    ) }),
    canScrollRight && /* @__PURE__ */ jsx("div", { className: "w-[80px] h-full absolute end-0 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-l from-background/100 to-transparent flex justify-end items-center", children: /* @__PURE__ */ jsx(
      Button,
      {
        variant: "secondary",
        size: "icon",
        onClick: () => scrollBy(150),
        className: "size-7 rounded-full cursor-pointer text-foreground hover:text-primary transition rtl:rotate-180",
        children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-4" })
      }
    ) }),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: scrollRef,
        className: `overflow-x-auto no-scrollbar scroll-smooth cursor-${isDragging ? "grabbing" : "grab"}`,
        onMouseDown,
        onMouseMove,
        onMouseUp,
        onMouseLeave,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        children
      }
    )
  ] });
};
function Dialog(props) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Root, { "data-slot": "dialog", ...props });
}
function DialogPortal(props) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({ className, children, showCloseButton = true, ...props }) {
  return /* @__PURE__ */ jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxs(
      DialogPrimitive.Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxs(
            DialogPrimitive.Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute end-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsx(XIcon, {}),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-start", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function DialogTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function DialogDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Description,
    {
      "data-slot": "dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function DropdownMenu(props) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuPortal(props) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { "data-slot": "dropdown-menu-portal", ...props });
}
function DropdownMenuTrigger(props) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Trigger,
    {
      "data-slot": "dropdown-menu-trigger",
      ...props
    }
  );
}
function DropdownMenuContent({ className, sideOffset = 4, ...props }) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Content,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className
      ),
      ...props
    }
  ) });
}
function DropdownMenuGroup(props) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Group, { "data-slot": "dropdown-menu-group", ...props });
}
function DropdownMenuItem({ className, inset, variant = "default", ...props }) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:ps-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuLabel({ className, inset, ...props }) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Label,
    {
      "data-slot": "dropdown-menu-label",
      "data-inset": inset,
      className: cn("px-2 py-1.5 text-sm font-medium data-[inset]:ps-8", className),
      ...props
    }
  );
}
function DropdownMenuSeparator({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Separator,
    {
      "data-slot": "dropdown-menu-separator",
      className: cn("bg-border -mx-1 my-1 h-px", className),
      ...props
    }
  );
}
function DropdownMenuSub(props) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Sub, { "data-slot": "dropdown-menu-sub", ...props });
}
function DropdownMenuSubTrigger({ className, inset, children, ...props }) {
  return /* @__PURE__ */ jsxs(
    DropdownMenuPrimitive.SubTrigger,
    {
      "data-slot": "dropdown-menu-sub-trigger",
      "data-inset": inset,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:ps-8",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(ChevronRightIcon, { className: "ms-auto size-4" })
      ]
    }
  );
}
function DropdownMenuSubContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.SubContent,
    {
      "data-slot": "dropdown-menu-sub-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className
      ),
      ...props
    }
  );
}
const DEFAULT_THEME = "system";
const THEME_COOKIE_NAME = "vite-ui-theme";
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const initialState = {
  defaultTheme: DEFAULT_THEME,
  resolvedTheme: "light",
  theme: DEFAULT_THEME,
  setTheme: () => null,
  resetTheme: () => null
};
const ThemeContext = createContext(initialState);
function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = THEME_COOKIE_NAME,
  dbTheme,
  ...props
}) {
  const [theme, _setTheme] = useState(dbTheme);
  useEffect(() => {
    if (dbTheme) {
      _setTheme(dbTheme);
    }
  }, [dbTheme]);
  const resolvedTheme = useMemo(() => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
  }, [theme]);
  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = (currentResolvedTheme) => {
      if (typeof currentResolvedTheme !== "string") {
        currentResolvedTheme = currentResolvedTheme?.dbTheme;
      }
      root.classList.remove("light", "dark");
      root.classList.add(currentResolvedTheme);
    };
    const handleChange = () => {
      if (theme === "system") {
        const systemTheme = mediaQuery.matches ? "dark" : "light";
        applyTheme(systemTheme);
      }
    };
    applyTheme(resolvedTheme);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, resolvedTheme]);
  const setTheme = (newTheme) => {
    setCookie(storageKey, newTheme, THEME_COOKIE_MAX_AGE);
    _setTheme(newTheme);
  };
  const resetTheme = () => {
    removeCookie(storageKey);
    _setTheme(DEFAULT_THEME);
  };
  const contextValue = {
    defaultTheme,
    resolvedTheme,
    resetTheme,
    theme,
    setTheme
  };
  return /* @__PURE__ */ jsx(ThemeContext.Provider, { value: contextValue, ...props, children });
}
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
function Command({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    Command$1,
    {
      "data-slot": "command",
      className: cn(
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
        className
      ),
      ...props
    }
  );
}
function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxs(Dialog, { ...props, children: [
    /* @__PURE__ */ jsxs(DialogHeader, { className: "sr-only", children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: title }),
      /* @__PURE__ */ jsx(DialogDescription, { children: description })
    ] }),
    /* @__PURE__ */ jsx(
      DialogContent,
      {
        className: cn("overflow-hidden p-0", className),
        showCloseButton,
        children: /* @__PURE__ */ jsx(Command, { className: "[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5", children })
      }
    )
  ] });
}
function CommandInput({ className, ...props }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-slot": "command-input-wrapper",
      className: "flex h-9 items-center gap-2 border-b px-3",
      children: [
        /* @__PURE__ */ jsx(SearchIcon, { className: "size-4 shrink-0 opacity-50" }),
        /* @__PURE__ */ jsx(
          Command$1.Input,
          {
            "data-slot": "command-input",
            className: cn(
              "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
              className
            ),
            ...props
          }
        )
      ]
    }
  );
}
function CommandList({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    Command$1.List,
    {
      "data-slot": "command-list",
      className: cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
        className
      ),
      ...props
    }
  );
}
function CommandEmpty(props) {
  return /* @__PURE__ */ jsx(
    Command$1.Empty,
    {
      "data-slot": "command-empty",
      className: "py-6 text-center text-sm",
      ...props
    }
  );
}
function CommandGroup({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    Command$1.Group,
    {
      "data-slot": "command-group",
      className: cn(
        "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className
      ),
      ...props
    }
  );
}
function CommandItem({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    Command$1.Item,
    {
      "data-slot": "command-item",
      className: cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function ScrollArea({
  className,
  children,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    ScrollAreaPrimitive.Root,
    {
      "data-slot": "scroll-area",
      className: cn("relative", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          ScrollAreaPrimitive.Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: cn(
              "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
              orientation === "horizontal" && "overflow-x-auto!"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsx(ScrollBar, { orientation }),
        /* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, {})
      ]
    }
  );
}
function ScrollBar({ className, orientation = "vertical", ...props }) {
  return /* @__PURE__ */ jsx(
    ScrollAreaPrimitive.ScrollAreaScrollbar,
    {
      "data-slot": "scroll-area-scrollbar",
      orientation,
      className: cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        ScrollAreaPrimitive.ScrollAreaThumb,
        {
          "data-slot": "scroll-area-thumb",
          className: "bg-border relative flex-1 rounded-full"
        }
      )
    }
  );
}
function Sheet(props) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Root, { "data-slot": "sheet", ...props });
}
function SheetTrigger(props) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Trigger, { "data-slot": "sheet-trigger", ...props });
}
function SheetPortal(props) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Overlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function SheetContent({ className, children, side = "right", ...props }) {
  return /* @__PURE__ */ jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxs(
      DialogPrimitive.Content,
      {
        "data-slot": "sheet-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" && "data-[state=closed]:slide-out-to-end data-[state=open]:slide-in-from-end inset-y-0 end-0 h-full w-3/4 border-s sm:max-w-sm",
          side === "left" && "data-[state=closed]:slide-out-to-start data-[state=open]:slide-in-from-start inset-y-0 start-0 h-full w-3/4 border-e sm:max-w-sm",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute end-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ jsx(XIcon, { className: "size-4" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-1.5 p-4", className),
      ...props
    }
  );
}
function SheetFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sheet-footer",
      className: cn("mt-auto flex flex-col gap-2 p-4", className),
      ...props
    }
  );
}
function SheetTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Title,
    {
      "data-slot": "sheet-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
function SheetDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Description,
    {
      "data-slot": "sheet-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
export {
  Avatar as A,
  SheetTitle as B,
  Command as C,
  DropdownMenu as D,
  SheetDescription as E,
  DropdownMenuGroup as F,
  Separator as G,
  useTheme as H,
  SheetTrigger as I,
  SheetFooter as J,
  useDirection as K,
  useTranslations as L,
  handleStoreContact as M,
  FancyButton as N,
  DynamicIcon as O,
  handleStoreNewsletter as P,
  DropdownMenuPortal as Q,
  MenuScroller as R,
  ScrollArea as S,
  ThemeProvider as T,
  setFrontendTheme as U,
  handleLanguageChange as V,
  handleBlogSearch as W,
  handleBlogCategoryFilter as X,
  CommandInput as a,
  CommandList as b,
  CommandGroup as c,
  CommandItem as d,
  DropdownMenuTrigger as e,
  DropdownMenuContent as f,
  DropdownMenuLabel as g,
  DropdownMenuSeparator as h,
  DropdownMenuItem as i,
  DropdownMenuSub as j,
  DropdownMenuSubTrigger as k,
  DropdownMenuSubContent as l,
  Dialog as m,
  DialogContent as n,
  DialogHeader as o,
  DialogTitle as p,
  DialogDescription as q,
  DialogFooter as r,
  AvatarImage as s,
  AvatarFallback as t,
  DirectionProvider as u,
  CommandDialog as v,
  CommandEmpty as w,
  Sheet as x,
  SheetContent as y,
  SheetHeader as z
};

import { Link, router, usePage } from "@inertiajs/react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { QuestionMarkIcon } from "@radix-ui/react-icons";
import { Item, Root } from "@radix-ui/react-radio-group";
import { Slot } from "@radix-ui/react-slot";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cva } from "class-variance-authority";
import { ArrowRight, BadgeCheck, Bell, BookOpen, Check, ChevronRight, ChevronsUpDown, CircleCheck, Clock, Cog, Database, DatabaseBackup, FolderOpen, Globe, HardDrive, Info, Languages, LayoutDashboard, LayoutDashboardIcon, Loader2, LogOut, Mail, Menu, MessageSquare, Moon, NewspaperIcon, PanelLeftIcon, RotateCcw, SearchIcon, Server, Settings, Shield, ShoppingCart, Sun, Tag, User, UserCog, UserPlus, Users, Zap } from "lucide-react";
import * as React from "react";
import React__default, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaMoneyBill } from "react-icons/fa";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { d as handleLogout } from "./AuthController-DaCguZ7K.js";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import { B as Button, b as buttonVariants, a as cn, g as getCookie$1, r as removeCookie, s as setCookie } from "./Button-CFMlPXiE.js";
import { f as fonts, t as topNav } from "./constants-4k_q_jeE.js";
import { H as HotToaster, T as ToastProvider, u as useForm } from "./HotToast-DfpkTxSC.js";
import { A as Avatar, s as AvatarImage, v as CommandDialog, w as CommandEmpty, c as CommandGroup, a as CommandInput, d as CommandItem, b as CommandList, u as DirectionProvider, D as DropdownMenu, f as DropdownMenuContent, F as DropdownMenuGroup, i as DropdownMenuItem, g as DropdownMenuLabel, h as DropdownMenuSeparator, e as DropdownMenuTrigger, S as ScrollArea, G as Separator, x as Sheet, y as SheetContent, E as SheetDescription, J as SheetFooter, z as SheetHeader, B as SheetTitle, I as SheetTrigger, T as ThemeProvider, K as useDirection, H as useTheme, L as useTranslations } from "./Sheet-B-_2BaZp.js";
import { C as Collapsible, e as CollapsibleContent, d as CollapsibleTrigger } from "./TradeDialog-Dt4WEyMP.js";
const FONT_COOKIE_NAME = "font";
const FONT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const FontContext = createContext(null);
function FontProvider({ children, dbFont }) {
  const [font, _setFont] = useState(dbFont);
  useEffect(() => {
    if (dbFont) {
      _setFont(dbFont);
    }
  }, [dbFont]);
  useEffect(() => {
    const applyFont = (f) => {
      const root = document.documentElement;
      root.classList.forEach((cls) => {
        if (cls.startsWith("font-")) root.classList.remove(cls);
      });
      root.classList.add(`font-${f}`);
    };
    applyFont(font);
  }, [font]);
  const setFont = (newFont) => {
    setCookie(FONT_COOKIE_NAME, newFont, FONT_COOKIE_MAX_AGE);
    _setFont(newFont);
  };
  const resetFont = () => {
    removeCookie(FONT_COOKIE_NAME);
    _setFont(fonts[0]);
  };
  return /* @__PURE__ */ jsx(FontContext.Provider, { value: { font, setFont, resetFont }, children });
}
function BaseLayout({ children }) {
  const { props } = usePage();
  const { site_theme_settings } = props;
  return /* @__PURE__ */ jsx(ToastProvider, {
    children: /* @__PURE__ */ jsx(ThemeProvider, {
      dbTheme: site_theme_settings?.theme_mode, children: /* @__PURE__ */ jsx(FontProvider, {
        dbFont: site_theme_settings?.font, children: /* @__PURE__ */ jsxs(DirectionProvider, {
          dbDirection: site_theme_settings?.direction, children: [
            children,
    /* @__PURE__ */ jsx(HotToaster, {})
          ]
        })
      })
    })
  });
}
const LAYOUT_COLLAPSIBLE_COOKIE_NAME = "layout_collapsible";
const LAYOUT_VARIANT_COOKIE_NAME = "layout_variant";
const LAYOUT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const DEFAULT_VARIANT = "inset";
const DEFAULT_COLLAPSIBLE = "icon";
const LayoutContext = createContext(null);
function LayoutProvider({ children, themeConfig: siteThemeSettings }) {
  const dbSidebar = siteThemeSettings?.sidebar;
  const [collapsible, _setCollapsible] = useState(() => {
    getCookie$1(LAYOUT_COLLAPSIBLE_COOKIE_NAME);
    return DEFAULT_COLLAPSIBLE;
  });
  const [variant, _setVariant] = useState(dbSidebar);
  useEffect(() => {
    if (dbSidebar && dbSidebar !== variant) {
      _setVariant(dbSidebar);
    }
  }, [dbSidebar, variant]);
  const setCollapsible = (newCollapsible) => {
    _setCollapsible(newCollapsible);
    setCookie(LAYOUT_COLLAPSIBLE_COOKIE_NAME, newCollapsible, LAYOUT_COOKIE_MAX_AGE);
  };
  const setVariant = (newVariant) => {
    _setVariant(newVariant);
    setCookie(LAYOUT_VARIANT_COOKIE_NAME, newVariant, LAYOUT_COOKIE_MAX_AGE);
  };
  const resetLayout = () => {
    setCollapsible(DEFAULT_COLLAPSIBLE);
    setVariant(DEFAULT_VARIANT);
  };
  const contextValue = {
    resetLayout,
    defaultCollapsible: DEFAULT_COLLAPSIBLE,
    collapsible,
    setCollapsible,
    defaultVariant: DEFAULT_VARIANT,
    variant,
    setVariant
  };
  return /* @__PURE__ */ jsx(LayoutContext.Provider, { value: contextValue, children });
}
function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
const sidebarData = {
  navGroups: [
    // Dashboard
    {
      title: "Dashboard",
      items: [
        {
          title: "Overview",
          url: route("admin.dashboard"),
          icon: LayoutDashboard
        }
      ]
    },
    // Users & Roles
    {
      title: "Users & Access",
      items: [
        {
          title: "Users",
          icon: Users,
          items: [
            { title: "Users", url: route("admin.users.index"), icon: Users },
            { title: "Transactions", url: route("admin.transactions.index"), icon: FaMoneyBill }
          ]
        },
        {
          title: "Admins & Roles",
          icon: Shield,
          items: [
            { title: "Admin Users", url: route("admin.admin-users.index"), icon: UserCog },
            { title: "Roles & Permissions", url: route("admin.roles.index"), icon: Shield }
          ]
        }
      ]
    },
    // Market & Content
    {
      title: "Market & Content",
      items: [
        {
          title: "Markets",
          icon: ShoppingCart,
          items: [
            { title: "Market Categories", url: route("admin.market-categories.index"), icon: FolderOpen },
            { title: "Market Items", url: "", icon: ShoppingCart },
            { title: "Market Analytics", url: "", icon: Info }
          ]
        },
        {
          title: "Blog & Knowledge",
          icon: BookOpen,
          items: [
            { title: "All Blogs", url: route("admin.blogs.index"), icon: BookOpen },
            { title: "Blog Tags", url: route("admin.blogs-tags.index"), icon: Tag }
          ]
        }
      ]
    },
    // Support & Communication
    {
      title: "Support & Communication",
      items: [
        {
          title: "Inquiries",
          icon: MessageSquare,
          counter_keys: [
            "pending_contacts"
          ],
          items: [
            { title: "Contacts", url: route("admin.communication.contact.index"), icon: MessageSquare, counter_key: "pending_contacts" },
            { title: "Tickets", url: "", icon: QuestionMarkIcon },
            { title: "Subscribers", url: route("admin.communication.subscriber.index"), icon: UserPlus }
          ]
        },
        {
          title: "Notifications",
          icon: Bell,
          items: [
            { title: "Templates", url: route("admin.notification-templates.index"), icon: Mail },
            { title: "Global Templates", url: route("admin.notification-templates.global"), icon: Globe }
          ]
        }
      ]
    },
    // Appearance & Branding
    {
      title: "Appearance & Branding",
      items: [
        { title: "Appearance Settings", url: route("admin.appearance.index"), icon: LayoutDashboardIcon },
        { title: "FAQ", url: route("admin.faqs.index"), icon: QuestionMarkIcon },
        { title: "Policy Pages", url: route("admin.pages.index"), icon: NewspaperIcon },
        { title: "Menus", url: route("admin.menu.index"), icon: Menu }
      ]
    },
    // Finance & Reports
    // {
    //   title: 'Finance & Reports',
    //   items: [
    //     { title: 'Payment Method', url: route('admin.payment-methods.index'), icon: Zap },
    //     { title: 'Withdraw method', url: route('admin.withdraw-methods.index'), icon: Banknote },
    //     {
    //       title: 'Reports',
    //       icon: DollarSign,
    //       items: [
    //         { title: 'Transactions', url: '', icon: FileText },
    //         { title: 'Deposits', url: '', icon: Banknote },
    //         { title: 'Withdrawals', url: '', icon: Banknote },
    //         { title: 'KYC Applications', url: '', icon: Shield },
    //         { title: 'Wallet Statements', url: '', icon: CreditCard },
    //         { title: 'Activity Reports', url: '', icon: Clock },
    //       ],
    //     },
    //   ],
    // },
    // Infrastructure & System
    {
      title: "System & Infrastructure",
      items: [
        {
          title: "Gateways & Services",
          icon: Server,
          items: [
            { title: "Mail Gateway", url: route("admin.email-gateways.index"), icon: Mail },
            { title: "Firebase Gateway", url: route("admin.firebase-gateways.index"), icon: Database }
          ]
        },
        {
          title: "System Performance",
          icon: Zap,
          items: [
            { title: "Cache Configuration", url: route("admin.cache.index"), icon: Zap },
            { title: "Automation & Cron", url: route("admin.automation.index"), icon: Clock }
          ]
        },
        { title: "Database Backup", url: route("admin.backups.index"), icon: DatabaseBackup },
        { title: "System Info", url: route("admin.system.information"), icon: Info }
      ]
    },
    // Settings
    {
      title: "Configuration",
      items: [
        {
          title: "Localization",
          icon: Languages,
          items: [
            { title: "Languages", url: route("admin.languages.index"), icon: Languages }
          ]
        },
        {
          title: "System Settings",
          icon: Settings,
          items: [
            { title: "General Settings", url: route("admin.settings.index"), icon: Cog },
            { title: "Storage Settings", url: route("admin.settings.storage"), icon: HardDrive }
          ]
        }
      ]
    },
    // Profile
    {
      title: "Account",
      items: [
        { title: "Profile", url: route("admin.profile.index"), icon: User },
        { title: "Activity Logs", url: "", icon: Clock },
        { title: "Security & Password", url: route("admin.password.index"), icon: Shield }
      ]
    }
  ]
};
function CommandMenu() {
  const { open, setOpen } = useSearch();
  const runCommand = React__default.useCallback(
    (command) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );
  const navigateToPage = React__default.useCallback(
    (url) => {
      router.visit(url);
    },
    []
  );
  return /* @__PURE__ */ jsxs(CommandDialog, {
    modal: true, open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(CommandInput, { placeholder: "Type a command or search..." }),
    /* @__PURE__ */ jsx(CommandList, {
      children: /* @__PURE__ */ jsxs(ScrollArea, {
        type: "hover", className: "h-72 pe-1", children: [
      /* @__PURE__ */ jsx(CommandEmpty, { children: "No results found." }),
          sidebarData.navGroups.map((group) => /* @__PURE__ */ jsx(CommandGroup, {
            heading: group.title, children: group.items.map((navItem, i) => {
              if (navItem.url) {
                return /* @__PURE__ */ jsxs(
                  CommandItem,
                  {
                    value: navItem.title,
                    onSelect: () => runCommand(() => navigateToPage(navItem.url)),
                    children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center size-4", children: /* @__PURE__ */ jsx(ArrowRight, { className: "text-muted-foreground/80 size-2" }) }),
                      navItem.title
                    ]
                  },
                  `${navItem.url}-${i}`
                );
              }
              return navItem.items?.map((subItem, j) => /* @__PURE__ */ jsxs(
                CommandItem,
                {
                  value: `${navItem.title} ${subItem.title}`,
                  onSelect: () => runCommand(() => navigateToPage(subItem.url)),
                  children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center size-4", children: /* @__PURE__ */ jsx(ArrowRight, { className: "text-muted-foreground/80 size-2" }) }),
                    navItem.title,
                    " ",
              /* @__PURE__ */ jsx(ChevronRight, { className: "mx-1 size-3" }),
                    " ",
                    subItem.title
                  ]
                },
                `${navItem.title}-${subItem.url}-${j}`
              ));
            })
          }, group.title))
        ]
      })
    })
    ]
  });
}
const SearchContext = createContext(null);
function SearchProvider({ children }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  return /* @__PURE__ */ jsxs(SearchContext.Provider, {
    value: { open, setOpen }, children: [
      children,
    /* @__PURE__ */ jsx(CommandMenu, {})
    ]
  });
}
const useSearch = () => {
  const searchContext = useContext(SearchContext);
  if (!searchContext) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return searchContext;
};
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(void 0);
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}
function TooltipProvider({ delayDuration = 0, ...props }) {
  return /* @__PURE__ */ jsx(
    TooltipPrimitive.Provider,
    {
      "data-slot": "tooltip-provider",
      delayDuration,
      ...props
    }
  );
}
function Tooltip({ ...props }) {
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsx(TooltipPrimitive.Root, { "data-slot": "tooltip", ...props }) });
}
function TooltipTrigger({ ...props }) {
  return /* @__PURE__ */ jsx(TooltipPrimitive.Trigger, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({ className, sideOffset = 0, children, ...props }) {
  return /* @__PURE__ */ jsx(TooltipPrimitive.Portal, {
    children: /* @__PURE__ */ jsxs(
      TooltipPrimitive.Content,
      {
        "data-slot": "tooltip-content",
        sideOffset,
        className: cn(
          "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className
        ),
        ...props,
        children: [
          children,
        /* @__PURE__ */ jsx(TooltipPrimitive.Arrow, { className: "bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
        ]
      }
    )
  });
}
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SidebarContext = React.createContext(null);
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
function getCookie(name) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}
function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(() => {
    if (typeof window !== "undefined") {
      const cookieValue = getCookie(SIDEBAR_COOKIE_NAME);
      if (cookieValue !== null) {
        return cookieValue === "true";
      }
    }
    return defaultOpen;
  });
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      if (typeof document !== "undefined") {
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      }
    },
    [setOpenProp, open]
  );
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
  }, [isMobile, setOpen, setOpenMobile]);
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);
  const state = open ? "expanded" : "collapsed";
  const contextValue = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );
  return /* @__PURE__ */ jsx(SidebarContext.Provider, {
    value: contextValue, children: /* @__PURE__ */ jsx(TooltipProvider, {
      delayDuration: 0, children: /* @__PURE__ */ jsx(
        "div",
        {
          "data-slot": "sidebar-wrapper",
          style: {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style
          },
          className: cn(
            "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
            className
          ),
          ...props,
          children
        }
      )
    })
  });
}
function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
  if (collapsible === "none") {
    return /* @__PURE__ */ jsx(
      "div",
      {
        "data-slot": "sidebar",
        className: cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className
        ),
        ...props,
        children
      }
    );
  }
  if (isMobile) {
    return /* @__PURE__ */ jsx(Sheet, {
      open: openMobile, onOpenChange: setOpenMobile, ...props, children: /* @__PURE__ */ jsxs(
        SheetContent,
        {
          "data-sidebar": "sidebar",
          "data-slot": "sidebar",
          "data-mobile": "true",
          className: "bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
          style: {
            "--sidebar-width": SIDEBAR_WIDTH_MOBILE
          },
          side,
          children: [
          /* @__PURE__ */ jsxs(SheetHeader, {
            className: "sr-only", children: [
            /* @__PURE__ */ jsx(SheetTitle, { children: "Sidebar" }),
            /* @__PURE__ */ jsx(SheetDescription, { children: "Displays the mobile sidebar." })
            ]
          }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col w-full h-full", children })
          ]
        }
      )
    });
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "hidden group peer text-sidebar-foreground md:block",
      "data-state": state,
      "data-collapsible": state === "collapsed" ? collapsible : "",
      "data-variant": variant,
      "data-side": side,
      "data-slot": "sidebar",
      children: [
        /* @__PURE__ */ jsx(
        "div",
        {
          "data-slot": "sidebar-gap",
          className: cn(
            "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
          )
        }
      ),
        /* @__PURE__ */ jsx(
        "div",
        {
          "data-slot": "sidebar-container",
          className: cn(
            "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[inset-inline,width] duration-200 ease-linear md:flex",
            side === "left" ? "start-0 group-data-[collapsible=offcanvas]:-start-[calc(var(--sidebar-width))]" : "end-0 group-data-[collapsible=offcanvas]:-end-[calc(var(--sidebar-width))]",
            // Adjust the padding for floating and inset variants.
            variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-e group-data-[side=right]:border-s",
            className
          ),
          ...props,
          children: /* @__PURE__ */ jsx(
            "div",
            {
              "data-sidebar": "sidebar",
              "data-slot": "sidebar-inner",
              className: "bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm",
              children
            }
          )
        }
      )
      ]
    }
  );
}
function SidebarTrigger({
  className,
  onClick,
  ...props
}) {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsxs(
    Button,
    {
      "data-sidebar": "trigger",
      "data-slot": "sidebar-trigger",
      variant: "ghost",
      size: "icon",
      className: cn("size-7", className),
      onClick: (event) => {
        onClick?.(event);
        toggleSidebar();
      },
      ...props,
      children: [
        /* @__PURE__ */ jsx(PanelLeftIcon, {}),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle Sidebar" })
      ]
    }
  );
}
function SidebarRail({ className, ...props }) {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsx(
    "button",
    {
      "data-sidebar": "rail",
      "data-slot": "sidebar-rail",
      "aria-label": "Toggle Sidebar",
      tabIndex: -1,
      onClick: toggleSidebar,
      title: "Toggle Sidebar",
      className: cn(
        "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-end-4 group-data-[side=right]:start-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:start-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-end-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-start-2",
        // RTL support
        "rtl:translate-x-1/2",
        "rtl:in-data-[side=left]:cursor-e-resize rtl:in-data-[side=right]:cursor-w-resize",
        "rtl:[[data-side=left][data-state=collapsed]_&]:cursor-w-resize rtl:[[data-side=right][data-state=collapsed]_&]:cursor-e-resize",
        className
      ),
      ...props
    }
  );
}
function SidebarInset({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "main",
    {
      "data-slot": "sidebar-inset",
      className: cn(
        "bg-background relative flex w-full flex-1 flex-col",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ms-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ms-2",
        className
      ),
      ...props
    }
  );
}
function SidebarHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-header",
      "data-sidebar": "header",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
}
function SidebarFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-footer",
      "data-sidebar": "footer",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
}
function SidebarContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-content",
      "data-sidebar": "content",
      className: cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      ),
      ...props
    }
  );
}
function SidebarGroup({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-group",
      "data-sidebar": "group",
      className: cn("relative flex w-full min-w-0 flex-col p-2", className),
      ...props
    }
  );
}
function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "div";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "sidebar-group-label",
      "data-sidebar": "group-label",
      className: cn(
        "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      ),
      ...props
    }
  );
}
function SidebarMenu({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "ul",
    {
      "data-slot": "sidebar-menu",
      "data-sidebar": "menu",
      className: cn("flex w-full min-w-0 flex-col gap-1", className),
      ...props
    }
  );
}
function SidebarMenuItem({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "li",
    {
      "data-slot": "sidebar-menu-item",
      "data-sidebar": "menu-item",
      className: cn("group/menu-item relative", className),
      ...props
    }
  );
}
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-start text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pe-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  const { isMobile, state } = useSidebar();
  const button = /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "sidebar-menu-button",
      "data-sidebar": "menu-button",
      "data-size": size,
      "data-active": isActive,
      className: cn(sidebarMenuButtonVariants({ variant, size }), className),
      ...props
    }
  );
  if (!tooltip) {
    return button;
  }
  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip
    };
  }
  return /* @__PURE__ */ jsxs(Tooltip, {
    children: [
    /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: button }),
    /* @__PURE__ */ jsx(
      TooltipContent,
      {
        side: "right",
        align: "center",
        hidden: state !== "collapsed" || isMobile,
        ...tooltip
      }
    )
    ]
  });
}
function SidebarMenuSub({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "ul",
    {
      "data-slot": "sidebar-menu-sub",
      "data-sidebar": "menu-sub",
      className: cn(
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-s px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  );
}
function SidebarMenuSubItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "li",
    {
      "data-slot": "sidebar-menu-sub-item",
      "data-sidebar": "menu-sub-item",
      className: cn("group/menu-sub-item relative", className),
      ...props
    }
  );
}
function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}) {
  const Comp = asChild ? Slot : "a";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "sidebar-menu-sub-button",
      "data-sidebar": "menu-sub-button",
      "data-size": size,
      "data-active": isActive,
      className: cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-inherit",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  );
}
function AppSidebar({ ...props }) {
  const { collapsible, variant } = useLayout();
  return /* @__PURE__ */ jsx(Sidebar, { ...props, collapsible, variant });
}
function SkipToMain() {
  return /* @__PURE__ */ jsx(
    "a",
    {
      className: `bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring fixed start-44 z-999 -translate-y-52 px-4 py-2 text-sm font-medium whitespace-nowrap opacity-95 shadow-sm transition focus:translate-y-3 focus:transform focus-visible:ring-1`,
      href: "#content",
      children: "Skip to Main"
    }
  );
}
function TeamSwitcher({ siteConfig, siteLogo }) {
  const { isMobile } = useSidebar();
  return /* @__PURE__ */ jsx(SidebarMenu, {
    children: /* @__PURE__ */ jsx(SidebarMenuItem, {
      children: /* @__PURE__ */ jsxs(
        Link,
        {
          href: route("admin.dashboard"),
          className: "flex items-center w-full gap-2 p-2 transition-colors rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          children: [
        /* @__PURE__ */ jsx("div", {
            className: "flex items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground aspect-square size-8", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: siteLogo,
                alt: `${siteConfig?.site_name || "Site"} logo`,
                className: "object-contain size-4"
              }
            )
          }),
        /* @__PURE__ */ jsx("div", { className: "grid flex-1 text-sm leading-tight text-start", children: /* @__PURE__ */ jsx("span", { className: "font-semibold truncate", children: siteConfig?.site_name }) })
          ]
        }
      )
    })
  });
}
function useDialogState(initialState = null) {
  const [open, _setOpen] = useState(initialState);
  const setOpen = (value) => {
    _setOpen((prev) => prev === value ? null : value);
  };
  return [open, setOpen];
}
function AlertDialog(props) {
  return /* @__PURE__ */ jsx(AlertDialogPrimitive.Root, { "data-slot": "alert-dialog", ...props });
}
function AlertDialogPortal(props) {
  return /* @__PURE__ */ jsx(AlertDialogPrimitive.Portal, { "data-slot": "alert-dialog-portal", ...props });
}
function AlertDialogOverlay({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Overlay,
    {
      "data-slot": "alert-dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function AlertDialogContent({ className, ...props }) {
  return /* @__PURE__ */ jsxs(AlertDialogPortal, {
    children: [
    /* @__PURE__ */ jsx(AlertDialogOverlay, {}),
    /* @__PURE__ */ jsx(
      AlertDialogPrimitive.Content,
      {
        "data-slot": "alert-dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props
      }
    )
    ]
  });
}
function AlertDialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "alert-dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-start", className),
      ...props
    }
  );
}
function AlertDialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "alert-dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function AlertDialogTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Title,
    {
      "data-slot": "alert-dialog-title",
      className: cn("text-lg font-semibold", className),
      ...props
    }
  );
}
function AlertDialogDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Description,
    {
      "data-slot": "alert-dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function AlertDialogCancel({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Cancel,
    {
      className: cn(buttonVariants({ variant: "outline" }), className),
      ...props
    }
  );
}
function ConfirmDialog(props) {
  const {
    title,
    desc,
    children,
    className,
    confirmText,
    cancelBtnText,
    destructive,
    isLoading,
    disabled = false,
    handleConfirm,
    isSubmitting,
    ...actions
  } = props;
  return /* @__PURE__ */ jsx(AlertDialog, {
    ...actions, children: /* @__PURE__ */ jsxs(AlertDialogContent, {
      className: cn(className && className), children: [
    /* @__PURE__ */ jsxs(AlertDialogHeader, {
        className: "text-start", children: [
      /* @__PURE__ */ jsx(AlertDialogTitle, { children: title }),
      /* @__PURE__ */ jsx(AlertDialogDescription, { asChild: true, children: /* @__PURE__ */ jsx("div", { children: desc }) })
        ]
      }),
        children,
    /* @__PURE__ */ jsxs(AlertDialogFooter, {
          children: [
      /* @__PURE__ */ jsx(AlertDialogCancel, { disabled: isLoading, children: cancelBtnText ?? "Cancel" }),
      /* @__PURE__ */ jsxs(
            Button,
            {
              variant: destructive ? "destructive" : "default",
              onClick: handleConfirm,
              disabled: disabled || isLoading,
              children: [
                isLoading && /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }),
                "  ",
                confirmText ?? "Continue"
              ]
            }
          )
          ]
        })
      ]
    })
  });
}
function SignOutDialog({ open, onOpenChange }) {
  const { loading: isSubmitting, submit } = useForm();
  return /* @__PURE__ */ jsx(
    ConfirmDialog,
    {
      open,
      onOpenChange,
      title: "Sign out",
      desc: "Are you sure you want to sign out? You will need to sign in again to access your account.",
      confirmText: "Sign out",
      handleConfirm: () => handleLogout(submit),
      isLoading: isSubmitting,
      className: "sm:max-w-sm"
    }
  );
}
function NavUser({ user }) {
  const { isMobile } = useSidebar();
  const [open, setOpen] = useDialogState();
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
    /* @__PURE__ */ jsx(SidebarMenu, {
      children: /* @__PURE__ */ jsx(SidebarMenuItem, {
        children: /* @__PURE__ */ jsxs(DropdownMenu, {
          children: [
      /* @__PURE__ */ jsx(DropdownMenuTrigger, {
            asChild: true, children: /* @__PURE__ */ jsxs(
              SidebarMenuButton,
              {
                size: "lg",
                className: "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
                children: [
            /* @__PURE__ */ jsx(Avatar, { className: "w-8 h-8 rounded-lg", children: /* @__PURE__ */ jsx(AvatarImage, { src: user?.img_url, alt: user?.name }) }),
            /* @__PURE__ */ jsxs("div", {
                  className: "grid flex-1 text-sm leading-tight text-start", children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold truncate", children: user?.name }),
              /* @__PURE__ */ jsx("span", { className: "text-xs truncate", children: user?.email })
                  ]
                }),
            /* @__PURE__ */ jsx(ChevronsUpDown, { className: "ms-auto size-4" })
                ]
              }
            )
          }),
      /* @__PURE__ */ jsxs(
            DropdownMenuContent,
            {
              className: "w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg",
              side: isMobile ? "bottom" : "right",
              align: "end",
              sideOffset: 4,
              children: [
            /* @__PURE__ */ jsx(DropdownMenuLabel, {
                className: "p-0 font-normal", children: /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2 px-1 py-1.5 text-start text-sm", children: [
              /* @__PURE__ */ jsx(Avatar, { className: "w-8 h-8 rounded-lg", children: /* @__PURE__ */ jsx(AvatarImage, { src: user?.img_url, alt: user.name }) }),
              /* @__PURE__ */ jsxs("div", {
                    className: "grid flex-1 text-sm leading-tight text-start", children: [
                /* @__PURE__ */ jsx("span", { className: "font-semibold truncate", children: user?.name }),
                /* @__PURE__ */ jsx("span", { className: "text-xs truncate", children: user?.email })
                    ]
                  })
                  ]
                })
              }),
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxs(DropdownMenuGroup, {
                children: [
              /* @__PURE__ */ jsx(DropdownMenuItem, {
                  asChild: true, children: /* @__PURE__ */ jsxs(Link, {
                    href: route("admin.profile.index"), children: [
                /* @__PURE__ */ jsx(BadgeCheck, {}),
                      "Account"
                    ]
                  })
                }),
              /* @__PURE__ */ jsx(DropdownMenuItem, {
                  asChild: true, children: /* @__PURE__ */ jsxs(Link, {
                    href: route("admin.settings.index"), children: [
                /* @__PURE__ */ jsx(Settings, {}),
                      "Settings"
                    ]
                  })
                })
                ]
              }),
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxs(DropdownMenuItem, {
                onClick: () => setOpen(true), children: [
              /* @__PURE__ */ jsx(LogOut, {}),
                  "Sign out"
                ]
              })
              ]
            }
          )
          ]
        })
      })
    }),
    /* @__PURE__ */ jsx(SignOutDialog, { open: !!open, onOpenChange: setOpen })
    ]
  });
}
function NavGroup({ title, reportCounters, items }) {
  const { state, isMobile } = useSidebar();
  const { url } = usePage();
  return /* @__PURE__ */ jsxs(SidebarGroup, {
    children: [
    /* @__PURE__ */ jsx(SidebarGroupLabel, { children: title }),
    /* @__PURE__ */ jsx(SidebarMenu, {
      children: items.map((item) => {
        const key = `${item.title}-${item.url || "parent"}`;
        if (!item.items)
          return /* @__PURE__ */ jsx(SidebarMenuLink, { item, currentUrl: url, reportCounters }, key);
        if (state === "collapsed" && !isMobile)
          return /* @__PURE__ */ jsx(SidebarMenuCollapsedDropdown, { item, currentUrl: url, reportCounters }, key);
        return /* @__PURE__ */ jsx(SidebarMenuCollapsible, { item, currentUrl: url, reportCounters }, key);
      })
    })
    ]
  });
}
function NavBadge({ children }) {
  return /* @__PURE__ */ jsx(Badge, { className: "px-1 py-0 text-xs rounded-full", children });
}
function SidebarMenuLink({ item, currentUrl, reportCounters }) {
  const { setOpenMobile } = useSidebar();
  const isActive = checkIsActive(currentUrl, item);
  let counter = 0;
  if (item?.counter_key) {
    counter = reportCounters[item?.counter_key];
  }
  return /* @__PURE__ */ jsx(SidebarMenuItem, {
    children: /* @__PURE__ */ jsx(
      SidebarMenuButton,
      {
        asChild: true,
        isActive,
        tooltip: item.title,
        children: /* @__PURE__ */ jsxs(Link, {
          href: item.url, onClick: () => setOpenMobile(false), children: [
            item.icon && /* @__PURE__ */ jsx(item.icon, {}),
        /* @__PURE__ */ jsx("span", { children: item.title }),
            counter > 0 && /* @__PURE__ */ jsx(NavBadge, { children: counter })
          ]
        })
      }
    )
  });
}
function SidebarMenuCollapsible({
  item,
  currentUrl,
  reportCounters
}) {
  const { setOpenMobile } = useSidebar();
  const hasActiveChild = checkIsActive(currentUrl, item, true);
  let total = 0;
  if (item?.counter_keys?.length) {
    item.counter_keys.forEach((key) => {
      total += Number(reportCounters?.[key] || 0);
    });
  }
  return /* @__PURE__ */ jsx(
    Collapsible,
    {
      asChild: true,
      defaultOpen: hasActiveChild,
      className: "group/collapsible",
      children: /* @__PURE__ */ jsxs(SidebarMenuItem, {
        children: [
        /* @__PURE__ */ jsx(CollapsibleTrigger, {
          asChild: true, children: /* @__PURE__ */ jsxs(SidebarMenuButton, {
            tooltip: item.title, isActive: hasActiveChild, children: [
              item.icon && /* @__PURE__ */ jsx(item.icon, {}),
          /* @__PURE__ */ jsx("span", { children: item.title }),
              total > 0 && /* @__PURE__ */ jsx(NavBadge, { children: total }),
          /* @__PURE__ */ jsx(ChevronRight, { className: "ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" })
            ]
          })
        }),
        /* @__PURE__ */ jsx(CollapsibleContent, {
          className: "CollapsibleContent", children: /* @__PURE__ */ jsx(SidebarMenuSub, {
            children: item.items.map((subItem) => {
              let counter = 0;
              if (subItem?.counter_key) {
                counter = reportCounters[subItem?.counter_key];
              }
              return /* @__PURE__ */ jsx(SidebarMenuSubItem, {
                children: /* @__PURE__ */ jsx(
                  SidebarMenuSubButton,
                  {
                    asChild: true,
                    isActive: checkIsActive(currentUrl, subItem),
                    children: /* @__PURE__ */ jsxs(Link, {
                      href: subItem.url, onClick: () => setOpenMobile(false), children: [
                /* @__PURE__ */ jsx("span", { children: subItem.title }),
                        counter > 0 && /* @__PURE__ */ jsx(NavBadge, { children: counter })
                      ]
                    })
                  }
                )
              }, `${subItem.title}-${subItem.url}`);
            })
          })
        })
        ]
      })
    }
  );
}
function SidebarMenuCollapsedDropdown({
  item,
  currentUrl,
  reportCounters
}) {
  const hasActiveChild = checkIsActive(currentUrl, item, true);
  let counter = 0;
  console.log(item?.counter_key);
  if (item?.counter_key) {
    counter = reportCounters[item?.counter_key];
  }
  return /* @__PURE__ */ jsx(SidebarMenuItem, {
    children: /* @__PURE__ */ jsxs(DropdownMenu, {
      children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, {
        asChild: true, children: /* @__PURE__ */ jsxs(
          SidebarMenuButton,
          {
            tooltip: item.title,
            isActive: hasActiveChild,
            children: [
              item.icon && /* @__PURE__ */ jsx(item.icon, {}),
          /* @__PURE__ */ jsx("span", { children: item.title }),
              counter > 0 && /* @__PURE__ */ jsx(NavBadge, { children: counter }),
          /* @__PURE__ */ jsx(ChevronRight, { className: "ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" })
            ]
          }
        )
      }),
    /* @__PURE__ */ jsxs(DropdownMenuContent, {
        side: "right", align: "start", sideOffset: 4, children: [
      /* @__PURE__ */ jsxs(DropdownMenuLabel, {
          children: [
            item.title,
            " ",
            item.badge ? `(${item.badge})` : ""
          ]
        }),
      /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
          item.items.map((sub) => /* @__PURE__ */ jsx(DropdownMenuItem, {
            asChild: true, children: /* @__PURE__ */ jsxs(
              Link,
              {
                href: sub.url,
                className: `${checkIsActive(currentUrl, sub) ? "bg-secondary" : ""}`,
                children: [
                  sub.icon && /* @__PURE__ */ jsx(sub.icon, {}),
            /* @__PURE__ */ jsx("span", { className: "max-w-52 text-wrap", children: sub.title }),
                  sub.badge && /* @__PURE__ */ jsx("span", { className: "text-xs ms-auto", children: sub.badge })
                ]
              }
            )
          }, `${sub.title}-${sub.url}`))
        ]
      })
      ]
    })
  });
}
function checkIsActive(currentUrl, item, checkChildren = false) {
  if (!item.url && !checkChildren) {
    return false;
  }
  const normalizeUrl = (url) => {
    if (!url || url === "") return "";
    let cleanUrl = String(url).trim();
    cleanUrl = cleanUrl.split("?")[0].split("#")[0];
    if (!cleanUrl.startsWith("/") && !cleanUrl.startsWith("http")) {
      cleanUrl = "/" + cleanUrl;
    }
    if (cleanUrl.startsWith("http")) {
      try {
        const urlObj = new URL(cleanUrl);
        cleanUrl = urlObj.pathname;
      } catch (e) {
        const match = cleanUrl.match(/https?:\/\/[^\/]+(\/.*?)(?:\?|#|$)/);
        if (match) {
          cleanUrl = match[1];
        }
      }
    }
    if (cleanUrl !== "/" && cleanUrl.endsWith("/")) {
      cleanUrl = cleanUrl.slice(0, -1);
    }
    return cleanUrl;
  };
  const cleanCurrentUrl = normalizeUrl(currentUrl);
  const cleanItemUrl = normalizeUrl(item.url);
  if (!cleanItemUrl) {
    if (checkChildren && item.items) {
      return item.items.some((child) => checkIsActive(currentUrl, child));
    }
    return false;
  }
  if (cleanCurrentUrl === cleanItemUrl) {
    return true;
  }
  if (cleanItemUrl !== "/" && cleanCurrentUrl.startsWith(cleanItemUrl + "/")) {
    return true;
  }
  if (checkChildren && item.items) {
    return item.items.some((child) => checkIsActive(currentUrl, child));
  }
  return false;
}
function Header({ className, fixed, children, ...props }) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => document.removeEventListener("scroll", onScroll);
  }, []);
  return /* @__PURE__ */ jsx(
    "header",
    {
      className: cn(
        "z-50 h-16",
        fixed && "header-fixed peer/header sticky top-0 w-[inherit]",
        offset > 10 && fixed ? "shadow" : "shadow-none",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: cn(
            "relative flex h-full items-center gap-3 p-4 sm:gap-4",
            offset > 10 && fixed && "after:bg-background/20 after:absolute after:inset-0 after:-z-10 after:backdrop-blur-lg"
          ),
          children: [
            /* @__PURE__ */ jsx(SidebarTrigger, { variant: "outline", className: "max-md:scale-125" }),
            /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "h-6" }),
            children
          ]
        }
      )
    }
  );
}
function TopNav({ className, links, ...props }) {
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
    /* @__PURE__ */ jsx("div", {
      className: "lg:hidden", children: /* @__PURE__ */ jsxs(DropdownMenu, {
        modal: false, children: [
      /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { size: "icon", variant: "outline", className: "md:size-7", children: /* @__PURE__ */ jsx(Menu, {}) }) }),
      /* @__PURE__ */ jsx(DropdownMenuContent, {
          side: "bottom", align: "start", children: links.map(({ title, href, isActive, disabled }) => /* @__PURE__ */ jsx(DropdownMenuItem, {
            asChild: true, children: /* @__PURE__ */ jsx(
              "a",
              {
                to: href,
                className: !isActive ? "text-muted-foreground" : "",
                disabled,
                children: title
              }
            )
          }, `${title}-${href}`))
        })
        ]
      })
    }),
    /* @__PURE__ */ jsx(
      "nav",
      {
        className: cn(
          "hidden items-center space-x-4 lg:flex lg:space-x-4 xl:space-x-6",
          className
        ),
        ...props,
        children: links.map(({ title, href, isActive, disabled }) => /* @__PURE__ */ jsx(
          "a",
          {
            to: href,
            disabled,
            className: `hover:text-primary text-sm font-medium transition-colors ${isActive ? "" : "text-muted-foreground"}`,
            children: title
          },
          `${title}-${href}`
        ))
      }
    )
    ]
  });
}
function Search({
  className = "",
  placeholder = "Search"
}) {
  const { setOpen } = useSearch();
  return /* @__PURE__ */ jsxs(
    Button,
    {
      variant: "outline",
      className: cn(
        "bg-muted/25 group text-muted-foreground hover:bg-accent relative h-8 w-full flex-1 justify-start rounded-md text-sm font-normal shadow-none sm:w-40 sm:pe-12 md:flex-none lg:w-52 xl:w-64",
        className
      ),
      onClick: () => setOpen(true),
      children: [
        /* @__PURE__ */ jsx(
        SearchIcon,
        {
          "aria-hidden": "true",
          className: "absolute start-1.5 top-1/2 -translate-y-1/2",
          size: 16
        }
      ),
        /* @__PURE__ */ jsx("span", { className: "ms-4", children: placeholder }),
        /* @__PURE__ */ jsxs("kbd", {
        className: "bg-muted group-hover:bg-accent pointer-events-none absolute end-[0.3rem] top-[0.3rem] hidden h-5 items-center gap-1 rounded border px-1.5  text-[10px] font-medium opacity-100 select-none sm:flex", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs", children: "⌘" }),
          "K"
        ]
      })
      ]
    }
  );
}
const onSettingsUpdate = async (data, submitFn) => {
  const transformedData = transformSettingsBooleanValues(data);
  if (Object.keys(transformedData.site_settings).length === 0) {
    toast.error("No changes to update");
    return;
  }
  try {
    await submitFn({
      method: "POST",
      url: route("admin.settings.store"),
      headers: {
        "Content-Type": "multipart/form-data"
      },
      data: transformedData
    });
  } catch (error) {
  }
};
const onLogoUpdate = async (data, submitFn) => {
  try {
    await submitFn({
      method: "POST",
      url: route("admin.settings.store"),
      headers: {
        "Content-Type": "multipart/form-data"
      },
      data
    });
  } catch (error) {
  }
};
const transformSettingsBooleanValues = (data) => {
  return Object.keys(data).reduce((acc, key) => {
    const value = data[key];
    if (typeof value === "boolean") {
      acc[key] = value ? "active" : "inactive";
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      acc[key] = transformSettingsBooleanValues(value);
    } else {
      if (value !== null && value !== void 0 && value !== "") {
        acc[key] = value;
      }
    }
    return acc;
  }, {});
};
const onSettingsChange = async (key, theme, submit) => {
  const postData = {
    site_settings: {
      [key]: theme
    }
  };
  onSettingsUpdate(postData, submit);
};
const toggleDebugMode = async (submitFn) => {
  try {
    await submitFn({
      method: "POST",
      url: route("admin.settings.toggle.app.debug")
    });
  } catch (error) {
  }
};
const handleClearCache = async (setLastClearType, cacheType, submitFn) => {
  setLastClearType(cacheType);
  try {
    await submitFn({
      method: "POST",
      url: route("admin.cache.clear", cacheType)
    });
  } catch (error) {
  } finally {
    setLastClearType(null);
  }
};
const handleClearAllCache = async (setLastClearType, submitFn) => {
  setLastClearType("all");
  try {
    await submitFn({
      method: "POST",
      url: route("admin.cache.clear-all")
    });
  } catch (error) {
  } finally {
    setLastClearType(null);
  }
};
const handleRunCommand = async (commandId, submitFn) => {
  try {
    await submitFn({
      method: "POST",
      url: route("admin.automation.run", commandId)
    });
  } catch (error) {
  }
};
const clearAutomationCache = async (submitFn) => {
  try {
    await submitFn({
      method: "POST",
      url: route("admin.automation.clear.cache")
    });
  } catch (error) {
  }
};
const getDeleteBackupDialogContent = (type = "all", backup = {}) => {
  if (type === "all") {
    return {
      title: "Delete All Backups",
      description: "Are you sure you want to delete ALL backups? This action cannot be undone and will remove all backup files.",
      itemName: "All Backups",
      itemType: "Database Backups",
      warningMessage: "This will permanently delete all backup files from your server. Make sure you have alternative backups if needed.",
      showWarningAlert: true,
      showItemDetails: true,
      itemDisplayFields: [
        {
          label: "Total Backups",
          key: "total_backups",
          render: () => backup?.total_backups || 0
        },
        {
          label: "Total Size",
          key: "total_size",
          render: () => backup?.total_size || "0 B"
        }
      ],
      specialWarnings: [
        {
          condition: () => (backup?.total_backups || 0) > 0,
          title: "Permanent Deletion",
          message: "All backup files will be permanently deleted. This action cannot be reversed.",
          alertClass: "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800",
          iconClass: "text-red-600 dark:text-red-400",
          textClass: "text-red-800 dark:text-red-200"
        }
      ]
    };
  }
  return {
    title: "Delete Backup",
    description: "Are you sure you want to delete this backup? This action cannot be undone.",
    itemName: backup?.filename || "Backup",
    itemType: "Database Backup",
    warningMessage: "Deleting this backup will permanently remove the backup file from your server.",
    showWarningAlert: true,
    showItemDetails: true,
    itemDisplayFields: [
      {
        label: "Filename",
        key: "filename",
        className: " text-sm"
      },
      {
        label: "Size",
        key: "size",
        className: "font-medium"
      },
      {
        label: "Created",
        key: "created_at",
        className: "text-gray-600 dark:text-gray-400"
      }
    ],
    specialWarnings: []
  };
};
const handleCreateBackup = async (submitFn) => {
  try {
    await submitFn({
      method: "POST",
      url: route("admin.backups.create")
    });
  } catch (error) {
  }
};
const confirmDeleteBackup = async (backup, submitFn, setShowDeleteDialog) => {
  if (backup) {
    try {
      await submitFn({
        method: "POST",
        url: route("admin.backups.delete", backup?.id)
      });
      setShowDeleteDialog(false);
    } catch (error) {
    }
  }
};
const confirmDeleteAllBackups = async (item, submitFn, setShowDeleteAllDialog) => {
  try {
    await submitFn({
      method: "POST",
      url: route("admin.backups.delete.all")
    });
    setShowDeleteAllDialog(false);
  } catch (error) {
  }
};
function ThemeSwitch({ dbTheme }) {
  const { theme, setTheme } = useTheme();
  const { submit } = useForm();
  useEffect(() => {
    if (dbTheme) {
      setTheme(dbTheme);
    }
  }, [dbTheme]);
  useEffect(() => {
    const themeColor = theme === "dark" ? "#020817" : "#fff";
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) metaThemeColor.setAttribute("content", themeColor);
  }, [theme]);
  return /* @__PURE__ */ jsxs(DropdownMenu, {
    modal: false, children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, {
      asChild: true, children: /* @__PURE__ */ jsxs(Button, {
        variant: "ghost", size: "icon", className: "scale-95 rounded-full", children: [
      /* @__PURE__ */ jsx(Sun, { className: "size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" }),
      /* @__PURE__ */ jsx(Moon, { className: "absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" }),
      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle theme" })
        ]
      })
    }),
    /* @__PURE__ */ jsxs(DropdownMenuContent, {
      align: "end", children: [
      /* @__PURE__ */ jsxs(DropdownMenuItem, {
        onClick: () => onSettingsChange("theme_mode", "light", submit), children: [
          "Light",
          " ",
        /* @__PURE__ */ jsx(
            Check,
            {
              size: 14,
              className: cn("ms-auto", theme !== "light" && "hidden")
            }
          )
        ]
      }),
      /* @__PURE__ */ jsxs(DropdownMenuItem, {
        onClick: () => onSettingsChange("theme_mode", "dark", submit), children: [
          "Dark",
        /* @__PURE__ */ jsx(
            Check,
            {
              size: 14,
              className: cn("ms-auto", theme !== "dark" && "hidden")
            }
          )
        ]
      }),
      /* @__PURE__ */ jsxs(DropdownMenuItem, {
        onClick: () => onSettingsChange("theme_mode", "system", submit), children: [
          "System",
        /* @__PURE__ */ jsx(
            Check,
            {
              size: 14,
              className: cn("ms-auto", theme !== "system" && "hidden")
            }
          )
        ]
      })
      ]
    })
    ]
  });
}
function IconDir({ dir, className, ...props }) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      "data-name": `icon-dir-${dir}`,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 79.86 51.14",
      className: cn(dir === "rtl" && "rotate-y-180", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
        "path",
        {
          d: "M23.42.51h51.92c2.21 0 4 1.79 4 4v42.18c0 2.21-1.79 4-4 4H23.42s-.04-.02-.04-.04V.55s.02-.04.04-.04z",
          opacity: 0.15
        }
      ),
        /* @__PURE__ */ jsx(
        "path",
        {
          fill: "none",
          opacity: 0.72,
          strokeLinecap: "round",
          strokeMiterlimit: 10,
          strokeWidth: "2px",
          d: "M5.56 14.88L17.78 14.88"
        }
      ),
        /* @__PURE__ */ jsx(
        "path",
        {
          fill: "none",
          opacity: 0.48,
          strokeLinecap: "round",
          strokeMiterlimit: 10,
          strokeWidth: "2px",
          d: "M5.56 22.09L16.08 22.09"
        }
      ),
        /* @__PURE__ */ jsx(
        "path",
        {
          fill: "none",
          opacity: 0.55,
          strokeLinecap: "round",
          strokeMiterlimit: 10,
          strokeWidth: "2px",
          d: "M5.56 18.38L14.93 18.38"
        }
      ),
        /* @__PURE__ */ jsxs("g", {
        strokeLinecap: "round", strokeMiterlimit: 10, children: [
          /* @__PURE__ */ jsx("circle", { cx: 7.51, cy: 7.4, r: 2.54, opacity: 0.8 }),
          /* @__PURE__ */ jsx(
          "path",
          {
            fill: "none",
            opacity: 0.8,
            strokeWidth: "2px",
            d: "M12.06 6.14L17.78 6.14"
          }
        ),
          /* @__PURE__ */ jsx("path", { fill: "none", opacity: 0.6, d: "M11.85 8.79L16.91 8.79" })
        ]
      }),
        /* @__PURE__ */ jsx(
        "path",
        {
          fill: "none",
          opacity: 0.62,
          strokeLinecap: "round",
          strokeMiterlimit: 10,
          strokeWidth: "3px",
          d: "M29.41 7.4L34.67 7.4"
        }
      ),
        /* @__PURE__ */ jsx(
        "rect",
        {
          x: 28.76,
          y: 11.21,
          width: 26.03,
          height: 2.73,
          rx: 0.64,
          ry: 0.64,
          opacity: 0.44,
          strokeLinecap: "round",
          strokeMiterlimit: 10
        }
      ),
        /* @__PURE__ */ jsx(
        "rect",
        {
          x: 28.76,
          y: 17.01,
          width: 44.25,
          height: 13.48,
          rx: 0.64,
          ry: 0.64,
          opacity: 0.3,
          strokeLinecap: "round",
          strokeMiterlimit: 10
        }
      ),
        /* @__PURE__ */ jsx(
        "rect",
        {
          x: 28.76,
          y: 33.57,
          width: 44.25,
          height: 4.67,
          rx: 0.64,
          ry: 0.64,
          opacity: 0.21,
          strokeLinecap: "round",
          strokeMiterlimit: 10
        }
      ),
        /* @__PURE__ */ jsx(
        "rect",
        {
          x: 28.76,
          y: 41.32,
          width: 36.21,
          height: 4.67,
          rx: 0.64,
          ry: 0.64,
          opacity: 0.3,
          strokeLinecap: "round",
          strokeMiterlimit: 10
        }
      )
      ]
    }
  );
}
function IconSidebarFloating(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      "data-name": "icon-sidebar-floating",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 79.86 51.14",
      ...props,
      children: [
        /* @__PURE__ */ jsx(
        "rect",
        {
          x: 5.89,
          y: 5.15,
          width: 19.74,
          height: 40,
          rx: 2,
          ry: 2,
          opacity: 0.8,
          strokeLinecap: "round",
          strokeMiterlimit: 10
        }
      ),
        /* @__PURE__ */ jsxs("g", {
        stroke: "#fff", strokeLinecap: "round", strokeMiterlimit: 10, children: [
          /* @__PURE__ */ jsx(
          "path",
          {
            fill: "none",
            opacity: 0.72,
            strokeWidth: "2px",
            d: "M9.81 18.36L22.04 18.36"
          }
        ),
          /* @__PURE__ */ jsx(
          "path",
          {
            fill: "none",
            opacity: 0.48,
            strokeWidth: "2px",
            d: "M9.81 25.57L20.33 25.57"
          }
        ),
          /* @__PURE__ */ jsx(
          "path",
          {
            fill: "none",
            opacity: 0.55,
            strokeWidth: "2px",
            d: "M9.81 21.85L19.18 21.85"
          }
        ),
          /* @__PURE__ */ jsx("circle", { cx: 11.76, cy: 10.88, r: 2.54, fill: "#fff", opacity: 0.8 }),
          /* @__PURE__ */ jsx(
          "path",
          {
            fill: "none",
            opacity: 0.8,
            strokeWidth: "2px",
            d: "M16.31 9.62L22.04 9.62"
          }
        ),
          /* @__PURE__ */ jsx("path", { fill: "none", opacity: 0.6, d: "M16.1 12.27L21.16 12.27" })
        ]
      }),
        /* @__PURE__ */ jsx(
        "path",
        {
          fill: "none",
          opacity: 0.62,
          strokeLinecap: "round",
          strokeMiterlimit: 10,
          strokeWidth: "3px",
          d: "M30.59 9.62L35.85 9.62"
        }
      ),
        /* @__PURE__ */ jsx(
        "rect",
        {
          x: 29.94,
          y: 13.42,
          width: 26.03,
          height: 2.73,
          rx: 0.64,
          ry: 0.64,
          opacity: 0.44,
          strokeLinecap: "round",
          strokeMiterlimit: 10
        }
      ),
        /* @__PURE__ */ jsx(
        "rect",
        {
          x: 29.94,
          y: 19.28,
          width: 43.11,
          height: 25.87,
          rx: 2,
          ry: 2,
          opacity: 0.3,
          strokeLinecap: "round",
          strokeMiterlimit: 10
        }
      )
      ]
    }
  );
}
function IconSidebarInset(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      "data-name": "icon-sidebar-inset",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 79.86 51.14",
      ...props,
      children: [
        /* @__PURE__ */ jsx(
        "rect",
        {
          x: 23.39,
          y: 5.57,
          width: 50.22,
          height: 40,
          rx: 2,
          ry: 2,
          opacity: 0.2,
          strokeLinecap: "round",
          strokeMiterlimit: 10
        }
      ),
        /* @__PURE__ */ jsx(
        "path",
        {
          fill: "none",
          opacity: 0.72,
          strokeLinecap: "round",
          strokeMiterlimit: 10,
          strokeWidth: "2px",
          d: "M5.08 17.05L17.31 17.05"
        }
      ),
        /* @__PURE__ */ jsx(
        "path",
        {
          fill: "none",
          opacity: 0.48,
          strokeLinecap: "round",
          strokeMiterlimit: 10,
          strokeWidth: "2px",
          d: "M5.08 24.25L15.6 24.25"
        }
      ),
        /* @__PURE__ */ jsx(
        "path",
        {
          fill: "none",
          opacity: 0.55,
          strokeLinecap: "round",
          strokeMiterlimit: 10,
          strokeWidth: "2px",
          d: "M5.08 20.54L14.46 20.54"
        }
      ),
        /* @__PURE__ */ jsxs("g", {
        strokeLinecap: "round", strokeMiterlimit: 10, children: [
          /* @__PURE__ */ jsx("circle", { cx: 7.04, cy: 9.57, r: 2.54, opacity: 0.8 }),
          /* @__PURE__ */ jsx(
          "path",
          {
            fill: "none",
            opacity: 0.8,
            strokeWidth: "2px",
            d: "M11.59 8.3L17.31 8.3"
          }
        ),
          /* @__PURE__ */ jsx("path", { fill: "none", opacity: 0.6, d: "M11.38 10.95L16.44 10.95" })
        ]
      })
      ]
    }
  );
}
function IconSidebarSidebar(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      "data-name": "icon-sidebar-sidebar",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 79.86 51.14",
      ...props,
      children: [
        /* @__PURE__ */ jsx(
        "path",
        {
          d: "M23.42.51h51.99c2.21 0 4 1.79 4 4v42.18c0 2.21-1.79 4-4 4H23.42s-.04-.02-.04-.04V.55s.02-.04.04-.04z",
          opacity: 0.2,
          strokeLinecap: "round",
          strokeMiterlimit: 10
        }
      ),
        /* @__PURE__ */ jsx(
        "path",
        {
          fill: "none",
          opacity: 0.72,
          strokeLinecap: "round",
          strokeMiterlimit: 10,
          strokeWidth: "2px",
          d: "M5.56 14.88L17.78 14.88"
        }
      ),
        /* @__PURE__ */ jsx(
        "path",
        {
          fill: "none",
          opacity: 0.48,
          strokeLinecap: "round",
          strokeMiterlimit: 10,
          strokeWidth: "2px",
          d: "M5.56 22.09L16.08 22.09"
        }
      ),
        /* @__PURE__ */ jsx(
        "path",
        {
          fill: "none",
          opacity: 0.55,
          strokeLinecap: "round",
          strokeMiterlimit: 10,
          strokeWidth: "2px",
          d: "M5.56 18.38L14.93 18.38"
        }
      ),
        /* @__PURE__ */ jsxs("g", {
        strokeLinecap: "round", strokeMiterlimit: 10, children: [
          /* @__PURE__ */ jsx("circle", { cx: 7.51, cy: 7.4, r: 2.54, opacity: 0.8 }),
          /* @__PURE__ */ jsx(
          "path",
          {
            fill: "none",
            opacity: 0.8,
            strokeWidth: "2px",
            d: "M12.06 6.14L17.78 6.14"
          }
        ),
          /* @__PURE__ */ jsx("path", { fill: "none", opacity: 0.6, d: "M11.85 8.79L16.91 8.79" })
        ]
      })
      ]
    }
  );
}
function IconThemeDark(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      "data-name": "icon-theme-dark",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 79.86 51.14",
      ...props,
      children: [
        /* @__PURE__ */ jsxs("g", {
        fill: "#1d2b3f", children: [
          /* @__PURE__ */ jsx("rect", { x: 0.53, y: 0.5, width: 78.83, height: 50.14, rx: 3.5, ry: 3.5 }),
          /* @__PURE__ */ jsx("path", { d: "M75.86 1c1.65 0 3 1.35 3 3v43.14c0 1.65-1.35 3-3 3H4.03c-1.65 0-3-1.35-3-3V4c0-1.65 1.35-3 3-3h71.83m0-1H4.03c-2.21 0-4 1.79-4 4v43.14c0 2.21 1.79 4 4 4h71.83c2.21 0 4-1.79 4-4V4c0-2.21-1.79-4-4-4z" })
        ]
      }),
        /* @__PURE__ */ jsx(
        "path",
        {
          d: "M22.88 0h52.97c2.21 0 4 1.79 4 4v43.14c0 2.21-1.79 4-4 4H22.88V0z",
          fill: "#0d1628"
        }
      ),
        /* @__PURE__ */ jsx("circle", { cx: 6.7, cy: 7.04, r: 3.54, fill: "#426187" }),
        /* @__PURE__ */ jsx(
        "path",
        {
          d: "M18.12 6.39h-5.87c-.6 0-1.09-.45-1.09-1s.49-1 1.09-1h5.87c.6 0 1.09.45 1.09 1s-.49 1-1.09 1zM16.55 9.77h-4.24c-.55 0-1-.45-1-1s.45-1 1-1h4.24c.55 0 1 .45 1 1s-.45 1-1 1zM18.32 17.37H4.59c-.69 0-1.25-.47-1.25-1.05s.56-1.05 1.25-1.05h13.73c.69 0 1.25.47 1.25 1.05s-.56 1.05-1.25 1.05zM15.34 21.26h-11c-.55 0-1-.41-1-.91s.45-.91 1-.91h11c.55 0 1 .41 1 .91s-.45.91-1 .91zM16.46 25.57H4.43c-.6 0-1.09-.44-1.09-.98s.49-.98 1.09-.98h12.03c.6 0 1.09.44 1.09.98s-.49.98-1.09.98z",
          fill: "#426187"
        }
      ),
        /* @__PURE__ */ jsxs("g", {
        fill: "#2a62bc", children: [
          /* @__PURE__ */ jsx(
          "rect",
          {
            x: 33.36,
            y: 19.73,
            width: 2.75,
            height: 3.42,
            rx: 0.33,
            ry: 0.33,
            opacity: 0.32
          }
        ),
          /* @__PURE__ */ jsx(
          "rect",
          {
            x: 29.64,
            y: 16.57,
            width: 2.75,
            height: 6.58,
            rx: 0.33,
            ry: 0.33,
            opacity: 0.44
          }
        ),
          /* @__PURE__ */ jsx(
          "rect",
          {
            x: 37.16,
            y: 14.44,
            width: 2.75,
            height: 8.7,
            rx: 0.33,
            ry: 0.33,
            opacity: 0.53
          }
        ),
          /* @__PURE__ */ jsx(
          "rect",
          {
            x: 41.19,
            y: 10.75,
            width: 2.75,
            height: 12.4,
            rx: 0.33,
            ry: 0.33,
            opacity: 0.53
          }
        )
        ]
      }),
        /* @__PURE__ */ jsx("circle", { cx: 62.74, cy: 16.32, r: 8, fill: "#2f5491", opacity: 0.5 }),
        /* @__PURE__ */ jsx(
        "path",
        {
          d: "M62.74 16.32l4.1-6.87c1.19.71 2.18 1.72 2.86 2.92s1.04 2.57 1.04 3.95h-8z",
          fill: "#2f5491",
          opacity: 0.74
        }
      ),
        /* @__PURE__ */ jsx(
        "rect",
        {
          x: 29.64,
          y: 27.75,
          width: 41.62,
          height: 18.62,
          rx: 1.69,
          ry: 1.69,
          fill: "#17273f"
        }
      )
      ]
    }
  );
}
function IconThemeLight(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      "data-name": "icon-theme-light",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 79.86 51.14",
      ...props,
      children: [
        /* @__PURE__ */ jsxs("g", {
        fill: "#d9d9d9", children: [
          /* @__PURE__ */ jsx("rect", { x: 0.53, y: 0.5, width: 78.83, height: 50.14, rx: 3.5, ry: 3.5 }),
          /* @__PURE__ */ jsx("path", { d: "M75.86 1c1.65 0 3 1.35 3 3v43.14c0 1.65-1.35 3-3 3H4.03c-1.65 0-3-1.35-3-3V4c0-1.65 1.35-3 3-3h71.83m0-1H4.03c-2.21 0-4 1.79-4 4v43.14c0 2.21 1.79 4 4 4h71.83c2.21 0 4-1.79 4-4V4c0-2.21-1.79-4-4-4z" })
        ]
      }),
        /* @__PURE__ */ jsx(
        "path",
        {
          d: "M22.88 0h52.97c2.21 0 4 1.79 4 4v43.14c0 2.21-1.79 4-4 4H22.88V0z",
          fill: "#ecedef"
        }
      ),
        /* @__PURE__ */ jsx("circle", { cx: 6.7, cy: 7.04, r: 3.54, fill: "#fff" }),
        /* @__PURE__ */ jsx(
        "path",
        {
          d: "M18.12 6.39h-5.87c-.6 0-1.09-.45-1.09-1s.49-1 1.09-1h5.87c.6 0 1.09.45 1.09 1s-.49 1-1.09 1zM16.55 9.77h-4.24c-.55 0-1-.45-1-1s.45-1 1-1h4.24c.55 0 1 .45 1 1s-.45 1-1 1zM18.32 17.37H4.59c-.69 0-1.25-.47-1.25-1.05s.56-1.05 1.25-1.05h13.73c.69 0 1.25.47 1.25 1.05s-.56 1.05-1.25 1.05zM15.34 21.26h-11c-.55 0-1-.41-1-.91s.45-.91 1-.91h11c.55 0 1 .41 1 .91s-.45.91-1 .91zM16.46 25.57H4.43c-.6 0-1.09-.44-1.09-.98s.49-.98 1.09-.98h12.03c.6 0 1.09.44 1.09.98s-.49.98-1.09.98z",
          fill: "#fff"
        }
      ),
        /* @__PURE__ */ jsxs("g", {
        fill: "#c0c4c4", children: [
          /* @__PURE__ */ jsx(
          "rect",
          {
            x: 33.36,
            y: 19.73,
            width: 2.75,
            height: 3.42,
            rx: 0.33,
            ry: 0.33,
            opacity: 0.32
          }
        ),
          /* @__PURE__ */ jsx(
          "rect",
          {
            x: 29.64,
            y: 16.57,
            width: 2.75,
            height: 6.58,
            rx: 0.33,
            ry: 0.33,
            opacity: 0.44
          }
        ),
          /* @__PURE__ */ jsx(
          "rect",
          {
            x: 37.16,
            y: 14.44,
            width: 2.75,
            height: 8.7,
            rx: 0.33,
            ry: 0.33,
            opacity: 0.53
          }
        ),
          /* @__PURE__ */ jsx(
          "rect",
          {
            x: 41.19,
            y: 10.75,
            width: 2.75,
            height: 12.4,
            rx: 0.33,
            ry: 0.33,
            opacity: 0.53
          }
        )
        ]
      }),
        /* @__PURE__ */ jsx("circle", { cx: 62.74, cy: 16.32, r: 8, fill: "#fff" }),
        /* @__PURE__ */ jsxs("g", {
        fill: "#d9d9d9", children: [
          /* @__PURE__ */ jsx("path", { d: "M63.62 15.82L67 10.15c.93.64 1.7 1.48 2.26 2.47.56.98.89 2.08.96 3.21h-6.6z" }),
          /* @__PURE__ */ jsx("path", { d: "M67.14 10.88a6.977 6.977 0 012.52 4.44h-5.17l2.65-4.44m-.31-1.43l-4.1 6.87h8c0-1.39-.36-2.75-1.04-3.95s-1.67-2.21-2.86-2.92z" })
        ]
      }),
        /* @__PURE__ */ jsx(
        "rect",
        {
          x: 29.64,
          y: 27.75,
          width: 41.62,
          height: 18.62,
          rx: 1.69,
          ry: 1.69,
          fill: "#fff"
        }
      )
      ]
    }
  );
}
function IconThemeSystem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      "data-name": "icon-theme-system",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 79.86 51.14",
      className: cn(
        "overflow-hidden rounded-[6px]",
        "stroke-primary fill-primary group-data-[state=unchecked]:stroke-muted-foreground group-data-[state=unchecked]:fill-muted-foreground",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("path", { opacity: 0.2, d: "M0 0.03H22.88V51.17H0z" }),
        /* @__PURE__ */ jsx(
        "circle",
        {
          cx: 6.7,
          cy: 7.04,
          r: 3.54,
          fill: "#fff",
          opacity: 0.8,
          stroke: "#fff",
          strokeLinecap: "round",
          strokeMiterlimit: 10
        }
      ),
        /* @__PURE__ */ jsx(
        "path",
        {
          d: "M18.12 6.39h-5.87c-.6 0-1.09-.45-1.09-1s.49-1 1.09-1h5.87c.6 0 1.09.45 1.09 1s-.49 1-1.09 1zM16.55 9.77h-4.24c-.55 0-1-.45-1-1s.45-1 1-1h4.24c.55 0 1 .45 1 1s-.45 1-1 1z",
          fill: "#fff",
          stroke: "none",
          opacity: 0.75
        }
      ),
        /* @__PURE__ */ jsx(
        "path",
        {
          d: "M18.32 17.37H4.59c-.69 0-1.25-.47-1.25-1.05s.56-1.05 1.25-1.05h13.73c.69 0 1.25.47 1.25 1.05s-.56 1.05-1.25 1.05z",
          fill: "#fff",
          stroke: "none",
          opacity: 0.72
        }
      ),
        /* @__PURE__ */ jsx(
        "path",
        {
          d: "M15.34 21.26h-11c-.55 0-1-.41-1-.91s.45-.91 1-.91h11c.55 0 1 .41 1 .91s-.45.91-1 .91z",
          fill: "#fff",
          stroke: "none",
          opacity: 0.55
        }
      ),
        /* @__PURE__ */ jsx(
        "path",
        {
          d: "M16.46 25.57H4.43c-.6 0-1.09-.44-1.09-.98s.49-.98 1.09-.98h12.03c.6 0 1.09.44 1.09.98s-.49.98-1.09.98z",
          fill: "#fff",
          stroke: "none",
          opacity: 0.67
        }
      ),
        /* @__PURE__ */ jsx(
        "rect",
        {
          x: 33.36,
          y: 19.73,
          width: 2.75,
          height: 3.42,
          rx: 0.33,
          ry: 0.33,
          opacity: 0.31,
          stroke: "none"
        }
      ),
        /* @__PURE__ */ jsx(
        "rect",
        {
          x: 29.64,
          y: 16.57,
          width: 2.75,
          height: 6.58,
          rx: 0.33,
          ry: 0.33,
          opacity: 0.4,
          stroke: "none"
        }
      ),
        /* @__PURE__ */ jsx(
        "rect",
        {
          x: 37.16,
          y: 14.44,
          width: 2.75,
          height: 8.7,
          rx: 0.33,
          ry: 0.33,
          opacity: 0.26,
          stroke: "none"
        }
      ),
        /* @__PURE__ */ jsx(
        "rect",
        {
          x: 41.19,
          y: 10.75,
          width: 2.75,
          height: 12.4,
          rx: 0.33,
          ry: 0.33,
          opacity: 0.37,
          stroke: "none"
        }
      ),
        /* @__PURE__ */ jsxs("g", {
        children: [
          /* @__PURE__ */ jsx("circle", { cx: 62.74, cy: 16.32, r: 8, opacity: 0.25 }),
          /* @__PURE__ */ jsx(
          "path",
          {
            d: "M62.74 16.32l4.1-6.87c1.19.71 2.18 1.72 2.86 2.92s1.04 2.57 1.04 3.95h-8z",
            opacity: 0.45
          }
        )
        ]
      }),
        /* @__PURE__ */ jsx(
        "rect",
        {
          x: 29.64,
          y: 27.75,
          width: 41.62,
          height: 18.62,
          rx: 1.69,
          ry: 1.69,
          opacity: 0.3,
          stroke: "none",
          strokeLinecap: "round",
          strokeMiterlimit: 10
        }
      )
      ]
    }
  );
}
function ConfigDrawer({ themeConfig: themeSetting }) {
  const { loading: isSubmitting, submit } = useForm();
  const { loading: isReseting, submit: submitFn } = useForm();
  const { setOpen: setOpen2 } = useSidebar();
  const handleReset = async () => {
    setOpen2(true);
    const postData = {
      site_settings: {
        "theme_mode": "system",
        "direction": "ltr",
        "sidebar": "inset"
      }
    };
    onSettingsUpdate(postData, submitFn);
  };
  return /* @__PURE__ */ jsxs(Sheet, {
    children: [
    /* @__PURE__ */ jsx(SheetTrigger, {
      asChild: true, children: /* @__PURE__ */ jsx(
        Button,
        {
          size: "icon",
          variant: "ghost",
          "aria-label": "Open theme settings",
          className: "rounded-full",
          children: /* @__PURE__ */ jsx(Settings, { "aria-hidden": "true" })
        }
      )
    }),
    /* @__PURE__ */ jsxs(SheetContent, {
      className: "flex flex-col", children: [
      /* @__PURE__ */ jsxs(SheetHeader, {
        className: "pb-0 text-start", children: [
        /* @__PURE__ */ jsx(SheetTitle, { children: "Theme Settings" }),
        /* @__PURE__ */ jsx(SheetDescription, { children: "Adjust the appearance and layout to suit your preferences." })
        ]
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "px-4 space-y-6 overflow-y-auto", children: [
        /* @__PURE__ */ jsx(ThemeConfig, { themeSetting, submit }),
        /* @__PURE__ */ jsx(SidebarConfig, { themeSetting, submit }),
        /* @__PURE__ */ jsx(DirConfig, { themeSetting, submit })
        ]
      }),
      /* @__PURE__ */ jsx(SheetFooter, {
        className: "gap-2", children: /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "destructive",
            onClick: handleReset,
            disabled: isSubmitting || isReseting,
            "aria-label": "Reset all settings to default values",
            children: [
              isReseting && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }),
              "Reset"
            ]
          }
        )
      })
      ]
    })
    ]
  });
}
function SectionTitle({
  title,
  showReset = false,
  onReset,
  className
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "text-muted-foreground mb-2 flex items-center gap-2 text-sm font-semibold",
        className
      ),
      children: [
        title,
        showReset && onReset && /* @__PURE__ */ jsx(
          Button,
          {
            size: "icon",
            variant: "secondary",
            className: "rounded-full size-4",
            onClick: onReset,
            children: /* @__PURE__ */ jsx(RotateCcw, { className: "size-3" })
          }
        )
      ]
    }
  );
}
function RadioGroupItem({
  item,
  isTheme = false
}) {
  return /* @__PURE__ */ jsxs(
    Item,
    {
      value: item.value,
      className: cn("group outline-none", "transition duration-200 ease-in"),
      "aria-label": `Select ${item.label.toLowerCase()}`,
      "aria-describedby": `${item.value}-description`,
      children: [
        /* @__PURE__ */ jsxs(
        "div",
        {
          className: cn(
            "ring-border relative rounded-[6px] ring-[1px]",
            "group-data-[state=checked]:ring-primary group-data-[state=checked]:shadow-2xl",
            "group-focus-visible:ring-2"
          ),
          role: "img",
          "aria-hidden": "false",
          "aria-label": `${item.label} option preview`,
          children: [
              /* @__PURE__ */ jsx(
            CircleCheck,
            {
              className: cn(
                "fill-primary size-6 stroke-white",
                "group-data-[state=unchecked]:hidden",
                "absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
              ),
              "aria-hidden": "true"
            }
          ),
              /* @__PURE__ */ jsx(
            item.icon,
            {
              className: cn(
                !isTheme && "stroke-primary fill-primary group-data-[state=unchecked]:stroke-muted-foreground group-data-[state=unchecked]:fill-muted-foreground"
              ),
              "aria-hidden": "true"
            }
          )
          ]
        }
      ),
        /* @__PURE__ */ jsx(
        "div",
        {
          className: "mt-1 text-xs",
          id: `${item.value}-description`,
          "aria-live": "polite",
          children: item.label
        }
      )
      ]
    }
  );
}
function ThemeConfig({ themeSetting, submit }) {
  const { defaultTheme, theme, setTheme } = useTheme();
  return /* @__PURE__ */ jsxs("div", {
    children: [
    /* @__PURE__ */ jsx(
      SectionTitle,
      {
        title: "Theme",
        showReset: theme !== defaultTheme,
        onReset: () => onSettingsChange("theme_mode", defaultTheme, submit)
      }
    ),
    /* @__PURE__ */ jsx(
      Root,
      {
        value: theme,
        onValueChange: (theme2) => onSettingsChange("theme_mode", theme2, submit),
        className: "grid w-full max-w-md grid-cols-3 gap-4",
        "aria-label": "Select theme preference",
        "aria-describedby": "theme-description",
        children: [
          {
            value: "system",
            label: "System",
            icon: IconThemeSystem
          },
          {
            value: "light",
            label: "Light",
            icon: IconThemeLight
          },
          {
            value: "dark",
            label: "Dark",
            icon: IconThemeDark
          }
        ].map((item) => /* @__PURE__ */ jsx(RadioGroupItem, { item, isTheme: true }, item.value))
      }
    ),
    /* @__PURE__ */ jsx("div", { id: "theme-description", className: "sr-only", children: "Choose between system preference, light mode, or dark mode" })
    ]
  });
}
function SidebarConfig({ themeSetting, submit }) {
  const { defaultVariant, variant, setVariant } = useLayout();
  return /* @__PURE__ */ jsxs("div", {
    className: "max-md:hidden", children: [
    /* @__PURE__ */ jsx(
      SectionTitle,
      {
        title: "Sidebar",
        showReset: defaultVariant !== variant,
        onReset: () => {
          setVariant(defaultVariant);
          onSettingsChange("sidebar", defaultVariant, submit);
        }
      }
    ),
    /* @__PURE__ */ jsx(
      Root,
      {
        value: variant,
        onValueChange: (variant2) => onSettingsChange("sidebar", variant2, submit),
        className: "grid w-full max-w-md grid-cols-3 gap-4",
        "aria-label": "Select sidebar style",
        "aria-describedby": "sidebar-description",
        children: [
          {
            value: "inset",
            label: "Inset",
            icon: IconSidebarInset
          },
          {
            value: "floating",
            label: "Floating",
            icon: IconSidebarFloating
          },
          {
            value: "sidebar",
            label: "Sidebar",
            icon: IconSidebarSidebar
          }
        ].map((item) => /* @__PURE__ */ jsx(RadioGroupItem, { item }, item.value))
      }
    ),
    /* @__PURE__ */ jsx("div", { id: "sidebar-description", className: "sr-only", children: "Choose between inset, floating, or standard sidebar layout" })
    ]
  });
}
function DirConfig({ themeSetting, submit }) {
  const { defaultDir, dir, setDir } = useDirection();
  return /* @__PURE__ */ jsxs("div", {
    children: [
    /* @__PURE__ */ jsx(
      SectionTitle,
      {
        title: "Direction",
        showReset: defaultDir !== dir,
        onReset: () => onSettingsChange("direction", defaultDir, submit)
      }
    ),
    /* @__PURE__ */ jsx(
      Root,
      {
        value: dir,
        onValueChange: (dir2) => onSettingsChange("direction", dir2, submit),
        className: "grid w-full max-w-md grid-cols-3 gap-4",
        "aria-label": "Select site direction",
        "aria-describedby": "direction-description",
        children: [
          {
            value: "ltr",
            label: "Left to Right",
            icon: (props) => /* @__PURE__ */ jsx(IconDir, { dir: "ltr", ...props })
          },
          {
            value: "rtl",
            label: "Right to Left",
            icon: (props) => /* @__PURE__ */ jsx(IconDir, { dir: "rtl", ...props })
          }
        ].map((item) => /* @__PURE__ */ jsx(RadioGroupItem, { item }, item.value))
      }
    ),
    /* @__PURE__ */ jsx("div", { id: "direction-description", className: "sr-only", children: "Choose between left-to-right or right-to-left site direction" })
    ]
  });
}
function ProfileDropdown({ user }) {
  const [open, setOpen] = useDialogState();
  const { t } = useTranslations();
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
    /* @__PURE__ */ jsxs(DropdownMenu, {
      modal: false, children: [
      /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", className: "relative w-8 h-8 rounded-full", children: /* @__PURE__ */ jsx(Avatar, { className: "w-8 h-8", children: /* @__PURE__ */ jsx(AvatarImage, { src: user?.img_url, alt: "profie image" }) }) }) }),
      /* @__PURE__ */ jsxs(DropdownMenuContent, {
        className: "w-56", align: "end", forceMount: true, children: [
        /* @__PURE__ */ jsx(DropdownMenuLabel, {
          className: "font-normal", children: /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium leading-none", children: user?.name }),
          /* @__PURE__ */ jsx("p", { className: "text-xs leading-none text-muted-foreground", children: user?.email })
            ]
          })
        }),
        /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
        /* @__PURE__ */ jsxs(DropdownMenuGroup, {
          children: [
          /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("admin.profile.index"), children: t("profile") }) }),
          /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsx(Link, { href: route("admin.settings.index"), children: t("settings") }) })
          ]
        }),
        /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
        /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => setOpen(true), children: "Sign out" })
        ]
      })
      ]
    }),
    /* @__PURE__ */ jsx(SignOutDialog, { open: !!open, onOpenChange: setOpen })
    ]
  });
}
const setLanguageFilterData = (languages, searchTerm, activeFilters, setFilteredLanguages) => {
  let filtered = languages?.data || [];
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filtered = filtered.filter((language) => {
      return language.name.toLowerCase().includes(searchLower) || language.code.toLowerCase().includes(searchLower) || language.direction.toLowerCase().includes(searchLower);
    });
  }
  if (activeFilters.status) {
    filtered = filtered.filter((language) => language.status === activeFilters.status);
  }
  if (activeFilters.direction) {
    filtered = filtered.filter((language) => language.direction === activeFilters.direction);
  }
  if (activeFilters.isDefault !== void 0) {
    filtered = filtered.filter((language) => language.is_default === activeFilters.isDefault);
  }
  setFilteredLanguages(filtered);
};
const handleSetDefaultLanguage = async (language, submit) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.languages.make.default"),
      data: { id: language.id },
      preserveScroll: true
    });
  } catch (error) {
  }
};
const handleLanguageStautsUpdate = async (language, newStatus, submit) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.languages.update.status"),
      data: { id: language.id, value: newStatus },
      preserveScroll: true
    });
  } catch (error) {
  }
};
const handleTransaltionSave = async (submit, data, languageCode) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.languages.translate"),
      data: { code: languageCode, key_values: data }
    });
  } catch (error) {
  }
};
const handleSaveLanguage = async (data, submit, handleClose) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.languages.store"),
      data
    });
    handleClose();
  } catch (error) {
  }
};
const handleDeleteLanguage = async (languageId, submit, handleClose) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.languages.destroy", languageId) + "?_method=DELETE",
      preserveScroll: true
    });
    handleClose();
  } catch (error) {
  }
};
const getDeleteDialogConfig = (languages, selectedLanguage) => {
  return {
    title: "Delete Language",
    description: "Are you sure you want to delete this language? This action cannot be undone and will affect localization.",
    itemName: selectedLanguage?.name || "Language",
    itemType: "Language",
    warningMessage: "Deleting this language will permanently remove all its configuration data and may disrupt localization services.",
    showWarningAlert: true,
    showItemDetails: true,
    itemDisplayFields: [
      {
        label: "Language Name",
        key: "name",
        className: "font-semibold text-gray-900 dark:text-gray-100"
      },
      {
        label: "Language Code",
        key: "code",
        render: (code) => React__default.createElement(
          "code",
          {
            className: "px-2 py-1 text-xs bg-gray-100 rounded dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          },
          code
        )
      },
      {
        label: "Direction",
        key: "direction",
        render: (direction) => React__default.createElement(
          "span",
          {
            className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${direction === "rtl" ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"}`
          },
          direction.toUpperCase()
        )
      },
      {
        label: "Status",
        key: "status",
        render: (status) => React__default.createElement(
          "span",
          {
            className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}`
          },
          status
        )
      },
      {
        label: "Default Language",
        key: "is_default",
        render: (isDefault) => React__default.createElement(
          "span",
          {
            className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isDefault ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"}`
          },
          isDefault ? "Yes" : "No"
        )
      },
      {
        label: "Created",
        key: "created_at",
        className: "text-gray-600 dark:text-gray-400"
      }
    ],
    specialWarnings: [
      {
        condition: (language) => language?.is_default === true,
        title: "Default Language Warning",
        message: "This is your default language. Deleting it may cause the system to malfunction. Please set another language as default before deleting this one.",
        alertClass: "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800",
        iconClass: "text-red-600 dark:text-red-400",
        textClass: "text-red-800 dark:text-red-200"
      },
      {
        condition: (language) => language?.status === "active",
        title: "Active Language",
        message: "This language is currently active and may be in use by the system. Consider disabling it first before deletion.",
        alertClass: "border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800",
        iconClass: "text-orange-600 dark:text-orange-400",
        textClass: "text-orange-800 dark:text-orange-200"
      },
      {
        condition: (language) => {
          const totalLanguages = languages?.data?.length || 0;
          return totalLanguages === 1;
        },
        title: "Last Language Warning",
        message: "This is your only configured language. Deleting it will completely disable localization functionality.",
        alertClass: "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800",
        iconClass: "text-red-600 dark:text-red-400",
        textClass: "text-red-800 dark:text-red-200"
      }
    ]
  };
};
const handleLanguageChange = async (submit, language, setLanguage) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.languages.switch.language"),
      data: {
        id: language.id
      }
    });
    setLanguage(language?.code);
  } catch (error) {
  }
};
function LanguageSwitch({ languageSettings }) {
  let { available_languages: languages, current_language: dbLanguage } = languageSettings || {};
  languages = languages?.data || [];
  const [language, setLanguage] = useState(dbLanguage);
  const { submit } = useForm();
  useEffect(() => {
    if (dbLanguage) {
      setLanguage(dbLanguage);
    }
  }, [dbLanguage]);
  return /* @__PURE__ */ jsxs(DropdownMenu, {
    modal: false, children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "px-3 scale-95 rounded-full", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold uppercase", children: language || "EN" }) }) }),
    /* @__PURE__ */ jsx(DropdownMenuContent, {
      align: "end", children: languages.map((lang) => /* @__PURE__ */ jsxs(
        DropdownMenuItem,
        {
          onClick: () => handleLanguageChange(submit, lang, setLanguage),
          children: [
            lang?.code?.toUpperCase(),
          /* @__PURE__ */ jsx(
              Check,
              {
                size: 14,
                className: cn("ms-auto", language !== lang?.code && "hidden")
              }
            )
          ]
        },
        lang?.code
      ))
    })
    ]
  });
}
function AuthenticatedLayout({ children }) {
  const defaultOpen = true;
  const { props } = usePage();
  const user = props.auth?.user;
  const themeConfig = props?.site_theme_settings;
  const languageSettings = props?.language_settings;
  const reportCounters = props?.admin_pending_report_counter;
  return /* @__PURE__ */ jsx(SearchProvider, {
    children: /* @__PURE__ */ jsx(SidebarProvider, {
      defaultOpen, children: /* @__PURE__ */ jsxs(LayoutProvider, {
        themeConfig, children: [
    /* @__PURE__ */ jsx(SkipToMain, {}),
    /* @__PURE__ */ jsxs(AppSidebar, {
          children: [
      /* @__PURE__ */ jsx(SidebarHeader, { children: /* @__PURE__ */ jsx(TeamSwitcher, { siteConfig: themeConfig, siteLogo: props?.logos?.site_logo }) }),
      /* @__PURE__ */ jsx(SidebarContent, { children: sidebarData.navGroups.map((props2) => /* @__PURE__ */ jsx(NavGroup, { reportCounters, ...props2 }, props2.title)) }),
      /* @__PURE__ */ jsx(SidebarFooter, { children: /* @__PURE__ */ jsx(NavUser, { user }) }),
      /* @__PURE__ */ jsx(SidebarRail, {})
          ]
        }),
    /* @__PURE__ */ jsxs(
          SidebarInset,
          {
            className: cn(
              "has-[[data-layout=fixed]]:h-svh",
              "peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]",
              "@container/content"
            ),
            children: [
          /* @__PURE__ */ jsxs(Header, {
              children: [
            /* @__PURE__ */ jsx(TopNav, { links: topNav }),
            /* @__PURE__ */ jsxs("div", {
                className: "flex items-center space-x-4 ms-auto", children: [
              /* @__PURE__ */ jsx(Search, {}),
              /* @__PURE__ */ jsx(LanguageSwitch, { languageSettings }),
              /* @__PURE__ */ jsx(ThemeSwitch, { dbTheme: themeConfig?.theme_mode }),
              /* @__PURE__ */ jsx(ConfigDrawer, { themeConfig }),
              /* @__PURE__ */ jsx(ProfileDropdown, { user })
                ]
              })
              ]
            }),
              children
            ]
          }
        )
        ]
      })
    })
  });
}
function Main({ fixed, className, fluid, ...props }) {
  return /* @__PURE__ */ jsx(
    "main",
    {
      "data-layout": fixed ? "fixed" : "auto",
      className: cn(
        "@container/main px-4 py-6",
        fixed && "flex grow flex-col overflow-hidden",
        !fluid && "@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl",
        className
      ),
      ...props
    }
  );
}
export {
  AuthenticatedLayout as A, handleCreateBackup as a, BaseLayout as B, confirmDeleteBackup as b,
  clearAutomationCache as c,
  confirmDeleteAllBackups as d,
  handleClearCache as e,
  handleClearAllCache as f,
  getDeleteBackupDialogContent as g,
  handleRunCommand as h,
  handleSaveLanguage as i,
  handleLanguageStautsUpdate as j,
  handleSetDefaultLanguage as k,
  getDeleteDialogConfig as l, Main as M, handleDeleteLanguage as m,
  handleTransaltionSave as n,
  onSettingsUpdate as o,
  onLogoUpdate as p,
  setLanguageFilterData as s,
  toggleDebugMode as t
};


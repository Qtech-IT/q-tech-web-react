import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link, usePage } from "@inertiajs/react";
import { L as useTranslations, O as DynamicIcon, D as DropdownMenu, e as DropdownMenuTrigger, f as DropdownMenuContent, g as DropdownMenuLabel, h as DropdownMenuSeparator, S as ScrollArea, F as DropdownMenuGroup, i as DropdownMenuItem, A as Avatar, t as AvatarFallback, x as Sheet, I as SheetTrigger, y as SheetContent, B as SheetTitle, N as FancyButton, H as useTheme, U as setFrontendTheme, s as AvatarImage, C as Command, a as CommandInput, b as CommandList, w as CommandEmpty, c as CommandGroup, d as CommandItem, V as handleLanguageChange, R as MenuScroller, G as Separator, T as ThemeProvider, u as DirectionProvider } from "./Sheet-B-_2BaZp.js";
import { k as keyToValue, B as Button, f as isRTL, a as cn, v as valueToKey } from "./Button-CFMlPXiE.js";
import { u as useForm, T as ToastProvider, H as HotToaster } from "./HotToast-DfpkTxSC.js";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import { MessageSquare, UserPlus, FileText, AlertCircle, Bell, CheckCheck, Trash2, Menu, X, Sun, Moon, Check, User, Wallet, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./Popover-Ckus2dfK.js";
import { TfiWorld } from "react-icons/tfi";
const Footer = ({ props }) => {
  let {
    shared_section_data: sharedSectionData,
    logos,
    pages,
    site_theme_settings: siteSettings,
    feature_market_categories: marketCategories
  } = props;
  pages = pages?.data || [];
  marketCategories = marketCategories?.data || [];
  const { t } = useTranslations();
  let footerData = sharedSectionData?.data?.find((data) => data.key == "footer");
  let contactUs = sharedSectionData?.data?.find((data) => data.key == "contact_us");
  const socialLinks = contactUs ? contactUs?.value?.social_links : [];
  return /* @__PURE__ */ jsxs("footer", { className: "relative pt-20 pb-12 overflow-hidden bg-primary/5", children: [
    /* @__PURE__ */ jsxs("div", { className: "container relative z-20 px-4 mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6 lg:col-span-1 text-start", children: [
          /* @__PURE__ */ jsxs(Link, { href: route("home"), className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-8 h-8 rounded-lg shadow-lg bg-primary", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-primary-foreground", children: siteSettings?.user_site_name_short }) }),
            /* @__PURE__ */ jsx("h1", { className: "hidden text-xl font-bold text-primary sm:block", children: siteSettings?.user_site_name })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "max-w-xs leading-relaxed", children: footerData?.value?.description })
        ] }),
        marketCategories?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-start", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-start", children: t("markets") }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: marketCategories?.map((category) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            Link,
            {
              href: "#",
              className: "inline-block text-sm transition-all duration-200 text-foreground hover:text-primary hover:translate-x-1 hover:underline",
              children: category?.name
            }
          ) }, category.slug)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-start", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-start", children: t("legal_information") }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: pages?.map((page) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            Link,
            {
              href: route("pages.show", page?.slug),
              className: "inline-block text-sm transition-all duration-200 text-foreground hover:text-primary hover:translate-x-1 hover:underline",
              children: page?.title
            }
          ) }, page?.id)) })
        ] }),
        socialLinks?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-start", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-start", children: t("follow_us") }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: socialLinks.map((item, index) => /* @__PURE__ */ jsxs(
            "a",
            {
              href: item.url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center gap-4 transition-all duration-300 text-foreground backdrop-blur-sm group",
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "flex items-center justify-center w-10 h-10 transition-transform duration-300 rounded-lg shadow-lg group-hover:scale-110",
                    style: {
                      background: `linear-gradient(to bottom right, ${item.color}, ${item.color})`
                    },
                    children: /* @__PURE__ */ jsx(
                      DynamicIcon,
                      {
                        iconName: keyToValue(item?.icon || item?.platform),
                        iconLibrary: item.icon_library,
                        className: "w-5 h-5 text-white",
                        "aria-hidden": "true"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "font-medium capitalize transition-colors group-hover:text-primary", children: item.platform })
              ]
            },
            index
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-between pt-8 mt-16 space-y-6 border-t md:flex-row md:space-y-0", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: siteSettings?.copy_right_text }),
        logos?.payment_image && /* @__PURE__ */ jsx("div", { className: "w-[280px]", children: /* @__PURE__ */ jsx("img", { src: logos?.payment_image, alt: "payment image" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 z-[5] opacity-50",
        style: {
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "20px 30px",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)"
        }
      }
    ),
    footerData?.value?.background_image && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-[5] opacity-10 max-w-full w-full", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: footerData?.value?.background_image,
        alt: "footer background",
        className: "object-cover w-full h-full"
      }
    ) })
  ] });
};
function NotificationDropdown() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "comment",
      title: "New comment on your ticket",
      message: "John Doe replied to ticket #TKT-2847",
      time: "5 minutes ago",
      read: false,
      avatar: "JD",
      icon: MessageSquare
    },
    {
      id: 2,
      type: "user",
      title: "New team member added",
      message: "Sarah Johnson joined your team",
      time: "1 hour ago",
      read: false,
      avatar: "SJ",
      icon: UserPlus
    },
    {
      id: 3,
      type: "ticket",
      title: "Ticket assigned to you",
      message: "You have been assigned ticket #TKT-2891",
      time: "2 hours ago",
      read: false,
      avatar: null,
      icon: FileText
    },
    {
      id: 4,
      type: "alert",
      title: "High priority ticket",
      message: "Ticket #TKT-2856 marked as urgent",
      time: "3 hours ago",
      read: true,
      avatar: null,
      icon: AlertCircle
    },
    {
      id: 5,
      type: "comment",
      title: "New comment on your ticket",
      message: "Mike Wilson replied to ticket #TKT-2790",
      time: "5 hours ago",
      read: true,
      avatar: "MW",
      icon: MessageSquare
    },
    {
      id: 6,
      type: "ticket",
      title: "Ticket resolved",
      message: "Ticket #TKT-2734 has been resolved",
      time: "1 day ago",
      read: true,
      avatar: null,
      icon: FileText
    }
  ]);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAsRead = (id) => {
    setNotifications(notifications.map(
      (n) => n.id === id ? { ...n, read: true } : n
    ));
  };
  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };
  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };
  const getIconColor = (type) => {
    const colors = {
      comment: "text-blue-600 bg-blue-100",
      user: "text-green-600 bg-green-100",
      ticket: "text-purple-600 bg-purple-100",
      alert: "text-red-600 bg-red-100"
    };
    return colors[type] || "text-gray-600 bg-gray-100";
  };
  return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "icon", className: "relative cursor-pointer", children: [
      /* @__PURE__ */ jsx(Bell, { className: "size-[1.2rem]" }),
      unreadCount > 0 && /* @__PURE__ */ jsx(
        Badge,
        {
          variant: "destructive",
          className: "absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]",
          children: unreadCount
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs(DropdownMenuContent, { className: "max-w-96 w-full", align: "end", children: [
      /* @__PURE__ */ jsxs(DropdownMenuLabel, { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-base font-semibold", children: "Notifications" }),
        unreadCount > 0 && /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            className: "h-8 text-xs cursor-pointer",
            onClick: markAllAsRead,
            children: [
              /* @__PURE__ */ jsx(CheckCheck, { className: "w-3 h-3 mr-1" }),
              "Mark all as read"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
      notifications.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-8 text-center", children: [
        /* @__PURE__ */ jsx(Bell, { className: "w-12 h-12 mx-auto text-gray-300 mb-2" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "No notifications" })
      ] }) : /* @__PURE__ */ jsx(ScrollArea, { className: "h-[300px]", children: /* @__PURE__ */ jsx(DropdownMenuGroup, { children: notifications.map((notification) => {
        const Icon = notification.icon;
        return /* @__PURE__ */ jsx(
          DropdownMenuItem,
          {
            className: `p-4 cursor-pointer focus:bg-primary/10 ${!notification.read ? "bg-primary/5" : ""}`,
            onClick: () => markAsRead(notification.id),
            children: /* @__PURE__ */ jsx(Link, { href: `/notifications`, children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3 w-full", children: [
              notification.avatar ? /* @__PURE__ */ jsx(Avatar, { className: "w-10 h-10 flex-shrink-0", children: /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm", children: notification.avatar }) }) : /* @__PURE__ */ jsx("div", { className: `w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center ${getIconColor(notification.type)}`, children: /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5" }) }),
              /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-900 line-clamp-1", children: notification.title }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 mt-1 line-clamp-2", children: notification.message }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 mt-1", children: notification.time })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                  !notification.read && /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-blue-600 rounded-full" }),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600",
                      onClick: (e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      },
                      children: /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" })
                    }
                  )
                ] })
              ] }) })
            ] }) })
          },
          notification.id
        );
      }) }) }),
      /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
      /* @__PURE__ */ jsx(DropdownMenuItem, { className: "justify-center cursor-pointer", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: `/notifications`, children: /* @__PURE__ */ jsx("span", { className: "text-sm", children: "View all" }) }) })
    ] })
  ] });
}
const HeaderNav = ({ navs }) => {
  const { url } = usePage();
  return /* @__PURE__ */ jsx("nav", { className: "flex flex-col gap-6 lg:items-center lg:flex-row", children: navs?.map((nav) => {
    const isActive = url.startsWith(nav.slug);
    return /* @__PURE__ */ jsx(
      Link,
      {
        href: route("home", nav.slug),
        className: `transition-all duration-200 hover:scale-105 font-medium hover:text-primary ${isActive ? "text-primary" : "text-foreground"}`,
        children: nav?.title
      },
      nav?.id
    );
  }) });
};
const MenuSidebar = ({ navs, siteSettings }) => {
  const [open, setOpen] = useState(false);
  const isRtl = isRTL();
  const { t } = useTranslations();
  return /* @__PURE__ */ jsxs(Sheet, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "scale-95 cursor-pointer lg:hidden", onClick: () => setOpen(true), children: /* @__PURE__ */ jsx(Menu, { className: "size-[1.2rem]" }) }) }),
    /* @__PURE__ */ jsxs(SheetContent, { side: isRtl ? "left" : "right", className: "p-0 w-64 lg:hidden [&>button]:hidden", children: [
      /* @__PURE__ */ jsx(SheetTitle, { className: "sr-only", children: t("menu") }),
      /* @__PURE__ */ jsxs("aside", { className: "h-full px-4 py-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between w-full mb-8", children: [
          /* @__PURE__ */ jsxs(Link, { href: route("home"), className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-8 h-8 rounded-lg shadow-lg bg-primary", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-primary-foreground", children: siteSettings?.user_site_name_short }) }),
            /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-primary", children: siteSettings?.user_site_name })
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              onClick: () => setOpen(false),
              variant: "ghost",
              size: "sm",
              className: "px-0 cursor-pointer shrink-0 size-8",
              children: /* @__PURE__ */ jsx(X, { className: "size-[1.2rem]" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "max-h-[calc(100dvh-104px)] h-full overflow-auto", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(HeaderNav, { navs }) }),
          /* @__PURE__ */ jsx("div", { className: "pt-8", children: /* @__PURE__ */ jsx(FancyButton, { size: "lg", label: "Sign In", className: "w-full text-center", href: route("user.login") }) })
        ] })
      ] })
    ] })
  ] });
};
const ThemeSwitch = (dbTheme) => {
  const { theme, setTheme } = useTheme();
  const { submit } = useForm();
  const { t } = useTranslations();
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
  return /* @__PURE__ */ jsxs(DropdownMenu, { modal: false, children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "icon", className: "scale-95 cursor-pointer", children: [
      /* @__PURE__ */ jsx(Sun, { className: "size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }),
      /* @__PURE__ */ jsx(Moon, { className: "absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" }),
      /* @__PURE__ */ jsx("span", { className: "sr-only", children: t("toggle_theme") })
    ] }) }),
    /* @__PURE__ */ jsxs(DropdownMenuContent, { align: isRTL ? "start" : "end", children: [
      /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => setFrontendTheme("light", submit), className: "cursor-pointer", children: [
        t("light"),
        " ",
        /* @__PURE__ */ jsx(Check, { size: 14, className: cn("ml-auto", theme !== "light" && "hidden") })
      ] }),
      /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => setFrontendTheme("dark", submit), className: "cursor-pointer", children: [
        t("dark"),
        /* @__PURE__ */ jsx(Check, { size: 14, className: cn("ml-auto", theme !== "dark" && "hidden") })
      ] }),
      /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => setFrontendTheme("system", submit), className: "cursor-pointer", children: [
        t("system"),
        /* @__PURE__ */ jsx(Check, { size: 14, className: cn("ml-auto", theme !== "system" && "hidden") })
      ] })
    ] })
  ] });
};
const handleUserLogin = async (e, data, submit, setRecaptchaValue) => {
  e.preventDefault();
  try {
    await submit({
      method: "POST",
      url: route("user.authenticate"),
      data
    });
  } catch (error) {
    if (setRecaptchaValue && window.grecaptcha) {
      window.grecaptcha.reset();
      setRecaptchaValue(null);
    }
  }
};
const handleUserRegister = async (e, data, submit, setRecaptchaValue) => {
  e.preventDefault();
  try {
    await submit({
      method: "POST",
      url: route("user.register.submit"),
      data
    });
  } catch (error) {
    if (setRecaptchaValue && window.grecaptcha) {
      window.grecaptcha.reset();
      setRecaptchaValue(null);
    }
  }
};
const handleForgotPassword = async (e, data, submit) => {
  e.preventDefault();
  try {
    await submit({
      method: "POST",
      url: route("user.password.email"),
      data
    });
  } catch (error) {
    console.error("Forgot password error:", error);
  }
};
const handleVerifyOtp = async (e, data, submit) => {
  e.preventDefault();
  try {
    await submit({
      method: "POST",
      url: route("user.password.verify"),
      data
    });
  } catch (error) {
    console.error("OTP verification error:", error);
  }
};
const handleResendOtp = async (submit) => {
  try {
    await submit({
      method: "POST",
      url: route("user.password.resend")
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
  }
};
const handleResetPassword = async (e, data, submit, setFormData) => {
  e.preventDefault();
  try {
    await submit({
      method: "POST",
      url: route("user.password.update"),
      data
    });
    setFormData({
      password: "",
      password_confirmation: ""
    });
  } catch (error) {
    console.error("Reset password error:", error);
  }
};
const handleEmailVerification = async (e, data, submit) => {
  e.preventDefault();
  try {
    await submit({
      method: "POST",
      url: route("user.email.verify"),
      data
    });
  } catch (error) {
    console.error("Email verification error:", error);
  }
};
const handleResendEmailVerification = async (submit) => {
  try {
    await submit({
      method: "POST",
      url: route("user.resend.verification")
    });
  } catch (error) {
    console.error("Resend verification error:", error);
  }
};
const handleTwoFactorVerification = async (e, data, submit) => {
  e.preventDefault();
  try {
    await submit({
      method: "POST",
      url: route("user.2fa.verify"),
      data
    });
  } catch (error) {
    console.error("2FA verification error:", error);
  }
};
const handleUserLogout = async (submit) => {
  try {
    await submit({
      method: "POST",
      url: route("user.logout")
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
};
const ProfileDropdown = ({ user }) => {
  const { submit } = useForm();
  return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "ghost",
        className: "relative flex items-center gap-3 p-0 rounded-full cursor-pointer md:px-3",
        children: [
          /* @__PURE__ */ jsxs(Avatar, { className: "rounded-full size-7 bg-accent", children: [
            /* @__PURE__ */ jsx(
              AvatarImage,
              {
                src: user.img_url,
                alt: user.name
              }
            ),
            /* @__PURE__ */ jsx(AvatarFallback, { children: user.name.charAt(0).toUpperCase() })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "hidden text-sm font-medium md:block", children: user.wallet?.balance_with_currency || 0 })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs(
      DropdownMenuContent,
      {
        className: "w-56",
        align: isRTL ? "start" : "end",
        forceMount: true,
        children: [
          /* @__PURE__ */ jsx(DropdownMenuLabel, { className: "font-normal", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium leading-none", children: user?.name }),
            /* @__PURE__ */ jsx("p", { className: "text-xs leading-none text-muted-foreground", children: user?.email })
          ] }) }),
          /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
          /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: route("user.profile.index"), className: "cursor-pointer", children: [
            /* @__PURE__ */ jsx(User, { className: "w-4 h-4 mr-2" }),
            /* @__PURE__ */ jsx("span", { children: "Profile" })
          ] }) }),
          /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: "/user/portfolio", className: "cursor-pointer", children: [
            /* @__PURE__ */ jsx(Wallet, { className: "w-4 h-4 mr-2" }),
            /* @__PURE__ */ jsx("span", { children: "Portfolio" })
          ] }) }),
          /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
          /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "cursor-pointer", onClick: () => handleUserLogout(submit), children: [
            /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4 mr-2" }),
            /* @__PURE__ */ jsx("span", { children: "Log out" })
          ] })
        ]
      }
    )
  ] });
};
const LanguageSwitch = ({ className, languageSettings }) => {
  const { submit } = useForm();
  let { available_languages: languages, current_language: dbLanguage } = languageSettings || {};
  languages = languages?.data || [];
  const { t } = useTranslations();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentLanguage = dbLanguage || "en";
  return /* @__PURE__ */ jsx("div", { className, children: /* @__PURE__ */ jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
      Button,
      {
        variant: "ghost",
        className: "scale-95 cursor-pointer",
        role: "combobox",
        "aria-expanded": open,
        "aria-label": t("language.switch_language") || "Switch Language",
        disabled: isLoading,
        children: isLoading ? /* @__PURE__ */ jsx("span", { className: "animate-spin", children: "⏳" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(TfiWorld, { className: "size-[1.2rem] me-1" }),
          /* @__PURE__ */ jsx("span", { className: "uppercase", children: currentLanguage })
        ] })
      }
    ) }),
    /* @__PURE__ */ jsx(PopoverContent, { className: "w-[200px] p-0", children: /* @__PURE__ */ jsxs(Command, { children: [
      /* @__PURE__ */ jsx(
        CommandInput,
        {
          placeholder: t(
            "search_language"
          ),
          className: "h-9"
        }
      ),
      /* @__PURE__ */ jsxs(CommandList, { children: [
        /* @__PURE__ */ jsx(CommandEmpty, { children: t("no_language_found") }),
        /* @__PURE__ */ jsx(CommandGroup, { children: languages?.map((lang) => /* @__PURE__ */ jsxs(
          CommandItem,
          {
            value: lang.value,
            onSelect: () => handleLanguageChange(submit, lang, setOpen),
            className: "cursor-pointer",
            "aria-label": `Select ${lang.name}`,
            children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium uppercase", children: lang.code }),
              /* @__PURE__ */ jsx(
                Check,
                {
                  className: cn(
                    "ms-auto size-4",
                    currentLanguage === lang.code ? "opacity-100" : "opacity-0"
                  )
                }
              )
            ]
          },
          lang.code
        )) })
      ] })
    ] }) })
  ] }) });
};
const Header = ({ isMarket = false, props }) => {
  let {
    theme,
    menus,
    site_theme_settings: siteSettings,
    language_settings: languageSettings
  } = props;
  const user = props?.auth?.user ?? null;
  const { url, auth } = usePage();
  const params = new URLSearchParams(url.split("?")[1]);
  const category = params.get("category");
  const deviceWidth = 1224;
  const isTabletOrMobile = useMediaQuery({ maxWidth: deviceWidth });
  return /* @__PURE__ */ jsx(
    motion.header,
    {
      initial: { y: -20 },
      animate: { y: 0 },
      transition: { duration: 0.5, ease: "easeOut" },
      className: "sticky top-0 z-50 border-b bg-card backdrop-blur-sm",
      children: /* @__PURE__ */ jsxs("div", { className: "container px-4 mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 h-14", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-12", children: [
            /* @__PURE__ */ jsxs(Link, { href: route("home"), className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-8 h-8 rounded-lg shadow-lg bg-primary", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-primary-foreground", children: siteSettings?.user_site_name_short }) }),
              /* @__PURE__ */ jsx("h1", { className: "hidden text-xl font-bold text-primary sm:block", children: siteSettings?.user_site_name })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "hidden lg:block", children: /* @__PURE__ */ jsx(HeaderNav, { navs: menus?.data || [] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(ThemeSwitch, { dbTheme: theme }),
            /* @__PURE__ */ jsx(NotificationDropdown, {}),
            /* @__PURE__ */ jsx(LanguageSwitch, { languageSettings }),
            user ? /* @__PURE__ */ jsx(ProfileDropdown, { user }) : /* @__PURE__ */ jsx(
              FancyButton,
              {
                label: "Sign In",
                className: "hidden lg:flex",
                href: route("user.login")
              }
            ),
            isTabletOrMobile && /* @__PURE__ */ jsx(
              MenuSidebar,
              {
                navs: menus?.data || [],
                siteSettings
              }
            )
          ] })
        ] }),
        isMarket && /* @__PURE__ */ jsx("div", { className: "py-2", children: /* @__PURE__ */ jsx(MenuScroller, { children: /* @__PURE__ */ jsxs("ul", { className: "flex items-center gap-1 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            Link,
            {
              href: `/markets`,
              className: `whitespace-nowrap transition-all font-medium px-3 py-1.5 rounded-md flex hover:text-primary hover:bg-primary/5`,
              children: "Trending"
            }
          ) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            Link,
            {
              href: `/markets`,
              className: `whitespace-nowrap transition-all font-medium px-3 py-1.5 rounded-md flex hover:text-primary hover:bg-primary/5`,
              children: "New"
            }
          ) }),
          /* @__PURE__ */ jsx("li", { className: "h-6 mx-2", children: /* @__PURE__ */ jsx(Separator, { orientation: "vertical" }) }),
          []?.map(
            (cat, index) => {
              const catKey = valueToKey(cat.label);
              return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                Link,
                {
                  href: `/markets?category=${catKey}`,
                  className: `whitespace-nowrap transition-all font-medium px-3 py-1.5 rounded-md flex hover:text-primary hover:bg-primary/5 ${category === catKey ? "text-primary bg-primary/5" : ""}`,
                  children: cat?.label
                }
              ) }, index);
            }
          )
        ] }) }) })
      ] })
    }
  );
};
const AppLayout = ({ children, isMarket = false }) => {
  const { props } = usePage();
  const { theme, site_theme_settings } = props;
  return /* @__PURE__ */ jsx(ToastProvider, { children: /* @__PURE__ */ jsx(ThemeProvider, { dbTheme: theme, children: /* @__PURE__ */ jsxs(DirectionProvider, { dbDirection: site_theme_settings?.direction, children: [
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsx(Header, { isMarket, props }),
      /* @__PURE__ */ jsx("main", { className: `min-h-[calc(100dvh-calc(65px+105px))] h-full`, children }),
      /* @__PURE__ */ jsx(Footer, { props })
    ] }),
    /* @__PURE__ */ jsx(HotToaster, {})
  ] }) }) });
};
export {
  AppLayout as A,
  handleResendEmailVerification as a,
  handleUserLogin as b,
  handleVerifyOtp as c,
  handleResendOtp as d,
  handleUserRegister as e,
  handleForgotPassword as f,
  handleTwoFactorVerification as g,
  handleEmailVerification as h,
  handleResetPassword as i
};

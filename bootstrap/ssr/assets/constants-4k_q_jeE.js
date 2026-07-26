import { B as BlogSection } from "./BlogSection-DiGfvTON.js";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import React__default, { useState } from "react";
import { L as useTranslations, M as handleStoreContact, N as FancyButton, O as DynamicIcon, A as Avatar, s as AvatarImage, t as AvatarFallback, P as handleStoreNewsletter } from "./Sheet-B-_2BaZp.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import { L as Label } from "./Label-BxDBN09D.js";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { a as cn, d as getSiteSettings, e as getSectionData, B as Button, f as isRTL } from "./Button-CFMlPXiE.js";
import { usePage, Link } from "@inertiajs/react";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { C as Card, a as CardContent } from "./Card-CQ2ij0--.js";
import { Mail, Phone, MessageSquare, ChevronDownIcon, Sparkles, Zap, Search, ListRestart, SlidersHorizontal, Trophy, ListFilter, Settings, Palette, Image, HardDrive, CurrencyIcon, Shield, ShieldCheck, Users, Cpu, Ticket, UserCog, TabletSmartphone, Lock } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { E as EmptyData } from "./EmptyData-DjqqIMwS.js";
import { motion, AnimatePresence as AnimatePresence$1 } from "framer-motion";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import { f as CollapseWrapper, T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./TradeDialog-Dt4WEyMP.js";
import { AnimatePresence } from "motion/react";
import { P as PaginationWrapper } from "./PaginationWrapper-B-KWAp7V.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./Table-Dz-EvWd_.js";
import { l as leaderboardData } from "./demo-data-C5EGh9Nk.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./MarketGrid-DlkazA02.js";
import { S as SlideUp } from "./SlideUp-CpffxXZf.js";
import "clsx";
import "react-hot-toast";
import { M as MarketSectionTwo } from "./MarketSectionTwo-RD2Nw8tb.js";
function Switch({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    SwitchPrimitive.Root,
    {
      "data-slot": "switch",
      className: cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        SwitchPrimitive.Thumb,
        {
          "data-slot": "switch-thumb",
          className: cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 rtl:data-[state=checked]:-translate-x-[calc(100%-2px)]"
          )
        }
      )
    }
  );
}
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
const ContactForm = () => {
  const { t } = useTranslations();
  const { props } = usePage();
  let {
    site_theme_settings: siteSettings
  } = props;
  getSiteSettings(siteSettings, "terms_conditions_url");
  let privacy_policy_url = getSiteSettings(siteSettings, "privacy_policy_url");
  const { loading: isSubmitting, errors: serverErrors, submit } = useForm();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    company: "",
    email: "",
    phone_number: "",
    message: "",
    agreed_to_policy: false
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSwitchChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      agreed_to_policy: checked
    }));
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: (e) => handleStoreContact(e, formData, submit, setFormData), children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "first-name", className: "block font-semibold text-sm/6 rtl:text-start", children: [
          t("first_name"),
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2.5", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "first-name",
              name: "first_name",
              type: "text",
              required: true,
              autoComplete: "given-name",
              className: "w-full py-6 rounded-md",
              value: formData.first_name,
              onChange: handleInputChange,
              disabled: isSubmitting
            }
          ),
          serverErrors?.first_name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: serverErrors.first_name })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "last-name", className: "block font-semibold text-sm/6 rtl:text-start", children: [
          t("last_name"),
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2.5", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "last-name",
              name: "last_name",
              required: true,
              type: "text",
              autoComplete: "family-name",
              className: "w-full py-6 rounded-md",
              value: formData.last_name,
              onChange: handleInputChange,
              disabled: isSubmitting
            }
          ),
          serverErrors?.last_name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: serverErrors.last_name })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "company", className: "block font-semibold text-sm/6 rtl:text-start", children: t("company") }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2.5", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "company",
              name: "company",
              type: "text",
              autoComplete: "organization",
              className: "w-full py-6 rounded-md",
              value: formData.company,
              onChange: handleInputChange,
              disabled: isSubmitting
            }
          ),
          serverErrors?.company && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: serverErrors.company })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "email", className: "block font-semibold text-sm/6 rtl:text-start", children: [
          t("email"),
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2.5", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "email",
              name: "email",
              type: "email",
              required: true,
              autoComplete: "email",
              className: "w-full py-6 rounded-md",
              value: formData.email,
              onChange: handleInputChange,
              disabled: isSubmitting
            }
          ),
          serverErrors?.email && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: serverErrors.email })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "phone-number", className: "block font-semibold text-sm/6 rtl:text-start", children: t("phone_number") }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2.5", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "phone-number",
              name: "phone_number",
              type: "text",
              placeholder: "123-456-7890",
              className: "w-full py-6 rounded-md",
              value: formData.phone_number,
              onChange: handleInputChange,
              disabled: isSubmitting
            }
          ),
          serverErrors?.phone_number && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: serverErrors.phone_number })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "message", className: "block font-semibold text-sm/6 rtl:text-start", children: [
          t("message"),
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2.5", children: [
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "message",
              name: "message",
              required: true,
              rows: 4,
              value: formData.message,
              onChange: handleInputChange,
              disabled: isSubmitting,
              placeholder: "Tell us about your inquiry..."
            }
          ),
          serverErrors?.message && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: serverErrors.message })
        ] })
      ] }),
      privacy_policy_url && /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-x-4", children: [
          /* @__PURE__ */ jsx(
            Switch,
            {
              required: true,
              className: "mt-1 cursor-pointer",
              checked: formData.agreed_to_policy,
              onCheckedChange: handleSwitchChange,
              disabled: isSubmitting
            }
          ),
          /* @__PURE__ */ jsxs(Label, { htmlFor: "agree-to-policies", className: "text-sm/6", children: [
            t("by_selecting_this_you_agree_to_our"),
            " ",
            /* @__PURE__ */ jsx(Link, { href: privacy_policy_url, className: "font-semibold underline whitespace-nowrap text-primary", children: t("privacy_policy") }),
            ". ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] })
        ] }),
        serverErrors?.agreed_to_policy && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: serverErrors.agreed_to_policy })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-10", children: /* @__PURE__ */ jsx(
      FancyButton,
      {
        label: isSubmitting ? t("sending") + "..." : t("send"),
        size: "xl",
        className: "w-full",
        type: "submit",
        disabled: isSubmitting,
        isLoading: isSubmitting
      }
    ) })
  ] });
};
function ContactSection({ data }) {
  const { props } = usePage();
  let {
    site_theme_settings: siteSettings
  } = props;
  const sectionData = getSectionData(data);
  const { t } = useTranslations();
  return /* @__PURE__ */ jsxs("section", { className: "py-16 isolate lg:py-24 mb:py-20", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        "aria-hidden": "true",
        className: "absolute inset-x-0 overflow-hidden -top-40 -z-10 transform-gpu blur-3xl sm:-top-80",
        children: /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
            },
            className: "relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-primary opacity-10 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-6xl px-4 mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-12 text-center lg:mb-20", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary", children: [
          /* @__PURE__ */ jsx(Mail, { className: "size-4" }),
          sectionData?.title
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "mb-6 text-3xl font-bold lg:text-5xl", children: sectionData?.subtitle }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 ", children: sectionData?.description })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 lg:flex-col md:flex-row", children: [
          /* @__PURE__ */ jsx(Card, { className: "bg-primary text-primary-foreground rounded-2xl lg:grow-0 md:grow", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-start gap-4 p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Phone, { size: 20 }),
              /* @__PURE__ */ jsx("span", { className: "text-sm", children: t("call_us_directly_at") })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold", children: siteSettings?.site_phone }),
            /* @__PURE__ */ jsx(Button, { variant: "secondary", asChild: true, className: "w-full py-6 mt-8 cursor-pointer", children: /* @__PURE__ */ jsx("a", { href: siteSettings?.site_phone, children: t("call_now") }) })
          ] }) }),
          /* @__PURE__ */ jsx(Card, { className: "shadow-none bg-accent rounded-2xl lg:grow-0 md:grow", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-start gap-4 p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(MessageSquare, { size: 20 }),
              /* @__PURE__ */ jsx("span", { className: "text-sm", children: t("chat_with_our_team") })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: siteSettings?.site_email }),
            /* @__PURE__ */ jsx(Button, { variant: "outline", className: "w-full py-6 mt-8 cursor-pointer", children: /* @__PURE__ */ jsx("a", { href: `mailto:${siteSettings?.site_email}`, children: t("send_email") }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsx("div", { className: "p-8 border lg:ms-6 xl:ms-12 bg-card rounded-3xl border-t-6 border-t-primary", children: /* @__PURE__ */ jsx(ContactForm, {}) }) })
      ] })
    ] })
  ] });
}
function Accordion({
  ...props
}) {
  return /* @__PURE__ */ jsx(AccordionPrimitive.Root, { "data-slot": "accordion", ...props });
}
function AccordionItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AccordionPrimitive.Item,
    {
      "data-slot": "accordion-item",
      className: cn("border-b last:border-b-0", className),
      ...props
    }
  );
}
function AccordionTrigger({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs(
    AccordionPrimitive.Trigger,
    {
      "data-slot": "accordion-trigger",
      className: cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(
          ChevronDownIcon,
          {
            className: "text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"
          }
        )
      ]
    }
  ) });
}
function AccordionContent({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AccordionPrimitive.Content,
    {
      "data-slot": "accordion-content",
      className: "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm",
      ...props,
      children: /* @__PURE__ */ jsx("div", { className: cn("pt-0 pb-4", className), children })
    }
  );
}
function FAQSection({ data }) {
  let faqs = data?.faqs?.data || [];
  const sectionData = getSectionData(data);
  const { t } = useTranslations();
  return /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-24 mb:py-20", children: /* @__PURE__ */ jsx("div", { className: "container px-4 mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 xl:gap-12 lg:gap-8 md:gap-6", children: [
    /* @__PURE__ */ jsx("div", { className: "lg:col-span-5 col-span-full", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between h-full gap-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "duration-700 animate-in fade-in-50 slide-in-from-bottom-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-4 text-3xl font-bold md:text-4xl", children: sectionData?.title }),
        /* @__PURE__ */ jsx("p", { className: "max-w-2xl text-lg text-muted-foreground", children: sectionData?.subtitle })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "col-span-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between h-full px-5 border-s", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-block mb-3 text-muted-foreground", children: t("visit_us_in_the_office") }),
          /* @__PURE__ */ jsx("p", { className: "mt-6 text-sm", children: data?.address })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "col-span-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between h-full px-5 border-s", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-block mb-3 text-muted-foreground", children: t("contact") }),
          /* @__PURE__ */ jsx(
            "a",
            {
              className: "block mt-6 text-sm underline",
              href: `mailto:${data.site_email}`,
              children: data.site_email
            }
          )
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "lg:col-span-7 col-span-full", children: faqs.length > 0 ? /* @__PURE__ */ jsx(Accordion, { type: "single", collapsible: true, defaultValue: "faq-0", children: faqs?.map((faq, index) => /* @__PURE__ */ jsxs(AccordionItem, { value: `faq-${index}`, className: "py-4", children: [
      /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-lg font-semibold cursor-pointer", children: faq?.value?.question }),
      /* @__PURE__ */ jsx(AccordionContent, { className: "duration-300 animate-in fade-in slide-in-from-top-2", children: /* @__PURE__ */ jsx("p", { className: "leading-relaxed text-muted-foreground", children: faq?.value?.answer }) })
    ] }, index)) }) : /* @__PURE__ */ jsx(
      EmptyData,
      {
        title: "No faqs found",
        description: "No faqs available. Create your first faq to get started."
      }
    ) })
  ] }) }) });
}
const HeroSection = ({ data }) => {
  useTranslations();
  const sectionData = getSectionData(data);
  const buttons = sectionData?.buttons || [];
  const cards = sectionData?.counter_cards || [];
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };
  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  return /* @__PURE__ */ jsxs("section", { className: "relative pt-20 overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "container relative z-10 px-4 mx-auto", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "max-w-4xl mx-auto text-center",
        variants: staggerContainer,
        initial: "hidden",
        animate: "visible",
        children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              className: "flex items-center justify-center mb-4",
              variants: fadeUp,
              children: [
                /* @__PURE__ */ jsx(Sparkles, { className: "w-8 h-8 mr-2 text-primary animate-pulse" }),
                /* @__PURE__ */ jsx("span", { className: "px-3 py-1 text-sm font-medium rounded-full text-primary bg-primary/10", children: sectionData?.title })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            motion.h1,
            {
              className: "mb-6 text-5xl font-bold xl:text-7xl md:text-6xl text-primary",
              variants: fadeUp,
              transition: { duration: 0.6 },
              children: sectionData?.subtitle
            }
          ),
          /* @__PURE__ */ jsx(
            motion.p,
            {
              className: "max-w-2xl mx-auto mb-8 text-lg md:text-xl text-muted-foreground",
              variants: fadeUp,
              transition: { duration: 0.6, delay: 0.2 },
              children: sectionData?.description
            }
          ),
          buttons?.length > 0 && /* @__PURE__ */ jsx(
            motion.div,
            {
              className: "flex flex-col justify-center gap-4 mb-16 sm:flex-row",
              variants: fadeUp,
              transition: { duration: 0.6, delay: 0.4 },
              children: buttons?.map((button, index) => /* @__PURE__ */ jsx(
                FancyButton,
                {
                  label: button?.text,
                  href: button?.link,
                  size: "xl",
                  variant: button?.variant
                },
                index
              ))
            }
          )
        ]
      }
    ) }),
    cards?.length > 0 && /* @__PURE__ */ jsx("div", { className: "rounded-t-full border-y", children: /* @__PURE__ */ jsx("div", { className: "container relative z-10 px-4 mx-auto", children: /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "grid grid-cols-1 gap-0 md:grid-cols-3",
        variants: staggerContainer,
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.3 },
        children: cards?.map((card, i) => /* @__PURE__ */ jsxs(
          motion.div,
          {
            className: "py-8 text-center transition-transform duration-300 border-b sm:border-s first:border-s-0 last:xl:border-e-0 sm:border-b-0 last:border-b-0",
            variants: fadeUp,
            children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-3 mx-auto mb-3 transition-shadow rounded-full bg-gradient-to-br from-primary/10 to-accent/10 size-14 lg:size-16 group-hover:shadow-lg", children: /* @__PURE__ */ jsx(DynamicIcon, { iconName: card?.icon, iconLibrary: card?.icon_library, className: "transition-transform lg:size-8 size-7 text-primary group-hover:scale-110" }) }),
              /* @__PURE__ */ jsx("span", { className: "block mb-1 text-2xl font-bold lg:text-3xl", children: card.value }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground lg:text-base", children: card.label })
            ]
          },
          `${i}-cards`
        ))
      }
    ) }) }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-50 bg-primary/5" }),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "absolute rounded-full top-20 left-10 w-72 h-72 bg-primary/25 blur-3xl opacity-30",
        animate: {
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1]
        },
        transition: {
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear"
        }
      }
    ),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "absolute rounded-full bottom-20 right-10 w-96 h-96 bg-primary/20 blur-3xl opacity-30",
        animate: {
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 0.8, 1]
        },
        transition: {
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear"
        }
      }
    )
  ] });
};
const defaultImage = "/build/assets/default-BF8QkkMI.jpg";
function SafeImage({
  src,
  alt = "image",
  fallback = defaultImage,
  placeholder = defaultImage,
  className = "",
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src || placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const handleError = () => setImgSrc(fallback);
  const handleLoad = () => setIsLoaded(true);
  return /* @__PURE__ */ jsx(
    motion.img,
    {
      initial: { opacity: 0.3 },
      animate: { opacity: isLoaded ? 1 : 0.3 },
      transition: { duration: 0.4 },
      src: imgSrc,
      alt,
      loading: "lazy",
      onLoad: handleLoad,
      onError: handleError,
      className: `object-cover transition-all duration-500 ease-in-out ${className}`,
      ...props
    }
  );
}
const HowItWorksSection = ({ data }) => {
  const sectionData = getSectionData(data);
  const { t } = useTranslations();
  const steps = sectionData?.steps || [];
  return /* @__PURE__ */ jsxs("section", { className: "relative py-16 overflow-hidden lg:py-24 mb:py-20 bg-gradient-to-b from-primary/5 via-background to-primary/5", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_70%)]" }),
    /* @__PURE__ */ jsxs("div", { className: "container px-4 mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center lg:mb-24 mb-14", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-5 py-2 mb-6 text-sm font-medium rounded-full shadow-sm bg-primary/10 text-primary", children: [
          /* @__PURE__ */ jsx(Zap, { className: "w-4 h-4" }),
          sectionData?.title
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "mb-6 text-3xl font-bold tracking-tight lg:text-4xl", children: sectionData?.sub_title }),
        /* @__PURE__ */ jsx("p", { className: "max-w-3xl mx-auto leading-relaxed md:text-lg text-muted-foreground", children: sectionData?.description })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative grid grid-cols-1 gap-16 lg:gap-28", children: steps?.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-0 hidden md:block h-full w-[2px] bg-gradient-to-b from-primary/20 to-transparent -translate-x-1/2" }),
        steps?.map((step, index) => /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 40 },
            whileInView: { opacity: 1, y: 0 },
            transition: { duration: 0.7, delay: index * 0.25, ease: "easeOut" },
            viewport: { once: true },
            className: `flex items-center gap-8 lg:gap-16 ${index % 2 !== 0 ? "md:flex-row-reverse flex-col-reverse" : "md:flex-row flex-col-reverse"}`,
            children: [
              /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { opacity: 0, scale: 0.5 },
                  whileInView: { opacity: 1, scale: 1 },
                  transition: {
                    duration: 0.6,
                    delay: index * 0.25 + 0.2,
                    type: "spring",
                    stiffness: 120
                  },
                  viewport: { once: true },
                  whileHover: { scale: 1.03, rotate: index % 2 === 0 ? 1 : -1 },
                  className: "relative w-full grow md:w-1/2",
                  children: /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden transition-shadow duration-300 shadow-xl rounded-3xl hover:shadow-2xl", children: [
                    step?.image && /* @__PURE__ */ jsx(
                      SafeImage,
                      {
                        src: step?.image,
                        alt: step.title,
                        className: "object-cover w-full"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      motion.span,
                      {
                        initial: { opacity: 0, scale: 0.5 },
                        whileInView: { opacity: 1, scale: 1 },
                        transition: {
                          duration: 0.6,
                          delay: index * 0.25 + 0.4,
                          type: "spring",
                          stiffness: 100
                        },
                        viewport: { once: true },
                        className: "absolute inset-0 flex items-center justify-center text-[4rem] sm:text-[6rem] lg:text-[8rem] font-extrabold text-primary/20 select-none",
                        children: index + 1
                      }
                    )
                  ] })
                }
              ),
              /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: {
                    opacity: 0,
                    x: index % 2 === 0 ? -60 : 60
                  },
                  whileInView: { opacity: 1, x: 0 },
                  transition: {
                    duration: 0.7,
                    delay: index * 0.25 + 0.3,
                    ease: "easeOut"
                  },
                  viewport: { once: true },
                  className: "relative w-full grow md:w-1/2",
                  children: /* @__PURE__ */ jsxs("div", { className: "ms:px-4 lg:px-10", children: [
                    /* @__PURE__ */ jsxs(
                      Badge,
                      {
                        variant: "secondary",
                        className: "py-1.5 px-3 bg-background font-bold text-primary border border-primary shadow-sm",
                        children: [
                          t("step"),
                          " ",
                          index + 1
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx("h4", { className: "mt-6 mb-4 text-xl font-semibold lg:text-2xl", children: step.title }),
                    /* @__PURE__ */ jsx("p", { className: "mb-3 text-sm leading-relaxed text-muted-foreground md:text-base", children: step.description }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-primary", children: step?.highlighted_text })
                  ] })
                }
              )
            ]
          },
          index
        ))
      ] }) : /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
        EmptyData,
        {
          title: "No steps found",
          description: "No steps available for 'How It Works'. Add your first step to get started."
        }
      ) }) })
    ] })
  ] });
};
const FilterWrapper = ({ actions, className, ...props }) => {
  const { onCollapseOpen, onCollapseClose } = actions;
  return /* @__PURE__ */ jsxs("div", { className: `md:shrink-0 flex items-center gap-2 ${className || ""}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "relative w-full group", children: [
      /* @__PURE__ */ jsx(
        Search,
        {
          className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors"
        }
      ),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "search-input",
          placeholder: "Search markets...",
          className: "ps-10 h-8 bg-accent shadow-none border-border/50 focus:border-primary/50 transition-all duration-200 hover:bg-background/70"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(
      Button,
      {
        size: "icon",
        className: "size-8 cursor-pointer bg-red-100 text-red-500 hover:bg-red-600 hover:text-red-100",
        onClick: onCollapseClose,
        children: [
          /* @__PURE__ */ jsx(ListRestart, { className: "size-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Reset" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "secondary",
        size: "icon",
        className: "size-8 cursor-pointer",
        onClick: onCollapseOpen,
        children: [
          /* @__PURE__ */ jsx(SlidersHorizontal, { className: "size-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Filter" })
        ]
      }
    )
  ] });
};
const LeaderboardTable = () => {
  return /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { className: "w-full", children: [
    /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "border-b text-start", children: [
      /* @__PURE__ */ jsx(TableHead, { className: "pb-3 text-sm font-medium text-muted-foreground", children: "Rank" }),
      /* @__PURE__ */ jsx(TableHead, { className: "pb-3 text-sm font-medium text-muted-foreground", children: "Username" }),
      /* @__PURE__ */ jsx(TableHead, { className: "pb-3 text-sm font-medium text-muted-foreground", children: "Volume" }),
      /* @__PURE__ */ jsx(TableHead, { className: "pb-3 text-sm font-medium text-muted-foreground", children: "Win rate" })
    ] }) }),
    /* @__PURE__ */ jsx(TableBody, { children: leaderboardData.map((user, index) => /* @__PURE__ */ jsxs(TableRow, { className: "border-b last:border-b-0", children: [
      /* @__PURE__ */ jsx(TableCell, { className: "py-4", children: user?.rank }),
      /* @__PURE__ */ jsx(TableCell, { className: "py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs(Avatar, { className: "size-12", children: [
          /* @__PURE__ */ jsx(AvatarImage, { src: "" }),
          /* @__PURE__ */ jsx(AvatarFallback, { children: user?.avatar })
        ] }),
        /* @__PURE__ */ jsx("span", { children: user?.player })
      ] }) }),
      /* @__PURE__ */ jsxs(TableCell, { className: "py-4", children: [
        "$",
        user?.amount
      ] }),
      /* @__PURE__ */ jsx(TableCell, { className: "py-4", children: /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "font-medium", children: [
        user?.wins,
        "%"
      ] }) })
    ] }, index)) })
  ] }) });
};
const FilterCollapse = ({ children, open = false, onOpenChange = void 0 }) => {
  return /* @__PURE__ */ jsx(CollapseWrapper, { open, onOpenChange, children: /* @__PURE__ */ jsx("form", { className: "mt-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 lg:gap-5 gap-3", children: [
    /* @__PURE__ */ jsx("div", { className: "md:col-span-4 col-span-6 w-full", children: /* @__PURE__ */ jsxs(
      Select,
      {
        className: "w-full",
        children: [
          /* @__PURE__ */ jsx(
            SelectTrigger,
            {
              id: "volume-select",
              className: "w-full h-8 cursor-pointer shadow-none",
              children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Volume" })
            }
          ),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "volume", children: "Volume" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "ending_soon", children: "Ending Soon" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "recently_added", children: "Recently Added" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "price_change", children: "Price Change" })
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "md:col-span-4 col-span-6 w-full", children: /* @__PURE__ */ jsxs(
      Select,
      {
        className: "w-full",
        children: [
          /* @__PURE__ */ jsx(
            SelectTrigger,
            {
              id: "status-select",
              className: "w-full h-8 cursor-pointer shadow-none",
              children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Open" })
            }
          ),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "Open", children: "Open" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "Closed", children: "Closed" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "Resolved", children: "Resolved" })
          ] })
        ]
      }
    ) }),
    children && children
  ] }) }) });
};
const LeaderboardSection = ({ data }) => {
  const sectionData = getSectionData(data);
  const { t } = useTranslations();
  const [isCollapse, setIsCollapse] = useState(false);
  const handelCollapseOpen = () => setIsCollapse((prev) => !prev);
  const handelCollapseClose = () => setIsCollapse(false);
  const leaderboardTabs = [
    {
      key: "day",
      value: "Day"
    },
    {
      key: "week",
      value: "Week"
    },
    {
      key: "month",
      value: "Month"
    },
    {
      key: "all",
      value: "All"
    }
  ];
  const isRtl = isRTL();
  return /* @__PURE__ */ jsxs("section", { className: "py-16 isolate lg:py-24 mb:py-20", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        "aria-hidden": "true",
        className: "absolute inset-x-0 overflow-hidden -top-40 -z-10 transform-gpu blur-3xl sm:-top-80",
        children: /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
            },
            className: "relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-primary opacity-10 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "container px-4 mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative mb-12 lg:mb-20", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary", children: [
            /* @__PURE__ */ jsx(Trophy, { className: "size-4" }),
            sectionData?.title
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "mb-4 text-3xl font-bold lg:text-5xl", children: sectionData?.subtitle }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500 ", children: sectionData?.description })
        ] }),
        sectionData?.image && /* @__PURE__ */ jsx("div", { className: "max-w-[350px] w-full absolute end-0 top-0 opacity-40 dark:opacity-80", children: /* @__PURE__ */ jsx(
          SafeImage,
          {
            src: sectionData?.image,
            alt: t("leaderboard_image"),
            className: `transform ${isRtl ? "" : "scale-x-[-1]"} `
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: leaderboardTabs[0].key, children: [
        /* @__PURE__ */ jsx(TabsList, { className: "mb-5", children: leaderboardTabs?.map((tab) => /* @__PURE__ */ jsx(TabsTrigger, { value: tab?.key, className: "px-4 cursor-pointer", children: tab?.value }, tab?.key)) }),
        /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: leaderboardTabs?.map((tab) => /* @__PURE__ */ jsx(TabsContent, { value: tab?.key, children: /* @__PURE__ */ jsx(SlideUp, { children: /* @__PURE__ */ jsx(Card, { className: "p-0 overflow-hidden border rounded-md shadow-none", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-semibold", children: [
                /* @__PURE__ */ jsx(ListFilter, { className: "size-6 text-primary" }),
                "Leader List"
              ] }),
              /* @__PURE__ */ jsx(FilterWrapper, { actions: {
                onCollapseOpen: handelCollapseOpen,
                onCollapseClose: handelCollapseClose
              } })
            ] }),
            /* @__PURE__ */ jsx(FilterCollapse, { open: isCollapse, onOpenChange: setIsCollapse })
          ] }),
          /* @__PURE__ */ jsx(LeaderboardTable, {}),
          /* @__PURE__ */ jsx(PaginationWrapper, {})
        ] }) }) }) }, tab?.key)) })
      ] }) })
    ] })
  ] });
};
function NewsletterSection({ data }) {
  const sectionData = getSectionData(data);
  const cards = sectionData?.section_cards || [];
  const { t } = useTranslations();
  const { props } = usePage();
  const { site_theme_settings: siteSettings } = props;
  const terms_conditions_url = getSiteSettings(siteSettings, "terms_conditions_url");
  const privacy_policy_url = getSiteSettings(siteSettings, "privacy_policy_url");
  const { loading: isSubmitting, errors: serverErrors, submit } = useForm();
  const [formData, setFormData] = useState({ email: "" });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return /* @__PURE__ */ jsxs("section", { className: "relative py-16 overflow-hidden isolate bg-background lg:py-24 mb:py-20", children: [
    /* @__PURE__ */ jsx("div", { className: "container px-4 mx-auto 2xl:px-20", children: /* @__PURE__ */ jsxs("div", { className: "grid items-center grid-cols-1 lg:grid-cols-12 lg:gap-12 gap-y-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7", children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-6 text-3xl font-bold tracking-tight lg:text-4xl", children: sectionData?.title }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: sectionData?.description }),
        cards.length > 0 && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-10 mt-20 sm:grid-cols-2", children: /* @__PURE__ */ jsx(AnimatePresence$1, { mode: "wait", children: cards.map((card, index) => /* @__PURE__ */ jsx(SlideUp, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "p-3 rounded-md bg-primary-foreground text-primary ring-1 ring-border", children: /* @__PURE__ */ jsx(
            DynamicIcon,
            {
              iconName: card?.icon,
              iconLibrary: card?.icon_library,
              "aria-hidden": "true",
              className: "size-8"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h6", { className: "text-lg font-semibold", children: card?.title }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-base/7 text-muted-foreground", children: card?.description })
          ] })
        ] }) }, index)) }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-5", children: /* @__PURE__ */ jsxs("div", { className: "w-full px-8 py-12 mx-auto text-center border shadow-xl bg-card ms:max-w-lg 2xl:px-12 lg:ms-auto rounded-3xl border-t-6 border-t-primary", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "mb-3 text-2xl font-semibold", children: t("start_your_journey") }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("join_our_community_of_successful_predictors") })
        ] }),
        /* @__PURE__ */ jsxs(
          "form",
          {
            onSubmit: (e) => handleStoreNewsletter(e, formData, submit, setFormData),
            className: "flex flex-col gap-6 py-10",
            children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "email-address",
                  name: "email",
                  type: "email",
                  required: true,
                  placeholder: "Enter your email",
                  autoComplete: "email",
                  className: "flex-auto rounded-md px-3.5 py-8 text-base sm:text-sm/6",
                  value: formData.email,
                  onChange: handleInputChange,
                  disabled: isSubmitting
                }
              ),
              serverErrors?.email && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: serverErrors.email }),
              /* @__PURE__ */ jsx(
                FancyButton,
                {
                  label: isSubmitting ? t("subscribing") + "..." : t("subscribe"),
                  size: "xl",
                  type: "submit",
                  disabled: isSubmitting,
                  isLoading: isSubmitting
                }
              )
            ]
          }
        ),
        (terms_conditions_url || privacy_policy_url) && /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          t("by_subscribing_you_agree_to_our "),
          privacy_policy_url && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Link, { href: privacy_policy_url, className: "text-primary hover:underline", children: t("privacy_policy") }),
            t(" and ")
          ] }),
          terms_conditions_url && /* @__PURE__ */ jsx(Link, { href: terms_conditions_url, className: "text-primary hover:underline", children: t("terms_and_condition") })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "absolute top-0 -translate-x-1/2 left-1/2 -z-10 blur-3xl xl:top-6", children: /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
        },
        className: "aspect-1155/678 w-288.75 bg-linear-to-tr from-primary to-primary opacity-5"
      }
    ) })
  ] });
}
const fonts = ["inter", "manrope", "system"];
const topNav = [
  {
    title: "Overview",
    href: "dashboard/overview",
    isActive: true,
    disabled: false
  },
  {
    title: "Customers",
    href: "dashboard/customers",
    isActive: false,
    disabled: true
  },
  {
    title: "Products",
    href: "dashboard/products",
    isActive: false,
    disabled: true
  },
  {
    title: "Settings",
    href: "dashboard/settings",
    isActive: false,
    disabled: true
  }
];
const profileNavItems = [
  {
    title: "Account",
    exact: true,
    href: route("user.profile.index"),
    icon: React__default.createElement(UserCog, { size: 18 }),
    group: "general"
  },
  {
    title: "Sessions",
    exact: true,
    href: route("user.browser.session"),
    icon: React__default.createElement(TabletSmartphone, { size: 18 }),
    group: "general"
  },
  {
    title: "Password",
    exact: true,
    href: route("user.password.index"),
    icon: React__default.createElement(Lock, { size: 18 }),
    group: "security"
  },
  {
    title: "2FA",
    exact: true,
    href: route("user.2fa.index"),
    icon: React__default.createElement(ShieldCheck, { size: 18 }),
    group: "security"
  }
];
const settingsNavItems = [
  {
    title: "General",
    exact: true,
    href: route("admin.settings.index"),
    icon: React__default.createElement(Settings, { size: 18 }),
    group: "general"
  },
  {
    title: "Appearance",
    exact: true,
    href: route("admin.settings.appearance"),
    icon: React__default.createElement(Palette, { size: 18 }),
    group: "general"
  },
  {
    title: "Logo",
    exact: true,
    href: route("admin.settings.logo"),
    icon: React__default.createElement(Image, { size: 18 }),
    group: "general"
  },
  {
    title: "Storage",
    exact: true,
    href: route("admin.settings.storage"),
    icon: React__default.createElement(HardDrive, { size: 18 }),
    group: "general"
  },
  {
    title: "Currency",
    exact: true,
    href: route("admin.settings.currency"),
    icon: React__default.createElement(CurrencyIcon, { size: 18 }),
    group: "general"
  },
  {
    title: "Security Center",
    exact: true,
    href: route("admin.settings.security"),
    icon: React__default.createElement(Shield, { size: 18 }),
    group: "security"
  },
  {
    title: "reCAPTCHA",
    exact: true,
    href: route("admin.settings.recaptcha"),
    icon: React__default.createElement(ShieldCheck, { size: 18 }),
    group: "security"
  },
  {
    title: "Social Login",
    exact: true,
    href: route("admin.settings.social.login"),
    icon: React__default.createElement(Users, { size: 18 }),
    group: "security"
  },
  {
    title: "System Config",
    exact: true,
    href: route("admin.settings.system"),
    icon: React__default.createElement(Cpu, { size: 18 }),
    group: "advanced"
  },
  {
    title: "SEO Settings",
    exact: true,
    href: route("admin.settings.seo"),
    icon: React__default.createElement(Search, { size: 18 }),
    group: "advanced"
  },
  {
    title: "Ticket Configuration",
    exact: true,
    href: route("admin.settings.ticket.configuration"),
    icon: React__default.createElement(Ticket, { size: 18 }),
    group: "advanced"
  }
];
const sectionComponents = {
  hero: HeroSection,
  market: MarketSectionTwo,
  blogs: BlogSection,
  faq: FAQSection,
  how_it_works: HowItWorksSection,
  newsletter: NewsletterSection,
  leaderboard: LeaderboardSection,
  contact_us: ContactSection
};
const currencies = [
  { code: "AED", name: "United Arab Emirates Dirham", symbol: "د.إ" },
  { code: "AFN", name: "Afghan Afghani", symbol: "؋" },
  { code: "ALL", name: "Albanian Lek", symbol: "L" },
  { code: "AMD", name: "Armenian Dram", symbol: "֏" },
  { code: "AOA", name: "Angolan Kwanza", symbol: "Kz" },
  { code: "ARS", name: "Argentine Peso", symbol: "$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "AWG", name: "Aruban Florin", symbol: "ƒ" },
  { code: "AZN", name: "Azerbaijani Manat", symbol: "₼" },
  { code: "BAM", name: "Bosnia-Herzegovina Convertible Mark", symbol: "KM" },
  { code: "BBD", name: "Barbadian Dollar", symbol: "$" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" },
  { code: "BGN", name: "Bulgarian Lev", symbol: "лв" },
  { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب" },
  { code: "BIF", name: "Burundian Franc", symbol: "FBu" },
  { code: "BMD", name: "Bermudian Dollar", symbol: "$" },
  { code: "BND", name: "Brunei Dollar", symbol: "B$" },
  { code: "BOB", name: "Bolivian Boliviano", symbol: "Bs." },
  { code: "BOV", name: "Bolivian Mvdol", symbol: "Mvdol" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "BSD", name: "Bahamian Dollar", symbol: "$" },
  { code: "BTN", name: "Bhutanese Ngultrum", symbol: "Nu" },
  { code: "BWP", name: "Botswana Pula", symbol: "P" },
  { code: "BYN", name: "Belarusian Ruble", symbol: "Br" },
  { code: "BZD", name: "Belize Dollar", symbol: "BZ$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CDF", name: "Congolese Franc", symbol: "FC" },
  { code: "CHE", name: "WIR Euro", symbol: "CHE" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CHW", name: "WIR Franc", symbol: "CHW" },
  { code: "CLF", name: "Unidad de Fomento", symbol: "UF" },
  { code: "CLP", name: "Chilean Peso", symbol: "$" },
  { code: "CNY", name: "Chinese Yuan Renminbi", symbol: "¥" },
  { code: "COP", name: "Colombian Peso", symbol: "$" },
  { code: "COU", name: "Unidad de Valor Real", symbol: "UVR" },
  { code: "CRC", name: "Costa Rican Colón", symbol: "₡" },
  { code: "CUC", name: "Cuban Convertible Peso", symbol: "$" },
  { code: "CUP", name: "Cuban Peso", symbol: "$" },
  { code: "CVE", name: "Cape Verde Escudo", symbol: "$" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč" },
  { code: "DJF", name: "Djiboutian Franc", symbol: "Fdj" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "DOP", name: "Dominican Peso", symbol: "$" },
  { code: "DZD", name: "Algerian Dinar", symbol: "د.ج" },
  { code: "EGP", name: "Egyptian Pound", symbol: "£" },
  { code: "ERN", name: "Eritrean Nakfa", symbol: "Nfk" },
  { code: "ETB", name: "Ethiopian Birr", symbol: "Br" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "FJD", name: "Fijian Dollar", symbol: "FJ$" },
  { code: "FKP", name: "Falkland Islands Pound", symbol: "£" },
  { code: "GBP", name: "Pound Sterling", symbol: "£" },
  { code: "GEL", name: "Georgian Lari", symbol: "₾" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵" },
  { code: "GIP", name: "Gibraltar Pound", symbol: "£" },
  { code: "GMD", name: "Gambian Dalasi", symbol: "D" },
  { code: "GNF", name: "Guinean Franc", symbol: "FG" },
  { code: "GTQ", name: "Guatemalan Quetzal", symbol: "Q" },
  { code: "GYD", name: "Guyanese Dollar", symbol: "$" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "HNL", name: "Honduran Lempira", symbol: "L" },
  { code: "HRK", name: "Croatian Kuna", symbol: "kn" },
  { code: "HTG", name: "Haitian Gourde", symbol: "G" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "ILS", name: "Israeli New Shekel", symbol: "₪" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "IQD", name: "Iraqi Dinar", symbol: "ع.د" },
  { code: "IRR", name: "Iranian Rial", symbol: "﷼" },
  { code: "ISK", name: "Icelandic Króna", symbol: "kr" },
  { code: "JMD", name: "Jamaican Dollar", symbol: "$" },
  { code: "JOD", name: "Jordanian Dinar", symbol: "د.ا" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "KGS", name: "Kyrgyzstani Som", symbol: "лв" },
  { code: "KHR", name: "Cambodian Riel", symbol: "៛" },
  { code: "KMF", name: "Comorian Franc", symbol: "FC" },
  { code: "KPW", name: "North Korean Won", symbol: "₩" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك" },
  { code: "KYD", name: "Cayman Islands Dollar", symbol: "$" },
  { code: "KZT", name: "Kazakhstani Tenge", symbol: "₸" },
  { code: "LAK", name: "Lao Kip", symbol: "₭" },
  { code: "LBP", name: "Lebanese Pound", symbol: "ل.ل" },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs" },
  { code: "LRD", name: "Liberian Dollar", symbol: "$" },
  { code: "LSL", name: "Lesotho Loti", symbol: "L" },
  { code: "LYD", name: "Libyan Dinar", symbol: "ل.د" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "د.م" },
  { code: "MDL", name: "Moldovan Leu", symbol: "L" },
  { code: "MGA", name: "Malagasy Ariary", symbol: "Ar" },
  { code: "MKD", name: "Macedonian Denar", symbol: "ден" },
  { code: "MMK", name: "Myanmar Kyat", symbol: "K" },
  { code: "MNT", name: "Mongolian Tögrög", symbol: "₮" },
  { code: "MOP", name: "Macanese Pataca", symbol: "MOP$" },
  { code: "MRU", name: "Mauritanian Ouguiya", symbol: "UM" },
  { code: "MUR", name: "Mauritian Rupee", symbol: "₨" },
  { code: "MVR", name: "Maldivian Rufiyaa", symbol: "ރ" },
  { code: "MWK", name: "Malawian Kwacha", symbol: "MK" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "MXV", name: "Mexican Unidad de Inversion", symbol: "MXV" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "MZN", name: "Mozambican Metical", symbol: "MT" },
  { code: "NAD", name: "Namibian Dollar", symbol: "$" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "NIO", name: "Nicaraguan Córdoba", symbol: "C$" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "NPR", name: "Nepalese Rupee", symbol: "₨" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "OMR", name: "Omani Rial", symbol: "ر.ع" },
  { code: "PAB", name: "Panamanian Balboa", symbol: "B/." },
  { code: "PEN", name: "Peruvian Nuevo Sol", symbol: "S/." },
  { code: "PGK", name: "Papua New Guinean Kina", symbol: "K" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
  { code: "PLN", name: "Polish Złoty", symbol: "zł" },
  { code: "PYG", name: "Paraguayan Guaraní", symbol: "₲" },
  { code: "QAR", name: "Qatari Riyal", symbol: "ر.ق" },
  { code: "RON", name: "Romanian Leu", symbol: "lei" },
  { code: "RSD", name: "Serbian Dinar", symbol: "дин." },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  // Note: repeated with CNY above
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "RWF", name: "Rwandan Franc", symbol: "FRw" },
  { code: "SAR", name: "Saudi Riyal", symbol: "ر.س" },
  { code: "SBD", name: "Solomon Islands Dollar", symbol: "$" },
  { code: "SCR", name: "Seychelles Rupee", symbol: "₨" },
  { code: "SDG", name: "Sudanese Pound", symbol: "ج.س" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "SHP", name: "Saint Helena Pound", symbol: "£" },
  { code: "SLL", name: "Sierra Leonean Leone", symbol: "Le" },
  { code: "SOS", name: "Somali Shilling", symbol: "Sh" },
  { code: "SRD", name: "Surinamese Dollar", symbol: "$" },
  { code: "SSP", name: "South Sudanese Pound", symbol: "SSP" },
  { code: "STN", name: "São Tomé and Príncipe Dobra", symbol: "Db" },
  { code: "SYP", name: "Syrian Pound", symbol: "£" },
  { code: "SZL", name: "Eswatini Lilangeni", symbol: "L" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "TJS", name: "Tajikistani Somoni", symbol: "ЅМ" },
  { code: "TMT", name: "Turkmenistan Manat", symbol: "m" },
  { code: "TND", name: "Tunisian Dinar", symbol: "د.ت" },
  { code: "TOP", name: "Tongan Paʻanga", symbol: "T$" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "TTD", name: "Trinidad and Tobago Dollar", symbol: "TT$" },
  { code: "TWD", name: "New Taiwan Dollar", symbol: "NT$" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "Sh" },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh" },
  { code: "USD", name: "United States Dollar", symbol: "$" },
  { code: "UYU", name: "Uruguayan Peso", symbol: "$" },
  { code: "UZS", name: "Uzbekistan Som", symbol: "лв" },
  { code: "VES", name: "Venezuelan Bolívar Soberano", symbol: "Bs.S" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
  { code: "VUV", name: "Vanuatu Vatu", symbol: "Vt" },
  { code: "WST", name: "Samoan Tala", symbol: "T" },
  { code: "XAF", name: "CFA Franc BEAC", symbol: "FCFA" },
  { code: "XCD", name: "East Caribbean Dollar", symbol: "$" },
  { code: "XOF", name: "CFA Franc BCEAO", symbol: "CFA" },
  { code: "XPF", name: "CFP Franc", symbol: "₣" },
  { code: "YER", name: "Yemeni Rial", symbol: "﷼" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "ZMW", name: "Zambian Kwacha", symbol: "ZK" },
  { code: "ZWL", name: "Zimbabwean Dollar", symbol: "Z$" }
];
export {
  Switch as S,
  Textarea as T,
  sectionComponents as a,
  currencies as c,
  fonts as f,
  profileNavItems as p,
  settingsNavItems as s,
  topNav as t
};

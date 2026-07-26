import { jsx } from "react/jsx-runtime";
import "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7;
function getCookie(name) {
  if (typeof document === "undefined") return void 0;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue;
  }
  return void 0;
}
function setCookie(name, value, maxAge = DEFAULT_MAX_AGE) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
}
function removeCookie(name) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}
const isMenuActive = (url, item) => {
  const currentPath = new URL(url, window.location.origin).pathname;
  const itemPath = new URL(item.href, window.location.origin).pathname;
  return currentPath.startsWith(itemPath) && itemPath !== "/";
};
const handleImageChange = (e, onChange, setImagePreview) => {
  const file = e.target.files?.[0];
  if (file) {
    onChange(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }
};
const getSettings = (settings, key, defaultValue = null) => {
  const setting = settings?.find((setting2) => setting2?.key === key);
  return setting ? setting?.value : defaultValue;
};
const keyToValue = (text) => {
  const cleaned = text.replace(/[^A-Za-z0-9 ]/g, " ");
  if (!cleaned) return "";
  return cleaned[0].toUpperCase() + cleaned.slice(1);
};
const valueToKey = (text, separator = "_") => {
  try {
    return text.replace(/\s+/g, separator).toLowerCase();
  } catch (error) {
    return text;
  }
};
const convertFiltersToArrayFormat = (filters) => {
  const converted = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value && typeof value === "string") {
      converted[key] = value.split(",").filter((v) => v.trim() !== "");
    } else if (Array.isArray(value)) {
      converted[key] = value;
    }
  });
  return converted;
};
const handleCopyKey = (text) => {
  navigator.clipboard.writeText(text);
  toast.success(`Copied`);
};
const isDarkMode = (siteSettings) => {
  return siteSettings?.theme_mode == "dark";
};
const stripTags = (html) => {
  if (!html) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent || "";
};
const limitText = (html, limit = 100, endsWith = "....") => {
  const text = stripTags(html).trim();
  return text.length > limit ? text.substring(0, limit) + endsWith : text;
};
const getDir = () => document.documentElement.getAttribute("dir") || "ltr";
const isRTL = () => getDir() === "rtl";
const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric"
});
const formatVolume = (volume) => {
  if (volume >= 1e6) return `$${(volume / 1e6).toFixed(1)}M`;
  if (volume >= 1e3) return `$${(volume / 1e3).toFixed(1)}K`;
  return `$${volume.toFixed(0)}`;
};
const calculateTrade = (amount, price) => {
  const numericAmount = parseFloat(amount || "0");
  const shares = numericAmount > 0 ? Math.floor(numericAmount / price) : 0;
  const potentialPayout = shares * 1;
  const profit = potentialPayout - numericAmount;
  return { shares, potentialPayout, profit };
};
const getSectionData = (data) => {
  return data?.config?.data?.value;
};
const getSiteSettings = (settings, key) => {
  try {
    return settings[key] || null;
  } catch (error) {
    return null;
  }
};
const sanitizeHTML = (html) => {
  if (!html) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const allowedTags = [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "blockquote",
    "code",
    "pre",
    "a",
    "span",
    "div"
  ];
  const allowedAttributes = {
    "a": ["href", "title", "target"],
    "span": ["class"],
    "div": ["class"]
  };
  const sanitizeNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }
    const tagName = node.tagName.toLowerCase();
    if (!allowedTags.includes(tagName)) {
      return Array.from(node.childNodes).map(sanitizeNode).join("");
    }
    let result = `<${tagName}`;
    if (allowedAttributes[tagName]) {
      Array.from(node.attributes).forEach((attr) => {
        if (allowedAttributes[tagName].includes(attr.name)) {
          if (attr.name === "href") {
            const href = attr.value.trim().toLowerCase();
            if (href.startsWith("javascript:") || href.startsWith("data:") || href.startsWith("vbscript:")) {
              return;
            }
          }
          result += ` ${attr.name}="${attr.value.replace(/"/g, "&quot;")}"`;
        }
      });
    }
    result += ">";
    Array.from(node.childNodes).forEach((child) => {
      result += sanitizeNode(child);
    });
    result += `</${tagName}>`;
    return result;
  };
  const bodyContent = Array.from(doc.body.childNodes).map(sanitizeNode).join("");
  return bodyContent;
};
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
export {
  Button as B,
  cn as a,
  buttonVariants as b,
  convertFiltersToArrayFormat as c,
  getSiteSettings as d,
  getSectionData as e,
  isRTL as f,
  getCookie as g,
  handleCopyKey as h,
  isDarkMode as i,
  calculateTrade as j,
  keyToValue as k,
  limitText as l,
  formatVolume as m,
  formatDate as n,
  handleImageChange as o,
  isMenuActive as p,
  getSettings as q,
  removeCookie as r,
  setCookie as s,
  sanitizeHTML as t,
  valueToKey as v
};

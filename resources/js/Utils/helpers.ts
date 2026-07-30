import clsx from "clsx";
import { toast as reactHotToast } from "react-hot-toast";
import { twMerge } from "tailwind-merge";

/**
 * Get asset URL
 */
export const getAssetUrl = (path: string): string => `/${path}`;

/**
 * Get uploaded image URL
 */
export const getUploadUrl = (path: string): string => `/images/uploads/${path}`;

/**
 * Merge class names
 */
export function cn(...inputs: any[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Sleep for ms milliseconds
 */
export function sleep(ms = 1000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Pagination helper
 */
export function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  const maxVisiblePages = 5;
  const rangeWithDots: (number | string)[] = [];

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) rangeWithDots.push(i);
  } else {
    rangeWithDots.push(1);

    if (currentPage <= 3) {
      for (let i = 2; i <= 4; i++) rangeWithDots.push(i);
      rangeWithDots.push("...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      rangeWithDots.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) rangeWithDots.push(i);
    } else {
      rangeWithDots.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) rangeWithDots.push(i);
      rangeWithDots.push("...", totalPages);
    }
  }

  return rangeWithDots;
}

/**
 * Cookie utilities
 */
const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7;

export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${encodeURIComponent(name)}=`);
  if (parts.length !== 2) return undefined;

  const raw = parts.pop()?.split(";").shift();
  if (raw === undefined) return undefined;

  try {
    return decodeURIComponent(raw);
  } catch {
    // A cookie written by another tool may not be percent-encoded.
    return raw;
  }
}

export function setCookie(name: string, value: string, maxAge = DEFAULT_MAX_AGE): void {
  if (typeof document === "undefined") return;

  // SameSite=Lax so the cookie survives top-level navigations back to the site
  // (the server needs it to stamp the theme before first paint), while still
  // being withheld from cross-site subrequests. Secure only on HTTPS so local
  // http:// development keeps working.
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value
  )}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
}

export function removeCookie(name: string): void {
  if (typeof document === "undefined") return;

  document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Check if menu is active
 */
export const isMenuActive = (url: string, item: { href: string }): boolean => {
  const currentPath = new URL(url, window.location.origin).pathname;
  const itemPath = new URL(item.href, window.location.origin).pathname;
  return currentPath.startsWith(itemPath) && itemPath !== "/";
};

/**
 * Handle image file change
 */
export const handleImageChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  onChange: (file: File) => void,
  setImagePreview: any
): void => {
  const file = e.target.files?.[0];
  if (!file) return;

  onChange(file);
  const reader = new FileReader();
  reader.onloadend = () => setImagePreview(reader.result);
  reader.readAsDataURL(file);
};

/**
 * Get setting by key
 */
export const getSettings = (
  settings: { slug: string; value: any }[] | undefined,
  key: string,
  defaultValue: any = null
): any => {
  const setting = settings?.find((s) => s.slug === key);
  return setting ? setting.value : defaultValue;
};

/**

/**
 * Converts a key string (e.g., snake_case) to human-readable value
 * @param text - The string to convert
 * @returns Human-readable string with first letter capitalized
 */
export const keyToValue = (text?: string): string => {
  if (!text) return ""; // handle undefined or empty string
  const cleaned = text.replace(/[^A-Za-z0-9 ]/g, " ");
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};


export const valueToKey = (text: string, separator = "_"): string => {
  try {
    return text.replace(/\s+/g, separator).toLowerCase();
  } catch {
    return text;
  }
};

/**
 * Convert filters object to array format
 */
export const convertFiltersToArrayFormat = (filters: Record<string, any>): Record<string, any[]> => {
  const converted: Record<string, any[]> = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (typeof value === "string" && value) converted[key] = value.split(",").filter((v) => v.trim() !== "");
    else if (Array.isArray(value)) converted[key] = value;
  });
  return converted;
};

/**
 * Copy to clipboard
 */
export const handleCopyKey = (text: string): void => {
  if (!navigator?.clipboard) return; // safeguard for older browsers
  navigator.clipboard.writeText(text).then(() => {
    reactHotToast.success("Copied!"); // use named import
  });
};

/**
 * Theme mode check
 */
export const isDarkMode = (siteSettings: { theme_mode?: string } | undefined): boolean => {
  return siteSettings?.theme_mode === "dark";
};

/**
 * HTML utilities
 */
export const stripTags = (html?: string): string => {
  if (!html) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

export const limitText = (html: string, limit = 100, endsWith = "...."): string => {
  const text = stripTags(html).trim();
  return text.length > limit ? text.substring(0, limit) + endsWith : text;
};

/**
 * UUID generator
 */
export const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Download file
 */
export const downloadFile = (url: string): void => {
  if (typeof window !== "undefined") window.location.href = url;
};

/**
 * Direction utilities
 */
export const getDir = (): "ltr" | "rtl" => document.documentElement.getAttribute("dir") as "ltr" | "rtl" || "ltr";
export const isRTL = (): boolean => getDir() === "rtl";

/**
 * Formatting
 */
export const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const formatVolume = (volume: number): string => {
  if (volume >= 1_000_000) return `$${(volume / 1_000_000).toFixed(1)}M`;
  if (volume >= 1_000) return `$${(volume / 1_000).toFixed(1)}K`;
  return `$${volume.toFixed(0)}`;
};

export const calculateTrade = (amount: number | string, price: number): { shares: number; potentialPayout: number; profit: number } => {
  const numericAmount = parseFloat(amount as string || "0");
  const shares = numericAmount > 0 ? Math.floor(numericAmount / price) : 0;
  const potentialPayout = shares * 1.0;
  const profit = potentialPayout - numericAmount;
  return { shares, potentialPayout, profit };
};

/**
 * Section and site settings helpers
 */
export const getSiteSettings = (settings: Record<string, any>, key: string): any => settings[key] || null;

/**
 * Sanitize HTML
 */
export const sanitizeHTML = (html?: string): string => {
  if (!html) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const allowedTags = [
    "p", "br", "strong", "em", "u", "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li", "blockquote", "code", "pre", "a", "span", "div",
  ];

  const allowedAttributes: Record<string, string[]> = {
    a: ["href", "title", "target"],
    span: ["class"],
    div: ["class"],
  };

  /**
   * Sanitize a single DOM node
   * @param node - Node to sanitize
   * @returns Sanitized HTML string
   */
  const sanitizeNode = (node: Node): string => {
    // Return text content for text nodes
    if (node.nodeType === Node.TEXT_NODE) return node.textContent || "";

    // Skip non-element nodes
    if (node.nodeType !== Node.ELEMENT_NODE) return "";

    const element = node as HTMLElement;
    const tagName = element.tagName.toLowerCase();

    // If tag is not allowed, recursively sanitize children
    if (!allowedTags.includes(tagName)) {
      return Array.from(element.childNodes).map(sanitizeNode).join("");
    }

    // Start opening tag
    let result = `<${tagName}>`;

    // Handle allowed attributes safely
    const attrs = allowedAttributes[tagName as keyof typeof allowedAttributes];
    if (attrs) {
      Array.from(element.attributes).forEach((attr) => {
        if (attrs.includes(attr.name)) {
          // Extra security for href
          if (
            attr.name === "href" &&
            /^(javascript:|data:|vbscript:)/i.test(attr.value.trim())
          ) {
            return;
          }
          result = result.replace(
            `>`,
            ` ${attr.name}="${attr.value.replace(/"/g, "&quot;")}">`
          );
        }
      });
    }

    // Sanitize child nodes recursively
    Array.from(element.childNodes).forEach((child) => {
      result += sanitizeNode(child);
    });

    // Close tag
    result += `</${tagName}>`;

    return result;
  };

  return Array.from(doc.body.childNodes).map(sanitizeNode).join("");
};



export const getInitials = (
  name: string | undefined | null,
  start: number = 0,
  length: number = 2,
  defaultValue: string = "D"
): string => {
  if (!name) return defaultValue;
  return name.substring(start, start + length).toUpperCase();
};



export function countActiveFilters(currentFilters: Record<string, any>): number {
  const ignoredKeys = ['page', 'sort_by', 'sort_direction', 'format', 'is_trash'];

  return Object.keys(currentFilters).filter((key) => {
    if (ignoredKeys.includes(key)) return false;

    const value = currentFilters[key];
    if (Array.isArray(value)) return value.length > 0;

    return Boolean(value);
  }).length;
}



export function getMaxSizeInMB(bytes?: number | null): any {
  if (!bytes || bytes <= 0) return 0;
  return (bytes / (1024 * 1024)).toFixed(2);
}

export function getImageTypes(types?: string): string[] {

  return [
    "png", "jpg", "jpeg", "webp"
  ];

}


export function getLogoBykey(logos: any, key: string): any {
  return logos[key];
}



/**
 * Returns a CSS grid column span string based on the given grid column string
 * 
 * If no grid column string is provided, returns 'col-span-1'
 * 
 * If the grid column string does not match the expected format (e.g. 'span 1'),
 * returns 'col-span-1'
 * 
 * If the grid column string matches the expected format, returns a CSS grid column
 * span string based on the given span value. The span value is capped at 2 for
 * small screen sizes (sm) and uses the original value for large screen sizes (lg)
 * 
 * @param {string | undefined} gridColumn - The grid column string to parse
 * @returns {string} - The resulting CSS grid column span string
 */
export function getGridColSpan(gridColumn: string | undefined): string {
  if (!gridColumn) return 'col-span-1';

  const match = gridColumn.match(/span\s+(\d+)/);
  if (!match) return 'col-span-1';

  const span = parseInt(match[1]!);

  return `col-span-full sm:col-span-${span} lg:col-span-${span}`;
}




/**
 * Sentinel for a Radix `SelectItem` that means "no value".
 *
 * Radix throws `A <Select.Item /> must have a value prop that is not an empty
 * string`, because it reserves `''` for clearing the trigger. Option lists —
 * both the CRUD configs and every server-built `advanceFilterOptions` /
 * "All statuses" list — legitimately contain an empty-valued entry, so it is
 * rendered under this sentinel and mapped back to `null` before submit.
 */
export const EMPTY_SELECT_VALUE = '__none__';

/** Whether an option or form value represents "nothing selected". */
export const isEmptySelectValue = (value: unknown): boolean =>
  value === '' ||
  value === null ||
  value === undefined ||
  value === 'null' ||
  value === EMPTY_SELECT_VALUE;

/**
 * Check if user has permission for a single item
 * Handles both 'permission' (single) and 'permissionsAny' (multiple OR logic)
 */
export const hasPermission = (item: any, can: any): boolean => {
  // If no permission requirements, DENY by default
  if (!item.permission && !item.permissionsAny) {
    return true
  }

  // Check single permission (AND logic)
  if (item.permission) {
    return can(item.permission)
  }

  // Check multiple permissions (OR logic) - user needs at least one
  if (item.permissionsAny && Array.isArray(item.permissionsAny)) {
    return can(item.permissionsAny);

  }

  return false
}

/**
 * Check if user can access a group
 * Groups have permissionsAny requirements
 */
export const canAccessGroup = (group: any, can: any): boolean => {
  // If group has no permissions defined, deny access
  if (!group.permission && !group.permissionsAny) {
    return true
  }

  // If group has permission requirements, check them
  if (group.permissionsAny && Array.isArray(group.permissionsAny)) {
    return can(group.permissionsAny)
  }

  // If group has single permission requirement
  if (group.permission) {
    return can(group.permission)
  }

  return false
}


/**
 * Filter items based on permissions
 * Removes items user doesn't have access to
 */
export const getAccessibleItems = (items: any[], can: any): any[] => {

  return items
    .map((navItem: any) => {
      // Check if main item has permission
      if (!hasPermission(navItem, can)) {
        return null
      }

      // If item has subitems, filter those
      if (navItem.items && Array.isArray(navItem.items)) {
        const accessibleSubItems = navItem.items.filter((subItem: any) =>
          hasPermission(subItem, can)
        )

        // Only return item if it has accessible subitems
        if (accessibleSubItems.length > 0) {
          return { ...navItem, items: accessibleSubItems }
        }

        // If no subitems are accessible but item has a direct URL, keep it
        if (navItem.url) {
          return navItem
        }

        // Item has no accessible subitems and no direct URL
        return null
      }

      // Item has no subitems, return as is
      return navItem
    })
    .filter((item: any) => item !== null)
}

export const buildRouteParams = (
  routeParams: any,
  replacements: any[] = []
): any => {
  const updatedParams = { ...routeParams };

  // Helper function to escape regex special characters
  const escapeRegex = (str: string): string => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  for (const key in updatedParams) {
    if (typeof updatedParams[key] === 'string') {
      // Loop through replacements array and apply each one
      for (const { pattern, value } of replacements) {
        // Escape the pattern before creating regex
        const escapedPattern = escapeRegex(pattern);
        updatedParams[key] = updatedParams[key].replace(
          new RegExp(escapedPattern, 'g'),
          String(value)
        );
      }
    }
  }


  return updatedParams;
}


export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  }

  const suffixes = [
    { value: 1e12, suffix: 't' }, // trillion
    { value: 1e9, suffix: 'b' },  // billion
    { value: 1e6, suffix: 'm' },  // million
    { value: 1e3, suffix: 'k' }   // thousand
  ];

  for (const { value, suffix } of suffixes) {
    if (num >= value) {
      const formatted = num / value;
      // Remove unnecessary decimals if whole number
      const display = formatted % 1 === 0
        ? formatted.toString()
        : formatted.toFixed(1);
      return `${display}${suffix}`;
    }
  }

  return num.toString();
}


export const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);




export function generateUniqueIdByRule(type: string, seqLength: any, suffix: string, prefix: string, sequenceStart: any): string {


  let exampleSeq = '';

  switch (type) {
    case 'sequential':
      // Sequential: Use sequence_start value (e.g., if start=2: 0002, 0003, 0004...)
      const startNumber = sequenceStart || 1;
      exampleSeq = String(startNumber).padStart(seqLength, '0');
      break;

    case 'random_number':
      // Random Number: Generate random digits (0-9)
      exampleSeq = Array.from({ length: seqLength }, () =>
        Math.floor(Math.random() * 10)
      ).join('');
      break;

    case 'random_string':
      // Random String: Generate random uppercase letters (A-Z)
      exampleSeq = Array.from({ length: seqLength }, () =>
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      ).join('');
      break;

    case 'random_alphanumeric':
      // Random Alphanumeric: Generate random letters and numbers
      const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      exampleSeq = Array.from({ length: seqLength }, () =>
        alphanumeric[Math.floor(Math.random() * alphanumeric.length)]
      ).join('');
      break;

    case 'year_based':
      // Year Based: Current year + sequence (e.g., 2024001)
      const currentYear = new Date().getFullYear();
      const yearSeqNum = String(sequenceStart || 1).padStart(Math.max(1, seqLength - 4), '0');
      exampleSeq = `${currentYear}${yearSeqNum}`;
      break;

    case 'date_based':
      // Date Based: Current date (YYYYMMDD) + sequence (e.g., 20240203001)
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const dateSeqNum = String(sequenceStart || 1).padStart(Math.max(1, seqLength - 8), '0');
      exampleSeq = `${year}${month}${day}${dateSeqNum}`;
      break;

    case 'uuid_short':
      // UUID Short: Generate short UUID-style sequence (alphanumeric lowercase)
      const uuidChars = '0123456789abcdef';
      exampleSeq = Array.from({ length: seqLength }, () =>
        uuidChars[Math.floor(Math.random() * uuidChars.length)]
      ).join('');
      break;

    default:
      // Fallback
      exampleSeq = '0'.repeat(Math.max(0, seqLength - 1)) + '1';
  }

  return `${prefix}${exampleSeq}${suffix}`;


}




export const toUTCString = (val?: string | null) => {
  if (!val) return null;
  return new Date(val).toISOString();
};
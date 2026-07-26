import { cn } from "@/Utils/helpers";
import { Link } from "@inertiajs/react";
import { ChevronRight, Home, MoreHorizontal } from "lucide-react";
import React, { useState } from "react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const [expanded, setExpanded] = useState(false);

  const shouldCollapse = items.length > 3 && !expanded;
  const visibleItems = shouldCollapse
    ? [items[0], null, items[items.length - 1]]
    : items;

  return (
    <nav aria-label="breadcrumb" className="flex items-center min-w-0 w-full">
      <ol className="flex items-center gap-1 text-sm text-muted-foreground min-w-0 w-full flex-wrap sm:flex-nowrap">
        {visibleItems.map((item, index) => {
          // Collapsed placeholder
          if (item === null) {
            return (
              <li key="collapsed" className="flex items-center shrink-0">
                <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground shrink-0" />
                <button
                  onClick={() => setExpanded(true)}
                  className="flex items-center px-1 rounded hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Show full path"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </li>
            );
          }

          // Real index in the original array (needed for styling first item)
          const originalIndex = items.indexOf(item as any);

          return (
            <li
              key={index}
              className={cn(
                "flex items-center min-w-0",
                // Last item can shrink/truncate; others are fixed
                index === visibleItems.length - 1 ? "min-w-0 truncate" : "shrink-0"
              )}
            >
              {index > 0 && (
                <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground shrink-0" />
              )}
              {item?.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 hover:text-foreground transition-colors truncate",
                    originalIndex === 0 ? "text-muted-foreground shrink-0" : "text-foreground truncate"
                  )}
                  title={item.label}
                >
                  {originalIndex === 0 && <Home className="w-4 h-4 shrink-0" />}
                  <span className={cn(originalIndex === 0 ? "hidden sm:inline" : "truncate")}>
                    {item?.label}
                  </span>
                </Link>
              ) : (
                <span
                  className="font-medium text-foreground truncate"
                  title={item?.label}
                >
                  {item?.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
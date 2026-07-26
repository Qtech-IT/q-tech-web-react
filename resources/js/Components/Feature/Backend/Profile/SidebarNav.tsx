import { buttonVariants } from "@/Components/UI/Button";
import { ScrollArea } from "@/Components/UI/ScrollArea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/UI/Select";
import { cn, isMenuActive } from "@/Utils/helpers";
import { Link, router } from "@inertiajs/react";
import { Check } from "lucide-react";
import React, { ReactNode, useMemo } from "react";

export interface SidebarItem {
  title: string;
  href?: string;
  url?: string;
  icon?: ReactNode;
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  items: SidebarItem[];
  url: string;
  title: string;
  className?: string;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  className,
  items,
  url,
  title,
  ...props
}) => {
  const handleSelect = (selectedHref: string) => {
    router.visit(selectedHref);
  };

  const renderIcon = (icon?: ReactNode) => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === "function") return React.createElement(icon);
    return null;
  };

  const groupedItems = useMemo(() => {
    const groups = [
      {
        id: Math.random().toString(36).substr(2, 9),
        label: "General",
        items: items.filter((item: any) =>
          item?.group! === "general"
        ),
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        label: "Security",
        items: items.filter((item: any) =>
          item?.group! === "security"
        ),
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        label: "Advanced",
        items: items.filter((item: any) =>
          item?.group! === "advanced"
        ),
      },
    ].filter((group) => group.items.length > 0);

    return groups.map(group => ({
      ...group,
      items: group.items.map((item, idx) => ({
        ...item,
        _id: Math.random().toString(36).substr(2, 9) + idx
      }))
    }));
  }, [items]);

  return (
    <>
      {/* Mobile Select */}
      <div className="p-1 md:hidden">
        <Select onValueChange={handleSelect} value={url}>
          <SelectTrigger className="h-12 sm:w-48">
            <SelectValue placeholder={title} />
            {title}
          </SelectTrigger>
          <SelectContent>

            {groupedItems?.map((group) => (

              <div key={group.id}>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  {group.label}
                </div>
                {group.items.map((item) => {
                  const isActive = isMenuActive(url, item as any);
                  return (
                    <SelectItem
                      key={item._id}
                      value={item.href || ""}
                      className={cn(
                        "cursor-pointer",
                        isActive && "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      <div className="flex items-center gap-x-3">
                        {renderIcon(item.icon as any)}
                        <span className="text-sm">{item.title}</span>
                        {isActive && (
                          <Check className="ml-2 h-4 w-4 text-primary" />
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </div>

            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Sidebar */}
      <ScrollArea className="hidden w-full h-[calc(100vh-12rem)] md:block">
        <nav
          className={cn("flex flex-col space-y-6 px-2 py-2", className)}
          {...props}
        >
          {groupedItems.map((group) => (
            <div key={group.id} className="space-y-2">
              <div className="px-3 py-1.5">
                <h4 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                  {group.label}
                </h4>
              </div>

              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href || "#"}
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.href) {
                        router.visit(item.href, {
                          preserveScroll: true,
                          preserveState: true,
                        });
                      }
                    }}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "justify-start w-full transition-all duration-200",
                      isMenuActive(url, item as any)
                        ? "bg-primary/10 text-primary hover:bg-primary/15 font-medium border-l-2 border-primary"
                        : "hover:bg-accent hover:text-accent-foreground border-l-2 border-transparent"
                    )}
                  >
                    {renderIcon(item.icon as any)}
                    <span className="truncate ml-3">{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </>
  );
};
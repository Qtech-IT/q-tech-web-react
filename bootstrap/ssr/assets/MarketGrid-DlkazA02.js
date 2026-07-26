import { Link } from "@inertiajs/react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { motion } from "framer-motion";
import { ArrowLeft, CheckIcon, ChevronDownIcon, ChevronUpIcon, Clock3, ListRestart, MoveRight, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { BsBookmark, BsBookmarkCheckFill } from "react-icons/bs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import { B as Button, a as cn, n as formatDate, m as formatVolume, v as valueToKey } from "./Button-CFMlPXiE.js";
import { C as Card, a as CardContent } from "./Card-CQ2ij0--.js";
import { E as EmptyData } from "./EmptyData-DjqqIMwS.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import { P as Progress } from "./Progress-DT6CA82_.js";
import { A as Avatar, s as AvatarImage, N as FancyButton } from "./Sheet-B-_2BaZp.js";
import { f as CollapseWrapper, h as TradeDialog, g as TradeForm } from "./TradeDialog-Dt4WEyMP.js";
function Select(props) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Root, { "data-slot": "select", ...props });
}
function SelectValue(props) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Value, { "data-slot": "select-value", ...props });
}
function SelectTrigger({ className, size = "default", children, ...props }) {
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Trigger,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4 opacity-50" }) })
      ]
    }
  );
}
function SelectContent({ className, children, position = "popper", ...props }) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Portal, {
    children: /* @__PURE__ */ jsxs(
      SelectPrimitive.Content,
      {
        "data-slot": "select-content",
        className: cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        ),
        position,
        ...props,
        children: [
        /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsx(
          SelectPrimitive.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsx(SelectScrollDownButton, {})
        ]
      }
    )
  });
}
function SelectItem({ className, children, ...props }) {
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Item,
    {
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 ps-2 pe-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: "absolute end-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(CheckIcon, { className: "size-4" }) }) }),
        /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
      ]
    }
  );
}
function SelectScrollUpButton({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollUpButton,
    {
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronUpIcon, { className: "size-4" })
    }
  );
}
function SelectScrollDownButton({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollDownButton,
    {
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4" })
    }
  );
}
const MarketFilters = ({
  isOpen,
  setIsOpen,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedTimeframe,
  setSelectedTimeframe,
  selectedVolume,
  setSelectedVolume,
  selectedStatus,
  setSelectedStatus,
  categories,
  timeframes,
  clearMarketFilter,
  handelCollapseOpen,
  handelCollapseClose
}) => {
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
    /* @__PURE__ */ jsxs("div", {
      className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-foreground", children: "Active Markets" }),
      /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: () => {
              clearMarketFilter();
              handelCollapseClose();
            },
            size: "icon",
            className: "text-red-500 bg-red-100 cursor-pointer size-8 hover:bg-red-600 hover:text-red-100",
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
            className: "cursor-pointer size-8",
            onClick: handelCollapseOpen,
            children: [
              /* @__PURE__ */ jsx(SlidersHorizontal, { className: "size-4" }),
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Filter" })
            ]
          }
        )
        ]
      })
      ]
    }),
    /* @__PURE__ */ jsx(CollapseWrapper, {
      open: isOpen, onOpenChange: setIsOpen, children: /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-12 gap-4 mt-3 lg:gap-5", children: [
      /* @__PURE__ */ jsx("div", {
          className: "w-full lg:col-span-3 md:col-span-6 col-span-full", children: /* @__PURE__ */ jsxs("div", {
            className: "relative w-full group", children: [
        /* @__PURE__ */ jsx(
              Search,
              {
                className: "absolute w-4 h-4 transition-colors transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground group-focus-within:text-primary"
              }
            ),
        /* @__PURE__ */ jsx(
              Input,
              {
                id: "search-input",
                placeholder: "Search markets...",
                className: "pl-10 transition-all duration-200 shadow-none h-9 border-border bg-background/50 focus:border-primary/50 hover:bg-background/70",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value)
              }
            )
            ]
          })
        }),
      /* @__PURE__ */ jsx("div", {
          className: "w-full col-span-6 lg:col-span-3 md:col-span-6", children: /* @__PURE__ */ jsxs(
            Select,
            {
              className: "w-full",
              value: selectedCategory,
              onValueChange: setSelectedCategory,
              children: [
            /* @__PURE__ */ jsx(
                SelectTrigger,
                {
                  id: "category-select",
                  className: "w-full h-8 shadow-none cursor-pointer border-border",
                  children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "All Categories" })
                }
              ),
            /* @__PURE__ */ jsx(SelectContent, {
                children: categories.map((category) => /* @__PURE__ */ jsx(
                  SelectItem,
                  {
                    value: valueToKey(category.label),
                    children: /* @__PURE__ */ jsxs("p", {
                      className: "flex items-center gap-4", children: [
                        category.label,
                  /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: category.count })
                      ]
                    })
                  },
                  valueToKey(category.label)
                ))
              })
              ]
            }
          )
        }),
      /* @__PURE__ */ jsx("div", {
          className: "w-full col-span-6 lg:col-span-2 md:col-span-4", children: /* @__PURE__ */ jsxs(
            Select,
            {
              className: "w-full",
              value: selectedTimeframe,
              onValueChange: setSelectedTimeframe,
              children: [
            /* @__PURE__ */ jsx(
                SelectTrigger,
                {
                  id: "timeframe-select",
                  className: "w-full h-8 shadow-none cursor-pointer",
                  children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "All Timeframes" })
                }
              ),
            /* @__PURE__ */ jsx(SelectContent, {
                children: timeframes.map((time) => /* @__PURE__ */ jsx(
                  SelectItem,
                  {
                    value: valueToKey(time.label),
                    children: time.label
                  },
                  valueToKey(time.label)
                ))
              })
              ]
            }
          )
        }),
      /* @__PURE__ */ jsx("div", {
          className: "w-full col-span-6 lg:col-span-2 md:col-span-4", children: /* @__PURE__ */ jsxs(
            Select,
            {
              className: "w-full",
              value: selectedVolume,
              onValueChange: setSelectedVolume,
              children: [
            /* @__PURE__ */ jsx(
                SelectTrigger,
                {
                  id: "volume-select",
                  className: "w-full h-8 shadow-none cursor-pointer",
                  children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Volume" })
                }
              ),
            /* @__PURE__ */ jsxs(SelectContent, {
                children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "volume", children: "Volume" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "ending_soon", children: "Ending Soon" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "recently_added", children: "Recently Added" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "price_change", children: "Price Change" })
                ]
              })
              ]
            }
          )
        }),
      /* @__PURE__ */ jsx("div", {
          className: "w-full col-span-6 lg:col-span-2 md:col-span-4", children: /* @__PURE__ */ jsxs(
            Select,
            {
              className: "w-full",
              value: selectedStatus,
              onValueChange: setSelectedStatus,
              children: [
            /* @__PURE__ */ jsx(
                SelectTrigger,
                {
                  id: "status-select",
                  className: "w-full h-8 shadow-none cursor-pointer",
                  children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Open" })
                }
              ),
            /* @__PURE__ */ jsxs(SelectContent, {
                children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "Open", children: "Open" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Closed", children: "Closed" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Resolved", children: "Resolved" })
                ]
              })
              ]
            }
          )
        })
        ]
      })
    })
    ]
  });
};
const TradingCard = ({ onTradingHide, tradingType, market }) => {
  return /* @__PURE__ */ jsx(Card, {
    className: "group h-full border overflow-hidden shadow-none p-0 rounded-md", children: /* @__PURE__ */ jsxs(CardContent, {
      className: "p-3 space-y-4", children: [
    /* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "secondary",
            size: "sm",
            onClick: onTradingHide,
            className: "hover:scale-102 cursor-pointer transition-all duration-200 border-0",
            children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4 mr-1 rtl:rotate-180" }),
              "Back"
            ]
          }
        ),
      /* @__PURE__ */ jsxs(
          Badge,
          {
            variant: tradingType === "yes" ? "default" : "destructive",
            className: "badge-enhanced animate-glow",
            children: [
              "Buy ",
              tradingType === "yes" ? "Yes" : "No"
            ]
          }
        )
        ]
      }),
    /* @__PURE__ */ jsx(
        TradeForm,
        {
          price: tradingType === "yes" ? market.yesPrice : market.noPrice,
          type: tradingType,
          onConfirm: async (amount) => {
            await new Promise((res) => setTimeout(res, 1500));
            return Math.random() > 0.3 ? { success: true } : { success: false };
          }
        }
      )
      ]
    })
  });
};
function MarketCard({ market }) {
  const [isTrading, setIsTrading] = useState(false);
  const [tradingType, setTradingType] = useState("yes");
  const [bookmark, setBookmark] = useState(false);
  const yesPercentage = Math.round(market?.yesPrice * 100);
  const handleBookmarkToggle = () => setBookmark(!bookmark);
  const predictions = market.predictions || [];
  const trades = market.trades || [];
  const handleTradingHide = () => {
    setIsTrading(false);
  };
  if (isTrading) {
    return /* @__PURE__ */ jsx(TradingCard, { onTradingHide: handleTradingHide, tradingType, market });
  }
  return /* @__PURE__ */ jsx(Card, {
    className: "p-0 overflow-hidden transition-all border rounded-md shadow-none cursor-pointer group/card", children: /* @__PURE__ */ jsxs(CardContent, {
      className: "p-0", children: [
    /* @__PURE__ */ jsxs("div", {
        className: "relative w-full overflow-hidden aspect-16/6 rounded-t-md", children: [
      /* @__PURE__ */ jsx(
          "img",
          {
            src: market.imageUrl || "/placeholder.svg",
            alt: market.title,
            className: "object-cover w-full h-full transition-transform duration-500 bg-center group-hover/card:scale-110"
          }
        ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover/card:opacity-100" }),
      /* @__PURE__ */ jsx("div", {
          className: "absolute top-3 start-3", children: /* @__PURE__ */ jsx(
            Badge,
            {
              variant: "secondary",
              className: "badge-enhanced animate-float border-b-accent ",
              children: market.category
            }
          )
        }),
      /* @__PURE__ */ jsx("div", {
          className: "absolute top-3 end-3", children: /* @__PURE__ */ jsx(
            Button,
            {
              variant: "secondary",
              size: "sm",
              onClick: handleBookmarkToggle,
              className: "transition-all duration-200 border-0 rounded-full cursor-pointer hover:scale-110",
              children: bookmark ? /* @__PURE__ */ jsx(BsBookmarkCheckFill, { className: "text-primary" }) : /* @__PURE__ */ jsx(BsBookmark, {})
            }
          )
        })
        ]
      }),
    /* @__PURE__ */ jsxs("div", {
        className: "p-3", children: [
          trades && trades.length > 0 ? /* @__PURE__ */ jsxs("div", {
            children: [
        /* @__PURE__ */ jsx("div", {
              className: "relative flex flex-col justify-start w-full h-full gap-3 overflow-y-scroll no-scrollbar", children: trades.map((trade) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center justify-between w-full gap-4 group/row h-fit shrink-0",
                  children: [
              /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center flex-1 min-w-0 gap-2 cursor-pointer", children: [
                /* @__PURE__ */ jsx(Avatar, { className: "rounded-md aspect-square size-7", children: /* @__PURE__ */ jsx(AvatarImage, { src: trade?.imageUrl }) }),
                /* @__PURE__ */ jsx(
                      Link,
                      {
                        href: `/markets/${trade.id}`,
                        className: "text-sm font-semibold transition-colors text-muted-foreground line-clamp-3 hover:text-foreground",
                        children: /* @__PURE__ */ jsx("p", { className: "line-clamp-1 group-hover/row:text-primary group-hover/row:underline", children: trade?.name })
                      }
                    )
                    ]
                  }),
              /* @__PURE__ */ jsx("div", {
                    className: "shrink-0", children: /* @__PURE__ */ jsxs("p", {
                      className: "text-sm font-bold", children: [
                        trade?.percentage,
                        "%"
                      ]
                    })
                  })
                  ]
                },
                trade?.id
              ))
            }),
        /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-3 pt-[32px]", children: [
          /* @__PURE__ */ jsx(
                FancyButton,
                {
                  label: "Brentford",
                  className: "grow"
                }
              ),
          /* @__PURE__ */ jsx(
                FancyButton,
                {
                  label: "Draw",
                  variant: "outline",
                  className: "px-2"
                }
              ),
          /* @__PURE__ */ jsx(
                FancyButton,
                {
                  label: "Man Utd",
                  className: "text-red-600 grow bg-red-500/10 hover:bg-red-700 hover:text-white"
                }
              )
              ]
            })
            ]
          }) : /* @__PURE__ */ jsxs(Fragment, {
            children: [
        /* @__PURE__ */ jsx(Link, { href: `/markets/${market.id}`, children: /* @__PURE__ */ jsx("h3", { className: "mb-2 text-base font-semibold leading-tight transition-colors text-foreground min-h-10 line-clamp-2 hover:text-primary", children: market.title }) }),
              predictions.length > 0 ? /* @__PURE__ */ jsx("div", {
                className: "relative overflow-hidden h-[84px] mt-3", children: /* @__PURE__ */ jsx("div", {
                  className: "flex flex-col gap-1.5 pb-1 justify-start overflow-y-scroll relative w-full h-full no-scrollbar", children: predictions.map((prediction) => /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "flex items-center justify-between w-full gap-4 group/row h-fit shrink-0",
                      children: [
              /* @__PURE__ */ jsx("div", {
                        className: "flex items-center flex-1 min-w-0 gap-2 cursor-pointer", children: /* @__PURE__ */ jsx(
                          Link,
                          {
                            href: `/markets/${market.id}`,
                            className: "text-sm transition-colors text-muted-foreground line-clamp-3 hover:text-foreground",
                            children: /* @__PURE__ */ jsx("p", { className: "line-clamp-1 group-hover/row:text-primary group-hover/row:underline", children: prediction?.name })
                          }
                        )
                      }),
              /* @__PURE__ */ jsxs("div", {
                        className: "flex items-center justify-end gap-3", children: [
                /* @__PURE__ */ jsxs("p", {
                          className: "text-xs", children: [
                            prediction?.percentage,
                            "%"
                          ]
                        }),
                /* @__PURE__ */ jsxs("div", {
                          className: "flex gap-1.5 items-center -me-[90px] group-hover/row:me-0 transition-[margin] duration-400 ease-in-out", children: [
                  /* @__PURE__ */ jsx(
                            FancyButton,
                            {
                              label: "Yes",
                              size: "sm",
                              className: "grow text-[10px] h-[26px] rounded-sm",
                              onClick: (e) => {
                                e.preventDefault();
                                setTradingType("yes");
                                setIsTrading(true);
                              }
                            }
                          ),
                  /* @__PURE__ */ jsx(
                            FancyButton,
                            {
                              label: "No",
                              size: "sm",
                              className: "grow text-red-600 bg-red-500/8 hover:bg-red-700 hover:text-white text-[10px] h-[26px] rounded-sm",
                              onClick: (e) => {
                                e.preventDefault();
                                setTradingType("no");
                                setIsTrading(true);
                              }
                            }
                          )
                          ]
                        })
                        ]
                      })
                      ]
                    },
                    prediction?.id
                  ))
                })
              }) : /* @__PURE__ */ jsxs(Fragment, {
                children: [
          /* @__PURE__ */ jsxs("div", {
                  className: "mb-3 space-y-1", children: [
            /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Probability :" }),
              /* @__PURE__ */ jsxs("span", {
                      className: "text-sm font-medium", children: [
                        yesPercentage,
                        "%"
                      ]
                    })
                    ]
                  }),
            /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxs("span", {
                      className: "text-xs font-semibold shrink-0", children: [
                        Math.round(market.yesPrice * 100),
                        "¢"
                      ]
                    }),
              /* @__PURE__ */ jsx(
                      Progress,
                      {
                        value: yesPercentage,
                        className: "h-1.5 transition-all duration-300"
                      }
                    ),
              /* @__PURE__ */ jsxs("span", {
                      className: "text-xs font-semibold shrink-0", children: [
                        Math.round(market.noPrice * 100),
                        "¢"
                      ]
                    })
                    ]
                  })
                  ]
                }),
          /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
                    FancyButton,
                    {
                      label: "Buy Yes",
                      className: "grow",
                      onClick: (e) => {
                        e.preventDefault();
                        setTradingType("yes");
                        setIsTrading(true);
                      }
                    }
                  ),
            /* @__PURE__ */ jsx(
                    FancyButton,
                    {
                      label: "Buy No",
                      className: "text-red-600 grow bg-red-500/10 hover:bg-red-700 hover:text-white",
                      onClick: (e) => {
                        e.preventDefault();
                        setTradingType("no");
                        setIsTrading(true);
                      }
                    }
                  )
                  ]
                })
                ]
              })
            ]
          }),
      /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between mt-4 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxs("span", {
              className: "font-medium", children: [
                formatVolume(market.volume),
                " VoL"
              ]
            }),
        /* @__PURE__ */ jsxs("div", {
              className: "flex items-center", children: [
          /* @__PURE__ */ jsx(Clock3, { className: "size-[1rem] me-1" }),
          /* @__PURE__ */ jsxs("span", {
                children: [
                  "Ends ",
                  formatDate(market.endDate)
                ]
              })
              ]
            })
            ]
          })
        ]
      })
      ]
    })
  });
}
function RadialProgress({
  value,
  size = 64,
  strokeWidth = 4,
  className,
  indicatorClassName,
  bgClassName,
  icon: Icon,
  iconClassName,
  label,
  labelClassName,
  ariaLabel = "Progress",
  ...props
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - value / 100 * circumference;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "relative flex items-center justify-center",
        className
      ),
      style: { width: size, height: size },
      role: "progressbar",
      "aria-valuenow": value,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-label": ariaLabel,
      ...props,
      children: [
        /* @__PURE__ */ jsx(
        "svg",
        {
          className: "absolute -rotate-90 transform origin-center",
          width: size,
          height: size,
          viewBox: `0 0 ${size} ${size}`,
          children: /* @__PURE__ */ jsx(
            "circle",
            {
              className: cn(
                "stroke-current text-muted-foreground/20",
                bgClassName
              ),
              cx: size / 2,
              cy: size / 2,
              r: radius,
              strokeWidth,
              fill: "none",
              strokeLinecap: "round"
            }
          )
        }
      ),
        /* @__PURE__ */ jsx(
        "svg",
        {
          className: "absolute -rotate-90 transform origin-center",
          width: size,
          height: size,
          viewBox: `0 0 ${size} ${size}`,
          children: /* @__PURE__ */ jsx(
            "circle",
            {
              className: cn(
                "stroke-current text-primary transition-all duration-1000 ease-linear",
                indicatorClassName
              ),
              cx: size / 2,
              cy: size / 2,
              r: radius,
              strokeWidth,
              fill: "none",
              strokeDasharray: circumference,
              strokeDashoffset,
              strokeLinecap: "round"
            }
          )
        }
      ),
        /* @__PURE__ */ jsxs("div", {
        className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center", children: [
          Icon && /* @__PURE__ */ jsx(
            Icon,
            {
              className: cn("h-4 w-4 mb-1", iconClassName),
              "aria-hidden": "true"
            }
          ),
          label && /* @__PURE__ */ jsx(
            "span",
            {
              className: cn(
                "text-[12px] leading-1 font-medium text-foreground text-center flex items-center justify-center",
                labelClassName
              ),
              children: label
            }
          )
        ]
      })
      ]
    }
  );
}
function MarketCardTwo({ market }) {
  const [isTrading, setIsTrading] = useState(false);
  const [tradingType, setTradingType] = useState("yes");
  const [bookmark, setBookmark] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  Math.round(market?.yesPrice * 100);
  const handleBookmarkToggle = () => setBookmark(!bookmark);
  const predictions = market.predictions || [];
  const trades = market.trades || [];
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
    /* @__PURE__ */ jsx(Card, {
      className: "p-0 overflow-hidden transition-all border rounded-md shadow-none cursor-pointer group/card hover:-translate-y-1 hover:border-primary", children: /* @__PURE__ */ jsxs(CardContent, {
        className: "p-3", children: [
          (market?.imageUrl || market?.title || market?.chance) && /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between gap-4 mb-4", children: [
              (market?.imageUrl || market?.title) && /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-3", children: [
                  market?.imageUrl && /* @__PURE__ */ jsx(Avatar, { className: "rounded-md aspect-square size-12", children: /* @__PURE__ */ jsx(AvatarImage, { src: market?.imageUrl }) }),
                  market?.title && /* @__PURE__ */ jsx(Link, { href: `/theme/${market.id}`, children: /* @__PURE__ */ jsx("h3", { className: "font-bold text-[15px] text-foreground line-clamp-2 leading-tight hover:text-primary transition-colors", children: market?.title }) })
                ]
              }),
              market?.chance && /* @__PURE__ */ jsx("div", {
                className: "shrink-0 size-12", children: /* @__PURE__ */ jsx(
                  RadialProgress,
                  {
                    value: market?.chance,
                    size: 48,
                    strokeWidth: 4,
                    label: `${market?.chance}%`,
                    indicatorClassName: "text-primary",
                    className: "p-4 rounded-full shadow-md bg-background",
                    ariaLabel: "Download progress"
                  }
                )
              })
            ]
          }),
          trades && trades.length > 0 && /* @__PURE__ */ jsxs("div", {
            children: [
        /* @__PURE__ */ jsx("div", {
              className: "relative flex flex-col justify-start w-full h-full gap-3 overflow-y-scroll no-scrollbar", children: trades.map((trade) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center justify-between w-full gap-4 group/row h-fit shrink-0",
                  children: [
              /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center flex-1 min-w-0 gap-2 cursor-pointer", children: [
                /* @__PURE__ */ jsx(Avatar, { className: "rounded-md aspect-square size-7", children: /* @__PURE__ */ jsx(AvatarImage, { src: trade?.imageUrl }) }),
                /* @__PURE__ */ jsx(
                      Link,
                      {
                        href: `/markets/${trade.id}`,
                        className: "text-sm font-semibold transition-colors text-muted-foreground line-clamp-3 hover:text-foreground",
                        children: /* @__PURE__ */ jsx("p", { className: "line-clamp-1 group-hover/row:text-primary group-hover/row:underline", children: trade?.name })
                      }
                    )
                    ]
                  }),
              /* @__PURE__ */ jsx("div", {
                    className: "shrink-0", children: /* @__PURE__ */ jsxs("p", {
                      className: "text-sm font-bold", children: [
                        trade?.percentage,
                        "%"
                      ]
                    })
                  })
                  ]
                },
                trade?.id
              ))
            }),
        /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-3 pt-[25px]", children: [
          /* @__PURE__ */ jsx(
                FancyButton,
                {
                  label: "Brentford",
                  className: "grow"
                }
              ),
          /* @__PURE__ */ jsx(
                FancyButton,
                {
                  label: "Draw",
                  variant: "outline",
                  className: "px-2"
                }
              ),
          /* @__PURE__ */ jsx(
                FancyButton,
                {
                  label: "Man Utd",
                  className: "text-red-600 grow bg-red-500/10 hover:bg-red-700 hover:text-white"
                }
              )
              ]
            })
            ]
          }),
          predictions.length > 0 ? /* @__PURE__ */ jsx("div", {
            className: "relative overflow-hidden h-[62px]", children: /* @__PURE__ */ jsx("div", {
              className: "flex flex-col gap-1.5 pb-1 justify-start overflow-y-scroll relative w-full h-full no-scrollbar", children: predictions.map((prediction) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center justify-between w-full gap-4 group/row h-fit shrink-0",
                  children: [
            /* @__PURE__ */ jsx("div", {
                    className: "flex items-center flex-1 min-w-0 gap-2 cursor-pointer", children: /* @__PURE__ */ jsx(
                      Link,
                      {
                        href: `/markets/${market.id}`,
                        className: "text-sm transition-colors text-muted-foreground line-clamp-3 hover:text-foreground",
                        children: /* @__PURE__ */ jsx("p", { className: "line-clamp-1 group-hover/row:text-primary group-hover/row:underline", children: prediction?.name })
                      }
                    )
                  }),
            /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center justify-end gap-3", children: [
              /* @__PURE__ */ jsxs("p", {
                      className: "text-xs", children: [
                        prediction?.percentage,
                        "%"
                      ]
                    }),
              /* @__PURE__ */ jsxs("div", {
                      className: "flex gap-1.5 items-center", children: [
                /* @__PURE__ */ jsx(
                        FancyButton,
                        {
                          label: "Yes",
                          size: "sm",
                          className: "grow text-[10px] h-[26px] rounded-sm",
                          onClick: (e) => {
                            e.preventDefault();
                            setTradingType("yes");
                            setIsTrading(true);
                          }
                        }
                      ),
                /* @__PURE__ */ jsx(
                        FancyButton,
                        {
                          label: "No",
                          size: "sm",
                          className: "grow text-red-600 bg-red-500/8 hover:bg-red-700 hover:text-white text-[10px] h-[26px] rounded-sm",
                          onClick: (e) => {
                            e.preventDefault();
                            setTradingType("no");
                            setIsTrading(true);
                          }
                        }
                      )
                      ]
                    })
                    ]
                  })
                  ]
                },
                prediction?.id
              ))
            })
          }) : !market?.actionButtons && /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3 pt-[5px]", children: [
        /* @__PURE__ */ jsxs("div", {
              className: "grow flex flex-col items-center text-center gap-1.5", children: [
          /* @__PURE__ */ jsx(
                FancyButton,
                {
                  label: "Buy Yes",
                  className: "w-full",
                  onClick: () => handleOpenModal()
                }
              ),
          /* @__PURE__ */ jsxs("p", {
                className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                  "$100 ",
            /* @__PURE__ */ jsx(MoveRight, { className: "size-4" }),
                  " ",
            /* @__PURE__ */ jsx("span", { className: "text-green-700", children: "$452" })
                ]
              })
              ]
            }),
        /* @__PURE__ */ jsxs("div", {
              className: "grow flex flex-col items-center text-center gap-1.5", children: [
          /* @__PURE__ */ jsx(
                FancyButton,
                {
                  label: "Buy No",
                  className: "w-full text-red-600 bg-red-500/10 hover:bg-red-700 hover:text-white",
                  onClick: () => handleOpenModal()
                }
              ),
          /* @__PURE__ */ jsxs("p", {
                className: "flex items-center gap-1 text-xs font-medium text-muted-foreground", children: [
                  "$100",
            /* @__PURE__ */ jsx(MoveRight, { className: "size-4" }),
                  " ",
            /* @__PURE__ */ jsx("span", { className: "text-green-700", children: "$219" })
                ]
              })
              ]
            })
            ]
          }),
      /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between mt-4 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxs("span", {
              className: "font-medium", children: [
                formatVolume(market.volume),
                " VoL"
              ]
            }),
        /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs("div", {
                className: "flex items-center", children: [
            /* @__PURE__ */ jsx(Clock3, { className: "size-[1rem] me-1" }),
            /* @__PURE__ */ jsxs("span", {
                  children: [
                    "Ends ",
                    formatDate(market.endDate)
                  ]
                })
                ]
              }),
          /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "secondary",
                  size: "sm",
                  onClick: handleBookmarkToggle,
                  className: "hover:scale-110 !px-2 transition-all duration-200 border-0 cursor-pointer",
                  children: bookmark ? /* @__PURE__ */ jsx(BsBookmarkCheckFill, { className: "text-primary" }) : /* @__PURE__ */ jsx(BsBookmark, {})
                }
              )
              ]
            })
            ]
          })
        ]
      })
    }),
      openModal && /* @__PURE__ */ jsx(
        TradeDialog,
        {
          isOpen: openModal,
          onClose: handleCloseModal,
          marketData: market
        }
      )
    ]
  });
}
const MarketGrid = ({ filteredMarkets, themeTwo }) => {
  return /* @__PURE__ */ jsx("div", {
    className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4", children: filteredMarkets.length > 0 ? filteredMarkets.map((market, index) => /* @__PURE__ */ jsx(Fragment, {
      children: /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          transition: { duration: 0.4, delay: index * 0.1 },
          viewport: { once: true },
          className: "group",
          children: themeTwo ? /* @__PURE__ */ jsx(MarketCardTwo, { market }, market.id) : /* @__PURE__ */ jsx(MarketCard, { market }, market.id)
        },
        index
      )
    })) : /* @__PURE__ */ jsx("div", { className: "col-span-full", children: /* @__PURE__ */ jsx(EmptyData, {}) })
  });
};
export {
  SelectTrigger as a,
  SelectValue as b,
  SelectContent as c,
  SelectItem as d,
  MarketGrid as e, MarketFilters as M,
  Select as S
};


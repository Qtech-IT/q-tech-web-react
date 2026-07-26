import { Head } from "@inertiajs/react";
import "@radix-ui/react-accordion";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-avatar";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-dialog";
import "@radix-ui/react-direction";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "@radix-ui/react-label";
import "@radix-ui/react-progress";
import "@radix-ui/react-radio-group";
import "@radix-ui/react-scroll-area";
import "@radix-ui/react-select";
import "@radix-ui/react-separator";
import "@radix-ui/react-slot";
import "@radix-ui/react-switch";
import "@radix-ui/react-tabs";
import "@radix-ui/react-tooltip";
import "class-variance-authority";
import "clsx";
import "cmdk";
import "framer-motion";
import { Calendar, Database, Download, FileText, HardDrive, MoreHorizontal, Plus, Search, Shield, Trash2, X } from "lucide-react";
import "motion/react";
import React__default, { useEffect, useState } from "react";
import "react-hot-toast";
import "react-icons/bs";
import "react-icons/fa";
import { jsx, jsxs } from "react/jsx-runtime";
import "tailwind-merge";
import { A as Alert, a as AlertDescription } from "./Alert-3s5DZB4H.js";
import "./AuthController-DaCguZ7K.js";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import "./BlogCard-Jrl9AHYg.js";
import "./BlogSection-DiGfvTON.js";
import "./Breadcrumb-D0MBns-9.js";
import { B as Button } from "./Button-CFMlPXiE.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./Card-CQ2ij0--.js";
import { C as CommonLayoutHeader } from "./CommonLayoutHeader-CyKOpByu.js";
import "./constants-4k_q_jeE.js";
import { D as DeleteDialog } from "./DeleteDialog-DBDDlwO7.js";
import "./demo-data-C5EGh9Nk.js";
import "./EmptyData-DjqqIMwS.js";
import { E as EmptyTableState } from "./EmptyTableState-C7sYsPjb.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import "./Label-BxDBN09D.js";
import { A as AuthenticatedLayout, B as BaseLayout, M as Main, d as confirmDeleteAllBackups, b as confirmDeleteBackup, g as getDeleteBackupDialogContent, a as handleCreateBackup } from "./Main-BjCbeyG1.js";
import "./MarketGrid-DlkazA02.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
import "./PaginationWrapper-B-KWAp7V.js";
import "./Progress-DT6CA82_.js";
import { D as DropdownMenu, f as DropdownMenuContent, i as DropdownMenuItem, g as DropdownMenuLabel, h as DropdownMenuSeparator, e as DropdownMenuTrigger } from "./Sheet-B-_2BaZp.js";
import "./SlideUp-CpffxXZf.js";
import { T as Table, d as TableBody, e as TableCell, c as TableHead, a as TableHeader, b as TableRow } from "./Table-Dz-EvWd_.js";
import "./TradeDialog-Dt4WEyMP.js";
const TableActions = ({ backup, onDownload, onDelete }) => {
  const handleDownload = () => {
    onDownload(backup);
  };
  const handleDelete = () => {
    onDelete(backup);
  };
  return /* @__PURE__ */ jsxs(DropdownMenu, {
    children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, {
      asChild: true, children: /* @__PURE__ */ jsxs(Button, {
        variant: "ghost", className: "p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800", children: [
      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open menu" }),
      /* @__PURE__ */ jsx(MoreHorizontal, { className: "w-4 h-4 text-gray-600 dark:text-gray-400" })
        ]
      })
    }),
    /* @__PURE__ */ jsxs(DropdownMenuContent, {
      align: "end", className: "w-48 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-900 dark:border-gray-700", children: [
      /* @__PURE__ */ jsx(DropdownMenuLabel, { className: "text-sm font-semibold text-gray-700 dark:text-gray-300", children: "Actions" }),
      /* @__PURE__ */ jsx(DropdownMenuSeparator, { className: "dark:bg-gray-700" }),
      /* @__PURE__ */ jsxs(
        DropdownMenuItem,
        {
          onClick: handleDownload,
          className: "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100",
          children: [
            /* @__PURE__ */ jsx(Download, { className: "w-4 h-4 mr-2 text-blue-600 dark:text-blue-500" }),
            "Download Backup"
          ]
        }
      ),
      /* @__PURE__ */ jsx(DropdownMenuSeparator, { className: "dark:bg-gray-700" }),
      /* @__PURE__ */ jsxs(
        DropdownMenuItem,
        {
          onClick: handleDelete,
          className: "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400",
          children: [
            /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4 mr-2" }),
            "Delete Backup"
          ]
        }
      )
      ]
    })
    ]
  });
};
const SizeBadge = ({ size, sizeBytes }) => {
  const getSizeColor = (bytes) => {
    if (bytes > 100 * 1024 * 1024) {
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
    } else if (bytes > 10 * 1024 * 1024) {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
    } else {
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
    }
  };
  return /* @__PURE__ */ jsxs(
    Badge,
    {
      variant: "outline",
      className: `text-xs  ${getSizeColor(sizeBytes)}`,
      children: [
        /* @__PURE__ */ jsx(HardDrive, { className: "w-3 h-3 mr-1" }),
        size
      ]
    }
  );
};
const BackupTypeIcon = ({ filename }) => {
  if (filename.includes("db_")) {
    return /* @__PURE__ */ jsx(Database, { className: "w-4 h-4 text-blue-600 dark:text-blue-400" });
  }
  if (filename.includes("app_")) {
    return /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 text-green-600 dark:text-green-400" });
  }
  return /* @__PURE__ */ jsx(Database, { className: "w-4 h-4 text-gray-600 dark:text-gray-400" });
};
const BackupTable = ({ backups = [], onDownload, onDelete }) => {
  if (backups.length === 0) {
    return /* @__PURE__ */ jsx(
      EmptyTableState,
      {
        icon: Database,
        title: "No backups found",
        description: "No database backups available. Create your first backup to get started with data protection."
      }
    );
  }
  return /* @__PURE__ */ jsx(Card, {
    className: "bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-900", children: /* @__PURE__ */ jsx(CardContent, {
      className: "p-0", children: /* @__PURE__ */ jsx("div", {
        className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, {
          className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [
    /* @__PURE__ */ jsx(TableHeader, {
            className: "bg-gray-50 dark:bg-gray-800", children: /* @__PURE__ */ jsxs(TableRow, {
              children: [
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "ID" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Backup File" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Size" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300", children: "Created" }),
      /* @__PURE__ */ jsx(TableHead, { className: "px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-300", children: "Actions" })
              ]
            })
          }),
    /* @__PURE__ */ jsx(TableBody, {
            className: "bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700", children: backups.map((backup, index) => /* @__PURE__ */ jsxs(TableRow, {
              className: "transition-colors hover:bg-gray-50 dark:hover:bg-gray-800", children: [
      /* @__PURE__ */ jsxs(TableCell, {
                className: "px-6 py-4  text-gray-700 dark:text-gray-300", children: [
                  "#",
                  index + 1
                ]
              }),
      /* @__PURE__ */ jsx(TableCell, {
                className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg dark:bg-gray-800", children: /* @__PURE__ */ jsx(BackupTypeIcon, { filename: backup.filename }) }),
        /* @__PURE__ */ jsxs("div", {
                    className: "flex flex-col", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: backup.filename }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Database backup file" })
                    ]
                  })
                  ]
                })
              }),
      /* @__PURE__ */ jsx(TableCell, { className: "px-6 py-4", children: /* @__PURE__ */ jsx(SizeBadge, { size: backup.size, sizeBytes: backup.size_bytes }) }),
      /* @__PURE__ */ jsx(TableCell, {
                className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-gray-400" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: backup.created_at })
                  ]
                })
              }),
      /* @__PURE__ */ jsx(TableCell, {
                className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center justify-center gap-2", children: [
        /* @__PURE__ */ jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      onClick: () => onDownload(backup),
                      className: "flex items-center gap-1",
                      children: [
              /* @__PURE__ */ jsx(Download, { className: "w-3 h-3" }),
                        "Download"
                      ]
                    }
                  ),
        /* @__PURE__ */ jsx(
                    TableActions,
                    {
                      backup,
                      onDownload,
                      onDelete
                    }
                  )
                  ]
                })
              })
              ]
            }, backup.id))
          })
          ]
        })
      })
    })
  });
};
const CommonSimpleSearchBox = ({
  searchTerm = "",
  onSearchChange,
  placeholder = "Search...",
  className = ""
}) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const handleSearchChange = (value) => {
    setLocalSearch(value);
    onSearchChange(value);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };
  const clearSearch = () => {
    handleSearchChange("");
  };
  React__default.useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);
  return /* @__PURE__ */ jsxs("div", {
    className: `w-full max-w-full p-3 space-y-3 border rounded-xl bg-background sm:p-4 ${className}`, children: [
    /* @__PURE__ */ jsxs("div", {
      className: "flex items-center min-w-0 gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 p-1.5 rounded-lg bg-primary/10 sm:p-2", children: /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-primary" }) }),
      /* @__PURE__ */ jsxs("div", {
        className: "min-w-0", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold truncate sm:text-base", children: "Search Languages" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs truncate text-muted-foreground", children: "Find languages instantly" })
        ]
      })
      ]
    }),
    /* @__PURE__ */ jsx("form", {
      onSubmit: handleSearchSubmit, className: "w-full", children: /* @__PURE__ */ jsxs("div", {
        className: "relative flex-1 min-w-0", children: [
      /* @__PURE__ */ jsx(Search, { className: "absolute w-3.5 h-3.5 left-2.5 top-2.5 text-muted-foreground sm:w-4 sm:h-4 sm:left-3 sm:top-3" }),
      /* @__PURE__ */ jsx(
          Input,
          {
            name: "search",
            placeholder,
            value: localSearch,
            onChange: (e) => handleSearchChange(e.target.value),
            className: "w-full pl-8 pr-8 text-sm h-9 sm:pl-9 sm:pr-10 sm:h-10"
          }
        ),
          localSearch && /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "icon",
              className: "absolute right-1 top-1 w-7 h-7 sm:right-1.5 sm:top-1.5",
              onClick: clearSearch,
              children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
            }
          )
        ]
      })
    }),
      localSearch && /* @__PURE__ */ jsx("div", {
        className: "pt-2 border-t", children: /* @__PURE__ */ jsxs("span", {
          className: "text-xs text-muted-foreground", children: [
            "Searching for: ",
      /* @__PURE__ */ jsxs("span", {
              className: "font-medium text-foreground", children: [
                '"',
                localSearch,
                '"'
              ]
            })
          ]
        })
      })
    ]
  });
};
function StorageOverview({ storage_info }) {
  return /* @__PURE__ */ jsxs("div", {
    className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: [
    /* @__PURE__ */ jsx(Card, {
      className: "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800", children: /* @__PURE__ */ jsx(CardContent, {
        className: "p-6", children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg dark:bg-blue-900", children: /* @__PURE__ */ jsx(FileText, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }) }),
      /* @__PURE__ */ jsxs("div", {
            children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-blue-700 dark:text-blue-300", children: "Total Backups" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-blue-900 dark:text-blue-100", children: storage_info?.total_backups || 0 })
            ]
          })
          ]
        })
      })
    }),
    /* @__PURE__ */ jsx(Card, {
      className: "border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800", children: /* @__PURE__ */ jsx(CardContent, {
        className: "p-6", children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg dark:bg-green-900", children: /* @__PURE__ */ jsx(HardDrive, { className: "w-6 h-6 text-green-600 dark:text-green-400" }) }),
      /* @__PURE__ */ jsxs("div", {
            children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-green-700 dark:text-green-300", children: "Storage Used" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-green-900 dark:text-green-100", children: storage_info?.total_size || "0 B" })
            ]
          })
          ]
        })
      })
    }),
    /* @__PURE__ */ jsx(Card, {
      className: "border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800", children: /* @__PURE__ */ jsx(CardContent, {
        className: "p-6", children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg dark:bg-purple-900", children: /* @__PURE__ */ jsx(Shield, { className: "w-6 h-6 text-purple-600 dark:text-purple-400" }) }),
      /* @__PURE__ */ jsxs("div", {
            children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-purple-700 dark:text-purple-300", children: "Backup Path" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-purple-900 truncate dark:text-purple-100", children: storage_info?.backup_path || "N/A" })
            ]
          })
          ]
        })
      })
    })
    ]
  });
}
function QuickAction({ backups, handleCreateBackup: handleCreateBackup2, handleDeleteAllBackups, isSubmitting }) {
  return /* @__PURE__ */ jsxs(Card, {
    children: [
    /* @__PURE__ */ jsx(CardHeader, {
      children: /* @__PURE__ */ jsxs(CardTitle, {
        className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Database, { className: "w-5 h-5 text-blue-500" }),
          "Quick Actions"
        ]
      })
    }),
    /* @__PURE__ */ jsxs(CardContent, {
      children: [
      /* @__PURE__ */ jsxs(Alert, {
        className: "mb-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800", children: [
        /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4 text-blue-600 dark:text-blue-400" }),
        /* @__PURE__ */ jsxs(AlertDescription, {
          className: "text-blue-800 dark:text-blue-200", children: [
          /* @__PURE__ */ jsx("strong", { children: "Backup Recommendations:" }),
            " Create regular backups to protect your data. Store backups in multiple locations for better security."
          ]
        })
        ]
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "flex flex-wrap gap-4", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: handleCreateBackup2,
            disabled: isSubmitting,
            className: "flex items-center gap-2",
            children: /* @__PURE__ */ jsx(
              ButtonLoader,
              {
                isSubmitting,
                btnText: "Create New Backup",
                loaderText: "Creating Backup...",
                icon: /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" })
              }
            )
          }
        ),
          (backups?.data || []).length > 0 && /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "destructive",
              onClick: handleDeleteAllBackups,
              disabled: isSubmitting,
              className: "flex items-center gap-2",
              children: [
              /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }),
                "Delete All Backups"
              ]
            }
          )
        ]
      })
      ]
    })
    ]
  });
}
const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Database Backup", href: null }
];
function Index({
  title,
  backups,
  storage_info
}) {
  const { loading: isSubmitting, submit } = useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBackups, setFilteredBackups] = useState(backups?.data || []);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBackups(backups?.data || []);
    } else {
      const filtered = (backups?.data || []).filter(
        (backup) => backup.filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBackups(filtered);
    }
  }, [searchTerm, backups]);
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };
  const handleDownloadBackup = (backup) => {
    window.location.href = `/admin/backups/download/${backup.id}`;
  };
  const handleDeleteBackup = (backup) => {
    setSelectedBackup(backup);
    setShowDeleteDialog(true);
  };
  const handleDeleteAllBackups = () => {
    setShowDeleteAllDialog(true);
  };
  const deleteDialogConfig = getDeleteBackupDialogContent(null, selectedBackup);
  const deleteAllDialogConfig = getDeleteBackupDialogContent("all", storage_info);
  const stats = {
    total: storage_info?.total_backups || 0,
    size: storage_info?.total_size || "0 B"
  };
  return /* @__PURE__ */ jsx(BaseLayout, {
    children: /* @__PURE__ */ jsxs(AuthenticatedLayout, {
      children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(Main, {
        className: "space-y-8", children: [
      /* @__PURE__ */ jsx(
          CommonLayoutHeader,
          {
            variant: "index",
            breadcrumbItems,
            title: "Database Backup Management",
            description: "Create, manage and restore database backups",
            icon: Database,
            stats
          }
        ),
      /* @__PURE__ */ jsx(StorageOverview, { storage_info }),
      /* @__PURE__ */ jsx(
          QuickAction,
          {
            backups,
            handleCreateBackup: () => handleCreateBackup(submit),
            handleDeleteAllBackups,
            isSubmitting
          }
        ),
      /* @__PURE__ */ jsx(
          CommonSimpleSearchBox,
          {
            searchTerm,
            onSearchChange: handleSearch,
            placeholder: "Search backup files..."
          }
        ),
      /* @__PURE__ */ jsx("div", {
          className: "space-y-6", children: /* @__PURE__ */ jsx(
            BackupTable,
            {
              backups: filteredBackups,
              onDownload: handleDownloadBackup,
              onDelete: handleDeleteBackup
            }
          )
        }),
      /* @__PURE__ */ jsx(
          DeleteDialog,
          {
            open: showDeleteDialog,
            onOpenChange: setShowDeleteDialog,
            item: selectedBackup,
            config: deleteDialogConfig,
            onDelete: confirmDeleteBackup
          }
        ),
      /* @__PURE__ */ jsx(
          DeleteDialog,
          {
            open: showDeleteAllDialog,
            onOpenChange: setShowDeleteAllDialog,
            item: { total_backups: storage_info?.total_backups, total_size: storage_info?.total_size },
            config: deleteAllDialogConfig,
            onDelete: confirmDeleteAllBackups
          }
        )
        ]
      })
      ]
    })
  });
}
export {
  Index as default
};


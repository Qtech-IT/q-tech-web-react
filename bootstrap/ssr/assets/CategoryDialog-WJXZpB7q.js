import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import React__default from "react";
import { z } from "zod";
import { useForm as useForm$1 } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { m as Dialog, n as DialogContent, o as DialogHeader, p as DialogTitle, q as DialogDescription } from "./Sheet-B-_2BaZp.js";
import { B as Button } from "./Button-CFMlPXiE.js";
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, e as FormDescription, f as FormMessage } from "./Form-dg4L2iRR.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import { T as Textarea } from "./constants-4k_q_jeE.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./MarketGrid-DlkazA02.js";
import { C as Checkbox } from "./Checkbox-CsK9i2JK.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./Card-CQ2ij0--.js";
import { A as Alert, a as AlertDescription } from "./Alert-3s5DZB4H.js";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import { Edit, Plus, Info, Tag, Star, Package, FolderOpen } from "lucide-react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
const getCategoryStats = (categories) => {
  const data = categories?.data || [];
  return {
    total: data.length,
    active: data.filter((cat) => cat.status === "active").length,
    inactive: data.filter((cat) => cat.status === "inactive").length,
    withSubcategories: data.filter((cat) => cat.subcategories_count > 0).length
  };
};
const getCategoryFilterOptions = () => {
  return {
    status: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" }
    ]
  };
};
const onCategorySearch = (searchValue, setSearchTerm) => {
  setSearchTerm(searchValue);
  const params = new URLSearchParams(window.location.search);
  if (searchValue && searchValue.trim()) {
    params.set("search", searchValue);
  } else {
    params.delete("search");
  }
  params.delete("page");
  router.visit(`${window.location.pathname}?${params.toString()}`, {
    preserveState: true,
    preserveScroll: true,
    replace: true,
    only: ["categories", "search", "filters", "sub_categories"]
  });
};
const onCategoryFilterChange = (newFilters, filterOptions, setActiveFilters, setSearchTerm) => {
  setActiveFilters(newFilters);
  const params = new URLSearchParams(window.location.search);
  const isReset = Object.keys(newFilters).length === 0;
  if (isReset) {
    setSearchTerm("");
    params.delete("search");
  }
  Object.keys(filterOptions).forEach((key) => {
    params.delete(key);
  });
  Object.entries(newFilters).forEach(([key, values]) => {
    if (values && Array.isArray(values) && values.length > 0) {
      params.set(key, values.join(","));
    }
  });
  params.delete("page");
  router.visit(`${window.location.pathname}?${params.toString()}`, {
    preserveState: true,
    preserveScroll: true,
    replace: true,
    only: ["categories", "search", "filters", "sub_categories"]
  });
};
const getCategoryBreadcrumbItems = () => {
  return [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Market Categories", href: null }
  ];
};
const getSubcategoryBreadcrumbItems = (parentCategory) => {
  return [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Market Categories", href: "/admin/market-categories" },
    { label: `${parentCategory?.name} - Subcategories`, href: null }
  ];
};
const handleSaveCategory = async (data, submit, handleClose, category) => {
  try {
    await submit({
      method: "POST",
      url: category && category?.id ? route("admin.market-categories.update", category.id) + "?_method=PATCH" : route("admin.market-categories.store"),
      data
    });
    handleClose();
  } catch (error) {
  }
};
const onCategoryDelete = async (categoryId, submit, handleClose) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.market-categories.destroy", categoryId) + "?_method=DELETE"
    });
    handleClose();
  } catch (error) {
  }
};
const onCategoryStatusUpdate = async (category, newStatus, submit) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.market-categories.update.status"),
      data: { id: category.id, value: newStatus }
    });
  } catch (error) {
  }
};
const onCategoryBulkAction = async (selectedIds, action, submit) => {
  if (selectedIds.length === 0) {
    toast.error("Please select at least one category");
    return;
  }
  try {
    await submit({
      method: "POST",
      url: route("admin.market-categories.bulk.action"),
      data: { ids: selectedIds, action }
    });
  } catch (error) {
  }
};
const getDeleteDialogConfig = (categories, selectedCategory, isSubcategoryView = false) => {
  const itemType = isSubcategoryView ? "Subcategory" : "Category";
  return {
    title: `Delete ${itemType}`,
    description: `Are you sure you want to delete this ${itemType.toLowerCase()}? This action cannot be undone and may affect marketplace organization.`,
    itemName: selectedCategory?.name || itemType,
    itemType,
    warningMessage: `Deleting this ${itemType.toLowerCase()} will permanently remove it and may affect product organization in your marketplace.`,
    showWarningAlert: true,
    showItemDetails: true,
    itemDisplayFields: [
      {
        label: `${itemType} Name`,
        key: "name",
        className: "font-semibold text-gray-900 dark:text-gray-100"
      },
      {
        label: "Slug",
        key: "slug",
        render: (slug) => React__default.createElement(
          "code",
          {
            className: "px-2 py-1 text-xs bg-gray-100 rounded dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          },
          slug
        )
      },
      {
        label: "Status",
        key: "status",
        render: (status) => React__default.createElement(
          "span",
          {
            className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"}`
          },
          status
        )
      },
      {
        label: "Description",
        key: "description",
        render: (description) => description || "No description",
        className: "text-gray-600 dark:text-gray-400"
      },
      {
        label: "Created",
        key: "created_at",
        className: "text-gray-600 dark:text-gray-400"
      }
    ],
    specialWarnings: [
      {
        condition: (category) => category?.subcategories_count > 0 && !isSubcategoryView,
        title: "Contains Subcategories",
        message: `This category contains ${selectedCategory?.subcategories_count || 0} subcategories. Deleting it will also remove all subcategories.`,
        alertClass: "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800",
        iconClass: "text-red-600 dark:text-red-400",
        textClass: "text-red-800 dark:text-red-200"
      },
      {
        condition: (category) => category?.products_count > 0,
        title: "Contains Products",
        message: `This ${itemType.toLowerCase()} contains ${selectedCategory?.products_count || 0} products. Consider moving them to another category first.`,
        alertClass: "border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800",
        iconClass: "text-orange-600 dark:text-orange-400",
        textClass: "text-orange-800 dark:text-orange-200"
      },
      {
        condition: (category) => category?.status === "active",
        title: `Active ${itemType}`,
        message: `This ${itemType.toLowerCase()} is currently active and visible to users. Consider deactivating it first before deletion.`,
        alertClass: "border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800",
        iconClass: "text-blue-600 dark:text-blue-400",
        textClass: "text-blue-800 dark:text-blue-200"
      }
    ]
  };
};
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100, "Name must be less than 100 characters"),
  slug: z.string().min(1, "Slug is required").max(100, "Slug must be less than 100 characters"),
  description: z.string().optional(),
  parent_id: z.string().optional(),
  is_feature: z.boolean().default(false)
});
function CategoryDialog({
  open,
  onOpenChange,
  category = null,
  mode = "create",
  parentCategories = [],
  currentParent = null,
  isSubcategoryView = false,
  organization = true
}) {
  const { loading: isSubmitting, submit } = useForm();
  const isEditing = mode === "edit" && category;
  const defaultValues = {
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    parent_id: currentParent?.id?.toString() || category?.parent_id?.toString() || void 0,
    is_feature: category?.is_feature || false
  };
  const form = useForm$1({
    resolver: zodResolver(categorySchema),
    defaultValues
  });
  React__default.useEffect(() => {
    if (open && category && mode === "edit") {
      form.reset({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        parent_id: category.parent_id?.toString() || void 0,
        is_feature: category.is_feature || false
      });
    } else if (open && mode === "create") {
      form.reset({
        name: "",
        slug: "",
        description: "",
        parent_id: currentParent?.id?.toString() || void 0,
        is_feature: false
      });
    }
  }, [open, category, mode, currentParent, form]);
  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };
  form.watch("name");
  const watchParentId = form.watch("parent_id");
  const previousAutoSlug = React__default.useRef("");
  const handleNameChange = (name) => {
    form.setValue("name", name);
    form.getValues("slug");
    const autoGeneratedSlug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
    form.setValue("slug", autoGeneratedSlug);
    previousAutoSlug.current = autoGeneratedSlug;
  };
  const selectedParent = parentCategories?.find((cat) => cat.id.toString() === watchParentId);
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxs(DialogContent, { className: "w-full max-w-[95vw] sm:max-w-[600px] max-h-[90vh] flex flex-col", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { className: "flex-shrink-0", children: [
      /* @__PURE__ */ jsx(DialogTitle, { className: "flex items-center gap-2 pr-8", children: isEditing ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Edit, { className: "w-5 h-5" }),
        "Update ",
        isSubcategoryView ? "Subcategory" : "Category"
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5" }),
        "Add ",
        isSubcategoryView ? "Subcategory" : "Category"
      ] }) }),
      /* @__PURE__ */ jsx(DialogDescription, { children: isEditing ? `Update ${isSubcategoryView ? "subcategory" : "category"} details and organization settings.` : `Create a new ${isSubcategoryView ? "subcategory" : "category"} to organize your marketplace items.` })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 pr-2 space-y-6 overflow-y-auto", children: [
      /* @__PURE__ */ jsxs(Alert, { className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
        /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx(AlertDescription, { children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
            isSubcategoryView ? "Subcategory" : "Category",
            " Configuration"
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm", children: [
            "Configure ",
            isSubcategoryView ? "subcategory" : "category",
            " details to help organize and structure your marketplace."
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: form.handleSubmit(
            (data) => handleSaveCategory(data, submit, handleClose, category),
            (errors) => console.log("Form validation errors:", errors)
          ),
          className: "space-y-6",
          children: [
            /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Tag, { className: "w-5 h-5 text-blue-500" }),
                /* @__PURE__ */ jsx(CardTitle, { children: "Basic Information" })
              ] }) }),
              /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
                /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "name",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                      /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                        isSubcategoryView ? "Subcategory" : "Category",
                        " Name",
                        /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                      ] }),
                      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                        Input,
                        {
                          placeholder: `e.g., Electronics, Fashion, Home & Garden`,
                          ...field,
                          onChange: (e) => handleNameChange(e.target.value)
                        }
                      ) }),
                      /* @__PURE__ */ jsx(FormDescription, { children: "A clear, descriptive name that users will see when browsing categories." }),
                      /* @__PURE__ */ jsx(FormMessage, {})
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "slug",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                      /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                        "URL Slug",
                        /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Auto-generated" })
                      ] }),
                      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                        Input,
                        {
                          placeholder: "e.g., electronics, fashion, home-garden",
                          ...field
                        }
                      ) }),
                      /* @__PURE__ */ jsx(FormDescription, { children: "URL-friendly version of the name. Auto-generated but can be customized." }),
                      /* @__PURE__ */ jsx(FormMessage, {})
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "description",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                      /* @__PURE__ */ jsx(FormLabel, { children: "Description" }),
                      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                        Textarea,
                        {
                          placeholder: `Describe what this ${isSubcategoryView ? "subcategory" : "category"} contains...`,
                          className: "min-h-[100px]",
                          ...field
                        }
                      ) }),
                      /* @__PURE__ */ jsx(FormDescription, { children: "Optional description to help users understand what belongs in this category." }),
                      /* @__PURE__ */ jsx(FormMessage, {})
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "is_feature",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md", children: [
                      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                        Checkbox,
                        {
                          checked: field.value,
                          onCheckedChange: field.onChange
                        }
                      ) }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-1 leading-none", children: [
                        /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsx(Star, { className: "w-4 h-4 text-yellow-500" }),
                          "Featured Category"
                        ] }),
                        /* @__PURE__ */ jsx(FormDescription, { children: "Mark this category as featured to display it prominently on the marketplace." })
                      ] })
                    ] })
                  }
                )
              ] })
            ] }),
            organization && /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Package, { className: "w-5 h-5 text-purple-500" }),
                /* @__PURE__ */ jsx(CardTitle, { children: "Organization & Settings" })
              ] }) }),
              /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
                !isSubcategoryView && /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "parent_id",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                      /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                        "Parent Category",
                        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Optional" })
                      ] }),
                      /* @__PURE__ */ jsxs(
                        Select,
                        {
                          onValueChange: (value) => field.onChange(value === "none" ? void 0 : value),
                          value: field.value || "none",
                          children: [
                            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select parent category (optional)" }) }) }),
                            /* @__PURE__ */ jsxs(SelectContent, { children: [
                              /* @__PURE__ */ jsx(SelectItem, { value: "none", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                                /* @__PURE__ */ jsx(Package, { className: "w-4 h-4 text-gray-500" }),
                                /* @__PURE__ */ jsx("span", { children: "No parent (Top-level category)" })
                              ] }) }),
                              parentCategories?.map((parentCat) => /* @__PURE__ */ jsx(SelectItem, { value: parentCat.id.toString(), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                                /* @__PURE__ */ jsx(FolderOpen, { className: "w-4 h-4 text-blue-500" }),
                                /* @__PURE__ */ jsx("span", { children: parentCat.name }),
                                /* @__PURE__ */ jsx("code", { className: "px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded dark:bg-gray-800 dark:text-gray-400", children: parentCat.slug })
                              ] }) }, parentCat.id))
                            ] })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsx(FormDescription, { children: "Choose a parent category to create a subcategory, or leave empty for a top-level category." }),
                      /* @__PURE__ */ jsx(FormMessage, {})
                    ] })
                  }
                ),
                isSubcategoryView && currentParent && /* @__PURE__ */ jsxs(Alert, { className: "border-purple-200 bg-purple-50 dark:bg-purple-950", children: [
                  /* @__PURE__ */ jsx(FolderOpen, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx(AlertDescription, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxs("span", { children: [
                        /* @__PURE__ */ jsx("strong", { children: "Parent Category:" }),
                        " ",
                        currentParent.name
                      ] }),
                      /* @__PURE__ */ jsx("code", { className: "px-2 py-1 text-xs bg-white rounded dark:bg-gray-800", children: currentParent.slug })
                    ] }),
                    /* @__PURE__ */ jsx(Badge, { variant: "default", className: "text-xs", children: "Fixed" })
                  ] }) })
                ] }),
                selectedParent && !isSubcategoryView && /* @__PURE__ */ jsxs(Alert, { className: "border-green-200 bg-green-50 dark:bg-green-950", children: [
                  /* @__PURE__ */ jsx(Package, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx(AlertDescription, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxs("span", { children: [
                        /* @__PURE__ */ jsx("strong", { children: "Parent:" }),
                        " ",
                        selectedParent.name
                      ] }),
                      /* @__PURE__ */ jsx("code", { className: "px-2 py-1 text-xs bg-white rounded dark:bg-gray-800", children: selectedParent.slug })
                    ] }),
                    /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Subcategory" })
                  ] }) })
                ] })
              ] })
            ] })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-end flex-shrink-0 gap-3 pt-6 bg-white border-t sm:flex-row dark:bg-gray-950", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: handleClose,
          disabled: isSubmitting,
          className: "w-full sm:w-auto",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "submit",
          disabled: isSubmitting,
          className: "w-full sm:w-auto",
          onClick: () => form.handleSubmit((e) => handleSaveCategory(e, submit, handleClose, category))(),
          children: /* @__PURE__ */ jsx(
            ButtonLoader,
            {
              isSubmitting,
              btnText: isEditing ? `Update ${isSubcategoryView ? "Subcategory" : "Category"}` : `Create ${isSubcategoryView ? "Subcategory" : "Category"}`,
              loaderText: isEditing ? "Updating..." : "Creating..."
            }
          )
        }
      )
    ] })
  ] }) });
}
export {
  CategoryDialog as C,
  getCategoryBreadcrumbItems as a,
  getCategoryStats as b,
  getDeleteDialogConfig as c,
  getCategoryFilterOptions as d,
  onCategoryDelete as e,
  onCategorySearch as f,
  getSubcategoryBreadcrumbItems as g,
  onCategoryFilterChange as h,
  onCategoryBulkAction as i,
  onCategoryStatusUpdate as o
};

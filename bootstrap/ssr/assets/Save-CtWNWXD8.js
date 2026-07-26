import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import React__default, { useRef, useState, useEffect } from "react";
import { router, usePage, Head } from "@inertiajs/react";
import { FileText, Image, Upload, X, CheckCircle, Eye, Tag, Plus, FolderOpen, Save, ArrowLeft, Edit, Info } from "lucide-react";
import { B as BaseLayout, A as AuthenticatedLayout, M as Main } from "./Main-BjCbeyG1.js";
import { A as Alert, a as AlertDescription } from "./Alert-3s5DZB4H.js";
import { C as CommonLayoutHeader } from "./CommonLayoutHeader-CyKOpByu.js";
import { i as handleSaveBlog, j as getBlogSaveBreadcrumbItems } from "./BlogController-D6kflUCs.js";
import { z } from "zod";
import { useForm as useForm$1 } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { i as isDarkMode, B as Button } from "./Button-CFMlPXiE.js";
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, e as FormDescription, f as FormMessage } from "./Form-dg4L2iRR.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./MarketGrid-DlkazA02.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./Card-CQ2ij0--.js";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import { R as RichTextEditor } from "./RichTextEditor-cWbzZRFQ.js";
import { C as CategoryDialog } from "./CategoryDialog-WJXZpB7q.js";
import { T as TagDialog } from "./TagDialog-DHdQLSZJ.js";
import "./Sheet-B-_2BaZp.js";
import "@radix-ui/react-direction";
import "class-variance-authority";
import "@radix-ui/react-icons";
import "@radix-ui/react-avatar";
import "@radix-ui/react-separator";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "@radix-ui/react-dialog";
import "@radix-ui/react-scroll-area";
import "./constants-4k_q_jeE.js";
import "./BlogSection-DiGfvTON.js";
import "./EmptyData-DjqqIMwS.js";
import "clsx";
import "react-hot-toast";
import "framer-motion";
import "./BlogCard-Jrl9AHYg.js";
import "./Label-BxDBN09D.js";
import "@radix-ui/react-label";
import "@radix-ui/react-switch";
import "@radix-ui/react-accordion";
import "./TradeDialog-Dt4WEyMP.js";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-tabs";
import "./SlideUp-CpffxXZf.js";
import "motion/react";
import "./PaginationWrapper-B-KWAp7V.js";
import "./Table-Dz-EvWd_.js";
import "./demo-data-C5EGh9Nk.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
import "react-icons/fa";
import "@radix-ui/react-slot";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-alert-dialog";
import "./AuthController-DaCguZ7K.js";
import "@radix-ui/react-radio-group";
import "./Breadcrumb-D0MBns-9.js";
import "tailwind-merge";
import "@radix-ui/react-select";
import "./Progress-DT6CA82_.js";
import "@radix-ui/react-progress";
import "react-icons/bs";
import "react-quill-new";
import "./Checkbox-CsK9i2JK.js";
import "@radix-ui/react-checkbox";
const blogSchema = z.object({
  title: z.string().min(1, "Title is required").max(191, "Title must be less than 191 characters"),
  description: z.string().optional(),
  image: z.any().optional(),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  tags: z.array(z.string()).optional()
});
function BlogSaveForm({ props, blog, tags, categories, isEditing }) {
  const { loading: isSubmitting, errors: serverErrors, submit } = useForm();
  const editorRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  blog = blog?.data || blog;
  categories = categories?.data || categories;
  tags = tags?.data || tags;
  useEffect(() => {
    if (blog?.img_url && isEditing) {
      setImagePreview(blog.img_url);
      setOriginalImage(blog.img_url);
    }
  }, [blog, isEditing]);
  const defaultValues = {
    title: blog?.title || "",
    description: blog?.description || "",
    image: null,
    categories: blog?.categories?.map((cat) => cat.id.toString()) || [],
    tags: blog?.tags?.map((tag) => tag.id.toString()) || []
  };
  const form = useForm$1({
    resolver: zodResolver(blogSchema),
    defaultValues
  });
  React__default.useEffect(() => {
    if (blog && isEditing) {
      form.reset({
        title: blog.title || "",
        description: blog.description || "",
        image: null,
        categories: blog.categories?.map((cat) => cat.id.toString()) || [],
        tags: blog.tags?.map((tag) => tag.id.toString()) || []
      });
    }
  }, [blog, isEditing, form]);
  const handleImageChange = (e, onChange) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      onChange(file);
    }
  };
  const clearImagePreview = (onChange) => {
    setImagePreview(originalImage);
    onChange(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };
  const watchCategories = form.watch("categories");
  const watchTags = form.watch("tags");
  const watchImage = form.watch("image");
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const handleCreateCategory = () => {
    setShowCategoryDialog(true);
  };
  const [showTagDialog, setShowTagDialog] = useState(false);
  const handleCreateTag = () => {
    setShowTagDialog(true);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit((data) => handleSaveBlog(data, submit, blog, form, editorRef, document.querySelectorAll('input[type="file"]'), setImagePreview)), className: "space-y-6", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(FileText, { className: "w-5 h-5 text-blue-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Basic Information" })
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "title",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                  "Blog Title",
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                ] }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    placeholder: "Enter an engaging blog title...",
                    className: "text-lg",
                    ...field
                  }
                ) }),
                /* @__PURE__ */ jsx(FormDescription, { children: "A compelling title that captures the essence of your blog post (max 191 characters)." }),
                /* @__PURE__ */ jsx(FormMessage, {}),
                serverErrors?.title && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.title })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "description",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                  "Blog Content",
                  /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Optional" })
                ] }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  RichTextEditor,
                  {
                    ref: editorRef,
                    value: field.value || "",
                    onChange: field.onChange,
                    placeholder: "Write your blog content here...",
                    height: "400px",
                    toolbar: "full",
                    className: "border border-gray-300 rounded-md dark:border-gray-600",
                    darkMode: isDarkMode(props?.site_theme_settings)
                  }
                ) }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Use the rich text editor to create engaging blog content with formatting, images, and links." }),
                /* @__PURE__ */ jsx(FormMessage, {}),
                serverErrors?.description && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.description })
              ] })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Image, { className: "w-5 h-5 text-purple-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Featured Image" }),
          imagePreview && /* @__PURE__ */ jsx(Badge, { variant: "default", className: "text-xs", children: "Image Ready" })
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "space-y-6", children: /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "image",
            render: ({ field: { onChange, ...rest } }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4" }),
                "Featured Image",
                /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Optional" })
              ] }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "file",
                      accept: "image/*",
                      onChange: (e) => handleImageChange(e, onChange),
                      className: "flex w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    }
                  ) }),
                  imagePreview && /* @__PURE__ */ jsxs(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      onClick: () => clearImagePreview(onChange),
                      className: "text-red-600 hover:text-red-700",
                      children: [
                        /* @__PURE__ */ jsx(X, { className: "w-3 h-3 mr-1" }),
                        "Clear"
                      ]
                    }
                  )
                ] }),
                imagePreview && /* @__PURE__ */ jsx("div", { className: "relative inline-block", children: /* @__PURE__ */ jsx("div", { className: "p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-900", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: imagePreview,
                      alt: "Featured Image Preview",
                      className: "object-cover w-full h-48 max-w-md border rounded-lg"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-green-600", children: [
                      /* @__PURE__ */ jsx(CheckCircle, { className: "w-3 h-3" }),
                      watchImage ? "New image ready for upload" : "Current featured image"
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-500", children: [
                      /* @__PURE__ */ jsx(Eye, { className: "w-3 h-3" }),
                      "Preview"
                    ] })
                  ] })
                ] }) }) }),
                !imagePreview && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600", children: [
                  /* @__PURE__ */ jsx(Image, { className: "w-8 h-8 mb-2 text-gray-400" }),
                  /* @__PURE__ */ jsx("p", { className: "mb-1 text-sm text-gray-500", children: "No image selected" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: "PNG, JPG, JPEG (MAX. 2MB)" })
                ] }) })
              ] }) }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Upload a featured image for your blog post. This will appear as the main image in listings and the post header." }),
              /* @__PURE__ */ jsx(FormMessage, {}),
              serverErrors?.image && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.image })
            ] })
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Tag, { className: "w-5 h-5 text-green-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Categories & Tags" })
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "categories",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    "Categories",
                    /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                  ] }),
                  /* @__PURE__ */ jsxs(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      className: "px-2 text-xs h-7",
                      onClick: handleCreateCategory,
                      children: [
                        /* @__PURE__ */ jsx(Plus, { className: "w-3 h-3 mr-1" }),
                        "Add Category"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    value: "",
                    onValueChange: (value) => {
                      const currentValues = field.value || [];
                      if (!currentValues.includes(value)) {
                        field.onChange([...currentValues, value]);
                      }
                    },
                    children: [
                      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select categories for your blog post" }) }) }),
                      /* @__PURE__ */ jsx(SelectContent, { className: "max-h-[300px]", children: categories?.map((category) => /* @__PURE__ */ jsx(
                        SelectItem,
                        {
                          value: category.id.toString(),
                          disabled: watchCategories?.includes(category.id.toString()),
                          children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsx(FolderOpen, { className: "w-4 h-4 text-blue-500" }),
                            /* @__PURE__ */ jsx("span", { children: category.name })
                          ] })
                        },
                        category.id
                      )) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(FormDescription, { children: "Select one or more categories that best describe your blog post content." }),
                /* @__PURE__ */ jsx(FormMessage, {}),
                serverErrors?.categories && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.categories }),
                watchCategories && watchCategories.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: watchCategories.map((categoryId) => {
                  const category = categories.find((cat) => cat.id.toString() === categoryId);
                  return /* @__PURE__ */ jsxs(
                    Badge,
                    {
                      variant: "secondary",
                      className: "flex items-center gap-1",
                      children: [
                        /* @__PURE__ */ jsx(FolderOpen, { className: "w-3 h-3" }),
                        /* @__PURE__ */ jsx("span", { children: category?.name }),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            className: "ml-1 text-sm text-gray-500 hover:text-gray-700",
                            onClick: () => {
                              const newCategories = watchCategories.filter((id) => id !== categoryId);
                              field.onChange(newCategories);
                            },
                            children: "×"
                          }
                        )
                      ]
                    },
                    categoryId
                  );
                }) })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "tags",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    "Tags",
                    /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Optional" })
                  ] }),
                  /* @__PURE__ */ jsxs(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      className: "px-2 text-xs h-7",
                      onClick: handleCreateTag,
                      children: [
                        /* @__PURE__ */ jsx(Plus, { className: "w-3 h-3 mr-1" }),
                        "Add Tag"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    value: "",
                    onValueChange: (value) => {
                      const currentValues = field.value || [];
                      if (!currentValues.includes(value)) {
                        field.onChange([...currentValues, value]);
                      }
                    },
                    children: [
                      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Add tags to your blog post" }) }) }),
                      /* @__PURE__ */ jsx(SelectContent, { className: "max-h-[300px]", children: tags?.map((tag) => /* @__PURE__ */ jsx(
                        SelectItem,
                        {
                          value: tag.id.toString(),
                          disabled: watchTags?.includes(tag.id.toString()),
                          children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsx(Tag, { className: "w-3 h-3 text-green-500" }),
                            /* @__PURE__ */ jsx("span", { children: tag.name })
                          ] })
                        },
                        tag.id
                      )) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(FormDescription, { children: "Add relevant tags to help readers discover your blog post." }),
                /* @__PURE__ */ jsx(FormMessage, {}),
                serverErrors?.tags && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.tags }),
                watchTags && watchTags.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: watchTags.map((tagId) => {
                  const tag = tags.find((t) => t.id.toString() === tagId);
                  return /* @__PURE__ */ jsxs(
                    Badge,
                    {
                      variant: "outline",
                      className: "flex items-center gap-1",
                      children: [
                        /* @__PURE__ */ jsx(Tag, { className: "w-3 h-3" }),
                        /* @__PURE__ */ jsx("span", { children: tag?.name }),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            className: "ml-1 text-sm text-gray-500 hover:text-gray-700",
                            onClick: () => {
                              const newTags = watchTags.filter((id) => id !== tagId);
                              field.onChange(newTags);
                            },
                            children: "×"
                          }
                        )
                      ]
                    },
                    tagId
                  );
                }) })
              ] })
            }
          )
        ] })
      ] }),
      (watchImage || imagePreview) && /* @__PURE__ */ jsx(Card, { className: "border-green-200 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950", children: /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h3", { className: "flex items-center gap-2 text-lg font-semibold", children: [
            "Image Ready",
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Featured image selected" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: watchImage ? "New featured image ready for upload" : "Current featured image will be used" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-10 h-10 text-green-600 bg-green-100 rounded-full dark:bg-green-900", children: /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5" }) }) })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 ", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            disabled: isSubmitting,
            className: "w-full sm:w-auto",
            children: /* @__PURE__ */ jsx(
              ButtonLoader,
              {
                isSubmitting,
                btnText: isEditing ? "Update Blog Post" : "Create Blog Post",
                loaderText: isEditing ? "Updating..." : "Creating...",
                icon: /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" })
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => router.visit("/admin/blogs"),
            disabled: isSubmitting,
            className: "w-full sm:w-auto",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
              "Cancel"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      CategoryDialog,
      {
        open: showCategoryDialog,
        onOpenChange: setShowCategoryDialog,
        mode: "create",
        organization: false
      }
    ),
    /* @__PURE__ */ jsx(
      TagDialog,
      {
        open: showTagDialog,
        onOpenChange: setShowTagDialog,
        mode: "create"
      }
    )
  ] });
}
function CreateBlog({
  title,
  blog = null,
  categories = [],
  tags = []
}) {
  const { props } = usePage();
  blog = blog?.data;
  categories = categories?.data || categories;
  tags = tags?.data || tags;
  const isEditing = blog != null;
  return /* @__PURE__ */ jsx(BaseLayout, { children: /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(Main, { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(
        CommonLayoutHeader,
        {
          variant: "inner",
          breadcrumbItems: getBlogSaveBreadcrumbItems(isEditing),
          title: isEditing ? "Edit Blog Post" : "Create New Blog Post",
          description: isEditing ? "Update your blog post content and settings" : "Create engaging content for your blog",
          icon: isEditing ? Edit : Plus,
          primaryAction: {
            label: "Back to Blogs",
            icon: ArrowLeft,
            onClick: () => router.visit("/admin/blogs"),
            variant: "outline"
          },
          badges: isEditing ? [
            { label: `ID: ${blog?.id}`, variant: "secondary" },
            { label: "Editing Mode", variant: "outline" }
          ] : []
        }
      ),
      /* @__PURE__ */ jsxs(Alert, { className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
        /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx(AlertDescription, { children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Blog Post Configuration" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm", children: [
            "Fill in the details below to ",
            isEditing ? "update" : "create",
            " your blog post. All fields marked as required must be completed."
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        BlogSaveForm,
        {
          props,
          blog,
          tags,
          categories,
          isEditing
        }
      ) })
    ] })
  ] }) });
}
export {
  CreateBlog as default
};

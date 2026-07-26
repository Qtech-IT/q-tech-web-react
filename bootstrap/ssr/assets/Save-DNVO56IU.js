import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import React__default, { useRef } from "react";
import { router, usePage, Head } from "@inertiajs/react";
import { FileText, Save, ArrowLeft, Edit, Plus, Info } from "lucide-react";
import { B as BaseLayout, A as AuthenticatedLayout, M as Main } from "./Main-BjCbeyG1.js";
import { A as Alert, a as AlertDescription } from "./Alert-3s5DZB4H.js";
import { C as CommonLayoutHeader } from "./CommonLayoutHeader-CyKOpByu.js";
import { h as handleSavePage, i as getPageSaveBreadcrumbItems } from "./PagesController-CMH21MmJ.js";
import { z } from "zod";
import { useForm as useForm$1 } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { i as isDarkMode, B as Button } from "./Button-CFMlPXiE.js";
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, e as FormDescription, f as FormMessage } from "./Form-dg4L2iRR.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./Card-CQ2ij0--.js";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import { R as RichTextEditor } from "./RichTextEditor-cWbzZRFQ.js";
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
import "./MarketGrid-DlkazA02.js";
import "@radix-ui/react-select";
import "./Progress-DT6CA82_.js";
import "@radix-ui/react-progress";
import "react-icons/bs";
import "./MarketSectionTwo-RD2Nw8tb.js";
import "react-icons/fa";
import "@radix-ui/react-slot";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-alert-dialog";
import "./AuthController-DaCguZ7K.js";
import "@radix-ui/react-radio-group";
import "./Breadcrumb-D0MBns-9.js";
import "tailwind-merge";
import "react-quill-new";
const pageSchema = z.object({
  title: z.string().min(1, "Title is required").max(191, "Title must be less than 191 characters"),
  description: z.string().min(1, "Description is required")
});
function PageSaveForm({ props, page, isEditing }) {
  const { loading: isSubmitting, errors: serverErrors, submit } = useForm();
  const editorRef = useRef(null);
  page = page?.data || page;
  const defaultValues = {
    title: page?.title || "",
    description: page?.description || ""
  };
  const form = useForm$1({
    resolver: zodResolver(pageSchema),
    defaultValues
  });
  React__default.useEffect(() => {
    if (page && isEditing) {
      form.reset({
        title: page.title || "",
        description: page.description || ""
      });
    }
  }, [page, isEditing, form]);
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit((data) => handleSavePage(data, submit, page, form, editorRef)), className: "space-y-6", children: [
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
                "Page Title",
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
              ] }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Enter an engaging page title...",
                  className: "text-lg",
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsx(FormDescription, { children: "A compelling title that captures the essence of your page  (max 191 characters)." }),
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
                "Page Description",
                /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Required" })
              ] }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                RichTextEditor,
                {
                  ref: editorRef,
                  value: field.value || "",
                  onChange: field.onChange,
                  placeholder: "Write your page content here...",
                  height: "400px",
                  toolbar: "full",
                  className: "border border-gray-300 rounded-md dark:border-gray-600",
                  darkMode: isDarkMode(props?.site_theme_settings)
                }
              ) }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Use the rich text editor to create engaging page content with formatting, images, and links." }),
              /* @__PURE__ */ jsx(FormMessage, {}),
              serverErrors?.description && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.description })
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3 ", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "submit",
          disabled: isSubmitting,
          children: /* @__PURE__ */ jsx(
            ButtonLoader,
            {
              isSubmitting,
              btnText: isEditing ? "Update Page" : "Create Page",
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
          onClick: () => router.visit("/admin/pages"),
          disabled: isSubmitting,
          className: "w-full sm:w-auto",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 " }),
            "Cancel"
          ]
        }
      )
    ] })
  ] }) }) });
}
function Createpage({
  title,
  page = null
}) {
  const { props } = usePage();
  page = page?.data;
  const isEditing = page != null;
  return /* @__PURE__ */ jsx(BaseLayout, { children: /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(Main, { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(
        CommonLayoutHeader,
        {
          variant: "inner",
          breadcrumbItems: getPageSaveBreadcrumbItems(isEditing),
          title: isEditing ? "Edit Pagee" : "Create New Page",
          description: isEditing ? "Update your page  content and settings" : "Create engaging page for your site",
          icon: isEditing ? Edit : Plus,
          primaryAction: {
            label: "Back to Pages",
            icon: ArrowLeft,
            onClick: () => router.visit("/admin/pages"),
            variant: "outline"
          },
          badges: isEditing ? [
            { label: `ID: ${page?.id}`, variant: "secondary" },
            { label: "Editing Mode", variant: "outline" }
          ] : []
        }
      ),
      /* @__PURE__ */ jsxs(Alert, { className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
        /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx(AlertDescription, { children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Page Configuration" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm", children: [
            "Fill in the details below to ",
            isEditing ? "update" : "create",
            " your page . All fields marked as required must be completed."
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "max-w-4xl", children: /* @__PURE__ */ jsx(
        PageSaveForm,
        {
          props,
          page,
          isEditing
        }
      ) })
    ] })
  ] }) });
}
export {
  Createpage as default
};

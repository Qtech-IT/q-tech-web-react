import { jsx, jsxs } from "react/jsx-runtime";
import React__default, { useState, useEffect } from "react";
import { router, usePage, Head } from "@inertiajs/react";
import { User, Mail, Phone, Lock, MapPin, Upload, X, CheckCircle, Eye, Save, ArrowLeft, Edit, Plus, Info } from "lucide-react";
import { B as BaseLayout, A as AuthenticatedLayout, M as Main } from "./Main-BjCbeyG1.js";
import { A as Alert, a as AlertDescription } from "./Alert-3s5DZB4H.js";
import { C as CommonLayoutHeader } from "./CommonLayoutHeader-CyKOpByu.js";
import { m as handleSaveUser, n as getUserSaveBreadcrumbItems } from "./UserController-CXMhOV3I.js";
import { z } from "zod";
import { useForm as useForm$1 } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { B as Button } from "./Button-CFMlPXiE.js";
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, e as FormDescription, f as FormMessage } from "./Form-dg4L2iRR.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./Card-CQ2ij0--.js";
import { B as Badge } from "./Badge-B6jlhcU-.js";
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
const userSchema = z.object({
  name: z.string().min(1, "Name is required").max(191),
  email: z.string().email("Invalid email").max(191),
  phone: z.string().optional(),
  password: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().optional()
  }).optional(),
  image: z.any().optional()
});
function UserSaveForm({ user, isEditing }) {
  const { loading: isSubmitting, errors: serverErrors, submit } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  user = user?.data || user;
  useEffect(() => {
    if (user?.img_url && isEditing) {
      setImagePreview(user.img_url);
      setOriginalImage(user.img_url);
    }
  }, [user, isEditing]);
  const form = useForm$1({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      password: "",
      address: {
        street: user?.address?.street || "",
        city: user?.address?.city || "",
        state: user?.address?.state || "",
        postal_code: user?.address?.postal_code || "",
        country: user?.address?.country || ""
      },
      image: null
    }
  });
  React__default.useEffect(() => {
    if (user && isEditing) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        address: {
          street: user?.address?.street || "",
          city: user?.address?.city || "",
          state: user?.address?.state || "",
          postal_code: user?.address?.postal_code || "",
          country: user?.address?.country || ""
        },
        image: null
      });
    }
  }, [user, isEditing, form]);
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
    if (fileInput) fileInput.value = "";
  };
  const watchImage = form.watch("image");
  const onSubmit = (data) => {
    handleSaveUser(data, submit, user, form, document.querySelectorAll('input[type="file"]'), setImagePreview);
  };
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(User, { className: "w-5 h-5 text-blue-500" }),
        /* @__PURE__ */ jsx(CardTitle, { children: "Basic Information" })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsx(FormField, { control: form.control, name: "name", render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
          /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
            "User Name ",
            /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
          ] }),
          /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "Enter user name...", ...field }) }),
          /* @__PURE__ */ jsx(FormDescription, { children: "Full name of the user" }),
          /* @__PURE__ */ jsx(FormMessage, {}),
          serverErrors?.name && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.name })
        ] }) }),
        /* @__PURE__ */ jsx(FormField, { control: form.control, name: "email", render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
          /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4" }),
            " Email Address ",
            /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
          ] }),
          /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "email", placeholder: "user@example.com", ...field }) }),
          /* @__PURE__ */ jsx(FormDescription, { children: "Email for login and notifications" }),
          /* @__PURE__ */ jsx(FormMessage, {}),
          serverErrors?.email && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.email })
        ] }) }),
        /* @__PURE__ */ jsx(FormField, { control: form.control, name: "phone", render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
          /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4" }),
            " Phone Number ",
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Optional" })
          ] }),
          /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "+1234567890", ...field }) }),
          /* @__PURE__ */ jsx(FormDescription, { children: "Contact phone number" }),
          /* @__PURE__ */ jsx(FormMessage, {}),
          serverErrors?.phone && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.phone })
        ] }) }),
        /* @__PURE__ */ jsx(FormField, { control: form.control, name: "password", render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
          /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4" }),
            " Password ",
            /* @__PURE__ */ jsx(Badge, { variant: isEditing ? "outline" : "secondary", className: "text-xs", children: isEditing ? "Optional" : "Required" })
          ] }),
          /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "password", placeholder: isEditing ? "Leave blank to keep current" : "Enter password", ...field }) }),
          /* @__PURE__ */ jsx(FormDescription, { children: isEditing ? "Only fill to change password" : "Password for login" }),
          /* @__PURE__ */ jsx(FormMessage, {}),
          serverErrors?.password && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.password })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5 text-green-500" }),
        /* @__PURE__ */ jsx(CardTitle, { children: "Address Information" })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsx(FormField, { control: form.control, name: "address.street", render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
          /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
            "Street Address ",
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Optional" })
          ] }),
          /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "Enter street address...", ...field }) }),
          /* @__PURE__ */ jsx(FormDescription, { children: "Street address or building number" }),
          /* @__PURE__ */ jsx(FormMessage, {}),
          serverErrors?.["address.street"] && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors["address.street"] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
          /* @__PURE__ */ jsx(FormField, { control: form.control, name: "address.city", render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
              "City ",
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Optional" })
            ] }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "Enter city...", ...field }) }),
            /* @__PURE__ */ jsx(FormDescription, { children: "City name" }),
            /* @__PURE__ */ jsx(FormMessage, {}),
            serverErrors?.["address.city"] && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors["address.city"] })
          ] }) }),
          /* @__PURE__ */ jsx(FormField, { control: form.control, name: "address.state", render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
              "State/Province ",
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Optional" })
            ] }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "Enter state...", ...field }) }),
            /* @__PURE__ */ jsx(FormDescription, { children: "State or province" }),
            /* @__PURE__ */ jsx(FormMessage, {}),
            serverErrors?.["address.state"] && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors["address.state"] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
          /* @__PURE__ */ jsx(FormField, { control: form.control, name: "address.postal_code", render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
              "Postal Code ",
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Optional" })
            ] }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "Enter postal code...", ...field }) }),
            /* @__PURE__ */ jsx(FormDescription, { children: "ZIP or postal code" }),
            /* @__PURE__ */ jsx(FormMessage, {}),
            serverErrors?.["address.postal_code"] && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors["address.postal_code"] })
          ] }) }),
          /* @__PURE__ */ jsx(FormField, { control: form.control, name: "address.country", render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
              "Country ",
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Optional" })
            ] }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "Enter country...", ...field }) }),
            /* @__PURE__ */ jsx(FormDescription, { children: "Country name" }),
            /* @__PURE__ */ jsx(FormMessage, {}),
            serverErrors?.["address.country"] && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors["address.country"] })
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Upload, { className: "w-5 h-5 text-purple-500" }),
        /* @__PURE__ */ jsx(CardTitle, { children: "Profile Image" }),
        imagePreview && /* @__PURE__ */ jsx(Badge, { variant: "default", className: "text-xs", children: "Image Ready" })
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "space-y-6", children: /* @__PURE__ */ jsx(FormField, { control: form.control, name: "image", render: ({ field: { onChange, ...rest } }) => /* @__PURE__ */ jsxs(FormItem, { children: [
        /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4" }),
          " Profile Image ",
          /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Optional" })
        ] }),
        /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", onChange: (e) => handleImageChange(e, onChange), className: "flex w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background" }) }),
            imagePreview && /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: () => clearImagePreview(onChange), className: "text-red-600", children: [
              /* @__PURE__ */ jsx(X, { className: "w-3 h-3 mr-1" }),
              " Clear"
            ] })
          ] }),
          imagePreview && /* @__PURE__ */ jsx("div", { className: "relative inline-block", children: /* @__PURE__ */ jsx("div", { className: "p-4 border-2 border-dashed rounded-lg bg-gray-50 dark:bg-gray-900", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("img", { src: imagePreview, alt: "Profile", className: "object-cover w-32 h-32 border rounded-full" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-green-600", children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "w-3 h-3" }),
                watchImage ? "New image ready" : "Current image"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-500", children: [
                /* @__PURE__ */ jsx(Eye, { className: "w-3 h-3" }),
                " Preview"
              ] })
            ] })
          ] }) }) }),
          !imagePreview && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg bg-gray-50", children: [
            /* @__PURE__ */ jsx(User, { className: "w-8 h-8 mb-2 text-gray-400" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "No image selected" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: "PNG, JPG (MAX 2MB)" })
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsx(FormDescription, { children: "Upload a profile image" }),
        /* @__PURE__ */ jsx(FormMessage, {}),
        serverErrors?.image && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.image })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsx(Button, { type: "button", disabled: isSubmitting, className: "w-full sm:w-auto", onClick: form.handleSubmit(onSubmit), children: /* @__PURE__ */ jsx(ButtonLoader, { isSubmitting, btnText: isEditing ? "Update User" : "Create User", loaderText: isEditing ? "Updating..." : "Creating...", icon: /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }) }) }),
      /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", onClick: () => router.visit("/admin/users"), disabled: isSubmitting, className: "w-full sm:w-auto", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
        " Cancel"
      ] })
    ] })
  ] }) });
}
function SaveUser({
  title,
  user = null
}) {
  const { props } = usePage();
  user = user?.data;
  const isEditing = user != null;
  return /* @__PURE__ */ jsx(BaseLayout, { children: /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(Main, { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(
        CommonLayoutHeader,
        {
          variant: "inner",
          breadcrumbItems: getUserSaveBreadcrumbItems(isEditing),
          title: isEditing ? "Edit User" : "Create New User",
          description: isEditing ? "Update user information and settings" : "Create a new user account",
          icon: isEditing ? Edit : Plus,
          primaryAction: {
            label: "Back to Users",
            icon: ArrowLeft,
            onClick: () => router.visit("/admin/users"),
            variant: "outline"
          },
          badges: isEditing ? [
            { label: `ID: ${user?.id}`, variant: "secondary" },
            { label: "Editing Mode", variant: "outline" }
          ] : []
        }
      ),
      /* @__PURE__ */ jsxs(Alert, { className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
        /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx(AlertDescription, { children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: "User Account Configuration" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm", children: [
            "Fill in the details below to ",
            isEditing ? "update" : "create",
            " the user account. All fields marked as required must be completed."
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        UserSaveForm,
        {
          props,
          user,
          isEditing
        }
      ) })
    ] })
  ] }) });
}
export {
  SaveUser as default
};

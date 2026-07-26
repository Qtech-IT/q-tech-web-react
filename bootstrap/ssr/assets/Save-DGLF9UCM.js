import { jsx, jsxs } from "react/jsx-runtime";
import React__default, { useState } from "react";
import { router, usePage, Head } from "@inertiajs/react";
import { Users, X, Upload, Mail, Phone, MapPin, Shield, EyeOff, Eye, Save as Save$1, ArrowLeft, Edit, Plus, Info } from "lucide-react";
import { B as BaseLayout, A as AuthenticatedLayout, M as Main } from "./Main-BjCbeyG1.js";
import { A as Alert, a as AlertDescription } from "./Alert-3s5DZB4H.js";
import { C as CommonLayoutHeader } from "./CommonLayoutHeader-CyKOpByu.js";
import { i as handleSaveAdmin, j as getAdminSaveBreadcrumbItems } from "./AdminUserController-kpy-Kjgj.js";
import { z } from "zod";
import { useForm as useForm$1 } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { B as Button } from "./Button-CFMlPXiE.js";
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, e as FormDescription, f as FormMessage } from "./Form-dg4L2iRR.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./MarketGrid-DlkazA02.js";
import { T as Textarea } from "./constants-4k_q_jeE.js";
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
import "react-icons/fa";
import "@radix-ui/react-slot";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-alert-dialog";
import "./AuthController-DaCguZ7K.js";
import "./TradeDialog-Dt4WEyMP.js";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-tabs";
import "framer-motion";
import "./SlideUp-CpffxXZf.js";
import "./Label-BxDBN09D.js";
import "@radix-ui/react-label";
import "react-hot-toast";
import "@radix-ui/react-radio-group";
import "./Breadcrumb-D0MBns-9.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-select";
import "./Progress-DT6CA82_.js";
import "@radix-ui/react-progress";
import "react-icons/bs";
import "./EmptyData-DjqqIMwS.js";
import "./BlogSection-DiGfvTON.js";
import "./BlogCard-Jrl9AHYg.js";
import "@radix-ui/react-switch";
import "@radix-ui/react-accordion";
import "motion/react";
import "./PaginationWrapper-B-KWAp7V.js";
import "./Table-Dz-EvWd_.js";
import "./demo-data-C5EGh9Nk.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
const adminSchema = z.object({
  name: z.string().min(1, "Name is required").max(191),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  role_id: z.string().min(1, "Role is required"),
  password: z.string().optional(),
  image: z.any().optional()
});
function AdminUserSaveForm({ props, admin, roles, isEditing }) {
  const { loading: isSubmitting, errors: serverErrors, submit } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(admin?.img_url || null);
  const [selectedFile, setSelectedFile] = useState(null);
  admin = admin?.data || admin;
  const defaultValues = React__default.useMemo(() => ({
    name: admin?.name || "",
    email: admin?.email || "",
    phone: admin?.phone || "",
    address: admin?.address || "",
    role_id: admin?.role_id?.toString() || "",
    password: "",
    image: null
  }), [admin]);
  const form = useForm$1({
    resolver: zodResolver(adminSchema),
    defaultValues
  });
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      form.setValue("image", file);
    }
  };
  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    form.setValue("image", null);
  };
  const handleFormSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone || "");
    formData.append("address", data.address || "");
    formData.append("role_id", data.role_id);
    if (data.password) {
      formData.append("password", data.password);
    }
    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    handleSaveAdmin(formData, submit, admin, form);
  };
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(handleFormSubmit), className: "space-y-6", children: [
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Users, { className: "w-5 h-5 text-blue-500" }),
        /* @__PURE__ */ jsx(CardTitle, { children: "Basic Information" })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "image",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { children: "Profile Image" }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                imagePreview ? /* @__PURE__ */ jsxs("div", { className: "relative inline-block", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: imagePreview,
                      alt: "Preview",
                      className: "object-cover w-32 h-32 border-2 border-gray-200 rounded-lg dark:border-gray-700"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      type: "button",
                      variant: "destructive",
                      size: "icon",
                      className: "absolute top-0 right-0 w-6 h-6 -mt-2 -mr-2",
                      onClick: handleRemoveImage,
                      children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
                    }
                  )
                ] }) : /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-700", children: /* @__PURE__ */ jsx(Upload, { className: "w-8 h-8 text-gray-400" }) }),
                /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "file",
                    accept: "image/*",
                    onChange: handleImageChange,
                    className: "max-w-xs"
                  }
                ) })
              ] }) }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Upload a profile image (JPEG, PNG, GIF - Max 2MB)" }),
              /* @__PURE__ */ jsx(FormMessage, {}),
              serverErrors?.image && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.image })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "name",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                "Name",
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
              ] }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "John Doe", ...field }) }),
              /* @__PURE__ */ jsx(FormMessage, {}),
              serverErrors?.name && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.name })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "email",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4" }),
                  "Email",
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                ] }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "email", placeholder: "admin@example.com", ...field }) }),
                /* @__PURE__ */ jsx(FormMessage, {}),
                serverErrors?.email && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.email })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "phone",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4" }),
                  "Phone"
                ] }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "+1234567890", ...field }) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "address",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4" }),
                "Address"
              ] }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Textarea,
                {
                  placeholder: "Enter full address",
                  rows: 3,
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Shield, { className: "w-5 h-5 text-purple-500" }),
        /* @__PURE__ */ jsx(CardTitle, { children: "Role & Security" })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "role_id",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                "Role",
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
              ] }),
              /* @__PURE__ */ jsxs(
                Select,
                {
                  onValueChange: field.onChange,
                  value: field.value,
                  children: [
                    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select a role" }) }) }),
                    /* @__PURE__ */ jsx(SelectContent, { children: roles?.map((role) => /* @__PURE__ */ jsx(SelectItem, { value: role.id.toString(), children: role.name }, role.id)) })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(FormDescription, { children: "Assign a role to determine user permissions" }),
              /* @__PURE__ */ jsx(FormMessage, {}),
              serverErrors?.role_id && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.role_id })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "password",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                "Password",
                !isEditing && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
              ] }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: showPassword ? "text" : "password",
                    placeholder: isEditing ? "Leave empty to keep current password" : "Enter password",
                    ...field
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "icon",
                    className: "absolute top-0 right-0 h-full",
                    onClick: () => setShowPassword(!showPassword),
                    children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsx(FormDescription, { children: isEditing ? "Leave empty to keep the current password" : "Minimum 6 characters" }),
              /* @__PURE__ */ jsx(FormMessage, {}),
              serverErrors?.password && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.password })
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isSubmitting, className: "w-full sm:w-auto", children: /* @__PURE__ */ jsx(
        ButtonLoader,
        {
          isSubmitting,
          btnText: isEditing ? "Update Admin" : "Create Admin",
          loaderText: isEditing ? "Updating..." : "Creating...",
          icon: /* @__PURE__ */ jsx(Save$1, { className: "w-4 h-4" })
        }
      ) }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: () => router.visit("/admin/admin-users"),
          disabled: isSubmitting,
          className: "w-full sm:w-auto",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
            "Cancel"
          ]
        }
      )
    ] })
  ] }) });
}
function Save({ title, admin = null, roles = [] }) {
  const { props } = usePage();
  admin = admin?.data;
  roles = roles?.data || [];
  const isEditing = admin != null;
  return /* @__PURE__ */ jsx(BaseLayout, { children: /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(Main, { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(
        CommonLayoutHeader,
        {
          variant: "inner",
          breadcrumbItems: getAdminSaveBreadcrumbItems(isEditing),
          title: isEditing ? "Edit Admin User" : "Create Admin User",
          description: isEditing ? "Update admin user information and role" : "Create a new administrator account",
          icon: isEditing ? Edit : Plus,
          primaryAction: {
            label: "Back to Admins",
            icon: ArrowLeft,
            onClick: () => router.visit("/admin/admin-users"),
            variant: "outline"
          },
          badges: isEditing ? [
            { label: `ID: ${admin?.id}`, variant: "secondary" },
            { label: "Editing Mode", variant: "outline" }
          ] : []
        }
      ),
      /* @__PURE__ */ jsxs(Alert, { className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
        /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx(AlertDescription, { children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Admin User Configuration" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm", children: isEditing ? "Update admin user details. Leave password empty to keep the current password." : "Create a new admin user account with specific role and permissions." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        AdminUserSaveForm,
        {
          props,
          admin,
          roles,
          isEditing
        }
      ) })
    ] })
  ] }) });
}
export {
  Save as default
};

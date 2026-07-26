import { jsx, jsxs } from "react/jsx-runtime";
import React__default from "react";
import { usePage, router, Head } from "@inertiajs/react";
import { Shield, CheckSquare, Save as Save$1, ArrowLeft, Edit, Plus, Info } from "lucide-react";
import { B as BaseLayout, A as AuthenticatedLayout, M as Main } from "./Main-BjCbeyG1.js";
import { A as Alert, a as AlertDescription } from "./Alert-3s5DZB4H.js";
import { C as CommonLayoutHeader } from "./CommonLayoutHeader-CyKOpByu.js";
import { h as handleSaveRole, i as getRoleSaveBreadcrumbItems } from "./RoleController-Dowu4kpP.js";
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
import { C as Checkbox } from "./Checkbox-CsK9i2JK.js";
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
import "@radix-ui/react-checkbox";
const roleSchema = z.object({
  name: z.string().min(1, "Role name is required").max(255),
  permissions: z.any().refine(
    (data) => {
      if (!data || typeof data !== "object") return false;
      const values = Object.values(data);
      return values.length > 0 && values.some((arr) => Array.isArray(arr) && arr.length > 0);
    },
    { message: "At least one permission must be selected" }
  )
});
function RoleSaveForm({ props, role, isEditing }) {
  const { loading: isSubmitting, errors: serverErrors, submit } = useForm();
  const { permissions: availablePermissions } = usePage().props;
  role = role?.data || role;
  const defaultValues = React__default.useMemo(() => ({
    name: role?.name || "",
    permissions: role?.permissions || {}
  }), [role?.name, role?.permissions]);
  const form = useForm$1({
    resolver: zodResolver(roleSchema),
    defaultValues,
    mode: "onChange"
  });
  const watchPermissions = form.watch("permissions");
  const handleFormSubmit = async (data) => {
    console.log("Form submitting with data:", data);
    console.log("Form errors:", form.formState.errors);
    try {
      await handleSaveRole(data, submit, role, form);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };
  const formatModuleName = (name) => {
    return name.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };
  const formatPermissionName = (permission) => {
    return permission.replace(/_/g, " ").split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };
  const toggleModulePermissions = (module, permissions) => {
    const currentPermissions = watchPermissions?.[module] || [];
    const allSelected = permissions.every((p) => currentPermissions.includes(p));
    const updatedPermissions = { ...watchPermissions };
    if (allSelected) {
      updatedPermissions[module] = [];
    } else {
      updatedPermissions[module] = [...permissions];
    }
    form.setValue("permissions", updatedPermissions, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  };
  const togglePermission = (module, permission) => {
    const currentPermissions = watchPermissions?.[module] || [];
    const updatedPermissions = { ...watchPermissions };
    if (currentPermissions.includes(permission)) {
      updatedPermissions[module] = currentPermissions.filter((p) => p !== permission);
    } else {
      updatedPermissions[module] = [...currentPermissions, permission];
    }
    form.setValue("permissions", updatedPermissions, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  };
  const isModuleFullySelected = (module, permissions) => {
    const currentPermissions = watchPermissions?.[module] || [];
    return permissions.length > 0 && permissions.every((p) => currentPermissions.includes(p));
  };
  const isModulePartiallySelected = (module, permissions) => {
    const currentPermissions = watchPermissions?.[module] || [];
    const isFullySelected = permissions.length > 0 && permissions.every((p) => currentPermissions.includes(p));
    return currentPermissions.length > 0 && !isFullySelected;
  };
  const getTotalSelectedPermissions = () => {
    return Object.values(watchPermissions || {}).reduce((total, perms) => total + (perms?.length || 0), 0);
  };
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(handleFormSubmit, (errors) => {
    console.log("Validation errors:", errors);
  }), className: "space-y-6", children: [
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Shield, { className: "w-5 h-5 text-blue-500" }),
        /* @__PURE__ */ jsx(CardTitle, { children: "Basic Information" })
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "space-y-6", children: /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "name",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxs(FormLabel, { className: "flex items-center gap-2", children: [
              "Role Name",
              /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
            ] }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "e.g., Super Admin, Manager, Editor", ...field }) }),
            /* @__PURE__ */ jsx(FormDescription, { children: "A descriptive name for this role" }),
            /* @__PURE__ */ jsx(FormMessage, {}),
            serverErrors?.name && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.name })
          ] })
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(CheckSquare, { className: "w-5 h-5 text-purple-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Permissions" })
        ] }),
        /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-xs", children: [
          getTotalSelectedPermissions(),
          " selected"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "permissions",
            render: ({ field }) => /* @__PURE__ */ jsx(FormItem, { children: /* @__PURE__ */ jsx(FormMessage, {}) })
          }
        ),
        serverErrors?.permissions && /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: serverErrors.permissions }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: Object.entries(availablePermissions).map(([module, permissions]) => {
          const isFullySelected = isModuleFullySelected(module, permissions);
          const isPartiallySelected = isModulePartiallySelected(module, permissions);
          const currentModulePermissions = watchPermissions?.[module] || [];
          return /* @__PURE__ */ jsx(Card, { className: "border-2", children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pb-3 border-b", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    checked: isFullySelected,
                    onCheckedChange: () => toggleModulePermissions(module, permissions)
                  }
                ),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-gray-900 dark:text-gray-100", children: formatModuleName(module) }),
                  /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
                    currentModulePermissions.length,
                    " of ",
                    permissions.length,
                    " selected"
                  ] })
                ] })
              ] }),
              isFullySelected && /* @__PURE__ */ jsx(Badge, { variant: "default", className: "text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200", children: "All Selected" }),
              isPartiallySelected && /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Partial" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3", children: permissions.map((permission) => {
              const isSelected = currentModulePermissions.includes(permission);
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `flex items-center gap-3 p-3 border rounded-lg transition-colors ${isSelected ? "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-700" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`,
                  children: [
                    /* @__PURE__ */ jsx(
                      Checkbox,
                      {
                        checked: isSelected,
                        onCheckedChange: () => togglePermission(module, permission)
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "label",
                      {
                        className: "flex-1 text-sm font-medium text-gray-700 cursor-pointer dark:text-gray-300",
                        onClick: () => togglePermission(module, permission),
                        children: formatPermissionName(permission)
                      }
                    )
                  ]
                },
                permission
              );
            }) })
          ] }) }) }, module);
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
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
              btnText: isEditing ? "Update Role" : "Create Role",
              loaderText: isEditing ? "Updating..." : "Creating...",
              icon: /* @__PURE__ */ jsx(Save$1, { className: "w-4 h-4" })
            }
          )
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: () => router.visit("/admin/roles"),
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
function Save({ title, role = null }) {
  const { props } = usePage();
  role = role?.data;
  const isEditing = role != null;
  return /* @__PURE__ */ jsx(BaseLayout, { children: /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(Main, { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(
        CommonLayoutHeader,
        {
          variant: "inner",
          breadcrumbItems: getRoleSaveBreadcrumbItems(isEditing),
          title: isEditing ? "Edit Role" : "Create Role",
          description: isEditing ? "Update role name and permissions" : "Create a new role with specific permissions",
          icon: isEditing ? Edit : Plus,
          primaryAction: {
            label: "Back to Roles",
            icon: ArrowLeft,
            onClick: () => router.visit("/admin/roles"),
            variant: "outline"
          },
          badges: isEditing ? [
            { label: `ID: ${role?.id}`, variant: "secondary" },
            { label: "Editing Mode", variant: "outline" }
          ] : []
        }
      ),
      /* @__PURE__ */ jsxs(Alert, { className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
        /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx(AlertDescription, { children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Role & Permissions" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm", children: "Select the permissions that should be granted to this role. Users assigned to this role will have access to the selected features." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        RoleSaveForm,
        {
          props,
          role,
          isEditing
        }
      ) })
    ] })
  ] }) });
}
export {
  Save as default
};

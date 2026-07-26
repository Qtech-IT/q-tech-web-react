import { zodResolver } from "@hookform/resolvers/zod";
import { Head, Link, usePage } from "@inertiajs/react";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dialog";
import "@radix-ui/react-direction";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-icons";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
import "@radix-ui/react-scroll-area";
import "@radix-ui/react-separator";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "cmdk";
import { AnimatePresence } from "framer-motion";
import { AlertTriangle, Calendar, Camera, CheckCircle, Copy, Eye, EyeOff, Globe, Info, Key, Loader2, Lock, LogOut, Mail, MapPin, Monitor, Phone, RefreshCw, Shield, ShieldOff, Smartphone, Tablet, Trash2, Upload, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm as useForm$1 } from "react-hook-form";
import "react-hot-toast";
import { FaChrome, FaFirefox, FaSafari } from "react-icons/fa6";
import "react-icons/tfi";
import "react-responsive";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import "tailwind-merge";
import { z } from "zod";
import { A as Alert, a as AlertDescription } from "./Alert-3s5DZB4H.js";
import "./AppLayout-BOaFJ-XR.js";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-RBWn151p.js";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import { B as Button, a as cn } from "./Button-CFMlPXiE.js";
import { C as Card, a as CardContent, d as CardDescription, b as CardHeader, c as CardTitle } from "./Card-CQ2ij0--.js";
import { F as Form, d as FormControl, a as FormField, b as FormItem, c as FormLabel, f as FormMessage } from "./Form-dg4L2iRR.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import { L as Label } from "./Label-BxDBN09D.js";
import "./Popover-Ckus2dfK.js";
import { m as Dialog, n as DialogContent, q as DialogDescription, r as DialogFooter, o as DialogHeader, p as DialogTitle, N as FancyButton } from "./Sheet-B-_2BaZp.js";
import { S as SlideUp } from "./SlideUp-CpffxXZf.js";
import { f as handleDeleteAccount, a as handleDisableTwoFactor, d as handleEnableTwoFactor, b as handleLogoutSession, h as handleRegenerateRecoveryCodes, e as handleUpdatePassword, c as handleUpdateProfile } from "./UserProfileController-ATO74P5M.js";
const FileUploader = ({
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024,
  acceptedTypes = ["image/*"],
  defaultImages = [],
  onFilesChange,
  className
}) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => {
    if (defaultImages && defaultImages.length > 0) {
      const processedFiles = defaultImages.map((img, index) => ({
        id: `default-${index}`,
        preview: img.url,
        name: img.name || `image-${index}`,
        isDefault: true
      }));
      setFiles(processedFiles);
    }
  }, []);
  const processFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    if (files.length + newFiles.length > maxFiles) {
      return;
    }
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newFile = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview: reader.result,
          name: file.name,
          isDefault: false
        };
        setFiles((prev) => {
          const updatedFiles = [...prev, newFile];
          if (onFilesChange) {
            onFilesChange(updatedFiles.map((f) => f.file).filter(Boolean));
          }
          return updatedFiles;
        });
      };
      reader.readAsDataURL(file);
    });
  };
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };
  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };
  const removeFile = (fileId) => {
    const updatedFiles = files.filter((file) => file.id !== fileId);
    setFiles(updatedFiles);
    if (onFilesChange) {
      onFilesChange(updatedFiles.map((f) => f.file).filter(Boolean));
    }
  };
  const handleClick = () => {
    inputRef.current?.click();
  };
  return /* @__PURE__ */ jsxs("div", {
    className: cn("w-full", className), children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer",
          dragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30",
          files.length >= maxFiles && "opacity-50 cursor-not-allowed"
        ),
        onDragEnter: handleDrag,
        onDragLeave: handleDrag,
        onDragOver: handleDrag,
        onDrop: handleDrop,
        onClick: files.length < maxFiles ? handleClick : void 0,
        children: [
          /* @__PURE__ */ jsx(
          "input",
          {
            ref: inputRef,
            type: "file",
            multiple: maxFiles > 1,
            accept: acceptedTypes.join(","),
            onChange: handleChange,
            className: "hidden",
            disabled: files.length >= maxFiles
          }
        ),
          /* @__PURE__ */ jsxs("div", {
          className: "flex flex-col items-center justify-center gap-3 text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "p-4 rounded-full bg-primary/10", children: /* @__PURE__ */ jsx(Upload, { className: "w-8 h-8 text-primary" }) }),
            /* @__PURE__ */ jsxs("div", {
            children: [
              /* @__PURE__ */ jsxs("p", {
              className: "text-sm font-medium", children: [
                /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Click to upload" }),
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: " or drag and drop" })
              ]
            }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "PNG, JPG, GIF up to 2MB" })
            ]
          })
          ]
        })
        ]
      }
    ),
      files.length > 0 && /* @__PURE__ */ jsx("div", {
        className: "grid grid-cols-2 gap-4 mt-4 sm:grid-cols-3 md:grid-cols-4", children: files.map((file) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "relative overflow-hidden border rounded-xl group aspect-square bg-muted",
            children: [
          /* @__PURE__ */ jsx(
              "img",
              {
                src: file.preview,
                alt: file.name,
                className: "object-cover w-full h-full transition-transform group-hover:scale-110"
              }
            ),
          /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: (e) => {
                  e.stopPropagation();
                  removeFile(file.id);
                },
                className: "absolute p-1.5 transition-all rounded-full top-2 right-2 bg-red-500 hover:bg-red-600 text-white shadow-lg opacity-0 group-hover:opacity-100",
                children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
              }
            ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 p-3 transition-transform translate-y-full bg-gradient-to-t from-black/80 to-transparent group-hover:translate-y-0", children: /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-white truncate", children: file.name }) })
            ]
          },
          file.id
        ))
      })
    ]
  });
};
const ProfileSetting = () => {
  const { props } = usePage();
  let { user } = props;
  user = user?.data || user;
  const { loading, errors, submit } = useForm();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      postal_code: user?.address?.postal_code || "",
      country: user?.address?.country || ""
    }
  });
  const [profileFiles, setProfileFiles] = useState([]);
  const defaultProfileImage = user?.img_url ? [{ url: user.img_url, name: "current-profile.png" }] : [];
  const handleFilesChange = (files) => {
    setProfileFiles(files);
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  const handleAddressChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [id]: value
      }
    }));
  };
  const onSubmit = (e) => {
    const submitData = {
      ...formData,
      image: profileFiles[0] || null
    };
    handleUpdateProfile(e, submitData, submit, user.id);
  };
  return /* @__PURE__ */ jsxs("form", {
    onSubmit, className: "max-w-4xl space-y-6", children: [
    /* @__PURE__ */ jsxs(Card, {
      className: "border-2", children: [
      /* @__PURE__ */ jsxs(CardHeader, {
        children: [
        /* @__PURE__ */ jsxs(CardTitle, {
          className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Camera, { className: "w-5 h-5" }),
            "Profile Picture"
          ]
        }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Upload a professional photo that represents you" })
        ]
      }),
      /* @__PURE__ */ jsxs(CardContent, {
        children: [
        /* @__PURE__ */ jsx(
          FileUploader,
          {
            maxFiles: 1,
            maxSize: 2 * 1024 * 1024,
            acceptedTypes: ["image/*"],
            defaultImages: defaultProfileImage,
            onFilesChange: handleFilesChange
          }
        ),
          errors.image && /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-red-600 dark:text-red-400", children: errors.image })
        ]
      })
      ]
    }),
    /* @__PURE__ */ jsxs(Card, {
      className: "border-2", children: [
      /* @__PURE__ */ jsxs(CardHeader, {
        children: [
        /* @__PURE__ */ jsxs(CardTitle, {
          className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(User, { className: "w-5 h-5" }),
            "Personal Information"
          ]
        }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Update your personal details and contact information" })
        ]
      }),
      /* @__PURE__ */ jsx(CardContent, {
        className: "space-y-6", children: /* @__PURE__ */ jsxs("div", {
          className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", {
            className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Full Name" }),
          /* @__PURE__ */ jsx(
              Input,
              {
                type: "text",
                id: "name",
                placeholder: "John Doe",
                className: "h-12",
                value: formData.name,
                onChange: handleChange,
                disabled: loading
              }
            ),
              errors.name && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors.name })
            ]
          }),
        /* @__PURE__ */ jsxs("div", {
            className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email Address" }),
          /* @__PURE__ */ jsx(
              Input,
              {
                type: "email",
                id: "email",
                placeholder: "john@example.com",
                className: "h-12",
                value: formData.email,
                onChange: handleChange,
                disabled: loading
              }
            ),
              errors.email && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors.email })
            ]
          }),
        /* @__PURE__ */ jsxs("div", {
            className: "space-y-2 md:col-span-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "phone", children: "Phone Number" }),
          /* @__PURE__ */ jsx(
              Input,
              {
                type: "tel",
                id: "phone",
                placeholder: "+1 (555) 000-0000",
                className: "h-12",
                value: formData.phone,
                onChange: handleChange,
                disabled: loading
              }
            ),
              errors.phone && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors.phone })
            ]
          })
          ]
        })
      })
      ]
    }),
    /* @__PURE__ */ jsxs(Card, {
      className: "border-2", children: [
      /* @__PURE__ */ jsxs(CardHeader, {
        children: [
        /* @__PURE__ */ jsxs(CardTitle, {
          className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5" }),
            "Address Information"
          ]
        }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Provide your complete address details" })
        ]
      }),
      /* @__PURE__ */ jsx(CardContent, {
        className: "space-y-6", children: /* @__PURE__ */ jsxs("div", {
          className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", {
            className: "space-y-2 md:col-span-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "street", children: "Street Address" }),
          /* @__PURE__ */ jsx(
              Input,
              {
                type: "text",
                id: "street",
                placeholder: "123 Main Street, Apt 4B",
                className: "h-12",
                value: formData.address.street,
                onChange: handleAddressChange,
                disabled: loading
              }
            ),
              errors["address.street"] && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors["address.street"] })
            ]
          }),
        /* @__PURE__ */ jsxs("div", {
            className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "city", children: "City" }),
          /* @__PURE__ */ jsx(
              Input,
              {
                type: "text",
                id: "city",
                placeholder: "New York",
                className: "h-12",
                value: formData.address.city,
                onChange: handleAddressChange,
                disabled: loading
              }
            ),
              errors["address.city"] && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors["address.city"] })
            ]
          }),
        /* @__PURE__ */ jsxs("div", {
            className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "state", children: "State/Province" }),
          /* @__PURE__ */ jsx(
              Input,
              {
                type: "text",
                id: "state",
                placeholder: "New York",
                className: "h-12",
                value: formData.address.state,
                onChange: handleAddressChange,
                disabled: loading
              }
            ),
              errors["address.state"] && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors["address.state"] })
            ]
          }),
        /* @__PURE__ */ jsxs("div", {
            className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "postal_code", children: "Postal Code" }),
          /* @__PURE__ */ jsx(
              Input,
              {
                type: "text",
                id: "postal_code",
                placeholder: "10001",
                className: "h-12",
                value: formData.address.postal_code,
                onChange: handleAddressChange,
                disabled: loading
              }
            ),
              errors["address.postal_code"] && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors["address.postal_code"] })
            ]
          }),
        /* @__PURE__ */ jsxs("div", {
            className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "country", children: "Country" }),
          /* @__PURE__ */ jsx(
              Input,
              {
                type: "text",
                id: "country",
                placeholder: "United States",
                className: "h-12",
                value: formData.address.country,
                onChange: handleAddressChange,
                disabled: loading
              }
            ),
              errors["address.country"] && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors["address.country"] })
            ]
          })
          ]
        })
      })
      ]
    }),
    /* @__PURE__ */ jsx("div", {
      className: "flex justify-end", children: /* @__PURE__ */ jsx(
        FancyButton,
        {
          label: "Save Changes",
          size: "lg",
          type: "submit",
          disabled: loading,
          isLoading: loading
        }
      )
    })
    ]
  });
};
const twoFaSchema = z.object({
  code: z.string().min(1, "Please enter the verification code").length(6, "Code must be exactly 6 digits").regex(/^\d{6}$/, "Code must contain only numbers")
});
function TwoFaDialog({ open, onOpenChange, qrCodeUrl, secret }) {
  const { loading: isSubmitting, submit } = useForm();
  const form = useForm$1({
    resolver: zodResolver(twoFaSchema),
    defaultValues: {
      code: ""
    }
  });
  const onSubmit = async (data) => {
    const event = {};
    await handleEnableTwoFactor(event, data, submit);
    if (!isSubmitting) {
      form.reset();
      onOpenChange(false);
    }
  };
  return /* @__PURE__ */ jsx(
    Dialog,
    {
      open,
      onOpenChange: (state) => {
        form.reset();
        onOpenChange(state);
      },
      children: /* @__PURE__ */ jsxs(DialogContent, {
        className: "sm:max-w-xl", children: [
        /* @__PURE__ */ jsxs(DialogHeader, {
          className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10", children: /* @__PURE__ */ jsx(Shield, { className: "w-8 h-8 text-primary" }) }),
          /* @__PURE__ */ jsx(DialogTitle, { className: "text-2xl", children: "Enable Two-Factor Authentication" }),
          /* @__PURE__ */ jsx(DialogDescription, { className: "text-base", children: "Scan the QR code with your authenticator app, then enter the 6-digit code to complete setup." })
          ]
        }),
        /* @__PURE__ */ jsxs("div", {
          className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col items-center space-y-4", children: [
            /* @__PURE__ */ jsx("div", {
              className: "p-4 border-2 rounded-xl bg-background", children: !qrCodeUrl ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-48 h-48", children: /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 animate-spin text-muted-foreground" }) }) : /* @__PURE__ */ jsx(
                "img",
                {
                  src: qrCodeUrl,
                  alt: "2FA QR Code",
                  className: "object-contain w-48 h-48"
                }
              )
            }),
            /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-muted/50 text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Smartphone, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: "Scan with Google Authenticator or Authy" })
              ]
            })
            ]
          }),
          /* @__PURE__ */ jsx(Form, {
            ...form, children: /* @__PURE__ */ jsx(
              "form",
              {
                id: "two-fa-form",
                onSubmit: form.handleSubmit(onSubmit),
                className: "space-y-4",
                children: /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "code",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                      children: [
                    /* @__PURE__ */ jsx(FormLabel, { className: "text-sm font-semibold", children: "Verification Code" }),
                    /* @__PURE__ */ jsx(FormControl, {
                        children: /* @__PURE__ */ jsx(
                          Input,
                          {
                            placeholder: "000000",
                            className: "h-14  text-2xl tracking-[0.5em] text-center",
                            maxLength: 6,
                            autoComplete: "off",
                            disabled: isSubmitting,
                            ...field,
                            onChange: (e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              field.onChange(value);
                            }
                          }
                        )
                      }),
                    /* @__PURE__ */ jsx(FormMessage, {})
                      ]
                    })
                  }
                )
              }
            )
          })
          ]
        }),
        /* @__PURE__ */ jsxs(DialogFooter, {
          className: "flex-col-reverse gap-3 sm:flex-row sm:justify-end", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              onClick: () => onOpenChange(false),
              disabled: isSubmitting,
              size: "lg",
              className: "w-full sm:w-auto",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "submit",
              form: "two-fa-form",
              disabled: isSubmitting,
              size: "lg",
              className: "w-full sm:w-auto",
              children: [
                isSubmitting && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }),
                "Verify & Enable"
              ]
            }
          )
          ]
        })
        ]
      })
    }
  );
}
const disableSchema = z.object({
  password: z.string().min(1, "Password is required")
});
function DisableTwoFactorDialog({ open, onOpenChange }) {
  const { loading: isSubmitting, submit } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm$1({
    resolver: zodResolver(disableSchema),
    defaultValues: {
      password: ""
    }
  });
  const onSubmit = async (data) => {
    await handleDisableTwoFactor(data, submit);
    if (!isSubmitting) {
      form.reset();
      onOpenChange(false);
    }
  };
  return /* @__PURE__ */ jsx(
    Dialog,
    {
      open,
      onOpenChange: (state) => {
        form.reset();
        onOpenChange(state);
      },
      children: /* @__PURE__ */ jsxs(DialogContent, {
        className: "sm:max-w-md", children: [
        /* @__PURE__ */ jsxs(DialogHeader, {
          className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full dark:bg-red-900/20", children: /* @__PURE__ */ jsx(ShieldOff, { className: "w-8 h-8 text-red-600 dark:text-red-400" }) }),
          /* @__PURE__ */ jsx(DialogTitle, { className: "text-2xl", children: "Disable Two-Factor Authentication" }),
          /* @__PURE__ */ jsx(DialogDescription, { className: "text-base", children: "This will remove the extra security layer from your account." })
          ]
        }),
        /* @__PURE__ */ jsxs(Alert, {
          className: "border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800", children: [
          /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsxs(AlertDescription, {
            children: [
            /* @__PURE__ */ jsx("strong", { children: "Warning:" }),
              " Disabling 2FA will make your account less secure. Enter your password to confirm."
            ]
          })
          ]
        }),
        /* @__PURE__ */ jsx(Form, {
          ...form, children: /* @__PURE__ */ jsx(
            "form",
            {
              id: "disable-2fa-form",
              onSubmit: form.handleSubmit(onSubmit),
              className: "space-y-4",
              children: /* @__PURE__ */ jsx(
                FormField,
                {
                  control: form.control,
                  name: "password",
                  render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                    children: [
                  /* @__PURE__ */ jsx(FormLabel, { children: "Password" }),
                  /* @__PURE__ */ jsx(FormControl, {
                      children: /* @__PURE__ */ jsxs("div", {
                        className: "relative", children: [
                    /* @__PURE__ */ jsx(
                          Input,
                          {
                            type: showPassword ? "text" : "password",
                            placeholder: "Enter your password",
                            className: "h-12 pr-12",
                            disabled: isSubmitting,
                            ...field
                          }
                        ),
                    /* @__PURE__ */ jsx(
                          Button,
                          {
                            type: "button",
                            variant: "ghost",
                            size: "sm",
                            className: "absolute top-0 right-0 h-full px-3 hover:bg-transparent",
                            onClick: () => setShowPassword(!showPassword),
                            children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
                          }
                        )
                        ]
                      })
                    }),
                  /* @__PURE__ */ jsx(FormMessage, {})
                    ]
                  })
                }
              )
            }
          )
        }),
        /* @__PURE__ */ jsxs(DialogFooter, {
          className: "gap-2 sm:gap-0", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              onClick: () => onOpenChange(false),
              disabled: isSubmitting,
              size: "lg",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "submit",
              form: "disable-2fa-form",
              disabled: isSubmitting,
              variant: "destructive",
              size: "lg",
              children: [
                isSubmitting && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }),
                "Disable 2FA"
              ]
            }
          )
          ]
        })
        ]
      })
    }
  );
}
const TwoFactorAuth = () => {
  const { props } = usePage();
  let { user, qr_code, secret, recovery_codes } = props;
  user = user?.data || user;
  const [openEnable, setOpenEnable] = useState(false);
  const [openDisable, setOpenDisable] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const { loading: regenerateLoading, submit: regenerateSubmit } = useForm();
  const setupData = {
    qr_code,
    secret
  };
  const recoveryCodes = recovery_codes || [];
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2e3);
  };
  const handleCopyAllCodes = () => {
    const allCodes = recoveryCodes.join("\n");
    navigator.clipboard.writeText(allCodes);
    setCopiedCode("all");
    setTimeout(() => setCopiedCode(null), 2e3);
  };
  const handleRegenerate = () => {
    if (confirm("Are you sure you want to regenerate recovery codes? Your old codes will no longer work.")) {
      handleRegenerateRecoveryCodes(regenerateSubmit);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
    /* @__PURE__ */ jsx("div", {
      className: "max-w-4xl space-y-6", children: !user?.two_factor_enabled ? /* @__PURE__ */ jsxs(Fragment, {
        children: [
      /* @__PURE__ */ jsxs(Alert, {
          className: "border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsxs(AlertDescription, {
            children: [
              "Two-factor authentication is currently ",
          /* @__PURE__ */ jsx("strong", { children: "disabled" }),
              ". Enable it to add an extra layer of security to your account."
            ]
          })
          ]
        }),
      /* @__PURE__ */ jsxs(Card, {
          className: "border-2", children: [
        /* @__PURE__ */ jsxs(CardHeader, {
            children: [
          /* @__PURE__ */ jsxs(CardTitle, {
              className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Shield, { className: "w-5 h-5" }),
                "Enable Two-Factor Authentication"
              ]
            }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Protect your account by enabling two-factor authentication. You'll be asked for a secure token in addition to your password when signing in." })
            ]
          }),
        /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", {
                className: "p-4 border rounded-lg bg-muted/30", children: [
            /* @__PURE__ */ jsx("h4", { className: "mb-3 text-sm font-semibold", children: "How it works:" }),
            /* @__PURE__ */ jsxs("ul", {
                  className: "space-y-2 text-sm list-disc list-inside text-muted-foreground", children: [
              /* @__PURE__ */ jsx("li", { children: "Install an authenticator app like Google Authenticator or Authy" }),
              /* @__PURE__ */ jsx("li", { children: "Scan the QR code with your authenticator app" }),
              /* @__PURE__ */ jsx("li", { children: "Enter the 6-digit code to verify and complete setup" }),
              /* @__PURE__ */ jsx("li", { children: "Save your recovery codes in a secure location" })
                  ]
                })
                ]
              }),
          /* @__PURE__ */ jsxs(
                Button,
                {
                  onClick: () => setOpenEnable(true),
                  size: "lg",
                  className: "w-full sm:w-auto",
                  children: [
                /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4 mr-2" }),
                    "Enable Two-Factor Authentication"
                  ]
                }
              )
              ]
            })
          })
          ]
        })
        ]
      }) : /* @__PURE__ */ jsxs(Fragment, {
        children: [
      /* @__PURE__ */ jsxs(Alert, {
          className: "border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800", children: [
        /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsxs(AlertDescription, {
            children: [
              "Two-factor authentication is currently ",
          /* @__PURE__ */ jsx("strong", { children: "enabled" }),
              " on your account."
            ]
          })
          ]
        }),
      /* @__PURE__ */ jsxs(Card, {
          className: "border-2", children: [
        /* @__PURE__ */ jsxs(CardHeader, {
            children: [
          /* @__PURE__ */ jsxs(CardTitle, {
              className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Shield, { className: "w-5 h-5" }),
                "Recovery Codes"
              ]
            }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Store these recovery codes in a secure location. They can be used to access your account if you lose your authenticator device." })
            ]
          }),
        /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", {
                className: "p-4 border rounded-lg bg-muted/30", children: [
            /* @__PURE__ */ jsx("div", {
                  className: "grid grid-cols-1 gap-2 mb-3  text-sm sm:grid-cols-2", children: recoveryCodes?.map((code, index) => /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "flex items-center justify-between p-2 border rounded-lg bg-background",
                      children: [
                  /* @__PURE__ */ jsx("span", { children: code }),
                  /* @__PURE__ */ jsx(
                        Button,
                        {
                          type: "button",
                          variant: "ghost",
                          size: "sm",
                          onClick: () => handleCopyCode(code),
                          className: "w-8 h-8 p-0",
                          children: copiedCode === code ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 text-green-600" }) : /* @__PURE__ */ jsx(Copy, { className: "w-4 h-4" })
                        }
                      )
                      ]
                    },
                    index
                  ))
                }),
            /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    onClick: handleCopyAllCodes,
                    className: "w-full",
                    children: copiedCode === "all" ? /* @__PURE__ */ jsxs(Fragment, {
                      children: [
                  /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 mr-2 text-green-600" }),
                        "Copied!"
                      ]
                    }) : /* @__PURE__ */ jsxs(Fragment, {
                      children: [
                  /* @__PURE__ */ jsx(Copy, { className: "w-4 h-4 mr-2" }),
                        "Copy All Codes"
                      ]
                    })
                  }
                )
                ]
              }),
          /* @__PURE__ */ jsxs("div", {
                className: "flex flex-col gap-3 sm:flex-row", children: [
            /* @__PURE__ */ jsxs(
                  Button,
                  {
                    disabled: regenerateLoading,
                    type: "button",
                    variant: "outline",
                    size: "lg",
                    onClick: handleRegenerate,
                    className: "flex-1",
                    children: [
                      regenerateLoading && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }),
                  /* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4 mr-2" }),
                      "Regenerate Codes"
                    ]
                  }
                ),
            /* @__PURE__ */ jsx(
                  Button,
                  {
                    onClick: () => setOpenDisable(true),
                    type: "button",
                    variant: "destructive",
                    size: "lg",
                    className: "flex-1",
                    children: "Disable 2FA"
                  }
                )
                ]
              })
              ]
            })
          })
          ]
        })
        ]
      })
    }),
    /* @__PURE__ */ jsx(
      TwoFaDialog,
      {
        open: openEnable,
        onOpenChange: setOpenEnable,
        qrCodeUrl: setupData?.qr_code,
        secret: setupData?.secret
      }
    ),
    /* @__PURE__ */ jsx(
      DisableTwoFactorDialog,
      {
        open: openDisable,
        onOpenChange: setOpenDisable
      }
    )
    ]
  });
};
const PasswordForm = () => {
  const { props } = usePage();
  const { loading, errors, submit } = useForm();
  const [formData, setFormData] = useState({
    current_password: "",
    password: "",
    password_confirmation: ""
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  const onSubmit = (e) => {
    handleUpdatePassword(e, formData, submit);
  };
  return /* @__PURE__ */ jsxs("form", {
    onSubmit, className: "max-w-4xl space-y-6", children: [
    /* @__PURE__ */ jsxs(Alert, {
      className: "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800", children: [
      /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
      /* @__PURE__ */ jsxs(AlertDescription, {
        children: [
        /* @__PURE__ */ jsx("p", { className: "mb-2 font-semibold", children: "Password Requirements:" }),
        /* @__PURE__ */ jsxs("ul", {
          className: "space-y-1 text-sm list-disc list-inside", children: [
          /* @__PURE__ */ jsx("li", { children: "At least 8 characters long" }),
          /* @__PURE__ */ jsx("li", { children: "Contains uppercase and lowercase letters" }),
          /* @__PURE__ */ jsx("li", { children: "Contains at least one number" }),
          /* @__PURE__ */ jsx("li", { children: "Contains at least one special character" })
          ]
        })
        ]
      })
      ]
    }),
    /* @__PURE__ */ jsxs(Card, {
      className: "border-2", children: [
      /* @__PURE__ */ jsxs(CardHeader, {
        children: [
        /* @__PURE__ */ jsxs(CardTitle, {
          className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Key, { className: "w-5 h-5" }),
            "Change Password"
          ]
        }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Ensure your account is using a strong password" })
        ]
      }),
      /* @__PURE__ */ jsx(CardContent, {
        className: "space-y-6", children: /* @__PURE__ */ jsxs("div", {
          className: "grid gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", {
            className: "space-y-3", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "New Password" }),
          /* @__PURE__ */ jsxs("div", {
              className: "relative", children: [
            /* @__PURE__ */ jsx(
                Input,
                {
                  type: showPassword ? "text" : "password",
                  id: "password",
                  placeholder: "Enter new password",
                  className: "h-12 pr-12",
                  value: formData.password,
                  onChange: handleChange,
                  disabled: loading
                }
              ),
            /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  className: "absolute top-0 right-0 h-full px-3 hover:bg-transparent",
                  onClick: () => setShowPassword(!showPassword),
                  children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
                }
              )
              ]
            }),
              errors.password && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors.password })
            ]
          }),
        /* @__PURE__ */ jsxs("div", {
            className: "space-y-3", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "password_confirmation", children: "Confirm Password" }),
          /* @__PURE__ */ jsxs("div", {
              className: "relative", children: [
            /* @__PURE__ */ jsx(
                Input,
                {
                  type: showConfirmPassword ? "text" : "password",
                  id: "password_confirmation",
                  placeholder: "Confirm new password",
                  className: "h-12 pr-12",
                  value: formData.password_confirmation,
                  onChange: handleChange,
                  disabled: loading
                }
              ),
            /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  className: "absolute top-0 right-0 h-full px-3 hover:bg-transparent",
                  onClick: () => setShowConfirmPassword(!showConfirmPassword),
                  children: showConfirmPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
                }
              )
              ]
            }),
              errors.password_confirmation && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors.password_confirmation })
            ]
          })
          ]
        })
      })
      ]
    }),
    /* @__PURE__ */ jsx("div", {
      className: "flex justify-end", children: /* @__PURE__ */ jsx(
        FancyButton,
        {
          label: "Update Password",
          size: "lg",
          type: "submit",
          disabled: loading,
          isLoading: loading
        }
      )
    })
    ]
  });
};
const BrowserSessions = () => {
  const { props } = usePage();
  const { sessions } = props;
  const { loading, submit } = useForm();
  const getDeviceIcon = (device) => {
    if (!device || device === "Unknown") return Monitor;
    const deviceLower = device.toLowerCase();
    if (deviceLower.includes("mobile") || deviceLower.includes("phone")) return Smartphone;
    if (deviceLower.includes("tablet")) return Tablet;
    return Monitor;
  };
  const getBrowserIcon = (browser) => {
    if (!browser) return Globe;
    const browserLower = browser.toLowerCase();
    if (browserLower.includes("chrome")) return FaChrome;
    if (browserLower.includes("firefox")) return FaFirefox;
    if (browserLower.includes("safari")) return FaSafari;
    return Globe;
  };
  const onLogoutSession = (sessionId) => {
    if (confirm("Are you sure you want to logout this session?")) {
      handleLogoutSession(sessionId, submit);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "max-w-4xl space-y-6", children: [
    /* @__PURE__ */ jsxs(Alert, {
      className: "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800", children: [
      /* @__PURE__ */ jsx(Monitor, { className: "w-4 h-4" }),
      /* @__PURE__ */ jsx(AlertDescription, { children: "These are the devices that are currently logged into your account. You can logout any session you don't recognize." })
      ]
    }),
    /* @__PURE__ */ jsx("div", {
      className: "space-y-4", children: sessions && sessions.length > 0 ? sessions.map((session) => {
        const DeviceIcon = getDeviceIcon(session.device);
        const BrowserIcon = getBrowserIcon(session.browser);
        return /* @__PURE__ */ jsx(
          Card,
          {
            className: `border-2 ${session.is_current ? "border-primary bg-primary/5" : ""}`,
            children: /* @__PURE__ */ jsx(CardContent, {
              className: "p-6", children: /* @__PURE__ */ jsxs("div", {
                className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", children: [
            /* @__PURE__ */ jsxs("div", {
                  className: "flex gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 p-3 rounded-lg bg-primary/10", children: /* @__PURE__ */ jsx(DeviceIcon, { className: "w-6 h-6 text-primary" }) }),
              /* @__PURE__ */ jsxs("div", {
                    className: "space-y-3", children: [
                /* @__PURE__ */ jsxs("div", {
                      className: "flex flex-wrap items-center gap-2", children: [
                  /* @__PURE__ */ jsxs("h3", {
                        className: "font-semibold", children: [
                          session.platform,
                          " - ",
                          session.device
                        ]
                      }),
                        session.is_current && /* @__PURE__ */ jsx(Badge, { variant: "default", className: "text-xs", children: "Current Session" })
                      ]
                    }),
                /* @__PURE__ */ jsxs("div", {
                      className: "space-y-2 text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ jsxs("div", {
                        className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(BrowserIcon, { className: "w-4 h-4" }),
                    /* @__PURE__ */ jsx("span", { children: session.browser })
                        ]
                      }),
                  /* @__PURE__ */ jsxs("div", {
                        className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4" }),
                    /* @__PURE__ */ jsx("span", { children: session.ip_address })
                        ]
                      }),
                  /* @__PURE__ */ jsxs("div", {
                        className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" }),
                    /* @__PURE__ */ jsxs("span", {
                          children: [
                            "Last active: ",
                            session.last_activity
                          ]
                        })
                        ]
                      })
                      ]
                    })
                    ]
                  })
                  ]
                }),
                  !session.is_current && /* @__PURE__ */ jsxs(
                    Button,
                    {
                      variant: "destructive",
                      size: "sm",
                      onClick: () => onLogoutSession(session.id),
                      disabled: loading,
                      className: "w-full sm:w-auto",
                      children: [
                        loading ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4 mr-2" }),
                        "Logout"
                      ]
                    }
                  )
                ]
              })
            })
          },
          session.id
        );
      }) : /* @__PURE__ */ jsx(Card, {
        className: "border-2", children: /* @__PURE__ */ jsx(CardContent, {
          className: "py-16 text-center", children: /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "p-4 rounded-full bg-muted", children: /* @__PURE__ */ jsx(Monitor, { className: "w-12 h-12 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxs("div", {
              children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-1 font-semibold", children: "No Active Sessions" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "There are no active sessions on your account." })
              ]
            })
            ]
          })
        })
      })
    })
    ]
  });
};
function DeleteAccountDialog({ open, onOpenChange }) {
  const { loading, errors, submit } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: ""
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(value);
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const onSubmit = (e) => {
    e.preventDefault();
    handleDeleteAccount(e, formData, submit);
  };
  const handleClose = (state) => {
    onOpenChange(state);
  };
  return /* @__PURE__ */ jsx(Dialog, {
    open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxs(DialogContent, {
      className: "sm:max-w-2xl", children: [
    /* @__PURE__ */ jsxs(DialogHeader, {
        className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full dark:bg-red-900/20", children: /* @__PURE__ */ jsx(Trash2, { className: "w-8 h-8 text-red-600 dark:text-red-400" }) }),
      /* @__PURE__ */ jsx(DialogTitle, { className: "text-2xl text-red-600 dark:text-red-400", children: "Delete Account Permanently" }),
      /* @__PURE__ */ jsx(DialogDescription, { className: "text-base", children: "This action is irreversible. All your data will be permanently deleted." })
        ]
      }),
    /* @__PURE__ */ jsxs("div", {
        className: "space-y-6", children: [
      /* @__PURE__ */ jsxs(Alert, {
          className: "border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsxs(AlertDescription, {
            children: [
          /* @__PURE__ */ jsx("p", { className: "mb-2 font-semibold", children: "What will be deleted:" }),
          /* @__PURE__ */ jsxs("ul", {
              className: "space-y-1 text-sm list-disc list-inside", children: [
            /* @__PURE__ */ jsx("li", { children: "All your personal information and profile data" }),
            /* @__PURE__ */ jsx("li", { children: "Your uploaded files and documents" }),
            /* @__PURE__ */ jsx("li", { children: "All account settings and preferences" }),
            /* @__PURE__ */ jsx("li", { children: "You will be logged out from all devices" })
              ]
            })
            ]
          })
          ]
        }),
      /* @__PURE__ */ jsx(Card, {
          className: "border-2 border-red-200 dark:border-red-800", children: /* @__PURE__ */ jsx(CardContent, {
            className: "pt-2", children: /* @__PURE__ */ jsx("form", {
              onSubmit, className: "space-y-6", children: /* @__PURE__ */ jsxs("div", {
                className: "space-y-3", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
        /* @__PURE__ */ jsxs("div", {
                  className: "relative", children: [
          /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: showPassword ? "text" : "password",
                      id: "password",
                      name: "password",
                      placeholder: "Enter your password",
                      className: "h-12 pr-12",
                      value: formData.password,
                      onChange: handleInputChange,
                      disabled: loading
                    }
                  ),
          /* @__PURE__ */ jsx(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "sm",
                      className: "absolute top-0 right-0 h-full px-3 hover:bg-transparent",
                      onClick: () => setShowPassword(!showPassword),
                      disabled: loading,
                      children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
                    }
                  )
                  ]
                }),
                  errors.password && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors.password })
                ]
              })
            })
          })
        })
        ]
      }),
    /* @__PURE__ */ jsxs(DialogFooter, {
        className: "flex-col-reverse gap-3 sm:flex-row sm:justify-end", children: [
      /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            onClick: () => handleClose(false),
            disabled: loading,
            size: "lg",
            className: "w-full sm:w-auto",
            children: "Cancel"
          }
        ),
      /* @__PURE__ */ jsx(
          FancyButton,
          {
            label: "Delete My Account",
            size: "lg",
            onClick: onSubmit,
            disabled: loading || !formData.password,
            isLoading: loading,
            className: "w-full text-white bg-red-600 sm:w-auto hover:bg-red-700"
          }
        )
        ]
      })
      ]
    })
  });
}
const DangerZone = () => {
  const [openDelete, setOpenDelete] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
    /* @__PURE__ */ jsxs("div", {
      className: "max-w-4xl space-y-6", children: [
      /* @__PURE__ */ jsxs(Alert, {
        className: "border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsxs(AlertDescription, {
          children: [
          /* @__PURE__ */ jsx("strong", { children: "Warning:" }),
            " Actions in this section are irreversible. Please proceed with caution."
          ]
        })
        ]
      }),
      /* @__PURE__ */ jsxs(Card, {
        className: "border-2 border-red-200 dark:border-red-800", children: [
        /* @__PURE__ */ jsxs(CardHeader, {
          children: [
          /* @__PURE__ */ jsxs(CardTitle, {
            className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Trash2, { className: "w-5 h-5" }),
              "Delete Account"
            ]
          }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Permanently delete your account and all associated data" })
          ]
        }),
        /* @__PURE__ */ jsx(CardContent, {
          className: "pt-6", children: /* @__PURE__ */ jsxs("div", {
            className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", {
              className: "p-4 border border-red-200 rounded-lg bg-red-50/50 dark:bg-red-950/20 dark:border-red-800", children: [
            /* @__PURE__ */ jsx("h4", { className: "mb-2 text-sm font-semibold text-red-900 dark:text-red-100", children: "What happens when you delete your account:" }),
            /* @__PURE__ */ jsxs("ul", {
                className: "space-y-2 text-sm text-red-800 list-disc list-inside dark:text-red-200", children: [
              /* @__PURE__ */ jsx("li", { children: "All your personal information will be permanently deleted" }),
              /* @__PURE__ */ jsx("li", { children: "Your profile and uploaded files will be removed" }),
              /* @__PURE__ */ jsx("li", { children: "You will be logged out from all devices" }),
              /* @__PURE__ */ jsx("li", { children: "This action cannot be undone" })
                ]
              })
              ]
            }),
          /* @__PURE__ */ jsx(
              FancyButton,
              {
                label: "Delete My Account",
                size: "lg",
                onClick: () => setOpenDelete(true),
                className: "w-full text-white bg-red-600 sm:w-auto hover:bg-red-700"
              }
            )
            ]
          })
        })
        ]
      })
      ]
    }),
    /* @__PURE__ */ jsx(
      DeleteAccountDialog,
      {
        open: openDelete,
        onOpenChange: setOpenDelete
      }
    )
    ]
  });
};
const Profile = () => {
  const { props } = usePage();
  const { title, component: activeComponent, user } = props;
  const userData = user?.data || user;
  const tabMenus = [
    {
      icon: User,
      label: "Profile",
      value: "ProfileSetting",
      component: /* @__PURE__ */ jsx(ProfileSetting, {}),
      route: "user.profile.index"
    },
    {
      icon: Lock,
      label: "Password",
      value: "PasswordForm",
      component: /* @__PURE__ */ jsx(PasswordForm, {}),
      route: "user.profile.password"
    },
    {
      icon: Shield,
      label: "2FA",
      value: "TwoFactorAuth",
      component: /* @__PURE__ */ jsx(TwoFactorAuth, {}),
      route: "user.profile.two.factor"
    },
    {
      icon: Monitor,
      label: "Sessions",
      value: "BrowserSessions",
      component: /* @__PURE__ */ jsx(BrowserSessions, {}),
      route: "user.profile.sessions"
    },
    {
      icon: AlertTriangle,
      label: "Danger Zone",
      value: "DangerZone",
      component: /* @__PURE__ */ jsx(DangerZone, {}),
      route: "user.profile.danger.zone"
    }
  ];
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsx(AuthenticatedLayout, {
      children: /* @__PURE__ */ jsxs("div", {
        className: "container max-w-6xl px-4 py-8 mx-auto", children: [
      /* @__PURE__ */ jsxs("div", {
          className: "relative mb-8 overflow-hidden border rounded-3xl bg-gradient-to-br from-primary/5 via-background to-background", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 -mt-32 -mr-32 rounded-full bg-primary/5 blur-3xl" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-48 h-48 -mb-24 -ml-24 rounded-full bg-primary/5 blur-3xl" }),
        /* @__PURE__ */ jsx("div", {
            className: "relative p-8", children: /* @__PURE__ */ jsxs("div", {
              className: "flex flex-col gap-6 md:flex-row md:items-center", children: [
          /* @__PURE__ */ jsxs("div", {
                className: "relative group", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 transition-opacity rounded-full opacity-75 bg-gradient-to-br from-primary/30 to-primary/10 blur-xl group-hover:opacity-100 animate-pulse" }),
            /* @__PURE__ */ jsx("div", {
                  className: "relative overflow-hidden border-4 rounded-full shadow-xl size-28 md:size-32 bg-background border-background", children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: userData?.img_url || "/default-avatar.png",
                      alt: userData?.name,
                      className: "object-cover w-full h-full"
                    }
                  )
                }),
                  userData?.two_factor_enabled && /* @__PURE__ */ jsx("div", { className: "absolute flex items-center justify-center p-1.5 rounded-full -bottom-1 -right-1 bg-green-500 shadow-lg", children: /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4 text-white" }) })
                ]
              }),
          /* @__PURE__ */ jsxs("div", {
                className: "flex-1 space-y-3", children: [
            /* @__PURE__ */ jsxs("div", {
                  children: [
              /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-3 mb-2", children: [
                /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold tracking-tight", children: userData?.name }),
                      userData?.is_email_verified && /* @__PURE__ */ jsxs(Badge, {
                        variant: "default", className: "gap-1.5 shadow-sm", children: [
                  /* @__PURE__ */ jsx(CheckCircle, { className: "w-3.5 h-3.5" }),
                          "Verified"
                        ]
                      })
                    ]
                  }),
              /* @__PURE__ */ jsxs("div", {
                    className: "flex flex-wrap items-center gap-4 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "p-1 rounded-md bg-primary/10", children: /* @__PURE__ */ jsx(Mail, { className: "w-3.5 h-3.5 text-primary" }) }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: userData?.email })
                      ]
                    }),
                      userData?.phone && /* @__PURE__ */ jsxs("div", {
                        className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "p-1 rounded-md bg-primary/10", children: /* @__PURE__ */ jsx(Phone, { className: "w-3.5 h-3.5 text-primary" }) }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: userData?.phone })
                        ]
                      })
                    ]
                  })
                  ]
                }),
            /* @__PURE__ */ jsx("div", {
                  className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: /* @__PURE__ */ jsx("div", {
                    className: `relative overflow-hidden border rounded-xl shadow-sm hover:shadow-md transition-shadow ${userData?.two_factor_enabled ? "bg-gradient-to-br from-background to-green-500/5" : "bg-gradient-to-br from-background to-orange-500/5"}`, children: /* @__PURE__ */ jsx("div", {
                      className: "p-4", children: /* @__PURE__ */ jsxs("div", {
                        className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: `p-2.5 rounded-xl shadow-inner ${userData?.two_factor_enabled ? "bg-green-500/10" : "bg-orange-500/10"}`, children: /* @__PURE__ */ jsx(Shield, { className: `w-5 h-5 ${userData?.two_factor_enabled ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"}` }) }),
              /* @__PURE__ */ jsxs("div", {
                          className: "flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold tracking-wider uppercase text-muted-foreground", children: "Security" }),
                /* @__PURE__ */ jsx("p", { className: "text-base font-bold mt-0.5", children: userData?.two_factor_enabled ? "2FA Enabled" : "Basic Level" })
                          ]
                        })
                        ]
                      })
                    })
                  })
                })
                ]
              })
              ]
            })
          })
          ]
        }),
      /* @__PURE__ */ jsx("div", {
          className: "mb-6", children: /* @__PURE__ */ jsx("div", {
            className: "flex gap-2 p-1.5 overflow-x-auto border rounded-2xl bg-muted/30 backdrop-blur-sm", children: tabMenus.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeComponent === tab.value;
              return /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route(tab.route),
                  className: `
                                            flex items-center gap-2.5 px-5 py-3 font-semibold text-sm rounded-xl
                                            transition-all duration-200 whitespace-nowrap min-w-fit
                                            ${isActive ? "bg-background text-primary shadow-md scale-105" : "text-muted-foreground hover:text-foreground hover:bg-background/60"}
                                        `,
                  children: [
              /* @__PURE__ */ jsx(Icon, { className: `w-4.5 h-4.5 ${isActive ? "animate-pulse" : ""}` }),
              /* @__PURE__ */ jsx("span", { children: tab.label })
                  ]
                },
                tab.value
              );
            })
          })
        }),
      /* @__PURE__ */ jsx("div", {
          className: "border shadow-sm rounded-2xl bg-background", children: /* @__PURE__ */ jsx("div", {
            className: "p-6 md:p-8", children: /* @__PURE__ */ jsx(AnimatePresence, {
              mode: "wait", children: tabMenus.map(
                (tab) => activeComponent === tab.value && /* @__PURE__ */ jsx(SlideUp, { children: tab.component }, tab.value)
              )
            })
          })
        })
        ]
      })
    })
    ]
  });
};
export {
  Profile as default
};


import { zodResolver } from "@hookform/resolvers/zod";
import { Head, usePage } from "@inertiajs/react";
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
import { AlertTriangle, Calendar, Camera, CheckCircle, Copy, Globe2, Info, Key, Loader2, Lock, LogOut, Mail, MapPin, Monitor, Phone, Shield, Smartphone, Tablet, User } from "lucide-react";
import "motion/react";
import { useState } from "react";
import { useForm as useForm$1 } from "react-hook-form";
import "react-hot-toast";
import "react-icons/bs";
import "react-icons/fa";
import { FaChrome, FaFirefox, FaSafari } from "react-icons/fa6";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import "tailwind-merge";
import { z } from "zod";
import { A as Alert, a as AlertDescription } from "./Alert-3s5DZB4H.js";
import "./AuthController-DaCguZ7K.js";
import { B as Badge } from "./Badge-B6jlhcU-.js";
import "./BlogCard-Jrl9AHYg.js";
import "./BlogSection-DiGfvTON.js";
import { B as Button, o as handleImageChange } from "./Button-CFMlPXiE.js";
import { B as ButtonLoader } from "./ButtonLoader-BVWhRiGk.js";
import { C as Card, a as CardContent, d as CardDescription, b as CardHeader, c as CardTitle } from "./Card-CQ2ij0--.js";
import { p as profileNavItems } from "./constants-4k_q_jeE.js";
import { C as ContentSection, S as SidebarNav } from "./ContentSection-DFKIhAed.js";
import "./demo-data-C5EGh9Nk.js";
import "./EmptyData-DjqqIMwS.js";
import { F as Form, d as FormControl, e as FormDescription, a as FormField, b as FormItem, c as FormLabel, f as FormMessage } from "./Form-dg4L2iRR.js";
import { u as useForm } from "./HotToast-DfpkTxSC.js";
import { I as Input } from "./Input-ikOfQO4K.js";
import "./Label-BxDBN09D.js";
import { A as AuthenticatedLayout, B as BaseLayout, M as Main } from "./Main-BjCbeyG1.js";
import "./MarketGrid-DlkazA02.js";
import "./MarketSectionTwo-RD2Nw8tb.js";
import "./PaginationWrapper-B-KWAp7V.js";
import "./Progress-DT6CA82_.js";
import { m as Dialog, n as DialogContent, q as DialogDescription, r as DialogFooter, o as DialogHeader, p as DialogTitle, G as Separator } from "./Sheet-B-_2BaZp.js";
import "./SlideUp-CpffxXZf.js";
import "./Table-Dz-EvWd_.js";
import "./TradeDialog-Dt4WEyMP.js";
import { a as handleDisableTwoFactor, b as handleLogoutSession, h as handleRegenerateRecoveryCodes } from "./UserProfileController-ATO74P5M.js";
const onAccountUpdate = async (data, user, submit) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.profile.update", user?.id) + "?_method=PATCH",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      data
    });
  } catch (error) {
  }
};
const onPasswordUpdate = async (data, submit, form) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.password.update"),
      data
    });
    form.reset({
      password: "",
      password_confirmation: ""
    });
  } catch (error) {
  }
};
const handle2faVerifyRequest = async (data, submitFn, onOpenChange) => {
  try {
    await submitFn({
      method: "POST",
      url: route("admin.2fa.verify"),
      data,
      onSuccess: (response) => {
        if (response?.props?.flash?.success) {
          onOpenChange(false);
        }
      }
    });
  } catch (error) {
  }
};
const accountFormSchema = z.object({
  name: z.string().optional(),
  email: z.string().min(1, "Email is required").email("Enter valid email"),
  phone: z.string().optional(),
  image: z.any().refine((file) => !file || file instanceof File, "Must be a file").optional()
});
function ProfileForm({ user }) {
  const [imagePreview, setImagePreview] = useState(user?.img_url || null);
  const { loading: isSubmitting, submit } = useForm();
  const form = useForm$1({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      email: user?.email || "",
      name: user?.name || "",
      phone: user?.phone || "",
      image: null
    }
  });
  const watchName = form.watch("name");
  const watchEmail = form.watch("email");
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", {
      className: "flex items-center gap-2 mb-6", children: [
      /* @__PURE__ */ jsx(User, { className: "w-6 h-6 text-primary" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Profile Settings" }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 ml-auto", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Account Management" }) })
      ]
    }),
    /* @__PURE__ */ jsx(Form, {
      ...form, children: /* @__PURE__ */ jsxs("form", {
        onSubmit: form.handleSubmit((e) => onAccountUpdate(e, user, submit)), className: "space-y-6", children: [
      /* @__PURE__ */ jsxs(Alert, {
          className: "border-blue-200 bg-blue-50 dark:bg-blue-950", children: [
        /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx(AlertDescription, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "space-y-2", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Account Information" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Update your personal information and profile settings. Changes will be reflected across your account." })
              ]
            })
          })
          ]
        }),
      /* @__PURE__ */ jsxs(Card, {
          children: [
        /* @__PURE__ */ jsx(CardHeader, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Camera, { className: "w-5 h-5 text-purple-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Profile Picture" })
              ]
            })
          }),
        /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "image",
                render: ({ field: { onChange, ...rest } }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
              /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Camera, { className: "w-4 h-4" }),
                      "Profile Image"
                    ]
                  }),
              /* @__PURE__ */ jsx(FormControl, {
                    children: /* @__PURE__ */ jsxs("div", {
                      className: "space-y-4", children: [
                /* @__PURE__ */ jsx(
                        Input,
                        {
                          type: "file",
                          accept: "image/*",
                          onChange: (e) => handleImageChange(e, onChange, setImagePreview),
                          className: "max-w-md"
                        }
                      ),
                        imagePreview && /* @__PURE__ */ jsx("div", {
                          className: "relative inline-block", children: /* @__PURE__ */ jsx(
                            "img",
                            {
                              src: imagePreview,
                              alt: "Profile Preview",
                              className: "object-cover w-32 h-32 border rounded-lg shadow-md"
                            }
                          )
                        })
                      ]
                    })
                  }),
              /* @__PURE__ */ jsx(FormDescription, { children: "Upload a profile picture. Recommended size: 400x400px. Supports JPG, PNG, and GIF formats." }),
              /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            )
          })
          ]
        }),
      /* @__PURE__ */ jsxs(Card, {
          children: [
        /* @__PURE__ */ jsx(CardHeader, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(User, { className: "w-5 h-5 text-blue-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Personal Information" })
              ]
            })
          }),
        /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-4", children: [
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "name",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(User, { className: "w-4 h-4" }),
                      "Full Name"
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "Enter your full name", ...field, className: "font-medium" }) }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Your display name that will appear throughout the application" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "email",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4" }),
                      "Email Address",
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "email", placeholder: "name@example.com", ...field, className: "" }) }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Primary email address for account notifications and login" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "phone",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4" }),
                      "Phone Number"
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "tel", placeholder: "Enter phone number", ...field, className: "" }) }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Optional phone number for account security and contact purposes" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            )
            ]
          })
          ]
        }),
      /* @__PURE__ */ jsx(Card, {
          className: "border-green-200 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950", children: /* @__PURE__ */ jsx(CardContent, {
            className: "p-6", children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", {
                children: [
          /* @__PURE__ */ jsxs("h3", {
                  className: "flex items-center gap-2 text-lg font-semibold", children: [
                    "Profile Summary",
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Ready to Update" })
                  ]
                }),
          /* @__PURE__ */ jsxs("p", {
                  className: "mt-1 text-sm text-muted-foreground", children: [
                    watchName && `Name: ${watchName}`,
                    watchEmail && ` • Email: ${watchEmail}`,
                    imagePreview && " • Profile picture updated"
                  ]
                })
                ]
              }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-10 h-10 text-green-600 bg-green-100 rounded-full dark:bg-green-900", children: /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5" }) }) })
              ]
            })
          })
        }),
      /* @__PURE__ */ jsx(Button, { disabled: isSubmitting, type: "submit", children: /* @__PURE__ */ jsx(ButtonLoader, { isSubmitting }) })
        ]
      })
    })
    ]
  });
}
function PasswordForm({ passwordLength = 6 }) {
  const passwordFormSchema = z.object({
    password: z.string().min(1, "Please enter your password").min(passwordLength, `Password must be at least ${passwordLength} characters long`),
    password_confirmation: z.string().min(1, "Please confirm your password")
  }).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"]
  });
  const { loading: isSubmitting, submit } = useForm();
  const form = useForm$1({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: "",
      password_confirmation: ""
    }
  });
  const watchPassword = form.watch("password");
  const watchConfirmPassword = form.watch("password_confirmation");
  const passwordsMatch = watchPassword && watchConfirmPassword && watchPassword === watchConfirmPassword;
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", {
      className: "flex items-center gap-2 mb-6", children: [
      /* @__PURE__ */ jsx(Lock, { className: "w-6 h-6 text-primary" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Security Settings" }),
      /* @__PURE__ */ jsx("div", { className: "ml-auto flex gap-2", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "Password Management" }) })
      ]
    }),
    /* @__PURE__ */ jsx(Form, {
      ...form, children: /* @__PURE__ */ jsxs("form", {
        onSubmit: form.handleSubmit((e) => onPasswordUpdate(e, submit, form)), className: "space-y-6", children: [
      /* @__PURE__ */ jsxs(Alert, {
          className: "border-amber-200 bg-amber-50 dark:bg-amber-950", children: [
        /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx(AlertDescription, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "space-y-2", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Password Security" }),
          /* @__PURE__ */ jsxs("p", {
                className: "text-sm", children: [
                  "Choose a strong password to protect your account. Make sure it's at least ",
                  passwordLength,
                  " characters long and unique to this account."
                ]
              })
              ]
            })
          })
          ]
        }),
      /* @__PURE__ */ jsxs(Card, {
          children: [
        /* @__PURE__ */ jsx(CardHeader, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Key, { className: "w-5 h-5 text-red-500" }),
          /* @__PURE__ */ jsx(CardTitle, { children: "Change Password" })
              ]
            })
          }),
        /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-4", children: [
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "password",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4" }),
                      "New Password",
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "password", placeholder: "Enter new password", ...field, className: "" }) }),
                /* @__PURE__ */ jsxs(FormDescription, {
                    children: [
                      "Password must be at least ",
                      passwordLength,
                      " characters long. Use a combination of letters, numbers, and special characters for better security."
                    ]
                  }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            ),
          /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "password_confirmation",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                  children: [
                /* @__PURE__ */ jsxs(FormLabel, {
                    className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4" }),
                      "Confirm Password",
                  /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: "Required" })
                    ]
                  }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { type: "password", placeholder: "Re-enter your new password", ...field, className: "" }) }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Re-type your new password to confirm it matches exactly" }),
                /* @__PURE__ */ jsx(FormMessage, {})
                  ]
                })
              }
            )
            ]
          })
          ]
        }),
      /* @__PURE__ */ jsx(Card, {
          className: "bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-green-200", children: /* @__PURE__ */ jsx(CardContent, {
            className: "p-6", children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", {
                children: [
          /* @__PURE__ */ jsxs("h3", {
                  className: "font-semibold text-lg flex items-center gap-2", children: [
                    "Password Status",
            /* @__PURE__ */ jsx(Badge, { variant: passwordsMatch ? "default" : "outline", className: "text-xs", children: passwordsMatch ? "Passwords Match" : "Ready to Update" })
                  ]
                }),
          /* @__PURE__ */ jsxs("p", {
                  className: "text-sm text-muted-foreground mt-1", children: [
                    watchPassword && `Password length: ${watchPassword.length} characters`,
                    passwordsMatch && " • Passwords match",
                    watchPassword && watchPassword.length >= passwordLength && " • Meets minimum requirements"
                  ]
                })
                ]
              }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center ${passwordsMatch ? "bg-green-100 text-green-600 dark:bg-green-900" : "bg-gray-100 text-gray-600 dark:bg-gray-900"}`, children: /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5" }) }) })
              ]
            })
          })
        }),
      /* @__PURE__ */ jsx(Button, { disabled: isSubmitting, type: "submit", children: /* @__PURE__ */ jsx(ButtonLoader, { isSubmitting }) })
        ]
      })
    })
    ]
  });
}
const twoFaSchema = z.object({
  code: z.string().min(1, "Please enter the verification code").length(6, "Code must be exactly 6 digits").regex(/^\d{6}$/, "Code must contain only numbers")
});
function TwoFaDialog({ open, onOpenChange, qrCodeUrl, isLoading = false }) {
  const { loading: isSubmitting, submit } = useForm();
  const form = useForm$1({
    resolver: zodResolver(twoFaSchema),
    defaultValues: {
      code: ""
    }
  });
  return /* @__PURE__ */ jsx(
    Dialog,
    {
      open,
      onOpenChange: (state) => {
        form.reset();
        onOpenChange(state);
      },
      children: /* @__PURE__ */ jsxs(DialogContent, {
        className: "sm:max-w-lg", children: [
        /* @__PURE__ */ jsxs(DialogHeader, {
          className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10", children: /* @__PURE__ */ jsx(Shield, { className: "w-6 h-6 text-primary" }) }),
          /* @__PURE__ */ jsx(DialogTitle, { children: "Enable Two-Factor Authentication" }),
          /* @__PURE__ */ jsx(DialogDescription, { children: "Scan the QR code with your authenticator app, then enter the 6-digit code to complete setup." })
          ]
        }),
        /* @__PURE__ */ jsxs("div", {
          className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col items-center space-y-4", children: [
            /* @__PURE__ */ jsx("div", {
              className: "p-4 bg-white border-2 border-gray-200 rounded-lg", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-48 h-48", children: /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 animate-spin text-muted-foreground" }) }) : /* @__PURE__ */ jsx(
                "img",
                {
                  src: qrCodeUrl || "/placeholder-qr.png",
                  alt: "2FA QR Code",
                  className: "object-contain w-48 h-48"
                }
              )
            }),
            /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Smartphone, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: "Scan with Google Authenticator or similar app" })
              ]
            })
            ]
          }),
          /* @__PURE__ */ jsx(Form, {
            ...form, children: /* @__PURE__ */ jsx(
              "form",
              {
                id: "two-fa-form",
                onSubmit: form.handleSubmit((e) => handle2faVerifyRequest(e, submit, onOpenChange)),
                className: "space-y-4",
                children: /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "code",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, {
                      className: "grid items-center grid-cols-6 space-y-0 gap-x-4 gap-y-1", children: [
                    /* @__PURE__ */ jsx(FormLabel, { className: "col-span-2 text-end", children: "Verification Code" }),
                    /* @__PURE__ */ jsx(FormControl, {
                        children: /* @__PURE__ */ jsx(
                          Input,
                          {
                            placeholder: "123456",
                            className: "col-span-4  text-lg tracking-widest text-center",
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
                    /* @__PURE__ */ jsx(FormMessage, { className: "col-span-4 col-start-3" })
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
          className: "flex justify-between", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              onClick: () => onOpenChange(false),
              disabled: isSubmitting,
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "submit",
              form: "two-fa-form",
              disabled: isSubmitting,
              children: [
                isSubmitting && /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }),
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
const TwoFactorAuth = () => {
  const { props } = usePage();
  const { user, qr_code, secret, recovery_codes } = props;
  const userData = user?.data || user;
  const [open, setOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const { loading: regenerateLoading, submit: regenerateSubmit } = useForm();
  const { loading: disableLoading, submit: disableSubmit } = useForm();
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
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
    /* @__PURE__ */ jsx("div", {
      className: "max-w-3xl space-y-6", children: !userData?.two_factor_enabled ? /* @__PURE__ */ jsxs(Fragment, {
        children: [
      /* @__PURE__ */ jsxs(Alert, {
          className: "border-yellow-200 bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-950", children: [
        /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-yellow-500/10", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 text-yellow-600" }) }),
        /* @__PURE__ */ jsxs(AlertDescription, {
            className: "text-yellow-800 dark:text-yellow-200", children: [
              "Two-factor authentication is currently ",
          /* @__PURE__ */ jsx("strong", { children: "disabled" }),
              ". Enable it to add an extra layer of security to your account."
            ]
          })
          ]
        }),
      /* @__PURE__ */ jsxs(Card, {
          className: "overflow-hidden border-2", children: [
        /* @__PURE__ */ jsxs(CardHeader, {
            className: "bg-gradient-to-r from-primary/5 to-transparent", children: [
          /* @__PURE__ */ jsxs(CardTitle, {
              className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 rounded-lg bg-primary/10", children: /* @__PURE__ */ jsx(Shield, { className: "w-5 h-5 text-primary" }) }),
                "Enable Two-Factor Authentication"
              ]
            }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Protect your account by enabling two-factor authentication. You'll be asked for a secure token in addition to your password when signing in." })
            ]
          }),
        /* @__PURE__ */ jsx(CardContent, {
            className: "pt-6", children: /* @__PURE__ */ jsxs("div", {
              className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", {
                className: "p-4 border rounded-xl bg-muted/30", children: [
            /* @__PURE__ */ jsx("h4", { className: "mb-3 text-sm font-semibold", children: "How it works:" }),
            /* @__PURE__ */ jsxs("ul", {
                  className: "space-y-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxs("li", {
                    className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 mt-2 rounded-full bg-primary" }),
                /* @__PURE__ */ jsx("span", { children: "Install an authenticator app like Google Authenticator or Authy on your phone" })
                    ]
                  }),
              /* @__PURE__ */ jsxs("li", {
                    className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 mt-2 rounded-full bg-primary" }),
                /* @__PURE__ */ jsx("span", { children: "Scan the QR code we provide with your authenticator app" })
                    ]
                  }),
              /* @__PURE__ */ jsxs("li", {
                    className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 mt-2 rounded-full bg-primary" }),
                /* @__PURE__ */ jsx("span", { children: "Enter the 6-digit code from your app to verify and complete setup" })
                    ]
                  }),
              /* @__PURE__ */ jsxs("li", {
                    className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 mt-2 rounded-full bg-primary" }),
                /* @__PURE__ */ jsx("span", { children: "Save your recovery codes in a secure location" })
                    ]
                  })
                  ]
                })
                ]
              }),
          /* @__PURE__ */ jsxs(
                Button,
                {
                  onClick: () => setOpen(true),
                  size: "lg",
                  className: "w-full shadow-lg sm:w-auto shadow-primary/20",
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
          className: "border-green-200 bg-gradient-to-r from-green-50 to-transparent dark:from-green-950", children: [
        /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-green-500/10", children: /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4 text-green-600" }) }),
        /* @__PURE__ */ jsxs(AlertDescription, {
            className: "text-green-800 dark:text-green-200", children: [
              "Two-factor authentication is currently ",
          /* @__PURE__ */ jsx("strong", { children: "enabled" }),
              " on your account. Your account is protected with an extra layer of security."
            ]
          })
          ]
        }),
      /* @__PURE__ */ jsxs(Card, {
          className: "overflow-hidden border-2", children: [
        /* @__PURE__ */ jsxs(CardHeader, {
            className: "bg-gradient-to-r from-green-500/5 to-transparent", children: [
          /* @__PURE__ */ jsxs(CardTitle, {
              className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 rounded-lg bg-green-500/10", children: /* @__PURE__ */ jsx(Shield, { className: "w-5 h-5 text-green-600 dark:text-green-400" }) }),
                "Recovery Codes"
              ]
            }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Store these recovery codes in a secure location. They can be used to access your account if you lose your authenticator device." })
            ]
          }),
        /* @__PURE__ */ jsx(CardContent, {
            className: "pt-6", children: /* @__PURE__ */ jsxs("div", {
              className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", {
                className: "relative p-4 border-2 rounded-xl bg-muted/30", children: [
            /* @__PURE__ */ jsx("div", {
                  className: "grid grid-cols-1 gap-2 mb-3  text-sm sm:grid-cols-2", children: recoveryCodes?.map((code, index) => /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "flex items-center justify-between p-2.5 rounded-lg bg-background border",
                      children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: code }),
                  /* @__PURE__ */ jsx(
                        Button,
                        {
                          type: "button",
                          variant: "ghost",
                          size: "sm",
                          onClick: () => handleCopyCode(code),
                          className: "p-0 h-7 w-7",
                          children: copiedCode === code ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-3.5 h-3.5 text-green-600" }) : /* @__PURE__ */ jsx(Copy, { className: "w-3.5 h-3.5" })
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
                    onClick: () => {
                      if (confirm("Are you sure you want to regenerate recovery codes? Your old codes will no longer work.")) {
                        handleRegenerateRecoveryCodes(regenerateSubmit);
                      }
                    },
                    className: "flex-1",
                    children: [
                      regenerateLoading && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }),
                      "Regenerate Recovery Codes"
                    ]
                  }
                ),
            /* @__PURE__ */ jsxs(
                  Button,
                  {
                    onClick: () => {
                      if (confirm("Are you sure you want to disable two-factor authentication? This will make your account less secure.")) {
                        handleDisableTwoFactor({ password: prompt("Enter your password to confirm:") }, disableSubmit);
                      }
                    },
                    disabled: disableLoading,
                    type: "button",
                    variant: "destructive",
                    size: "lg",
                    className: "flex-1",
                    children: [
                      disableLoading && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }),
                      "Disable 2FA"
                    ]
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
        open,
        onOpenChange: setOpen,
        qrCodeUrl: setupData?.qr_code,
        secret: setupData?.secret
      }
    )
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
    if (!browser) return Globe2;
    const browserLower = browser.toLowerCase();
    if (browserLower.includes("chrome")) return FaChrome;
    if (browserLower.includes("firefox")) return FaFirefox;
    if (browserLower.includes("safari")) return FaSafari;
    return Globe2;
  };
  const onLogoutSession = (sessionId) => {
    if (confirm("Are you sure you want to logout this session?")) {
      handleLogoutSession(sessionId, submit);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "max-w-4xl space-y-6", children: [
    /* @__PURE__ */ jsxs(Alert, {
      className: "border-blue-200 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950", children: [
      /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-blue-500/10", children: /* @__PURE__ */ jsx(Monitor, { className: "w-4 h-4 text-blue-600" }) }),
      /* @__PURE__ */ jsx(AlertDescription, { className: "text-blue-800 dark:text-blue-200", children: "These are the devices that are currently logged into your account. You can logout any session you don't recognize for security purposes." })
      ]
    }),
    /* @__PURE__ */ jsx("div", {
      className: "space-y-4", children: sessions && sessions.length > 0 ? sessions.map((session) => {
        const DeviceIcon = getDeviceIcon(session.device);
        const BrowserIcon = getBrowserIcon(session.browser);
        return /* @__PURE__ */ jsx(
          Card,
          {
            className: `overflow-hidden transition-all hover:shadow-md ${session.is_current ? "border-2 border-primary bg-gradient-to-r from-primary/5 to-transparent" : "border-2"}`,
            children: /* @__PURE__ */ jsx(CardContent, {
              className: "p-6", children: /* @__PURE__ */ jsxs("div", {
                className: "flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between", children: [
            /* @__PURE__ */ jsxs("div", {
                  className: "flex gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: `p-3.5 rounded-xl shadow-sm ${session.is_current ? "bg-primary/10" : "bg-muted"}`, children: /* @__PURE__ */ jsx(DeviceIcon, { className: `w-6 h-6 ${session.is_current ? "text-primary" : "text-muted-foreground"}` }) }),
              /* @__PURE__ */ jsxs("div", {
                    className: "space-y-3", children: [
                /* @__PURE__ */ jsxs("div", {
                      className: "flex flex-wrap items-center gap-2", children: [
                  /* @__PURE__ */ jsxs("h3", {
                        className: "text-base font-semibold", children: [
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
                        className: "flex items-center gap-2.5", children: [
                    /* @__PURE__ */ jsx("div", { className: "p-1 rounded-md bg-muted", children: /* @__PURE__ */ jsx(BrowserIcon, { className: "w-3.5 h-3.5" }) }),
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: session.browser })
                        ]
                      }),
                  /* @__PURE__ */ jsxs("div", {
                        className: "flex items-center gap-2.5", children: [
                    /* @__PURE__ */ jsx("div", { className: "p-1 rounded-md bg-muted", children: /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5" }) }),
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: session.ip_address })
                        ]
                      }),
                  /* @__PURE__ */ jsxs("div", {
                        className: "flex items-center gap-2.5", children: [
                    /* @__PURE__ */ jsx("div", { className: "p-1 rounded-md bg-muted", children: /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5" }) }),
                    /* @__PURE__ */ jsxs("span", {
                          children: [
                            "Last active: ",
                      /* @__PURE__ */ jsx("span", { className: "font-medium", children: session.last_activity })
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
                      className: "w-full shadow-lg sm:w-auto",
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
            className: "flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "p-4 rounded-full bg-muted", children: /* @__PURE__ */ jsx(Monitor, { className: "w-12 h-12 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxs("div", {
              children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-1 text-lg font-semibold", children: "No Active Sessions" }),
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
const componentMap = {
  ProfileForm: {
    description: "This is how others will see you on the site.",
    component: ProfileForm
  },
  PasswordForm: {
    description: "Update your account’s password.",
    component: PasswordForm
  },
  TwoFAConfig: {
    description: "Add an extra layer of security using 2FA.",
    component: TwoFactorAuth
  },
  BrowserSessions: {
    description: "Manage and log out of your active browser sessions.",
    component: BrowserSessions
  }
};
function Index({ title, component, sessions = null, setup_data: setupData = null }) {
  const { props, url } = usePage();
  const user = props.auth?.user;
  const passwordLength = Number(props.site_theme_settings?.minimum_password_length) || 6;
  const componentInfo = componentMap[component] || null;
  const ComponentToRender = componentInfo?.component;
  const description = componentInfo?.description;
  return /* @__PURE__ */ jsx(BaseLayout, {
    children: /* @__PURE__ */ jsxs(AuthenticatedLayout, {
      children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs(Main, {
        fixed: true, children: [
      /* @__PURE__ */ jsxs("div", {
          className: "space-y-0.5", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight md:text-3xl", children: "Profile" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Manage your account and set preferences." })
          ]
        }),
      /* @__PURE__ */ jsx(Separator, { className: "my-4 lg:my-6" }),
      /* @__PURE__ */ jsxs("div", {
          className: "flex flex-col flex-1 space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12", children: [
        /* @__PURE__ */ jsx("aside", { className: "top-0 lg:sticky lg:w-1/5", children: /* @__PURE__ */ jsx(SidebarNav, { items: profileNavItems, url, title }) }),
        /* @__PURE__ */ jsx("div", {
            className: "flex w-full p-1 overflow-y-hidden", children: ComponentToRender ? /* @__PURE__ */ jsx(
              ContentSection,
              {
                title,
                desc: description,
                children: /* @__PURE__ */ jsx(
                  ComponentToRender,
                  {
                    user,
                    sessions,
                    setupData,
                    passwordLength
                  }
                )
              }
            ) : /* @__PURE__ */ jsx("p", { children: "Component not found" })
          })
          ]
        })
        ]
      })
      ]
    })
  });
}
export {
  Index as default
};


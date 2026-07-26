import { SubmitFunction } from "@/Types";







/**
 * Logout
 */
export const handleLogout = async (submitFn: SubmitFunction) => {
  try {
    await submitFn({
      method: "POST",
      url: route("backend.logout"),
    });
    return { success: true };
  } catch (error: any) {

    console.log(error);

    return { success: false };
  }
};


/**
 *
 * @param {*} data
 * @param {*} submit
 */
export const hanldleUpdatePassword = async (data: any, submit: SubmitFunction, isAdminRoute: boolean) => {
  try {
    await submit({
      method: 'POST',
      url: route(isAdminRoute ? 'backend.password.update' : 'password.reset.submit'),
      data: data,
    })
  } catch (error) {
  }
}

/**
 * Reset Password Request
 */
export const handleResetPassword = async (
  data: any,
  submitFn: SubmitFunction,
  isAdminRoute: boolean
) => {
  try {

    await submitFn({
      method: "POST",
      url: isAdminRoute ? route("backend.password.request.send") : route("password.request.send"),
      data,
    });
    return { success: true };
  } catch (error: any) {
    return { success: false };
  }
};

/**
 * Login
 */
export const handleLogin = async (data: any, submit: SubmitFunction, isAdminRoute: boolean) => {
  try {
    await submit({
      method: "POST",
      url: route(isAdminRoute ? "backend.authenticate" : "authenticate"),
      data,
    });
    return { success: true };
  } catch (error: any) {
    return { success: false };
  }
};

/**
 * Update Password
 */
export const handleUpdatePassword = async (
  data: any,
  submit: SubmitFunction
) => {
  try {
    await submit({
      method: "POST",
      url: route("backend.password.reset.submit"),
      data,
    });

    return { success: true };
  } catch (error: any) {
    return { success: false };
  }
};

/**
 * OTP Verify
 */
export const handleOtpVerify = async (
  data: any,
  submit: SubmitFunction,
  isGoogle2fa: boolean = false,
  isAdminRoute: boolean = true
) => {
  try {
    await submit({
      method: "POST",
      url: isAdminRoute ? (isGoogle2fa
        ? route("backend.2fa.verification.submit")
        : route("backend.password.verify.submit"))
        : route('password.verify.submit'),
      data,
    });

    return { success: true };
  } catch (error: any) {
    return { success: false };
  }
};

export const handleEmailVerify = async (
  data: any,
  submit: SubmitFunction,
) => {
  try {
    await submit({
      method: "POST",
      url: route("email.verify.submit"),
      data,
    });

    return { success: true };
  } catch (error: any) {
    return { success: false };
  }
};

/**
 * Logout From All Other Browsers
 */
export const handleLogoutOtherBrowser = async (submitFn: SubmitFunction) => {
  try {
    await submitFn({
      method: "POST",
      url: route("backend.logout.other.browser"),
    });

    return { success: true };
  } catch (error: any) {
    return { success: false };
  }
};

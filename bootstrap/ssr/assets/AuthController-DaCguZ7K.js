const handleLogout = async (submitFn) => {
  try {
    await submitFn({
      method: "POST",
      url: route("admin.logout")
    });
  } catch (error) {
  }
};
const handleResetPassword = async (data, submitFn) => {
  try {
    await submitFn({
      method: "POST",
      data,
      url: route("admin.password.request.send")
    });
  } catch (error) {
  }
};
const hanldleLogin = async (data, submit) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.authenticate"),
      data
    });
  } catch (error) {
  }
};
const hanldleUpdatePassword = async (data, submit) => {
  try {
    await submit({
      method: "POST",
      url: route("admin.password.reset.submit"),
      data
    });
  } catch (error) {
  }
};
const handleOtpVerify = async (data, submit, isGoogle2fa = false) => {
  try {
    await submit({
      method: "POST",
      url: isGoogle2fa ? route("admin.2fa.verification.submit") : route("admin.password.verify.submit"),
      data
    });
  } catch (error) {
  }
};
export {
  handleResetPassword as a,
  handleOtpVerify as b,
  hanldleUpdatePassword as c,
  handleLogout as d,
  hanldleLogin as h
};

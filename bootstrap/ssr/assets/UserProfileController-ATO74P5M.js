import "@inertiajs/react";
const handleUpdateProfile = async (e, data, submit, userId) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("_method", "PUT");
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("phone", data.phone || "");
  if (data.address) {
    formData.append("address[street]", data.address.street || "");
    formData.append("address[city]", data.address.city || "");
    formData.append("address[state]", data.address.state || "");
    formData.append("address[postal_code]", data.address.postal_code || "");
    formData.append("address[country]", data.address.country || "");
  }
  if (data.image) {
    formData.append("image", data.image);
  }
  try {
    await submit({
      method: "POST",
      url: route("backend.profile.update", userId),
      data: formData
    });
  } catch (error) {
    console.error("Profile update error:", error);
  }
};
const handleUpdatePassword = async (e, data, submit) => {
  e.preventDefault();
  try {
    await submit({
      method: "PUT",
      url: route("backend.profile.password.update"),
      data
    });
  } catch (error) {
    console.error("Password update error:", error);
  }
};
const handleEnableTwoFactor = async (e, data, submit) => {
  try {
    await submit({
      method: "POST",
      url: route("backend.profile.two.factor.verify"),
      data
    });
  } catch (error) {
    console.error("Enable 2FA error:", error);
  }
};
const handleDisableTwoFactor = async (data, submit) => {
  try {
    await submit({
      method: "POST",
      url: route("backend.profile.two.factor.disable"),
      data
    });
  } catch (error) {
    console.error("Disable 2FA error:", error);
  }
};
const handleRegenerateRecoveryCodes = async (submit) => {
  try {
    await submit({
      method: "POST",
      url: route("backend.profile.two.factor.regenerate")
    });
  } catch (error) {
    console.error("Regenerate recovery codes error:", error);
  }
};
const handleLogoutSession = async (sessionId, submit) => {
  try {
    await submit({
      method: "DELETE",
      url: route("backend.profile.session.logout", sessionId)
    });
  } catch (error) {
    console.error("Logout session error:", error);
  }
};
const handleDeleteAccount = async (e, formData, submit, setFormData) => {
  e.preventDefault();
  await submit({
    method: "POST",
    url: route("backend.profile.delete.account") + "?_method=DELETE",
    data: {
      password: formData.password
    },
    onSuccess: () => {
    },
    onError: (errors) => {
      console.error("Delete account error:", errors);
    }
  });
};
export {
  handleDisableTwoFactor as a,
  handleLogoutSession as b,
  handleUpdateProfile as c,
  handleEnableTwoFactor as d,
  handleUpdatePassword as e,
  handleDeleteAccount as f,
  handleRegenerateRecoveryCodes as h
};

import { jsx, Fragment } from "react/jsx-runtime";
import "./Badge-B6jlhcU-.js";
import "./Button-CFMlPXiE.js";
import { useState } from "react";
import "clsx";
import "react-hot-toast";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "tailwind-merge";
function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(notificationData);
  notifications.filter((n) => !n.read).length;
  const filterNotifications = () => {
    let filtered = notifications;
    if (activeTab === "unread") {
      filtered = filtered.filter((n) => !n.read);
    } else if (activeTab !== "all") {
      filtered = filtered.filter((n) => n.category === activeTab);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (n) => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };
  filterNotifications();
  return /* @__PURE__ */ jsx(Fragment, {});
}
export {
  Notifications as default
};

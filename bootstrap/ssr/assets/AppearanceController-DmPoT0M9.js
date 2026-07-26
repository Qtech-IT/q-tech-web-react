import { C as Card, a as CardContent } from "./Card-CQ2ij0--.js";
import { Settings } from "lucide-react";
import React__default from "react";
const getSectionIcon = (icon) => {
  const iconMap = {
    "🎯": "🎯",
    "⚙️": "⚙️",
    "❓": "❓",
    "📝": "📝",
    "📧": "📧",
    "📞": "📞",
    "🏆": "🏆",
    "🦶": "🦶"
  };
  return iconMap[icon] || "📄";
};
const emptySectionView = (text = "No sections available") => {
  return React__default.createElement(
    React__default.Fragment,
    null,
    React__default.createElement(
      Card,
      { className: "border-gray-300 border-dashed dark:border-gray-600" },
      React__default.createElement(
        CardContent,
        { className: "p-6" },
        React__default.createElement(
          "div",
          { className: "text-center text-muted-foreground" },
          React__default.createElement(Settings, { className: "w-8 h-8 mx-auto mb-2 opacity-50" }),
          React__default.createElement("p", null, text)
        )
      )
    )
  );
};
const handleSave = async (data, submit, sectionType, unlinkImages = []) => {
  const formData = new FormData();
  formData.append("section_type", sectionType);
  if (unlinkImages && unlinkImages?.length > 0) {
    unlinkImages?.forEach((img, index) => {
      formData.append(`unlinkImages[${index}]`, img);
    });
  }
  const processField = (key, value, prefix = "") => {
    const fullKey = prefix ? `${prefix}[${key}]` : key;
    if (value instanceof File) {
      formData.append(fullKey, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          Object.entries(item).forEach(([subKey, subValue]) => {
            processField(subKey, subValue, `${fullKey}[${index}]`);
          });
        } else {
          formData.append(`${fullKey}[${index}]`, item);
        }
      });
    } else if (typeof value === "boolean") {
      formData.append(fullKey, value ? "1" : "0");
    } else if (value !== null && value !== void 0 && value !== "") {
      formData.append(fullKey, value);
    }
  };
  Object.entries(data).forEach(([key, value]) => {
    processField(key, value);
  });
  try {
    await submit({
      method: "POST",
      url: route("admin.appearance.store"),
      data: formData
    });
  } catch (error) {
  }
};
export {
  emptySectionView as e,
  getSectionIcon as g,
  handleSave as h
};

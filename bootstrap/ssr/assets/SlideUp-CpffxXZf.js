import { jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
const tabVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 }
};
const SlideUp = ({ children, className }) => {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      variants: tabVariants,
      initial: "hidden",
      animate: "visible",
      exit: "exit",
      transition: { duration: 0.3, ease: "easeInOut" },
      className: `min-h-30 w-full ${className || ""}`,
      children
    }
  );
};
export {
  SlideUp as S
};

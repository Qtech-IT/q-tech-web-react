import { jsxs, jsx } from "react/jsx-runtime";
import "./Button-CFMlPXiE.js";
import "react";
import "clsx";
import "react-hot-toast";
import { Head } from "@inertiajs/react";
import "./Badge-B6jlhcU-.js";
import "./Sheet-B-_2BaZp.js";
import { A as AppLayout } from "./AppLayout-BOaFJ-XR.js";
import { a as sectionComponents } from "./constants-4k_q_jeE.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "tailwind-merge";
import "@radix-ui/react-direction";
import "lucide-react";
import "@radix-ui/react-icons";
import "@radix-ui/react-avatar";
import "@radix-ui/react-separator";
import "@radix-ui/react-dropdown-menu";
import "cmdk";
import "@radix-ui/react-dialog";
import "@radix-ui/react-scroll-area";
import "./HotToast-DfpkTxSC.js";
import "framer-motion";
import "react-responsive";
import "./Popover-Ckus2dfK.js";
import "@radix-ui/react-popover";
import "react-icons/tfi";
import "./BlogSection-DiGfvTON.js";
import "./EmptyData-DjqqIMwS.js";
import "./BlogCard-Jrl9AHYg.js";
import "./Input-ikOfQO4K.js";
import "./Label-BxDBN09D.js";
import "@radix-ui/react-label";
import "@radix-ui/react-switch";
import "./Card-CQ2ij0--.js";
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
const Home = ({ menu, sectionData }) => {
  menu = menu?.data;
  const sections = menu?.sections || [];
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: menu.meta_data?.meta_title || menu.title }),
    sections?.map((sectionKey, index) => {
      const SectionComponent = sectionComponents[sectionKey];
      const data = sectionData[sectionKey];
      if (!SectionComponent) return null;
      return /* @__PURE__ */ jsx(
        SectionComponent,
        {
          data
        },
        `${sectionKey}-${index}`
      );
    })
  ] });
};
export {
  Home as default
};

import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import axios from "axios";
import { router, createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import LoadingBar from "react-top-loading-bar";
window.axios = axios;
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
async function resolvePageComponent(path, pages) {
  for (const p of Array.isArray(path) ? path : [path]) {
    const page = pages[p];
    if (typeof page === "undefined") {
      continue;
    }
    return typeof page === "function" ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
const appName = "Salea-Automation";
let loadingBarRef = null;
router.on("start", () => {
  if (loadingBarRef) {
    loadingBarRef.continuousStart();
  }
});
router.on("finish", () => {
  if (loadingBarRef) {
    loadingBarRef.complete();
  }
});
const updateFavicon = (faviconUrl) => {
  if (!faviconUrl) return;
  const existingFavicon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
  if (existingFavicon) {
    existingFavicon.remove();
  }
  const link = document.createElement("link");
  link.rel   = "icon";
  link.type  = "image/x-icon";
  link.href  = faviconUrl;
  document.head.appendChild(link);
};


createInertiaApp({
  title: (title) => {
    const page       = window.history.state?.page || {};
    const props      = page.props || {};
    const settings   = props.site_theme_settings || {};
    const siteName   = settings.site_name || appName;
    return `${title} - ${siteName}`;
  
  },
  resolve: (name) => resolvePageComponent(
    `./Pages/${name}.jsx`,
    /* @__PURE__ */ Object.assign({ "./Pages/Admin/AdminUser/Index.jsx": () => import("./assets/Index-CWfCvT71.js"), "./Pages/Admin/AdminUser/Save.jsx": () => import("./assets/Save-DGLF9UCM.js"), "./Pages/Admin/Appearance/Create.jsx": () => import("./assets/Create-BvotqQq6.js"), "./Pages/Admin/Appearance/Index.jsx": () => import("./assets/Index-ZdXIFWO2.js"), "./Pages/Admin/Auth/Login.jsx": () => import("./assets/Login-BUCab5xi.js"), "./Pages/Admin/Auth/OtpVerification.jsx": () => import("./assets/OtpVerification-DhcdSsSD.js"), "./Pages/Admin/Auth/ResetPassword.jsx": () => import("./assets/ResetPassword-CbhK1R0R.js"), "./Pages/Admin/Auth/TwoFactorVerification.jsx": () => import("./assets/TwoFactorVerification-CkjzZ_zk.js"), "./Pages/Admin/Auth/UpdatePassword.jsx": () => import("./assets/UpdatePassword-DDZRQGq-.js"), "./Pages/Admin/Automation/Index.jsx": () => import("./assets/Index-DEmYlZiK.js"), "./Pages/Admin/Backup/Index.jsx": () => import("./assets/Index-DoGIE5lz.js"), "./Pages/Admin/Blog/Index.jsx": () => import("./assets/Index-akZ1sIbF.js"), "./Pages/Admin/Blog/Save.jsx": () => import("./assets/Save-CtWNWXD8.js"), "./Pages/Admin/Cache/Index.jsx": () => import("./assets/Index-BF1Mj-4v.js"), "./Pages/Admin/Communication/Contacts.jsx": () => import("./assets/Contacts-T5xcev1Z.js"), "./Pages/Admin/Communication/Subscribers.jsx": () => import("./assets/Subscribers-CeQ8OWCP.js"), "./Pages/Admin/Dashboard.jsx": () => import("./assets/Dashboard-CT93H9QD.js"), "./Pages/Admin/FAQ/Index.jsx": () => import("./assets/Index-CQjx-HQY.js"), "./Pages/Admin/Language/Index.jsx": () => import("./assets/Index-D3AqRB6i.js"), "./Pages/Admin/Language/Translate.jsx": () => import("./assets/Translate-B5NqzGha.js"), "./Pages/Admin/MarketCategory/Index.jsx": () => import("./assets/Index-QAslDKG3.js"), "./Pages/Admin/Menu/Index.jsx": () => import("./assets/Index-CU9LkVZb.js"), "./Pages/Admin/Notification/Gateway/Firebases/Index.jsx": () => import("./assets/Index-DaRBtGoc.js"), "./Pages/Admin/Notification/Gateway/Mail/Edit.jsx": () => import("./assets/Edit-DJ9jbXN1.js"), "./Pages/Admin/Notification/Gateway/Mail/Index.jsx": () => import("./assets/Index-DMS0wCt-.js"), "./Pages/Admin/Notification/Template/Edit.jsx": () => import("./assets/Edit-Ch8QLrJA.js"), "./Pages/Admin/Notification/Template/Global.jsx": () => import("./assets/Global-B1Vp-zBE.js"), "./Pages/Admin/Notification/Template/Index.jsx": () => import("./assets/Index-3CbCO0nr.js"), "./Pages/Admin/Page/Index.jsx": () => import("./assets/Index-KD-R7oRo.js"), "./Pages/Admin/Page/Save.jsx": () => import("./assets/Save-DNVO56IU.js"), "./Pages/Admin/PaymentMethod/Index.jsx": () => import("./assets/Index-DW6U1xSF.js"), "./Pages/Admin/PaymentMethod/Save.jsx": () => import("./assets/Save-C7lCfJ4v.js"), "./Pages/Admin/Profile/Index.jsx": () => import("./assets/Index-Du8U5ISY.js"), "./Pages/Admin/Role/Index.jsx": () => import("./assets/Index-MqyFqECw.js"), "./Pages/Admin/Role/Save.jsx": () => import("./assets/Save-DHWJoUI5.js"), "./Pages/Admin/Settings/Index.jsx": () => import("./assets/Index-BE0sZ_St.js"), "./Pages/Admin/Settings/SystemInfo.jsx": () => import("./assets/SystemInfo-BvMxokzr.js"), "./Pages/Admin/Tag/Index.jsx": () => import("./assets/Index-Jeuny6vJ.js"), "./Pages/Admin/Transaction/Index.jsx": () => import("./assets/Index-uiM-udut.js"), "./Pages/Admin/User/Index.jsx": () => import("./assets/Index-CnFkg2Hj.js"), "./Pages/Admin/User/Save.jsx": () => import("./assets/Save-DXElzRLI.js"), "./Pages/Admin/WithdrawMethod/Index.jsx": () => import("./assets/Index-1UOc80ja.js"), "./Pages/Admin/WithdrawMethod/Save.jsx": () => import("./assets/Save-B7E8lZ8a.js"), "./Pages/Frontend/Blogs/Details.jsx": () => import("./assets/Details-Bu_uo3mj.js"), "./Pages/Frontend/Blogs/Index.jsx": () => import("./assets/Index-DreYjnf5.js"), "./Pages/Frontend/Home.jsx": () => import("./assets/Home-B0Wbc0kx.js"), "./Pages/Frontend/Markets/Details.jsx": () => import("./assets/Details-DWIQZQLj.js"), "./Pages/Frontend/Markets/Index.jsx": () => import("./assets/Index-BEhjcK-I.js"), "./Pages/Frontend/Markets/ThemeTwo.jsx": () => import("./assets/ThemeTwo-ChJZjL4S.js"), "./Pages/Frontend/Pages/Details.jsx": () => import("./assets/Details-DDqC75TM.js"), "./Pages/User/Auth/EmailVerification.jsx": () => import("./assets/EmailVerification-BNupTYAX.js"), "./Pages/User/Auth/ForgotPassword.jsx": () => import("./assets/ForgotPassword-LnKodhC8.js"), "./Pages/User/Auth/Login.jsx": () => import("./assets/Login-ZRbBcdTq.js"), "./Pages/User/Auth/OtpVerification.jsx": () => import("./assets/OtpVerification-C4iliHt8.js"), "./Pages/User/Auth/Register.jsx": () => import("./assets/Register-B-pXGQ_R.js"), "./Pages/User/Auth/ResetPassword.jsx": () => import("./assets/ResetPassword-DU3Hiz6E.js"), "./Pages/User/Auth/TwoFactorVerification.jsx": () => import("./assets/TwoFactorVerification-VTR04K9l.js"), "./Pages/User/Auth/UpdatePassword.jsx": () => import("./assets/UpdatePassword-Cc65-iWn.js"), "./Pages/User/Bookmarks/Index.jsx": () => import("./assets/Index-Cmm7-c0U.js"), "./Pages/User/History/Index.jsx": () => import("./assets/Index-BSaDfJwK.js"), "./Pages/User/Notifications.jsx": () => import("./assets/Notifications-MZThFWKR.js"), "./Pages/User/Portfolio/Index.jsx": () => import("./assets/Index-CYtseZPq.js"), "./Pages/User/Profile/Index.jsx": () => import("./assets/Index-CBzv3Qit.js"), "./Pages/User/Tickets/Index.jsx": () => import("./assets/Index-DzSJZTUM.js"), "./Pages/User/Tickets/Show.jsx": () => import("./assets/Show-BFOYsENJ.js"), "./Pages/User/Wallet/Index.jsx": () => import("./assets/Index-BDrqUXHE.js") })
  ),
  setup({ el, App, props }) {

    const favicon = props.initialPage?.props?.logos?.favicon;
    if (favicon) {
      updateFavicon(favicon);
    }

    const root = createRoot(el);
    root.render(
      /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          LoadingBar,
          {
            color: "blue",
            height: 2,
            shadow: true,
            ref: (ref) => loadingBarRef = ref
          }
        ),
        /* @__PURE__ */ jsx(App, { ...props })
      ] })
    );
  },
  progress: {
    color: "#4B5563"
  }
});
router.on("navigate", (event) => {
  const currentUrl = window.location.pathname;
});

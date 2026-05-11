/*!

=========================================================
* Light Bootstrap Dashboard React - v2.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "../../views/Dashboard.jsx";
import UserProfile from "../../views/UserProfile.jsx";
import TableList from "../../views/TableList.jsx";
import Typography from "../../views/Typography.jsx";
import Icons from "../../views/Icons.jsx";
import Maps from "../../views/Maps.jsx";
import Notifications from "../../views/Notifications.jsx";
import Upgrade from "../../views/Upgrade.jsx";

const dashboardRoutes = [
  {
    upgrade: true,
    path: "/upgrade",
    name: "Upgrade to PRO",
    icon: "nc-icon nc-alien-33",
    component: Upgrade,
    layout: "/admin"
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/orders",
    name: "B2B & B2C Orders",
    icon: "nc-icon nc-notes",
    component: TableList, // We'll customize these components later
    layout: "/admin"
  },
  {
    path: "/production-tracking",
    name: "Production Tracking",
    icon: "nc-icon nc-delivery-fast",
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/custom-manufacturing",
    name: "Custom Designs",
    icon: "nc-icon nc-settings-90",
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/products",
    name: "Manage Products",
    icon: "nc-icon nc-tag-content",
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/vendors",
    name: "Vendors & Plans",
    icon: "nc-icon nc-single-02",
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/resellers",
    name: "Reseller Network",
    icon: "nc-icon nc-share-66",
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/wallet-refunds",
    name: "Wallet & Refunds",
    icon: "nc-icon nc-money-coins",
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/delivery-rules",
    name: "Delivery Income",
    icon: "nc-icon nc-map-big",
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/system-rules",
    name: "System Settings",
    icon: "nc-icon nc-preferences-circle-rotate",
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "My Profile",
    icon: "nc-icon nc-circle-09",
    component: UserProfile,
    layout: "/admin"
  }
];

export default dashboardRoutes;

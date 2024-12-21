import React, { useContext, useEffect, useState } from "react";
import {
  Home,
  FileText,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Users,
  UsersRound,
} from "lucide-react";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import { AdminPrivileges, EmployeeRoles } from "../utils/Enums";
import {
  AddBusiness,
  AdminPanelSettings,
  Business,
  BusinessCenter,
  Leaderboard,
  Logout,
  Dashboard,
  NotificationAddRounded,
  NotificationImportant,
  Notifications,
  Person2,
  Settings,
} from "@mui/icons-material";
import { Badge } from "@mui/material";
import UserContext from "../context/UserContext";
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

const usersections = [
  {
    route: "/home",
    icon: Leaderboard,
    roles: [EmployeeRoles.DealExecutor, EmployeeRoles.DealOpener, EmployeeRoles.Manager],
    title: "Overview",
  },
  {
    route: "/home/business",
    icon: Business,
    roles: [EmployeeRoles.Manager],
    title: "Business Profile",
  },
  {
    route: "/home/deals",
    icon: BusinessCenter,
    roles: [EmployeeRoles.Manager , EmployeeRoles.DealExecutor, EmployeeRoles.DealOpener],
    title: "Deals",
  },
  {
    route: "/home/targets",
    icon: TrackChangesIcon,
    roles: [EmployeeRoles.Manager],
    title: "Targets",
  },
  {
    route: "/home/records",
    icon: DollarSign,
    roles: [EmployeeRoles.Manager , EmployeeRoles.DealExecutor],
    title: "Financial Records",
  },
  {
    route: "/home/employees",
    icon: Users,
    roles: [EmployeeRoles.Manager],
    title: "Employees",
  },
  {
    route: "/home/customers",
    icon: UsersRound,
    roles: [EmployeeRoles.DealOpener , EmployeeRoles.Manager],
    title: "Customers",
  },
  {
    route: "/home/logs",
    icon: FileText,
    roles: [EmployeeRoles.Manager],
    title: "Logs",
  },
];

const adminsections = [
  {
    route: "/admin/",
    icon: AddBusiness,
    roles: [AdminPrivileges.Normal, AdminPrivileges.Super],
    title: "Business Requests",
  },
  {
    route: "/admin/admins",
    icon: AdminPanelSettings,
    roles: [AdminPrivileges.Normal, AdminPrivileges.Super],
    title: "Manage Admins",
  },
];

export default function SideBar({ type = "user" }) {
  const [selectedSection, setSelectedSection] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const { employee, notificationCount } = useContext(UserContext);

  useEffect(() => {
    // check current route and set selected section accordingly
    const currentPath = window.location.pathname;
    const sectionIndex = (
      type == "admin" ? adminsections : usersections
    ).findIndex((section) => section.route === currentPath);
    setSelectedSection(sectionIndex);
  }, []);

  return (
    <div
      className={`
        h-full flex flex-col 
        text-white
        ${!isCollapsed ? "pr-3" : ""}
      `}
      style={{ backgroundColor: "#111827" }}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center h-20 ml-2 border-b border-gray-700">
        <Logo logoChoice={2} size="h-[48px] w-[48px]" />
        {!isCollapsed && (
          <Link
            to={"/"}
            //onClick={() => onSectionChange("default")}
            className="self-center text-xl font-semibold whitespace-nowrap ml-2 text-white hover:text-gray-400 "
          >
            Sales Sphere
          </Link>
        )}
      </div>

      {/* Toggle Button Below the Logo */}
      <div className="flex justify-center my-4">
        <button
          onClick={toggleSidebar}
          className="text-white hover:bg-gray-700 p-2 rounded  focus:outline-none"
        >
          {isCollapsed ? (
            <ChevronRight className="h-6 w-6" />
          ) : (
            <ChevronLeft className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Navigation Links */}

      <ul className="flex-grow space-y-2 px-2">
        {(type == "admin" ? adminsections : usersections).map(
          (section, index) => {
            if (section.roles.length === 0 || section.roles.includes(employee.role)) {
            return (
              <li key={index}>
                <Link
                  to={`${section.route}`}
                  onClick={() => {
                    setSelectedSection(index);
                  }}
                  key={index}
                  className={`flex items-center py-2 
                ${isCollapsed ? "justify-center" : "px-4"}
                ${selectedSection === index ? "bg-gray-700" : ""}
                rounded hover:bg-gray-700 w-full text-left
                  `}
                >
                  <section.icon
                    className={`h-5 w-5 mr-3 ${isCollapsed ? "ml-3" : " "}`}
                  />
                  {!isCollapsed && <span>{section.title}</span>}
                </Link>
              </li>
            );
            }
          }
        )}
      </ul>

      {/* bottom part */}
      <div
        className={
          "flex justify-center py-2" + (isCollapsed ? " flex-col" : " pl-3")
        }
      >
        {type != "admin" && employee && employee.id && (
          <Link
            to="/home/notifications"
            className="flex items-center py-2 px-4 rounded w-full text-left"
          >
            <Badge
              color="primary"
              overlap="circular"
              invisible={notificationCount === 0}
              badgeContent={notificationCount}
            >
              <Notifications className="hover:text-gray-300" />
            </Badge>
          </Link>
        )}
        {type != "admin" && employee && employee.id && (
          <Link
            to={"/home/employees/" + employee.id}
            className="flex items-center py-2 px-4 rounded w-full text-left"
          >
            <Person2 className="hover:text-gray-300" />
          </Link>
        )}

        {type != "admin" && employee && employee.id && (
          <Link
            to={"/home/settings/"}
            className="flex items-center py-2 px-4 rounded w-full text-left"
          >
            <Settings className="hover:text-gray-300" />
          </Link>
        )}

        <Link
          to="/logout"
          className="flex items-center py-2 px-4 rounded w-full text-left"
        >
          <Logout className="hover:text-gray-300" />
        </Link>
      </div>
    </div>
  );
}

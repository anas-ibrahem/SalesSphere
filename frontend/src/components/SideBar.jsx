import React, { useEffect } from "react";
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
import { AddBusiness, AdminPanelSettings } from "@mui/icons-material";

const usersections = [
  { route: "/home/", icon: Home, roles: [EmployeeRoles.DealExecutor, EmployeeRoles.DealOpener], title: "Business" },
  { route: "/home/logs", icon: FileText, roles: [EmployeeRoles.DealExecutor, EmployeeRoles.DealOpener], title: "Logs" },
  { route: "/home/deals", icon: DollarSign, roles: [EmployeeRoles.DealExecutor, EmployeeRoles.DealOpener], title: "Deals" },
  { route: "/home/records", icon: DollarSign, roles: [EmployeeRoles.DealExecutor, EmployeeRoles.DealOpener], title: "Financial Records" },
  { route: "/home/employees", icon: Users, roles: [EmployeeRoles.DealExecutor, EmployeeRoles.DealOpener], title: "Employees" },
  { route: "/home/customers", icon: UsersRound, roles: [EmployeeRoles.DealExecutor, EmployeeRoles.DealOpener], title: "Customers" },
];

const adminsections = [
  { route: "/admin/", icon: AddBusiness, roles: [AdminPrivileges.Normal, AdminPrivileges.Super], title: "Business Requests" },
  { route: "/admin/admins", icon: AdminPanelSettings, roles: [AdminPrivileges.Normal, AdminPrivileges.Super], title: "Manage Admins" },
 
];

export default function SideBar({
  onSectionChange,
  isCollapsed,
  toggleSidebar,
  type="user",
}) {
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
          <Link to={'/'}
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
      {
        (type == "admin" ? adminsections : usersections).map((section, index) => {
          //if (section.roles.length === 0 || section.roles.includes(EmployeeRoles.DealExecutor)) {
            return (
              <li key={index}>
                <Link to={`${section.route}`}
                  key={index}
                  className={`flex items-center py-2 
                ${isCollapsed ? "justify-center" : "px-4"}
                rounded hover:bg-gray-700 w-full text-left
                  `}
                >
                  <section.icon className={`h-5 w-5 mr-3 ${isCollapsed ? "ml-3" : " "}`} />
                  {!isCollapsed && <span>{section.title}</span>}
                </Link>
              </li>
            );
          //}
        })
      }
      </ul>
    </div>
  );
}

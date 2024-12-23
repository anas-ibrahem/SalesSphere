import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import EmployeeProfile from "./EmployeeProfile";
import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
} from "@material-tailwind/react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AddEmployeeForm from "../Forms/AddEmployeeForm";
import Pagination from "../Pagination";
import fetchAPI from "../../utils/fetchAPI";
import { EmployeeRoles } from "../../utils/Enums";
import AddTarget from "../Forms/AddTarget";
import UserContext from "../../context/UserContext";

const EmployeesSection = () => {
  const [reload, setReload] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [sortField, setSortField] = useState("account_creation_date");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const EmployeesPerPage = 4;
  const navigate = useNavigate();
  const { employee: me } = useContext(UserContext);
  const manager = me.role === EmployeeRoles.Manager;

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchAPI("/employee/summary/all", "GET", null, token)
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setLoading(false);
      });
  }, [reload]);

  const getRoleType = (typeValue) => {
    return (
      Object.keys(EmployeeRoles).find(
        (key) => EmployeeRoles[key] === typeValue
      ) || "Unknown"
    );
  };

  const getSortOptions = (filterType) => {
    if (!manager) {
      return [
        { value: "name", label: "Name" },
        { value: "account_creation_date", label: "Creation Date" },
      ];
    }

    const commonOptions = [
      { value: "name", label: "Name" },
      { value: "account_creation_date", label: "Creation Date" },
    ];

    switch (filterType) {
      case "DealOpener":
        return [
          ...commonOptions,
          { value: "open_deals_count", label: "Opened Deals" },
        ];
      case "DealExecutor":
        return [
          ...commonOptions,
          { value: "claimed_deals", label: "Claimed Deals" },
          { value: "closed_deals", label: "Closed Deals" },
          { value: "closed_lost_deals_count", label: "Closed Lost Deals" },
          { value: "closed_won_deals_count", label: "Closed Won Deals" },
        ];
      default:
        return commonOptions;
    }
  };

  useEffect(() => {
    const validOptions = getSortOptions(filterType).map(option => option.value);
    if (!validOptions.includes(sortField)) {
      setSortField("account_creation_date");
    }
  }, [filterType, sortField]);

  function handleOnBack() {
    setSearchQuery("");
    setSortOrder("asc");
    setFilterType("All");
    setSortField("account_creation_date");
    setCurrentPage(1);
    setReload(!reload);
    navigate(-1);
  }

  const filterEmployees = employees.filter((employee) => {
    const roleType = getRoleType(employee.role);
    return (
      (filterType === "All" || roleType === filterType) &&
      (searchQuery === "" ||
        employee.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const sortedEmployees = [...filterEmployees].sort((a, b) => {
    if (!manager) {
      // Only allow sorting by name and creation date for non-managers
      switch (sortField) {
        case "account_creation_date":
          const aDate = new Date(a.account_creation_date);
          const bDate = new Date(b.account_creation_date);
          return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
        case "name":
          return sortOrder === "asc"
            ? a.first_name.localeCompare(b.first_name)
            : b.first_name.localeCompare(a.first_name);
        default:
          return 0;
      }
    }

    switch (sortField) {
      case "account_creation_date":
        const aDate = new Date(a.account_creation_date);
        const bDate = new Date(b.account_creation_date);
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;

      case "closed_deals":
        const aClosedDeals = a.deals?.closed_won_deals_count || 0;
        const bClosedDeals = b.deals?.closed_won_deals_count || 0;
        return sortOrder === "asc"
          ? aClosedDeals - bClosedDeals
          : bClosedDeals - aClosedDeals;

      case "claimed_deals":
        const aClaimedDeals = a.claimed_deals_count || 0;
        const bClaimedDeals = b.claimed_deals_count || 0;
        return sortOrder === "asc"
          ? aClaimedDeals - bClaimedDeals
          : bClaimedDeals - aClaimedDeals;

      case "closed_lost_deals_count":
        const aClosedLostDeals = a.deals?.closed_lost_deals_count || 0;
        const bClosedLostDeals = b.deals?.closed_lost_deals_count || 0;
        return sortOrder === "asc"
          ? aClosedLostDeals - bClosedLostDeals
          : bClosedLostDeals - aClosedLostDeals;

      case "closed_won_deals_count":
        const aClosedWonDeals = a.deals?.closed_won_deals_count || 0;
        const bClosedWonDeals = b.deals?.closed_won_deals_count || 0;
        return sortOrder === "asc"
          ? aClosedWonDeals - bClosedWonDeals
          : bClosedWonDeals - aClosedWonDeals;

      case "open_deals_count":
        const aOpenDeals = a.deals?.open_deals_count || 0;
        const bOpenDeals = b.deals?.open_deals_count || 0;
        return sortOrder === "asc"
          ? aOpenDeals - bOpenDeals
          : bOpenDeals - aOpenDeals;

      case "name":
        return sortOrder === "asc"
          ? a.first_name.localeCompare(b.first_name)
          : b.first_name.localeCompare(a.first_name);

      default:
        return 0;
    }
  });

  const indexOfLastEmployee = currentPage * EmployeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - EmployeesPerPage;
  const currentEmployees = sortedEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const totalPages = Math.ceil(sortedEmployees.length / EmployeesPerPage);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <section className="bg-white p-6 shadow-md h-screen flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold mb-4">Business' Employees</h1>
              {manager && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate("add")}
                    className="flex items-center px-4 border rounded bg-blue-500 text-white hover:bg-blue-600"
                  >
                    <i className="fas fa-plus text-xl mr-2 pb-[3px]"></i>
                    <span className="text-lg">Add Employee</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-between mb-4">
              <div className="flex space-x-4">
                <select
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    // Reset sort field when changing filter type
                    setSortField("account_creation_date");
                  }}
                  value={filterType}
                  className="p-2 border rounded"
                >
                  <option value="All">All Types</option>
                  {Object.values(EmployeeRoles).map((role) => (
                    <option key={role} value={getRoleType(role)}>
                      {getRoleType(role).replace(/([a-z])([A-Z])/g, '$1 $2')}
                    </option>
                  ))}
                </select>

                <select
                  onChange={(e) => setSortField(e.target.value)}
                  value={sortField}
                  className="p-2 border rounded"
                >
                  {getSortOptions(filterType).map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <select
                  onChange={(e) => setSortOrder(e.target.value)}
                  value={sortOrder}
                  className="p-2 border rounded"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>

                <input
                  type="text"
                  placeholder="Search employees..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                  value={searchQuery}
                  className="p-2 border rounded flex-grow"
                />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto">
              <Card>
                <List>
                  {loading ? (
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="text-center"
                    >
                      Loading...
                    </Typography>
                  ) : (
                    currentEmployees.map((employee) => (
                      <ListItem
                        key={employee.id}
                        className="cursor-default my-2 hover:bg-gray-100 border border-gray-200"
                        onClick={() => navigate(`${employee.id}`)}
                      >
                        <ListItemPrefix>
                          <Avatar
                            variant="circular"
                            alt={`${employee.first_name} ${employee.last_name}'s profile`}
                            src={
                              employee.profile_picture_url ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                employee.first_name
                              )}+${encodeURIComponent(employee.last_name)}`
                            }
                            className="w-20 h-20 mr-2"
                          />
                        </ListItemPrefix>
                        <div>
                          <Typography variant="h6" color="blue-gray">
                            {employee.first_name} {employee.last_name}
                          </Typography>
                          <Typography
                            variant="small"
                            color="gray"
                            className="font-normal"
                          >
                            {employee.email}
                          </Typography>
                          <Typography
                            variant="small"
                            color="gray"
                            className="font-normal flex justify-between"
                          >
                            <p>
                              {getRoleType(employee.role) === "Manager"
                                ? "Manager"
                                : getRoleType(employee.role).slice(0, 4) +
                                  " " +
                                  getRoleType(employee.role).slice(4)}
                            </p>
                          </Typography>
                          {manager && (
                            <>
                              <Typography
                                variant="small"
                                color="gray"
                                className="font-normal flex justify-between"
                              >
                                {getRoleType(employee.role) === "DealExecutor" && (
                                  <p className="mr-28">
                                    Claimed Deals:{" "}
                                    {employee?.claimed_deals_count || 0}
                                  </p>
                                )}
                              </Typography>
                              <Typography
                                variant="small"
                                color="gray"
                                className="font-normal flex justify-between"
                              >
                                {getRoleType(employee.role) !== "Manager" && (
                                  <p>
                                    Deals:
                                    {getRoleType(employee.role) === "DealOpener" && (
                                      <span>
                                        {" "}
                                        Opened: {employee?.open_deals_count || 0} 
                                      </span>
                                    )}
                                    <span> </span>
                                    {getRoleType(employee.role) === "DealExecutor" && (
                                      <>
                                        Closed Won: {employee?.closed_won_deals_count || 0} ,
                                        Closed Lost: {employee?.closed_lost_deals_count || 0}
                                      </>
                                    )}    
                                  </p>
                                )}
                              </Typography>
                            </>
                          )}
                        </div>
                      </ListItem>
                    ))
                  )}
                </List>
              </Card>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </section>
        }
      />
      <Route
        path=":employeeId/*"
        element={<EmployeeProfile back={handleOnBack} />}
      />
      <Route path="add" element={<AddEmployeeForm onBack={handleOnBack} />} />
      <Route path="addTarget" element={<AddTarget onBack={handleOnBack} />} />
    </Routes>
  );
};

export default EmployeesSection;
import React, { useEffect, useState } from "react";
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
import fetchAPI from '../../utils/fetchAPI';
import { EmployeeRoles } from "../../utils/Enums";

const EmployeesSection = () => {
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

  // Fetch employees from API
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchAPI('/employee/summary/all', 'GET', null, token)
      .then((data) => {
        console.log(data);
        setEmployees(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setLoading(false);
      });
  }, []);

  const getRoleType = (typeValue) => {
    return Object.keys(EmployeeRoles).find(key => EmployeeRoles[key] === typeValue) || "Unknown";
  };

  // Filtering logic
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

  // Sorting logic
  const sortedEmployees = [...filterEmployees].sort((a, b) => {
    switch (sortField) {
      case "account_creation_date":
        const aDate = new Date(a.account_creation_date);
        const bDate = new Date(b.account_creation_date);
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      
      case "total_customers":
        const aCustomers = a.customers?.customers_count || 0;
        const bCustomers = b.customers?.customers_count || 0;
        return sortOrder === "asc" ? aCustomers - bCustomers : bCustomers - aCustomers;
      
      case "closed_deals":
        const aClosedDeals = a.deals?.closed_won_deals_count || 0;
        const bClosedDeals = b.deals?.closed_won_deals_count || 0;
        return sortOrder === "asc" ? aClosedDeals - bClosedDeals : bClosedDeals - aClosedDeals;

      case "claimed_deals":
        const aClaimedDeals = a.deals?.claimed_deals_count || 0;
        const bClaimedDeals = b.deals?.claimed_deals_count || 0;
        return sortOrder === "asc" ? aClaimedDeals - bClaimedDeals : bClaimedDeals - aClaimedDeals;

      case "closed_lost_deals_count":
        const aClosedLostDeals = a.deals?.closed_lost_deals_count || 0;
        const bClosedLostDeals = b.deals?.closed_lost_deals_count || 0;
        return sortOrder === "asc" ? aClosedLostDeals - bClosedLostDeals : bClosedLostDeals - aClosedLostDeals;

      case "closed_won_deals_count":
        const aClosedWonDeals = a.deals?.closed_won_deals_count || 0;
        const bClosedWonDeals = b.deals?.closed_won_deals_count || 0;
        return sortOrder === "asc" ? aClosedWonDeals - bClosedWonDeals : bClosedWonDeals - aClosedWonDeals;

      case "open_deals_count":
        const aOpenDeals = a.deals?.open_deals_count || 0;
        const bOpenDeals = b.deals?.open_deals_count || 0;
        return sortOrder === "asc" ? aOpenDeals - bOpenDeals : bOpenDeals - aOpenDeals;

      case "name":
        return sortOrder === "asc" 
          ? a.first_name.localeCompare(b.first_name)
          : b.first_name.localeCompare(a.first_name);
      
      default:
        return 0;
    }
  });

  // Pagination logic
  const indexOfLastEmployee = currentPage * EmployeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - EmployeesPerPage;
  const currentEmployees = sortedEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const totalPages = Math.ceil(sortedEmployees.length / EmployeesPerPage);

  const manager = true;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <section className="bg-white p-6 shadow-md h-screen flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold mb-4">Employees</h1>

              {manager && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate("add")}
                    className="flex items-center px-4 border rounded bg-blue-500 text-white hover:bg-blue-600"
                  >
                    <i className="fas fa-plus text-xl mr-2 pb-[3px]"></i>
                    <span className="text-lg">Add Employee</span>
                  </button>
                  <button
                    onClick={() => navigate("addtarget")}
                    className="flex items-center px-4 border rounded bg-blue-500 text-white hover:bg-blue-600"
                  >
                    <i className="fas fa-plus text-xl mr-2 pb-[3px]"></i>
                    <span className="text-lg">Add Target</span>
                  </button>
                </div>
              )}
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex justify-between mb-4">
              <div className="flex space-x-4">
                {/* Role Filter */}
                <select
                  onChange={(e) => setFilterType(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="All">All Types</option>
                  {Object.values(EmployeeRoles).map((role) => (
                    <option key={role} value={getRoleType(role)}>
                      {getRoleType(role)}
                    </option>
                  ))}
                </select>

                {/* Sort Field */}
                <select
                  onChange={(e) => setSortField(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="account_creation_date">Creation Date</option>
                  <option value="name">Name</option>
                  {filterType === "DealOpener" && (
                    <>
                      <option value="total_customers">Total Customers</option>
                      <option value="open_deals_count">Open Deals</option>
                    </>
                  )}
                  {filterType === "DealExecutor" && (
                    <option value="claimed_deals">Claimed Deals</option>
                  )}
                  <option value="closed_deals">Closed Deals</option>
                  <option value="closed_lost_deals_count">Closed Lost Deals</option>
                  <option value="closed_won_deals_count">Closed Won Deals</option>
                </select>
                <select
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>

                {/* Search Input */}
                <input 
                  type="text"
                  placeholder="Search employees..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="p-2 border rounded flex-grow"
                />
              </div>
            </div>

            {/* Employees Table */}
            <div className="flex-grow overflow-y-auto">
              <Card>
                <List>
                  {loading ? (
                    <Typography variant="h6" color="blue-gray" className="text-center">
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
                            src={employee.profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.first_name)}+${encodeURIComponent(employee.last_name)}`}
                            className="w-20 h-20"
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
                            <p>{getRoleType(employee.role) === "Manager" ? "Manager" :
                            getRoleType(employee.role).slice(0, 4) + " " + getRoleType(employee.role).slice(4)}</p>
                          </Typography>
                          <Typography
                            variant="small"
                            color="gray"
                            className="font-normal flex justify-between"
                          >
                            {
                              getRoleType(employee.role) === "DealOpener" &&
                            <p className="mr-28">
                              Total Customers: {employee.customers?.customers_count || 0}
                            </p>
                            }
                          </Typography>
                          <Typography
                            variant="small"
                            color="gray"
                            className="font-normal flex justify-between"
                          >
                            {
                              getRoleType(employee.role) === "DealExecutor" &&
                            <p className="mr-28">
                              Claimed Deals: {employee.deals?.claimed_deals_count || 0}
                            </p>
                            }
                          </Typography>
                          <Typography
                            variant="small"
                            color="gray"
                            className="font-normal flex justify-between"
                          >
                            { getRoleType(employee.role) !== "Manager" &&
                            <p>
                              Deals:
                              {getRoleType(employee.role) === "DealOpener" &&
                                <span> Open: {employee.deals?.open_deals_count || 0} ,</span>
                              }
                              <span> </span>
                              Closed Won: {employee.deals?.closed_won_deals_count || 0} , 
                              Closed Lost: {employee.deals?.closed_lost_deals_count || 0}
                            </p>
                            }
                          </Typography>
                        </div> 
                      </ListItem>
                    ))
                  )}
                </List>
              </Card>
            </div>

            {/* Pagination */}
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
        element={<EmployeeProfile back={() => navigate("/home/employees")} />}
      />
      <Route
        path="add"
        element={
          <AddEmployeeForm onBack={() => navigate("/home/employees")} />
        }
      />
      <Route
        path="addtarget"
        element={<AddEmployeeForm onBack={() => navigate("/home/employees")} />}
      />
    </Routes>
  );
}

export default EmployeesSection;
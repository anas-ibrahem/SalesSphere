import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { List, ListItem, Card, Typography } from "@material-tailwind/react";
import AddCustomerForm from "../Forms/AddCustomerForm";
import CustomerProfile from "./CustomerProfile";
import Pagination from "../Pagination";
import fetchAPI from "../../utils/fetchAPI";
import { CustomerTypes, EmployeeRoles } from "../../utils/Enums";
import { LineChart } from "@mui/x-charts";
import { BarChart as BarChartIcon, Token } from "@mui/icons-material";
import { BarChart } from "@mui/x-charts";
import UserContext from "../../context/UserContext";

const CustomersSection = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("All");
  const [sortField, setSortField] = useState("registration_date");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState([]);
  const [revenueMetrics, setRevenueMetrics] = useState([]);
  const [reload, setReload] = useState(false);
  const CustomersPerPage = 4;
  const navigate = useNavigate();
  const { employee: me } = useContext(UserContext);
  const canAddCustomer = me.role === EmployeeRoles.DealOpener;

  // Deal status styles matching the deals section
  const dealStatusStyles = {
    open: "text-blue-500",
    claimed: "text-yellow-500",
    closedWon: "text-green-500",
    closedLost: "text-red-500",
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchAPI("/customer", "GET", null, token)
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
        setLoading(false);
      });

    fetchAPI("/customer/metrics", "GET", null, token)
      .then((data) => {
        setMetrics(data);
      })
      .catch((error) => {
        console.error("Error fetching metrics:", error);
      });

    fetchAPI("/customer/metrics/revenue", "GET", null, token)
      .then((data) => {
        setRevenueMetrics(data);
      })
      .catch((error) => {
        console.error("Error fetching metrics:", error);
      });
  }, [reload]);

  const getCustomerType = (typeValue) => {
    return (
      Object.keys(CustomerTypes).find(
        (key) => CustomerTypes[key] === typeValue
      ) || "Unknown"
    );
  };

  const filterCustomers = customers.filter((customer) => {
    const customerType = getCustomerType(customer.type);
    return (
      (filterType === "All" || customerType === filterType) &&
      (searchQuery === "" ||
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  function handleOnBack() {
    setSearchQuery("");
    setFilterType("All");
    setSortField("registration_date");
    setSortOrder("asc");
    setCurrentPage(1);
    setReload(!reload);
    navigate(-1);
  }

  const sortedCustomers = [...filterCustomers].sort((a, b) => {
    switch (sortField) {
      case "registration_date":
        return sortOrder === "asc"
          ? new Date(a.registration_date) - new Date(b.registration_date)
          : new Date(b.registration_date) - new Date(a.registration_date);
      case "name":
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      case "open_deals":
        return sortOrder === "asc"
          ? a.open_deals_count - b.open_deals_count
          : b.open_deals_count - a.open_deals_count;
      case "closed_won_deals":
        return sortOrder === "asc"
          ? a.closed_won_deals_count - b.closed_won_deals_count
          : b.closed_won_deals_count - a.closed_won_deals_count;
      case "closed_lost_deals":
        return sortOrder === "asc"
          ? a.closed_lost_deals_count - b.closed_lost_deals_count
          : b.closed_lost_deals_count - a.closed_lost_deals_count;
      case "claimed_deals":
        return sortOrder === "asc"
          ? a.claimed_deals_count - b.claimed_deals_count
          : b.claimed_deals_count - a.claimed_deals_count;
      default:
        return 0;
    }
  });

  const indexOfLastCustomer = currentPage * CustomersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - CustomersPerPage;
  const currentCustomers = sortedCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );
  const totalPages = Math.ceil(sortedCustomers.length / CustomersPerPage);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <section className="bg-white p-6 shadow-md h-screen flex flex-col max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold mb-4">
                {me.role !== EmployeeRoles.Manager && <span>Your </span>}
                {me.role === EmployeeRoles.Manager && <span>Business' </span>}
                Customers
              </h1>

              {canAddCustomer && (
                <button
                  onClick={() => navigate("add")}
                  className="flex items-center px-4 border rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  <i className="fas fa-plus text-xl mr-2 pb-[3px]"></i>
                  <span className="text-lg">Add Customer</span>
                </button>
              )}
            </div>

            <div className="flex justify-between mb-4">
              <div className="flex space-x-4">
                <select
                  onChange={(e) => setFilterType(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="All">All Types</option>
                  {Object.keys(CustomerTypes).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <select
                  onChange={(e) => setSortField(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="registration_date">Registration Date</option>
                  <option value="name">Name</option>
                  <option value="open_deals">Open Deals</option>
                  <option value="closed_won_deals">Closed Won Deals</option>
                  <option value="closed_lost_deals">Closed Lost Deals</option>
                  <option value="claimed_deals">Claimed Deals</option>
                </select>

                <select
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>

                <input
                  type="text"
                  placeholder="Search customers..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="p-2 border rounded flex-grow"
                />
              </div>
            </div>

            <div className="flex">
              <div className="flex-grow overflow-y-auto">
                {loading ? (
                  <div className="text-center">Loading...</div>
                ) : (
                  <Card>
                    <List>
                      {currentCustomers.map((customer) => (
                        <ListItem
                          key={customer.id}
                          className="cursor-default my-2 hover:bg-gray-100 border border-gray-200"
                          onClick={() => navigate(`${customer.id}`)}
                        >
                          <div>
                            <Typography variant="h6" color="blue-gray">
                              {customer.name}
                            </Typography>
                            <Typography
                              variant="small"
                              color="gray"
                              className="font-normal flex justify-between"
                            >
                              <p>{getCustomerType(customer.type)}</p>
                            </Typography>
                            <Typography
                              variant="small"
                              color="gray"
                              className="font-normal flex justify-between"
                            >
                              <p className="mr-28">
                                Registration Date:{" "}
                                {new Date(
                                  customer.registration_date
                                ).toLocaleDateString()}
                              </p>
                            </Typography>

                            {/* Deals summary with consistent colors */}
                            <div className="flex space-x-6 mt-2 font-medium">
                              <span className={dealStatusStyles.open}>
                                Open Deals: {customer.open_deals_count}
                              </span>
                              <span className={dealStatusStyles.claimed}>
                                Claimed Deals: {customer.claimed_deals_count}
                              </span>
                              <span className={dealStatusStyles.closedWon}>
                                Closed Won: {customer.closed_won_deals_count}
                              </span>
                              <span className={dealStatusStyles.closedLost}>
                                Closed Lost: {customer.closed_lost_deals_count}
                              </span>
                            </div>
                          </div>
                        </ListItem>
                      ))}
                    </List>
                  </Card>
                )}
              </div>
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
        path=":customerId/*"
        element={<CustomerProfile back={handleOnBack} />}
      />
      <Route path="add" element={<AddCustomerForm onBack={handleOnBack} />} />
    </Routes>
  );
};

export default CustomersSection;

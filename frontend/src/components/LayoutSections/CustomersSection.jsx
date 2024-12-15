import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
} from "@material-tailwind/react";
import AddCustomerForm from "../Forms/AddCustomerForm";
import CustomerProfile from "./CustomerProfile"; // Assuming you have this component
import Pagination from "../Pagination";

const generateDummyData = () => {
  const dummyCustomers = [];
  const CustomersNames = [
    "Deal Alpha",
    "Deal Beta",
    "Deal Gamma",
    "Deal Delta",
  ];
  for (let i = 1; i <= 50; i++) {
    const numberOfDeals = Math.floor(Math.random() * 1000 + 100);
    const numberOfSuccessfulDeals = Math.floor(Math.random() * numberOfDeals);
    const numberOfUnsuccessfulDeals = numberOfDeals - numberOfSuccessfulDeals;

    const Customer = {
      id: i,

      name: CustomersNames[i % CustomersNames.length],

      email: `customer${i}@company.com`,

      phone: `555-01${i.toString().padStart(2, "0")}`,

      numberOfDeals,

      dateRegistered: new Date(2024, 10, (i % 30) + 1)
        .toISOString()
        .slice(0, 10),

      numberOfSuccessfulDeals,

      numberOfUnsuccessfulDeals,

      percentageOfSuccessfulDeals: Math.floor(
        (numberOfSuccessfulDeals / numberOfDeals) * 100
      ),

      leadSource: i % 2 === 0 ? "Cold Call" : "Referral",

      address: `123 Main St, Springfield, IL ${i.toString().padStart(2, "0")}`,

      preferredContactMethod: i % 2 === 0 ? "Email" : "Phone",
    };

    dummyCustomers.push(Customer);
  }
  return dummyCustomers;
};

const dummyData = generateDummyData();

function CustomersSection() {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState("date register");
  const [dealsType, setDealsType] = useState("all deals");
  const [sortOrder, setSortOrder] = useState("asc");
  const CustomersPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting logic
  const sortedCustomers = [...dummyData].sort((a, b) => {
    if (sortField === "Number of Deals") {
      let dealType = "";

      if (dealsType === "successful") {
        dealType = "Successful";
      } else if (dealsType === "unsuccessful") {
        dealType = "Unsuccessful";
      }

      const aDeals = a[`numberOf${dealType}Deals`];
      const bDeals = b[`numberOf${dealType}Deals`];

      return sortOrder === "asc" ? aDeals - bDeals : bDeals - aDeals;
    } else {
      const aDate = new Date(a.dateRegistered);
      const bDate = new Date(b.dateRegistered);

      return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
    }
  });

  // Pagination logic
  const indexOfLastCustomer = currentPage * CustomersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - CustomersPerPage;
  const currentCustomers = sortedCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );
  const totalPages = Math.ceil(sortedCustomers.length / CustomersPerPage);

  const DealOpener = true;

  const handleAddCustomer = (formData) => {
    // send the formData to your backend
    console.log("New Employee Data:", Object.fromEntries(formData));
    navigate('/customers');
  };

  return (
    <Routes>
      {/* Main Customers List Route */}
      <Route 
        path="/" 
        element={
          <section className="bg-white p-6 shadow-md h-screen flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold mb-4">Customers</h1>
              {DealOpener && (
                <button
                  onClick={() => navigate('add')}
                  className="flex items-center px-4 border rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  <i className="fas fa-plus text-xl mr-2 pb-[3px]"></i>
                  <span className="text-lg">Add Customer</span>
                </button>
              )}
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex justify-between mb-4">
              <div className="flex space-x-4">
                {/* Sort */}
                <select
                  onChange={(e) => setSortField(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="dateRegistered">Date Registered</option>
                  <option value="Number of Deals">Number of Deals</option>
                </select>
                <select
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
                {sortField === "Number of Deals" && (
                  <select
                    onChange={(e) => setDealsType(e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="all">All Deals</option>
                    <option value="successful">Successful Deals</option>
                    <option value="unsuccessful">Unsuccessful Deals</option>
                  </select>
                )}
              </div>
            </div>

            {/* Customers Table */}
            <div className="flex-grow overflow-y-auto">
              <Card>
                <List>
                  {currentCustomers.map((customer) => (
                    <ListItem
                      key={customer.id}
                      className="cursor-pointer my-4 hover:bg-gray-100"
                      onClick={() => navigate(`${customer.id}`)}
                    >
                      <div>
                        <Typography variant="h6" color="blue-gray">
                          {customer.name}
                        </Typography>
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-normal"
                        >
                          {customer.email}
                        </Typography>
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-normal flex justify-between"
                        >
                          <p>ID: {customer.id} </p>
                          <p>Date Registered: {customer.dateRegistered}</p>
                        </Typography>
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-normal flex justify-between "
                        >
                          <p className="mr-28 ">
                            Number of Deals: {customer.numberOfDeals}{" "}
                          </p>
                          <p>
                            SuccessRate: {customer.percentageOfSuccessfulDeals}%
                          </p>
                        </Typography>
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-normal flex justify-between"
                        >
                          <p>
                            Number of Successful Deals:{" "}
                            {customer.numberOfSuccessfulDeals}
                          </p>
                        </Typography>
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-normal flex justify-between"
                        >
                          <p>
                            Number of Unsuccessful Deals:{" "}
                            {customer.numberOfUnsuccessfulDeals}
                          </p>
                        </Typography>
                      </div>
                    </ListItem>
                  ))}
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

      {/* Add Customer Form Route */}
      <Route 
        path="/add" 
        element={
          <AddCustomerForm 
            onBack={() => navigate('/home/customers')}
          />
        } 
      />

      {/* Individual Customer Profile Route */}
      <Route 
        path="/:customerId" 
        element={
          <CustomerProfile 
            back={() => navigate('/home/customers')}
          />
        } 
      />
    </Routes>
  );
}

export default CustomersSection;
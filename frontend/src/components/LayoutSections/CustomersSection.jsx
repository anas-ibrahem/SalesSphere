import React, { useEffect, useState } from "react";
// TODO: Import the CustomerProfile component
//import CustomerProfile from "./CustomerProfile";
import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
} from "@material-tailwind/react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [sortField, setSortField] = useState("date register");
  const [dealsType, setDealsType] = useState("all deals");
  const [sortOrder, setSortOrder] = useState("asc");
  const CustomersPerPage = 10;

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

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      {currentCustomer ? (
        <CustomerProfile
          back={() => setCurrentCustomer(null)}
          customer={currentCustomer}
        />
      ) : (
        <section className="bg-white p-6 shadow-md h-screen flex flex-col">
          <h1 className="text-2xl font-bold mb-4">Customers</h1>

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
                <>
                  <select
                    onChange={(e) => setDealsType(e.target.value)}
                    className="p-2 border rounded "
                  >
                    <option value="all">All Deals</option>
                    <option value="successful">Successful Deals</option>
                    <option value="unsuccessful">Unsuccessful Deals</option>
                  </select>
                </>
              )}
            </div>
          </div>

          {/* Customers Table */}
          <div className="flex-grow overflow-y-auto">
            <Card>
              <List>
                {currentCustomers.map((customer) => (
                  <React.Fragment key={customer.id}>
                    <ListItem
                      className="cursor-default my-4 hover:bg-gray-100"
                      onClick={() => setCurrentCustomer(customer)}
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
                          className="font-normal"
                        >
                          Id: {customer.id}{" "}
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          Date Registered: {customer.dateRegistered}
                        </Typography>
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-normal"
                        >
                          Number of Deals: {customer.numberOfDeals}{" "}
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success
                          Rate:
                          {customer.percentageOfSuccessfulDeals}%
                        </Typography>
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-normal"
                        >
                          Number of Successful Deals:{" "}
                          {customer.numberOfSuccessfulDeals}{" "}
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Number
                          of Unsuccessful Deals:{" "}
                          {customer.numberOfUnsuccessfulDeals}
                        </Typography>
                      </div>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </Card>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`px-4 py-2 border rounded ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <div className="flex space-x-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white hover:bg-blue-100"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className={`px-4 py-2 border rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </section>
      )}
    </>
  );
}

export default CustomersSection;

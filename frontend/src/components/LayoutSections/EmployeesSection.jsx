import React, { useEffect, useState } from "react";
import EmployeeProfile from "./EmployeeProfile";
import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
} from "@material-tailwind/react";

const generateDummyData = () => {
  const dummyEmployees = [];
  const employeesNames = [
    "Deal Alpha",
    "Deal Beta",
    "Deal Gamma",
    "Deal Delta",
  ];

  for (let i = 1; i <= 50; i++) {
    const numberOfDeals = Math.floor(Math.random() * 1000 + 100);
    const numberOfDealsThisMonth = Math.floor(Math.random() * numberOfDeals);
    const numberOfSuccessfulDeals = Math.floor(Math.random() * numberOfDeals);
    const numberOfSuccessfulDealsThisMonth = Math.floor(
      Math.random() * numberOfDealsThisMonth
    );

    const numberOfUnsuccessfulDeals = numberOfDeals - numberOfSuccessfulDeals;

    const numberOfUnsuccessfulDealsThisMonth =
      numberOfDealsThisMonth - numberOfSuccessfulDealsThisMonth;

    const employee = {
      id: i,

      name: employeesNames[i % employeesNames.length],

      email: `employee${i}@company.com`,

      phone: `555-01${i.toString().padStart(2, "0")}`,

      numberOfDeals,

      numberOfDealsThisMonth,

      accountCreationDate: new Date(2024, 10, (i % 30) + 1)
        .toISOString()
        .slice(0, 10),
      type: i % 2 === 0 ? "opener" : "closer",

      numberOfSuccessfulDeals,

      numberOfSuccessfulDealsThisMonth,

      numberOfUnsuccessfulDeals,

      numberOfUnsuccessfulDealsThisMonth,

      percentageOfSuccessfulDeals: Math.floor(
        (numberOfSuccessfulDeals / numberOfDeals) * 100
      ),

      percentageOfSuccessfulDealsThisMonth: Math.floor(
        (numberOfSuccessfulDealsThisMonth / numberOfDealsThisMonth) * 100
      ),

      profilePicture: `https://randomuser.me/api/portraits/men/${i % 100}.jpg`,
    };

    dummyEmployees.push(employee);
  }
  return dummyEmployees;
};

const dummyData = generateDummyData();

function EmployeesSection() {
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [sortField, setSortField] = useState("account_creation_date");
  const [duration, setDuration] = useState("all times");
  const [dealsType, setDealsType] = useState("all deals");
  const [sortOrder, setSortOrder] = useState("asc");
  const EmployeesPerPage = 10;

  // Filtering logic
  const filterEmployees = dummyData.filter((employee) => {
    return filterType === "All" || employee.type === filterType;
  });

  // Sorting logic
  const sortedEmployees = [...filterEmployees].sort((a, b) => {
    if (sortField === "Number of Deals") {
      let dealDuration = "";
      let dealType = "";

      if (duration !== "all times") {
        dealDuration = "ThisMonth";
      }

      if (dealsType === "successful") {
        dealType = "Successful";
      } else if (dealsType === "unsuccessful") {
        dealType = "Unsuccessful";
      }

      const aDeals = a[`numberOf${dealType}Deals${dealDuration}`];
      const bDeals = b[`numberOf${dealType}Deals${dealDuration}`];

      return sortOrder === "asc" ? aDeals - bDeals : bDeals - aDeals;
    } else {
      const aDate = new Date(a.accountCreationDate);
      const bDate = new Date(b.accountCreationDate);

      return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
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

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      {currentEmployee ? (
        <EmployeeProfile
          back={() => setCurrentEmployee(null)}
          employee={currentEmployee}
        />
      ) : (
        <section className="bg-white p-6 shadow-md h-screen flex flex-col">
          <h1 className="text-2xl font-bold mb-4">Employees</h1>

          {/* Filter and Sort Controls */}
          <div className="flex justify-between mb-4">
            {/* Filter */}
            <div className="flex space-x-4">
              <select
                onChange={(e) => setFilterType(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="All">All Types</option>
                <option value="opener">Opener</option>
                <option value="closer">Executor</option>
              </select>

              {/* Sort */}
              <select
                onChange={(e) => setSortField(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="accountCreationDate">
                  Account Creation Date
                </option>
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
                  <select
                    onChange={(e) => setDuration(e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="all times">All Times</option>
                    <option value="this month">This Month</option>
                  </select>
                </>
              )}
            </div>
          </div>

          {/* Employees Table */}
          <div className="flex-grow overflow-y-auto">
            <Card>
              <List>
                {currentEmployees.map((employee) => (
                  <React.Fragment key={employee.id}>
                    <ListItem
                      className="cursor-default my-4 hover:bg-gray-100"
                      onClick={() => setCurrentEmployee(employee)}
                    >
                      <ListItemPrefix>
                        <Avatar
                          variant="circular"
                          alt={`${employee.name}'s profile`}
                          src={employee.profilePicture}
                          className="w-20 h-20 "
                        />
                      </ListItemPrefix>
                      <div>
                        <Typography variant="h6" color="blue-gray">
                          {employee.name}
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
                          className="font-normal"
                        >
                          Id: {employee.id} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          {employee.type}
                        </Typography>
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-normal"
                        >
                          Number of Deals: {employee.numberOfDeals}{" "}
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success Rate:
                          {employee.percentageOfSuccessfulDeals}%
                        </Typography>
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-normal"
                        >
                          Number of Successful Deals:{" "}
                          {employee.numberOfSuccessfulDeals}{" "}
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Number
                          of Unsuccessful Deals:{" "}
                          {employee.numberOfUnsuccessfulDeals}
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

export default EmployeesSection;

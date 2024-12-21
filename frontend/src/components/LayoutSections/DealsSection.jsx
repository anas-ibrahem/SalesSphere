import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import DealDetails from "./DealsDetails";
import OpenDealForm from "../Forms/OpenDealForm";
import { List, ListItem, Card, Typography } from "@material-tailwind/react";
import Pagination from "../Pagination";
import fetchAPI from "../../utils/fetchAPI";
import { DealStatus, EmployeeRoles } from "../../utils/Enums";
import { useContext } from "react";
import UserContext from "../../context/UserContext";

function DealsSection() {
  const [reload, setReload] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("due_date");
  const [DealsData, setDealsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { employee: me } = useContext(UserContext);

  const statusTabs = [
    { value: "all", label: "All", color: "bg-gray-500" },
    { value: "Open", label: "Open", color: "bg-blue-500" },
    { value: "Claimed", label: "Claimed", color: "bg-yellow-500" },
    { value: "Closed Won", label: "Closed Won", color: "bg-green-500" },
    { value: "Closed Lost", label: "Closed Lost", color: "bg-red-500" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchAPI("/deal", "GET", null, token)
      .then((data) => {
        setDealsData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [reload]);

  const filteredAndSortedDeals = DealsData.filter((deal) => {
    const matchesStatus =
      filterStatus === "all" || DealStatus[deal.status] === filterStatus;
    const matchesSearch = deal.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "due_date") {
      return (
        (sortOrder === "asc" ? 1 : -1) *
        (new Date(a.due_date) - new Date(b.due_date))
      );
    }
    if (sortBy === "expenses") {
      return (sortOrder === "asc" ? 1 : -1) * (a.expenses - b.expenses);
    }
    return 0;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  const totalPages = Math.ceil(filteredAndSortedDeals.length / itemsPerPage);
  const indexOfLastDeal = currentPage * itemsPerPage;
  const indexOfFirstDeal = indexOfLastDeal - itemsPerPage;
  const currentDeals = filteredAndSortedDeals.slice(
    indexOfFirstDeal,
    indexOfLastDeal
  );

  function handleOnBack() {
    setSearchQuery("");
    setSortBy("due_date");
    setSortOrder("asc");
    setCurrentPage(1);
    setFilterStatus("all");
    setReload(!reload);
    navigate(-1);
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "text-blue-500";
      case "Claimed":
        return "text-yellow-500";
      case "Closed Won":
        return "text-green-500";
      case "Closed Lost":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <section className="bg-white p-6 shadow-md h-screen flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold mb-4">
                {me.role !== EmployeeRoles.Manager && <span>Your </span>}
                {me.role === EmployeeRoles.Manager && <span>Business' </span>}
                Deals
              </h1>
              {me.role === EmployeeRoles.DealOpener && (
                <button
                  onClick={() => navigate("add")}
                  className="flex items-center px-4 py-2 border rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  <i className="fas fa-plus text-xl mr-2"></i>
                  <span className="text-lg">Open Deal</span>
                </button>
              )}
            </div>

            {/* Status Tabs */}
            <div className="flex space-x-1 mb-4">
              {statusTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilterStatus(tab.value)}
                  className={`px-4 py-2 rounded-t-lg font-medium transition-colors duration-200 ${
                    filterStatus === tab.value
                      ? `${tab.color} text-white`
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm">
                    {
                      DealsData.filter(
                        (deal) =>
                          tab.value === "all" ||
                          DealStatus[deal.status] === tab.value
                      ).length
                    }
                  </span>
                </button>
              ))}
            </div>

            {/* Search and Sort */}
            <div className="flex justify-between mb-4">
              <div className="flex space-x-4 items-center">
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="p-2 border rounded w-64"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="due_date">Sort by Date</option>
                  <option value="expenses">Sort by Expenses</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>

            {/* Deals List */}
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
                  ) : currentDeals.length === 0 ? (
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="text-center py-4"
                    >
                      No deals found
                    </Typography>
                  ) : (
                    currentDeals.map((deal) => (
                      <ListItem
                        key={deal.id}
                        className="cursor-pointer my-2 hover:bg-gray-100 border border-gray-200"
                        onClick={() => navigate(`${deal.id}`)}
                      >
                        <div className="w-full">
                          <Typography variant="h6" color="blue-gray">
                            {deal.title}
                          </Typography>
                          <Typography
                            variant="small"
                            className={`font-medium flex justify-between ${getStatusColor(
                              DealStatus[deal.status]
                            )}`}
                          >
                            <p>Status: {DealStatus[deal.status]}</p>
                            <p>
                              Due Date:{" "}
                              {new Date(deal.due_date).toLocaleDateString()}
                            </p>
                          </Typography>
                          <Typography
                            variant="small"
                            color="gray"
                            className="font-normal flex justify-between"
                          >
                            <p>Expenses: ${deal.expenses}</p>
                            <p>
                              Created On:{" "}
                              {new Date(deal.date_opened).toLocaleDateString()}
                            </p>
                          </Typography>
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

      <Route path=":dealId/*" element={<DealDetails onBack={handleOnBack} />} />
      <Route path="add" element={<OpenDealForm onBack={handleOnBack} />} />
    </Routes>
  );
}

export default DealsSection;

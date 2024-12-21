import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { List, ListItem, Card, Typography } from "@material-tailwind/react";
import { BarChart2, DollarSign, UserPlus, FolderPlus } from "lucide-react";
import Pagination from "../Pagination";
import fetchAPI from "../../utils/fetchAPI";
import { EmployeeRoles, TargetTypes } from "../../utils/Enums";
import { useContext } from "react";
import UserContext from "../../context/UserContext";
import AddTarget from "../Forms/AddTarget";

const ProgressBar = ({ progress, color = "blue" }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
    <div
      className={`bg-${color}-600 h-2.5 rounded-full`}
      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
    />
  </div>
);

function TargetsSection() {
  const [reload, setReload] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("deadline");
  const [targetsData, setTargetsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { employee: me } = useContext(UserContext);

  const typeTabs = [
    {
      value: "all",
      label: "All Targets",
      color: "bg-gray-500",
      icon: BarChart2,
    },
    { value: "0", label: "Open Deals", color: "bg-blue-500", icon: FolderPlus },
    {
      value: "1",
      label: "Close Deals",
      color: "bg-green-500",
      icon: BarChart2,
    },
    {
      value: "2",
      label: "Add Customers",
      color: "bg-yellow-500",
      icon: UserPlus,
    },
    { value: "3", label: "Revenue", color: "bg-purple-500", icon: DollarSign },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchAPI("/target", "GET", null, token)
      .then((data) => {
        setTargetsData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [reload]);

  const filteredAndSortedTargets = targetsData
    .filter((target) => {
      const matchesType =
        filterType === "all" || target.type.toString() === filterType;
      const matchesSearch = target.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    })
    .sort((a, b) => {
      const sortMultiplier = sortOrder === "asc" ? 1 : -1;

      switch (sortBy) {
        case "deadline":
          return sortMultiplier * (new Date(a.deadline) - new Date(b.deadline));
        case "progress":
          return sortMultiplier * (a.avg_progress - b.avg_progress);
        case "start_date":
          return (
            sortMultiplier * (new Date(a.start_date) - new Date(b.start_date))
          );
        default:
          return 0;
      }
    });
  console.log(filteredAndSortedTargets);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType]);

  const totalPages = Math.ceil(filteredAndSortedTargets.length / itemsPerPage);
  const indexOfLastTarget = currentPage * itemsPerPage;
  const indexOfFirstTarget = indexOfLastTarget - itemsPerPage;
  const currentTargets = filteredAndSortedTargets.slice(
    indexOfFirstTarget,
    indexOfLastTarget
  );

  const getTargetTypeName = (type) => {
    switch (type) {
      case TargetTypes.OpenDeals:
        return "Open Deals";
      case TargetTypes.CloseDeals:
        return "Close Deals";
      case TargetTypes.AddCustomers:
        return "Add Customers";
      case TargetTypes.Revenue:
        return "Revenue";
      default:
        return "Unknown Type";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case TargetTypes.OpenDeals:
        return "text-blue-500";
      case TargetTypes.CloseDeals:
        return "text-green-500";
      case TargetTypes.AddCustomers:
        return "text-yellow-500";
      case TargetTypes.Revenue:
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  function handleOnBack() {
    setSearchQuery("");
    setSortOrder("asc");
    setFilterType("all");
    setCurrentPage(1);
    setReload(!reload);
    navigate("/home/targets");
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <section className="bg-white p-6 shadow-md h-screen flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold mb-4">Business' Targets</h1>
              {me.role === EmployeeRoles.Manager && (
                <button
                  onClick={() => navigate("addTarget")}
                  className="flex items-center px-4 py-2 border rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  <i className="fas fa-plus text-xl mr-2"></i>
                  <span className="text-lg">Add Target</span>
                </button>
              )}
            </div>

            {/* Type Tabs */}
            <div className="flex space-x-1 mb-4">
              {typeTabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setFilterType(tab.value)}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-colors duration-200 flex items-center gap-2 ${
                      filterType === tab.value
                        ? `${tab.color} text-white`
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                    <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm">
                      {
                        targetsData.filter(
                          (target) =>
                            tab.value === "all" ||
                            target.type.toString() === tab.value
                        ).length
                      }
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search and Sort */}
            <div className="flex justify-between mb-4">
              <div className="flex space-x-4 items-center">
                <input
                  type="text"
                  placeholder="Search targets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="p-2 border rounded w-64"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="deadline">Sort by Deadline</option>
                  <option value="progress">Sort by Progress</option>
                  <option value="start_date">Sort by Start Date</option>
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

            {/* Targets List */}
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
                  ) : currentTargets.length === 0 ? (
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="text-center py-4"
                    >
                      No targets found
                    </Typography>
                  ) : (
                    currentTargets.map((target, index) => {
                      const daysRemaining = getDaysRemaining(target.deadline);
                      const isOverdue = daysRemaining < 0;

                      return (
                        <ListItem
                          key={index}
                          className="cursor-pointer my-2 hover:bg-gray-100 border border-gray-200"
                        >
                          <div className="w-full">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <Typography variant="h6" color="blue-gray">
                                  {target.description}
                                </Typography>
                                <span
                                  className={`text-sm font-medium ${getTypeColor(
                                    target.type
                                  )}`}
                                >
                                  ({getTargetTypeName(target.type)})
                                </span>
                              </div>
                              <span
                                className={`text-sm font-medium ${
                                  isOverdue ? "text-red-500" : "text-gray-500"
                                }`}
                              >
                                {isOverdue
                                  ? `Overdue by ${Math.abs(daysRemaining)} days`
                                  : `${daysRemaining} days remaining`}
                              </span>
                            </div>

                            <ProgressBar
                              progress={target.avg_progress}
                              color={getTypeColor(target.type).split("-")[1]}
                            />

                            <div className="flex justify-between mt-2">
                              <Typography
                                variant="small"
                                className="font-medium"
                              >
                                Progress: {target.avg_progress}% of{" "}
                                {target.goal}{" "}
                                {target.type === TargetTypes.Revenue && "$"}
                              </Typography>
                              <Typography
                                variant="small"
                                color="gray"
                                className="font-normal"
                              >
                                {14}
                                Assignees
                                {/* TODO REMOVE HARDCODED WITH LENGTH */}
                              </Typography>
                            </div>

                            <Typography
                              variant="small"
                              color="gray"
                              className="font-normal flex justify-between mt-1"
                            >
                              <span>
                                Start:{" "}
                                {new Date(
                                  target.start_date
                                ).toLocaleDateString()}
                              </span>
                              <span>
                                Deadline:{" "}
                                {new Date(target.deadline).toLocaleDateString()}
                              </span>
                            </Typography>
                          </div>
                        </ListItem>
                      );
                    })
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
      <Route path="addTarget" element={<AddTarget onBack={handleOnBack} />} />
    </Routes>
  );
}

export default TargetsSection;

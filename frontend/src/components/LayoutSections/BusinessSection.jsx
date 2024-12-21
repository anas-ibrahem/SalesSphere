import React, { useState, useEffect, useContext } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import fetchAPI from "../../utils/fetchAPI";
import UserContext from "../../context/UserContext";
import {
  BriefcaseBusiness,
  TrendingUp,
  BarChart2,
  Pencil,
  TrendingDown,
  Users,
} from "lucide-react";
import { use } from "react";

const BusinessSection = function () {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [businessManager, setBusinessManager] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { employee: manager } = useContext(UserContext);

  const totalIncome = 5000; // TODO: Fetch from API
  const totalExpenses = 2000; // TODO: Fetch from API
  const totalOpenerEmployees = 50; // TODO: Fetch from API
  const totalExecutorEmployees = 30; // TODO: Fetch from API

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const businessData = await fetchAPI(
          `/business/${manager.business_id}`,
          "GET",
          null,
          token
        );
        setBusiness(businessData);
        console.log(businessData);
      } catch (error) {
        console.error("Error fetching business data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinessData();
  }, [manager.business_id, token]);

  const handleEditClick = () => {
    navigate("/home/settings/");
  };

  if (loading) {
    return <p className="m-8">Loading...</p>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          // Business Section
          <section className="bg-white m-0 rounded shadow-xl w-full h-screen flex flex-col overflow-hidden">
            <div className="relative h-[120px] bg-gradient-to-r from-cyan-500 to-blue-500 flex-shrink-0">
              <button
                onClick={handleEditClick}
                className="absolute top-6 right-6 inline-flex w-auto cursor-pointer 
              select-none appearance-none items-center 
              justify-center space-x-1 rounded border border-gray-200
              bg-white px-3 py-2 text-sm font-medium text-gray-800 transition 
              hover:border-gray-300 active:bg-white hover:bg-gray-100"
              >
                <Pencil className="w-4 h-4 mr-1" /> Edit
              </button>
              <div className="absolute bottom-[-45px] left-5 h-[90px] w-[90px] shadow-md rounded-full border-4 overflow-hidden border-white">
                <img
                  src={business.business_logo_url}
                  alt={`${business.name} logo`}
                  className="w-full h-full rounded-full object-center object-cover"
                />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto px-5 py-2 mt-12">
              <div className="flex flex-col gap-3 pb-6">
                <div>
                  <h3 className="text-xl text-slate-900 relative font-bold leading-6">
                    {business.name}
                  </h3>
                  <p className="text-sm text-gray-600">{business.email}</p>
                </div>

                {/* business Information Section */}
                <div className="mt-4">
                  <h4 className="text-md font-medium flex items-center gap-2">
                    <BriefcaseBusiness className="w-5 h-5 text-green-600" />{" "}
                    Business Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Industry</p>
                      <p className="text-lg font-semibold">
                        {business.industry || "N/A"}
                      </p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="text-lg font-semibold">
                        {business.phone_number || "N/A"}
                      </p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Registration Date</p>
                      <p className="text-lg font-semibold">
                        {business.registration_date
                          ? new Date(
                              business.registration_date
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-lg font-semibold">
                        {`${business.street}, ${business.city}, ${business.country}` ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/*  Employees Information */}
                <div className="mt-4">
                  <h4 className="text-md font-medium flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" /> Employees
                    Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">
                        Number Of Employees
                      </p>
                      <p className="text-lg font-bold">
                        {totalOpenerEmployees + totalExecutorEmployees}
                      </p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">
                        Number Of Opener Employees
                      </p>
                      <p className="text-lg font-bold">
                        {totalOpenerEmployees}
                      </p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">
                        Number Of Executor Employees
                      </p>
                      <p className="text-lg font-bold">
                        {totalExecutorEmployees}
                      </p>
                    </div>
                  </div>
                </div>

                {/*  Customers Information */}
                <div className="mt-4">
                  <h4 className="text-md font-medium flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" /> Customers
                    Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">
                        Number Of Customers
                      </p>
                      <p className="text-lg font-bold">{}</p>
                    </div>
                  </div>
                </div>

                {/* Deals Summary Section */}
                <div className="mt-4">
                  <h4 className="text-md font-medium flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-purple-600" /> Business
                    Deals
                  </h4>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Open Deals</p>
                      <p className="text-lg font-bold text-yellow-600">{}</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Claimed Deals</p>
                      <p className="text-lg font-bold text-blue-600">{}</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Closed Won Deals</p>
                      <p className="text-lg font-bold text-green-600">{}</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Closed Lost Deals</p>
                      <p className="text-lg font-bold text-red-600">{}</p>
                    </div>
                  </div>
                </div>

                {/* Business Financial Summery Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <h4 className="text-md font-medium mb-4">
                    Financial Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                        <span className="font-medium text-green-600">
                          Total Income
                        </span>
                      </div>
                      <p className="text-md font-bold text-green-600">
                        +${totalIncome.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
                        <span className="font-medium text-red-600">
                          Total Expenses
                        </span>
                      </div>
                      <p className="text-md font-bold text-red-600">
                        -${(-totalExpenses).toLocaleString()}
                      </p>
                    </div>
                    <div
                      className={`p-4 rounded-lg ${
                        totalIncome + totalExpenses > 0
                          ? "bg-green-50"
                          : totalIncome + totalExpenses < 0
                          ? "bg-red-50"
                          : "bg-gray-50"
                      } col-span-2`}
                    >
                      <div className="flex items-center mb-2">
                        {totalIncome + totalExpenses > 0 ? (
                          <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                        ) : totalIncome + totalExpenses < 0 ? (
                          <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
                        ) : (
                          <Minus className="w-5 h-5 text-gray-600 mr-2" />
                        )}
                        <span
                          className={`font-medium ${
                            totalIncome + totalExpenses > 0
                              ? "text-green-600"
                              : totalIncome + totalExpenses < 0
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          Net Balance
                        </span>
                      </div>
                      <p
                        className={`text-md font-bold ${
                          totalIncome + totalExpenses > 0
                            ? "text-green-600"
                            : totalIncome + totalExpenses < 0
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {totalIncome + totalExpenses > 0
                          ? `+$${(
                              totalIncome + totalExpenses
                            ).toLocaleString()}`
                          : totalIncome + totalExpenses < 0
                          ? `-$${(-(
                              totalIncome + totalExpenses
                            )).toLocaleString()}`
                          : `$${(
                              totalIncome + totalExpenses
                            ).toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        }
      />
    </Routes>
  );
};

export default BusinessSection;

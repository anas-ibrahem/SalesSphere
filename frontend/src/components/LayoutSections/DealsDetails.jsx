import React, { useState } from "react";
import { ArrowLeft, User } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import fetchAPI from "../../utils/fetchAPI";
import ProfileModal from "./ProfileModal";
import { DealStatus } from "../../utils/Enums";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import EmployeeProfile from "./EmployeeProfile";
import CustomerProfile from "./CustomerProfile";
import { toast } from "react-hot-toast";

// Modified Deal Details Component
function DealDetails({ onBack = () => {} }) {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const { dealId } = useParams();
  const [deal, setDeal] = useState({});
  const token = localStorage.getItem("token");
  const [dealStatus, setDealStatus] = useState(0);
  const [closingDealStatus, setClosingDealStatus] = useState(2);

  const navigate = useNavigate();

  const executer = true; // TODO - Replace with actual user role
  const opener = true; // TODO - Replace with actual user role

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchAPI(`/deal/${dealId}`, "GET", null, token)
      .then((data) => {
        setDeal(data);
        setDealStatus(data.status);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching deal details:", error);
      });
  }, [dealId, dealStatus]);

  // Safely extract deal properties with default values
  const {
    title = "Untitled Deal",
    status = 0,
    description = "No description available",
    account_manager = "Unassigned",
    probability_of_close = "N/A",
    next_steps = "No next steps",
    date_opened = new Date(),
    due_date = new Date(),
    expenses = 0,
    customer_budget = 0,
    customer = null,
    deal_executor = null,
    deal_opener = null,
    id = dealId,
  } = deal;

  function handelClaimDeal() {
    fetchAPI(`/deal/claim`, "POST", { id }, token)
      .then((data) => {
        setDealStatus(1);
        toast.success("Deal claimed successfully");
        console.log(data);
      })
      .catch((error) => {
        console.error("Error claiming deal:", error);
      });
  }

  function handelCloseDeal() {
    fetchAPI(`/deal/close`, "POST", { id, status: closingDealStatus }, token)
      .then((data) => {
        setDealStatus(closingDealStatus);
        toast.success("Deal closed successfully");
        console.log(data);
      })
      .catch((error) => {
        console.error("Error closing deal:", error);
      });
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="p-4">
            {selectedProfile && (
              <ProfileModal
                profile={selectedProfile}
                onClose={() => setSelectedProfile(null)}
              />
            )}
            <button
              onClick={onBack}
              className="flex items-center px-4 border rounded bg-blue-500 text-white hover:bg-blue-600 mb-16"
            >
              Back to Deals List
            </button>
            <h1 className="text-2xl font-bold mb-3">{title}</h1>
            <div className="flex space-x-2 justify-end mb-4">
              {executer && deal.status === 0 && (
                <button
                  onClick={() => handelClaimDeal()}
                  className="flex items-center px-4 border rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  <span className="text-lg">Claim Deal</span>
                </button>
              )}
              {(executer && deal.status === 1) ||
                (opener && deal.status === 0 && (
                  <>
                    <button
                      onClick={() => navigate("")}
                      className="flex items-center px-4 border rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                      <span className="text-lg">Edit Deal</span>
                    </button>
                  </>
                ))}
              {executer && deal.status === 1 && (
                <>
                  <select
                    className="flex items-center px-4 border rounded"
                    onChange={(e) => setClosingDealStatus(e.target.value)}
                  >
                    <option value={2}>Closed Won</option>
                    <option value={3}>Closed Lost</option>
                  </select>

                  <button
                    onClick={() => handelCloseDeal()}
                    className="flex items-center px-4 border rounded bg-blue-500 text-white hover:bg-blue-600"
                  >
                    <span className="text-lg">Close Deal</span>
                  </button>
                </>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Deal Information */}
              <div className="flex flex-col h-full">
                <div className="bg-white border-4 shadow-sm rounded-lg p-4 flex-grow">
                  <h2 className="text-lg font-semibold mb-2">
                    Deal Information
                  </h2>
                  <p>
                    <strong>Status:</strong> {DealStatus[status]}
                  </p>
                  <p>
                    <strong>Description:</strong> {description}
                  </p>
                  <p>
                    <strong>Date Opened:</strong>{" "}
                    {new Date(date_opened).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Due Date:</strong>{" "}
                    {new Date(due_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Financial Details */}
              <div className="flex flex-col h-full">
                <div className="bg-white border-4 shadow-sm rounded-lg p-4 flex-grow">
                  <h2 className="text-lg font-semibold mb-2">
                    Financial Details
                  </h2>
                  <p>
                    <strong>Expenses:</strong> ${expenses.toLocaleString()}
                  </p>
                  <p>
                    <strong>Customer Budget:</strong> $
                    {customer_budget.toLocaleString()}
                  </p>
                  <p>
                    <strong>Total Value:</strong> $
                    {(customer_budget - expenses).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Profiles Section */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Deal Opener Profile */}
                <div
                  onClick={() => navigate(`/home/employees/${deal_opener.id}`)}
                  className="bg-white border-4 shadow-sm rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition flex items-center"
                >
                  <div className="mr-4">
                    {deal_opener?.profile_picture_url ? (
                      <img
                        src={deal_opener.profile_picture_url}
                        alt={
                          deal_opener.first_name + " " + deal_opener.last_name
                        }
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="text-3xl text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">Deal Opener</h3>
                    <p>
                      {deal_opener?.first_name + " " + deal_opener?.last_name}
                    </p>
                  </div>
                </div>

                {/* Deal Executor Profile */}
                {deal.status === 0 ? (
                  <div className="bg-white border-4 shadow-sm rounded-lg p-4 cursor-default hover:bg-gray-50 transition flex items-center justify-center">
                    <h3 className="font-semibold">Not Claimed Yet</h3>
                  </div>
                ) : (
                  <div
                    onClick={() =>
                      navigate(`/home/employees/${deal_executor.id}`)
                    }
                    className="bg-white border-4 shadow-sm rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition flex items-center"
                  >
                    <div className="mr-4">
                      {deal_executor?.profile_picture_url ? (
                        <img
                          src={deal_executor.profile_picture_url}
                          alt={
                            deal_executor.first_name +
                            " " +
                            deal_executor.last_name
                          }
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                          <User className="text-3xl text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">Deal Executor</h3>
                      <p>
                        {deal_executor?.first_name +
                          " " +
                          deal_executor?.last_name}
                      </p>
                    </div>
                  </div>
                )}

                {/* Customer Profile */}
                <div
                  onClick={() => navigate(`/home/customers/${customer.id}`)}
                  className="bg-white border-4 shadow-sm rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition flex items-center"
                >
                  <div className="mr-4">
                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                      <User className="text-3xl text-gray-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Customer</h3>
                    <p>{customer?.name}</p>
                    <p className="text-sm text-gray-600">{}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-grow overflow-y-auto px-4 my-8">
              {executer && deal.status === 1 && (
                <button
                  // onClick={} to be implemented
                  className="flex items-center px-4 border rounded bg-blue-500 text-white my-8 hover:bg-blue-600"
                >
                  <span className="text-lg">Add Financial Record</span>
                </button>
              )}
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Amount</th>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Type</th>
                    <th className="border p-2">Payment Method</th>
                  </tr>
                </thead>
                <tbody>{/* // TODO - Replace with actual records */}</tbody>
              </table>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default DealDetails;

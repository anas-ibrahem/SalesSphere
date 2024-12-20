import React, { useState, useEffect } from "react";
import { ArrowLeft, User, Minus, TrendingUp, TrendingDown } from "lucide-react";
import { useParams } from "react-router-dom";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { DealStatus } from "../../utils/Enums";
import ProfileModal from "./ProfileModal";
import fetchAPI from "../../utils/fetchAPI";
import AddFinancialRecord from "../Forms/AddFinancialRecord";
import { PaymentMethods } from "../../utils/Enums";
import DealCloseModal from "./DealCloseModal";
import { FinancialRecordTypes } from "../../utils/Enums";
function getPaymentMethod(paymentMethod) {
  switch (paymentMethod) {
    case PaymentMethods.Cash:
      return "Cash";
    case PaymentMethods.Card:
      return "Card";
    case PaymentMethods.BankTransfer:
      return "Bank Transfer";
    case PaymentMethods.ElectronicPayment:
      return "Electronic Payment";
    case PaymentMethods.Other:
      return "Other";
    default:
      return "Unknown";
  }
}

function DealDetails({ onBack = () => {} }) {
  const { dealId } = useParams();
  const [deal, setDeal] = useState({});
  const [financialRecords, setFinancialRecords] = useState([]); // Initialize as empty array
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [dealStatus, setDealStatus] = useState(0);
  const [closingDealStatus, setClosingDealStatus] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const executer = true; // TODO - Replace with actual user role
  const opener = true; // TODO - Replace with actual user role
  const {
    title = "Untitled Deal",
    status = 0,
    description = "No description available",
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
      .then(() => {
        setDealStatus(1);
        toast.success("Deal claimed successfully");
      })
      .catch(() => toast.error("Error claiming deal"));
  }

  function handelCloseDeal() {
    setIsCloseModalOpen(false);
    fetchAPI(`/deal/close`, "POST", { id, status: closingDealStatus }, token)
      .then(() => {
        setDealStatus(closingDealStatus);
        toast.success("Deal closed successfully");
      })
      .catch(() => toast.error("Error closing deal"));
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const dealData = await fetchAPI(`/deal/${dealId}`, "GET", null, token);
        setDeal(dealData);
        setDealStatus(dealData.status);

        const financialData = await fetchAPI(
          `/finance/deal/${dealId}`,
          "GET",
          null,
          token
        );
        const summary = await fetchAPI(
          `/finance/deal/summary/${dealId}`,
          "GET",
          null,
          token
        );

        const records = Array.isArray(financialData) ? financialData : [];
        console.log("Records fetched:", records);
        // Sort records by date and time in descending order
        records.sort(
          (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
        );
        setFinancialRecords(records);
        console.log(summary);

        setTotalExpenses(-summary.total_spent || -0);
        setTotalIncome(summary.total_earned || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading deal information");
        setFinancialRecords([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dealId, dealStatus, token]);

  // Format currency with sign
  const formatCurrency = (type, amount) => {
    const absAmount = Math.abs(amount);
    const sign = type === FinancialRecordTypes.Expense ? "-" : "+";
    return `${sign}$${absAmount.toLocaleString()}`;
  };

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderFinancialRecords = () => {
    if (!Array.isArray(financialRecords) || financialRecords.length === 0) {
      return (
        <tr>
          <td
            colSpan="4"
            className="px-6 py-4 text-sm text-gray-500 text-center"
          >
            No financial records found
          </td>
        </tr>
      );
    }

    return financialRecords.map((record, index) => (
      <React.Fragment key={index}>
        <tr
          className="hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => handleExpand(record.id)}
        >
          <td className="px-6 py-4 text-sm">
            <span
              className={
                record.type === FinancialRecordTypes.Income
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {formatCurrency(record.type, record.amount)}
            </span>
          </td>
          <td className="px-6 py-4 text-sm text-gray-500">
            {new Date(record.transaction_date).toLocaleString()}
          </td>
          <td className="px-6 py-4 text-sm">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                record.type === FinancialRecordTypes.Income
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {record.type === FinancialRecordTypes.Income
                ? "Income"
                : "Expense"}
            </span>
          </td>
          <td className="px-6 py-4 text-sm text-gray-500 capitalize">
            {getPaymentMethod(record.payment_method)}
          </td>
        </tr>
        {expandedId === record.id && (
          <tr className="bg-gray-50">
            <td colSpan="4" className="px-6 py-4">
              <div className="text-sm text-gray-700">
                <strong className="font-medium">Description:</strong>
                <p className="mt-1">{record.description}</p>
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    ));
  };

  // Update Financial Summary Card JSX
  const renderFinancialSummary = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            <span className="font-medium text-green-600">Total Income</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            +${totalIncome.toLocaleString()}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
            <span className="font-medium text-red-600">Total Expenses</span>
          </div>
          <p className="text-2xl font-bold text-red-600">
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
            className={`text-2xl font-bold ${
              totalIncome + totalExpenses > 0
                ? "text-green-600"
                : totalIncome + totalExpenses < 0
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {totalIncome + totalExpenses > 0
              ? `+$${(totalIncome + totalExpenses).toLocaleString()}`
              : totalIncome + totalExpenses < 0
              ? `-$${(-(totalIncome + totalExpenses)).toLocaleString()}`
              : `$${(totalIncome + totalExpenses).toLocaleString()}`}
          </p>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading deal information...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="p-6 max-w-7xl mx-auto">
            <DealCloseModal
              isOpen={isCloseModalOpen}
              onClose={() => setIsCloseModalOpen(false)}
              onConfirm={handelCloseDeal}
              dealStatus={closingDealStatus}
            />

            {/* Header Section */}
            <div className="flex justify-between items-center mb-1">
              <button
                type="button"
                onClick={onBack}
                className="text-blue-500 text-lg cursor-pointer flex items-center mb-5"
              >
                <ArrowLeft className="mr-2" /> Back
              </button>

              <div className="flex space-x-3">
                {executer && deal.status === 0 && (
                  <button
                    onClick={handelClaimDeal}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Claim Deal
                  </button>
                )}

                {executer && deal.status === 1 && (
                  <div className="flex space-x-2">
                    <select
                      className="px-4 py-2 border rounded"
                      onChange={(e) =>
                        setClosingDealStatus(Number(e.target.value))
                      }
                      value={closingDealStatus}
                    >
                      <option value={2}>Closed Won</option>
                      <option value={3}>Closed Lost</option>
                    </select>
                    <button
                      onClick={() => setIsCloseModalOpen(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Close Deal
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Title and Status */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{title}</h1>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {DealStatus[status]}
              </span>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Deal Information Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Deal Information</h2>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <span className="font-medium">Description:</span>{" "}
                    {description}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Opened:</span>{" "}
                    {new Date(date_opened).toLocaleString()}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Due Date:</span>{" "}
                    {new Date(due_date).toLocaleString()}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Customer Budget *:</span> $
                    {deal.customer_budget}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Expenses *:</span> -$
                    {deal.expenses}
                  </p>
                  <p className="text-gray-800">
                    <span className="text-sm">
                      * Initial Data By Deal Opener
                    </span>
                  </p>
                </div>
              </div>

              {renderFinancialSummary()}
            </div>

            {/* Team Members Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Deal Opener */}
              <div
                onClick={() =>
                  deal_opener?.id &&
                  navigate(`/home/employees/${deal_opener.id}`)
                }
                className={`bg-white rounded-lg shadow-sm p-6 border border-gray-200 ${
                  deal_opener?.id
                    ? "hover:shadow-md transition cursor-pointer"
                    : ""
                }`}
              >
                <div className="flex items-center space-x-4">
                  {deal_opener?.profile_picture_url ? (
                    <img
                      src={deal_opener.profile_picture_url}
                      alt={deal_opener.first_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">Deal Opener</h3>
                    <p className="text-gray-600">
                      {deal_opener
                        ? `${deal_opener.first_name} ${deal_opener.last_name}`
                        : "Not Assigned"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Deal Executor */}
              {deal.status === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 flex items-center justify-center">
                  <p className="text-gray-500 font-medium">Not Claimed Yet</p>
                </div>
              ) : (
                <div
                  onClick={() =>
                    deal_executor?.id &&
                    navigate(`/home/employees/${deal_executor.id}`)
                  }
                  className={`bg-white rounded-lg shadow-sm p-6 border border-gray-200 ${
                    deal_executor?.id
                      ? "hover:shadow-md transition cursor-pointer"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {deal_executor?.profile_picture_url ? (
                      <img
                        src={deal_executor.profile_picture_url}
                        alt={deal_executor.first_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Deal Executor
                      </h3>
                      <p className="text-gray-600">
                        {deal_executor
                          ? `${deal_executor.first_name} ${deal_executor.last_name}`
                          : "Not Assigned"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer */}
              <div
                onClick={() =>
                  customer?.id && navigate(`/home/customers/${customer.id}`)
                }
                className={`bg-white rounded-lg shadow-sm p-6 border border-gray-200 ${
                  customer?.id
                    ? "hover:shadow-md transition cursor-pointer"
                    : ""
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Customer</h3>
                    <p className="text-gray-600">
                      {customer?.name || "Not Assigned"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Records Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Financial Records</h2>
                  {executer && deal.status === 1 && (
                    <button
                      onClick={() => navigate(`new-record`)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Add Financial Record
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                        Payment Method
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {renderFinancialRecords()}
                  </tbody>
                  {Array.isArray(financialRecords) &&
                    financialRecords.length > 0 && (
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan="4" className="px-6 py-4">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">
                                Total Records: {financialRecords.length}
                              </span>
                            </div>
                          </td>
                        </tr>
                      </tfoot>
                    )}
                </table>
              </div>
            </div>
          </div>
        }
      />
      <Route path="/new-record" element={<AddFinancialRecord deal={deal} />} />
    </Routes>
  );
}

export default DealDetails;

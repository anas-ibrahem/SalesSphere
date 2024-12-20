import React, { useState } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import fetchAPI from "../../utils/fetchAPI";
import { PaymentMethods } from "../../utils/Enums";
import { FinancialRecordTypes } from "../../utils/Enums";

const AddFinancialRecord = ({ deal }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    amount: "",
    type: "0",
    description: "",
    payment_method: PaymentMethods.Cash,
    deal_id: deal.id,
  });

  const [amountInput, setAmountInput] = useState("");
  const [isNegative, setIsNegative] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanedAmount = Math.abs(Number(amountInput));
    const set = isNegative
      ? FinancialRecordTypes.Expense
      : FinancialRecordTypes.Income;
    console.log("type", set);
    try {
      await fetchAPI(
        "/finance",
        "POST",
        {
          ...formData,
          amount: cleanedAmount,
          type: set,
          payment_method: Number(formData.payment_method),
        },
        token
      );
      toast.success("Financial record added successfully");
      navigate(-1);
    } catch (error) {
      console.error("Error adding financial record:", error);
      toast.error("Error adding financial record");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "amountInput") {
      // Clean up the input value
      let cleanValue = value;

      cleanValue = cleanValue.replace(/[^\d.-]/g, "");

      const decimalCount = (cleanValue.match(/\./g) || []).length;
      if (decimalCount > 1) {
        const parts = cleanValue.split(".");
        cleanValue = parts[0] + "." + parts.slice(1).join("");
      }

      // Handle minus signs
      if (cleanValue.startsWith("--")) {
        cleanValue = cleanValue.slice(1);
      }

      // Remove any minus signs that aren't at the start
      if (cleanValue.includes("-")) {
        cleanValue =
          (cleanValue.startsWith("-") ? "-" : "") +
          cleanValue.replace(/-/g, "");
      }

      setIsNegative(cleanValue.startsWith("-"));
      setAmountInput(cleanValue);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTypeChange = (newType) => {
    let newAmount = amountInput;

    if (newType === FinancialRecordTypes.Expense) {
      if (!newAmount.startsWith("-")) {
        newAmount = "-" + newAmount;
      }
    } else {
      newAmount = newAmount.replace("-", "");
    }

    setAmountInput(newAmount);
    setIsNegative(newType === FinancialRecordTypes.Expense);
  };

  return (
    <div className="p-4">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-500 text-base cursor-pointer flex items-center mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            Add Financial Record - {deal.title}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type Selection with Visual Indicator */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div
              onClick={() => handleTypeChange(FinancialRecordTypes.Income)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                !isNegative
                  ? "bg-green-50 border-2 border-green-500"
                  : "bg-gray-50 border-2 border-transparent hover:border-gray-200"
              }`}
            >
              <div className="flex items-center">
                <TrendingUp
                  className={`w-5 h-5 ${
                    !isNegative ? "text-green-600" : "text-gray-400"
                  } mr-2`}
                />
                <span
                  className={`font-medium ${
                    !isNegative ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Income
                </span>
              </div>
            </div>
            <div
              onClick={() => handleTypeChange(FinancialRecordTypes.Expense)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                isNegative
                  ? "bg-red-50 border-2 border-red-500"
                  : "bg-gray-50 border-2 border-transparent hover:border-gray-200"
              }`}
            >
              <div className="flex items-center">
                <TrendingDown
                  className={`w-5 h-5 ${
                    isNegative ? "text-red-600" : "text-gray-400"
                  } mr-2`}
                />
                <span
                  className={`font-medium ${
                    isNegative ? "text-red-600" : "text-gray-600"
                  }`}
                >
                  Expense
                </span>
              </div>
            </div>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign
                  className={`w-5 h-5 ${
                    amountInput
                      ? isNegative
                        ? "text-red-500"
                        : "text-green-500"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <input
                type="text"
                name="amountInput"
                required
                value={amountInput}
                onChange={handleChange}
                className={`pl-10 py-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-opacity-50 text-base ${
                  amountInput
                    ? isNegative
                      ? "text-red-600 focus:border-red-500 focus:ring-red-500"
                      : "text-green-600 focus:border-green-500 focus:ring-green-500"
                    : "focus:border-blue-500 focus:ring-blue-500"
                }`}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
              placeholder="Enter description..."
            />
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
            >
              {Object.entries(PaymentMethods).map(([key, value]) => (
                <option key={value} value={value}>
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className={`px-5 py-2 text-white rounded-md transition text-base font-medium ${
                isNegative
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              Add {isNegative ? "Expense" : "Income"} Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFinancialRecord;

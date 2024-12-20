import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash, FaRandom } from "react-icons/fa";
import fetchAPI from "../../utils/fetchAPI";
import { toast } from "react-hot-toast";
import { TargetTypes } from "../../utils/Enums.js";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const AddTarget = ({ onBack }) => {
  const [isLoading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState({
    type: "",
    goal: "",
    deadline: "",
    description: "",
    employee_ids: [],
    start_date: "",
  });
  const navigate = useNavigate();
  const [isExecuter, setIsExecuter] = useState(false);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchAPI("/employee/summary/all", "GET", null, token)
      .then((data) => {
        setEmployees(data);
        setLoading(false);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="m-8">Loading...</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formValues);
    const token = localStorage.getItem("token");
    fetchAPI("/target/multiple", "POST", formValues, token)
      .then((data) => {
        console.log(data);
        toast.success("Target added successfully");
        navigate(-1);
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again.");
      });
  };

  const handleTypeChange = (type) => {
    setIsExecuter(type === "1");
  };

  const handleSelectChange = (selectedOptions) => {
    setFormValues({
      ...formValues,
      employee_ids: selectedOptions.map((option) => option.value),
    });
  };

  const handleSelectAll = () => {
    const allEmployeeIds = employees
      .filter((employee) => employee.role === (isExecuter ? 1 : 0))
      .map((employee) => employee.id);
    setFormValues({ ...formValues, employee_ids: allEmployeeIds });
  };

  const employeeOptions = employees
    .filter((employee) => employee.role === (isExecuter ? 1 : 0))
    .map((employee) => ({
      value: employee.id,
      label: `${employee.first_name} ${employee.last_name}`,
    }));

  return (
    <div className="bg-white p-6  shadow-md">
      <button
        type="button"
        onClick={onBack}
        className="text-blue-500 text-lg cursor-pointer flex items-center mb-5"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>
      <h2 className="text-center font-extrabold text-xl text-black mb-1">
        Add New Target
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Type Selection with Visual Indicator */}
        <div className="grid grid-cols-2 gap-3 my-6">
          <div
            onClick={() => handleTypeChange("0")}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              !isExecuter
                ? "bg-blue-50 border-2 border-blue-500"
                : "bg-gray-50 border-2 border-transparent hover:border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <span
                className={`font-medium ${
                  !isExecuter ? "text-blue-500" : "text-gray-600"
                }`}
              >
                Opener
              </span>
            </div>
          </div>
          <div
            onClick={() => handleTypeChange("1")}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              isExecuter
                ? "bg-blue-50 border-2 border-blue-900"
                : "bg-gray-50 border-2 border-transparent hover:border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <span
                className={`font-medium ${
                  isExecuter ? "text-blue-900" : "text-gray-600"
                }`}
              >
                Executer
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="type" className="block mb-1 text-gray-600">
            Type *
          </label>
          <select
            id="type"
            name="type"
            value={formValues.type}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md text-lg"
          >
            <option value="">Select Target</option>
            {isExecuter ? (
              <>
                <option value={TargetTypes.CloseDeals}>Close Deals</option>
                <option value={TargetTypes.Revenue}>Revenue</option>
              </>
            ) : (
              <>
                <option value={TargetTypes.OpenDeals}>Open Deals</option>
                <option value={TargetTypes.AddCustomers}>Add Customers</option>
              </>
            )}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="goal" className="block mb-1 text-gray-600">
            Goal *
          </label>
          <input
            type="text"
            id="goal"
            name="goal"
            value={formValues.goal}
            onChange={(e) => {
              const { name, value } = e.target;
              const phoneNumberPattern = /^[0-9+\-() ]*$/;
              if (phoneNumberPattern.test(value)) {
                handleChange(e);
              }
            }}
            required
            className="w-full p-2 border border-gray-300 rounded-md text-lg"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block mb-1 text-gray-600">
            Description *
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md text-lg"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="employees" className="block mb-1 text-gray-600">
            Employees *
          </label>
          <Select
            id="employees"
            name="employees"
            options={employeeOptions}
            isMulti
            onChange={handleSelectChange}
            className="w-full"
            required
            value={employeeOptions.filter((option) =>
              formValues.employee_ids.includes(option.value)
            )}
          />
          <button
            type="button"
            onClick={handleSelectAll}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Select All
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="deadline" className="block mb-1 text-gray-600">
            Deadline *
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formValues.deadline}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md text-lg"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="start_date" className="block mb-1 text-gray-600">
            Start Date *
          </label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formValues.start_date}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md text-lg"
          />
        </div>

        <div className="text-center mt-5">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md text-lg shadow-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTarget;

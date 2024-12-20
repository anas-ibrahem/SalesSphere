import React, { useState } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash, FaRandom } from "react-icons/fa";
import fetchAPI from "../../utils/fetchAPI";
import { Password, Token } from "@mui/icons-material";
import { EmployeeRoles } from "../../utils/Enums.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddEmployeeForm = ({ onBack }) => {
  const [formValues, setFormValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    birth_date: "",
    phone_number: "",
    password: "",
    address: "",
    hire_date: "",
  });

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

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
    fetchAPI("/employee", "POST", formValues, token)
      .then((data) => {
        console.log(data);
        toast.success("Employee added successfully");
        onBack();
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again.");
      });
  };

  const generateRandomPassword = () => {
    const length = 12;
    const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    const getRandomChar = (charSet) =>
      charSet[Math.floor(Math.random() * charSet.length)];

    const password = [
      getRandomChar(uppercaseLetters),
      getRandomChar(lowercaseLetters),
      getRandomChar(numbers),
      getRandomChar(specialChars),
      ...Array.from({ length: length - 4 }, () =>
        getRandomChar(
          uppercaseLetters + lowercaseLetters + numbers + specialChars
        )
      ),
    ]
      .sort(() => Math.random() - 0.5)
      .join("");

    setFormValues((prev) => ({
      ...prev,
      password,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-white p-6  shadow-md">
      <button
        type="button"
        onClick={onBack}
        className="text-blue-500 text-lg cursor-pointer flex items-center mb-5"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>
      <h2 className="text-center font-extrabold text-xl text-blue-800 mb-1">
        Add New Employee
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="first_name" className="block mb-1 text-gray-600">
            First Name *
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formValues.first_name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md text-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="last_name" className="block mb-1 text-gray-600">
            Last Name *
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formValues.last_name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md text-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 text-gray-600">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md text-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1 text-gray-600">
            Initial Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md text-lg pr-20"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-gray-500 hover:text-blue-500 mr-2"
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <button
                type="button"
                onClick={generateRandomPassword}
                className="text-gray-500 hover:text-blue-500"
                title="Generate Random Password"
              >
                <FaRandom />
              </button>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="role" className="block mb-1 text-gray-600">
            Role *
          </label>
          <select
            id="role"
            name="role"
            value={formValues.role}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md text-lg"
          >
            <option value="">Select Role</option>
            <option value={EmployeeRoles.DealExecutor}>Deal Executor</option>
            <option value={EmployeeRoles.DealOpener}>Deal Opener</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="birth_date" className="block mb-1 text-gray-600">
            Birth Date *
          </label>
          <input
            type="date"
            id="birth_date"
            name="birth_date"
            value={formValues.birth_date}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md text-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone_number" className="block mb-1 text-gray-600">
            Phone Number *
          </label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={formValues.phone_number}
            onChange={(e) => {
              // TODO - test this
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
          <label htmlFor="address" className="block mb-1 text-gray-600">
            Address (Optional)
          </label>
          <textarea
            id="address"
            name="address"
            value={formValues.address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md text-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="hire_date" className="block mb-1 text-gray-600">
            Hire Date *
          </label>
          <input
            type="date"
            id="hire_date"
            name="hire_date"
            value={formValues.hire_date}
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

export default AddEmployeeForm;

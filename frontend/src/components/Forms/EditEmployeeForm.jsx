import React, { useState, useEffect, useContext } from "react";
import { FaArrowLeft, FaUpload } from "react-icons/fa";
import fetchAPI from "../../utils/fetchAPI";
import { EmployeeRoles } from "../../utils/Enums.js";
import { toast } from "react-hot-toast";
import UserContext from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const EditEmployeeForm = ({ employee, onBack }) => {
  const [formValues, setFormValues] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    birth_date: "",
    phone_number: "",
    address: "",
    hire_date: "",
    profile_picture_url: null,
  });
  const [profilePreview, setProfilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { employee : me , setEmployee } = useContext(UserContext);
  const navigate = useNavigate();

  const cloudName = import.meta.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

  useEffect(() => {
    if (employee) {
      const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().split("T")[0];
      };

      setFormValues({
        id: employee?.id || "",
        first_name: employee?.first_name || "",
        last_name: employee?.last_name || "",
        email: employee?.email || "",
        role: employee?.role ?? "",
        birth_date: formatDate(employee?.birth_date),
        phone_number: employee?.phone_number || "",
        address: employee?.address || "",
        hire_date: formatDate(employee?.hire_date),
        profile_picture_url: employee?.profile_picture_url || null,
      });

      // Set initial profile picture preview if exists
      if (employee.profile_picture_url) {
        setProfilePreview(employee.profile_picture_url);
      }
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ["image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload a JPEG or PNG.");
        return;
      }

      if (file.size > maxSize) {
        toast.error("File is too large. Maximum size is 5MB.");
        return;
      }

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        toast.error(
          "Cloudinary configuration is missing. Please check your .env file."
        );
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      setUploading(true);
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (data.secure_url) {
          setProfilePreview(data.secure_url);
          setFormValues((prevValues) => ({
            ...prevValues,
            profile_picture_url: data.secure_url,
          }));
          console.log(data.secure_url);
          toast.success("Profile picture uploaded successfully.");
        } else {
          toast.error("Failed to upload profile picture.");
        }
      } catch (error) {
        toast.error("An error occurred while uploading the profile picture.");
        console.error(error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { ...formValues };
    const token = localStorage.getItem("token");
    console.log(formData);
    try {
      const data = await fetchAPI(
        "/employee/" + employee.id,
        "PATCH",
        formData,
        token
      );
      console.log("data", formData);
      if (data.error) {
        toast.error("An error occurred. Please try again.");
        console.error(data.error);
      } else {
        toast.success("Profile updated successfully");
        if (me.id === employee.id) {
          setEmployee({...me , ...formData})
        }
        if (onBack) onBack();
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-6 shadow-md">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="text-blue-500 text-lg cursor-pointer flex items-center mb-5"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
      )}
      <h2 className="text-center font-extrabold text-xl text-blue-800 mb-1">
        Edit {me.id === employee.id ? "Profile" : "Employee"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          {/* Profile Picture Upload */}
          {me.id === employee.id && (
            <div className="mb-4 flex flex-col items-center">
              <div className="w-32 h-32 mb-4 relative">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover rounded-full border-2 border-gray-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              <label
                className={`bg-blue-500 text-white py-2 px-4 rounded-md text-lg shadow-md flex items-center cursor-pointer ${
                  uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FaUpload className="mr-2" />{" "}
                {uploading ? "Uploading..." : "Upload Profile Picture"}
                <input
                  type="file"
                  name="profile_picture"
                  accept="image/jpeg,image/png"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <p className="text-sm text-gray-500 mt-2">Max 5MB (JPEG, PNG)</p>
            </div>
          )}

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
          <label htmlFor="role" className="block mb-1 text-gray-600">
            Role *
          </label>
          <select
            id="role"
            name="role"
            value={formValues.role}
            onChange={handleChange}
            required
            disabled={
              me.role !== EmployeeRoles.Manager || me.id === employee.id
            }
            className={`w-full p-2 border border-gray-300 rounded-md text-lg ${
              me.role !== EmployeeRoles.Manager
                ? "bg-gray-100 cursor-not-allowed"
                : ""
            }`}
          >
            <option value={EmployeeRoles.DealExecutor}>Deal Executor</option>
            <option value={EmployeeRoles.DealOpener}>Deal Opener</option>
            {employee.role === EmployeeRoles.Manager && (
              <option value={EmployeeRoles.Manager}>Manager</option>
            )}
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
            disabled={
              me.role !== EmployeeRoles.Manager ||
              (me.id === employee.id && me.role !== EmployeeRoles.Manager)
            }
            className={`w-full p-2 border border-gray-300 rounded-md text-lg ${
              me.role !== EmployeeRoles.Manager
                ? "bg-gray-100 cursor-not-allowed"
                : ""
            }`}
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
            disabled={
              me.role !== EmployeeRoles.Manager ||
              (me.id === employee.id && me.role !== EmployeeRoles.Manager)
            }
            className={`w-full p-2 border border-gray-300 rounded-md text-lg ${
              me.role !== EmployeeRoles.Manager
                ? "bg-gray-100 cursor-not-allowed"
                : ""
            }`}
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

export default EditEmployeeForm;

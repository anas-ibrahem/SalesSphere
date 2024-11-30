import "../index.css";
import Logo from "./Logo.jsx";
const Footer = function () {
  return (
    <footer className="bg-white shadow dark:bg-gray-900 mt-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="https://flowbite.com/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <Logo className="w-20 lg:w-24" /> {/* Fixed width for Logo */}
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              SalesSphere
            </span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <a href="#About" className="hover:underline me-4 md:me-6">
                About
              </a>
            </li>
            <li>
              <a href="#Contact" className="hover:underline me-4 md:me-6">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#Services" className="hover:underline me-4 md:me-6">
                Services
              </a>
            </li>
            <li>
              <a href="#Help" className="hover:underline">
                Help
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            SalesSphere™
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;

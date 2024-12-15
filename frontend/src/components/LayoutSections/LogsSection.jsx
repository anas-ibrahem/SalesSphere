import { useState } from "react";
import Pagination from "../Pagination";

const LogsSection = () => {
  const logs = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    user: "manager",
    title: "Server Logs",
    description: "Add new customer to database",
    destination: "customer",
    date: "2024-07-01",
    time: "12:00PM",
  }));

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const LogsPerPage = 10;
  const indexOfLastLog = currentPage * LogsPerPage;
  const indexOfFirstLog = indexOfLastLog - LogsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / LogsPerPage);

  return (
    <section className="bg-white p-6 shadow-md">
      <h1 className="text-2xl font-bold mb-8">Activity Logs</h1>
      <ol className="relative border-l border-gray-300">
        {currentLogs.map((log) => (
          <li key={log.id} className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-200 rounded-full -left-3 ring-8 ring-gray-100">
              <img
                className="rounded-full shadow-lg"
                src="https://randomuser.me/api/portraits/men/1.jpg"
                alt={`${log.user} image`}
              />
            </span>
            <div className="items-center justify-between p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm sm:flex">
              <time className="mb-1 text-xs font-normal text-gray-500 sm:order-last sm:mb-0">
                {log.date} {log.time}
              </time>
              <div className="text-sm font-normal text-gray-700">
                <a
                  href="#"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {log.user}
                </a>{" "}
                {log.description}{" "}
                <a
                  href="#"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {log.destination}
                </a>{" "}
              </div>
            </div>
          </li>
        ))}
      </ol>
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  );
};

export default LogsSection;
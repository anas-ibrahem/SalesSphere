import React from 'react';
import { useState } from 'react';
// TODO delete this file 


export const BusinessSection = () => (
  <section className="bg-white p-6 shadow-md h-screen">
    <h1 className="text-2xl font-bold mb-4">Business Overview</h1>
    <p>Detailed business insights and analytics.</p>
    {/* Add more business-related content */}
  </section>
);


export const LogsSection = () => {
  const logs = [
    {
      id: 1,
      user: "manager",
      title: "Server Logs",
      description: "Add new customer to database",
      destination: "customer",
      date: "2024-07-01",
      time: "12:00PM",
    },
    {
      id: 2,
      user: "manager",
      title: "Server Logs",
      description: "Add new customer to database",
      destination: "customer",
      date: "2024-07-01",
      time: "12:00PM",
    },
    {
      id: 3,
      user: "manager",
      title: "Server Logs",
      description: "Add new customer to database",
      destination: "customer",
      date: "2024-07-01",
      time: "12:00PM",
    },
  ];

  return (
    <section className="bg-white p-6 shadow-md h-screen">
      <ol className="relative border-l border-gray-300">
        {logs.map((log) => (
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
    </section>
  );
};

export const DefaultSection = () => (
  <section className="bg-white p-6 shadow-md h-screen">
    <h1 className="text-2xl font-bold mb-4">Welcome to SalesSphere</h1>
    <p>Select a section from the sidebar to get started.</p>
  </section>
);

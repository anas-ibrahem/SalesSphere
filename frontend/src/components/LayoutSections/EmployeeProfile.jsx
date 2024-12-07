import React from "react";

const EmployeeProfile = (props) => {
  const { employee, back } = props;

  // Calculate success rate
  const successRate = (
    (employee.numberOfSuccessfulDeals / employee.numberOfDeals) *
    100
  ).toFixed(2);

  // Sort deals by date
  // const sortedDeals = employee.deals.sort(
  //   (a, b) => new Date(b.date) - new Date(a.date)
  // );

  return (
    <div className="bg-white m-0 rounded shadow-xl w-full  overflow-hidden h-screen ">
      <div className="h-[140px]  bg-gradient-to-r from-cyan-500 to-blue-500">
        <button
          onClick={back}
          className="inline-flex m-6 w-auto cursor-pointer select-none appearance-none items-center justify-center space-x-1 rounded border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-300 active:bg-white hover:bg-gray-100 "
        >
          Back
        </button>
      </div>
      <div className="px-5 py-2 flex flex-col gap-3 pb-6">
        <div className="h-[90px] shadow-md w-[90px] rounded-full border-4 overflow-hidden -mt-14 border-white">
          <img
            src={employee.profilePicture}
            alt={`${employee.name}'s profile`}
            className="w-full h-full rounded-full object-center object-cover"
          />
        </div>
        <div>
          <h3 className="text-xl text-slate-900 relative font-bold leading-6">
            {employee.name}
          </h3>
          <p className="text-sm text-gray-600">{employee.email}</p>
        </div>
        {/* <div className="flex gap-3 flex-wrap">
            {employee.badges.map((badge, index) => (
              <span
                key={index}
                className={`rounded-sm px-3 py-1 text-xs font-medium ${badge.colorClass}`}
              >
                {badge.name}
              </span>
            ))}
          </div> */}

        <h4 className="text-md font-medium leading-3">About</h4>
        <p className="text-sm text-stone-500">{employee.type}</p>
        <h4 className="text-md font-medium leading-3">Deals</h4>
        {/* <div className="flex flex-col gap-3">
            {employee.experiences.map((experience, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-2 py-3 bg-white rounded border w-full"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  className="h-8 w-8 text-slate-500"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"></path>
                </svg>
                <div className="leading-3">
                  <p className="text-sm font-bold text-slate-700">
                    {experience.title}
                  </p>
                  <span className="text-xs text-slate-600">
                    {experience.duration}
                  </span>
                </div>
                <p className="text-sm text-slate-500 self-start ml-auto">
                  {experience.description}
                </p>
              </div>
            ))}
          </div> */}
      </div>
    </div>
  );
};

export default EmployeeProfile;

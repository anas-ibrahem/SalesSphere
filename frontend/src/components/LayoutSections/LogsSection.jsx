import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemPrefix,
  Card,
  Typography,
} from "@material-tailwind/react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Pagination from "../Pagination";
import fetchAPI from '../../utils/fetchAPI';
import { LogTypes } from "../../utils/Enums";
import { Paid, Person, CrisisAlert, BusinessCenter, Business } from "@mui/icons-material";

const LogIcons = {
    [LogTypes.Business]: Business,
    [LogTypes.Employee]: Person,
    [LogTypes.Customer]: Person,
    [LogTypes.Deal]: BusinessCenter,
    [LogTypes.Target]: CrisisAlert,
    [LogTypes.Finances]: Paid,
};

const LogsSection = () => {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState(-1);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const LogsPerPage = 10;


  // Fetch logs from API
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchAPI('/logs', 'GET', null, token)
      .then((data) => {
        console.log(data);
        setLogs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching logs:", error);
        setLoading(false);
      });
  }, [reload]);
  

  // Filtering logic
  const filterLogs = logs.filter((logs) => {
    return (
      (filterType == -1 || logs.type == filterType)
    );
  });



  // Pagination logic
  const indexOfLastLog = currentPage * LogsPerPage;
  const indexOfFirstLog = indexOfLastLog - LogsPerPage;
  const currentLogs = filterLogs.slice(
    indexOfFirstLog,
    indexOfLastLog
  );
  const totalPages = Math.ceil(filterLogs.length / LogsPerPage);

  const manager = true;

  return (<section className="bg-white p-6 shadow-md h-screen flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold mb-4">Activity Logs</h1>
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex justify-between mb-4">
              <div className="flex space-x-4">
                {/* Type Filter */}
                <select
                  onChange={(e) => setFilterType(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value={-1}>All Types</option>
                  {Object.entries(LogTypes).map(([typeName, val]) => (
                    <option key={val} value={val}>
                    {/* split name camel case */}
                    {typeName.replace(/([a-z])([A-Z])/g, '$1 $2')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Logs Table */}
            <div className="flex-grow overflow-y-auto">
              <Card>
                <List>
                  {loading ? (
                    <Typography variant="h6" color="blue-gray" className="text-center">
                      Loading...
                    </Typography>
                  ) : (
                    currentLogs.map((log) => {
                        const Icon = LogIcons[log.type];
                        return (
                      <ListItem
                        key={log.id}
                        className={`cursor-default my-2 hover:bg-gray-100 border border-gray-200`}
                      >
                        <ListItemPrefix>
                            <Icon className={`text-secondary-accent m-2`} />
                        </ListItemPrefix>
                        <div>
                            <div className="flex items-center">
                                <Typography variant="h6" color="blue-gray">
                                  {log.content}
                                </Typography>
                                <Typography variant="small" className="ml-2 text-gray-500 text-xs">
                                    {new Date(log.date).toLocaleString().replace(/:\d{2}\s/,' ').replace(/,/, '')}
                                </Typography>
                               
                            </div>
                          
                          <Typography
                            variant="small"
                            color="gray"
                            className="font-normal"
                            >
                            {
                              log.deal_name && <span> Deal: <Link to={`/home/deals/${log.deal_id}`} className="text-blue-500">{log.deal_name}</Link></span>
                            }
                            {
                              log.customer_name && <span> Customer: <Link to={`/home/customers/${log.customer_id}`} className="text-blue-500">{log.customer_name}</Link></span>
                            }
                            {
                              log.employee_id && <span> Employee: <Link to={`/home/employees/${log.employee_id}`} className="text-blue-500">{log.employee_name}</Link></span>
                            }

                          </Typography>
                          
                        </div>
                      </ListItem>
                    )})
                  )}
                </List>
              </Card>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </section>
        );
}

export default LogsSection;
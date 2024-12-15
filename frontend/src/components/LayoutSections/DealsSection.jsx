import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import DealDetails from "./DealsDetails";
import AddDealForm from "../Forms/AddDealForm";
import {
  List,
  ListItem,
  Card,
  Typography,
} from "@material-tailwind/react";
import Pagination from "../Pagination";
import fetchAPI from '../../utils/fetchAPI';

function DealsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date_opened');
  const [DealsData, setDealsData] = useState([]);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const manager = true; // You might want to get this from context or props

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchAPI('/deal', 'GET', null, token).then((data) => {
      console.log(data);
      setDealsData(data);
    });
  }, []);

  // Filtering logic
  const filteredAndSortedDeals = DealsData
    .filter(deal => filterStatus === 'all' || deal.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'date_opened') {
        return new Date(b.date_opened) - new Date(a.date_opened);
      }
      if (sortBy === 'expenses') {
        return b.expenses - a.expenses;
      }
      return 0;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedDeals.length / itemsPerPage);
  const indexOfLastDeal = currentPage * itemsPerPage;
  const indexOfFirstDeal = indexOfLastDeal - itemsPerPage;
  const currentDeals = filteredAndSortedDeals.slice(
    indexOfFirstDeal,
    indexOfLastDeal
  );

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <section className="bg-white p-6 shadow-md h-screen flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold mb-4">Deals</h1>
              {manager && (
                <button
                  onClick={() => navigate("add")}
                  className="flex items-center px-4 border rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  <i className="fas fa-plus text-xl mr-2 pb-[3px]"></i>
                  <span className="text-lg">Add Deal</span>
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex justify-between mb-4">
              <div className="flex space-x-4">
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="all">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="closed_won">Closed Won</option>
                  <option value="closed_lost">Closed Lost</option>
                </select>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="date_opened">Sort by Date</option>
                  <option value="expenses">Sort by Expenses</option>
                </select>
              </div>
            </div>

            {/* Deals List */}
            <div className="flex-grow overflow-y-auto">
              <Card>
                <List>
                  {currentDeals.map((deal) => (
                    <ListItem
                      key={deal.id}
                      className="cursor-pointer my-4 hover:bg-gray-100"
                      onClick={() => navigate(`${deal.id}`)}
                    >
                      <div className="w-full">
                        <Typography variant="h6" color="blue-gray">
                          {deal.title}
                        </Typography>
                        <Typography 
                          variant="small" 
                          color="gray" 
                          className="font-normal flex justify-between"
                        >
                          <p>Status: {deal.status}</p>
                          <p>Due Date: {deal.due_date}</p>
                        </Typography>
                        <Typography 
                          variant="small" 
                          color="gray" 
                          className="font-normal flex justify-between"
                        >
                          <p>Expenses: ${deal.expenses}</p>
                          <p>Total Value: ${deal.total_value}</p>
                        </Typography>
                      </div>
                    </ListItem>
                  ))}
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
        } 
      />
      
      {/* Route for individual deal details */}
      <Route 
        path=":dealId" 
        element={<DealDetails onBack={() => navigate("/home/deals")} />} 
      />
      
      {/* Route for adding a new deal */}
      <Route 
        path="add" 
        element={<AddDealForm onBack={() => navigate("/home/deals")} />} 
      />
    </Routes>
  );
}

export default DealsSection;
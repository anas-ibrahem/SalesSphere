import React, { useState, useMemo, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { PieChart  } from '@mui/x-charts/PieChart';
import Pagination from '../Pagination';
import DealDetails from './DealsDetails';

const initialDealsData = [
  {
    id: 1,
    title: 'Deal with ABC Corp',
    status: 'open',
    description: 'Negotiating contract terms with ABC Corp.',
    date_opened: '2024-10-01',
    due_date: '2024-11-15',
    expenses: 5000,
    customer_budget: 15000,
    total_value: 10000,
    account_manager: 'John Smith',
    probability_of_close: '65%',
    next_steps: 'Schedule follow-up meeting',
  },
  {
    id: 2,
    title: 'Contract with XYZ Ltd',
    status: 'closed_won',
    description: 'Successful contract with XYZ Ltd.',
    date_opened: '2024-08-15',
    date_closed: '2024-09-20',
    due_date: '2024-09-20',
    expenses: 8000,
    customer_budget: 20000,
    total_value: 15000,
    account_manager: 'Sarah Johnson',
    probability_of_close: '100%',
    next_steps: 'Contract implementation',
  },
  {
    id: 3,
    title: 'Proposal for LMN Inc',
    status: 'closed_lost',
    description: 'Lost proposal for LMN Inc.',
    date_opened: '2024-09-05',
    date_closed: '2024-09-30',
    due_date: '2024-09-30',
    expenses: 4000,
    customer_budget: 12000,
    total_value: 8000,
    account_manager: 'Mike Williams',
    probability_of_close: '0%',
    next_steps: 'Conduct post-mortem analysis',
  },
  // Additional mock deals...
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 4,
    title: `Deal ${i + 4}`,
    status: ['open', 'closed_won', 'closed_lost'][i % 3],
    description: `Description for Deal ${i + 4}`,
    date_opened: `2024-0${(i % 9) + 1}-01`,
    due_date: `2024-0${(i % 9) + 1}-15`,
    expenses: 5000 + (i * 1000),
    customer_budget: 15000 + (i * 2000),
    total_value: 10000 + (i * 1500),
    account_manager: `Manager ${i + 1}`,
    probability_of_close: `${50 + (i % 50)}%`,
    next_steps: 'Follow up required',
  }))
];




  function DealsSection() {

    const itemsPerPageMap = {
      mobile: 3,
      tablet: 5,
      desktop: 3,
    };
    const [deviceType, setDeviceType] = useState('mobile'); // New state for device type
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('date_opened');
    const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageMap[deviceType]);
    const [selectedDeal, setSelectedDeal] = useState(null);
  
    useEffect(() => {
      const handleResize = () => {
        const height = window.innerHeight;
        let newDeviceType = 'mobile';
    
        if (height >= 768 && height < 1024) {
          newDeviceType = 'tablet';
        } else if (height >= 1024) {
          newDeviceType = 'desktop';
        }
  
        if (newDeviceType !== deviceType) {
          setDeviceType(newDeviceType);
          setItemsPerPage(itemsPerPageMap[newDeviceType]);
        }
      };
  
      // Add event listener
      window.addEventListener('resize', handleResize);
      
      // Initial check
      handleResize();
  
      // Cleanup
      return () => window.removeEventListener('resize', handleResize);
    }, [deviceType]);
    
    const filteredAndSortedDeals = useMemo(() => {
      return initialDealsData
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
    }, [filterStatus, sortBy]);
  
    const totalPages = Math.ceil(filteredAndSortedDeals.length / itemsPerPage);
    const paginatedDeals = filteredAndSortedDeals.slice(
      (currentPage - 1) * itemsPerPage, 
      currentPage * itemsPerPage
    );
  

  
    useEffect(() => {
      setCurrentPage(1);
    }, [filterStatus, sortBy, itemsPerPage]);
  

  
    if (selectedDeal) {
      return (
        <div className="flex bg-white flex-col h-screen">
          <DealDetails 
            deal={selectedDeal} 
            onBack={() => setSelectedDeal(null)} 
          />
        </div>
      );
    }


    const customColors = {
      open: '#01A2E1',       
      closed_lost: '#D9605F', 
      closed_won: '#3357FF' 
    };

    const processData = (data) => {
      const statusCounts = data.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {});
    
      return Object.entries(statusCounts).map(([status, count]) => ({
        id: status,
        label: status,
        value: count,
        color : customColors[status]
      }));
    }; 
    
    return (
      <div className="flex bg-white flex-col h-full px-2">
        <h1 className="text-2xl font-bold mb-8 ml-4 mt-6">Deals</h1>
  
        {/* Filters */}
        <div className="flex justify-between mb-4 p-4 pt-0">
          <div className="space-x-2">
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
  
        {/* Deals List and Stats */}
        <section className="flex">

          <div className="flex-grow overflow-y-auto px-4 pr-0">
            
            <ul className="space-y-4">

              {paginatedDeals.map((deal) => (
                <li
                  key={deal.id}
                  onClick={() => setSelectedDeal(deal)}
                  className="p-4 border-[3px] shadow-sm rounded cursor-pointer hover:bg-gray-100 transition-all"
                >
                  <h3 className="text-xl font-semibold">{deal.title}</h3>
                  <p>Status: {deal.status.replace('_', ' ')}</p>
                  <p>Due Date: {new Date(deal.due_date).toLocaleDateString()}</p>
                  <p>Expenses: ${deal.expenses}</p>
                </li>
              ))}
            </ul>

          </div>
  
          {/* TODO fix rotation reposnivity */}
          <div className="flex-grow-0 w-1/3">
              <PieChart
              series={[
                {
                  data: processData(initialDealsData),
                  colors: Object.values(customColors),
                }
              ]}           
                width={370}
                height={190}
              />
          </div>

        </section>
  
        {/* Pagination */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    );
  }
  
  export default DealsSection;
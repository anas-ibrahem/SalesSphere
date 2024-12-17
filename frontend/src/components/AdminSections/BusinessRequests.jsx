import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Box, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import fetchAPI from '../../utils/fetchAPI';

import { VerificationStatus as VS } from '../../utils/Enums';

// Mock data (replace with actual data fetching)
const mockBusinessRequests = [
    {
        id: 1,
        businessName: 'Tech Innovators Inc',
        submissionDate: '2024-03-15',
        status: 'Pending',
        managerName: 'Sarah Johnson',
        managerEmail: 'sarah.johnson@techinnovators.com',
        description: 'Technology consulting startup seeking initial approval',
        firstName: 'Sarah',
        lastName: 'Johnson',
        birthdate: '1990-01-01',
        address: '123 Main St, San Francisco, CA 94105',
        email: 'sarah.johnson@techinnovators.com',
        phone: '123-456-7890',
        businessEmail: 'contact@techinnovators.com',
        businessPhone: '123-456-7890',
        businessCountry: 'USA',
        businessCity: 'San Francisco',
        businessStreet: '123 Main St',
        businessWebsite: 'https://techinnovators.com',
        businessIndustry: 'Technology',
        managerID: { url: '/path/to/managerID.jpg' },
        managerPhoto: { url: '/path/to/managerPhoto.jpg' },
        businessLogo: { url: '/path/to/businessLogo.jpg' },
        businessRegistrationDoc: { url: '/path/to/businessRegistrationDoc.jpg' }
    },
    {
        id: 2,
        businessName: 'Green Solutions LLC',
        submissionDate: '2024-03-10',
        status: 'Approved',
        managerName: 'Michael Chen',
        managerEmail: 'michael.chen@greensolutions.com',
        description: 'Sustainable energy consulting firm',
        firstName: 'Michael',
        lastName: 'Chen',
        birthdate: '1985-05-15',
        address: '456 Green St, New York, NY 10001',
        email: 'michael.chen@greensolutions.com',
        phone: '987-654-3210',
        businessEmail: 'contact@greensolutions.com',
        businessPhone: '987-654-3210',
        businessCountry: 'USA',
        businessCity: 'New York',
        businessStreet: '456 Green St',
        businessWebsite: 'https://greensolutions.com',
        businessIndustry: 'Energy',
        managerID: { url: '/path/to/managerID.jpg' },
        managerPhoto: { url: '/path/to/managerPhoto.jpg' },
        businessLogo: { url: '/path/to/businessLogo.jpg' },
        businessRegistrationDoc: { url: '/path/to/businessRegistrationDoc.jpg' }
    },
    {
        id: 3,
        businessName: 'Retail Dynamics',
        submissionDate: '2024-03-12',
        status: 'Rejected',
        managerName: 'Emily Rodriguez',
        managerEmail: 'emily.rodriguez@retaildynamics.com',
        description: 'Retail analytics platform',
        firstName: 'Emily',
        lastName: 'Rodriguez',
        birthdate: '1992-07-20',
        address: '789 Market St, Los Angeles, CA 90001',
        email: 'emily.rodriguez@retaildynamics.com',
        phone: '555-123-4567',
        businessEmail: 'contact@retaildynamics.com',
        businessPhone: '555-123-4567',
        businessCountry: 'USA',
        businessCity: 'Los Angeles',
        businessStreet: '789 Market St',
        businessWebsite: 'https://retaildynamics.com',
        businessIndustry: 'Retail',
        managerID: { url: '/path/to/managerID.jpg' },
        managerPhoto: { url: '/path/to/managerPhoto.jpg' },
        businessLogo: { url: '/path/to/businessLogo.jpg' },
        businessRegistrationDoc: { url: '/path/to/businessRegistrationDoc.jpg' }
    }
];


const BusinessRequestModal = ({ request, onClose, onAccept, onReject }) => {
    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
    
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
    
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle">
        <div>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          {/* Icon */}
          </div>
          <div className="mt-3 sm:mt-5">
          <h3 className="text-lg leading-6 text-center font-medium text-gray-900">
            {request.businessname}
          </h3>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Typography variant="body1">
                  <strong>First Name: </strong>{request.managerfirstname}
                </Typography>
                <Typography variant="body1">
                  <strong>Last Name: </strong>{request.managerlastname}
                </Typography>
                <Typography variant="body1">
                  <strong>Birthdate: </strong>{request.managerbirthdate}
                </Typography>
                <Typography variant="body1">
                  <strong>Address: </strong>{request.manageraddress}
                </Typography>
                <Typography variant="body1">
                  <strong>Email: </strong>{request.manageremail}
                </Typography>
                <Typography variant="body1">
                  <strong>Phone: </strong>{request.managerphone}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>
                  Business Information
                </Typography>
                <Typography variant="body1">
                  <strong>Business Name: </strong>{request.businessname}
                </Typography>
                <Typography variant="body1">
                  <strong>Business Email: </strong>{request.businessemail}
                </Typography>
                <Typography variant="body1">
                  <strong>Business Phone: </strong>{request.businessphone}
                </Typography>
                <Typography variant="body1">
                  <strong>Country: </strong>{request.businesscountry}
                </Typography>
                <Typography variant="body1">
                  <strong>City: </strong>{request.businesscity}
                </Typography>
                <Typography variant="body1">
                  <strong>Street: </strong>{request.businessstreet}
                </Typography>
                <Typography variant="body1">
                  <strong>Website: </strong>{request.businesswebsite}
                </Typography>
                <Typography variant="body1">
                  <strong>Industry: </strong>{request.businessindustry}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Documents
                </Typography>
                <Typography variant="body1">
                  <strong>Business Manager's ID: </strong><Link to={request.manageridcardurl} target="_blank" rel="noreferrer" className='text-blue-700'>Click Here</Link>
                </Typography>
                <Typography variant="body1">
                  <strong>Business Manager's Photo: </strong><Link to={request.managerpersonalphotourl} target="_blank" rel="noreferrer" className='text-blue-700'>Click Here</Link>
                </Typography>
                <Typography variant="body1">
                  <strong>Business Logo: </strong><Link to={request.businesslogourl} target="_blank" rel="noreferrer" className='text-blue-700'>Click Here</Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
          <button
          type="button"
          disabled={request.status === VS.Approved}
          className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-2 sm:text-sm ${
            request.status === VS.Approved ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
          }`}
          onClick={onAccept}
          >
          Accept
          </button>
          <button
          type="button"
          disabled={request.status === VS.Rejected}
          className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:col-start-1 sm:text-sm ${
            request.status === VS.Rejected ? 'bg-red-300 text-gray-700 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-red-700 hover:text-white focus:ring-indigo-500'
          }`}
          onClick={onReject}
          >
          Reject
          </button>
          <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
          onClick={onClose}
          >
          Close
          </button>
        </div>
        </div>
      </div>
      </div>
    );
  };
  
const BusinessRequests = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Pending');

    const [currentRequest, setCurrentRequest] = useState(null);

    const [businessRequests, setBusinessRequests] = useState([]);

    useEffect(() => {

      const token = localStorage.getItem('admin_token');

      fetchAPI('/admin/business', 'GET', null, token).then(data => {
        if(data) {
          setBusinessRequests(data);
        }
      }).catch(error => {
        console.error(error);
      });

    }, [currentRequest]);
  
    // Filter and search logic
    const filteredRequests = useMemo(() => businessRequests.filter(request =>  {
      request['submissiondate'] = new Date(request['submissiondate']).toLocaleDateString();
      return (VS[activeTab] == request.status) &&
      (request["businessname"].toLowerCase().includes(searchTerm.toLowerCase()) ||
      request["managername"].toLowerCase().includes(searchTerm.toLowerCase()));
    }
      
    ), [businessRequests, activeTab, searchTerm]); 
  
    const openRequestModal = (request) => {
        setCurrentRequest(request);
    };

    const closeRequestModal = () => {
        setCurrentRequest(null);
    }

    const acceptRequest = () => {
        const token = localStorage.getItem('admin_token');
        console.log('Request accepted:', currentRequest);
        fetchAPI(`/admin/business/accept/${currentRequest.id}`, 'PATCH', null, token).then(data => {
          if(data) {
            console.log('Request accepted:', data);
            setCurrentRequest(null);
          }
        }).catch(error => {
          console.error(error);
          setCurrentRequest(null);
        });
    }

    const rejectRequest = () => {
        const token = localStorage.getItem('admin_token');
        console.log('Request rejected:', currentRequest);
        fetchAPI(`/admin/business/reject/${currentRequest.id}`, 'PATCH', null, token).then(data => {
          if(data) {
            console.log('Request rejected:', data);
            setCurrentRequest(null);
          }
        }).catch(error => {
          console.error(error);
          setCurrentRequest(null);
        });
    }

    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
  
          {/* Search and Filters */}
          <div className="p-4 sm:p-6 bg-gray-100">
            <div className="flex items-center space-x-4">
              <div className="relative flex-grow">
                <input 
                  type="text"
                  placeholder="Search by business name or manager"
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
          </div>
  
          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row border-b">
            {['Pending', 'Approved', 'Rejected'].map(tab => (
              <button
                key={tab}
                className={`w-full sm:flex-1 py-3 font-semibold uppercase tracking-wider text-sm 
                  ${activeTab === tab 
                    ? 'bg-secondary-accent text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab} Requests
              </button>
            ))}
          </div>
  
          {/* Request List */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200 hidden sm:table-header-group">
                <tr>
                  <th className="p-4 text-left">Business Name</th>
                  <th className="p-4 text-left">Manager</th>
                  <th className="p-4 text-left">Submission Date</th>
                  <th className="p-4 text-left">Description</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(request => (
                  <React.Fragment key={request.id}>
                    {/* Mobile View */}
                    <tr className="sm:hidden border-b" onClick={() => openRequestModal(request)}>
                      <td className="p-4">
                        <div className="flex justify-between items-center cursor-pointer">
                          <div>
                            <div className="font-bold">{request['businessname']}</div>
                            <div className="text-sm text-gray-600">{request['managername']}</div>
                          </div>
                          <span 
                            className={`px-3 py-1 rounded-full text-xs font-semibold 
                              ${request.status === VS.Pending ? 'bg-yellow-100 text-yellow-800' : 
                                request.status === VS.Approved ? 'bg-green-100 text-green-800' : 
                                'bg-red-100 text-red-800'}`}
                          >
                            {request.status == VS.Pending ? 'Pending' : request.status == VS.Approved ? 'Approved' : 'Rejected'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-2">{request['businessindustry']}</div>
                        <div className="text-sm text-gray-500 mt-1">{request['submissiondate']}</div>
                        <div className="text-sm text-gray-500">{request['manageremail']}</div>
                      </td>
                    </tr>
  
                    {/* Desktop View */}
                    <tr 
                      className="border-b hover:bg-gray-50 transition-colors hidden sm:table-row cursor-pointer" onClick={() => openRequestModal(request)}
                    >
                      <td className="p-4 font-medium">{request['businessname']}</td>
                      <td className="p-4">
                        <div>{request['managername']}</div>
                        <div className="text-sm text-gray-500">{request['manageremail']}</div>
                      </td>
                      <td className="p-4">{request['submissiondate']}</td>
                      <td className="p-4 text-sm text-gray-600">{request['businessindustry']}</td>
                      <td className="p-4">
                        <span 
                          className={`px-3 py-1 rounded-full text-xs font-semibold 
                            ${request.status === VS.Pending ? 'bg-yellow-100 text-yellow-800' : 
                              request.status === VS.Approved ? 'bg-green-100 text-green-800' : 
                              'bg-red-100 text-red-800'}`}
                        >
                          {request.status == VS.Pending ? 'Pending' : request.status == VS.Approved ? 'Approved' : 'Rejected'}
                        </span>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
  
          {/* Empty State */}
          {filteredRequests.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No business requests found
            </div>
          )}
          {currentRequest && <BusinessRequestModal request={currentRequest} onClose={closeRequestModal} onAccept={acceptRequest} onReject={rejectRequest} />}
        </div>
      </div>
    );
};

export default BusinessRequests;
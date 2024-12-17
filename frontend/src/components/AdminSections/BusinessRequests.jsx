import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Box, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

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
                  {request.businessName}
                </h3>
                <Box sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" gutterBottom>
                                Personal Information
                            </Typography>
                            <Typography variant="body1">
                                <strong>First Name: </strong>{request.firstName}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Last Name: </strong>{request.lastName}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Birthdate: </strong>{request.birthdate}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Address: </strong>{request.address}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Email: </strong>{request.email}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Phone: </strong>{request.phone}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" gutterBottom>
                                Business Information
                            </Typography>
                            <Typography variant="body1">
                                <strong>Business Name: </strong>{request.businessName}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Business Email: </strong>{request.businessEmail}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Business Phone: </strong>{request.businessPhone}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Country: </strong>{request.businessCountry}
                            </Typography>
                            <Typography variant="body1">
                                <strong>City: </strong>{request.businessCity}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Street: </strong>{request.businessStreet}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Website: </strong>{request.businessWebsite}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Industry: </strong>{request.businessIndustry}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Documents
                            </Typography>
                            <Typography variant="body1">
                                <strong>Business Manager's ID: </strong><Link to={request.managerID.url} target="_blank" rel="noreferrer" className='text-blue-700'>Click Here</Link>
                            </Typography>
                            <Typography variant="body1">
                                <strong>Business Manager's Photo: </strong><Link to={request.managerPhoto.url} target="_blank" rel="noreferrer" className='text-blue-700'>Click Here</Link>
                            </Typography>
                            <Typography variant="body1">
                                <strong>Business Logo: </strong><Link to={request.businessLogo.url} target="_blank" rel="noreferrer" className='text-blue-700'>Click Here</Link>
                            </Typography>
                            <Typography variant="body1">
                                <strong>Business Registration Document: </strong><Link to={request.businessRegistrationDoc.url} target="_blank" rel="noreferrer" className='text-blue-700'>Click Here</Link>
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
              </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:col-start-2 sm:text-sm"
                onClick={onAccept}
              >
                Accept
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
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
    const [activeTab, setActiveTab] = useState('pending');

    const [currentRequest, setCurrentRequest] = useState(null);
  
    // Filter and search logic
    const filteredRequests = mockBusinessRequests.filter(request => 
      (activeTab === 'pending' ? request.status === 'Pending' : 
       activeTab === 'approved' ? request.status === 'Approved' : 
       request.status === 'Rejected') &&
      (request.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       request.managerName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  
    const openRequestModal = (request) => {
        setCurrentRequest(request);
    };

    const closeRequestModal = () => {
        setCurrentRequest(null);
    }

    const acceptRequest = (request) => {
        console.log('Request accepted:', request);
    }

    const rejectRequest = (request) => {
        console.log('Request rejected:', request);
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
            {['pending', 'approved', 'rejected'].map(tab => (
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
                            <div className="font-bold">{request.businessName}</div>
                            <div className="text-sm text-gray-600">{request.managerName}</div>
                          </div>
                          <span 
                            className={`px-3 py-1 rounded-full text-xs font-semibold 
                              ${request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                request.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                                'bg-red-100 text-red-800'}`}
                          >
                            {request.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-2">{request.description}</div>
                        <div className="text-sm text-gray-500 mt-1">{request.submissionDate}</div>
                        <div className="text-sm text-gray-500">{request.managerEmail}</div>
                      </td>
                    </tr>
  
                    {/* Desktop View */}
                    <tr 
                      className="border-b hover:bg-gray-50 transition-colors hidden sm:table-row cursor-pointer" onClick={() => openRequestModal(request)}
                    >
                      <td className="p-4 font-medium">{request.businessName}</td>
                      <td className="p-4">
                        <div>{request.managerName}</div>
                        <div className="text-sm text-gray-500">{request.managerEmail}</div>
                      </td>
                      <td className="p-4">{request.submissionDate}</td>
                      <td className="p-4 text-sm text-gray-600">{request.description}</td>
                      <td className="p-4">
                        <span 
                          className={`px-3 py-1 rounded-full text-xs font-semibold 
                            ${request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                              request.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                              'bg-red-100 text-red-800'}`}
                        >
                          {request.status}
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
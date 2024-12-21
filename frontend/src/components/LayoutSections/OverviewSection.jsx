import React, { useContext, useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, useTheme, LinearProgress, List, ListItem, Chip } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { Crown, TrendingUp, Users, Clock } from 'lucide-react';
import fetchAPI from '../../utils/fetchAPI';
import UserContext from '../../context/UserContext';
import { EmployeeRoles } from '../../utils/Enums';

const OverviewSection = () => {
  const theme = useTheme();
  const [dailyCustomers, setDailyCustomers] = useState([]);
  const [customerRevenueMetrics, setCustomerRevenueMetrics] = useState([]);
  const [dailyProfit, setDailyProfit] = useState([]);
  const [topExecutors, setTopExecutors] = useState([]);
  const [topOpeners, setTopOpeners] = useState([]);
  const [rank, setRank] = useState(0);
  const [targets, setTargets] = useState([]);

  const { employee } = useContext(UserContext);

  // Fetch customers from API
  useEffect(() => {
    const token = localStorage.getItem('token');


    fetchAPI('/customer/metrics', 'GET', null, token).then((data) => {
      console.log(data);
      setDailyCustomers(data);
    }).catch((error) => {
      console.error("Error fetching metrics:", error);
    }
    );

    fetchAPI('/customer/metrics/revenue', 'GET', null, token).then((data) => {
      console.log(data);
      setCustomerRevenueMetrics(data);
    }).catch((error) => {
      console.error("Error fetching metrics:", error);
    }
    );

    fetchAPI('/finance/metrics', 'GET', null, token).then((data) => {
      console.log(data);
      setDailyProfit(data);
    }).catch((error) => {
        console.error("Error fetching metrics:", error);
        }
    );

    fetchAPI('/employee/metrics/top', 'GET', null, token).then((data) => {
        console.log(data);
        setTopExecutors(data.executors);
        setTopOpeners(data.openers);
        }
    ).catch((error) => {
        console.error("Error fetching metrics:", error);
        }
    );

    fetchAPI('/employee/metrics/rank/'+employee.role, 'GET', null, token).then((data) => {
        console.log(data);
        setRank(data.rank);
        }
    ).catch((error) => {
        console.error("Error fetching metrics:", error);
        }
    );

    fetchAPI(`/target/employee/${employee.id}/active/`, 'GET', null, token).then((data) => {
        console.log(data);
        setTargets(data);
        }
    ).catch((error) => {
        console.error("Error fetching metrics:", error);
        }
    );

  }, []);

  const getRoleName = (role) => {
    switch (role) {
        case EmployeeRoles.DealExecutor:
            return "Deal Executor";
        case EmployeeRoles.DealOpener:
            return "Deal Opener";
        case EmployeeRoles.Manager:
            return "Business Manager";
        default:
            return "Employee";
    }
};

  // Helper function to calculate days until deadline
  const getDaysUntil = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };


  const getProgressColor = (progress) => {
    if (progress >= 90) return '#22c55e';
    if (progress >= 70) return '#3b82f6';
    return '#f59e0b';
  };

  const getDeadlineColor = (deadline) => {
    const daysLeft = getDaysUntil(deadline);
    if (daysLeft <= 3) return '#ef4444';
    if (daysLeft <= 7) return '#f59e0b';
    return '#6b7280';
  };

  const formatDeadline = (deadline) => {
    const daysLeft = getDaysUntil(deadline);
    if (daysLeft < 0) return 'Overdue';
    if (daysLeft === 0) return 'Due today';
    if (daysLeft === 1) return 'Due tomorrow';
    if (daysLeft <= 7) return `${daysLeft} days left`;
    return new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Box sx={{ p: 6 }}>
      <Grid container spacing={3}>
        {/* Targets Progress Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                My Targets
              </Typography>
            </Box>
            <CardContent sx={{ 
              maxHeight: 200, 
              overflow: 'auto', 
              '&::-webkit-scrollbar': { width: '8px' }, 
              '&::-webkit-scrollbar-thumb': { 
                backgroundColor: '#888', 
                borderRadius: '4px' 
              }, 
              '&::-webkit-scrollbar-thumb:hover': { 
                backgroundColor: '#555' 
              }
            }}>
              <List sx={{ p: 0 }}>
                {targets.map((target, index) => {
                  
                  const targetProgress = Math.floor((target.progress / target.goal) * 100);
                  
                  return (
                  <ListItem key={index} sx={{ display: 'block', px: 0, py: 1 }}>
                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle2">
                          {target.description}
                        </Typography>
                        <Chip
                          icon={<Clock size={14} />}
                          label={formatDeadline(target.deadline)}
                          size="small"
                          sx={{
                            backgroundColor: `${getDeadlineColor(target.deadline)}15`,
                            color: getDeadlineColor(target.deadline),
                            '& .MuiChip-icon': { 
                              color: 'inherit',
                              marginLeft: '8px'
                            },
                            fontSize: '0.75rem',
                            height: '24px'
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {target.progress.toLocaleString()} / {target.goal.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {targetProgress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(targetProgress, 100)}
                        sx={{
                          height: 6,
                          borderRadius: 1,
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getProgressColor(targetProgress),
                          },
                        }}
                      />
                    </Box>
                  </ListItem>
                )})
              }
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Deal Makers Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                Top Employees
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, pl: 2 }}>
                <Crown size={32} color="#FFD700" />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{employee.role != EmployeeRoles.Manager ? `#${rank}` : ''} {getRoleName(employee.role)}</Typography>
                  <Typography color="text.secondary" variant="body2">{employee.role != EmployeeRoles.Manager ? `My Overall Rank` : ''}</Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                    Top 5 Deal Openers
                  </Typography>
                  {topOpeners.map((opener, index) => (
                    <Box
                      key={opener.name}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography>{index + 1}. {opener.name}</Typography>
                      <Typography sx={{ fontWeight: 500 }}>{opener.deals} deals</Typography>
                    </Box>
                  ))}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                    Top 5 Deal Executors
                  </Typography>
                  {topExecutors.map((executor, index) => (
                    <Box
                      key={executor.name}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography>{index + 1}. {executor.name}</Typography>
                      <Typography sx={{ fontWeight: 500 }}>{executor.deals} deals</Typography>
                    </Box>
                  ))}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Profit Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                Daily Profit
              </Typography>
            </Box>
            <CardContent>
              <Box sx={{ height: 256 }}>
                <LineChart
                dataset={dailyProfit}
                  xAxis={[{ 
                    label: 'Date',
                    dataKey: 'date',
                    scaleType: 'band',
                    valueFormatter: (v) => new Date(v).toLocaleDateString(),
                  }]}
                  series={[
                    {
                      dataKey: 'profit',
                      color: '#2563eb',
                      label: 'Profit'
                    }
                  ]}
                  height={256}
                  sx={{
                    '.MuiLineElement-root': {
                      strokeWidth: 2,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Customers Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                Daily Customers
              </Typography>
            </Box>
            <CardContent>
              <Box sx={{ height: 256 }}>
                <LineChart
                dataset={dailyCustomers}
                xAxis={[{
                    id: 'Date',
                    dataKey: 'reg_date',
                    label: 'Date',
                    scaleType: 'band',
                    valueFormatter: (v) => new Date(v).toLocaleDateString(),
                }]}
                  series={[
                    {
                        dataKey: 'customers_count',
                        name: 'Customers',
                        label: 'Customers',
                      color: '#16a34a',
                    }
                  ]}
                  height={256}
                  sx={{
                    '.MuiLineElement-root': {
                      strokeWidth: 2,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Customers by Revenue */}
        <Grid item xs={12}>
          <Card>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                Top Customers by Revenue
              </Typography>
            </Box>
            <CardContent>
              <Box sx={{ height: 256 }}>
                <BarChart
                dataset={customerRevenueMetrics}
                series={[{
                    dataKey: 'total_revenue',
                    name: 'Revenue',
                    label: 'Revenue',
                    color: '#8884d8',
                  }]}

                  xAxis={[{
                    id: 'Name',
                    dataKey: 'name',
                    scaleType: 'band',
                    valueFormatter: (v) => v.length > 10 ? v.substring(0, 10) + '...' : v,
                    labelStyle: {
                      maxWidth: 50,
                      whiteSpace: 'break-spaces',
                      overflowWrap: 'break-word',
                    }
                  }]}
                  
                  height={256}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OverviewSection;
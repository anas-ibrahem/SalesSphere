import React from 'react';
import { Box, Card, CardContent, Typography, Grid, useTheme, LinearProgress, List, ListItem, Chip } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { Crown, TrendingUp, Users, Clock } from 'lucide-react';

const OverviewSection = () => {
  const theme = useTheme();

  // Helper function to calculate days until deadline
  const getDaysUntil = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Sample targets data with deadlines
  const targets = [
    { 
      title: "Q4 Sales Target", 
      current: 850000, 
      target: 1000000,
      progress: 85,
      deadline: '2024-12-31'
    },
    { 
      title: "New Customers Goal", 
      current: 45, 
      target: 50,
      progress: 90,
      deadline: '2024-12-25'
    },
    { 
      title: "Revenue Per Deal", 
      current: 28000, 
      target: 40000,
      progress: 70,
      deadline: '2024-12-28'
    },
    { 
      title: "Customer Satisfaction", 
      current: 4.2, 
      target: 4.5,
      progress: 93,
      deadline: '2024-12-23'
    },
    { 
      title: "Deal Closure Rate", 
      current: 65, 
      target: 75,
      progress: 87,
      deadline: '2025-01-15'
    },
    { 
      title: "Team Collaboration Score", 
      current: 82, 
      target: 100,
      progress: 82,
      deadline: '2024-12-24'
    }
  ];

  const profitData = [
    { date: '2024-12-15', profit: 5000 },
    { date: '2024-12-16', profit: 6200 },
    { date: '2024-12-17', profit: 7800 },
    { date: '2024-12-18', profit: 6500 },
    { date: '2024-12-19', profit: 8900 },
    { date: '2024-12-20', profit: 9200 },
    { date: '2024-12-21', profit: 8400 },
  ];

  const customersData = [
    { date: '2024-12-15', customers: 120 },
    { date: '2024-12-16', customers: 145 },
    { date: '2024-12-17', customers: 162 },
    { date: '2024-12-18', customers: 158 },
    { date: '2024-12-19', customers: 175 },
    { date: '2024-12-20', customers: 182 },
    { date: '2024-12-21', customers: 168 },
  ];

  const topCustomers = [
    { name: 'Tech Corp', revenue: 125000 },
    { name: 'Global Industries', revenue: 98000 },
    { name: 'StartUp Inc', revenue: 76000 },
  ];

  const dealOpeners = [
    { name: 'John Smith', deals: 45 },
    { name: 'Sarah Johnson', deals: 42 },
    { name: 'Mike Brown', deals: 38 },
  ];

  const dealExecutors = [
    { name: 'Emma Davis', deals: 52 },
    { name: 'Tom Wilson', deals: 48 },
    { name: 'Lisa Anderson', deals: 45 },
  ];

  const myRank = 5;

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
                {targets.map((target, index) => (
                  <ListItem key={index} sx={{ display: 'block', px: 0, py: 1 }}>
                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle2">
                          {target.title}
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
                          {target.current.toLocaleString()} / {target.target.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {target.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={target.progress}
                        sx={{
                          height: 6,
                          borderRadius: 1,
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getProgressColor(target.progress),
                          },
                        }}
                      />
                    </Box>
                  </ListItem>
                ))}
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
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>#{myRank} Deal Executer</Typography>
                  <Typography color="text.secondary" variant="body2">My Overall Rank</Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                    Top Deal Openers
                  </Typography>
                  {dealOpeners.map((opener, index) => (
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
                    Top Deal Executors
                  </Typography>
                  {dealExecutors.map((executor, index) => (
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
                  xAxis={[{ 
                    data: profitData.map(item => item.date),
                    scaleType: 'band'
                  }]}
                  series={[
                    {
                      data: profitData.map(item => item.profit),
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
                  xAxis={[{ 
                    data: customersData.map(item => item.date),
                    scaleType: 'band'
                  }]}
                  series={[
                    {
                      data: customersData.map(item => item.customers),
                      color: '#16a34a',
                      label: 'Customers'
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
                  xAxis={[{ 
                    data: topCustomers.map(customer => customer.name),
                    scaleType: 'band'
                  }]}
                  series={[
                    {
                      data: topCustomers.map(customer => customer.revenue),
                      color: '#8b5cf6',
                      label: 'Revenue'
                    }
                  ]}
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
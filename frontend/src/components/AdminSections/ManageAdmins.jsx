import React, { useEffect, useState } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    TextField, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    Select,
    MenuItem,
    IconButton,
    Typography,
    Box,
    Grid
} from '@mui/material';
import { 
    Add as AddIcon, 
    Delete as DeleteIcon, 
    Edit as EditIcon 
} from '@mui/icons-material';
import fetchAPI from '../../utils/fetchAPI';
import { AdminPrivileges as AP } from '../../utils/Enums';
import toast from 'react-hot-toast';

const ManageAdmins = () => {
    const [admins, setAdmins] = useState([]);

    const [openAddAdmin, setOpenAddAdmin] = useState(false);
    const [openEditEmailPassword, setOpenEditEmailPassword] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ id:-1, email: '', password: '' });
    const [selectedAdmin, setSelectedAdmin] = useState(null);


    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        fetchAPI('/admin/', 'GET', null, token)
            .then(data => {
                if (data && !data.error) {
                    setAdmins(data);
                }
            });
    }, [openAddAdmin, openEditEmailPassword]);


    const handleAddAdmin = () => {
        if (newAdmin.username && newAdmin.email && newAdmin.password) {
            const token = localStorage.getItem('admin_token');
            fetchAPI('/admin/', 'POST', newAdmin, token).then(data => {
                if (data && !data.error) {
                    toast.success('Admin added successfully');
                    setOpenAddAdmin(false);
                }
                else {
                    toast.error(data.error);
                }
            }).catch(error => {
                setOpenAddAdmin(false);
                toast.error('Failed to add admin');
            }
            );
        }
    };

    const handleDeleteAdmin = (id) => {
        const token = localStorage.getItem('admin_token');
        fetchAPI(`/admin/${id}`, 'DELETE', null, token).then(data => {
            if (data && !data.error) {
                setAdmins(admins.filter(admin => admin.id !== id));
                toast.success('Admin deleted successfully');
            }
            else {
                toast.error(data.error);
            }
        }).catch(error => {
            toast.error('Failed to delete admin');
        });
    };

    const handleChangeEmailPassword = () => {
        if (selectedAdmin && newAdmin.email) {
            const token = localStorage.getItem('admin_token');
            fetchAPI(`/admin/`, 'PATCH', newAdmin, token).then(data => {
                if (data && !data.error) {
                    toast.success('Email/Password changed successfully');
                    setOpenEditEmailPassword(false);
                }
                else {
                    toast.error(data.error);
                }
            }).catch(error => {
                setOpenEditEmailPassword(false);
                toast.error('Failed to change email/password');
            });
        }
    };

    return (
        <Box 
            sx={{ 
                margin: 'auto', 
                padding: 2, 
                borderRadius: 2 
            }}
        >
            <Typography variant="h4" gutterBottom>
                Admin Management
            </Typography>

            {/* Add Admin Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ backgroundColor: 'var(--secondary-accent)'}}
                    startIcon={<AddIcon />} 
                    onClick={() => setOpenAddAdmin(true)}
                >
                    Add Admin
                </Button>
            </Box>

            {/* Admin List */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>privilege</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {admins.map((admin) => (
                            <TableRow key={admin.id}>
                                <TableCell>{admin.username}</TableCell>
                                <TableCell>{admin.email}</TableCell>
                                <TableCell>{admin.privilege == AP.Super ? "Master" : "Normal"}</TableCell>
                                <TableCell align="right">
                                    <IconButton 
                                        sx={{ color: 'var(--secondary-accent)' }}
                                        onClick={() => {
                                            setSelectedAdmin(admin);
                                            setNewAdmin({ ...newAdmin, email: admin.email, id: admin.id });
                                            setOpenEditEmailPassword(true);
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    {
                                        admin.privilege !== AP.Super &&
                                        <IconButton 
                                            color="error" 
                                            onClick={() => handleDeleteAdmin(admin.id)}
                                        >
                                        <DeleteIcon />
                                    </IconButton>
                                    }
                                    
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Admin Dialog */}
            <Dialog open={openAddAdmin} onClose={() => setOpenAddAdmin(false)}>
                <DialogTitle>Add New Admin</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                label="Username"
                                fullWidth
                                value={newAdmin.username}
                                onChange={(e) => setNewAdmin({...newAdmin, username: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                label="Email"
                                fullWidth
                                value={newAdmin.email}
                                onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                label="Password"
                                type="password"
                                fullWidth
                                value={newAdmin.password}
                                onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                            />
                        </Grid>
                        {/* <Grid item xs={12}>
                            <Select
                                value={newAdmin.privilege}
                                onChange={(e) => setNewAdmin({...newAdmin, privilege: e.target.value})}
                                fullWidth
                                margin="dense"
                            >
                                <MenuItem value={0}>Normal Admin</MenuItem>
                                <MenuItem value={1}>Master Admin</MenuItem>
                            </Select>
                        </Grid> */}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddAdmin(false)}>Cancel</Button>
                    <Button onClick={handleAddAdmin} color="primary">Add</Button>
                </DialogActions>
            </Dialog>

            {/* Change Email/Password Dialog */}
            <Dialog open={openEditEmailPassword} onClose={() => setOpenEditEmailPassword(false)}>
                <DialogTitle>Change Email/Password</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                label="New Email"
                                fullWidth
                                value={newAdmin.email}
                                onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                label="New Password (Leave empty for no change)"
                                type="password"
                                fullWidth
                                value={newAdmin.password}
                                onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditEmailPassword(false)}>Cancel</Button>
                    <Button onClick={handleChangeEmailPassword} color="primary">Change</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManageAdmins;
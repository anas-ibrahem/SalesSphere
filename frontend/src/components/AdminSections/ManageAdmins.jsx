import React, { useState } from 'react';
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

const ManageAdmins = () => {
    const [admins, setAdmins] = useState([
        { id: 1, username: 'john.doe', email: 'john.doe@example.com', role: 'master' },
        { id: 2, username: 'jane.smith', email: 'jane.smith@example.com', role: 'normal' }
    ]);

    const [openAddAdmin, setOpenAddAdmin] = useState(false);
    const [openEditEmailPassword, setOpenEditEmailPassword] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ username: '', email: '', role: 'normal', password: '' });
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    const handleAddAdmin = () => {
        if (newAdmin.username && newAdmin.email && newAdmin.password) {
            setAdmins([...admins, { 
                id: admins.length + 1, 
                username: newAdmin.username, 
                email: newAdmin.email,
                role: newAdmin.role 
            }]);
            setOpenAddAdmin(false);
            setNewAdmin({ username: '', email: '', role: 'normal', password: '' });
        }
    };

    const handleDeleteAdmin = (id) => {
        setAdmins(admins.filter(admin => admin.id !== id));
    };

    const handleChangeEmailPassword = () => {
        if (selectedAdmin && newAdmin.email && newAdmin.password) {
            setAdmins(admins.map(admin => 
                admin.id === selectedAdmin.id 
                ? { ...admin, email: newAdmin.email, password: newAdmin.password } 
                : admin
            ));
            setOpenEditEmailPassword(false);
            setNewAdmin({ username: '', email: '', role: 'normal', password: '' });
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
                            <TableCell>Role</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {admins.map((admin) => (
                            <TableRow key={admin.id}>
                                <TableCell>{admin.username}</TableCell>
                                <TableCell>{admin.email}</TableCell>
                                <TableCell>{admin.role}</TableCell>
                                <TableCell align="right">
                                    <IconButton 
                                        sx={{ color: 'var(--secondary-accent)' }}
                                        onClick={() => {
                                            setSelectedAdmin(admin);
                                            setNewAdmin({ ...newAdmin, email: admin.email });
                                            setOpenEditEmailPassword(true);
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                        color="error" 
                                        onClick={() => handleDeleteAdmin(admin.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
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
                        <Grid item xs={12}>
                            <Select
                                value={newAdmin.role}
                                onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                                fullWidth
                                margin="dense"
                            >
                                <MenuItem value="normal">Normal Admin</MenuItem>
                                <MenuItem value="master">Master Admin</MenuItem>
                            </Select>
                        </Grid>
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
                                label="New Password"
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
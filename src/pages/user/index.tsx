import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Table = () => {
  const [data, setData] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchRole, setSearchRole] = useState('');
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:9000/clients');
      setData(response.data);
    } catch (error) {
      console.error('There was an error fetching the data:', error);
    }
  };

  const deleteUser = async (_id) => {
    try {
      await axios.delete(`http://localhost:9000/client/${_id}`);
      fetchData();
      toast.info('User deleted successfully');
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedItemId(null);
    }
  };

  const handleVerification = async (id) => {
    try {
      await axios.put(`http://localhost:9000/clients/${id}`, { role: 'admin' });
      const updatedUser = data.find((item) => item._id === id);
      if (updatedUser) {
        setUser(updatedUser);
        toast.success('Verification status updated to "valide"');
      }
      router.push('/user');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = (itemId) => {
    setSelectedItemId(itemId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteUser(selectedItemId);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedItemId(null);
  };

  const handleSearchEmailChange = (event) => {
    setSearchEmail(event.target.value);
  };

  const handleSearchRoleChange = (event) => {
    setSearchRole(event.target.value);
  };

  const filteredData = data.filter((item) =>
    item.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
    item.role.toLowerCase().includes(searchRole.toLowerCase())
  );

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  return (
    <>
      <div>
        <input
          className='searchUser'
          type="text"
          placeholder="Search by email"
          value={searchEmail}
          onChange={handleSearchEmailChange}
        />
        <select
          className='searchAdmin'
          value={searchRole}
          onChange={handleSearchRoleChange}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      <table className="pro-table ">
        <thead>
          <tr>
            <th>first_name</th>
            <th>last_name</th>
            <th>email</th>
            <th>phone</th>
            <th>address</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item._id}>
              <td>{item.first_name}</td>
              <td>{item.last_name}</td>
              <td>{item.email}</td>
              <td>{item.phone}</td>
              <td>{item.address}</td>
              <td>{item.role}</td>
              <td>
                <Button
                  className='detail'
                  startIcon={<CheckCircleOutlineIcon />}
                  variant="contained"
                  color="primary"
                  onClick={() => handleVerification(item._id)}
                >
                  Add Admin
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteClick(item._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Table;

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

const Table = () => {
  const [data, setData] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const { isLoggedIn } = useAuth();
  const router = useRouter();



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
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedItemId(null);
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

  return (
    <>
      <table className="pro-table pro-tablee">
        <thead>
          <tr>
            <th>first_name</th>
            <th>last_name</th>
            <th>email</th>
            <th>phone</th>
            <th>address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.first_name}</td>
              <td>{item.last_name}</td>
              <td>{item.email}</td>
              <td>{item.phone}</td>
              <td>{item.address}</td>
              <td>
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

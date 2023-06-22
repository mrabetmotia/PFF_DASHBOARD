import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { toast } from 'react-toastify';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ADD from './add';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

const TableCoach = () => {
  const [data, setData] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCoachId, setSelectedCoachId] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleAddCancel = () => {
    setAddDialogOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:9000/coachs');
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = (coachId) => {
    setSelectedCoachId(coachId);
    setDeleteDialogOpen(true);
  };

  const handleViewClick = (coachId) => {
    router.push(`/coach/detail/${coachId}`);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(`http://localhost:9000/Coachs/${selectedCoachId}`);
      if (response.status === 200) {
        toast.success('Coach deleted successfully');
        fetchData(); // Refresh data after deletion
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('There has been a problem with the deletion:', error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedCoachId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedCoachId(null);
  };

  const getStatusColor = (verification) => {
    return verification === 'valide' ? 'green' : 'red';
  };
  
  return (
    <>
      <Button
        startIcon={<SaveIcon />}
        variant="contained"
        color="primary"
        className="btnaddcoach"
        onClick={handleAddClick}
      >
        Add Coach
      </Button>

      <Dialog open={addDialogOpen} onClose={handleAddCancel}>
        <DialogContent>
          <ADD />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddCancel} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <table className="pro-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Experience</th>
            <th>Description</th>
            <th>Speciality</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>
                <img src={item.image} alt={item.name} />
              </td>
              <td>{item.nom}</td>
              <td>{item.email}</td>
              <td>{item.phone}</td>
              <td>{item.experiance}</td>
              <td>{item.description}</td>
              <td>{item.spesialite}</td>
              <td style={{ color: getStatusColor(item.verification) }}>{item.verification}</td>
              <td>
                <Button
                  variant="contained"
                  className="detail"
                  color="primary"
                  startIcon={<VisibilityIcon />}
                  onClick={() => handleViewClick(item._id)}
                >
                  View
                </Button>
                <Link href="/coach/up" as={`/coach/${item._id}`} className="detail">
                  <Button variant="contained" color="primary" startIcon={<EditIcon />}>
                    Detail
                  </Button>
                </Link>
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
        <DialogTitle>Delete Coach</DialogTitle>
        <DialogContent>Are you sure you want to delete this coach?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Link href="/coach/add">
        <Button color="primary">Add</Button>
      </Link>
    </>
  );
};

export default TableCoach;

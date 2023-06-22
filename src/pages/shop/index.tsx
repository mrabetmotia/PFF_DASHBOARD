import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Dns from '@mui/icons-material/Dns';
import ADD from './add';

const Table = () => {
  const [data, setData] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

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
      const response = await axios.get('http://localhost:9000/Product');
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async (_id) => {
    try {
      await axios.delete(`http://localhost:9000/Products/${_id}`);
      fetchData();
      toast.success('Product deleted successfully');
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
    deleteProduct(selectedItemId);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedItemId(null);
  };

  return (
    <>
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

      <Button
        startIcon={<AddIcon  />}
        variant="contained"
        color="secondary"
        className="btnaddcoach"
        onClick={handleAddClick}
      >
        Add Product
      </Button>
      <Button
        startIcon={< Dns/>}
        variant="contained"
        color="secondary"
        className="btnaddcoach"
        href="/type"
      >
        Liste Type
      </Button>
      <table className="pro-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Kg</th>
            <th>Price</th>
            <th>Type</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>
                <img src={item.image} alt={item.image} />
              </td>
              <td>{item.kg}</td>
              <td>{item.price}</td>
              <td>{item.type.name}</td>
              <td>{item.description}</td>
              <td>
                <Link href="/shop/up" as={`/shop/${item._id}`} className='detail'>
                  <Button variant="contained" color="primary" startIcon={<SaveIcon />}>
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
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Table;


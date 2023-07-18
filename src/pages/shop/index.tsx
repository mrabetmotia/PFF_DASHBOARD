import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import Head from "next/head";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Dns from "@mui/icons-material/Dns";
import ADD from "./add";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

interface Shop {
  _id: string;
  type: string | { name: string };
  nom: string;
  name: string;
  lien: string;
  description: string;
  price: string;
  kg: string;
  image: string;
}
const Table = () => {
  const [data, setData] = useState<Shop[]>([]);
  const [types, setTypes] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<Shop | null>(null);

  const handleDetailClick = (item:Shop) => {
    setSelectedDetailItem(item);
    setDetailDialogOpen(true);
  };

  const handleDetailCancel = () => {
    setDetailDialogOpen(false);
    setSelectedDetailItem(null);
  };

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleAddCancel = () => {
    setAddDialogOpen(false);
  };

  useEffect(() => {
    fetchData();
    fetchTypes();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:9000/Product");
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTypes = async () => {
    try {
      const response = await axios.get("http://localhost:9000/type");
      setTypes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async (_id:any) => {
    try {
      await axios.delete(`http://localhost:9000/Products/${_id}`);
      fetchData();
      toast.info("Product deleted successfully");
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    } finally {
      setDeleteDialogOpen(false);
      setSelectedItemId(null);
    }
  };

  const handleDeleteClick = (itemId:any) => {
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

  const handleTypeChange = (event:any) => {
    setTypeFilter(event.target.value);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  interface EditeProps {
    item: Shop | null;
  }

  const Edite: React.FC<EditeProps> = ({ item }) => {
    if (!item) return <div>No item selected</div>;
  
    return (
      <div>
        <h2>{item.name}</h2>
        <p>Price : {item.price} DT</p>
        <img src={item.image}  alt={item.nom} />
      </div>
    );
  };

  const filteredData = typeFilter
    ? data.filter(item => item.type?.name === typeFilter)
    : data;

  return (
    < center>
      <Head>
        <title>Liste de produit</title>
      </Head>
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
        startIcon={<AddIcon />}
        variant="contained"
        color="secondary"
        className="btnaddcoach"
        onClick={handleAddClick}
      >
        Add Product
      </Button>
      <FormControl variant="outlined" className="filterProduct">
        <InputLabel id="type-filter-label">Type</InputLabel>
        <Select
          labelId="type-filter-label"
          value={typeFilter}
          onChange={handleTypeChange}
          label="Type"
        >
          <MenuItem value="">
            <em>All Product</em>
          </MenuItem>
          {types.map((type) => (
            <MenuItem key={type._id} value={type.name}>{type.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        startIcon={<Dns />}
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
          {filteredData.map((item) => (
            <tr key={item._id}>
              <td onClick={() => handleDetailClick(item)}>{item.name}</td>
              <td onClick={() => handleDetailClick(item)}>
                <img src={item.image} alt={item.image} />
              </td>
              <td onClick={() => handleDetailClick(item)}>{item.kg}</td>
              <td onClick={() => handleDetailClick(item)}>{item.price}</td>
              <td onClick={() => handleDetailClick(item)}>{typeof item.type === 'string' ? item.type : item.type.name}</td>


              <td onClick={() => handleDetailClick(item)}>{item.description}</td>
              <td >
                <Link
                  href="/shop/up"
                  as={`/shop/${item._id}`}
                  className="detail"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                  >
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


      <Dialog open={detailDialogOpen} onClose={handleDetailCancel}>
        <DialogContent>
          <Edite item={selectedDetailItem} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailCancel} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      
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
    </ center>
  );
};

export default Table;

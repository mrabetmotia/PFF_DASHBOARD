import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { toast } from "react-toastify";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ADD from "./add";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
interface Excercice {
  _id: string;
  type: string;
  nom: string;
  name: string;
  lien: string;
}

const Table = () => {
  const [data, setData] = useState<Excercice[]>([]);
  const [filterType, setFilterType] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<Excercice | null>(null);

  const handleDetailClick = (item:Excercice) => {
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
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:9000/excercice");
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteItem = async (itemId:any) => {
    try {
      const response = await axios.delete(
        `http://localhost:9000/excercice/${itemId}`
      );
      if (response.status === 200) {
        toast.info("Item deleted successfully");
        fetchData();
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("There has been a problem with the deletion:", error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedItemId(null);
    }
  };


  

  const handleFilterChange = (event:any) => {
    setFilterType(event.target.value);
  };

  const filteredData = filterType
    ? data.filter((item) => item.type === filterType)
    : data;

  const handleDeleteClick = (itemId:any) => {
    setSelectedItemId(itemId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteItem(selectedItemId);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedItemId(null);
  };

  interface EditeProps {
    item: Excercice | null;
  }
  
  const Edite: React.FC<EditeProps> = ({ item }) => {
    if (!item) return <div>No item selected</div>;
  
    return (
      <div>
        <h2>{item.nom}</h2>
        <p>Type: {item.type}</p>
        <img src={`/exercice/${item.lien}`} alt={item.nom} />
      </div>
    );
  };
  

  
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  return (
    <>
      <div className="filtreEx">
        <label htmlFor="filter">Filter by Type:</label>
        <select id="filter" value={filterType} onChange={handleFilterChange}>
          <option value="">All Types</option>
          <option value="abdo">abdo</option>
          <option value="chest">chest</option>
          <option value="back">back</option>
          <option value="bra">bra</option>
          <option value="shoulders">shoulders</option>
          <option value="cardio">cardio</option>
          <option value="jomb">jomb</option>
        </select>
      </div>

      <Button
        startIcon={<SaveIcon />}
        variant="contained"
        color="primary"
        className="btnaddEx"
        onClick={handleAddClick}
      >
        Add Excercice
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
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item._id}  >
              <td onClick={() => handleDetailClick(item)}>
                <img src={`/exercice/${item.lien}`} alt={item.name} />
              </td>
              <td onClick={() => handleDetailClick(item)}>{item.nom}</td>
              <td onClick={() => handleDetailClick(item)}>{item.type}</td>
              <td >
              <Link
                  href="/excercice/up"
                  as={`/excercice/${item._id}`}
                  className="detail"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                  >
                    Update
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
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this item?
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

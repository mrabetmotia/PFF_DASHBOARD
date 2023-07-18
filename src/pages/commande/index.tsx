import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

interface ICommande {
  _id: string;
  image_produit: string;
  name_produit: string;
  name_user: string;
  name: string;
  email: string;
  phone: string;
  totalPrice: number;
  verification: string;
}

const CommandeTable = () => {
  const [data, setData] = useState<ICommande[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [searchValidation, setSearchValidation] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:9000/Commandes");
      setData(response.data);
    } catch (error) {
      console.error("There was an error fetching the data:", error);
    }
  };

  const deleteCommande = async (_id:any) => {
    try {
      await axios.delete(`http://localhost:9000/Commandes/${_id}`);
      fetchData();
      toast.info("Commande deleted successfully");
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
    deleteCommande(selectedItemId);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedItemId(null);
  };
  const getStatusColor = (verification:any) => {
    return verification === "valide" ? "green" : "red";
  };

  const handleSearchValidationChange = (event:any) => {
    setSearchValidation(event.target.value);
  };
  
  const filteredData = data.filter(
    (item) =>
      item.verification.toLowerCase().includes(searchValidation.toLowerCase())
  );
  

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);
  return (
    <>
      <Head>
        <title>Liste de commande</title>
      </Head>
      <h1 className="Titre">Liste De Commande</h1>
      <select
            className="searchCommande"
            value={searchValidation}
            onChange={handleSearchValidationChange}
          >
            <option value="">All Commande</option>
            <option value="valide">Valide</option>
            <option value="en attant">En attant</option>
          </select>
      <table className="commande-table">
        <thead>
          <tr>
            <th>name_produit</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>price</th>
            <th>Validation</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item._id}>
              <td>
                <img src={item.image_produit} />
                {item.name}
              </td>
              <td>{item.name_user}</td>
              <td>{item.email}</td>
              <td>{item.phone}</td>
              <td>{item.totalPrice} DT</td>
              <td style={{ color: getStatusColor(item.verification) }}>
                {item.verification}
              </td>

              <td>
                <Link
                  href={`/commande/${item._id}`}
                  passHref
                  className="detail"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
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

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Commande</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this commande?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CommandeTable;

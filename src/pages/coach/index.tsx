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
import VisibilityIcon from "@mui/icons-material/Visibility";
import ADD from "./add";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Head from "next/head";

const TableCoach = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCoachId, setSelectedCoachId] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchVerification, setSearchVerification] = useState("");

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
      const response = await axios.get("http://localhost:9000/coachs");
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = (coachId:any) => {
    setSelectedCoachId(coachId);
    setDeleteDialogOpen(true);
  };

  const handleViewClick = (coachId:any) => {
    router.push(`/coach/detail/${coachId}`);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:9000/Coachs/${selectedCoachId}`
      );
      if (response.status === 200) {
        toast.info("Coach deleted successfully");
        fetchData(); // Refresh data after deletion
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("There has been a problem with the deletion:", error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedCoachId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedCoachId(null);
  };

  const getStatusColor = (verification:any) => {
    return verification === "valide" ? "green" : "red";
  };
  
  const handleSearchEmailChange = (event:any) => {
    setSearchEmail(event.target.value);
  };

  const handleSearchVerificationChange = (event:any) => {
    setSearchVerification(event.target.value);
  };
  
  const filteredData = data.filter(
    (item) =>
      item.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
      item.verification.toLowerCase().includes(searchVerification.toLowerCase())
  );
  
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  return (
    <>
      <Head>
        <title>Liste de coach</title>
      </Head>
      <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", margin:"10% 0 0 20%" }}>
        <Button
          startIcon={<SaveIcon />}
          variant="contained"
          color="primary"
          className="btnaddcoach"
          onClick={handleAddClick}
          style={{ margin: "10px" }}
        >
          Add Coach
        </Button>

        <div style={{  alignItems: "center" }}>
          <input
            className="searchAdmin"
            type="text"
            placeholder="Search by email"
            value={searchEmail}
            onChange={handleSearchEmailChange}
            style={{ marginRight: "10px" }}
          />
          <select
            className="searchAdmin"
            value={searchVerification}
            onChange={handleSearchVerificationChange}
            style={{ marginRight: "10px" }}
          >
            <option value="">All Coach</option>
            <option value="valide">valide</option>
            <option value="en attant">en attant</option>
          </select>
        </div>
      </div>
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
            <th>Cv</th>
            <th>Experience</th>
            <th>Description</th>
            <th>Speciality</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>
                <img src={item.image} alt={item.name} />
              </td>
              <td>{item.nom}</td>
              <td>{item.email}</td>
              <td>{item.phone}</td>
              <td>
                <img src={item.cv} alt={item.name} />
              </td>
              <td>{item.experiance}</td>
              <td>{item.description}</td>
              <td>{item.spesialite}</td>
              <td style={{ color: getStatusColor(item.verification) }}>
                {item.verification}
              </td>
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
        <DialogContent>
          Are you sure you want to delete this coach?
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

      <Link href="/coach/add">
        <Button color="primary">Add</Button>
      </Link>
    </>
  );
};

export default TableCoach;

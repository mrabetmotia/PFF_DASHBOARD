import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const CommandeDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [commande, setCommande] = useState(null);

  useEffect(() => {
    const fetchCommandeDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/Commandes/${id}`
        );
        setCommande(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchCommandeDetails();
    }
  }, [id]);

  if (!commande) {
    return <div>Loading...</div>;
  }

  const handleVerification = async () => {
    try {
      await axios.put(`http://localhost:9000/Commandes/${id}`, {
        verification: "valide",
      });
      setCommande((prevCommande) => ({
        ...prevCommande,
        verification: "valide",
      }));
      toast.success('Verification status updated to "valide"');
      router.push("/commande");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="commande-detail-container">
      <h1 className="commande-detail-title">Commande Detail</h1>

      <div className="commande-container">
        <div className="commande-info">
          <img
            className="commande-image"
            src={commande.image_produit}
            alt={commande.name_produit}
          />
          <h2 className="commande-name">{commande.name_produit}</h2>
          <p className="commande-name">Name: {commande.name}</p>
          <p className="commande-email">Email: {commande.email}</p>
          <p className="commande-phone">Phone: {commande.phone}</p>
          <p className="commande-price">Price: {commande.price}</p>
        </div>
      </div>

      {commande.verification !== "valide" && (
        <Button
          startIcon={<CheckCircleOutlineIcon />}
          variant="contained"
          color="primary"
          onClick={handleVerification}
        >
          Valider
        </Button>
      )}

      <ToastContainer />
    </div>
  );
};

export default CommandeDetailPage;

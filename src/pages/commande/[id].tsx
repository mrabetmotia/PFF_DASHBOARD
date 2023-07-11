import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
interface CommandeData {
  name: string;
  email: string;
  phone: string;
  price: number;
  name_produit: string;
  image_produit: string;
  verification: string;
}

const CommandeDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [commande, setCommande] = useState<CommandeData | null>(null);

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
      
      setCommande((prevCommande) => {
        if (prevCommande) {
          return {
            ...prevCommande,
            verification: "valide",
          };
        }
        return null;
      });
  
      toast.success('Verification status updated to "valide"');
      router.push("/commande");
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
      <center className="commande">
        <div className="commande-detail">
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
      <style jsx>{`
        .commande {
          background: url(https://plus.unsplash.com/premium_photo-1675756583871-6be3905c4ef4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60) no-repeat center center fixed;
          -webkit-background-size: cover;
          -moz-background-size: cover;
          -o-background-size: cover;
          background-size: cover;
          
        }
      `}</style>
      </center>
  );
};

export default CommandeDetailPage;

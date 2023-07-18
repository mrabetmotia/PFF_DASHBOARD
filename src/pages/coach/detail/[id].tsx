import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

const CoachDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [coach, setCoach] = useState<Coach | null>(null);
  interface Coach {
    nom: string;
    email: string;
    phone: string;
    experiance: string;
    description: string;
    spesialite: string;
    image: string;
    video: string;
    cv: string;
    verification: string;
  }
  useEffect(() => {
    const fetchCoachDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/Coachs/${id}`);
        setCoach(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchCoachDetails();
    }
  }, [id]);

  const handleVerification = async () => {
    try {
      await axios.put(`http://localhost:9000/Coachs/${id}`, {
        verification: "valide",
      });
      toast.success('Verification status updated to "valide"');
      router.push("/coach");
    } catch (error) {
      console.error(error);
    }
  };

  if (!coach) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Coach detail</title>
      </Head>
      <div className="coach-detail" style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center", color: "#3f51b5" }}>Coach Detail</h1>
        <center style={{ padding: "20px" }}>
        </center>
        <div className="coach-container" style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <div className="coach-info" style={{ width: "40%" }}>
            <img className="coach-image coach-cv" src={coach.image}  />
            <p className="coach-name" style={{ marginTop: "20px", fontSize: "18px", fontWeight: "600" }}>Nom :{coach.nom}</p>
            <p className="coach-email">Email: {coach.email}</p>
            <p className="coach-phone">Phone: {coach.phone}</p>
            <p className="coach-experience">Experience: {coach.experiance}</p>
            <p className="coach-description">Description: {coach.description}</p>
            <p className="coach-speciality">Speciality: {coach.spesialite}</p>
            <Button
              startIcon={<CheckCircleOutlineIcon />}
              variant="contained"
              color="primary"
              onClick={handleVerification}
              style={{ marginTop: "20px" }}
            >
              Verifer
            </Button>
          </div>
          <div className="coach-video-container" style={{ width: "55%" }}>
            <video className="coach-video" autoPlay muted controls style={{ width: "100%" }}>
              <source src={coach.video} />
            </video>
          </div>
        </div>
        <img className="coach-cv" src={coach.cv}  style={{ width: "50%"  }} />

      </div>
      <ToastContainer />
    </>
  );
};

export default CoachDetail;

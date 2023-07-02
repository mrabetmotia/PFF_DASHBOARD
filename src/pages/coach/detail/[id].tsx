import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CoachDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [coach, setCoach] = useState(null);

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
      setCoach((prevCoach) => ({ ...prevCoach, verification: "valide" }));
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
      <div className="coach-detail">
        <h1>Coach Detail</h1>

        <div className="coach-container">
          <div className="coach-info">
            <img className="coach-image" src={coach.image} alt={coach.name} />
            <img className="coach-cv" src={coach.cv} alt={coach.name} />

            <p className="coach-name">Nom :{coach.nom}</p>
            <p className="coach-email">Email: {coach.email}</p>
            <p className="coach-phone">Phone: {coach.phone}</p>
            <p className="coach-experience">Experience: {coach.experiance}</p>
            <p className="coach-description">
              Description: {coach.description}
            </p>
            <p className="coach-speciality">Speciality: {coach.spesialite}</p>
          </div>
          <div className="coach-video-container">
            <video className="coach-video" autoPlay muted controls>
              <source src={coach.video} />
            </video>
          </div>
        </div>
        <Button
          startIcon={<CheckCircleOutlineIcon />}
          variant="contained"
          color="primary"
          onClick={handleVerification}
        >
          Verifer
        </Button>
      </div>

      <ToastContainer />
    </>
  );
};

export default CoachDetail;

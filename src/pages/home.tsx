import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import {Button} from "@mui/material";
import Head from "next/head";

export default function Home() {
  const [coachCount, setCoachCount] = useState(0);
  const [shopCount, setShopCount] = useState(0);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [typeCount, setTypeCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [coachData, setCoachData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [exerciseData, setExerciseData] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const coachResponse = await axios.get("http://localhost:9000/coachs");
      const shopResponse = await axios.get("http://localhost:9000/Product");
      const exerciseResponse = await axios.get("http://localhost:9000/excercice");
      const typeResponse = await axios.get("http://localhost:9000/type");
      const clientResponse = await axios.get("http://localhost:9000/clients");

      const totalCoachCount = coachResponse.data.length;
      const totalShopCount = shopResponse.data.length;
      const totalExerciseCount = exerciseResponse.data.length;
      const totalTypeCount = typeResponse.data.length;
      const totalClientCount = clientResponse.data.length;

      setCoachCount(totalCoachCount);
      setShopCount(totalShopCount);
      setExerciseCount(totalExerciseCount);
      setTypeCount(totalTypeCount);
      setClientCount(totalClientCount);

      setCoachData(coachResponse.data);
      setProductData(shopResponse.data);
      setExerciseData(exerciseResponse.data);
      setTypeData(typeResponse.data);
      setClientData(clientResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main>
        <div className="page-header">
          <h1>Dashboard</h1>
        </div>

        <div className="page-content">
          <div className="analytics">
            <div className="card">
              <div className="card-head">
                <h2>{coachCount}</h2>
                <span className="las la-user-friends"></span>
              </div>
              <div className="card-progress">
                <small>Total Coaches</small>
              </div>
            </div>
            <div className="card">
              <div className="card-head">
                <h2>{shopCount}</h2>
                <span className="las la-shopping-cart"></span>
              </div>
              <div className="card-progress">
                <small>Total Shops</small>
              </div>
            </div>
            <div className="card">
              <div className="card-head">
                <h2>{exerciseCount}</h2>
                <span className="las la-clipboard-list"></span>
              </div>
              <div className="card-progress">
                <small>Total Exercises</small>
              </div>
            </div>
            <div className="card">
              <div className="card-head">
                <h2>{clientCount}</h2>
                <span className="las la-clipboard-list"></span>
              </div>
              <div className="card-progress">
                <small>Total User</small>
              </div>
            </div>
          </div>
          <h3>Coach</h3>
          <div className="records table-responsive ">
            <div>
              <table width="100%" className="table_home">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>experiance</th>
                    <th>phone</th>
                    <th>description</th>
                  </tr>
                </thead>
                <tbody>
                  {coachData.slice(0, 6).map((coach) => (
                    <tr key={coach._id}>
                      <td>
                        <div className="client">
                          <div
                            className="client-img bg-img"
                            style={{ backgroundImage: `url(${coach.image})` }}
                          ></div>
                          <div className="client-info">
                            <h4>{coach.nom}</h4>
                            <small>{coach.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{coach.experiance}</td>
                      <td>{coach.phone}</td>
                      <td>{coach.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link
              href="/coach"
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth={"true"}
                className="BTN-More"
              >
                View More
              </Button>
            </Link>
          </div>
          <h3>Product</h3>
          <div className="records table-responsive">
            <div>
              <table width="100%" className="table_home">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>KG</th>
                    <th>Price</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {productData.slice(0, 6).map((product) => ( 
                    <tr key={product._id}>
                      <td>
                        <div className="client">
                          <div
                            className="client-img bg-img"
                            style={{ backgroundImage: `url(${product.image})` }}
                          ></div>
                          <div className="client-info">
                            <h4>{product.name}</h4>
                            <small>{product.type.name}</small>
                          </div>
                        </div>
                      </td>
                      <td>{product.kg}KG</td>
                      <td>{product.price}TND</td>
                      <td>{product.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link
              href="/shop"
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth={"true"}
                className="BTN-More"
              >
                View More
              </Button>
            </Link>
          </div>
          <h3>Excercice</h3>
          <div className="records table-responsive">
            <div>
              <table width="100%" className="table_home">
                <thead>
                  <tr>
                    <th>Nom</th>
                  </tr>
                </thead>
                <tbody>
                  {exerciseData.slice(0, 6).map((exercise) => (
                    <tr key={exercise._id}>
                      <td>
                        <div className="client">
                          <div className="client-img bg-img">
                            <img src={`/exercice/${exercise.lien}`} />
                          </div>
                          <div className="client-info">
                            <h4>{exercise.nom}</h4>
                            <small>{exercise.type}</small>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link
              href="/excercice"
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth={"true"}
                className="BTN-More"
              >
                View More
              </Button>
            </Link>
          </div>
          <h3>Type</h3>
          <div className="records table-responsive">
            <div>
              <table width="100%" className="table_home">
                <thead>
                  <tr>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {typeData.slice(0, 6).map((type) => (
                    <tr key={type._id}>
                      <td>
                        <div className="client">
                          <div className="client-info">
                            <h4>{type.name}</h4>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link
              href="/type"
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth={"true"}
                className="BTN-More"
              >
                View More
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
    </>
  );
}

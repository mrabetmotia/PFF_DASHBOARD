import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Head from "next/head";

const TypeDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [type, setType] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  useEffect(() => {
    const fetchTypeDetails = async () => {
      try {
        const response = await fetch(`http://localhost:9000/types/${id}`);
        const typeData = await response.json();
        setType(typeData);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchTypeDetails();
    }
  }, [id]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:9000/types/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: updatedName }),
      });
      const updatedType = await response.json();
      setType(updatedType);
      router.push("/type");
      toast.success("Type updated successfully");
    } catch (error) {
      console.error(error);
    }
  };

  if (!type) {
    return <div>Loading...</div>;
  }

  return (
    <center>
      <Head>
        <title>Type detail</title>
      </Head>
      <div className="type-detail">
        <h1>Type Detail</h1>
        <input
          type="text"
          value={updatedName}
          onChange={(e) => setUpdatedName(e.target.value)}
          placeholder="Enter new type name"
        />
      </div>
      <button onClick={handleUpdate}>Update</button>
    </center>
  );
};

export default TypeDetail;

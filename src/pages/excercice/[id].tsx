import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Image from "next/image";// <-- Import here
import axios from "axios";

interface Excercice {
  _id: string;
  type: string;
  nom: string;
  lien: string;
} // <-- Declare interface here



const TypeDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState<Excercice | null>(null); // <-- Set type here
  const [updatedName, setUpdatedName] = useState("");
  const [updatedLien, setUpdatedLien] = useState("");
  const [updatedType, setUpdatedType] = useState("");
  const [file, setFile] = useState(null);

  const myLoader = ({ src }: { src: string }) => {
    return `http://localhost:4000/exercice/${src}`;
  };
  

  useEffect(() => {
    const fetchTypeDetails = async () => {
      try {
        const response = await fetch(`http://localhost:9000/excercice/${id}`);
        const typeData = await response.json();
        setItem(typeData);
        setUpdatedName(typeData.nom);
        setUpdatedLien(typeData.lien);
        setUpdatedType(typeData.type);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchTypeDetails();
    }
  }, [id]);

  const uploadImage = async () => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Excercice");
        formData.append("public_id", `Excercice/${file.name}`);

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dnyt40i17/upload",
          formData
        );
        console.log("File uploaded successfully");
        return response.data.secure_url; // Correctly return the URL of the uploaded image
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      let imageUrl = updatedLien;
      if (file) {
        imageUrl = await uploadImage();
      }
      const response = await fetch(`http://localhost:9000/excercice/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lien: imageUrl,
          nom: updatedName,
          type: updatedType,
        }),
      });
      const updatedTypee = await response.json();
      setItem(updatedTypee);
      setUpdatedName("");
      setUpdatedLien("");
      setUpdatedType("");
      toast.success("Product updated successfully");
      router.push("http://localhost:4000/excercice");
    } catch (error) {
      console.error(error);
    }
  };

  if (!item) {
    return <div>Loading...</div>;
  }

  const handleFileChange = (e:any) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  return (
    <center className="center">
      <div className="type-detail-container" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <div className="type-detail">
          <h1>Type Detail</h1>
          <div className="input-container">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
              placeholder="Enter new type name"
            />
          </div>
          <div className="input-container">
            <label htmlFor="image">Image:</label>
            <input type="file" onChange={handleFileChange} />
          </div>
          <div className="input-container">
            <label htmlFor="image">Image:</label>
            <input
              id="image"
              type="text"
              value={updatedType}
              onChange={(e) => setUpdatedLien(e.target.value)}
              placeholder="Enter new type image"
            />
          </div>
          <button onClick={handleUpdate}>Update</button>
        </div>
        <div>
        <div>
          <Image 
            className="imgDetail"
            loader={myLoader} 
            src={item.lien} 
            alt="Exercise Image" 
            width={600} 
            height={500} 
          />
        </div>
        </div>
      </div>
      <style jsx>{`
        .center {
          background: url(https://images.unsplash.com/photo-1498962342534-ee08a0bb1d45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MTd8MjExNTgxMXx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60) no-repeat center center fixed;
          -webkit-background-size: cover;
          -moz-background-size: cover;
          -o-background-size: cover;
          background-size: cover;
        }
      `}</style>
    </center>
  );
};

export default TypeDetail;

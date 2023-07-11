import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Image from "next/image";
import axios from "axios";

const TypeDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedImage, setUpdatedImage] = useState("");
  const [updatedKg, setUpdatedKg] = useState("");
  const [updatedPrice, setUpdatedPrice] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [types, setTypes] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchTypeDetails = async () => {
      try {
        const response = await fetch(`http://localhost:9000/Products/${id}`);
        const typeData = await response.json();
        setItem(typeData);
        setUpdatedName(typeData.name);
        setUpdatedImage(typeData.image);
        setUpdatedKg(typeData.kg);
        setUpdatedPrice(typeData.price);
        setUpdatedDescription(typeData.description);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchTypes = async () => {
      try {
        const response = await fetch("http://localhost:9000/type");
        const typesData = await response.json();
        setTypes(typesData);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchTypeDetails();
      fetchTypes();
    }
  }, [id]);

  const uploadImage = async () => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "shopss");
        formData.append("public_id", `shopss/${file.name}`);

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dnyt40i17/upload",
          formData
        );
        console.log("File uploaded successfully");
        return response.data.secure_url;
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      let imageUrl = updatedImage;
      if (file) {
        imageUrl = await uploadImage();
      }

      const requestData = {
        name: updatedName,
        image: imageUrl,
        kg: updatedKg,
        price: updatedPrice,
        description: updatedDescription,
      };

      const response = await fetch(`http://localhost:9000/Products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const updatedType = await response.json();
      setItem(updatedType);
      setUpdatedName("");
      setUpdatedImage("");
      setUpdatedKg("");
      setUpdatedPrice("");
      setUpdatedDescription("");
      toast.success("Product updated successfully");
      router.push("/shop");
    } catch (error) {
      console.error(error);
    }
  };

  if (!item) {
    return <div>Loading...</div>;
  }

  const myLoader = ({ src }) => {
    return `${src}`;
  };

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
          <label htmlFor="kg">Kg:</label>
          <input
            id="kg"
            type="Number"
            value={updatedKg}
            onChange={(e) => setUpdatedKg(e.target.value)}
            placeholder="Enter new type kg"
          />
        </div>
        <div className="input-container">
          <label htmlFor="price">Price:</label>
          <input
            id="price"
            type="Number"
            value={updatedPrice}
            onChange={(e) => setUpdatedPrice(e.target.value)}
            placeholder="Enter new type price"
          />
        </div>
        <div className="input-container">
          <label htmlFor="description">Description:</label>
          <textarea
            className="descShop"
            id="description"
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            placeholder="Enter new type description"
          ></textarea>
        </div>
        <div className="input-container">
          <label htmlFor="type">Type:</label>
          <select
            className="descShop"
            id="type"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
          >
            <option value="">Select a New type</option>
            {types.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      <button onClick={handleUpdate}>Update</button>

      </div>
      <div className="Box-img">
          <Image 
            loader={myLoader} 
            src={updatedImage} 
            alt="Type Image" 
            width={500} 
            height={200} 
          />
        </div>

      </div>
      <style jsx>{`
        .type-detail {
          max-width: 400px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #f7f7f7;
        }
        
        .image-container {
          margin-bottom: 15px;
        }

        img {
          max-width: 100%;
          height: auto;
        }

        .input-container {
          margin-bottom: 15px;
          margin-right: 10%;
        }

        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        input,
        textarea,
        select {
          width: 100%;
          padding: 8px;
          border-radius: 3px;
          border: 1px solid #ccc;
        }

        button {
          margin-top: 10px;
          padding: 8px 15px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        button:hover {
          background-color: #45a049;
        }
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

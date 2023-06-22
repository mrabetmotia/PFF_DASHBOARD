import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const TypeDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedImage, setUpdatedImage] = useState('');
  const [updatedKg, setUpdatedKg] = useState('');
  const [updatedPrice, setUpdatedPrice] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [types, setTypes] = useState([]);

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
        const response = await fetch('http://localhost:9000/type');
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

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:9000/Products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updatedName,
          image: updatedImage,
          kg: updatedKg,
          price: updatedPrice,
          description: updatedDescription,
        }),
      });
      const updatedType = await response.json();
      setItem(updatedType);
      setUpdatedName('');
      setUpdatedImage('');
      setUpdatedKg('');
      setUpdatedPrice('');
      setUpdatedDescription('');
      toast.success('Product updated successfully');
    } catch (error) {
      console.error(error);
    }
  };

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <center>
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
          <input
            id="image"
            type="text"
            value={updatedImage}
            onChange={(e) => setUpdatedImage(e.target.value)}
            placeholder="Enter new type image"
          />
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
            id="description"
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            placeholder="Enter new type description"
          ></textarea>
        </div>
        <div className="input-container">
          <label htmlFor="type">Type:</label>
          <select
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
      </div>
      <button onClick={handleUpdate}>Update</button>

      <style jsx>{`
        .type-detail {
          max-width: 400px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #f7f7f7;
        }

        .input-container {
          margin-bottom: 15px;
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
      `}</style>
    </center>
  );
};

export default TypeDetail;

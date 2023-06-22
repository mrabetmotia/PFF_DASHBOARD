import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const TypeDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedLien, setUpdatedLien] = useState('');
  const [updatedType, setUpdatedType] = useState('');

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

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:9000/excercice/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lien: updatedLien,
          nom: updatedName,
          type: updatedType,
        }),
      });
      const updatedTypee = await response.json();
      setItem(updatedTypee);
      setUpdatedName('');
      setUpdatedLien('');
      setUpdatedType('');
      toast.success('Product updated successfully');
      router.push('http://localhost:4000/excercice');
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
            value={updatedLien}
            onChange={(e) => setUpdatedLien(e.target.value)}
            placeholder="Enter new type image"
          />
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
      </div>
      <button onClick={handleUpdate}>Update</button>
    </center>
  );
};

export default TypeDetail;

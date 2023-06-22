import React from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import SendIcon from '@mui/icons-material/Send';

const schema = z.object({
  nom: z.string().nonempty('Name is required'),
  type: z.string().nonempty('Type is required'),
  lien: z.string().nonempty('Lien is required'),
});

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      // reader.result contains the base64 string
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  }
};

export default function CreateType() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleSaveType = async (data) => {
    try {
      await axios.post('http://localhost:9000/Add', data);
      toast.success('Type created successfully');
      router.push('/excercice');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <main>
        <h1>Add Type</h1>
        <form onSubmit={handleSubmit(handleSaveType)}>
          <TextField
            id="nom"
            name="nom"
            label="nom"
            variant="outlined"
            {...register('nom')}
            error={!!errors.nom}
            helperText={errors.nom?.message}
          />
          <TextField
            id="type"
            name="type"
            label="Type"
            variant="outlined"
            select
            {...register('type')}
            error={!!errors.type}
            helperText={errors.type?.message}
          >
            <MenuItem value="chest">Chest</MenuItem>
            <MenuItem value="back">Back</MenuItem>
            <MenuItem value="bra">Bra</MenuItem>
            <MenuItem value="jomb">Jomb</MenuItem>
            <MenuItem value="shoulders">Shoulders</MenuItem>
            <MenuItem value="abdo">Abdo</MenuItem>
            <MenuItem value="cardio">Cardio</MenuItem>
          </TextField>
          <TextField
            id="lien"
            name="lien"
            label="Lien"
            variant="outlined"
            {...register('lien')}
            error={!!errors.lien}
            helperText={errors.lien?.message}
          />
          <Button variant="outlined" startIcon={<SendIcon />} type="submit">
            Save
          </Button>
        </form>
      </main>
    </>
  );
}




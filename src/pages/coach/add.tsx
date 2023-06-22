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
import SendIcon from '@mui/icons-material/Send';

const schema = z.object({
  nom: z.string().nonempty('Nom is required'),
  description: z.string().nonempty('Description is required'),
  spesialite: z.string().nonempty('Spesialite is required'),
  image: z.string().nonempty('Image is required'),
  video: z.string().nonempty('VD is required'),
  experiance: z.string().nonempty('Experiance is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().nonempty('Phone is required'),
});

export default function AddCoach() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleSaveCoach = async (data) => {
    try {
      await axios.post('http://localhost:9000/coach', data);
      toast.success('Coach created successfully');
      router.push('/coach'); // Redirect to coaches page after successful creation
    } catch (error) {
      toast.error('Coach created error');
      console.error(error);
    }
  };

  return (
    <>
      <main>
        <h1>Add Coach</h1>
        <form onSubmit={handleSubmit(handleSaveCoach)}>
          <TextField
            id="nom"
            name="nom"
            label="Nom"
            variant="outlined"
            {...register('nom')}
            error={!!errors.nom}
            helperText={errors.nom?.message}
          />
          <TextField
            id="description"
            name="description"
            label="Description"
            variant="outlined"
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          <TextField
            id="spesialite"
            name="spesialite"
            label="Spesialite"
            variant="outlined"
            {...register('spesialite')}
            error={!!errors.spesialite}
            helperText={errors.spesialite?.message}
          />
          <TextField
            id="image"
            name="image"
            label="Image"
            variant="outlined"
            {...register('image')}
            error={!!errors.image}
            helperText={errors.image?.message}
          />
          <TextField
            id="video"
            name="video"
            label="videovideo"
            variant="outlined"
            {...register('video')}
            error={!!errors.video}
            helperText={errors.video?.message}
          />
          <TextField
            id="experiance"
            name="experiance"
            label="Experiance"
            variant="outlined"
            type="text"
            {...register('experiance')}
            error={!!errors.experiance}
            helperText={errors.experiance?.message}
          />
          <TextField
            id="email"
            name="email"
            label="Email"
            variant="outlined"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            id="phone"
            name="phone"
            label="Phone"
            variant="outlined"
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
          <Button variant="outlined" startIcon={<SendIcon />} type="submit">
            Save
          </Button>
        </form>
      </main>
    </>
  );
}

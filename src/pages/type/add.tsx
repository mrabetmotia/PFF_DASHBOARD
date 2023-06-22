import React from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { toast } from 'react-toastify';
import SendIcon from '@mui/icons-material/Send';
const schema = z.object({
  name: z.string().nonempty('First Name is required'),

});

export default function CreateClient() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleSaveClient = async (data:any) => {
    try {
      await axios.post('http://localhost:9000/types', data);
      toast.success('Type created successfully');
      router.push('/type'); 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <main>
        <h1>Add Type</h1>
        <form onSubmit={handleSubmit(handleSaveClient)}>
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            {...register('name')}
            error={!!errors.name}
          />
          <Button variant="outlined" startIcon={<SendIcon />} type="submit">
            Save
          </Button>
        </form>
      </main>
    </>
  );
}

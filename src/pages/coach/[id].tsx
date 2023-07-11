import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";

const schema = z.object({
  nom: z.string().nonempty("Nom is required"),
  description: z.string().nonempty("Description is required"),
  spesialite: z.string().nonempty("Spesialite is required"),
  image: z.string().nonempty("Image is required"),
  video: z.string().nonempty("video is required"),
  experiance: z.string().nonempty("Experiance is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().nonempty("Phone is required"),
  cv: z.string().nonempty("cv is required"),
});

export default function UpdateCoach() {
  const router = useRouter();
  const { id } = router.query;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/Coachs/${id}`);
        const { data } = response;
        setValue("nom", data.nom);
        setValue("description", data.description);
        setValue("spesialite", data.spesialite);
        setValue("image", data.image);
        setValue("cv", data.cv);
        setValue("video", data.video);
        setValue("experiance", data.experiance);
        setValue("email", data.email);
        setValue("phone", data.phone);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchCoach();
    }
  }, [id, setValue]);

  const handleUpdateCoach = async (data:any) => {
    try {
      await axios.put(`http://localhost:9000/Coachs/${id}`, data);
      toast.success("Coach updated successfully");
      router.push("/coach"); // Redirect to coaches page after successful update
    } catch (error) {
      toast.error("Coach update error");
      console.error(error);
    }
  };

  return (
<>
  <main>
    <form className="form-coach" onSubmit={handleSubmit(handleUpdateCoach)}>
      <h1>Update Coach</h1>
      <label htmlFor="nom">Nom</label>
      <TextField
        id="nom"
        variant="outlined"
        {...register("nom")}
        error={!!errors.nom}
        helperText={errors.nom?.message?.toString()}
      />
      <label htmlFor="description">Description</label>
      <TextField
        id="description"
        variant="outlined"
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description?.message?.toString()}
      />
      <label htmlFor="spesialite">Spesialite</label>
      <TextField
        id="spesialite"
        variant="outlined"
        {...register("spesialite")}
        error={!!errors.spesialite}
        helperText={errors.spesialite?.message?.toString()}
      />
      <label htmlFor="image">Image</label>
      <TextField
        id="image"
        variant="outlined"
        {...register("image")}
        error={!!errors.image}
        helperText={errors.image?.message?.toString()}
      />
      <label htmlFor="cv">CV</label>
      <TextField
        id="cv"
        variant="outlined"
        {...register("cv")}
        error={!!errors.cv}
        helperText={errors.cv?.message?.toString()}
      />
      <label htmlFor="video">Video</label>
      <TextField
        id="video"
        variant="outlined"
        {...register("video")}
        error={!!errors.video}
        helperText={errors.video?.message?.toString()}
      />
      <label htmlFor="experiance">Experiance</label>
      <TextField
        id="experiance"
        variant="outlined"
        type="number"
        {...register("experiance")}
        error={!!errors.experiance}
        helperText={errors.experiance?.message?.toString()}
      />
      <label htmlFor="email">Email</label>
      <TextField
        id="email"
        variant="outlined"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message?.toString()}
      />
      <label htmlFor="phone">Phone</label>
      <TextField
        id="phone"
        variant="outlined"
        type="number"
        {...register("phone")}
        error={!!errors.phone}
        helperText={errors.phone?.message?.toString()}
      />
      <Button variant="outlined" startIcon={<SaveIcon />} type="submit">
        Save
      </Button>
    </form>
  </main>
</>

  );
}

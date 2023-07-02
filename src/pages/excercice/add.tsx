import React, { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import SendIcon from "@mui/icons-material/Send";

const schema = z.object({
  nom: z.string().nonempty("Name is required"),
  type: z.string().nonempty("Type is required"),
  lien: z.any(),
});

export default function CreateType() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleSaveType = async (data) => {
    try {
      let imageUrl = ""; // Initialize imageUrl variable
      if (file) {
        data.lien = file.name;
        imageUrl = await uploadImage(); // Get URL from Cloudinary
        data.lien = imageUrl; // Update data.lien to be the URL, not just the file name
      }
      await axios.post("http://localhost:9000/Add", data); // Send data to the server
      toast.success("Type created successfully");
      router.push("/excercice");
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const uploadImage = async () => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Shop_GYM");
        formData.append("public_id", `Shop_GYM/${file.name}`);

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
            {...register("nom")}
            error={!!errors.nom}
            helperText={errors.nom?.message}
          />
          <TextField
            id="type"
            name="type"
            label="Type"
            variant="outlined"
            select
            {...register("type")}
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
          <input type="file" onChange={handleFileChange} />
          <Button variant="outlined" startIcon={<SendIcon />} type="submit">
            Save
          </Button>
        </form>
      </main>
    </>
  );
}

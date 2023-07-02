import React, { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import FilledInput from "@mui/material/FilledInput";

const schema = z.object({
  nom: z.string().nonempty("Nom is required"),
  description: z.string().nonempty("Description is required"),
  spesialite: z.string().nonempty("Spesialite is required"),
  experiance: z.string().nonempty("Experiance is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().nonempty("Phone is required"),
});

export default function AddCoach() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleImageFileChange = (e) => setImageFile(e.target.files[0]);
  const handleCvFileChange = (e) => setCvFile(e.target.files[0]);
  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Video file size is too large. Maximum size is 10MB.");
      return;
    }
    setVideoFile(file);
  };
  const uploadFile = async (file, folder) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "coachs");
      formData.append("folder", `coachs/${folder}`);
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dnyt40i17/upload",
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      toast.error("File uploading error");
      console.error(error);
    }
  };

  const handleSaveCoach = async (data) => {
    try {
      if (imageFile) {
        const imageUrl = await uploadFile(imageFile, "image");
        data.image = imageUrl;
      }

      if (cvFile) {
        const cvUrl = await uploadFile(cvFile, "cv");
        data.cv = cvUrl;
      }

      if (videoFile) {
        const videoUrl = await uploadFile(videoFile, "video");
        data.video = videoUrl;
      }

      const response = await axios.post("http://localhost:9000/coach", data);
      if (response.status === 200) {
        toast.success("Coach created successfully");
        router.push("/coach");
      } else {
        toast.error("Server response error");
      }
    } catch (error) {
      toast.error("Coach creation error");
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
            {...register("nom")}
            error={!!errors.nom}
            helperText={errors.nom?.message}
          />
          <TextField
            id="description"
            name="description"
            label="Description"
            variant="outlined"
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          <TextField
            id="spesialite"
            name="spesialite"
            label="Spesialite"
            variant="outlined"
            {...register("spesialite")}
            error={!!errors.spesialite}
            helperText={errors.spesialite?.message}
          />

          <TextField
            id="experiance"
            name="experiance"
            label="Experiance"
            variant="outlined"
            type="text"
            {...register("experiance")}
            error={!!errors.experiance}
            helperText={errors.experiance?.message}
          />
          <TextField
            id="email"
            name="email"
            label="Email"
            variant="outlined"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            id="phone"
            name="phone"
            label="Phone"
            variant="outlined"
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
          <label htmlFor="video">Select your video</label>
          <FilledInput type="file" onChange={handleVideoFileChange} />
          <label htmlFor="image">Select your image</label>
          <FilledInput
            label="Select your image"
            type="file"
            onChange={handleImageFileChange}
          />
          <label htmlFor="cv">Select your cv with type jpg or png</label>
          <FilledInput type="file" onChange={handleCvFileChange} />
          <Button variant="outlined" startIcon={<SendIcon />} type="submit">
            Save
          </Button>
        </form>
      </main>
    </>
  );
}

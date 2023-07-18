import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import SendIcon from "@mui/icons-material/Send";

const schema = z.object({
  name: z.string().nonempty("Name is required"),
  image: z.string().nonempty("Image is required"),
  kg: z.string().nonempty("Kg is required"),
  price: z.string().nonempty("Price is required"),
  description: z.string().nonempty("Description is required"),
  type: z.string().nonempty("Type is required"),
});

export default function CreateType() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [kg, setKG] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [file, setFile] = useState(null);

  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value);
  };
  const {
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleSaveType = async (event: any) => {
    event.preventDefault();

    try {
      let imageUrl = "";
      if (file) {
        imageUrl = await uploadImage();
      }

      const requestData = {
        name: name,
        image: imageUrl, // Updated to imageUrl
        kg: kg,
        price: price,
        description: description,
        type: type,
      };

      const response = await axios.post(
        "http://localhost:9000/Products",
        requestData
      );
      if (response.status === 200) {
        toast.success("Product created successfully");
        router.push("/shop");
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await axios.get("http://localhost:9000/type");
      setData(result.data);
    } catch (error) {
      console.error("There was an error fetching the data:", error);
    }
  };

  const handleFileChange = (e:any) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const uploadImage = async () => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "shopss");
        formData.append("public_id", `shopss/${file.name}`); // Corrected line: wrapped inside backticks ``

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dnyt40i17/upload",
          formData
        );
        console.log("File uploaded successfully");
        return response.data.secure_url; // Return URL of uploaded image
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <>
      <main>
        <h1>Add Product</h1>
        <form onSubmit={handleSaveType}>
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            onChange={(event) => setName(event.target.value)}
            error={!!errors.name}
            helperText={errors.name?.message?.toString()}
          />
          <input type="file" onChange={handleFileChange} />

          <TextField
            type="number"
            id="kg"
            name="kg"
            label="Kg"
            variant="outlined"
            onChange={(event) => setKG(event.target.value)}
            error={!!errors.kg}
            helperText={errors.kg?.message?.toString()}
          />
          <TextField
            type="number"
            id="price"
            name="price"
            label="Price"
            variant="outlined"
            onChange={(event) => setPrice(event.target.value)}
            error={!!errors.price}
            helperText={errors.price?.message?.toString()}
          />
          <TextField
            id="description"
            name="description"
            label="Description"
            variant="outlined"
            onChange={(event) => setDescription(event.target.value)}
            error={!!errors.description}
            helperText={errors.description?.message?.toString()}
          />

          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">Type</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={type}
              onChange={handleChange}
              label="type"
            >
              {data.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<SendIcon />} type="submit">
            Save
          </Button>
        </form>
      </main>
    </>
  );
}

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { useAuth } from "@/context/AuthContext";
import { z } from "zod";

const Login = () => {
  const { login, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("Welcome back, please login!");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const resetForm = (event:any) => {
    event.preventDefault();
    setEmail("");
    setPassword("");
    setErrors({ email: "", password: "" });
  };

  const handleLogin = (event: any) => {
    event.preventDefault();
    try {
      login(email, password);
      toast("Welcome Back, Login successfully");
      router.push("/home");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const emailError = error.issues.find(
          (issue) => issue.path[0] === "email"
        );
        const passwordError = error.issues.find(
          (issue) => issue.path[0] === "password"
        );
        setErrors({
          email: emailError ? emailError.message : "",
          password: passwordError ? passwordError.message : "",
        });
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  return (
    <>
      <Head>
        <title>Login page</title>
      </Head>
      <main>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: "100vh" }}
        >
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={6} style={{ padding: "2rem" }}>
              <Typography variant="h4" style={{ marginBottom: "2rem" }}>
                {title}
              </Typography>
              <form onSubmit={handleLogin}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Email Address"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      error={!!errors.password}
                      helperText={errors.password}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      Login
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button fullWidth variant="outlined" onClick={resetForm}>
                      Reset
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </main>
    </>
  );
};

export default Login;

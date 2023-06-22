import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Navbar from '@/components/Navbar';
import '@/styles/globals.css';
import '@/styles/shop.css';
import '@/styles/type.css';
import '@/styles/commande.css';
import '@/styles/excercice.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '@/context/AuthContext';

const theme = createTheme();

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <title>Admin Gym Trainer</title>
        <link rel="stylesheet" href="https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css" />
        <link rel="shortcut icon" type="image/x-icon" href="favicon.ico"/>

      <div>
        <Navbar />
        <Component {...pageProps} />
        <ToastContainer />

      </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PrimeReactProvider } from 'primereact/api'
import { AuthProvider } from './context/AuthContext.jsx'
import 'primeicons/primeicons.css';
        

import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <PrimeReactProvider >
        <App/>
      </PrimeReactProvider>
    </AuthProvider>
  </BrowserRouter>
)

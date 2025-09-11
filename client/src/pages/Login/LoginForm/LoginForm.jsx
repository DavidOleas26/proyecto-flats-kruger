import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
// PrimeReact Components
import { Password } from 'primereact/password';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
// Axios Peticiones
import axios from "axios";
// Libreria de alertas
import Swal from 'sweetalert2'; // Importar SweetAlert
import { ProgressSpinner } from "primereact/progressspinner";

export const LoginForm = () => {
    // referencias a los inputs
    const emailRef = useRef();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();

    const { login } = useAuth()
    
    // funcion submit
    const submit = async(event) => {
        event.preventDefault();

        const email = emailRef.current?.value;
        const pass = password;

        // Verificar si el email está vacío
        if (!email) {
            Swal.fire({
                icon: 'error',
                title: 'Email is required',
                text: 'Please enter your email address.',
            });
            return;
        }

        // Verificar si el formato del email es válido
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email',
                text: 'Please enter a valid email address.',
            });
            return;
        }

        // Verificar si la contraseña está vacía
        if (!pass) {
            Swal.fire({
                icon: 'error',
                title: 'Password is required',
                text: 'Please enter your password.',
            });
            return;
        }

        const userLogged = {
            email: email,
            password: pass,
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/auth/login', userLogged)
            const { token, user } = response.data
            login({token, user})
            Swal.fire({
                icon: 'success',
                title: 'Welcome!',
                text: 'User logged successfully.',
                showConfirmButton: false,
                timer: 1500,
            });
            setTimeout(() => {
                navigation('/');
            }, 1500);

        } catch (error) {
            console.log(error);
            const errorMessage = error?.response?.data?.error ||  error.code ||'Something went wrong'
            console.log(errorMessage);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
            });
        }finally {
            setLoading(false); 
        }
    }

    return(
        <>
            <form onSubmit={(event) => submit(event)} className="relative mt-4 w-11/12 flex flex-col gap-8 items-center">
                {loading && (
                <div className="absolute z-50 flex justify-center items-center mt-4">
                    <ProgressSpinner />
                </div>
                )}
                {/* input email */}
                <FloatLabel className="flex flex-col justify-center items-center">
                    <InputText id="email" keyfilter="email" className="w-[276px]" ref={emailRef} type={'email'} />
                    <label htmlFor="email" className="font-bold mb-2"> Email </label>
                </FloatLabel>     
                {/* input password */}
                <FloatLabel className="flex flex-col justify-center items-center">
                    <Password inputId="password" value={password} onChange={(e) => setPassword(e.target.value)}  toggleMask/>
                    <label htmlFor="password" className="font-bold mb-2">Password</label>
                </FloatLabel>
                <Button type={'submit'} label="Log In" className="bg-secondary_color hover:bg-[#08222b]"/>
            </form>
        </>
    );
}

// React Hooks
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
// Libreria de componentes
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Password } from 'primereact/password';
// importar los servicios de usario para crear usuario en firebase
import { LocalStorageService } from "../../services/localStorage/localStorage";
// Axios
import axios from "axios";
// Libreria de alertas
import Swal from "sweetalert2";

// eslint-disable-next-line react/prop-types
export const UserForm = ({id}) => {
  let typeForm = id ? 'update' : 'create';
  const navigation = useNavigate();
  
  // Context
  const { login, logout } = useAuth();
  // Form Inputs
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const [date, setDate] = useState(null);
  const emailRef = useRef();
  
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(
    { 
      firstName: '', 
      lastName: '', 
      birthdate: '', 
      email: '', 
    }
  );

  const localStorageService = new LocalStorageService();
  const userToken = localStorageService.getUserToken();

  useEffect(() => { 
    if (typeForm === 'update') {
      setToken(userToken)
      getUser({userToken})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUser = async ({ userToken }) => {
      try {
          const response = await axios.get(`http://localhost:8080/users/${id}`,{
              headers: {
                  authorization: `Bearer ${userToken}`
              }
          })
          setUser(response.data)
      } catch (error) {
          const errorStatus = error?.response?.status    
          const errorMessage = error?.response?.data?.error || error?.code || 'Somethig went worng!'
          Swal.fire({
              icon: 'error',
              title: 'Error',
              text: errorMessage,
              showConfirmButton: false,
              timer: 1500,
          });

          if ( errorStatus === 401 ) {
              setTimeout(() => {
                  logout()
                  navigation('/login');
              }, 1500);
          } else {
              setTimeout(() => {
                  navigation('/');
              }, 1500);
          }
      }
    }

  const submit = async (event) => {
  event.preventDefault();
  if (!validateForm()) return;

  const firstNameRaw = firstNameRef.current?.value.trim();
  const lastNameRaw = lastNameRef.current?.value.trim();
  const emailRaw = emailRef.current?.value.trim();

  const firstNameCapitalized = firstNameRaw
    ? firstNameRaw.charAt(0).toUpperCase() + firstNameRaw.slice(1)
    : '';
  const lastNameCapitalized = lastNameRaw
    ? lastNameRaw.charAt(0).toUpperCase() + lastNameRaw.slice(1)
    : '';

  // Generar objeto base
  const userData = {};

  if (firstNameRaw) userData.firstName = firstNameCapitalized;
  if (lastNameRaw) userData.lastName = lastNameCapitalized;
  if (date) userData.birthdate = date;
  if (emailRaw) userData.email = emailRaw;
  if (password) userData.password = password;

  if (typeForm === 'create') {
    try {
      const response = await axios.post(
        'http://localhost:8080/auth/register',
        userData
      );

      const { token, user, message } = response.data;
      login({ token, user });

      Swal.fire({
        icon: 'success',
        title: 'Welcome!',
        text: message,
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => {
        navigation('/');
      }, 1500);
    } catch (error) {
      const errorMessage = error?.response?.data?.error || 'Registration failed';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    }
  } else if (typeForm === 'update') {
    try {
      const updatedUser = {};

      if (firstNameRaw && firstNameRaw !== user.firstName) {
        updatedUser.firstName = firstNameCapitalized;
      }
      if (lastNameRaw && lastNameRaw !== user.lastName) {
        updatedUser.lastName = lastNameCapitalized;
      }
      if (emailRaw && emailRaw !== user.email) {
        updatedUser.email = emailRaw;
      }
      if (
        date &&
        new Date(date).toISOString().split('T')[0] !== user.birthdate.split('T')[0]
      ) {
        updatedUser.birthdate = date;
      }
      if (password.trim() !== '') {
        updatedUser.password = password;
      }
      
      await axios.patch(`http://localhost:8080/users/${id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Profile updated!',
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        navigation('/profile');
      }, 1500);

    } catch (error) {
      const errorMessage = error?.response?.data?.error || 'Update failed';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    }
  }
};

  const validateForm = () => {
    const isCreate = typeForm === 'create';

    const firstName = firstNameRef.current.value.trim();
    const lastName = lastNameRef.current.value.trim();
    const email = emailRef.current.value.trim();

    if (isCreate) {
      if (!firstName) return showError("First name is required");
      if (!lastName) return showError("Last name is required");
      if (!date) return showError("Birth date is required");
      if (!isAdult(date)) return showError("You must be at least 18 years old");
      if (!email.includes('@')) return showError("Invalid email format");
      if (password.length < 6) return showError("Password must be at least 6 characters");
      if (password !== confirmpassword) return showError("Passwords do not match");
    } else {
      
      if (firstName.trim() !== '' && firstName.length < 2)
        return showError("First name must be at least 2 characters");

      if (lastName.trim() !== '' && lastName.length < 2)
        return showError("Last name must be at least 2 characters");

      if (email.trim() !== '' && !email.includes('@'))
        return showError("Invalid email format");

      if (password !== '' && password.length < 6)
        return showError("Password must be at least 6 characters");

      if (password !== '' && password !== confirmpassword)
        return showError("Passwords do not match");
      
      const birthdateChanged = date && new Date(date).toISOString().split('T')[0] !== user.birthdate.split('T')[0];
      if (birthdateChanged && !isAdult(date))
        return showError("You must be at least 18 years old");
      

    const hasChanged =
      (firstName.trim() !== '' && firstName.trim() !== user.firstName) ||
      (lastName.trim() !== '' && lastName.trim() !== user.lastName) ||
      (email.trim() !== '' && email.trim() !== user.email) ||
      (date && new Date(date).toISOString().split('T')[0] !== user.birthdate.split('T')[0]) ||
      birthdateChanged ||
      password.trim() !== '';
          
      if (!hasChanged) return showError("No changes detected");
      
    }

    return true;
  };

  const showError = (message) => {
    Swal.fire({ icon: 'error', title: 'Validation Error', text: message });
    return false;
  };

  const isAdult = (birthDate) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Si la fecha de nacimiento aún no ha cumplido este año, restamos 1 a la edad
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      return (age - 1) >= 18;
    }
    return age >= 18;
  };

  return (
    <form className={`mt-5 w-11/12 grid grid-cols-1 justify-items-center items-center gap-7 ${typeForm === 'update' ? 'md:grid-cols-2' : ''}`} onSubmit={submit}>
      <FloatLabel> 
        <InputText className="w-[276px]" id="first-name" ref={firstNameRef}  placeholder={user.firstName}/> 
        <label>First Name</label> 
      </FloatLabel>
      <FloatLabel> 
        <InputText className="w-[276px]" id="last-name" ref={lastNameRef} placeholder={user.lastName} /> 
        <label>Last Name</label> 
      </FloatLabel>
      <FloatLabel> 
        <Calendar className="w-[276px]" inputId="birth_date"  value={date} onChange={(e) => setDate(e.value)} /> 
        <label>Birth Date</label> 
      </FloatLabel>
      <FloatLabel>
        <InputText className="w-[276px]" id="email" ref={emailRef} type='email' placeholder={user.email} /> 
        <label>Email</label> 
      </FloatLabel>
      <FloatLabel> 
        <Password inputId="password" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask ={typeForm === 'create'}/> 
        <label>Password</label> 
      </FloatLabel>
      <FloatLabel> 
        <Password inputId="confirm-password" value={confirmpassword} onChange={(e) => setConfirmPassword(e.target.value)} toggleMask ={typeForm === 'create'}/> 
        <label>Confirm Password</label> 
      </FloatLabel>
      <Button className={`${typeForm === 'update' ? 'md:col-span-2' : ''} w-72 bg-secondary_color hover:bg-[#1b7998]`} type='submit' label={typeForm === "create" ? "Create" : "Update"} />
    </form>
  );
};

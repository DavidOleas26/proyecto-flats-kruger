import { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// servicios
import { LocalStorageService } from '../../../../services/localStorage/localStorage';
// libreria de componentes
import { Button } from 'primereact/button';
// Axios Peticiones
import axios from 'axios';
// Libreria de alertas
import Swal from 'sweetalert2'; // Importar SweetAlert
import profile from '../../../../assets/Img/profile.png'

// eslint-disable-next-line react/prop-types
export const ProfileCard = ({ id }) => {

    const [profileImage, setProfileImage] = useState(null);
    const [edit, setEdit]= useState(false);
    const navigation = useNavigate();
    const [user, setUser] = useState({
      firstName: '',
      lastName: '',
      birthdate: '',
      email: '',
    });

    // Context Logout
    const { logout } = useAuth() 

    // servicios
    const localStorageService = new LocalStorageService();

    // Llamada al backend para obtener el usuario
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
            const errorMessage = error?.response?.data?.error ||  error.code ||'Something went wrong'
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

    // Verificacio de usuario
    const checkUser = ({ userlogged }) => {
        if ( id === userlogged.userId ) {
            setEdit(true);
        }else{
            setEdit(false);
        }
    }

    // obtener imagen de portada axios
    const getProfileImage = async(id) => {
        try {
            const token = localStorageService.getUserToken();

            const response = await axios.get(`http://localhost:8080/users/${id}/profile-image`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const imageUrl = response.data.profileImageUrl || null;
            setProfileImage(imageUrl);
        } catch (error) {
            console.error("Error al obtener la imagen de perfil:", error.response?.data?.message || error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || error.message,
                showConfirmButton: false,
                timer: 1500,
            });
        }
    }

    // Formatear la fecha de nacimiento
    const formatBirthDate = (date) => {
        if (!date) return 'Fecha no disponible';

        if ( typeof(date) === 'object'  ) {
            const newdate = new Date(date.seconds*1000);
            return new Intl.DateTimeFormat('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }).format(newdate);
        }

        const newdate = new Date(date);
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }).format(newdate);
    };

    const handleNavigate = () => {
        navigation(`/update-profile/${id}`);
    };

    useEffect(()=>{
        // Obtener el usuario loggeado
        const userlogged =localStorageService.getLoggedUser();
        const userToken = localStorageService.getUserToken();
        getUser({userToken})
        checkUser({userlogged});

        getProfileImage(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    return(
        <>  
        <div className='absolute top-20 w-11/12 py-10 px-2 backdrop-blur-3xl rounded-3xl sm:relative sm:py-0 sm:top-0'>
            <div className="relative mx-auto w-11/12 py-5 flex flex-col justify-center items-center gap-4 sm:flex-row sm:gap-9">
                {edit && (
                    <div className="absolute z-10 top-2 right-4 sm:hidden">
                        <i className="pi pi-pen-to-square" onClick={handleNavigate}></i>
                    </div>
                )}
                <div className='flex flex-col items-center gap-3'>
                    <div id="img-perfil" className="">
                        <img src={profileImage ? profileImage: profile} alt="Imangen de perfil" className="aspect-square w-28 h-28 rounded-full object-cover sm:w-48 sm:h-auto"/>
                    </div>
                    <span className='text-secondary_text hidden sm:block'>{ user.email }</span>
                </div>
                <div className='max-w-[550px] px-2 py-5 flex flex-col items-center w-full gap-4 sm:gap-10 '>
                    <span className='sm:self-start sm:ml-2 text-primary_text font-Montserrat font-bold text-base sm:text-xl'>Account Details</span>
                    <div className='w-full flex justify-center sm:justify-between items-center'>
                        <span className='hidden sm:inline-block sm:ml-2'><i className="pi pi-user mr-2"></i>Name:</span>
                        <span className='text-primary_text font-Montserrat font-bold text-2xl sm:font-normal sm:text-lg'>{`${user.firstName} ${user.lastName}`}</span>
                    </div>

                    <div className='w-full flex justify-center sm:justify-between items-center'>
                        <span className='hidden sm:inline-block sm:ml-2'><i className="pi pi-calendar-clock mr-2"></i>Birth Date:</span>
                        <span className='font-Lora'>{formatBirthDate(user.birthdate)}</span>
                    </div>
                    <span className='font-Lora text-secondary_text text-base sm:hidden'>{user.email}</span>
                    {edit && (
                        <Button label="Edit" className='hidden sm:block mt-3 px-12 bg-secondary_color hover:bg-[#1b7998]' onClick={handleNavigate}/>
                    )}
                </div>
            </div>
        </div>

        </>
    );
}

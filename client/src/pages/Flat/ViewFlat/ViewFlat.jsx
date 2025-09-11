import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { FlatInfo } from "./FlatInfo/FlatInfo";
import { FlatCarrusel } from './flatCarrusel/FlatCarrusel';
import { Reviews } from './Reviews/Reviews';
import { LocalStorageService } from '../../../services/localStorage/localStorage';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../../../context/AuthContext';
// libreria de componentes

export const ViewFlat = () => {

  const [images, setImages] = useState([])
  const { logout } = useAuth()

  // obtener el id del piso
  let { flatId } = useParams();
  const navigation = useNavigate();

  const localStorageService = new LocalStorageService();
  const token = localStorageService.getUserToken()

  // Si no se envia ningun flatid retornar a home
  const getFlatInfo = async () => {
    if (!flatId) {
      navigation('/')
    }

    try {

      const response = await axios.get(`http://localhost:8080/flats/${flatId}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const { images } = response.data
      setImages(images)

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

  useEffect(()=>{
    if (!localStorageService.checkLoggedUser()){
        navigation('/login');
    }
    getFlatInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])


  return(
    <>  
    <div className="bg-bg_color_primary relative w-full h-full max-w-[1440px] m-auto flex flex-col items-center gap-2"> 
      <div className='mt-10 w-11/12 flex flex-col justify-center items-center sm:flex-row md:justify-around'>
        <section className='flex-1 flex justify-center items-center'>
          <FlatCarrusel images={images}/>
        </section>
        <section className='flex-1 w-11/12 max-w-[600px] mt-2 bg-gradient-to-br backdrop-blur-3xl sm:px-4'>
          <FlatInfo flatId={ flatId } />
        </section>
      </div>
      <div className='my-4 w-11/12'>
        <h3 className='font-Montserrat font-bold text-primary_text text-xl mb-4'>Reviews</h3>
        <Reviews/>
      </div>
    </div>
    </>
  );
}







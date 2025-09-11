import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FlatForm } from "../Components/FlatForm/FlatForm";
import { LocalStorageService } from "../../../services/localStorage/localStorage";

export const EditFlat = () => {

  // obtener el id del piso
  let { flatId } = useParams();
  const navigation = useNavigate();

  const localStorageService = new LocalStorageService();

  // Si no se envia ningun flatid retornar a home
  const checkFlatId = () => {
    if (!flatId) {
      navigation('/')
    }
  }

  useEffect(()=>{
    if (!localStorageService.checkLoggedUser()){
        navigation('/login');
    }
    checkFlatId();
  },[])

   return (
    <>
      <div className="relative w-screen h-screen max-w-[1440px]">
        <div className="max-w-[1440px] w-full h-screen bg-editflat bg-center bg-cover blur-sm md:blur-none md:[mask-image:linear-gradient(to_left,transparent_10%,black_45%)]"></div>
        <div className="absolute inset-0 flex justify-center items-center overflow-auto md:justify-end md:mr-12">
          <section className="w-11/12 min-w-[310px] max-w-[700px] max-h-[95vh] overflow-hidden hover:overflow-auto bg-gradient-to-br from-[#E7E7E7]/50 to-[#E7E7E7]/20 border border-white/60 drop-shadow-[0_35px_35px_rgba(0,0,0,0.07)] backdrop-blur-lg md:backdrop-blur-3xl flex flex-col items-center py-5 gap-4 rounded-2xl">
            <span className="self-start ml-3 font-Montserrat font-bold text-primary_text text-base sm:text-2xl">
              Edit Flat
            </span>
            <FlatForm flatId={ flatId }/>
          </section>
        </div>
      </div>
    </>
  );
};

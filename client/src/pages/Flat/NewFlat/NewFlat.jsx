import { useEffect } from "react";
import { FlatForm } from "../Components/FlatForm/FlatForm";
import { useNavigate } from "react-router-dom";
import { LocalStorageService } from "../../../services/localStorage/localStorage";

export const NewFlat = () => {

  const navigate = useNavigate();
  const localStorageService = new LocalStorageService();
  const userToken = localStorageService.getUserToken();

  useEffect(() =>{
      const userLogged = localStorageService.getLoggedUser();

      if (!userToken) {
          navigate("/login");
          return;
      }

      // Si no hay usuario logueado, redirige a login
      if (!userLogged) {
          navigate("/login");
          return;
      }
  })
  return (
    <>
      <div className="relative w-screen h-screen max-w-[1440px]">
        <div className="max-w-[1440px] w-full h-screen bg-newflat bg-center bg-cover blur-sm md:blur-none md:[mask-image:linear-gradient(to_right,transparent_10%,black_45%)]"></div>
        <div className="absolute inset-0 flex justify-center items-center overflow-auto md:justify-normal md:ml-12">
            <section className="w-11/12 min-w-[310px] max-w-[700px] max-h-[95vh] overflow-hidden hover:overflow-auto bg-gradient-to-br from-[#E7E7E7]/50 to-[#E7E7E7]/20 border border-white/60 drop-shadow-[0_35px_35px_rgba(0,0,0,0.07)] backdrop-blur-lg md:backdrop-blur-3xl flex flex-col items-center py-5 gap-4 rounded-2xl">
                <span className="self-start ml-3 font-Montserrat font-bold text-primary_text text-base sm:text-2xl">Create a new Flat</span>
                <FlatForm />
            </section>
        </div>
      </div>
    </>
  );
};

import { ProfileCard } from "./ProfileCard/ProfileCard";
import { CoverImage } from "../components/CoverImage/CoverImage";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Servicios
import { LocalStorageService } from "../../../services/localStorage/localStorage";

export const ViewProfile = () => {
    // Obtener el ID de la URL
    const { id: paramId } = useParams();
    const navigate = useNavigate();
    const [userId, setUserId] = useState(paramId);

    // Instancia del servicio de localStorage
    const localStorageService = new LocalStorageService();

    useEffect(() => {
        const userLogged = localStorageService.getLoggedUser();

        if (!userLogged) {
            navigate("/login");
            return;
        }

        // Si no hay ID en la URL, usar el del usuario logueado
        if (!paramId) {
            setUserId(userLogged.userId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="bg-bg_color_primary relative w-full h-screen max-w-[1440px] m-auto flex flex-col items-center">
            <CoverImage />
            {userId && <ProfileCard id={userId} />}
        </div>
    );
};

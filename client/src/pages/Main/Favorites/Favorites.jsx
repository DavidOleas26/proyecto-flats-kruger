import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlatTable } from "../../../components/FlatTable/FlatTable";
// Servicios
import { LocalStorageService } from "../../../services/localStorage/localStorage";

export const Favorites = () => {
    const navigate = useNavigate();
    const localStorageService = new LocalStorageService();
    const [userLogged, setUserLogged] = useState(null);

    useEffect(() => {
        const user = localStorageService.getLoggedUser();

        if (!user) {
            navigate("/login");
            return;
        }

        setUserLogged(user);
    }, [navigate]);

    return userLogged ? (
        <div className="bg-bg_color_primary relative w-full h-full max-w-[1440px] m-auto flex flex-col items-center">
            <h1>Favorites</h1>
            <div className="w-11/12">
                <FlatTable userLoggedId={userLogged.id} />
            </div>
        </div>
    ) : null;
};
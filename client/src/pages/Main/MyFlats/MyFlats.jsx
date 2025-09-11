import { useNavigate } from "react-router-dom";
import { LocalStorageService } from "../../../services/localStorage/localStorage";
import { MyFlatsTable } from "./MyFlatsTable/MyFlatsTable";
import { useEffect, useState } from "react";

export const MyFlats = () => {
    const navigate = useNavigate();
    const [userLoggedId, setUserLoggedId] = useState(null);

    const localStorageService = new LocalStorageService();

    useEffect(() => {
        const loggedUser = localStorageService.getLoggedUser();
        
        if (!loggedUser) {
            navigate("/login");
            return;
        }

        setUserLoggedId(loggedUser.id);
    }, []);

    return userLoggedId ? (
        <div className="bg-bg_color_primary relative w-full h-full max-w-[1440px] m-auto flex flex-col items-center">
            <h1>My Flats</h1>
            <div className="w-11/12">
                <MyFlatsTable userLoggedId={userLoggedId} />
            </div>
        </div>
    ) : null;
};
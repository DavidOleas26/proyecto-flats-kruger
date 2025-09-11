import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Servicios
import { LocalStorageService } from "../../services/localStorage/localStorage";
import { UserService } from "../../services/user/user";
import { UsersTable } from "./UsersTable/UsersTable";

export const AllUsers = () => {
    const navigate = useNavigate();
    const userService = new UserService();
    const localStorageService = new LocalStorageService();
    const [userLogged, setUserLogged] = useState(null);

    useEffect(() => {
        const user = localStorageService.getLoggedUser();

        if (!user) {
            navigate("/login");
            return;
        }

        setUserLogged(user);

        const checkAdmin = async () => {
            try {
                const result = await userService.checkAdminUser(user.id);
                if (!result) {
                    navigate("/");
                }
            } catch (error) {
                console.error("Error checking admin:", error);
                navigate("/");
            }
        };

        checkAdmin();
    }, []);

    return(
        <>  
            {userLogged && (
                <UsersTable userLoggedId={userLogged.id}/>
            )}
        </>
    );
}
import { useNavigate } from "react-router-dom";
import { FlatTable } from "../../../components/FlatTable/FlatTable";
import { LocalStorageService } from "../../../services/localStorage/localStorage";
import { useEffect } from "react";

export const Home = ()=> {

    const localStorageService = new LocalStorageService();
    const navigate = useNavigate();
    useEffect(() =>{
        if (!localStorageService.checkLoggedUser()){
            navigate('/login');
        }
    })

    return(
        <>
            <div className="bg-bg_color_primary relative w-full h-full max-w-[1440px] m-auto flex flex-col  items-center">
                <div className="my-4 w-11/12">
                    <FlatTable/>
                </div>
            </div>
        </>
    );
}
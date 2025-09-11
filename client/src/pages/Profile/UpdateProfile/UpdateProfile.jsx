import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserForm } from "../../../components/UserForm/UserForm";
import { CoverImage } from "../components/CoverImage/CoverImage";
import profile from '../../../assets/Img/profile.png';
// Servicios
import { LocalStorageService } from "../../../services/localStorage/localStorage";
import axios from "axios";
import Swal from "sweetalert2";
import { ImagePlus } from "lucide-react";

export const UpdateProfile = () => {
    const { id: paramId } = useParams();
    const navigate = useNavigate();
    const [userId, setUserId] = useState(paramId);
    const [profileImage, setProfileImage] = useState(null);
    
    // eslint-disable-next-line no-unused-vars
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Instancia del servicio de localStorage y apiImages
    const localStorageService = new LocalStorageService();
    const token = localStorageService.getUserToken();

    // Obtener imagen de perfil
    const getProfileImage = async (id) => {
        try {

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

    };

      const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setSelectedImage(file);
        const formData = new FormData();
        formData.append("profileImage", file);

        const token = localStorageService.getUserToken();

        try {
            setUploading(true);
            const response = await axios.post(
                "http://localhost:8080/users/upload-profile-image",
                formData,
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                }
            );

            const { imageUrl } = response.data;
            setProfileImage(imageUrl);
            Swal.fire({
                icon: "success",
                title: "Imagen actualizada",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Error subiendo imagen:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data?.message || "No se pudo subir la imagen",
            });
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        const userLogged = localStorageService.getLoggedUser();
        const userToken = localStorageService.getUserToken();

        if (!userToken) {
            navigate("/login");
            return;
        }

        // Si no hay usuario logueado, redirige a login
        if (!userLogged) {
            navigate("/login");
            return;
        }

        // Si no hay ID en la URL, usa el del usuario logueado
        const finalUserId = paramId || userLogged.userId;
        setUserId(finalUserId);
        getProfileImage(finalUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]); 

    return (
        <div className="bg-bg_color_primary relative w-full h-screen max-w-[1440px] m-auto flex flex-col items-center">
            <CoverImage />
            <div className="w-11/12 max-w-[950px] py-10 px-2 mt-6 flex flex-col justify-center items-center gap-4 md:flex-row md:gap-2 border rounded-3xl drop-shadow-[0_35px_35px_rgba(0,0,0,0.07)] backdrop-blur-lg">
                <div id="img-perfil" className="relative ">
                    <img 
                        src={profileImage || profile} 
                        alt="Imagen de perfil" 
                        className="w-28 h-28 rounded-full object-cover md:w-36 md:h-auto md:mr-4"
                    />
                    <label
                        htmlFor="upload"
                        className="absolute top-24 left-1 cursor-pointer flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full w-10 h-10 transition-all"
                        title="Cambiar imagen de perfil"
                    >
                        <ImagePlus size={20} />
                    </label>

                    <input
                        id="upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={uploading}
                    />
                    {uploading && (
                        <p className="text-sm text-gray-500 mt-2">Subiendo imagen...</p>
                    )}
                </div>
                {userId && <UserForm id={userId} />}
            </div>
        </div>
    );
};

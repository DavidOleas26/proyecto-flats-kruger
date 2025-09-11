import { useEffect, useState } from "react";
import { ImagesService } from "../../../../services/apiImages/apiImages";

export const CoverImage = ()=> {
    const [coverImage, setCoverImage] = useState(null);

    // instancia del servicio de localstorage y apiImages
    const imagesService = new ImagesService();

    // obtencion de la imagen de portada de unsplash
    const getCoverImage = async() => {
        const response = await imagesService.converImageRandom();
        setCoverImage(response);
    }

    // useEffect(()=>{
    //     getCoverImage();
    // },[])

    return(
        <>
            <section className="w-full max-w-[1440px] mx-auto sm:min-h-[12rem]">
                <div id="img-portland" className="w-full h-32 m-auto bg-gradient-to-r from-[#ED9F9F] to-[#5C3030] rounded-b-2xl sm:h-36">
                    { coverImage && (
                        <img src={coverImage} alt="Cover" className="object-cover rounded-b-2xl w-full h-full sm:h-36" />
                    )}
                </div>    
            </section>
        </>
    );
}
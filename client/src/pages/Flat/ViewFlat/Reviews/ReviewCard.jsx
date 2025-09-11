/* eslint-disable react/prop-types */
import { Star } from "lucide-react";
import { Divider } from "primereact/divider";

export const ReviewCard = ({review}) => {
  const {
    senderId,         
    rating,
    content,
    createdAt     
  } = review;

  const convertDate = (dateString) => {
    const formattedDate = new Date(dateString).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return formattedDate
  }

  return(
    <>
      <div className="flex gap-4 p-4 bg-white shadow-md rounded-xl items-center ">
        {/* Imagen de perfil */}
        <img
          src={senderId.profileImageUrl || '/default-avatar.png'}
          alt={senderId.firstName}
          className="w-12 h-12 rounded-full object-cover"
        />

        {/* Contenido */}
        <div className="flex flex-col flex-1">
          {/* Encabezado */}
          <div className="flex flex-row sm:justify-around w-full">
            <div>
              <span className="text-sm font-semibold text-gray-800">{`${senderId.firstName} ${senderId.lastName}`}</span>
              <div className="flex items-center gap-1 mt-1 sm:mt-0">
                {/* Estrellas */}
                {[1, 2, 3, 4, 5].map((index) => (
                  <Star
                    key={index}
                    size={16}
                    className={`${
                      index <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">{rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="text-xs text-gray-500 hidden sm:block sm:ml-auto mt-1 sm:mt-0">
              {convertDate(createdAt)}
            </div>
          </div>
          <Divider className="my-1" />
          {/* Contenido del review */}
          <p className="mt-2 text-sm text-gray-700 line-clamp-3">
            {content}
          </p>
        </div>
    </div>
    </>
  );
}
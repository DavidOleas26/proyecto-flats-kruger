
// eslint-disable-next-line react/prop-types
export const FlatCarrusel = ({ images = [] }) => {
  if (!images.length) return null;

  return (
    <div className="grid gap-2">
      {/* Imagen principal */}
      <div className="col-span-full">
        <img
          src={images[0]}
          alt="Imagen principal"
          className="w-full h-auto sm:h-[300px] object-cover rounded-lg"
        />
      </div>

      {/* Resto de imágenes (max 3) en una fila con columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {images.slice(1, 4).map((img, index) => (
          <img 
            key={index}
            src={img}
            alt={`Imagen ${index + 2}`}
            className="w-full h-auto object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Libreria de componentes
import { InputText } from "primereact/inputtext";
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch } from 'primereact/inputswitch';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
// importar los servicios de flat para crear flat en firebase
import { FlatService } from '../../../../services/flat/flat.js'
import { LocalStorageService } from "../../../../services/localStorage/localStorage.js";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../../../context/AuthContext.jsx";
import { ProgressSpinner } from "primereact/progressspinner";

// eslint-disable-next-line react/prop-types
export const FlatForm = ({flatId}) => {

  // determinar si el formulario crea o visualiza usario
  let typeForm = 'create';
  if (flatId) {
    typeForm = 'update';
  }

  const navigation = useNavigate();
    // Context
  const { logout } = useAuth();

  
  const [loading, setLoading] = useState(false);
  //Referencias a los inputs
  const [city, setCity] = useState('')
  const [streetname, setStreetName] = useState('')
  const [streetNumber, setStreetNumber] = useState(null);
  const [area, setArea] = useState(null);
  const [acChecked, setAcChecked] = useState(true);
  const [yearBuilt, setYearBuilt] = useState(null);
  const [rentPrice, setRenrPrice] = useState(null);
  const [date, setDate] = useState(null);
  const [description, setDescription] = useState("");

  // flat auxiliar
  const [selectedImages, setSelectedImages] = useState([]);
  const [flat, setflat] = useState({
    city: '',
    streetName: '',
    streetNumber: '',
    area: '',
    ac: '',
    yearBuilt: '',
    rentPrice: '',
    dateAvailable: '',
    createdBy: '',

  });

  // instancia de la clase flatService
  const flatService = new FlatService();

  const localStorageService = new LocalStorageService();
  const userlogged = localStorageService.getLoggedUser();
  const userToken = localStorageService.getUserToken();

  const checkFlatOwner = async ()=> {
    const response = await flatService.getFlatbyId(flatId);
    if ( response.data.createdBy !== userlogged.id) {
      navigation('/');
    }else {
      setflat(response.data)
    }
  }

  useEffect(()=>{
    if ( typeForm === 'update') {
      checkFlatOwner();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (typeForm === 'update' && flat) {
      setStreetNumber(flat.streetNumber || null);
      setArea(flat.area || null);
      setAcChecked(flat.ac ?? true);  // Manejo de valores booleanos con nullish coalescing
      setYearBuilt(convertFireBaseDate(flat.yearBuilt));
      setRenrPrice(flat.rentPrice || null);
      setDate(convertFireBaseDate(flat.dateAvailable));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flat]);

  // Convertir la fecha que obtiene de firebase a tipo date para visualizar
  const convertFireBaseDate = (timeStamp) => {
    if (!timeStamp || !timeStamp.seconds) return null;
    return new Date(timeStamp.seconds * 1000);  // Convertir segundos a milisegundos
  }

  // funcion submit formulario
  const submit = async (event)=> {
    event.preventDefault();

    if (!validateForm()) return;
    
    const cityRaw = city.trim();
    const cityCapitalized = cityRaw
      ? cityRaw.charAt(0).toUpperCase() + cityRaw.slice(1)
      : '';

    const newFlat = {
      city: cityCapitalized,
      streetName: streetname.trim(),
      streetNumber: streetNumber,
      areaSize: area,
      hasAc: acChecked,
      yearBuilt: yearBuilt,
      rentPrice: rentPrice,
      dateAvailable: date,
      description,
    }
    console.log('flat',newFlat)

    setLoading(true);
    if (typeForm === 'create') {
      try {
        const response = await axios.post('http://localhost:8080/flats', newFlat, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
        );

        const { flat ,message } = response.data;
        const flatId = flat._id

        if (selectedImages.length > 0) {
          const formData = new FormData();
          for (const img of selectedImages) {
            formData.append('departmentImages', img);
          }

          await axios.post(`http://localhost:8080/flats/${flatId}/images`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${userToken}`,
            },
          });
        }

        Swal.fire({
          icon: 'success',
          title: 'Flat Created',
          text: message,
          showConfirmButton: false,
          timer: 1500,
        });

        setTimeout(() => {
          navigation(`/`);
        }, 1500);

      } catch (error) {
          const errorStatus = error.response.status    
          const errorMessage = error.response.data.error || 'Registration failed';
          Swal.fire({
              icon: 'error',
              title: 'Error',
              text: errorMessage,
              showConfirmButton: false,
              timer: 1500,
          });

          if ( errorStatus === 401 ) {
              setTimeout(() => {
                  logout()
                  navigation('/login');
              }, 1500);
          } else {
              setTimeout(() => {
                  navigation('/');
              }, 1500);
          }
      }finally {
        setLoading(false); 
      }
    }

    // if ( typeForm === 'update' ) {
    //   const result = await flatService.updateFlat(newFlat, flatId)

    //   if(result.data !== null) {
    //     console.log('update', result.data);
    //     alert(result.message);
    //     navigation('/');
    //   }else {
    //     alert(result.message);
    //   }
    // }
    
  }

  const validateForm = () => {
    // eslint-disable-next-line no-unused-vars
    const isCreate = typeForm === 'create';
    const today = new Date();
    today.setHours(0, 0, 0, 0); // ignorar hora para comparar fechas

    // Campos obligatorios
    if (!city.trim()) return showError("City is required");
    if (!streetname.trim()) return showError("Street name is required");

    // Números positivos
    if (!streetNumber || streetNumber <= 0) return showError("Street number must be a positive number");
    if (!area || area <= 0) return showError("Area size must be a positive number");
    if (!rentPrice || rentPrice <= 0) return showError("Rent price must be a positive number");

    // Año de construcción
    if (!yearBuilt) return showError("Year built is required");
    if (yearBuilt.getFullYear() > new Date().getFullYear()) {
      return showError("Year built cannot be in the future");
    }

    // Fecha disponible
    if (!date) return showError("Available date is required");
    if (date < today) return showError("Available date cannot be before today");

    if (selectedImages.length === 0)
      return showError("Please select at least one image for the flat");

    if (selectedImages.length > 4)
      return showError("You can only upload up to 4 images");

    return true;
  };

  const showError = (message) => {
    Swal.fire({ icon: 'error', title: 'Validation Error', text: message });
    return false;
  };

  const removeImage = (indexToRemove) => {
    setSelectedImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <>
      <form className="realtive w-full grid grid-cols-1 justify-items-center items-center gap-4 sm:grid-cols-2" onSubmit={(event)=> submit(event)}>
        {loading && (
        <div className="absolute z-50 flex justify-center items-center mt-4">
            <ProgressSpinner />
        </div>
        )}
        {/* input city */}
        <div className="flex flex-col">
            <label htmlFor="city" className="font-Opensans text-sm text-primary_text mb-1 ml-5">City</label>
            <div className="flex items-center gap-1">
                <i className="pi pi-map"></i>
                <InputText id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Quito" required/>
            </div>
            <small id="city-help" className="font-Opensans text-text_danger text-xs hidden">
                Enter your username to reset your password.
            </small>
        </div>
        {/* input street name */}
        <div className="flex flex-col">
          <label htmlFor="street-name" className="font-Opensans text-sm text-primary_text mb-1 ml-5">Street Name</label>
          <div className="flex items-center gap-1">
            <i className="pi pi-angle-double-up"> </i>
            <InputText id="street-name" value={streetname} onChange={(e) => setStreetName(e.target.value)} placeholder="Av 6 de Diciembre" required/>               
          </div>
          <small id="street-help" className="font-Opensans text-text_danger text-xs hidden">
            Enter your username to reset your password.
          </small>
        </div>
        {/* input street number */}
        <div className="flex flex-col">
          <label htmlFor="street-number" className="font-Opensans text-sm text-primary_text mb-1 ml-5">Street Number</label>
          <div className="flex items-center gap-1">
            <i className="pi pi-list"> </i>
            <InputNumber inputId="street-number" value={streetNumber} onValueChange={(e) => setStreetNumber(e.value)} placeholder="9" required/>         
          </div>
          <small id="street_number-help" className="font-Opensans text-text_danger text-xs hidden">
            Enter your username to reset your password.
          </small>
        </div>
        {/* input area size */}
        <div className="flex flex-col">
          <label htmlFor="area" className="font-Opensans text-sm text-primary_text mb-1 ml-5">Area Size</label>
          <div className="flex items-center gap-1">
            <i className="pi pi-arrows-alt"> </i>
            <InputNumber inputId="area" value={area} onValueChange={(e) => setArea(e.value)} placeholder="100 m2" suffix=" m2"/>         
          </div>
          <small id="area-help" className="font-Opensans text-text_danger text-xs hidden">
            Enter your username to reset your password.
          </small>
        </div>
        {/* input ac */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <label htmlFor="ac" className="font-Opensans text-sm text-primary_text mb-1 ">Has AC?</label>
            <InputSwitch checked={acChecked} onChange={(e) => setAcChecked(e.value)} />         
          </div>
          <small id="ac-help" className="font-Opensans text-text_danger text-xs hidden">
            Enter your username to reset your password.
          </small>
        </div>
        {/* input year built */}
        <div className="flex flex-col">
          <label htmlFor="year-built" className="font-Opensans text-sm text-primary_text mb-1 ml-5">Year Built</label>
          <div className="flex items-center gap-1">
            <i className="pi pi-calendar"> </i>
            <Calendar id="year-built" value={yearBuilt} onChange={(e) => setYearBuilt(e.value)} placeholder="1998" view="year" dateFormat="yy" />         
          </div>
          <small id="year-help" className="font-Opensans text-text_danger text-xs hidden">
            Enter your username to reset your password.
          </small>
        </div>
        {/* input rent price */}
        <div className="flex flex-col">
          <label htmlFor="rent-price" className="font-Opensans text-sm text-primary_text mb-1 ml-5">Rent Price</label>
          <div className="flex items-center gap-1">
            <i className="pi pi-dollar"> </i>
            <InputNumber inputId="rent-price" value={rentPrice} onValueChange={(e) => setRenrPrice(e.value)} placeholder="$ 500" prefix="$ "/>         
          </div>
          <small id="rent_price-help" className="font-Opensans text-text_danger text-xs hidden">
            Enter your username to reset your password.
          </small>
        </div>
        {/* input date available */}
        <div className="flex flex-col">
          <label htmlFor="date-available" className="font-Opensans text-sm text-primary_text mb-1 ml-5">Date Available</label>
          <div className="flex items-center gap-1">
            <i className="pi pi-clock"> </i>
            <Calendar className="w-[248px]" value={date} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy" showIcon/>         
          </div>
          <small id="date_available-help" className="font-Opensans text-text_danger text-xs hidden">
            Enter your username to reset your password.
          </small>
        </div>  

        {/* TextArea para descripcion */}
        <div className=" flex flex-col mt-4 w-10/12 sm:col-span-2">
          <label htmlFor="description" className="font-Opensans text-sm text-primary_text mb-1 ml-5">
            Description
          </label>
          <div className="flex items-start gap-1">
            <i className="pi pi-align-left pt-1"></i>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a brief description of the apartment..."
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none"
            />
          </div>
          <small id="description-help" className="font-Opensans text-text_danger text-xs hidden">
            Please provide a short description.
          </small>
        </div>

        {/* Carga de imagenes */}
        <div className="justify-self-start ml-14 flex flex-col gap-2 items-start">
          <label className="text-sm text-primary_text font-semibold">Subir imágenes</label>

          {/* Botón simulado */}
          <label
            htmlFor="images-upload"
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <i className="pi pi-upload" /> Elegir imágenes
          </label>

          {/* Input real oculto */}
          <input
            id="images-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setSelectedImages([...e.target.files])}
            className="hidden"
          />

          {/* Miniaturas */}
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedImages.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  className="w-20 h-20 rounded-full object-cover border shadow"
                />
                {/* Botón de eliminar */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 text-xs hidden group-hover:flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
        <Button type={'submit'} label={ typeForm == 'update' ? 'Update' : 'Create' } className="sm:col-span-2"/>
      </form>
    </>
  );
};

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Servicios
import { LocalStorageService } from "../../../../services/localStorage/localStorage";
import { Fan } from "../../../../assets/svg/fan";
import { Building2, MapPin, Ruler, Calendar, Snowflake, Wallet } from "lucide-react";
// 
import { Divider } from 'primereact/divider';
import axios from "axios";
import Swal from "sweetalert2";
        

// eslint-disable-next-line react/prop-types
export const FlatInfo = ({ flatId }) => {
  const [edit, setEdit] = useState(false);
  const [flat, setFlat] = useState({});
  const navigation = useNavigate();

  const localStorageService = new LocalStorageService();
  const userlogged = localStorageService.getLoggedUser();
  const token = localStorageService.getUserToken();

  const checkFlatOwner = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/flats/${flatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const flat = response.data;
      setFlat(flat);
      setEdit(flat?.ownerId?._id === userlogged.userId);
    } catch (error) {
      const errorMessage = error?.response?.data?.error || error.code || 'Something went wrong';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  useEffect(() => {
    checkFlatOwner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatYearBuilt = (yearString) => {
    const date = new Date(yearString);
    return isNaN(date) ? 'N/A' : date.getFullYear();
  };

  const formatDateAvailable = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? 'N/A'
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleNavigate = () => {
    navigation(`/edit-flat/${flatId}`);
  };

  return (
    <div className="flex flex-col gap-4 relative p-5 bg-white shadow-2xl rounded-2xl max-w-3xl mx-auto border border-gray-100">
      {edit && (
        <button
          onClick={handleNavigate}
          className="absolute top-4 right-4 bg-teal-700 hover:bg-teal-800 text-white text-sm px-4 py-2 rounded-lg shadow-md transition"
        >
          Edit
        </button>
      )}

      {/* Título y ubicación */}
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-primary_text font-Montserrat flex items-center gap-2">
          <Building2 className="w-5 h-5 text-teal-700" />
          {`${flat.city || 'City'} - Apartment`}
        </h3>
        <p className="text-secondary_text text-sm font-Lora flex items-center gap-1 mt-1">
          <MapPin className="w-4 h-4 text-gray-400" />
          {`${flat.streetName || ''} ${flat.streetNumber || ''}`}
        </p>
      </div>

      <Divider className="my-3" />

      {/* Precio */}
      <div className="flex flex-col items-start gap-1">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-teal-700" />
          <span className="text-xl text-teal-700 font-bold font-Lora">
            ${flat.rentPrice || 'N/A'}
          </span>
        </div>
        <span className="text-sm text-gray-500 font-Opensans">
          Monthly rent price for this apartment.
        </span>
      </div>

      <Divider className="my-3" />

      {/* Características */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-secondary_text font-Lora flex justify-center items-center gap-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            Year Built
          </p>
          <p className="text-base text-primary_text">{formatYearBuilt(flat.yearBuilt)}</p>
        </div>
        <div>
          <p className="text-sm text-secondary_text font-Lora flex justify-center items-center gap-1">
            <Ruler className="w-4 h-4 text-gray-400" />
            Area Size
          </p>
          <p className="text-base text-primary_text">{flat.areaSize} m²</p>
        </div>
        {flat.hasAc && (
          <div>
            <p className="text-sm text-secondary_text font-Lora flex justify-center items-center gap-1">
              <Snowflake className="w-4 h-4 text-blue-400" />
              Air Conditioning
            </p>
            <div className="flex justify-center mt-1">
              <Fan /> {/* Si estás usando tu ícono personalizado de Fan, lo dejas aquí */}
            </div>
          </div>
        )}
      </div>

      <Divider className="my-3" />

      {/* Descripción */}
      <div>
        <p className="text-sm text-primary_text font-semibold font-Opensans mb-1">
          Description:
        </p>
        <p className="text-sm text-primary_text/70 font-Opensans whitespace-pre-wrap">
          {flat.description || 'No description provided for this apartment.'}
        </p>
      </div>

      {/* Fecha disponible */}
      <p className="mt-6 text-sm text-primary_text font-Opensans flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="font-semibold">Date Available:</span>{' '}
        {formatDateAvailable(flat.dateAvailable)}
      </p>
    </div>
  );
};

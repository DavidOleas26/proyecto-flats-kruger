import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
// servicios
import { LocalStorageService } from "../../services/localStorage/localStorage";
import { FlatService } from "../../services/flat/flat";
// dependencias
import axios from "axios";
import Swal from "sweetalert2";
import { ArrowDown01, ArrowDown10, ArrowDownAZ, ArrowDownZA, CalendarCheck, Hammer, Heart, MapPin, Ruler, Snowflake } from "lucide-react";
import { Paginator } from "primereact/paginator";

// eslint-disable-next-line react/prop-types
export const FlatTable = ({ userLoggedId }) => {
  
  let typeTable = "home";
  if (userLoggedId) {
    typeTable = "favorites";
  }

  const { logout } = useAuth()
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [flats, setFlats] = useState([]);

  const [first, setFirst] = useState(0); // primer elemento visible
  const [rows, setRows] = useState(10); // cantidad por página
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1, limit: 10 }); // info del backend

  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [minArea, setMinArea] = useState(null);
  const [maxArea, setMaxArea] = useState(null);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("asc"); // o "desc"
  const [filters, setFilters] = useState({});


  // instancia del servicio flat
  const flatService = new FlatService();
  
  // variable para obtener al usuario loggeado
  const localstorageService = new LocalStorageService();
  const userLogged = localstorageService.getLoggedUser();
  const token = localstorageService.getUserToken();

  // funcion para obetener los flats de firebase
  const getFlats = async (page = 1) => {
    setLoading(true);
    try {
      const query = buildQueryParams(filters, page, rows)
      const response = await axios.get(`http://localhost:8080/flats/?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const flats = response.data.data
      const { pagination } = response.data

      setFlats(flats);
      setPagination(pagination)

      setFirst((pagination.page - 1) * pagination.limit); // actualiza "first"
      setRows(pagination.limit); // actualiza "rows"

    } catch (error) {
      const errorStatus = error?.response?.status    
      const errorMessage = error?.response?.data?.error ||  error.code ||'Something went wrong'
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
            navigate('/login');
        }, 1500);
      } else {
        setTimeout(() => {
            navigate('/');
        }, 1500);
      }
    }finally {
      setLoading(false); 
    } 
  };


  const getFavoriteFlats = async () => {
    setLoading(true);
    const response = await flatService.getFavoriteFlats(userLogged.id);
    const favoriteFlats = response.data.map((flat) => flat.data);
    console.log(favoriteFlats);
    setFlats(favoriteFlats);
    setLoading(false);
  };

  useEffect(() => {
    if (typeTable === "home") {
      getFlats();
    } else if (typeTable === "favorites") {
      getFavoriteFlats();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);



  // eslint-disable-next-line no-unused-vars
  const toggleFavoriteFlat = async (rowData, isFavorite, setIsFavorite) => {
    const favoriteFlat = {
      createdBy: rowData.createdBy,
      flatId: rowData.id,
      userLoggedId: userLogged.id,
    };

    if (!isFavorite) {
      // eslint-disable-next-line no-unused-vars
      const result = await flatService.addFavoriteFlat(favoriteFlat);
      setIsFavorite(true);
    } else {
      // eslint-disable-next-line no-unused-vars
      const result = await flatService.removeFavoriteFlat(favoriteFlat);
      setIsFavorite(false);
      // Si estamos en la vista "favorites", eliminamos el piso del estado
      if (typeTable === "favorites") {
        setFlats((prevFlats) => prevFlats.filter((flat) => flat.id !== rowData.id));
      }
    }
  };

  // eslint-disable-next-line no-unused-vars
  const checkFavorite = async (favoritetFlat, setIsFavorite) => {
    const result = await flatService.checkFavoriteFlat(favoritetFlat);
    if (result.data !== null) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  };



  const viewFlat = (id) => {
    navigate(`/view-flat/${id}`);
  };

  const handleClear = () => {
    setCity("");
    setMinPrice(null);
    setMaxPrice(null);
    setMinArea(null);
    setMaxArea(null);
    setSortField('createdAt')
  };

  const validateForm = () => {
    if ( minPrice && maxPrice && minPrice > maxPrice ) return showError('Min price can not be greater than maxprice')
    if ( minArea && maxArea && minArea > maxArea ) return showError('Min area can not be greater than max area')
    return true
  }

  const showError = (message) => {
      Swal.fire({ icon: 'error', title: 'Validation Error', text: message });
      return false;
  }

  const buildQueryParams = (filters, page = 1, limit = 10) => {
    const queryParams = new URLSearchParams();

    if (filters.city) queryParams.append("city", filters.city);
    if (filters.minPrice != null) queryParams.append("minPrice", filters.minPrice);
    if (filters.maxPrice != null) queryParams.append("maxPrice", filters.maxPrice);
    if (filters.minArea != null) queryParams.append("minArea", filters.minArea);
    if (filters.maxArea != null) queryParams.append("maxArea", filters.maxArea);

    queryParams.append("sortBy", sortField || "createdAt");
    queryParams.append("order", sortOrder || "asc");

    queryParams.append("page", page);
    queryParams.append("limit", limit);

    return queryParams.toString();
  };
    
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const filters = {
      city,
      minPrice,
      maxPrice,
      minArea,
      maxArea
    };
    setFilters(filters)

  };

  const onPageChange = (event) => {
    const newPage = event.first / event.rows + 1;
    setRows(event.rows); // por si el usuario cambia el número de filas por página
    getFlats(newPage);
  };

  return (
    <>
      {/* Barra de filtraado */}
      <section className="w-fit mx-auto bg-white p-4 rounded-lg shadow-md mb-6 overflow-x-auto">
        <form onSubmit={(event) => handleSubmit(event)} className="flex flex-wrap gap-4 items-end">
          {/* City + Sort */}
          <div className="flex flex-col">
            <label htmlFor="city" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setSortField("city");
                  setSortOrder(prev => (sortField === "city" && prev === "asc" ? "desc" : "asc"));
                }}
              >
                {sortField === "city" ? (
                  sortOrder === "asc" ? <ArrowDownAZ size={16} /> : <ArrowDownZA size={16} />
                ) : (
                  <ArrowDownZA size={16} className="opacity-30" />
                )}
              </button>
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Quito"
              className="w-36 border border-gray-300 rounded-md px-2 py-1 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          {/* Min Price */}
          <div className="flex flex-col">
            <label htmlFor="minPrice" className="text-sm font-medium text-gray-700">
              <button
                type="button"
                onClick={() => {
                  setSortField("rentPrice");
                  setSortOrder(prev => (sortField === "rentPrice" && prev === "asc" ? "desc" : "asc"));
                }}
              >
                {sortField === "rentPrice" ? (
                  sortOrder === "asc" ? <ArrowDown10 size={16} /> : <ArrowDown01 size={16} />
                ) : (
                  <ArrowDown10 size={16} className="opacity-30" />
                )}
              </button>
              Min Price
            </label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={minPrice ?? ''}
              onChange={(e) => setMinPrice(e.target.value === '' ? null : Number(e.target.value))}
              placeholder="0"
              className="w-28 border border-gray-300 rounded-md px-2 py-1 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          {/* Max Price + Sort */}
          <div className="flex flex-col">
            <label htmlFor="maxPrice" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              Max Price
            </label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={maxPrice ?? ''}
              onChange={(e) => setMaxPrice(e.target.value === '' ? null : Number(e.target.value))}
              placeholder="1000"
              className="w-28 border border-gray-300 rounded-md px-2 py-1 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          {/* Min Area */}
          <div className="flex flex-col">
            <label htmlFor="minArea" className="text-sm font-medium text-gray-700">
              <button
                type="button"
                onClick={() => {
                  setSortField("areaSize");
                  setSortOrder(prev => (sortField === "areaSize" && prev === "asc" ? "desc" : "asc"));
                }}
              >
                {sortField === "areaSize" ? (
                  sortOrder === "asc" ? <ArrowDown10 size={16} /> : <ArrowDown01 size={16} />
                ) : (
                  <ArrowDown10 size={16} className="opacity-30" />
                )}
              </button>
              Min Area
            </label>
            <input
              type="number"
              id="minArea"
              name="minArea"
              value={minArea ?? ''}
              onChange={(e) => setMinArea(e.target.value === '' ? null : Number(e.target.value))}
              placeholder="0"
              className="w-28 border border-gray-300 rounded-md px-2 py-1 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          {/* Max Area + Sort */}
          <div className="flex flex-col">
            <label htmlFor="maxArea" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              Max Area
            </label>
            <input
              type="number"
              id="maxArea"
              name="maxArea"
              value={maxArea ?? ''}
              onChange={(e) => setMaxArea(e.target.value === '' ? null : Number(e.target.value))}
              placeholder="200"
              className="w-28 border border-gray-300 rounded-md px-2 py-1 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition"
          >
            Apply
          </button>

          {/* Clear */}
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400 transition"
          >
            Clear
          </button>
        </form>
      </section>

      {/* {flats.length === 0 &&
        <div className="text-center text-gray-500 py-8 text-lg font-semibold">
          No flats Published
        </div>
      } */}
      <div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-teal-700 font-semibold">Cargando departamentos...</span>
          </div>
        ) : (
          // Grid de departamentos
          <div className="px-4 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flats.map((flat) => (
                <div
                  key={flat._id}
                  className="relative bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition"
                >
                  {/* Botono de Me gusta */}
                  <Heart
                    className="absolute cursor-pointer right-3 top-3 stroke-white fill-slate-300 hover:scale-125 transition-all"  
                  />
                  {/* Imagen principal */}
                  <img
                    src={flat.images?.[0] || ''}
                    alt="Apartment"
                    className="w-full h-48 object-cover"
                  />

                  {/* Información del flat */}
                  <div className="relative p-4 flex flex-col gap-2">
                    {/* Dirección */}
                    <span className="text-lg font-bold text-gray-800 flex items-center gap-1">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      {flat.streetName} {flat.streetNumber}, {flat.city}
                    </span>

                    {/* Precio */}
                    <p className="text-teal-600 font-semibold text-xl flex items-center gap-2">
                      ${flat.rentPrice} / mes
                    </p>
                    
                    {/* Detalles adicionales */}
                    <div className="text-sm my-2 text-gray-600 flex flex-col gap-1">
                      <div className="flex flex-row gap-4">
                        <div className="flex items-center gap-2">
                          <Ruler size={16} className="text-gray-500" />
                          Área: {flat.areaSize} m²
                        </div>
                        <div className="flex items-center gap-2">
                          <Snowflake size={16} className="text-gray-500" />
                          A/C: {flat.hasAc ? 'Sí' : 'No'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarCheck size={16} className="text-gray-500" />
                        Disponible: {new Date(flat.dateAvailable).toLocaleDateString('es-EC')}
                      </div>
                      <div className="flex items-center gap-2">
                        <Hammer size={16} className="text-gray-500" />
                        Construido en: {new Date(flat.yearBuilt).getFullYear()}
                      </div>
                    </div>

                    {/* Propietario */}
                    <div className="flex items-center gap-3 mt-2">
                      <img
                        src={flat.ownerId?.profileImageUrl}
                        alt={flat.ownerId?.firstName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {flat.ownerId?.firstName} {flat.ownerId?.lastName}
                      </span>
                    </div>

                    {/* Botón Ver Más */}
                    <button
                      onClick={() => viewFlat(flat._id)}
                      className="absolute bottom-3 mt-3 self-end text-sm px-4 py-2 bg-[#F26721] hover:bg-[#a94a0a] text-white rounded-lg font-semibold transition"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}   

        {/* Paginator */}
        <div className="card">
            <Paginator 
              first={first}
              rows={rows}
              totalRecords={pagination.total}
              onPageChange={onPageChange}
            />
        </div>   
      </div>
    </>
  );
};

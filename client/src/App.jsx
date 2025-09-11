import './App.css';
import { Route, Routes, useLocation } from "react-router-dom";
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { ViewProfile } from './pages/Profile/ViewProfile/ViewProfile';
import { UpdateProfile } from './pages/Profile/UpdateProfile/UpdateProfile';
import { NewFlat } from './pages/Flat/NewFlat/NewFlat';
import { EditFlat } from './pages/Flat/EditFlat/EditFlat';
import { ViewFlat } from './pages/Flat/ViewFlat/ViewFlat';
import { Home } from './pages/Main/Home/Home';
import { Favorites } from './pages/Main/Favorites/Favorites';
import { MyFlats } from './pages/Main/MyFlats/MyFlats';
import { AllUsers } from './pages/allUsers/allUsers';
import { Header } from './components/Header/Header';

function App() {
  const location = useLocation();

  const showHeader = !['/login', '/register'].includes(location.pathname);

  return (
      <>
    {showHeader ? (
      // Layout principal con sidebar y contenido
      <div className="flex flex-col-reverse sm:flex-row w-screen h-screen">
        <Header /> {/* Asegúrate de que Header tenga w-16 y h-full */}

        <div className="flex-1 overflow-y-auto bg-gray-100">
          <Routes>
            <Route path="/profile" element={<ViewProfile />} />
            <Route path="/profile/:id" element={<ViewProfile />} />
            <Route path="/update-profile" element={<UpdateProfile />} />
            <Route path="/update-profile/:id" element={<UpdateProfile />} />
            <Route path="/new-flat" element={<NewFlat />} />
            <Route path="/view-flat" element={<ViewFlat />} />
            <Route path="/view-flat/:flatId" element={<ViewFlat />} />
            <Route path="/edit-flat" element={<EditFlat />} />
            <Route path="/edit-flat/:flatId" element={<EditFlat />} />
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/myflats" element={<MyFlats />} />
            <Route path="/allusers" element={<AllUsers />} />
          </Routes>
        </div>
      </div>
    ) : (
      // Layout sin sidebar, para login y register
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    )}
  </>
  );
}

export default App;

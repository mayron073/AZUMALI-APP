import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import LayoutAuth from './Layout/LayoutAuth';
import { SensorProvider } from './context/SensorContext';

import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Login from './components/Login';
import Register from './components/Register';
import SensorGraph from './components/SensorGraph';
import AdminPanel from './pages/AdminPanel';

import RutaProtegida from './Layout/RutaProtegida';


function App() {
  //const { user, isAdmin } = useContext(AuthContext);

  return (
    <Router>
      <AuthProvider>
        <SensorProvider>
          <Routes>
            <Route path='/' element={<LayoutAuth />}>
              <Route index element={<Login />} />
              <Route path='registro' element={<Register />} />
            </Route>

            {/* Rutas protegidas */}
            <Route path='/sensores' element={<RutaProtegida />}>
              <Route index element={<Dashboard />} />

              {/* Rutas para las gráficas de sensores */}
              <Route path='temperature' element ={ <SensorGraph sensor="temperatura_ambiente" />} />
              <Route path='internal-temperature' element = { <SensorGraph sensor="temperatura_interna" />} />
              <Route path='humidity' element = { <SensorGraph sensor="humedad_relativa" />} />
              <Route path='radiation' element = { <SensorGraph sensor="radiacion" />} />
              <Route path='wind-speed' element = { <SensorGraph sensor="velocidad_viento" />} />
              <Route path='wind-direction' element = { <SensorGraph sensor="direccion_viento" />} />

              {/* Rutas para administradores y configuracion */}
              <Route path='settings' element= {<Settings/>}/>
              <Route path='admin-panel' element= {<AdminPanel/>}/>
            </Route>
          </Routes>
        </SensorProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;


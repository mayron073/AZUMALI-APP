import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import LayoutAuth from './Layout/LayoutAuth';

import Dashboard from './pages/Dashboard';
import Login from './components/Login';
import Register from './components/Register';


function App() {
  //const { user, isAdmin } = useContext(AuthContext);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<LayoutAuth />}>
            <Route index element={<Login />} />
            <Route path="/sensor-date" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
          </Route>
          {/* Rutas protegidas */}
          {/*user && (
            <>
              <Route
                path="/settings"
                element={isAdmin ? <Settings /> : <Navigate to="/" />}
              />
              <Route
                path="/admin"
                element={isAdmin ? <AdminPanel /> : <Navigate to="/" />}
              />
            </>
          )*/}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;


import { useState, useEffect } from 'react';
import NavBar from '../components/Navbar';
import useSensor from '../hooks/useSensor';

const Settings = () => {
  const { handleExportExcel } = useSensor();

  return (
    <div>
      <NavBar />
        <div>
          <h2>Generar excel con datos almacenados</h2>
          <button onClick={handleExportExcel}>Excel log</button>
        </div>
    </div>
  );
};

export default Settings;




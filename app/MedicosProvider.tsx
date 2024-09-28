// medicos.context.tsx
import { createContext, useState } from 'react';
import type { Medico } from '../types';

interface MedicosContext {
  medicos: Medico[];
  agregarMedico: (medico: Medico) => void;
}

const MedicosContext = createContext<MedicosContext>({
  medicos: [],
  agregarMedico: () => {},
});

const MedicosProvider = ({ children }: any) => {
  const [medicos, setMedicos] = useState([]);

  const agregarMedico = (medico: Medico) => {
    setMedicos(prevMedicos => [...prevMedicos, medico]);
  };

  return (
    <MedicosContext.Provider value={{ medicos, agregarMedico }}>
      {children}
    </MedicosContext.Provider>
  );
};

export { MedicosProvider, MedicosContext };
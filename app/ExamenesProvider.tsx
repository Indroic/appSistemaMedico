// Examenes.context.tsx
import { createContext, useState } from 'react';
import type { Examen } from '../types';

interface ExamenesContext {
  examenes: Examen[];
  agregarExamen: (Examen: Examen) => void;
}

const ExamenesContext = createContext<ExamenesContext>({
  examenes: [],
  agregarExamen: () => {},
});

const ExamenesProvider = ({ children }: any) => {
  const [examenes, setExamenes] = useState([]);

  const agregarExamen = (examen: Examen) => {
    setExamenes(prevExamenes => [...prevExamenes, examen]);
  };

  return (
    <ExamenesContext.Provider value={{ examenes, agregarExamen }}>
      {children}
    </ExamenesContext.Provider>
  );
};

export { ExamenesProvider, ExamenesContext };
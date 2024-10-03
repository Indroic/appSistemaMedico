import { create } from "zustand";
import type { Medico, Especialidad } from "./types";

interface useMedicosStoreType{
    medicos: Medico[];
    especialidades: Especialidad[];
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setEspecialidades: (especialidades: Especialidad[]) => void;
    addMedico: (medico: Medico) => void;
    removeMedico: (id: string) => void;
    updateMedico: (medico: Medico) => void;
    setMedicos: (medicos: Medico[]) => void;
}

interface useExamenesStoreType{
    examenes: any[];
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setExamenes: (examenes: any[]) => void;
    addExamen: (examen: any) => void;
    removeExamen: (id: string) => void;
    updateExamen: (examen: any) => void;
}

export const useMedicosStore = create<useMedicosStoreType>((set) => ({
    medicos: [],
    especialidades: [],
    loading: true,
    setLoading: (loading) => set({ loading }),
    setEspecialidades: (especialidades) => set({ especialidades }),
    addMedico: (medico) => set((state) => ({ medicos: [...state.medicos, medico] })),
    removeMedico: (id) => set((state) => ({ medicos: state.medicos.filter((medico) => medico.id !== id) })),
    updateMedico: (medico) => set((state) => ({ medicos: state.medicos.map((m) => (m.id === medico.id ? medico : m)) })),
    setMedicos: (medicos) => set({ medicos }),
}))

export const useExamenesStore = create<useExamenesStoreType>((set) => ({
    examenes: [],
    loading: true,
    setLoading: (loading) => set({ loading }),
    setExamenes: (examenes) => set({ examenes }),
    addExamen: (examen) => set((state) => ({ examenes: [...state.examenes, examen] })),
    removeExamen: (id) => set((state) => ({ examenes: state.examenes.filter((examen) => examen.id !== id) })),
    updateExamen: (examen) => set((state) => ({ examenes: state.examenes.map((e) => (e.id === examen.id ? examen : e)) })),
}))
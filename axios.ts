import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://backend-medics.vercel.app/",
});

const getEspecialidades = async () => {
    const { data } = await axiosInstance.get("api/especialidades/");
    
    return data;
};

const getMedicos = async (token: string) => {
    const { data } = await axiosInstance.get("api/medicos/", {
        headers: {
            Authorization: `Token ${token}`,
        },
    });
    
    return data;
}

const getExamenes = async (token) => {
    const { data } = await axiosInstance.get("api/examenes/", {
        headers: {
            Authorization: `Token ${token}`,
        },
    });
    
    return data;
}

const addMedico = async (data: any, token: string) => {
    const { data: response } = await axios.create({
        baseURL: "https://backend-medics.vercel.app/",
        headers: {
            Authorization: `Token ${token}`,
        },
    }).post("api/medicos/", data);
    
    return response;
}

const addExamen = async (data: any, token) => {
    const { data: response } = await axios.create({
        baseURL: "https://backend-medics.vercel.app/",
        headers: {
            Authorization: `Token ${token}`,
        },
    }).post("api/examenes/", data);
    
    return response;
}


const registerRequest = async (data: any) => {
    const { data: response } = await axios.create({
        baseURL: "https://backend-medics.vercel.app/",
    }).post("auth/register/", data);
    
    return response;
};

const loginRequest = async (username: string, password: string) => {
    const request = await axios.create({
        baseURL: "https://backend-medics.vercel.app/",
    }).post("auth/login/", {
        username: username,
        password: password
    },{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    } 
);
    
    return await request;
};

export { getEspecialidades, registerRequest, loginRequest, getMedicos, getExamenes, addMedico, addExamen, axiosInstance };
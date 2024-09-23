import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://backend-medics.vercel.app/",
});

const getEspecialidades = async () => {
    const { data } = await axiosInstance.get("api/especialidades");
    
    return data;
};

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

export { getEspecialidades, registerRequest, loginRequest, axiosInstance };
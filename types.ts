
interface User{
    id?: string;
    password: string;
    username: string;
    ci: number;
    first_name: string;
    last_name: string;
    email: string;
    create_at?: string;
    update_at?: string;
    avatar?: string | any;
    groups?: Array<string>;
    user_permissions?: Array<string>;
}

interface Medico{
    id: string;
    nombre: string;
    apellido: string;
    especialidad: string;
    telefono: string;
    email: string;
    institucion: string;
    agregado_por: string;
}

interface Especialidad{
    id: string;
    especialidad: string;
    create_at: string;
    update_at: string;
}


interface Categoria{
    id: string;
    categoria: string;
    create_at: string;
    update_at: string;
}


interface AuthStateProps{
    token: string | null;
    user: User | null;
    isAuthenticated: boolean | null;
}

interface AuthProps{
    authState?: AuthStateProps;
    onRegister?: (data: User) => Promise<any>;
    onLogin?: (username: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
    
}



interface LoginProps{
    token: string | null;
    user: User | null;
    error: boolean | null;
    message: string | null;
}

export { Medico, Especialidad, AuthProps, User, LoginProps, AuthStateProps, Categoria };
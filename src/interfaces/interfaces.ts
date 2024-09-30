// Interfaz base para usuarios
interface UsuarioBase {
    nombre: string;
    correo: string;
    contrasena: string;
    telefono: string; // Teléfono como string para mayor flexibilidad
    conectado: boolean;
}

// Interfaz para un usuario regular
export interface Usuario extends UsuarioBase {
    idUsuario: number;
}

// Interfaz para un administrador de local
export interface AdminLocal extends UsuarioBase {
    idAdmin: number;
    direccionLocal: string;
}

// Interfaz para un producto
export interface Producto {
    idProducto: number;
    nombreProducto: string;
    precio: number;
    stock: number;
}

// Interfaz para un objeto en el carrito
export interface ObjetoCarrito {
    idProducto: number;
    nombreProducto: string;
    cantidad: number;
    stock: number;
}

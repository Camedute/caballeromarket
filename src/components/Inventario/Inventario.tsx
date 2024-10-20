import React, { useState, useEffect } from 'react';
import Header from '../Header/header';
import Footer from '../Footer/footer';
import './Inventario.css';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firestore'; // Importar Firestore y auth desde tu configuración
import { onAuthStateChanged } from 'firebase/auth'; // Para obtener el uid del usuario autenticado

interface Producto {
  id: string;
  nombreProducto: string;
  precioProducto: number;
  idDueno: string; // Este será el uid del usuario
}

const Inventario: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [productoActual, setProductoActual] = useState<Producto | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [modoAgregar, setModoAgregar] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    // Escuchar el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid); // Asignar el uid cuando el usuario esté autenticado
      } else {
        setUid(null); // No hay usuario autenticado
      }
    });

    return () => unsubscribe(); // Limpiar el listener al desmontar el componente
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      if (uid) {
        const usuarioRef = doc(db, 'Inventario', uid);
        const docSnapshot = await getDoc(usuarioRef);
        if (docSnapshot.exists()) {
          const productosData = docSnapshot.data().productos || [];
          setProductos(productosData);
        }
      }
      setLoading(false);
    };

    fetchProductos();
  }, [uid]);

  // Función para agregar un producto nuevo
  const agregarProducto = async () => {
    if (productoActual && uid) {
      try {
        const usuarioRef = doc(db, 'Inventario', uid);
        const nuevoProducto = {
          id: productoActual.id || Date.now().toString(), // Generar un id temporal si no existe.
          nombreProducto: productoActual.nombreProducto,
          precioProducto: productoActual.precioProducto,
          idDueno: uid, // Asignar el uid del usuario como dueño.
        };

        // Obtener los productos actuales del documento
        const docSnapshot = await getDoc(usuarioRef);
        const productosExistentes = docSnapshot.exists() ? docSnapshot.data()?.productos || [] : [];

        // Actualizar el array de productos
        await setDoc(usuarioRef, {
          productos: [...productosExistentes, nuevoProducto],
        }, { merge: true });

        // Actualizar el estado local
        setProductos([...productos, nuevoProducto]);
        cerrarModal();
      } catch (error) {
        console.error('Error al agregar producto:', error);
      }
    }
  };

  // Función para editar un producto existente
  const editarProducto = async () => {
    if (productoActual && uid) {
      try {
        const usuarioRef = doc(db, 'Inventario', uid);
        const docSnapshot = await getDoc(usuarioRef);
        const productosActuales = docSnapshot.data()?.productos || [];

        const index = productosActuales.findIndex((p: Producto) => p.id === productoActual.id);

        if (index !== -1) {
          productosActuales[index] = {
            ...productosActuales[index],
            nombreProducto: productoActual.nombreProducto,
            precioProducto: productoActual.precioProducto,
          };

          await updateDoc(usuarioRef, { productos: productosActuales });

          setProductos(productos.map((producto) => (producto.id === productoActual.id ? productoActual : producto)));
          cerrarModal();
        }
      } catch (error) {
        console.error('Error al actualizar producto:', error);
      }
    }
  };

  // Función para eliminar un producto
  const eliminarProducto = async (id: string) => {
    try {
      if (uid) {
        const usuarioRef = doc(db, 'Inventario', uid);
        const docSnapshot = await getDoc(usuarioRef);
        const productosActuales = docSnapshot.data()?.productos || [];

        const nuevosProductos = productosActuales.filter((producto: Producto) => producto.id !== id);

        await updateDoc(usuarioRef, { productos: nuevosProductos });
        setProductos(productos.filter((producto) => producto.id !== id));
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  // Funciones para manejar el modal
  const abrirModalEdicion = (producto: Producto) => {
    setProductoActual(producto);
    setModoEdicion(true);
  };

  const abrirModalAgregar = () => {
    setProductoActual({
      id: '',
      nombreProducto: '',
      precioProducto: 0,
      idDueno: '', // Se asignará automáticamente el uid del usuario
    });
    setModoAgregar(true);
  };

  const cerrarModal = () => {
    setModoEdicion(false);
    setModoAgregar(false);
    setProductoActual(null);
  };

  const actualizarProducto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (productoActual) {
      setProductoActual({
        ...productoActual,
        [e.target.name]: e.target.value,
      });
    }
  };

  const guardarCambios = () => {
    if (modoAgregar) {
      agregarProducto();
    } else if (modoEdicion) {
      editarProducto();
    }
  };

  return (
    <>
      <Header />
      <div className="inventario-container">
        <h2 className="title">Productos</h2>
        <div className="productos">
          {loading ? (
            <p>Cargando productos...</p>
          ) : (
            productos.map((producto) => (
              <div className="producto-card" key={producto.id}>
                <p>{producto.nombreProducto}</p>
                <p>Precio: {producto.precioProducto}</p>
                <button
                  className="btn editar"
                  title="Modificar Producto"
                  onClick={() => abrirModalEdicion(producto)}
                >
                  ✏️ Editar
                </button>
                <button
                  className="btn eliminar"
                  title="Eliminar Producto"
                  onClick={() => eliminarProducto(producto.id)}
                >
                  🗑️ Borrar
                </button>
              </div>
            ))
          )}
          <button
            className="btn agregar"
            title="Agregar Producto"
            onClick={abrirModalAgregar}
          >
            Agregar un producto
          </button>
        </div>

        {(modoEdicion || modoAgregar) && productoActual && (
          <div className="modal">
            <div className="modal-content">
              <h3>{modoAgregar ? 'Agregar Producto' : 'Editar Producto'}</h3>
              <input
                type="text"
                name="nombreProducto"
                placeholder="Nombre del producto"
                value={productoActual.nombreProducto}
                onChange={actualizarProducto}
              />
              <input
                type="number"
                name="precioProducto"
                placeholder="Precio del producto"
                value={productoActual.precioProducto}
                onChange={actualizarProducto}
              />
              <button onClick={guardarCambios}>
                {modoAgregar ? 'Agregar' : 'Guardar cambios'}
              </button>
              <button onClick={cerrarModal}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Inventario;

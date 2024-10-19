import React, { useState, useEffect } from 'react';
import Header from '../Header/header';
import Footer from '../Footer/footer';
import './Inventario.css';
import db from '../../firebase/firestore';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

interface Producto {
  id: string;
  nombreProducto: string;
  precioProducto: number;
  idDueno: string;
}

const Inventario: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [productoActual, setProductoActual] = useState<Producto | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [modoAgregar, setModoAgregar] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      const productosCollection = collection(db, 'Inventario');
      const productosSnapshot = await getDocs(productosCollection);
      const productosList: Producto[] = productosSnapshot.docs.map((doc) => ({
        id: doc.id,
        nombreProducto: doc.data().nombreProducto,
        precioProducto: doc.data().precioProducto,
        idDueno: doc.data().idDueno,
      }));

      setProductos(productosList);
      setLoading(false);
    };

    fetchProductos();
  }, []);

  // Función para agregar un producto nuevo
  const agregarProducto = async () => {
    if (productoActual) {
      try {
        const nuevoProducto = {
          nombreProducto: productoActual.nombreProducto,
          precioProducto: productoActual.precioProducto,
          idDueno: productoActual.idDueno,
        };

        const docRef = await addDoc(collection(db, 'Inventario'), nuevoProducto);
        setProductos([...productos, { ...nuevoProducto, id: docRef.id }]);
        cerrarModal();
      } catch (error) {
        console.error('Error al agregar producto:', error);
      }
    }
  };

  // Función para actualizar un producto existente
  const editarProducto = async () => {
    if (productoActual) {
      try {
        const productoRef = doc(db, 'Inventario', productoActual.id);
        await updateDoc(productoRef, {
          nombreProducto: productoActual.nombreProducto,
          precioProducto: productoActual.precioProducto,
          idDueno: productoActual.idDueno,
        });

        setProductos(
          productos.map((producto) =>
            producto.id === productoActual.id ? productoActual : producto
          )
        );
        cerrarModal();
      } catch (error) {
        console.error('Error al actualizar producto:', error);
      }
    }
  };

  // Función para eliminar un producto
  const eliminarProducto = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'Inventario', id));
      setProductos(productos.filter((producto) => producto.id !== id));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  const abrirModalEdicion = (producto: Producto) => {
    setProductoActual(producto);
    setModoEdicion(true);
  };

  const abrirModalAgregar = () => {
    setProductoActual({
      id: '',
      nombreProducto: '',
      precioProducto: 0,
      idDueno: '', // Aquí deberías incluir el dueño correspondiente
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

        {/* Modal para agregar o editar */}
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

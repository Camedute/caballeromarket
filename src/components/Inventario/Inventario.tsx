import React, { useState, useEffect } from 'react';
import Header from '../Header/header';
import Footer from '../Footer/footer';
import './Inventario.css';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firebase/firestore'; // Importar Firestore, auth y storage desde tu configuración
import { onAuthStateChanged } from 'firebase/auth'; // Para obtener el uid del usuario autenticado
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Importar Firebase Storage

interface Producto {
  id: string;
  nombreProducto: string;
  precioProducto: number;
  idDueno: string; // Este será el uid del usuario
  imagen?: string; // Añadir campo para la imagen
}

const Inventario: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [productoActual, setProductoActual] = useState<Producto | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [modoAgregar, setModoAgregar] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [imagenProducto, setImagenProducto] = useState<File | null>(null);
  const [imagenURL, setImagenURL] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
      }
    });

    return () => unsubscribe();
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

  const uploadImage = async (file: File) => {
    const storageRef = ref(storage, `productos/${uid}/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url; // Retornar el URL de la imagen
  };

  const agregarProducto = async () => {
    if (productoActual && uid) {
      try {
        // Subir la imagen si se seleccionó
        let urlImagen: string | undefined;
        if (imagenProducto) {
          urlImagen = await uploadImage(imagenProducto);
        }

        const usuarioRef = doc(db, 'Inventario', uid);
        const nuevoProducto = {
          id: productoActual.id || Date.now().toString(),
          nombreProducto: productoActual.nombreProducto,
          precioProducto: productoActual.precioProducto,
          idDueno: uid,
          imagen: urlImagen, // Añadir URL de la imagen
        };

        const docSnapshot = await getDoc(usuarioRef);
        const productosExistentes = docSnapshot.exists() ? docSnapshot.data()?.productos || [] : [];

        await setDoc(usuarioRef, {
          productos: [...productosExistentes, nuevoProducto],
        }, { merge: true });

        setProductos([...productos, nuevoProducto]);
        cerrarModal();
      } catch (error) {
        console.error('Error al agregar producto:', error);
      }
    }
  };

  const editarProducto = async () => {
    if (productoActual && uid) {
      try {
        const usuarioRef = doc(db, 'Inventario', uid);
        const docSnapshot = await getDoc(usuarioRef);
        const productosActuales = docSnapshot.data()?.productos || [];

        const index = productosActuales.findIndex((p: Producto) => p.id === productoActual.id);

        if (index !== -1) {
          // Subir la nueva imagen si se seleccionó
          let urlImagen: string | undefined;
          if (imagenProducto) {
            urlImagen = await uploadImage(imagenProducto);
          }

          productosActuales[index] = {
            ...productosActuales[index],
            nombreProducto: productoActual.nombreProducto,
            precioProducto: productoActual.precioProducto,
            imagen: urlImagen || productosActuales[index].imagen, // Mantener la imagen anterior si no se subió una nueva
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

  const abrirModalEdicion = (producto: Producto) => {
    setProductoActual(producto);
    setModoEdicion(true);
  };

  const abrirModalAgregar = () => {
    setProductoActual({
      id: '',
      nombreProducto: '',
      precioProducto: 0,
      idDueno: '',
    });
    setModoAgregar(true);
  };

  const cerrarModal = () => {
    setModoEdicion(false);
    setModoAgregar(false);
    setProductoActual(null);
    setImagenProducto(null); // Limpiar la imagen al cerrar el modal
    setImagenURL(null); // Limpiar la URL de la imagen
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagenProducto(e.target.files[0]);
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
                {producto.imagen && <img src={producto.imagen} alt={producto.nombreProducto} width="100" />}
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
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <button onClick={guardarCambios}>
                {modoAgregar ? 'Agregar' : 'Guardar Cambios'}
              </button>
              <button onClick={cerrarModal}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Inventario;

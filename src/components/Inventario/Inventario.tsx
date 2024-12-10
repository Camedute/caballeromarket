import React, { useState, useEffect } from 'react'; 
import Header from '../Header/header'; 
import Footer from '../Footer/footer'; 
import './Inventario.css'; 
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { auth, db, storage } from '../firebase/firestore'; 
import { onAuthStateChanged } from 'firebase/auth'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 

interface Producto { 
    id: string; 
    nombreProducto: string; 
    precioProducto: number; 
    cantidadProducto: number; 
    Categoria: string; 
    fechaElaboracion: Date; 
    fechaCaducidad: Date; 
    idDueno: string; 
    imagen?: string; 
    costo: number; 
} 

const Inventario: React.FC = () => { 
    const [productos, setProductos] = useState<Producto[]>([]); 
    const [loading, setLoading] = useState(true); 
    const [productoActual, setProductoActual] = useState<Producto | null>(null); 
    const [modoEdicion, setModoEdicion] = useState(false); 
    const [modoAgregar, setModoAgregar] = useState(false); 
    const [uid, setUid] = useState<string | null>(null); 
    const [imagenProducto, setImagenProducto] = useState<File | null>(null); 
    const [costoTotal, setCostoTotal] = useState<number>(0); 

    useEffect(() => { 
        const unsubscribe = onAuthStateChanged(auth, (user) => { 
            if (user) setUid(user.uid); else setUid(null); 
        }); 

        return () => unsubscribe(); 
    }, []); 

    useEffect(() => { 
        const fetchProductos = async () => { 
            if (uid) { 
                const usuarioRef = doc(db, 'Inventario', uid); 
                const ventasRef = doc(db, 'Ventas', uid); 
                const docSnapshot = await getDoc(usuarioRef); 
                const ventasSnapshot = await getDoc(ventasRef); 

                if (docSnapshot.exists()) { 
                    const productosData = docSnapshot.data().productos || []; 

                    // Convierte las fechas de timestamp a objetos Date
                    const productosConFechas = productosData.map((producto: { fechaElaboracion: { toDate: () => any; }; fechaCaducidad: { toDate: () => any; }; }) => ({
                        ...producto,
                        fechaElaboracion: producto.fechaElaboracion.toDate(), // Asegúrate de que sea un objeto Date
                        fechaCaducidad: producto.fechaCaducidad.toDate(),
                    }));

                    setProductos(productosConFechas);
                } 

                if (ventasSnapshot.exists()) { 
                    setCostoTotal(ventasSnapshot.data().costoTotal || 0); 
                } 
            } 

            setLoading(false); 
        }; 

        fetchProductos(); 
    }, [uid]); 

    const uploadImage = async (file: File) => { 
        const storageRef = ref(storage, `productos/${uid}/${file.name}`); 
        await uploadBytes(storageRef, file); 
        return getDownloadURL(storageRef); 
    }; 

    const agregarProducto = async () => { 
        if (productoActual && uid) { 
            if ( !productoActual.nombreProducto || !productoActual.precioProducto || productoActual.cantidadProducto === undefined || !imagenProducto || !productoActual.fechaElaboracion || !productoActual.fechaCaducidad || productoActual.costo === undefined ) { 
                window.alert('Por favor, completa todos los campos.'); return; 
            } 

            try { // Subir la imagen del producto
                const urlImagen = await uploadImage(imagenProducto); 

                // Referencias a Firestore
                const usuarioRef = doc(db, 'Inventario', uid); 
                const ventasRef = doc(db, 'Ventas', uid); 
                const gastosEstaticosRef = doc(db, 'GastosEstaticos', uid);

                // Crear el nuevo producto
                const nuevoProducto = {
                    id: productoActual.id || Date.now().toString(),
                    nombreProducto: productoActual.nombreProducto,
                    precioProducto: productoActual.precioProducto,
                    cantidadProducto: productoActual.cantidadProducto,
                    Categoria: productoActual.Categoria,
                    fechaElaboracion: productoActual.fechaElaboracion,
                    fechaCaducidad: productoActual.fechaCaducidad,
                    idDueno: uid,
                    imagen: urlImagen,
                    costo: productoActual.costo,
                };

                // Obtener los productos existentes en la colección Inventario
                const docSnapshot = await getDoc(usuarioRef);
                const productosExistentes = docSnapshot.exists() ? docSnapshot.data()?.productos || [] : [];

                // Guardar el nuevo producto en la colección Inventario
                await setDoc(usuarioRef, { productos: [...productosExistentes, nuevoProducto] }, { merge: true });

                // Actualizar el costo total en la colección Ventas
                const ventasSnapshot = await getDoc(ventasRef);
                const costoActual = ventasSnapshot.exists() ? ventasSnapshot.data()?.costoTotal || 0 : 0;
                const nuevoCostoTotal = costoActual + productoActual.costo;
                await setDoc(ventasRef, { costoTotal: nuevoCostoTotal }, { merge: true });

                // Crear el objeto con los datos de gastos
                const nuevoGasto = {
                    id: productoActual.id || Date.now().toString(),
                    nombreProducto: nuevoProducto.nombreProducto,
                    cantidad: nuevoProducto.cantidadProducto,
                    costoUnitario: nuevoProducto.costo,
                    costoTotal: nuevoProducto.costo * nuevoProducto.cantidadProducto,
                };

                // Guardar los datos en la colección GastosEstaticos
                const gastosEstaticosSnapshot = await getDoc(gastosEstaticosRef);
                const gastosEstaticosExistentes = gastosEstaticosSnapshot.exists() ? gastosEstaticosSnapshot.data()?.gastos || [] : [];
                
                await setDoc(gastosEstaticosRef, { gastos: [...gastosEstaticosExistentes, nuevoGasto] }, { merge: true });

                // Actualizar el estado y UI
                setCostoTotal(nuevoCostoTotal);
                setProductos([...productos, nuevoProducto]);

                cerrarModal(); // Cerrar el modal
            } catch (error) {
                console.error('Error al agregar producto:', error);
            }
        }
    }; 

    const editarProducto = async () => { 
        if (productoActual && uid) { 
            try {
                // Si hay una nueva imagen, sube la nueva imagen y actualiza la propiedad imagen
                if (imagenProducto) {
                    const urlImagen = await uploadImage(imagenProducto);
                    productoActual.imagen = urlImagen; // Actualiza la imagen del producto
                }

                const usuarioRef = doc(db, 'Inventario', uid);

                // Actualiza el producto en la lista de productos
                const productosActualizados = productos.map((producto) => producto.id === productoActual.id ? productoActual : producto );

                // Actualiza los productos en Firestore
                await setDoc(usuarioRef, { productos: productosActualizados }, { merge: true });

                // Actualiza el estado de productos localmente
                setProductos(productosActualizados);
                
                cerrarModal(); // Cierra el modal después de la edición
            } catch (error) {
                console.error('Error al editar producto:', error);
            }
        } else {
            console.error('Producto actual no definido');
        }
    }; 

    const eliminarProducto = async (id: string) => {  
        if (uid) {
            try {
                const usuarioRef = doc(db, 'Inventario', uid);

                // Filtra el producto eliminado
                const productosActualizados = productos.filter((producto) => producto.id !== id);

                // Actualiza Firestore con los productos restantes...
                await setDoc(usuarioRef, { productos: productosActualizados }, { merge: true });

                // Actualiza el estado local
                setProductos(productosActualizados);
            } catch (error) {
               console.error('Error al eliminar producto:', error);
            }
        }
    }; 

    const actualizarProducto = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (productoActual) {
            const { name, value } = e.target;

            setProductoActual({ ...productoActual,
              [name]: name.includes('fecha') ? new Date(value) : value === '' ? '' : Number(value) || value,
            });
        }
    }; 

    const abrirModalAgregar = () => {
        setProductoActual({
            id: '',
            nombreProducto: '',
            precioProducto: 0,
            cantidadProducto: 0,
            Categoria: '',
            fechaElaboracion: new Date(), // Asegúrate de usar un objeto Date aquí.
            fechaCaducidad: new Date(), // Asegúrate de usar un objeto Date aquí.
            idDueno: '',
            costo: 0,
        });
        
        setModoAgregar(true);
    }; 

    const abrirModalEditar = (producto: Producto) => {
        setProductoActual(producto);
        setModoEdicion(true);
    }; 

    const cerrarModal = () => {
        setModoEdicion(false);
        setModoAgregar(false);
        setProductoActual(null);
        setImagenProducto(null);
    }; 

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setImagenProducto(e.target.files[0]);
      }
   };

   return (
       <>
           <Header />
           <div className="dashboard-container">
               <h2>Inventario de Productos</h2>
               {loading ? (
                   <p>Cargando productos...</p>
               ) : (
                   <div className="productos-list">
                       {productos.map((producto) => (
                           <div key={producto.id} className="producto-box">
                               <img src={producto.imagen || ''} alt={producto.nombreProducto} className="producto-imagen"/>
                               <div className="producto-info">
                                   <p className="producto-nombre">{producto.nombreProducto}</p>
                                   <p className="producto-precio">Precio: ${producto.precioProducto}</p>
                                   <p className="producto-cantidad">Cantidad: {producto.cantidadProducto}</p>
                                   <p className="producto-categoria">Categoría: {producto.Categoria}</p>
                                   <p className="producto-costo">Costo: ${producto.costo}</p>
                               </div>
                               <button className="action-button" onClick={() => abrirModalEditar(producto)}>Editar</button>
                               <button className="action-button eliminar" onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
                           </div>
                       ))}
                   </div>
               )}
               <button className="action-button" onClick={abrirModalAgregar}>Agregar Producto</button>
               {(modoAgregar || modoEdicion) && productoActual && (
                   <div className="modal">
                       <div className="modal-content">
                           <h3>{modoAgregar ? 'Agregar Producto' : 'Editar Producto'}</h3>
                           <div className="form-container">
                               <div className="form-column">
                                   <input type="text" name="nombreProducto" placeholder="Nombre del Producto" value={productoActual.nombreProducto} onChange={actualizarProducto} />
                                   <input type="number" name="precioProducto" placeholder="Precio del Producto" value={productoActual.precioProducto || ''} onChange={actualizarProducto} />
                                   <input type="number" name="cantidadProducto" placeholder="Cantidad en Inventario" value={productoActual.cantidadProducto || ''} onChange={actualizarProducto} />
                                   <input type="text" name="Categoria" placeholder="Categoría" value={productoActual.Categoria} onChange={actualizarProducto} />
                               </div>
                               <div className="form-column">
                               <input type="date" name="fechaElaboracion" placeholder="Fecha de Elaboración" value={productoActual.fechaElaboracion.toISOString().split('T')[0]} onChange={actualizarProducto} />
                               <input type="date" name="fechaCaducidad" placeholder="Fecha de Caducidad" value={productoActual.fechaCaducidad.toISOString().split('T')[0]} onChange={actualizarProducto} />                                   <input type="file" name="imagenProducto" onChange={handleImageChange} />
                                   <input type="number" name="costo" placeholder="Costo del Producto" value={productoActual.costo || ''} onChange={actualizarProducto} />
                               </div>
                           </div>
                           <div className="modal-actions">
                               <button className="action-button" onClick={modoAgregar ? agregarProducto : editarProducto}>
                                   {modoAgregar ? 'Agregar' : 'Guardar Cambios'}
                               </button>
                               <button className="action-button cancelar" onClick={cerrarModal}>Cancelar</button>
                           </div>
                       </div>
                   </div>
               )}
           </div>  
           <Footer />  
       </>
   );  
};  

export default Inventario;
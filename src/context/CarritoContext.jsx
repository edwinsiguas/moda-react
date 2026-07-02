import { createContext, useContext, useReducer } from 'react';


const initialState = {
  carrito: [],
};


function carritoReducer(state, action) {
  switch (action.type) {
    case 'AGREGAR':
      return { ...state, carrito: [...state.carrito, action.payload] };

    case 'ELIMINAR': {
      const nuevo = [...state.carrito];
      nuevo.splice(action.payload, 1);
      return { ...state, carrito: nuevo };
    }

    case 'LIMPIAR':
      return { ...state, carrito: [] };

    default:
      return state;
  }
}


const CarritoContext = createContext(null);


export function CarritoProvider({ children }) {
  const [state, dispatch] = useReducer(carritoReducer, initialState);

  const agregarProducto = (producto) =>
    dispatch({ type: 'AGREGAR', payload: producto });

  const eliminarProducto = (index) =>
    dispatch({ type: 'ELIMINAR', payload: index });

  const limpiarCarrito = () =>
    dispatch({ type: 'LIMPIAR' });

  const total = state.carrito.reduce((acc, p) => acc + p.price, 0);

  return (
    <CarritoContext.Provider
      value={{
        carrito: state.carrito,
        agregarProducto,
        eliminarProducto,
        limpiarCarrito,
        total,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}


export function useCarrito() {
  const context = useContext(CarritoContext);
  if (!context) throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  return context;
}

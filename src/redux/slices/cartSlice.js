import { createSlice } from '@reduxjs/toolkit';

// Retrieve initial state from localStorage if available
const getInitialCart = () => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: getInitialCart(),
    reducers: {
        addItem: (state, action) => {
            const product = action.payload;
            const exist = state.find((x) => x.id === product.id);
            if (exist) {
                // Increase the quantity
                const updatedCart = state.map((x) =>
                    x.id === product.id ? { ...x, qty: x.qty + 1 } : x
                );
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                return updatedCart;
            } else {
                const updatedCart = [...state, { ...product, qty: 1 }];
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                return updatedCart;
            }
        },
        deleteItem: (state, action) => {
            const product = action.payload;
            const exist = state.find((x) => x.id === product.id);
            let updatedCart;
            if (exist.qty === 1) {
                updatedCart = state.filter((x) => x.id !== exist.id);
            } else {
                updatedCart = state.map((x) =>
                    x.id === product.id ? { ...x, qty: x.qty - 1 } : x
                );
            }
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return updatedCart;
        },
        removeItem: (state, action) => {
            const product = action.payload;
            const updatedCart = state.filter((x) => x.id !== product.id);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return updatedCart;
        }
    }
});

export const { addItem, deleteItem, removeItem } = cartSlice.actions;
export default cartSlice.reducer;

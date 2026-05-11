import { createSlice } from '@reduxjs/toolkit';

// Retrieve initial state from localStorage if available
const getInitialWishlist = () => {
    const storedWishlist = localStorage.getItem("wishlist");
    return storedWishlist ? JSON.parse(storedWishlist) : [];
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: getInitialWishlist(),
    reducers: {
        addWishlist: (state, action) => {
            const product = action.payload;
            const exist = state.find((x) => x.id === product.id);
            if (!exist) {
                const updatedWishlist = [...state, product];
                localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
                return updatedWishlist;
            }
            return state;
        },
        deleteWishlist: (state, action) => {
            const product = action.payload;
            const updatedWishlist = state.filter((x) => x.id !== product.id);
            localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
            return updatedWishlist;
        }
    }
});

export const { addWishlist, deleteWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

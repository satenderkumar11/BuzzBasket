import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authLogout } from './userSlice';
import { HOST_URL } from '../store/constant';

export const handleItemQtyInCart = createAsyncThunk(
  "cart/handleItemQtyInCart",
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${HOST_URL}/cart`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(itemData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return data.updatedCart;
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
  }
);

export const removeItemFromCart = createAsyncThunk("cart/removeItem", async(id,{ rejectWithValue })=>{
  try{
    const response = await fetch(`${HOST_URL}/cart`,{
      method: 'DELETE',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({productId: id}),
        credentials: 'include',
    });

    

    const data = await response.json();
    console.log("removeItemFromCArt", data);
    return data.updatedCart;
  }catch(err){
    return rejectWithValue({ message: err.message });
  }
})

export const fetchCartByUserThunk = createAsyncThunk("cart/fetchCartByUser", async (itemData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${HOST_URL}/cart`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      if (response.status === 204) {
        return null;
      }

      const data = await response.json();
      console.log("data cart", data);
      return data.cart;
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
});

export const deleteCartThunk = createAsyncThunk("cart/deleteCartThunk", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${HOST_URL}/cart/delete`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData);
    }

    if (response.status === 204) {
      return null;
    }

    const data = await response.json();
    console.log("data cart", data);
    return data.cart;
  } catch (err) {
    return rejectWithValue({ message: err.message });
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(handleItemQtyInCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(handleItemQtyInCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log("handleItemQtyInCart.fulfilled action.payload", action.payload)
        state.cartItems = action.payload;
        
      })
      .addCase(handleItemQtyInCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to add item to cart';
      })
      .addCase(fetchCartByUserThunk.fulfilled, (state, action) => {
        state.status = 'suceeded';
        state.cartItems = action.payload;
      })
      .addCase(authLogout.fulfilled, (state) => {
        
        state.cartItems = [];
        
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) =>{
        state.cartItems = action.payload;
        state.status = 'succeeded';
      })
      .addCase(removeItemFromCart.rejected, (state, action) =>{
        state.error = action.payload;
        state.status = 'failed';
      }).addCase(deleteCartThunk.fulfilled , (state)=>{
        state.cartItems = [],
        state.status = 'succeeded';
      }).addCase(deleteCartThunk.rejected , (state, action)=>{
        state.error = action.payload;
        state.status = 'failed';
      })
      
  }
});

export default cartSlice.reducer;

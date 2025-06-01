import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ITEMS_PER_PAGE } from "../store/constant";
import { HOST_URL } from "../store/constant";
const fetchWithBody = async (url, method, body = null) => {
  const options = {
    method,
    headers: { "content-type": "application/json" },
    credentials: "include", // Include credentials for requests needing authentication
  };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);
  console.log("response", response);
  // Check if the response is okay (2xx)
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch");
  }

  return response.json();
};

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async ({ page, category, brand, _sort, _order }) => {
    try {
      // Construct the category filter
      const categoryFilter = category ? `category=${category}&` : "";

      // Construct the brand filter (multiple brands separated by commas)
      const brandFilter = brand ? `brand=${brand}&` : "";
      console.log(brand);

      const sortFilter = _sort ? `_sort=${_sort}&` : "";
      const orderFilter = _order ? `_order=${_order}&` : "";

      // Fetch data from the API, combining all filters
      const response = await fetch(
        `${HOST_URL}/products?${categoryFilter}${brandFilter}${sortFilter}${orderFilter}_page=${page}&_limit=${ITEMS_PER_PAGE}`
      );

      // Extract total items count and product data
      const items = await response.headers.get("X-Total-Count");
      const productData = await response.json();
      console.log(productData);

      // Return both products and available brands
      return {
        products: productData.data,
        brands: productData.brands,
        items: items,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      console.log("p id", id)
      const data = await fetchWithBody(
        `${HOST_URL}/products/${id}`,
        "GET"
      );

      return data.product;
    } catch (err) {
      console.log("errrrrr", err)
      return rejectWithValue(err.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    product: null,
    brands: [],
    totalItems: 0,
    loading: false,
    productError: null,
    productListError: null
  },
  reducers: {
    productNullOnDetailPage: (state) => {
      state.product = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalItems = action.payload.items;
        state.brands = action.payload.brands;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.product = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.productError = action.payload;
        state.loading = false;
      });
  },
});

export const { productNullOnDetailPage } = productSlice.actions;


export default productSlice.reducer;

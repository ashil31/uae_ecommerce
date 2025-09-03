
  import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
  import productsAPI from '../../api/productsAPI';

  // Async thunks
  export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (params = {}, { rejectWithValue }) => {
      try {
        // params should include: page, limit, search, sort, category, subcategory, priceRange, colors, sizes, brands, fabrics
        const response = await productsAPI.getProducts(params);
        console.log(response.data);        
        // Expecting { success, products, total, ... }
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Failed to fetch products' });
      }
    }
  );

  export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (productId, { rejectWithValue }) => {
      try {
        const response = await productsAPI.getProductById(productId);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

  export const fetchCategories = createAsyncThunk(
    'products/fetchCategories',
    async (_, { rejectWithValue }) => {
      try {
        const response = await productsAPI.getCategories();
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );


  {/*Added subcategory */}
  const initialState = {
    products: [],
    featuredProducts: [],
    newArrivals: [],
    total: 0,
    currentProduct: null,
    categories: [],
    filters: {
      category: '',
      subcategory: '',
      priceRange: [0, 10000],
      colors: [],
      sizes: [],
      brands: [],
      fabrics: [],
      sortBy: 'newest',
    },
    pagination: {
      current: 1,
      pageSize: 12,
    },
    isLoading: false,
    error: null,
  };

  const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
      setFilters: (state, action) => {
        state.filters = { ...state.filters, ...action.payload };
      },
      clearFilters: (state) => {
        state.filters = {
          category: '',
          subcategory: '',
          priceRange: [0, 10000],
          colors: [],
          sizes: [],
          brands: [],
          fabrics: [],
          sortBy: 'newest',
        };
      },
      setCurrentPage: (state, action) => {
        state.pagination.current = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        // Fetch products
        .addCase(fetchProducts.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(fetchProducts.fulfilled, (state, action) => {
          state.isLoading = false;
          state.products = action.payload.products || [];
          state.featuredProducts = action.payload.featuredProducts;
          state.newArrivals = action.payload.newArrivals;
          state.total = action.payload.total || 0;
        })
        .addCase(fetchProducts.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload.message;
        })
        // Fetch product by ID
        .addCase(fetchProductById.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(fetchProductById.fulfilled, (state, action) => {
          state.isLoading = false;
          state.currentProduct = action.payload.product;
          state.error = null
        })
        .addCase(fetchProductById.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload.message;
        })
        // Fetch categories
        .addCase(fetchCategories.fulfilled, (state, action) => {
          state.categories = action.payload;
        })

    },
  });

  export const { setFilters, clearFilters, setCurrentPage } = productsSlice.actions;
  export default productsSlice.reducer;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ICartProduct, IFav, IOrder, IProduct, IUserProfile } from "../types";

export let apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery(
        {
            baseUrl: 'http://localhost:5000/api',
            prepareHeaders: (headers) => {
                let token = localStorage.getItem('token')
                if (token) {
                    headers.set('Authorization', `Bearer ${token}`)
                }
                return headers
            }
        }
    ),
    tagTypes: ['User', 'Users', 'Cart', 'Orders', 'Products', 'Fav'],
    endpoints: (builder) => ({
        //POST

        signUp: builder.mutation({
            query: (data) => ({
                url: '/sign_up',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['User']
        }),

        signIn: builder.mutation({
            query: (data) => ({
                url: '/sign_in',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['User']
        }),

        createOrder: builder.mutation({
            query: (data) => ({
                url: '/create_order',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Cart', 'User']
        }),

        addToCart: builder.mutation({
            query: (data) => ({
                url: '/cart/add',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Cart']
        }),

        AddOrDeleteFav: builder.mutation({
            query: (data) => ({
                url: '/fav/AddOrDeleteFav',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Fav']
        }),

        createProduct: builder.mutation({
            query: (formData) => ({
              url: '/admin/create_products',
              method: 'POST',
              body: formData,
            }),
            invalidatesTags: ['Products']
          }),

        //PUT

        editCart: builder.mutation({
            query: (data) => ({
                url: '/cart/edit',
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Cart']
        }),

        editUser: builder.mutation({
            query: (data) => ({
                method: 'PUT',
                url: `/admin/edit/${data.id}`,
                body: data
            }),
            invalidatesTags: ['Users']
        }),

        editProduct: builder.mutation({
            query: (data) => ({
                url: `/admin/products/edit/${data.id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Products']
        }),

        editOrder: builder.mutation({
            query: (data) => ({
              url: `/admin/orders/edit/${data.id}`,
              method: "PUT",
              body: data,
            }),
            invalidatesTags: ['Orders'],
          }),

        //DELETE

        deleteCart: builder.mutation({
            query: (id) => ({
                url: `/cart/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart']
        }),

        deleteUser: builder.mutation({
            query: (id) => ({
                method: 'DELETE',
                url: `/admin/delete/${id}`
            }),
            invalidatesTags: ['Users']
        }),

        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/admin/products/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Products']
        }),

        //GET

        profile: builder.query<IUserProfile, void>({
            query: () => '/profile',
            providesTags: ['User']
        }),

        orders: builder.query<IOrder[], void>({
            query: () => '/orders',
            providesTags: ['Orders']
        }),

        order: builder.query<IOrder, string>({
            query: (id) => `/orders/${id}`,
            providesTags: (result, error, id) => [{ type: 'Orders', id }]
        }),

        getOrders: builder.query({
            query: () => "/admin/orders",
            providesTags: ['Orders'],
          }),

        products: builder.query<IProduct[], void>({
            query: () => '/products',
            providesTags: ['Products']
        }),

        getOneProduct: builder.query<IProduct, string | undefined>({
            query: (id) => `products/${id}`,
            providesTags: ['Cart']
        }),

        cart: builder.query<ICartProduct[], void>({
            query: () => '/cart',
            providesTags: ['Cart']
        }),

        fav: builder.query<IProduct[], void>({
            query: () => '/fav',
            providesTags: ['Fav']
        }),

        checkFav: builder.query({
            query: (id) => `/fav/check/${id}`,
            providesTags: ['Fav']
        }),

        GetAllUsers: builder.query<IUserProfile[], string>({
            query: () => '/admin/users',
            providesTags: ['Users']
        }),

        GetOneUser: builder.query<IUserProfile, void>({
            query: (id) => `/admin/users/${id}`,
            providesTags: ['Users']
        }),
    })
})

export let {
    //POST
    useSignUpMutation,
    useSignInMutation,
    useAddToCartMutation,
    useAddOrDeleteFavMutation,
    useCreateOrderMutation,
    useCreateProductMutation,
    //PUT
    useEditCartMutation,
    useEditUserMutation,
    useEditProductMutation,
    useEditOrderMutation,
    //GET
    useProfileQuery,
    useOrdersQuery,
    useOrderQuery,
    useProductsQuery,
    useGetOneProductQuery,
    useCartQuery,
    useFavQuery,
    useCheckFavQuery,
    useGetAllUsersQuery,
    useGetOneUserQuery,
    useGetOrdersQuery,
    //DELETE
    useDeleteCartMutation,
    useDeleteUserMutation,
    useDeleteProductMutation
} = apiSlice
import s from "./App.module.scss"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Layout } from "./Routes/Layout/Layout"
import { Main } from "./Routes/Main/Main"
import { SignIn } from "./Routes/SignIn/SignIn"
import { SignUp } from "./Routes/SignUp/SignUp"
import { Profile } from "./Routes/Profile/Profile"
import { OrderDetail } from "./Routes/OrderDetail/OrderDetail"
import { Catalog } from "./Routes/Catalog/Catalog"
import { Cart } from "./Routes/Cart/Cart"
import { Favourites } from "./Routes/Favourites/Favourites"
import { ProductDetail } from "./Routes/ProductDetail/ProductDetail"
import { Users } from "./Routes/Users/Users"
import { Orders } from "./Routes/Orders/Orders"
import { UserDetail } from "./Routes/UserDetail/UserDetail"
import { CreateProduct } from "./Routes/CreateProduct/CreateProduct"

let router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Main />
      },
      {
        path: '/sign-in',
        element: <SignIn />
      },
      {
        path: '/sign-up',
        element: <SignUp />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/orders/:id',
        element: <OrderDetail />
      },
      {
        path: '/catalog',
        element: <Catalog />
      },
      {
        path: '/cart',
        element: <Cart />
      },
      {
        path: '/fav',
        element: <Favourites />
      },
      {
        path: '/catalog/:id',
        element: <ProductDetail />
      },
      {
        path: '/admin/users',
        element: <Users />
      },
      {
        path: '/admin/users/:id',
        element: <UserDetail />
      },
      {
        path: '/admin/orders',
        element: <Orders />
      },
      {
        path: '/admin/create-product',
        element: <CreateProduct />
      }
    ]
  }
])


export function App() {
  return <RouterProvider router={router} />
};


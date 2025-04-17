import express from 'express'
import cors from 'cors'
import { upload } from './multer/multerConfig.js'
import { create_products, delete_products, edit_products, getAllProducts, getOneProduct } from './Controllers/productsControllers.js'
import { createNewUser, deleteUser, editUser, getAllUsers, getOneUser } from './Controllers/adminController.js'
import { authenticateToken, rootCheck } from './Middleware/Middleware.js'
import { delete_profile, edit_profile, fetch_profile_data, signIn, signUp } from './Controllers/userController.js'
import { addProduct, deleteProductInCart, editCart, getUserCart } from './Controllers/cartController.js'
import { checkProd, getUserFavs, AddOrDeleteFav } from './Controllers/favController.js'
import { createOrder, editOrder, getAllOrders, getAllOrdersAdmin, getOneOrder } from './Controllers/ordersController.js'

let app = express()
app.use(express.json())

app.use(cors());

app.use('/api/uploads', express.static('uploads'));

//Users Admin
app.get('/api/admin/users', authenticateToken, rootCheck, getAllUsers)

app.get('/api/admin/users/:id', authenticateToken, rootCheck, getOneUser)

app.post('/api/admin/create_user', authenticateToken, rootCheck, createNewUser)

app.delete('/api/admin/delete/:id', authenticateToken, rootCheck, deleteUser)

app.put('/api/admin/edit/:id', authenticateToken, rootCheck, editUser)

//Products Admin
app.post('/api/admin/create_products', authenticateToken, rootCheck, upload.single('image'), create_products)

app.delete('/api/admin/products/delete/:id', authenticateToken, rootCheck, delete_products)

app.put('/api/admin/products/edit/:id', authenticateToken, rootCheck, edit_products)

//Orders Admin 
app.put('/api/admin/orders/edit/:id', authenticateToken, rootCheck, editOrder)

app.get('/api/admin/orders', authenticateToken, rootCheck, getAllOrdersAdmin)

//User
app.post('/api/sign_up', signUp)

app.post('/api/sign_in', signIn)

app.get('/api/profile', authenticateToken, fetch_profile_data)

app.put('/api/profile/edit', authenticateToken, edit_profile)

app.delete('/api/profile/delete', authenticateToken, delete_profile)

//Products Users
app.get('/api/products', getAllProducts)

app.get('/api/products/:id', getOneProduct)

//Cart Users
app.get('/api/cart', authenticateToken, getUserCart)

app.post('/api/cart/add', authenticateToken, addProduct)

app.delete('/api/cart/delete/:id', authenticateToken, deleteProductInCart)

app.put('/api/cart/edit', authenticateToken, editCart)

//Favourites
app.post('/api/fav/AddOrDeleteFav', authenticateToken, AddOrDeleteFav)

app.get('/api/fav/check/:id', authenticateToken, checkProd)

app.get('/api/fav', authenticateToken, getUserFavs)

// app.post('/api/fav/add', authenticateToken, addFav)

// app.delete('/api/fav/add', authenticateToken, deleteFav)

//Orders User
app.get('/api/orders', authenticateToken, getAllOrders)

app.get('/api/orders/:id', authenticateToken, getOneOrder)

app.post('/api/create_order', authenticateToken, createOrder)

//listen
app.listen(5000, () => {
    console.log('вусё работает');
})

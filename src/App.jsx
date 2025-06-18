import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/home'
import Collection from './pages/collection'
import About from './pages/about'
import Contact from './pages/contact'
import Product from './pages/product'
import Cart from './pages/cart'
import Signup from './pages/signup'
import Login from './pages/login'
import ForgotPassword from './pages/forgotpassword'
import PlaceOder from './pages/placeOder'
import Orders from './pages/orders'
import ListOrder from './pages/list-order'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/searchBar'
import { ToastContainer } from 'react-toastify';
import SignUp from './pages/signup'
import OrderDetail from './pages/OrderDetails';
import Admin from './pages/admin'
import AdProduct from './pages/ad_products';
import AdOrder from "./pages/ad_order";
import AdCategory from './pages/ad_category';
import AdColor from './pages/ad_color';
import AdSize from './pages/ad_size';
import AdUser from './pages/ad_users'
import AdStatistics from './pages/ad_statistics'
import AdFinance from './pages/ad_finance'

// import AdUser from './pages/ad_users';
const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/forgot-password' element={< ForgotPassword/>} />
        <Route path='/place-order' element={<PlaceOder />} />
        <Route path='/list-order' element={<ListOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path="/order/:orderId" element={<OrderDetail />} />
        {/* <Route path='/admin' element={<Admin/>}/> */}
        <Route path='/admin' element={<Admin />}>
          <Route index element={<Navigate to="products" replace />} />
          <Route path='products' element={<AdProduct />} />
          <Route path='orders' element={<AdOrder />} />
          <Route path='categories' element={<AdCategory />} />
          <Route path='colors' element={<AdColor />} />
          <Route path='sizes' element={<AdSize />} />
          <Route path='customers' element={<AdUser />} />
          <Route path='statistics' element={<AdStatistics />} />
          <Route path='finance' element={<AdFinance />} />
        </Route>


      </Routes>
      <Footer />


    </div>
  )
}

export default App
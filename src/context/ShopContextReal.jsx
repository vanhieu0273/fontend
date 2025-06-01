// import { createContext } from "react";
// import { products} from '../assets/frontend_assets/assets'

// export const ShopContext = () => createContext();

// const ShopContextProvider = (props) => {
//     const currency = 'VND';
//     const delivery_free = 10;

//     const value = {
//         products, currency, delivery_free
//     }

//     return (
//         <ShopContext.Provider value={value}>
//             {props.children}
//         </ShopContext.Provider>
//     )
// }

// export default ShopContextProvider;

import { createContext, useEffect, useState } from "react";
import React from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

export const ShopContextProvider = (props) => {
  const currency = "VND";
  const delivery_free = 10;

  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(true);
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('cartItems'));
      return Array.isArray(savedCart) ? savedCart : [];
    } catch (e) {
      return [];
    }
  });

  const navigate = useNavigate();

  // Sync cartItems to localStorage on change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (itemId, size, color, price, image,name) => {

    console.log('img', image);
    
    if (!size || !color) {
      toast.error('Please select size and color');
      return;
    }

    const existingIndex = cartItems.findIndex(
      (item) => item._id === itemId && item.size === size && item.color === color
    );

    let updatedCart = [...cartItems];

    if (existingIndex !== -1) {
      updatedCart[existingIndex].quantity += 1;
    } else {
      updatedCart.push({
        _id: itemId,
        name,
        image,
        price,
        size,
        color,
        quantity: 1,
      });
    }

    setCartItems(updatedCart);
    toast.success("Added to cart!");
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const updateQuantity = async (itemId, size, color, quantity) => {
    //  kiểm tra đầu vào nếu trùng id, size, color thì tăng hoặc giảm quantity
    const updatedCart = cartItems.map(item => {
      if (item._id === itemId && item.size === size && item.color === color) {
        return { ...item, quantity };
      }
      return item;
    });
    setCartItems(updatedCart);
  };

  const getCartAmount = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const value = {
    currency,
    delivery_free,
    search, setSearch,
    showSearch, setShowSearch,
    cartItems, addToCart,
    getCartCount, updateQuantity,
    getCartAmount, navigate
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};





// import { createContext, useEffect, useState } from "react";
// import React from "react";
// import { products } from "../assets/frontend_assets/assets";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// export const ShopContext = createContext();

// export const ShopContextProvider = (props) => {
//   const currency = "VND";
//   const delivery_free = 10;

//   const [search, setSearch] = useState('');
//   const [showSearch, setShowSearch] = useState(true);
//   const [cartItems, setCartItems] = useState({});
//   const navigate = useNavigate();

// const addToCart = async (itemId, sizeObj) => {
//   console.log("addToCart called with:");
//   console.log("itemId:", itemId);
//   console.log("sizeObj:", sizeObj);

//   // Lấy sizeId từ sizeObj.size nếu không có _id
//   const sizeId = sizeObj?._id || sizeObj?.size;

//   if (!sizeId) {
//     toast.error('⚠️ Please select a size - sizeId is missing');
//     console.error("Error: sizeId is undefined", sizeObj);
//     return;
//   }

//   let cartData = structuredClone(cartItems);
//   if (cartData[itemId]) {
//     if (cartData[itemId][sizeId]) {
//       cartData[itemId][sizeId] += 1;
//     } else {
//       cartData[itemId][sizeId] = 1;
//     }
//   } else {
//     cartData[itemId] = {};
//     cartData[itemId][sizeId] = 1;
//   }

//   setCartItems(cartData);
//   toast.success("✅ Thêm sản phẩm vào giỏ hàng thành công!");
// };



//   const getCartCount = () => {
//     let totalCount = 0;
//     for (const productId in cartItems) {
//       for (const sizeId in cartItems[productId]) {
//         try {
//           if (cartItems[productId][sizeId] > 0) {
//             totalCount += cartItems[productId][sizeId];
//           }
//         } catch (error) {
//           console.error("Error counting cart item:", error);
//         }
//       }
//     }
//     return totalCount;
//   };

//   const updateQuantity = async (itemId, size, quantity) => {
//     const sizeId = typeof size === 'object' ? size._id : size;

//     let cartData = structuredClone(cartItems);
//     if (!cartData[itemId]) cartData[itemId] = {};
//     cartData[itemId][sizeId] = quantity;
//     setCartItems(cartData);
//   };

//   const getCartAmount = () => {
//     let totalAmount = 0;

//     for (const productId in cartItems) {
//       const itemInfo = products.find(product => product._id === productId);
//       if (!itemInfo) continue;

//       for (const sizeId in cartItems[productId]) {
//         try {
//           if (cartItems[productId][sizeId] > 0) {
//             totalAmount += itemInfo.price * cartItems[productId][sizeId];
//           }
//         } catch (error) {
//           console.error("Error calculating cart amount:", error);
//         }
//       }
//     }

//     return totalAmount;
//   };

//   const value = {
//     products,
//     currency,
//     delivery_free,
//     search, setSearch,
//     showSearch, setShowSearch,
//     cartItems, addToCart,
//     getCartCount, updateQuantity,
//     getCartAmount, navigate
//   };

//   return (
//     <ShopContext.Provider value={value}>
//       {props.children}
//     </ShopContext.Provider>
//   );
// };

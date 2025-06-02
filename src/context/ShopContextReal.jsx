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

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cartItems"));
      return Array.isArray(savedCart) ? savedCart : [];
    } catch (e) {
      return [];
    }
  });

  const navigate = useNavigate();

  // Sync cartItems to localStorage on change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (itemId, size, color, price, image, name) => {
    console.log("img", image);

    if (!size || !color) {
      toast.error("Please select size and color");
      return;
    }

    const existingIndex = cartItems.findIndex(
      (item) =>
        item._id === itemId && item.size === size && item.color === color
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
    toast.success("Thêm vào giỏ hàng thành công");
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // const updateQuantity = async (itemId, size, color, quantity) => {
  //   const updatedCart = cartItems.map((item) => {
  //     if (
  //       item._id === itemId &&
  //       item.size._id === size._id &&
  //       item.color._id === color._id
  //     ) {
  //       return { ...item, quantity };
  //     }
  //     return item;
  //   });
  //   setCartItems(updatedCart);
  // };
  const updateQuantity = async (itemId, size, color, quantity) => {
    let updatedCart;

    if (quantity === 0) {
      // Xóa sản phẩm ra khỏi giỏ hàng
      updatedCart = cartItems.filter(
        (item) =>
          !(
            item._id === itemId &&
            item.size._id === size._id &&
            item.color._id === color._id
          )
      );
    } else {
      // Cập nhật số lượng sản phẩm
      updatedCart = cartItems.map((item) => {
        if (
          item._id === itemId &&
          item.size._id === size._id &&
          item.color._id === color._id
        ) {
          return { ...item, quantity };
        }
        return item;
      });
    }

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
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

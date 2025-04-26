


import React, { useEffect, useState } from 'react';
import { Navbar } from 'react-bootstrap';
import HomeNavbar from '../navbar/HomeNavbar';


const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [cartLength, setCartLength] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // Retrieve cart items and cart length from localStorage
        const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const storedCartLength = localStorage.getItem('cartLength') || 0;

        setCartItems(storedCartItems);
        setCartLength(storedCartLength);
        calculateTotalPrice(storedCartItems);
    }, []);

    const calculateTotalPrice = (items) => {
        const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalPrice(total);
    };

    const increaseQuantity = (productId) => {
        const updatedCartItems = cartItems.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCartItems(updatedCartItems);
        calculateTotalPrice(updatedCartItems);

        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    };

    const decreaseQuantity = (productId) => {
        const updatedCartItems = cartItems.map((item) =>
            item.productId === productId && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
        );
        setCartItems(updatedCartItems);
        calculateTotalPrice(updatedCartItems);

        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    };

    const handleRemoveItem = (productId) => {
        const updatedCartItems = cartItems.filter(item => item.productId !== productId);
        setCartItems(updatedCartItems);
        setCartLength(updatedCartItems.length);
        calculateTotalPrice(updatedCartItems);

        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        localStorage.setItem('cartLength', updatedCartItems.length);  
    };

    return (
   
        <div>
            <HomeNavbar />
            <div className="cartContainer">
                <h1 className="cartTitle"> Cart Details</h1>
                {cartLength > 0 ? (
                    <div className="cartContent">
                        <div className="cartHeader">
                            <span className="itemsCount">
                                {cartLength} {cartLength === 1 ? 'Item' : 'Items'} in Cart
                            </span>
                        </div>

                        <div className="itemsList">
                            {cartItems.map((item) => (
                                <div key={item.productId} className="cartItem">
                                    <div className="itemImageContainer">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="itemImage"
                                        />
                                    </div>

                                    <div className="itemDetails">
                                        <h3 className="itemTitle">{item.title}</h3>
                                        <p className="itemPrice">${item.price}</p>

                                        <div className="quantityControls">
                                            <button
                                                className="quantityButton"
                                                onClick={() => decreaseQuantity(item.productId)}
                                            >
                                                −
                                            </button>
                                            <span className="quantity">{item.quantity}</span>
                                            <button
                                                className="quantityButton"
                                                onClick={() => increaseQuantity(item.productId)}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <p className="itemTotal">
                                            Total: ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>

                                    <button
                                        className="removeButton"
                                        onClick={() => handleRemoveItem(item.productId)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cartSummary">
                            <div className="totalPrice">
                                <span>Total:</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <button className="checkoutButton">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="emptyCart">
                        <p>Your cart is empty</p>
                        <p>Continue shopping to add items to your cart</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Cart;
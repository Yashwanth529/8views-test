

import React, { useEffect, useState } from 'react';
import HomeNavbar from '../navbar/HomeNavbar';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

const ViewProduct = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadCartItems = () => {
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(items);
    };

    useEffect(() => {
        const productId = localStorage.getItem('selectedProductId');

        if (productId) {
            fetch(`https://fakestoreapi.com/products/${productId}`)
                .then((res) => res.json())
                .then((data) => {
                    setSelectedProduct(data);
                    setIsLoading(false);
                })
                .catch(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }

        loadCartItems();

        const handleStorageChange = () => {
            loadCartItems();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const updateCart = (updatedCart) => {
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('storage'));
    };

    const handleAddToCart = () => {
        if (!selectedProduct) return;

        const existingItem = cartItems.find(cartItem => cartItem.productId === selectedProduct.id);

        let updatedCart;
        if (existingItem) {
            updatedCart = cartItems.map(cartItem =>
                cartItem.productId === selectedProduct.id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            );
        } else {
            updatedCart = [
                ...cartItems,
                {
                    productId: selectedProduct.id,
                    title: selectedProduct.title,
                    price: selectedProduct.price,
                    image: selectedProduct.image,
                    quantity: 1
                }
            ];
        }

        updateCart(updatedCart);
    };

    const handleIncrease = () => {
        const existingItem = cartItems.find(cartItem => cartItem.productId === selectedProduct.id);

        if (existingItem) {
            const updatedCart = cartItems.map(cartItem =>
                cartItem.productId === selectedProduct.id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            );
            updateCart(updatedCart);
        } else {
            handleAddToCart();
        }
    };

    const handleDecrease = () => {
        const existingItem = cartItems.find(cartItem => cartItem.productId === selectedProduct.id);

        if (existingItem && existingItem.quantity > 1) {
            const updatedCart = cartItems.map(cartItem =>
                cartItem.productId === selectedProduct.id
                    ? { ...cartItem, quantity: cartItem.quantity - 1 }
                    : cartItem
            );
            updateCart(updatedCart);
        }
    };

    const getQuantity = () => {
        const item = cartItems.find(cartItem => cartItem.productId === selectedProduct?.id);
        return item ? item.quantity : 0;
    };

    const calculateProductTotal = () => {
        const item = cartItems.find(cartItem => cartItem.productId === selectedProduct?.id);
        return item ? (item.price * item.quantity).toFixed(2) : (selectedProduct?.price || 0).toFixed(2);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!selectedProduct) {
        return <div>No product selected</div>;
    }

    return (
        <div>
            <HomeNavbar cartLength={cartItems.length} />
            <div className="container my-5">
                <div className="row">
                    <div className="col-md-6 d-flex align-items-center justify-content-center mb-4">
                        <img
                            src={selectedProduct.image}
                            alt={selectedProduct.title}
                            style={{
                                width: '100%',
                                maxWidth: '400px',
                                height: '400px',
                                objectFit: 'contain',
                                border: '1px solid #ccc',
                                borderRadius: '10px',
                                padding: '20px',
                                background: '#fff'
                            }}
                        />
                    </div>
                    <div className="col-md-6 mb-4">
                        <h3>{selectedProduct.title}</h3>
                        <h4 style={{ color: 'green' }}>${selectedProduct.price}</h4>
                        <p style={{ fontSize: '15px', color: '#555' }}>{selectedProduct.description}</p>

                        {/* <div className="mb-3 cart-controls d-flex flex-row justifyconten-none">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={handleDecrease}
                                
                            >
                                -
                            </button>
                            <span style={{ margin: '0 15px', fontSize: '18px' }}>{getQuantity()}</span>
                            <button
                                className="btn btn-outline-secondary"
                                onClick={handleIncrease}
                                
                            >
                                +
                            </button>
                        </div> */}
                        <div className="flex items-center gap-4 mb-4 quantity-controls">
                            <button
                                className="add-to-cart-btn"
                                onClick={handleDecrease}
                            >
                                -
                            </button>
                            <span className="text-lg font-semibold">{getQuantity()}</span>
                            <button
                                className="add-to-cart-btn"
                                onClick={handleIncrease}
                            >
                                +
                            </button>
                        </div>


                        {/* <div className="mb-3">
                            <button
                                className="btn btn-primary"
                                onClick={handleAddToCart}
                                style={{ padding: '10px 20px', fontSize: '16px', borderRadius: '8px' }}
                            >
                                Add to Cart
                            </button>
                        </div> */}

                        <a href="/cart">
                            <button size="sm"
                                 className="view-details-btn"
                                style={{ padding: '10px 20px', fontSize: '16px', borderRadius: '8px' }}
                            >
                                Move to Cart
                            </button>
                        </a>

                        <div className="mt-4">
                            <h5>Total Price: <span style={{ color: 'blue' }}>${calculateProductTotal()}</span></h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProduct;


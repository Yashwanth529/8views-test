

import React, { useEffect, useState } from 'react';
import HomeNavbar from '../navbar/HomeNavbar';

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
        alert(`${selectedProduct.title} added to cart`);
    };

    const handleIncrease = () => {
        const updatedCart = cartItems.map(cartItem =>
            cartItem.productId === selectedProduct.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
        );
        updateCart(updatedCart);
    };

    const handleDecrease = () => {
        const updatedCart = cartItems.map(cartItem =>
            cartItem.productId === selectedProduct.id && cartItem.quantity > 1
                ? { ...cartItem, quantity: cartItem.quantity - 1 }
                : cartItem
        );
        updateCart(updatedCart);
    };

    const getQuantity = () => {
        const item = cartItems.find(cartItem => cartItem.productId === selectedProduct?.id);
        return item ? item.quantity : 0;
    };

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
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
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-6">
                        <img
                            src={selectedProduct.image}
                            alt={selectedProduct.title}
                            style={{ width: '100%', objectFit: 'contain', height: '400px' }}
                        />
                    </div>
                    <div className="col-md-6">
                        <h3>{selectedProduct.title}</h3>
                        <h4>${selectedProduct.price}</h4>
                        <p>{selectedProduct.description}</p>
                        {/* <div className="mb-3">
              <strong>Selected Quantity: {getQuantity()}</strong>
            </div> */}
                        <div className="mb-3">
                            <button className="btn btn-secondary" onClick={handleDecrease}>
                                -
                            </button>
                            <span className="mx-2">{getQuantity()}</span>
                            <button className="btn btn-secondary" onClick={handleIncrease}>
                                +
                            </button>
                        </div>
                        <a href="/cart">
                            <button className="btn btn-primary" >
                                Move to Cart
                            </button>
                        </a>
                        <div className="mt-3">
                            <h5>Total Price: ${calculateTotalPrice()}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProduct;

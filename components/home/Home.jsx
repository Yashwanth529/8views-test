


import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import HomeNavbar from '../navbar/HomeNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Router from "next/router";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [cartLength, setCartLength] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('https://fakestoreapi.com/products');
      const data = await res.json();
      setProducts(data);
      setFiltered(data);
      const uniqueCategories = ['all', ...new Set(data.map(item => item.category))];
      setCategories(uniqueCategories);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
    setCartLength(storedCartItems.length);  
  }, []); 

  useEffect(() => {
    let updatedProducts = [...products];

    if (selectedCategory !== 'all') {
      updatedProducts = updatedProducts.filter(item => item.category === selectedCategory);
    }

    if (searchTerm.trim() !== '') {
      updatedProducts = updatedProducts.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceFilter === 'lowToHigh') {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (priceFilter === 'highToLow') {
      updatedProducts.sort((a, b) => b.price - a.price);
    }

    setFiltered(updatedProducts);
  }, [products, selectedCategory, searchTerm, priceFilter]);

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  const viewDetails = (itemId) => {
    localStorage.setItem('selectedProductId', itemId);
    Router.push('/product_details');
  };

  const handleAddToCart = async (item) => {
    const exists = cartItems.find(prod => prod.productId === item.id);
    let updatedCart;

    if (exists) {
      updatedCart = cartItems.map(prod =>
        prod.productId === item.id ? { ...prod, quantity: prod.quantity + 1 } : prod
      );
    } else {
      updatedCart = [...cartItems, { productId: item.id, quantity: 1, title: item.title, image: item.image, price: item.price }];
    }

    setCartItems(updatedCart);
    setCartLength(updatedCart.length);

    // Save cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    localStorage.setItem('cartLength', updatedCart.length);  // Store cart length

    const cart = {
      userId: 1,
      date: new Date().toISOString().split('T')[0],
      products: updatedCart
    };

    try {
      const res = await fetch('https://fakestoreapi.com/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cart)
      });
      const data = await res.json();
      console.log('Cart updated:', data);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const increaseQuantity = (itemId) => {
    const item = products.find(p => p.id === itemId);
    if (item) handleAddToCart(item);
  };

  const decreaseQuantity = async (itemId) => {
    const updatedCart = cartItems
      .map(item =>
        item.productId === itemId ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter(item => item.quantity > 0);

    setCartItems(updatedCart);
    setCartLength(updatedCart.length);

    // Save cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    localStorage.setItem('cartLength', updatedCart.length);  // Store cart length

    const cart = {
      userId: 1,
      date: new Date().toISOString().split('T')[0],
      products: updatedCart,
    };

    try {
      const res = await fetch('https://fakestoreapi.com/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cart),
      });
      const data = await res.json();
      console.log('Cart updated:', data);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };


  return (
    <div>
      <HomeNavbar cartLength={cartLength} />
      <Container fluid className="mt-4">
        <Row>
          {/* Left Filter Sidebar */}
          {/* <Col md={3}>
            <h4>Filters</h4>

            <div className="mb-4">
              <h6 className='mt-4'>Categories</h6>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'primary' : 'outline-primary'}
                  onClick={() => handleCategoryFilter(cat)}
                  className="mb-2 me-2"
                  size="sm"
                >
                  {cat.toUpperCase()}
                </Button>
              ))}
            </div>

            <div className="mb-4">
              <h6>Search</h6>
              <Form.Control
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className='data-input'
              />
            </div>

            <div className='mb-4 mb-lg-0'>
              <h6>Sort By Price</h6>
              <Form.Select value={priceFilter} onChange={handlePriceChange} className='data-input'>
                <option value="">Select</option>
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High to Low</option>
              </Form.Select>
            </div>
          </Col> */}
          <Col md={3} className="filters-section">
            <h4 className="filters-title">Filters</h4>

            <div className="filter-group mb-4">
              <h6 className="filter-heading mt-4">Categories</h6>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant="outline-primary"
                  onClick={() => handleCategoryFilter(cat)}
                  active={selectedCategory === cat}
                  className="mb-2 me-2 filter-button"
                  size="sm"
                >
                  {cat.toUpperCase()}
                </Button>
              ))}

            </div>

            <div className="filter-group mb-4">
              <h6 className="filter-heading">Search</h6>
              <Form.Control
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="data-input"
              />
            </div>

            <div className="filter-group mb-4 mb-lg-0">
              <h6 className="filter-heading">Sort By Price</h6>
              <Form.Select
                value={priceFilter}
                onChange={handlePriceChange}
                className="data-input"
              >
                <option value="">Select</option>
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High to Low</option>
              </Form.Select>
            </div>
          </Col>


          {/* Right Products Grid */}
          <Col md={9}>
            <Row>
              {filtered.map((item) => (
                <Col key={item.id} xs={12} sm={6} md={4} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Card.Img
                      variant="top"
                      src={item.image}
                      style={{ height: '200px', objectFit: 'contain', padding: '10px' }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title style={{ fontSize: '1rem' }}>{item.title}</Card.Title>
                      <Card.Text className="mt-auto">
                        <strong>${item.price}</strong>
                      </Card.Text>
                      <div className='d-flex flex-row justify-content-between align-items-center'>
                        {cartItems.some(ci => ci.productId === item.id) ? (
                          <div className='d-flex align-items-center gap-2'>
                            <Button size="sm" onClick={() => decreaseQuantity(item.id)}>-</Button>
                            <span>
                              {cartItems.find(ci => ci.productId === item.id)?.quantity}
                            </span>
                            <Button size="sm" onClick={() => increaseQuantity(item.id)}>+</Button>
                          </div>
                        ) : (
                          <button className='add-to-cart-btn' onClick={() => handleAddToCart(item)}>
                            Add to Cart
                          </button>
                        )}

                        <button className='view-details-btn' onClick={() => viewDetails(item.id)}>
                          View Details
                        </button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;

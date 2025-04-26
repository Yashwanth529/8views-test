import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function HomeNavbar() {
  const [cartLength, setCartLength] = useState(0);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartLength(storedCartItems.length);
  }, []);

  return (
    <Navbar expand="lg" className="bg-body-tertiary custom-navbar">
      <Container>
        <Navbar.Brand href="#home" className="navbar-brand-custom">8 Views</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/home" className="nav-link-custom">Home</Nav.Link>
            <Nav.Link href="/data_add" className="nav-link-custom">Employee</Nav.Link>
          </Nav>
          <Nav className="ms-auto align-items-center">
            <Nav.Link href="/cart" className="nav-link-custom cart-link">
              <div className="cartIcon">
                <FontAwesomeIcon icon={faCartShopping} size="lg" />
                <span className="cartLength">{cartLength}</span>
              </div>
            </Nav.Link>
            <Nav.Link href="/signup" className="nav-link-custom logout-link">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default HomeNavbar;

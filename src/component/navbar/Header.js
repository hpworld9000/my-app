import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const headerStyle = { backgroundColor: '#282c34', padding: '12px 20px', color: 'white' };
  const containerStyle = { maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
  const logoStyle = { display: 'flex', alignItems: 'center' };
  const imgStyle = { height: 40, width: 40, marginRight: 10 };
  const navStyle = { display: 'flex', gap: 16, alignItems: 'center' };
  const linkStyle = { color: 'white', textDecoration: 'none', fontSize: 16 };

return (
    <header style={headerStyle}>
        <div style={containerStyle}>
            <div style={logoStyle}>
                {/* The default CRA public logo (logo192.png) is used if present. */}
                <img
                    src="/logo192.png"
                    alt="Logo"
                    style={imgStyle}
                    onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                />
                <span style={{ fontSize: 18, fontWeight: 600 }}>MyApp</span>
            </div>

            <nav style={navStyle} aria-label="Main navigation">
                <Link to="/" style={linkStyle}>Home</Link>
                <Link to="/vendor" style={linkStyle}>Vendors</Link>
                <Link to="/product" style={linkStyle}>Product</Link>
                <Link to="/contact" style={linkStyle}>Contact Us</Link>
            </nav>
        </div>
    </header>
);
};

export default Header;
import React from 'react';

export default function Navbar({ onPickProducts, onPickVariants, onPickCollections }) {
    return (
        <nav className="navbar">
            <div className="nav-brand">
                Resource Picker
            </div>
            <div className="nav-links">
                <button className="nav-button" onClick={onPickProducts}>Products</button>
                <button className="nav-button" onClick={onPickVariants}>Variants</button>
                <button className="nav-button" onClick={onPickCollections}>Collections</button>
            </div>
        </nav>
    );
}

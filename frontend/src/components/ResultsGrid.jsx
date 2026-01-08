import React from 'react';

export default function ResultsGrid({ items }) {
    if (!items || items.length === 0) return null;

    return (
        <div className="results-section">
            <h2>Selected Items</h2>
            <div className="results-grid">
                {items.map((item) => {
                    const { id, name, price, product, type } = item;
                    const imgSrc = type === 'collection'
                        ? "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-1_large.png"
                        : "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png";

                    return (
                        <div key={id} className="result-card">
                            <div className="card-image">
                                <img src={imgSrc} alt={name} />
                            </div>
                            <div className="card-details">
                                <h3>{name}</h3>
                                {price && <p className="price">{price}</p>}
                                {product && <p className="product-name">{product}</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

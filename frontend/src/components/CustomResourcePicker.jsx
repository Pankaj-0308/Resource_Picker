import React, { useState, useEffect } from 'react';

export default function CustomResourcePicker({ resourceType, open, onCancel, onSelection }) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!open || !resourceType) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/${resourceType}`);
                if (!response.ok) throw new Error('Failed to fetch data');
                const data = await response.json();
                setItems(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load resources. Make sure backend is running and configured.');
                setItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        setSelectedItems([]);
    }, [resourceType, open]);

    const toggleSelection = (id) => {
        setSelectedItems(prev => {
            if (prev.includes(id)) {
                return prev.filter(itemId => itemId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handlePrimaryAction = () => {
        const selectedObjects = items.filter(item => selectedItems.includes(item.id));
        onSelection(selectedObjects);
    };

    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Pick {resourceType}</h2>
                    <button className="close-button" onClick={onCancel}>&times;</button>
                </div>
                <div className="modal-body">
                    {loading && <p className="loading-state">Loading...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!loading && !error && (
                        <ul className="resource-list">
                            {items.length === 0 && <li className="empty-state">No items found</li>}
                            {items.map((item) => (
                                <li
                                    key={item.id}
                                    className={`resource-item ${selectedItems.includes(item.id) ? 'selected' : ''}`}
                                    onClick={() => toggleSelection(item.id)}
                                >
                                    <div className="checkbox-wrapper">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.id)}
                                            readOnly
                                        />
                                    </div>
                                    <div className="item-details">
                                        <span className="item-name">{item.name}</span>
                                        {item.price && <span className="item-price">{item.price}</span>}
                                        {item.product && <span className="item-subtitle">Part of: {item.product}</span>}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onCancel}>Cancel</button>
                    <button className="btn-primary" onClick={handlePrimaryAction}>Add selected</button>
                </div>
            </div>
        </div>
    );
}

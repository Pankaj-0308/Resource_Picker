import React, { useState } from 'react';
import CustomResourcePicker from './components/CustomResourcePicker';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ResultsGrid from './components/ResultsGrid';

export default function App() {
  const [activePicker, setActivePicker] = useState(null);
  const [selection, setSelection] = useState([]);

  const handlePickProducts = () => setActivePicker('products');
  const handlePickVariants = () => setActivePicker('variants');
  const handlePickCollections = () => setActivePicker('collections');

  const handleCancel = () => setActivePicker(null);

  const handleHome = () => {
    setSelection([]);
    setActivePicker(null);
  };

  const handleSelection = (selected) => {
    console.log('Selected:', selected);
    setSelection(selected);
    setActivePicker(null);
  };

  return (
    <div className="app-container">
      <Navbar
        onHome={handleHome}
        onPickProducts={handlePickProducts}
        onPickVariants={handlePickVariants}
        onPickCollections={handlePickCollections}
      />

      <main className="main-content">
        <div className="content-wrapper">
          {selection.length > 0 ? (
            <ResultsGrid items={selection} />
          ) : (
            <div className="welcome-banner">
              <h1>Resource Picker</h1>
              <p>Select products, variants, or collections to view their details.</p>
            </div>
          )}
        </div>
      </main>

      <CustomResourcePicker
        resourceType={activePicker}
        open={!!activePicker}
        onCancel={handleCancel}
        onSelection={handleSelection}
      />

      <Footer />
    </div>
  );
}

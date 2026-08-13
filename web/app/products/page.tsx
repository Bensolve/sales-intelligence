'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { addProduct, getUserProducts, deleteProduct } from '@/lib/products';
import { Product } from '@/types';

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');

  // 1. Fetch products cleanly on load
  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    getUserProducts(user.uid)
      .then((data) => {
        if (isMounted) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  // 2. Handle Add Product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addProduct(user.uid, {
        name,
        category: category || 'General',
        costPrice: parseFloat(costPrice) || 0,
        sellingPrice: parseFloat(sellingPrice) || 0,
        stockQuantity: parseInt(stockQuantity, 10) || 0,
        lowStockThreshold: 5,
      });

      // Clear Form Fields
      setName('');
      setCategory('');
      setCostPrice('');
      setSellingPrice('');
      setStockQuantity('');

      // Refresh product list from Firestore
      const updatedList = await getUserProducts(user.uid);
      setProducts(updatedList);
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Error adding product');
    }
  };

  // 3. Handle Delete Product
  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(id);
      const updatedList = await getUserProducts(user.uid);
      setProducts(updatedList);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Error deleting product');
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Product Inventory</h1>

      {/* Add Product Form */}
      <form
        onSubmit={handleAddProduct}
        style={{
          display: 'grid',
          gap: '1rem',
          marginBottom: '2rem',
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      >
        <h3>Add New Product</h3>
        <input
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Category (e.g. Beverages)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          placeholder="Cost Price ($)"
          type="number"
          step="0.01"
          value={costPrice}
          onChange={(e) => setCostPrice(e.target.value)}
          required
        />
        <input
          placeholder="Selling Price ($)"
          type="number"
          step="0.01"
          value={sellingPrice}
          onChange={(e) => setSellingPrice(e.target.value)}
          required
        />
        <input
          placeholder="Stock Quantity"
          type="number"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
          required
        />
        <button
          type="submit"
          style={{
            padding: '0.75rem',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Save Product
        </button>
      </form>

      {/* Product List */}
      <h3>Your Products</h3>
      {loading ? (
        <p>Loading inventory...</p>
      ) : products.length === 0 ? (
        <p>No products added yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ccc' }}>
              <th>Name</th>
              <th>Category</th>
              <th>Cost</th>
              <th>Selling Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${p.costPrice}</td>
                <td>${p.sellingPrice}</td>
                <td>{p.stockQuantity}</td>
                <td>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{
                      color: 'red',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
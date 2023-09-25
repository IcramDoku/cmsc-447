import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios'; // Import Axios

const API_URL = '/api/items';

function App() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    axios.get(API_URL) // Use Axios for GET request
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const addItem = () => {
    axios.post(API_URL, { name: item }, { headers: { 'Content-Type': 'application/json' } }) // Use Axios for POST request
      .then((response) => {
        setItem('');
        fetchItems();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const updateItem = (id, updatedItem) => {
    axios.put(`${API_URL}/${id}`, updatedItem, { headers: { 'Content-Type': 'application/json' } }) // Use Axios for PUT request
      .then(() => {
        fetchItems();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteItem = (id) => {
    axios.delete(`${API_URL}/${id}`) // Use Axios for DELETE request
      .then(() => {
        fetchItems();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="App">
      <h1>CRUD Application</h1>
      <input
        type="text"
        value={item}
        onChange={(e) => setItem(e.target.value)}
        placeholder="Enter an item"
      />
      <button onClick={addItem}>Add Item</button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.name}
            <button onClick={() => updateItem(index, { name: 'Updated Item' })}>
              Update
            </button>
            <button onClick={() => deleteItem(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;



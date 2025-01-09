import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    available: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const modal = useRef();
  const descriptionModal = useRef();

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://192.168.0.116:3001/products');
      const data = await response.json();

      const sortedProducts = data.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      setProducts(sortedProducts);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = isEditing 
      ? `http://192.168.0.116:3001/products/${editingId}` 
      : 'http://192.168.0.116:3001/products';

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchProducts();
        closeModal();
        resetForm();
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const response = await fetch(`http://192.168.0.116:3001/products/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchProducts();
        }
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
      }
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      available: product.available
    });
    setIsEditing(true);
    setEditingId(product.id);
    modal.current.showModal();
  }

  const showModal = () => {
    setIsEditing(false);
    resetForm();
    modal.current.showModal();
  };

  const closeModal = () => {
    modal.current.close();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      available: true,
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleInputChange = (event) => {
    const { id, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }))
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  const showDescription = (product) => {
    setSelectedProduct(product);
    descriptionModal.current.showModal();
  }

  return (
    <div className="container">
      <h1>Lista de Produtos</h1>

      <ul id="product-list">
        {products.map(product => (
          <li key={product.id}>
            <div className="product-info">
                <span className='product-name'>{product.name}</span>
                <span className='product-price'>{formatPrice(product.price)}</span>
                <span className={`product-status ${product.available ? 'available' : 'unavailable'}`}>
                  {product.available ? 'Disponível' : 'Indisponível'}
                </span>
            </div>
            <div className="product-actions">
              <button onClick={() => showDescription(product)} className="info-btn">
                Descrição
              </button>
              <button onClick={() => handleEdit(product)} className='edit-btn'>
                Editar
              </button>
              <button onClick={() => handleDelete(product.id)} className='delete-btn'>
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button id="new-product-btn" onClick={showModal}>
        Cadastrar Novo Produto
      </button>

      {/* Dialog para cadastrar novo produto */}
        <dialog ref={modal}>
          <h2>{isEditing ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h2>
          <form id="product-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Nome do Produto:</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="description">Descrição do Produto:</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="price">Valor do Produto:</label>
              <input
                type="number"
                id="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="available">Disponível para Venda:</label>
              <input 
              type="checkbox" 
              id="available"
              checked={formData.available}
              onChange={handleInputChange}
              />
            </div>
            <button type="submit">{isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}</button>
            <button type="button" onClick={closeModal}>
              Cancelar
            </button>
          </form>
        </dialog>

        <dialog ref={descriptionModal} className='description-modal'>
          {selectedProduct && (
            <>
              <h2>{selectedProduct.name}</h2>
              <p className='description'>{selectedProduct.description}</p>
              <p className="price">Valor: {formatPrice(selectedProduct.price)}</p>
              <p className="status">
                Status: {selectedProduct.available ? 'Disponível' : 'Indisponível'}
              </p>
              <button onClick={() => descriptionModal.current.close()}>Fechar</button>
            </>
          )}
        </dialog>
    </div>
  );
};

export default App;

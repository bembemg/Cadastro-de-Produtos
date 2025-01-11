import React, { useState, useEffect, useRef } from 'react';
import { MdOutlineDescription, MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
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
  const [productToDelete, setProductToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorClass, setErrorClass] = useState('');

  const modal = useRef();
  const descriptionModal = useRef();
  const deleteModal = useRef();

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://https://cadastro-de-produtos-backend.onrender.com/:3001/products');
      const data = await response.json();

      const sortedProducts = data.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      setProducts(sortedProducts);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const showModal = () => {
    setIsEditing(false);
    resetForm();
    modal.current.showModal();
  };

  const closeModal = () => {
    const dialog = modal.current
    dialog.classList.add('closing')
    dialog.addEventListener('animationend', () => {
      dialog.classList.remove('closing')
      dialog.close()
    }, { once: true })
    resetForm();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorClass('fade-in');
      setTimeout(() => {
        setErrorClass('fade-out');
        setTimeout(() => {
          setErrorMessage('');
          setErrorClass('');
        }, 1000);
      }, 4000);
    }, 0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {

      const existingProduct = products.some((item) => 
        (!isEditing || item.id !== editingId) && item.name.toLowerCase() === formData.name.toLowerCase()
      )

      if (existingProduct) {
        showError('Já existe um produto com esse nome.');
        return
      }

      const formattedData = {
        ...formData,
        price: formData.price.replace(',', '').replace(',', '.'),
      };

      const url = isEditing 
      ? `http://https://cadastro-de-produtos-backend.onrender.com/:3001/products/${editingId}` 
      : 'http://https://cadastro-de-produtos-backend.onrender.com/:3001/products';

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
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
    setProductToDelete(id);
    deleteModal.current.showModal();
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://https://cadastro-de-produtos-backend.onrender.com/:3001/products/${productToDelete}`, {
        method: 'DELETE',
      });

      if(response.ok) {
        fetchProducts();
        closeDeleteModal();
        setProductToDelete(null);
      }
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  }

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

  const handlePriceChange = (event) => {
    let value = event.target.value;

    value = value.replace(/\D/g, '');
    value = (parseInt(value) / 100).toFixed(2);
    value = Number(value).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    setFormData(prev => ({ ...prev, price: value }));
  }

  const showDescription = (product) => {
    setSelectedProduct(product);
    descriptionModal.current.showModal();
  }

  const closeDeleteModal = () => {
    deleteModal.current.close();
    setProductToDelete(null);
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
              <MdOutlineDescription onClick={() => showDescription(product)} className="info-btn"/>
              <MdOutlineEdit onClick={() => handleEdit(product)} className='edit-btn'/>
              <MdOutlineDelete onClick={() => handleDelete(product.id)} className='delete-btn'/>
            </div>
          </li>
        ))}
      </ul>

      <div className="new-product-btn">
        <button onClick={showModal}>
          Cadastrar Novo Produto
        </button>
      </div>

        <dialog ref={modal}>
          <h2>{isEditing ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h2>
          <form id="product-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Nome do Produto:</label>
              <input
                type="text"
                id="name"
                placeholder="Produto"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="description">Descrição do Produto:</label>
              <textarea
                id="description"
                placeholder="Descrição"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="price">Valor do Produto:</label>
              <input
                type="text"
                id="price"
                placeholder="R$ 0,00"
                value={formData.price}
                onChange={handlePriceChange}
                required
              />
            </div>
            <div className="availability-buttons">
              <label>Disponível para Venda:</label>
              <div className="button-group">
                <button type="button"
                  className={`available-btn ${formData.available ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, available: true })}>
                  Sim
                </button>
                <button type="button"
                  className={`unavailable-btn ${!formData.available ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, available: false })}>
                  Não
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className={`error-message ${errorClass}`}>{errorMessage}</div>
            )}
            
            <div className="confirm-register">
            <button type="submit">{isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}</button>
            <button type="button" onClick={closeModal}>Cancelar</button>
            </div>
          </form>
        </dialog>

        <dialog ref={descriptionModal} className='description-modal'>
          {selectedProduct && (
            <>
              <h2>{selectedProduct.name}</h2>
                <div className="description">
                  <p>Descrição:</p>
                  <p className='prod-description'>{selectedProduct.description}</p>
                </div>

              <div className="footer-description">
                <p className="price">Valor: {formatPrice(selectedProduct.price)}</p>
                <p className={`status ${selectedProduct.available ? 'available' : 'unavailable'}`}>
                  {selectedProduct.available ? 'Disponível' : 'Indisponível'}
                </p>
              </div>

              <button onClick={() => descriptionModal.current.close()}>Fechar</button>
            </>
          )}
        </dialog>

        <dialog ref={deleteModal} className='delete-modal'>
          <h2>Excluir Produto</h2>
          <p>Tem certeza que deseja excluir este produto?</p>
          <div className="delete-buttons">
            <button onClick={confirmDelete}>Sim</button>
            <button onClick={closeDeleteModal}>Cancelar</button>
          </div>
        </dialog>
    </div>
  );
};

export default App;

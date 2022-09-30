import React, { useEffect, useState } from 'react';
import { addToDb, getStoredCart } from '../../utilities/fakedb';
import Cart from '../../Cart/Cart';
import Product from '../../Product/Product';
import './Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    useEffect(() =>{
      // console.log('product load before fetch')
        fetch('products.json')
        .then(res=> res.json())
        // .then(data => console.log(data))
        .then(data => {
          setProducts(data)
          // console.log('product loaded')
        })
    }, []);
   
    //page load korle ager kono story ase kina dhekbe.
     useEffect(() =>{
      // console.log('local storage first line')
      const storedCart = getStoredCart();
      // console.log(storedCart)
      const savedCart = [];
      for(const id in storedCart){
        // console.log(id);
        const addedProduct = products.find(product => product.id === id);
        // console.log(addedProduct);
        if(addedProduct){
          // console.log(addedProduct);
          const quantity = storedCart[id];
          addedProduct.quantity = quantity;
          savedCart.push(addedProduct);
        }
      }
      setCart(savedCart);
     }, [products])


    const handleAddToCart= (selectedProduct) =>{
        // console.log(product);
        // console.log(selectedProduct);
        let newCart = [];
        const exists = cart.find(product => product.id === selectedProduct.id);
        if(!exists){
          selectedProduct.quantity = 1;
          newCart = [...cart, selectedProduct];
        }
        else{
          const rest = cart.filter(product => product.id !== selectedProduct.id);
          exists.quantity = exists.quantity + 1;
          newCart =[...rest, exists];
        }
        // const newCart = [...cart, product];
        setCart(newCart);
        addToDb(selectedProduct.id)
    }
    return (
        <div className='shop-container'>
          <div className="products-container">
             {/* <h3>This is for Products: {products.length}</h3> */}
             {
                products.map(product=><Product 
                    key={product.id}
                    product={product} handleAddToCart={handleAddToCart}
                    ></Product>)
             }
            </div> 
          <div className="cart-container">
            <Cart cart={cart}></Cart>
          </div>
        </div>

    );
};

export default Shop;
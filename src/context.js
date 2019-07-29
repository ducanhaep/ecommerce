import React, { Component } from "react";
import { storeProducts, detailProduct } from "./data";
const ProductContext = React.createContext();

class ProductProvider extends Component {
  constructor() {
    super();
    this.state = {
      products: [],
      detailProduct: detailProduct,
      cart: [],
      modalOpen: false,
      modalProduct: detailProduct,
      cartSubTotal: 0,
      cartTax: 0,
      cartTotal: 0
    };
  }

  setProducts = () => {
    let products = [];
    storeProducts.forEach(item => {
      const singleItem = { ...item };
      products = [...products, singleItem];
    });
    this.setState({ products });
  };

  componentDidMount() {
    this.setProducts();
  }

  getItem = id => {
    const product = this.state.products.find(item => item.id === id);
    return product;
  };

  handleDetail = id => {
    const product = this.getItem(id);
    this.setState(() => {
      return { detailProduct: product };
    });
  };

  addToCart = id => {
    let tempProducts = [...this.state.products];
    const index = tempProducts.indexOf(this.getItem(id));
    const product = { ...tempProducts[index] };
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;
    tempProducts[index] = product;
    this.setState(prevState => {
      return {
        products: tempProducts,
        detailProduct: product,
        cart: [...this.state.cart, product],
        cartSubTotal: prevState.cartSubTotal + product.total,
        cartTax: prevState.cartTax + product.total * 0.1,
        cartTotal: prevState.cartTotal + product.total + product.total * 0.1
      };
    });
  };

  openModal = id => {
    const product = this.getItem(id);
    this.setState(() => ({ modalProduct: product, modalOpen: true }));
  };

  closeModal = () => {
    this.setState(() => ({ modalOpen: false }));
  };

  increment = id => {
    let tempCart = [...this.state.cart];
    const index = tempCart.indexOf(this.getItem(id));
    const product = { ...tempCart[index] };
    product.count++;
    const total = product.price * product.count;
    product.total = total;
    tempCart[index] = product;
    this.setState(
      prevState => {
        return {
          cart: tempCart,
          cartSubTotal: (prevState.cartSubTotal += product.total),
          cartTax: this.state.cartSubTotal * 0.1,
          cartTotal: this.cartSubTotal + this.state.cartTax
        };
      },
      () => console.log(this.state)
    );
  };

  decrement = id => {
    console.log("decrement");
  };

  removeItem = id => {
    console.log("remove item");
  };

  clearCart = () => {
    console.log("clear cart");
  };
  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handleDetail: this.handleDetail,
          addToCart: this.addToCart,
          openModal: this.openModal,
          closeModal: this.closeModal,
          increment: this.increment,
          decrement: this.decrement,
          removeItem: this.removeItem,
          clearCart: this.clearCart
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };

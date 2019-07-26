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
      modalOpen: true
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
    this.setState(() => {
      return {
        products: tempProducts,
        detailProduct: product,
        cart: [...this.state.cart, product]
      };
    });
  };

  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handleDetail: this.handleDetail,
          addToCart: this.addToCart
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };

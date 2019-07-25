import React, { Component } from "react";
import { storeProducts, detailProduct } from "./data";
const ProductContext = React.createContext();

class ProductProvider extends Component {
  constructor() {
    super();
    this.state = {
      products: [],
      detailProduct: detailProduct
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

  handleDetail = () => {
    console.log("hello from detaill");
  };

  addToCart = id => {
    console.log(`hello from add to cart id is ${id}`);
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

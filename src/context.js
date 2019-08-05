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

  UNSAFE_componentWillMount() {
    let detailProduct = JSON.parse(localStorage.getItem("detailProduct"));
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (cart === null) {
      cart = [];
    }
    let cartSubTotal = JSON.parse(localStorage.getItem("cartSubTotal"));
    let cartTax = JSON.parse(localStorage.getItem("cartTax"));
    let cartTotal = JSON.parse(localStorage.getItem("cartTotal"));
    this.setState({
      detailProduct,
      cart,
      cartSubTotal,
      cartTax,
      cartTotal
    });
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
    localStorage.setItem("detailProduct", JSON.stringify(product));
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
    this.setState(
      () => {
        return {
          products: tempProducts,
          detailProduct: product,
          cart: [...this.state.cart, product]
        };
      },
      () => {
        this.addTotals();
        localStorage.setItem("cart", JSON.stringify(this.state.cart));
      }
    );
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
    const selectedProduct = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    const product = { ...tempCart[index] };
    product.count = product.count + 1;
    product.total = product.count * product.price;
    tempCart[index] = product;
    this.setState(
      () => {
        return { cart: tempCart };
      },
      () => {
        this.addTotals();
      }
    );
  };

  decrement = id => {
    let tempCart = [...this.state.cart];
    const selectedProduct = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    const product = { ...tempCart[index] };
    product.count = product.count - 1;
    if (product.count === 0) {
      this.removeItem(id);
    } else {
      product.total = product.count * product.price;
      tempCart[index] = product;
      this.setState(
        () => {
          return { cart: tempCart };
        },
        () => {
          this.addTotals();
        }
      );
    }
  };

  removeItem = id => {
    let tempProducts = [...this.state.products];
    let tempCart = [...this.state.cart];
    tempCart = [...tempCart.filter(item => item.id !== id)];
    const index = tempProducts.indexOf(this.getItem(id));
    let removedProduct = { ...tempProducts[index] };
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;
    tempProducts[index] = removedProduct;
    this.setState(
      () => {
        return { products: tempProducts, cart: tempCart };
      },
      () => {
        this.addTotals();
      }
    );
  };

  clearCart = () => {
    this.setState(
      () => {
        return { cart: [] };
      },
      () => {
        this.setProducts();
        this.addTotals();
      }
    );
  };

  addTotals = () => {
    let subTotal = 0;
    this.state.cart.map(item => (subTotal += item.total));
    const tempTax = subTotal * 0.1;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;
    this.setState(
      () => {
        return {
          cartSubTotal: subTotal,
          cartTax: tax,
          cartTotal: total
        };
      },
      () => {
        localStorage.setItem("cartSubTotal", this.state.cartSubTotal);
        localStorage.setItem("cartTax", this.state.cartTax);
        localStorage.setItem("cartTotal", this.state.cartTotal);
      }
    );
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

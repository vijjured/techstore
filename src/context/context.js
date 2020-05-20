import React, { Component } from "react";
import { LinkData } from "./LinkData";
import { socialData } from "./socialData";
import { items } from "./productData";
const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    sidebarOpen: false,
    cartOpen: false,
    cartItems: 0,
    links: LinkData,
    cart: [],
    socialLinks: socialData,
    cartTax: 0,
    cartTotal: 0,
    cartSubTotal: 0,
    storeProducts: [],
    filteredProducts: [],
    featuredProducts: [],
    singleProduct: {},
    loading: false,
  };

  componentDidMount() {
    this.setProducts(items);
  }

  clearCart = () => {
    this.setState(
      {
        cart: [],
        cartItems: 0,
        cartTax: 0,
        cartTotal: 0,
        cartSubTotal: 0,
      },
      () => {
        localStorage.removeItem("cart");
      }
    );
  };

  setProducts = (data) => {
    let storeProducts = data.map((item) => {
      const { id } = item.sys;
      const image = item.fields.image.fields.file.url;
      const product = { id, ...item.fields, image };
      return product;
    });

    let featuredProducts = storeProducts.filter(
      (product) => product.featured === true
    );

    this.setState(
      {
        storeProducts,
        filteredProducts: storeProducts,
        featuredProducts,
        cart: this.getStorageCart(),
        singleProduct: this.getStorageProduct(),
        loading: false,
      },
      () => {
        this.addTotals();
      }
    );
  };

  getStorageCart = () => {
    let cart;
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
      return cart;
    }
    return [];
  };

  getStorageProduct = () => {
    return localStorage.getItem("single")
      ? JSON.parse(localStorage.getItem("single"))
      : [];
  };

  getTotals = () => {
    let subTotal = 0;
    let cartItems = 0;
    this.state.cart.forEach((item) => {
      subTotal += item.total;
      cartItems += item.count;
    });
    subTotal = parseFloat(subTotal.toFixed(2));
    let tax = subTotal * 0.775;
    tax = parseFloat(tax.toFixed(2));
    let total = subTotal + tax;
    total = parseFloat(total.toFixed(2));
    return {
      cartItems,
      subTotal,
      tax,
      total,
    };
  };

  addTotals = () => {
    const totals = this.getTotals();
    this.setState({
      cartItems: totals.cartItems,
      cartSubTotal: totals.subTotal,
      cartTax: totals.tax,
      cartTotal: totals.total,
    });
  };

  syncStorage = () => {
    localStorage.setItem("cart", JSON.stringify(this.state.cart));
  };

  addToCart = (id, type) => {
    let tempCart = [...this.state.cart];
    let tempProducts = [...this.state.storeProducts];
    let tempItem = tempCart.find((item) => item.id === id);
    if (!type) {
      if (!tempItem) {
        tempItem = tempProducts.find((item) => item.id === id);
        let total = tempItem.price;
        let cartItem = { ...tempItem, count: 1, total };
        tempCart = [...tempCart, cartItem];
      } else {
        tempItem.count++;
        tempItem.total = tempItem.price * tempItem.count;
        tempItem.total = parseFloat(tempItem.total.toFixed(2));
      }
    } else {
      this.updateCartQuantity(tempItem, type);
    }
    this.setState(
      () => {
        return { cart: tempCart };
      },
      () => {
        this.addTotals();
        this.syncStorage();
        if (!type) {
          this.openCart();
        }
      }
    );
  };
  updateCartQuantity = (cartItem, type) => {
    if (type === "minus") {
      if (cartItem.count === 1) {
        this.deleteItemFromCart(cartItem.id);
      } else {
        cartItem.count--;
      }
    } else if (type == "plus") {
      cartItem.count++;
    }
    cartItem.total = cartItem.count * cartItem.price;
  };

  setSingleProduct = (id) => {
    let product = this.state.storeProducts.find((item) => item.id === id);
    localStorage.setItem("single", JSON.stringify(product));
    this.setState({
      singleProduct: { ...product },
      loading: false,
    });
  };

  handleSideBar = () => {
    this.setState({ sidebarOpen: !this.state.sidebarOpen });
  };

  handleCartBar = () => {
    this.setState({ cartOpen: !this.state.cartOpen });
  };

  closeCart = () => {
    this.setState({ cartOpen: false });
  };

  openCart = () => {
    this.setState({ cartOpen: true });
  };

  deleteItemFromCart = (id) => {
    let tempCart = [...this.state.cart];
    tempCart = tempCart.filter((item) => item.id !== id);
    setTimeout(
      () =>
        this.setState(
          (prevState) => {
            return { ...prevState, cart: tempCart };
          },
          () => {
            this.addTotals();
            this.syncStorage();
          }
        ),
      0
    );
  };
  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handleCartBar: this.handleCartBar,
          handleSideBar: this.handleSideBar,
          closeCart: this.closeCart,
          openCart: this.openCart,
          addToCart: this.addToCart,
          setSingleProduct: this.setSingleProduct,
          deleteItemFromCart: this.deleteItemFromCart,
          clearCart: this.clearCart,
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };

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
    searchTerm: "",
    companyType: "all",
    maxPrice: 0,
    minPrice: 0,
    filterPrice: 0,
    shipping: false,
    functionCall: 0,
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
    let maxPrice = Math.max(...storeProducts.map((item) => item.price));
    let minPrice = Math.min(...storeProducts.map((item) => item.price));

    let featuredProducts = storeProducts.filter(
      (product) => product.featured === true
    );

    this.setState(
      {
        storeProducts,
        maxPrice,
        filterPrice: maxPrice,
        minPrice,
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

  filterProducts = () => {
    const {
      searchTerm,
      storeProducts,
      companyType,
      filterPrice,
      shipping,
    } = this.state;
    let filteredProducts = storeProducts.filter((product) =>
      product.title.includes(searchTerm)
    );
    if (companyType !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.company === companyType
      );
    }

    filteredProducts = filteredProducts.filter(
      (product) => product.price <= filterPrice
    );

    if (shipping) {
      filteredProducts = filteredProducts.filter((product) => {
        return product.shipping === shipping;
      });
    }

    this.setState({ filteredProducts });
  };

  handleChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = event.target.name;
    this.setState({ [name]: value });
  };

  buildFilterQuery = () => {
    const { searchTerm, companyType, filterPrice, shipping } = this.state;
    const params = new URLSearchParams({
      searchTerm,
      companyType,
      filterPrice,
      shipping,
    });
    let url = `${window.location.origin}/products?${params.toString()}`;
    window.history.pushState({ path: url }, "", url);
    this.filterProducts();
  };

  handleFilterQuery = (obj) => {
    const { searchterm, filterprice, shipping, companytype } = obj;
    if (searchterm !== this.state.searchTerm)
      this.setState(
        {
          searchTerm: searchterm,
          filterPrice: filterprice,
          shipping: JSON.parse(shipping),
          companyType: companytype,
          functionCall: 1,
        },
        () => {
          this.filterProducts();
        }
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
          handleChange: this.handleChange,
          buildFilterQuery: this.buildFilterQuery,
          handleFilterQuery: this.handleFilterQuery,
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };

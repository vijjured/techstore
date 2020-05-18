import React, { Component } from "react";
import { LinkData } from "./LinkData";
import { socialData } from "./socialData";
const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    sidebarOpen: false,
    cartOpen: false,
    cartItems: 0,
    links: LinkData,
    cart: [],
    socialLinks: socialData,
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
  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handleCartBar: this.handleCartBar,
          handleSideBar: this.handleSideBar,
          closeCart: this.closeCart,
          openCart: this.openCart,
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };

import React from "react";
import { ProductConsumer } from "../../context/context";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
export default function CartList() {
  return (
    <ProductConsumer>
      {(value) => {
        const {
          cart,
          addToCart,
          deleteItemFromCart,
          clearCart,
          cartTax,
          cartTotal,
          cartSubTotal,
        } = value;
        return (
          <>
            {cart.length > 0 ? (
              <div>
                <ul className="cartItemsList">
                  {cart.map((item) => {
                    return (
                      <li key={item.id}>
                        <div className="row mt-5 mt-lg-0 text-capitalize text-center align-items-center">
                          <div className="col-10 mx-auto col-lg-2 pb-2">
                            <img
                              src={item.image}
                              width="55"
                              alt="cart Item"
                              className="img-fluid"
                            />
                          </div>
                          <div className="col-10 mx-auto col-lg-2 pb-2">
                            <span className="d-lg-none">title :</span>$
                            {item.title}
                          </div>
                          <div className="col-10 mx-auto col-lg-2 pb-2">
                            <span className="d-lg-none">price :</span>$
                            {item.price}
                          </div>
                          <div className="col-10 mx-auto col-lg-2 my-2 my-lg-0">
                            <div className="d-flex justify-content-center">
                              <div>
                                <FiMinusCircle
                                  className="cart-icon text-primary"
                                  onClick={() => addToCart(item.id, "minus")}
                                />
                                <span className="text-title text-muted mx-3">
                                  {item.count}
                                </span>
                                <FiPlusCircle
                                  className="cart-icon text-primary"
                                  onClick={() => addToCart(item.id, "plus")}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-10 mx-auto col-lg-2">
                            <MdDelete
                              className="text-danger cart-icon"
                              onClick={() => deleteItemFromCart(item.id)}
                            />
                          </div>
                          <div className="col-10 mx-auto col-lg-2 pb-2">
                            <span className="d-lg-none">price :</span>$
                            {item.total}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="container">
                  <div className="row">
                    <div className="col text-title text-center my-4">
                      <button
                        type="button"
                        className="btn btn-outline-danger text-capitalize mb-4"
                        style={{ margin: "0.75rem" }}
                        onClick={() => clearCart()}
                      >
                        clear cart
                      </button>
                      <h3>subtotal : ${cartSubTotal}</h3>
                      <p>tax : ${cartTax}</p>
                      <p>total : ${cartTotal}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <h3 className="text-center">There are No Items in the cart</h3>
            )}
          </>
        );
      }}
    </ProductConsumer>
  );
}

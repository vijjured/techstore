import React from "react";
import CartList from "./CartList";
import CartSection from "./CartSection";
import Title from "../../components/AboutPageComponents/Title";
import CartColumns from "./CartColumns";
export default function CartItems() {
  return (
    <>
      <CartSection />
      <section className="py-5">
        <div className="container">
          <Title title="your cart items" center />
        </div>
        <CartColumns />
        <CartList />
      </section>
    </>
  );
}

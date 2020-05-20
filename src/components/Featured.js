import React from "react";
import Product from "./Product";
import { Link } from "react-router-dom";
import Title from "./AboutPageComponents/Title";
import { ProductConsumer } from "../context/context";
export default function Featured() {
  return (
    <section className="py-5">
      <div className="container">
        <Title title="featured products" center="true" />
        <div className="row">
          <ProductConsumer>
            {(value) => {
              const { featuredProducts } = value;
              return featuredProducts.map((product) => {
                return <Product key={product.id} product={product}></Product>;
              });
            }}
          </ProductConsumer>
        </div>
        <div className="row mt-5">
          <div className="col text-center">
            <Link to="/products" className="main-link">
              our products
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

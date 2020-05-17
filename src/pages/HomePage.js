import React from "react";
import { ProductConsumer } from "../context/context";

export default function HomePage() {
  return (
    <React.Fragment>
      <ProductConsumer>
        {(value) => {
          return <h1>test</h1>;
        }}
      </ProductConsumer>
    </React.Fragment>
  );
}

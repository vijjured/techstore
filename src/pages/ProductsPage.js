import React from "react";
import Products from "../components/ProductsPageComponent/Products";
import Hero from "../components/Hero";
import productsBcg from "../images/storeBcg.jpeg";
import { ProductConsumer } from "../context/context";
import getAllUrlParams from "../context/utils";
export default function ProductsPage({ location }) {
  const query = location.search;
  return (
    <React.Fragment>
      <ProductConsumer>
        {(value) => {
          const paramsObject = getAllUrlParams(query);
          let { functionCall } = value;
          if (query.includes("searchTerm") && functionCall === 0) {
            const { handleFilterQuery } = value;
            handleFilterQuery(paramsObject);
          }
          return (
            <Hero img={productsBcg}>
              <Products />
            </Hero>
          );
        }}
      </ProductConsumer>
    </React.Fragment>
  );
}

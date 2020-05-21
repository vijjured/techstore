import React from "react";
import { ProductConsumer } from "../context/context";
export default function FilterComponent() {
  return (
    <ProductConsumer>
      {(value) => {
        const {
          searchTerm,
          companyType,
          maxPrice,
          minPrice,
          filterPrice,
          shipping,
          storeProducts,
          handleChange,
        } = value;

        const companyTypes = storeProducts.map((product) => product.company);
        const filteredCompanytypes = companyTypes.reduce((acc, item) => {
          if (!acc.includes(item)) {
            acc.push(item);
          }
          return acc;
        }, []);
        let types = ["all", ...filteredCompanytypes];
        types = types.map((type, index) => {
          return (
            <option value={type} key={index}>
              {type}
            </option>
          );
        });

        return (
          <section className="filter-container">
            <form className="filter-form">
              <div className="form-group">
                <label htmlFor="searchTerm">Search Products</label>
                <input
                  type="text"
                  name="searchTerm"
                  id="price"
                  value={searchTerm}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="companyType">Company</label>
                <select
                  name="companyType"
                  id="type"
                  value={companyType}
                  className="form-control"
                  onChange={handleChange}
                >
                  {types}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="filterPrice">
                  product price $ {filterPrice}
                </label>
                <input
                  type="range"
                  name="filterPrice"
                  min={minPrice}
                  max={maxPrice}
                  id="price"
                  value={filterPrice}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <div className="single-extra">
                  <input
                    type="checkbox"
                    name="shipping"
                    id="shipping"
                    checked={shipping}
                    onChange={handleChange}
                  />
                  <label htmlFor="shipping">Free Shipping</label>
                </div>
              </div>
            </form>
          </section>
        );
      }}
    </ProductConsumer>
  );
}

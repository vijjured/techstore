import React from "react";
import Title from "../AboutPageComponents/Title";
export default function Contact() {
  return (
    <section className="py-5">
      <div className="row">
        <div className="col-10 mx-auto col-md-6 my-3">
          <Title title="contact us" />
          <form
            action="https://formspree.io/vbr0856@gmail.com"
            method="POST"
            className="mt-5"
          >
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                name="firstName"
                placeholder="vijay"
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="vijay@gmail.com"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                name="subject"
                placeholder="vijay's subject"
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                id=""
                cols="30"
                rows="10"
                className="form-control"
                placeholder="Hello Vijay"
              ></textarea>
            </div>
            <div className="form-group mt-3">
              <input
                type="submit"
                value="Send"
                className="form-control bg-primary text-white"
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

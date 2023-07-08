import React from 'react';

function Footer() {
  return (
    <div className="container-fluid bg-secondary">
      <footer className="container py-5">
        <div className="row">
          <div className="col-2">
            <h5 className="text-white">Section</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <a href="#" className="nav-link p-0 text-white">Home</a>
              </li>
              <li className="nav-item mb-2">
                <a href="#" className="nav-link p-0 text-white">About Us</a>
              </li>
              <li className="nav-item mb-2">
                <a href="#" className="nav-link p-0 text-white">Categories</a>
              </li>
              <li className="nav-item mb-2">
                <a href="#" className="nav-link p-0 text-white">Contact Us</a>
              </li>
            </ul>
          </div>

          <div className="col-2">
            <h5 className="text-white">Contact</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <a href="tel:1234567890" className="nav-link p-0 text-white">Phone: 1234567890</a>
              </li>
              <li className="nav-item mb-2">
                <a href="mailto:info@example.com" className="nav-link p-0 text-white">Email: info@example.com</a>
              </li>
              <li className="nav-item mb-2">
                <span className="nav-link p-0 text-white">Address: 123 Street, City, Country</span>
              </li>
            </ul>
          </div>

          <div className="col-4 offset-4">
            <form>
              <h5 className="text-white">Subscribe to our newsletter</h5>
              <p className="text-white">Monthly digest of what's new and exciting from us.</p>
              <div className="d-flex w-100 gap-2">
                <label htmlFor="newsletter1" className="visually-hidden">Email address</label>
                <input id="newsletter1" type="text" className="form-control" placeholder="Email address" />
                <button className="btn btn-primary" type="button">Subscribe</button>
              </div>
            </form>
          </div>
        </div>

        <div className="d-flex justify-content-between py-4 my-4 border-top">
          <p className="text-white">© 2021 Company, Inc. All rights reserved.</p>
          <ul className="list-unstyled d-flex">
            <li className="ms-3">
              <a className="link-white" href="#">
                <svg className="bi" width="24" height="24">
                  <use xlinkHref="#twitter"></use>
                </svg>
              </a>
            </li>
            <li className="ms-3">
              <a className="link-white" href="#">
                <svg className="bi" width="24" height="24">
                  <use xlinkHref="#instagram"></use>
                </svg>
              </a>
            </li>
            <li className="ms-3">
              <a className="link-white" href="#">
                <svg className="bi" width="24" height="24">
                  <use xlinkHref="#facebook"></use>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default Footer;

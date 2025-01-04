// src/pages/Dashboard.js
import React from "react";
import { useHistory } from "react-router-dom";
import "./style/Dashboard.css";

const Dashboard = () => {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/login");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <nav
          id="sidebarMenu"
          className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
        >
          <div className="position-sticky">
            <div className="list-group list-group-flush">
              <a
                href="#"
                className="list-group-item list-group-item-action bg-light"
              >
                Dashboard
              </a>
              <a href="#" className="list-group-item list-group-item-action">
                Pharmacy Inventory
              </a>
              <a href="#" className="list-group-item list-group-item-action">
                Orders
              </a>
              <a href="#" className="list-group-item list-group-item-action">
                Customers
              </a>
              <a href="#" className="list-group-item list-group-item-action">
                Appointments
              </a>
              <a href="#" className="list-group-item list-group-item-action">
                Services
              </a>
              <a href="#" className="list-group-item list-group-item-action">
                Staff
              </a>
              <button
                onClick={handleLogout}
                className="list-group-item list-group-item-action text-danger"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Pharmacy & Spa Dashboard</h1>
          </div>

          <div className="row row-cols-1 row-cols-md-2 g-4">
            <div className="col">
              <div className="card bg-primary-custom text-white card-custom">
                <div className="card-body">
                  <h5 className="card-title">Inventory Status</h5>
                  <p className="card-text">Total Products: 500</p>
                  <a href="#" className="btn btn-outline-light">
                    View Inventory
                  </a>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card bg-info-custom text-white card-custom">
                <div className="card-body">
                  <h5 className="card-title">Upcoming Appointments</h5>
                  <p className="card-text">Today: 10 appointments</p>
                  <a href="#" className="btn btn-outline-light">
                    View Appointments
                  </a>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card bg-success text-white card-custom">
                <div className="card-body">
                  <h5 className="card-title">Recent Orders</h5>
                  <p className="card-text">Last 24 hours: 20 orders</p>
                  <a href="#" className="btn btn-outline-light">
                    View Orders
                  </a>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card bg-warning text-dark card-custom">
                <div className="card-body">
                  <h5 className="card-title">Top Services</h5>
                  <p className="card-text">Most popular services</p>
                  <a href="#" className="btn btn-outline-dark">
                    View Services
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

import React from "react";

const Profile = () => {
  return (
    <div className="main-content" style={{marginLeft: '30px', lineHeight:'1', width:'95%'}}>
      <div className="container py-4">
        <h3 className="fw-bold mb-4">Profile</h3>
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="text-center mb-4">
                  <img
                    src="/maria.jpg"
                    alt="Profile"
                    className="rounded-circle mb-3"
                    style={{ width: "120px", height: "120px", objectFit: "cover" }}
                  />
                  <h4>Maria D Souza</h4>
                  <p className="text-muted">HR Manager</p>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Email</label>
                    <p>maria.dsouza@company.com</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Phone</label>
                    <p>+1 (555) 123-4567</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Department</label>
                    <p>Human Resources</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Employee ID</label>
                    <p>HR001</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Join Date</label>
                    <p>January 15, 2020</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Location</label>
                    <p>New York, NY</p>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <button className="btn btn-primary me-2">Edit Profile</button>
                  <button className="btn btn-outline-secondary">Change Password</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

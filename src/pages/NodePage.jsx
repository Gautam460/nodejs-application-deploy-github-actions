import React from 'react';

const NodePage = () => {
  return (
    <div className="container my-3 py-3">
      <h1 className="text-center">Node Page</h1>
      <hr />
      <div className="row my-4 h-100">
        <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <div className="card text-center">
                <div className="card-body">
                    <h5 className="card-title">Node Content</h5>
                    <p className="card-text">This is the Node page content.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NodePage;

import React from 'react';
import 'mdb-ui-kit/css/mdb.min.css';
import {MDBBtn, MDBInput} from "mdb-react-ui-kit";


function Registration() {
    return (<div>
        <section className="text-center text-lg-start">
            <div className="container d-flex justify-content-center mt-5 py-4">
                    <div className="col-lg-6 mb-5 mb-lg-0">
                        <div className="card cascading-right bg-body-tertiary" style={{ backdropFilter: 'blur(30px)' }}>
                            <div className="card-body p-5 shadow-5 text-center">
                                <h2 className="fw-bold mb-5">Sign up now</h2>
                                <div className="card-body p-4 p-lg-5 text-black">
                                    <form
                                        // onSubmit={handleSubmit}
                                    >
                                        <div className="d-flex gap-3 align-items-center mb-3 pb-1">
                                            <div className="pl-2">
                                                <img src="" alt=""/>
                                            </div>
                                            <span className="h1 fw-bold ml-3">MyApp</span>
                                        </div>
                                        <div className="form-outline mb-4">
                                            <MDBInput
                                                type="text"
                                                label='Name'
                                                className="form-control form-control-lg"
                                                // onChange={(event) => handleFormChange(event, 'confirmPassword')}
                                            />
                                        </div>
                                        <div className="form-outline mb-4">
                                            <MDBInput
                                                type="email"
                                                className="form-control form-control-lg"
                                                label='Email address'
                                                // onChange={(event) => handleFormChange(event, 'email')}
                                            />
                                        </div>
                                        <div className="form-outline mb-4">
                                            <MDBInput
                                                type="password"
                                                label='Password'
                                                className="form-control form-control-lg"
                                                // onChange={(event) => handleFormChange(event, 'password')}
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </section>
    </div>);
}

export default Registration;
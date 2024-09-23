import React from 'react';
import 'mdb-ui-kit/css/mdb.min.css';
import {MDBBtn, MDBInput} from "mdb-react-ui-kit";
import {useNavigate} from "react-router-dom";


function Registration() {

    const navigate = useNavigate();

    const [user, setUser] = React.useState([]);

    const handleFormChange = (field, value)=> {
        setUser((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    }

    const handleSubmit = async (e) => {
            e.preventDefault();
        console.log('Sending data:', JSON.stringify(user));
            try {
                const response = await fetch('api/register', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user)
                });
                const data = await response.json();
                if (response.ok) {
                    console.log('success:' + data.message);
                    navigate('/users');
                } else {
                    console.log('error: ' + data.error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
    };

    return (<div>
        <section className="text-center text-lg-start">
            <div className="container d-flex justify-content-center mt-5 py-4">
                    <div className="col-lg-6 mb-5 mb-lg-0">
                        <div className="card cascading-right bg-body-tertiary" style={{ backdropFilter: 'blur(30px)' }}>
                            <div className="card-body p-5 shadow-5 text-center">
                                <h2 className="fw-bold mb-5">Registration</h2>
                                <div className="card-body p-4 p-lg-5 text-black">
                                    <form
                                        onSubmit={handleSubmit}
                                    >
                                        <div className="d-flex gap-3 align-items-center justify-content-center mb-3 pb-1">
                                            <div className="pl-2">
                                                <img src="" alt=""/>
                                            </div>
                                            <span className="h1 fw-bold ml-3">MyApp</span>
                                        </div>
                                        <div className="form-outline mb-4">
                                            <MDBInput
                                                type="text"
                                                label='First Name'
                                                className="form-control form-control-lg"
                                                onChange={(event) => handleFormChange('firstName',event.target.value)}
                                            />
                                        </div>
                                        <div className="form-outline mb-4">
                                            <MDBInput
                                                type="text"
                                                label='Last Name'
                                                className="form-control form-control-lg"
                                                onChange={(event) => handleFormChange('lastName',event.target.value)}
                                            />
                                        </div>
                                        <div className="form-outline mb-4">
                                            <MDBInput
                                                type="email"
                                                className="form-control form-control-lg"
                                                label='Email address'
                                                onChange={(event) => handleFormChange('email',event.target.value)}
                                            />
                                        </div>
                                        <div className="form-outline mb-4">
                                            <MDBInput
                                                type="password"
                                                label='Password'
                                                className="form-control form-control-lg"
                                                onChange={(event) => handleFormChange('password',event.target.value)}
                                            />
                                        </div>
                                        <div className="pt-1 mb-4">
                                            <MDBBtn type='submit'
                                                    className="btn btn-dark btn-lg btn-block">
                                                Register
                                            </MDBBtn>
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
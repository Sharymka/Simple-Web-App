import React, {useState} from 'react';
import 'mdb-ui-kit/css/mdb.min.css';
import {MDBBtn, MDBInput} from "mdb-react-ui-kit";
import {Link, useNavigate} from "react-router-dom";



function Login() {

  const navigate = useNavigate();
  const [user, setUser] = React.useState({
    email: 's@gmail.com', password: "1"
  });
  const [message, setMessage] = useState('');

  const handleFormChange = (field, value)=> {
    setUser((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();

      if (response.ok) {
        console.log('User authorized:', data);
        setMessage(data);
        navigate('/users');
      } else {
        console.error('Failed to fetch user data:', data.error);
        setMessage (data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (<div>
    <section className="text-center text-lg-start">
      <div className="container py-4">
        <div className="row g-0 align-items-center">
          <div className="col-lg-6 mb-5 mb-lg-0">
            <div className="card cascading-right bg-body-tertiary" style={{ backdropFilter: 'blur(30px)' }}>
              <div className="card-body p-5 shadow-5 text-center">
                <h2 className="fw-bold mb-5">Sign up now</h2>
                <div className="card-body p-4 p-lg-5 text-black">
                  <form
                      onSubmit={handleSubmit}
                  >
                    <div className="d-flex gap-3 align-items-center justify-content-center mb-3 pb-1">
                      <div className="pl-2">
                        <img src="img/wallet.svg" alt=""/>
                      </div>
                      <span className="h1 fw-bold ml-3">MyApp</span>
                    </div>
                    <div className="form-outline mb-4">
                      <MDBInput
                          type="email"
                          className="form-control form-control-lg"
                          label='Email address'
                          value='s@gmail.com'
                          onChange={(event) => handleFormChange('email',event.target.value)}
                      />
                    </div>
                    <div className="form-outline mb-4">
                      <MDBInput
                          type="password"
                          label='Password'
                          className="form-control form-control-lg"
                          value='1'
                          onChange={(event) => handleFormChange('password',event.target.value)}
                      />
                    </div>
                    <div className="pt-1 mb-4">
                      <MDBBtn  type='submit' className="btn btn-dark btn-lg btn-block">
                        SignUp
                      </MDBBtn>
                    </div>
                    <div className="pt-1 mb-4">
                      <Link tag={Link} to="/registration" className="link-dark link-underline-dark">
                        register
                      </Link>
                    </div>
                    {message && (
                        <div className="alert alert-danger mt-3" role="alert">
                          {message}
                        </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mb-5 mb-lg-0">
            <img src="https://mdbootstrap.com/img/new/ecommerce/vertical/004.jpg" className="w-100 rounded-4 shadow-4"
                 alt=""/>
          </div>
        </div>
      </div>
    </section>
  </div>);
}

export default Login;
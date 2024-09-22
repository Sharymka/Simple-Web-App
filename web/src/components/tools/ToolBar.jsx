import React, {useContext} from 'react';
import {UsersContext} from "../UsersContext";
import {Link, redirect, useNavigate} from "react-router-dom";


function ToolBar() {

    const navigate = useNavigate();

 const { deleteUsers, blockUsers, unBlockUsers, logout } = useContext(UsersContext);

        const handleLogout = async () => {
            try {
                const response = await fetch('http://localhost:3001/logout', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    console.log('message:' + data.message);
                    // console.log('logout successful!');
                    navigate('/login');
                } else {
                    console.log('Error:' + data.error);
                }
            } catch (error) {
                console.error('Error while logout:', error);
            }
        }

    return (
      <div className='container-lg d-flex justify-content-between mt-5'>
          <div className="btn-group" role="group" aria-label="Basic mixed styles example">
              <button
                  type="button"
                  className="btn btn-danger"
                  onClick={()=> deleteUsers()}
              >Delete
              </button>
              <button
                  type="button"
                  className="btn btn-warning"
                  onClick={()=> blockUsers()}
              >Block
              </button>
              <button
                  type="button"
                  className="btn btn-success"
                  onClick={()=>unBlockUsers()}
              >Unblock
              </button>
          </div>
          <Link
          onClick={()=> handleLogout()}
          >
              <img src="img/logout.svg" alt="Logout"/>
          </Link>

      </div>
  );
}

export default ToolBar;
import React, {useContext} from 'react';
import {UsersContext} from "../UsersContext";


function ToolBar() {

 const { deleteUsers, blockUsers, unBlockUsers } = useContext(UsersContext);

  return (
      <div className='container-lg mt-5'>
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
      </div>
  );
}

export default ToolBar;
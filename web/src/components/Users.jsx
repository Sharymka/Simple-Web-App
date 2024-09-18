import React from 'react';
import ToolBar from "./tools/ToolBar";
import Table from "./tools/Table";
import UsersProvider from "./UsersContext";


function Users() {

  return (
      <UsersProvider>
          <div className="container">
              <ToolBar/>
              <Table/>
          </div>
      </UsersProvider>

  )
}

export default Users;
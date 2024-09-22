import React, {useContext} from 'react';
import CheckBox from "./CheckBox";
import {UsersContext} from "../UsersContext";
import {STATUSES} from "../../consts/consts";
import { format } from 'date-fns';


function Table() {

  const { users, switchMainCheckbox  } = useContext(UsersContext);

  return (
      <table className=" table align-middle mb-0 bg-white mt-5">
        <thead className="bg-light">
        <tr>
          <th><CheckBox value={switchMainCheckbox}/></th>
          <th>Name</th>
          <th>Status</th>
          <th>Registration Date</th>
          <th>Last login date</th>
        </tr>
        </thead>
        <tbody>
            {
                users.map((user) => (
                    <tr key={user.id}>
                        <td><CheckBox value={user.id}/></td>
                        <td>
                            <div className="d-flex align-items-center">
                                <img
                                    src="https://mdbootstrap.com/img/new/avatars/8.jpg"
                                    alt=""
                                    style={{width: '45px', height: '45px'}}
                                    className="rounded-circle"
                                />
                                <div className="ms-3">
                                    <p className="fw-bold mb-1">{user.firstName + ' ' + user.lastName}  {} </p>
                                    <p className="text-muted mb-0">{user.email}</p>
                                </div>
                            </div>
                        </td>
                        <td>
                            <span  className= {`badge rounded-pill d-inline ${user.status === STATUSES.ACTIVE ? 'badge-success' : 'badge-warning'}`}>{user.status}</span>
                        </td>
                        <td>{format(new Date(user.registration_date), 'd.MM.yyyy')}</td>
                        <td>
                            {user.last_login ? format(new Date(user.last_login), 'd.MM.yyyy (HH:mm)') : ''}
                        </td>
                    </tr>
                ))
            }
        </tbody>
      </table>
  );
}

export default Table;
import React, { createContext, useState } from 'react';
import {usersRepo} from "./Repo";
import {STATUSES} from "../consts/consts";


export const UsersContext = createContext(undefined);

function UsersProvider({ children })  {

  const [users, setUsers] = useState(usersRepo);
  const [selectedId, setSelectedId] = useState([]);
  const [switchMainCheckbox, setSwitchMainCheckbox] = useState(false);



  const handleCheckBox = (value) => {

      if (value === false) {
          setSwitchMainCheckbox(prevState =>  !prevState);
          setSelectedId(prevState => users.map((_, index) => index + 1) );
          return;
      }else if (value === true) {
          setSwitchMainCheckbox(prevState =>  !prevState);
          setSelectedId(prevState => [] );
          return;
      }

       if(selectedId.includes(value)){
          setSelectedId(prevState => prevState.filter(item => item !== value));
      }else {
          setSelectedId(prevState => [...prevState, value]);
      }

  }

    const deleteUsers = ()=>
    {
        setUsers(prevState => prevState.filter(user => !selectedId.includes(user.id)));
        setSelectedId(prevState => [] );
        setSwitchMainCheckbox(prevState =>  false);
    }

    const blockUsers = ()=>
    {
        setUsers(prevState =>
            prevState.map(user =>
                selectedId.includes(user.id) &&
                user.status === STATUSES.ACTIVE
                    ? { ...user, status: STATUSES.BLOCKED }
                    : user
            )
        );
        setSelectedId(prevState => [] );
        setSwitchMainCheckbox(prevState =>  false);
    }

    const unBlockUsers = ()=>
    {
        setUsers(prevState =>
            prevState.map(user =>
                selectedId.includes(user.id) &&
                user.status === STATUSES.BLOCKED
                    ? { ...user, status: STATUSES.ACTIVE }
                    : user
            )
        );
        setSelectedId(prevState => [] );
        setSwitchMainCheckbox(prevState =>  false);
    }

  return (
      <UsersContext.Provider value={{
          users,
          handleCheckBox,
          selectedId,
          switchMainCheckbox,
          deleteUsers,
          blockUsers,
          unBlockUsers
      }}>
          {children}
      </UsersContext.Provider>
  );
}

export default UsersProvider;
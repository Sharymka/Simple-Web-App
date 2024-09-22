import React, {createContext, useEffect, useState} from 'react';
import {STATUSES} from "../consts/consts";
import {useNavigate} from "react-router-dom";

export const UsersContext = createContext(undefined);

function UsersProvider({ children })  {

  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [switchMainCheckbox, setSwitchMainCheckbox] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
        const fetchUsers = async () => {

            try {
                const response = await fetch('http://localhost:3001/users', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setUsers(data)
                } else {
                    console.error('Failed to fetch user data:', );
                    navigate('/login');
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUsers();
    }, []);

  const handleCheckBox = (value) => {

      if (value === false) {
          setSwitchMainCheckbox(prevState =>  !prevState);
          setSelectedId(prevState => users.map((user) => user.id) );
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

    const deleteUsers = async () =>  {
        try {
            const response = await fetch('http://localhost:3001/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ selectedId }),
            });
            const data = await response.json();

            if (response.ok) {
                console.log('Users deleted successfully:', data);
                setUsers(prevState => prevState.filter(user => !selectedId.includes(user.id)));
                setSelectedId(prevState => [] );
                setSwitchMainCheckbox(prevState =>  false);
            } else {
                console.error('Failed to delete users:', data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const blockUsers = async ()=> {

        try {
            const response = await fetch('http://localhost:3001/block', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ selectedId: selectedId, status: STATUSES.BLOCKED}),
            });
            const data = await response.json();

            if (response.ok) {
                console.log('Users block successfully:', data);
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

            } else {
                console.error('Failed to delete users:', data.error);
                // Обновите состояние с ошибкой или выполните другие действия по необходимости
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const unBlockUsers = async ()=> {

        try {
            const response = await fetch('http://localhost:3001/unBlock', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ selectedId:selectedId, status: STATUSES.ACTIVE }),
            });
            const data = await response.json();

            if (response.ok) {
                console.log('Users unBlock successfully:', data);
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

            } else {
                console.error('Failed to delete users:', data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
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
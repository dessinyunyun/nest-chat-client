import React, { useEffect, useState } from "react";

const ListUsers = ({ chatWith, setchatWith }) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      try {
        const response = await fetch("http://localhost:5000/users", requestOptions);
        const users = await response.json();
        console.log(users);
        setUsers(users);
      } catch (error) {
        console.log(error);
      }
    };

    getUsers();
  }, []);

  return (
    <div>
      <ul>
        {users &&
          users.map((user) => (
            <li
              key={user._id}
              onClick={() =>
                setchatWith({
                  username: user.username,
                  _id: user._id,
                })
              }
            >
              {user.username}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ListUsers;

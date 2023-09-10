import React, { useEffect, useState } from "react";

const ListFriendMessages = ({ userLogin, chatWith, setchatWith, refresh }) => {
  const [listMesaggeWithFriend, setlistMesaggeWithFriend] = useState([]);
  useEffect(() => {
    const getMEssg = async () => {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${userLogin.token}`);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      try {
        const response = await fetch(`http://localhost:5000/room-chat/${userLogin.id}`, requestOptions);
        const msg = await response.json();
        console.log(msg);
        setlistMesaggeWithFriend(msg);
      } catch (error) {
        console.log(error);
      }
    };
    getMEssg();
  }, [userLogin, refresh]);
  console.log(userLogin);
  console.log(listMesaggeWithFriend);
  return (
    <div>
      <ul>
        {listMesaggeWithFriend.length > 0 &&
          listMesaggeWithFriend.map((msg) => {
            const user = msg.members.filter((mb) => mb.username !== userLogin.username);
            console.log(user);
            return (
              <li key={msg._id} onClick={() => setchatWith(msg)}>
                {msg.name.length > 1 ? msg.name : user[0].username}
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default ListFriendMessages;

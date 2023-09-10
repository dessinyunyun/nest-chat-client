import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
const ListGroup = ({ chatWith, setchatWith, userLogin }) => {
  const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   socket.on("response_joinroom", (data) => {
  //     console.log(data);
  //   });
  // }, []);

  useEffect(() => {
    const getUsers = async () => {
      try {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${userLogin.token}`);

        var requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };
        const response = await fetch("http://localhost:5000/room-chat/room-group", requestOptions);
        const users = await response.json();
        console.log(users);
        setUsers(users);
      } catch (error) {
        console.log(error);
      }
    };

    getUsers();
  }, [userLogin]);
  const joinRoom = (room, member) => {
    const socket = io("http://localhost:5000", {
      auth: {
        token: userLogin.token,
        // token: "dsadd",
      },
    });

    socket.on("connect", () => {
      console.log("Terhubung dengan server");

      // Lakukan tindakan saat terhubung
      // Contohnya, gabung ke dalam ruangan
      const payload = {
        room_id: room,
        newMember: member,
      };
      socket.emit("join_room", payload);
    });

    // socket.on("response_joinroom", (data) => {
    //   console.log("Respon dari server:", data);
    //   // Tangani data respon sesuai kebutuhan
    // });

    return () => {
      socket.disconnect(); // Membersihkan saat komponen di-unmount
    };
  };

  // useEffect(() => {
  //   // Menangani event 'response_message'
  //   const handleResponseMessage = (response) => {
  //     console.log("Received response join room:", response);
  //     // setlistMessages((prevListMessages) => [...prevListMessages, response]);
  //   };

  //   socket.on("response_joinroom", handleResponseMessage);

  //   return () => {
  //     // Membersihkan event listener saat komponen di-unmount
  //     socket.off("response_joinroom", handleResponseMessage);
  //   };
  // }, []); // Eksekusi hanya sekali saat komponen di-mount

  return (
    <div>
      <ul>
        {users.length > 0 &&
          users.map((user) => (
            <li key={user._id} onClick={() => joinRoom(user._id, userLogin.id)} className="bg-green-500 p-2">
              {user.name}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ListGroup;

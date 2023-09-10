import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const RoomChat = ({ chatWith, setchatWith, userLogin }) => {
  const [messages, setMessages] = useState([]);
  const [newMember, setnewMember] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [refresh, setRefresh] = useState("");
  const socket = io("http://localhost:5000", {
    auth: {
      token: userLogin.token,
      // token: "dsadd",
    },
  });

  const [listMessages, setlistMessages] = useState([]);
  useEffect(() => {
    socket.on("response_message", (data) => {});
  }, []);

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      const payload = {
        message: messageInput,
        roomChat_id: chatWith._id,
        sender_id: userLogin.id,
      };
      socket.emit("create_message", payload);

      setMessageInput("");
      setRefresh(refresh);
    }
  };

  useEffect(() => {
    const handleResponseMessage = (response) => {
      setlistMessages((prev) => [...prev, response.messages]);
      console.log("Received response message:", response.messages);
    };

    socket.on("response_message", handleResponseMessage);

    return () => {
      socket.off("response_message", handleResponseMessage);
    };
  }, []);

  useEffect(() => {
    const handleResponseJoin = (response) => {
      setlistMessages((prev) => [...prev, response.messages]);
      console.log("Received response room:", response);
    };

    socket.on("response_joinroom", handleResponseJoin);

    return () => {
      socket.off("response_message", handleResponseJoin);
    };
  }, []);

  useEffect(() => {
    const getMssgInThisRoom = async () => {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${userLogin.token}`);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      try {
        const response = await fetch(`http://localhost:5000/messages/${chatWith?._id}`, requestOptions);
        const msg = await response.json();
        setlistMessages(msg);
      } catch (error) {
        console.log(error);
      }
    };
    getMssgInThisRoom();
  }, [chatWith, userLogin]);

  console.log(listMessages);

  return (
    <>
      <h1 className="font-bold uppercase mb-3">
        Messages with:{" "}
        <span className="">
          {" "}
          {chatWith?.members
            .filter((mb) => mb.username !== userLogin.username)
            .map((filteredMb) => filteredMb.username)
            .shift()}
        </span>
      </h1>
      <div className="h-full pb-40 p-3">
        <ul className="grid">
          {listMessages.length > 0 &&
            listMessages?.map((message) => {
              return (
                <li key={message._id} className={`${userLogin.username == message.sender_id?.username ? "justify-self-end bg-blue-300" : "justify-self-start bg-slate-500"} p-2 my-0.5 rounded-xl`}>
                  {userLogin.username !== message.sender_id?.username && message.sender_id?.username} {userLogin.username !== message.sender_id?.username && ":"} {message.message}
                </li>
              );
            })}
        </ul>
      </div>

      <div className="w-1/3 flex justify-end fixed z-10 bottom-0 px-3 bg-gray-500 ">
        <input type="text" className="border border-red-500" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Type a message" />
        <button onClick={sendMessage}>Send</button>
      </div>
    </>
  );
};

export default RoomChat;

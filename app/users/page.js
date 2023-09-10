"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RoomChat from "@/components/RoomChat";
import ListUsers from "@/components/ListUsers";
import ListGroup from "@/components/ListGroup";
import ListFriendMessages from "@/components/ListFriendMessage";

const chatRooms = () => {
  const [chatWith, setchatWith] = useState();
  const [refresh, setRefresh] = useState(false);
  const [userLogin, setuserLogin] = useState({
    token: "",
    id: "",
    username: "",
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setuserLogin({
        token: localStorage.getItem("token"),
        id: localStorage.getItem("id"),
        username: localStorage.getItem("username"),
      });
    };

    // Inisialisasi
    handleStorageChange();

    // Tambahkan event listener untuk memantau perubahan di localStorage
    window.addEventListener("storage", handleStorageChange);

    // Cleanup pada unmount atau perubahan komponen yang menyebabkan
    // LayoutUseClient di-unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  console.log(userLogin);

  return (
    <div className="p-5 flex flex-col gap-5 h-full overflow-hidden">
      <h1 className="text-xl text-center w-full bg-purple-500">HALO : {userLogin.username}</h1>
      <div className="border border-black">
        <h1> friends</h1>
        <div className="users bg-red-100 w-full flex">
          <div class="users bg-red-100 w-full">{/* <ListUsers chatWith={chatWith} setchatWith={setchatWith} /> */}</div>
          <div class="group bg-red-100 w-full">
            <ListGroup chatWith={chatWith} setchatWith={setchatWith} userLogin={userLogin} refresh={refresh} setRefresh={setRefresh} />
          </div>
        </div>
      </div>
      <div className="h-full flex overflow-hidden">
        <div className="users bg-red-100 w-full h-full">
          <h1>Messages</h1>
          <ListFriendMessages userLogin={userLogin} chatWith={chatWith} setchatWith={setchatWith} refresh={refresh} />
        </div>

        <div className="messages bg-green-100 w-full flex flex-col justify-between  box-border h-full overflow-y-scroll relative pb-32">
          <RoomChat chatWith={chatWith} setchatWith={setchatWith} userLogin={userLogin} />
        </div>
      </div>
    </div>
  );
};

export default chatRooms;

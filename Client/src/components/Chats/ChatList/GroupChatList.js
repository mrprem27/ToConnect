import React from "react";
import { Link } from "react-router-dom";
import defaultGroupImage from '../../../images/group.png'
import './styleChatList.css'

const GroupChatList = ({ chatOwner }) => {
    return (
         <div className="chat_list_container">
            <img src={chatOwner.dp ? chatOwner.dp : defaultGroupImage} alt={chatOwner.fullname} />
            <Link to={`chatto/group/${chatOwner._id}`}><div className="name_chatlist">
               <p>{chatOwner.fullname}</p>
            </div></Link>
        </div >
    )
}
export default GroupChatList;
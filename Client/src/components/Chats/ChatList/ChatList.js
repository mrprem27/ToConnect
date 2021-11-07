import React from "react";
import { Link } from "react-router-dom";
import defaultUserImage from '../../../images/singlechat.png'
import './styleChatList.css'

const ChatList = ({ chatOwner, sender, read }) => {
    return (
        <div className="chat_list_container">
            <img src={chatOwner.dp ? chatOwner.dp : defaultUserImage} alt={chatOwner.fullname} />
            <Link to={`chat/single/${chatOwner._id}`}><div className="name_chatlist">
                <p>{chatOwner.username}</p>
                {(sender === chatOwner._id && read === 'Sent')&&<div>New Message For you😊</div>}
            </div></Link>
        </div >
    )
}
export default ChatList;
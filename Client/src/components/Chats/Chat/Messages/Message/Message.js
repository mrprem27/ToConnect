import React from "react";
import './styleMessage.css'

const Message = ({ message, self, type, friendDP }) => {
    return (
        <div className={message.sender === self._id ? " message_cover_right" : "message_cover_left"}>
            {(message.sender !== self._id && type!=='group')&&<img className="single_mssg_img" src={friendDP} alt=""/>}
            <div className="single_message_container">
                <p>{message.message}</p>
            </div>
            {type === 'group' && <i className="message_sender">{message.sender === self._id ? null : message.sendername}</i>}
        </div>
    );
}
export default Message;
// { " " + (message.sender === self._id ? (self.username + " You sended") : message.sendername) }
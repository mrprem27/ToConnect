import React from "react";


import Message from './Message/Message'

const Messages = ({ messages, self, seen, typing,type,friendDP }) => {
    return (
        <>
            {messages.map((message, index) => <Message message={message} friendDP={friendDP} self={self} key={index} type={type}/>)}
            {seen !== 'none' && <div className="chat_seen">{seen}</div>}
            <div className="typing_cover">
                {typing && <p className="chat_typing">Typing...</p>}
            </div>
        </>
    );
}

export default Messages;
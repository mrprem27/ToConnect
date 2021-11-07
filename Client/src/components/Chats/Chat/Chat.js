import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import * as api from "../../../api";

import ScrollToBottom from 'react-scroll-to-bottom';
import Loader from '../../Loader/Loader'
import InfoBar from './InfoBar/InfoBar'
import Messages from './Messages/Messages'
import { useParams, Redirect } from "react-router-dom";
import './styleChat.css'

let socket;

const Chat = () => {
    const [self, setSelf] = useState(null);
    const [friend, setFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const ENDPOINT = "localhost:5000";
    const [message, setMessage] = useState('');
    const [seen, setSeen] = useState('');
    const { id } = useParams();
    const messageBox = useRef(null);
    const [isLogined, setIsLogined] = useState(true);
    const [typing, setTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const { data } = await api.fetchChatSingle(id);
                console.log(data);
                setMessages(data.chat.messages);
                setSelf(data.self);
                setSeen(data.self._id === data.chat.sender ? data.chat.read : 'none');
                setFriend(data.friend);
                if (!socket) {
                    try {
                        socket = io(ENDPOINT, { transports: ["websocket"] });
                        socket.emit('join', { name: data.self.username, room: data.chat._id }, (error) => {
                            if (error) {
                                console.log("already joined!!");
                            }
                        });
                        socket.on('message', newMessage => {
                            if (newMessage) {
                                setMessages(messages => [...messages, newMessage]);
                                setSeen('none');
                                socket.emit('SENDRESPONSE', {}, (error) => {
                                    if (error) {
                                        console.log("error response!!");
                                    }
                                });
                            }
                        });
                        socket.on('setTyping', () => {
                            setTyping(true);
                        });
                        socket.on('setNotTyping', () => {
                            setTyping(false);
                        });
                        socket.on('GETRESPONSE', () => {
                            console.log("1");
                            setSeen('Seen');
                        });
                    } catch (error) {
                        console.log(error.message);
                    }
                }
                else {
                    try {
                        socket.emit('join', { name: data.self.username, room: data.chat._id }, (error) => {
                            if (error) {
                                console.log("already joined!!");
                            }
                        });
                        socket.on('message', newMessage => {
                            if (newMessage) {
                                setMessages(messages => [...messages, newMessage]);
                                setSeen('none');
                                socket.emit('SENDRESPONSE', {}, (error) => {
                                    if (error) {
                                        console.log("error response!!");
                                    }
                                });
                            }
                        });
                        socket.on('setTyping', () => {
                            setTyping(true);
                        });
                        socket.on('setNotTyping', () => {
                            setTyping(false);
                        });
                        socket.on('GETRESPONSE', () => {
                            console.log("1");
                            setSeen('Seen');
                        });
                    } catch (error) {
                        console.log(error.message);
                    }
                }
            } catch (error) {
                if (error.message === 'Request failed with status code 401') setIsLogined(false);
                console.log(error.message);
            }
            messageBox.current.focus()
            setIsLoading(false);
        })();
        return () => {
            if (socket) {
                console.log("Shit");
                socket.emit("dis");
                socket.off();
            }
        };
    }, [id]);

    useEffect(() => {
        if (socket) {
            if (message) {
                socket.emit('typing', {}, (error) => {
                    if (error) {
                        console.log("error typing");
                    }
                });
            }
            let t = window.setTimeout(() => {
                socket.emit('notTyping', {}, (error) => {
                    if (error) {
                        console.log("error typing");
                    }
                });
            }, 700);
            return () => {
                clearTimeout(t);
            }
        }
    }, [message])

    const sendMessage = (e) => {
        e.preventDefault();
        if (message) {
            const sendMessage = {
                sendername: self.username,
                sender: self._id,
                message: message,
            }
            setMessage('');
            setMessages([...messages, sendMessage]);
            setSeen('Sent');
            socket.emit('sendMessage', sendMessage, () => {
                console.log("sent");
                messageBox.current.focus()
            });
        }
        else {
            console.log("message daal bhai");
        }
    }

    return (
        <div className="chat_container">
            {!isLogined && <Redirect to={`/`} />}
            {isLoading &&
                <div className="loader">
                    <div className="loader_in">
                        <Loader />
                    </div>
                </div>
            }
            {((messages && friend) && self) && <section className="chat_section">
                <div className="chat_infobar2">
                    <InfoBar chatOwner={friend} type={'private'} />
                </div>
                <ScrollToBottom className="chat_messages_total">
                    <Messages className="chat_messages" messages={messages} self={self} seen={seen} typing={typing} friendDP={friend.dp} />
                </ScrollToBottom>
                <form onSubmit={(e) => sendMessage(e)}>
                    <input
                        type="text"
                        id="message_input"
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        ref={messageBox}
                        placeholder="Type Your Message"
                    />
                    <button type="submit">Send</button>
                </form>
            </section>}
        </div>
    );
};
export default Chat;

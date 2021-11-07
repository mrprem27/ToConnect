import React, { useState, useEffect} from "react";
import io from "socket.io-client";
import * as api from "../../api";
import Loader from '../Loader/Loader'
import ScrollToBottom from 'react-scroll-to-bottom';

import InfoBar from '../Chats/Chat/InfoBar/InfoBar'
import Messages from '../Chats/Chat/Messages/Messages'
import { useParams, Redirect } from "react-router-dom";

let socket;

const GroupChat = () => {
    const [self, setSelf] = useState(null);
    const [group, setGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const ENDPOINT = "localhost:5000";
    const [message, setMessage] = useState('')
    const { idg } = useParams();
    const [typing, setTyping] = useState(false);
    const [isLogined, setIsLogined] = useState(true);
    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const { data } = await api.fetchGroupChatSingle(idg);
                console.log(data);
                setGroup(data.group)
                setMessages(data.group.messages);
                setSelf(data.self);
                if (!socket) {
                    try {
                        socket = io(ENDPOINT, { transports: ["websocket"] });
                        socket.emit('join', { name: data.self.username, room: data.group._id }, (error) => {
                            if (error) {
                                console.log(error);
                            }
                        });
                        socket.on('message', newMessage => {
                            if (newMessage)
                                setMessages(messages => [...messages, newMessage]);
                        });
                        socket.on('setTyping', () => {
                            setTyping(true);
                        });
                        socket.on('setNotTyping', () => {
                            setTyping(false);
                        });
                    } catch (error) {
                        console.log(error.message);
                    }
                }
                else {
                    socket.emit('join', { name: data.self.username, room: data.group._id }, (error) => {
                        if (error) {
                            console.log(error);
                        }
                    });
                    socket.on('message', newMessage => {
                        if (newMessage)
                            setMessages(messages => [...messages, newMessage]);
                    });
                    socket.on('setTyping', () => {
                        setTyping(true);
                    });
                    socket.on('setNotTyping', () => {
                        setTyping(false);
                    });
                }
            } catch (error) {
                console.log(error.message);
                if (error.message === 'Request failed with status code 401') setIsLogined(false);
            }
            setIsLoading(false);
        })();
        return () => {
            if(socket){
                console.log("Shit");
                socket.emit("dis");
                socket.off();
            }
        };
    }, [ENDPOINT, idg]);

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
            socket.emit('sendMessageGroup', sendMessage, () => {
                console.log("sent");
            });
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
            {(group && self) && <section className="chat_section">
                <div className="chat_infobar2">
                    <InfoBar chatOwner={group} type={'group'} />
                </div>
                <ScrollToBottom className="chat_messages_total">
                    <Messages className="chat_messages" messages={messages} self={self} typing={typing} type={'group'}/>
                </ScrollToBottom>
                <form onSubmit={(e) => sendMessage(e)}>
                    <input
                        type="text"
                        onFocus="true"
                        id="message_input"
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        placeholder="Type Your Message"
                    />
                    <button type="submit">Send</button>
                </form>
            </section>}
        </div>
    );
};
export default GroupChat;

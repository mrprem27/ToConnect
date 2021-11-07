import React, { useState, useEffect } from "react";
import ChatList from './ChatList/ChatList'
import { Link, Redirect, useHistory } from "react-router-dom";
import * as api from '../../api'
import GroupChatList from './ChatList/GroupChatList'
import './styleChats.css'
import Loader from '../Loader/Loader'

const Chats = () => {
    const history = useHistory();
    const [chats, setChats] = useState([]);
    const [groups, setGroups] = useState([]);
    const [isChats, setISChats] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isLogined, setIsLogined] = useState(true);
    const [idc, setIdc] = useState('');
    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await api.fetchChats();
                setIdc(data.idc);
                setChats(data.data);
                console.log("got the chats");
            } catch (error) {
                if (error.message === 'Request failed with status code 401') setIsLogined(false);
                console.log(error.message);
            }
            setIsLoading(false);
        }
        fetchData();
    }, []);
    const buttonToggole = async () => {
        if (isChats) {
            try {
                setIsLoading(true);
                const { data } = await api.fetchGroups();
                setGroups(data);
                setISChats(false);
                console.log("got the Groups");
            } catch (error) {
                console.log(error.message);
            }
            setIsLoading(false);
        } else {
            try {
                setIsLoading(true);
                const { data } = await api.fetchChats();
                setChats(data.data);
                setISChats(true);
                console.log("got the chats");
            } catch (error) {
                console.log(error.message);
            }
            setIsLoading(false);
        }
    }
    return (
        <div>
            {!isLogined && <Redirect to={`/`} />}
            {isLoading &&
                <div className="loader">
                    <div className="loader_in">
                        <Loader />
                    </div>
                </div>
            }
            {isLogined && <section className="chats_container">
                <div className="chats_top">
                    <button onClick={history.goBack}>Back</button>
                    <h2> {isChats ? 'Chats' : 'Groups'}</h2>
                    <button onClick={buttonToggole}>{isChats ? 'Show Group Chats' : 'Show Private Chats'}</button>
                </div>
                <Link to='/G_create'><button id="create_grp_link">Create Group</button></Link>
                <div className="main_chats">
                    {isChats ? (chats.length > 0 ?
                        <div className="chat_list">
                            {chats.map((chat) => <ChatList key={chat._id} chatOwner={chat.userslist[0]._id === idc ? chat.userslist[1] : chat.userslist[0]} read={chat.read} sender={chat.sender}/>)}
                        </div>
                        :
                        <div className="nochats">No Chats🤐<br />😃Make People Friends First 💑By Sending them Request From Search Tab </div>)
                        :
                        (groups.length > 0 ? <div>
                            <div className="chat_list">{groups.map((group) => <GroupChatList key={group._id} chatOwner={group} />)}</div>
                        </div> :
                            <div className="nochats">Oops!! No Groups🤐<br />😃Create New Groups 👫👨‍👨‍👦‍👦👩🏻‍🤝‍🧑🏻 By Clicking "Create Group" Button</div>)}
                </div>
            </section>}
        </div >

    )
}
export default Chats;
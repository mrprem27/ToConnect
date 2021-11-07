import React, { useState, useEffect } from "react";
import Edit from "../Edit/Edit";
import Friends from '../Friends/Friends'
import { useParams, Link, Redirect } from "react-router-dom";
import * as api from '../../api';
import Loader from '../Loader/Loader'
import defaultUserImage from '../../images/singlechat.png'
import './styleUser.css'

const User = () => {
    const [relation, setRelation] = useState('notfriend')
    const [wantToEdit, setWantToEdit] = useState(false);
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [id, setId] = useState(useParams().id);
    const [isLogined, setIsLogined] = useState(true);
    const [dp, setdp] = useState(null);
    const [fullname, setfullname] = useState('');
    const [username, setusername] = useState('');
    const [sex, setsex] = useState('');
    const [bio, setbio] = useState('');
    const [idc, setIdc] = useState('');
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const { data } = await api.fetchUser(id);
                setRelation(data.relation)
                setIdc(data.idc)
                setfullname(data.user.fullname);
                setusername(data.user.username);
                setsex(data.user.sex);
                setbio(data.user.bio);
                setdp(data.user.dp);
                if (data.relation === 'friend' || data.relation === 'self') {
                    try {
                        const { data } = await api.fetchFriends(id);
                        setFriends(data);
                        console.log(data);
                    } catch (error) {
                        console.log(error.message);
                    }
                }
            } catch (error) {
                if (error.message === 'Request failed with status code 401') setIsLogined(false);
                console.log(error.message);
            }
            setIsLoading(false);
        }
        fetchData();
    }, [id]);

    const logout = async () => {
        if (!window.confirm("Are You Sure??"))
            return;
        try {
            setIsLoading(true);
            const { data } = await api.logout();
            setIsLogined(false);
        } catch (error) {
            console.log(error.message);
        }
        setIsLoading(false);
    }
    const sendRequest = async (id) => {
        setIsLoading(true);
        try {
            const { data } = await api.addFriend(id);
            setRelation('requester');
            console.log("sent request to User");
        } catch (error) {
            console.log(error.message);
        }
        setIsLoading(false);
    }
    const unSendRequest = async (id) => {
        setIsLoading(true);
        try {
            const { data } = await api.removeRequestFriend(id);
            setRelation('notfriend');
            console.log("Request revoked!!");
        } catch (error) {
            console.log(error.message);
        }
        setIsLoading(false);
    }
    const Unfriend = async (id) => {
        if (window.confirm("Are You Sure??")) {
            setIsLoading(true);
            try {
                const { data } = await api.removeFriend(id);
                setRelation('notfriend');
                console.log("Unfriended!!");
            } catch (error) {
                console.log(error.message);
            }
            setIsLoading(false);
        }
    }
    const acceptRequest = async (id) => {
        try {
            setIsLoading(true);
            const { data } = await api.acceptRequestFriend(id);
            setRelation('friend');
        } catch (error) {
            console.log(error.message);
        }
        setIsLoading(false);
    }
    const cancelRequest = async (id) => {
        setIsLoading(true);
        try {
            const { data } = await api.cancelRequest(id);
            setRelation('notfriend');
            console.log("Request Canceled!!");
        } catch (error) {
            console.log(error.message);
        }
        setIsLoading(false);
    }
    const btnClicked = () => {

        switch (relation) {
            case 'self':
                setWantToEdit(true);
                break;
            case 'friend':
                Unfriend(id);
                break;
            case 'notfriend':
                sendRequest(id)
                break;
            case 'requester':
                unSendRequest(id)
                break;
            case 'accepter':
                acceptRequest(id)
                break;
        }
    }
    const btnValue = () => {
        switch (relation) {
            case 'self':
                return 'Edit Profile';
            case 'friend':
                return 'Unfriend';
            case 'notfriend':
                return 'Send Friend Request';
            case 'accepter':
                return 'Accept';
            default:
                return 'Pending';
        }
    }
    const toggleEdit = () => {
        setWantToEdit(!wantToEdit);
    }
    return (
        <section className="user_outer_section">
            {!isLogined && <Redirect to={`/`} />}
            {isLoading &&
                <div className="loader">
                    <div className="loader_in">
                        <Loader />
                    </div>
                </div>
            }
            {(isLogined && fullname.length > 0) && <div className="user_container">
                <nav className="nav_cover">
                    <div className="nav_user">
                        <Link className="nav_links first_link" onClick={setId && (() => setId(idc))} to={`/user/get/${idc}`}><div id={relation === 'self' ? "me" : ""}>My Profile</div></Link>
                        <Link className="nav_links" to='/chats'><div>Chats </div></Link>
                        <Link className="nav_links" to='/search'><div>Search </div></Link>
                        <Link className="nav_links" to='/requests'><div>Requests </div></Link>
                    </div>
                </nav>
                {wantToEdit && <Edit className="edit_show" toggleEdit={toggleEdit} changes={{ dp, setdp, fullname, setfullname, username, setusername, sex, setsex, bio, setbio, _id: id }} />}

                <section className="user_main">
                    <div className="user_main_top">
                        <div className="user_main_top_left">
                            <div>
                                <img src={dp ? dp : defaultUserImage} alt={fullname} />
                            </div>
                        </div>
                        <div className="user_main_top_right">
                            <div>
                                <h2>{username}</h2>
                                <p>{sex}</p>
                            </div>
                            <div>
                                <button onClick={btnClicked}>{btnValue()}</button>
                                {relation == 'accepter' && <button onClick={() => cancelRequest(id)}>Cancel</button>}
                            </div>
                        </div>
                    </div>
                    <div className="user_main_bottom">
                        <div className="user_fullname">
                            <h2>{fullname}</h2>
                        </div>
                        <div className="user_bio">
                            <h2>Bio</h2>
                            <p>{bio || 'Nothing to say!!'}</p>
                        </div>
                        {friends && <div className="user_friends">
                            <h3>Friends</h3>
                            {(relation === 'friend' || relation === 'self') ? <Friends friends={friends} setId={setId} className="user_friend" /> : <div className="locked_friends">Locked</div>}
                        </div>}
                    </div>
                </section>
                <div className="logout_btn">
                    {relation === 'self' && <button onClick={logout}>LOG OUT</button>}
                    {relation === 'friend' && <button id="chat_user_btn"><Link exact to={`/chat/single/${id}`} >CHAT
                    </Link></button>}</div>
            </div>}
        </section >
    )
}
export default User;
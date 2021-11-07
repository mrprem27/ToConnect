import React from "react";
import { Link } from "react-router-dom";
import defaultUserImage from '../../../images/singlechat.png'
import './styleFriend.css'

const Friend = ({ friend, setId }) => {
    return (
        <div className="friend_container">
            <img src={friend.dp ? friend.dp : defaultUserImage} alt={friend.fullname} width='80' height='80' />
            <Link className="friend_list" to={`/user/get/${friend._id}`} onClick={setId && (() => setId(friend._id))}>
                <span> {friend.username}</span>
            </Link>

        </div >
    )
}
export default Friend;
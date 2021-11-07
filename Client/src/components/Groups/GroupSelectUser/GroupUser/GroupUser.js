import React from "react";
import { Link } from "react-router-dom";
import defaultUserImage from '../../../../images/singlechat.png'
import './styleGU.css'

const GroupUser = ({ groupUser, removeUser }) => {
    return (
        <div className="gu_container">
            <img width='200' src={groupUser.dp ? groupUser.dp : defaultUserImage} alt=""/>
            <Link to={`/user/get/${groupUser._id}`}><div className="gu_link">{groupUser.username}</div></Link>
            <button onClick={() => removeUser(groupUser._id)}>Remove User</button>
        </div>
    )
}
export default GroupUser;
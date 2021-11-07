import React from "react";
import { Link } from 'react-router-dom'
import defaultUserImage from '../../../images/singlechat.png'
import './styleRequest.css'

const Request = ({ user, acceptRequest, cancelRequest }) => {
    return (
        <div className="request_container">
            <img src={user.dp ? user.dp : defaultUserImage} alt={user.fullname} />
            <div className="link_request">
                <Link to={`/user/get/${user._id}`}>
                    <div className="request_user">
                        {user.username}
                    </div>
                </Link>
                <div className="accept_btns">
                    <button onClick={() => acceptRequest(user._id)}>Accept</button>
                    <button onClick={() => cancelRequest(user._id)}>Deny</button>
                </div >
            </div>
        </div >
    )
}
export default Request;
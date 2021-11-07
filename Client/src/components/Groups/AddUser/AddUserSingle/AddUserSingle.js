import React, { useState } from "react";
import defaultUserImage from '../../../../images/singlechat.png'
import './styleAdduser.css'

const AddUserSingle = ({ friend, selectedUsers, setSelectedUsers }) => {
    const [isAdded, setIsAdded] = useState(false);
    const addUserHandler = (id) => {
        setSelectedUsers([...selectedUsers, id]);
        setIsAdded(true);
    }
    const removeUserHandler = (id) => {
        setSelectedUsers(selectedUsers.filter((u) => u !== id));
        setIsAdded(false);
    }
    return (
        <div className="adduser_container">
            <img src={friend.dp ? friend.dp : defaultUserImage} alt={friend.username} width='200' />
            <p>{friend.username}</p>
            <button onClick={() => { isAdded ? removeUserHandler(friend._id) : addUserHandler(friend._id) }}>{isAdded ? 'remove' : 'Add'}</button>
        </div>
    );
}
export default AddUserSingle;
import React from "react";
import AddUserSingle from './AddUserSingle/AddUserSingle'

const AddUser = ({ friends, selectedUsers, setSelectedUsers }) => {
    return (
        <div>
            {friends.map((user) => <AddUserSingle key={user._id} friend={user} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />)}
        </div>
    );
}
export default AddUser;
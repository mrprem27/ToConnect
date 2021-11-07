import React from "react";
import GroupUser from './GroupUser/GroupUser'
const GroupUsers = ({ groupUsers, removeUser }) => {
    return (
        <div>
            {groupUsers.map((groupUser) => <GroupUser groupUser={groupUser} removeUser={removeUser} key={groupUser.id} />)}
        </div>
    )
}
export default GroupUsers;
import React from "react";
import Friend from './Friend/Friend'
const Friends = ({ friends,setId }) => {
    return (
        <div>
            {friends.map((friend) => <Friend friend={friend} key={friend.id} setId={setId}/>)}
        </div>
    )
}
export default Friends;
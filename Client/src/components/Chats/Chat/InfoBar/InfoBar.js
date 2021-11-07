import React from "react";
import { Link, useHistory } from "react-router-dom";
import defaultGroupImage from '../../../../images/group.png'
import defaultUserImage from '../../../../images/singlechat.png'
import './styleinfobar.css'
const InfoBar = ({ chatOwner, type }) => {
    //const ka dont know
    const history = useHistory();
    return (
        <div className="info_bar_container">
            {type === 'private' ? <div className="infobar_in">
                <img src={chatOwner.dp ? chatOwner.dp : defaultUserImage} alt={chatOwner.fullname} width='200' />
                <Link to={`/user/get/${chatOwner._id}`} className="info_a"><span>{chatOwner.username}</span></Link>
            </div> : <div className="infobar_in">
                <img src={chatOwner.dp ? chatOwner.dp : defaultGroupImage} alt={chatOwner.fullname} width='200' />
                    <Link to={`/GI/view/${chatOwner._id}`} className="info_a"><span>{chatOwner.fullname}</span></Link>
            </div>}
            <button onClick={() => history.goBack()}>Back</button>
        </div>
    )
};

export default InfoBar;
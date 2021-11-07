import React, { useState, useRef, useEffect } from "react";
import GroupUsers from "./GroupSelectUser/GroupUsers";
import Friends from "../Friends/Friends";
import { useParams, Redirect, useHistory } from "react-router-dom";
import * as api from "../../api";
import GiEdit from './GiEdit/GiEdit'
import AddUser from "./AddUser/AddUser";
import './styleGi.css'
import Loader from '../Loader/Loader'
import defaultGroupImage from '../../images/group.png'

const Gi = () => {
    const history = useHistory();
    const { idg } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isMeAdmin, setIsMeAdmin] = useState(false)
    const [wantToEdit, setWantToEdit] = useState(false);
    const [group, setGroup] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [userlist, setUserList] = useState([]);
    const [friends, setFriends] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([])
    const [idc, setIdc] = useState('');
    const [isLogined, setIsLogined] = useState(true);
    const [groupName, setGroupName] = useState('');
    const [wantToAdd, setWantToAdd] = useState(false);

    useEffect(async () => {
        try {
            const { data } = await api.fetchGroupSingle(idg);
            console.log(data);
            if (data.group.admin._id === data.idc)
                setIsMeAdmin(true);
            setIdc(data.idc);
            setGroup(data.group);
            setSelectedFile(data.group.dp);
            setGroupName(data.group.fullname)
            setUserList(data.group.userlist);

        } catch (error) {
            if (error.message === 'Request failed with status code 401') setIsLogined(false);
            console.log(error.message);
        }
        setIsLoading(false);
    }, [])
    const fetchAddUsersGroup = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.fetchForAddToGroup(group._id);
            setFriends(data);
            console.log(data);
            setWantToAdd(true);
        } catch (error) {
            console.log(error.message);
        }
        setIsLoading(false);
    }
    const editAddFinalGroup = async () => {
        if (selectedUsers) {
            setIsLoading(true);
            try {
                const { data } = await api.finalSumbitGroupData({ idg: group._id, finalData: selectedUsers });
                console.log("added Successfully!!");
                setSelectedUsers([]);
                setWantToAdd(false);
                setUserList(data);
            } catch (error) {
                console.log(error.message);
            }
            setIsLoading(false);
        }

    };
    const removeUser = async (id) => {
        if (!window.confirm("Are You sure??"))
            return;
        try {
            setIsLoading(true);
            const { data } = await api.removeFriendToGroup({ id: id, idg: group._id });
            console.log(data);
            setUserList(data)
            console.log("User removed from Group");
        } catch (error) {
            console.log(error.message);
        }
        setIsLoading(false);
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
            {wantToEdit && <GiEdit setWantToEdit={setWantToEdit} idg={group._id} setGroupName={setGroupName} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />}
            {group && <section className="gi_container">
                <button onClick={history.goBack} className="back_gi">Back</button>
                <div className="gi_cover">
                    <div className="gi_details_cover">
                        <img className="gi_img" src={selectedFile ? selectedFile : defaultGroupImage} alt={group.fullname} />

                        <div className="gi_details">
                            <h3>{groupName}</h3>
                            <p>{`Group Created by ${group.admin.username} on ${group.date.slice(0,10)}`}</p>

                            <div className="gi_btns">
                                <button onClick={() => setWantToEdit(true)}>Edit</button>
                                {isMeAdmin && <button onClick={fetchAddUsersGroup}>Add Users</button>}
                            </div>
                        </div>
                    </div>
 

                    <div className="gi_admin">
                        <h4>Admin</h4>
                        <Friends friends={[group.admin]} />
                    </div>
                    <h2 id="users_gi_h2">
                        Users
                    </h2>
                    {userlist.length > 0 ? <div className="gi_users">
                        {isMeAdmin ? <GroupUsers groupUsers={userlist} removeUser={removeUser} /> : <Friends friends={userlist} />}
                    </div> : <div className="no_users_to_all">No Users😅!!</div>}

                    {wantToAdd && <div className="gi_addusers">
                        <div className="gi_addusers_cover">
                            <div className="gi_addusers_top">
                                <button onClick={() => setWantToAdd(false)}>Cancel</button>
                                <h3>Add Users</h3>
                                <button onClick={() => editAddFinalGroup()}>Done</button>
                            </div>
                            <br />
                            {friends.length > 0 ? <AddUser friends={friends} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} /> : <div className="no_users_to_all">Opps!! No more friends To Add!!🙁</div>}
                        </div>
                    </div>}

                </div>
            </section>}
        </div >
    );
}
export default Gi;
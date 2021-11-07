import React, { useState, useEffect } from "react";
import { useHistory, Redirect } from 'react-router-dom';
import Modal from "./Model/Modal";
import AddUser from '../AddUser/AddUser'
import FileBase from 'react-file-base64'
import * as api from '../../../api'
import defaultGroupImage from '../../../images/group.png'
import './styleGroup_create.css';
import Loader from '../../Loader/Loader'

const GCreate = () => {
    const history = useHistory();
    const [fullname, setFullname] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const [isGroupCreated, setIsGroupCreated] = useState(false)
    const [groupId, setGroupId] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('')

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLogined, setIsLogined] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await api.fetchFriends('self');
                setFriends(data);
            } catch (error) {
                if (error.message === 'Request failed with status code 401') setIsLogined(false);
                console.log(error.message);
            }
            setIsLoading(false);
        }
        fetchData();
    }, [])

    const submitHandler = (e) => {
        e.preventDefault();
        if (!fullname)
            setModalContent('You missed to enter your Credentials!!');
        else
            setIsGroupCreated(true);
        setShowModal(true)
    };
    const createFinalgroup = async () => {
        setIsLoading(true);
        const groupData = {
            fullname: fullname,
            dp: selectedFile,
            admin: '',
            userlist: selectedUsers
        }
        try {
            const { data } = await api.createGroup(groupData);
            setGroupId(data.groupId);
            setModalContent('Group Created Succesfully!!');
        } catch (error) {
            setModalContent(error.message)
            console.log(error.message);
        }
        setIsLoading(false);
    };
    return (
        <div className="gc_container">
            {!isLogined && <Redirect to={`/`} />}
            {isLoading &&
                <div className="loader">
                    <div className="loader_in">
                        <Loader />
                    </div>
                </div>
            }
            {groupId && <Redirect to={`/chats`} />}
            {(!isGroupCreated && showModal) && <div className={showModal ? "modal_gc show_class" : "modal_gc"}>
                <div className="gc_modal_base">
                    <Modal modalContent={modalContent} />
                </div>
            </div>}
            <div className="gc_all">
                <div className="gc_top">
                    <button onClick={history.goBack}>Back</button>
                    <h2>GCreate</h2>
                    {isGroupCreated && <button onClick={createFinalgroup}>Done
                    </button>}
                </div>

                <div className="gc_form">
                    {!isGroupCreated && <form onSubmit={submitHandler}>
                        <div className="gc_img">
                            <img src={selectedFile ? selectedFile : defaultGroupImage} alt='Select an Image as Dp of Group' />
                        </div>
                        <input
                            type="text"
                            id="fullname_grp"
                            name="fullname_grp"
                            placeholder="Group Name"
                            onChange={(e) => setFullname(e.target.value)}
                        />
                        <FileBase
                            type="file"
                            multiple={false}
                            onDone={({ base64 }) => setSelectedFile(base64)}
                        />
                        <button type="submit">GCreate</button>
                    </form>}
                </div>

                {isGroupCreated && <div className="add_users_list">
                    <h3>Add Friends</h3>
                    {friends.length > 0 ? <AddUser friends={friends} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} /> : <div className="no_users_to_all">Opps!! No friends!!🙁</div>}
                </div>}
            </div>
        </div>
    )
}
export default GCreate;
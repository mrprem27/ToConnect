import React, { useRef, useState, useEffect } from "react";
import Modal from './Modal/Modal'
import FileBase from 'react-file-base64'
import * as api from '../../api'
import Loader from '../Loader/Loader'
import defaultUserImage from '../../images/singlechat.png'
import './styleEdit.css'

const Edit = ({ toggleEdit, changes }) => {
    const username = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const fullname = useRef(null);
    const password = useRef(null);
    const oldPassword = useRef(null);
    const bio = useRef(null);
    const [selectedFile, setSelectedFile] = useState(changes.dp);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');

    useEffect(() => {
        document.getElementById('username_edit').value = changes.username;
        document.getElementById('fullname_edit').value = changes.fullname;
        if (changes.bio)
            document.getElementById('bio').value = changes.bio;
    }, [])
    const showPass = () => {
        if (
            password.current.getAttribute("type") !== "text") {
            password.current.setAttribute("type", "text");
            oldPassword.current.setAttribute("type", "text");
        }
        else {
            password.current.setAttribute("type", "password");
            oldPassword.current.setAttribute("type", "password");
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!window.confirm("Are You Sure??"))
            return;

        if (!username.current.value || !fullname.current.value || (password.current.value.length > 0 && oldPassword.current.value.length <= 0 || password.current.value.length <= 0 && oldPassword.current.value.length > 0)) {
            setModalContent('You missed to enter your Credentials!!');
        }
        else if (username.current.value.length < 3) {
            setModalContent('Username should have minimum length of 3 Characters!!')
        }
        else if ((oldPassword.current.value.length < 6 && oldPassword.current.value.length > 0) || (password.current.value.length < 6 && password.current.value.length > 0)) {
            setModalContent('Password should have minimum length of 6 Characters!!')
        }
        else if (bio.current.value.length > 250) {
            setModalContent('Bio should have maximum length of 250 Characters!!')
        }
        else {
            setIsLoading(true);
            const userData = {
                _id: changes._id,
                username: username.current.value,
                fullname: fullname.current.value,
                bio: bio.current.value,
                dp: selectedFile,
                password: password.current.value,
                oldPassword: oldPassword.current.value
            };
            try {
                const { data } = await api.editUser(userData);
                changes.setdp(userData.dp)
                changes.setfullname(userData.fullname)
                changes.setusername(userData.username)
                changes.setbio(userData.bio);
                setModalContent(data);
            } catch (error) {
                setModalContent(error.message);
                console.log(error);
            }
            setIsLoading(false);
        }
        setShowModal(true)
    };
    return (
        <div className="edit_container">
            {isLoading &&
                <div className="loader">
                    <div className="loader_in">
                        <Loader />
                    </div>
                </div>
            }
            <div className={showModal ? "modal_edit show_class" : "modal_edit"}>
                <div className="edit_modal_base">
                    <Modal modalContent={modalContent} />
                </div>
            </div>
            <form onSubmit={submitHandler}>
                <section className="edit_main_section">
                    <div className="edit_top">
                        <h1>Edit</h1>
                        <button onClick={toggleEdit}>Close</button>
                    </div>
                    <div className="edit_hero_section">
                        <div className="edit_logo">
                            <img id="edit_logo_img" src={selectedFile ? selectedFile : defaultUserImage} alt={changes.fullname} />
                        </div>
                        <div className="edit_right_section">

                            <input
                                type="text"
                                name="username_edit"
                                id="username_edit"
                                ref={username}
                                placeholder="Username"
                            />
                            <br />
                            <input
                                type="text"
                                id="fullname_edit"
                                name="fullname_edit"
                                ref={fullname}
                                placeholder="Full Name"
                            />
                            <br />
                            <textarea
                                ref={bio}
                                id="bio"
                                placeholder="Bio MAX 250 Characters"
                            ></textarea>
                            <br />
                            <FileBase type="file"
                                multiple={false}
                                onDone={({ base64 }) => setSelectedFile(base64)} />
                            <br />
                            <h2>Change Password(Leave Blank If You Don't want to change the Password)</h2>
                            <input
                                type="password"
                                name="password_edit"
                                id="password_edit_1"
                                ref={oldPassword}
                                placeholder="Old Password"
                            />
                            <br />
                            <input
                                type="password"
                                id="password_edit_2"
                                ref={password}
                                placeholder="New Password"
                            />
                            <br />
                            <input
                                type="checkbox"
                                id="ps_show"
                                onChange={showPass}
                            />
                            <span>Show password</span>
                        </div>
                    </div>
                    <div className="edit_btns">
                        <button type="submit">Make Changes</button>
                    </div>
                </section>
            </form>
        </div>
    );
}
export default Edit;
import React, { useState, useRef } from "react";
import { Link, Redirect } from 'react-router-dom';
import Modal from "./Model/Modal";
import FileBase from 'react-file-base64'
import * as api from '../../api'
import Loader from '../Loader/Loader';
import defaultUserImage from '../../images/singlechat.png'
import './styleSignup.css'

const SignUp = () => {
    const username = useRef(null);
    const fullname = useRef(null);
    const password_1 = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const password_2 = useRef(null);
    const email = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [sex, setSex] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('')
    const [created, setCreated] = useState(false);
    const showPass = () => {
        if (
            password_1.current.getAttribute("type") !== "text") {
            password_1.current.setAttribute("type", "text");
            password_2.current.setAttribute("type", "text");
        }
        else {
            password_1.current.setAttribute("type", "password");
            password_2.current.setAttribute("type", "password");
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!username.current.value || !password_1.current.value || !password_2.current.value || !sex || !email.current.value || !fullname.current.value) {
            setModalContent('You missed to enter your Credentials!!');
        }
        else if (username.current.value.length < 3) {
            setModalContent('Username should have minimum length of 3 Characters!!')
        }
        else if (password_1.current.value.length < 6 || password_2.current.value.length < 6) {
            setModalContent('Password should have minimum length of 6 Characters!!')
        }
        else if (password_1.current.value !== password_2.current.value) {
            setModalContent('Cofirm Password should Match with Password!!')
        }
        else {
            try {
                setIsLoading(true);
                const res = await fetch(`${process.env.REACT_APP_EMAIL_API}${email.current.value}`)
                const data = await res.json();
                console.log(data);
                if (data.deliverability === 'DELIVERABLE') {
                    const newUser = {
                        username: username.current.value,
                        fullname: fullname.current.value,
                        password: password_1.current.value,
                        email: email.current.value,
                        dp: selectedFile,
                        sex: sex,
                    };
                    console.log(newUser);
                    try {
                        const { data } = await api.createUser(newUser);
                        console.log(data);
                        setModalContent('Account Created Succesfully!!');
                        setCreated(true);
                    } catch (error) {
                        if (error.message === 'Request failed with status code 409')
                            setModalContent("Either Gmail or Username is alredy exist!!")
                    }
                }
                else
                    setModalContent('Enter a valid Email id!!');
            } catch (error) {
                console.log(error.message);
                setModalContent('Email Verification Failed API Server Down!!')
            }
        }
        setIsLoading(false);
        setShowModal(true)
    };

    return (
        <div className="container_signup">
            {created && <Redirect to={`/`} />}
            {isLoading &&
                <div className="loader">
                    <div className="loader_in">
                        <Loader />
                    </div>
                </div>
            }
            <div className="signup_top">
                <h1><kbd>Signup On<br />ToConnect</kbd></h1>
            </div>
            <br />
            <div className={showModal ? "modal_signup show_class" : "modal_signup"}>
                <div className="signup_modal_base">
                    <Modal modalContent={modalContent} />
                </div>
            </div>

            <form onSubmit={submitHandler}>
                <section className="signup_section">

                    <div className="leftbox">
                        <div>
                            <div className="signup_image">
                                <img width='200' height="200" src={selectedFile ? selectedFile : defaultUserImage} alt=""/>
                            </div>
                            <div id="signup_img_upload">
                                <div className="filebase">
                                    <FileBase
                                        type="file"
                                        multiple={false}
                                        onDone={({ base64 }) => setSelectedFile(base64)}
                                        id="file_id"
                                        accept="image/jpeg"
                                    />
                                </div>
                                <div className="choose_image">Choose Image</div>
                            </div>
                        </div>
                    </div>

                    <section className="main_section">
                        <section className="left_section">
                            <div className="signup_logo">
                                <h1>To<br />Connect</h1>
                            </div>
                            <br />
                            <input
                                type="text"
                                name="username_signup"
                                id="username_signup"
                                ref={username}
                                placeholder="Username"
                            />
                            <br />
                            <input
                                type="password"
                                name="password_signup"
                                id="password_signup_1"
                                ref={password_1}
                                placeholder="Password"
                            />
                            <br />
                            <input
                                type="password"
                                id="password_signup_2"
                                ref={password_2}
                                placeholder="Confirm Password"
                            />
                            <br />
                            <input
                                type="text"
                                id="fullname"
                                name="fullname"
                                ref={fullname}
                                placeholder="Full Name"
                            />
                            <br />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                ref={email}
                                placeholder="Email (Valid)"
                            />
                            <br />
                            <span className="sex" onChange={(e) => setSex(e.target.value)}>
                                <div>
                                    <label htmlFor="sex" id="sex">Sex </label>
                                </div>
                                <div className="sex2">
                                    <label htmlFor="male"> Male </label>
                                    <input type="radio" name="sex" id="male" value="male" />
                                    <label htmlFor="female"> Female </label>
                                    <input type="radio" name="sex" id="female" value="female" />
                                    <label htmlFor="other"> Others </label>
                                    <input type="radio" name="sex" id="other" value="male" />
                                </div>
                            </span>
                            <br />
                            <input
                                type="checkbox"
                                id="ps_show"
                                onChange={showPass}
                            />
                            <span>Show password</span>
                            <br />
                            <div className="signup_btns">
                                <button type="submit">SignUp</button>
                            </div>
                            <div className="left_last">
                                <Link to={`/`} className="signup_left_last">
                                    Alredy Have an Account
                                </Link>
                            </div>
                        </section>
                        <section className="right_section">
                            <Link to={`/`} className="signup_image_bg">
                                <div id="login_div"><h4>Click Here to</h4><br /> Login</div>
                            </Link>
                        </section>
                    </section>
                </section>

            </form>
        </div >
    )
}
export default SignUp;
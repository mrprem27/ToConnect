import React, { useRef, useState, useEffect } from "react";
import Modal from './Model/Modal'
import { Link, Redirect } from 'react-router-dom'
import * as api from '../../api'
import Loader from '../Loader/Loader';
import './styleLogin.css'
const Login = () => {
    const username = useRef(null);
    const password = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [isLogined, setIsLogined] = useState('');
    const [idc, setIdc] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    useEffect(async () => {
        try {
            const { data } = await api.checkLogined();
            setIdc(data.idc);
            setIsLogined('logined');
        } catch (error) {
            if (error.message === 'Request failed with status code 401') setIsLogined('notLogined');
            console.log("no user logined!!");
        }
        setIsLoading(false);
    }, [])

    const showPass = () => {
        if (
            password.current.getAttribute("type") !== "text")
            password.current.setAttribute("type", "text");
        else
            password.current.setAttribute("type", "password");
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (!username.current.value || !password.current.value) {
            setModalContent('You missed to enter your Credentials!!');
        }
        else if (username.current.value.length < 3) {
            setModalContent('Username should have minimum length of 3 Characters!!')
        }
        else if (password.current.value.length < 6) {
            setModalContent('Password should have minimum length of 6 Characters!!')
        }
        else {
            try {
                const { data } = await api.checkUser({ username: username.current.value, password: password.current.value });
                if (data.message) {
                    setModalContent('Login Successfully!!');
                    setIdc(data.userId);
                    setIsLogined('logined');
                }
                else
                    setModalContent('Wrong Credentials!!');
            } catch (error) {
                setModalContent('SERVER ERROR!!');
                console.log(error.message);
            }
        }
        setIsLoading(false);
        setShowModal(true)
    };
    return (
        <div>
            {isLogined === 'logined' && <Redirect to={`/user/get/${idc}`} />}
            {isLogined === 'notLogined' && <div className="container_login">
                {isLoading &&
                    <div className="loader">
                        <div className="loader_in">
                        <Loader />
                        </div>
                    </div>
                }
                <div className="login_top">
                    <h1><kbd>Login On<br />ToConnect</kbd></h1>
                </div>

                <br />
                <div className={showModal ? "modal_login show_class" : "modal_login"}>
                    <div className="login_modal_base">
                        <Modal modalContent={modalContent} />
                    </div>
                </div>

                <div className="section_holder">
                    <section className="main_section">
                        <section className="left_section">
                            <form onSubmit={submitHandler}>
                                <div className="login_logo">
                                    <h1>To<br />Connect</h1>
                                </div>
                                <br />
                                <input
                                    type="text"
                                    name="username_login"
                                    id="username_login"
                                    ref={username}
                                    placeholder="Username"
                                />
                                <br />
                                <input
                                    type="password"
                                    name="password_login"
                                    id="password_login_1"
                                    ref={password}
                                    placeholder="Password"
                                />
                                <br />
                                <input
                                    type="checkbox"
                                    id="ps_show"
                                    onChange={showPass}
                                />
                                <span>Show password</span>
                                <br />
                                <div className="login_btns">
                                    <button type="submit">Login</button>
                                </div>
                                <div className="l_left_last">
                                    <Link to={`/signup`} className="login_left_last">
                                        Create an Account
                                    </Link>
                                </div>
                            </form>
                        </section>
                        <section className="right_section">
                            <Link to={`/signup`} className="login_image_bg">
                                <div id="signup_div"><h4>Don't have an account!!</h4><br /> Create One!!</div>
                            </Link>
                        </section>
                    </section>
                </div>
            </div>
            }
        </div >
    );
};
export default Login;

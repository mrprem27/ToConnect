import React, { useState, useRef, useEffect } from "react";
import Friends from '../Friends/Friends'
import * as api from '../../api/index'
import { Redirect, useHistory } from "react-router-dom";
import './styleSearch.css'
import Loader from '../Loader/Loader';

const Search = () => {
    const history = useHistory();
    const search = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setfilteredUsers] = useState([]);
    const [isLogined, setIsLogined] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await api.fetchAllUsers();
                setUsers(data);
                setfilteredUsers(data);
            } catch (error) {
                if (error.message === 'Request failed with status code 401') setIsLogined(false);
                console.log(error.message);
            }
            setIsLoading(false);
        }
        fetchData();
    }, []);

    const changeHandler = async (e) => {
        setfilteredUsers(users.filter((u) => e.target.value.lengthz !== 0 ? u.username.includes(e.target.value) : true))
    }
    // const submitHandler = async (e) => {
    //     e.preventDefault();
    //     if (!search.current.value) {
    //         try {
    //             const { data } = await api.fetchAllUsers();
    //             setUsers(data)
    //             console.log(data);
    //         } catch (error) {
    //             console.log(error.message);
    //         }
    //     }
    //     else {
    //         try {
    //             const { data } = await api.fetchSearchUsers(search.current.value);
    //             setUsers(data)
    //             console.log(data);
    //         } catch (error) {
    //             console.log(error.message);
    //         }
    //     }
    // }
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
            {/* <form onSubmit={(e) => submitHandler(e)}> */}
            {users.length > 0 && <div className="search_container">
                <div className="search_form_cover">
                    <div>
                        <button onClick={() => history.goBack()}>Back</button>
                    </div>
                    <form>
                        <input type="text" name="search" placeholder="Type Username To find" id="search" ref={search} onChange={(e) => changeHandler(e)} />
                        <button disabled>Search</button>
                    </form>
                </div>
                <div className="search_output">
                    <div className="search_result">
                        <h4>Results</h4>
                    </div>
                    <div>
                        {filteredUsers.length > 0 ? <Friends friends={filteredUsers} /> : <div className="no_users">No users Found!!🙁</div>}
                    </div>
                </div>
            </div>}
        </div>
    )
}
export default Search;
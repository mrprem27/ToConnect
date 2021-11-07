import React, { useState, useEffect } from "react";
import Request from "./Reuests/Request";
import * as api from '../../api'
import { Redirect, useHistory, Link } from "react-router-dom";
import './styleRequests.css'
import Loader from '../Loader/Loader';
const Requests = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [isLogined, setIsLogined] = useState(true);
    const acceptRequest = async (id) => {
        try {
            setIsLoading(true);
            const { data } = await api.acceptRequestFriend(id);
            console.log("Request accepted");
            try {
                const { data } = await api.fetchRequests();
                setRequests(data);
                console.log("These are Requests!!");
            } catch (error) {
                console.log(error.message);
            }
        } catch (error) {
            console.log(error.message);
        }
        setIsLoading(false);
    }
    const cancelRequest = async (id) => {
        try {
            setIsLoading(true);
            const { data } = await api.cancelRequest(id);
            console.log("Request Canceled!!");
            try {
                const { data } = await api.fetchRequests();
                setRequests(data);
                console.log("These are Requests!!");
            } catch (error) {
                console.log(error.message);
            }
        } catch (error) {
            console.log(error.message);
        }
        setIsLoading(false);
    }
    useEffect(async () => {
        async function fetchData() {
            try {
                const { data } = await api.fetchRequests();
                setRequests(data);
                console.log("These are Requests!!");
            } catch (error) {
                if (error.message === 'Request failed with status code 401') setIsLogined(false);
                console.log(error.message);
            }
            setIsLoading(false);
        }
        fetchData();
    }, []);
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
            <div className="requests_container">
                <div className="requests_top">
                    <button onClick={() => history.goBack()}>Back</button>
                    <h2>Requests</h2>
                    <Link exact to={`/chats`}><button>Chats</button></Link>
                </div>
                <br />
                <div className="requests_results_cover">
                    {requests.length > 0 ? <div className="requests_results">
                        {requests.map((user) => <Request user={user} acceptRequest={acceptRequest} cancelRequest={cancelRequest} />)}
                    </div> : <div className="no_requests">No Requests🙁</div>}
                </div>
            </div>
        </div>
    )
}
export default Requests;
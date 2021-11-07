import axios from 'axios';

const url = 'http://localhost:5000';
//User related connection
export const fetchAllUsers = () => axios.get(url + `/user/search/allusers`);
export const fetchSearchUsers = (str) => axios.get(url + `/user/search/query/${str}`);
export const fetchUser = (id) => {
    const urlf = url + `/user/get/${id}`;
    return axios.get(urlf);
}
//login and signup and edit related
export const createUser = (newUser) => axios.post(url + `/user/signup`, newUser);
export const checkUser = (userLogin) => axios.post(url + `/user/login`, userLogin);
export const checkLogined = () => axios.get(url + `/user/logincheck`);
export const logout = () => axios.patch(url + `/user/logout`);
export const editUser = (userData) => axios.put(url + `/user/edit`, userData);


//Making Friend related connection
export const addFriend = (id) => axios.patch(url + `/user/friends/add/${id}`);
export const removeFriend = (id) => axios.patch(url + `/user/friends/remove/${id}`);
export const removeRequestFriend = (id) => axios.patch(url + `/user/friends/removeRequest/${id}`);
export const acceptRequestFriend = (id) => axios.patch(url + `/user/friends/acceptRequest/${id}`);
export const cancelRequest = (id) => axios.patch(url + `/user/friends/cancel/${id}`);
export const fetchFriends = (id) => axios.get(url + `/user/friends/${id}`);

//Request related connections
export const fetchRequests = () => axios.get(url + `/user/requests`);


//Group Related Connections
export const createGroup = (newgroup) => axios.post(url + `/group/creategroup`, newgroup);
export const addFriendToGroup = ({ id, idg }) => axios.patch(url + `/group/add/${idg}/${id}`);
export const fetchGroups = () => axios.get(url + `/group/allgroups`);
export const fetchGroupSingle = (idg) => axios.get(url + `/group/single/${idg}`);
export const removeFriendToGroup = ({ id, idg }) => axios.get(url + `/group/remove/${idg}/${id}`);
export const editGroupName = ({ newData, idg }) => axios.put(url + `/group/edit/name`, { newData, idg });
export const fetchForAddToGroup = (idg) => axios.get(url + `/group/fetchtoadd/${idg}`);
export const finalSumbitGroupData = ({ idg, finalData }) => axios.put(url + `/group/toadd/`, { idg, finalData });

//chats reated connections
export const fetchChats = () => axios.get(url + `/chat/allchats`);
export const fetchChatSingle = (id) => axios.get(url + `/chat/single/${id}`);
export const fetchGroupChatSingle = (idg) => axios.get(url + `/chat/groupmessage/${idg}`);
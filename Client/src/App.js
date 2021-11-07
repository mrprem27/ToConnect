import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Chat from './components/Chats/Chat/Chat'
import Chats from './components/Chats/Chats'
import G_i from './components/Groups/Gi'
import G_create from './components/Groups/Group-create/GCreate'
import Login from './components/Login/Login'
import SignUp from './components/Signup/Registeration'
import Search from './components/Search/Search'
import User from './components/User/User'
import Requests from './components/Requests/Requests';
import GroupChatNew from './components/GroupChatNew/GroupChatNew';
// import NoPage from './components/NoPage/NoPage';

import axios from 'axios';
axios.defaults.withCredentials = true;
// if (!localStorage.getItem('myAppLoginIdForVerification'));
// localStorage.setItem('myAppLoginIdForVerification', '')


function App() {
  return (
    <Router>
      <Route exact path="/" component={Login} />
      <Route exact path="/chats" component={Chats} />
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/GI/view/:idg" component={G_i} />
      <Route exact path="/G_create" component={G_create} />
      <Route exact path="/user/get/:id" component={User} />
      <Route exact path="/search" component={Search} />
      <Route exact path="/requests" component={Requests} />
      <Route exact path="/chat/single/:id" component={Chat} />
      <Route exact path="/chatto/group/:idg" component={GroupChatNew} />
      {/* <Route path="/" component={NoPage} /> */}
    </Router>
  );
}

export default App;

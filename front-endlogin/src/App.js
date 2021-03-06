import React, {useState,useEffect} from 'react';
import {BrowserRouter as Router, Switch,Route} from "react-router-dom";
import Home from "./components/pages/Home"
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Header from "./components/layout/Header";
import Admin from "./components/pages/Admin";
import Student from "./components/pages/Student";
import UserContext from "./context/UserContext";
import Axios from 'axios';

import "./style.css";

export default function App(){
    const [userData, setUserData] = useState({
      token: undefined,
      user: undefined,
    });

    useEffect(()=>{
        const checkLoggedIn = async () => {
            let token = localStorage.getItem("auth-token");
            if(token==null){
                localStorage.setItem("auth-token","");
                token = "";
            }
            const tokenRes = await Axios.post(
                "http://localhost:5000/users/tokenIsValid",
                null,
                {headers: {"x-auth-token":token}}
            );
                if (tokenRes.data) {
                const userRes = await Axios.get("http://localhost:5000/users/", {
                    headers: { "x-auth-token": token },
                });
                setUserData({
                    token,
                    user: userRes.data,
                });
            }
        };
    checkLoggedIn();
    },[]);

    return (
        <>
        <Router>
            <UserContext.Provider value={{userData, setUserData}}>
            <Header/>
            <div className={"container"}>
            <Switch>
                <Route exact path={"/"} component={Login}/>
                <Route path={"/register"} component={Register}/>
                <Route path={"/admin"} component={Admin}/>
                <Route path={"/student"} component={Student}/>
            </Switch>
            </div>
            </UserContext.Provider>
        </Router>

            <footer>
                <h4 id={"footer"}>Copyright @ GITAM University,Bengaluru</h4>
            </footer>
    </>
    );
}
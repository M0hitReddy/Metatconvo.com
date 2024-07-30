import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { Cookie } from 'lucide-react';

function Callback() {
    const { loggedIn, checkLoginState, user } = useContext(AuthContext);
    const called = useRef(false);
    const navigate = useNavigate()
    useEffect(() => {
        (async () => {
            if (!loggedIn) {
                try {
                    if (called.current) return;
                    called.current = true;
                    const res = await axios.get('http://localhost:5000/auth/token' + window.location.search, { withCredentials: true })
                    console.log(res.data.token);
                    checkLoginState()
                    navigate('/');
                }
                catch (err) {
                    console.error(err);
                    navigate('/');
                }
            }
            else {
                navigate('/');
            }
        })();
    }, [checkLoginState, loggedIn, navigate]);
    return (
        <>
        </>
    )
}

export default Callback;
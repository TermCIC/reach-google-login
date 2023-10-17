import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

const App = () => {
    const [time, setTime] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    const fetchTime = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/greet');
            setTime(response.data.message);
            setError('');
        } catch (error) {
            console.error("Error fetching time: ", error);
            setError('Error fetching time');
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchTime();
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const responseGoogle = async (response) => {
        console.log(response);
        if (response.tokenId) {
            try {
                const serverResponse = await axios.post("http://localhost:5000/login/authorized", {
                    tokenId: response.tokenId
                });

                const { data } = serverResponse;
                if (data && data.email) {
                    setUser({
                        id: data.googleId,
                        name: data.name,
                        email: data.email,
                        imageUrl: data.imageUrl
                    });
                }

            } catch (error) {
                console.error("Error during the backend authentication:", error);
            }
        }
    };

    const logout = async () => {
        try {
            await axios.post("http://localhost:5000/logout");
        } catch (error) {
            console.error("Error logging out:", error);
        }
        setUser(null);
    };

    return (
        <>
            <div className="status status-text">
                {time}{error && <p>{error}</p>}
                {user ? (
                    <div>
                        <img src={user.imageUrl} alt={user.name} />
                        <h2>Welcome, {user.name}!</h2>
                        <p>{user.email}</p>
                        <GoogleLogout
                            clientId="455103817598-fulqe214n8rakmdgdq5lht5g5hupi8co.apps.googleusercontent.com"
                            buttonText="Logout"
                            onLogoutSuccess={logout}
                        />
                    </div>
                ) : (
                    <GoogleLogin
                        clientId="455103817598-fulqe214n8rakmdgdq5lht5g5hupi8co.apps.googleusercontent.com"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                )}
            </div>

            <div className="control">
                <img className="head" src="" alt="Artistic Representation" />
            </div>

            <div className="content">
                {/* Content goes here */}
            </div>

            <div className="message">
                {/* Additional messages/content can be placed here */}
            </div>

            <div className="copyright">
                <br />
                <a style={{fontStyle: "italic", fontSize: "100%", color: "#B59410", textAlign: "center"}}>
                    Copyright @ 2023, all rights reserved.
                </a>
            </div>
        </>
    );
};

export default App;

import React, { useEffect, useState } from "react";
import "./apiCss.css";

const ApiPage = () => {
    const [users, setUsers] = useState([]);

    const fetchUserData = () => {
        fetch("https://api.coincap.io/v2/assets")
            .then(response => response.json())
            .then(data => {
                setUsers(data.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
    <body>
        <div>
            <h1 className="title">Api Demsontration</h1>
            <h3 className="title">Coin Cap API</h3>
        </div>
        <div className="grid-container">
            {users.length > 0 && users.map(user => (
                <div key={user.id} className="grid-item">
                    <div className="name">{user.name}</div>
                    <div className="price">Price: {user.priceUsd}</div>
                </div>
            ))}
        </div>
    </body>
    );
}

export default ApiPage;

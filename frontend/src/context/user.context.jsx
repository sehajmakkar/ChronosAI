// purpose of user context?
// to share user data between components
// hume sirf user chahiye hoga jiske behalf pe hum dekhlenge ki user logged in hai ya nahi

import React, { createContext, useState, useContext } from 'react';

// Create the UserContext
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};


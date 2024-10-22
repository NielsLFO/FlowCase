// context/UserContext.js
import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userEmail, setUserEmail] = useState(null);
    const [userName, setUserName] = useState(null);
    const [roleId, setRoleId] = useState(null);
    const [scheduleId, setScheduleId] = useState(null);

    return (
        <UserContext.Provider 
            value={{ 
                userEmail, 
                setUserEmail, 
                userName, 
                setUserName,
                roleId, 
                setRoleId,
                scheduleId, 
                setScheduleId 
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

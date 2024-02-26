import React, { useState, useEffect } from "react";
import { getUserAccount } from '../service/userService'
import { useHistory } from "react-router-dom";
const UserContext = React.createContext(null);

const UserProvider = ({ children }) => {
    let history = useHistory();
    const userDefault = {
        isLoading: true,
        isAuthenticated: false,
        token: "",
        account: {}
    }

    const [user, setUser] = useState(userDefault)

    const loginContext = (userData) => {
        setUser({ ...userData, isLoading: false })
    }
    const logout = () => {
        setUser({ ...userDefault, isLoading: false })
    }

    const fetchUser = async () => {
        let response = await getUserAccount();
        if (response && response.data && response.data.EC === 0) {
            let groupWithRoles = response.data.DT.groupWithRoles
            let email = response.data.DT.email;
            let username = response.data.DT.username;
            let token = response.data.DT.access_token;

            let data = {
                isAuthenticated: true,
                token,
                account: { groupWithRoles, email, username },
                isLoading: false
            }
            setUser(data);
        } else {
            setUser({ ...userDefault, isLoading: false })
        }
    }
    useEffect(() => {
        
        // if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
        //     fetchUser();
        // } else {
        //     setUser({ ...user, isLoading: false })
        // }
        fetchUser();
    }, [])

    return (
        <UserContext.Provider value={{ user, loginContext, logout }}>
            {children}
        </UserContext.Provider>
    )

}

export { UserContext, UserProvider };
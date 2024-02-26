// import axios from 'axios';
import axios from '../setupAxios/axios'

const registerNewUser = (email, phone, username, password) => {
    return axios.post("/api/v1/register", {
        email, phone, username, password
    })
}

const userLogin = (valueLogin, password) => {
    return axios.post("/api/v1/login", { valueLogin, password })
}
const fetchAllUsers = (page, limit) => {
    return axios.get(`/api/v1/user/read?page=${page}&limit=${limit}`)// template string
}
const deleteUser = (user) => {
    return axios.delete("/api/v1/user/delete", { data: { id: user.id } })

}
const fetchAllGroup = () => {
    return axios.get(`/api/v1/group/read`)
}
const createNewUser = (userData) => {
    return axios.post(`/api/v1/user/create`, { ...userData })
}
const updateUser = (userData) => {
    return axios.put('/api/v1/user/update', { ...userData })
}
const getUserAccount = () => {
    return axios.get(`/api/v1/account`);
}
const logoutUser = () => {
    return axios.post(`/api/v1/logout`)
}

export {
    registerNewUser, userLogin, fetchAllUsers, deleteUser,
    fetchAllGroup, createNewUser, updateUser, getUserAccount,
    logoutUser
};
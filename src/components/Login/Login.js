import './Login.scss';
import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userLogin } from '../../service/userService';
import { UserContext } from '../../context/UserContext';


const Login = (props) => {
    const { user, loginContext } = useContext(UserContext);

    let history = useHistory();

    const [valueLogin, setValueLogin] = useState("");
    const [password, setPassword] = useState("")

    const defaultObjValidInput = {
        isValidValueLogin: true,
        isValidPassword: true,
    }
    const [objValidInput, setObjValidInput] = useState(defaultObjValidInput)
    const handleLogin = async () => {
        setObjValidInput(defaultObjValidInput);

        if (!valueLogin) {
            setObjValidInput({ ...defaultObjValidInput, isValidValueLogin: false })
            toast.error("Nhap email or sdt")
            return
        }
        if (!password) {
            setObjValidInput({ ...defaultObjValidInput, isValidPassword: false })
            toast.error("Nhap mat khau")
            return
        }

        let response = await userLogin(valueLogin, password);
        if (response && response.data && +response.data.EC === 0) {
            //success
            let groupWithRoles = response.data.DT.groupWithRoles;
            let email = response.data.DT.email;
            let username = response.data.DT.username;
            let token = response.data.DT.access_token;
            let data = {
                isAuthenticated: true,
                token,
                account: {
                    groupWithRoles, email, username
                }
            }
            localStorage.setItem('jwt', token)
            loginContext(data);
            history.push('/users');
            //window.location.reload();
        }
        if (response && response.data && +response.data.EC !== 0) {
            toast.error(response.data.EM)
        }

    }

    const handleCreateNewAccount = () => {
        history.push("/register")
    }
    const handlePressEnter = (event) => {
        if (event.charCode === 13 && event.code === 'Enter') {
            handleLogin();
        }
    }
    useEffect(() => {
        if (user && user.isAuthenticated) {
            history.push('/');
            console.log(user)
        }
    })
    return (
        <div className="login-container">
            <div className="container">
                <div className="row px-3 px-sm-0">
                    <div className="content-left col-sm-7 d-sm-block col-12 d-none ">
                        <div className='brand'>
                            WELCOME
                        </div>
                        <div className='detail'>
                            .........................
                        </div>
                    </div>
                    <div className="content-right col-sm-5 col-12  d-flex flex-column gap-3 py-3 ">
                        <div className='brand d-sm-none'>
                            Hoi dan It
                        </div>
                        <input type="text" className={objValidInput.isValidValueLogin ? 'form-control' : 'form-control is-invalid'}
                            placeholder='Emmail addres or phone number'
                            value={valueLogin} onChange={(event) => setValueLogin(event.target.value)} required
                        />

                        <input type="password" className='form-control' placeholder='Password'
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            onKeyPress={(event) => handlePressEnter(event)}

                        />
                        <button className='btn btn-primary' onClick={() => handleLogin()}>
                            Login
                        </button>
                        <span className='text-center'><a className='forgot-password' href='#'>Forgot Your password?</a></span>
                        <hr />
                        <div className='text-center'>
                            <button className='btn btn-success' onClick={() => handleCreateNewAccount()}>
                                Create new account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
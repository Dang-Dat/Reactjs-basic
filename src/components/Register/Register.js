import './Register.scss';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerNewUser } from '../../service/userService'
import { UserContext } from '../../context/UserContext';
const Register = (props) => {
    const { user } = useContext(UserContext)

    const [email, setEmail] = useState("");
    const [phone, setphone] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const defaultValidInput = {
        isValidEmail: true,
        isValidPhone: true,
        isValidPassword: true,
        isValidConfirmPassword: true,
    }

    const [objectCheckInput, setObjectCheckInput] = useState(defaultValidInput)
    let history = useHistory();
    const handleLogin = () => {
        history.push("/Login")
    }

    useEffect(() => {
        if (user && user.isAuthenticated) {
            history.push('/');
            console.log(user)
        }
    }, []);


    const isValidInputs = () => {
        setObjectCheckInput(defaultValidInput);
        if (!email) {
            toast.error("Email is required!");
            setObjectCheckInput({ ...defaultValidInput, isValidEmail: false });
            return false
        }
        let reg = /\S+@\S+\.\S+/;
        if (!reg.test(email)) {
            setObjectCheckInput({ ...defaultValidInput, isValidEmail: false });
            toast.error("need!");
            return false
        }
        if (!phone) {
            toast.error("Phone is required!");
            setObjectCheckInput({ ...defaultValidInput, isValidPhone: false });
            return false
        }
        if (!username) {
            toast.error("username is required!");
            return false
        }
        if (!password) {
            toast.error("Password is required!");
            setObjectCheckInput({ ...defaultValidInput, isValidPassword: false });
            return false
        }
        if (password != confirmPassword) {
            toast.error("your Password is not same!");
            setObjectCheckInput({ ...defaultValidInput, isValidConfirmPassword: false });
            return false
        }

        return true
    }

    const handleRegister = async () => {

        let check = isValidInputs();
        if (check == true) {
            let response = await registerNewUser(email, phone, username, password);
            let serverData = response.data;
            if (+serverData.EC === 0) {
                toast.success(serverData.EM)
                history.push("/login")
            }
            else {
                toast.error(serverData.EM)
            }
        }
    }

    return (
        <div className="register-container">
            <div className="container">
                <div className="row px-3 px-sm-0">
                    <div className="content-left col-sm-7 d-sm-block col-12 d-none ">
                        <div className='brand'>
                            Hoi Dan IT
                        </div>
                        <div className='detail'>
                            Learning everything 11111111111111111111111111111111111111111
                        </div>
                    </div>
                    <div className="content-right col-sm-5 col-12  d-flex flex-column gap-3 py-3 ">
                        <div className='brand d-sm-none'>
                            Hoi dan It
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input type="text" className={objectCheckInput.isValidEmail ? 'form-control' : 'form-control is-invalid'} placeholder='Emmail addres '
                                value={email} onChange={(event) => setEmail(event.target.value)} required
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone number:</label>
                            <input type="text" className={objectCheckInput.isValidPhone ? 'form-control' : 'form-control is-invalid'} placeholder='Phone number '
                                value={phone} onChange={(event) => setphone(event.target.value)} required
                            />
                        </div>
                        <div className="form-group">
                            <label>User name:</label>
                            <input type="text" className='form-control' placeholder='User name '
                                value={username} onChange={(event) => setUsername(event.target.value)} required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <input type="password" className={objectCheckInput.isValidPassword ? 'form-control' : 'form-control is-invalid'} placeholder='Password'
                                value={password} onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Re-enter Password:</label>
                            <input type="password" className={objectCheckInput.isValidConfirmPassword ? 'form-control' : 'form-control is-invalid'} placeholder='Re-enter Password'
                                value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)}
                            />
                        </div>

                        <button className='btn btn-primary' type='submit' onClick={() => handleRegister()}>
                            Register
                        </button>

                        <hr />
                        <div className='text-center'>
                            <button className='btn btn-success' onClick={() => handleLogin()}>
                                Already account?Log In
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;
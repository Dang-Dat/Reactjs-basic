import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './Users.scss';
import { fetchAllGroup, createNewUser, updateUser } from '../../service/userService'
import { toast } from 'react-toastify';
import _ from "lodash";
//not merge state
const ModalUser = (props) => {
    const { action, dataModalUpdate } = props;

    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [sex, setSex] = useState("");
    const [group, setGroup] = useState("");

    const defaultUserData = {
        email: '',
        phone: '',
        username: '',
        password: '',
        address: '',
        sex: '',
        group: '',
    }
    const validInputDefault = {
        email: true,
        phone: true,
        username: true,
        password: true,
        address: true,
        sex: true,
        group: true,
    }


    const [userData, setUserData] = useState(defaultUserData);
    const [userGroup, setUserGroup] = useState([]);
    const [validInputs, setValidInputs] = useState(validInputDefault);

    useEffect(() => {
        getGroup();
    }, [])
    useEffect(() => {
        if (action === 'UPDATE') {
            setUserData({ ...dataModalUpdate, group: dataModalUpdate.Group ? dataModalUpdate.Group.id : '' });
        }
    }, [dataModalUpdate])
    useEffect(() => {
        if (action === 'CREATE') {
            if (userGroup && userGroup.length > 0) {
                setUserData({ ...userData, group: userGroup[0].id })
            }
        }


    }, [action])
    const getGroup = async () => {
        let response = await fetchAllGroup();
        if (response && response.data && response.data.EC === 0) {
            setUserGroup(response.data.DT)
            if (response.data.DT && response.data.DT.length > 0) {
                let groups = response.data.DT;
                setUserData({ ...userData, group: groups[0].id });

            }
        } else {
            toast.error(response.data.EM)
        }
    }
    const handleOnchangeInput = (value, name) => {
        let _userData = _.cloneDeep(userData)
        _userData[name] = value;
        setUserData(_userData);
    }
    const checkValidateInputs = () => {
        if (action === 'UPDATE') return true;
        setValidInputs(validInputDefault);
        let arr = ['email', 'phone', 'password', 'group'];
        let check = true;
        for (let i = 0; i < arr.length; i++) {
            if (!userData[arr[i]]) {
                let _validInputs = _.cloneDeep(validInputDefault);
                _validInputs[arr[i]] = false;
                setValidInputs(_validInputs)

                toast.error(`Empty input ${arr[i]}`);
                check = false;
                break;
            }
        }
        return check;
        //     setValidInputs(validInputDefault);
        //     if (!userData.email) {
        //         toast.error("Email is required!");
        //         setValidInputs({ ...validInputDefault, email: false });
        //         return false
        //     }
        //     let reg = /\S+@\S+\.\S+/;
        //     // if (!reg.test(email)) {
        //     //     setValidInputs({...validInputDefault, email: false});
        //     //     toast.error("need!");
        //     //     return false
        //     // }
        //     let checkPasswordWhitespace = /\s/;

        //     if (!userData.phone || checkPasswordWhitespace.test(userData.phone)) {
        //         toast.error("Phone is required or space !");
        //         setValidInputs({ ...validInputDefault, phone: false });
        //         return false
        //     }
        //     if (!userData.password || checkPasswordWhitespace.test(userData.password)) {
        //         toast.error("Password is required or space! ");
        //         setValidInputs({ ...validInputDefault, password: false });
        //         return false
        //     }
        //     if (!userData.group) {
        //         toast.error("Group is required!");
        //         setValidInputs({ ...validInputDefault, group: false });
        //         return false
        //     }
        //     return true
    }

    const hadleConfirmUser = async () => {
        let check = checkValidateInputs();
        if (check === true) {

            let response = action === 'CREATE' ?
                await createNewUser({ ...userData, groupId: userData[`group`] }) : await updateUser({ ...userData, groupId: userData[`group`] });

            if (response.data && response.data.EC === 0) {
                props.onHide();
                setUserData({ ...defaultUserData, group: userGroup && userGroup.length > 0 ? userGroup[0].id : '' });
                toast.success(response.data.EM)
            } else {
                toast.error("error create");
                let _validInputs = _.cloneDeep(validInputDefault);
                _validInputs[response.data.DT] = false;
                setValidInputs(_validInputs)
            }
        }
    }
    const handleCloseModalUser = () => {
        props.onHide();
        setUserData(defaultUserData)
        setValidInputs(validInputDefault);
    }
    return (
        <>
            <Modal size="lg" show={props.show} className='modal-user'>
                <Modal.Header closeButton onHide={() => handleCloseModalUser()} >
                    <Modal.Title id="contained-modal-title-vencenter">
                        <span>{props.action === 'CREATE' ? 'CREATE NEW USER' : 'EDIT USER'}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='content-body row'>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Emmail (<span className='red'>*</span>) :</label>
                            <input disabled={action === 'CREATE' ? false : true}
                                className={validInputs.email ? 'form-control' : 'form-control is-invalid'} type="email"
                                value={userData.email} onChange={(event) => handleOnchangeInput(event.target.value, "email")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Phone number (<span className='red'>*</span>) :</label>
                            <input disabled={action === 'CREATE' ? false : true}
                                className={validInputs.phone ? 'form-control' : 'form-control is-invalid'} type="text" value={userData.phone}
                                onChange={(event) => handleOnchangeInput(event.target.value, "phone")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Username:</label>
                            <input className='form-control' type="text" value={userData.username}
                                onChange={(event) => handleOnchangeInput(event.target.value, "username")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group' >
                            {
                                action === 'CREATE'
                                &&
                                <>
                                    <label>Password (<span className='red'>*</span>) :</label>
                                    <input className={validInputs.password ? 'form-control' : 'form-control is-invalid'} type="password" value={userData.password}
                                        onChange={(event) => handleOnchangeInput(event.target.value, "password")}
                                    />
                                </>
                            }

                        </div>
                        <div className='col-12 col-sm-12 form-group' >
                            <label>Address :</label>
                            <input className='form-control' type="text" value={userData.address}
                                onChange={(event) => handleOnchangeInput(event.target.value, "address")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Gender: </label>
                            <select className='form-select' onChange={(event) => handleOnchangeInput(event.target.value, "sex")}
                                value={userData.sex}
                            >
                                <option value="Nam">Nam</option>
                                <option value="Nu">Nu</option>
                                <option value="Khac">Khac</option>
                            </select>
                        </div>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Group (<span className='red'>*</span>) :</label>
                            <select className={validInputs.group ? 'form-select' : 'form-select is-invalid'}
                                onChange={(event) => handleOnchangeInput(event.target.value, "group")}
                                value={userData.group}
                            >
                                {userGroup.length > 0 &&
                                    userGroup.map((item, index) => {
                                        return (
                                            <option key={`group-${index}`} value={item.id}>{item.name}</option>
                                        )

                                    })
                                }

                            </select>
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModalUser()}>close</Button>
                    <Button variant="primary" onClick={() => hadleConfirmUser()}>
                        {action === 'CREATE' ? 'Create' : 'Update'}
                    </Button>
                </Modal.Footer>


            </Modal >
        </>
    )
}

export default ModalUser;
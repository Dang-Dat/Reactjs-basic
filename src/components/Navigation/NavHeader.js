import React, { useEffect, useState, useContext } from 'react';
import './Nav.scss';
import { BrowserRouter as Router, Route, NavLink, Link } from 'react-router-dom';
import { useLocation, useHistory } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { logoutUser } from '../../service/userService'
import { toast } from 'react-toastify';
import { assign } from 'lodash';
// import logo192.png from 
const NavHeader = (props) => {
    const { user, logout } = useContext(UserContext);

    const location = useLocation();
    const history = useHistory();

    const handleLogoutUser = async () => {
        let data = await logoutUser();
        localStorage.removeItem('jwt');

        if (data && +data.data.EC === 0) {
            logout();
            history.push('/login')
            toast.success('Logout successed')

        }
        else {
            toast.error(data.EM)
        }
    }

    if (user && user.isAuthenticated === true || location.pathname === '/' || location.pathname === '/about') {

        return (
            <>
                {/* <div className="topnav">
                    <NavLink exact to="/"  >Home</NavLink>
                    <NavLink to="/users">User</NavLink>
                    <NavLink to="/project">project</NavLink>
                    <NavLink to="/contact">Contact</NavLink>

                </div> */}
                <div className='nav-header'>
                    <Navbar expand="lg" className="bg-body-tertiary">
                        <Container>
                            <Navbar.Brand href="#home">
                                <img
                                    src="/img/logo.svg"
                                    width="30"
                                    height="30"
                                    className="d-inline-block align-top"
                                // alt="React Bootstrap logo"
                                />
                                <span className='brand-name'>React</span>
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto">
                                    <NavLink className='nav-link' exact to="/"  >Home</NavLink>
                                    <NavLink className='nav-link' to="/users">Users</NavLink>
                                    <NavLink className='nav-link' to="/roles">Roles</NavLink>
                                    <NavLink className='nav-link' to="/group-role">Group Role</NavLink>
                                    <NavLink className='nav-link' to="/project">Projects</NavLink>
                                    <NavLink className='nav-link' to="/contact">Contact</NavLink>


                                </Nav>
                                <Nav>
                                    {user && user.isAuthenticated === true
                                        ?
                                        <>
                                            <Nav.Item className='nav-link'>Welcome {user.account.username}</Nav.Item>
                                            <NavDropdown title="Settings" id="basic-nav-dropdown">
                                                <NavDropdown.Item >Đổi mật khẩu</NavDropdown.Item>

                                                <NavDropdown.Divider />
                                                <NavDropdown.Item >
                                                    <span onClick={() => handleLogoutUser()}>
                                                        LogOut
                                                    </span>
                                                </NavDropdown.Item>
                                            </NavDropdown>
                                        </>
                                        :
                                        <Link className='nav-link' to="/login">Login</Link>
                                    }
                                </Nav>
                            </Navbar.Collapse>

                        </Container>
                    </Navbar>
                </div>
            </>

        );
    } else {
        return <></>
    }
}

export default NavHeader;
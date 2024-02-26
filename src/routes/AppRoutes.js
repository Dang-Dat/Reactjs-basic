import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Register from '../components/Register/Register.js';
import Users from '../components/ManageUsers/Users.js';
import Login from '../components/Login/Login.js';
import Project from '../components/Project/Project.js'
import PrivateRoutes from "./PrivateRoutes.js";
import Role from '../components/Role/Role.js'
import GroupRole from "../GroupRole/GroupRole.js";
const AppRoutes = (props) => {
    return (
        <>

            <Switch>
                <PrivateRoutes path="/users" component={Users} />
                <PrivateRoutes path="/project" component={Project} />
                <PrivateRoutes path="/roles" component={Role} />
                <PrivateRoutes path="/group-role" component={GroupRole} />
                <Route path="/register">
                    <Register />
                </Route>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/" exact>
                    HOME
                </Route>
                <Route path="*">
                    404 not found
                </Route>
            </Switch>

        </>
    )
}

export default AppRoutes;
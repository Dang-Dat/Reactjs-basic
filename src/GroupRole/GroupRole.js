import './Grouprole.scss'
import { useState, useEffect } from 'react';
import { fetchAllGroup, createNewUser, updateUser } from '../service/userService'
import { fetchAllRoles, deleteRole, fetchRolesByGroup, assignRolesToGroup } from '../service/roleService';
import { toast } from 'react-toastify';
import { values } from 'lodash';
import _ from 'lodash'
const GroupRole = () => {

    const [userGroup, setUserGroup] = useState([]);
    const [selectGroup, setselectGroup] = useState("");
    const [listRoles, setListRoles] = useState();
    const [assignRolesByGroup, setAssignRolesByGroup] = useState([]);

    useEffect(() => {
        getGroup();
        getAllRoles();
    }, [])
    const getGroup = async () => {
        let response = await fetchAllGroup();
        if (response && response.data && response.data.EC === 0) {
            setUserGroup(response.data.DT)
        } else {
            toast.error(response.data.EM)
        }
    }
    const getAllRoles = async () => {
        let response = await fetchAllRoles();
        if (response && response.data.EC === +0) {
            setListRoles(response.data.DT)
        }
    }

    const handleOnchangeSelect = () => {

    }
    const handleOnchangeGroup = async (value) => {
        setselectGroup(value);
        if (value) {
            let response = await fetchRolesByGroup(value);
            if (response && response.data.EC === +0) {
                let result = buildDataRolesByGroup(response.data.DT.Roles, listRoles)
                setAssignRolesByGroup(result);
            }
        }
    }
    const buildDataRolesByGroup = (groupRoles, allRoles) => {
        let result = [];
        if (allRoles && allRoles.length > 0) {
            allRoles.map(role => {
                let object = {};
                object.url = role.url;
                object.id = role.id;
                object.description = role.description;
                object.isAssigned = false;
                if (groupRoles && groupRoles.length > 0) {
                    object.isAssigned = groupRoles.some(item => item.url === object.url);
                }
                result.push(object);
            })
        }
        return result;
    }
    const handleSelecRole = (value) => {
        const _assignRolesByGroup = _.cloneDeep(assignRolesByGroup)
        let foundIdenx = _assignRolesByGroup.findIndex(item => +item.id === +value);
        if (foundIdenx > -1) {
            _assignRolesByGroup[foundIdenx].isAssigned = !_assignRolesByGroup[foundIdenx].isAssigned;
        }
        setAssignRolesByGroup(_assignRolesByGroup)
    }
    const buildDataToSave = () => {
        let result = {};
        const _assignRolesByGroup = _.cloneDeep(assignRolesByGroup)
        result.groupId = selectGroup;
        let groupRolesFillter = _assignRolesByGroup.filter(item => item.isAssigned === true);
        let finalGroupRoles = groupRolesFillter.map(item => {
            let data = {
                groupId: +selectGroup, roleId: +item.id
            }
            return data;
        })

        result.groupRoles = finalGroupRoles;
        console.log(result)
        return result;
    }
    const handleSave = async () => {
        let data = buildDataToSave();
        let response = await assignRolesToGroup(data)
        if (response && response.data.EC === 0) {
            toast.success(response.data.EM)
        }
    }
    return (
        <>
            <div className='group-role-container'>
                <div className='container'>
                    <div className='container mt-3'>
                        <h4>Group Role:</h4>
                        <div className='assign-group-role'>

                            <div className='col-12 col-sm-6 form-group' >
                                <label> Selected Group: (<span className='red'>*</span>) :</label>
                                <select className={'form-select'}
                                    onChange={(event) => handleOnchangeGroup(event.target.value)}

                                >
                                    <option value=''>Chon</option>
                                    {userGroup.length > 0 &&
                                        userGroup.map((item, index) => {
                                            return (
                                                <option key={`group-${index}`} value={item.id}>{item.name}</option>
                                            )

                                        })
                                    }

                                </select>
                            </div>
                            <hr />
                            {selectGroup &&
                                <div className='roles'>
                                    <h5>Assign Roles:</h5>
                                    {
                                        assignRolesByGroup && assignRolesByGroup.length > 0
                                        && assignRolesByGroup.map((item, index) => {
                                            return (
                                                <div className="form-check" key={`list-role-${index}`}>
                                                    <input className="form-check-input"
                                                        type="checkbox"
                                                        value={item.id}

                                                        id={`list-role-${index}`}
                                                        checked={item.isAssigned}
                                                        onChange={(event) => handleSelecRole(event.target.value)}
                                                    />
                                                    <label className="form-check-label" for={`list-role-${index}`}>
                                                        {item.url}
                                                    </label>
                                                </div>
                                            )
                                        })

                                    }
                                    <div className='mt-3'>
                                        <button className='btn btn-warning' onClick={() => handleSave()}> Save</button>
                                    </div>
                                </div>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default GroupRole;
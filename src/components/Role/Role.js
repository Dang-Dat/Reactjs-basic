import './Role.scss'
import { isValidElement, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify';
import { createRole } from '../../service/roleService'
import TableRole from './TableRole'
const Role = (props) => {

    const childRef = useRef();

    const dataChildsDefault = {
        url: '', description: '', isValidUrl: true
    }
    const [listChilds, setListChilds] = useState({
        child1: dataChildsDefault,
    })
    // useEffect(() => {
    //     Object.entries(listChilds).map(([key, value]) => {

    //     })
    // })
    const handlOnchangeInput = (name, value, key) => {
        let _listChilds = _.cloneDeep(listChilds)
        _listChilds[key][name] = value
        if (value && name === 'url') {
            _listChilds[key]['isValidUrl'] = true;
        }
        setListChilds(_listChilds)
    }
    const handleAddNewInput = () => {
        let _listChilds = _.cloneDeep(listChilds);
        _listChilds[`child-${uuidv4()}`] = dataChildsDefault

        setListChilds(_listChilds)
    }
    const handleDeleteInput = (key) => {
        let _listChilds = _.cloneDeep(listChilds)
        delete _listChilds[key];
        setListChilds(_listChilds);
    }

    const buildDataToPersist = () => {
        let _listChilds = _.cloneDeep(listChilds)
        let result = [];
        Object.entries(listChilds).find(([key, child], index) => {
            result.push({
                url: child.url,
                description: child.description,
            })
        })
        return result
    }

    const handleSave = async () => {
        let invalidObj = Object.entries(listChilds).find(([key, child], index) => {
            return child && !child.url
        })
        if (!invalidObj) {
            //call api
            let data = buildDataToPersist();
            let res = await createRole(data)
            if (res && res.data.EC === 0) {
                toast.success(res.data.EM)
                childRef.current.fetchListRolesAgain();
            }
        } else {
            //error
            toast.error("Khong duoc de trong url")
            let _listChilds = _.cloneDeep(listChilds)
            const key = invalidObj[0]
            _listChilds[key]['isValidUrl'] = false
            setListChilds(_listChilds)
        }


    }
    return (

        <div className='role-container'>
            <div className='container'>
                <div className='adding-roles mt-3'>
                    <div className='title-role'>
                        <h4>Add new role</h4>
                    </div>
                    <div className=' role-parent'>
                        {
                            Object.entries(listChilds).map(([key, child], index) => {
                                return (

                                    <div className='row role-child' key={`child -${key}`}>
                                        <div className={`col-5 form-group ${key}`}>
                                            <label>URL :</label>
                                            <input type='text' className={child.isValidUrl ? 'form-control' : 'form-control is-invalid'} value={child.url}
                                                onChange={(event) => handlOnchangeInput('url', event.target.value, key)}
                                            />
                                        </div>
                                        <div className='col-5 form-group'>
                                            <label>Description :</label>
                                            <input type='text' className='form-control'
                                                value={child.description}
                                                onChange={(event) => handlOnchangeInput('description', event.target.value, key)}
                                            />
                                        </div>
                                        <div className='col-2 form-group mt-4 actions'>
                                            <i className='fa fa-plus-circle add ' onClick={() => handleAddNewInput()}></i>
                                            {index >= 1 && <i className='fa fa-trash-o delete' onClick={() => handleDeleteInput(key)}></i>}
                                        </div>
                                    </div>

                                )
                            })
                        }

                    </div>
                    <div>
                        <button className='btn btn-warning mt-3 ' onClick={() => handleSave()}>Save</button>
                    </div>

                </div>
                <hr />
                <div className='table-role mt-3'>
                    <h4>List roles:</h4>
                    <TableRole ref={childRef} />
                </div>

            </div>
        </div>

    )
}

export default Role;
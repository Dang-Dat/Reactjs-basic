import { useEffect, useState, forwardRef, useRef, useImperativeHandle } from "react";
import { fetchAllRoles, deleteRole } from '../../service/roleService';
import { toast } from "react-toastify";

const TableRole = forwardRef((props, ref) => {
    const [listRoles, setListRoles] = useState();

    useEffect(() => {
        getAllRoles();
    }, [])
    useImperativeHandle(ref, () => ({

        async fetchListRolesAgain() {
            await getAllRoles()
        }
    }))

    const getAllRoles = async () => {
        let response = await fetchAllRoles();
        if (response && response.data.EC === +0) {
            setListRoles(response.data.DT)
        }
    }
    const hanldeDeleteRole = async (role) => {
        console.log(role)
        let response = await deleteRole(role)
        if (response && response.data.EC === +0) {
            toast.success(response.data.EM)
            await getAllRoles();
        }

    }
    return (<>
        <table className="table table-borderred table-hover">
            <thead>
                <tr>

                    <th scope="col">id</th>
                    <th scope="col">Url</th>
                    <th scope="col">Description</th>
                    <th >Actions</th>

                </tr>
            </thead>
            <tbody>
                {listRoles && listRoles.length > 0 ?
                    <>
                        {listRoles.map((item, index) => {
                            return (
                                <tr key={`row-${index}`}>

                                    <td>{item.id}</td>
                                    <td>{item.url}</td>
                                    <td>{item.description}</td>

                                    <td>
                                        <button className="btn btn-warning mx-3"

                                        ><i className="fa fa-pencil-square-o"></i>Edit</button>
                                        <button className="btn btn-danger"
                                            onClick={() => hanldeDeleteRole(item)}
                                        ><i className="fa fa-trash" ></i>Delete</button>
                                    </td>

                                </tr>
                            )
                        })}
                    </>
                    :
                    <>
                        <tr><td colSpan={4}>not found</td></tr>
                    </>
                }

            </tbody>
        </table>
    </>)
})
export default TableRole;
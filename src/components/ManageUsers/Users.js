import './Users.scss';
import React, { useEffect, useState } from "react";
import { fetchAllUsers, deleteUser } from "../../service/userService";
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import ModalDelete from "./ModalDelete";
import ModalUser from "./ModalUser";
import { UserContext } from "../../context/UserContext"

const Users = (props) => {
    const [listUsers, setListUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(3); // so phan tu trong 1 page
    const [totalPages, setTotalPages] = useState(0);
    //modal delete
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModalDelete, setDataModalDelete] = useState({});// delete

    //modal update/create user
    const [isShowModalUser, setIsShowModalUser] = useState(false);
    const [actionModalUser, setActionModalUser] = useState('');
    const [dataModalUpdate, setDataModalUpdate] = useState({});

    useEffect(() => {
        fetchUsers();

    }, [currentPage])
    const { user } = React.useContext(UserContext);


    const fetchUsers = async () => {
        // let response = await fetchAllUsers(page? page : currentPage, currentLimit);
        let response = await fetchAllUsers(currentPage, currentLimit);
        // console.log('>>check res: ', response)
        if (response && response.data && response.data.EC === 0) {
            setTotalPages(response.data.DT.totalPage);
            setListUsers(response.data.DT.users)
        }
    }
    const handlePageClick = async (event) => {
        await setCurrentPage(+event.selected + 1);
        // await fetchUsers(+event.selected + 1);
    };
    const hanldeDeleteUser = (user) => {
        setDataModalDelete(user);
        setIsShowModalDelete(true);
    }
    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModalDelete({});
    }
    const onHideModalUser = async () => {
        setIsShowModalUser(false);
        setDataModalUpdate({});
        await fetchUsers();
    }
    const confirmDeleteUser = async (user) => {
        let response = await deleteUser(dataModalDelete);
        console.log('check respon: ', response)
        if (response && response.data.EC === 0) {
            toast.success(response.data.EM)
            await fetchUsers();
        } else {
            toast.error(response.data.EM)
        }
        setIsShowModalDelete(false);
    }
    const hanldeUpdateUser = (user) => {
        setActionModalUser('UPDATE')
        setIsShowModalUser(true);
        setDataModalUpdate(user);
    }
    const hanldeRefresh = async () => {
        await fetchUsers();
    }
    return (
        <>
            <div className="container">
                <div className="manage-users-container">
                    <div className="user-head">
                        <div className="title mt-3">
                            <h3>Manage User</h3>
                        </div>
                        <div className="actions">
                            <button className="btn btn-success refresh"
                                onClick={() => hanldeRefresh()}
                            ><i className='fa fa-refresh '></i> refresh</button>
                            <button className="btn btn-primary"
                                onClick={() => { setIsShowModalUser(true); setActionModalUser("CREATE") }}>
                                <i className='fa fa-plus-circle'></i> Add new</button>
                        </div>

                    </div>
                    <div className="user-body">

                        <table className="table table-borderred table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">id</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Group</th>
                                    <th >Actions</th>

                                </tr>
                            </thead>
                            <tbody>
                                {listUsers && listUsers.length > 0 ?
                                    <>
                                        {listUsers.map((item, index) => {
                                            return (
                                                <tr key={`row-${index}`}>
                                                    <td>{(currentPage - 1) * currentLimit + index + 1}</td>
                                                    <td>{item.id}</td>
                                                    <td>{item.username}</td>
                                                    <td>{item.email}</td>
                                                    <td>{item.Group ? item.Group.name : ''}</td>
                                                    <td>
                                                        <button className="btn btn-warning mx-3"
                                                            onClick={() => hanldeUpdateUser(item)}
                                                        ><i className="fa fa-pencil-square-o"></i>Edit</button>
                                                        <button className="btn btn-danger"
                                                            onClick={() => hanldeDeleteUser(item)}
                                                        ><i className="fa fa-trash" ></i>Delete</button>
                                                    </td>

                                                </tr>
                                            )
                                        })}
                                    </>
                                    :
                                    <>
                                        <tr><td>not found</td></tr>
                                    </>
                                }

                            </tbody>
                        </table>
                    </div>
                    {totalPages > 0 &&
                        <div className="user-footer">
                            <ReactPaginate
                                nextLabel="next >"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={2}
                                pageCount={totalPages}
                                previousLabel="< previous"
                                pageClassName="page-item"
                                pageLinkClassName="page-link"
                                previousClassName="page-item"
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                breakLabel="..."
                                breakClassName="page-item"
                                breakLinkClassName="page-link"
                                containerClassName="pagination"
                                activeClassName="active"
                                renderOnZeroPageCount={null}
                            />
                        </div>
                    }
                </div>
            </div>
            <ModalDelete
                show={isShowModalDelete}
                handleClose={handleClose}
                confirmDeleteUser={confirmDeleteUser}
                dataModal={dataModalDelete}
            />
            <ModalUser
                handleClose={handleClose}
                show={isShowModalUser}
                onHide={onHideModalUser}
                action={actionModalUser}
                dataModalUpdate={dataModalUpdate}
            />
        </>
    )
}

export default Users;
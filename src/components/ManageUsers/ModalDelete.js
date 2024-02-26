import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
const ModalDelete = (props) => {
    return (
        <>

            <Modal show={props.show} onHide={props.handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>You want to delete user: {props.dataModal.email}? </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>close</Button>
                    <Button variant="primary" onClick={props.confirmDeleteUser}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}



export default ModalDelete;
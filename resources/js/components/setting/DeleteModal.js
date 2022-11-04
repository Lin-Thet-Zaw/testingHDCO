import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

function DeleteModal({isShow, isToggle, recordId, handleUpdate}) {
    const deleteRecord=async()=>{
        try {
            await axios.delete(`/admin/${recordId}`)
            .then(res=>{
                isToggle() //close modal
                handleUpdate(res.data);
            })
            .catch(err=>{
                console.log(err.message);
            })
        } catch (error) {
            console.log(error.message);
        }
    }
  return (
    <Modal size="sm" show={isShow} onHide={isToggle}>
        <Modal.Header closeButton>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to delete</Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-primary btn-sm" onClick={isToggle}>
            Cancel
          </Button>
          <Button className="btn btn-danger btn-sm" onClick={deleteRecord}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
  )
}

export default DeleteModal
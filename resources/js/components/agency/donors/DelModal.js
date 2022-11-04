import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';

function DelModal({isShow, isToggle, recordId, handleUpdate}) {
  const [isLoading, setIsLoading] = useState(false)
    const deleteRecord=async()=>{
        try {
          setIsLoading(true)
            await axios.delete(`/agency/${recordId}`)
            .then(res=>{
                isToggle() //close modal
                handleUpdate(res.data);
                setIsLoading(false)
            })
            .catch(err=>{
                console.log(err.message);
                setIsLoading(false)
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
          {
            isLoading?(<Button variant="danger" size='sm' disabled>
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Loading...
          </Button>): <Button className="btn btn-danger btn-sm" onClick={deleteRecord}>
            Confirm
          </Button>
          }
         
        </Modal.Footer>
      </Modal>
  )
}

export default DelModal
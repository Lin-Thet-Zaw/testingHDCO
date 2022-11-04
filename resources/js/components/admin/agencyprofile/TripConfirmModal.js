import axios from 'axios'
import React, { useState } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'

function TripConfirmModal({show, id, handleClose, responseData}) {
  const [loading, setLoading] = useState(false)
    const handleSubmit=()=>{
      setLoading(true)
        try {
            axios.post(`/admin/profile/allowtriprequest/${id}`)
            .then(res=>{
                responseData(res.data)
                setLoading(false)
            })
            .catch(err=>{
                console.log(err.message)
            })
        } catch (err) {
            console.log(err.message)
        }
    }
  return (
    <>
      <Modal size='sm' backdrop="static" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Warning!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are your sure?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {
            loading? <Button variant="primary" disabled>
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Loading...
          </Button> :
            <Button variant="primary" onClick={handleSubmit}>
            Confirm
          </Button>
          }
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default TripConfirmModal

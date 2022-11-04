import axios from 'axios'
import React, { useState } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'

function DeleteResponse({isShow, isToggle, id, deleteData}) {
  const [loading, setLoading] = useState(false)

  const handleDelete=()=>{
    setLoading(true)
    try {
      axios.delete(`/agency/responseoverview/${id}`)
      .then(res=>{
        deleteData(res.data)
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
    <div>
    <Modal
    show={isShow}
    onHide={isToggle}
    backdrop="static"
    keyboard={false}
    size='sm'
  >
    <Modal.Header closeButton>
      <Modal.Title>Warning</Modal.Title>
    </Modal.Header>
    <Modal.Body>
       Are you sure to delete this contact?
    </Modal.Body>
    <Modal.Footer>
      <Button size='sm' variant="danger" onClick={isToggle}>
        CANCEL
      </Button>
      {
        loading?<Button variant="primary" disabled>
        <Spinner
          as="span"
          animation="grow"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        Loading...
      </Button>:<Button size='sm' variant="primary" onClick={handleDelete}>CONFIRM</Button>
      }
      
    </Modal.Footer>
  </Modal>
    </div>
  )
}

export default DeleteResponse
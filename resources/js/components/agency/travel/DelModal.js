import axios from 'axios'
import React, { useState } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'

function DelModal({isShown, isToggle, id, deleteData}) {
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete=()=>{
      setIsLoading(true)
        try {
            axios.delete(`/agency/travel/${id}`)
            .then(res=>{
                deleteData(res.data)
                setIsLoading(false)
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
        show={isShown}
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
          <Button className='btn-sm' variant="secondary" onClick={isToggle}>
            Cancel
          </Button>
          {
            isLoading?<Button variant="danger" disabled>
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Loading...
          </Button>:<Button size='sm' variant="danger" onClick={handleDelete}>Delete</Button>
          }
          
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default DelModal
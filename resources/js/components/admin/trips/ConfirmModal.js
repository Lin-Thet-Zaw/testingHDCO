import React, { useState } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'


function ConfirmModal({show, handleClose, handleConfirm}) {
  const [loading, setLoading]  = useState(false)

  const handleLoading=()=>{
    setLoading(true)
  }
  return (
    <div>
        <Modal show={show} onHide={handleClose} backdrop='static'>
        <Modal.Body>
            <div className='text-center'>
                <div className='mb-3'>
                <i class="bi bi-info-circle fs-1 text-warning"></i>
                </div>
            Are you sure to continue?
            <div className='py-5'>
               
            {
              !loading ? (<><Button variant="warning btn-sm px-3 text-white" onClick={handleClose}>
              Cancel
          </Button> <Button variant="primary btn-sm px-3" onClick={e=>{handleConfirm(), handleLoading() } }>
               Confirm
            </Button></>): <Button variant="primary btn-sm px-3" disabled>
               <Spinner animation="border" size="sm" />
            </Button>
            }
            
            </div>
            </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ConfirmModal
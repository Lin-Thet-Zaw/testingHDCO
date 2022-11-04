import React from 'react'
import { Modal } from 'react-bootstrap'

function ShowContact({isShown, isToggle, contact}) {
  return (
    <>
        <Modal
        size="lg"
        backdrop="static"
        show={isShown}
        onHide={isToggle}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            CONTACT PERSON DETAIL
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='row'>
                <div className='col-md-4'>
                    <div>
                        <img src={`/storage/uploads/passport/${contact.passport}`} width='100px' />
                    </div>
                    <p className='mt-3'>{contact.name}</p>
                    <p>{contact.sex==1?'Male':contact.sex==2?'Other':'Female'}</p>
                    <p>{contact.email}</p>
                    <p>{contact.phone_number}</p>
                    <p>{contact.nationality.name}</p>
                    <p>{contact.position}</p>
                </div>

                <div className='col-md-8'>
                    <img src={`/storage/uploads/passport/${contact.id_front}`} />
                    <img src={`/storage/uploads/passport/${contact.id_back}`} />
                </div>
            </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ShowContact
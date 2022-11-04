import React from 'react'
import { Modal } from 'react-bootstrap'

function Contact({isShown, isToggle, contact}) {
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
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='row'>
                <div className='col-md-5'>
                    <div className='mb-3'>
                        <img src={`/storage/uploads/passport/${contact.passport}`} className='img-thumbnail'/>
                    </div>
                    <hr />
                    <p>{contact.name} , {contact.position}</p>
                    <p>{contact.sex==1?'Male':contact.sex==2?'Other':'Female'} , {contact.nationality.name}</p>
                    <p>{contact.email}</p>
                    <p>{contact.phone_number}</p>
                </div>

                <div className='col-md-7'>
                    <img src={`/storage/uploads/passport/${contact.id_front}`} className='img-thumbnail' />
                    <img src={`/storage/uploads/passport/${contact.id_back}`} className='img-thumbnail' />
                </div>
            </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Contact
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Modal, Spinner, Container, Row, Col } from 'react-bootstrap'

function ShowEmployee({isDetailShow, isToggle, employeeId}) {

    const [loading, setLoading] = useState(false);
    const [employee, setEmployee] = useState();

    useEffect(async()=>{
        setLoading(true)
        try {
            await axios.get(`/agency/travellers/${employeeId}`)
            .then(res=>{
                setEmployee(res.data)
                setLoading(false)
            })
            .catch(err=>{
                console.log(err.message)
            })
        } catch (error) {
            console.log(error.message)
        }
    }, [])
  return (
    <>
        <Modal
        size="lg"
        backdrop='static'
        show={isDetailShow}
        onHide={isToggle}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Profile
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {loading ? <div className="text-center"><Spinner animation="grow" /></div>: employee && (
                <Container>
                    <Row>
                        <Col xs={12} md={3}>
                            <div className="text-center">
                                <img src={employee.photo} className="rounded mx-auto d-block" width="100" />
                                <p className="mt-3">{employee.name} {employee.gender===1? <i className="bi bi-gender-male"></i> : <i className="bi bi-gender-female"></i>}</p>
                                <p>{employee.position}</p>
                                <p>{employee.nationality && employee.nationality.name}</p>
                            </div>
                            
                        </Col>
                        <Col xs={6} md={9} className="text-center">
                          <div>
                            <img src={employee.id_front} className="rounded mx-auto d-block" width="350" />
                          </div>
                          <div className="mt-2">
                            <img src={employee.id_back} className="rounded mx-auto d-block" width="350" />
                          </div>
                        </Col>
                    </Row>
                </Container>
            )}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ShowEmployee
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap'

function ShowEdit({isShow, isToggle, id, updateData}) {

  const [errors, setErrors] = useState()

  const [file, setFile] = useState('')
  const [inputData, setInputData] = useState({
    start_date:'',
    end_date:'',
  })

  const [loading, setLoading] = useState(false) //loading on data update

  useEffect(()=>{
    try {
      axios.get(`/agency/responseoverview/${id}`)
      .then(res=>{
        console.log(res.data)
        setInputData(res.data)
      })
      .catch(err=>{
        console.log(err.message)
      })
    } catch (err) {
      console.log(err.message)
    }
  }, [])

  const handleInput=e=>{
    const {name, value} = e.target
    setInputData(
      {
        ...inputData,
        [name]:value
      }
    )
  }

  const handleFile=e=>{
    setFile(e.target.files[0])
  }

  const handleSubmit = ()=>{
    setLoading(true)
    const {start_date, end_date} = inputData;
    const formData = new FormData();
    formData.append('start_date', start_date)
    formData.append('end_date', end_date)
    formData.append('file', file)
    formData.append('_method', 'PUT')

    try {
      axios.post(`/agency/responseoverview/${id}`, formData)
      .then(res=>{
        updateData(res.data)
        setLoading(false)
      })
      .catch(err=>{
        setErrors(err.message)
        setLoading(false)
      })
    } catch (err) {
      console.log(err.message)
    }
  }

  return (
    <div>
        <Modal
        size='lg'
        show={isShow}
        onHide={isToggle}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>UPDATE PROJECTS OVERVIEW</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <div className='card'>
              <div className='card-body'>
              <Form>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control type="date" name='start_date' value={inputData.start_date} placeholder="Enter township" onChange={handleInput} />
                    {
                        errors && errors.start_date && (<Form.Text className="text-danger">
                                {errors.start_date}
                            </Form.Text>)
                    }
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control type="date" name='end_date' value={inputData.end_date} placeholder="Enter township" onChange={handleInput} />
                    {
                        errors && errors.end_date && (<Form.Text className="text-danger">
                                {errors.end_date}
                            </Form.Text>)
                    }
                    </Form.Group>
                </Row>

           <Row className="mb-3">

                    <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>File (.xls)</Form.Label>
                    <Form.Control type='file' onChange={handleFile} name='file' value={inputData.location_type} />
                    {
                        errors && errors.file && (<Form.Text className="text-danger">
                                {errors.file}
                            </Form.Text>)
                    }
                    </Form.Group>
                </Row>

           </Form>
              </div>
           </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={isToggle}>
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
          </Button>: <Button variant="primary" onClick={handleSubmit}>UPDATE</Button>
          }
         
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ShowEdit
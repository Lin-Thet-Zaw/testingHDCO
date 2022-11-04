import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import {Row, Col, Form, ListGroup, Spinner, Badge, Alert, Button } from 'react-bootstrap'
import axios from 'axios'
import DelModal from '../donors/DelModal'

function Offices() {
    const [inputData, setInputData] = useState({
        address:'',
        town_id:'',
        staffs:''
    })
    const [towns, setTowns] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [errors, setErrors] = useState()
    const [offices, setOffices] = useState([])
    const [requestLoading, setRequestLoading] = useState(false)
    const [id, setId] = useState(0)

    const [isDelete, setIsDelete] = useState(false)
    const [isInfo, setIsInfo] = useState(false)

    const [isLoading, setIsLoading] = useState(false) //Loading on saving data
    const [profileError, setProfileError] = useState(false) //to show profile error


    useEffect(()=>{
        setRequestLoading(true)
        axios.get('/admin/towns')
        .then(res=>{
            setTowns(res.data)
        })
        .catch(err=>{
            console.log(err.message)
        })

        //get data
        axios.get('/agency/getoffices')
        .then(res=>{
            setOffices(res.data)
            setRequestLoading(false)
        })
        .catch(err=>{
            setRequestLoading(false)
            console.log(err.message)
        })
    }, [])

    const handleSubmit=async()=>{
        setIsLoading(true)
        try {
            await axios.post('/agency/offices', inputData)
            .then(res=>{
                setOffices([
                    res.data,
                    ...offices
                ])
                setInputData({
                    address:'',
                    town_id:'',
                    staffs:''
                })
                setIsInfo(true)
                setErrors('')
                setIsLoading(false)
            })
            .catch(err=>{
                setIsLoading(false)
                if(err.response.data.errors.profile_error){
                    setProfileError(true)
                    return setTimeout(()=> {
                        setProfileError(false);
                      }, 5000);
                }
                setErrors(err.response.data.errors)
            })
        } catch (err) {
            console.log(err.message)
        }
    }

    //edit office
    const editOffice=(address, town_id, staffs, id)=>{
        setInputData({
            address,
            town_id,
            staffs
        })
        setId(id)
        setIsEdit(true)
    }

    //handle update
    const handleUpdate=async()=>{
        setIsLoading(true)
        try {
            await axios.put(`/agency/offices/${id}`, inputData)
            .then(res=>{
                const index = offices.map(office=>office.id).indexOf(id)
                offices[index] = res.data
                setOffices(offices)
                setInputData({
                    address:'',
                    town_id:'',
                    staffs:''
                })
                setIsEdit(false)
                setIsInfo(true)
                setErrors('')
                setIsLoading(false)
            })
            .catch(err=>{
                setErrors(err.response.data.errors)
                setIsLoading(false)
            })
        } catch (err) {
            console.log(err.message)
        }
    }

    const handleCancel=e=>{
        setInputData({
            address:'',
            town_id:'',
            staffs:''
        })
        setIsEdit(false)
    }

    //hande input change
    const handleChange=e=>{
        const {name, value} = e.target
        setInputData({
            ...inputData,
            [name]: value,
        })
    }


    //del
    const showDelModal=id=>{
        setId(id)
        setIsDelete(true)
    }


    const updateDelData=(data)=>{
        const newData = offices.filter(office=>office.id !== data.id)
        setOffices(newData)
        setIsDelete(false)
        setIsInfo(true)
    }

  return (
      <>
      <h4>Sub-Offices Address</h4>
    <div className='card'>
        <div className='card-body'>
        {
                isInfo && <Alert variant="success" onClose={() => setIsInfo(false)} dismissible>

                <span className='font-strong'>Success!</span>    Record updated successfully

                </Alert>
            }
             {
                profileError && <p className='text-danger'><strong>Error! </strong>Please fill general information first.</p>
            }
        <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Control type='text' placeholder='Enter address' name='address' onChange={handleChange} value={inputData.address} />
                    {
                        errors && errors.address && (<Form.Text className="text-danger">
                                {errors.address}
                            </Form.Text>)
                    }
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridName">
                        <Form.Select placeholder="20" name="town_id" value={inputData.town_id} onChange={handleChange} >
                            <option value={''} disabled>Township ...</option>

                            {
                                towns && towns.map(town=>(
                                    <option value={town.id}>{town.name}</option>
                                ))
                            }
                        
                        </Form.Select>
                        {
                            errors && errors.town_id && (<Form.Text className="text-danger">
                                {errors.town_id}
                            </Form.Text>)
                        }
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Control type='text' placeholder='Number of employees' name='staffs' onChange={handleChange} value={inputData.staffs} />
                        {
                            errors && errors.staffs && (<Form.Text className="text-danger">
                                    {errors.staffs}
                                </Form.Text>)
                        }
                        </Form.Group>
                            
                        
                        <Col xs="auto">
                        <Form.Group >
                            {
                                isLoading?<Button variant="primary" disabled>
                                <Spinner
                                  as="span"
                                  animation="grow"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                />
                                Loading...
                              </Button>:isEdit ?<><button className="btn btn-danger" type="button" onClick={handleCancel}>Cancel</button> <button className='btn btn-primary' onClick={handleUpdate}>UPDATE</button></>:
                                <button className='btn btn-primary' onClick={handleSubmit}>ADD <i class="bi bi-plus-lg"></i></button>
                            }
                        </Form.Group>
                        </Col>
                    </Row>


                    {/* list group start */}
                    <ListGroup className="mt-3">
                        {requestLoading || !offices?(<div className="text-center"><Spinner animation="grow" /></div>):<>
                                {offices.map((office, index)=>{
                                return (
                                    <ListGroup.Item
                                        key={index}
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <i class="bi bi-geo-alt-fill"></i>&nbsp;
                                        {`${office.address} , ${office.town.name}`} , <i class="bi bi-people-fill"></i> <Badge bg="info" pill>{office.staffs}</Badge> Staffs
                                        </div>
                                        <i className="bi bi-pencil-square mousePointer text-primary" onClick={()=>editOffice(office.address, office.town_id, office.staffs, office.id)}></i>
                                        &nbsp;
                                        <i className="bi bi-trash mousePointer text-danger" onClick={()=>showDelModal(office.id)}></i>
                                    </ListGroup.Item>
                                )
                            })}
                            </>
                        }
                        
                        
                    </ListGroup>

        </div>
        {
            isDelete && <DelModal isShow={isDelete} isToggle={e=>setIsDelete(false)} recordId={`offices/${id}`} handleUpdate={updateDelData} />
        }
    </div>
    </>
  )
}

export default Offices

if(document.getElementById('offices')){
    ReactDOM.render(<Offices />, document.getElementById('offices'))
}
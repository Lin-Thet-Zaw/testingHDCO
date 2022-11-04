import React, { useEffect, useState } from 'react'
import { Form, Button, Row, Col, Modal, Spinner } from 'react-bootstrap';
import axios from 'axios';

function RequestTravel({isShow, isToggle, travelData}) {
    const [towns, setTowns]=useState();
    const [errors, setErrors]=useState();
    const [inputData, setInputData]=useState({
        start_date:'',
        end_date:'',
        departure_location:'',
        phone_number:'',
        driver:'',
        vehicle_type:'',
        vehicle_number:'',
        description:''
    });

    const [loading, setLoading] = useState(false) //Loading on data saving

    //dynamic form 
    const [formAddress, setFormAddress] = useState([{
        location:'',
        village_track:'',
        town_id:''
    }])

    //add new address form field
    const addFormField=()=>{
        console.log(formAddress)
        setFormAddress([
            ...formAddress,
            {
                location:'',
                village_track:'',
                town_id:formAddress[0].town_id
            }
        ])
    }

    //remove form field
    const removeFormField=(index)=>{
        const newFormField = [...formAddress]
        newFormField.splice(index, 1)
        setFormAddress(newFormField)
    }

    //handle address from data
    const handleFormChange = (index, e)=>{
        const {name, value} = e.target
        const newFormData = [...formAddress]
        if(name=='town_id'){
            if(newFormData.length > 1){
                newFormData.map(address=>(
                    address.town_id=value
                ))
            }else{
                newFormData[index][name] = value
            }
        }else{
            newFormData[index][name] = value
        }
        setFormAddress(newFormData)
    }

    //handle input
    const handleInput=(e)=>{
        const {name, value } = e.target;
        setInputData({
            ...inputData,
            [name]:value
        })
    }

    useEffect(async()=>{
        await axios.get('/admin/towns')
        .then(res=>{
            setTowns(res.data);
        })
        .catch(err=>{
            console.log(err.message);
        })
    }, []);

    //request Travel
    const addTravel = async(e)=>{
        e.preventDefault();
        setLoading(true)
        try {
            inputData.address=formAddress
            await axios.post('/agency/travel', inputData)
            .then(res=>{
                travelData(res.data)
                setLoading(false)
            })
            .catch(err=>{
                setErrors(err.response.data.errors);
                setLoading(false)
            })
        } catch (err) {
            console.log(err.message);
        }
    }
  return (

    <Modal
    size="lg"
    show={isShow}
    onHide={isToggle}
    backdrop="static"
    aria-labelledby="example-modal-sizes-title-lg"
  >
    <Modal.Header closeButton>
      <Modal.Title id="example-modal-sizes-title-lg">
        ADD NEW TRIP &nbsp;{errors && errors.profile_error && <p className='text-danger'><strong>Error !</strong>{errors.profile_error}</p>}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <div className="card">
            <div className="card-body">
            <Form>
            {
                formAddress && formAddress.map((element, index)=>(
                    <Row className="mb-3" key={index}>
                    <Form.Group as={Col} controlId="formGridLocation">
                    <Form.Label>Location</Form.Label>
                    <Form.Control type="text" placeholder="Enter location" name="location" value={element.location} onChange={e=>handleFormChange(index, e)} />
                        {errors && errors.address && (<Form.Text className="text-danger">
                            {errors.address}
                        </Form.Text>)}
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridLocation">
                    <Form.Label>Village Track</Form.Label>
                    <Form.Control type="text" placeholder="Enter village track" name="village_track" value={element.village_track} onChange={e=>handleFormChange(index, e)} />
                        {errors && errors.village_track && (<Form.Text className="text-danger">
                            {errors.village_track}
                        </Form.Text>)}
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Township</Form.Label>
                       <Form.Select name="town_id" onChange={e=>handleFormChange(index, e)} value={formAddress[0].town_id}>
                        <option value=''>Choose...</option>
                        {
                            towns && towns.map((town, index)=>{
                                return <option key={index} value={town.id}>{town.name}</option>
                            })
                        }
                    </Form.Select>
                            {errors && errors.town_id && (<Form.Text className="text-danger">
                            {errors.town_id}
                        </Form.Text>)}
                    </Form.Group>

                    <Col md={1}>
                        <Form.Group controlId="formGridLocation">
                            {
                                index===0?(
                                    <button type='button' className='btn-primary btn mousePointer address-btn' onClick={addFormField}><i className="bi bi-plus-lg"></i></button>
                                ):(
                                    <button type='button' className='btn-danger btn mousePointer address-btn' onClick={e=>removeFormField(index)}><i class="bi bi-dash-lg"></i></button>
                                )
                            }
                        </Form.Group>
                    </Col>
                    
                </Row>
                ))
            }

            <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridLocation">
                <Form.Label>Departure Date</Form.Label>
                <Form.Control type="date" placeholder="Enter location" name="start_date" value={inputData.start_date} onChange={handleInput} />
                {errors && errors.start_date && (<Form.Text className="text-danger">
                        {errors.start_date}
                    </Form.Text>)}
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Arrival Date</Form.Label>
                <Form.Control type="date" placeholder="Enter location" name="end_date" value={inputData.end_date} onChange={handleInput} />
                {errors && errors.end_date && (<Form.Text className="text-danger">
                        {errors.end_date}
                    </Form.Text>)}
                </Form.Group>
            </Row>

            <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridLocation">
                <Form.Label>Departure Address</Form.Label>
                <Form.Control type="text" placeholder="Enter departure location" name="departure_location" value={inputData.departure_location} onChange={handleInput} />
                {errors && errors.departure_location && (<Form.Text className="text-danger">
                        {errors.departure_location}
                    </Form.Text>)}
                </Form.Group>

                <Form.Group as={Col} controlId="formGridAddress1">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control placeholder="Enter phone number" name="phone_number" value={inputData.phone_number} onChange={handleInput}/>
                {errors && errors.phone_number && (<Form.Text className="text-danger">
                        {errors.phone_number}
                    </Form.Text>)}
            </Form.Group>
            </Row>

            

            <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridLocation">
                <Form.Label>Driver Name</Form.Label>
                <Form.Control type="text" placeholder="Enter driver name" name="driver" value={inputData.driver} onChange={handleInput} />
                {errors && errors.driver && (<Form.Text className="text-danger">
                        {errors.driver}
                    </Form.Text>)}
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Types Of Vehicle and Color</Form.Label>
                <Form.Control type="text" placeholder="Car, Blue" name="vehicle_type" value={inputData.vehicle_type} onChange={handleInput} />
                {errors && errors.vehicle_type && (<Form.Text className="text-danger">
                        {errors.vehicle_type}
                    </Form.Text>)}
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Vehicle Number <small className='optional'>(Optional)</small></Form.Label>
                <Form.Control type="text" placeholder="Enter vehicle number" name="vehicle_number" value={inputData.vehicle_number} onChange={handleInput} />
                {errors && errors.vehicle_number && (<Form.Text className="text-danger">
                        {errors.vehicle_number}
                    </Form.Text>)}
                </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Travel Reason (ရက္ခိုင်စာဖြင့်ရွီးပါ)</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Enter travel reason" name="description" value={inputData.description} onChange={handleInput} />
                {errors && errors.description && (<Form.Text className="text-danger">
                        {errors.description}
                    </Form.Text>)}
            </Form.Group>

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
              </Button>:<Button variant="primary" type="submit" onClick={addTravel}>
                SEND <i class="bi bi-send"></i>
            </Button>
            }
        </Form>
            </div>
        </div>
    </Modal.Body>
  </Modal>
        
  )
}

export default RequestTravel
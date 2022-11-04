import React, { useEffect, useState, useRef } from 'react'
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';

function EditContact({isShow, isToggle, contact, updatedContact}) {
    //file
    const idFront = useRef(null);
    const idBack = useRef(null);
    const photoRef = useRef(null);

    const [errors, setErrors] = useState(); //to show validation errors
    const [name, setName] = useState(contact.name);
    const [nationality, setNationality] = useState(contact.nationality_id);
    const [email, setEmail] = useState(contact.email);
    const [phonenumber, setPhonenumber] = useState(contact.phone_number);
    const [position, setPosition] = useState(contact.position);
    const [sex, setSex] = useState(contact.sex);

    const [nationalities, setNationalities] = useState(); //get from database for select box

    const [IdFront, setIdFront]=useState(`/storage/uploads/passport/${contact.id_front}`);//to show in view after select
    const [frontImage, setFrontImage] = useState('');//for database
    const [IdBack, setIdBack]=useState(`/storage/uploads/passport/${contact.id_back}`);//to show in view after select
    const [backImage, setBackImage] = useState('');//for database
    const [photo, setPhoto]=useState(`/storage/uploads/passport/${contact.passport}`); //to show in view after select
    const [photoImage, setPhotoImage]= useState(''); //for database

    const [isSaving, setIsSaving] = useState(false) //loading on saving
    

    //get nationality data
    useEffect(async()=>{
        await axios.get('/admin/nationality')
        .then(res=>{
            setNationalities(res.data)
        })
        .catch(err=>{
            console.log(err.message);
        })
    }, []);

    //openFile Dialog
    const fileDialog=()=>{
        idFront.current.click();
    }

    //openFile Dialog
    const backDialog=()=>{
        idBack.current.click();
    }

    //openFile Dialog
    const photoDialog=()=>{
        photoRef.current.click();
    }

    //handle file upload
    const handleFrontUpload=event=>{
        try {
            setFrontImage(event.target.files[0]);
            setIdFront(URL.createObjectURL(event.target.files[0]))
        } catch (error) {
            console.log(error.message);
        }
    }

     //handle file upload
     const handleBackUpload=event=>{
        try {
            setBackImage(event.target.files[0]);
            setIdBack(URL.createObjectURL(event.target.files[0]))
        } catch (error) {
            console.log(error.message);
        }
    }

    //handle file upload
    const handlePhotoUpload=event=>{
        try {
            setPhotoImage(event.target.files[0]);
            setPhoto(URL.createObjectURL(event.target.files[0]))
        } catch (error) {
            console.log(error.message);
        }
    }

    //handle submit
    const handleSubmit = async()=>{
        setIsSaving(true)
        //Append in formData for file upload
        const formData = new FormData();
        formData.append('name', name);
        formData.append('nationality', nationality);
        formData.append('phone_number', phonenumber);
        formData.append('email', email);
        formData.append('position', position);
        formData.append('sex', sex);
        formData.append('frontid', frontImage);
        formData.append('backid', backImage);
        formData.append('passport', photoImage);
        formData.append('_method', 'PUT');

        try {
            await axios.post(`/agency/contactperson/${contact.id}`, formData)
            .then(res=>{
                updatedContact(res.data);
                setIsSaving(false)
            })
            .catch(err=>{
                setErrors(err.response.data.errors);
                setIsSaving(false)
            })
        } catch (error) {
            console.log('Server error');
            console.log(error.message);
        }
    }

  return (
        <>
        <Modal
            size="lg"
            show={isShow}
            onHide={isToggle}
            backdrop='static'
            aria-labelledby="example-modal-sizes-title-lg"
        >
            <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            ADD CONTACT PERSON
          </Modal.Title>
        </Modal.Header>
            <Modal.Body>
            <Form>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={name} placeholder="Enter name" onChange={e=>setName(e.target.value)} />
                    {
                        errors && errors.name && (<Form.Text className="text-danger">
                                {errors.name}
                            </Form.Text>)
                    }
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Nationality</Form.Label>
                    <Form.Select value={nationality} onChange={e=>setNationality(e.target.value)}>
                        <option>Choose...</option>
                        {
                            nationalities && nationalities.map((nationality, index)=>{
                                return <option value={nationality.id} key={index}>{nationality.name}</option>
                            })
                        }
                    </Form.Select>
                    {
                        errors && errors.nationality && (<Form.Text className="text-danger">
                                {errors.nationality}
                            </Form.Text>)
                    }
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="text" value={phonenumber} placeholder="Enter phone number" onChange={e=>setPhonenumber(e.target.value)} />
                    {
                        errors && errors.phone_number && (<Form.Text className="text-danger">
                                {errors.phone_number}
                            </Form.Text>)
                    }
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="text" value={email} placeholder="Enter email address" onChange={e=>setEmail(e.target.value)} />
                    {
                        errors && errors.email && (<Form.Text className="text-danger">
                                {errors.email}
                            </Form.Text>)
                    }
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Position</Form.Label>
                    <Form.Control type="text" value={position} placeholder="Enter position" onChange={e=>setPosition(e.target.value)} />
                    {
                        errors && errors.position && (<Form.Text className="text-danger">
                                {errors.position}
                            </Form.Text>)
                    }
                    </Form.Group>

                    
                </Row>
                <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridZip">
                    <Form.Label>Passport Photo</Form.Label>
                    <div>
                        <Form.Control type="file" ref={photoRef} style={{display:"none"}} onChange={handlePhotoUpload} />
                        <Button className="btn btn-success" onClick={photoDialog}><i className="bi bi-cloud-arrow-up"></i> Choose File</Button>
                        &nbsp;
                            {
                                photo&&<img src={photo} width="40" />
                            }
                    </div>
                    {
                        errors && errors.passport_photo && (<Form.Text className="text-danger">
                                {errors.passport_photo}
                            </Form.Text>)
                    }
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>NRC Front / Passport ID</Form.Label>
                        <div>
                            <Form.Control type="file" ref={idFront} style={{display:"none"}} onChange={handleFrontUpload} />
                            <Button className="btn btn-success" onClick={fileDialog}><i className="bi bi-cloud-arrow-up"></i> Choose File</Button>
                            &nbsp;
                            {
                                IdFront&&<img src={IdFront} width="40" />
                            }
                        </div>
                        {
                        errors && errors.frontid && (<Form.Text className="text-danger">
                                {errors.frontid}
                            </Form.Text>)
                    }
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridState">
                    <Form.Label>NRC Back / Visa Page</Form.Label>
                    <div>
                        <Form.Control type="file" ref={idBack} style={{display:"none"}} onChange={handleBackUpload} />
                        <Button className="btn btn-success" onClick={backDialog}><i className="bi bi-cloud-arrow-up"></i> Choose File</Button>
                        &nbsp;
                            {
                                IdBack&&<img src={IdBack} width="40" />
                            }
                    </div>
                    {
                        errors && errors.backid && (<Form.Text className="text-danger">
                                {errors.backid}
                            </Form.Text>)
                    }
                    </Form.Group>                  
                </Row>

                <Row>
                <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Sex</Form.Label>
                     <div>
                     <Form.Check
                        inline
                        label="Male"
                        name="sex"
                        type="radio"
                        value = "1"
                        checked={sex==1}
                        onChange={e=>setSex(e.target.value)}
                        
                    />
                    <Form.Check
                        inline
                        label="Female"
                        name="sex"
                        type="radio"
                        value = "0"
                        checked={sex==0}
                        onChange = {e=>setSex(e.target.value)}
                        
                    />
                    <Form.Check
                        inline
                        label="Other"
                        name="sex"
                        type="radio"
                        value = "2"
                        checked={sex==2}
                        onChange = {e=>setSex(e.target.value)}
                        
                    />
                     </div>
                     {
                        errors && errors.gender && (<Form.Text className="text-danger">
                                {errors.gender}
                            </Form.Text>)
                    }
                    </Form.Group>
                </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="warning" type="button" onClick={isToggle}>
            <i className="bi bi-x-square"></i> CLOSE
                </Button>
                {
                    isSaving?<Button variant="primary" disabled>
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Loading...
                  </Button>:<Button variant="primary" type="button" onClick={handleSubmit}>
                <i className="bi bi-plus-square"></i> UPDATE
                </Button>
                }
            
            </Modal.Footer>
        </Modal>
        </>
  )
}

export default EditContact
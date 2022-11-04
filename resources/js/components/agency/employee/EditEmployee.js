import React, { useEffect, useState, useRef } from 'react'
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';

function EditEmployee({isShow, isToggle, employeeId, editEmployee}) {
    //file
    const idFront = useRef(null);
    const idBack = useRef(null);
    const photoRef = useRef(null);

    const [errors, setErrors] = useState(); //to show validation errors
    const [name, setName] = useState('');
    const [nationalityId, setNationalityId] = useState('');
    const [position, setPosition] = useState('');
    const [gender, setGender] = useState('');

    const [nationalities, setNationalities] = useState(); //get from database for select box

    const [IdFront, setIdFront]=useState(null);//to show in view after select
    const [frontImage, setFrontImage] = useState('');//for database
    const [IdBack, setIdBack]=useState(null);//to show in view after select
    const [backImage, setBackImage] = useState('');//for database
    const [photo, setPhoto]=useState(null); //to show in view after select
    const [photoImage, setPhotoImage]= useState(''); //for database

    const [loading, setLoading] = useState(false);
    const [employee, setEmployee] = useState() //employee data for edit
    

    //get nationality data
    useEffect(async()=>{
        setLoading(true);
        //first get nationality
        await axios.get('/admin/nationality')
        .then(res=>{
            setNationalities(res.data)
        })
        .catch(err=>{
            console.log(err.message);
        })
        //get user for edit
        await axios.get(`/agency/travellers/${employeeId}`)
        .then(res=>{
            const {name, position, gender, nationality_id, id_front, id_back, photo } = res.data;
            setName(name)
            setPosition(position)
            setGender(gender)
            setNationalityId(nationality_id)
            setIdFront(`/uploads/${id_front}`)
            setIdBack(`/uploads/${id_back}`)
            setPhoto(`/uploads/${photo}`)
            setLoading(false);
        })
        .catch(err=>{
            console.log(err.message)
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
        //Append in formData for file upload
        const formData = new FormData();
        formData.append('name', name);
        formData.append('nationality', nationalityId);
        formData.append('position', position);
        formData.append('gender', gender);
        formData.append('frontid', frontImage);
        formData.append('backid', backImage);
        formData.append('passport_photo', photoImage);
        formData.append('_method', 'PUT');
        try {
            await axios.post(`/agency/travellers/${employeeId}`, formData)
            .then(res=>{
                editEmployee(res.data);
            })
            .catch(err=>{
                setErrors(err.message);
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
            //onHide={isToggle}
            aria-labelledby="example-modal-sizes-title-lg"
        >
            <Modal.Header className="d-flex justify-content-between p-3">
                <div><h4>EDIT STAFF DETAIL</h4></div>
                <div className=""><i className="bi bi-x-lg p-3" onClick={isToggle} style={{cursor:'pointer'}}></i></div>
            </Modal.Header>
            <Modal.Body>
                {
                    loading ? <div className="text-center py-5"> <Spinner animation="grow" /> </div>:(
                        <Form>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter employee name" onChange={e=>setName(e.target.value)} value={name} />
                    {
                        errors && errors.name && (<Form.Text className="text-danger">
                                {errors.name}
                            </Form.Text>)
                    }
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Nationality</Form.Label>
                    <Form.Select value={nationalityId} onChange={e=>setNationalityId(e.target.value)}>
                        <option>Choose...</option>
                        {
                            nationalities && nationalities.map((nationality, index)=>{
                                return <option value={nationality.id}  key={index}>{nationality.name}</option>
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
                    <Form.Label>Position</Form.Label>
                    <Form.Control type="text" placeholder="Enter position" value={position} onChange={e=>setPosition(e.target.value)} />
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
                    <Form.Label>NRC / Passport Front</Form.Label>
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
                    <Form.Label>NRC / Passport Back</Form.Label>
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
                    <Form.Label>Gender</Form.Label>
                     <div>
                     <Form.Check
                        inline
                        label="Male"
                        type="radio"
                        value = "1"
                        onChange={e=>setGender(e.target.value)}
                        checked={gender==1}
                        
                    />
                    <Form.Check
                        inline
                        label="Female"
                        type="radio"
                        value = "0"
                        onChange = {e=>setGender(e.target.value)}
                        checked={gender==0}
                        
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
                    )
                }
            </Modal.Body>
            <Modal.Footer>
            <Button variant="warning" type="button" onClick={isToggle}>
            <i className="bi bi-x-square"></i> CLOSE
                </Button>
            <Button variant="primary" type="button" onClick={handleSubmit}>
                <i className="bi bi-plus-square"></i> UPDATE
                </Button>
            </Modal.Footer>
        </Modal>
        </>
  )
}

export default EditEmployee
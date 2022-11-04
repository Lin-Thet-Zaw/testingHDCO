import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react'
import { Row, Col, Form, Button, Spinner, Alert, ButtonGroup} from 'react-bootstrap'
import AddEmployee from '../employee/AddEmployee';
import ShowEmployee from '../employee/ShowEmployee';

function AddTraveller({travelId, updatedTravellers}) {

    //file
    const idFront = useRef(null);
    const idBack = useRef(null);
    const photoRef = useRef(null);

    const [errors, setErrors] = useState(); //to show validation errors
    const [name, setName] = useState('');
    const [nationality, setNationality] = useState('');
    const [position, setPosition] = useState('');
    const [sex, setSex] = useState(null);

    const [nationalities, setNationalities] = useState(); //get from database for select box

    const [IdFront, setIdFront]=useState(null);//to show in view after select
    const [frontImage, setFrontImage] = useState('');//for database
    const [IdBack, setIdBack]=useState(null);//to show in view after select
    const [backImage, setBackImage] = useState('');//for database
    const [photo, setPhoto]=useState(null); //to show in view after select
    const [photoImage, setPhotoImage]= useState(''); //for database



    const [isShow, setIsShow]=useState(false);
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [employee_id, setEmployee_id] = useState(null);

    //Edit employee
    const [isEdit, setIsEdit] = useState(false)

    //travellers to set travel user
    const [addLoading, setAddLoading] = useState(false)
    const [travellers, setTravellers] = useState([])

    const [isSaving, setIsSaving] = useState(false)

    const [isSuccess, setIsSuccess] = useState(false)

    const [nextUrl, setNextUrl] = useState(null)
    const [prevUrl, setPrevUrl] = useState(null)

    const getTravellers = async()=>{
        setLoading(true)
        await axios.get(`/agency/employeetravel/${travelId}`)
        .then(res=>{
            const {travellers} = res.data;
            const result = travellers.map(traveller=>traveller.id)
            setTravellers(result)
            setLoading(false)
        })
        .catch(err=>{
            console.log(err.message)
        })
    }

    //get all employees data
    useEffect(async()=>{
        setLoading(true);
        try {
            await axios.get('/agency/travellers/list/0') //get travellers with status 0 (no from travellers)
            .then(res=>{
                setEmployees(res.data.data)
                setLoading(false)
                console.log(res.data)
                setNextUrl(res.data.next_page_url)
            })
            .catch(err=>{
                console.log(err.message)
            })
            getTravellers()
            
        } catch (error) {
            console.log(error.message);
        }

        //get nationlaity data
        await axios.get('/admin/nationality')
        .then(res=>{
            setNationalities(res.data)
        })
        .catch(err=>{
            console.log(err.message);
        })
    }, [])
    //open modal
    const opneModal=()=>{
        setIsShow(true);
    }

    const handleSaved = (employee)=>{
        setEmployees([employee, ...employees])
    }

    //show user detail
    const showDetail=employee_id=>{
        try {
            setShowDetailModal(!showDetailModal);
            setEmployee_id(employee_id)
            console.log(employee_id)
        } catch (error) {
            console.log(error.message);
        }
    }

    //show edit form
    const showEdit = (id, name, nationality, postion, sex, photo, front, back) =>{
        try {
            setEmployee_id(id)
            setName(name)
            setNationality(nationality)
            setPosition(postion)
            setSex(sex)
            setPhoto(photo)
            setIdFront(front)
            setIdBack(back)
            setIsEdit(true)
            setErrors('')
        } catch (error) {
            console.log(error.message);
        }
    }

    const cancelEdit=()=>{
        setName('')
        setNationality('')
        setPosition('')
        setSex(null)
        setPhoto(null)
        setIdFront(null)
        setIdBack(null)
        setIsEdit(!isEdit)
        setErrors('')
    }

    // update employee after update
    const handleUpdate=async()=>{
        //Append in formData for file upload
        setIsSaving(true)
        const formData = new FormData();
        formData.append('name', name);
        formData.append('nationality', nationality);
        formData.append('position', position);
        formData.append('sex', sex);
        formData.append('frontid', frontImage);
        formData.append('backid', backImage);
        formData.append('passport_photo', photoImage);
        formData.append('status', 0);
        formData.append('_method', 'PUT');

        try {
            await axios.post(`/agency/travellers/${employee_id}`, formData)
            .then(res=>{
                const index = employees.map(employee=>employee.id).indexOf(res.data.id)
                employees[index] = res.data;
                setEmployees(employees)
                //clear data
                setName('')
                setNationality('')
                setPosition('')
                setSex(null)
                setIdFront(null)
                setIdBack(null)
                setPhoto(null)
                setIsEdit(!isEdit)
                setIsSaving(false)
                setErrors('')
                setIsSuccess(true)
            })
            .catch(err=>{
                setErrors(err.response.data.errors);
                setIsSaving(false)
                setIsSuccess(false)
            })
        } catch (error) {
            console.log('Server error');
            console.log(error.message);
        }
        
    }
    

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
        formData.append('nationality', nationality);
        formData.append('position', position);
        formData.append('sex', sex);
        formData.append('frontid', frontImage);
        formData.append('backid', backImage);
        formData.append('passport_photo', photoImage);
        formData.append('travel_id', travelId);
        formData.append('status', 0);
        setIsSaving(true)
        try {
            await axios.post('/agency/travellers', formData)
            .then(res=>{
                console.log(res.data)
                getTravellers()
                setEmployees([
                    res.data,
                    ...employees
                ]);
                //clear data
                setName('')
                setNationality('')
                setPosition('')
                setSex(null)
                setIdFront(null)
                setIdBack(null)
                setPhoto(null)
                setIsSaving(false)
                setErrors('')
                setIsSuccess(true)
            })
            .catch(err=>{
               setIsSaving(false)
                setErrors(err.response.data.errors);
                setIsSuccess(false)
            })
        } catch (error) {
            console.log('Server error');
            console.log(error.message);
        }
    }

    //check each field
    const handleInputChange = (id) => {
        if(travellers.includes(id)){
          const newTravellers = travellers.filter(travellerId=>travellerId !== id);
          setTravellers(newTravellers)
        }else{
          setTravellers([...travellers, id])
        }
      }

      //add employee for travel
    const addEmployeeTravel= async() => {
        try {
          setAddLoading(true)
          await axios.post(`/agency/employeetravel/${travelId}`, {travellers})
          .then(res=>{
            updatedTravellers(res.data)
            setAddLoading(false)
            setIsSuccess(true)
            setErrors('')
          })
          .catch(err=>{
            console.log(err.message)
          })
        } catch (error) {
          console.log(error.message);
        }
      }

      //pagination data

      const nextData=async()=>{
          setLoading(true)
        await axios.get(nextUrl)
        .then(res=>{
            setPrevUrl(res.data.prev_page_url)
            setNextUrl(res.data.next_page_url)
            setEmployees(res.data.data)
            setLoading(false)
        })
        .catch(err=>{
            console.log(err.message)
        })
      }

      const previousData=async()=>{
          setLoading(true)
        await axios.get(prevUrl)
        .then(res=>{
            setPrevUrl(res.data.prev_page_url)
            setNextUrl(res.data.next_page_url)
            setEmployees(res.data.data)
            setLoading(false)
        })
        .catch(err=>{
            console.log(err.message)
        })
      }

  return (
    <>
    <div className='card'>
        <div className='card-body'>
         {
             isSuccess && <Alert variant="success" onClose={() => setIsSuccess(false)} dismissible>

             <span className='font-strong'>Success!</span>    Record updated successfully
     
             </Alert>
         }
        <Form>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Name</Form.Label>
                    <Form.Control value={name} type="text" placeholder="Enter employee name" onChange={e=>setName(e.target.value)} />
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
                    <Form.Label>Position</Form.Label>
                    <Form.Control value={position} type="text" placeholder="Enter position" onChange={e=>setPosition(e.target.value)} />
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
                        checked={sex==1}
                        label="Male"
                        name="sex"
                        type="radio"
                        value = "1"
                        onChange={e=>setSex(e.target.value)}
                        
                    />
                    <Form.Check
                        inline
                        checked={sex==0}
                        label="Female"
                        name="sex"
                        type="radio"
                        value = "0"
                        onChange = {e=>setSex(e.target.value)}
                        
                    />
                    <Form.Check
                        inline
                        checked={sex==2}
                        label="Other"
                        name="sex"
                        type="radio"
                        value = "2"
                        onChange = {e=>setSex(e.target.value)}
                        
                    />
                     </div>
                     {
                        errors && errors.sex && (<Form.Text className="text-danger">
                                {errors.sex}
                            </Form.Text>)
                    }
                    </Form.Group>
                </Row>
                </Form>
                <hr />
                <div className='mt-4'>
                    {
                        isSaving?(<Button variant="primary" disabled>
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        Loading...
                      </Button>):isEdit?<><Button variant="warning" type="button" onClick={cancelEdit}>
                       <i className="bi bi-x-square"></i> CANCEL
                           </Button>&nbsp;
                        <Button variant="primary" type="button" onClick={handleUpdate}>
                            <i className="bi bi-plus-square"></i> UPDATE
                        </Button></>:<>
                        <Button variant="primary" type="button" onClick={handleSubmit}>
                            <i className="bi bi-plus-square"></i> ADD
                        </Button></>
                    }
                </div>

                {/* end add form */}

                
        </div>
    </div>
    <div className='card mt-3'>
        <div className='card-body'>
        {
                    loading?<div className='text-center'><Spinner animation="grow" /></div>:
                <table className="table table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Nationality</th>
                        <th>Position</th>
                        <th>Sex</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        employees.length >0 && employees.map((employee, index)=>{
                            return (
                                <tr key={index}>
                                    <td>
                                        <Form.Check type='checkbox' name={employee.id} checked={travellers.includes(employee.id)}
                                              value={employee.id} onChange={e=>handleInputChange(employee.id)} />
                                    </td>
                                    <td>{employee.name}</td>
                                    <td>{employee.nationality.name}</td>
                                    <td>{employee.position}</td>
                                    <td>{employee.sex==1?'Male':employee.sex==2?'Other':'Female'}</td>
                                    <td>
                                    <i className="bi bi-eye mousePointer text-info" onClick={()=>showDetail(employee.id)}></i> &nbsp; 
                                    <i className="bi bi-pencil-square mousePointer text-primary" onClick={()=>showEdit(employee.id, employee.name, employee.nationality_id, employee.position, employee.sex, employee.photo, employee.id_front, employee.id_back)}></i> &nbsp; 
                                    <i className="bi bi-trash mousePointer text-danger"></i>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    
                    
                 
                    {
                        addLoading?<Button variant="primary" disabled className='mt-2'>
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        Loading...
                      </Button>: !loading && employees.length >0 && <button className='btn btn-primary mt-2' onClick={addEmployeeTravel}>Submit</button>
                    }

                    
                    
                </tbody>
            </table>
        }
            {
                !loading && employees.length > 0 && <div className='d-flex justify-content-end'>
                        <ButtonGroup size='sm'>
                            <Button variant="primary" disabled={prevUrl===null} onClick={previousData}>Previous</Button>
                            <Button variant="primary" disabled={nextUrl===null} onClick={nextData}>Next</Button>
                        </ButtonGroup>
                </div>
            }
        {isShow && <AddEmployee isShow={isShow} isToggle={()=>setIsShow(false)} savedEmployee={handleSaved} /> } {/* Modal to add employee */}
        {showDetailModal && <ShowEmployee isDetailShow = {showDetailModal} employeeId= {employee_id} isToggle={e=>setShowDetailModal(false)} />}
        </div>
    </div>
    </>
  )
}

export default AddTraveller
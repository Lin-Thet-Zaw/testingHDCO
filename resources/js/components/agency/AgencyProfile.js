import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Form, Row, Button, Col, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import StaffList from './staff/StaffList';

function AgencyProfile() {
    const imageRef = useRef(null);
    const [agencies, setAgencies] = useState();
    const [logo, setLogo]=useState('');
    const [image, setImage]=useState();
    const [isLoading, setIsLoading]=useState(false); //check user is clicked saved button
    const [show, setShow]=useState(false); //show alert message
    const [loading, setLoading] = useState(false) //check loading first useEffect hook request
    const [inputData, setInputData] = useState({
       name:'',
       phone_number:'',
       email:'',
       website:'',
       socialmedia:'',
       country_address:'',
       rakhine_address:'',
       funded_organizations:'',
       town:'',
       started_date:'',
       type:'',
    });
    const [towns, setTowns] = useState();
    const [errors, setErrors]=useState();
    const [isUpdate, setIsUpdate]=useState(false);
    const [profileId, setProfileId] = useState();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputData({
          ...inputData,
          [name]: value,
        });
      };


    useEffect(async()=>{
        setLoading(true)
        try {
            //get agency type
            await axios.get('/admin/agencytype')
            .then(res=>{
                setAgencies(res.data);
            })
            .catch(err=>{
                console.log(err.message);
            })

            await axios.get('/admin/towns')
            .then(res=>{
                setTowns(res.data);
            })
            .catch(err=>{
                console.log(err.message);
            })

            //get profile if already exist
            await axios.get('/agency/profile/1') // set default value 1 for id requirement no use really
            .then(res=>{
                if(res.data.profile){
                    const {id, name, phonenumber, email, website, socialmedia, country_address, rakhine_address, funded_organizations, town_id, started_date, agencytype_id, logo} = res.data.profile
                    setInputData({
                        ['name']:name,
                        ['phone_number']:phonenumber,
                        ['email']: email,
                        ['website']:website?website:'',
                        ['socialmedia']:socialmedia?socialmedia:'',
                        ['country_address']:country_address,
                        ['rakhine_address']:rakhine_address,
                        ['funded_organizations']:funded_organizations,
                        ['started_date']: started_date,
                        ['town'] : town_id,
                        ['type']: agencytype_id
                    })
                    setImage(logo);
                    setIsUpdate(true);
                    setProfileId(id);
                    setLoading(false)
                }
            })
            .catch(err=>{
                setLoading(false)
            })
        } catch (error) {
            console.log('Server error'+error.message);
        }
    }, []);

    //Open file dialog
    const openFileDialog=()=>{
        try {
            imageRef.current.click();
        } catch (error) {
            console.log(error.message);
        }
    }
    //handle file upload
    const handleFileUpload=event=>{
        try {
            setLogo(event.target.files[0]); //to save database
            setImage(URL.createObjectURL(event.target.files[0])) //to show view
        } catch (error) {
            console.log(error.message);
        }
    }

    const saveProfile = async(e)=>{
        e.preventDefault();
        setIsLoading(true);
        let formData = new FormData();
        const {
            name,
            phone_number,
            email,
            website,
            socialmedia,
            country_address,
            rakhine_address,
            funded_organizations,
            town,
            started_date,
            type
        }=inputData;
        formData.append('name', name);
        formData.append('phone_number', phone_number);
        formData.append('email', email);
        formData.append('website', website);
        formData.append('socialmedia', socialmedia);
        formData.append('country_address', country_address);
        formData.append('rakhine_address', rakhine_address);
        formData.append('funded_organizations', funded_organizations);
        formData.append('town', town);
        formData.append('started_date', started_date);
        formData.append('type', type);
        formData.append('logo', logo);
        try {
            //check is update
            if(!isUpdate){
                await axios.post('/agency/profile', formData)
                .then(res=>{
                    setIsLoading(false);
                    setIsUpdate(true);
                    setShow(true);
                    setProfileId(res.data.id);
                    setErrors('')
                })
                .catch(err=>{
                    setErrors(err.response.data.errors);
                    setIsLoading(false);
                })
            }else{
                formData.append('_method', 'PUT'); // Put method no work well in laravel update so use post
                await axios.post(`/agency/profile/${profileId}`, formData)
                .then(res=>{
                    setIsLoading(false);
                    setShow(true);
                    setErrors('')
                })
                .catch(err=>{
                    setErrors(err.response.data.errors);
                    setIsLoading(false);
                })
            }
            
        } catch (error) {
            console.log(error.message);
        }
    }

  return (
    <>
    <h4>General Information</h4>
    <div className="card shadow-sm">
        <div className="card-body">
            
            <div className="text-center py-3">
                {isLoading || loading && (<div className='text-center'><Spinner animation="grow" /></div>)}
                {show && <Alert variant="success" onClose={() => setShow(false)} dismissible>
 
                        <strong>Success! </strong>Record updated successfully!
 
                </Alert>}
                
            </div>
            {/* profile add part */}
                <Form>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridName">
                        <Form.Label>Organization Name With Abbreviation</Form.Label>
                        <Form.Control type="text" placeholder="Humanitarian and Development Coordination Office (HDCO)" name="name" default="abc" value={inputData.name} onChange={handleInputChange} />
                        {
                            errors && errors.name && (<Form.Text className="text-danger">
                                {errors.name}
                            </Form.Text>)
                        }
                            
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPhonenumber">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="text" placeholder="09 . . . . . . 123" name="phone_number" value={inputData.phone_number} onChange={handleInputChange} />
                        {
                            errors && errors.phone_number && (<Form.Text className="text-danger">
                                {errors.phone_number}
                            </Form.Text>)
                        }
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" placeholder="example@mail.com" name="email" value={inputData.email} onChange={handleInputChange} />
                        {
                            errors && errors.email && (<Form.Text className="text-danger">
                                {errors.email}
                            </Form.Text>)
                        }
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridWebsite">
                        <Form.Label>Website <small className='optional'>(Optional)</small></Form.Label>
                        <Form.Control type="url" placeholder="https://www.websitename.com" name="website" value={inputData.website} onChange={handleInputChange} />
                        {
                            errors && errors.website && (<Form.Text className="text-danger">
                                {errors.website}
                            </Form.Text>)
                        }
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Social Media <small className='optional'>(Optional)</small></Form.Label>
                        <Form.Control type="text" placeholder="https://www.facebook.com/pagename" name="socialmedia" value={inputData.socialmedia} onChange={handleInputChange} />
                        {
                            errors && errors.socialmedia && (<Form.Text className="text-danger">
                                {errors.socialmedia}
                            </Form.Text>)
                        }
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridWebsite">
                        <Form.Label>Funding Partner</Form.Label>
                        <Form.Control placeholder="ABC, DEF, GHI" name="funded_organizations" value={inputData.funded_organizations} onChange={handleInputChange} />
                        {
                            errors && errors.funded_organizations && (<Form.Text className="text-danger">
                                {errors.funded_organizations}
                            </Form.Text>)
                        }
                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <Form.Label>Country Office Address</Form.Label>
                        <Form.Control placeholder="No.123, Example St, Quarter Name, City, Country" name="country_address" value={inputData.country_address} onChange={handleInputChange} />
                        {
                            errors && errors.country_address && (<Form.Text className="text-danger">
                                {errors.country_address}
                            </Form.Text>)
                        }
                    </Form.Group>
                    
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridName">
                        <Form.Label>The Main Office Address In Arakan</Form.Label>
                        <Form.Control placeholder="No.123, Street name, Quarter name," name="rakhine_address" value={inputData.rakhine_address} onChange={handleInputChange} />
                        {
                            errors && errors.rakhine_address && (<Form.Text className="text-danger">
                                {errors.rakhine_address}
                            </Form.Text>)
                        }
                            
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPhonenumber">
                        <Form.Label>Township</Form.Label>
                            <Form.Select name="town" onChange={handleInputChange} value={inputData.town}>
                                <option value=''>Choose...</option>
                                {
                                    towns && towns.map((town, index)=>{
                                        return <option key={index} value={town.id}>{town.name}</option>
                                    })
                                }
                            </Form.Select>
                            {errors && errors.town && (<Form.Text className="text-danger">
                            {errors.town}
                            </Form.Text>)}
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Col md="5">
                        <Form.Group controlId="formGridCity">
                        <Form.Label>Operation Started Date In Arakan</Form.Label>
                            <Form.Control type="date" name="started_date" value={inputData.started_date} onChange={handleInputChange} />
                            {
                            errors && errors.started_date && (<Form.Text className="text-danger">
                                {errors.started_date}
                            </Form.Text>)
                        }
                        </Form.Group>
                        </Col>

                        <Col md="4">
                        <Form.Group controlId="formGridState">
                        <Form.Label>Type Of Agency</Form.Label>
                        <Form.Select name="type" onChange={handleInputChange} value={inputData.type}>
                            <option value=''>Choose...</option>
                            {agencies && agencies.map((agency, index)=>{
                                return <option key={index} value={agency.id}>{agency.name}</option>
                            })}
                        </Form.Select>
                        {
                            errors && errors.type && (<Form.Text className="text-danger">
                                {errors.type}
                            </Form.Text>)
                        }
                        </Form.Group>
                        </Col>

                        <Col md="3">
                        <Form.Group controlId="formGridZip">
                        <Form.Label>Organization Logo</Form.Label>
                        <Form.Control style={{ display: "none" }} ref={imageRef} onChange={handleFileUpload} type="file"/>
                         <Button className="btn btn-success" onClick={openFileDialog}>Choose File&nbsp;<i className="bi bi-cloud-arrow-up"></i></Button>
                         {image && <img alt="logo" src={image} style={{ width: '30px', marginLeft: '5px'}} />}
                         {
                            errors && errors.logo && (<Form.Text className="text-danger">
                                {errors.logo}
                            </Form.Text>)
                        }
                        </Form.Group>
                        </Col>
                    </Row>

                    {
                        isLoading?
                        (<Button variant="primary" disabled>
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        Loading...
                      </Button>):
                      (
                        <Button variant="primary" type="submit" onClick={saveProfile}>
                        {isUpdate?'UPDATE': 'SAVE'} <i className="bi bi-upload"></i>
                        </Button>
                        )
                    }
                </Form>
            {/* end profile add part */}
        </div>
    </div>
    <h4 className='mt-3'>Staff Information</h4>
    <div className='card mt-3'>
        <div className='card-body'>
            <StaffList />
        </div>
    </div>
    </>
  )
}

export default AgencyProfile

if (document.getElementById('agencyprofile')) {
    ReactDOM.render(<AgencyProfile />, document.getElementById('agencyprofile'));
}
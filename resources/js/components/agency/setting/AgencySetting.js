import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import { Button, Form,  Spinner, Alert } from 'react-bootstrap'

function AgencySetting() {

  const [user, setUser] = useState({
    name:'',
    email:'',
    id:''
  })
  const [errors, setErrors] = useState()
  const [isLoading, setIsLoading] = useState(false) //user data request loading
  const [loading, setLoading] = useState(false) //password change loading
  const [loadingUser, setLoadingUser] = useState(false) //loading user update
  const [isSuccess, setIsSuccess] = useState()
  const [data, setData] = useState({
    current_password:'',
    new_password:'',
    new_password_confirmation:'',
  })

  useEffect(async()=>{
    setIsLoading(true)
    await axios.get('/agency/getuser')
    .then(res=>{
      setUser(res.data)
      setIsLoading(false)
    })
    .catch(err=>{
      console.log(err.message)
    })
  }, [])

  //password change
  const handleChange = e=>{
    const {name, value} = e.target;
      setData({
        ...data,
        [name]:value
    })
  }

  //user detail handle
  const handleUser = e=>{
    const {name, value} = e.target
    setUser({
      ...user,
      [name]:value
    })
  }

  //change user detail
  const updateUser = async(e)=>{
    setLoadingUser(true)
    try {
      e.preventDefault();
      await axios.post(`/agency/updateuser/${user.id}`, user)
      .then(res=>{
        setIsSuccess(res.data)
        setErrors('')
        setLoadingUser(false)
      })
      .catch(err=>{
        setErrors(err.response.data.errors)
        setLoadingUser(false)
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  //change passwrod
  const changePassword = async(e)=>{
    try {
      e.preventDefault()
      setLoading(true)
      await axios.post('/agency/changepassword', data)
      .then(res=>{
        setIsSuccess(res.data)
        setData({
          current_password:'',
          new_password:'',
          new_password_confirmation:''
        })
        setErrors('')
        setLoading(false)
      })
      .catch(err=>{
        setErrors(err.response.data.errors)
        setLoading(false)
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <>
    <h4>Setting</h4>
    <div className="card shadow-sm">
      <div className='text-center'>
        {loading && <Spinner animation='grow' />}
          {isSuccess && <Alert variant="success" onClose={() => setIsSuccess(null)} dismissible>
          <strong>Success! </strong>
            {isSuccess.success}
        </Alert>}
      </div>
      <div className="card-body">
          <div className="row justify-content-center mb-5">
              <div className="col-md-12">
              <h4 className="mb-4">Account Information</h4>
              {
                isLoading&&<div className='text-center'><Spinner animation='grow' /></div>
              }
              <Form>
                <Form.Group className="mb-3" controlId="formGridAddress2">
                  <Form.Label>User Name</Form.Label>
                  <Form.Control type='text' isInvalid={errors && errors.name } placeholder="Enter username" name='name' onChange={handleUser} value={user.name} />
                  {
                    errors && errors.name && <Form.Text className="text-danger">{errors.name}</Form.Text>
                  }
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridAddress2">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type='email' placeholder="Enter email address" name='email' onChange={handleUser} value={user.email} />
                  {
                    errors && errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>
                  }
                </Form.Group>
                  {
                    loadingUser?<Button variant="primary" disabled>
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Loading...
                  </Button>:<Button variant="primary" type="submit" onClick={updateUser}>
                  UPDATE <i className="bi bi-check-circle"></i>
                </Button>
                  }
                
                </Form>
              </div>
          </div> 
                  <hr />
          <div className="row justify-content-center mt-5">  
          <div className="col-md-12">
                <h4 className="mb-4">Change Password</h4>
              <Form>
                  <Form.Group className="mb-3" controlId="formGridAddress1">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control type='password' isInvalid={errors&&errors.current_password} placeholder="Enter current password" name='current_password' onChange={handleChange} value={data.current_password} />
                    {
                      errors && errors.current_password && <Form.Text className="text-danger">{errors.current_password}</Form.Text>
                    }
                    
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formGridAddress2">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type='password' isInvalid={errors && errors.new_password } placeholder="Enter new password" name='new_password' onChange={handleChange} value={data.new_password} />
                    {
                      errors && errors.new_password && <Form.Text className="text-danger">{errors.new_password}</Form.Text>
                    }
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formGridAddress2">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type='password' placeholder="Enter confirm password" name='new_password_confirmation' onChange={handleChange} value={data.new_password_confirmation} />
                  </Form.Group>
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
                    </Button>:<Button variant="primary" type="submit" onClick={changePassword}>
                    CONFIRM <i className="bi bi-check-circle"></i>
                  </Button>
                    }
                  
              </Form>
              </div>
          </div>
      </div>
    </div>
    </>
  )
}

export default AgencySetting

if (document.getElementById('agencysetting')) {
    ReactDOM.render(<AgencySetting />, document.getElementById('agencysetting'));
}
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ListGroup, Spinner, Badge, Form, Alert, Button } from 'react-bootstrap'
import ReactDOM from 'react-dom'
import DelModal from './DelModal'

function Donors() {

    const [name, setName] = useState('')
    const [donors, setDonors] = useState([])
    const [requestLoading, setRequestLoading] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [id, setId] = useState(0)
    const [isDelete, setIsDelete] = useState(false)
    const [errors, setErrors] = useState()
    const [isInfo, setIsInfo] = useState(false)

    const [isLoading, setIsLoading] = useState(false) // loading on data saving
    const [profileError, setProfileError] = useState(false) //to show profile error


    //get donors
    useEffect(()=>{
        setRequestLoading(true)
        axios.get('/agency/getdonors')
        .then(res=>{
            setDonors(res.data)
            setRequestLoading(false)
        })
        .catch(err=>{
            console.log(err.message)
            setRequestLoading(false)
        })
    }, [])

    //add new name
    const handleSubmit = e=>{
        e.preventDefault()
        setIsLoading(true)
        try {
            axios.post('/agency/donors', {name})
            .then(res=>{
                setDonors([res.data, ...donors])
                setName('')
                setIsInfo(true)
                setErrors('')
                setIsLoading(false)
            })
            .catch(err=>{
                setIsInfo(false)
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

    //edit Name
    const editName=(id, name)=>{
        setName(name)
        setId(id)
        setIsEdit(true)
    }

    //cancel edit
    const handleCancel=()=>{
        setName('')
        setIsEdit(false)
    }

    //handle update
    const handleUpdate=()=>{
        try {
            setIsLoading(true)
            axios.put(`/agency/donors/${id}`, {name})
            .then(res=>{
                const index = donors.map(donor=>donor.id).indexOf(id);
                donors[index]=res.data
                setDonors(donors)
                setName('')
                setIsEdit(false)
                setIsInfo(true)
                setIsLoading(false)
                setErrors('')
            })
            .catch(err=>{
                setErrors(err.response.data.errors)
                setIsInfo(false)
                setIsLoading(false)
            })
        } catch (err) {
            console.log(err)
        }
    }

    //del donor
    const delDonor=id=>{
        setId(id)
        setIsDelete(true)
    }

    //update deleted data
    const updateDelData=data=>{
        const newData = donors.filter(donor=>donor.id !== data.id)
        setDonors(newData)
        setIsDelete(false)
        setIsInfo(true)
    }

  return (
      <>
      <h4>Donors</h4>
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
                <div className="input-group">
                                <input type="text" value={name} className="form-control" placeholder="Enter donor name" onChange={e=>setName(e.target.value)} />
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
                                  </Button>:
                                isEdit?
                                <>
                                <button className="btn btn-danger" type="button" onClick={handleCancel}>Cancel</button>
                                <button className="btn btn-primary" type="button" onClick={handleUpdate}>Update</button>
                                </>:
                                <button className="btn btn-primary" type="button" onClick={handleSubmit}>Add <i class="bi bi-plus-lg"></i>
                                </button>
                                }
                                
                </div>
                {
                        errors && errors.name && (<Form.Text className="text-danger">
                                {errors.name}
                            </Form.Text>)
                    }

                {/* list group start */}
                <ListGroup className="mt-3">
                        {requestLoading?(<div className="text-center"><Spinner animation="grow" /></div>):<>
                                {donors && donors.map((donor, index)=>{
                                return (
                                    <ListGroup.Item
                                        key={index}
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        {donor.name}
                                        </div>
                                        <i className="bi bi-pencil-square mousePointer text-primary" onClick={e=>editName(donor.id, donor.name)}></i>&nbsp;
                                        <i className="bi bi-trash mousePointer text-danger" onClick={e=>delDonor(donor.id)}></i>
                                    </ListGroup.Item>
                                )
                            })}
                            </>
                        }
                        
                        
                    </ListGroup>
        </div>
        {
            isDelete && <DelModal isShow={isDelete} isToggle={e=>setIsDelete(false)} recordId={`donors/${id}`} handleUpdate={updateDelData} />
        }
    </div>
    </>
  )
}

export default Donors

if(document.getElementById('donors')){
    ReactDOM.render(<Donors />, document.getElementById('donors'));
}

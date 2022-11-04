import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Spinner, Button } from 'react-bootstrap'
import DeleteModal from './DeleteModal'
function StaffList() {
    const [inputData, setInputData] = useState({
        community:'',
        number_of_staff:''
    })
    const [errors, setErrors] = useState()
    const [communities, setCommunities] = useState() // note community not nationality
    const [staffs, setStaffs] = useState([])
    const [loading, setLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false) //loading on data saving

    const [isDelete, setIsDelete] = useState(false)
    const [staffId, setStaffId] = useState()

    const [isEdit, setIsEdit] = useState(false)

    const [profileError, setProfileError] = useState(false) //to show profile error

    useEffect(()=>{
        setLoading(true)
        try {
            //get nationality
            axios.get('/admin/community')
            .then(res=>{
                setCommunities(res.data)
            })
            .catch(err=>{
                console.log(err.message);
            })

            //staff list
            axios.get('/agency/staffs')
            .then(res=>{
                
                setStaffs(res.data)
                setLoading(false)
            })
            .catch(err=>{
                setLoading(false)
                console.log(err.message)
            })
        } catch (err) {
            console.log(err.message)
        }
    }, [])

    const handleInputChange=e=>{
        const {name, value} = e.target
        setInputData({
            ...inputData,
            [name]:value
        })
    }

    const handleSubmit=()=>{
        try {
            setIsSaving(true)
            axios.post('/agency/staffs', inputData)
            .then(res=>{
                setStaffs([
                    res.data,
                    ...staffs
                ])
                setInputData({
                    community:'',
                    number_of_staff:''
                })
                setErrors('')
                setIsSaving(false)
            })
            .catch(err=>{
                setIsSaving(false)
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

    //edit data
    const handleEdit = (community_id, staffs, id)=>{
        setInputData({
            number_of_staff:staffs,
            community:community_id
        })
        setStaffId(id)
        setIsEdit(true)
    }

    const handleUpdate = ()=>{
        try {
            setIsSaving(true)
            axios.put(`/agency/staffs/${staffId}`, inputData)
            .then(res=>{
                const index = staffs.map(staff=>staff.id).indexOf(res.data.id)
                staffs[index] = res.data
                setStaffs(staffs)
                setInputData({
                    community:'',
                    number_of_staff:''
                })
                setIsEdit(!isEdit)
                setErrors('')
                setIsSaving(false)
            })
            .catch(err=>{
                setIsSaving(false)
                setErrors(err.response.data.errors)
            })
            
        } catch (err) {
            console.log(err.message)
        }
    }

    const handleCancel = ()=>{
        setInputData({
            community:'',
            number_of_staff:''
        })
        setIsEdit(false)
    }


    //delete data
    const handleDelete=id=>{
        setStaffId(id)
        setIsDelete(!isDelete)
    }

    const deleteData=data=>{
        const newData = staffs.filter(staff=>staff.id !== data.id);
        setStaffs(newData)
        setIsDelete(!isDelete)
    }
  return (
    <>
        <div>
        <Row className="mb-3">
            {
                profileError && <p className='text-danger'><strong>Error! </strong>Please fill general information first.</p>
            }
                    <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Select name='community' onChange={handleInputChange} value={inputData.community}>
                        <option>Choose Community ...</option>
                        {
                            communities && communities.map((community, index)=>{
                                return <option value={community.id} key={index}>{community.name}</option>
                            })
                        }
                    </Form.Select>
                    {
                        errors && errors.community && (<Form.Text className="text-danger">
                                {errors.community}
                            </Form.Text>)
                    }
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridName">
                        <Form.Control type="text" placeholder="Number Of Employees" name="number_of_staff" value={inputData.number_of_staff} onChange={handleInputChange} />
                        {
                            errors && errors.number_of_staff && (<Form.Text className="text-danger">
                                {errors.number_of_staff}
                            </Form.Text>)
                        }
                            
                        </Form.Group>
                        <Form.Group as={Col} >
                            {
                                isSaving?
                                <Button variant="primary" disabled>
                                <Spinner
                                  as="span"
                                  animation="grow"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                />
                                Loading...
                              </Button>
                              :
                                isEdit ?
                                <>
                                <button className="btn btn-danger" type="button" onClick={handleCancel}>Cancel</button> 
                                <button className='btn btn-primary' onClick={handleUpdate}>UPDATE</button>
                                </>:
                                <button className='btn btn-primary' onClick={handleSubmit}>ADD <i class="bi bi-plus-lg"></i>
                                </button>
                            }
                            
                        </Form.Group>
                    </Row>
        </div>
        {
            loading || !staffs ? <div className='text-center'><Spinner animation='grow' size='sm' /></div>:(
                <table className='table table-hover'>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Community</th>
                    <th>Total</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    (

                            staffs && staffs.map((staff, index)=>{
                                return (
                                    <tr key={index}>
                                        <td>{++index}</td>
                                        <td>{staff.community.name}</td>
                                        <td>{staff.staffs}</td>
                                        <td>
                                        <i className="bi bi-pencil-square mousePointer text-primary" onClick={e=>handleEdit(staff.community_id, staff.staffs, staff.id)}></i> &nbsp; 
                                        <i className="bi bi-trash mousePointer text-danger" onClick={e=>handleDelete(staff.id)}></i>
                                        </td>
                                    </tr>
                                )
                            })
                    )
                }
            </tbody>
        </table>
            )
        }
       

        {
            isDelete && <DeleteModal isShown={isDelete} isToggle={e=>setIsDelete(!isDelete)} id={staffId} deleteData={deleteData} />
        }
    </>
  )
}

export default StaffList
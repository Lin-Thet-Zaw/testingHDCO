import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Row, Col, Form, InputGroup, Alert, Spinner, Button } from 'react-bootstrap'
import axios from 'axios'
import DeleteModal from './DeleteModal'

function Budgets() {
    const [budget, setBudget] = useState('')
    const [year, setYear] = useState(new Date().getFullYear())
    const [address, setAddress] = useState('')

    const [budgets, setBudgets] = useState([])
    const [errors, setErrors] = useState()

    const [isEdit, setIsEdit] = useState(false)
    const [budgetId, setBudgetId] = useState()

    const [isDelete, setIsDelete] = useState(false)

    const [isInfo, setIsInfo] = useState(false)

    const [loading, setLoading] = useState(false) //for first data request
    const [isLoading, setIsLoading] = useState(false) //for data save

    const [profileError, setProfileError] = useState(false) //to show profile error

    //get all yearly data
    useEffect(()=>{
        setLoading(true)
        axios.get('/agency/annualbudgets')
        .then(res=>{
            setBudgets(res.data)
            setLoading(false)
        })
        .catch(err=>{
            console.log(err.message)
            setLoading(false)
        })
    }, [])


    const handleSubmit=()=>{
        try {
            setIsLoading(true)
            axios.post('/agency/budgets', {budget, address, year})
            .then(res=>{
                setBudgets([
                    res.data,
                    ...budgets
                ])
                setYear(new Date().getFullYear())
                setBudget('')
                setErrors('')
                setAddress('')
                setIsInfo(true)
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


    const handleEdit =(id, year, amount, address)=>{
        setBudget(amount)
        setAddress(address)
        setYear(year)
        setBudgetId(id)
        setIsEdit(true)
    }

    const handleCancel=()=>{
        setBudget('')
        setAddress('')
        setYear(new Date().getFullYear())
        setIsEdit(!isEdit)
    }

    const handleUpdate = ()=>{
        try {
            setIsLoading(true)
            axios.put(`/agency/budgets/${budgetId}`, {year, budget, address})
            .then(res=>{
                const index = budgets.map(budget=>budget.id).indexOf(budgetId)
                budgets[index].amount = res.data.amount
                budgets[index].year= res.data.year
                setBudgets(budgets)
                setBudget('')
                setAddress('')
                setYear(new Date().getFullYear())
                setIsEdit(!isEdit)
                setErrors('')
                setIsInfo(true)
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

    //delete data
    const handleDelete=id=>{
        setBudgetId(id)
        setIsDelete(!isDelete)
    }

    const deleteData=(data)=>{
        const newData = budgets.filter(budget=>budget.id !== data.id);
        setBudgets(newData)
        setIsDelete(!isDelete)
        setIsInfo(true)
    }

  return (
      <>
      <h4>Annual Budget</h4>
    <div className='card'>
        <div className='card-body'>
            {
                isInfo && (
                    <Alert variant="success" onClose={() => setIsInfo(false)} dismissible>

                        <span className='font-strong'>Success!</span>    Record updated successfully

                    </Alert>
                )
            }
            {
                profileError && <p className='text-danger'><strong>Error </strong>Please fill general information first.</p>
            }
            <Row className="align-items-center">
                <Col sm="2">
                <Form.Label htmlFor="inlineFormInput" visuallyHidden>
                    Year
                </Form.Label>
                <Form.Control value={year} className='mb-2' onChange={e=>setYear(e.target.value)} disabled />
                </Col>

                <Col sm="3">
                <Form.Label htmlFor="inlineFormInput" visuallyHidden>
                    Location
                </Form.Label>
                <Form.Select value={address} className='mb-2' onChange={e=>setAddress(e.target.value)}>
                    <option value={''}>Choose ...</option>
                    <option value='Rakhine'>Rakhine</option>
                    <option value='Myanmar'>Myanmar</option>
                </Form.Select>
                </Col>


                <Col sm="4">
                <Form.Label htmlFor="inlineFormInputGroup" visuallyHidden>
                    Annual Budget
                </Form.Label>
                <InputGroup className="mb-2">
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control type="text" name='budget' value={budget} placeholder="Enter annual budget" onChange={e=>setBudget(e.target.value)} />
                          
                </InputGroup>
                </Col>
                <Col xs="auto mb-2">
                {
                        isLoading?(<Button variant="primary" disabled>
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        Loading...
                      </Button>):isEdit?<><button className='btn btn-danger' onClick={handleCancel}>CANCEL</button> <button className='btn btn-primary' onClick={handleUpdate}>UPDATE</button></>:<button className='btn btn-primary' onClick={handleSubmit}>ADD <i class="bi bi-plus-lg"></i></button>
                    }
                
                </Col>
                
                <div>
                            {
                                errors && errors.year && (<Form.Text className="text-danger">
                                    {errors.year}
                                </Form.Text>)
                            }
                            &nbsp;&nbsp;
                            {
                                errors && errors.address && (<Form.Text className="text-danger">
                                    {errors.address}
                                </Form.Text>)
                            }

                            &nbsp;&nbsp;

                            {
                                errors && errors.budget && (<Form.Text className="text-danger">
                                    {errors.budget}
                                </Form.Text>)
                            }
                </div>
            </Row>
                <div>
                {
                    loading || !budgets? <div className="text-center"><Spinner animation="grow" /></div> :(<table className='table table-hover'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Year</th>
                                <th>Location</th>
                                <th>Budget</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                            
                        <tbody>
                            {
                                budgets.map((budget, index)=>{
                                    return (
                                        <tr>
                                            <td>{++index}</td>
                                            <td>{budget.year}</td>
                                            <td>{budget.address}</td>
                                            <td style={{textAlign:"right", width:"16%"}}>{budget.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                            <td>
                                                <i className="bi bi-pencil-square mousePointer text-primary" onClick={e=>handleEdit(budget.id, budget.year, budget.amount, budget.address)} ></i> &nbsp; 
                                                <i className="bi bi-trash mousePointer text-danger" onClick={e=>handleDelete(budget.id)}></i>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>)
                }
                
                    
                </div>
        </div>
        {
            isDelete && <DeleteModal isShown={isDelete} isToggle={e=>setIsDelete(!isDelete)} id={budgetId} deleteData={deleteData} />
        }
    </div>
    </>
  )
}

export default Budgets

if(document.getElementById('budgets')){
    ReactDOM.render(<Budgets /> , document.getElementById('budgets'));
}
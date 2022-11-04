import React, { useEffect, useState } from 'react'
import { Form, Modal, Spinner, Button } from 'react-bootstrap'

function FromTraveller({travelId, updatedTravellers}) {
    const [employees, setEmployees] = useState()
    const [loading, setLoading] = useState(false)
    const [addLoading, setAddLoading] = useState(false) //loading to all travellers
    const [travellers, setTravellers] = useState([])

    useEffect(async()=>{
      setLoading(true)
      await axios.get(`/agency/employeetravel/${travelId}`)
      .then(res=>{
        const {employees, travellers} = res.data;
        setEmployees(employees);
        const result = travellers.map(traveller=>traveller.id)
        setTravellers(result)
        setLoading(false)
      })
      .catch(err=>{
        console.log(err.message)
      })
    }, [])


    //check all fields
    const checkAll = e=>{
        if(e.target.checked){
          const newTravellers = employees.map(employee=>employee.id)
          setTravellers(newTravellers)
        }else{
          setTravellers([]);
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
    };

    //add employee for travel
    const addEmployeeTravel= async() => {
      try {
        setAddLoading(true)
        await axios.post(`/agency/employeetravel/${travelId}`, {travellers})
        .then(res=>{
          console.log(res.data)
          updatedTravellers(res.data)
          setAddLoading(false)
        })
        .catch(err=>{
          console.log(err.message)
        })
      } catch (error) {
        console.log(error.message);
      }
    }
  return (
    <div>
        <div className='card mt-3'>
                  <div className='card-body'>
                      <table className="table table-hover">
                          <thead>
                              <tr>
                                  <th><Form.Check type='checkbox' onClick={checkAll} checked={!loading && employees && employees.length === travellers.length} /></th>
                                  <th>Name</th>
                                  <th>Position</th>
                                  <th>Gender</th>
                              </tr>
                          </thead>
                          <tbody>
                          {
                              loading || !employees?<Spinner animation="grow" />:
                              employees.map((employee, index)=>{
                                  return (
                                      <tr key={index}>
                                          <td>
                                          <Form.Check type='checkbox'
                                          name={employee.id}
                                          checked={travellers.includes(employee.id)}
                                          value={employee.id} onChange={e=>handleInputChange(employee.id)} /></td>
                                          <td>{employee.name}</td>
                                          <td>{employee.position}</td>
                                          <td>{employee.gender===1?'Male':'Female'}</td>
                                      </tr>
                                  )
                              })
                          }
                          </tbody>
                      </table>
                          <div className="float-end">
                            <Button variant="warning" >CANCEL <i class="bi bi-x-circle"></i></Button>&nbsp;
                            <Button variant="primary" onClick={addEmployeeTravel}>SAVE <i class="bi bi-cloud-arrow-up"></i></Button>
                          </div>
                  </div>
              </div>
    </div>
  )
}

export default FromTraveller
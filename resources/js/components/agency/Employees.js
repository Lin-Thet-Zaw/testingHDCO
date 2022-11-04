import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Spinner, Button } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import AddEmployee from './employee/AddEmployee';
import EditEmployee from './employee/EditEmployee';
import ShowEmployee from './employee/ShowEmployee';

function Employees() {
    const [isShow, setIsShow]=useState(false);
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [employee_id, setEmployee_id] = useState(null);

    //Edit employee
    const [isEdit, setIsEdit] = useState(false)

    //get all employees data
    useEffect(async()=>{
        setLoading(true);
        try {
            await axios.get('/agency/recenttravellers')
            .then(res=>{
                console.log(res.data)
                setEmployees(res.data)
                setLoading(false)
            })
            .catch(err=>{
                console.log(err.message)
            })
        } catch (error) {
            console.log(error.message);
        }
    }, [])
    //open modal
    const opneModal=()=>{
        setIsShow(true);
    }

    const handleSaved = (employee)=>{
        console.log(employee);
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
    const showEdit = employee_id=>{
        try {
            setIsEdit(!isEdit)
            setEmployee_id(employee_id)
        } catch (error) {
            console.log(error.message);
        }
    }

    // update employee after update
    const handleEdit=editedData=>{
        const index = employees.map(employee=>employee.id).indexOf(editedData.id)
        employees[index] = editedData;
        setEmployees(employees)
        setIsEdit(!isEdit)
    }
  return (
    <div className="card shadow-sm">
        <div className="card-body">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Nationality</th>
                        <th>Position</th>
                        <th>Gender</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {
                    loading?<Spinner animation="grow" />:
                    employees.length >0 && employees.map((employee, index)=>{
                        return (
                            <tr key={index}>
                                <td>{++index}</td>
                                <td>{employee.name}</td>
                                <td>{employee.nationality.name}</td>
                                <td>{employee.position}</td>
                                <td>{employee.gender===1?'Male':'Female'}</td>
                                <td>
                                <i className="bi bi-eye mousePointer text-info" onClick={()=>showDetail(employee.id)}></i> &nbsp; 
                                <i className="bi bi-pencil-square mousePointer text-primary" onClick={()=>showEdit(employee.id)}></i> &nbsp; 
                                <i className="bi bi-trash mousePointer text-danger"></i>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </div>
        {showDetailModal && <ShowEmployee isDetailShow = {showDetailModal} employeeId= {employee_id} isToggle={e=>setShowDetailModal(false)} />}
        {isEdit && <EditEmployee isShow={isEdit} isToggle={()=>setIsEdit(!isEdit)} employeeId={employee_id} editEmployee={handleEdit} />}
    </div>
  )
}

export default Employees

if(document.getElementById('employees')){
    ReactDOM.render(<Employees />, document.getElementById('employees'));
}


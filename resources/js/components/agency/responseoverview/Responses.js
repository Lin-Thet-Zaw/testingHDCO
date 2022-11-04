import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import ShowDetail from './ShowDetail'
import AddResponse from './AddResponse'
import ShowEdit from './ShowEdit'
import DeleteResponse from './DeleteResponse'
import axios from 'axios'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'

function Responses() {
    const [isAdd, setIsAdd] = useState(false)
    const [isDetail, setIsDetail] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isDelete, setIsDelete] = useState(false)

    const [responses, setResponses] = useState()
    const [responseDetail, setResponseDetail] = useState()
    const [editData, setEditData] = useState()
    const [id, setId] = useState('')

    const [isAlert, setIsAlert] = useState(false)

    const [loading, setLoading] = useState(false) //loading on data request


    useEffect(()=>{
        setLoading(true)
        try {
            axios.get('/agency/responses')
            .then(res=>{
                setResponses(res.data)
                setLoading(false)
            })
            .catch(err=>{
                console.log(err.message)
                setLoading(false)
            })
        } catch (err) {
            console.log(err.message);
        }
    }, [])


    const addModal=()=>{
        setIsAdd(!isAdd)
    }

    const addData=data=>{
        setResponses([
            data,
            ...responses
        ])
        setIsAdd(!isAdd)
        setIsAlert(true)
    }

    const showDetail =(id)=>{
        axios.get(`/agency/responseoverview/${id}`)
        .then(res=>{
            setResponseDetail(res.data)
        })
        .catch(err=>{
            console.log(err.message)
        })
        setIsDetail(!isDetail)
    }

    const showEdit = (id)=>{
        setId(id)
        setIsEdit(!isEdit)
    }

    const updateData = data =>{
        console.log(data)
        const index = responses.map(response=>response.id).indexOf(data.id)
        responses[index] = data;
        setIsEdit(!isEdit)
        setIsAlert(true)
    }

    const showDelete = (id)=>{
        setId(id)
        setIsDelete(!isDelete)
    }

    const deleteData=data=>{
        const newData = responses.filter(response=>response.id != data.id)
        setResponses(newData)
        setIsDelete(!isDelete)
        setIsAlert(true)
    }


  return (
      <>
      <h4>Projects Overview</h4>
    <div className='card'>
        <div className='card-body'>
        {
                isAlert && <Alert variant="success" onClose={() => setIsAlert(false)} dismissible>

                <span className='font-strong'>Success!</span>    Record updated successfully

                </Alert>
            }
            <div className='d-flex justify-content-between'>
                <button onClick={addModal} className='btn btn-primary'>ADD <i class="bi bi-plus-lg"></i></button>
                <a href='/logos/file/Project Overview.xlsx' className='btn btn-success'>Download File</a>
            </div>
            {
                loading?<div className='text-center'><Spinner animation="grow" /></div>:(
                    <table className='table table-hover mt-4'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>File</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        responses && responses.map((response , index)=>{
                            return (
                                <tr key={index}>
                                <td>{++index}</td>
                                <td>{response.start_date}</td>
                                <td>{response.end_date}</td>
                                <td>{response.file}</td>
                                <td>
                                    {/* <i className="bi bi-eye mousePointer text-info" onClick={e=>showDetail(response.id)} ></i> &nbsp;  */}
                                    <i className="bi bi-pencil-square mousePointer text-primary" onClick={e=>showEdit(response.id)}></i> &nbsp; 
                                    <i className="bi bi-trash mousePointer text-danger" onClick={e=>showDelete(response.id)}></i>
                                </td>
                            </tr>
                            )
                        })
                    }
                </tbody>
                
            </table>
                )
            }
            
        </div>
        {
            isAdd && <AddResponse isShow={isAdd} isToggle={e=>setIsAdd(!isAdd)} responseData={addData} />
        }
        {
            isDetail && <ShowDetail isShow={isDetail} isToggle={e=>setIsDetail(!isDetail)} data={responseDetail} />
        }
        {
            isEdit && <ShowEdit data={editData} isShow={isEdit} isToggle={e=>setIsEdit(!isEdit)} id={id} updateData={updateData} />
        }

        {
            isDelete && <DeleteResponse isShow={isDelete} isToggle={e=>setIsDelete(!isDelete)} id={id} deleteData={deleteData} />
        }
    </div>
    </>
  )
}

export default Responses

if(document.getElementById('response')){
    ReactDOM.render(<Responses />, document.getElementById('response'))
}
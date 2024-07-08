import React, { useState, useEffect } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, Form, Input, InputNumber } from 'antd';
import { db, collection, addDoc, updateDoc, deleteDoc, getDocs, doc } from "../Components/Firebase";
import Swal from 'sweetalert2';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import * as XLSX from 'xlsx';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 400,
  maxHeight: '90%',
  overflowY: 'auto',
  bgcolor: '#9e9ea4',
  border: 'none',
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

function Voter() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [voters, setVoters] = useState([]);
  const [selectedVoter, setSelectedVoter] = useState(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [portion, setPortion] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [cnicNo, setCnicNo] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [streetNo, setStreetNo] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [createdOn, setCreatedOn] = useState(new Date().toLocaleString());
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchVoters();
  }, []);

  const fetchVoters = async () => {
    const voterSnapshot = await getDocs(collection(db, "voters"));
    const voterData = voterSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setVoters(voterData);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEditOpen = (voter) => {
    setSelectedVoter(voter);
    setFirstName(voter.firstName);
    setLastName(voter.lastName);
    setHouseNo(voter.houseNo);
    setPortion(voter.portion);
    setMobileNumber(voter.mobileNumber);
    setCnicNo(voter.cnicNo);
    setFatherName(voter.fatherName);
    setStreetNo(voter.streetNo);
    setCreatedBy(voter.createdBy);
    setCreatedOn(voter.createdOn);
    setIsActive(voter.isActive);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setSelectedVoter(null);
    setFirstName('');
    setLastName('');
    setHouseNo('');
    setPortion('');
    setMobileNumber('');
    setCnicNo('');
    setFatherName('');
    setStreetNo('');
    setCreatedBy('');
    setCreatedOn(new Date().toLocaleString());
    setIsActive(true);
    setEditOpen(false);
  };

  const onFinish = async (values) => {
    try {
      await addDoc(collection(db, "voters"), {
        firstName: values.firstName,
        lastName: values.lastName,
        houseNo: values.houseNo,
        portion: values.portion,
        mobileNumber: values.mobileNumber,
        cnicNo: values.cnicNo,
        fatherName: values.fatherName,
        streetNo: values.streetNo,
        createdBy: values.createdBy,
        createdOn: new Date().toLocaleString(),
        isActive: values.isActive,
      });
      handleClose();
      await fetchVoters();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Voter added successfully",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error("Error adding voter:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleEditSubmit = async () => {
    if (selectedVoter) {
      try {
        const voterDoc = doc(db, "voters", selectedVoter.id);
        await updateDoc(voterDoc, {
          firstName,
          lastName,
          houseNo,
          portion,
          mobileNumber,
          cnicNo,
          fatherName,
          streetNo,
          createdBy,
          createdOn,
          isActive,
        });
        await fetchVoters();
        handleEditClose();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Voter updated successfully",
          showConfirmButton: false,
          timer: 1500
        });
      } catch (error) {
        console.error("Error updating voter:", error);
      }
    }
  };

  const handleDelete = async (voterId) => {
    try {
      const voterDoc = doc(db, "voters", voterId);
      await deleteDoc(voterDoc);
      await fetchVoters();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Voter deleted successfully",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error("Error deleting voter:", error);
    }
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(voters);

    const headers = Object.keys(worksheet).filter(key => key.match(/^[A-Z]1$/));
    headers.forEach(header => {
      worksheet[header].s = {
        font: {
          bold: true
        }
      };
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Voters");
    XLSX.writeFile(workbook, "Voters.xlsx");
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'firstName', headerName: 'First Name', width: 130 },
    { field: 'lastName', headerName: 'Last Name', width: 130 },
    { field: 'houseNo', headerName: 'House No', width: 100 },
    { field: 'portion', headerName: 'Portion', width: 100 },
    { field: 'mobileNumber', headerName: 'Mobile Number', width: 130 },
    { field: 'cnicNo', headerName: 'CNIC No', width: 150 },
    { field: 'fatherName', headerName: 'Father Name', width: 130 },
    { field: 'streetNo', headerName: 'Street No', width: 100 },
    { field: 'createdBy', headerName: 'Created By', width: 130 },
    { field: 'createdOn', headerName: 'Created On', width: 170 },
    { field: 'isActive', headerName: 'Active', width: 100, type: 'boolean' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <Button style={{ backgroundColor: 'transparent', border: "none", padding: "5px" }} onClick={() => handleEditOpen(params.row)}><FaEdit size={20} color='#3a3c3f' /></Button>
          <Button style={{ backgroundColor: 'transparent', border: "none", padding: "5px" }} onClick={() => handleDelete(params.row.id)}><MdDelete size={20} color='#3a3c3f' /></Button>
        </div>
      )
    }
  ];

  return (
    <main className='main-container'>
      <div className='main-title'>
        <div>
          <h3>Voter Management</h3>
        </div>
        <div className='btn-container'>
          <button onClick={handleOpen} className='btn'>Create Voter</button>
          <button onClick={handleDownloadExcel} className='btn'>Download Excel</button>
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 500 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: 'Please input first name!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: 'Please input last name!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="House No"
                name="houseNo"
                rules={[{ required: true, message: 'Please input house no!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Portion"
                name="portion"
                rules={[{ required: true, message: 'Please input portion!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Mobile Number"
                name="mobileNumber"
                rules={[{ required: true, message: 'Please input mobile number!' }]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                label="CNIC No"
                name="cnicNo"
                rules={[{ required: true, message: 'Please input CNIC no!' }]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                label="Father Name"
                name="fatherName"
                rules={[{ required: true, message: 'Please input father name!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Street No"
                name="streetNo"
                rules={[{ required: true, message: 'Please input street no!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Created By"
                name="createdBy"
                rules={[{ required: true, message: 'Please input creator name!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Is Active"
                name="isActive"
                valuePropName="checked"
              >
                <Input type="checkbox" />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">Submit</Button>
              </Form.Item>
            </Form>
          </Box>
        </Modal>
      </div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={voters}
          columns={columns}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
      {selectedVoter && (
        <Modal
          open={editOpen}
          onClose={handleEditClose}
          aria-labelledby="edit-modal-title"
          aria-describedby="edit-modal-description"
        >
          <Box sx={style}>
            <Form
              name="editForm"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              onFinish={handleEditSubmit}
            >
              <Form.Item
                label="First Name"
                name="firstName"
              >
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name="lastName"
              >
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </Form.Item>
              <Form.Item
                label="House No"
                name="houseNo"
              >
                <Input value={houseNo} onChange={(e) => setHouseNo(e.target.value)} />
              </Form.Item>
              <Form.Item
                label="Portion"
                name="portion"
              >
                <Input value={portion} onChange={(e) => setPortion(e.target.value)} />
              </Form.Item>
              <Form.Item
                label="Mobile Number"
                name="mobileNumber"
              >
                <InputNumber value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
              </Form.Item>
              <Form.Item
                label="CNIC No"
                name="cnicNo"
              >
                <InputNumber value={cnicNo} onChange={(e) => setCnicNo(e.target.value)} />
              </Form.Item>
              <Form.Item
                label="Father Name"
                name="fatherName"
              >
                <Input value={fatherName} onChange={(e) => setFatherName(e.target.value)} />
              </Form.Item>
              <Form.Item
                label="Street No"
                name="streetNo"
              >
                <Input value={streetNo} onChange={(e) => setStreetNo(e.target.value)} />
              </Form.Item>
              <Form.Item
                label="Created By"
                name="createdBy"
              >
                <Input value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} />
              </Form.Item>
              <Form.Item
                label="Is Active"
                name="isActive"
                valuePropName="checked"
              >
                <Input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">Update</Button>
              </Form.Item>
            </Form>
          </Box>
        </Modal>
      )}
    </main>
  );
}

export default Voter;

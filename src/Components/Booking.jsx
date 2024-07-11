import React, { useState, useEffect } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, Form, Input, InputNumber } from 'antd';
import { db, collection, addDoc, updateDoc, deleteDoc, getDocs, doc } from "../Components/Firebase";
import Swal from 'sweetalert2';
import { FaEdit, FaFilePdf } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import * as XLSX from 'xlsx'; 

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#9e9ea4',
  border: 'none',
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

function Donation() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [donars, setDonars] = useState([]);
  const [selectedDonar, setSelectedDonar] = useState(null);
  const [newDonarName, setNewDonarName] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newPurpose, setNewPurpose] = useState('');
  const [newRecieverName, setNewRecieverName] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const usersSnapshot = await getDocs(collection(db, "donar"));
    const donarData = usersSnapshot.docs.map(doc => ({ id: doc.id, donarid: doc.id, ...doc.data() }));
    setDonars(donarData);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEditOpen = (donar) => {
    setSelectedDonar(donar);
    setNewDonarName(donar.donarName);
    setNewContact(donar.contact);
    setNewAmount(donar.amount);
    setNewPurpose(donar.purpose);
    setNewRecieverName(donar.recname);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setSelectedDonar(null);
    setNewDonarName('');
    setNewContact('');
    setNewAmount('');
    setNewPurpose('');
    setNewRecieverName('');
    setEditOpen(false);
  };

  const onFinish = async (values) => {
    try {
      await addDoc(collection(db, "donar"), {
        donarName: values.donarName,
        contact: values.contact,
        amount: values.amount,
        purpose: values.purpose,
        recname: values.recname,
        createdAt: new Date().toLocaleString(),
      });
      handleClose();
      await fetchUsers();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Donar created successfully",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleEditSubmit = async () => {
    if (selectedDonar) {
      try {
        const donarDoc = doc(db, "donar", selectedDonar.id);
        await updateDoc(donarDoc, {
          donarName: newDonarName,
          contact: newContact,
          amount: newAmount,
          purpose: newPurpose,
          recname: newRecieverName,
        });
        await fetchUsers();
        handleEditClose();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Donor updated successfully",
          showConfirmButton: false,
          timer: 1500
        });
      } catch (error) {
        console.error("Error updating donor:", error);
      }
    }
  };

  const handleDelete = async (userId) => {
    try {
      const userDoc = doc(db, "donar", userId);
      await deleteDoc(userDoc);
      await fetchUsers();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Donar deleted successfully",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleGenerateReport = (donar) => {
    const reportContent = 
                          `Donation Details Report \n\n`+
                          `Donar Name: ${donar.donarName}\n` +
                          `Phone No: ${donar.contact}\n` +
                          `Amount: ${donar.amount}\n` +
                          `Purpose: ${donar.purpose}\n` +
                          `Received by: ${donar.recname}`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${donar.donarName}_report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(donars);

    const headers = Object.keys(worksheet).filter(key => key.match(/^[A-Z]1$/));

    headers.forEach(header => {
      worksheet[header].s = {
        font: {
          bold: true
        }
      };
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Donations");
    XLSX.writeFile(workbook, "Donations.xlsx");
  };

  const columns = [
    { field: 'donarid', headerName: 'ID', width: 100 },
    { field: 'donarName', headerName: 'Donar Name', width: 100, editable: true },
    { field: 'contact', headerName: 'Phone No', width: 100 },
    { field: 'amount', headerName: 'Amount', width: 100 },
    { field: 'purpose', headerName: 'Purpose', width: 100 },
    { field: 'recname', headerName: 'Received by', width: 100 },
    { field: 'createdAt', headerName: 'Created At', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <Button style={{ backgroundColor: 'transparent', border: "none", padding: "5px" }} onClick={() => handleEditOpen(params.row)}><FaEdit size={20} color='#3a3c3f' /></Button>
          <Button style={{ backgroundColor: 'transparent', border: "none", padding: "5px" }} onClick={() => handleDelete(params.row.id)}><MdDelete size={20} color='#3a3c3f' /></Button>
          <Button style={{ backgroundColor: 'transparent', border: "none", padding: "5px" }} onClick={() => handleGenerateReport(params.row)}><FaFilePdf size={20} color='#3a3c3f' /></Button>
        </div>
      )
    }
  ];

  return (
    <main className='main-container'>
      <div className='main-title'>
        <div>
          <h3>Donation Management</h3>
        </div>
        <div>
          <div className='btn-container' >
          <button onClick={handleOpen} className='btn'>Create Donar</button>
          <button onClick={handleDownloadExcel} className='btn'>Download Excel</button> {/* New button for downloading Excel */}
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
                  label="Donar Name"
                  name="donarName"
                  rules={[{ required: true, message: 'Please input donar name!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="contact"
                  label="Phone No"
                  rules={[
                    { type: 'number', message: 'The input is not valid number!' },
                    { required: true, message: 'Please input Phone No!' },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  name="amount"
                  label="Amount"
                  rules={[
                    { type: 'number', message: 'The input is not valid number!' },
                    { required: true, message: 'Please input Amount!' },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  label="Purpose"
                  name="purpose"
                  rules={[{ required: true, message: 'Please input donation purpose!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Receiver Name"
                  name="recname"
                  rules={[{ required: true, message: 'Please input receiver name!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit">Donate</Button>
                </Form.Item>
              </Form>
            </Box>
          </Modal>
        </div>
      </div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={donars}
          columns={columns}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
      {selectedDonar && (
        <Modal
          open={editOpen}
          onClose={handleEditClose}
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
              onFinish={handleEditSubmit}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Donar Name"
                name="donarName"
                rules={[{ required: true, message: 'Please input donar name!' }]}
                initialValue={selectedDonar.donarName}
              >
                <Input value={newDonarName} onChange={(e) => setNewDonarName(e.target.value)} />
              </Form.Item>
              <Form.Item
                name="contact"
                label="Phone No"
                rules={[
                  { type: 'number', message: 'The input is not valid number!' },
                  { required: true, message: 'Please input Phone No!' },
                ]}
                initialValue={selectedDonar.contact}
              >
                <InputNumber value={newContact} onChange={(value) => setNewContact(value)} />
              </Form.Item>
              <Form.Item
                name="amount"
                label="Amount"
                rules={[
                  { type: 'number', message: 'The input is not valid number!' },
                  { required: true, message: 'Please input Amount!' },
                ]}
                initialValue={selectedDonar.amount}
              >
                <InputNumber value={newAmount} onChange={(value) => setNewAmount(value)} />
              </Form.Item>
              <Form.Item
                label="Purpose"
                name="purpose"
                rules={[{ required: true, message: 'Please input donation purpose!' }]}
                initialValue={selectedDonar.purpose}
              >
                <Input value={newPurpose} onChange={(e) => setNewPurpose(e.target.value)} />
              </Form.Item>
              <Form.Item
                label="Receiver Name"
                name="recname"
                rules={[{ required: true, message: 'Please input receiver name!' }]}
                initialValue={selectedDonar.recname}
              >
                <Input value={newRecieverName} onChange={(e) => setNewRecieverName(e.target.value)} />
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

export default Donation;

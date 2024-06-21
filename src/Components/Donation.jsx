import React, { useState, useEffect } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, Form, Input, InputNumber } from 'antd';
import { auth, db, collection, addDoc, updateDoc, deleteDoc, getDocs, updateProfile, createUserWithEmailAndPassword, doc } from "../Components/Firebase";
import Swal from 'sweetalert2';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: '#9e9ea4',
  border: 'none',
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

function Donation() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newDonarName, setNewDonarName] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newPurpose, setNewPurpose] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const usersSnapshot = await getDocs(collection(db, "donar"));
    const userData = usersSnapshot.docs.map(doc => ({ id: doc.id, donarid: doc.id, ...doc.data() }));
    setUsers(userData);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEditOpen = (user) => {
    setSelectedUser(user);
    setNewDonarName(user.donarName);
    setNewContact(user.contact);
    setNewAmount(user.amount);
    setNewPurpose(user.purpose);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setSelectedUser(null);
    setNewDonarName('');
    setNewContact('');
    setNewAmount('');
    setNewPurpose('');
    setEditOpen(false);
  };

  const onFinish = async (values) => {
    try {
      await addDoc(collection(db, "donar"), {
        donarName: values.donarName,
        contact: values.contact,
        amount: values.amount,
        purpose: values.purpose
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
    if (selectedUser) {
      try {
        const userDoc = doc(db, "donar", selectedUser.id);
        await updateDoc(userDoc, {
          donarName: newDonarName,
          contact: newContact,
          amount: newAmount,
          purpose: newPurpose,
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

  const columns = [
    { field: 'donarid', headerName: 'ID', width: 200 },
    { field: 'donarName', headerName: 'Donar Name', width: 150, editable: true },
    { field: 'contact', headerName: 'Phone No', width: 150 },
    { field: 'amount', headerName: 'Amount', width: 100 },
    { field: 'purpose', headerName: 'Purpose', width: 100 },
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
          <h3>Donation Management</h3>
        </div>
        <div>
          <button onClick={handleOpen} className='btn'>Create Donar</button>
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
          rows={users}
          columns={columns}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
      {selectedUser && (
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
                label="Donar Name"
                name="donarName"
              >
                <Input value={newDonarName} onChange={(e) => setNewDonarName(e.target.value)} />
              </Form.Item>
              <Form.Item
                label="Phone No"
                name="contact"
             
              >
                <Input value={newContact} onChange={(e) => setNewContact(e.target.value)} />
              </Form.Item>
              <Form.Item
                label="Amount"
                name="amount"
              >
                <InputNumber value={newAmount} onChange={(value) => setNewAmount(value)} />
              </Form.Item>
              <Form.Item
                label="Purpose"
                name="purpose"
              >
                <Input value={newPurpose} onChange={(e) => setNewPurpose(e.target.value)} />
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

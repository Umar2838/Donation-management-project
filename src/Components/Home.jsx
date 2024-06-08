import React, { useState, useEffect } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, Form, Input } from 'antd';
import { auth, db, collection, addDoc, updateDoc, deleteDoc, getDocs,updateProfile, createUserWithEmailAndPassword, doc } from "../Components/Firebase";
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

function Home() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const userData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(userData);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEditOpen = (user) => {
    setSelectedUser(user);
    setNewUsername(user.username);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setSelectedUser(null);
    setNewUsername('');
    setEditOpen(false);
  };

  const onFinish = async (values) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: values.displayName });
      await addDoc(collection(db, "users"), { email: user.email, userid: user.uid, username: values.displayName });
      handleClose();
      await fetchUsers();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "User created successfully",
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
        const userDoc = doc(db, "users", selectedUser.id);
        await updateDoc(userDoc, { username: newUsername });
        await fetchUsers();
        handleEditClose();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Username updated successfully",
          showConfirmButton: false,
          timer: 1500
        });
      } catch (error) {
        console.error("Error updating username:", error);
      }
    }
  };

  const handleDelete = async (userId) => {
    try {
      const userDoc = doc(db, "users", userId);
      await deleteDoc(userDoc);
      await fetchUsers();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "User deleted successfully",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'username', headerName: 'User Name', width: 200, editable: true },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div style={{display:"flex", gap:"10px" , marginTop:"10px"}} >
          <Button style={{backgroundColor: 'transparent' , border:"none" , padding:"5px"}} onClick={() => handleEditOpen(params.row)}><FaEdit size={20} color='#3a3c3f' /></Button>
          <Button style={{backgroundColor: 'transparent' , border:"none", padding:"5px"}} onClick={() => handleDelete(params.row.id)}><MdDelete size={20} color='#3a3c3f'/></Button>
        </div>
      )
    }
  ];

  return (
    <main className='main-container'>
      <div className='main-title'>
        <div>
          <h3>User Management</h3>
        </div>
        <div>
          <button onClick={handleOpen} className='btn'>Create User</button>
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
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Username"
                  name="displayName"
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="E-mail"
                  rules={[
                    { type: 'email', message: 'The input is not valid E-mail!' },
                    { required: true, message: 'Please input your E-mail!' },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit">Create</Button>
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
              initialValues={{ username: selectedUser.username }}
              onFinish={handleEditSubmit}
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input the new username!' }]}
              >
                <Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
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

export default Home;

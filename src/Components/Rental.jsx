import React, { useState, useEffect } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, Form, Input, InputNumber } from 'antd';
import { db, collection, addDoc, updateDoc, deleteDoc, getDocs, doc } from "../Components/Firebase";
import Swal from 'sweetalert2';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

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

function Rental() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [rentals, setRentals] = useState([]);
  const [selectedRental, setSelectedRental] = useState(null);
  const [newRentalType, setNewRentalType] = useState('');
  const [newRentalAmount, setNewRentalAmount] = useState('');
  const [newDuration,setNewDuration] = useState('');
  const [newRentalDescription, setNewRentalDescription] = useState('');

  useEffect(() => {
    fetchRental();
  }, []);

  const fetchRental = async () => {
    const rentalSnapshot = await getDocs(collection(db, "rentals"));
    const rentalData = rentalSnapshot.docs.map(doc => ({ id: doc.id, rentalid: doc.id, ...doc.data() }));
    setRentals(rentalData);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEditOpen = (rental) => {
    setSelectedRental(rental);
    setNewRentalType(rental.rentaltype);
    setNewRentalAmount(rental.rentalamount);
    setNewRentalDescription(rental.rentaldescription);
    setNewDuration(rental.rentalduration);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setSelectedRental(null);
    setNewRentalType('');
    setNewRentalAmount('');
    setNewRentalDescription('');
    setNewDuration('');
    setEditOpen(false);
  };

  const onFinish = async (values) => {
    try {
      await addDoc(collection(db, "rentals"), {
        rentaltype: values.rentaltype,
        rentalamount: values.rentalamount,
        rentaldescription: values.rentaldescription,
        rentalduration: values.rentalduration,
        createdAt: new Date().toLocaleString(),

      });
      handleClose();
      await fetchRental();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Rental created successfully",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error("Error creating rental:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleEditSubmit = async () => {
    if (selectedRental) {
      try {
        const expenseDoc = doc(db, "rentals", selectedRental.id);
        await updateDoc(expenseDoc, {
          rentaltype: newRentalType,
          rentalamount: newRentalAmount,
          rentaldescription: newRentalDescription,
          rentalduration:newDuration,
        });
        await fetchRental();
        handleEditClose();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Rental updated successfully",
          showConfirmButton: false,
          timer: 1500
        });
      } catch (error) {
        console.error("Error updating rental:", error);
      }
    }
  };

  const handleDelete = async (rentalId) => {
    try {
      const rentalDoc = doc(db, "rentals", rentalId);
      await deleteDoc(rentalDoc);
      await fetchRental();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Rental deleted successfully",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error("Error deleting rental:",Rental)
    }
  };

  const columns = [
    { field: 'rentalid', headerName: 'ID', width: 100 },
    { field: 'rentaltype', headerName: 'Rental Type', width: 130 },
    { field: 'rentalamount', headerName: 'Rent Amount', width: 100 },
    { field: 'rentaldescription', headerName: 'Description', width: 180 },
    { field: 'rentalduration', headerName: 'Duration', width: 100 },
    { field: 'createdAt', headerName: 'Created At', width: 170 }, 

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
          <h3>Rental Management</h3>
        </div>
        <div>
          <button onClick={handleOpen} className='btn'>Create rentals</button>
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
                  label="Rental Type"
                  name="rentaltype"
                  rules={[{ required: true, message: 'Please input rental type!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="rentalamount"
                  label="Rental Amount"
                  rules={[
                    { type: 'number', message: 'The input is not valid number!' },
                    { required: true, message: 'Please input Amount!' },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  name="rentaldescription"
                  label="Description"
                  rules={[
                    { required: true, message: 'Please input rental description!' },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="rentalduration"
                  label="Duration"
                  rules={[
                    { required: true, message: 'Please input rental duration!' },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
              </Form>
            </Box>
          </Modal>
        </div>
      </div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rentals}
          columns={columns}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
      {selectedRental && (
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
                label="Expense"
                name="expensename"
              >
                <Input value={newRentalType} onChange={(e) => setNewRentalType(e.target.value)} />
              </Form.Item>
              <Form.Item
                label="Rental Amount"
                name="rentalamount"
              >
                <InputNumber value={newRentalAmount} onChange={(value) => setNewRentalAmount(value)} />
              </Form.Item>
              <Form.Item
                label="Description"
                name="rentaldescription"
              >
                <Input value={newRentalDescription} onChange={(e) => setNewRentalDescription(e.target.value)} />
              </Form.Item>
              <Form.Item
                label="Rental Duration"
                name="rentalduration"
              >
                <Input value={newDuration} onChange={(e) => setNewDuration(e.target.value)} />
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

export default Rental;

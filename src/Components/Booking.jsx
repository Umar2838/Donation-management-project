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
  width: 300,
  bgcolor: '#9e9ea4',
  border: 'none',
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

function Booking() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newBookingType, setNewBookingType] = useState('');
  const [newBookingAmount, setNewBookingAmount] = useState('');
  const [newDuration,setNewDuration] = useState('');
  const [newContact,setNewContact] = useState('');
  const [newBookingDate, setNewBookingDate] = useState('');

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    const bookingSnapshot = await getDocs(collection(db, "bookings"));
    const bookingData = bookingSnapshot.docs.map(doc => ({ id: doc.id, bookingid: doc.id, ...doc.data() }));
    setBookings(bookingData);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEditOpen = (booking) => {
    setSelectedBooking(booking);
    setNewBookingDate(booking.bookingtype);
    setNewBookingAmount(booking.bookingamount);
    setNewBookingDate(booking.bookingdate);
    setNewDuration(booking.bookingduration);
    setNewContact(booking.bookingcontact)
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setSelectedBooking(null);
    setNewBookingType('');
    setNewBookingAmount('');
    setNewBookingDate('');
    setNewDuration('');
    setEditOpen(false);
  };

  const onFinish = async (values) => {
    try {
      await addDoc(collection(db, "bookings"), {
        bookingtype: values.bookingtype,
        bookingamount: values.bookingamount,
        bookingdate: values.bookingdate,
        bookingduration: values.bookingduration,
        createdAt: new Date().toLocaleString(),

      });
      handleClose();
      await fetchBooking();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Booking created successfully",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleEditSubmit = async () => {
    if (selectedBooking) {
      try {
        const BookingDoc = doc(db, "bookings", selectedBooking.id);
        await updateDoc(BookingDoc, {
          bookingtype: newBookingType,
          bookingamount: newBookingAmount,
          bookingcontact: newContact,
          bookingdate: newBookingDate,
          bookingduration:newDuration,
        });
        await fetchBooking();
        handleEditClose();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Booking updated successfully",
          showConfirmButton: false,
          timer: 1500
        });
      } catch (error) {
        console.error("Error updating booking:", error);
      }
    }
  };

  const handleDelete = async (bookingId) => {
    try {
      const BookingDoc = doc(db, "bookings", bookingId);
      await deleteDoc(BookingDoc);
      await fetchBooking();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Booking deleted successfully",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const columns = [
    { field: 'bookingid', headerName: 'ID', width: 100 },
    { field: 'bookingtype', headerName: 'Booking Type', width: 130 },
    { field: 'bookingamount', headerName: 'Booking Amount', width: 100 },
    { field: 'bookingcontact', headerName: 'Contact', width: 100 },
    { field: 'bookingdate', headerName: 'Booking Date', width: 180 },
    { field: 'bookingduration', headerName: 'Duration', width: 100 },
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
          <h3>Booking Management</h3>
        </div>
        <div>
          <button onClick={handleOpen} className='btn'>Create bookings</button>
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
                  label="Booking Type"
                  name="bookingtype"
                  rules={[{ required: true, message: 'Please input booking type!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="bookingamount"
                  label="Booking Amount"
                  rules={[
                    { type: 'number', message: 'The input is not valid number!' },
                    { required: true, message: 'Please input Amount!' },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  name="contact"
                  label="Contact"
                  rules={[
                    { type: 'number', message: 'The input is not valid number!' },
                    { required: true, message: 'Please input contact!' },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  name="boookingdate"
                  label="Booking date"
                  rules={[
                    { required: true, message: 'Please input booking date!' },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="bookingduration"
                  label="Duration"
                  rules={[
                    { required: true, message: 'Please input booking duration!' },
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
          rows={bookings}
          columns={columns}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
      {selectedBooking && (
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
                label="Booking Type"
                name="bookingtype"
              >
                <Input value={newBookingType} onChange={(e) => setNewBookingType(e.target.value)} />
              </Form.Item>
              <Form.Item
                label="Booking Amount"
                name="bookingamount"
              >
                <InputNumber value={newBookingAmount} onChange={(value) => setNewBookingAmount(value)} />
              </Form.Item>
              <Form.Item
                label="Contact"
                name="contact"
              >
                <InputNumber value={newContact} onChange={(value) => setNewContact(value)} />
              </Form.Item>
              <Form.Item
                label="Booking Date"
                name="bookingdate"
              >
                <Input value={newBookingDate} onChange={(e) => setNewBookingDate(e.target.value)} />
              </Form.Item>
              <Form.Item
                label="Duration"
                name="bookingduration"
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

export default Booking;

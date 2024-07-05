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
  width: 300,
  bgcolor: '#9e9ea4',
  border: 'none',
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

function Expense() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseDoer, setNewExpenseDoer] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const expensesSnapshot = await getDocs(collection(db, "expense"));
    const expensesData = expensesSnapshot.docs.map(doc => ({ id: doc.id, expenseid: doc.id, ...doc.data() }));
    setExpenses(expensesData);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEditOpen = (expense) => {
    setSelectedExpense(expense);
    setNewExpenseName(expense.expensename);
    setNewExpenseAmount(expense.expenseamount);
    setNewExpenseDoer(expense.expensedoer);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setSelectedExpense(null);
    setNewExpenseName('');
    setNewExpenseAmount('');
    setNewExpenseDoer('');
    setEditOpen(false);
  };

  const onFinish = async (values) => {
    try {
      await addDoc(collection(db, "expense"), {
        expensename: values.expensename,
        expenseamount: values.expenseamount,
        expensedoer: values.expensedoer,
        createdAt: new Date().toLocaleString(),

      });
      handleClose();
      await fetchExpenses();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Expense created successfully",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error("Error creating expense:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleEditSubmit = async () => {
    if (selectedExpense) {
      try {
        const expenseDoc = doc(db, "expense", selectedExpense.id);
        await updateDoc(expenseDoc, {
          expensename: newExpenseName,
          expenseamount: newExpenseAmount,
          expensedoer: newExpenseDoer,
        });
        await fetchExpenses();
        handleEditClose();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Expense updated successfully",
          showConfirmButton: false,
          timer: 1500
        });
      } catch (error) {
        console.error("Error updating expense:", error);
      }
    }
  };

  const handleDelete = async (expenseId) => {
    try {
      const expenseDoc = doc(db, "expense", expenseId);
      await deleteDoc(expenseDoc);
      await fetchExpenses();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Expense deleted successfully",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(expenses);

      const headers = Object.keys(worksheet).filter(key => key.match(/^[A-Z]1$/));
    headers.forEach(header => {
      worksheet[header].s = {
        font: {
          bold: true
        }
      };
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    XLSX.writeFile(workbook, "Expenses.xlsx");
  };


  const columns = [
    { field: 'expenseid', headerName: 'ID', width: 180 },
    { field: 'expensename', headerName: 'Expense', width: 150 },
    { field: 'expenseamount', headerName: 'Amount', width: 100 },
    { field: 'expensedoer', headerName: 'Expense Done by', width: 150 },
    { field: 'createdAt', headerName: 'Created At', width: 180 }, 
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
          <h3>Expense Management</h3>
        </div>
        <div>
          <div className='btn-container' >
          <button onClick={handleOpen} className='btn'>Create expenses</button>
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
                  label="Expense"
                  name="expensename"
                  rules={[{ required: true, message: 'Please input expense name!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="expenseamount"
                  label="Amount"
                  rules={[
                    { type: 'number', message: 'The input is not valid number!' },
                    { required: true, message: 'Please input Amount!' },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  name="expensedoer"
                  label="Done by"
                  rules={[
                    { required: true, message: 'Please input expense doer!' },
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
          rows={expenses}
          columns={columns}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
      {selectedExpense && (
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
                <Input value={newExpenseName} onChange={(e) => setNewExpenseName(e.target.value)} />
              </Form.Item>
              <Form.Item
                label="Amount"
                name="expenseamount"
              >
                <InputNumber value={newExpenseAmount} onChange={(value) => setNewExpenseAmount(value)} />
              </Form.Item>
              <Form.Item
                label="Expense Done by"
                name="expensedoer"
              >
                <Input value={newExpenseDoer} onChange={(e) => setNewExpenseDoer(e.target.value)} />
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

export default Expense;

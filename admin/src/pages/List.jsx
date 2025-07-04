import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list', {
        headers: { token }, // ✅ Include token
      });

      console.log("PRODUCT LIST API RESPONSE:", response.data);

      // ✅ Check actual response shape
      if (response.data.success && Array.isArray(response.data.product)) {
        setList([...response.data.product].reverse());
      } else {
        toast.error(response.data.message || 'Unexpected response from server');
        if (response.data.message?.toLowerCase().includes('not authorized')) {
          navigate('/login');
        }
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      if (errorMessage.toLowerCase().includes('not authorized')) {
        navigate('/login');
      }
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        {
          headers: { token }, // ✅ token for protected route
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList(); // refresh list after deletion
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error('Session expired. Please log in again.');
      navigate('/login');
    } else {
      fetchList();
    }
  }, [token]);

  return (
    <>
      <p className="mb-2 font-semibold">All Products List</p>
      <div className="flex flex-col gap-2">

        {/* ------- List Table Header ---------- */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-3 border bg-gray-100 text-sm font-medium">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* ------ Product List ------ */}
        {list.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-2 px-3 border text-sm"
          >
            <img className="w-12 h-12 object-cover" src={item.image?.[0]} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <p
              onClick={() => removeProduct(item._id)}
              className="text-right md:text-center cursor-pointer text-lg text-red-600 hover:text-red-800"
            >
              ×
            </p>
          </div>
        ))}

        {list.length === 0 && (
          <p className="text-center text-gray-500 py-4">No products found.</p>
        )}
      </div>
    </>
  );
};

export default List;

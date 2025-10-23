import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RegisterLoginForm() {
    const navigate = useNavigate();

    const [Registered, setRegistered] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: ""
    })

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    };

    function handleChangeAction() {
      setRegistered(!Registered);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if(!Registered)
        {
            try {
              const response = await axios.post(`${BASE_URL}/api/user/register/`, formData, {
                withCredentials: true,
              });
              setMessage(response.data.message);
              setFormData({ username: '', password: '', email: '' });
              navigate('/');
            } catch (err) {
              setError(err.response?.data?.error || 'Registration failed');
            }
        }
        else {
          try {
              const response = await axios.post(`${BASE_URL}/api/user/login/`, formData, {
                withCredentials: true,
              });
              setMessage(response.data.message);
              setFormData({ username: '', password: '', email: '' });
              navigate('/');
            } catch (err) {
              setError(err.response?.data?.error || 'Login failed');
            }
        }
      };
    

    return (
        <div className='flex flex-col items-center justify-center w-full h-[80vh]'>
            <form onSubmit={handleSubmit} className='flex flex-col w-50 h-max gap-1'>
              <input
                className="h-10 w-full bg-white rounded-md"
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <input
                className="h-10 w-full bg-white rounded-md"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                className='hidden'
                type="email"
                name="email"
                placeholder="Email (optional)"
                value={formData.email}
                onChange={handleChange}
              />
              <button className="h-10 w-full bg-(--color-bright) text-white rounded-md" type="submit">{(Registered == true) ? "Login" : "Register"}</button>
            </form>

            <button onClick={handleChangeAction}>{"Go to " + ((Registered == true) ? "Register" : "Login")}</button>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
}
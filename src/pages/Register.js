import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Register() {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        userName: "",
        userPassword: "",
        email: "",
        birthDate: new Date(),
        biography: ""
    });

    const [passwordType, setPasswordType] = useState("password");
    const [passwordDanger, setPasswordDanger] = useState(false);

    const passwordTypeFunc = () => {
        if (passwordType === "password") {
            setPasswordType("text")
        } else {
            setPasswordType("password")
        }
    }

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    const mutation = useMutation({
        mutationFn: () => {
            return axios.post('http://localhost:8080/users/register', user);
        },
        onSuccess: () => {
            navigate('/login');
        },
    });

    const registerUser = () => {
        if (user.userName && user.userPassword)
            mutation.mutate();
        console.log(user)
    }

    return (
        <div className='w-full h-screen bg-registerPattern flex items-center justify-center'>
            <div className='w-1/3 h-auto p-8 bg-white shadow-xl rounded-lg flex flex-col items-center'>
                <div className='w-full h-auto flex flex-col gap-2'>
                    <div className='w-full h-4 after:content-["*"] after:ml-0.5 after:text-red-500 font-semibold text-sm'>Kullanıcı adı</div>
                    <input
                        type="text"
                        id="userName"
                        name="userName"
                        value={user.userName}
                        onChange={handleChange}
                        className='w-full py-2 border-2 border-gray-200 px-4 focus:border-[#7469b6] focus:border-2 outline-none rounded-md'
                    />
                    <div className='w-full h-4 after:content-["*"] after:ml-0.5 after:text-red-500 font-semibold text-sm'>E-posta</div>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className='w-full py-2 border-2 border-gray-200 px-4 focus:border-[#7469b6] focus:border-2 outline-none rounded-md'
                    />

                    <div className='w-full h-4 after:content-["*"] after:ml-0.5 after:text-red-500 font-semibold text-sm'>Şifre</div>
                    <input
                        type="text"
                        id="userPassword"
                        name="userPassword"
                        value={user.userPassword}
                        onChange={handleChange}
                        className='w-full py-2 border-2 border-gray-200 px-4 focus:border-[#7469b6] focus:border-2 outline-none rounded-md'
                    />
                    <div className='w-full h-4 after:content-["*"] after:ml-0.5 after:text-red-500 font-semibold text-sm'>Doğum tarihi</div>
                    <input
                        type="date"
                        placeholder="Birth Date"
                        name="birthDate"
                        value={user.birthDate}
                        onChange={handleChange}
                        className='w-full py-2 border-2 border-gray-200 px-4 focus:border-[#7469b6] focus:border-2 outline-none rounded-md'
                    />
                </div>

                <button onClick={registerUser} className='w-full h-12 bg-[#7469b6] rounded-full mt-4 text-white'>Kayıt Ol</button>
            </div>

        </div>
    )
}

export default Register
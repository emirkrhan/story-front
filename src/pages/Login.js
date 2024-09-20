import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_API_URL;

function Login() {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        userName: "",
        userPassword: "",
    });

    // const [passwordType, setPasswordType] = useState("password");
    // const [passwordDanger, setPasswordDanger] = useState(false);

    // const passwordTypeFunc = () => {
    //     if (passwordType === "password") {
    //         setPasswordType("text")
    //     } else {
    //         setPasswordType("password")
    //     }
    // }

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    const mutation = useMutation({
        mutationFn: async () => {
            const response = await axios.post(`${apiUrl}/users/login`, user);
            return response.data;
        },
        onSuccess: (data) => {
            const decodedToken = jwtDecode(data);
            localStorage.setItem('storyUserId', decodedToken.userid);
            localStorage.setItem('storyUserName', decodedToken.username);
            navigate('/');
        },
    });

    const registerUser = () => {
        if (user.userName && user.userPassword)
            console.log(user)
        mutation.mutate();
    }

    return (
        <div className='w-full h-screen bg-[#eeeff0] flex items-center justify-center'>
            <div className='w-1/3 h-auto p-8 bg-white shadow-xl shadow-purple-300 rounded-lg flex flex-col items-center'>
                <div className='w-full pb-4 font-bold text-2xl'>Giriş Yap</div>
                <div className='w-full h-auto flex flex-col gap-2'>
                    <div className='w-full h-4 after:content-["*"] after:ml-0.5 after:text-red-500 font-semibold text-sm'>Kullanıcı adı</div>
                    <input
                        type="text"
                        id="userName"
                        name="userName"
                        value={user.userName}
                        placeholder='Kullanıcı adı girin'
                        onChange={handleChange}
                        className='w-full py-2 ring-1 ring-gray-300 px-4 focus:ring-gray-500 outline-none rounded-md'
                    />


                    <div className='w-full h-4 after:content-["*"] after:ml-0.5 after:text-red-500 font-semibold text-sm'>Şifre</div>
                    <input
                        type="password"
                        id="userPassword"
                        name="userPassword"
                        value={user.userPassword}
                        placeholder='Şifre girin'
                        onChange={handleChange}
                        className='w-full py-2 ring-1 ring-gray-300 px-4 focus:ring-gray-500 outline-none rounded-md'
                    />

                </div>

                <button onClick={registerUser} className='w-full h-12 bg-black rounded-xl mt-4 text-white transition duration-500 ease-in-out'>Giriş Yap</button>
                <div className='w-full py-4 flex items-center justify-center text-xs font-medium gap-1'>Hesabınız yok mu? <a href='/register' className='underline'>Kayıt Ol</a></div>

            </div>


        </div>
    )
}

export default Login
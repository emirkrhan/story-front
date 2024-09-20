import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
const apiUrl = process.env.REACT_APP_API_URL;

function Register() {

    const navigate = useNavigate();

    const [passwordType, setPasswordType] = useState("password");

    const passwordTypeFunc = () => {
        if (passwordType === "password") {
            setPasswordType("text")
        } else {
            setPasswordType("password")
        }
    }

    const validationSchema = Yup.object().shape({
        userName: Yup.string()
            .min(3, 'Kullanıcı adı en az 3 karakter olmalıdır')
            .max(50, 'Kullanıcı adı en fazla 50 karakter olabilir')
            .required('Kullanıcı adı zorunludur'),

        userPassword: Yup.string()
            .min(8, 'Şifre en az 8 karakter olmalıdır')
            .required('Şifre zorunludur'),

        email: Yup.string()
            .email('Geçerli bir e-posta adresi girin')
            .required('E-posta adresi zorunludur'),

        birthDate: Yup.date()
            .max(new Date(), 'Doğum tarihi bugünden ileri bir tarih olamaz')
            .required('Doğum tarihi zorunludur'),
    });


    const formik = useFormik({
        initialValues: {
            userName: "",
            userPassword: "",
            email: "",
            birthDate: new Date(),
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            mutation.mutate(values)
        },
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



    const mutation = useMutation({
        mutationFn: (values) => {
            return axios.post(`${apiUrl}/users/register`, values);
        },
        onSuccess: () => {
            navigate('/login');
        },
    });



    return (
        <div className='w-full h-screen bg-[#eeeff0] flex items-center justify-center'>
            <div className='w-1/3 h-auto p-8 bg-white shadow-xl shadow-purple-300 rounded-lg flex flex-col items-center'>
                <form onSubmit={formik.handleSubmit} className='w-full h-auto flex flex-col gap-2'>
                    <div className='w-full font-bold pb-4 text-2xl'>Kayıt Ol</div>
                    <div className='w-full h-4 after:content-["*"] after:ml-0.5 after:text-red-500 font-semibold text-sm'>Kullanıcı adı</div>
                    <input
                        type="text"
                        id="userName"
                        name="userName"
                        value={formik.values.userName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder='Kullanıcı adı girin'
                        className='w-full py-2 ring-1 ring-gray-300 px-4 focus:ring-gray-500 outline-none rounded-md'
                    />
                    {formik.touched.userName && formik.errors.userName && (
                        <p className="text-red-500 text-xs">{formik.errors.userName}</p>
                    )}
                    <div className='w-full h-4 after:content-["*"] after:ml-0.5 after:text-red-500 font-semibold text-sm'>E-posta</div>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder='E-mail adresi girin'
                        className='w-full py-2 ring-1 ring-gray-300 px-4 focus:ring-gray-500 outline-none rounded-md'
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-xs">{formik.errors.email}</p>
                    )}

                    <div className='w-full h-4 after:content-["*"] after:ml-0.5 after:text-red-500 font-semibold text-sm'>Şifre</div>
                    <div className="relative w-full">
                        <input
                            type={passwordType}
                            id="userPassword"
                            name="userPassword"
                            value={formik.values.userPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder='Şifre girin'
                            className='w-full py-2 ring-1 ring-gray-300 px-4 focus:ring-gray-500 outline-none rounded-md'
                        />
                        <i onClick={passwordTypeFunc} class={`fa-regular ${passwordType === 'password' ? 'fa-eye' : 'fa-eye-slash'} absolute right-3 top-3 cursor-pointer`}></i>

                    </div>
                    {formik.touched.userPassword && formik.errors.userPassword && (
                        <p className="text-red-500 text-xs">{formik.errors.userPassword}</p>
                    )}
                    <div className='w-full h-4 after:content-["*"] after:ml-0.5 after:text-red-500 font-semibold text-sm'>Doğum tarihi</div>
                    <input
                        type="date"
                        placeholder="Birth Date"
                        name="birthDate"
                        value={formik.values.birthDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className='w-full py-2 ring-1 ring-gray-300 px-4 focus:ring-gray-500 outline-none rounded-md'
                    />
                    {formik.touched.birthDate && formik.errors.birthDate && (
                        <p className="text-red-500 text-xs">{formik.errors.birthDate}</p>
                    )}
                    <button type='submit' className='w-full h-12 bg-[#7469b6] rounded-xl mt-4 text-white'>Kayıt Ol</button>
                </form>
                <div className='w-full py-4 flex items-center justify-center text-xs font-medium gap-1'>Zaten hesabınız var mı? <a href='/login' className='underline'>Giriş Yap</a></div>


            </div>

        </div>
    )
}

export default Register
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { GoListOrdered } from "react-icons/go";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProgressBar from "./ProgressBar";

const apiUrl = process.env.REACT_APP_API_URL;

function Navbar({ progressBar, animation }) {

    const [dropDownMenu, setDropDownMenu] = useState(false);
    const userId = localStorage.getItem('storyUserId');
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
                setDropDownMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const openProfileDropDownMenu = (event) => {
        event.stopPropagation();
        setDropDownMenu(!dropDownMenu);
    };

    const handleNavItemClick = (name) => {
        switch (name) {
            case "Ana Sayfa":
                navigate("/");
                break;
            case "Kategoriler":
                navigate("/categories");
                break;
            default:
                break;
        }
    };

    const handleDropdownItemClick = (name) => {
        switch (name) {
            case "Profilim":
                navigate(`/user/${userId}`);
                break;
            case "Kitaplığım":
                navigate("/library");
                break;
            case "Yardım":
                navigate("/help");
                break;
            case "Ayarlar":
                navigate("/settings");
                break;
            case "Çıkış Yap":
                localStorage.removeItem('storyUserId');
                localStorage.removeItem('storyUserName');
                navigate("/login");
                break;
            default:
                break;
        }
    };

    const navItem = [
        {
            id: 1,
            name: "Ana Sayfa",
            icon: <GoHome />
        },
        {
            id: 2,
            name: "Kategoriler",
            icon: <GoListOrdered />
        },
    ];

    const dropDownItem = [
        {
            id: 1,
            name: "Profilim",
            icon: <GoHome />
        },
        {
            id: 2,
            name: "Kitaplığım",
            icon: <GoListOrdered />
        },
        {
            id: 2,
            name: "Yardım",
            icon: <GoListOrdered />
        },
        {
            id: 2,
            name: "Ayarlar",
            icon: <GoListOrdered />
        },
        {
            id: 2,
            name: "Çıkış Yap",
            icon: <GoListOrdered />
        },
    ];



    const { data: userPhoto, isLoading: userPhotoLoading, error: userPhotoError } = useQuery({
        queryKey: ["userPhoto"],
        queryFn: () => axios.get(`${apiUrl}/users/getUserProfilePhotos/${userId}`).then(res => res.data)
    });

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (userPhotoLoading) return <div>Loading...</div>;
    if (userPhotoError) return <div>Error: {userPhotoError.message}</div>;

    return (
        <div className="w-full h-auto fixed bg-white top-0 left-0 z-30 shadow">
            <div className={`${isScrolled && animation ? 'h-16' : 'h-20'} flex items-center transition-all duration-300 ease-in-out`}>
                <div className="px-12 h-20 flex items-center justify-center">
                    <div className="w-auto h-8 pl-2 font-bold text-3xl text-[#7469b6]">fable</div>
                </div>
                <div className="px-2 h-20 flex items-center justify-center">
                    {navItem.map((item) => (
                        <div
                            key={item.id}
                            className="px-2 h-20 flex items-center justify-center"
                        >

                            <button
                                className="h-10 px-4 rounded-md text-sm font-medium flex hover:bg-gray-100"
                                onClick={() => handleNavItemClick(item.name)}
                            >
                                <div className="h-10 flex items-center justify-center text-xl">{item.icon}</div>
                                <div className="h-10 flex items-center px-2">{item.name}</div>
                            </button>

                        </div>
                    ))}
                </div>
                <div className="flex-1 h-20"></div>
                <div className="h-20 flex">
                    <div className="px-4 h-20 flex items-center text-xl justify-center">
                        <a href="/notifications" className="w-10 h-10 hover:bg-gray-100 flex items-center justify-center rounded-full">
                            <i class="fa-regular fa-bell"></i>
                        </a>
                    </div>
                    <div className="relative">
                        <div ref={buttonRef} className="pl-4 pr-12 h-20 flex items-center cursor-pointer" onClick={openProfileDropDownMenu}>
                            <img src={`${apiUrl}/uploads/${userPhoto}`} alt="Profile Photos" className="w-10 h-10 rounded-full" />
                            <i className="fa-solid fa-angle-down px-4"></i>
                        </div>
                        {dropDownMenu ? (
                            <div ref={menuRef} className="w-40 h-auto p-2 absolute shadow-xl rounded-lg bg-white top-16 right-12 flex flex-col gap-2">
                                {dropDownItem.map((item) => (
                                    <div key={item.id} onClick={() => handleDropdownItemClick(item.name)} className="w-full h-8 flex items-center px-4 rounded-md hover:bg-slate-100 text-sm cursor-pointer">{item.name}</div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
            {progressBar ? <ProgressBar /> : null}
        </div>
    );
}

export default Navbar;

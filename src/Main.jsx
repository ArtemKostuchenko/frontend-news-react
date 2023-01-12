import './main.css'
import Header from "./components/header/Header";
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/login/Login';
import Register from './components/register/Register';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchAuthorized } from './redux/slices/auth';
import FullNews from './components/news/FullNews';
import AddNews from './components/news/AddNews';
import Profile from './components/profile/Profile';
import Footer from './components/footer/Footer';
import './main.scss'
import UpdateNews from './components/news/UpdateNews';

function Main() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchAuthorized());
    }, [dispatch]);
    return (
        <>
            <Header className="body__row-header" />
            <div className='body__container'>
                <div className="body__row-container">
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/register' element={<Register />} />
                        <Route path='/profile' element={<Profile />} />
                        <Route path='/news/:id' element={<FullNews />} />
                        <Route path='/news/add' element={<AddNews />} />
                        <Route path='/news/:id/edit' element={<UpdateNews />} />
                    </Routes>
                </div>
                <div className="body__row-footer">
                    <Footer/>
                </div>
            </div>
        </>
    )
}

export default Main;
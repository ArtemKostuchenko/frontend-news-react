import { Button} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout, selectIsAuth, selectUser } from '../../redux/slices/auth';
import AccountMenu from '../menu/AccountMenu';
import MenuAuth from '../menu/MenuAuth';
import './header.scss'

function Header() {
    const isAuth = useSelector(selectIsAuth);
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const handleLogOut = () => {
        dispatch(logout());
        window.localStorage.removeItem('token');
    };
    return (
        <header>
            <Link to="/">
                <h2>Big-bi-News</h2>
            </Link>

            {isAuth ?
                <>
                    <div>
                        <AccountMenu image={user.image} fullName={user.fullName} logOut={handleLogOut} isAuth/>
                    </div>
                </>
                :
                <>
                    <div className={"auth"}>
                        <Link to="/login">
                            <Button variant="contained" disableElevation color='info'>Увійти</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="contained" disableElevation color='warning'>Зареєструватися</Button>
                        </Link>
                    </div>
                    <div className="account__menu">
                       <MenuAuth/>
                    </div>
                </>
            }

        </header>
    )
}

export default Header;


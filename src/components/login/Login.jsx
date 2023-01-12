import { Alert, Button, TextField} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";
import { useMediaPredicate } from "react-media-hook";
import './login.scss';

function Login() {
    const dispatch = useDispatch();
    const [errorAuth, setErroAuth] = useState(false);
    const isAuth = useSelector(selectIsAuth);
    const inputSize = useMediaPredicate("(max-width: 522px)");

    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onChange'
    });

    const handleOnSubmit = async (values) => {
        setErroAuth(false);
        const data = await dispatch(fetchAuth(values));
        if (!data.payload) {
            setErroAuth(true);
        } else if ('token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token);
        }
    }

    if (isAuth) {
        return <Navigate to='/' />;
    }

    return (
        <>
            <div className="login">
                <div className="login__main">
                    <div className="login__title">Увійти</div>
                    <form onSubmit={handleSubmit(handleOnSubmit)}>
                        <div className="login__input">
                            <TextField
                                {...register('email', {
                                    required: 'Вкажіть пошту',
                                    pattern: {
                                        message: "Невірний формат пошти",
                                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                    }
                                })}
                                className="login__input-block"
                                error={Boolean(errors.email?.message)}
                                helperText={errors.email?.message}
                                label="Елек.пошта"
                                size={inputSize? 'small': 'medium'}
                                type="text"
                            />
                        </div>
                        <div className="login__input">
                            <TextField
                                {...register('password', {
                                    required: 'Вкажіть пароль',
                                    minLength: {
                                        message: 'Занадто короткий пароль (мінімум 5 символів)',
                                        value: 5
                                    }
                                })}
                                className="login__input-block"
                                error={Boolean(errors.password?.message)}
                                helperText={errors.password?.message}
                                label="Пароль"
                                size={inputSize? 'small': 'medium'}
                                type="password"
                                autoComplete="current-password"
                            />
                        </div>
                        <div>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size={inputSize? 'small': 'medium'}
                                disabled={!isValid}
                            >
                                Увійти
                            </Button>
                        </div>
                    </form>
                    {errorAuth && <>
                        <Alert severity="error" sx={{
                            marginTop: 3,
                            marginBottom: 3
                        }}>Не вдалось авторизуватися</Alert>
                    </>}
                </div>
            </div>

        </>
    );
}

export default Login;
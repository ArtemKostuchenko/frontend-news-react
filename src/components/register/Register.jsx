import { Alert, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";
import { useMediaPredicate } from "react-media-hook";
import './register.scss'


function Register() {
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuth);
    const [errorRegister, setErrorRegister] = useState(false);
    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        defaultValues: {
            email: '',
            password: '',
            fullName: '',
        },
        mode: 'onChange'
    });
    const inputSize = useMediaPredicate("(max-width: 522px)");


    const handleOnSubmit = async (values) => {
        setErrorRegister(false);
        const data = await dispatch(fetchRegister(values));
        if (!data.payload) {
            setErrorRegister(true);
        } else if ('token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token);
        }
    }

    if (isAuth) {
        return <Navigate to='/' />;
    }
    return (
        <>
            <div className="register">
                <div className="register__main">
                <div className="register__title">Зареєструватися</div>
                    <form onSubmit={handleSubmit(handleOnSubmit)}>
                        <div className="register__input">
                            <TextField
                                {...register('email', {
                                    required: 'Вкажіть пошту',
                                    pattern: {
                                        message: "Невірний формат пошти",
                                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                    }
                                })}
                                error={Boolean(errors.email?.message)}
                                helperText={errors.email?.message}
                                label="Елек.пошта"
                                type="text"
                                size={inputSize? 'small': 'medium'}
                            />
                        </div>
                        <div className="register__input">
                            <TextField
                                {...register('password', {
                                    required: 'Вкажіть пароль',
                                    minLength: {
                                        message: 'Занадто короткий пароль (мінімум 5 символів)',
                                        value: 5
                                    }
                                })}
                                error={Boolean(errors.password?.message)}
                                helperText={errors.password?.message}
                                label="Пароль"
                                type="password"
                                autoComplete="current-password"
                                size={inputSize? 'small': 'medium'}
                            />
                        </div>
                        <div className="register__input">
                            <TextField
                                {...register('fullName', {
                                    required: 'Вкажіть імя',
                                    minLength: {
                                        message: 'Вкажіть імя (мінімум 4 символа)',
                                        value: 4
                                    }
                                })}
                                error={Boolean(errors.fullName?.message)}
                                helperText={errors.fullName?.message}
                                label="Імя"
                                type="text"
                                size={inputSize? 'small': 'medium'}
                            />
                        </div>
                        <div>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={!isValid}
                                size={inputSize? 'small': 'medium'}
                            >Зареєструватися
                            </Button>
                        </div>
                    </form>
                    {errorRegister && <>
                        <Alert severity="error" sx={{
                            marginTop: 3,
                            marginBottom: 3
                        }}>Не вдалось зареєструватися</Alert>
                    </>}
                </div>
            </div>
        </>
    );
}

export default Register;
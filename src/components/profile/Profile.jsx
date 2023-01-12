import { Avatar, Button, Dialog, DialogTitle, Grid, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUser, selectIsAuth, fetchUpdateProfile } from "../../redux/slices/auth";
import axios from '../../axios'
import { useForm } from "react-hook-form";
import './profile.scss'


function Profile() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const isAuth = useSelector(selectIsAuth);
    const [isEditing, setEditing] = useState(false);
    const [dialogChangePhoto, setDialogChangePhoto] = useState(false);
    const inputFile = useRef();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            email: ' ',
            fullName: ' ',
        },
        mode: 'onChange'
    });

    const changeValue = (key, value) => {
        setValue(key, value);
    }


    useEffect(() => {
        try {
            axios.get(`auth/me`).then(({ data }) => {
                changeValue("email", data.email);
                changeValue("fullName", data.fullName);
            });
        } catch (err) {
            console.warn(err);
        }
    }, []);

    const handleChangeFile = async (e) => {
        try {
            const formData = new FormData();
            formData.append('image', e.target.files[0]);
            const { data } = await axios.post('/upload/profile', formData);
            if (data.url) {
                const dataSend = {
                    image: data.url,
                }
                dispatch(fetchUpdateProfile(dataSend));
            }
            setDialogChangePhoto(false);
        } catch (err) {
            console.warn(err);
        }
    }

    const handleOnSubmit = async (values) => {
        await dispatch(fetchUpdateProfile(values));
        await axios.get(`auth/me`).then(({ data }) => {
            setValue("email", data.email);
            setValue("fullName", data.fullName);
        });
        setEditing(false);
    }

    const handleOpenDialog = () => {
        setDialogChangePhoto(true);
    }
    const handleCloseDialog = () => {
        setDialogChangePhoto(false);
    }


    const handleRemoveImage = async () => {
        try {
            const { data } = await axios.delete(`/upload/profile`);
            if (data.message) {
                const dataSend = {
                    image: '',
                }
                dispatch(fetchUpdateProfile(dataSend));
            }
            setDialogChangePhoto(false);
        } catch (err) {
            console.warn(err);
        }
    }

    if (!window.localStorage.getItem('token') && !isAuth) {
        return <Navigate to='/' />;
    }

    const handleInputFile = () => {
        inputFile.current.click();
    }

    return (
        <>
            {user ?
                <>
                    <div className="profile">
                        <div className="profile__row">
                            <div className="profile__item">
                                <p className="profile__title">Профіль</p>
                                <div className="profile__card">
                                    {user.image ?
                                        <>
                                            <Tooltip title="Змінити фото">
                                                <IconButton sx={{ marginTop: 3 }} onClick={handleOpenDialog}>
                                                    <Avatar sx={{ width: 75, height: 75, bgcolor: 'white' }} src={`http://localhost:4444/uploads/profile/${user.image}`}>
                                                    </Avatar>
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                        :
                                        <>
                                            <Tooltip title="Обрати фото">
                                                <IconButton onClick={handleInputFile}>
                                                    <Avatar sx={{ width: 75, height: 75 }}>{user.fullName ? user.fullName[0].toUpperCase() : 'L'}</Avatar>
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    }
                                    <input ref={inputFile} type="file" accept="image/*" onChange={handleChangeFile} hidden />
                                    <p className="profile__fullname">{user.fullName ? user.fullName : ''}</p>
                                    <p className="profile__email">{user.email ? user.email : ''}</p>
                                </div>
                            </div>
                        </div>
                        <div className="profile__row">
                            <div className="profile__item">
                                <div className="profile__card">
                                    <form onSubmit={handleSubmit(handleOnSubmit)}>
                                        <div>
                                            <TextField
                                                label="Електрона пошта"
                                                {...register('email', {
                                                    required: 'Вкажіть пошту',
                                                    pattern: {
                                                        message: "Невірний формат пошти",
                                                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                                    },
                                                    value: user ? user.email : ''
                                                })}
                                                error={Boolean(errors.email?.message)}
                                                helperText={errors.email?.message}
                                                type="text"
                                                fullWidth
                                                size='small'
                                                sx={{ marginTop: 1 }}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                label="Імя"
                                                {...register('fullName', {
                                                    required: 'Вкажіть імя',
                                                    minLength: {
                                                        message: 'Вкажіть імя (мінімум 4 символа)',
                                                        value: 4
                                                    }
                                                })}
                                                error={Boolean(errors.fullName?.message)}
                                                helperText={errors.fullName?.message}
                                                type="text"
                                                fullWidth
                                                size='small'
                                                sx={{ marginTop: 1 }}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            {isEditing ?
                                                <>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        color="success"
                                                        sx={{ marginTop: 1, marginRight: 1 }}>Зберегти</Button>
                                                    <Button
                                                        type="button"
                                                        variant="contained"
                                                        color="error"
                                                        sx={{ marginTop: 1 }}
                                                        onClick={() => setEditing(false)}>Скасувати</Button>
                                                </>
                                                :
                                                <>
                                                </>
                                            }
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            {!isEditing ?
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        color="warning"
                                                        sx={{ marginTop: 1 }}
                                                        onClick={() => setEditing(true)}>Редагувати</Button>
                                                </>
                                                :
                                                <>
                                                </>
                                            }
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Dialog onClose={handleCloseDialog} open={dialogChangePhoto}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            width: '300px'
                        }}>
                            <DialogTitle>Змінити фото</DialogTitle>
                            <Avatar sx={{ width: 75, height: 75, bgcolor: 'white' }} src={`${process.env.REACT_APP_API_URL}/uploads/profile/${user.image}`}></Avatar>
                            <Button variant="contained" color="warning" sx={{
                                width: '175px',
                                marginTop: 1
                            }} onClick={handleInputFile}>Змінити</Button>
                            <Button variant="contained" color="error" fullWidth sx={{
                                width: '175px',
                                marginTop: 1,
                                marginBottom: 2
                            }} onClick={handleRemoveImage}>Видалити</Button>
                        </Box>
                    </Dialog>
                </>
                :
                <>
                </>
            }
        </>
    )
}

export default Profile;
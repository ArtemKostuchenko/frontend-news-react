import { Backdrop, Box, Button, CircularProgress, Input, Snackbar, Alert } from "@mui/material";
import { useCallback,  useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { selectIsAuth } from "../../redux/slices/auth";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import axios from "../../axios";
import { useForm } from "react-hook-form";

function AddNews() {
    const isAuth = useSelector(selectIsAuth);
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            description: '',
        },
        mode: 'onChange'
    });
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const inputFile = useRef();

    const onChangeSimpleMDE = useCallback((value) => {
        setDescription(value);
    }, []);
    const handleChangeFile = async (e) => {
        try {
            const formData = new FormData();
            formData.append('image', e.target.files[0]);
            setFile(e.target.files[0]);
            const { data } = await axios.post('/upload/news/temp', formData);
            setImageUrl(data.url);
        } catch (err) {
            console.warn(err);
        }
    }

    const handleRemoveImage = async () => {
        try {
            const { data } = await axios.delete(`/upload/news/temp/${imageUrl}`, {
                file: imageUrl.substring(1),
            });
            if (data.message) {
                setImageUrl('');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    const handleSelectFile = () => {
        setImageUrl('');
        inputFile.current.click();
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
    }
    const handleOnSubmit = async () => {
        try {
            setLoading(true);
            let url = ''
            if (imageUrl) {
                const formData = new FormData();
                formData.append('image', file);
                const { data } = await axios.post('/upload/news/save', formData);
                await handleRemoveImage();
                if (data.url) {
                    url = data.url
                }
            }
            const fields = {
                title,
                description,
                image: url,
            };
            const { data } = await axios.post('/news', fields);
            setLoading(false);
            navigate(`/news/${data._id}`);
        } catch (err) {
            console.warn(err);
        }
    }

    const optionsEditor = useMemo(() => ({
        spellChecker: false,
        maxHeight: '400px',
        autofocus: true,
        placeholder: "Введіть текст...",
        status: false,
        autosave: {
            enabled: true,
            delay: 1000,
        },
    }), []);

    if (!window.localStorage.getItem('token') && !isAuth) {
        return <Navigate to='/' />;
    }



    return (
        <>
            <Box sx={{
                marginTop: 4,
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
                borderRadius: '3px',
                padding: '10px 15px'
            }}>
                {imageUrl &&
                    <>
                        <div>
                            <img src={`${process.env.REACT_APP_API_URL}/uploads/news/temp/${imageUrl}`} alt={title} style={{
                                maxWidth: '100%'
                            }} />
                        </div>
                        <div>
                            <Button variant="outlined" color="error" onClick={handleRemoveImage}>Видалити фото</Button>
                        </div>
                    </>
                }
                {!imageUrl &&
                    <>
                        <div>
                            <Button variant="outlined" onClick={handleSelectFile}>Завантажити фото</Button>
                        </div>
                    </>
                }
                <form onSubmit={handleSubmit(handleOnSubmit)}>
                    <div>
                        <Input placeholder="Заголовок новини" sx={{
                            fontSize: '30px',
                            marginTop: 3,
                        }} {...register("title", {
                            required: "Поле назви новини є обовязкове",
                            minLength: {
                                message: 'Занадто коротка назва новини',
                                value: 5
                            },
                            onChange: (e) => {
                                setTitle(e.target.value);
                            }
                        })} value={title} fullWidth />
                    </div>
                    <input ref={inputFile} type="file" onChange={handleChangeFile} hidden />
                    <Box sx={{
                        marginTop: 3,
                    }}>
                        <input {...register("description", {
                            required: "Поле з описом є обовязкове",
                            minLength: {
                                message: 'Введіть більше тексту новини',
                                value: 10
                            }
                        })} value={description} hidden />
                        <SimpleMDE value={description} onChange={onChangeSimpleMDE} options={optionsEditor} />
                    </Box>
                    <div>
                        <Button variant="contained" color="success" sx={{
                            marginTop: 3,
                        }} type="submit" onClick={handleOnSubmit}>
                            Додати
                        </Button>
                        <Link to='/'>
                            <Button variant="contained" color="error" sx={{
                                marginTop: 3,
                                marginLeft: 1
                            }}>
                                Скасувати
                            </Button>
                        </Link>
                    </div>
                </form>
            </Box>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {errors.title &&
                <>
                    <Snackbar open={Boolean(errors.title?.message)} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                            {errors.title?.message}
                        </Alert>
                    </Snackbar>
                </>
            }
        </>
    )
}

export default AddNews;
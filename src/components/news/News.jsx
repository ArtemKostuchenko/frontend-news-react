import { Avatar, Box, Grid, IconButton, Skeleton, SvgIcon, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useDispatch } from "react-redux";
import { fetchDeleteNews } from "../../redux/slices/news";
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import './news.min.scss'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { splitTextOnWords } from "../../utils/functionsText";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


function News({ _id, image, title, description, views = 0, user, isLoading = false, createTime, updateTime, isEditable = false }) {
    const [handleDelete, setHandleDelete] = useState(false);
    const dateCreate = new Date(createTime);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const dispatch = useDispatch();

    const onClickRemoveNews = () => {
        dispatch(fetchDeleteNews(_id));
        handleCloseDialog();
    };

    const handleOpenDialog = () => {
        setHandleDelete(true);
    };

    const handleCloseDialog = () => {
        setHandleDelete(false);
    };

    return (
        <>
            {isLoading ? <>
                <div className="news__item">
                    <Skeleton variant="rectangular" className="news__image" sx={{height: '500px'}} />
                    <Skeleton variant="text"  className="news__title title" />
                    <Skeleton variant="text" className="news__description description"/>
                </div>

            </>
                :
                <>
                    <div className="news__item">
                        {isEditable && <>
                            <div className="edit">
                                <Grid container rowSpacing={2} columnSpacing={{ md: 3 }}>
                                    <Grid item xs={5}>
                                        <Link to={`/news/${_id}/edit`}>
                                            <Tooltip title="Редагувати">
                                                <IconButton>
                                                    <SvgIcon component={EditIcon} color="warning" sx={{
                                                        fontSize: '30px'
                                                    }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Link>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Tooltip title="Видалити">
                                            <IconButton onClick={handleOpenDialog}>
                                                <SvgIcon component={DeleteIcon} color="error" sx={{
                                                    fontSize: '30px'
                                                }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </div>
                        </>}
                        <div className="news__image">
                            {image ?
                                <>
                                    <Link to={`/news/${_id}`}>
                                        <img src={`${process.env.REACT_APP_API_URL}/uploads/news/saved/${image}`} alt={title} style={{
                                            maxWidth: '100%'
                                        }} />
                                    </Link>
                                </>
                                :
                                <></>
                            }
                        </div>
                        <div className="news__title">
                            <Link to={`/news/${_id}`}>
                                <p className="title">
                                    {title}
                                </p>
                            </Link>
                        </div>

                        <div className="news__description">
                            <p className="description">
                                <ReactMarkdown children={splitTextOnWords(description, ) + ' ...'} />
                            </p>
                        </div>
                        <div className="news__views">
                            <div className="news__views-item">
                                <VisibilityIcon sx={{ color: 'gray' }}>

                                </VisibilityIcon>
                                {views}
                            </div>
                        </div>
                        <div>
                            <Box className="about__card">
                                <Box className="author">
                                    <Avatar src={`${process.env.REACT_APP_API_URL}/uploads/profile/${user.image}`}></Avatar>
                                    <p className="fullname">{user.fullName}</p>
                                    <p className="role">Автор</p>
                                </Box>
                                <Box className="publication">
                                    <p className="publication__date">Дата публікації: <span>{dateCreate.toLocaleDateString('uk-UA', options)}</span></p>
                                </Box>
                            </Box>
                        </div>
                    </div>
                    <Dialog
                        open={handleDelete}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleCloseDialog}
                        aria-describedby="alert-dialog-slide-description"
                        className="dialog"
                    >
                        <DialogTitle className="dialog__title">Видалення новини</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description" className="dialog__text">
                                Ви дійсно хочете видалити новину "{title}"?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} className="dialog__buttons">Ні</Button>
                            <Button onClick={onClickRemoveNews} className="dialog__buttons">Так</Button>
                        </DialogActions>
                    </Dialog>
                </>
            }
        </>
    )
};

export default News;
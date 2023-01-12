import { Avatar, Box, Skeleton} from "@mui/material";
import axios from "../../axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import * as React from "react";

function FullNews() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };


    useEffect(() => {
        axios.get(`/news/${id}`).then(res => {
            setData(res.data);
            setIsLoading(false);
        }).catch((err) => {
            console.warn(err);
        })
    }, [id])
    return (
        <>
            {isLoading ?
                <>
                    <Box sx={{
                        marginTop: 4,
                        width: '800px',
                        backgroundColor: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'left',
                        borderRadius: '3px'
                    }}>
                        <Skeleton variant="rectangular" sx={{
                            marginTop: 2,
                            marginLeft: 2.5,
                            marginRight: 2.5,
                            height: '400px'
                        }} />
                        <Skeleton variant="text" sx={{
                            fontSize: '4.5rem',
                            marginTop: 3,
                            marginLeft: 2,
                            marginRight: 2
                        }} />
                        <Skeleton variant="text" sx={{
                            fontSize: '2.5rem',
                            marginTop: 2,
                            marginLeft: 2,
                            marginRight: 2
                        }} />
                    </Box>
                </>
                :
                <>
                    <div className="fullnews">
                        <div className="fullnews__container">
                            <div className="fullnews__row">
                                <div className="news__item">
                                    <div>
                                        {data.image ?
                                            <>
                                                <img src={`http://localhost:4444/uploads/news/saved/${data.image}`} alt={data.title} style={{
                                                    maxWidth: '100%',
                                                }} />
                                            </>
                                            :
                                            <></>
                                        }
                                    </div>
                                    <div>
                                        <div className="news__title">
                                            <p className="title">
                                                {data.title}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="news__description">
                                            <p className="description">
                                                <ReactMarkdown children={data.description} />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="fullnews__row">
                                <Box className="fullnews__author-card">
                                    <div className="author-card__author">
                                        <Avatar src={`http://localhost:4444/${data.user.image}`}></Avatar>
                                        <p className="fullname">{data.user.fullName}</p>
                                        <p className="role">Автор</p>
                                    </div>
                                    <div className="author-card__publication publication">
                                        <p className="publication__date">Дата публікації: <span>{new Date(data.createdAt).toLocaleDateString('uk-UA', options)}</span></p>
                                    </div>
                                </Box>

                            </div>
                        </div>
                    </div>

                </>
            }

        </>
    );
};

export default FullNews;
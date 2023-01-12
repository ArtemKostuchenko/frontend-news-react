import { splitTextOnWords } from '../../utils/functionsText';
import VisibilityIcon from '@mui/icons-material/Visibility';

import './popular.scss'
import { Link } from 'react-router-dom';

function Popular({ popularNews, isLoading = true }) {
    return (
        <>
            <div className="info">
                <div className="info__popular">
                    <div className="info-popular__title"><p>Популярні новини</p></div>
                    <div className="popular__row">
                        {popularNews.map(pop =>
                            <>
                                <Link to={`/news/${pop._id}`}>
                                    <div className="popular__item">
                                        <div className="popular__image">
                                            <img src={`http://localhost:4444/uploads/news/saved/${pop.image}`} alt={pop.title} />
                                        </div>
                                        <div className='popular__detail'>
                                            <div className="popular__title">
                                                {splitTextOnWords(pop.title, 3)} ...
                                            </div>
                                            <div className="popular__views">
                                                <VisibilityIcon sx={{ color: 'gray', fontSize: '20px' }}>

                                                </VisibilityIcon>
                                                {pop.views}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                <div className="info__comments"></div>
            </div>
        </>
    )
}

export default Popular;
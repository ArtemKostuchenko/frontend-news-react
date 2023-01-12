import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNews, fetchPopularNews, selectNews, selectPopularNews } from "../redux/slices/news";
import News from "./news/News";
import Popular from "./popular/Popular";
function Home() {
  const dispatch = useDispatch();
  const news = useSelector(selectNews);
  const popularNews = useSelector(selectPopularNews);
  const userData = useSelector(state => state.auth.data);
  const isNewsLoading = news.status === 'loading' || news.status === 'error';
  const isPopularNewsLoading = popularNews.status === 'loading' || popularNews.status === 'error';

  useEffect(() => {
    dispatch(fetchNews());
    dispatch(fetchPopularNews());

  }, [dispatch]);

  return (
    <>
      <div className="container">
        <div className="container__row">
          {(isNewsLoading ? [...Array(5)] : news.items).map((obj, index) => isNewsLoading ?
            <div className="container__item">
              <News key={index} isLoading={true} />
            </div>
            :
            (
              <div className="container__item">
                <News _id={obj._id} title={obj.title} description={obj.description} views={obj.views} image={obj.image} user={obj.user} createTime={obj.createdAt} updateTime={obj.updatedAt} isEditable={userData?._id === obj.user._id} />
              </div>
            )
          )}
        </div>
        <div className="container__row">
          <div className="container__item">
            {!isPopularNewsLoading?
              <>
                <Popular popularNews={popularNews.items} />
              </>
              :
              <>
              </>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
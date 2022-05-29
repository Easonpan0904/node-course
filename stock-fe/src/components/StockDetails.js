import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../utils/config';

const StockDetails = () => {
  // 宣告一個 react 控制的狀態，這個狀態的名字叫做 date
  const [data, setData] = useState([]);

  // 目前在第幾頁
  const [page, setPage] = useState(1);

  // 總筆數
  const [lastPage, setLastPage] = useState(1);

  // 從網址上取得 :stockId
  const { stockId } = useParams();

  useEffect(() => {
    let getPrices = async () => {
      let res = await axios.get(API_URL + '/stocks/' + stockId, {
        params: {
          page: page,
        },
      });
      setData(res.data.data);
      setLastPage(res.data.pagination.lastPage);
    };
    getPrices();
  }, [page]);

  const getPages = () => {
    let pages = [];
    for (let i = 1; i <= lastPage; i++) {
      pages.push(
        <li
          style={{
            display: 'inline-block',
            margin: '2px',
            backgroundColor: page === i ? '#00d1b2' : '',
            borderColor: page === i ? '#00d1b2' : '#dbdbdb',
            color: page === i ? '#fff' : '#363636',
            borderWidth: '1px',
            width: '28px',
            height: '28px',
            borderRadius: '3px',
            textAlign: 'center',
          }}
          key={i}
          onClick={(e) => {
            setPage(i);
          }}
        >
          {i}
        </li>
      );
    }

    return pages;
  };

  return (
    <div>
      <ul className="m-6">{getPages()}</ul>
      {data.map((stock) => {
        return (
          <div key={stock.date} className="bg-white bg-gray-50 p-6 rounded-lg shadow m-6">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">日期：{stock.date}</h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">成交金額：{stock.amount}</h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">成交股數：{stock.volume}</h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">開盤價：{stock.open_price}</h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">收盤價：{stock.close_price}</h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">漲跌價差：{stock.delta_price}</h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">最高價：{stock.high_price}</h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">最低價：{stock.low_price}</h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">成交筆數：{stock.transactions}</h2>
          </div>
        );
      })}
    </div>
  );
};

export default StockDetails;

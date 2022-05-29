import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { API_URL } from '../utils/config';

const Stock = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    let getStock = async () => {
      let response = await axios.get(API_URL + '/stocks');
      setStocks(response.data);
    };
    getStock();
  }, []);
  // console.log(stocks);
  return (
    <div>
      <h2 className="ml-7 mt-6 text-xl text-gray-600">股票代碼</h2>
      {stocks.map((stocks) => {
        return (
          <div key={stocks.id} className="bg-white bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg m-6 cursor-pointer">
            <Link to={`/stock/${stocks.id}`}>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">{stocks.id}</h2>
              <p className="text-gray-700">{stocks.name}</p>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Stock;

import { useState, useEffect } from 'react'
import  axios  from "axios"
import { API_URL, IMAGE_URL } from '../utils/config';

const About = () => {
  const [userData, setUserData] = useState(null)
  useEffect(()=> {
    let getMemberInfo = async () => {
      let response = await axios.get(`${API_URL}/member/info`, {
        // 允許跨源讀寫 cookie
        // 這樣才可以把之前有紀錄登入資料的 sid 送回去後端
        withCredentials: true
      })
      setUserData(response.data)
    }
    getMemberInfo();
  },[]) 
  return (
    <div className="m-7">
      <h2 className="m-7 text-2xl text-gray-600">這裡是魚股市</h2>
      {userData ? 
      <>
        <h3>Hi, {userData.name}</h3>
        {/* /members/1655004989127.png */}
        <img src={`${IMAGE_URL}${userData.photo}`} alt='...'/>
      </> : 
      <>
        <h3>尚未登入</h3>
      </>}
    </div>
  );
};

export default About;

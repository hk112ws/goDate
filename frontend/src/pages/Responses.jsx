
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const retrieveData = (key) => {
    const data = localStorage.getItem(key);
    try {
      return data;
    } catch (error) {
      console.error('Failed to parse JSON from localStorage:', error);
      return null;
    }
  };


  
  
  
  const Responses=()=>{
    const [partners, setPartners] = useState([]);
    const userId = retrieveData('appId');
    const navigate=useNavigate();

    async function deleteData(userId, partnerId) {
      // Ask for user confirmation
      const isConfirmed = window.confirm("Are you sure you want to delete this partner?");
      
      if (isConfirmed) {
        try {
          const result = await axios.delete(`https://go-date-api.vercel.app/api/users/${userId}/partners-delete/${partnerId}`);
          if (result.data) {
            alert("Data deleted");
            window.location.reload();
          }
        } catch (error) {
          alert("Issue while deleting");
        }
      }
    }

    const hasItem = localStorage.getItem('appId') !== null;
  
    useEffect(() => {
      // Conditional navigation logic
      async function fetchData() {
        try {
          const result = await axios.get(`https://go-date-api.vercel.app/get-partners/${userId}`);
          if (result.data) {
            setPartners(result.data)
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      fetchData();
      if (!hasItem) {
        navigate('/');
      }
    }, [hasItem, navigate, userId]);

    return (
      <div className="h-[100vh] w-[100vw] bg-[#edefa9] flex justify-center items-center">
        <div className="max-w-[90%] p-3 text-center">
          <h1 className="text-3xl font-bold">Responses</h1>
          <ul>
            {partners.map((partner) => (
              <li key={partner._id} className="border-2 border-black p-5 w-full mt-4 hover:cursor-pointer">
                <div className="flex justify-between items-center">
                  <Link to={`/${userId}/responses/${partner._id}`} className="flex gap-4 items-center mr-2 flex-wrap">
                    <strong>{partner.name} {partner.title}</strong>
                  </Link>
                  <button 
                    className="bg-white border-2 border-black rounded-xl p-1"
                    onClick={() => deleteData(userId, partner._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
    
}

export default Responses;

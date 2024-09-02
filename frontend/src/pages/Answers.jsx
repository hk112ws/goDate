import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const retrieveData = (key) => {
  const data = localStorage.getItem(key);
  try {
    return data;
  } catch (error) {
    console.error('Failed to parse JSON from localStorage:', error);
    return null;
  }
};

const Answers = () => {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);
  const userId = retrieveData('appId');
  
  useEffect(() => {
    if (!userId || userId.length === 0) {
      navigate('/');
    } else {
      fetchData();
    }

    async function fetchData() {
      try {
        const result = await axios.get(`https://go-date-api.vercel.app/get-answers/${userId}/${partnerId}`);
        if (result.data) {
          setAnswers(result.data.answers);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }, [navigate, partnerId, userId]);

  return (
    <div className="h-[100vh] w-[100vw] bg-[#edefa9] flex justify-center items-center">
      <div className="max-w-[90%] p-3 text-center">
        <h1>Answers</h1>
        <div className="answers-container">
          {answers.map((item, index) => (
            <div key={index} className="answer-item border-2 border-black mt-2">
              <div className="flex justify-center text-lg">
              <h2>Q {index + 1}. </h2>
              <p className="question-text">
                {item.questions.join(" ")}
              </p>
              </div>
              <p className="answer-text"><strong>Answer:</strong> {item.answer}</p>
              {item.date && <p className="answer-date"><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Answers;

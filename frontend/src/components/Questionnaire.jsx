import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

const questionSets = [
  {
    id: 1,
    gifUrl: "https://tenor.com/embed/12766875",
    questions: [
      { text: "Hii {name}", dynamic: true },
      { text: "It's me {sender}", dynamic: true },
    ],
    buttons: [
      { label: "Hello 👋", action: "next" },
    ],
  },
  {
    id: 2,
    gifUrl: "https://tenor.com/embed/15763332",
    questions: [
      { text: "Are You Old Enough😂" },
      { text: "Can't Choose no" },
      { text: "Age Is Just A No." },
    ],
    buttons: [
      { label: "YES", action: "next" },
      { label: "NO", action: "disabled" },
    ],
  },
  {
    id: 3,
    gifUrl: "https://tenor.com/embed/16181982",
    questions: [
      { text: "Could We Go On A" },
      { text: "Date" },
    ],
    buttons: [
      { label: "YES", action: "branchTo10" },
      { label: "NO", action: "branchTo4" },
    ],
  },
  {
    id: 4,
    gifUrl: "https://tenor.com/embed/7690912987044496021",
    questions: [
      { text: "Soch le ache se! 🙄" },
    ],
    buttons: [
      { label: "YES", action: "branchTo10" },
      { label: "NO", action: "next" },
    ],
  },
  {
    id: 5,
    gifUrl: "https://tenor.com/embed/15195810",
    questions: [
      { text: "Ek aur baar Soch le! 😣" },
    ],
    buttons: [
      { label: "YES", action: "branchTo10" },
      { label: "NO", action: "next" },
    ],
  },
  {
    id: 6,
    gifUrl: "https://tenor.com/embed/15974530976611222074",
    questions: [
      { text: "Manja na! kitna tarshagyi😭" },
    ],
    buttons: [
      { label: "YES", action: "branchTo10" },
      { label: "NO", action: "next" },
    ],
  },
  {
    id: 7,
    gifUrl: "https://tenor.com/embed/4872695840845483552",
    questions: [
      { text: "Chal fir😓 Baad mein try karenge!" },
    ],
    buttons: [
      { label: "YES", action: "next" },
      { label: "NO", action: "branchTo9" },
    ],
  },
  {
    id: 8,
    gifUrl: "https://tenor.com/embed/12245002022499950749",
    questions: [
      { text: "Abhi bhi Mauk hain fir😉" },
    ],
    buttons: [
      { label: "Chal bye👋", action: "end" },
    ],
  },
  {
    id: 9,
    gifUrl: "https://tenor.com/embed/26579134",
    questions: [
      { text: "Chal koi na!😌" },
    ],
    buttons: [
      { label: "Chal bye👋", action: "end" },
    ],
  },
  {
    id: 10,
    gifUrl: "https://tenor.com/embed/14700152",
    questions: [
      { text: "Hehehehe, I Knew It!😘" },
    ],
    buttons: [
      { label: "Go to next ☝", action: "next" },
    ],
  },
  {
    id: 11,
    gifUrl: "https://tenor.com/embed/19414919",
    questions: [
      { text: "When are you free?" },
    ],
    buttons: [
      { label: "Select the Date", action: "selectDate" },
      { label: "Discuss on Chat", action: "next" },
    ],
  },
  {
    id: 12,
    gifUrl: "https://tenor.com/embed/6924363935289215",
    questions: [
      { text: "So let's go!😉" },
    ],
    buttons: [
      { label: "Will plan the destination on Chat", action: "next" },
    ],
  },
  {
    id: 13,
    gifUrl: "https://tenor.com/embed/14113739",
    questions: [
      { text: "I was wondering if you could tell me: If you’re here, who’s running Heaven?😅" },
    ],
    buttons: [
      { label: "Now get Ready", action: "next" },
    ],
  },
  {
    id: 13,
    gifUrl: "https://tenor.com/embed/26733801",
    questions: [
      { text: "Wondering of You Looking adorable" },
    ],
    buttons: [
      { label: "We will meet", action: "end" },
    ],
  },
];

function Questionnaire({ name: initialName = "User", sender: initialSender = "Sender" }) {
  const [name, setName] = useState(initialName);
  const [sender, setSender] = useState(initialSender);
  const [answered, setanswered] = useState("");
  const [nameID, setNameID] = useState(initialName);
  const [senderID, setSenderID] = useState(initialSender);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [gifLoaded, setGifLoaded] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);


  const values = { user: nameID, sender: senderID };

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios.post("http://localhost:3001/getUserSender", values);
        if (result.data) {
          setName(result.data.user);
          setSender(result.data.sender);
          setanswered(result.data.answered)
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []); 

  const handleButtonClick = async (action, label) => {
    const currentSet = questionSets[currentSetIndex];
    const newResponse = {
      questions: currentSet.questions.map(q =>
        q.dynamic
          ? q.text.replace("{name}", name).replace("{sender}", sender)
          : q.text
      ),
      answer: label,
      date: selectedDate ? selectedDate.toDateString() : null,
    };

    setResponses(prevResponses => [...prevResponses, newResponse]);
    setGifLoaded(false);

    if (action === "selectDate") {
      setShowDatePicker(true);
      setCurrentSetIndex(prevIndex => Math.min(prevIndex + 1, questionSets.length - 1));
      return;
    }

    if (action === "next") {
      setCurrentSetIndex(prevIndex => Math.min(prevIndex + 1, questionSets.length - 1));
    } else if (action.startsWith("branchTo")) {
      const branchIndex = parseInt(action.replace("branchTo", ""), 10);
      setCurrentSetIndex(branchIndex - 1);
    } else if (action === "end") {
      try {
        const result = await axios.post("http://localhost:3001/saveresponses", {
            nameID,
            senderID,
            responses,
        });
    
        if (result.data) {
            console.log(result.data);
            alert("Thank you for your answers!");
            window.location.href = "https://google.com";
        }
    } catch (error) {
        console.error("Error fetching data:", error.response?.status, error.response?.data || error.message);
    }
    
    }

    setShowDatePicker(false);
  };

  const handleGifLoad = () => {
    setGifLoaded(true);
  };

  const handleDateChange = newDate => {
    setSelectedDate(newDate);
  };

  const currentSet = questionSets[currentSetIndex];
  return (
    answered === "yes" ? (
      <div>
        <h1 className='font-semibold text-3xl '>Already answered</h1>
      </div>
    ) : (
      <div>
        {!showDatePicker && (
          <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
            <iframe
              src={currentSet.gifUrl}
              width="100%"
              height="auto"
              onLoad={handleGifLoad}
              style={{ aspectRatio: '1 / 1', border: 'none', display: 'block' }}
            ></iframe>
          </div>
        )}
        {gifLoaded && !showDatePicker && (
          <>
            <div className='my-5'>
              {currentSet.questions.map((question, index) => (
                <h1 key={index} className="text-3xl font-bold">
                  {question.dynamic
                    ? question.text.replace("{name}", name).replace("{sender}", sender)
                    : question.text}
                </h1>
              ))}
            </div>
            <div className="flex justify-evenly flex-wrap gap-4">
              {currentSet.buttons.map((button, index) => (
                <button
                  key={index}
                  className="text-[#111] bg-[#fff] py-3 px-6 rounded-lg shadow-custom text-2xl font-semibold"
                  onClick={() => handleButtonClick(button.action, button.label)}
                  disabled={button.action === "disabled"}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </>
        )}
        {showDatePicker && (
          <div className="my-5">
            <h3>Select a Date</h3>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate || new Date()}
              minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
              tileClassName="react-calendar__tile"
            />
            <p>Selected Date: {selectedDate ? selectedDate.toDateString() : "None"}</p>
            <button
              className="text-[#111] bg-[#fff] py-3 px-6 rounded-lg shadow-custom text-2xl font-semibold"
              onClick={() => handleButtonClick('next', 'Date Selected')}
            >
              Confirm Date
            </button>
          </div>
        )}
      </div>
    )
  );
  
}


export default Questionnaire;

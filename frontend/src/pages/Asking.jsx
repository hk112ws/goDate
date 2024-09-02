import { useParams } from "react-router-dom";
import Questionnaire from "../components/Questionnaire";



const AskingOut=()=>{
const params=useParams();
const name=params.user;
const sender=params.sender;




return (
    <div className="h-[100vh] w-[100vw] bg-[#ffe5e5] flex justify-center items-center">
        <div className="max-w-[90%] p-3 text-center">
        <Questionnaire name={name} sender={sender} />
        </div>
    </div>
)
}

export default AskingOut;






{/* <>
        <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
          <iframe
            src="https://tenor.com/embed/12766875"
            width="100%"
            height="auto"
            allowFullScreen
            title="Cat GIF"
            ></iframe>
    </div>

       <h1 className="text-4xl font-bold mt-5">Hii {name}</h1> 
       <h1 className="text-4xl font-bold mb-10">It's me {sender}</h1>
       <button className="text-[#111] bg-[#fff] py-3 px-6 rounded-lg shadow-custom text-2xl font-semibold">Hello 👋</button>
</>








<>
<div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
      <iframe
        src="https://tenor.com/embed/15763332" // Embed URL for the specific GIF
        width="100%"
        height="auto"
        frameBorder="0"
        scrolling="no"
        allowFullScreen
        // style={{ aspectRatio: '1/1' }} // Maintain 1:1 aspect ratio
      ></iframe>
    </div>

       <h1 className="text-4xl font-bold mt-5">Are You Old Enough😂</h1>
       <h1 className="text-4xl font-bold mb-14">Can't Choose</h1>
       <h1 className="text-4xl font-bold mb-14">Age Is Just A No.</h1>
       <div className="flex justify-evenly">
       <button className="text-[#111] bg-[#fff] py-3 px-6 rounded-lg shadow-custom text-2xl font-semibold">YES</button>
       <button className="text-[#111] bg-[#fff] py-3 px-6 rounded-lg shadow-custom text-2xl font-semibold" disabled>NO</button>
       </div>
</>



<>
        <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
      <iframe
        src="https://tenor.com/embed/16181982" // Use the embed URL for the specific GIF
        width="100%"
        height="auto"
        frameBorder="0"
        scrolling="no"
        allowFullScreen
        title="Tenor GIF"
        style={{ maxWidth: '100%' }}
      ></iframe>
    </div>

       <h1 className="text-4xl font-bold mt-5">Could We Go On A</h1>
       <h1 className="text-4xl font-bold mb-14">Date</h1>
       <div className="flex justify-evenly">
       <button className="text-[#111] bg-[#fff] py-3 px-6 rounded-lg shadow-custom text-2xl font-semibold">YES</button>
       <button className="text-[#111] bg-[#fff] py-3 px-6 rounded-lg shadow-custom text-2xl font-semibold">NO</button>
       </div>
</> */}


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



import { useFormik } from "formik";
import { useState, useEffect } from "react";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


// Function to retrieve data from localStorage
const retrieveData = (key) => {
  const data = localStorage.getItem(key);
  try {
    return data;
  } catch (error) {
    console.error('Failed to parse JSON from localStorage:', error);
    return null;
  }
};

const initialValue = {
  name: "",
  title: "",
};

const Schema = yup.object().shape({
  name: yup.string().required("Required !"),
  title: yup.string().required("Required !"),
});

const Createrquest = () => {
  const userId = retrieveData('appId');
  const navigate = useNavigate();

  // Check if item exists in localStorage
  const hasItem = localStorage.getItem('appId') !== null;

  useEffect(() => {
    // Conditional navigation logic
    if (!hasItem) {
      navigate('/');
    }
  }, [hasItem, navigate]);

  const [link, setLink] = useState("");

  const formik = useFormik({
    initialValues: initialValue,
    onSubmit: async (values, {resetForm} ) => {
      try {
        await axios.post("http://localhost:3001/addPartner", {values,userId})
        .then((result)=>{
            setLink(`${window.location.origin}/created/${result.data.PartnerId}/get-answer/${userId}`);
        })
        resetForm();
      } catch (err) {
        console.error('Error while adding partner:', err);
      }
    },
    validate: async (values) => {
      let errors = {};
      if (!values.name) errors.name = "Required !";
      if (!values.title) errors.title = "Required !";
      return errors;
    }
  });

  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <div className="max-w-sm w-[90%] max-h-fit h-full border-2 border-cyan-500 bg-slate-500 flex items-center justify-center gap-3 flex-col">
        <h1 className="text-3xl text-orange-500">No Bakwas!</h1>
        <p className="text-xl">Enter the name of the person....</p>
        <p className="text-xl">Generate your private link</p>
        <form onSubmit={formik.handleSubmit} className="flex flex-col max-w-full w-[95%] gap-3 justify-center">
          <input
            type="text"
            name="name"
            placeholder="Enter the partner's name"
            className="rounded-xl p-3 w-full"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-600 mt-[-8px]">{formik.errors.name}</p>
          )}
          <input
            type="text"
            name="title"
            placeholder="Title to differentiate"
            className="rounded-xl p-3 w-full"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-red-600 mt-[-8px]">{formik.errors.title}</p>
          )}
          <button
            type="submit"
            className="bg-green-500 text-white font-semibold p-2 rounded-lg border-black border-2 hover:bg-green-700 hover:text-black"
          >
            Generate
          </button>
        </form>
        <h1>Copy and share the link below:</h1>
        <h1 className="w-full break-all text-center text-blue-300">{link}</h1>


      <Link to={`/${userId}/responses`} className="text-xl bg-blue-800 text-white font-medium p-3 rounded-lg">Responses</Link>
      </div>
    </div>
  );
};

export default Createrquest;

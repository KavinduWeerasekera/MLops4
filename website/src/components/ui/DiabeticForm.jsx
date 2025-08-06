import { useState } from "react";
import axios from "axios";

const PredictForm = () => {
 const [formData, setFormData] = useState({
   age: '',
   sex: '',
   bmi: '',
   bp: '',
   s1: '',
   s2: '',
   s3: '',
   s4: '',
   s5: '',
   s6: ''
 });

 const [result, setResult] = useState(null);
 const [loading, setLoading] = useState(false);

 const handleChange = (e) => {
   setFormData(prev => ({
     ...prev,
     [e.target.name]: e.target.value
   }));
 };

 const handleSubmit = async () => {
   setLoading(true);
   try {
     const response = await axios.post("http://127.0.0.1:5000/predict", formData);
     setResult(response.data.prediction);
   } catch (err) {
     console.error(err);
     setResult("Error occurred");
   }
   setLoading(false);
 };

 return (
   <div className="fixed inset-0 flex items-center justify-center">
     <div className="p-6 space-y-4 max-w-xl w-full mx-4">
       <h2 className="text-2xl font-bold text-center">Diabetes Prediction</h2>
       {Object.keys(formData).map((key) => (
         <input
           key={key}
           name={key}
           placeholder={key.toUpperCase()}
           value={formData[key]}
           onChange={handleChange}
           className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize"
           type="number"
         />
       ))}
       <button 
         onClick={handleSubmit} 
         disabled={loading} 
         className="!bg-blue-600 !text-white hover:!bg-blue-700 disabled:!bg-gray-400 disabled:!cursor-not-allowed"
       >
         {loading ? "Predicting..." : "Predict"}
       </button>
       {result && <p className="text-lg font-semibold mt-4">Prediction: {result}</p>}
     </div>
   </div>
 );
};

export default PredictForm;
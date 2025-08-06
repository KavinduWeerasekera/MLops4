import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
  const [error, setError] = useState(null);

  const fieldInfo = {
    age: { label: "Age", description: "Standardized age (-2 to +2 range)" },
    sex: { label: "Sex", description: "Standardized sex (-2 to +2 range)" },
    bmi: { label: "BMI", description: "Standardized body mass index (-2 to +2 range)" },
    bp: { label: "Blood Pressure", description: "Standardized mean arterial pressure (-2 to +2 range)" },
    s1: { label: "S1", description: "Standardized total serum cholesterol (-2 to +2 range)" },
    s2: { label: "S2", description: "Standardized LDL cholesterol (-2 to +2 range)" },
    s3: { label: "S3", description: "Standardized HDL cholesterol (-2 to +2 range)" },
    s4: { label: "S4", description: "Standardized total cholesterol/HDL (-2 to +2 range)" },
    s5: { label: "S5", description: "Standardized log serum triglycerides (-2 to +2 range)" },
    s6: { label: "S6", description: "Standardized blood glucose (-2 to +2 range)" }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError(null);
  };

  const validateForm = () => {
    const requiredFields = Object.keys(formData);
    const emptyFields = requiredFields.filter(field => !formData[field].trim());
    
    if (emptyFields.length > 0) {
      setError(`Please fill in all fields. Missing: ${emptyFields.join(', ')}`);
      return false;
    }

    for (const [key, value] of Object.entries(formData)) {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        setError(`${fieldInfo[key].label} must be a valid number`);
        return false;
      }
      if (numValue < -4 || numValue > 4) {
        setError(`${fieldInfo[key].label} should be between -4 and +4 (standardized values)`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    
    try {
      const numericData = Object.keys(formData).reduce((acc, key) => {
        acc[key] = parseFloat(formData[key]);
        return acc;
      }, {});

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(numericData),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setResult(data.prediction);
    } catch (err) {
      console.error("Prediction error:", err);
      setError("Failed to get prediction. Please check if the server is running.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
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
    setResult(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-start justify-center p-4 overflow-auto pt-20">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Diabetes Progression Prediction</h2>
          <p className="text-gray-600">Enter standardized health parameters (scikit-learn diabetes dataset format)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {Object.keys(formData).map((key) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{fieldInfo[key].label}</Label>
              <Input
                id={key}
                name={key}
                placeholder={fieldInfo[key].description}
                value={formData[key]}
                onChange={handleChange}
                type="number"
                step="any"
                autoComplete="off"
              />
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button 
            onClick={handleSubmit} 
            disabled={loading} 
            className="flex-1 !bg-blue-600 !text-white hover:!bg-blue-700 disabled:!bg-gray-400 disabled:!cursor-not-allowed transition-colors font-medium"
          >
            {loading ? "Predicting..." : "Predict Diabetes Progression"}
          </Button>
          
          <Button 
            onClick={handleReset}
            variant="destructive"
            className="flex-1 !bg-red-600 !text-white hover:!bg-red-700"
          >
            Reset Form
          </Button>
        </div>

        {result !== null && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Prediction Result</h3>
              <p className="text-2xl font-bold text-green-900">
                Progression Score: {typeof result === 'number' ? result.toFixed(2) : result}
              </p>
              <p className="text-sm text-green-700 mt-1">
                Quantitative measure of diabetes progression (higher = more progression)
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800 mb-2">
            <strong>About the scikit-learn diabetes dataset:</strong>
          </p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Target is a quantitative measure of diabetes progression one year after baseline</li>
            <li>• Example values: age=0.05, sex=-0.04, bmi=0.06, bp=0.02, s1=-0.04, s2=-0.03, s3=-0.04, s4=-0.00, s5=0.02, s6=-0.03</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This model predicts diabetes progression using standardized research data. 
            For real medical assessment, raw health parameters would need to be standardized first.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PredictForm;

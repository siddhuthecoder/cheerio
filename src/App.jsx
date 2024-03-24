import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Background from './components/background';

const RegistrationForm = () => {
  const [error, setError] = useState("");
  const [loading,setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    rguktMail: '',
    photo: '',
  });
  const [file, setFile] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB");
        return;
      }
      convertBase64(file).then((base64) => {
        setFormData({ ...formData, photo: base64 });
        setFile(base64);
        setError("");
      });
    }
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    if (formData.idNumber[0] !== "N" && formData.idNumber[0] !== "n") {
      setError("Invalid ID");
    } else {
      setError("");
    }
  }, [formData.idNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (formData.idNumber[0] !== "N" && formData.idNumber[0] !== "n") {
      setError("Invalid ID");
      return;
    }
    if(error){
      return
    }
    try {
      const response = await axios.post('http://localhost:4000/register', formData);
      toast.success(response.data.message);
      setFormData({ name: '', idNumber: '', rguktMail: '', photo: '' });
      setFile('');
      setError("")
      setLoading(false)
    } catch (error) {
      toast.error(response.data.message);
      setLoading(false)
    }
  };
  

  return (
    <>
      <Background />
      <div className="w-100  d-flex justify-content-center align-items-center" style={{
        minHeight: "100vh",
        zIndex: "2",
        position: "absolute",
        top: "0",
        left: "0"
      }}>

        {
          loading?(
              <div className="text-center text-white h1">Submitting....</div>
          ):(
            <form onSubmit={handleSubmit} className="d-flex text-white  flex-column  shadow shadow" style={{
              width: "93%",
              maxWidth: "300px",
              height: "auto",
              borderRadius: "5px",
              backgroundColor: "black"
            }}>
              <div className="text-center h5 text-success py-1 ">Register for CHEERIO</div>
              <div className=" mx-auto mt-1" style={{ width: "95%" }}>
                <label htmlFor="" className="form-label mx-auto " >Name</label>
                <input style={{height:"30px"}} className="form-control mx-auto " type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" required />
              </div>
              <div className="mx-auto" style={{ width: "95%" }}>
                <label htmlFor="" className="form-label mx-auto " >ID Number</label>
                <input style={{height:"30px"}} className="form-control mx-auto " type="text" name="idNumber" value={formData.idNumber} onChange={handleInputChange} placeholder="ID Number" required />
              </div>
              <div className="mx-auto" style={{ width: "95%" }}>
                <label htmlFor="" className="form-label mx-auto " >Email(rgukt)</label>
                <input style={{height:"30px"}} className="form-control mx-auto " type="text" name="rguktMail" value={formData.rguktMail} onChange={handleInputChange} placeholder="Email" required />
              </div>
              <label htmlFor="" className="form-label"></label>
              <input className=" mx-auto my-3" style={{ width: "95%" }} type="file" onChange={handleFileChange} />
              {file && <img src={file} alt="Preview" className="mx-auto" style={{ width: '100px', height: '100px' }} />}
              <button type="submit" className="btn btn-primary mx-auto my-3" style={{ width: "95%" }}>Register</button>
              <div className="text-center text-danger">{error}</div>
            </form>
          )
        }
      </div>
    </>
  );
};

export default RegistrationForm;

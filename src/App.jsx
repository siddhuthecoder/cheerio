import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegistrationForm = () => {
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
    convertBase64(file).then((base64) => {
      setFormData({ ...formData, photo: base64 });
      setFile(base64);
    });
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/register', formData);
      toast.success(response.data.message);
      setFormData({ name: '', idNumber: '', rguktMail: '', photo: '' });
      setFile('');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" required />
      <input type="text" name="idNumber" value={formData.idNumber} onChange={handleInputChange} placeholder="ID Number" required />
      <input type="email" name="rguktMail" value={formData.rguktMail} onChange={handleInputChange} placeholder="RGUKT Mail" required />
      <input type="file" onChange={handleFileChange} />
      {file && <img src={file} alt="Preview" style={{width: '100px', height: '100px'}} />}
      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Background from "./components/background";

const RegistrationForm = () => {
  const [error, setError] = useState("");
  const id = window.location.pathname.slice(1);
  const [loading, setLoading] = useState(false);
  const [userStatus, setUserStatus] = useState("idle");
  const [userData, setUserData] = useState(null);
  const [userError, setUserError] = useState(null);
  const [file, setFile] = useState("");

  useEffect(() => {
    if (id && userStatus === "idle") {
      setUserStatus("loaded");
      const fetchUser = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_APP_BACKEND_URL}/getId/${id}`
          );
          setUserData(res.data.user);
        } catch (error) {
          setUserError(
            error?.response?.data.message || "Internal Server Error"
          );
        }
      };

      fetchUser();
    }
  }, [id, userStatus]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB");
        return;
      }
      const acceptedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!acceptedImageTypes.includes(file.type)) {
        setError("Only image files (JPEG, PNG, JPG) are allowed.");
        return;
      }
      convertBase64(file).then((base64) => {
        setFile(base64);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/register/${id}`,
        {
          photo: file,
        }
      );
      toast.success(response.data.message);
      setUserData({ ...userData, isReg: true });
      setFile("");
      setError("");
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  if (userError) {
    return (
      <main
        className="w-100 d-flex align-items-center flex-column bg-dark justify-content-center"
        style={{ height: "100vh" }}
      >
        <h4 className="text-white">{userError}</h4>
        <button className="btn btn-primary mt-2">Try Again</button>
      </main>
    );
  }

  if (!userData) {
    return (
      <>
        <main
          className="w-100 d-flex align-items-center bg-dark justify-content-center"
          style={{ height: "100vh" }}
        >
          <h4 className="text-white">Checking Link.......</h4>
        </main>
      </>
    );
  }

  return (
    <>
      <Background />
      <div
        className="w-100  d-flex justify-content-center text-white align-items-center flex-column"
        style={{
          minHeight: "100vh",
          zIndex: "2",
          position: "absolute",
          top: "0",
          left: "0",
        }}
      >
        {loading ? (
          <div className="text-center text-white h5">Submitting....</div>
        ) : (
          <>
            {userData && userData.isReg ? (
              <>
                <img
                  src={userData.photo}
                  alt={userData.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                  }}
                />
                <h4 className="my-2">{userData.name}</h4>
                <h6>{userData.idNumber}</h6>
                <h5>{userData.email}</h5>
              </>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="d-flex text-white  flex-column  shadow shadow"
                style={{
                  width: "93%",
                  maxWidth: "300px",
                  height: "auto",
                  borderRadius: "5px",
                  backgroundColor: "black",
                }}
              >
                <div className="text-center h5 text-success py-1 ">
                  Register for CHEERIO
                </div>
                <div className=" mx-auto mt-1" style={{ width: "95%" }}>
                  <label htmlFor="" className="form-label mx-auto ">
                    Name
                  </label>
                  <input
                    style={{ height: "30px" }}
                    className="form-control mx-auto "
                    type="text"
                    name="name"
                    value={userData.name}
                    readOnly
                    placeholder="Name"
                  />
                </div>
                <div className="mx-auto" style={{ width: "95%" }}>
                  <label htmlFor="" className="form-label mx-auto ">
                    ID Number
                  </label>
                  <input
                    style={{ height: "30px" }}
                    className="form-control mx-auto "
                    type="text"
                    name="idNumber"
                    readOnly
                    value={userData.idNumber}
                    placeholder="ID Number"
                  />
                </div>
                <div className="mx-auto" style={{ width: "95%" }}>
                  <label htmlFor="" className="form-label mx-auto ">
                    Email(rgukt)
                  </label>
                  <input
                    style={{ height: "30px" }}
                    className="form-control mx-auto "
                    type="text"
                    name="rguktMail"
                    readOnly
                    value={userData.email}
                    placeholder="Email"
                  />
                </div>
                <div className="mx-auto" style={{ width: "95%" }}>
                  <label htmlFor="" className="form-label">
                    Upload Image
                  </label>
                  <input
                    className=" mx-auto mb-2"
                    style={{ width: "95%" }}
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>
                {file && (
                  <img
                    src={file}
                    alt="Preview"
                    className="mx-auto"
                    style={{ width: "100px", height: "100px" }}
                  />
                )}
                <button
                  type="submit"
                  className="btn btn-primary mx-auto mb-3"
                  style={{ width: "95%" }}
                >
                  Register
                </button>
                <div className="text-center text-danger">{error}</div>
              </form>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default RegistrationForm;

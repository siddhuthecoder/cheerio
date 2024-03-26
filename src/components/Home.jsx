import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import FileBase64 from "react-file-base64";

const Home = () => {
  const [error, setError] = useState("");
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [userStatus, setUserStatus] = useState("idle");
  const [userData, setUserData] = useState(null);
  const [userError, setUserError] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (id && userStatus === "idle") {
      setUserStatus("loaded");
      const fetchUser = async () => {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/getId/${id}`
          );
          setUserData(res.data.user);
        } catch (error) {
          console.log(error);
          setUserError(
            error?.response?.data.message || "Internal Server Error"
          );
        }
      };

      fetchUser();
    }
  }, [id, userStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!file.base64) {
      toast.error("Please Upload a image to proceed");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/register/${id}`,
        {
          photo: file.base64,
        }
      );
      toast.success(response.data.message);
      setUserData({ ...userData, isReg: true });
      setFile(null);
      setError("");
      setLoading(false);
    } catch (error) {
      toast.error(
        error?.response?.data.message || "Check your internet Connection"
      );
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
        <button
          className="btn btn-primary mt-2"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
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
          <h4 className="text-white">Checking.......</h4>
        </main>
      </>
    );
  }

  return (
    <>
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
                  <FileBase64
                    multiple={false}
                    onDone={({ base64, file }) => {
                      if (!file.type.startsWith("image/")) {
                        toast.error("Please upload only image files.");
                        return;
                      }
                      setFile({ base64 });
                    }}
                  />
                </div>
                {file && (
                  <img
                    src={file.base64}
                    alt="Preview"
                    className="mx-auto my-2"
                    style={{ width: "100px", height: "100px" }}
                  />
                )}
                <button
                  type="submit"
                  className="btn btn-primary mx-auto my-3"
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

export default Home;

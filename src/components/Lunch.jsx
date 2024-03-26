import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Lunch = () => {
  const { id } = useParams();
  const [userStatus, setUserStatus] = useState("idle");
  const [userData, setUserData] = useState(null);
  const [userError, setUserError] = useState(null);

  const adminState = localStorage.getItem("admin");
  const [admin, setAdmin] = useState(adminState || false);

  useEffect(() => {
    if (admin && id && userStatus === "idle") {
      setUserStatus("loaded");
      const fetchUser = async () => {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/getId/${id}`
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

  useEffect(() => {
    if (userData && !userData.isCompleted) {
      const postLunch = async () => {
        try {
          await axios.post(`${process.env.REACT_APP_BACKEND_URL}/lunch/${id}`);
          toast.success("Lunch Status Updated");
        } catch (error) {
          toast.error(error?.response?.data.message || "Internal Server Error");
        }
      };

      postLunch();
    }
  }, [userData, id]);

  if (!admin) {
    return (
      <main
        className="w-100 d-flex align-items-center flex-column bg-dark justify-content-center"
        style={{ height: "100vh" }}
      >
        <form className="" style={{ width: "95%", maxWidth: "320px" }}>
          <label htmlFor="admin" className="text-white mb-1">
            Admin Password
          </label>
          <input className="form-control" id="admin" />
        </form>
      </main>
    );
  }

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
          <h4 className="text-white">Checking....</h4>
        </main>
      </>
    );
  }

  return (
    <>
      {userData && userData.isCompleted ? (
        <main
          className="w-100 d-flex justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <h5>User Already Completed Lunch</h5>
        </main>
      ) : (
        <main
          className="w-100 d-flex justify-content-center align-items-center flex-column gap-2"
          style={{ minHeight: "100vh" }}
        >
          <h5>User not completed lunch</h5>
          <h6>marking lunch completion</h6>
        </main>
      )}
    </>
  );
};

export default Lunch;

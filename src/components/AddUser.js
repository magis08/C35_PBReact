import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AddUser({ add, isOffline, pendingData }) {
  const navigate = useNavigate();
  const [name, setName] = useState(pendingData?.name || "");
  const [phone, setPhone] = useState(pendingData?.phone || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (pendingData) {
      setName(pendingData.name);
      setPhone(pendingData.phone);
    }
  }, [pendingData]);

  const close = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const submit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    add(name, phone, () => {
      if (!isOffline) {
        navigate("/");
      }
    })
    .catch((err) => {
      setIsSubmitting(false);
    });
  };  

  const resend = (e) => {
    e.preventDefault();
    if (pendingData) {
      setIsSubmitting(true);
      add(pendingData.name, pendingData.phone, () => {
        navigate("/");
      }).catch(err => {
        setError("Failed to resend user data. Please try again.");
        setIsSubmitting(false);
      });
    }
  };

  return (
    <form className="add" onSubmit={submit}>
      <input
        type="text"
        placeholder="User Name"
        name="add"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Phone Number"
        name="add"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      {error && <p className="error">{error}</p>} {/* Display error if any */}
      <div className="addButton">
        {isOffline || pendingData ? (
          <button className="btn2" onClick={resend} disabled={isSubmitting}>
            Resend
          </button>
        ) : (
          <button className="btn2" type="submit" disabled={isSubmitting}>
            Save
          </button>
        )}
        <button className="btn2" onClick={close}>
          Cancel
        </button>
      </div>
    </form>
  );
}

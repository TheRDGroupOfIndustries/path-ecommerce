import { useEffect, useState } from "react";
import { fetchDataFromApi } from "../../utils/api";

const KycStatusPage = () => {
  const [kyc, setKyc] = useState(null);

  useEffect(() => {
    const fetchKyc = async () => {
      const result = await fetchDataFromApi("/kyc/my-kyc");
      setKyc(result);
    };
    fetchKyc();
  }, []);

  if (!kyc) {
    return (
      <div style={styles.wrapperr}>
        <div style={styles.card}>
          <h2 style={styles.loading}>Loading KYC status...</h2>
        </div>
      </div>
    );
  }

 if (kyc.status === "REJECTED") {
  return (
    <div style={styles.wrapperr}>
      <div style={styles.card}>
        <h2 style={styles.rejected}>❌ Your KYC was rejected. Please contact support.</h2>
        <button style={styles.loginButton} onClick={() => window.location.href = "/login"}>
          🔐 Go to Login
        </button>
      </div>
    </div>
  );
}


  return (
    <div style={styles.wrapperr}>
      <div style={styles.card}>
        <h2 style={styles.status}>
          ✅ Your KYC is <strong>{kyc.status}</strong>. Please wait for admin approval.
        </h2>
          <button style={styles.loginButton} onClick={() => window.location.href = "/login"}>
          🔐 Go to Login
        </button>
      </div>
    </div>
  );
};

const styles = {
  wrapperr: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f9f9f9",
    padding: "1rem",
    width:"100%",
  },
  card: {
    maxWidth: "600px",
    width: "100%",
    textAlign: "center",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  loading: {
    fontSize: "1.4rem",
    color: "#555",
  },
  rejected: {
    fontSize: "1.5rem",
    color: "#d32f2f",
    fontWeight: "bold",
    backgroundColor: "#ffe6e6",
    padding: "1rem",
    borderRadius: "10px",
  },
  status: {
    fontSize: "1.5rem",
    color: "#2e7d32",
    fontWeight: "bold",
    backgroundColor: "yellow",
    padding: "1rem",
    borderRadius: "10px",
  },
  loginButton: {
  marginTop: "1rem",
  padding: "0.6rem 1.2rem",
  fontSize: "1rem",
  fontWeight: "bold",
  backgroundColor: "#1976d2",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background-color 0.3s",
},
};

export default KycStatusPage;

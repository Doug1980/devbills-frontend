import { useEffect } from "react";
import { api } from "../services/api";

const Dashboard = () => {
  useEffect(() => {
    async function getTransaction() {
      const response = await api.get("/transactions");

      console.log(response);
    }

    getTransaction();
  }, []);

  return (
    <div>
      <h1>Olá eu sou o Dashboard!</h1>
    </div>
  );
};

export default Dashboard;

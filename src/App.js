// App.js

import React, { useState, useEffect } from "react";
import KanbanBoard from "./Components/KanbanBoard.js";

const App = () => {
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://tfyincvdrafxe7ut2ziwuhe5cm0xvsdu.lambda-url.ap-south-1.on.aws/ticketAndUsers"
        );
        const data = await response.json();
        setApiData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {apiData && (
        <KanbanBoard tickets={apiData.tickets} users={apiData.users} />
      )}
    </div>
  );
};

export default App;

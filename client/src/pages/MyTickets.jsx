import React, { useEffect, useState } from "react";
import { getMyTickets } from "../api/ticketApi";
import MyTicketsList from "../components/ticket/MyTicketsList";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyTickets().then((data) => {
      setTickets(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
        My Passes
      </h1>
      <p className="text-gray-500 mb-10">
        All your booked events and digital tickets in one place.
      </p>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : (
        <MyTicketsList tickets={tickets} />
      )}
    </div>
  );
};

export default MyTickets;

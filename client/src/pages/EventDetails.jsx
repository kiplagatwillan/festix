import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEventById } from "../api/eventApi";
import StripeCheckout from "../components/ticket/StripeCheckout";
import { Calendar, MapPin, Users, Share2, ShieldCheck } from "lucide-react";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetchEventById(id).then(setEvent);
  }, [id]);

  if (!event)
    return (
      <div className="p-20 text-center dark:text-white">
        Loading stellar event...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Image & Description */}
        <div className="lg:col-span-2 space-y-8">
          <img
            src={event.imageUrl}
            className="w-full h-[450px] object-cover rounded-[2rem] shadow-2xl"
            alt={event.title}
          />
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
              {event.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {event.description}
            </p>
          </div>
        </div>

        {/* Right: Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <span className="text-3xl font-black text-indigo-600">
                ${event.price}
              </span>
              <button className="p-2 bg-gray-50 dark:bg-gray-700 rounded-full">
                <Share2 className="w-5 h-5 dark:text-white" />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <span>
                  {new Date(event.date).toLocaleDateString(undefined, {
                    dateStyle: "full",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <MapPin className="w-5 h-5 text-indigo-500" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Users className="w-5 h-5 text-indigo-500" />
                <span>{event.availableTickets} tickets remaining</span>
              </div>
            </div>

            <StripeCheckout eventId={event.id} price={event.price} />

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 font-bold uppercase">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Secure Checkout & Instant Delivery
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

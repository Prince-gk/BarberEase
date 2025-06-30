import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Scissors, Phone, Mail } from 'lucide-react';
import { ReviewForm } from '../components/ReviewForm';

export const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.id) {
      console.error("No user found in localStorage");
      return;
    }

    const clientId = storedUser.id;

    fetch(`/api/appointments?clientId=${clientId}`)
      .then(res => res.json())
      .then(data => {
        setAppointments(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      });
  }, []);

  const handleReviewSubmit = async (data) => {
    if (!selectedAppointment) return;

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          appointmentId: selectedAppointment,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit review');

      setShowReviewForm(false);
      setSelectedAppointment(null);
      // success alert can be added here
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">My Appointments</h1>

      <div className="space-y-6">
        {appointments.map((appointment) => {
          const dateTime = new Date(appointment.date_time);
          return (
            <div
              key={appointment.id}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6 transition-all duration-300 hover:shadow-lg"
            >
              <img
                src="https://i.ytimg.com/vi/8locgr34Pls/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBPGjlvyXDFW8c2B7hkE3pBpeVTow"
                alt={appointment.barber.name}
                className="w-32 h-32 rounded-lg object-cover"
              />

              <div className="flex-1 space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">{appointment.barber.name}</h3>
                <p className="text-sm text-gray-600">Specialty: {appointment.barber.specialty}</p>

                <div className="text-sm text-gray-700 flex gap-4 items-center">
                  <Phone className="w-4 h-4" />
                  {appointment.barber.phone}
                </div>
                <div className="text-sm text-gray-700 flex gap-4 items-center">
                  <Mail className="w-4 h-4" />
                  {appointment.barber.email}
                </div>

                <div className="mt-3 text-sm text-gray-800">
                  <Scissors className="inline w-5 h-5 text-blue-500 mr-2" />
                  <span className="font-medium">{appointment.service.name}</span> – ${appointment.service.price}
                </div>

                <div className="flex items-center text-gray-700 mt-2">
                  <Calendar className="h-5 w-5 mr-2" />
                  {format(dateTime, 'PPP')}
                  <Clock className="h-5 w-5 ml-4 mr-2" />
                  {format(dateTime, 'p')}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${appointment.status === 'Scheduled'
                    ? 'bg-yellow-100 text-yellow-800'
                    : appointment.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                    }`}>
                    {appointment.status}
                  </span>

                  {appointment.status === 'Completed' && (
                    <button
                      onClick={() => {
                        setSelectedAppointment(appointment.id);
                        setShowReviewForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Leave a Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {appointments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No appointments found</p>
          </div>
        )}
      </div>

      {showReviewForm && selectedAppointment && (
        <ReviewForm
          barberId={appointments.find(a => a.id === selectedAppointment)?.barber.id || ''}
          onSubmit={handleReviewSubmit}
          onClose={() => {
            setShowReviewForm(false);
            setSelectedAppointment(null);
          }}
        />
      )}
    </div>
  );
};

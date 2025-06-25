import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Scissors } from 'lucide-react';
import { ReviewForm } from '../components/ReviewForm';

export const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetch('/api/appointments')
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
      const response = await fetch('/http://127.0.0.1:5555/reviews', {
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
      // You might want to show a success message here
    } catch (error) {
      console.error('Error submitting review:', error);
      // Handle error (show error message)
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
        {appointments.map(appointment => (
          <div
            key={appointment.id}
            className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <Scissors className="h-10 w-10 text-blue-600" />
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {appointment.barber.name}
                  </h3>
                  <p className="text-gray-600">{appointment.service.name}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  {format(new Date(appointment.date), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center text-gray-600 mt-1">
                  <Clock className="h-5 w-5 mr-2" />
                  {appointment.time}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                appointment.status === 'confirmed'
                  ? 'bg-green-100 text-green-800'
                  : appointment.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : appointment.status === 'completed'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </span>

              {appointment.status === 'completed' && (
                <button
                  onClick={() => {
                    setSelectedAppointment(appointment.id);
                    setShowReviewForm(true);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Leave a Review
                </button>
              )}
            </div>
          </div>
        ))}

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
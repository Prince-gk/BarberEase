import React, { useState, useEffect } from 'react';
import { BarberCard } from '../components/BarberCard';
import { AppointmentForm } from '../components/AppointmentForm';

export const Home = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBarberId, setSelectedBarberId] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  useEffect(() => {
    fetch('/api/barbers')
      .then(res => res.json())
      .then(data => {
        setBarbers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching barbers:', error);
        setLoading(false);
      });
  }, []);

  const handleBookAppointment = (barberId) => {
    setSelectedBarberId(barberId);
    setShowAppointmentForm(true);
  };

  const handleAppointmentSubmit = async (data) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to book appointment');

      setShowAppointmentForm(false);
    } catch (error) {
      console.error('Error booking appointment:', error);
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
      {/* Hero Section with Background Image */}
      <div className="relative h-[300px] mb-10">
        <img
          src="/src/images/Untitled design.png"
          alt="Barbershop"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-5xl font-bold text-gray-900 z-10">Expert Barbers</h1>
          <p className="mt-2 text-xl text-gray-700 z-10">Book your next haircut with our professional team</p>
        </div>
      </div>

      {/* Barber List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {barbers.map(barber => (
          <BarberCard
            key={barber.id}
            barber={barber}
            onBookAppointment={handleBookAppointment}
          />
        ))}
      </div>

      {/* Appointment Form */}
      {showAppointmentForm && selectedBarberId && (
        <AppointmentForm
          barberId={selectedBarberId}
          onSubmit={handleAppointmentSubmit}
          onClose={() => setShowAppointmentForm(false)}
        />
      )}
    </div>
  );
};

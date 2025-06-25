import React from 'react';
import { Star, Calendar } from 'lucide-react';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';

export const BarberCard = ({ barber, onBookAppointment }) => {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <img
        src={barber.imageUrl}
        alt={barber.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{barber.name}</h3>
            <p className="text-gray-600">{barber.specialty}</p>
          </div>
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="ml-1 text-gray-700">{barber.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-gray-600">
            <span className="font-medium">Email:</span> {barber.email}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Phone:</span> {barber.phone}
          </p>
        </div>

        {user && (
          <button
            onClick={() => onBookAppointment(barber.id)}
            className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book Appointment
          </button>
        )}
      </div>
    </div>
  );
};

BarberCard.propTypes = {
  barber: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    specialty: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
  }).isRequired,
  onBookAppointment: PropTypes.func.isRequired,
};
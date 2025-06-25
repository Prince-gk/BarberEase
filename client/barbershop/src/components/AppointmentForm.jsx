import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

export const AppointmentForm = ({ barberId, onSubmit, onClose }) => {
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedBarber, setSelectedBarber] = useState(barberId || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    // Fetch services
    fetch('/http://127.0.0.1:5555/services')
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(error => console.error('Error fetching services:', error));

    // Fetch barbers if barberId is not provided
    if (!barberId) {
      fetch('/api/barbers')
        .then(res => res.json())
        .then(data => setBarbers(data))
        .catch(error => console.error('Error fetching barbers:', error));
    }
  }, [barberId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      barberId: selectedBarber,
      serviceId: selectedService,
      date: selectedDate,
      time: selectedTime,
    });
  };

  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Book Appointment</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!barberId && (
            <div>
              <label className="block text-gray-700 mb-2">Select Barber</label>
              <select
                value={selectedBarber}
                onChange={(e) => setSelectedBarber(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Choose a barber</option>
                {barbers.map(barber => (
                  <option key={barber.id} value={barber.id}>
                    {barber.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-2">Select Service</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Choose a service</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} - ${service.price}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              min={today}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Select Time</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Choose a time</option>
              {Array.from({ length: 8 }, (_, i) => i + 9).map(hour => (
                <React.Fragment key={hour}>
                  <option value={`${hour}:00`}>{`${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`}</option>
                  <option value={`${hour}:30`}>{`${hour}:30 ${hour < 12 ? 'AM' : 'PM'}`}</option>
                </React.Fragment>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AppointmentForm.propTypes = {
  barberId: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
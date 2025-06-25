from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

from config import db


class Client(db.Model, SerializerMixin):
    __tablename__ = 'clients'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)

    appointments = db.relationship('Appointment', backref='client', lazy=True)
    reviews = db.relationship('Review', backref='client', lazy=True)

    serialize_rules = ('-appointments.client', '-reviews.client')

class Barber(db.Model, SerializerMixin):
    __tablename__ = 'barbers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    specialty = db.Column(db.String(100))
    phone = db.Column(db.String(20), unique=True, nullable=False)

    appointments = db.relationship('Appointment', backref='barber', lazy=True)
    reviews = db.relationship('Review', backref='barber', lazy=True)

    serialize_rules = ('-appointments.barber', '-reviews.barber')

class Service(db.Model, SerializerMixin):
    __tablename__ = 'services'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)

    appointments = db.relationship('Appointment', backref='service', lazy=True)

    serialize_rules = ('-appointments.service',)

class Appointment(db.Model, SerializerMixin):
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    barber_id = db.Column(db.Integer, db.ForeignKey('barbers.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    date_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default="Scheduled")

    serialize_rules = (
        '-client.appointments',
        '-barber.appointments',
        '-service.appointments',
        '-client.reviews',  
        '-barber.reviews', 
    )

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    barber_id = db.Column(db.Integer, db.ForeignKey('barbers.id'), nullable=False)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=False)

    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)
    date = db.Column(db.DateTime, default=datetime.utcnow)

    serialize_rules = ('-client.reviews', '-barber.reviews', '-appointment.reviews')
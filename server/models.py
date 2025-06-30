from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
from werkzeug.security import check_password_hash, generate_password_hash
from config import db


class Client(db.Model, SerializerMixin):
    __tablename__ = "clients"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    appointments = db.relationship("Appointment", backref="client", lazy=True)
    reviews = db.relationship("Review", backref="client", lazy=True)
    
    @staticmethod
    def hash_password(password):
        return generate_password_hash(password)

    @staticmethod
    def check_password(password, hashed_password):
        return check_password_hash(hashed_password, password)
    
    def to_dict(self):
        # remove password from the serialized data
        if "password" in self.__dict__:
            del self.__dict__["password"]
        data = SerializerMixin.to_dict(self)
        data["appointments"] = [appointment.to_dict() for appointment in self.appointments]
        data["reviews"] = [review.to_dict() for review in self.reviews]
        return data

    serialize_rules = ("-appointments.client", "-reviews.client")


class Barber(db.Model, SerializerMixin):
    __tablename__ = "barbers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    specialty = db.Column(db.String(100))
    phone = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(20), unique=True, nullable=False)
    image = db.Column(db.String, nullable=True)
    appointments = db.relationship("Appointment", backref="barber", lazy=True)
    reviews = db.relationship("Review", backref="barber", lazy=True)

    serialize_rules = ("-appointments.barber", "-reviews.barber")


class Service(db.Model, SerializerMixin):
    __tablename__ = "services"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)

    appointments = db.relationship("Appointment", backref="service", lazy=True)

    serialize_rules = ("-appointments.service",)


class Appointment(db.Model, SerializerMixin):
    __tablename__ = "appointments"

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey("clients.id"), nullable=False)
    barber_id = db.Column(db.Integer, db.ForeignKey("barbers.id"), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey("services.id"), nullable=False)
    date_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default="Scheduled")

    serialize_rules = (
        "-client.appointments",
        "-barber.appointments",
        "-service.appointments",
        "-client.reviews",
        "-barber.reviews",
    )


class Review(db.Model, SerializerMixin):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey("clients.id"), nullable=False)
    barber_id = db.Column(db.Integer, db.ForeignKey("barbers.id"), nullable=False)
    appointment_id = db.Column(
        db.Integer, db.ForeignKey("appointments.id"), nullable=False
    )

    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)
    date = db.Column(db.DateTime, default=datetime.utcnow)

    serialize_rules = ("-client.reviews", "-barber.reviews", "-appointment.reviews")

from flask import request
from flask_restful import Resource
from datetime import datetime

from config import db
from models import Client, Barber, Service, Appointment, Review


# -------- Clients --------
class ClientList(Resource):
    def get(self):
        return [client.to_dict() for client in Client.query.all()], 200

    def post(self):
        data = request.get_json()
        if Client.query.filter_by(email=data["email"]).first():
            return {"error": "Email already exists."}, 400
        if Client.query.filter_by(phone=data["phone"]).first():
            return {"error": "Phone number already exists."}, 400
        if not isinstance(data["phone"], str) or len(data["phone"]) < 10:
            return {"error": "Invalid phone number."}, 400
        if not data:
            return {"error": "Invalid input"}, 400

        try:
            client = Client(
                name=data["name"],
                email=data["email"],
                phone=data["phone"]
            )
            db.session.add(client)
            db.session.commit()
            return client.to_dict(), 201
        except Exception as e:
            return {"error": str(e)}, 400


# -------- Barbers --------
class BarberList(Resource):
    def get(self):
        return [barber.to_dict() for barber in Barber.query.all()], 200

    def post(self):
        data = request.get_json()
        if not data:
            return {"error": "Invalid input"}, 400

        try:
            barber = Barber(
                name=data["name"],
                specialty=data.get("specialty", ""),
                phone=data["phone"]
            )
            db.session.add(barber)
            db.session.commit()
            return barber.to_dict(), 201
        except Exception as e:
            return {"error": str(e)}, 400


# -------- Services --------
class ServiceList(Resource):
    def get(self):
        return [service.to_dict() for service in Service.query.all()], 200

    def post(self):
        data = request.get_json()
        if Service.query.filter_by(name=data["name"]).first():
            return {"error": "Service already exists."}, 400
        if not isinstance(data["price"], (int, float)) or data["price"] <= 0:
            return {"error": "Invalid price."}, 400
        if not isinstance(data["name"], str) or len(data["name"]) < 3:
            return {"error": "Invalid service name."}, 400
        if not data:
            return {"error": "Invalid input"}, 400

        try:
            service = Service(
                name=data["name"],
                price=data["price"],
                description=data.get("description", "")
            )
            db.session.add(service)
            db.session.commit()
            return service.to_dict(), 201
        except Exception as e:
            return {"error": str(e)}, 400


# -------- Reviews --------
class ReviewList(Resource):
    def get(self):
        try:
            reviews = Review.query.all()
            return [review.to_dict() for review in reviews], 200
        except Exception as e:
            return {"error": f"Failed to fetch reviews: {str(e)}"}, 500

    def post(self):
        data = request.get_json()

        if not data:
            return {"error": "No input provided"}, 400

        required_fields = ["client_id", "barber_id", "appointment_id", "rating"]

        for field in required_fields:
            if field not in data:
                return {"error": f"Missing required field: {field}"}, 400

        try:
            # Create new review
            new_review = Review(
                client_id=data["client_id"],
                barber_id=data["barber_id"],
                appointment_id=data["appointment_id"],
                rating=data["rating"],
                comment=data.get("comment", "")
            )

            # Add and commit
            db.session.add(new_review)
            db.session.commit()

            # After commit, make sure to return the review data
            return new_review.to_dict(), 201

        except Exception as e:
            db.session.rollback()  # Rollback in case of error
            return {"error": f"Failed to create review: {str(e)}"}, 400

# -------- Appointments (Full CRUD) --------
class AppointmentList(Resource):
    def get(self):
        return [appt.to_dict() for appt in Appointment.query.all()], 200

    def post(self):
        data = request.get_json()
        if not data:
            return {"error": "Invalid input"}, 400

        try:
            # Convert string to datetime object
            date_time = datetime.strptime(data["date_time"], "%Y-%m-%dT%H:%M")

            appt = Appointment(
                client_id=data["client_id"],
                barber_id=data["barber_id"],
                service_id=data["service_id"],
                date_time=date_time,
                status=data.get("status", "Scheduled")
            )
            db.session.add(appt)
            db.session.commit()
            return appt.to_dict(), 201
        except Exception as e:
            return {"error": str(e)}, 400


class AppointmentDetail(Resource):
    def get(self, id):
        appt = Appointment.query.get(id)
        if not appt:
            return {"error": "Appointment not found"}, 404
        return appt.to_dict(), 200

    def patch(self, id):
        appt = Appointment.query.get(id)                                                                                                                                                                                                                
        if not appt:
            return {"error": "Appointment not found"}, 404

        data = request.get_json()
        if not data:
            return {"error": "Invalid input"}, 400

        try:
            for attr in ["client_id", "barber_id", "service_id", "status"]:
                if attr in data:
                    setattr(appt, attr, data[attr])
            if "date_time" in data:
                appt.date_time = datetime.strptime(data["date_time"], "%Y-%m-%dT%H:%M")

            db.session.commit()
            return appt.to_dict(), 200
        except Exception as e:
            return {"error": str(e)}, 400

    def delete(self, id):
        appt = Appointment.query.get(id)
        if not appt:
            return {"error": "Appointment not found"}, 404
        db.session.delete(appt)
        db.session.commit()
        return {"message": "Appointment deleted"}, 204

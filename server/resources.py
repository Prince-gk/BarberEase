from flask import request
from flask_restful import Resource
from datetime import datetime

from config import db
from models import Client, Barber, Service, Appointment, Review


class TestAPI(Resource):
    def get(self):
        return {"message": "okay"}


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
            password = data.get("password", "")
            if not password or len(password) < 6:
                return {"error": "Password must be at least 6 characters long."}, 400
            # Hash the password before storing
            data["password"] = Client.hash_password(password)
            client = Client(name=data["name"], email=data["email"], phone=data["phone"], password=data["password"])
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
                phone=data["phone"],
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
                description=data.get("description", ""),
            )
            db.session.add(service)
            db.session.commit()
            return service.to_dict(), 201
        except Exception as e:
            return {"error": str(e)}, 400


class Login(Resource):
    def post(self):
        data = request.get_json()
        if not data or not data.get("email") or not data.get("password"):
            return {"error": "Invalid input"}, 400

        client = Client.query.filter_by(email=data["email"]).first()
        if not client or not Client.check_password(data["password"], client.password):
            return {"error": "Invalid email or password"}, 401

        return client.to_dict(), 200


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
                comment=data.get("comment", ""),
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
        # Fetch appointments for a specific client (via query param)
        client_id = request.args.get("clientId")
        if not client_id:
            return {"error": "clientId query parameter is required"}, 400

        appointments = Appointment.query.filter_by(client_id=client_id).all()
        return [appt.to_dict() for appt in appointments], 200

    def post(self):
        data = request.get_json()

        if not data:
            return {"error": "Invalid input: no JSON received"}, 400

        required_fields = ["clientId", "barberId", "serviceId", "date", "time"]
        missing = [field for field in required_fields if field not in data]
        if missing:
            return {"error": f"Missing fields: {', '.join(missing)}"}, 400

        try:
            # Combine and parse date and time into a datetime object
            date_str = data["date"].strip()
            time_str = data["time"].strip()

            # Accepts both "09:00" and "9:00"
            date_time = datetime.strptime(f"{date_str}T{time_str.zfill(5)}", "%Y-%m-%dT%H:%M")

            appt = Appointment(
                client_id=int(data["clientId"]),
                barber_id=int(data["barberId"]),
                service_id=int(data["serviceId"]),
                date_time=date_time,
                status=data.get("status", "Scheduled"),
            )

            db.session.add(appt)
            db.session.commit()

            return appt.to_dict(), 201

        except ValueError as ve:
            return {"error": f"Date/time format error: {str(ve)}"}, 400
        except Exception as e:
            return {"error": f"Internal error: {str(e)}"}, 500


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

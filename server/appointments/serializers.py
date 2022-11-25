from rest_framework import serializers

from appointments.models import Appointment
from multi_user.models import Doctor, Patient


class AppointmentRegistrationSerializer(serializers.ModelSerializer):

    start_time = serializers.DateTimeField(required=True)

    end_time = serializers.DateTimeField(required=True)

    hospital_name = serializers.CharField(required=True)

    department = serializers.CharField(required=True)

    class Meta:

        model = Appointment

        fields = ["start_time", "end_time", "hospital_name", "department"]

    def get_cleaned_data(self):

        data = super(AppointmentRegistrationSerializer, self).get_cleaned_data()

        extra_data = {
            "start_time": data.get("start_time", ""),
            "end_time": data.get("end_time", ""),
            "hospital_name": data.get("hospital_name", ""),
            "department": data.get("department", ""),
        }

        data.update(extra_data)
        return data

    def save(self, request, patient_id, doctor_id, *args, **kwargs):

        patient = Patient.objects.get(id=patient_id)

        doctor = Doctor.objects.get(id=doctor_id)

        appointment = Appointment(
            patient=patient,
            doctor=doctor,
            start_time=request.data.get("start_time"),
            end_time=request.data.get("end_time"),
            hospital_name=request.data.get("hospital_name"),
            department=Appointment.DepartmentType(request.data.get("department")),
        )

        appointment.save()
        return appointment


class AppointmentUpdateSerializer(serializers.ModelSerializer):

    start_time = serializers.DateTimeField(required=False)

    end_time = serializers.DateTimeField(required=False)

    appointment_id = serializers.IntegerField(required=True)

    class Meta:
        model = Appointment
        fields = [
            "appointment_id",
            "start_time",
            "end_time",
        ]

    def get_cleaned_data(self):
        data = super(AppointmentUpdateSerializer, self).get_cleaned_data()
        extra_data = {
            "appointment_id": data.get("appointment_id"),
            "start_time": data.get("start_time", None),
            "end_time": data.get("end_time", None),
        }
        data.update(extra_data)
        return data

    def save(self, request, *args, **kwargs):
        appointment = Appointment.objects.get(id=request.data.get("appointment_id"))

        appointment.start_time = (
            request.data.get("start_time", None) if request.data.get("start_time", None) else appointment.start_time
        )
        appointment.end_time = request.data.get("end_time") if request.data.get("end_time") else appointment.end_time

        appointment.save()

        return appointment

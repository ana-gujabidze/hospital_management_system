from rest_framework import serializers

from appointments.models import Appointment
from bills.models import Bill


class BillRegistrationSerializer(serializers.ModelSerializer):

    room_charge = serializers.IntegerField(required=False)
    doctor_fee = serializers.IntegerField(required=True)
    medicine_cost = serializers.IntegerField(required=True)
    other_charge = serializers.IntegerField(required=True)

    class Meta:

        model = Bill
        fields = ["room_charge", "doctor_fee", "medicine_cost", "other_charge"]

    def get_cleaned_data(self):

        data = super(BillRegistrationSerializer, self).get_cleaned_data()

        extra_data = {
            "room_charge": data.get("start_time", 0),
            "doctor_fee": data.get("end_time", 0),
            "medicine_cost": data.get("hospital_name", 0),
            "other_charge": data.get("department", 0),
        }

        data.update(extra_data)
        return data

    def save(self, request, appointment_id, *args, **kwargs):

        appointment = Appointment.objects.get(id=appointment_id)

        bill = Bill(
            appointment=appointment,
            room_charge=request.data.get("room_charge"),
            doctor_fee=request.data.get("doctor_fee"),
            medicine_cost=request.data.get("medicine_cost"),
            other_charge=request.data.get("other_charge"),
        )

        bill.save()
        return bill

from appointments.models import Appointment
from bills.models import Bill
from bills.serializers import BillRegistrationSerializer
from django.db.models import F, Sum
from django.forms.models import model_to_dict
from django.shortcuts import render
from multi_user.permissions import ISAdministrator, IsDoctor, IsPatient
from rest_framework import generics, permissions
from rest_framework.response import Response

# Create your views here.


class AppointmentBillView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated & ISAdministrator]

    serializer_class = BillRegistrationSerializer

    def post(self, request, appointment_id, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        bill = serializer.save(request, appointment_id)

        bill = model_to_dict(bill)

        return Response(
            {
                "bill": bill,
                "message": "Bill has been created successfully!",
            }
        )


class SpecificPatientTotalBillView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated & ISAdministrator]

    def get(self, request, patient_id, *args, **kwargs):
        # appointment__patient__status=False
        queryset = (
            Bill.objects.filter(appointment__patient__id=patient_id)
            .order_by("-created_at")
            .annotate(
                doctor_name=F("appointment__doctor__full_name"),
            )
        )
        amount_due = queryset.aggregate(
            s=Sum(
                F("room_charge")
                + F("doctor_fee")
                + F("medicine_cost")
                + F("other_charge"),
            )
        )["s"]
        queryset_list = list(queryset.values())
        return Response(
            {
                "queryset": queryset_list,
                "number_of_items": queryset.count(),
                "amount_due": amount_due,
            }
        )

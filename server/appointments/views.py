from io import BytesIO

import pandas as pd
from django.db.models import F
from django.forms.models import model_to_dict
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response

from appointments.models import Appointment
from appointments.serializers import AppointmentRegistrationSerializer, AppointmentUpdateSerializer
from multi_user.permissions import ISAdministrator, IsDoctor, IsPatient


# Create your views here.
class AppointmentRegistrationView(generics.GenericAPIView):
    serializer_class = AppointmentRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated & ISAdministrator]

    def post(self, request, patient_id, doctor_id, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        appointment = serializer.save(request, patient_id, doctor_id)
        return Response(
            {
                "appointment": model_to_dict(appointment),
                "message": "Appointment has been created successfully!",
            }
        )


class AppointmentListView(generics.GenericAPIView):
    queryset = Appointment.objects.all().annotate(
        doctor_name=F("doctor__full_name"), patient_name=F("patient__full_name")
    )
    permission_classes = [permissions.IsAuthenticated & ISAdministrator]

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        queryset_list = list(queryset.values())
        return Response(
            {
                "queryset": queryset_list,
                "number_of_items": queryset.count(),
            }
        )


class PatientAppointmentListView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated & (IsDoctor | ISAdministrator)]

    def get(self, request, patient_id, *args, **kwargs):
        queryset = Appointment.objects.filter(patient_id=patient_id).values()
        return Response(
            {
                "queryset": queryset,
                "number_of_items": queryset.count(),
            }
        )


class DoctorAppointmentListView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated & (IsDoctor | ISAdministrator)]

    def get(self, request, doctor_id, *args, **kwargs):
        queryset = Appointment.objects.filter(doctor_id=doctor_id).values()
        return Response(
            {
                "queryset": queryset,
                "number_of_items": queryset.count(),
            }
        )


class AppointmentUpdateView(generics.GenericAPIView):
    serializer_class = AppointmentUpdateSerializer
    permission_classes = [permissions.IsAuthenticated & ISAdministrator]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        appointment = serializer.save(request)
        return Response(
            {
                "patient": model_to_dict(appointment),
                "message": "Doctor account has been updated successfully!",
            }
        )


class SpecificAppointmentView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated & ISAdministrator]

    def get(self, request, appointment_id, *args, **kwargs):
        appointment = Appointment.objects.get(id=appointment_id)
        return Response(
            {
                "appointment": model_to_dict(appointment),
            }
        )

    def delete(self, request, appointment_id, format=None):
        appointment = Appointment.objects.get(id=appointment_id)
        appointment.delete()
        return Response(
            {"message": "Appointment has been succeffully cancelled!"},
            status=status.HTTP_204_NO_CONTENT,
        )


class DownloadAppointmentsCSVView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated & ISAdministrator]

    def get(self, request, *args, **kwargs):
        queryset = Appointment.objects.all().annotate(
            doctor_name=F("doctor__full_name"), patient_name=F("patient__full_name")
        )
        queryset_list = queryset.values(
            "patient_name",
            "doctor_name",
            "hospital_name",
            "department",
            "start_time",
            "end_time",
        )
        all_appointments_df = pd.DataFrame.from_dict(queryset_list)
        all_appointments_df = all_appointments_df.replace("\r?\n", " ", regex=True)

        buf = BytesIO()
        all_appointments_df.to_csv(buf, index=False)
        buf.seek(0)

        return HttpResponse(
            buf.getvalue(),
            content_type="text/csv",
            headers={"Content-Disposition": 'attachment; filename="all_appointments_df"'},
        )


class DownloadSpecificPatientAppointmentsCSVView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated & (ISAdministrator | IsPatient)]

    def get(self, request, patient_id, *args, **kwargs):
        queryset = Appointment.objects.filter(patient_id=patient_id).annotate(
            doctor_name=F("doctor__full_name"),
        )
        queryset_list = queryset.values(
            "doctor_name",
            "hospital_name",
            "department",
            "start_time",
            "end_time",
        )
        all_appointments_df = pd.DataFrame.from_dict(queryset_list)
        all_appointments_df = all_appointments_df.replace("\r?\n", " ", regex=True)

        buf = BytesIO()
        all_appointments_df.to_csv(buf, index=False)
        buf.seek(0)

        return HttpResponse(
            buf.getvalue(),
            content_type="text/csv",
            headers={"Content-Disposition": 'attachment; filename="my_appointments_df"'},
        )


class DownloadSpecificDoctorAppointmentsCSVView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated & (ISAdministrator | IsDoctor)]

    def get(self, request, doctor_id, *args, **kwargs):
        queryset = Appointment.objects.filter(doctor_id=doctor_id).annotate(
            patient_name=F("patient__full_name"),
        )
        queryset_list = queryset.values(
            "patient_name",
            "hospital_name",
            "department",
            "start_time",
            "end_time",
        )
        all_appointments_df = pd.DataFrame.from_dict(queryset_list)
        all_appointments_df = all_appointments_df.replace("\r?\n", " ", regex=True)

        buf = BytesIO()
        all_appointments_df.to_csv(buf, index=False)
        buf.seek(0)

        return HttpResponse(
            buf.getvalue(),
            content_type="text/csv",
            headers={"Content-Disposition": 'attachment; filename="my_appointments_df"'},
        )

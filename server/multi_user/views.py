from io import BytesIO

import pandas as pd
from django.contrib.auth import logout
from django.core import serializers
from django.forms.models import model_to_dict
from django.http import HttpResponse
from multi_user.models import Doctor, Patient, User
from multi_user.permissions import ISAdministrator, IsDoctor, IsPatient
from multi_user.serializers import (
    AdministratorRegistrationSerializer,
    DoctorRegistrationSerializer,
    DoctorUpdateSerializer,
    PatientRegistrationSerializer,
    PatientUpdateSerializer,
    UserSerializer,
)
from rest_framework import generics, permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.views import APIView


class PatientRegistrationView(generics.GenericAPIView):
    serializer_class = PatientRegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(request)
        return Response(
            {
                "username": user.username,
                "token": Token.objects.get(user=user).key,
                "message": "Account has been created successfully!",
            }
        )


class DoctorRegistrationView(generics.GenericAPIView):
    serializer_class = DoctorRegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(request)
        return Response(
            {
                "username": user.username,
                "token": Token.objects.get(user=user).key,
                "message": "Account has been created successfully!",
            }
        )


class AdministratorRegistrationView(generics.GenericAPIView):
    serializer_class = AdministratorRegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(request)
        return Response(
            {
                "username": user.username,
                "token": Token.objects.get(user=user).key,
                "message": "Account has been created successfully!",
            }
        )


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs) -> Response:
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)


class PatientOnlyView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated & IsPatient]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class DoctorOnlyView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated & IsDoctor]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)
        user = {
            "email": user.email,
            "full_name": user.get_full_name(),
            "id": user.pk,
            "user_type": user.user_type,
            "username": user.username,
            "is_staff": user.is_staff,
        }
        return Response(
            {
                "token": token.key,
                "user": user,
            }
        )


class PatientListView(generics.ListCreateAPIView):
    queryset = Patient.objects.all()
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


class DoctorListView(generics.ListCreateAPIView):
    queryset = Doctor.objects.all()
    permission_classes = [permissions.IsAuthenticated & (IsDoctor | ISAdministrator)]

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        queryset_list = list(queryset.values())
        return Response(
            {
                "queryset": queryset_list,
                "number_of_items": queryset.count(),
            }
        )


class LastFewDoctorListView(generics.ListCreateAPIView):
    queryset = Doctor.objects.all()
    permission_classes = [permissions.IsAuthenticated & (IsDoctor | ISAdministrator)]

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset().order_by("-id")[:5]
        queryset_list = list(queryset.values())
        return Response(
            {
                "queryset": queryset_list,
            }
        )


class LastFewPatientListView(generics.ListCreateAPIView):
    queryset = Patient.objects.all()
    permission_classes = [permissions.IsAuthenticated & ISAdministrator]

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset().order_by("-id")[:5]
        queryset_list = list(queryset.values())
        return Response(
            {
                "queryset": queryset_list,
            }
        )


class SpecificDoctorView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated & ISAdministrator]

    def get(self, request, doctor_id, *args, **kwargs):
        doctor = Doctor.objects.get(id=doctor_id)
        return Response(
            {
                "doctor": model_to_dict(doctor),
            }
        )


class SpecificPatientView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated & ISAdministrator]

    def get(self, request, patient_id, *args, **kwargs):
        patient = Patient.objects.get(id=patient_id)
        return Response(
            {
                "patient": model_to_dict(patient),
            }
        )


class SpecificUserView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated & ISAdministrator]

    def get(self, request, user_id, *args, **kwargs):
        user = User.objects.get(id=user_id)
        user = {
            "id": user.id,
            "username": user.username,
            "firstName": user.first_name,
            "lastName": user.last_name,
            "email": user.email,
        }
        return Response(
            {
                "user": user,
            }
        )

    def delete(self, request, user_id, format=None):
        user = User.objects.get(id=user_id)
        user.delete()
        return Response(
            {"message": "User profile has been succeffully deleted!"},
            status=status.HTTP_204_NO_CONTENT,
        )


class DoctorUpdateView(generics.GenericAPIView):
    serializer_class = DoctorUpdateSerializer
    permission_classes = [permissions.IsAuthenticated & ISAdministrator]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        doctor = serializer.save(request)
        return Response(
            {
                "doctor": model_to_dict(doctor),
                "message": "Doctor account has been updated successfully!",
            }
        )


class PatientUpdateView(generics.GenericAPIView):
    serializer_class = PatientUpdateSerializer
    permission_classes = [permissions.IsAuthenticated & ISAdministrator]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        patient = serializer.save(request)
        return Response(
            {
                "patient": model_to_dict(patient),
                "message": "Patient account has been updated successfully!",
            }
        )


class DownloadPalientCSVView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated & ISAdministrator]

    def get(self, request, *args, **kwargs):
        queryset_list = Patient.objects.all().values(
            "full_name",
            "mobile",
            "admited_at",
            "released_at",
            "days_spent",
            "disease",
            "symptoms",
        )
        all_patients_dataset = pd.DataFrame.from_dict(queryset_list)
        all_patients_dataset = all_patients_dataset.replace("\r?\n", " ", regex=True)

        buf = BytesIO()
        all_patients_dataset.to_csv(buf, index=False)
        buf.seek(0)

        return HttpResponse(
            buf.getvalue(),
            content_type="text/csv",
            headers={
                "Content-Disposition": 'attachment; filename="all_patients_dataset"'
            },
        )


class DownloadDoctorCSVView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated & ISAdministrator]

    def get(self, request, *args, **kwargs):
        queryset_list = Doctor.objects.all().values(
            "full_name",
            "mobile",
            "address",
            "department",
        )
        all_doctors_dataset = pd.DataFrame.from_dict(queryset_list)
        all_doctors_dataset = all_doctors_dataset.replace("\r?\n", " ", regex=True)

        buf = BytesIO()
        all_doctors_dataset.to_csv(buf, index=False)
        buf.seek(0)

        return HttpResponse(
            buf.getvalue(),
            content_type="text/csv",
            headers={
                "Content-Disposition": 'attachment; filename="all_doctors_dataset"'
            },
        )

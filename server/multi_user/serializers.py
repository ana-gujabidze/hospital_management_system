import datetime

from rest_framework import serializers

from multi_user.models import Administrator, Doctor, Patient, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "is_staff"]


class PatientRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(style={"input_type": "password"}, write_only=True)
    match_password = serializers.CharField(style={"input_type": "password"}, write_only=True)
    mobile = serializers.CharField(required=True)
    disease = serializers.CharField(required=True)
    symptoms = serializers.CharField(required=True)
    status = serializers.BooleanField(required=False)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "match_password",
            "disease",
            "mobile",
            "symptoms",
            "status",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def get_cleaned_data(self):
        data = super(PatientRegistrationSerializer, self).get_cleaned_data()
        extra_data = {
            "password": data.get("password", ""),
            "match_password": data.get("match_password", ""),
            "mobile": data.get("mobile", ""),
            "disease": data.get("disease", ""),
            "symptoms": data.get("symptoms", ""),
            "status": data.get("status", False),
        }
        data.update(extra_data)
        return data

    def save(self, request, *args, **kwargs):
        user = User(
            username=request.data.get("username", ""),
            email=request.data.get("email", ""),
            first_name=request.data.get("first_name", ""),
            last_name=request.data.get("last_name", ""),
        )
        password = request.data.get("password", "")
        password_2 = request.data.get("match_password", "")
        if password != password_2:
            raise serializers.ValidationError("Password is incorrect.")

        user.set_password(password)
        user.is_staff = False
        user.user_type = User.UserType.PATIENT
        user.save()

        patient = Patient(
            patient=user,
            full_name=user.get_full_name(),
            mobile=request.data.get("mobile"),
            disease=request.data.get("disease"),
            symptoms=request.data.get("symptoms"),
            status=True if request.data.get("status") == "true" else False,
        )

        patient.save()
        return user


class DoctorRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(required=True)
    match_password = serializers.CharField(required=True)
    mobile = serializers.CharField(required=True)
    department = serializers.CharField(required=True)
    address = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "match_password",
            "department",
            "mobile",
            "address",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def get_cleaned_data(self):
        data = super(DoctorRegistrationSerializer, self).get_cleaned_data()
        extra_data = {
            "password": data.get("password", ""),
            "match_password": data.get("match_password", ""),
            "mobile": data.get("mobile", ""),
            "department": data.get("department", ""),
            "address": data.get("address", ""),
        }
        data.update(extra_data)
        return data

    def save(self, request, *args, **kwargs):
        user = User(
            username=request.data.get("username", ""),
            email=request.data.get("email", ""),
            first_name=request.data.get("first_name", ""),
            last_name=request.data.get("last_name", ""),
        )
        password = request.data.get("password", "")
        password_2 = request.data.get("match_password", "")
        if password != password_2:
            raise serializers.ValidationError("Password is incorrect.")

        user.set_password(password)
        user.is_staff = (
            False  # Superadmin will veirfy if account really belongs to doctor and change it to True from admin panel
        )
        user.user_type = User.UserType.DOCTOR
        user.save()

        doctor = Doctor(
            doctor=user,
            full_name=user.get_full_name(),
            mobile=request.data.get("mobile"),
            department=request.data.get("department"),
            address=request.data.get("address"),
        )

        doctor.save()

        return user


class AdministratorRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(style={"input_type": "password"}, write_only=True)
    match_password = serializers.CharField(style={"input_type": "password"}, write_only=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "match_password",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def get_cleaned_data(self):
        data = super(AdministratorRegistrationSerializer, self).get_cleaned_data()
        extra_data = {
            "password": data.get("password", ""),
            "match_password": data.get("match_password", ""),
        }
        data.update(extra_data)
        return data

    def save(self, request, *args, **kwargs):
        user = User(
            username=request.data.get("username", ""),
            email=request.data.get("email", ""),
            first_name=request.data.get("first_name", ""),
            last_name=request.data.get("last_name", ""),
        )
        password = request.data.get("password", "")
        password_2 = request.data.get("match_password", "")
        if password != password_2:
            raise serializers.ValidationError("Password is incorrect.")

        user.set_password(password)
        user.is_stuff = True
        user.is_admin = (
            False  # Superadmin will veirfy if account really belongs to doctor and change it to True from admin panel
        )
        user.user_type = User.UserType.ADMINISTRATOR
        user.save()

        administrator = Administrator(
            administrator=user,
            full_name=user.get_full_name(),
        )

        administrator.save()

        return user


class DoctorUpdateSerializer(serializers.ModelSerializer):

    mobile = serializers.CharField(allow_blank=True)
    department = serializers.CharField(allow_blank=True)
    address = serializers.CharField(allow_blank=True)
    doctor_id = serializers.IntegerField(required=True)

    class Meta:
        model = Doctor
        fields = ["doctor_id", "mobile", "address", "department"]

    def get_cleaned_data(self):
        data = super(DoctorUpdateSerializer, self).get_cleaned_data()
        extra_data = {
            "doctor_id": data.get("doctor_id"),
            "mobile": data.get("mobile", ""),
            "address": data.get("address", ""),
            "department": data.get("department", ""),
        }
        data.update(extra_data)
        return data

    def save(self, request, *args, **kwargs):
        doctor = Doctor.objects.get(id=request.data.get("doctor_id"))

        doctor.address = request.data.get("address", "") if request.data.get("address", "") else doctor.address
        doctor.department = (
            request.data.get("department", "") if request.data.get("department", "") else doctor.department
        )
        doctor.mobile = request.data.get("mobile", "") if request.data.get("mobile", "") else doctor.mobile

        doctor.save()

        return doctor


class PatientUpdateSerializer(serializers.ModelSerializer):

    mobile = serializers.CharField(allow_blank=True)
    disease = serializers.CharField(allow_blank=True)
    symptoms = serializers.CharField(allow_blank=True)
    days_spent = serializers.IntegerField(required=False)
    release_date = serializers.DateTimeField(required=False)
    patient_id = serializers.IntegerField(required=True)
    status = serializers.BooleanField(required=False)

    class Meta:
        model = Doctor
        fields = [
            "patient_id",
            "mobile",
            "disease",
            "symptoms",
            "days_spent",
            "release_date",
            "status",
        ]

    def get_cleaned_data(self):
        data = super(PatientUpdateSerializer, self).get_cleaned_data()
        extra_data = {
            "patient_id": data.get("patient_id"),
            "mobile": data.get("mobile", ""),
            "disease": data.get("disease", ""),
            "symptoms": data.get("department", ""),
            "days_spent": data.get("days_spent", None),
            "release_date": data.get("release_date", None),
            "status": data.get("status", False),
        }
        data.update(extra_data)
        return data

    def save(self, request, *args, **kwargs):
        patient = Patient.objects.get(id=request.data.get("patient_id"))

        patient.disease = request.data.get("disease", "") if request.data.get("disease", "") else patient.disease
        patient.symptoms = request.data.get("symptoms", "") if request.data.get("symptoms", "") else patient.symptoms
        patient.mobile = request.data.get("mobile", "") if request.data.get("mobile", "") else patient.mobile
        patient.days_spent = (
            request.data.get("days_spent", None) if request.data.get("days_spent", None) else patient.days_spent
        )
        patient.released_at = request.data.get("release_at") if request.data.get("release_at") else patient.released_at
        patient.status = (
            True if request.data.get("status") == "true" else False if request.data.get("status") else patient.status
        )

        patient.save()

        return patient

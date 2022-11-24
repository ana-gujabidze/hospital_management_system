from rest_framework.permissions import BasePermission

from multi_user.models import User


class IsPatient(BasePermission):
    def has_permission(
        self,
        request,
        view,
        *args,
    ) -> bool:
        return bool(request.user and request.user.user_type == User.UserType.PATIENT)


class IsDoctor(BasePermission):
    def has_permission(
        self,
        request,
        view,
        *args,
    ) -> bool:
        return bool(request.user and request.user.user_type == User.UserType.DOCTOR)


class ISAdministrator(BasePermission):
    def has_permission(
        self,
        request,
        view,
        *args,
    ) -> bool:
        return bool(request.user and request.user.user_type == User.UserType.ADMINISTRATOR)

from rest_framework import permissions
from .models import Profile

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow profile owners to edit/delete.
    Read-only methods are allowed for any authenticated user.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj: Profile):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.user == request.user
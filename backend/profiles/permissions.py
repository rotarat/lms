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
    
class IsTeacherOrProjectOwner(permissions.BasePermission):
    """
    Custom permission for ProjectViewSet:
    - SAFE_METHODS: anyone (authenticated) can view/list.
    - create: only students can create (upload).
    - update/partial_update: 
        * If request.data contains 'grade', only a teacher can set/change it.
        * Else (no 'grade' in data), only the owner (student) can update their own file.
    - destroy: only teacher can delete a project.
    """
    def has_permission(self, request, view):
        # Must be authenticated for any action
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        user_profile = request.user.profile

        # SAFE methods: allow any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True

        # CREATE: only students are allowed (teacher cannot create a student project)
        if view.action == 'create':
            return user_profile.role == Profile.Role.STUDENT

        # UPDATE / PARTIAL_UPDATE:
        if view.action in ['update', 'partial_update']:
            # If attempting to set or change a grade, only teachers can do that
            if 'grade' in request.data:
                return user_profile.role == Profile.Role.TEACHER
            # If trying to change grade or reason, only teacher allowed
            if 'grade' in request.data or 'reason' in request.data:
                return user_profile.role == Profile.Role.TEACHER
            # Otherwise, updating file/title/description => only owner
            return obj.student == user_profile

        # DESTROY: only teachers can delete any project
        if view.action == 'destroy':
            return user_profile.role == Profile.Role.TEACHER

        # Fallback: disallow
        return False
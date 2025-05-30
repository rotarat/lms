from rest_framework import permissions
from profiles.models import Profile

def is_teacher(user):
    return (
        user.is_authenticated 
        and
        user.profile.role == Profile.Role.TEACHER
    )

def is_owner(user, obj):
    return (
        user.is_authenticated 
        and
        obj.owner == user.profile
    )

def is_admin(user):
    return (
        user.is_authenticated 
        and 
        (user.is_staff or user.is_superuser)
    )

class CoursePermissions(permissions.BasePermission):
    """
    Courses:
      - READ (GET/list, retrieve): public (AllowAny)
      - CREATE: teachers or (or staff/superuser)
      - UPDATE/DELETE: owner or (or staff/superuser)
    """
    def has_permission(self, request, view):
        # everyone (even anon) may list/retrieve
        if request.method in permissions.SAFE_METHODS:
            return True

        # creation is teacher or admin
        if view.action == 'create':
            return is_teacher(request.user) or is_admin(request.user)

        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # always allow safe reads
        if request.method in permissions.SAFE_METHODS:
            return True

        # updates/deletes only by owner or admin
        return is_owner(request.user, obj) or is_admin(request.user)

class VideoPermissions(permissions.BasePermission):
    """
    Courses & Videos:
      - READ: any authenticated user
      - CREATE: teachers (or staff/superuser)
      - UPDATE/DELETE: teacher-owner (or staff/superuser)
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated

        if view.action == 'create':
            return is_teacher(request.user) or is_admin(request.user)

        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return is_owner(request.user, obj) or is_admin(request.user)


class PresentationPermissions(permissions.BasePermission):
    """
    Presentations:
      - READ: any authenticated user
      - CREATE: any authenticated user (student or teacher)
      - UPDATE/DELETE: presentation-owner (or staff/superuser)
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated

        if view.action == 'create':
            return request.user.is_authenticated

        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return is_owner(request.user, obj) or is_admin(request.user)

class ExamPermissions(CoursePermissions):
    """
    Exam permissions:
      - READ (list/retrieve, start): any authenticated user
      - CREATE: teachers or admin
      - UPDATE/DELETE: creator or admin
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        if view.action == 'create':
            # allow only teachers/admin
            from profiles.models import Profile
            is_teacher = (
                request.user.is_authenticated
                and request.user.profile.role == Profile.Role.TEACHER
            )
            return is_teacher or request.user.is_staff
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # safe methods: already checked
        if request.method in permissions.SAFE_METHODS:
            return True
        # update/delete only creator or admin
        return (
            request.user.is_staff
            or obj.creator == request.user.profile
        )
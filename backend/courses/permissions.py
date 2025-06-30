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

         # 2) If this is the 'enroll' action, only allow authenticated students:
        if view.action == "enroll":
            return (
                request.user.is_authenticated
                and hasattr(request.user, "profile")
                and request.user.profile.role == Profile.Role.STUDENT
            )
        
        # creation is teacher or admin
        if view.action == 'create':
            return is_teacher(request.user) or is_admin(request.user)

        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # always allow safe reads
        if request.method in permissions.SAFE_METHODS:
            return True
        
         # 2) If this is 'enroll', we already checked in has_permission that
        #    user.profile.role == STUDENT, so allow it here as well:
        if view.action == "enroll":
            return (
                request.user.is_authenticated
                and hasattr(request.user, "profile")
                and request.user.profile.role == Profile.Role.STUDENT
            )

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

class ExamPermissions(permissions.BasePermission):
    """
    - SAFE_METHODS (GET, HEAD, OPTIONS): any authenticated user may list / retrieve.
       - Students may see exams only if they are enrolled in that exam.course.
       - Teachers may see the ones they created.
    - CREATE: only a teacher or admin.
    - UPDATE / DELETE: only the teacher who created that Exam (i.e. exam.teacher == request.user.profile) or admin.
    """

    def has_permission(self, request, view):
        # 1) SAFE methods: must be authenticated
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated

        # 2) CREATE: only teachers or admin
        if view.action == "create":
            return is_teacher(request.user) or is_admin(request.user)

        # 3) Other write methods (update, partial_update, destroy): user must be authenticated
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # SAFE_METHODS: same checks as above, but we must ensure course/enrollment logic on GET if necessary.
        if request.method in permissions.SAFE_METHODS:
            # If teacher, ensure they only see their own exam.
            if hasattr(request.user, "profile") and request.user.profile.role == Profile.Role.TEACHER:
                return obj.teacher == request.user.profile
            # If student, ensure they are enrolled in that course:
            if hasattr(request.user, "profile") and request.user.profile.role == Profile.Role.STUDENT:
                return obj.course in request.user.profile.enrolled_courses.all()
            # If admin: allow
            return request.user.is_staff or request.user.is_superuser

        # Non‐SAFE: only creator or admin
        return (obj.teacher == request.user.profile) or is_admin(request.user)
    
class StudentExamPermissions(permissions.BasePermission):
    """
    - SAFE_METHODS (GET, HEAD, OPTIONS):
       • Students may retrieve only their own attempts.
       • Teachers may retrieve any attempt for exams they created.
       • Admins may retrieve all.
    - submit (POST /api/studentexams/{id}/submit/): only the owning student.
    - partial_update/update (PATCH/PUT): only the teacher of that exam (or admin).
    - create/destroy: disallowed via API.
    """

    def has_permission(self, request, view):
        # Must be logged in for anything
        if not request.user or not request.user.is_authenticated:
            return False

        # SAFE methods: allow, object‐level will restrict
        if request.method in permissions.SAFE_METHODS:
            return True

        # Student “submit” custom action
        if view.action == "submit":
            return request.user.profile.role == Profile.Role.STUDENT

        # Teacher grading action
        if view.action in ["partial_update", "update"]:
            return request.user.profile.role == Profile.Role.TEACHER or request.user.is_staff

        # Disallow create/destroy via client
        if view.action in ["create", "destroy"]:
            return False

        return False

    def has_object_permission(self, request, view, obj):
        profile = request.user.profile

        # SAFE methods
        if request.method in permissions.SAFE_METHODS:
            if profile.role == Profile.Role.STUDENT:
                return obj.student == profile
            if profile.role == Profile.Role.TEACHER:
                return obj.exam.teacher == profile
            return request.user.is_staff

        # submit
        if view.action == "submit":
            return obj.student == profile

        # grading
        if view.action in ["partial_update", "update"]:
            return obj.exam.teacher == profile or request.user.is_staff

        return False
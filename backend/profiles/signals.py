from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Profile, PersonalData, Project

@receiver(post_save, sender=Profile)
def sync_profile_to_user(sender, instance, **kwargs):
    user = instance.user

    user.first_name = instance.first_name or ''
    user.last_name  = instance.last_name  or ''
    user.save()

@receiver(post_save, sender=Profile)
def create_personal_data_for_profile(sender, instance, created, **kwargs):
    """
    Whenever a new Profile is created, also make an empty PersonalData row.
    If the Profile is updated (created=False), do nothing.
    """
    if created:
        PersonalData.objects.create(profile=instance)

@receiver(post_save, sender=Project)
def append_grade_to_personal_data(sender, instance: Project, created, **kwargs):
    """
    Whenever a Project is saved (either created or updated),
    if it now has a grade (and/or reason), append a record
    into that student's PersonalData.graded_projects.
    """
    # We only care about updates where grade is set (not when the student just creates the Project).
    # If `created` is True, it’s the initial upload: ignore.
    if created:
        return

    # If no grade is present (or grade is set to None), skip.
    # (You could also check “if instance.grade is not None” exactly— adjust as needed.)
    if instance.grade is None:
        return

    # Attempt to load or create that student’s PersonalData row:
    pd, _ = PersonalData.objects.get_or_create(profile=instance.student)

    # Build a new entry dictionary:
    new_entry = {
        "project_id":    str(instance.id),
        "course_id":     str(instance.course_id),
        "course_title":  instance.course.title,
        "grade":         instance.grade,
        "reason":        instance.reason,
    }

    # If the same project was already recorded (e.g. teacher re‐saves), we could optionally avoid duplicates:
    # Use the project_id as unique key— filter out any existing entry with that project_id.
    filtered = [
        rec for rec in pd.graded_projects
        if rec.get("project_id") != str(instance.id)
    ]

    # Append the new entry at the end:
    filtered.append(new_entry)

    # Save back into JSONField:
    pd.graded_projects = filtered
    pd.save()
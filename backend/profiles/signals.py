from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from django.contrib.auth.models import User
from .models import Profile

@receiver(post_save, sender=Profile)
def sync_profile_to_user(sender, instance, **kwargs):
    user = instance.user

    user.first_name = instance.first_name or ''
    user.last_name  = instance.last_name  or ''
    user.save()

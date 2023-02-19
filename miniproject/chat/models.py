from django.db import models

# Create your models here.
class helper (models.Model):
    group_name = models.CharField(max_length=50)
    user_name = models.CharField(max_length=20)
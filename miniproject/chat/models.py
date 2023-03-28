from django.db import models

# Create your models here.
class Chat_helper (models.Model):
    group_name = models.CharField(max_length=50)
    user_name = models.CharField(max_length=20)
    #random_img = models.ImageField(upload_to='C:\Users\Oldin Rebello\Pictures\Screenshots')
    # max size should be 35kb as random image generated is of around 30kbs
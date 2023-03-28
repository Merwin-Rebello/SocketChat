from django.shortcuts import render,redirect
from .models import Chat_helper

# Create your views here.
def room(req,name,room):
    return render(req,"room.html",{'room':room})

def home(req):
    if req.method == "POST":
        name=req.POST['name']
        room=req.POST['room']
        return redirect(f'{name}/{room}')
    rooms = Chat_helper.objects.values("group_name").distinct()
    return render(req,"home.html",{'rooms':rooms})
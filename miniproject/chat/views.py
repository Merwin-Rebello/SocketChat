from django.shortcuts import render

# Create your views here.
def room(req):
    return render(req,"room.html")
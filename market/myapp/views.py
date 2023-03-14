from django.shortcuts import render

def index(request):
    return render(request, 'index.html')

def new(request):
    return render(request, 'new.html')
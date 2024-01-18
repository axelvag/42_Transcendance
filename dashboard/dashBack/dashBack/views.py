from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

# Create your views here.
def index(request):
    context = {"message": "Hello World !"}
    template = loader.get_template("Home/index.html")
    return HttpResponse(template.render(context, request))
    # return HttpResponse("yo")
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
import json
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework.renderers import JSONRenderer

@api_view(['POST'])
def register(request):
    data = json.loads(request.body)
    username = data['username']
    password = data['password']
    email = data.get('email', '')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)

    user = User.objects.create_user(username=username, password=password, email=email)

    login(request, user)
    return Response({'message': 'User created successfully'})

@api_view(['POST'])
def login_user(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({'message': 'Logged in'})
    else:
        return Response({'error': 'User not found'}, status=401)
    
@api_view(['POST'])
def logout_user(request):
    logout(request)
    return Response({'message': 'Logged out'})

@api_view(['GET'])
def current_user(request):
    if request.user.is_authenticated:
        return Response({
            'username': request.user.username,
            'email': request.user.email,
        })
    else:
        return Response({'error': 'Not authenticated'}, status=401)
    
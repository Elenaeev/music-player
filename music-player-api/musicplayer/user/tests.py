from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User

class RegisterAPITest(APITestCase):
    def test_register_user_success(self):
        url = reverse('register') 
        data = {
            'username': 'testuser',
            'password': 'strongpassword123',
            'email': 'testuser@example.com'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'User created successfully')
        self.assertTrue(User.objects.filter(username='testuser').exists())

    def test_register_user_duplicate_username(self):
        User.objects.create_user(username='testuser', password='password')

        url = reverse('register')
        data = {
            'username': 'testuser',
            'password': 'anotherpassword',
            'email': 'another@example.com'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Username already exists')

class LoginAPITest(APITestCase):
    def test_login_user_success(self):
        User.objects.create_user(username='testuser', password='strongpassword123')

        url = reverse('login') 
        data = {
            'username': 'testuser',
            'password': 'strongpassword123',
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Logged in')

    def test_login_user_not_found(self):
        url = reverse('login') 
        data = {
            'username': 'testuser',
            'password': 'strongpassword123',
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['error'], 'User not found')

class LogoutAPITest(APITestCase):
    def test_logout_user_success(self):
        User.objects.create_user(username='testuser', password='pass123')
        login_url = reverse('login')
        login_data = {'username': 'testuser', 'password': 'pass123'}
        login_response = self.client.post(login_url, login_data, format='json')
        self.assertEqual(login_response.status_code, 200)

        logout_url = reverse('logout')
        logout_response = self.client.post(logout_url, format='json')

        self.assertEqual(logout_response.status_code, 200)
        self.assertEqual(logout_response.data['message'], 'Logged out')


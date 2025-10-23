from django.urls import path
from . import views

urlpatterns = [
    path('upload_track/', views.upload_track, name="upload_track"),
    path('user_tracks/', views.user_tracks, name='user_tracks'),
    path('delete_track/', views.delete_track, name='delete_track'),
    path('create_playlist/', views.create_playlist, name='create_playlist'),
    path('add_track_to_playlist/', views.add_track_to_playlist, name='add_track_to_playlist'),
    path('remove_track_from_playlist/', views.remove_track_from_playlist, name='remove_track_from_playlist'),
    path('delete_playlist/', views.delete_playlist, name='delete_playlist'),
    path('get_playlists/', views.get_playlists, name='get_playlists'),
    path('get_tracks_of_playlist/', views.get_tracks_of_playlist, name='get_tracks_of_playlist'),
]

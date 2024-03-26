from django.urls import path
from . import views
# from invitations import views

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('send_invitation/', views.send_invitation, name='send_invitation'),
    path('accept_invitation/', views.accept_invitation, name='accept_invitation'),
    path('reject_invitation/', views.reject_invitation, name='reject_invitation'),
    path('get_list_friend/<int:user_id>/', views.get_list_friend, name='get_list_friend'),
    path('list_received_invitations/<int:user_id>/', views.list_received_invitations, name='list_received_invitations'),
    path('list_sent_invitations/<int:user_id>/', views.list_sent_invitations, name='list_sent_invitations'),
    path('cancel_sent_invitation/', views.cancel_sent_invitation, name='cancel_sent_invitation'),
    path('remove_friend/', views.remove_friend, name='remove_friend'),

]
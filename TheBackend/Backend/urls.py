from django.urls import path, include
from . import views


urlpatterns = [
    path('', views.home),
    path('login/', views.google_login, name='google_login'),
    path('login/auth/', views.google_authenticate, name='google_authenticate'),
    path('session/', views.session, name='session'),
    path('logout/', views.logout, name='logout'),
    path('new/',include([
        path('course/',views.CreateCourse, name="new_course"),
        path('lesson/<int:pk>/',views.CreateLesson, name="new_lesson"),
        path('product/',views.CreateProduct, name="new_product"),
        path("subsucribecourse/<int:pk>/",views.SubsucribeCours,name="sucscribe_cours"),
        path("makepurchase/<int:pk>/",views.MakePurchase,name="make_purchase"),
        path("makereply/",views.MakeReply,name="make_purchase"),
        
    ])),
    path('showfilter/<str:type>/',views.ShowFilter,name="show_filter"),
    path('lessons/<int:pk>/',views.ShowLesson,name = "show_lessons"), 
    path('createmeeting/',views.CreateMeeting,name = "create_meeting") ,
    
    
    
    
]

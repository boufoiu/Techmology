from django.contrib import admin
from .models import *


class UserAdmin(admin.ModelAdmin):
    list_display = ['FirstName','Email']

class CourseAdmin(admin.ModelAdmin):
    list_display = ['Title','Descruption']

class CourseImagesAdmin(admin.ModelAdmin):
    list_display = ['Course','Image']

class ProductAdmin(admin.ModelAdmin):
    list_display = ['Title','Price']
    
class CourseAdmin(admin.ModelAdmin):
    list_display = ['Title','Langage']
    
class LessonAdmin(admin.ModelAdmin):
    list_display = ['Title','Peer']
    
class ProductImagesAdmmin(admin.ModelAdmin):
    list_display = ['Product','Image']
    
class LessonRessourcesAdmin(admin.ModelAdmin):
    list_display = ['Lesson','Ressources']    
        
class AdminAdmin(admin.ModelAdmin):
    list_display = ['User']  
        
class SubscruptionAdmin(admin.ModelAdmin):
    list_display = ['User','Course']  

class TeatcherAdmin(admin.ModelAdmin):
    list_display = ['User']  
    
    
    
admin.site.register(User, UserAdmin)
admin.site.register(Course, CourseAdmin)
admin.site.register(CourseImages, CourseImagesAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(ProductImages, ProductImagesAdmmin)
admin.site.register(Lesson, LessonAdmin)
admin.site.register(LessonRessources, LessonRessourcesAdmin)
admin.site.register(Admin, AdminAdmin)
admin.site.register(Teatcher, TeatcherAdmin)
admin.site.register(Subscription, SubscruptionAdmin)






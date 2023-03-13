from .models import *
from rest_framework import serializers 


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['FirstName','LastName','PfP','Email']
        
class CourseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Course
        fields = ['Title','Descruption','Langage']
        
class LessonSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Lesson
        fields = ['Title','Content','Peer_id']
        
        
class ProductSerializer(serializers.HyperlinkedModelSerializer):
      class Meta:
        model = Product
        fields = ['Title','Descruption','Price']
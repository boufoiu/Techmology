from .models import *
from rest_framework import serializers 


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['FirstName','LastName','PfP','Email']
        
class CourseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Course
        fields = ['Title','Description','Langage']


class GetCourseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'Title','Description','Langage']
        
class LessonSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Lesson
        fields = ['Title','Content','Peer_id']


class GetLessonSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'Title','Content','Peer_id']
        
        
class ProductSerializer(serializers.HyperlinkedModelSerializer):
      class Meta:
        model = Product
        fields = ['Title','Description','Price']


class GetProductSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'Title','Description','Price']
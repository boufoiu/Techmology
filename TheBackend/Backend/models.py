from django.db import models

class User(models.Model):
  FirstName = models.CharField(max_length=100)
  LastName = models.CharField(max_length=100)
  Email = models.EmailField(primary_key=True) 
  PfP = models.URLField(max_length=250)
  
  
class Teatcher(models.Model):
  User = models.ForeignKey(User,on_delete=models.CASCADE)
  
class Admin(models.Model):
  User = models.ForeignKey(User, on_delete=models.CASCADE)

class Product(models.Model):
  Title = models.CharField(max_length=1000)
  Descruption = models.TextField()
  Price = models.IntegerField()
  
class Course(models.Model):
  Title = models.CharField(max_length=1000)
  Descruption = models.TextField()
  Langage = models.CharField(max_length=1000)
  
class Lesson(models.Model):
  Title = models.CharField(max_length=1000)
  Content = models.TextField()
  Peer = models.ForeignKey(Course,on_delete=models.CASCADE)

  
class ProductImages(models.Model):
  Product = models.ForeignKey(Product, on_delete=models.CASCADE)
  Image = models.ImageField(upload_to='ProductImages')
  
  
class CourseImages(models.Model):
  Course = models.ForeignKey(Course, on_delete=models.CASCADE)
  Image = models.ImageField(upload_to='CourseImages')
  
  
class LessonRessources(models.Model):
  Lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
  Ressources = models.FileField(upload_to='LessonRessources')



class Subscription(models.Model):
  User = models.ForeignKey(User,on_delete=models.CASCADE)
  Course = models.ForeignKey(Course,on_delete=models.CASCADE)
  

class Purchase(models.Model):
  User = models.ForeignKey(User,on_delete=models.CASCADE)
  Product = models.ForeignKey(Product,on_delete=models.CASCADE)
  
class Reply(models.Model):
  User = models.ForeignKey(User,on_delete=models.CASCADE)
  Lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
  Time = models.DateTimeField()
  Reply = models.ForeignKey('self', null=True, on_delete=models.CASCADE)
  Content = models.TextField()
  
  def __str__(self):
    return self.name
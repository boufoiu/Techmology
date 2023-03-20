import base64
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponseRedirect
from .models import *
import requests
from .serializers import *
import json
from django.utils.crypto import get_random_string
from django.utils import timezone
import jwt
import requests
import json
from time import time


client_id="542518122844-g1gtr6env68luue9b1l7f46qfngc0n0v.apps.googleusercontent.com"
client_secret="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"


@api_view(['GET'])
def google_login(request):
    token_request_uri = "https://accounts.google.com/o/oauth2/auth"
    response_type = "code"
    redirect_uri = "http://127.0.0.1:8000/login/auth/"
    scope = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"
    url = "{token_request_uri}?response_type={response_type}&client_id={client_id}&redirect_uri={redirect_uri}&scope={scope}&prompt=select_account".format(
        token_request_uri=token_request_uri,
        response_type=response_type,
        client_id=client_id,
        redirect_uri=redirect_uri,
        scope=scope)
    return Response({ "url": url })


def google_authenticate(request):

    login_failed_url = '/'
    if 'error' in request.GET or 'code' not in request.GET:
        return HttpResponseRedirect('{loginfailed}'.format(loginfailed=login_failed_url))

    access_token_uri = 'https://accounts.google.com/o/oauth2/token'
    redirect_uri = "http://127.0.0.1:8000/login/auth/"
    data = "code={code}&redirect_uri={redirect_uri}&client_id={client_id}&client_secret={client_secret}&grant_type=authorization_code".format(
        code=request.GET['code'],
        redirect_uri=redirect_uri,
        client_id=client_id,
        client_secret=client_secret,
    )
    headers = {'content-type': 'application/x-www-form-urlencoded'}
    r1 = requests.post(access_token_uri, data=data, headers=headers)
    access_token = r1.json()['access_token']
    r2 = requests.get(
        "https://www.googleapis.com/oauth2/v1/userinfo?access_token={accessToken}".format(accessToken=access_token))
    l = r2.json()
    user = None
    try:
        user = User.objects.get(Email=l['email'])

    except User.DoesNotExist:
        user = User(FirstName=l['family_name'],
                    LastName=l['given_name'], PfP=l['picture'], Email=l['email'])
        user.save()

    if request.session.get('email'):
        request.session.flush()

    request.session['email'] = l['email']

    return HttpResponseRedirect('http://127.0.0.1:3000/')


@api_view(['GET'])
def session(request):
    if 'email' in request.session:
        email = request.session.get('email')
        try:
            user = User.objects.get(Email = email )        
        except User.DoesNotExist:
            return Response(status = status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    return Response(status=status.HTTP_401_UNAUTHORIZED)


def logout(request):
    request.session.flush()
    return HttpResponseRedirect('/session/')


"""Create a new course"""
@api_view(['POST'])
def CreateCourse(request):
    if request.method=='POST':
        try:
            data = json.loads(request.data.get('data'))
        except json.JSONDecodeError:
            return Response({ 'error': 'invalid json'}, status = status.HTTP_400_BAD_REQUEST)        
        Title = data['Title']
        Description = data["Description"]
        Langage = data['Langage']
        serializer = CourseSerializer(data= data)
        if serializer.is_valid():
        
            courses = Course.objects.all()
            courses = courses.filter(Title = Title)
            courses = courses.filter(Langage = Langage)
            if len(courses) > 0:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            
            if 'email' in request.session : 
                user = User.objects.get(Email = email)
                try:
                    Teacher.objects.get(User = user)
                except Teacher.DoesNotExist:
                    try:
                        Admin.objects.get(User = user)
                    except Admin.DoesNotExist:
                        return Response(status=status.HTTP_401_UNAUTHORIZED)

                serializer.validated_data['Title'] = Title                
                serializer.validated_data['Description'] = Description
                serializer.validated_data['Langage'] = Langage
                serializer.save()
                if 'image' in  request.FILES:
                    AddImageCourse(request, serializer)
                return Response(serializer.data, status = status.HTTP_201_CREATED)
            return Response(status = status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)
    return Response(status = status.HTTP_400_BAD_REQUEST)


def AddImageCourse(request, serializer):
    course = Course.objects.get(Title=serializer.data.get('Title'))
    liste = request.FILES.getlist('image')
    for image in liste:
        photo = CourseImages(Course= course, Image= image)
        photo.save()
 
 
"""Create a new Lesson"""   
    
@api_view(['POST'])
def CreateLesson(request,pk): #pk is the primary key of the corse
    if request.method=='POST':
        try:
            data = json.loads(request.data.get('data'))
        except json.JSONDecodeError:
            return Response({ 'error': 'invalid json'}, status = status.HTTP_400_BAD_REQUEST)        
        Title = data['Title']
        Content = data['Content']
        try:
            Peer = Course.objects.get(pk = pk)
        except Course.DoesNotExist:
            return Response(status = status.HTTP_404_NOT_FOUND)
        data['Peer'] = Peer
        serializer = LessonSerializer(data= data)
        if serializer.is_valid():
            try:
                lesson = Lesson.objects.get(Title = Title,Peer = Peer)
            except Lesson.DoesNotExist:
                if 'email' in request.session : 
                    user = User.objects.get(Email = email)
                    try:
                        Teacher.objects.get(User = user)
                    except Teacher.DoesNotExist:
                        try:
                            Admin.objects.get(User = user)
                        except Admin.DoesNotExist:
                            return Response(status=status.HTTP_401_UNAUTHORIZED)

                    serializer.validated_data['Title'] = Title    
                    serializer.validated_data['Content'] = Content            
                    serializer.validated_data['Peer'] = Peer
                    serializer.save()
                    if 'Ressources' in request.FILES:
                        AddLessonRessources(request, serializer)
                    return Response(serializer.data, status = status.HTTP_201_CREATED)
                return Response(status = status.HTTP_401_UNAUTHORIZED)
            return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)
    return Response(status = status.HTTP_400_BAD_REQUEST)


def AddLessonRessources(request, serializer):
    lesson = Lesson.objects.get(Title=serializer.data.get('Title'))
    liste = request.FILES.getlist('Ressources')
    for f in liste:
        ressource = LessonRessources(Lesson= lesson, Ressources= f)
        ressource.save()
    


"""Create a new Product"""
@api_view(['POST'])
def CreateProduct(request):
    if request.method=='POST':
        try:
            data = json.loads(request.data.get('data'))
        except json.JSONDecodeError:
            return Response({ 'error': 'invalid json'}, status = status.HTTP_400_BAD_REQUEST)        
        Title = data['Title']
        Description = data['Description']
        Price = data['Price']   
        serializer = ProductSerializer(data= data)
        if serializer.is_valid():
            try:
                product = Product.objects.get(Title = Title)
            except Product.DoesNotExist:
                if 'email' in request.session : 
                    user = User.objects.get(Email = email)
                    try:
                        Teacher.objects.get(User = user)
                    except Teacher.DoesNotExist:
                        try:
                            Admin.objects.get(User = user)
                        except Admin.DoesNotExist:
                            return Response(status=status.HTTP_401_UNAUTHORIZED)

                    serializer.validated_data['Title'] = Title    
                    serializer.validated_data['Description'] = Description            
                    serializer.validated_data['Price'] = Price
                    serializer.save()
                    if 'images' in request.FILES:
                        AddProductImages(request, serializer)
                    return Response(serializer.data, status = status.HTTP_201_CREATED)
                return Response(status = status.HTTP_401_UNAUTHORIZED)
            return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)
    return Response(status = status.HTTP_400_BAD_REQUEST)


def AddProductImages(request, serializer):
    product = Product.objects.get(Title=serializer.data.get('Title'))
    liste = request.FILES.getlist('images')
    for image in liste:
        ressource = ProductImages(Product = product, Image= image)
        ressource.save()




#-------------------------------------------------------------
#-------------------------------------------------------------
#-------------------------------------------------------------


"""Display all Courses/Products with filter and search"""
@api_view(['GET'])
def ShowFilter(request,type):
    if 'email' in request.session:
        if type == "Course":
            try:
                courses = Course.objects.all()
            except Course.DoesNotExist:
                return Response(status = status.HTTP_404_NOT_FOUND)
            if 'Langage' in request.GET:
                courses = courses.filter(Langage = request.GET.get('Langage',''))
            if 'Search' in request.GET:
                courses = SearchCourses(courses, request.GET.get('Search'))
            serializer = GetCourseSerializer(courses, many= True)
            return Response({ 'data': serializer.data, 'images': GetCourseImage(courses)}) 
        elif type == "Product":
            try:
                products = Product.objects.all()
            except Product.DoesNotExist:
                return Response(status = status.HTTP_404_NOT_FOUND)
            if 'MinPrice' in request.GET:
                products = products.filter(Price__gte = request.GET.get('MinPrice',''))
            if 'MaxPrice' in request.GET:
                products = products.filter(Price__lte = request.GET.get('MaxPrice',''))
            if 'Search' in request.GET:
                products = SearchCourses(products, request.GET.get('Search'))
            serializer = GetProductSerializer(products, many= True)
            return Response({ 'data': serializer.data, 'images': GetProductImage(products)}) 
    return Response(status=status.HTTP_401_UNAUTHORIZED)


def GetCourseImage(courses):
    images = []
    for course in courses:
        liste = CourseImages.objects.filter(Course = course)
        for l in liste:
            images.append((course.pk,l))
    image_path = []
    for couple in images:
        image = couple[1].Image
        with open(image.path, "rb") as image_file:
                image_data = base64.b64encode(image_file.read()).decode('utf-8')
        image_path.append({"ID":couple[0],"Data":image_data})
    return image_path


def GetProductImage(products):
    images = []
    for product in products:
        liste = ProductImages.objects.filter(Product = product)
        for l in liste:
            images.append((product.pk,l))
    image_path = []
    for couple in images:
        image = couple[1].Image
        with open(image.path, "rb") as image_file:
                image_data = base64.b64encode(image_file.read()).decode('utf-8')
        image_path.append({"ID":couple[0],"Data":image_data})
    return image_path


def GetLessonRessources(lesson):    
    files = []
    liste = LessonRessources.objects.filter(Lesson = lesson)
    for l in liste:
        files.append((lesson.pk,l))
    file_path = []
    for couple in files:
        fil = couple[1].Ressources
        with open(fil.path, "rb") as file_file:
                file_data = base64.b64encode(file_file.read()).decode('utf-8')
        file_path.append({"ID":couple[0],"Data":file_data})
    return file_path


def SearchCourses(courses,text):
    l =text.lower().split(" ")
    while "" in l : l.remove("")
    result = []
    taille = len(l)
    for course in courses:
        exist = False
        Title = course.Title.lower().split(" ")
        Description = course.Description.lower().split(" ")
        i = 0
        while i< taille and not exist :
            mot = l[i]
            if mot in Title or mot in Description:
                exist = True
                result.append(course)
            i+=1         
    return result


def SearchProduct(products,text):
    l =text.lower().split(" ")
    while "" in l : l.remove("")
    result = []
    taille = len(l)
    for product in products:
        exist = False
        Title = product.Title.lower().split(" ")
        Description = product.Descuption.lower().split(" ")
        i = 0
        while i< taille and not exist :
            mot = l[i]
            if mot in Title or mot in Description:
                exist = True
                result.append(product)
            i+=1         
    return result
    
    
@api_view(['POST'])
def SubsucribeCours(request,pk):
    if 'email' in request.session:
        email = request.session['email']
        try:
            course = Course.objects.get(pk = pk)
            user = User.objects.get(Email = email)
        except Course.DoesNotExist or User.DoesNotExist:
            return Response(status = status.HTTP_404_NOT_FOUND)
        try:
            sub = Subscription.objects.get(User = user , Course = course)
        except Subscription.DoesNotExist:
            sub = Subscription(User = user , Course = course)
            sub.save()
        return Response(status = status.HTTP_201_CREATED)
    return Response(status = status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def MakePurchase(request,pk):
    if 'email' in request.session:
        email = request.session['email']
        try:
            product = Product.objects.get(pk = pk)
            user = User.objects.get(Email = email)
        except Product.DoesNotExist or User.DoesNotExist:
            return Response(status = status.HTTP_404_NOT_FOUND)
        try:
            purch = Purchase.objects.get(User = user , Product = product)
        except Purchase.DoesNotExist:
            purch = Purchase(User = user , Product = product)
            purch.save()
        return Response(status = status.HTTP_201_CREATED)
    return Response(status = status.HTTP_401_UNAUTHORIZED)
    

@api_view(['POST'])
def MakeReply(request):
    if 'email' in request.session:
        email = request.session['email']
        try:
            data = json.loads(request.data.get('data'))
        except json.JSONDecodeError:
            return Response({ 'error': 'invalid json'}, status = status.HTTP_400_BAD_REQUEST)        
        user = email
        lesson = data['Lesson']
        time = timezone.now().strftime("%Y-%m-%dT%H:%M:%S+01:00")
        reply = data['Reply']
        content = data['Content']
        try:
            lesson = Lesson.objects.get(pk = lesson)
            user = User.objects.get(Email = user)
            if reply > 0 :
                rep = Reply.objects.get(pk = reply)
        except Lesson.DoesNotExist or User.DoesNotExist or Reply.DoesNotExist:
            return Response(status = status.HTTP_404_NOT_FOUND)
        if reply <= 0:
            rep = Reply(User = user , Lesson= lesson , Time = time , Content = content)
        else:
            rep = Reply(User = user , Lesson= lesson , Time = time ,Reply = rep, Content = content)    
        rep.save()
        return Response(status = status.HTTP_201_CREATED)
    return Response(status = status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def AddTeacher(request):
    if 'email' in request.session:
        email = request.session['email']
        user = User.objects.get(Email = email)
        email_data = request.data.email

        try:
            admin = Admin.objects.get(User = user)
        except Admin.DoesNotExist:
            return Response(status = status.HTTP_401_UNAUTHORIZED)
        
        try:
            user = User.objects.get(Email = email_data)
        except User.DoesNotExist:
            return Response(status = status.HTTP_404_NOT_FOUND)
        teacher = Teacher(User = user)
        teacher.save()
        return Response(status = status.HTTP_201_CREATED)
    return Response(status = status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def ShowLesson(request,pk):
    if 'email' in request.session:
        email = request.session['email']    
        user = User.objects.get(Email = email)
        try:
            lesson = Lesson.objects.get(pk = pk)
        except Lesson.DoesNotExist:
            return Response(status = status.HTTP_404_NOT_FOUND)
        peer_id = lesson.Peer_id
        course = Course.objects.get(pk = peer_id)
        try:
            Subscription.objects.get(User = user , Course = course)
        except Subscription.DoesNotExist:
            try:
                Teacher.objects.get(User=user)
            except Teacher.DoesNotExist:
                try:
                    Admin.objects.get(User=user)
                except Admin.DoesNotExist:
                    return Response(status = status.HTTP_401_UNAUTHORIZED)

        serializer = GetLessonSerializer(lesson)
        return Response({ 'data': serializer.data, 'ressources': GetLessonRessources(lesson)}) 
    return Response(status=status.HTTP_401_UNAUTHORIZED)
    

#-------------------------------------------------------------
#-------------------------------------------------------------
#-------------------------------------------------------------
    
"""Generate Zoom meeting"""
    
API_KEY = 'WfiHMIxqTPezOEDMWbh6Kg'
API_SEC = 'NRGsDqIiuRWFYH6jvb1U65jtJhgKGuzyzx3p'
 
 
def generateToken():
    token = jwt.encode(
 
        # Create a payload of the token containing
        # API Key & expiration time
        {'iss': API_KEY, 'exp': time() + 5000},
 
        # Secret used to generate token signature
        API_SEC,
 
        # Specify the hashing alg
        algorithm='HS256'
    )
    return token
 
 
# JSON data for Post request
meetingdetails = {
    "topic": "The title of your zoom meeting",
    "type": 2,
    "start_time": "2019-06-14T10: 21: 57",
    "duration": "45",
    "timezone": "Europe/Madrid",
    "agenda": "test",
    "recurrence": {
        "type": 1,
        "repeat_interval": 1
    },
    "settings": {
        "host_video": "true",
        "participant_video": "true",
        "join_before_host": "true",
        "mute_upon_entry": "False",
        "watermark": "true",
        "audio": "voip",
        "auto_recording": "cloud"
    }
}
 
"""Create a Zoom meeting""" 
@api_view(['GET'])
def CreateMeeting(request):
    headers = {
        'authorization': 'Bearer ' + generateToken(),
        'content-type': 'application/json'
    }

    r = requests.post(
        f'https://api.zoom.us/v2/users/me/meetings',
        headers=headers, data=json.dumps(meetingdetails))
 
    y = json.loads(r.text)
    join_URL = y["join_url"]
    meetingPassword = y["password"]
    return Response({"uri":join_URL,"pasword":meetingPassword})
    

@api_view(['GET'])
def home(request):
    return Response("Welcome to the Techmology API")

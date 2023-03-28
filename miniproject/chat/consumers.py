import json
from channels.generic.websocket import WebsocketConsumer
from .models import Chat_helper
from asgiref.sync import async_to_sync

class chatconsumer(WebsocketConsumer):
    # connection method start
    def connect(self):
        self.room_name = self.scope["url_route"]['kwargs']['room']
        self.user_name = self.scope["url_route"]['kwargs']['user']

        async_to_sync(self.channel_layer.group_add)(
            self.room_name,
            self.channel_name
        )

        self.accept()
        #imageneration code will come here
        
        Chat_helper(user_name=self.user_name,group_name=self.room_name).save()

        temp = Chat_helper.objects.filter(group_name=self.room_name).values("user_name")

        self.send(text_data=json.dumps({
         'type':"connection_established",
         'message':'you are now connected',
         'inRoom': str(temp).split(' ',1)[1].split(">")[0]
        }))
        

        async_to_sync(self.channel_layer.group_send)(
           self.room_name,
           {
            'type':'new_user',
            'message':f'{self.user_name} joined the chat',
            'user':self.user_name
           }
        )
    # connection method ended
    # 
    # disconnect method start 
    
    def disconnect(self,code):
        a=Chat_helper.objects.filter(user_name=self.user_name)
        a.filter(group_name=self.room_name).delete()
        async_to_sync(self.channel_layer.group_send)(
           self.room_name,
           {
            'type':'user_left',
            'message':f"{self.user_name} left the chat",
            'user':self.scope["url_route"]['kwargs']['user']
           }
        )
        async_to_sync(self.channel_layer.group_discard)( self.room_name ,self.channel_name)

    # disconnect method ended 

    #  recieve method started 
    def receive(self,text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        async_to_sync(self.channel_layer.group_send)(
           self.room_name,
           {
            'type':'chat_message',
            'message':message,
            'user':self.scope["url_route"]['kwargs']['user']
           }
        )
    # recieve method ended 

    # Chat_helper methods

    def chat_message(self,event):
        message=event['message']
        user= event['user']
        self.send(text_data=json.dumps({
            'type':'chat',
            'message':message,
            'user':user
        }))

    # @database_async_to_sync
    # def getusersInRoom(self):
    #     return Chat_helper.objects.filter(group_name=self.room_name)

    def new_user(self,event):
        self.send(text_data=json.dumps(event))

    def user_left(self,event):
        self.send(text_data=json.dumps(event))
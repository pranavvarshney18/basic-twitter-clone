class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;


        //io is a global variable given by the socket cdnjs link
        //we are sending request from user to observer for connection
        this.socket = io.connect('http://localhost:5000');


        if(this.userEmail){
            this.connectionHandler();
        }
    }


    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){
            console.log('connection established using sockets....!');

            //request to join the room and send some data in the room
            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'codeial'
            });

            //after the server acknowledge the joining room request, we will come here
            self.socket.on('user_joined', function(data){
                console.log('a user joined', data);
            })
        });
    }
}

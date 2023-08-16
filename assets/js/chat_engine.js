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
        this.socket.on('connect', function(){
            console.log('connection established using sockets....!');
        });
    }
}

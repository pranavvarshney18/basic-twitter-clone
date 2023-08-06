class ToggleFriendship{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleFriendship();
    }

    toggleFriendship(){
        $(this.toggler).click(function(e){
            let self = this;
            e.preventDefault();

            $.ajax({
                type: 'POST',
                url: $(self).attr('action')
            })
            .done(function(data){
                if(data.data.removeFriend){
                    $(' button', self).html(`Add as Friend`);
                }
                else{
                    $(' button', self).html(`Remove from Friend`);
                }
            })
            .fail(function(errData){
                console.log('error in completing the request for toggling friendship (ajax)');
            })
        })
    }
}
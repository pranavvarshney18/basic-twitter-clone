class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }

    toggleLike(){
        $(this.toggler).click(function(e){
            let self = this;
            e.preventDefault();

            //another way of writing ajax
            $.ajax({
                type: 'POST',
                url: $(self).attr('href')
            })
            .done(function(data){
                let likesCount = parseInt($(self).attr('data-likes'));
                if(data.data.deleted){
                    likesCount -= 1;
                }
                else{
                    likesCount += 1;
                }

                $(self).attr('data-likes', likesCount);
                $(self).html(`${likesCount} Likes`);
            })
            .fail(function(errData){
                console.log('error in completing the request');
            })
        })
    }
}
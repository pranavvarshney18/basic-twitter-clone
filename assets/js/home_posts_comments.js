//we use class for comments because each post has its own comments and therefore there are many submit buttons for comments
class PostComments{
    constructor(postId){
        this.postId = postId;
        this.newCommentForm = $(`#new-${postId}-comments-form`);
        
        this.createComment(postId);


        //call all existing comments for dynamic deletion
        //we know this constructor will be called for all existing posts at home_posts.js -> makeAllPostsDynamic()
        let self = this;
        this.postContainer = $(`#post-${postId}`);
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
        });
        $(' .delete-comment-button-by-post-user', this.postContainer).each(function(){
            self.deleteComment($(this));
        })
    }

    createComment(postId){
        let self = this;
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(this).serialize(),
                success: function(data){
                    let newComment = self.newCommentDom(data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newComment);

                    //call to delete comment
                    self.deleteComment($(' .delete-comment-button', newComment));
                    //call likes functionality
                    new ToggleLike($(' .toggle-like-button', newComment));

                    //add flash message
                    new Noty({
                        theme: 'mint',
                        text: 'new comment created',
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500,
                    }).show();
                },
                error: function(err){
                    console.log(err.responseText);
                }
            })
        });
    }

    newCommentDom(comment){
        return $(`
        <li id="comment-${comment._id}">
            <p>
                
                    <small><a href="/comments/destroy/${comment._id}" class="delete-comment-button">X</a></small>
                

                ${ comment.content} <br>
                <small> ${comment.user.name }</small>
                <br>
                <small>
                   
                        <a href="/likes/toggle?id=${comment._id}&type=Comment" class="toggle-like-button" data-likes="0">
                            0 Likes
                        </a>

                </small>
            </p>
        </li>
        `);
    }


    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'mint',
                        text: 'Comment deleted',
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                },
                error: function(err){
                    console.log(err.responseText);
                }
            })
        });
    }
}
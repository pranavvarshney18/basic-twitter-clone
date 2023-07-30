//we use class for comments because each post has its own comments and therefore there are many submit buttons for comments
class PostComments{
    constructor(postId){
        this.postId = postId;
        this.newCommentForm = $(`#new-${postId}-comments-form`);
        
        this.createComment(postId);
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
                },
                error: function(err){
                    console.log(err.responseText);
                }
            })
        });
    }
}
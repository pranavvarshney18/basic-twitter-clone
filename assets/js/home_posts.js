{
    
    // method to submit form data manually by altering submit button 
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(), //form data is converted into json format and sent to controller
                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#post-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));

                    //call PostComment class
                    new PostComments(data.data.post._id);
                    
                    //add flash message
                    new Noty({
                        theme: 'relax',
                        text: 'New post created',
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500,
                    }).show();
                },
                error: function(err){
                    console.log(err.responseText);
                }
            })
        })
    }

    //method to show post at home page
    let newPostDom = function(post){
        return $(`
            <li id="post-${post._id}"> 
                <p>
                    <small><a class="delete-post-button" href="/posts/destroy/${post._id}">X</a></small>
                    
                    ${post.content}
                    <br>
                    <small>${post.user.name}</small>
                </p>

                <div class="post-comments">
                    <form action="/comments/create" id="new-${post._id}-comments-form" method="POST">
                        <input type="text" name="content" placeholder="add comment.." required>
                        <input type="hidden" name="post" value="${post._id}">
                        <button type="submit">Submit</button>
                    </form>

                    <!-- to view comments  -->
                    <div class="post-comments-list">
                        <ul id="post-comments-${post._id}">
                        
                        </ul>
                    </div>
                </div>
            </li>
        `)
    }

    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: 'Post deleted',
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500,
                    }).show();
                },
                error: function(error){
                    console.log(error.responseText);
                }
            })
        })
    }

    let makeAllPostDynamic = function(){
        let allPosts = $('.delete-post-button');
        for(post of allPosts){
            deletePost(post);
            
            //convert all comments to ajax
            let postId = $(post).attr('href').split('/')[3];
            new PostComments(postId);
        }
    }

    makeAllPostDynamic();
    createPost();
}
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
                    <small><a class="delete-post-button" href="/posts/destroy/${post.id}">X</a></small>
                    
                    ${post.content}
                    <br>
                    <small>${post.user.name}</small>
                </p>

                <div class="post-comments">
                    <form action="/comments/create" method="POST">
                        <input type="text" name="content" placeholder="add comment.." required>
                        <input type="hidden" name="post" value="${post._id}">
                        <button type="submit">Submit</button>
                    </form>

                    <!-- to view comments  -->
                    <div class="post-comments-list">
                        
                    </div>
                </div>
            </li>
        `)
    }

    createPost();
}
{
    // method to submit the form data for new post using AJAX 
    let createPost = function () {
        let newPostForm = $("#new-post-form");
        // console.log(newPostForm);
        newPostForm.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: "post",
                url: "/posts/create",
                data: newPostForm.serialize(),
                success: function (data) {
                    let newPost = newPostDom(data.data.post);
                    // append the new post at the starting of DOM
                    $("#post-list-container>ul").prepend(newPost);
                    // adding click event on a tag
                    deletePost($(" .delete-post-button", newPost));
                    // adding aynchronously comment feature to this post
                    createComment(newPost);
                    // flash message for post created.
                    noty("success", "Post Published!");
                    // clear the form after submit
                    newPostForm.trigger("reset");
                },
                error: function (err) {
                    console.log(err.responseText);
                    // flash message for error
                    noty("error", err.responseText);
                }
            });
        })
    }

    // method to create a post in Dom
    let newPostDom = function (post) {
        return $(`<li id="post-${post._id}">

        <p>
            <!-- delete button only visible to the user who created that post  -->
            
            <small>
                <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
            </small>

            ${post.content}
            <br>
            <small>
                ${post.user.name}
            </small>
        </p>

        <div class="post-comment">
                <form action="/comments/create" class="new-comment-form" method="post">
                    <input type="text" name="content" placeholder="Type Here to add comment...">
                    <input type="hidden" name="post" value="${post._id}">
                    <input type="submit" value="Add Comment">
                </form>
        </div>

        <div class="post-comment-list">
            <ul id="post-comments-${post._id}">
                
            </ul>
        </div>
    </li>`);
    }

    // Method to delete a post asynchronously
    let deletePost = function (deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();

            $.ajax({
                type: "get",
                url: $(deleteLink).prop("href"),
                success: function (data) {
                    $(`#post-${data.data.post_id}`).remove();
                    // flash message for deleting a post
                    noty("success", "Post and associate comments are deleted");
                },
                error: function (err) {
                    console.log(err.responseText);
                    // flash message for error
                    noty("error", err.responseText);
                }
            });

        });
    }

    // adding click events on all a tag(button).
    let allDeleteLinks = $("#post-list-container > ul > li .delete-post-button");
    for (let deleteLink of allDeleteLinks) {
        deletePost(deleteLink);
    }

    // method to submit the form data for new comment using AJAX
    let createComment = function (post) {
        let newCommentForm = $(".new-comment-form", post);

        newCommentForm.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: "post",
                url: "/comments/create",
                data: newCommentForm.serialize(),
                success: function (data) {
                    let newComment = newCommentDom(data.data.comment);
                    $(`#post-comments-${data.data.comment.post._id}`).prepend(newComment);
                    deleteComment($(" .delete-comment-button", newComment));
                    noty("success", "Comment Added!");
                    // clear the form after submit
                    newCommentForm.trigger("reset");
                },
                error: function (err) {
                    console.log(err.responseText);
                    // flash message for error
                    noty("error", err.responseText);
                }
            })
        });

    }

    // method to create a comment in Dom
    let newCommentDom = function (comment) {
        // console.log(`id: ${comment._id}, content: ${comment.content}, postId: ${comment.post._id} userName: ${comment.user.name}`);
        return $(
            `<li id="comment-${comment._id}">
                <p>
                    <small>
                        <a class="delete-comment-button" href="/comments/destroy/?commentId=${comment._id}&postUserId=${comment.post.user}">X</a>
                    </small>

                    ${comment.content}
                    <br>
                    <small>
                        ${comment.user.name}
                    </small>
                </p>
            </li>`
        );
    }

    // method to delete a comment 
    let deleteComment = function (deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();

            $.ajax({
                type: "get",
                url: $(deleteLink).prop("href"),
                success: function (data) {
                    $(`#comment-${data.data.comment_id}`).remove();
                    noty("success", "Comment Deleted!");
                },
                error: function (err) {
                    console.log(err.responseText);
                    // flash message for error
                    noty("error", err.responseText);
                }
            });
        });
    }

    // adding asynchronously comment feature to all the post
    let allPost = $("#post-list-container > ul > li");
    for (let post of allPost) {
        createComment(post);
    }

    // deleting asynchronously comment feature to all the delete buttons in comment
    let allDeleteCommentLinks = $(".delete-comment-button");
    for (let deleteLink of allDeleteCommentLinks) {
        deleteComment(deleteLink);
    }

    // to show flash message 
    let noty = function (typeMsg, message) {
        new Noty({
            theme: "relax",
            text: `${message}`,
            type: `${typeMsg}`,
            layout: "topRight",
            timeout: 1500
        }).show();
    }


    createPost();

}
{
    // console.log("hiiiii");
    let makeFriend = function(){
        let friendButton = $("#friend-button");

        friendButton.click(function(e){
            e.preventDefault();
            
            $.ajax({
                type: "post",
                url: friendButton.attr("href"),
            })
            .done(function(data){
                console.log(data);
                
                if (data.data.friend){
                    friendButton.text("Remove Friend");
                    friendButton.attr("href", `/users/removefriend/?friendshipId=${data.data.friendshipId}&profileUser=${data.data.toUser}`);
                }else{
                    friendButton.text("Add Friend");
                    friendButton.attr("href", `/users/makefriend/?toUser=${data.data.toUser}`);
                }
                // removeFriend(friendButton);
            })
            .fail(function (errData) {
                console.log('error in completing the request', errData);
            });
        });
    }


    

    makeFriend();
}
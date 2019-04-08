$(document).ready(function() {
  var bodyInput = $("#body");
  var cmsForm = $("#cms"); // refers to the similar CMS form back in reply.html
  var authorSelect = $("#author");
  $(cmsForm).on("submit", handleFormSubmit);
  var newAuthId;
  $.ajax({
    url: "/api/users",
    type: 'GET',
    success: function(res) {
       newAuthId = res.firstname + " " + res.lastname;
        
    }
});
  
 
  var url = window.location.search;
  var postId;
  var authorId;
  var updating = false;

  // If we have this section in our url, we pull out the post id from the url
  // In '?post_id=1', postId is 1
  // we are also getting ?author_id=1'
  if (url.indexOf("?post_id=") !== -1 && (url.indexOf("?author_id=") !== -1)) {
    var splitUrl = url.split("=");
    postId = splitUrl[1].split("?")[0];
    authorId = splitUrl[2]
    // Dariell (TA) helped us figure out and understand this portion to correctly get and retrieve the posts and responses related to the posts by author.
  }

  getAuthors();
  function handleFormSubmit(event) {
    event.preventDefault();
    if (
      // !titleInput.val().trim()
     !bodyInput.val().trim()
    ) {
      return;
    }
    // Constructing a newPost object to hand to the database
    var newPost = {  // for the replies
      body: bodyInput
        .val()
        .trim(),
      AuthorId: authorId,
      AuthorName: newAuthId,
      PostId: postId,

    };
    console.log(newPost);

      submitPost(newPost); // submit the reply after with this function, also contains the redirect.

  }
  function submitPost(post) {
    $.post("/api/reply", post, function() {
      window.location.href = "/blog-html";
    });
  }

  function getAuthors() {
    $.get("/api/authors", renderAuthorList);
  }
  function renderAuthorList(data) {
    if (!data.length) {
      window.location.href = "/author-manager-html";
    }
    $(".hidden").removeClass("hidden");
    var rowsToAdd = [];
    for (var i = 0; i < data.length; i++) {
      rowsToAdd.push(createAuthorRow(data[i]));
    }
    authorSelect.empty();
    console.log(rowsToAdd);
    console.log(authorSelect);
    authorSelect.append(rowsToAdd);
    authorSelect.val(authorId);
  }

  // Creates the author options in the dropdown
  function createAuthorRow(author) {
    var listOption = $("<option>");
    listOption.attr("value", author.id);
    listOption.text(author.name);
    return listOption;
  }

});

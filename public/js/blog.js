$(document).ready(function() {
  var nameGottenFromApi;
  $.ajax({
    url: "/api/users",
    type: "GET",
    success: function(res) {
      nameGottenFromApi = res.firstname + " " + res.lastname;
    }
  });

  var blogContainer = $(".blog-container");
  var postCategorySelect = $("#category");

  $(document).on("click", "button.delete", handlePostDelete);
  $(document).on("click", "button.edit", handlePostEdit);
  $(document).on("click", "button.reply", handleReply); // button added for the responses.

  var posts;

  var url = window.location.search;
  var authorId;
  if (url.indexOf("?author_id=") !== -1) {
    authorId = url.split("=")[1];
    getPosts(authorId);
  }
  // If there's no authorId we just g et all posts as usual
  else {
    getPosts();
  }

  // This function grabs posts from the database and updates the view
  function getPosts(author) {
    authorId = author || "";
    if (authorId) {
      console.log("Author Id: " + authorId);
      authorId = "/?author_id=" + authorId;
    }
    $.get("/api/posts" + authorId, function(data) {
      // --------------
      $.get("/api/reply", function(data2) {
        // --------------
        console.log("Posts", data);
        posts = data;
        replyData = data2;

        // for loop getting responses properly --------------------
        for (var i = 0; i < replyData.length; i++) {
          // console.log("Data: " + JSON.stringify(replyData[i].Replies[0].body));
          for (var j = 0; j < replyData.length + 1; j++) {
            // if((replyData[i].Replies[j])){
            // console.log("Post ID:  " + JSON.stringify(replyData[i].Replies[j]));
            // console.log("Response Body: " + JSON.stringify(replyData[i].Replies[j].body));
            console.log("==============================");
            // }
            // console.log("POST ID: " + JSON.stringify(replyData[i].Replies[0].PostId));
          }
        }
        // ---------------//end of for loop getting all responses properly
        if (!posts || !posts.length) {
          displayEmpty(author);
        } else {
          initializeRows(replyData);
          console.log("testing posts here:" + posts);
        }
      });
    });
  }
  // -------------------------------------
  //   $.get("/api/reply" , function(data) {                                      // left here for testing purposes, to make sure we got the right responses back by checking through console.logs.
  // // console.log("Data: " + JSON.stringify(data[0].Replies));
  //           for(var i = 0; i <data.length; i++){
  //           // console.log("Data: " + JSON.stringify(data[i].Replies[0].body));
  //           console.log("Data: " + JSON.stringify(data[i].Replies[0].PostId));
  //           }
  //       });
  // -------------------------------------.
  // InitializeRows handles appending all of our constructed post HTML inside blogContainer
  function initializeRows(replyData) {
    blogContainer.empty();
    var postsToAdd = [];
    var responses = [];

    for (var i = 0; i < posts.length; i++) {
      postsToAdd.push(createNewRow(posts[i]), replyData);
      console.log("Looking at posts: " + JSON.stringify(posts[i]));
      // console.log("Posts to add:" + postsToAdd);
    }
    // });
    for (var i = 0; i < postsToAdd.length - 1; i++) {
      blogContainer.append(postsToAdd[i]);
    }

    console.log("Posts to add:" + postsToAdd);
  }
  // -------------------------------------.

  // This function does an API call to delete posts
  function deletePost(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/posts/" + id
    }).then(function() {
      getPosts(postCategorySelect.val());
    });
  }

  // This function constructs a post's HTML
  function createNewRow(post) {
    var arrayOfResponse = [];
    // =======================================
    // // for loop getting responses properly --------------------
    // console.log("Almost there: " + JSON.stringify(replyData[0].Replies[0].AuthorName))
    for (var i = 0; i < replyData.length; i++) {
      counter = replyData[i].Replies;
      for (var j = 0; j < counter.length; j++) {
        // This is our main functionality for looping through the data of both posts and responses to make sure that we correctly grab the responses related to the post.
        if (
          replyData[i].Replies[j] &&
          post.id == JSON.stringify(replyData[i].Replies[j].PostId) &&
          post.Author.name === replyData[i].Author.name
        ) {
          console.log(
            "Response Body: " + JSON.stringify(replyData[i].Replies[j].body)
          );
          arrayOfResponse.push(
            replyData[i].Replies[j].body +
              "<br><div style='font-size:12px;'>Reply by: " +
              replyData[i].Replies[j].AuthorName
          );
          // arrayOfResponse.push("<h6>Reply by: " + replyData[i].Author.name);
          // console.log("Author Name: " + replyData[i].Author.name); - consoles to check that everything was working just fine
          // console.log("Author Name2 : " + post.Author.name);
          // console.log("Post ID 2 : " + post.id);
          console.log("==============================");
        }
        // console.log("POST ID: " + JSON.stringify(replyData[i].Replies[0].PostId));
      }
    }
    // // ---------------//end of for loop getting all responses properly
    // =======================================
    console.log(post);
    var formattedDate = new Date(post.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");

    var newPostCard = $(
      "<div style='height:800px;border-radius: 10px;border:none;' >"
    );
    newPostCard.addClass("card");

    var newPostCardHeading = $("<div >");
    newPostCardHeading.addClass("card-header");

    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");

    var editBtn = $("<button>");
    editBtn.text("Edit");
    editBtn.addClass("edit btn btn-info offset buttonStyling");

    var newPostTitle = $("<h2>");
    var newPostDate = $("<div id='date'style='opacity: 0.3'>");

    // // --------------------------Respond Button -------------------------
    // var replyBtn = $("<button style='position:absolute;'>");
    var replyBtn = $("<button style=''>");
    replyBtn.text("Reply");
    replyBtn.addClass("btn reply btn-info offset newpost");
    // // --------------------------Respond Button -------------------------

    var newPostCardBody = $("<div> ");
    newPostCardBody.addClass("card-body");

    var newPostBody = $("<h6>");
    var replyBody = $("<div> <h5>Responses: </br>");
    replyBody.addClass("replyBodyClass");
    // ------------------------------------------

    for (var i = 0; i < arrayOfResponse.length; i++) {
      // for loop to go through the responses array and post to the appropriate card.
      var test = "<div class='responseBox'>" + arrayOfResponse[i] + "</div>";
      replyBody.append(test);
    }
    // creating the post card - from the original blog template
    newPostTitle.text(post.title + " ");
    newPostBody.text(post.body);

    newPostTitle.append(newPostDate);
    // -------
    newPostCardHeading.append(deleteBtn);
    newPostCardHeading.append(editBtn);
    newPostCardHeading.append(replyBtn);
    newPostCardHeading.append(newPostTitle);
    newPostCardHeading.append(
      "Written by: " + post.Author.name + "<br>" + formattedDate
    );
    // ----------
    newPostCardBody.append(newPostBody);
    // =-------
    newPostCard.append(newPostCardHeading);
    newPostCard.append(newPostCardBody);
    newPostCard.append("<br/>");
    newPostCard.append(replyBody);

    newPostCard.data("post", post);
    newPostCard.data("author", post.AuthorId);
    return newPostCard;
  }

  // This function figures out which post we want to delete and then calls deletePost
  function handlePostDelete() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    deletePost(currentPost.id);
  }

  // -----------------reply----------------------------
  function handleReply() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");

    var currentAuthorId = $(this)
      .parent()
      .parent()
      .data("author");
    console.log(currentAuthorId);
    window.location.href =
      "/reply-html?post_id=" + currentPost.id + "?author_id=" + currentAuthorId;
    //Attach the data to the button
  }
  // -----------------reply----------------------------
  // This function figures out which post we want to edit and takes it to the appropriate url
  function handlePostEdit() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    window.location.href = "/cms-html?post_id=" + currentPost.id;
  }

  // This function displays a message when there are no posts
  function displayEmpty(id) {
    var query = window.location.search;
    var partial = "";
    if (id) {
      partial = " for Author #" + id;
    }
    blogContainer.empty();
    var messageH2 = $("<h2 style='color:white;'>");
    messageH2.css({ "text-align": "center", "margin-top": "50px" });
    messageH2.html(
      "No posts yet" +
        "<br>" +
        "Click <a href='/cms-html" +
        query +
        "'>here</a>  to create one."
    );
    blogContainer.append(messageH2);
  }

  // ========================================
  function showWiki() {
    $.getJSON(
      "https://en.wikipedia.org/api/rest_v1/page/summary/" + "Community",
      function(data) {
        // wikipedia api to get a summary based on button already created or new buttons added
        info = data.extract;
        console.log(info);
        $(".wiki-section").html(info); //where the summary is shown on the page
      }
    );
    // -----
  }

  window.onload = showWiki;
  $("#search-form").submit(function(event) {
    event.preventDefault();
    console.log(
      "You searched for " +
        $("#search-query")
          .val()
          .trim()
    );
    $.getJSON(
      "https://en.wikipedia.org/api/rest_v1/page/summary/" +
        $("#search-query")
          .val()
          .trim(),
      function(data) {
        // wikipedia api to get a summary based on button already created or new buttons added
        info = data.extract;
        console.log(info);
        $(".wiki-section").html(info); //where the summary is shown on the page
        // ------------
      }
    );

    // =====================Reddit API==========================================

    var queryURL =
      "https://api.reddit.com/search?q=" +
      $("#search-query")
        .val()
        .trim(); // set limit to 10

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      $(".reddit_cards").empty();
      var results = response.data;
      console.log(results); //put response in a variable
      if (
        $("#search-query")
          .val()
          .trim() != ""
      ) {
        $(".reddit_cards").empty();
        for (var i = 0; i < 25; i++) {
          var title = results.children[i].data.title;
          var url = results.children[i].data.url;

          var image = results.children[i].data.thumbnail;
          if (image === "default" || image === "self") {
            image = "assets/images/reddit-logo.svg";
          }

          var redditCard = $(
            "<tr id=" +
              url +
              '><td><h6><a href="' +
              url +
              '"target="_blank">' +
              title +
              "</a></h6><p>" +
              " " +
              '</p></td><td class="d-flex justify-content-end"><img src=' +
              image +
              ' style="height:90px; width:90px;"></td></tr>'
              + "</br>----------------------------"
          );
          $(".wiki-section").append(redditCard);
        }
      } // if statement
      else {
        console.log("yes");
      }

      console.log(results.children[14].data.url);
    });

    // =====================Reddit API==========================================
  });
});

$(document).ready(function() {
  var nameGottenFromApi;  
  $.ajax({
    url: "/api/users",
    type: 'GET',
    success: function(res) {
       nameGottenFromApi = res.firstname + " " + res.lastname;
       authorId = res.id;
        

  var nameInput = nameGottenFromApi;
  console.log("my data2: " + nameInput)
  var authorList = $("tbody");
  var authorContainer = $(".author-container");
  $(document).on("submit", "#author-form", handleAuthorFormSubmit);
  $(document).on("click", ".delete-author", handleDeleteButtonPress);
  // Getting the initial list of Authors
  getAuthors();
  function handleAuthorFormSubmit(event) {
    event.preventDefault();
    // if (!nameInput.val().trim().trim()) {
    //   return;
    // }
    upsertAuthor({
      name: nameInput
        
    });
  }

  function upsertAuthor(authorData) {
    $.post("/api/authors", authorData)
      .then(getAuthors);
  }

  function createAuthorRow(authorData) {
    var newTr = $("<tr>");
    newTr.data("author", authorData);
    newTr.append("<td>" + authorData.name + "</td>");
    if (authorData.Posts) {
      newTr.append("<td> " + authorData.Posts.length + "</td>");
    } else {
      newTr.append("<td>0</td>");
    }
    newTr.append("<td><a href='/blog-html?author_id=" + authorData.id + "'>Go to Posts</a></td>");
    newTr.append("<td><a href='/cms-html?author_id=" + authorData.id + "'>Create a Post</a></td>");
    newTr.append("<td><a style='cursor:pointer;color:red' class='delete-author'>Delete Author</a></td>");
    return newTr;
  }

  // Function for retrieving authors and getting them ready to be rendered to the page
  function getAuthors() {
    $.get("/api/authors", function(data) {
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createAuthorRow(data[i]));
      }
      renderAuthorList(rowsToAdd);
      nameInput;
    });
  }


  function renderAuthorList(rows) {
    authorList.children().not(":last").remove();
    authorContainer.children(".alert").remove();
    if (rows.length) {
      console.log(rows);
      authorList.prepend(rows);
    }
    else {
      renderEmpty();
    }
  }

  function renderEmpty() {
    var alertDiv = $("<div>");
    alertDiv.addClass("alert alert-danger");
    alertDiv.text("You must create an Author before you can create a Post.");
    authorContainer.append(alertDiv);
  }

  function handleDeleteButtonPress() {
    var listItemData = $(this).parent("td").parent("tr").data("author");
    var id = listItemData.id;
    $.ajax({
      method: "DELETE",
      url: "/api/authors/" + authorId
    })
      .then(getAuthors);
  }

}
});
});

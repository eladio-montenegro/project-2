// Get references to page elements
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");

// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function(example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/examples",
      data: JSON.stringify(example)
    });
  },
  getExamples: function() {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  deleteExample: function(id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  API.getExamples().then(function(data) {
    var $examples = data.map(function(example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function() {
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);

$(document).ready(function() {
  // displayRecipes();
  $("#search").click(function(e) {
    e.preventDefault();
    clearFeed();
    displayRecipes();
  });
});

function clearFeed() {
  $("#recipeResults").html(" ");
}

function link(keyword) {
  return (
    "https://api.yummly.com/v1/api/recipes?_app_id=e117b611&_app_key=41a3c4bb5d793a1d5733392e96218eab&q=" +
    keyword
  );
}

function keyword() {
  return $("#userKeyword").val();
}

function generateThumbnailFor(recipe) {
  var imageUrl = recipe.imageUrlsBySize[90];
  var title = recipe.sourceDisplayName;
  var id = recipe.id;


  var imageTag = "<img src='" + imageUrl + "'>";
  var yumUrl = "https://www.yummly.com/recipe/" + id + "";

  var recipeThumbnail =
    "<div class='col-sm-6 col-md-4'><div class='thumbnail'>" +
    imageTag +
    "<div class='caption'><a target='_blank' href='" +
    yumUrl +
    "'><h4>" +
    title +
    "</h4></a></div></div></div>";
  $("#recipeResults").append(recipeThumbnail);
}

function displayRecipes() {
  $.ajax({
    url: link(keyword()),
    type: "GET",
    dataType: "JSON"
  }).then(function(yumData) {
    yumData.matches.forEach(function(recipe) {
      generateThumbnailFor(recipe);
    });
  });
}
//http://api.yummly.com/v1/api/recipe/French-Onion-Soup-The-Pioneer-Woman-Cooks-_-Ree-Drummond-41364?_app_id=e117b611&_app_key=41a3c4bb5d793a1d5733392e96218eab

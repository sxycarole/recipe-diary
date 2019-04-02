$('#recipe-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"
  }
  $.get('/recipes?' + search, function(data) {
    $('#recipe-grid').html('');
    data.forEach(function(recipe) {
      $('#recipe-grid').append(`
        <div class="col-md-3 col-sm-6">
          <div class="thumbnail">
            <img src="${ recipe.image }">
            <div class="caption">
              <h4>${ recipe.name }</h4>
            </div>
            <p>
              <a href="/recipes/${ recipe._id }" class="btn btn-primary">More Info</a>
            </p>
          </div>
        </div>
      `);
    });
  });
});

$('#recipe-search').submit(function(event) {
  event.preventDefault();
});
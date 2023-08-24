// Algolia client. Mandatory to instantiate the Helper.

// These secret should be hidden
const APPLICATION_ID = 'T6YWIILD53';
const API_KEY_SEARCH = 'fd5a18d06a2881e28b3fc3e02ffec21a';
const RESTAURANTS_INDEX = 'restaurants_demo';


var algolia = algoliasearch(APPLICATION_ID, API_KEY_SEARCH);

// Algolia Helper
var helper = algoliasearchHelper(algolia, RESTAURANTS_INDEX, {
  disjunctiveFacets: ['payment_options', 'food_types'],
  hitsPerPage: 5,
  maxValuesPerFacet: 7,
  getRankingInfo: true
});

var userLocation = null;

const successCallback = (position) => {
  console.log(position);
  loc = position.coords;
  helper.setQueryParameter('aroundLatLng', `${loc.latitude}, ${loc.longitude}`);
  helper.search();
};

const errorCallback = (error) => {
  console.log(error);
  helper.setQueryParameter('aroundLatLngViaIP', true);
  helper.search();
};

navigator.geolocation.getCurrentPosition(successCallback, errorCallback);


// Bind the result event to a function that will update the results
helper.on("result", searchCallback);

// The different parts of the UI that we want to use in this example
var $inputfield = $("#search-box");
var $hits = $('#hits');
var $hitsFound = $('#hits-found');
var $foodTypesFacet = $('#food-types-facet');
var $paymentOptionsFacet = $('#payment-options-facet');
var $buttonShowMore = $('#button-show-more');

var showMoreInProgress = false;

$foodTypesFacet.on('click', handleFacetClick);
$paymentOptionsFacet.on('click', handleFacetClick);
$buttonShowMore.on('click', handleShowMoreClick);

// When there is a new character input:
// - update the query
// - trigger the search
$inputfield.keyup(function(e) {
  helper.setQuery($inputfield.val()).search();
});

// Result event callback
function searchCallback(content) {
  if (content.hits.length === 0) {
    // If there is no result we display a friendly message
    // instead of an empty page.
    $hits.empty().html("No results :(");
    return;
  }

	// Hits/results rendering
    renderHits($hits, content);
    renderFacets($foodTypesFacet, $paymentOptionsFacet, content);
}

function renderHits($hits, results) {
    // Scan all hits and display them
    const hitsFound = `${results.nbHits} result(s) found&nbsp;<span>in ${results.processingTimeMS / 1000} second(s)</span>`
    $hitsFound.html(hitsFound);
  
    let hits = '';
    for (const item of results.hits) {
        let url = item.image_url;
        // Little trick => use unsplash random restaurant pictures
        url = url.replace('www.opentable.com/img/restimages/', 'source.unsplash.com/random/200x200?restaurant=');
        hits += '<div class="row hit-item">' + 
        '    <div class="col-2 hit-img">' + 
        `    <img src="${url}">` + 
        '    </div>' + 
        '    <div class="col-10">' + 
        '    <ul class="list-group list-card">' + 
        '        <li class="list-group-item">' + 
        `        <div class="hit-name">${item.name}</div>` + 
        '        <div class="hit-rating-inline">' + 
        `            <div class="hit-rating-score">${item.stars_count.toFixed(1)}</div>` + 
        '            <div class="rating hit-rating-star">' + 
        `            <div class="rating-bg" style="width: calc(${item.stars_count}/5*100%); "></div>` + 
        '            <svg><use xlink:href="#fivestars" /></svg>' + 
        '            </div>' + 
        `            <div class="hit-reviews">&nbsp;(${item.reviews_count} reviews)</div>` + 
        '        </div>' + 
        `        <div class="hit-desc">${item.food_type} | ${item.neighborhood} | ${item.price_range}</div>` + 
        '        </li>' + 
        '    </ul>' + 
        '    </div>' + 
        '</div>';
    
    }
  if (showMoreInProgress) {
    // Append Mode
    hits = $hits.html() + hits;
    showMoreInProgress = false
  }
  $hits.html(hits);

}

function renderFacets($foodTypesFacet, $paymentOptionsFacet, results) {
    // We use the disjunctive facets attribute.

    let foodTypesFacet = '';
    const data = results.getFacetValues('food_types');
    for (const item of data) {
        foodTypesFacet +=    '' +
        `    <li class="list-group-item filter-inline ${item.isRefined?'active':''}">` +
        `      <div class="col-9" data-attribute="food_types" data-value="${item.name}">${item.name}</div><div class="col-3 facet-values">${item.count}</div>` +
        '    </li>';
    }   
    $foodTypesFacet.html(foodTypesFacet);

    let paymentOptionsFacet = '';
    const data2 = results.getFacetValues('payment_options');
    for (const item of data2) {
        paymentOptionsFacet +=    '' +
        `    <li class="list-group-item filter-inline ${item.isRefined?'active':''}">` +
        `      <div class="col-10" data-attribute="payment_options" data-value="${item.name}">${item.name}</div>` +
        '    </li>';
        
    }   
    $paymentOptionsFacet.html(paymentOptionsFacet);

}
  

function handleFacetClick(e) {
    e.preventDefault();
    var target = e.target;
    var attribute = target.dataset.attribute;
    var value = target.dataset.value;
    // Because we are listening in the parent, the user might click where there is no data
    if(!attribute || !value) return;
    // The toggleRefine method works for disjunctive facets as well
    helper.toggleRefine(attribute, value).search();
}

function handleShowMoreClick(e) {
    showMoreInProgress = true; // Append mode (quick and dirty)
    helper.nextPage().search();
}
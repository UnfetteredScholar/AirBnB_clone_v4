const selectedAmenities = {};
const selectedStates = {};
const selectedCities = {};
// const HOST = '0.0.0.0';
const HOST = '127.0.0.1';
$(document).ready(init);

function init () {
  $('.amenities .popover input').change(checkAmenityAction);
  $('.state_input').change(checkStateAction);
  $('.city_input').change(checkCityAction);
  checkApiStatus();
  fetchAllPlaces();
  $('button').click(filterPlaces);
}

function checkAmenityAction () {
  if ($(this).is(':checked')) {
    selectedAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
  } else if ($(this).is(':not(:checked)')) {
    delete selectedAmenities[$(this).attr('data-id')];
  }
  displayAmenities(selectedAmenities);
}

function checkStateAction () {
  if ($(this).is(':checked')) {
    selectedStates[$(this).attr('data-id')] = $(this).attr('data-name');
  } else if ($(this).is(':not(:checked)')) {
    delete selectedStates[$(this).attr('data-id')];
  }
  displayStatesCities(selectedStates, selectedCities);
}

function checkCityAction () {
  if ($(this).is(':checked')) {
    selectedCities[$(this).attr('data-id')] = $(this).attr('data-name');
  } else if ($(this).is(':not(:checked)')) {
    delete selectedCities[$(this).attr('data-id')];
  }
  displayStatesCities(selectedStates, selectedCities);
}

function displayAmenities (selectedAmenities) {
  const amenities = Object.values(selectedAmenities).sort();
  $('.amenities h4').text(amenities.join(', '));
}

function displayStatesCities (selectedStates, selectedCities) {
  let items;
  const states = Object.values(selectedStates);
  const cities = Object.values(selectedCities);
  items = states.concat(cities);
  items = items.sort();
  $('.locations h4').text(items.join(', '));
}

function checkApiStatus () {
  const url = `http://${HOST}:5001/api/v1/status/`;
  $.get(url, (data) => {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
      console.log('Available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
}

function fetchAllPlaces () {
  const url = `http://${HOST}:5001/api/v1/places_search/`;
  $.ajax({
    url,
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({}),
    type: 'POST',
    dataType: 'json',
    success: displayPlaces,
    error: (error) => {
      console.log(error);
    }
  });
}

function filterPlaces () {
  const url = `http://${HOST}:5001/api/v1/places_search/`;
  $.ajax({
    url,
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
      states: Object.keys(selectedStates),
      cities: Object.keys(selectedCities),
      amenities: Object.keys(selectedAmenities)
    }),
    type: 'POST',
    dataType: 'json',
    success: displayPlaces,
    error: (error) => {
      console.log(error);
    }
  });
}

function displayPlaces (response) {
  $('section.places').empty();
  for (const place of response) {
    const article = ['<article>',
      '<div class="title_box">',
      `<h2>${place.name}</h2>`,
      `<div class="price_by_night">$${place.price_by_night}</div>`,
      '</div>',
      '<div class="information">',
      `<div class="max_guest">${place.max_guest} Guest(s)</div>`,
      `<div class="number_rooms">${place.number_rooms} Bedroom(s)</div>`,
      `<div class="number_bathrooms">${place.number_bathrooms} Bathroom(s)</div>`,
      '</div>',
      '<div class="user">',
      '</div>',
      '<div class="description">',
      `${place.description}`,
      '</div>',
      '</article>'];
    $('section.places').append(article.join(''));
  }
}

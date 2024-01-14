const selectedAmenities = {};
// const HOST = '0.0.0.0';
const HOST = '127.0.0.1';
$(document).ready(init);

function init () {
  $('.amenities .popover input').change(checkAction);
  checkApiStatus();
  filterPlaces();
}

function checkAction () {
  if ($(this).is(':checked')) {
    selectedAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
  } else if ($(this).is(':not(:checked)')) {
    delete selectedAmenities[$(this).attr('data-id')];
  }
  displayAmenities(selectedAmenities);
}

function displayAmenities (selectedAmenities) {
  const amenities = Object.values(selectedAmenities).sort();
  $('.amenities h4').text(amenities.join(', '));
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

function filterPlaces () {
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

function displayPlaces (response) {
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

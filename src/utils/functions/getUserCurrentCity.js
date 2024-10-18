export const getUserCurrentCity = async (position) => {
  const apiKey = process.env.REACT_APP_MAP_KEY;
  const apiUrl = 
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.lat},${position.lng}&key=${apiKey}`;

  const json = await fetch(apiUrl);
  const data = await json.json();
  const compound_code = data.plus_code.compound_code;

  return compound_code;
}
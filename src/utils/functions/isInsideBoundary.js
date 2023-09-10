export const isInsideBoundary = (lat, lon, bounds) => {
  if (!bounds) return false;

  const isLngInsideBoundary =  
    lon > Object.values(bounds)[1].lo && lon < Object.values(bounds)[1].hi
  const isLatInsideBoundary = 
    lat > Object.values(bounds)[0].lo && lat < Object.values(bounds)[0].hi
  return isLngInsideBoundary && isLatInsideBoundary;
}
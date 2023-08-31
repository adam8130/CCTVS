export const isInsideBoundary = (lat, lon, bounds) => {
  const isLngInsideBoundary =  lon > bounds.Ja.lo && lon < bounds.Ja.hi
  const isLatInsideBoundary = lat > bounds.Va.lo && lat < bounds.Va.hi
  return isLngInsideBoundary && isLatInsideBoundary;
}
export function calculateDistance(
  latitude1,
  longitude1,
  latitude2,
  longitude2
) {
  const earthRadius = 6371;

  const latitudeDifference =
    ((latitude2 - latitude1) * Math.PI) / 180;

  const longitudeDifference =
    ((longitude2 - longitude1) * Math.PI) / 180;

  const firstLatitude =
    (latitude1 * Math.PI) / 180;

  const secondLatitude =
    (latitude2 * Math.PI) / 180;

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDifference / 2) ** 2;

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

export function formatDistance(distanceInKilometres) {
  if (
    distanceInKilometres === undefined ||
    distanceInKilometres === null
  ) {
    return '';
  }

  if (distanceInKilometres < 1) {
    return `${Math.round(
      distanceInKilometres * 1000
    )} m away`;
  }

  return `${distanceInKilometres.toFixed(1)} km away`;
}

export function findNearestRetrievalLocation(
  userLatitude,
  userLongitude,
  retrievalLocations
) {
  if (!retrievalLocations.length) {
    return null;
  }

  return retrievalLocations.reduce(
    (nearestLocation, currentLocation) => {
      const currentDistance = calculateDistance(
        userLatitude,
        userLongitude,
        currentLocation.latitude,
        currentLocation.longitude
      );

      if (
        !nearestLocation ||
        currentDistance < nearestLocation.distance
      ) {
        return {
          ...currentLocation,
          distance: currentDistance,
        };
      }

      return nearestLocation;
    },
    null
  );
}
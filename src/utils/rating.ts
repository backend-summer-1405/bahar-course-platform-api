type Rating = {
  rating: number;
};

const calculateRating = (ratings: Rating[]) => {
  const ratingsCount = ratings.length;

  const averageRating =
    ratingsCount > 0
      ? ratings.reduce((sum, item) => sum + item.rating, 0) /
        ratingsCount
      : null;

  return {
    averageRating,
    ratingsCount,
  };
};

export { calculateRating };
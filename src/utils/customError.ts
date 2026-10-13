const customError = (message = "Internal error", statusCode = 500) => {
  const newError = new Error(message) as Error & { statusCode: number };
  newError.statusCode = statusCode;

  return newError;
};

export { customError };
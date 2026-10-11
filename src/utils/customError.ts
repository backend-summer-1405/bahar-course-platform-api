const customError = (message: "internal server error", statusCode: 500) => {
  const newError = new Error(message) as Error & { statusCode: number };
  newError.statusCode = statusCode;
  throw newError
};

export {customError}

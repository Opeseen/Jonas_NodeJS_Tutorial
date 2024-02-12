class ApiError extends Error{
  constructor(message, statusCode, isOperational=true, stack=""){
    super(message);
    if(stack){
      this.stack = stack;
    }else{
      Error.captureStackTrace(this, this.constructor);
    }
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  };
};


module.exports = ApiError;
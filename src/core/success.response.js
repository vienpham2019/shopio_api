"use strict";

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  OK: "Success",
  CREATED: "Created!",
};

class SuccessResponse {
  constructor({
    message = ReasonStatusCode.OK,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metadata = {},
  }) {
    this.message = message;
    this.statusCode = statusCode;
    this.reasonStatusCode = reasonStatusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.statusCode).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message = ReasonStatusCode.CREATED,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    metadata,
    options = {},
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}

module.exports = {
  OK,
  CREATED,
};

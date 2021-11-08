import express from "express";

function exceptionCatcher(
  err: Error,
  req: express.Request,
  res: express.Response
) {
  console.error(err.stack);
  return res.status(500).json({
    err: err.message,
  });
}

export default exceptionCatcher;

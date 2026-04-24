import { fail } from "../http/response.js";

export function errorHandler(err, _req, res, _next) {
  const status = Number(err?.status || 500);

  if (err?.type === "validation") {
    return res.status(422).json(
      fail("validation.failed", null, {
        errors: err.errors ?? {},
      })
    );
  }

  // eslint-disable-next-line no-console
  console.error(err);

  return res.status(status).json(fail(err?.messageKey || "error.unexpected"));
}


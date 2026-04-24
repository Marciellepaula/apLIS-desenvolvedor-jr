import { ZodError } from "zod";

export function validate(schema) {
  return (req, _res, next) => {
    try {
      req.validated = schema.parse({
        params: req.params,
        query: req.query,
        body: req.body,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = {};
        for (const issue of err.issues) {
          const key = issue.path.join(".") || "body";
          errors[key] = "validation.invalid";
        }
        return next({ type: "validation", errors });
      }
      return next(err);
    }
  };
}


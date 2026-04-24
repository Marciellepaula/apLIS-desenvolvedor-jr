export function ok(data, message = "") {
  return { success: true, data, message };
}

export function created(data, message = "") {
  return { success: true, data, message };
}

export function fail(message, data = null, extra = undefined) {
  return { success: false, data, message, ...(extra ?? {}) };
}


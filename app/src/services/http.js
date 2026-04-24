import axios from "axios";

export const http = axios.create({
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});


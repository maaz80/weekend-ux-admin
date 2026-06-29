import { clearAdminToken, getAdminToken } from "./auth.js";

const PUBLIC_WRITE_PATHS = new Set([
     "/api/admin/login",
     "/api/send-otp",
     "/api/submit-booking"
]);
const SAFE_METHODS = new Set([
     "GET",
     "HEAD",
     "OPTIONS"
]);

const getRequestMethod = (input, init) => {
     if (init?.method) {
          return init.method.toUpperCase();
     }

     if (input instanceof Request) {
          return input.method.toUpperCase();
     }

     return "GET";
};

const getRequestPath = (input) => {
     const rawUrl = input instanceof Request ? input.url : input;
     const url = new URL(rawUrl, window.location.origin);

     return url.pathname;
};

const needsAdminKey = (input, init) => {
     const method = getRequestMethod(input, init);

     if (SAFE_METHODS.has(method)) {
          return false;
     }

     const path = getRequestPath(input);

     return path.startsWith("/api/") && !PUBLIC_WRITE_PATHS.has(path);
};

const withAdminHeader = (input, init = {}) => {
     const headers = new Headers(init.headers || (input instanceof Request ? input.headers : undefined));
     const adminToken = getAdminToken();

     if (adminToken) {
          headers.set("Authorization", `Bearer ${adminToken}`);
     }

     return {
          ...init,
          headers
     };
};

const withNoCacheHeader = (init = {}) => {
     const headers = new Headers(init.headers);
     headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
     headers.set("Pragma", "no-cache");
     headers.set("Expires", "0");
     return {
          ...init,
          headers
     };
};

export const installAdminFetch = () => {
     const originalFetch = window.fetch.bind(window);

     window.fetch = async (input, init = {}) => {
          let finalInput = input;
          let finalInit = init;
          const method = getRequestMethod(input, init);

          if (method === "GET" || method === "HEAD") {
               // 1. Add cache-busting query parameter
               if (typeof input === "string") {
                    try {
                         const url = new URL(input, window.location.origin);
                         url.searchParams.set("_t", Date.now().toString());
                         finalInput = url.toString();
                    } catch (e) {
                         const separator = input.includes("?") ? "&" : "?";
                         finalInput = `${input}${separator}_t=${Date.now()}`;
                    }
               } else if (input instanceof Request) {
                    try {
                         const url = new URL(input.url, window.location.origin);
                         url.searchParams.set("_t", Date.now().toString());
                         finalInput = new Request(url.toString(), input);
                    } catch (e) {
                         console.error("Failed to append cache buster to Request", e);
                    }
               }
               // 2. Add no-cache headers
               finalInit = withNoCacheHeader(init);
          }

          const requestInit = needsAdminKey(finalInput, finalInit) ? withAdminHeader(finalInput, finalInit) : finalInit;
          const response = await originalFetch(finalInput, requestInit);

          if (response.status === 401 || response.status === 503) {
               clearAdminToken();

               if (window.location.pathname !== "/login") {
                    window.location.assign("/login");
               }
          }

          return response;
     };
};

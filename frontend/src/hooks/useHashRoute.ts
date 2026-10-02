import { useCallback, useEffect, useState } from "react";

export type Route = "home" | "digit-island";

function parse(hash: string): Route {
  return hash.replace(/^#\/?/, "") === "digit-island" ? "digit-island" : "home";
}

/** Tiny hash router: two pages do not need a routing library. */
export function useHashRoute(): [Route, (route: Route) => void] {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash));

  useEffect(() => {
    const onChange = () => {
      setRoute(parse(window.location.hash));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = useCallback((next: Route) => {
    window.location.hash = next === "home" ? "/" : `/${next}`;
  }, []);

  return [route, navigate];
}

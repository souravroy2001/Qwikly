import { useEffect, useState } from "react";

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  function fetchData() {
    setLoading(true);
    fetch(url)
      .then((response) => response.json())
      .then((data: T) => setData(data))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchData();

    return () => {
      setData(null);
      setLoading(false);
      setError(null);
    };
  }, [url]);

  return { data, loading, error };
}

export default useFetch;

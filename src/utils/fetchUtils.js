/**
 * Fetch with timeout and retry logic
 */
export async function fetchWithTimeout(url, options = {}, timeout = 15000, retries = 1) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (attempt === retries) {
        console.error(`Fetch failed after ${retries + 1} attempts:`, error.message);
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
}

export async function safeJsonParse(response) {
  try {
    return await response.json();
  } catch (error) {
    console.error('JSON parse error:', error);
    return null;
  }
}
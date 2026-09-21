const BRIDGE = 'http://localhost:8888';

async function request(path) {
  const res = await fetch(`${BRIDGE}${path}`);
  let data = null;
  try { data = await res.json(); } catch { throw new Error('Local bridge returned an invalid response.'); }
  if (!res.ok || !data.success) throw new Error(data?.message || 'Local bridge failed');
  return data;
}

export function runLocalTweak(name) {
  return request(`/api/tweak?name=${encodeURIComponent(name)}`);
}

export function applyAllTweaks() {
  return request('/api/apply-all');
}

export function getBridgeHealth() {
  return request('/api/health');
}

export function getMetrics() {
  return request('/api/metrics');
}

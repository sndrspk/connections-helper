export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Only allow /puzzle path
    if (url.pathname !== '/puzzle') {
      return new Response('Not found', { status: 404 });
    }

    const today = new Date().toISOString().slice(0, 10);
    const nytUrl = `https://www.nytimes.com/svc/connections/v2/${today}.json`;

    const response = await fetch(nytUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=300',
      },
    });
  },
};

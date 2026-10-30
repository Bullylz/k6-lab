import http from 'k6/http';
import { check, group, sleep } from 'k6';
const BASE_URL = 'https://quickpizza.grafana.com';
const PARAMS = { headers: { 'Content-Type': 'application/json', Authorization: 'token abcdef0123456789' } };
export function journey() {
  group('home', () => { const r = http.get(`${BASE_URL}/`); check(r, { 'home page is 200': (x) => x.status === 200 }); });
  sleep(1 + Math.random() * 2);
  group('quotes', () => { const r = http.get(`${BASE_URL}/api/quotes`); check(r, { 'quotes are listed': (x) => x.status === 200 && x.json('quotes').length > 0 }); });
  sleep(1);
  group('recommendation', () => { const r = http.post(`${BASE_URL}/api/pizza`, JSON.stringify({ mustBeVegetarian: true }), PARAMS); check(r, { 'recommendation is 200': (x) => x.status === 200, 'pizza has a name': (x) => x.json('pizza.name') !== undefined }); });
  sleep(1 + Math.random() * 2);
}

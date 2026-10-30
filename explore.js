import http from 'k6/http';
const BASE_URL = 'https://quickpizza.grafana.com';
const PARAMS = { headers: { Authorization: 'token abcdef0123456789' } };
export default function () {
  console.log(http.get(`${BASE_URL}/api/ingredients/topping`, PARAMS).body);
  console.log(http.get(`${BASE_URL}/api/tools`, PARAMS).body);
}

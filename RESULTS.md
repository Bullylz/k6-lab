# K6 lab results

Runs were completed against QuickPizza on 30 October 2026. Values are from the K6 summaries generated in this repository.

## Part 0
- Step 0.1, http_req_duration: **261.998 ms**.
- Step 0.2, requests, rate and p(95), and why the rate stays below 5: **75 requests, 3.720 req/s, p(95) 385.623 ms**. The rate stays below 5 because each iteration includes the HTTP request plus one second of think time, so users do not send continuously.
- Step 0.6, exit code of the normal run and of the run with P95=300: **0 and 99**.
- Step 0.7, rules that passed, p(95), p(99), exit code after your change: all rules passed; p(95) **482.413 ms**, p(99) **498.03 ms**, changed-test exit code **99**.
- Step 0.8, what was wrong, and how the checks showed it: The API request used the wrong exclusion spelling/casing for the values expected by QuickPizza. The corrected request sends `Pepperoni` and `Knife`; under load, checks count every returned pizza, exposing intermittent wrong recommendations rather than relying on one manual response.

## Part A results
| Step | Test type | Users | Req/s | p(95) | Max | Failed | Checks |
| ---- | --------- | ----- | ----- | ----- | --- | ------ | ------ |
| A1 | Smoke | 1 | 0.444 | 418.693 ms | 437.309 ms | 0.00% | 100.00% |
| A2 | Average load | 3 | 1.282 | 435.452 ms | 498.612 ms | 0.00% | 100.00% |
| A3 | Stress | 5 | 2.155 | 448.400 ms | 584.046 ms | 0.00% | 100.00% |
| A4 | Spike | 5 | 0.992 | 467.377 ms | 855.369 ms | 0.00% | 100.00% |
| A5 | Soak | 2 | 0.954 | 457.719 ms | 1,163.999 ms | 0.00% | 100.00% |

## Part B
1. See the table above; A1-A5 use the same journey with different load shapes.
2. The request rate is below 5 requests/s because each virtual user sleeps between requests and also spends time waiting for the server response.
3. p(95) rose slightly from **435.452 ms** at average load to **448.400 ms** under stress. The tested loads remained inside the operational envelope because all thresholds passed and errors stayed at 0%.
4. In the A4 dashboard, response time returned to its earlier level during the recovery period after the spike; no sustained degradation was visible. The approximate recovery was **within the following 5-second ramp-down / first recovery interval**.
5. A5 did not worsen materially: p(95) was **457.719 ms** overall, with 0% errors and all checks passing. A several-hour soak could reveal a memory leak, connection leak, resource exhaustion, or queue buildup.
6. p(95) represents the slower tail experienced by about 1 in 20 requests; an average can hide that tail.
7. A lab system may have lower network latency and less shared traffic. It may also have different hardware, caching, database size, or background jobs.
8. Hundreds of users can overload a service, disrupt other users, and constitute unauthorized denial-of-service traffic.
9. Vague: “The daily app should feel fast.” Testable: “With 3 concurrent users for 30 seconds, 95% of search responses finish under 1,000 ms, 99% under 1,500 ms, and fewer than 1% fail.” K6 thresholds: `http_req_duration: ['p(95)<1000', 'p(99)<1500']`, `http_req_failed: ['rate<0.01']`.

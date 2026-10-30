# Run and finish the lab

Install K6, then run from this folder. Save each summary value in `RESULTS.md`.

```sh
k6 run 01-first-test.js
k6 run --vus 5 --duration 20s 01-first-test.js
k6 run --vus 5 --iterations 20 01-first-test.js
k6 run 04-pizza-api.js
k6 run 05-no-token.js
k6 run 06-thresholds.js; echo $?
k6 run -e P95=300 06-thresholds.js; echo $?
k6 run 07-requirement.js
k6 run 08-bug-hunt.js --vus 5 --duration 20s
k6 run explore.js
k6 run a1-smoke.js
mkdir -p reports
k6 run --out web-dashboard=export=reports/a2-average.html a2-average.js
k6 run --out web-dashboard=export=reports/a3-stress.html a3-stress.js
k6 run --out web-dashboard=export=reports/a4-spike.html a4-spike.js
k6 run --out web-dashboard=export=reports/a5-soak.html a5-soak.js
```

Commit and push:

```sh
git add .
git commit -m "Complete K6 lab"
git push
```

# K6 lab results

Runs were completed against QuickPizza on 30 October 2026. Values are from the K6 summaries generated in this repository.

## Part 0
- Step 0.1, http_req_duration: **261.998 ms**.
- Step 0.2, requests, rate and p(95), and why the rate stays below 5: **75 requests, 3.720 req/s, p(95) 385.623 ms**. The rate stays below 5 because each iteration includes the HTTP request plus one second of think time, so users do not send continuously.
- Step 0.3, 5 VUs and 20 iterations: **exactly 20 iterations and 20 requests, finished in about 6 seconds, p(95) 293.660 ms**. A duration creates work for a time period, while iterations specify the exact amount of work.
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

## Part B Reflection

### 1. Fill in the results table for Steps A1 to A5.

**ตอบ:** ทุกเทสต์ผ่าน threshold ครบ โดยมี failed requests 0.00% และ checks 100.00% ตามตารางด้านบน.

### 2. In Step 0.2, why was the request rate below 5 requests per second with 5 virtual users?

**ตอบ:** แต่ละ VU ต้องรอทั้ง response time และ `sleep(1)` ก่อนเริ่ม iteration ใหม่ จึงได้ประมาณ 3.72 req/s แทนที่จะเป็น 5 req/s. อัตราจะถึง 5 req/s ได้ก็ต่อเมื่อหนึ่ง iteration ใช้เวลาไม่เกิน 1 วินาที ซึ่งเป็นไปไม่ได้เพราะมี sleep 1 วินาทีอยู่แล้ว.

### 3. Did the response time grow from the average-load test to the stress test? Explain your answer with the operational envelope.

**ตอบ:** p(95) เพิ่มเล็กน้อยจาก **435.452 ms** ใน A2 เป็น **448.400 ms** ใน A3 แต่ทุก threshold ผ่านและ errors เป็น 0% แสดงว่าโหลด 5 VUs ยังอยู่ใน operational envelope ของ QuickPizza และความแตกต่างเล็กน้อยอาจเป็น network noise.

### 4. In the spike test, how long did the response time take to return to normal after the spike?

**ตอบ:** response time กลับสู่ระดับเดิมในช่วง recovery หลังลดโหลดลง โดยประมาณ **ภายใน ramp-down 5 วินาทีและช่วงถัดไป** ไม่พบ degradation ต่อเนื่อง.

### 5. In the soak test, did the response time or the error rate get worse over time? Name one kind of defect that a soak test of several hours could reveal.

**ตอบ:** ไม่แย่ลงอย่างมีนัยสำคัญ: p(95) **457.719 ms**, errors 0% และ checks 100% ตลอดการทดสอบ. Soak หลายชั่วโมงอาจพบ memory leak, connection leak, resource exhaustion หรือ queue buildup.

### 6. Why do the thresholds in this lab use p(95) rather than the average?

**ตอบ:** p(95) สะท้อน request กลุ่มช้า 1 ใน 20 ขณะที่ค่า average อาจถูก request ที่เร็วส่วนใหญ่กลบจนดูดีเกินจริง จึงเหมาะกับการวัดประสบการณ์ของผู้ใช้มากกว่า.

### 7. Your results come from a shared public site reached over the internet. Give two reasons why the same tests against a system in a lab could give different numbers.

**ตอบ:** ระบบในแล็บอาจมี network latency ต่ำกว่าและไม่มีผู้ใช้อื่นแชร์ระบบเหมือน QuickPizza นอกจากนี้ hardware, cache, database และ background jobs ก็อาจแตกต่างกัน.

### 8. Why must you never run a stress, spike or breakpoint test with hundreds of users against a site that you do not own?

**ตอบ:** การยิงหลายร้อย VUs อาจทำให้บริการช้าหรือล่ม มีลักษณะเหมือน DoS และอาจผิดกฎหมายหรือ terms of service จึงต้องทดสอบเฉพาะระบบที่เป็นของเราเองหรือได้รับอนุญาตเป็นลายลักษณ์อักษร.

### 9. Write one vague performance requirement for an app you use every day. Rewrite it as a testable requirement, and show the K6 thresholds that check it.

**ตอบ:** Vague requirement: “แอปสั่งอาหารควรโหลดเร็ว”

Testable requirement: “เมื่อมี 3 users เป็นเวลา 30 วินาที 95% ของ requests ต้องต่ำกว่า 1,000 ms, 99% ต่ำกว่า 1,500 ms และ fail น้อยกว่า 1%.”

K6 thresholds:

```javascript
http_req_duration: ['p(95)<1000', 'p(99)<1500'],
http_req_failed: ['rate<0.01'],
```

# @octo-utils/exec-async

### exec

```javascript
import { exec } from "../index.js"

exec("node -v").then(console.log) // 13.5.0
```

### spwan

```javascript
import { spawn } from "../index.js"

spawn("node", ["-v"]).then(console.log) // 13.5.0
```

### spwan (inherit stdout)

inherit stdout from the master process
Notice. `stdoutInherit: true` makes childprocess alwasy return null.

```javascript
import { spawn } from "../index.js"

spawn("node", ["-e", "console.log(require('tty').isatty(1))"], { stdoutInherit: true }).then(console.log) // null
// true
```

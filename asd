{
    "date": "Mon Aug 26 2024 13:46:04 GMT+0300 (Moscow Standard Time)",
    "error": {
        "body": "push subscription has unsubscribed or expired.\n",
        "endpoint": "https://fcm.googleapis.com/fcm/send/fR9a6nZggUI:APA91bG-ND7KSe5YALm-h8cSW2T3VDD4QvIci8ja0BHSKMRVhy57KZ-hXIYiesturywCE41Nm9DgUt14t3dNA4L7Vd68c-s54cgFLdb1sh9SlSR54wrnwoBkwcf9xwko1niblE9bdTWS",
        "headers": {
            "alt-svc": "h3=\":443\"; ma=2592000,h3-29=\":443\"; ma=2592000",
            "connection": "close",
            "content-length": "47",
            "content-security-policy-report-only": "script-src 'none'; form-action 'none'; frame-src 'none'; report-uri https://csp.withgoogle.com/csp/goa-520bfc14",
            "content-type": "text/plain; charset=utf-8",
            "cross-origin-opener-policy-report-only": "same-origin; report-to=\"goa-520bfc14\"",
            "date": "Mon, 26 Aug 2024 10:46:04 GMT",
            "report-to": "{\"group\":\"goa-520bfc14\",\"max_age\":2592000,\"endpoints\":[{\"url\":\"https://csp.withgoogle.com/csp/report-to/goa-520bfc14\"}]}",
            "x-content-type-options": "nosniff",
            "x-frame-options": "SAMEORIGIN",
            "x-xss-protection": "0"
        },
        "message": "Received unexpected response code",
        "name": "WebPushError",
        "statusCode": 410
    },
    "level": "error",
    "message": "unhandledRejection: Received unexpected response code\nWebPushError: Received unexpected response code\n    at IncomingMessage.<anonymous> (/root/express-server/node_modules/web-push/src/web-push-lib.js:378:20)\n    at IncomingMessage.emit (node:events:525:35)\n    at endReadableNT (node:internal/streams/readable:1358:12)\n    at processTicksAndRejections (node:internal/process/task_queues:83:21)",
    "os": {
        "loadavg": [
            0,
            0.02,
            0
        ],
        "uptime": 8726292.52
    },
    "process": {
        "argv": [
            "/root/nodejs/bin/node",
            "/root/nodejs/lib/node_modules/pm2/lib/ProcessContainerFork.js"
        ],
        "cwd": "/root/express-server/server",
        "execPath": "/root/nodejs/bin/node",
        "gid": 0,
        "memoryUsage": {
            "arrayBuffers": 2295783,
            "external": 3326839,
            "heapTotal": 50511872,
            "heapUsed": 45204352,
            "rss": 102596608
        },
        "pid": 97086,
        "uid": 0,
        "version": "v16.20.2"
    },
    "rejection": true,
    "stack": "WebPushError: Received unexpected response code\n    at IncomingMessage.<anonymous> (/root/express-server/node_modules/web-push/src/web-push-lib.js:378:20)\n    at IncomingMessage.emit (node:events:525:35)\n    at endReadableNT (node:internal/streams/readable:1358:12)\n    at processTicksAndRejections (node:internal/process/task_queues:83:21)",
    "timestamp": "26-08-2024 01:46:04.720 PM",
    "trace": [
        {
            "column": 20,
            "file": "/root/express-server/node_modules/web-push/src/web-push-lib.js",
            "function": null,
            "line": 378,
            "method": null,
            "native": false
        },
        {
            "column": 35,
            "file": "node:events",
            "function": "IncomingMessage.emit",
            "line": 525,
            "method": "emit",
            "native": false
        },
        {
            "column": 12,
            "file": "node:internal/streams/readable",
            "function": "endReadableNT",
            "line": 1358,
            "method": null,
            "native": false
        },
        {
            "column": 21,
            "file": "node:internal/process/task_queues",
            "function": "processTicksAndRejections",
            "line": 83,
            "method": null,
            "native": false
        }
    ]
}
{
    "date": "Mon Aug 26 2024 13:46:04 GMT+0300 (Moscow Standard Time)",
    "error": {
        "body": "push subscription has unsubscribed or expired.\n",
        "endpoint": "https://fcm.googleapis.com/fcm/send/fR9a6nZggUI:APA91bG-ND7KSe5YALm-h8cSW2T3VDD4QvIci8ja0BHSKMRVhy57KZ-hXIYiesturywCE41Nm9DgUt14t3dNA4L7Vd68c-s54cgFLdb1sh9SlSR54wrnwoBkwcf9xwko1niblE9bdTWS",
        "headers": {
            "alt-svc": "h3=\":443\"; ma=2592000,h3-29=\":443\"; ma=2592000",
            "connection": "close",
            "content-length": "47",
            "content-security-policy-report-only": "script-src 'none'; form-action 'none'; frame-src 'none'; report-uri https://csp.withgoogle.com/csp/goa-520bfc14",
            "content-type": "text/plain; charset=utf-8",
            "cross-origin-opener-policy-report-only": "same-origin; report-to=\"goa-520bfc14\"",
            "date": "Mon, 26 Aug 2024 10:46:04 GMT",
            "report-to": "{\"group\":\"goa-520bfc14\",\"max_age\":2592000,\"endpoints\":[{\"url\":\"https://csp.withgoogle.com/csp/report-to/goa-520bfc14\"}]}",
            "x-content-type-options": "nosniff",
            "x-frame-options": "SAMEORIGIN",
            "x-xss-protection": "0"
        },
        "message": "Received unexpected response code",
        "name": "WebPushError",
        "statusCode": 410
    },
    "level": "error",
    "message": "unhandledRejection: Received unexpected response code\nWebPushError: Received unexpected response code\n    at IncomingMessage.<anonymous> (/root/express-server/node_modules/web-push/src/web-push-lib.js:378:20)\n    at IncomingMessage.emit (node:events:525:35)\n    at endReadableNT (node:internal/streams/readable:1358:12)\n    at processTicksAndRejections (node:internal/process/task_queues:83:21)",
    "os": {
        "loadavg": [
            0,
            0.02,
            0
        ],
        "uptime": 8726292.53
    },
    "process": {
        "argv": [
            "/root/nodejs/bin/node",
            "/root/nodejs/lib/node_modules/pm2/lib/ProcessContainerFork.js"
        ],
        "cwd": "/root/express-server/server",
        "execPath": "/root/nodejs/bin/node",
        "gid": 0,
        "memoryUsage": {
            "arrayBuffers": 2308742,
            "external": 3339838,
            "heapTotal": 50511872,
            "heapUsed": 45370984,
            "rss": 102596608
        },
        "pid": 97086,
        "uid": 0,
        "version": "v16.20.2"
    },
    "rejection": true,
    "stack": "WebPushError: Received unexpected response code\n    at IncomingMessage.<anonymous> (/root/express-server/node_modules/web-push/src/web-push-lib.js:378:20)\n    at IncomingMessage.emit (node:events:525:35)\n    at endReadableNT (node:internal/streams/readable:1358:12)\n    at processTicksAndRejections (node:internal/process/task_queues:83:21)",
    "timestamp": "26-08-2024 01:46:04.731 PM",
    "trace": [
        {
            "column": 20,
            "file": "/root/express-server/node_modules/web-push/src/web-push-lib.js",
            "function": null,
            "line": 378,
            "method": null,
            "native": false
        },
        {
            "column": 35,
            "file": "node:events",
            "function": "IncomingMessage.emit",
            "line": 525,
            "method": "emit",
            "native": false
        },
        {
            "column": 12,
            "file": "node:internal/streams/readable",
            "function": "endReadableNT",
            "line": 1358,
            "method": null,
            "native": false
        },
        {
            "column": 21,
            "file": "node:internal/process/task_queues",
            "function": "processTicksAndRejections",
            "line": 83,
            "method": null,
            "native": false
        }
    ]
}
{
    "date": "Mon Aug 26 2024 13:46:14 GMT+0300 (Moscow Standard Time)",
    "error": {
        "body": "push subscription has unsubscribed or expired.\n",
        "endpoint": "https://fcm.googleapis.com/fcm/send/fR9a6nZggUI:APA91bG-ND7KSe5YALm-h8cSW2T3VDD4QvIci8ja0BHSKMRVhy57KZ-hXIYiesturywCE41Nm9DgUt14t3dNA4L7Vd68c-s54cgFLdb1sh9SlSR54wrnwoBkwcf9xwko1niblE9bdTWS",
        "headers": {
            "alt-svc": "h3=\":443\"; ma=2592000,h3-29=\":443\"; ma=2592000",
            "connection": "close",
            "content-length": "47",
            "content-security-policy-report-only": "script-src 'none'; form-action 'none'; frame-src 'none'; report-uri https://csp.withgoogle.com/csp/goa-520bfc14",
            "content-type": "text/plain; charset=utf-8",
            "cross-origin-opener-policy-report-only": "same-origin; report-to=\"goa-520bfc14\"",
            "date": "Mon, 26 Aug 2024 10:46:14 GMT",
            "report-to": "{\"group\":\"goa-520bfc14\",\"max_age\":2592000,\"endpoints\":[{\"url\":\"https://csp.withgoogle.com/csp/report-to/goa-520bfc14\"}]}",
            "x-content-type-options": "nosniff",
            "x-frame-options": "SAMEORIGIN",
            "x-xss-protection": "0"
        },
        "message": "Received unexpected response code",
        "name": "WebPushError",
        "statusCode": 410
    },
    "level": "error",
    "message": "unhandledRejection: Received unexpected response code\nWebPushError: Received unexpected response code\n    at IncomingMessage.<anonymous> (/root/express-server/node_modules/web-push/src/web-push-lib.js:378:20)\n    at IncomingMessage.emit (node:events:525:35)\n    at endReadableNT (node:internal/streams/readable:1358:12)\n    at processTicksAndRejections (node:internal/process/task_queues:83:21)",
    "os": {
        "loadavg": [
            0,
            0.02,
            0
        ],
        "uptime": 8726302.45
    },
    "process": {
        "argv": [
            "/root/nodejs/bin/node",
            "/root/nodejs/lib/node_modules/pm2/lib/ProcessContainerFork.js"
        ],
        "cwd": "/root/express-server/server",
        "execPath": "/root/nodejs/bin/node",
        "gid": 0,
        "memoryUsage": {
            "arrayBuffers": 815350,
            "external": 1820476,
            "heapTotal": 48676864,
            "heapUsed": 40929232,
            "rss": 100884480
        },
        "pid": 97086,
        "uid": 0,
        "version": "v16.20.2"
    },
    "rejection": true,
    "stack": "WebPushError: Received unexpected response code\n    at IncomingMessage.<anonymous> (/root/express-server/node_modules/web-push/src/web-push-lib.js:378:20)\n    at IncomingMessage.emit (node:events:525:35)\n    at endReadableNT (node:internal/streams/readable:1358:12)\n    at processTicksAndRejections (node:internal/process/task_queues:83:21)",
    "timestamp": "26-08-2024 01:46:14.653 PM",
    "trace": [
        {
            "column": 20,
            "file": "/root/express-server/node_modules/web-push/src/web-push-lib.js",
            "function": null,
            "line": 378,
            "method": null,
            "native": false
        },
        {
            "column": 35,
            "file": "node:events",
            "function": "IncomingMessage.emit",
            "line": 525,
            "method": "emit",
            "native": false
        },
        {
            "column": 12,
            "file": "node:internal/streams/readable",
            "function": "endReadableNT",
            "line": 1358,
            "method": null,
            "native": false
        },
        {
            "column": 21,
            "file": "node:internal/process/task_queues",
            "function": "processTicksAndRejections",
            "line": 83,
            "method": null,
            "native": false
        }
    ]
}
{
    "date": "Mon Aug 26 2024 13:46:14 GMT+0300 (Moscow Standard Time)",
    "error": {
        "body": "push subscription has unsubscribed or expired.\n",
        "endpoint": "https://fcm.googleapis.com/fcm/send/fR9a6nZggUI:APA91bG-ND7KSe5YALm-h8cSW2T3VDD4QvIci8ja0BHSKMRVhy57KZ-hXIYiesturywCE41Nm9DgUt14t3dNA4L7Vd68c-s54cgFLdb1sh9SlSR54wrnwoBkwcf9xwko1niblE9bdTWS",
        "headers": {
            "alt-svc": "h3=\":443\"; ma=2592000,h3-29=\":443\"; ma=2592000",
            "connection": "close",
            "content-length": "47",
            "content-security-policy-report-only": "script-src 'none'; form-action 'none'; frame-src 'none'; report-uri https://csp.withgoogle.com/csp/goa-520bfc14",
            "content-type": "text/plain; charset=utf-8",
            "cross-origin-opener-policy-report-only": "same-origin; report-to=\"goa-520bfc14\"",
            "date": "Mon, 26 Aug 2024 10:46:14 GMT",
            "report-to": "{\"group\":\"goa-520bfc14\",\"max_age\":2592000,\"endpoints\":[{\"url\":\"https://csp.withgoogle.com/csp/report-to/goa-520bfc14\"}]}",
            "x-content-type-options": "nosniff",
            "x-frame-options": "SAMEORIGIN",
            "x-xss-protection": "0"
        },
        "message": "Received unexpected response code",
        "name": "WebPushError",
        "statusCode": 410
    },
    "level": "error",
    "message": "unhandledRejection: Received unexpected response code\nWebPushError: Received unexpected response code\n    at IncomingMessage.<anonymous> (/root/express-server/node_modules/web-push/src/web-push-lib.js:378:20)\n    at IncomingMessage.emit (node:events:525:35)\n    at endReadableNT (node:internal/streams/readable:1358:12)\n    at processTicksAndRejections (node:internal/process/task_queues:83:21)",
    "os": {
        "loadavg": [
            0,
            0.02,
            0
        ],
        "uptime": 8726302.47
    },
    "process": {
        "argv": [
            "/root/nodejs/bin/node",
            "/root/nodejs/lib/node_modules/pm2/lib/ProcessContainerFork.js"
        ],
        "cwd": "/root/express-server/server",
        "execPath": "/root/nodejs/bin/node",
        "gid": 0,
        "memoryUsage": {
            "arrayBuffers": 820093,
            "external": 1825219,
            "heapTotal": 48676864,
            "heapUsed": 41034792,
            "rss": 101150720
        },
        "pid": 97086,
        "uid": 0,
        "version": "v16.20.2"
    },
    "rejection": true,
    "stack": "WebPushError: Received unexpected response code\n    at IncomingMessage.<anonymous> (/root/express-server/node_modules/web-push/src/web-push-lib.js:378:20)\n    at IncomingMessage.emit (node:events:525:35)\n    at endReadableNT (node:internal/streams/readable:1358:12)\n    at processTicksAndRejections (node:internal/process/task_queues:83:21)",
    "timestamp": "26-08-2024 01:46:14.670 PM",
    "trace": [
        {
            "column": 20,
            "file": "/root/express-server/node_modules/web-push/src/web-push-lib.js",
            "function": null,
            "line": 378,
            "method": null,
            "native": false
        },
        {
            "column": 35,
            "file": "node:events",
            "function": "IncomingMessage.emit",
            "line": 525,
            "method": "emit",
            "native": false
        },
        {
            "column": 12,
            "file": "node:internal/streams/readable",
            "function": "endReadableNT",
            "line": 1358,
            "method": null,
            "native": false
        },
        {
            "column": 21,
            "file": "node:internal/process/task_queues",
            "function": "processTicksAndRejections",
            "line": 83,
            "method": null,
            "native": false
        }
    ]
}
namespace `ui.screens` (
    class IframeSelectorHarness extends Application {
        async onConnected() {
            await super.onConnected();
            this.createTestPanel();
            await this.runQueryTests();
        }

        createTestPanel() {
            const panel = document.createElement("section");
            panel.id = "query-tests";
            panel.className = "panel";
            panel.innerHTML = `
                <div class="panel-head">
                    <div>
                        <h2>Arc query test suite</h2>
                        <span class="hint">querySelector · querySelectorAll · find · findAll</span>
                    </div>
                    <button class="btn" id="run-query-tests">Run tests</button>
                </div>
                <div class="panel-body">
                    <div id="query-summary" aria-live="polite">Waiting…</div>
                    <ol id="query-results"></ol>
                </div>`;
            this.querySelector("main.content").prepend(panel);
            this.querySelector("#run-query-tests").addEventListener("click", () => this.runQueryTests());
        }

        assert(value, message) {
            if (!value) throw new Error(message);
        }

        equal(actual, expected, message) {
            if (actual !== expected) {
                throw new Error(`${message}: expected ${expected}, received ${actual}`);
            }
        }

        async runQueryTests() {
            const output = this.querySelector("#query-results");
            const summary = this.querySelector("#query-summary");
            const button = this.querySelector("#run-query-tests");
            output.innerHTML = "";
            summary.className = "running";
            summary.textContent = "Running query tests…";
            button.disabled = true;

            const tests = [
                ["querySelector — plain DOM", `querySelector("#orders-panel .pending")`, () => {
                    this.equal(this.querySelector("#orders-panel .pending")?.textContent, "Pending", "plain DOM result");
                }],
                ["querySelectorAll — plain DOM collection", `querySelectorAll("#stats .stat-card")`, () => {
                    this.equal(this.querySelectorAll("#stats .stat-card").length, 4, "stat card count");
                }],
                ["querySelector — one ShadowRoot", `querySelector("user-card >>> button#msg-btn")`, () => {
                    this.equal(this.querySelector("user-card >>> button#msg-btn")?.textContent, "Message", "shadow result");
                }],
                ["querySelector — nested ShadowRoots", `querySelector("user-card:nth-of-type(2) >>> status-badge >>> #state-label")`, () => {
                    this.equal(this.querySelector("user-card:nth-of-type(2) >>> status-badge >>> #state-label")?.textContent, "away", "nested shadow result");
                }],
                ["querySelectorAll — branched ShadowRoots", `querySelectorAll("user-card >>> button#msg-btn")`, () => {
                    this.equal(this.querySelectorAll("user-card >>> button#msg-btn").length, 3, "branched shadow count");
                }],
                ["find — iframe Document", `find("iframe#editor ::document input#subject")`, async () => {
                    this.equal((await this.find("iframe#editor ::document input#subject", 0, 2000))?.value, "July product update 🎉", "iframe document result");
                }],
                ["find — iframe Document → ShadowRoot", `find("iframe#editor ::document editor-toolbar >>> button.save")`, async () => {
                    this.equal((await this.find("iframe#editor ::document editor-toolbar >>> button.save", 0, 2000))?.textContent, "Save draft", "iframe shadow result");
                }],
                ["find — iframe → iframe → Document", `find("iframe#editor ::document iframe#preview ::document h1#preview-title")`, async () => {
                    this.equal((await this.find("iframe#editor ::document iframe#preview ::document h1#preview-title", 0, 2000))?.textContent, "July product update 🎉", "nested iframe result");
                }],
                ["find — ShadowRoot → iframe Document", `find("embedded-report >>> iframe#report ::document #kpis .kpi-value")`, async () => {
                    this.equal((await this.find("embedded-report >>> iframe#report ::document #kpis .kpi-value", 0, 2000))?.textContent, "21,904", "shadow iframe result");
                }],
                ["find — srcdoc iframe", `find("iframe#ad-banner ::document button#promo-cta")`, async () => {
                    this.equal((await this.find("iframe#ad-banner ::document button#promo-cta", 0, 2000))?.textContent, "Start trial", "srcdoc result");
                }],
                ["find — three ShadowRoots → iframe Document", `find("support-widget >>> chat-panel >>> chat-frame >>> iframe#chat ::document button#send-btn")`, async () => {
                    this.equal((await this.find("support-widget >>> chat-panel >>> chat-frame >>> iframe#chat ::document button#send-btn", 0, 2000))?.textContent, "Send", "deep mixed result");
                }],
                ["querySelector — loaded iframe remains synchronous", `querySelector("iframe#editor ::document editor-toolbar >>> button.save")`, () => {
                    this.assert(this.querySelector("iframe#editor ::document editor-toolbar >>> button.save"), "loaded iframe was not synchronously queryable");
                }],
                ["find — delayed plain DOM", `find("#arc-delayed-node")`, async () => {
                    const pending = this.find("#arc-delayed-node", 0, 1000);
                    queueMicrotask(() => {
                        const node = document.createElement("i");
                        node.id = "arc-delayed-node";
                        this.querySelector("#query-tests").append(node);
                    });
                    this.assert(await pending, "delayed node was not found");
                    this.querySelector("#arc-delayed-node")?.remove();
                }],
                ["findAll — delayed collection with expect", `findAll(".arc-delayed-item", {expect:3})`, async () => {
                    const pending = this.findAll(".arc-delayed-item", {expect:3, scan_duration:1000});
                    queueMicrotask(() => {
                        for (let i = 0; i < 3; i++) {
                            const node = document.createElement("i");
                            node.className = "arc-delayed-item";
                            this.querySelector("#query-tests").append(node);
                        }
                    });
                    this.equal((await pending).length, 3, "delayed collection count");
                    this.querySelectorAll(".arc-delayed-item").forEach(node => node.remove());
                }],
                ["find — delayed render inside iframe ShadowRoot", `find("iframe#editor ::document editor-toolbar >>> #arc-late-frame-node")`, async () => {
                    const pending = this.find("iframe#editor ::document editor-toolbar >>> #arc-late-frame-node", 0, 1000);
                    queueMicrotask(() => {
                        const toolbar = this.querySelector("iframe#editor ::document editor-toolbar");
                        const node = toolbar.ownerDocument.createElement("button");
                        node.id = "arc-late-frame-node";
                        node.innerHTML = "Delayed Button"
                        toolbar.shadowRoot.append(node);
                    });
                    this.assert(await pending, "delayed iframe shadow node was not found");
                }],
                ["find — staged nested ShadowRoot rendering", `find("#latency-shell >>> #latency-inner >>> button.ready", 0, 4000)`, async () => {
                    const shell = document.createElement("div");
                    shell.id = "latency-shell";
                    const shellRoot = shell.attachShadow({mode:"open"});
                    this.querySelector("#query-tests").append(shell);
                    const pending = this.find("#latency-shell >>> #latency-inner >>> button.ready", 0, 4000);

                    setTimeout(() => {
                        const inner = document.createElement("div");
                        inner.id = "latency-inner";
                        const innerRoot = inner.attachShadow({mode:"open"});
                        shellRoot.append(inner);
                        setTimeout(() => {
                            const target = document.createElement("button");
                            target.className = "ready";
                            innerRoot.append(target);
                        }, 1000);
                    }, 1000);

                    this.assert(await pending, "staged nested shadow target was not found");
                    shell.remove();
                }],
                ["find — late iframe → delayed ShadowRoot render", `find("iframe#latency-frame ::document #latency-app >>> button.ready", 0, 5000)`, async () => {
                    const pending = this.find("iframe#latency-frame ::document #latency-app >>> button.ready", 0, 5000);

                    setTimeout(() => {
                        const frame = document.createElement("iframe");
                        frame.id = "latency-frame";
                        this.querySelector("#query-tests").append(frame);
                        frame.srcdoc = `<!doctype html><body><div id="latency-app"></div><script>
                            const app = document.querySelector('#latency-app');
                            const root = app.attachShadow({mode:'open'});
                            setTimeout(() => {
                                const button = document.createElement('button');
                                button.className = 'ready';
                                root.append(button);
                            }, 1200);
                        <\/script>`;
                    }, 1000);

                    this.assert(await pending, "late iframe shadow target was not found");
                    this.querySelector("#latency-frame")?.remove();
                }],
                ["querySelector — missing result is null", `querySelector("user-card >>> .does-not-exist")`, () => {
                    this.equal(this.querySelector("user-card >>> .does-not-exist"), null, "missing result");
                }],
                ["find — timeout result is null", `find("user-card >>> .never-created", 0, 50)`, async () => {
                    this.equal(await this.find("user-card >>> .never-created", 0, 50), null, "timeout result");
                }],
                ["querySelector — cross-origin boundary is closed", `querySelector("iframe#opaque-frame ::document #private-target")`, () => {
                    this.equal(this.querySelector("iframe#opaque-frame ::document #private-target"), null, "opaque-origin result");
                }]
            ];

            let passed = 0;
            for (const [name, query, test] of tests) {
                const item = document.createElement("li");
                const started = performance.now();
                try {
                    await test();
                    passed++;
                    item.className = "pass";
                    item.innerHTML = `<b>PASS</b><span></span><small>${Math.round(performance.now() - started)}ms</small>`;
                } catch (error) {
                    item.className = "fail";
                    item.innerHTML = `<b>FAIL</b><span></span><small>${Math.round(performance.now() - started)}ms</small><em></em>`;
                    item.querySelector("em").textContent = error.message;
                    console.error(`[Iframe Selector Harness] ${name}`, error);
                }
                const label = item.querySelector("span");
                const title = document.createElement("strong");
                title.textContent = name;
                label.append(title);
                const code = document.createElement("code");
                for (const part of query.split(/(>>>|::document)/)) {
                    if (part == ">>>" || part == "::document") {
                        const operator = document.createElement("mark");
                        operator.className = part == ">>>" ? "shadow-operator" : "document-operator";
                        operator.textContent = part;
                        code.append(operator);
                    } else {
                        code.append(part);
                    }
                }
                label.append(code);
                output.append(item);
            }

            const failed = tests.length - passed;
            summary.className = failed ? "failed" : "passed";
            summary.textContent = failed ? `${passed}/${tests.length} passed · ${failed} failed` : `All ${passed} tests passed`;
            button.disabled = false;
        }
    }
);

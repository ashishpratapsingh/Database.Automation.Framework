# Database Automation Testing Framework

An enterprise-grade, containerized database integration testing framework built with **TypeScript**, **Jest**, **Knex.js**, **Testcontainers**, and **PostgreSQL**. Designed to eliminate environment drift, cross-test pollution, and slow staging setups by running tests against ephemeral, isolated database containers.

---

## 🚀 Key Features

* **Ephemeral Isolation:** Spawns clean, isolated PostgreSQL containers on-the-fly per test suite using **Testcontainers**, completely eliminating test cross-contamination.
* **Advanced Database Testing:** First-class support for testing complex database objects, including stored procedures (`CALL`), cursors (`REFCURSOR`), and query performance optimization via `EXPLAIN` query execution plans.
* **Massive Schema Performance (2,000+ Tables):** Supports high-performance baseline schema snapshots (`pg_dump` integration) combined with dynamic delta migrations for lightning-fast container provisioning.
* **Automated CI/CD Pipeline:** Integrated natively with **GitHub Actions** running on Node.js 22+ (ensuring modern `undici` and `File` API compatibility).
* **Live Test Reporting:** Automatically generates rich HTML test reports and publishes them live to **GitHub Pages** after every build.

---

## 🛠️ Tech Stack

* **Language:** TypeScript / Node.js (v22+)
* **Test Runner:** Jest (`--runInBand`, `--detectOpenHandles`)
* **Query Builder & Migrations:** Knex.js
* **Containerization:** Testcontainers (PostgreSQL)
* **CI/CD & Hosting:** GitHub Actions & GitHub Pages

---

## 📁 Project Structure

```text
Database.Automation.Framework/
├── .github/
│   └── workflows/
│       └── db-tests.yml
├── .vscode/
├── src/
│   ├── databaseStrategy/
│   │   ├── interfaces/
│   │   │   └── IDatabaseStrategy.ts
│   │   └── PostgresStrategy.ts
│   ├── dbContainerManager/
│   │   └── DatabaseContainerManager.ts
│   ├── migrations/
│   │   └── 20260101000001_create_relations.ts
│   └── seeds/
│       └── 01_initial_data.ts
├── tests/
│   ├── builders/
│   │   ├── department.builder.ts
│   │   ├── employee.builder.ts
│   │   ├── order.builder.ts
│   │   └── user.builder.ts
│   ├── helpers/
│   │   └── assert-db.ts
│   ├── db-container.ts
│   ├── department.test.ts
│   ├── employee.index.test.ts
│   └── orders.test.ts
├── test-results/
├── .gitignore
├── jest.config.js
├── knexfile.ts
├── package-lock.json
├── package.json
└── tsconfig.json
```

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your local machine:
* **Node.js** (v22.19.0 or higher recommended)
* **Docker Desktop** (Required for Testcontainers to spin up local PostgreSQL instances)
* **npm** or **yarn**

---

## 📦 Installation & Local Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/ashishpratapsingh/Database.Automation.Framework.git
   cd Database.Automation.Framework
   ```

2. **Install Dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment Variables (Optional):**
   Create a `.env` file in the root directory if you need custom database overrides, though Testcontainers manages dynamic ports automatically.

---

## 🏃 Running Tests Locally

To execute your test suite locally with Jest:

```bash
npx jest --runInBand --detectOpenHandles
```

* `--runInBand`: Executes test suites sequentially to prevent race conditions and connection pool exhaustion.
* `--detectOpenHandles`: Warns if database connection pools fail to close cleanly after test completion.

---

## 📈 Handling Large-Scale Schemas (2,000+ Tables)

For enterprise schemas exceeding thousands of tables, running historical migrations sequentially on every container spin-up creates performance bottlenecks. This framework implements a **Baseline Schema Snapshot Strategy**:

1. Export your stable structure using PostgreSQL's native tool:
   ```bash
   pg_dump -U username -d mydb --schema-only --no-owner > src/db/baseline_schema.sql
   ```
2. The framework instantly pipes the raw SQL file directly into the fresh Testcontainer upon startup, provisioning thousands of tables in milliseconds before running lightweight delta migrations.

---

## 🚀 CI/CD Pipeline & GitHub Pages

This repository utilizes GitHub Actions to run automated integration builds. 

* **Pipeline Trigger:** Automatically runs on every `push` or `pull_request` targeting the `master` branch.
* **Test Reports:** Jest output results are converted into interactive HTML dashboards.
* **Live Deployment:** Reports are automatically deployed via GitHub Pages and viewable live at:
  👉 [https://ashishpratapsingh.github.io/Database.Automation.Framework/](https://ashishpratapsingh.github.io/Database.Automation.Framework/)

---

## 📝 License

This project is licensed under the MIT License.
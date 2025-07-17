# 芳療智匯  AromaMind – Phase 1 (MVP)  系統需求文件 (SRD)

> **版本** v1.0  
> **撰寫日期** 2025/07/07  
> **作者** Haipo Su

---

## 1  文件目的

此文件定義「芳療智匯  AromaMind」第一階段 (Minimum Viable Product, MVP) 的產品目標、功能範圍、系統架構與驗收標準，供產品、設計、開發、測試與利益關係人對齊共同基準。

## 2  產品概述

芳療智匯  AromaMind 是一款 SaaS  雲端平台，協助專業芳療師 (個體戶與企業團隊) 進行客戶問診、配方管理與紀錄。平台核心價值：

1. **AI  智慧配方建議** – 結合客戶資料與案例向量庫，快速提供精油配方靈感。
2. **雲端客戶檔案** – 一站式管理健康資訊、歷史問診與回饋。
3. **專業 PDF  報告** – 一鍵匯出問診紀錄，增強專業形象。

## 3 Phase 1  目標

- 在 3  個月內上線 MVP，讓早期使用者 (10  位個體芳療師、2  家企業團隊) 成功完成真實問診流程。
- 收集使用者回饋以驗證 AI  配方建議的實用性與 UI/UX  流程。

## 4  範圍定義

### 4.1 In‑Scope 功能

| 模組        | 代號  | 功能點                                                                                                    |
| ----------- | ----- | --------------------------------------------------------------------------------------------------------- |
| 帳號 / 登入 | ACC‑1 | Google OAuth  登入                                                                                        |
|             | ACC‑2 | Email  註冊、驗證、忘記密碼                                                                               |
| 客戶資料    | CUS‑1 | 建立 / 編輯客戶基本檔：姓名、性別、手機 (帳號)、Email、生日、身高、體重、慢性病、長期服藥、過敏、懷孕狀態 |
|             | CUS‑2 | 標籤系統 (新增 / 刪除 / 搜尋)                                                                             |
|             | CUS‑3 | 關鍵字模糊搜尋 (姓名、手機、標籤)                                                                         |
| 問診紀錄    | CON‑1 | 建立問診：主訴、照片上傳 (單張)、AI  建議插入、配方表、生活建議                                           |
|             | CON‑2 | 自動濃度計算 (輸入滴數 & 基底油 ml)                                                                       |
| AI  配方    | AI‑1  | 由向量資料庫檢索  k = 5  個相似案例，顯示建議列表 (精油 + 滴數比)                                         |
| PDF  報告   | PDF‑1 | 生成含 Logo、客戶資訊、配方、建議的 PDF；可列印、Email  寄送                                              |
| 權限        | PER‑1 | 個體帳號私有資料隔離                                                                                      |
|             | PER‑2 | 企業帳號：主帳號建立子帳號、共用客戶資料 read/write                                                       |
| 架構        | ARC‑1 | 前端  Vue 3 + Vite + TypeScript，UI 框架使用 Vuetify，RWD  設計                                           |
|             | ARC‑2 | Firebase：Auth, Firestore, Storage, Functions                                                             |

### 4.2 Out‑of‑Scope / 延伸功能

- 精油庫存管理、批號/效期追蹤
- 進階報表、儀表板 (統計分析)
- GDPR/HIPAA  完整合規套件 (僅預留結構)
- 行動原生  App (改用 PWA 支援離線瀏覽)

## 5  使用者角色

| 角色       | 描述                | 關鍵權限                             |
| ---------- | ------------------- | ------------------------------------ |
| 個體芳療師 | 自營工作者          | 客戶 CRUD、問診 CRUD、PDF 匯出       |
| 企業管理者 | 公司擁有者 / 管理層 | 建立企業帳號、管理子帳號、全客戶存取 |
| 企業芳療師 | 企業員工            | 客戶 / 問診 CRUD (受企業權限控管)    |
| 系統管理員 | 運營方              | 後台監控、日誌稽核、版本發布         |

## 6  詳細功能需求

### 6.1  帳號與身份驗證

- **ACC‑1** Google OAuth：成功登入後回傳 Firebase UID；若首次登入，自動建立帳號文件。
- **ACC‑2** Email  流程：

  1. 註冊畫面收集「顯示名稱、Email、密碼 (min 8 chars)」。
  2. 送出後透過 Firebase Auth 寄送驗證信。
  3. 使用者點擊驗證連結後方能登入。
  4. 忘記密碼：輸入註冊 Email，系統寄送重設連結。

### 6.2  客戶資料 (CUS‑1 \~ CUS‑3)

- 表單驗證：手機需符合 E.164  格式；生日不可大於當日。
- 儲存結構：`/users/{therapist_uid}/clients/{client_id}`。
- 標籤 (Tag) 上限 20  枚/客戶，單一標籤 ≤ 20  字元。
- 搜尋：採用 Firestore  索引 + 前端 Fuse.js  進行模糊比對，回傳前 30  筆。

### 6.3  問診紀錄 (CON‑1, CON‑2)

- 建立新問診時自動載入客戶摘要 (過敏、慢性病)。
- 照片：JPEG/PNG, <= 5 MB；上傳至 Firebase Storage，URL  存於紀錄文件。
- 配方表 UX：表格列出「精油名稱、滴數」；新增行時提供下拉建議 (前 10  大常用)。
- **濃度計算公式**：`(Σ滴數 × 0.05 ml) / (基底油 ml + Σ滴數 × 0.05 ml)` ≈ 濃度%，四捨五入至 0.1%。

### 6.4 AI  配方建議 (AI‑1)

- 向量庫：使用 Pinecone  或  Firestore + Embeddings 儲存 `embedding(症狀 + 關鍵標籤 + 客戶屬性)`。
- 端點：Firebase Functions  調用 OpenAI / VertexAI Embeddings, top‑k  檢索。
- 前端呈現：顯示 5  筆案例卡片 (症狀摘要 + 配方 + 成效)，點選可將配方插入表格。

### 6.5 PDF  報告 (PDF‑1)

- 技術：使用 pdf-lib  於前端生成。字體：Noto Sans TC；A4  直向。
- 檔名格式：`{clientName}_{YYYYMMDD}_aromatherapy.pdf`。
- Email：透過 Firebase Functions + SendGrid API；寄送成功回寫紀錄。

### 6.6  權限 (PER‑1, PER‑2)

- Firestore  安全規則：

  ```
  match /users/{uid}/** {
    allow read, write: if request.auth.uid == uid;
  }
  match /companies/{companyId}/** {
    allow read: if request.auth.uid in resource.data.memberIds;
    allow write: if request.auth.uid in resource.data.adminIds;
  }
  ```

## 7  非功能需求 (NFR)

| 序號  | 類別   | 指標                                                  |
| ----- | ------ | ----------------------------------------------------- |
| NFR‑1 | 性能   | 首頁 FCP < 2.5 s (桌機), < 4 s (行動)                 |
| NFR‑2 | 可用性 | 99.5 %  月可用時間 (Firebase SLA)                     |
| NFR‑3 | 安全   | HTTPS 全站強制；密碼雜湊 (Firebase Auth)              |
| NFR‑4 | 隱私   | 不在客戶端儲存未加密敏感資訊；照片 URL 須設權杖有效期 |
| NFR‑5 | 擴充性 | 架構允許日後插入精油庫存與 GDPR 模組而無需資料遷移    |

## 8  資料模型 (簡述)

- `users`：芳療師帳號 (UID, profile, accountType)
- `clients`：客戶檔 (基本欄位 + tags)
- `consultations`：問診紀錄 (clientId, date, symptoms, formula\[], advice, photoUrl, concentration)
- `companies`：企業 (members\[], admins\[])
- `vectors`：案例向量 (embedding, meta‑info)

## 9  里程碑與工期

| 里程碑       | 目標交付                         | 期限 (週) |
| ------------ | -------------------------------- | --------- |
| M1  需求凍結 | 本 SRD  審核完畢                 |  Week 0   |
| M2  設計完成 | Figma  原型、DB Schema、雲端規格 |  Week 2   |
| M3 Alpha     | 帳號/客戶/問診   核心流程通      |  Week 6   |
| M4 Beta      | AI  配方、PDF、企業權限          |  Week 9   |
| M5 Launch    | 公開 MVP，上線監控 & Hotfix      |  Week 12  |

## 10  驗收標準 (摘錄)

- **UC‑CREATE‑CONSULT**：芳療師可在 < 2  分鐘內完成新問診並生成 PDF。
- **UC‑AI‑INSERT**：AI  建議配方插入成功率 ≧ 95 % (可複製至表格)。
- **UC‑SEARCH‑CLIENT**：輸入「曉芬」後 300 ms  內返回結果，並包含拼音「xiaofen」。
- **UC‑PERM‑ENTERPRISE**：非該公司成員嘗試讀取資料應被拒絕 (403)。

## 11  風險與因應

| 風險                 | 影響           | 緩解措施                         |
| -------------------- | -------------- | -------------------------------- |
| AI  建議不準確       | 使用者信心下降 | 收集回饋、增補案例、允許手動微調 |
| PDF  中文字體不顯示  | 報告失真       | 在建置時內嵌字體檔，E2E 測試列印 |
| Firebase  費用超預期 | 成本失控       | 設定計費警示 & 指標監控          |

## 12  後續擴充 (Phase 2+)

- 精油庫存 / 批號 & 效期追蹤
- 進階統計報表、BI  儀表板
- 第三方支付 (訂閱制)、多語系介面
- 手機 Push  通知 & 行事曆提醒

## 客戶資料系統

- 新增客戶資料
- 搜尋客戶資料
- 修改客戶資料
- 客戶資料列表(包含客戶名稱、電話、email)，包含分頁功能
- 客戶資料資料結構(uid(流水數字編碼),名稱、電話、email、身高、體重、職業、過敏病史、慢性病史、資料新增時間,新增人員 id(目前登入帳號的 id),建檔時間,最後修改時間)
- firebase Cloud Firestore database collection name:customer

import { useState, useEffect, useCallback } from "react";

const API = "";

const STATUS_COLORS = {
  EM_PRODUCAO: { bg: "#1a3a5c", text: "#60b8ff", label: "Em Produção" },
  PRONTO: { bg: "#0f3d2e", text: "#34d399", label: "Pronto" },
  ENTREGUE: { bg: "#2d1f6e", text: "#a78bfa", label: "Entregue" },
  CANCELADO: { bg: "#3d1515", text: "#f87171", label: "Cancelado" },
};

const PAGAMENTO_LABELS = {
  DINHEIRO: "Dinheiro",
  CARTAO_CREDITO: "Cartão Crédito",
  CARTAO_DEBITO: "Cartão Débito",
  PIX: "PIX",
  PARCELADO: "Parcelado",
};

const TIPO_PRODUTO_LABELS = {
  ARMACAO: "Armação",
  LENTE: "Lente",
  ACESSORIO: "Acessório",
  OCULOS_SOLAR: "Óculos Solar",
};

function useApi(token) {
  const req = useCallback(
    async (method, path, body) => {
      const res = await fetch(`${API}${path}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Erro na requisição");
      }
      return res.json();
    },
    [token]
  );
  return req;
}

// ── Styles ───────────────────────────────────────────────────────────────────
const S = {
  app: {
    minHeight: "100vh",
    background: "#0d0d0f",
    color: "#e8e6e0",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    display: "flex",
  },
  sidebar: {
    width: 220,
    minHeight: "100vh",
    background: "#111113",
    borderRight: "1px solid #222226",
    display: "flex",
    flexDirection: "column",
    padding: "0 0 16px",
    flexShrink: 0,
  },
  logo: {
    padding: "24px 20px 20px",
    borderBottom: "1px solid #222226",
    marginBottom: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.5px",
  },
  logoSub: { fontSize: 11, color: "#666", marginTop: 2 },
  navItem: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 16px",
    margin: "2px 8px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13.5,
    fontWeight: active ? 600 : 400,
    color: active ? "#fff" : "#888",
    background: active ? "#1e1e24" : "transparent",
    border: active ? "1px solid #2a2a32" : "1px solid transparent",
    transition: "all 0.15s",
  }),
  main: {
    flex: 1,
    padding: "28px 32px",
    overflowY: "auto",
    maxWidth: "100%",
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#fff",
    marginBottom: 4,
    letterSpacing: "-0.5px",
  },
  pageSub: { fontSize: 13, color: "#555", marginBottom: 24 },
  card: {
    background: "#111113",
    border: "1px solid #222226",
    borderRadius: 12,
    padding: "20px 24px",
    marginBottom: 16,
  },
  btn: (variant = "primary") => ({
    padding: "8px 16px",
    borderRadius: 8,
    border: variant === "ghost" ? "1px solid #2a2a32" : "none",
    background:
      variant === "primary"
        ? "#2563eb"
        : variant === "danger"
        ? "#7f1d1d"
        : variant === "success"
        ? "#14532d"
        : "#1e1e24",
    color:
      variant === "primary"
        ? "#fff"
        : variant === "danger"
        ? "#fca5a5"
        : variant === "success"
        ? "#86efac"
        : "#ccc",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  }),
  input: {
    width: "100%",
    padding: "9px 12px",
    background: "#1a1a1e",
    border: "1px solid #2a2a32",
    borderRadius: 8,
    color: "#e8e6e0",
    fontSize: 13.5,
    outline: "none",
    boxSizing: "border-box",
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    display: "block",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13.5,
  },
  th: {
    textAlign: "left",
    padding: "10px 14px",
    color: "#555",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "1px solid #1e1e24",
  },
  td: {
    padding: "12px 14px",
    borderBottom: "1px solid #18181c",
    color: "#ccc",
    verticalAlign: "middle",
  },
  badge: (color) => ({
    display: "inline-block",
    padding: "3px 9px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    background: color?.bg || "#1e1e24",
    color: color?.text || "#888",
  }),
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#111113",
    border: "1px solid #2a2a32",
    borderRadius: 16,
    padding: 28,
    width: "100%",
    maxWidth: 480,
    maxHeight: "85vh",
    overflowY: "auto",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  },
  statCard: {
    background: "#111113",
    border: "1px solid #222226",
    borderRadius: 12,
    padding: "18px 20px",
  },
  statLabel: { fontSize: 12, color: "#555", marginBottom: 6, fontWeight: 500 },
  statValue: { fontSize: 26, fontWeight: 700, color: "#fff" },
};

// ── Components ───────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div style={{ textAlign: "center", padding: 40, color: "#444" }}>
      Carregando...
    </div>
  );
}

function Alert({ msg, type = "error", onClose }) {
  if (!msg) return null;
  return (
    <div
      style={{
        padding: "10px 16px",
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 13,
        background: type === "error" ? "#3d1515" : "#0f3d2e",
        color: type === "error" ? "#fca5a5" : "#34d399",
        border: `1px solid ${type === "error" ? "#7f1d1d" : "#14532d"}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {msg}
      {onClose && (
        <span
          style={{ cursor: "pointer", marginLeft: 12, opacity: 0.7 }}
          onClick={onClose}
        >
          ✕
        </span>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={S.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={S.modal}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#fff" }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#666",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children, full }) {
  return (
    <div style={full ? { gridColumn: "1 / -1" } : {}}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

// ── Login ─────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email, setEmail] = useState("gerente@limavision.com");
  const [senha, setSenha] = useState("limavision123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      if (!res.ok) throw new Error("Credenciais inválidas");
      const data = await res.json();
      onLogin(data.access_token, data.funcionario);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0d0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: 360 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 20,
           marginBottom: 8,
          color: "#fff",
          margin: 0,}}>⠀⠀⠀⠀⠀⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢠⠣⢤⡄⠀⠀⢀⢸⠀⠀⡀⡠⡤⠣⠠⠂⠀⠀⠀
⡀⠀⠀⠀⢠⣦⣶⡿⣿⡷⠗⡿⡻⢿⠾⣯⣆⡧⢂⡆⠀⡀⢄⡂
⠀⠄⠢⢐⣿⡯⠁⠏⡵⠀⠀⠰⣝⠀⠀⠀⠉⠿⡅⠘⡿⠉⠀⠀
⠀⠀⢨⣿⠋⢩⡀⢨⣿⡆⠀⢰⣟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠉⠁⠀⢸⡇⠈⠉⠁⠀⠀⡷⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠋⠷⠶⠦⠖⠿⢁⣄⠴⠔⠒⠉⠁⠀⠀⠀⠀⠀
</div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#fff",
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            LimaVision
          </h1>
          <p style={{ color: "#555", fontSize: 13, marginTop: 6 }}>
            OticaSupport — Sistema de Gestão
          </p>
        </div>
        <div style={S.card}>
          <Alert msg={error} onClose={() => setError("")} />
          <Field label="E-mail">
            <input
              style={S.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
            />
          </Field>
          <div style={{ marginTop: 14 }}>
            <Field label="Senha">
              <input
                style={S.input}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                type="password"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </Field>
          </div>
          <button
            style={{ ...S.btn("primary"), width: "100%", marginTop: 18, justifyContent: "center", padding: "11px 0" }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ req }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    req("GET", "/relatorios/geral").then(setData).catch(() => {});
  }, [req]);

  if (!data) return <Spinner />;

  const stats = [
    { label: "Total de Clientes", value: data.total_clientes ?? "-" },
    { label: "OS em Produção", value: data.os_em_producao ?? "-" },
    { label: "OS Prontas", value: data.os_prontas ?? "-" },
    { label: "Vendas (mês)", value: data.vendas_mes ?? "-" },
    { label: "Receita (mês)", value: data.receita_mes != null ? `R$ ${Number(data.receita_mes).toFixed(2)}` : "-" },
    { label: "Produtos em Estoque", value: data.total_produtos ?? "-" },
  ];

  return (
    <>
      <p style={S.pageTitle}>Dashboard</p>
      <p style={S.pageSub}>Visão geral do sistema</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {stats.map((s) => (
          <div key={s.label} style={S.statCard}>
            <div style={S.statLabel}>{s.label}</div>
            <div style={S.statValue}>{s.value}</div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Clientes ──────────────────────────────────────────────────────────────────
function Clientes({ req }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    req("GET", "/clientes").then((d) => { setList(d); setLoading(false); }).catch(() => setLoading(false));
  }, [req]);

  useEffect(() => { load(); }, [load]);

  function openNew() { setForm({ nome: "", cpf: "", telefone: "", data_nascimento: "" }); setModal("new"); setError(""); }
  function openEdit(c) { setForm({ ...c, data_nascimento: c.data_nascimento || "" }); setModal("edit"); setError(""); }

  async function save() {
    try {
      const body = { ...form };
      if (!body.data_nascimento) delete body.data_nascimento;
      if (modal === "new") await req("POST", "/clientes", body);
      else await req("PUT", `/clientes/${form.id}`, body);
      setModal(null); load();
    } catch (e) { setError(e.message); }
  }

  async function remove(id) {
    if (!confirm("Remover cliente?")) return;
    try { await req("DELETE", `/clientes/${id}`); load(); } catch (e) { alert(e.message); }
  }

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <p style={S.pageTitle}>Clientes</p>
          <p style={S.pageSub}>{list.length} cadastrados</p>
        </div>
        <button style={S.btn("primary")} onClick={openNew}>+ Novo Cliente</button>
      </div>
      {loading ? <Spinner /> : (
        <div style={S.card}>
          <table style={S.table}>
            <thead>
              <tr>
                {["Nome", "CPF", "Telefone", "Cadastro", ""].map((h) => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id}>
                  <td style={{ ...S.td, color: "#fff", fontWeight: 500 }}>{c.nome}</td>
                  <td style={S.td}>{c.cpf}</td>
                  <td style={S.td}>{c.telefone || "—"}</td>
                  <td style={S.td}>{new Date(c.criado_em).toLocaleDateString("pt-BR")}</td>
                  <td style={{ ...S.td, textAlign: "right" }}>
                    <button style={{ ...S.btn("ghost"), marginRight: 6 }} onClick={() => openEdit(c)}>Editar</button>
                    <button style={S.btn("danger")} onClick={() => remove(c.id)}>Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <Modal title={modal === "new" ? "Novo Cliente" : "Editar Cliente"} onClose={() => setModal(null)}>
          <Alert msg={error} onClose={() => setError("")} />
          <div style={S.formGrid}>
            <Field label="Nome" full><input style={S.input} value={form.nome || ""} onChange={f("nome")} /></Field>
            <Field label="CPF"><input style={S.input} value={form.cpf || ""} onChange={f("cpf")} placeholder="000.000.000-00" /></Field>
            <Field label="Telefone"><input style={S.input} value={form.telefone || ""} onChange={f("telefone")} /></Field>
            <Field label="Nascimento" full><input type="date" style={S.input} value={form.data_nascimento || ""} onChange={f("data_nascimento")} /></Field>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
            <button style={S.btn("ghost")} onClick={() => setModal(null)}>Cancelar</button>
            <button style={S.btn("primary")} onClick={save}>Salvar</button>
          </div>
        </Modal>
      )}
    </>
  );
}

// ── Produtos ──────────────────────────────────────────────────────────────────
function Produtos({ req }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    req("GET", "/produtos").then((d) => { setList(d); setLoading(false); }).catch(() => setLoading(false));
  }, [req]);

  useEffect(() => { load(); }, [load]);

  function openNew() { setForm({ nome: "", tipo: "ARMACAO", custo: "", preco_venda: "", quantidade: "" }); setModal("new"); setError(""); }
  function openEdit(p) { setForm({ ...p }); setModal("edit"); setError(""); }

  async function save() {
    try {
      const body = { ...form, custo: Number(form.custo), preco_venda: Number(form.preco_venda), quantidade: Number(form.quantidade) };
      if (modal === "new") await req("POST", "/produtos", body);
      else await req("PUT", `/produtos/${form.id}`, body);
      setModal(null); load();
    } catch (e) { setError(e.message); }
  }

  async function remove(id) {
    if (!confirm("Remover produto?")) return;
    try { await req("DELETE", `/produtos/${id}`); load(); } catch (e) { alert(e.message); }
  }

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <p style={S.pageTitle}>Produtos</p>
          <p style={S.pageSub}>{list.length} itens no estoque</p>
        </div>
        <button style={S.btn("primary")} onClick={openNew}>+ Novo Produto</button>
      </div>
      {loading ? <Spinner /> : (
        <div style={S.card}>
          <table style={S.table}>
            <thead>
              <tr>
                {["Nome", "Tipo", "Custo", "Preço Venda", "Estoque", ""].map((h) => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td style={{ ...S.td, color: "#fff", fontWeight: 500 }}>{p.nome}</td>
                  <td style={S.td}><span style={S.badge({ bg: "#1a1a24", text: "#888" })}>{TIPO_PRODUTO_LABELS[p.tipo] || p.tipo}</span></td>
                  <td style={S.td}>R$ {Number(p.custo).toFixed(2)}</td>
                  <td style={{ ...S.td, color: "#34d399" }}>R$ {Number(p.preco_venda).toFixed(2)}</td>
                  <td style={{ ...S.td, color: p.quantidade < 5 ? "#f87171" : "#ccc" }}>{p.quantidade}</td>
                  <td style={{ ...S.td, textAlign: "right" }}>
                    <button style={{ ...S.btn("ghost"), marginRight: 6 }} onClick={() => openEdit(p)}>Editar</button>
                    <button style={S.btn("danger")} onClick={() => remove(p.id)}>Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <Modal title={modal === "new" ? "Novo Produto" : "Editar Produto"} onClose={() => setModal(null)}>
          <Alert msg={error} onClose={() => setError("")} />
          <div style={S.formGrid}>
            <Field label="Nome" full><input style={S.input} value={form.nome || ""} onChange={f("nome")} /></Field>
            <Field label="Tipo" full>
              <select style={S.input} value={form.tipo || "ARMACAO"} onChange={f("tipo")}>
                {Object.entries(TIPO_PRODUTO_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
            <Field label="Custo (R$)"><input type="number" step="0.01" style={S.input} value={form.custo || ""} onChange={f("custo")} /></Field>
            <Field label="Preço Venda (R$)"><input type="number" step="0.01" style={S.input} value={form.preco_venda || ""} onChange={f("preco_venda")} /></Field>
            <Field label="Quantidade" full><input type="number" style={S.input} value={form.quantidade || ""} onChange={f("quantidade")} /></Field>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
            <button style={S.btn("ghost")} onClick={() => setModal(null)}>Cancelar</button>
            <button style={S.btn("primary")} onClick={save}>Salvar</button>
          </div>
        </Modal>
      )}
    </>
  );
}

// ── Ordens de Serviço ─────────────────────────────────────────────────────────
function Ordens({ req }) {
  const [list, setList] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([req("GET", "/ordens"), req("GET", "/clientes")])
      .then(([o, c]) => { setList(o); setClientes(c); setLoading(false); })
      .catch(() => setLoading(false));
  }, [req]);

  useEffect(() => { load(); }, [load]);

  function openNew() {
    setForm({ cliente_id: "", valor: "", status: "EM_PRODUCAO", tipo_lente: "", observacoes: "", od_esferico: "", od_cilindrico: "", od_eixo: "", oe_esferico: "", oe_cilindrico: "", oe_eixo: "" });
    setModal("new"); setError("");
  }

  async function save() {
    try {
      const body = {
        cliente_id: Number(form.cliente_id),
        valor: Number(form.valor),
        status: form.status,
        tipo_lente: form.tipo_lente || undefined,
        observacoes: form.observacoes || undefined,
        od_esferico: form.od_esferico !== "" ? Number(form.od_esferico) : undefined,
        od_cilindrico: form.od_cilindrico !== "" ? Number(form.od_cilindrico) : undefined,
        od_eixo: form.od_eixo !== "" ? Number(form.od_eixo) : undefined,
        oe_esferico: form.oe_esferico !== "" ? Number(form.oe_esferico) : undefined,
        oe_cilindrico: form.oe_cilindrico !== "" ? Number(form.oe_cilindrico) : undefined,
        oe_eixo: form.oe_eixo !== "" ? Number(form.oe_eixo) : undefined,
      };
      if (modal === "new") await req("POST", "/ordens", body);
      else await req("PATCH", `/ordens/${form.id}/status`, { status: form.status });
      setModal(null); load();
    } catch (e) { setError(e.message); }
  }

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <p style={S.pageTitle}>Ordens de Serviço</p>
          <p style={S.pageSub}>{list.length} ordens cadastradas</p>
        </div>
        <button style={S.btn("primary")} onClick={openNew}>+ Nova OS</button>
      </div>
      {loading ? <Spinner /> : (
        <div style={S.card}>
          <table style={S.table}>
            <thead>
              <tr>
                {["Nº OS", "Cliente", "Tipo Lente", "Valor", "Status", "Data", ""].map((h) => <th key={h} style={S.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {list.map((o) => {
                const sc = STATUS_COLORS[o.status] || {};
                const cli = clientes.find((c) => c.id === o.cliente_id);
                return (
                  <tr key={o.id}>
                    <td style={{ ...S.td, color: "#fff", fontFamily: "monospace", fontSize: 12 }}>{o.numero_os}</td>
                    <td style={{ ...S.td, color: "#fff" }}>{cli?.nome || `#${o.cliente_id}`}</td>
                    <td style={S.td}>{o.tipo_lente || "—"}</td>
                    <td style={{ ...S.td, color: "#34d399" }}>R$ {Number(o.valor).toFixed(2)}</td>
                    <td style={S.td}><span style={S.badge(sc)}>{sc.label || o.status}</span></td>
                    <td style={S.td}>{new Date(o.criado_em).toLocaleDateString("pt-BR")}</td>
                    <td style={{ ...S.td, textAlign: "right" }}>
                      <button style={S.btn("ghost")} onClick={() => { setForm({ ...o }); setModal("edit"); setError(""); }}>Status</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <Modal title={modal === "new" ? "Nova Ordem de Serviço" : "Atualizar Status"} onClose={() => setModal(null)}>
          <Alert msg={error} onClose={() => setError("")} />
          {modal === "new" ? (
            <div style={S.formGrid}>
              <Field label="Cliente" full>
                <select style={S.input} value={form.cliente_id} onChange={f("cliente_id")}>
                  <option value="">Selecione...</option>
                  {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </Field>
              <Field label="Tipo de Lente"><input style={S.input} value={form.tipo_lente} onChange={f("tipo_lente")} /></Field>
              <Field label="Valor (R$)"><input type="number" step="0.01" style={S.input} value={form.valor} onChange={f("valor")} /></Field>
              <Field label="OD Esférico"><input type="number" step="0.25" style={S.input} value={form.od_esferico} onChange={f("od_esferico")} /></Field>
              <Field label="OD Cilíndrico"><input type="number" step="0.25" style={S.input} value={form.od_cilindrico} onChange={f("od_cilindrico")} /></Field>
              <Field label="OD Eixo"><input type="number" style={S.input} value={form.od_eixo} onChange={f("od_eixo")} /></Field>
              <Field label="OE Esférico"><input type="number" step="0.25" style={S.input} value={form.oe_esferico} onChange={f("oe_esferico")} /></Field>
              <Field label="OE Cilíndrico"><input type="number" step="0.25" style={S.input} value={form.oe_cilindrico} onChange={f("oe_cilindrico")} /></Field>
              <Field label="OE Eixo"><input type="number" style={S.input} value={form.oe_eixo} onChange={f("oe_eixo")} /></Field>
              <Field label="Observações" full><textarea style={{ ...S.input, minHeight: 60, resize: "vertical" }} value={form.observacoes} onChange={f("observacoes")} /></Field>
            </div>
          ) : (
            <Field label="Status">
              <select style={S.input} value={form.status} onChange={f("status")}>
                {Object.entries(STATUS_COLORS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </Field>
          )}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
            <button style={S.btn("ghost")} onClick={() => setModal(null)}>Cancelar</button>
            <button style={S.btn("primary")} onClick={save}>Salvar</button>
          </div>
        </Modal>
      )}
    </>
  );
}

// ── Vendas ────────────────────────────────────────────────────────────────────
function Vendas({ req }) {
  const [list, setList] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([req("GET", "/vendas"), req("GET", "/clientes")])
      .then(([v, c]) => { setList(v); setClientes(c); setLoading(false); })
      .catch(() => setLoading(false));
  }, [req]);

  useEffect(() => { load(); }, [load]);

  function openNew() {
    setForm({ cliente_id: "", forma_pagamento: "PIX", valor_total: "", itens: [] });
    setModal("new"); setError("");
  }

  async function save() {
    try {
      const body = { ...form, cliente_id: Number(form.cliente_id), valor_total: Number(form.valor_total) };
      await req("POST", "/vendas", body);
      setModal(null); load();
    } catch (e) { setError(e.message); }
  }

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <p style={S.pageTitle}>Vendas</p>
          <p style={S.pageSub}>{list.length} vendas registradas</p>
        </div>
        <button style={S.btn("primary")} onClick={openNew}>+ Nova Venda</button>
      </div>
      {loading ? <Spinner /> : (
        <div style={S.card}>
          <table style={S.table}>
            <thead>
              <tr>
                {["ID", "Cliente", "Pagamento", "Total", "Itens", "Data", ""].map((h) => <th key={h} style={S.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {list.map((v) => {
                const cli = clientes.find((c) => c.id === v.cliente_id);
                return (
                  <tr key={v.id}>
                    <td style={{ ...S.td, color: "#555", fontSize: 12 }}>#{v.id}</td>
                    <td style={{ ...S.td, color: "#fff" }}>{cli?.nome || `#${v.cliente_id}`}</td>
                    <td style={S.td}><span style={S.badge({ bg: "#1a1a24", text: "#888" })}>{PAGAMENTO_LABELS[v.forma_pagamento] || v.forma_pagamento}</span></td>
                    <td style={{ ...S.td, color: "#34d399", fontWeight: 600 }}>R$ {Number(v.valor_total).toFixed(2)}</td>
                    <td style={S.td}>{v.itens?.length || 0} itens</td>
                    <td style={S.td}>{new Date(v.criado_em).toLocaleDateString("pt-BR")}</td>
                    <td style={{ ...S.td, textAlign: "right" }}>
                      <button style={S.btn("danger")} onClick={async () => { if (confirm("Remover venda?")) { try { await req("DELETE", `/vendas/${v.id}`); load(); } catch (e) { alert(e.message); } } }}>Remover</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <Modal title="Nova Venda" onClose={() => setModal(null)}>
          <Alert msg={error} onClose={() => setError("")} />
          <div style={S.formGrid}>
            <Field label="Cliente" full>
              <select style={S.input} value={form.cliente_id} onChange={f("cliente_id")}>
                <option value="">Selecione...</option>
                {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </Field>
            <Field label="Forma de Pagamento">
              <select style={S.input} value={form.forma_pagamento} onChange={f("forma_pagamento")}>
                {Object.entries(PAGAMENTO_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
            <Field label="Valor Total (R$)"><input type="number" step="0.01" style={S.input} value={form.valor_total} onChange={f("valor_total")} /></Field>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
            <button style={S.btn("ghost")} onClick={() => setModal(null)}>Cancelar</button>
            <button style={S.btn("primary")} onClick={save}>Salvar</button>
          </div>
        </Modal>
      )}
    </>
  );
}

// ── Funcionários ──────────────────────────────────────────────────────────────
function Funcionarios({ req }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    req("GET", "/funcionarios").then((d) => { setList(d); setLoading(false); }).catch(() => setLoading(false));
  }, [req]);

  useEffect(() => { load(); }, [load]);

  function openNew() { setForm({ nome: "", email: "", perfil: "ATENDENTE", senha: "" }); setModal("new"); setError(""); }

  async function save() {
    try {
      if (modal === "new") await req("POST", "/funcionarios", form);
      else await req("PUT", `/funcionarios/${form.id}`, { nome: form.nome, email: form.email, perfil: form.perfil, ativo: form.ativo });
      setModal(null); load();
    } catch (e) { setError(e.message); }
  }

  async function toggle(func) {
    try { await req("PUT", `/funcionarios/${func.id}`, { ativo: !func.ativo }); load(); } catch (e) { alert(e.message); }
  }

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <p style={S.pageTitle}>Funcionários</p>
          <p style={S.pageSub}>{list.length} funcionários</p>
        </div>
        <button style={S.btn("primary")} onClick={openNew}>+ Novo Funcionário</button>
      </div>
      {loading ? <Spinner /> : (
        <div style={S.card}>
          <table style={S.table}>
            <thead>
              <tr>{["Nome", "E-mail", "Perfil", "Status", ""].map((h) => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {list.map((fn) => (
                <tr key={fn.id}>
                  <td style={{ ...S.td, color: "#fff", fontWeight: 500 }}>{fn.nome}</td>
                  <td style={S.td}>{fn.email}</td>
                  <td style={S.td}><span style={S.badge(fn.perfil === "GERENTE" ? { bg: "#2d1f6e", text: "#a78bfa" } : { bg: "#1a1a24", text: "#888" })}>{fn.perfil}</span></td>
                  <td style={S.td}>
                    <span style={S.badge(fn.ativo ? { bg: "#0f3d2e", text: "#34d399" } : { bg: "#3d1515", text: "#f87171" })}>
                      {fn.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td style={{ ...S.td, textAlign: "right" }}>
                    <button style={{ ...S.btn("ghost"), marginRight: 6 }} onClick={() => { setForm({ ...fn }); setModal("edit"); setError(""); }}>Editar</button>
                    <button style={S.btn(fn.ativo ? "danger" : "success")} onClick={() => toggle(fn)}>{fn.ativo ? "Desativar" : "Ativar"}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <Modal title={modal === "new" ? "Novo Funcionário" : "Editar Funcionário"} onClose={() => setModal(null)}>
          <Alert msg={error} onClose={() => setError("")} />
          <div style={S.formGrid}>
            <Field label="Nome" full><input style={S.input} value={form.nome || ""} onChange={f("nome")} /></Field>
            <Field label="E-mail" full><input type="email" style={S.input} value={form.email || ""} onChange={f("email")} /></Field>
            <Field label="Perfil">
              <select style={S.input} value={form.perfil || "ATENDENTE"} onChange={f("perfil")}>
                <option value="ATENDENTE">Atendente</option>
                <option value="GERENTE">Gerente</option>
              </select>
            </Field>
            {modal === "new" && (
              <Field label="Senha"><input type="password" style={S.input} value={form.senha || ""} onChange={f("senha")} /></Field>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
            <button style={S.btn("ghost")} onClick={() => setModal(null)}>Cancelar</button>
            <button style={S.btn("primary")} onClick={save}>Salvar</button>
          </div>
        </Modal>
      )}
    </>
  );
}

// ── Relatórios ────────────────────────────────────────────────────────────────
function Relatorios({ req }) {
  const [geral, setGeral] = useState(null);
  const [vendas, setVendas] = useState(null);
  const [ordens, setOrdens] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ inicio: "", fim: "" });

  const load = useCallback(() => {
    setLoading(true);
    const q = dateRange.inicio ? `?data_inicio=${dateRange.inicio}&data_fim=${dateRange.fim}` : "";
    Promise.all([
      req("GET", "/relatorios/geral"),
      req("GET", `/relatorios/vendas${q}`),
      req("GET", `/relatorios/ordens${q}`),
    ]).then(([g, v, o]) => { setGeral(g); setVendas(v); setOrdens(o); setLoading(false); })
      .catch(() => setLoading(false));
  }, [req, dateRange]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <p style={S.pageTitle}>Relatórios</p>
      <p style={S.pageSub}>Dados consolidados do sistema</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "flex-end" }}>
        <div>
          <label style={S.label}>Data início</label>
          <input type="date" style={{ ...S.input, width: 160 }} value={dateRange.inicio} onChange={(e) => setDateRange((p) => ({ ...p, inicio: e.target.value }))} />
        </div>
        <div>
          <label style={S.label}>Data fim</label>
          <input type="date" style={{ ...S.input, width: 160 }} value={dateRange.fim} onChange={(e) => setDateRange((p) => ({ ...p, fim: e.target.value }))} />
        </div>
        <button style={S.btn("primary")} onClick={load}>Filtrar</button>
      </div>

      {loading ? <Spinner /> : (
        <>
          {geral && (
            <>
              <p style={{ fontSize: 13, color: "#555", fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>Visão Geral</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
                {[
                  ["Clientes", geral.total_clientes],
                  ["OS em Produção", geral.os_em_producao],
                  ["OS Prontas", geral.os_prontas],
                  ["OS Entregues", geral.os_entregues],
                  ["Produtos", geral.total_produtos],
                ].map(([label, value]) => (
                  <div key={label} style={S.statCard}>
                    <div style={S.statLabel}>{label}</div>
                    <div style={{ ...S.statValue, fontSize: 22 }}>{value ?? "—"}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          {vendas && (
            <>
              <p style={{ fontSize: 13, color: "#555", fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>Vendas no Período</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
                {[
                  ["Total de Vendas", vendas.total_vendas],
                  ["Receita Total", vendas.receita_total != null ? `R$ ${Number(vendas.receita_total).toFixed(2)}` : "—"],
                  ["Ticket Médio", vendas.ticket_medio != null ? `R$ ${Number(vendas.ticket_medio).toFixed(2)}` : "—"],
                ].map(([label, value]) => (
                  <div key={label} style={S.statCard}>
                    <div style={S.statLabel}>{label}</div>
                    <div style={{ ...S.statValue, fontSize: 20, color: "#34d399" }}>{value}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          {ordens && (
            <>
              <p style={{ fontSize: 13, color: "#555", fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>Ordens de Serviço no Período</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
                {[
                  ["Total de OS", ordens.total_os],
                  ["Valor Total OS", ordens.valor_total != null ? `R$ ${Number(ordens.valor_total).toFixed(2)}` : "—"],
                ].map(([label, value]) => (
                  <div key={label} style={S.statCard}>
                    <div style={S.statLabel}>{label}</div>
                    <div style={{ ...S.statValue, fontSize: 20 }}>{value}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "◈" },
  { id: "clientes", label: "Clientes", icon: "◉" },
  { id: "produtos", label: "Produtos", icon: "◫" },
  { id: "ordens", label: "Ordens de Serviço", icon: "◳" },
  { id: "vendas", label: "Vendas", icon: "◷" },
  { id: "funcionarios", label: "Funcionários", icon: "◎" },
  { id: "relatorios", label: "Relatórios", icon: "◈" },
];

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  const req = useApi(token);

  function handleLogin(t, u) { setToken(t); setUser(u); }
  function handleLogout() { setToken(null); setUser(null); setPage("dashboard"); }

  if (!token) return <Login onLogin={handleLogin} />;

  const pages = { dashboard: Dashboard, clientes: Clientes, produtos: Produtos, ordens: Ordens, vendas: Vendas, funcionarios: Funcionarios, relatorios: Relatorios };
  const PageComponent = pages[page] || Dashboard;

  return (
    <div style={S.app}>
      <nav style={S.sidebar}>
        <div style={S.logo}>
          <div style={S.logoText}>👁️ LimaVision</div>
          <div style={S.logoSub}>OticaSupport</div>
        </div>
        {NAV.map((n) => (
          <div key={n.id} style={S.navItem(page === n.id)} onClick={() => setPage(n.id)}>
            <span style={{ fontSize: 14, opacity: 0.7 }}>{n.icon}</span>
            {n.label}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ padding: "0 16px" }}>
          <div style={{ fontSize: 12, color: "#444", marginBottom: 8 }}>
            {user?.nome}<br />
            <span style={{ color: "#333" }}>{user?.perfil}</span>
          </div>
          <button style={{ ...S.btn("ghost"), width: "100%", justifyContent: "center" }} onClick={handleLogout}>Sair</button>
        </div>
      </nav>
      <main style={S.main}>
        <PageComponent req={req} />
      </main>
    </div>
  );
}

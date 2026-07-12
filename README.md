# Brain27 — Plataforma de Unidades Móveis de Saúde

Site/plataforma de catálogo e **configuração de unidades móveis de saúde** (carreta,
caminhão e van). O interessado escolhe a base veicular, monta os módulos de serviço e
a infraestrutura, e a plataforma calcula em tempo real a **área ocupada, a equipe
recomendada e a ficha técnica** da proposta.

Referências de mercado usadas como norte: soukure.com.br e vrpunidademovel.com.br.
Dados dimensionais (áreas em m², ambientes, equipamentos, equipe) fundamentados nos
Termos de Referência dos editais reais fornecidos (Carreta da Mulher – PE 0050/2024-MA,
Sistema Carretas da Saúde – CIMINAS/MG, e credenciamento de diagnóstico por imagem).

## Arquivos
- `index.html` — estrutura da página
- `styles.css` — design system (navy industrial + acento azul, tipografia Barlow)
- `app.js` — catálogo de serviços + lógica do configurador
- `assets/` — **fotografias reais** (Wikimedia Commons / StockSnap, uso comercial) + `CREDITOS.txt`

## Como visualizar localmente
Por causa das imagens, abra via um servidor (não pelo `file://`):

```bash
cd "/Users/gersongomes/Desktop/Brain27"
python3 -m http.server 8000
# abra http://localhost:8000 no navegador
```

## Publicar (GitHub Pages)
1. Crie um repositório e suba estes arquivos (raiz = este diretório).
2. Settings → Pages → Branch: `main` / `/root`.
3. O site fica em `https://<usuario>.github.io/<repo>/`.

## Como trocar as fotos pelas suas
Todas as imagens estão em `assets/` com nomes fixos (`hero.jpg`, `van.jpg`, `truck.jpg`,
`carreta.jpg`, `m_mamografia.jpg`, etc.). Basta substituir o arquivo mantendo o nome —
o site usa automaticamente. Ideal: fotos reais do seu portfólio de unidades entregues.
O mapa de imagens fica no topo de `app.js` (constante `IMAGES`).

## Personalizar o catálogo
- **Módulos de serviço**: edite a lista `MODULES` em `app.js` (nome, área em m², base
  mínima, tags, equipe). A área alimenta a memória de cálculo do configurador.
- **Bases veiculares**: constante `BASES` (área útil, máximo de ambientes).
- **Infraestrutura**: constante `INFRA`.

O formulário de contato hoje só valida e exibe confirmação no navegador. Para receber
os envios, conecte a um serviço (Formspree, Getform, ou um endpoint próprio) no
`initForm()` de `app.js`.

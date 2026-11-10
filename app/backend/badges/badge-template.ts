const escapeHtml = (value: string = "") =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const badgeTemplate = (
  name: string,
  company: string,
  qrCodeUrl: string,
  urn: string,
  backgroundImage: string
) => {
  const safeName = escapeHtml(name);
  const safeCompany = escapeHtml(company);
  const safeUrn = escapeHtml(urn);

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @page { size: 4in 6in; margin: 0; }
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; background: #fff; }
      body { width: 4in; height: 6in; }
      .badge {
        position: relative;
        width: 4in;
        height: 6in;
        overflow: hidden;
        background: #fff url('${backgroundImage}') center / 100% 100% no-repeat;
      }
      .identity {
        position: absolute;
        top: 2.95in;
        bottom: 0.65in;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        text-align: center;
        padding: 0.1in 0.4in 0;
        overflow: hidden;
      }
      .name {
        width: 100%;
        margin: 0;
        color: #0f172a;
        font-family: 'Segoe UI', 'Inter', Helvetica, Arial, sans-serif;
        font-size: 0.2in;
        font-weight: 700;
        letter-spacing: 0.004in;
        line-height: 1.25;
        word-break: break-word;
        overflow-wrap: anywhere;
        text-transform: uppercase;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        flex-shrink: 0;
      }
      .company {
        width: 100%;
        margin: 0.05in 0 0;
        color: #475569;
        font-family: 'Segoe UI', 'Inter', Helvetica, Arial, sans-serif;
        font-size: 0.14in;
        font-weight: 500;
        letter-spacing: 0.012in;
        line-height: 1.3;
        word-break: break-word;
        overflow-wrap: anywhere;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        flex-shrink: 0;
      }
      .qr {
        width: 1.05in;
        height: 1.05in;
        margin-top: 0.08in;
        padding: 0.055in;
        background: #ffffff;
        border: 1.5px solid #cbd5e1;
        border-radius: 0.08in;
        object-fit: contain;
        flex-shrink: 0;
        box-shadow: 0 1px 4px rgba(0,0,0,0.08);
      }
      .urn {
        margin-top: 0.05in;
        color: #4338ca;
        font-family: 'Segoe UI', 'Inter', Helvetica, Arial, sans-serif;
        font-size: 0.12in;
        font-weight: 700;
        letter-spacing: 0.04in;
        line-height: 1;
        text-transform: uppercase;
        flex-shrink: 0;
      }
    </style>
  </head>
  <body>
    <main class="badge">
      <section class="identity">
        <div class="name">${safeName}</div>
        <div class="company">${safeCompany}</div>
        <img class="qr" src="${qrCodeUrl}" alt="Registration QR code" />
        <div class="urn">${safeUrn}</div>
      </section>
    </main>
  </body>
</html>`;
};
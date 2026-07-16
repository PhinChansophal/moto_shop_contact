// ============================================================
// Moto Finance Contact Card — editor + export logic
// ============================================================

// ---------- state ----------
let phones = ["070 680 780", "088 518 8907"];
let docs = ["អត្តសញ្ញាណប័ណ្ណ", "សៀវភៅគ្រួសារ"];

const phoneIconSVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.3 21 3 13.7 3 5c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.2 1L6.6 10.8z" stroke="#BB9761" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
const tickSVG = `<svg class="tickmark" viewBox="0 0 20 20"><path d="M3 10.5l4.5 4.5L17 5" stroke="#BB9761" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const cardEl = document.getElementById('card');
const bgColorInput = document.getElementById('bgColorInput');
const bgColorText = document.getElementById('bgColorText');
const fontFamilySelect = document.getElementById('fontFamilySelect');
const headlineLine1Input = document.getElementById('headlineLine1Input');
const headlineLine2Input = document.getElementById('headlineLine2Input');
const headlineSizeInput = document.getElementById('headlineSizeInput');
const headlineSizeValue = document.getElementById('headlineSizeValue');
const taglineTextInput = document.getElementById('taglineTextInput');
const taglineSizeInput = document.getElementById('taglineSizeInput');
const taglineSizeValue = document.getElementById('taglineSizeValue');
const contactLabelSizeInput = document.getElementById('contactLabelSizeInput');
const contactLabelSizeValue = document.getElementById('contactLabelSizeValue');
const docsLabelSizeInput = document.getElementById('docsLabelSizeInput');
const docsLabelSizeValue = document.getElementById('docsLabelSizeValue');

function normalizeHexColor(value) {
  const raw = String(value || '').trim();
  if (!raw) return '#16130E';
  const withHash = raw.startsWith('#') ? raw : `#${raw}`;
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(withHash)) {
    const hex = withHash.slice(1);
    if (hex.length === 3) {
      return `#${hex.split('').map(ch => ch + ch).join('').toLowerCase()}`;
    }
    return withHash.toLowerCase();
  }
  return '#16130E';
}

function applyCardBackground(value) {
  const color = normalizeHexColor(value);
  cardEl.style.setProperty('--card-bg', color);
  bgColorInput.value = color;
  bgColorText.value = color;
}

function applyCardFont(fontFamily) {
  const value = fontFamily || "'Nokora', 'Inter', sans-serif";
  cardEl.style.fontFamily = value;
  document.documentElement.style.setProperty('--card-font', value);
  cardEl.style.setProperty('--card-font', value);
}

function bindRangeWithNumber(rangeEl, numberEl, cssVar, fallbackValue) {
  const min = parseInt(rangeEl.min, 10) || 12;
  const max = parseInt(rangeEl.max, 10) || 120;
  const clamp = value => Math.max(min, Math.min(max, Number(value) || fallbackValue));
  const apply = value => {
    const nextValue = clamp(value);
    rangeEl.value = nextValue;
    numberEl.value = nextValue;
    document.documentElement.style.setProperty(cssVar, `${nextValue}px`);
    cardEl.style.setProperty(cssVar, `${nextValue}px`);
  };
  rangeEl.addEventListener('input', e => apply(e.target.value));
  numberEl.addEventListener('input', e => apply(e.target.value));
  apply(fallbackValue);
}

function bindTextSizeControl(rangeEl, numberEl, targetId, fallbackValue) {
  const min = parseInt(rangeEl.min, 10) || 12;
  const max = parseInt(rangeEl.max, 10) || 36;
  const clamp = value => Math.max(min, Math.min(max, Number(value) || fallbackValue));
  const apply = value => {
    const nextValue = clamp(value);
    rangeEl.value = nextValue;
    numberEl.value = nextValue;
    const targetEl = document.getElementById(targetId);
    if (targetEl) targetEl.style.fontSize = `${nextValue}px`;
  };
  rangeEl.addEventListener('input', e => apply(e.target.value));
  numberEl.addEventListener('input', e => apply(e.target.value));
  apply(fallbackValue);
}

function updatePreviewScale() {
  const stage = document.querySelector('.preview-stage');
  if (!stage) return;
  const stageWidth = Math.max(320, stage.getBoundingClientRect().width);
  const availableHeight = Math.max(320, window.innerHeight - 160);
  const widthScale = Math.min(1, stageWidth / 1080);
  const heightScale = Math.min(1, availableHeight / 1350);
  const scale = Math.max(0.42, Math.min(widthScale, heightScale));
  const finalScale = Math.min(1, scale);
  document.documentElement.style.setProperty('--preview-scale', finalScale.toFixed(3));
  cardEl.style.setProperty('--preview-scale', finalScale.toFixed(3));
  stage.style.setProperty('--preview-scale', finalScale.toFixed(3));
}

window.addEventListener('resize', updatePreviewScale);
document.addEventListener('DOMContentLoaded', updatePreviewScale);
setTimeout(updatePreviewScale, 100);

bgColorInput.addEventListener('input', e => applyCardBackground(e.target.value));
bgColorText.addEventListener('input', e => applyCardBackground(e.target.value));
fontFamilySelect.addEventListener('change', e => applyCardFont(e.target.value));
headlineLine1Input.addEventListener('input', e => {
  const el = document.getElementById('pv-headline-line-1');
  if (el) el.textContent = e.target.value;
});
headlineLine2Input.addEventListener('input', e => {
  const el = document.getElementById('pv-headline-line-2');
  if (el) el.textContent = e.target.value;
});
taglineTextInput.addEventListener('input', e => {
  const el = document.getElementById('pv-tagline');
  if (el) {
    const escaped = escapeHtml(e.target.value);
    el.innerHTML = escaped.replace(/\n/g, '<br>');
  }
});
bindRangeWithNumber(headlineSizeInput, headlineSizeValue, '--headline-size', 76);
bindRangeWithNumber(taglineSizeInput, taglineSizeValue, '--tagline-size', 27);
bindTextSizeControl(contactLabelSizeInput, contactLabelSizeValue, 'pv-contactLabel', 19);
bindTextSizeControl(docsLabelSizeInput, docsLabelSizeValue, 'pv-docsLabel', 19);
applyCardBackground('#16130E');
applyCardFont(fontFamilySelect.value);
updatePreviewScale();

// ---------- render: preview ----------
function renderPhonesPreview() {
  const el = document.getElementById('pv-phoneList');
  el.innerHTML = phones.map(p => `<div class="phone-line">${phoneIconSVG}${escapeHtml(p)}</div>`).join('');
}
function renderDocsPreview() {
  const el = document.getElementById('pv-docsList');
  el.innerHTML = docs.map(d => `<div class="doc-item">${tickSVG}${escapeHtml(d)}</div>`).join('');
}

// ---------- render: editor rows ----------
function renderPhonesEditor() {
  const el = document.getElementById('phoneList');
  el.innerHTML = phones.map((p, i) => `
    <div class="phone-row">
      <input type="text" class="form-control phone-input" data-index="${i}" value="${escapeAttr(p)}">
      <button type="button" class="remove-btn" data-remove-phone="${i}">✕</button>
    </div>`).join('');

  el.querySelectorAll('.phone-input').forEach(inp => {
    inp.addEventListener('input', e => {
      phones[+e.target.dataset.index] = e.target.value;
      renderPhonesPreview();
    });
  });
  el.querySelectorAll('[data-remove-phone]').forEach(btn => {
    btn.addEventListener('click', e => {
      phones.splice(+e.target.dataset.removePhone, 1);
      renderPhonesEditor();
      renderPhonesPreview();
    });
  });
}

function renderDocsEditor() {
  const el = document.getElementById('docsList');
  el.innerHTML = docs.map((d, i) => `
    <div class="doc-row">
      <input type="text" class="form-control doc-input" data-index="${i}" value="${escapeAttr(d)}">
      <button type="button" class="remove-btn" data-remove-doc="${i}">✕</button>
    </div>`).join('');

  el.querySelectorAll('.doc-input').forEach(inp => {
    inp.addEventListener('input', e => {
      docs[+e.target.dataset.index] = e.target.value;
      renderDocsPreview();
    });
  });
  el.querySelectorAll('[data-remove-doc]').forEach(btn => {
    btn.addEventListener('click', e => {
      docs.splice(+e.target.dataset.removeDoc, 1);
      renderDocsEditor();
      renderDocsPreview();
    });
  });
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function escapeAttr(s) { return escapeHtml(s); }

// ---------- init lists ----------
renderPhonesEditor();
renderPhonesPreview();
renderDocsEditor();
renderDocsPreview();

document.getElementById('addPhoneBtn').addEventListener('click', () => {
  phones.push('');
  renderPhonesEditor();
  renderPhonesPreview();
});
document.getElementById('addDocBtn').addEventListener('click', () => {
  docs.push('');
  renderDocsEditor();
  renderDocsPreview();
});

// ---------- cover image ----------
document.getElementById('coverInput').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  document.getElementById('pv-cover').src = URL.createObjectURL(file);
});

// ---------- QR image ----------
document.getElementById('qrInput').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  document.getElementById('pv-qr').src = URL.createObjectURL(file);
});

// ---------- simple text bindings ----------
bindText('contactLabel', 'pv-contactLabel');
bindText('docsLabel', 'pv-docsLabel');
bindText('tgUsername', 'pv-tgUsername');
bindText('qrCaption', 'pv-qrCaption');
bindText('footerTel', 'pv-footerTel');
bindText('footerTg', 'pv-footerTg');

// footer brand + top wordmark share one input
document.getElementById('footerBrand').addEventListener('input', e => {
  document.getElementById('pv-footerBrand').innerHTML =
    escapeHtml(e.target.value) + ' <span></span>';
  document.getElementById('pv-footerBrandTop').textContent = e.target.value.toUpperCase();
});

function bindText(inputId, targetId) {
  document.getElementById(inputId).addEventListener('input', e => {
    document.getElementById(targetId).textContent = e.target.value;
  });
}

// ============================================================
// EXPORT
// ============================================================

async function buildOffscreenClone() {
  await (document.fonts && document.fonts.ready);

  const original = document.getElementById('card');
  const clone = original.cloneNode(true);
  clone.classList.add('exporting');
  clone.style.width = '1080px';
  clone.style.height = 'auto';
  clone.style.minHeight = '1350px';
  clone.style.maxWidth = 'none';
  clone.style.aspectRatio = 'auto';
  clone.style.transform = 'none';
  clone.style.margin = '0';
  clone.style.marginBottom = '0';
  clone.style.boxShadow = 'none';
  clone.style.overflow = 'visible';
  clone.id = 'card-export-clone';

  const holder = document.createElement('div');
  holder.style.position = 'fixed';
  holder.style.top = '0';
  holder.style.left = '-99999px';
  holder.style.zIndex = '-1';
  holder.appendChild(clone);
  document.body.appendChild(holder);

  // give the browser a tick to load any blob-URL images inside the clone
  await new Promise(r => setTimeout(r, 60));

  const exportHeight = Math.max(1350, clone.scrollHeight + 24);
  clone.style.height = `${exportHeight}px`;
  holder.style.height = `${exportHeight}px`;

  return { clone, holder, exportHeight };
}

async function captureCanvas() {
  const { clone, holder, exportHeight } = await buildOffscreenClone();
  try {
    const backgroundColor = getComputedStyle(document.getElementById('card')).getPropertyValue('--card-bg').trim() || '#16130E';
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor,
      width: 1080,
      height: exportHeight
    });
    return { canvas, exportHeight };
  } finally {
    holder.remove();
  }
}

document.getElementById('exportImageBtn').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  const originalLabel = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Rendering…';
  try {
    const { canvas } = await captureCanvas();
    const link = document.createElement('a');
    link.download = 'moto-contact-card.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    alert('Image export failed: ' + err.message);
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.textContent = originalLabel;
  }
});

document.getElementById('exportPdfBtn').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  const originalLabel = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Rendering…';
  try {
    const { canvas, exportHeight } = await captureCanvas();
    // JPEG keeps the PDF a reasonable size to actually send/print;
    // quality 0.92 is visually lossless for this kind of flat-color design
    const imgData = canvas.toDataURL('image/jpeg', 0.92);

    const { jsPDF } = window.jspdf;
    const pdfWidth = 180;              // mm
    const pdfHeight = pdfWidth * (exportHeight / 1080);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [pdfWidth, pdfHeight]
    });
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('moto-contact-card.pdf');
  } catch (err) {
    alert('PDF export failed: ' + err.message);
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.textContent = originalLabel;
  }
});


document.addEventListener('click', function (event) {
  const btn = event.target.closest('[data-tab-target]');
  if (!btn) return;
  const row = btn.closest('[data-tab-group]');
  if (!row) return;
  const scope = row.getAttribute('data-tab-group');
  row.querySelectorAll('[data-tab-target]').forEach(item => {
    item.classList.toggle('active', item === btn);
  });
  document.querySelectorAll('[data-tab-panel]').forEach(panel => {
    if (panel.getAttribute('data-tab-group') !== scope) return;
    panel.classList.toggle('active', panel.getAttribute('data-tab-panel') === btn.getAttribute('data-tab-target'));
  });
});

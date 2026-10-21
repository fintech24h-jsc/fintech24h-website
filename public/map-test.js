// Internal coordinate tool for public/map-test.html (kept external so the
// site CSP needs no hash or 'unsafe-inline' for it).
const container = document.getElementById('map-container');
const info = document.getElementById('info');
const log = document.getElementById('log');

container.addEventListener('click', (e) => {
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const percentLeft = ((x / rect.width) * 100).toFixed(2);
  const percentTop = ((y / rect.height) * 100).toFixed(2);
  
  const msg = `Clicked at: left: ${percentLeft}%; top: ${percentTop}%`;
  info.textContent = msg;
  
  const p = document.createElement('p');
  p.textContent = msg;
  log.appendChild(p);

  // Create a visual marker
  const marker = document.createElement('div');
  marker.style.position = 'absolute';
  marker.style.left = percentLeft + '%';
  marker.style.top = percentTop + '%';
  marker.style.width = '10px';
  marker.style.height = '10px';
  marker.style.background = 'red';
  marker.style.borderRadius = '50%';
  marker.style.transform = 'translate(-50%, -50%)';
  container.appendChild(marker);
});

import { toCanvas } from 'qrcode';

interface RenderQrOptions {
  url: string;
}

export async function renderQr(container: HTMLElement, options: RenderQrOptions): Promise<void> {
  const canvas = document.createElement('canvas');
  canvas.className = 'qr-canvas';

  await toCanvas(canvas, options.url, {
    width: 320,
    margin: 1,
    color: {
      dark: '#f4f6fa',
      light: '#00000000',
    },
  });
  // `toCanvas` injects inline dimensions; force responsive sizing inside the frame.
  canvas.style.width = '100%';
  canvas.style.height = '100%';

  container.innerHTML = '';
  container.classList.add('qr-dock--ready');

  const title = document.createElement('p');
  title.className = 'qr-title';
  title.textContent = 'Open on Mobile';

  const frame = document.createElement('div');
  frame.className = 'qr-canvas-frame';
  frame.append(canvas);

  container.append(title, frame);
}

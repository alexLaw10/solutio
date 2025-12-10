import type { Preview } from '@storybook/web-components';

// Importa os estilos globais
import '../src/styles/_global.scss';

// Importa o loader do Stencil
// O caminho pode variar dependendo de onde o build está localizado
// Se o build ainda não foi executado, vamos usar uma abordagem dinâmica
let loaderLoaded = false;

async function loadStencilLoader() {
  if (loaderLoaded) return;
  
  try {
    // Tenta importar o loader do build
    // Primeiro tenta o caminho relativo do loader
    try {
      const loader = await import('../../loader/index.js');
      if (loader.defineCustomElements) {
        loader.defineCustomElements();
        loaderLoaded = true;
        return;
      }
    } catch (e) {
      // Se falhar, tenta importar do dist
      try {
        const loader = await import('../../dist/loader/index.js');
        if (loader.defineCustomElements) {
          loader.defineCustomElements();
          loaderLoaded = true;
          return;
        }
      } catch (e2) {
        console.warn('Stencil loader não encontrado. Execute "nx build solutio-ds" primeiro.');
        console.warn('Erro ao carregar loader:', e2);
      }
    }
  } catch (error) {
    console.warn('Erro ao carregar Stencil loader:', error);
  }
}

loadStencilLoader();

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
  },
};

export default preview;

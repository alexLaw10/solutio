// Import do loader do Solutio Design System (gerado após o build)
// eslint-disable-next-line @nx/enforce-module-boundaries
import { defineCustomElements } from '@solutio-v2/solutio-ds/loader';

// Define os custom elements do Solutio Design System
console.log('[SDS] Carregando componentes...');
try {
  defineCustomElements();
  console.log('[SDS] Componentes carregados com sucesso!');
} catch (error) {
  console.error('[SDS] ERRO ao carregar componentes:', error);
}

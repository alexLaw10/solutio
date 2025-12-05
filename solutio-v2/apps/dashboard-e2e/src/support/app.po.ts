// Page Object Model helpers for the dashboard app

export const getNavbar = () => cy.get('solutio-v2-navbar');
export const getSidebar = () => cy.get('solutio-v2-sidebar');
export const getHomeComponent = () => cy.get('solutio-v2-home');
export const getTableComponent = () => cy.get('solutio-v2-table');
export const getAlertComponent = () => cy.get('solutio-v2-alert');

// Sidebar helpers
export const getSidebarLinks = () => cy.get('solutio-v2-sidebar a');
export const getSidebarHomeLink = () => cy.get('solutio-v2-sidebar a[href="/home"]');

// Navbar helpers
export const getThemeToggle = () => cy.get('solutio-v2-theme-toggle button');

// Table helpers
export const getTableRows = () => cy.get('solutio-v2-table tbody tr');
export const getTableHeader = () => cy.get('solutio-v2-table thead');
export const getTableStartDateInput = () => cy.get('solutio-v2-table input[type="date"][formControlName="start"]');
export const getTableEndDateInput = () => cy.get('solutio-v2-table input[type="date"][formControlName="end"]');
export const getTableCitySelect = () => cy.get('solutio-v2-table select[formControlName="city"]');
export const getLoadMoreButton = () => cy.get('solutio-v2-table button').contains('Carregar mais');
export const getAllLoadedMessage = () => cy.get('solutio-v2-table').contains('Todos os dados foram carregados');

// KPI helpers
export const getKpiComponent = () => cy.get('solutio-v2-kpi');
export const getKpiCards = () => cy.get('solutio-v2-kpi .kpi-card');

// Chart helpers
export const getAreaChart = () => cy.get('solutio-v2-area apex-charts');
export const getBarChart = () => cy.get('solutio-v2-bar apex-charts');
export const getDonutChart = () => cy.get('solutio-v2-donut apex-charts');

// Alert helpers
export const getAlertMessage = () => cy.get('solutio-v2-alert .alert');
export const getCloseAlertButton = () => cy.get('solutio-v2-alert button[aria-label="Fechar alerta"]');

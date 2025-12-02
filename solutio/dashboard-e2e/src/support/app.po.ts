// Navigation components
export const getNavbar = () => cy.get('solutio-navbar');
export const getSidebar = () => cy.get('solutio-sidebar');
export const getSidebarLinks = () => cy.get('solutio-sidebar .sidebar__link');
export const getThemeToggle = () => cy.get('solutio-theme-toggle button');
export const getMainContent = () => cy.get('#main-content');
export const getSkipLink = () => cy.get('.skip-link');

// Table components
export const getTable = () => cy.get('solutio-table');
export const getTableRows = () => cy.get('solutio-table table tbody tr');
export const getTableHeaders = () => cy.get('solutio-table table thead th');
export const getLoadMoreButton = () => cy.get('design-system-load-more-button');

// Form components
export const getStartDateInput = () => cy.get('design-system-date-input[label="Data de Início"]');
export const getEndDateInput = () => cy.get('design-system-date-input[label="Data de Fim"]');
export const getCitySelect = () => cy.get('design-system-select[label="Cidade"]');
export const getSearchButton = () => cy.get('design-system-search-button');

// Chart components
export const getKpiCards = () => cy.get('solutio-kpi .kpi-card');
export const getBarChart = () => cy.get('solutio-bar');
export const getAreaChart = () => cy.get('solutio-area');
export const getDonutChart = () => cy.get('solutio-donut');

// Status components
export const getLoadingIndicator = () => cy.get('[role="status"]');
export const getAlert = () => cy.get('[role="alert"]');
export const getErrorMessage = () => cy.get('solutio-alert');

// Utility getters
export const getMainContent = () => cy.get('#main-content');
export const getSkipLink = () => cy.get('.skip-link');

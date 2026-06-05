const BASE_URL = "http://localhost:3000";

// CASOS FELIZ

describe("Login", () => {

    it("Login exitoso", () => {
        cy.visit(BASE_URL);

        cy.get('[data-testid="login-username"]').type("admin");
        cy.get('[data-testid="login-password"]').type("1234");
        cy.get('[data-testid="login-submit"]').click();

        cy.url().should("include", "producto.html");
    });

    it("Login validacion campos obligatorios", () => {
        cy.visit(BASE_URL);

        cy.get('[data-testid="login-submit"]').click();

        cy.get('[data-testid="login-username-error"]').should("have.text", "El campo usuario es obligatorio.");
        cy.get('[data-testid="login-password-error"]').should("have.text", "El campo contrasena es obligatorio.");
    });

    it("Login credenciales invalidas", () => {
        cy.visit(BASE_URL);

        cy.get('[data-testid="login-username"]').type("admin");
        cy.get('[data-testid="login-password"]').type("incorrecta");
        cy.get('[data-testid="login-submit"]').click();

        cy.get('[data-testid="login-status"]').should("contain.text", "incorrectos");
        cy.get('[data-testid="login-status"]').should("have.text", "Usuario o contrasena incorrectos");
    });

});

describe("Productos", () => {

    it("Producto alta exitosa", () => {
        cy.visit(`${BASE_URL}/producto.html`);

        cy.get('[data-testid="producto-codigo"]').type("PRD001");
        cy.get('[data-testid="producto-nombre"]').type("Notebook");
        cy.get('[data-testid="producto-precio"]').type("1000");
        cy.get('[data-testid="producto-stock"]').type("10");

        cy.get('[data-testid="producto-submit"]').click();

        cy.get('[data-testid="producto-status"]').should("have.text", "Producto cargado en API");
    });

    it("Producto validacion campos obligatorios", () => {
        // Deberia loguearme primero, pero actualmente producto.html no tiene proteccion de acceso
        cy.visit(`${BASE_URL}/producto.html`);

        cy.get('[data-testid="producto-submit"]').click();

        cy.get('[data-testid="producto-status"]').should("contain.text", "Datos invalidos.");

        cy.get('[data-testid="producto-codigo-error"]').should("have.text", "El codigo es obligatorio.");
        cy.get('[data-testid="producto-nombre-error"]').should("have.text", "El nombre es obligatorio.");
        cy.get('[data-testid="producto-precio-error"]').should("have.text", "El precio debe ser mayor a 0.");
    });

    it("Producto precio negativo", () => {
        cy.visit(`${BASE_URL}/producto.html`);

        cy.get('[data-testid="producto-codigo"]').type("PRD002");
        cy.get('[data-testid="producto-nombre"]').type("Producto Precio Negativo");
        cy.get('[data-testid="producto-precio"]').type("-100");
        cy.get('[data-testid="producto-stock"]').type("5");

        cy.get('[data-testid="producto-submit"]').click();

        cy.get('[data-testid="producto-status"]').should("contain.text", "Datos invalidos.");
        cy.get('[data-testid="producto-precio-error"]').should("have.text", "El precio debe ser mayor a 0.");
    });

    it("Producto stock negativo", () => {
        cy.visit(`${BASE_URL}/producto.html`);

        cy.get('[data-testid="producto-codigo"]').type("PRD003");
        cy.get('[data-testid="producto-nombre"]').type("Producto Stock Negativo");
        cy.get('[data-testid="producto-precio"]').type("100");
        cy.get('[data-testid="producto-stock"]').type("-5");

        cy.get('[data-testid="producto-submit"]').click();

        cy.get('[data-testid="producto-status"]').should("contain.text", "Datos invalidos.");
        cy.get('[data-testid="producto-stock-error"]').should("have.text", "El stock no puede ser negativo.");
    });

    // CASO NEGATIVO DE NEGOCIO
    // Este test solo funcionaria si el backend implementa la validacion
    // de codigo duplicado.

    it("Producto codigo duplicado", () => {
        cy.visit(`${BASE_URL}/producto.html`);

        cy.get('[data-testid="producto-codigo"]').type("EXISTENTE");
        cy.get('[data-testid="producto-nombre"]').type("Producto Duplicado");
        cy.get('[data-testid="producto-precio"]').type("100");
        cy.get('[data-testid="producto-stock"]').type("5");

        cy.get('[data-testid="producto-submit"]').click();

        cy.get('[data-testid="producto-status"]').should("contain.text", "Datos invalidos.");
        cy.get('[data-testid="producto-codigo-error"]').should("have.text", "El codigo ya existe.");
    });

});
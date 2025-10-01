Feature: Comprar productos

  Scenario: Comprar un producto con stock
    Given existen productos
    When compro el producto "Arroz 1Kg"
    Then el sistema guarda la compra

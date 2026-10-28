-- V12 adicionou a coluna icon_url, mas nunca populou nenhuma linha -- as 6
-- categorias semeadas por V7 ficaram com icon_url NULL desde então, e é por
-- isso que GET /items/search (e /items/{id}) nunca devolviam um icon_url de
-- verdade. Placeholder temporário: mesma URL que o front-end já usa no mock
-- de objetos.json, até o time escolher um ícone definitivo por categoria.
UPDATE categories
SET icon_url = 'https://img.icons8.com/?size=100&id=72717&format=png&color=737373'
WHERE icon_url IS NULL;

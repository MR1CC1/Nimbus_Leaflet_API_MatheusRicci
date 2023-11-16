# Nimbus_Leaflet_API_MatheusRicci


1. App.js
Descrição: Arquivo principal da aplicação React. Configura as rotas e renderiza os componentes principais.
Componentes:
App: Define as rotas do aplicativo usando react-router-dom para navegação entre as páginas Gerenciamento e Visualizacao.

2. HeaderAreas.js
Descrição: Componente responsável pela visualização e manipulação de áreas no mapa.
Componentes:
HeaderAreas: Utiliza o react-leaflet para exibir e interagir com áreas retangulares no mapa. Inclui estado e lógica para manipulação de áreas.

3. HeaderInicialMap.js
Descrição: Componente para a visualização inicial do mapa.
Componentes:
HeaderInicialMap: Configura o mapa inicial usando react-leaflet. Mantém o estado relacionado ao formulário e exibe o mapa com funcionalidades básicas.

4. HeaderPerimeters.js
Descrição: Componente para gerenciamento de perimetros no mapa.
Componentes:
HeaderPerimeters: Utiliza react-leaflet para desenhar e gerenciar perimetros circulares no mapa.

5. HeaderPoint.js
Descrição: Componente para manipulação de pontos no mapa.
Componentes:
HeaderPoint: Permite a criação e edição de pontos no mapa, utilizando react-leaflet.

6. Visualizacao.js
Descrição: Página de visualização do mapa com diferentes elementos.
Componentes:
Visualizacao: Exibe o mapa com marcadores, áreas e círculos, integrando funcionalidades de visualização detalhada.

7. Gerenciamento.js
Descrição: Página para gerenciamento de elementos no mapa.
Componentes:
Gerenciamento: Interface para gerenciar diferentes elementos no mapa, como pontos, áreas e perimetros. Inclui integração com componentes específicos de gerenciamento.

8. SideBar.jsx
Descrição: Componente da barra lateral para navegação.
Componentes:
SideBar: Barra lateral com links de navegação, utilizando react-router-dom para roteamento. Contém lógica para destaque de itens ativos com base na rota atual.

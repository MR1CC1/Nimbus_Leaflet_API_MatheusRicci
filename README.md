# Nimbus_Leaflet_API_MatheusRicci

## Este é um Teste Prático da Nimbus para Desenvolvedor Front End Pleno

Desenvolva uma aplicação web para visualização e gerenciamento de pontos e áreas de
interesse em um mapa. Utilize o React e a biblioteca Leaflet para a implementação da solução.
Para armazenar os dados, deve-se utilizar uma biblioteca de mock de API, e a
comunicação com ela deve ser feita como se estivesse utilizando uma API RESTful. O formato
dos dados e dos endpoints pode ser definido de acordo com as necessidades.

1 - Para Instalar os pacotes da aplicação primeiro execute em "Nimbus_Leaflet_API_MatheusRicci\nimbus-leaflet-api-matheus-ricci" o comando

### `npm i`

2 - Em seguida inicie o Json Server em "Nimbus_Leaflet_API_MatheusRicci\nimbus-leaflet-api-matheus-ricci\src>" e execute

### `json-server --watch db.json --port 3001`

3 - Com o json Server iniciado, inicie a aplicação executando em "Nimbus_Leaflet_API_MatheusRicci\nimbus-leaflet-api-matheus-ricci\src>" o comando

### `npm start`

## [Clique Aqui](https://www.linkedin.com/in/matheus-ricci-228a06182/) Para acessar meu perfil no Linkedin - Matheus Ricci

## Segue Prints do Projeto
![Screenshot_1](https://github.com/MR1CC1/Nimbus_Leaflet_API_MatheusRicci/assets/57235913/01975c19-0783-4702-ba56-fcf0eae90f05)
![Screenshot_2](https://github.com/MR1CC1/Nimbus_Leaflet_API_MatheusRicci/assets/57235913/9bacd61f-efdc-43c1-ad34-4f779cbedec5)
![Screenshot_3](https://github.com/MR1CC1/Nimbus_Leaflet_API_MatheusRicci/assets/57235913/f5a07a1b-8a7f-46bd-a9cf-961c96039268)
![Screenshot_4](https://github.com/MR1CC1/Nimbus_Leaflet_API_MatheusRicci/assets/57235913/f6d2c444-1c45-47c6-af91-5d631c504cbc)
![Screenshot_5](https://github.com/MR1CC1/Nimbus_Leaflet_API_MatheusRicci/assets/57235913/33894ff4-a2a2-4c29-b24e-5c15b375103e)
![Screenshot_6](https://github.com/MR1CC1/Nimbus_Leaflet_API_MatheusRicci/assets/57235913/dd0e8ac4-d6ad-40c1-b537-a60061e9d998)

## Segue abaixo uma documentação resumida da aplicação

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

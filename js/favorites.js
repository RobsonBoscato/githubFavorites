export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`;

    return fetch(endpoint)
      .then(data => data.json())
      .then(data => ({
        login: data.login,
        name: data.name,
        public_repos: data.public_repos,
        followers: data.followers,
      }));
  }
}

//classe que vai conter a logica dos dados e estruturação
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();

    GithubUser.search('uzumaki').then(user => console.log(user));
  }

  load() {
    const entries = JSON.parse(localStorage.getItem('@github-favorites')) || [];

    this.entries = [];
  }

  async add(username) {
    const user = await GithubUser.search(username);
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      entry => entry.user_Login !== user.user_Login
    );

    this.entries = filteredEntries;

    this.update();
  }
}

//classe que vai criar a visualizacao e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector('table tbody');

    this.update();

    this.addUser();
  }

  addUser() {
    const addButton = this.root.querySelector('.search button');

    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input');

      this.add(value);
    };
  }

  createRow() {
    const tr = document.createElement('tr');

    tr.innerHTML = `
    <td class="user">
    
    <img
    src="https://github.com/RobsonBoscato.png"
      alt="imagem do usuário" />

    <a href="http://github.com/robsonboscato" target="_blank">
      <p>Robson Boscato</p>
      <span>robsonboscato</span>
    </a>

    </td>
    <td class="repositories">999</td>
    <td class="followers">3.344.333</td>
    <td> <button class="remove">&times;</button> </td>`;

    return tr;
  }

  update() {
    this.removeAllTr();

    this.entries.forEach(user => {
      const row = this.createRow();

      row.querySelector(
        '.user img'
      ).src = `https://github.com/${user.user_Login}.png`;

      row.querySelector('.user img').alt = `imagem de ${user.user_Login}`;

      row.querySelector(
        '.user a'
      ).href = `https://github.com/${user.user_Login}`;

      row.querySelector('.user a p').textContent = user.user_Name;

      row.querySelector('.user a span').textContent = user.user_Login;

      row.querySelector('.repositories').textContent = user.user_Repos;

      row.querySelector('.followers').innerHTML = user.user_Followers;
      this.tbody.append(row);

      row.querySelector('.remove').onclick = () => {
        const confirmed = confirm(
          'Tem certeza que deseja remover esse usuário da lista?'
        );
        if (confirmed) {
          this.delete(user);
        }
      };
    });
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach(tr => {
      tr.remove();
    });
  }
}

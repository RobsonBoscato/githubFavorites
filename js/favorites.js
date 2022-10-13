import { GithubUser } from './githubUser.js';
//classe que vai conter a logica dos dados e estruturação
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [];
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username);

      if (userExists) {
        throw new Error('Usuário já cadastrado');
      }

      const user = await GithubUser.search(username);

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!');
      }

      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      entry => entry.login !== user.login
    );

    this.entries = filteredEntries;
    this.update();
    this.save();
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
      ).src = `https://github.com/${user.login}.png`;

      row.querySelector('.user img').alt = `imagem de ${user.login}`;

      row.querySelector(
        '.user a'
      ).href = `https://github.com/users/${user.login}`;

      row.querySelector('.user a p').textContent = user.name;

      row.querySelector('.user a span').textContent = user.login;

      row.querySelector('.repositories').textContent = user.public_repos;

      row.querySelector('.followers').innerHTML = user.followers;
      this.tbody.append(row);

      row.querySelector('.remove').onclick = () => {
        const confirmed = confirm('Deseja remover esse usuário da lista?');
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

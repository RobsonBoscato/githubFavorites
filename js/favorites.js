export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = [
      {
        user_Login: 'robsonboscato',
        user_Name: 'robsonboscato',
        user_Repos: 25,
        user_Followers: 9,
      },
      {
        user_Login: 'filipedeschamps',
        user_Name: 'Filipe Deschamps',
        user_Repos: 5555,
        user_Followers: 999999,
      },
      {
        user_Login: 'naruto',
        user_Name: 'dattebayo',
        user_Repos: 32,
        user_Followers: 22,
      },
    ];
  }
  delete(user) {
    const filteredEntries = this.entries.filter(
      entry => entry.user_Login !== user.user_Login
    );

    this.entries = filteredEntries;

    this.update();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector('table tbody');

    this.update();

    this.createRow();
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

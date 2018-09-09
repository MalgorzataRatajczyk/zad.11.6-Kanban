document.addEventListener('DOMContentLoaded', function() {
    // here we will put the code of our application
    // Funkcja randomString() generuje id dla kolumn i karteczek, które składa się z ciągu 10 losowo wybranych znaków.
    function randomString() {
        var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
        var str = '';
        for (var i = 0; i < 10; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    }
    //funkcja, która pobiera templatkę HTML z pliku index.html, parsuje ją, renderuje z użyciem biblioteki szablonów, a następnie zwraca gotowy rezultat
    function generateTemplate(name, data, basicElement) {
        var template = document.getElementById(name).innerHTML;
        var element = document.createElement(basicElement || 'div');
      
        Mustache.parse(template);
        element.innerHTML = Mustache.render(template, data);
      
        return element;
      }

    //funkcja konstruująca klasę Column
    function Column(name) {
        var self = this;

        this.id = randomString();
        this.name = name;
        this.element = generateTemplate('column-template', { name: this.name });

        //podpinanie zdarzenia - kasowanie kolumny po kliknięciu w przycisk i dodawania karteczki
        this.element.querySelector('.column').addEventListener('click', function (event) {
            if (event.target.classList.contains('btn-delete')) {
                self.removeColumn();
            }
      
            if (event.target.classList.contains('add-card')) {
                self.addCard(new Card(prompt("Enter the name of the card")));
            }
        });
    }
    // dodanie dwóch metod do prototypu klasy Column: usuwanie kolumny i dodanie karty.
    Column.prototype = {
        addCard: function(card) {
          this.element.querySelector('ul').appendChild(card.element);
        },
        removeColumn: function() {
          this.element.parentNode.removeChild(this.element);
        }
    };
    // funkcja konstruująca kalsę Card 
    function Card(description) {
        var self = this;
      
        this.id = randomString();
        this.description = description;
        this.element = generateTemplate('card-template', { description: this.description }, 'li');
        //podpinanie zdarzenia - kasowanie karteczki po kliknięciu w przycisk
        this.element.querySelector('.card').addEventListener('click', function (event) {
            event.stopPropagation();
          
            if (event.target.classList.contains('btn-delete')) {
              self.removeCard();
            }
        });
    }
    // dodanie metody do prototypu klasy Card: usuwanie karty.
    Card.prototype = {
        removeCard: function() {
            this.element.parentNode.removeChild(this.element);
        }
    }
    //obiekt tablicy z przypiętym odpowiednim nasłuchiwaniem zdarzeń. 
    var board = {
        name: 'Kanban Board',
        addColumn: function(column) {
            this.element.appendChild(column.element);
            initSortable(column.id); //About this feature we will tell later
        },
        element: document.querySelector('#board .column-container')
    };
    // implementacja funkcji initSortable, która pozwala nam przenosić elementy na stronie, np. do innej kolumny albo do innej pozycji w tej samej kolumnie
    function initSortable(id) {
        var el = document.getElementById(id);
        var sortable = Sortable.create(el, {
          group: 'kanban',
          sort: true
        });
      }
      // tablica ma w sobie przycisk służący do dodawania kolejnych kolumn. Poniżej podpinamy na ten element zdarzenie kliknięcia, aby obsługiwało wrzucanie nowej kolumny do tablicy.
      document.querySelector('#board .create-column').addEventListener('click', function() {
        var name = prompt('Enter a column name');
        var column = new Column(name);
        board.addColumn(column);
    });

    // fragmenty kodu odpowiadające za stworzenie podstawowych elementów w kanbanie:
    // CREATING COLUMNS
    var todoColumn = new Column('To do');
    var doingColumn = new Column('Doing');
    var doneColumn = new Column('Done');

    // ADDING COLUMNS TO THE BOARD
    board.addColumn(todoColumn);
    board.addColumn(doingColumn);
    board.addColumn(doneColumn);

    // CREATING CARDS
    var card1 = new Card('New task');
    var card2 = new Card('Create kanban boards');

    // ADDING CARDS TO COLUMNS
    todoColumn.addCard(card1);
    doingColumn.addCard(card2);

});
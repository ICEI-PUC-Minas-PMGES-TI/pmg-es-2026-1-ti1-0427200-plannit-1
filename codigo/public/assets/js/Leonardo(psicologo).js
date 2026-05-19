const menuItems = document.querySelectorAll('.menu-item');
const pages = document.querySelectorAll('.page');

menuItems.forEach(item => {

  item.addEventListener('click', () => {

    const page = item.getAttribute('data-page');

    pages.forEach(section => {
      section.classList.remove('active-page');
    });

    menuItems.forEach(menu => {
      menu.classList.remove('active');
    });

    document.getElementById(page).classList.add('active-page');

    item.classList.add('active');

  });

});


const aceitarBtns = document.querySelectorAll('.btn-aceitar');
const recusarBtns = document.querySelectorAll('.btn-recusar');

aceitarBtns.forEach(btn => {

  btn.addEventListener('click', () => {

    alert('Solicitação aceita!');

  });

});

recusarBtns.forEach(btn => {

  btn.addEventListener('click', () => {

    alert('Solicitação recusada!');

  });

});
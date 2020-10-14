const sidebar = document.getElementById('sidebar');

document.getElementById('show')
  .addEventListener('click', () => {
    sidebar.classList.toggle('display');
  });
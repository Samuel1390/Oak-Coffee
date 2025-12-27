
import {applyTheme, loadTheme, mostPopularCoffeesList, renderThemeButton, saveTheme, updateTheme} from './okc-menu.objects.js'

// Importar el gestor de favoritos
import {
    initializeFavoriteButtons,
    updateFavoritesCounter
} from './favorites-manager.js';

const headerNav = document.querySelector('.header-nav')

const mainContainer = document.querySelector('body')
const asideMenuContainer = document.querySelector('.aside-menu-container')
const aside = document.getElementById('aside-menu');
const asideButtonMenu = document.getElementById('aside-menu-button');
const productsButton = document.getElementById('products-button');
const headerMenuLabel = document.getElementById('checkbox-menu-label');
const asideMainMenu = document.getElementById('aside-nav-menu');
const note = document.querySelector('.note')

renderThemeButton(headerNav)
renderThemeButton(asideMainMenu, true)
const themeButton = document.querySelector('.theme-button')
const asideThemeButton = document.querySelector('.aside-theme-button')
asideThemeButton.style.color = '#fcd596'
applyTheme(mainContainer)

function openAside(showMenuNav= false) {
    if (aside.classList.contains('visible')) {
        aside.classList.remove('visible');
    } else {
        aside.classList.add('visible');
        asideButtonMenu.focus() //accesibilidad web
    }
    (showMenuNav) ? asideMainMenu.style.display = 'flex' : asideMainMenu.style.display = 'none';
}

productsButton.addEventListener('click', ()=> {
    openAside()
});
headerMenuLabel.addEventListener('click', ()=> {
    openAside(true)
});
asideButtonMenu.addEventListener('click', ()=> {
    openAside()
});
asideButtonMenu.addEventListener('focus', ()=> {
    aside.classList.add('visible');
    asideButtonMenu.focus()
});
themeButton.addEventListener('click', ()=> {
    updateTheme(themeButton, mainContainer)
})
asideThemeButton.addEventListener('click', ()=> {
    updateTheme(asideThemeButton, mainContainer)
})
note.addEventListener('click', ()=> {
    note.style.backgroundColor = '#9711118f' //sutíl interaccion con la nota
})
/* evento para la tecla de escape para accesibilidad web*/
document.addEventListener('keydown', event=> {
    if(event.key === 'Escape') {
        openAside()
    }
})
// Inicializar botones de favoritos
document.addEventListener('DOMContentLoaded', () => {
    initializeFavoriteButtons();
    updateFavoritesCounter();
});
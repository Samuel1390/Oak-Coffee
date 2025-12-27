
import { 
    gridList, 
    loadTheme, 
    saveTheme, 
    Item, 
    Coffee, 
    updateTheme, 
    displayGrid, 
    renderThemeButton, 
    applyTheme,
    createFavoritesGrid
} from "./okc-menu.objects.js";

// Importar el gestor de favoritos
import {
    setupFavoriteButton,
    updateFavoritesCounter,
    initializeFavoriteButtons
} from './favorites-manager.js';

/* REFERENCIAS A NODOS DEL DOM */
const headerNav = document.querySelector('.header-nav')
const aside = document.getElementById('aside-menu');
const asideButtonMenu = document.getElementById('aside-menu-button');
const productsButton = document.getElementById('products-button');
const main = document.getElementById('main');
const headerMenuLabel = document.getElementById('checkbox-menu-label');
const asideMainMenu = document.getElementById('aside-nav-menu');
const body = document.body

const cardCloser = document.getElementById('card-closer')
const cardShadow = document.getElementById('okc-menu-card')

const asideNavContainer = document.getElementById('aside-nav-container');
const asideNavChildNodes = document.querySelectorAll('button.aside-nav-item')
renderThemeButton(headerNav)
renderThemeButton(asideMainMenu, true)
const themeButton = document.querySelector('.theme-button')
const asideThemeButton = document.querySelector('.aside-theme-button')
applyTheme(body)
asideThemeButton.style.color = '#fcd596'

/* FUNCIONES */
function getQueryParam(param) {
    // funcion que identidica si el usuario hizo clic en alguna de las secciones de productos
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function openAside(showMenuNav= false) {
    if (aside.classList.contains('visible')) {
        aside.classList.remove('visible');
    } else {
        aside.classList.add('visible');
        asideButtonMenu.focus() //accesibilidad web
    }
    (showMenuNav) ? asideMainMenu.style.display = 'flex' : asideMainMenu.style.display = 'none';
}

function expandMain() {
    if (aside.classList.contains('visible')) {
        console.log('visible')
        main.style.width = 'calc(100vw - 300px)';
    } else {
        main.style.width = '100vw';
    }
}

const sectionSelected = getQueryParam('section')

/* ---------------ADD EVENT LISTENERS-------------------- */

asideButtonMenu.addEventListener('click', event=> {
    openAside()
    expandMain();
});

headerMenuLabel.addEventListener('click', event=> {
    openAside(true)
});

window.addEventListener('resize', event=> {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 700) {
        openAside();
    }
});

productsButton.addEventListener('click', event=> {
    openAside()
    expandMain()
})

// Modificar el event listener para usar setupFavoriteButton
asideNavContainer.addEventListener('click', event=> {
    if (event.target.tagName === 'SPAN') {
        const button = event.target.parentNode;
        displayGrid(button, asideNavChildNodes, setupFavoriteButton);
        
        // Si es la sección de favoritos, inicializar botones después de un breve retraso
        if (button.getAttribute('sectionId') == 6) {
            setTimeout(() => {
                initializeFavoriteButtons();
            }, 100);
        }
    } else if (event.tagName === 'DIV'){
        return
    } else if (event.target.tagName === 'BUTTON'){
        const button = event.target;
        displayGrid(button, asideNavChildNodes, setupFavoriteButton);
        // Si es la sección de favoritos, inicializar botones después de un breve retraso
        if (button.getAttribute('sectionId') == 6) {
            setTimeout(() => {
                initializeFavoriteButtons();
            }, 100);
        }
    }
})

// Inicializar con la sección seleccionada o la primera
if (sectionSelected) {
    asideNavChildNodes.forEach(node => {
        node.classList.remove('section-selected');
    });

    // botón especifico seleccionado
    const targetButton = document.querySelector(`button.aside-nav-item[sectionId="${sectionSelected}"]`);

    if (targetButton) { //añade la clase para resaltar el boton
        targetButton.classList.add('section-selected');
    }
    
    if (sectionSelected == 6) {
        // Si es la sección de favoritos, crear grid dinámico
        createFavoritesGrid(setupFavoriteButton);
        asideNavChildNodes[sectionSelected-1].classList.add('section-selected');
    } else {
        // Para otras secciones, usar las listas normales con setupFavoriteButton
        const grid = gridList[sectionSelected-1];
        if (grid && grid.createGrid) {
            grid.createGrid(setupFavoriteButton);
        }
        asideNavChildNodes[sectionSelected-1].classList.add('section-selected');
    }
} else {
    // en caso de que el usuario no haya elejido ninguna de las secciones
    const hotCoffeeButton = document.querySelector('button.aside-nav-item[sectionId="1"]');
    hotCoffeeButton.classList.add('section-selected')
    gridList[0].createGrid(setupFavoriteButton);
}

themeButton.addEventListener('click', event=> {
    updateTheme(themeButton, body)
})

asideThemeButton.addEventListener('click', ()=> {
    updateTheme(asideThemeButton, body)
})

// cierra la ventana de carta con el botón
cardCloser.addEventListener('click', () => {
    cardShadow.style.display = 'none'
})
// cierra la ventana de carta al clickear en cualquier sitio que no sea la propia carta
cardShadow.addEventListener('click', event=> {
    if (event.target.id === cardShadow.id || event.target.id === cardShadow.firstElementChild.id) {
        cardShadow.style.display = 'none'
    }
})
// accesibilidad web
asideButtonMenu.addEventListener('focus', ()=> {
    aside.classList.add('visible');
    asideButtonMenu.focus()
});
/* evento para la tecla de escape para accesibilidad web*/
document.addEventListener('keydown', event=> {
    if(event.key === 'Escape') {
        if (cardShadow.style.display === 'flex') {
            cardShadow.style.display = 'none'
            return
        }
        openAside()
    }
});
// Inicializar botones de favoritos cuando la página se carga completamente
document.addEventListener('DOMContentLoaded', () => {
    initializeFavoriteButtons();
    updateFavoritesCounter();
});

// Escuchar cambios en favoritos para actualizar la sección si está activa
window.addEventListener('favoritesUpdated', () => {
    const currentSectionButton = document.querySelector('.aside-nav-item.section-selected');
    // Si el usuario está en la sección de favoritos (ID 6), refresca el grid pasando la funcion
    if (currentSectionButton && currentSectionButton.getAttribute('sectionId') == 6) {
        createFavoritesGrid(setupFavoriteButton);
    }
});
const okcMainCardId = 'okc-main-card'
const okcMenuCardId = 'okc-menu-card'


import {
    mostPopularCoffeesList,
    renderThemeButton,
    updateTheme,
    applyTheme, 
    mostPopularDessertList,
} from './okc-menu.objects.js';

// Importar el gestor de favoritos
import {
    setupFavoriteButton,
    updateFavoritesCounter,
    initializeFavoriteButtons,
    toggleFavorite,
    isFavorite
} from './favorites-manager.js';

const headerNav = document.querySelector('.header-nav')
const asideNavContainer = document.getElementById('aside-nav-container');

const mainContainer = document.querySelector('.main-container')
const MostPopularCoffesSectionContainer = document.getElementById('products-container');
const dessertContainer = document.getElementById('dessert-container');
const asideMenuContainer = document.querySelector('.aside-menu-container')
const aside = document.getElementById('aside-menu');
const asideButtonMenu = document.getElementById('aside-menu-button');
const productsButton = document.getElementById('products-button');
const viewMoreButton = document.getElementById('view-more-button');
const viewMoreButtonDessert = document.getElementById('view-more-button-dessert');
const viewProductsButtonDessert = document.getElementById('view-products-dessert');

const cardCloser = document.getElementById('card-closer')
const cardShadow = document.getElementById('okc-main-card')


const viewProductsButton = document.getElementById('view-products-button');
const headerMenuLabel = document.getElementById('checkbox-menu-label');
const asideMainMenu = document.getElementById('aside-nav-menu');
const asideMainMenuTittle = document.getElementById('aside-secction-h2-menu-tittle');
const asideNavChildNodes = document.querySelectorAll('.aside-nav-item')
const note = document.querySelector('.note')


let openMostPopularCoffesSection = false;
let openDessertSection = false;
renderThemeButton(headerNav)
renderThemeButton(asideMainMenu, true)
const themeButton = document.querySelector('.theme-button')
const asideThemeButton = document.querySelector('.aside-theme-button')
asideThemeButton.style.color = '#fcd596'
applyTheme(mainContainer)


// Función modificada para incluir funcionalidad de favoritos
function createProducts(productsList, containerId, productType = 'coffee', productCategory = 'hot') {
    const container = document.getElementById(containerId);

    container.innerHTML = '';

    productsList.forEach((product, index) => { 
        
        const productContainer = document.createElement('div');
        const productImgContainer = document.createElement('div');
        const productTextContainer = document.createElement('div');
        const productFilter = document.createElement('div');
        const productH3 = document.createElement('h3');
        const productH4 = document.createElement('h4');
        const productHSpan = document.createElement('span');
        let productFavButton = document.createElement('button');
        
        productFavButton.className = 'material-symbols-outlined product-fav-btn';
        productFavButton.innerText = 'favorite';
        productFavButton.title = 'añadir a favoritos';
        productH3.textContent = product.name;
        productH4.textContent = 'precio: ';
        productHSpan.textContent = `$${product.price}`;
        productImgContainer.style.backgroundImage = `url(${product.source})`;
        
        productH4.appendChild(productHSpan);
        productFilter.appendChild(productFavButton)
        productTextContainer.append(productH3, productH4);
        productImgContainer.appendChild(productFilter);
        productContainer.appendChild(productImgContainer);
        productContainer.appendChild(productTextContainer);
        container.appendChild(productContainer);

        productFilter.className = 'product-filter';
        productImgContainer.className = 'product-img-container';
        productContainer.tabIndex = 0
        productContainer.ariaLabel = product.name
        productContainer.className = 'product-container';
        if (containerId.includes('dessert')) {
            productContainer.classList.add('dessert-product-container')
        }
        productTextContainer.className = 'product-text-container';
        productContainer.addEventListener('click', event=> {
                if (event.target.tagName !== 'SPAN') {
                    if (window.location.href.includes('okc-menu')) {
                        product.renderCardItem(okcMenuCardId)
                        return
                    }
                    product.renderCardItem(okcMainCardId)
                }
            });
        productContainer.addEventListener('keydown', event=> {
            if (event.key === 'Enter') {
                productContainer.click()
            }
        })
        // Configurar botón de favoritos
        setupFavoriteButton(productFavButton, product, productType, productCategory);
        
        setTimeout(() => {
            productContainer.style.animationDelay = `${(index % 9) * 0.1}s`;
        }, 10);
    });
}

function openMostPopularCoffeesSection() {
    if (!openMostPopularCoffesSection) {
        createProducts(mostPopularCoffeesList.slice(0, 9), 'products-container', 'coffee', 'hot');
        viewMoreButton.textContent = 'ver menos';
        openMostPopularCoffesSection = true;
        return;
    } else {
        createProducts(mostPopularCoffeesList.slice(0, 3), 'products-container', 'coffee', 'hot');
        viewMoreButton.textContent = 'ver más';
        openMostPopularCoffesSection = false;
        return;
    }

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

// Crear productos con funcionalidad de favoritos
createProducts(mostPopularCoffeesList.slice(0,3), 'products-container', 'coffee', 'hot');
createProducts(mostPopularDessertList.slice(0,3), 'dessert-container', 'dessert', 'dessert');

// Actualizar contador de favoritos
updateFavoritesCounter();

// Event Listeners
productsButton.addEventListener('click', ()=> {
    openAside()
});
headerMenuLabel.addEventListener('click', ()=> {
    openAside(true)
});
asideButtonMenu.addEventListener('click', ()=> {
    openAside()
});
// accesibilidad web
asideButtonMenu.addEventListener('focus', ()=> {
    aside.classList.add('visible');
    asideButtonMenu.focus()
});
viewProductsButton.addEventListener('click', () => {
    openAside();
});
viewProductsButtonDessert.addEventListener('click', event=> {
    openAside()
});

viewMoreButton.addEventListener('click', event=> {
    openMostPopularCoffeesSection()
});
viewMoreButtonDessert.addEventListener('click', event=> {
    if (!openDessertSection) {
        createProducts(mostPopularDessertList.slice(0, 9), 'dessert-container', 'dessert', 'dessert');
        viewMoreButtonDessert.textContent = 'Ver menos';
        openDessertSection = true;
        return;
    } else {
        createProducts(mostPopularDessertList.slice(0, 3), 'dessert-container', 'dessert', 'dessert');
        viewMoreButtonDessert.textContent = 'Ver más';
        openDessertSection = false;
        return;
    }
});

themeButton.addEventListener('click', ()=> {
    updateTheme(themeButton, mainContainer)
})
asideThemeButton.addEventListener('click', ()=> {
    updateTheme(asideThemeButton, mainContainer)
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
note.addEventListener('click', ()=> {
    note.style.backgroundColor = '#9711118f' //sutíl interaccion con la nota
})
/* evento para la tecla de escape para accesibilidad web*/
document.addEventListener('keydown', event=> {
    if(event.key === 'Escape') {
        if (cardShadow.style.display === 'flex') {
            cardShadow.style.display = 'none'
            return
        }
        openAside()
    }
})
// Inicializar botones de favoritos cuando la página se carga completamente
document.addEventListener('DOMContentLoaded', () => {
    initializeFavoriteButtons();
});